import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(780_000),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { error: `n8n workflow error (${res.status})`, detail },
        { status: 502 }
      );
    }

    const raw = await res.json();

    // n8n can return the guide in several shapes — normalize all of them:
    //   - { guide: "..." }
    //   - [{ guide: "..." }]
    //   - { guide: "```json\n{\"guide\": \"...\"}\n```" }  (double-wrapped)
    const unwrap = (val: unknown): string => {
      if (typeof val === "string") {
        // Strip markdown code fences if present
        const stripped = val.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
        try {
          const parsed = JSON.parse(stripped);
          if (parsed && typeof parsed.guide === "string") return unwrap(parsed.guide);
        } catch { /* not JSON — use as-is */ }
        return val;
      }
      if (Array.isArray(val) && val.length > 0) return unwrap(val[0]);
      if (val && typeof val === "object" && "guide" in (val as object)) {
        return unwrap((val as Record<string, unknown>).guide);
      }
      return String(val ?? "");
    };

    const guide = unwrap(raw);
    return NextResponse.json({ guide });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
