import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireAuth } from "@/lib/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { type, message, page } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const userEmail = (auth as { email: string }).email ?? "unknown";
  const label = type === "bug" ? "🐛 Bug Report" : type === "feature" ? "✨ Feature Request" : "💬 General Feedback";

  await resend.emails.send({
    from: "ttadeo@timthecoder.net",
    to: "ttadeo@timthecoder.net",
    subject: `[Atlas SE Hub] ${label} from ${userEmail}`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #0f0f0f; color: #e5e7eb; border-radius: 12px;">
        <div style="margin-bottom: 24px;">
          <span style="background: #312e81; color: #a5b4fc; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${label}</span>
        </div>
        <p style="font-size: 15px; line-height: 1.6; color: #d1d5db; margin: 0 0 24px;">${message.replace(/\n/g, "<br/>")}</p>
        <hr style="border: none; border-top: 1px solid #1f2937; margin: 24px 0;" />
        <table style="font-size: 13px; color: #6b7280; width: 100%;">
          <tr><td style="padding: 4px 0; width: 80px;">From</td><td style="color: #9ca3af;">${userEmail}</td></tr>
          <tr><td style="padding: 4px 0;">Page</td><td style="color: #9ca3af;">${page ?? "unknown"}</td></tr>
          <tr><td style="padding: 4px 0;">Time</td><td style="color: #9ca3af;">${new Date().toISOString()}</td></tr>
        </table>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}
