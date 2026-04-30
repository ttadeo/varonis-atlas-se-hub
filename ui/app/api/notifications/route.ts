import { NextRequest, NextResponse } from "next/server";
import neo4j from "neo4j-driver";
import { jwtVerify } from "jose";

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

// GET /api/notifications — fetch all notifications for the current user
export async function GET(req: NextRequest) {
  const userId = await getCallerId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification)
       RETURN n.id AS id, n.type AS type, n.message AS message,
              n.sessionId AS sessionId, n.sessionName AS sessionName,
              n.fromUserId AS fromUserId, n.read AS read,
              n.createdAt AS createdAt
       ORDER BY n.createdAt DESC
       LIMIT 50`,
      { userId }
    );
    const notifications = result.records.map((r) => ({
      id: r.get("id"),
      type: r.get("type"),
      message: r.get("message"),
      sessionId: r.get("sessionId"),
      sessionName: r.get("sessionName"),
      fromUserId: r.get("fromUserId"),
      read: r.get("read"),
      createdAt: r.get("createdAt")?.toString() ?? "",
    }));
    return NextResponse.json({ notifications });
  } finally {
    await session.close();
    await driver.close();
  }
}

// POST /api/notifications — mark notifications as read
// body: { ids: string[] }  (pass all to mark all read)
export async function POST(req: NextRequest) {
  const userId = await getCallerId(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: "ids array required" }, { status: 400 });
  }

  const driver = getDriver();
  const session = driver.session();
  try {
    await session.run(
      `MATCH (u:User {id: $userId})-[:HAS_NOTIFICATION]->(n:Notification)
       WHERE n.id IN $ids
       SET n.read = true`,
      { userId, ids }
    );
    return NextResponse.json({ updated: true });
  } finally {
    await session.close();
    await driver.close();
  }
}
