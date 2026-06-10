import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const KV_URL   = process.env.KV_REST_API_URL ?? "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? "";

async function kvGet(key: string): Promise<string | null> {
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.result ?? null;
}

// GET /api/guides/status?jobId=xxx
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }

  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId required" }, { status: 400 });
  }

  const value = await kvGet(`guide:${jobId}`);
  if (!value) {
    return NextResponse.json({ status: "pending" });
  }

  try {
    const result = JSON.parse(value);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ status: "done", guide: value });
  }
}
