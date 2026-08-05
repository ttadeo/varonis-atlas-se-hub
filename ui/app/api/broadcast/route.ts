import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { Resend } from "resend";
import neo4j from "neo4j-driver";

const ADMIN_EMAIL = "ttadeo@varonis.com";
const resend = new Resend(process.env.RESEND_API_KEY);
// Resend allows max 50 recipients per call (to + bcc combined).
// We put admin in `to`, so bcc gets 49 slots per batch.
const BATCH_SIZE = 49;

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
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    userEmails = result.records
      .map((r) => (r.get("id") as string | null) ?? "")
      .filter((e) => EMAIL_RE.test(e));
  } finally {
    await session.close();
    await driver.close();
  }

  if (userEmails.length === 0) {
    return NextResponse.json({ error: "No registered users found" }, { status: 404 });
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #0f0f0f; color: #e5e7eb; border-radius: 12px;">
      <div style="margin-bottom: 20px;">
        <span style="display: inline-block; width: 32px; height: 32px; border-radius: 8px; background: #2563eb; text-align: center; line-height: 32px; font-weight: bold; font-size: 14px; color: white;">A</span>
        <span style="font-size: 14px; font-weight: 600; color: #9ca3af; margin-left: 10px;">Atlas Learning Platform</span>
      </div>
      <p style="font-size: 15px; line-height: 1.7; color: #d1d5db; white-space: pre-wrap; margin: 0 0 28px;">${message.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
      <hr style="border: none; border-top: 1px solid #1f2937; margin: 0 0 20px;" />
      <p style="font-size: 12px; color: #4b5563; margin: 0;">This message was sent to all registered Atlas Learning Platform users.</p>
    </div>
  `;

  // Admin is always `to`; other users go in bcc, batched to stay under Resend's 50-recipient limit.
  const otherEmails = userEmails.filter((e) => e !== ADMIN_EMAIL);
  const batches: string[][] = [];
  for (let i = 0; i < otherEmails.length; i += BATCH_SIZE) {
    batches.push(otherEmails.slice(i, i + BATCH_SIZE));
  }

  // First batch (or the only call if everyone fits) always includes the admin in `to`
  const allBatches = batches.length > 0 ? batches : [[]];

  for (const batch of allBatches) {
    const { error } = await resend.emails.send({
      from: "ttadeo@timthecoder.net",
      to: ADMIN_EMAIL,
      ...(batch.length > 0 ? { bcc: batch } : {}),
      subject: emailSubject,
      html,
    });

    if (error) {
      return NextResponse.json(
        { error: `Resend error: ${error.message}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true, sent_to: userEmails.length });
}
