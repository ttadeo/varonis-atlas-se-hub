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

// Display names created by our scenario provisioning — used to identify resources to clean up
const SCENARIO_RESOURCE_NAMES = new Set([
  // PII & PHI
  "OpenAI GPT-4o (Clinical Summarizer)",
  "facebook/bart-large-cnn",
  // Executive AI Governance
  "Anthropic Claude Sonnet (Governance Analyst)",
  "Azure OpenAI GPT-4 (Executive Reports)",
  // Shadow AI Monitor
  "OpenAI GPT-4o (Shadow Coding Assistant)",
  "sentence-transformers/all-MiniLM-L6-v2",
  // Shared across scenarios (only delete if in project scope)
  "LangChain",
  "OpenAI",
  "Anthropic",
  "Transformers",
  "ChromaDB",
  "Sentence Transformers",
  "HuggingFace Hub",
  // Legacy scenario names
  "OpenAI GPT-4o (Clinical Summarizer)",
  "Anthropic Claude 3 Opus (Risk Analyzer)",
  "Azure OpenAI GPT-4 Turbo (Recommendations)",
  "ProsusAI/finbert",
  "sentence-transformers/all-MiniLM-L6-v2",
]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getResourceId(r: any): string {
  return r.resource_instance_id ?? r.id ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getResourceName(r: any): string {
  return r.resource_display_name ?? r.display_name ?? r.name ?? "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getProjectIds(r: any): string[] {
  if (Array.isArray(r.project_ids)) return r.project_ids;
  if (r.project_id) return [r.project_id];
  return [];
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");
  if (!projectId) return NextResponse.json({ error: "project_id required" }, { status: 400 });

  const customerId = process.env.ATLAS_CUSTOMER_ID ?? "";

  try {
    const token = await getAtlasJWT();
    const headers = { Authorization: `Bearer ${token}` };

    const res = await fetch(
      `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources`,
      { headers, signal: AbortSignal.timeout(20000) }
    );
    if (!res.ok) throw new Error(`Atlas resources fetch failed (${res.status})`);
    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: any[] = Array.isArray(data) ? data : (data.resources ?? data.items ?? []);

    const matching = all.filter((r) => {
      const name = getResourceName(r);
      const projects = getProjectIds(r);
      return projects.includes(projectId) && SCENARIO_RESOURCE_NAMES.has(name);
    });

    return NextResponse.json({
      count: matching.length,
      resources: matching.map((r) => ({
        id: getResourceId(r),
        name: getResourceName(r),
        type: r.resource_type ?? "",
      })),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("project_id");
  if (!projectId) return NextResponse.json({ error: "project_id required" }, { status: 400 });

  const customerId = process.env.ATLAS_CUSTOMER_ID ?? "";

  try {
    const token = await getAtlasJWT();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // Fetch all resources
    const res = await fetch(
      `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources`,
      { headers, signal: AbortSignal.timeout(20000) }
    );
    if (!res.ok) throw new Error(`Atlas resources fetch failed (${res.status})`);
    const data = await res.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: any[] = Array.isArray(data) ? data : (data.resources ?? data.items ?? []);

    const toDelete = all.filter((r) => {
      const name = getResourceName(r);
      const projects = getProjectIds(r);
      return projects.includes(projectId) && SCENARIO_RESOURCE_NAMES.has(name);
    });

    const results = { deleted: [] as string[], failed: [] as string[] };

    // Unlink all matching resources from the project in one batch call
    // This is safe — resources shared with other projects stay intact there
    const resourceProjects = toDelete
      .map((r) => getResourceId(r))
      .filter(Boolean)
      .map((id) => ({
        resource_instance_id: id,
        projects_to_unassign: [projectId],
      }));

    if (resourceProjects.length > 0) {
      try {
        const unlinkRes = await fetch(
          `${ATLAS_API_URL}/v1/inventory/resources/projects`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify({ resource_projects: resourceProjects }),
            signal: AbortSignal.timeout(20000),
          }
        );
        if (unlinkRes.ok) {
          results.deleted.push(...toDelete.map((r) => getResourceName(r)));
        } else {
          const errBody = await unlinkRes.text();
          results.failed.push(`Batch unlink failed (${unlinkRes.status}): ${errBody.slice(0, 200)}`);
        }
      } catch (e) {
        results.failed.push(`Batch unlink error: ${String(e)}`);
      }
    }

    return NextResponse.json({
      deleted_count: results.deleted.length,
      failed_count: results.failed.length,
      deleted: results.deleted,
      failed: results.failed,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
