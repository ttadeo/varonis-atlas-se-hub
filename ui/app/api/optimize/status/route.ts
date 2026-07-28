import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const KV_URL   = process.env.KV_REST_API_URL!;
const KV_TOKEN = process.env.KV_REST_API_TOKEN!;

async function kvGet(key: string) {
  const r = await fetch(`${KV_URL}/get/${key}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
    next: { revalidate: 0 },
  });
  const data = await r.json();
  return data.result ?? null;
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const [progressRaw, resultRaw, requestRaw] = await Promise.all([
    kvGet("rag:optimize_progress"),
    kvGet("rag:optimize_result"),
    kvGet("rag:optimize_request"),
  ]);

  return NextResponse.json({
    progress: progressRaw ? JSON.parse(progressRaw) : null,
    result:   resultRaw   ? JSON.parse(resultRaw)   : null,
    pending:  !!requestRaw,
  });
}
