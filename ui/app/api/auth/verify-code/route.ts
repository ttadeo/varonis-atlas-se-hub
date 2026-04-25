import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { SignJWT } from "jose";

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
