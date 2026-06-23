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

// GET /api/users — returns all users except the caller
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const callerId = auth.email;

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
