import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const KV_URL   = process.env.KV_REST_API_URL!;
const KV_TOKEN = process.env.KV_REST_API_TOKEN!;

const ALLOWED_EMAIL = "ttadeo@varonis.com";

async function kvGet(key: string) {
  const r = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await r.json();
  return data.result ?? null;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  if (auth.email !== ALLOWED_EMAIL) {
    return NextResponse.json(
      { error: "Only ttadeo@varonis.com can trigger RAG optimization." },
      { status: 403 }
    );
  }

  // Block if already running
  const existingProgress = await kvGet("rag:optimize_progress");
  if (existingProgress) {
    const progress = JSON.parse(existingProgress);
    if (progress.status === "running") {
      return NextResponse.json(
        { error: "An optimization run is already in progress.", progress },
        { status: 409 }
      );
    }
  }

  // Write trigger + clear stale state
  const request = JSON.stringify({
    requested_by: auth.email,
    requested_at: new Date().toISOString(),
  });

  await fetch(`${KV_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["SET", "rag:optimize_request", request],
      ["DEL", "rag:optimize_progress"],
      ["DEL", "rag:optimize_result"],
    ]),
  });

  return NextResponse.json({
    status: "triggered",
    message:
      "Optimization requested. Run: python evals/optimize_rag_prompt.py --watch",
  });
}
