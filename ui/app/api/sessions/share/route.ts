import { NextRequest, NextResponse } from "next/server";
import neo4j from "neo4j-driver";
import { jwtVerify } from "jose";
import { randomUUID } from "crypto";

const COOKIE_NAME = "atlas_session";

async function getCallerId(req: NextRequest): Promise<string | null> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return null;
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    return (payload.email as string) ?? null;
  } catch {
    return null;
  }
}

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
  const fromUserId = await getCallerId(req);
  if (!fromUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
