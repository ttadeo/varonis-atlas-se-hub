import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "atlas_session";
const SESSION_DURATION_HOURS = 8;

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  // USERS env var format: "user1:pass1,user2:pass2"
  const usersEnv = process.env.USERS ?? "";
  const users = Object.fromEntries(
    usersEnv.split(",").map((entry) => {
      const [u, p] = entry.trim().split(":");
      return [u, p];
    })
  );

  if (!users[username] || users[username] !== password) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, btoa(`${username}:${Date.now()}`), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * SESSION_DURATION_HOURS,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
