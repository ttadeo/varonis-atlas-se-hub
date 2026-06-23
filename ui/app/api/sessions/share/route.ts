import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import neo4j from "neo4j-driver";
import { randomUUID } from "crypto";

function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI ?? "bolt://localhost:7687",
    neo4j.auth.basic(process.env.NEO4J_USER ?? "neo4j", process.env.NEO4J_PASSWORD ?? ""),
    { maxConnectionPoolSize: 1 }
  );
}

// POST /api/sessions/share
// body: { sessionId, sessionName, recipientId }
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const fromUserId = auth.email;

  const { sessionId, sessionName, recipientId } = await req.json();
  if (!sessionId || !recipientId) {
    return NextResponse.json({ error: "sessionId and recipientId required" }, { status: 400 });
  }
  if (recipientId === fromUserId) {
    return NextResponse.json({ error: "Cannot share with yourself" }, { status: 400 });
  }

  const notifId = randomUUID();
  const driver = getDriver();
  const session = driver.session();
  try {
    await session.run(
      `MATCH (s:MeetingSession {id: $sessionId})
       MERGE (recipient:User {id: $recipientId})
       MERGE (s)-[:SHARED_WITH]->(recipient)
       CREATE (n:Notification {
         id: $notifId,
         type: "session_shared",
         message: $message,
         sessionId: $sessionId,
         sessionName: $sessionName,
         fromUserId: $fromUserId,
         read: false,
         createdAt: datetime()
       })
       MERGE (recipient)-[:HAS_NOTIFICATION]->(n)`,
      {
        sessionId,
        recipientId,
        notifId,
        message: `${fromUserId} shared a session with you: "${sessionName || sessionId}"`,
        sessionName: sessionName || "",
        fromUserId,
      }
    );
    return NextResponse.json({ shared: true });
  } finally {
    await session.close();
    await driver.close();
  }
}
