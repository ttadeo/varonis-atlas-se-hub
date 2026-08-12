import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const ADMIN_EMAIL = "ttadeo@timthecoder.net";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({
    email: auth.email,
    userId: auth.email,
    isAdmin: auth.email === ADMIN_EMAIL,
  });
}
