import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import neo4j from "neo4j-driver";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const driver = neo4j.driver(
    process.env.NEO4J_URI ?? "bolt://localhost:7687",
    neo4j.auth.basic(
      process.env.NEO4J_USER ?? "neo4j",
      process.env.NEO4J_PASSWORD ?? ""
    ),
    { maxConnectionPoolSize: 1 }
  );

  try {
    const session = driver.session();
    const result = await session.run("MATCH (u:User) RETURN count(u) AS total");
    await session.close();
    const total = result.records[0]?.get("total")?.toNumber() ?? 0;
    return NextResponse.json({ total });
  } catch {
    return NextResponse.json({ total: null });
  } finally {
    await driver.close();
  }
}
