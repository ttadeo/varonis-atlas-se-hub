import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Redis } from "@upstash/redis";

const resend = new Resend(process.env.RESEND_API_KEY);
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalized = email.trim().toLowerCase();

  if (!normalized.endsWith("@varonis.com")) {
    return NextResponse.json(
      { error: "Only @varonis.com email addresses are allowed" },
      { status: 403 }
    );
  }

  const code = generateOTP();

  // Store with 10 minute TTL
  await redis.set(`otp:${normalized}`, code, { ex: 600 });

  await resend.emails.send({
    from: "ttadeo@timthecoder.net",
    to: normalized,
    subject: "Your Atlas login code",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 32px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
          <div style="width: 36px; height: 36px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">A</div>
          <div>
            <div style="font-weight: 600; color: #111;">Atlas Learning Platform</div>
            <div style="font-size: 12px; color: #666;">Varonis Atlas AI Security</div>
          </div>
        </div>
        <p style="color: #333; margin-bottom: 8px;">Your sign-in code is:</p>
        <div style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #111; margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; text-align: center;">${code}</div>
        <p style="color: #666; font-size: 13px;">This code expires in 10 minutes.</p>
        <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
