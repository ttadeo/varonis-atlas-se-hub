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

// Fetch all resources associated with a given project
async function fetchProjectResources(projectId: string, customerId: string, token: string) {
  const res = await fetch(
    `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources`,
    { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(20000) }
  );
  if (!res.ok) throw new Error(`Atlas resources fetch failed (${res.status})`);
  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all: any[] = Array.isArray(data) ? data : (data.resources ?? data.items ?? []);
  return all.filter((r) => getProjectIds(r).includes(projectId));
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
    const matching = await fetchProjectResources(projectId, customerId, token);

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

    const toDelete = await fetchProjectResources(projectId, customerId, token);

    const results = { deleted: [] as string[], failed: [] as string[] };

    // For each resource, remove this project from its project_ids list via PATCH.
    // The batch projects_to_unassign endpoint returns 200 but silently fails for shared
    // resources — PATCHing project_ids directly is the reliable approach.
    for (const r of toDelete) {
      const id = getResourceId(r);
      const name = getResourceName(r);
      if (!id) {
        results.failed.push(`${name}: no resource_instance_id`);
        continue;
      }

      const currentProjects: string[] = getProjectIds(r);
      const updatedProjects = currentProjects.filter((pid) => pid !== projectId);

      try {
        const patchRes = await fetch(
          `${ATLAS_API_URL}/v1/inventory/resource/${id}`,
          {
            method: "PATCH",
            headers,
            body: JSON.stringify({ project_ids: updatedProjects }),
            signal: AbortSignal.timeout(10000),
          }
        );
        if (patchRes.ok) {
          results.deleted.push(name);
        } else {
          const errBody = await patchRes.text();
          // Fallback: batch projects_to_unassign
          try {
            const fallbackRes = await fetch(
              `${ATLAS_API_URL}/v1/inventory/resources/projects`,
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  resource_projects: [{ resource_instance_id: id, projects_to_unassign: [projectId] }],
                }),
                signal: AbortSignal.timeout(10000),
              }
            );
            if (fallbackRes.ok) {
              results.deleted.push(name);
            } else {
              results.failed.push(
                `${name}: PATCH ${patchRes.status} (${errBody.slice(0, 80)}), fallback also failed (${fallbackRes.status})`
              );
            }
          } catch (fe) {
            results.failed.push(`${name}: PATCH ${patchRes.status}, fallback error: ${String(fe)}`);
          }
        }
      } catch (e) {
        results.failed.push(`${name}: ${String(e)}`);
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
