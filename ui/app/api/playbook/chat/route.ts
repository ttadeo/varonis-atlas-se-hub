import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let question: string;
  let playbookContent: string;
  let history: { role: string; content: string }[] = [];
  let fileText: string | undefined;

  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    question = (formData.get("question") as string) ?? "";
    playbookContent = (formData.get("playbook") as string) ?? "";
    history = JSON.parse((formData.get("history") as string) || "[]");

    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      if (file.type === "application/pdf") {
        const buffer = Buffer.from(await file.arrayBuffer());
        // pdf-parse is CJS — the module itself is the function
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse") as (b: Buffer) => Promise<{ text: string }>;
        const parsed = await pdfParse(buffer);
        fileText = parsed.text.slice(0, 12_000);
      } else {
        fileText = (await file.text()).slice(0, 12_000);
      }
    }
  } else {
    const body = await req.json();
    question = body.question ?? "";
    playbookContent = body.playbook ?? "";
    history = body.history ?? [];
    fileText = body.fileText;
  }

  if (!question || !playbookContent) {
    return NextResponse.json(
      { error: "question and playbook are required" },
      { status: 400 }
    );
  }

  const systemPrompt = [
    "You are a Varonis Atlas AI Security integration specialist. The user has generated the following integration playbook for their specific customer environment.",
    "Answer questions about it precisely — clarify steps, expand on configuration details, suggest troubleshooting approaches, and provide additional guidance grounded in the playbook content.",
    "Be concise and direct. If asked about something not covered in the playbook, say so clearly rather than guessing.",
    "",
    "GENERATED PLAYBOOK:",
    playbookContent,
    fileText
      ? `\n\nADDITIONAL CONTEXT FROM UPLOADED FILE:\n${fileText}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const messages: { role: "user" | "assistant"; content: string }[] = [
    ...history
      .slice(-10) // keep last 5 turns (10 messages)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    { role: "user", content: question },
  ];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const answer =
      response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
