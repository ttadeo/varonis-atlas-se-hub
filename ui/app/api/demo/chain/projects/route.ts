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

    // Prefer env var customer ID; fall back to JWT claim (for SE-provided keys)
    const customerId = process.env.ATLAS_CUSTOMER_ID || extractCustomerId(token);
    if (!customerId) throw new Error("Could not determine customer ID from API key");

    const res = await fetch(
      `${ATLAS_API_URL}/v1/admin/customers/${customerId}/organizations/projects`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Atlas projects returned ${res.status}`, detail: body }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
