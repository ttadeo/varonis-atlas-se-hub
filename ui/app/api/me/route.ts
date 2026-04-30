import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "atlas_session";

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return NextResponse.json({ userId: null }, { status: 401 });
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = (payload.email as string) ?? null;
    return NextResponse.json({ userId: email });
  } catch {
    return NextResponse.json({ userId: null }, { status: 401 });
  }
}
