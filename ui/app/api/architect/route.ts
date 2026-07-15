import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const webhookUrl = process.env.N8N_ARCHITECT_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_ARCHITECT_WEBHOOK_URL is not configured" },
      { status: 503 }
    );
  }

  let raw: { audience?: string; industry?: string; useCase?: string; techStack?: string; concerns?: string[]; fileContext?: string };
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Merge file context into useCase so the n8n prompt picks it up
  const fileContext = (raw.fileContext ?? "").slice(0, 8000);
  const useCaseBase = (raw.useCase ?? "").slice(0, 400);
  const useCase = fileContext
    ? `${useCaseBase}\n\n--- Attached File Content ---\n${fileContext}`
    : useCaseBase;

  // Truncate free-text fields to prevent runaway Claude output / timeouts
  const body = {
    audience: raw.audience ?? "customer",
    industry: raw.industry ?? "",
    useCase,
    techStack: (raw.techStack ?? "").slice(0, 300),
    concerns: raw.concerns ?? [],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(270_000), // 4.5 min — generation can be slow
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `n8n workflow error (${res.status})`, detail },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
