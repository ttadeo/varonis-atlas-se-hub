import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { SignJWT } from "jose";
import neo4j from "neo4j-driver";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});
const COOKIE_NAME = "atlas_session";
const SESSION_HOURS = 8;

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const raw = await redis.get(`otp:${normalized}`);
  const stored = String(raw ?? "").replace(/^"|"$/g, "").trim();
  const submitted = String(code).trim();

if (!stored || stored !== submitted) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  // Delete the code so it can't be reused
  await redis.del(`otp:${normalized}`);

  // Sign a JWT
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const token = await new SignJWT({ email: normalized })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_HOURS}h`)
    .setIssuedAt()
    .sign(secret);

  // Ensure User node exists in Neo4j (fire and forget — don't block login)
  try {
    const driver = neo4j.driver(
      process.env.NEO4J_URI ?? "bolt://localhost:7687",
      neo4j.auth.basic(process.env.NEO4J_USER ?? "neo4j", process.env.NEO4J_PASSWORD ?? ""),
      { maxConnectionPoolSize: 1 }
    );
    const dbSession = driver.session();
    await dbSession.run("MERGE (u:User {id: $email})", { email: normalized });
    await dbSession.close();
    await driver.close();
  } catch {
    // Non-fatal — login still succeeds if Neo4j is unreachable
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * SESSION_HOURS,
    path: "/",
  });

  return response;
}
