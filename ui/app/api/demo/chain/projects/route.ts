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
    return NextResponse.json({ error: "ATLAS_API_KEY not configured" }, { status: 503 });
  }

  const customerId = process.env.ATLAS_CUSTOMER_ID ?? "";

  try {
    const token = await getAtlasJWT();
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
