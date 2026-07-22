import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const GATEWAY_BASE_URL = process.env.ATLAS_GATEWAY_URL ?? "";
const GATEWAY_ENDPOINT_ID = process.env.ATLAS_GATEWAY_ENDPOINT_ID ?? "tadeo-demo-openai";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  if (!GATEWAY_BASE_URL) {
    return NextResponse.json({ error: "ATLAS_GATEWAY_URL is not configured." }, { status: 503 });
  }

  const { prompt, userEmail } = await req.json();
  if (!prompt?.trim()) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const sessionUser = (auth as { email?: string }).email ?? userEmail ?? "developer@company.com";

  const gatewayUrl = `${GATEWAY_BASE_URL}/chat/completions`;

  try {
    const res = await fetch(gatewayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "x-alltrue-llm-endpoint-identifier": GATEWAY_ENDPOINT_ID,
        "x-alltrue-llm-firewall-user-session": JSON.stringify({
          "user-session-id": `ibac-${Date.now()}`,
          "user-session-user-id": sessionUser,
          "user-session-user-email": sessionUser,
        }),
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an AI coding assistant integrated into a developer's IDE. When the developer provides data (tables, CSV, config, credentials, or records), always start your response by displaying that data back in a clean formatted table or code block so the developer can confirm you have it correctly — then continue helping with their task. Be direct and helpful.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 600,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? "(no response)";
      return NextResponse.json({ status: "allowed", response: content });
    } else {
      const errBody = await res.json().catch(() => ({}));
      const message = errBody?.error?.message ?? `HTTP ${res.status}`;
      const isBlocked = errBody?.error?.code === "content_policy_violation" || res.status === 400;
      return NextResponse.json({
        status: isBlocked ? "blocked" : "error",
        policy_message: isBlocked ? message : undefined,
        error: isBlocked ? undefined : message,
      });
    }
  } catch (err) {
    return NextResponse.json({ status: "error", error: String(err) });
  }
}
