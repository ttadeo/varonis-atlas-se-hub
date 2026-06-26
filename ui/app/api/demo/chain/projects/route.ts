import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const ATLAS_API_URL = "https://api.prod.alltrue-be.com";

function resolveApiKey(req: NextRequest): string {
  const headerKey = req.headers.get("x-atlas-api-key");
  if (headerKey) return headerKey;
  const envKey = process.env.ATLAS_API_KEY;
  if (envKey) return envKey;
  throw new Error("No Atlas API key available");
}

async function getAtlasJWT(apiKey: string): Promise<string> {
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

// Decode JWT payload (no verification needed — we just got it from Atlas)
function extractCustomerId(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.customer_id ?? payload.customerId ?? payload.customer ?? "";
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const apiKey = resolveApiKey(req);
    const token = await getAtlasJWT(apiKey);

    const customerId = process.env.ATLAS_CUSTOMER_ID || extractCustomerId(token);
    if (!customerId) throw new Error("Could not determine customer ID from API key");

    // Fetch projects and users in parallel — users needed to resolve owner_auth0_id → email
    const [projectsRes, usersRes] = await Promise.all([
      fetch(
        `${ATLAS_API_URL}/v1/admin/customers/${customerId}/organizations/projects`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        }
      ),
      fetch(
        `${ATLAS_API_URL}/v1/admin/auth0-customer/${customerId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(10000),
        }
      ),
    ]);

    if (!projectsRes.ok) {
      const body = await projectsRes.text();
      return NextResponse.json({ error: `Atlas projects returned ${projectsRes.status}`, detail: body }, { status: 502 });
    }

    const projectsData = await projectsRes.json();

    // Build auth0_user_id → email map (non-fatal if users call fails)
    const auth0ToEmail: Record<string, string> = {};
    if (usersRes.ok) {
      try {
        const users = await usersRes.json();
        if (Array.isArray(users)) {
          for (const u of users) {
            if (u.user_id && u.email) auth0ToEmail[u.user_id] = u.email;
          }
        }
      } catch {
        // Non-fatal — owner_email will be null on all projects
      }
    }

    // Walk the organizations/projects structure and inject owner_email
    const enriched = injectOwnerEmails(projectsData, auth0ToEmail);

    return NextResponse.json(enriched);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// Inject owner_email into every project object, preserving the original response shape
function injectOwnerEmails(
  data: unknown,
  auth0ToEmail: Record<string, string>
): unknown {
  if (!data || typeof data !== "object") return data;

  const resolveEmail = (ownerAuth0Id: unknown): string | null =>
    typeof ownerAuth0Id === "string" ? (auth0ToEmail[ownerAuth0Id] ?? null) : null;

  // Shape: { organizations: [ { ..., projects: [...] } ] }
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.organizations)) {
    return {
      ...obj,
      organizations: obj.organizations.map((org: unknown) => {
        const o = org as Record<string, unknown>;
        return {
          ...o,
          projects: Array.isArray(o.projects)
            ? o.projects.map((p: unknown) => {
                const proj = p as Record<string, unknown>;
                return { ...proj, owner_email: resolveEmail(proj.owner_auth0_id) };
              })
            : o.projects,
        };
      }),
    };
  }

  // Shape: flat array of projects
  if (Array.isArray(data)) {
    return (data as Record<string, unknown>[]).map((p) => ({
      ...p,
      owner_email: resolveEmail(p.owner_auth0_id),
    }));
  }

  return data;
}
