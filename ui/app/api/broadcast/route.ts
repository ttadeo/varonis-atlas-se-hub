import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { Resend } from "resend";
import neo4j from "neo4j-driver";

const ADMIN_EMAIL = "ttadeo@varonis.com";
const resend = new Resend(process.env.RESEND_API_KEY);

function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI ?? "bolt://localhost:7687",
    neo4j.auth.basic(process.env.NEO4J_USER ?? "neo4j", process.env.NEO4J_PASSWORD ?? ""),
    { maxConnectionPoolSize: 1 }
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  if (auth.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { subject, message } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const emailSubject = subject?.trim() || "Atlas Learning Platform — Update";

  // Fetch all registered users from Neo4j
  const driver = getDriver();
  const session = driver.session();
  let userEmails: string[] = [];
  try {
    const result = await session.run(`MATCH (u:User) RETURN u.id AS id ORDER BY u.id ASC`);
    userEmails = result.records.map((r) => r.get("id") as string);
  } finally {
    await session.close();
    await driver.close();
  }

  if (userEmails.length === 0) {
    return NextResponse.json({ error: "No registered users found" }, { status: 404 });
  }

  // Send one email with all users in bcc (admin is the visible `to`)
  await resend.emails.send({
    from: "ttadeo@timthecoder.net",
    to: ADMIN_EMAIL,
    bcc: userEmails,
    subject: emailSubject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f0f; color: #e5e7eb; border-radius: 12px;">
        <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 8px; background: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; color: white;">A</div>
          <span style="font-size: 14px; font-weight: 600; color: #9ca3af;">Atlas Learning Platform</span>
        </div>
        <p style="font-size: 15px; line-height: 1.7; color: #d1d5db; white-space: pre-wrap; margin: 0 0 28px;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <hr style="border: none; border-top: 1px solid #1f2937; margin: 0 0 20px;" />
        <p style="font-size: 12px; color: #4b5563; margin: 0;">This message was sent to all registered Atlas Learning Platform users.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true, sent_to: userEmails.length });
}
