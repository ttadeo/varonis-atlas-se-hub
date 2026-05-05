import { NextResponse } from "next/server";

const ATLAS_API_URL = "https://api.prod.alltrue-be.com";

async function getAtlasJWT(): Promise<string> {
  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) throw new Error("ATLAS_API_KEY not configured");

  // Custom integration key auth — X-API-Key header to global endpoint
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
    const projectParam = projectId ? `&project=${projectId}` : "";
    const [resourcesRes, graphsRes] = await Promise.all([
      fetch(
        `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources?per_page=200&page=1${projectParam}`,
        { headers, signal: timeout }
      ),
      fetch(
        `${ATLAS_API_URL}/v1/inventory/resources/dependency-graph?per_page=50&page=1${projectId ? `&project_id=${projectId}` : ""}`,
        { headers, signal: timeout }
      ),
    ]);

    const resources = resourcesRes.ok ? await resourcesRes.json() : null;
    const graphs = graphsRes.ok ? await graphsRes.json() : null;

    if (!resources) {
      const body = await resourcesRes.text();
      return NextResponse.json(
        { error: `Atlas inventory returned ${resourcesRes.status}`, detail: body },
        { status: 502 }
      );
    }

    return NextResponse.json({ resources, dependency_graphs: graphs, project_id: projectId });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
