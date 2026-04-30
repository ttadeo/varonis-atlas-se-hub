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

// GET /api/users — returns all users except the caller
export async function GET(req: NextRequest) {
  const callerId = await getCallerId(req);
  if (!callerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const driver = getDriver();
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User) WHERE u.id <> $callerId RETURN u.id AS id ORDER BY u.id ASC`,
      { callerId }
    );
    const users = result.records.map((r) => ({ id: r.get("id") as string }));
    return NextResponse.json({ users });
  } finally {
    await session.close();
    await driver.close();
  }
}
