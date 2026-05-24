import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "atlas_session";

export async function requireAuth(
  req: NextRequest
): Promise<{ email: string } | NextResponse> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = payload.email as string;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return { email };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
