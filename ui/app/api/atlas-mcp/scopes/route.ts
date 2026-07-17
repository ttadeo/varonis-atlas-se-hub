import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAtlasJWT, atlasGet } from "@/lib/atlas-api";

export interface OrgScope {
  id: string;
  name: string;
  projects: { id: string; name: string }[];
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const customerId = process.env.ATLAS_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: "ATLAS_CUSTOMER_ID not configured" }, { status: 503 });
  }

  try {
    const token = await getAtlasJWT();
    const data = await atlasGet<unknown>(
      `/v1/admin/customers/${customerId}/organizations/projects`,
      token
    );

    const obj = data as Record<string, unknown>;
    const orgs: OrgScope[] = [];

    if (Array.isArray(obj.organizations)) {
      for (const org of obj.organizations as Record<string, unknown>[]) {
        const projects: { id: string; name: string }[] = [];
        if (Array.isArray(org.projects)) {
          for (const p of org.projects as Record<string, unknown>[]) {
            projects.push({
              id: String(p.id ?? p.project_id ?? ""),
              name: String(p.name ?? p.project_name ?? "unnamed"),
            });
          }
        }
        // Try every known Atlas API field name for org name, then fall back to
        // the first project's org_name (projects reliably carry their parent org name)
        const firstProject = (org.projects as Record<string, unknown>[] | undefined)?.[0];
        const orgName =
          org.name ??
          org.org_name ??
          org.organization_name ??
          org.display_name ??
          org.org_display_name ??
          org.title ??
          firstProject?.org_name ??
          firstProject?.organization_name ??
          null;

        orgs.push({
          id: String(org.id ?? org.org_id ?? ""),
          name: orgName ? String(orgName) : `Org ${orgs.length + 1}`,
          projects,
        });
      }
    }

    return NextResponse.json({ orgs });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
