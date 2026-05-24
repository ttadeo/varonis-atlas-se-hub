import Anthropic from "@anthropic-ai/sdk";
import mammoth from "mammoth";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TEXT_MIME_TYPES = new Set([
  "text/plain",
  "text/csv",
  "text/markdown",
  "text/tab-separated-values",
  "application/csv",
  "application/json",
]);

const DOCX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function extractPdf(buffer: Buffer): Promise<string> {
  const base64 = buffer.toString("base64");
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: { type: "base64", media_type: "application/pdf", data: base64 },
          } as Anthropic.Messages.DocumentBlockParam,
          {
            type: "text",
            text: "Extract all text content from this document. Return only the raw text — no commentary, no formatting instructions, no headers added by you. Preserve the original structure (headings, lists, tables as plain text) as faithfully as possible.",
          },
        ],
      },
    ],
  });
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.Messages.TextBlock).text)
    .join("")
    .trim();
}

async function extractImage(buffer: Buffer, mimeType: string): Promise<string> {
  const base64 = buffer.toString("base64");
  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mimeType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: base64,
            },
          },
          {
            type: "text",
            text: "Describe the content of this image in detail. Focus on any text, data, diagrams, charts, or information that would be useful as meeting context for a sales engineer. Return a structured description.",
          },
        ],
      },
    ],
  });
  return response.content
    .filter((b) => b.type === "text")
    .map((b) => (b as Anthropic.Messages.TextBlock).text)
    .join("")
    .trim();
}

async function extractDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value.trim();
}

// ─── Route handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const MAX_BYTES = 20 * 1024 * 1024; // 20 MB
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 20 MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type || "application/octet-stream";
  const filename = file.name;

  try {
    let text = "";

    if (TEXT_MIME_TYPES.has(mimeType) || filename.match(/\.(txt|csv|md|tsv|json)$/i)) {
      text = buffer.toString("utf-8");
    } else if (mimeType === "application/pdf" || filename.endsWith(".pdf")) {
      text = await extractPdf(buffer);
    } else if (DOCX_MIME_TYPES.has(mimeType) || filename.match(/\.(docx|doc)$/i)) {
      text = await extractDocx(buffer);
    } else if (IMAGE_MIME_TYPES.has(mimeType) || filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      const imageMime = IMAGE_MIME_TYPES.has(mimeType) ? mimeType : "image/jpeg";
      text = await extractImage(buffer, imageMime);
    } else {
      // Attempt plain-text fallback for unknown types
      text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract any text from this file." }, { status: 422 });
    }

    // Cap extracted text — very large documents get truncated to avoid overwhelming the prompt
    const MAX_CHARS = 12000;
    const truncated = text.length > MAX_CHARS;
    const finalText = truncated ? text.slice(0, MAX_CHARS) + "\n\n[... content truncated at 12,000 characters ...]" : text;

    return NextResponse.json({ text: finalText, filename, truncated });
  } catch (err) {
    console.error("[extract-context] error:", err);
    return NextResponse.json({ error: `Extraction failed: ${String(err)}` }, { status: 500 });
  }
}
