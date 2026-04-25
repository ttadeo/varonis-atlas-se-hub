import { NextRequest, NextResponse } from "next/server";

const N8N_LEARN_URL =
  process.env.N8N_WEBHOOK_URL ??
  "https://ttadeo.app.n8n.cloud/webhook/atlas-rag-query";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const upstream = await fetch(N8N_LEARN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-atlas-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
    },
    body: JSON.stringify(body),
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
