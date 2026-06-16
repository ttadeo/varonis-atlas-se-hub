import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const KV_URL   = process.env.KV_REST_API_URL ?? "";
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? "";
const TTL_SECS = 90 * 24 * 60 * 60; // 90 days
const MAX_SESSIONS = 50;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SessionMeta {
  id: string;
  title: string;
  timestamp: string;
}

interface FullSession extends SessionMeta {
  email: string;
  messages: { role: string; content: string; attachmentNames?: string[] }[];
  history: { role: string; content: string }[];
}

// ─── KV helpers ───────────────────────────────────────────────────────────────

async function kvPipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const res = await fetch(`${KV_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`KV pipeline error: ${res.status}`);
  const data = await res.json();
  return (data as { result: unknown }[]).map((d) => d.result);
}

// ─── GET — list sessions or load one ─────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { email } = auth;

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");

  if (sessionId) {
    const [raw] = await kvPipeline([["GET", `ask_session:${sessionId}`]]);
    if (!raw) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    const session = JSON.parse(raw as string) as FullSession;
    if (session.email !== email) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    return NextResponse.json(session);
  }

  // Return the index (list of session metadata)
  const [raw] = await kvPipeline([["GET", `ask_sessions:${email}`]]);
  const sessions: SessionMeta[] = raw ? JSON.parse(raw as string) : [];
  return NextResponse.json({ sessions });
}

// ─── POST — save / upsert session ────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { email } = auth;

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }

  const { sessionId, title, messages, history } = await req.json() as {
    sessionId: string;
    title: string;
    messages: FullSession["messages"];
    history: FullSession["history"];
  };

  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  const timestamp = new Date().toISOString();
  const session: FullSession = { id: sessionId, title, email, timestamp, messages, history };

  // Read existing index
  const [rawIndex] = await kvPipeline([["GET", `ask_sessions:${email}`]]);
  const sessions: SessionMeta[] = rawIndex ? JSON.parse(rawIndex as string) : [];

  // Upsert this session in the index
  const meta: SessionMeta = { id: sessionId, title, timestamp };
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx >= 0) sessions[idx] = meta;
  else sessions.unshift(meta);

  // Keep only most recent MAX_SESSIONS
  const trimmed = sessions.slice(0, MAX_SESSIONS);

  await kvPipeline([
    ["SET", `ask_session:${sessionId}`, JSON.stringify(session), "EX", String(TTL_SECS)],
    ["SET", `ask_sessions:${email}`, JSON.stringify(trimmed), "EX", String(TTL_SECS)],
  ]);

  return NextResponse.json({ ok: true });
}

// ─── DELETE — remove a session ────────────────────────────────────────────────

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { email } = auth;

  if (!KV_URL || !KV_TOKEN) {
    return NextResponse.json({ error: "KV not configured" }, { status: 503 });
  }

  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

  const [rawIndex] = await kvPipeline([["GET", `ask_sessions:${email}`]]);
  const sessions: SessionMeta[] = rawIndex ? JSON.parse(rawIndex as string) : [];
  const filtered = sessions.filter((s) => s.id !== sessionId);

  await kvPipeline([
    ["DEL", `ask_session:${sessionId}`],
    ["SET", `ask_sessions:${email}`, JSON.stringify(filtered), "EX", String(TTL_SECS)],
  ]);

  return NextResponse.json({ ok: true });
}
