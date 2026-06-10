import { NextRequest, NextResponse } from "next/server";

const KV_URL   = process.env.KV_REST_API_URL ?? "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? "";
const TTL_SECS = 3600; // keep results for 1 hour

async function kvSet(key: string, value: string): Promise<void> {
  await fetch(`${KV_URL}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ value, ex: TTL_SECS }),
  });
}

// n8n POSTs here when guide generation is complete.
// Body: { jobId: string, guide: string }  (or any of the wrapped n8n shapes)
export async function POST(req: NextRequest) {
  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Unwrap any n8n response shape to get the guide text
  const unwrap = (val: unknown): string => {
    if (typeof val === "string") {
      const stripped = val.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
      try {
        const parsed = JSON.parse(stripped);
        if (parsed && typeof parsed.guide === "string") return unwrap(parsed.guide);
      } catch { /* not JSON */ }
      return val;
    }
    if (Array.isArray(val) && val.length > 0) return unwrap(val[0]);
    if (val && typeof val === "object") {
      const obj = val as Record<string, unknown>;
      if (typeof obj.guide === "string") return unwrap(obj.guide);
    }
    return String(val ?? "");
  };

  const obj = (Array.isArray(raw) ? raw[0] : raw) as Record<string, unknown>;
  const jobId = typeof obj?.jobId === "string" ? obj.jobId : null;
  const guide = unwrap(raw);

  if (!jobId) {
    return NextResponse.json({ error: "jobId missing in callback body" }, { status: 400 });
  }

  await kvSet(`guide:${jobId}`, JSON.stringify({ status: "done", guide }));

  return NextResponse.json({ ok: true });
}
