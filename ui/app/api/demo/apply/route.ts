import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const N8N_APPLY_URL =
  process.env.N8N_DEMO_APPLY_URL ??
  "https://ttadeo.app.n8n.cloud/webhook/atlas-demo-apply";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();

  // selection_type: "existing" | "custom"
  if (!body.selection_type) {
    return NextResponse.json({ error: "selection_type is required" }, { status: 400 });
  }

  const upstream = await fetch(N8N_APPLY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-atlas-secret": process.env.N8N_WEBHOOK_SECRET ?? "",
    },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // n8n returned non-JSON
  }

  if (!upstream.ok) {
    // 404 = template not found — pass through n8n's clean error message
    if (upstream.status === 404 && data && typeof data === "object") {
      return NextResponse.json(data, { status: 404 });
    }
    return NextResponse.json(
      { error: "Upstream workflow error", detail: data ?? text },
      { status: 502 }
    );
  }

  // n8n Apply workflow may return empty body on success
  return NextResponse.json(data ?? { success: true, message: "Template applied successfully." });
}
