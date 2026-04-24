import { NextRequest, NextResponse } from "next/server";

const N8N_DISCOVER_URL =
  process.env.N8N_DEMO_DISCOVER_URL ??
  "https://ttadeo.app.n8n.cloud/webhook/atlas-demo-provisioning";

export async function POST(req: NextRequest) {
  const { use_case, industry, meeting_type } = await req.json();

  if (!use_case?.trim()) {
    return NextResponse.json({ error: "use_case is required" }, { status: 400 });
  }

  const upstream = await fetch(N8N_DISCOVER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ use_case, industry, meeting_type }),
  });

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "Upstream workflow error", detail: data },
      { status: 502 }
    );
  }

  return NextResponse.json(data);
}
