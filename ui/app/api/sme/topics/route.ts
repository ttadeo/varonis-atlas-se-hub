import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const NEO4J_URL = process.env.NEO4J_HTTP_URL ?? "https://uncompendious-unpurchased-shanita.ngrok-free.dev";
const NEO4J_USER = process.env.NEO4J_USER ?? "neo4j";
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD ?? "ttadeo123";

const QUERY = `
MATCH (n:SMEKnowledge)
RETURN n.question AS question,
       n.answer AS answer,
       n.topic AS topic,
       n.confidence AS confidence,
       n.notes AS notes,
       n.date_sensitive AS date_sensitive,
       n.thread_id AS thread_id
ORDER BY n.topic, n.question
`;

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const res = await fetch(`${NEO4J_URL}/db/neo4j/tx/commit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(`${NEO4J_USER}:${NEO4J_PASSWORD}`),
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        statements: [{ statement: QUERY, parameters: {} }],
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Neo4j error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const rows = data?.results?.[0]?.data ?? [];

    const qaList = rows.map((row: { row: unknown[] }) => ({
      thread_id: row.row[6],
      question: row.row[0],
      answer: row.row[1],
      topic: row.row[2],
      confidence: row.row[3],
      notes: row.row[4],
      date_sensitive: row.row[5],
    }));

    // Group by topic
    const byTopic: Record<string, typeof qaList> = {};
    for (const qa of qaList) {
      const t = qa.topic ?? "other";
      if (!byTopic[t]) byTopic[t] = [];
      byTopic[t].push(qa);
    }

    const TOPIC_LABELS: Record<string, string> = {
      gateway_architecture: "Gateway Architecture",
      guardrails: "Guardrails",
      deployment: "Deployment",
      discovery: "Discovery",
      roadmap: "Roadmap",
      ide_support: "IDE Support",
      compliance: "Compliance",
      licensing: "Licensing",
      shadow_ai: "Shadow AI",
      competitive: "Competitive Intel",
      pii_detection: "PII Detection",
      other: "Other",
    };

    const topics = Object.entries(byTopic).map(([id, items]) => ({
      id,
      label: TOPIC_LABELS[id] ?? id,
      count: items.length,
      qa: items,
    })).sort((a, b) => b.count - a.count);

    return NextResponse.json({ topics, total: qaList.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
