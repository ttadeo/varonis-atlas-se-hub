import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const webhookUrl = process.env.N8N_MCP_QUARANTINE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: "N8N_MCP_QUARANTINE_WEBHOOK_URL is not configured" }, { status: 503 });
  }

  const body = await req.json().catch(() => ({}));
  const task: string = (body.task ?? "").trim();
  const projectId: string = (body.projectId ?? "").trim();
  const endpointId: string = (body.endpointId ?? "").trim();
  const quarantineEnabled: boolean = body.quarantineEnabled ?? true;

  if (!task) return NextResponse.json({ error: "task is required" }, { status: 400 });
  if (!endpointId) return NextResponse.json({ error: "endpointId is required" }, { status: 400 });

  const jobId = randomUUID();

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, jobId, projectId, endpointId, quarantineEnabled }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json({ error: `n8n error (${res.status})`, detail }, { status: 502 });
    }

    return NextResponse.json({ jobId, status: "pending" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
