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
        orgs.push({
          id: String(org.id ?? org.org_id ?? ""),
          name: String(org.name ?? org.org_name ?? "Unnamed Org"),
          projects,
        });
      }
    }

    return NextResponse.json({ orgs });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
