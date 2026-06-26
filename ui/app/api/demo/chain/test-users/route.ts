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

function extractCustomerId(token: string): string {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.customer_id ?? payload.customerId ?? payload.customer ?? "";
  } catch { return ""; }
}

// GET /api/demo/chain/test-users
// Temporary diagnostic — returns raw Atlas users list and current-user to inspect schema
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const token = await getAtlasJWT();
    const customerId = process.env.ATLAS_CUSTOMER_ID || extractCustomerId(token);
    if (!customerId) throw new Error("Could not determine customer ID");

    const headers = { Authorization: `Bearer ${token}` };

    const [usersRes, currentUserRes] = await Promise.all([
      fetch(`${ATLAS_API_URL}/v1/admin/auth0-customer/${customerId}/users`, {
        headers,
        signal: AbortSignal.timeout(10000),
      }),
      fetch(`${ATLAS_API_URL}/v1/admin/current-user`, {
        headers,
        signal: AbortSignal.timeout(10000),
      }),
    ]);

    return NextResponse.json({
      users: {
        status: usersRes.status,
        body: usersRes.ok ? await usersRes.json() : await usersRes.text(),
      },
      current_user: {
        status: currentUserRes.status,
        body: currentUserRes.ok ? await currentUserRes.json() : await currentUserRes.text(),
      },
      customer_id: customerId,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
