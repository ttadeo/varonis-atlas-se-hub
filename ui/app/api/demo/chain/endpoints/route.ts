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

// GET /api/demo/chain/endpoints
// Returns all endpoint identifiers visible to the Atlas API key.
// LLM endpoints live at the org level, not the project level — all endpoints
// returned here belong to the same Atlas account as the API key.
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const token = await getAtlasJWT();
    const headers = { Authorization: `Bearer ${token}` };
    const PAGE_SIZE = 100;
    const all: Record<string, unknown>[] = [];

    // Paginate through all endpoint settings (max 100 per page)
    let offset = 0;
    while (true) {
      const res = await fetch(
        `${ATLAS_API_URL}/v1/llm-firewall/all-endpoint-settings?limit=${PAGE_SIZE}&offset=${offset}`,
        { headers, signal: AbortSignal.timeout(15000) }
      );
      if (!res.ok) {
        const body = await res.text();
        return NextResponse.json({ error: `Atlas returned ${res.status}`, detail: body }, { status: 502 });
      }
      const page = await res.json();
      if (!Array.isArray(page) || page.length === 0) break;
      all.push(...page);
      if (page.length < PAGE_SIZE) break; // last page
      offset += PAGE_SIZE;
    }

    // Return all endpoint identifiers — all belong to the same Atlas account
    const identifiers: string[] = [];
    for (const ep of all) {
      if (ep.endpoint_identifier) {
        identifiers.push(ep.endpoint_identifier as string);
      }
    }

    return NextResponse.json({ identifiers });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
