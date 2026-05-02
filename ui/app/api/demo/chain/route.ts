import { NextResponse } from "next/server";

const ATLAS_API_URL = "https://api.prod.alltrue-be.com";

async function getAtlasJWT(): Promise<string> {
  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) throw new Error("ATLAS_API_KEY not configured");

  const res = await fetch(`${ATLAS_API_URL}/v1/auth/issue-jwt-token`, {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Atlas auth failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

export async function GET() {
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json(
      {
        error:
          "ATLAS_API_KEY not configured. Add it as a Vercel environment variable.",
      },
      { status: 503 }
    );
  }

  const customerId = process.env.ATLAS_CUSTOMER_ID ?? "";
  const projectId = process.env.ATLAS_PROJECT_ID ?? "";

  try {
    const token = await getAtlasJWT();

    const headers = { Authorization: `Bearer ${token}` };
    const timeout = AbortSignal.timeout(15000);

    // Fetch resources list and dependency graphs in parallel
    const [resourcesRes, graphsRes] = await Promise.all([
      fetch(
        `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources${projectId ? `?project=${projectId}` : ""}`,
        { headers, signal: timeout }
      ),
      fetch(
        `${ATLAS_API_URL}/v1/inventory/resources/dependency-graph?${projectId ? `project_id=${projectId}&` : ""}per_page=50&page=1`,
        { headers, signal: timeout }
      ),
    ]);

    const resources = resourcesRes.ok ? await resourcesRes.json() : null;
    const graphs = graphsRes.ok ? await graphsRes.json() : null;

    if (!resources && !graphs) {
      return NextResponse.json(
        { error: `Atlas API returned errors: resources=${resourcesRes.status} graphs=${graphsRes.status}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ resources, dependency_graphs: graphs, project_id: projectId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
