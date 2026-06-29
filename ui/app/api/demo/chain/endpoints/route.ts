import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const ATLAS_API_URL = "https://api.prod.alltrue-be.com";

async function getAtlasJWT(): Promise<string> {
  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) throw new Error("ATLAS_API_KEY not configured");
  const res = await fetch(`${ATLAS_API_URL}/v1/auth/issue-jwt-token`, {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Atlas auth failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

// GET /api/demo/chain/endpoints?project_id=xxx
// Returns endpoint identifiers registered to the given Atlas project
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const projectId = req.nextUrl.searchParams.get("project_id");
  if (!projectId) {
    return NextResponse.json({ error: "project_id required" }, { status: 400 });
  }

  try {
    const token = await getAtlasJWT();

    const res = await fetch(`${ATLAS_API_URL}/v1/llm-firewall/all-endpoint-settings?limit=500&offset=0`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Atlas returned ${res.status}`, detail: body }, { status: 502 });
    }

    const all = await res.json();

    // Filter to this project and extract non-null identifiers
    const identifiers: string[] = [];
    if (Array.isArray(all)) {
      for (const ep of all) {
        if (ep.project_id === projectId && ep.endpoint_identifier) {
          identifiers.push(ep.endpoint_identifier);
        }
      }
    }

    // Debug: show all unique project_ids in the response and any matching records
    const allProjectIds = Array.isArray(all) ? [...new Set(all.map((ep: Record<string, string>) => ep.project_id))] : [];
    const matches = Array.isArray(all) ? all.filter((ep: Record<string, string>) => ep.project_id === projectId) : [];

    return NextResponse.json({ identifiers, _debug: { total: Array.isArray(all) ? all.length : 0, project_ids_in_response: allProjectIds, matches_for_requested_project: matches.map((ep: Record<string, string>) => ({ project_id: ep.project_id, endpoint_identifier: ep.endpoint_identifier })) } });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
