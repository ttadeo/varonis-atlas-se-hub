import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import neo4j from "neo4j-driver";

function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI ?? "bolt://localhost:7687",
    neo4j.auth.basic(process.env.NEO4J_USER ?? "neo4j", process.env.NEO4J_PASSWORD ?? ""),
    { maxConnectionPoolSize: 1 }
  );
}

// GET /api/notifications — fetch all notifications for the current user
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.email;

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
// body: { ids: string[] }
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.email;

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
