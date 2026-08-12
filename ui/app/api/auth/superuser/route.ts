import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";
import neo4j from "neo4j-driver";

const SUPERUSERS: Record<string, string | undefined> = {
  "ttadeo@timthecoder.net": process.env.SUPERUSER_PASSWORD,
  "khuram.work@gmail.com": process.env.KHURAM_PASSWORD,
  "jsl@jeffscottlevine.com": process.env.JEFF_PASSWORD,
};
const COOKIE_NAME = "atlas_session";
const SESSION_HOURS = 8;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();
  const expectedPassword = SUPERUSERS[normalized];

  if (!expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Sign a JWT
  const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
  const token = await new SignJWT({ email: normalized })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_HOURS}h`)
    .setIssuedAt()
    .sign(secret);

  // Ensure User node exists in Neo4j (fire and forget)
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
    // Non-fatal
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
