import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const webhookUrl = process.env.N8N_GUIDES_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_GUIDES_WEBHOOK_URL is not configured" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Generate a job ID — passed to n8n so it can POST back to our callback
  const jobId = randomUUID();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? `https://${req.headers.get("host")}`;
  // Include Vercel protection bypass token if set — required when Deployment Protection is enabled
  const bypassSecret = process.env.CALLBACK_BYPASS_SECRET;
  const callbackUrl = bypassSecret
    ? `${appUrl}/api/guides/callback?x-vercel-protection-bypass=${bypassSecret}`
    : `${appUrl}/api/guides/callback`;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, jobId, callbackUrl }),
      signal: AbortSignal.timeout(15_000), // just needs to ACK, not wait for completion
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `n8n workflow error (${res.status})`, detail },
        { status: 502 }
      );
    }

    // n8n acknowledged the job — return jobId for polling
    return NextResponse.json({ jobId, status: "pending" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
