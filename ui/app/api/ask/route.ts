import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import neo4j from "neo4j-driver";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getNeo4jDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
    { maxConnectionPoolSize: 1 }
  );
}

// ─── RAG: search Atlas docs ───────────────────────────────────────────────────

// Escape Lucene special characters so user input doesn't break full-text queries
function escapeLucene(q: string): string {
  return q.replace(/[+\-&|!(){}[\]^"~*?:\\/]/g, " ").replace(/\s+/g, " ").trim();
}

async function searchAtlasDocs(query: string, section?: string): Promise<string> {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = embeddingRes.data[0].embedding;

  const driver = getNeo4jDriver();
  const sectionFilter = section ? "AND node.section = $section" : "";

  // Run vector search, full-text search, UI navigation search, and SME lookup in parallel
  const [vectorResult, fulltextResult, uiResult, smeResult] = await Promise.all([
    (async () => {
      const s = driver.session();
      try {
        return await s.run(
          `CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 12, $embedding)
           YIELD node, score
           WHERE score > 0.45 ${sectionFilter}
           RETURN node.heading AS heading, node.text AS text,
                  node.title AS title, node.section AS section, score
           ORDER BY score DESC`,
          { embedding, section: section ?? null }
        );
      } finally { await s.close(); }
    })(),
    (async () => {
      const s = driver.session();
      try {
        return await s.run(
          `CALL db.index.fulltext.queryNodes('atlas_chunk_text', $query)
           YIELD node, score
           WHERE score > 0.5 ${sectionFilter}
           RETURN node.heading AS heading, node.text AS text,
                  node.title AS title, node.section AS section, score
           ORDER BY score DESC
           LIMIT 8`,
          { query: escapeLucene(query), section: section ?? null }
        );
      } finally { await s.close(); }
    })(),
    (async () => {
      const s = driver.session();
      try {
        return await s.run(
          `CALL db.index.vector.queryNodes('ui_page_embeddings', 4, $embedding)
           YIELD node, score
           WHERE score > 0.5
           RETURN node.friendly_name AS name, node.path AS path,
                  node.navigation_description AS description, score
           ORDER BY score DESC`,
          { embedding }
        );
      } finally { await s.close(); }
    })(),
    // SME Knowledge — traverse RELATED_TO from matching DocChunks
    (async () => {
      const s = driver.session();
      try {
        return await s.run(
          `CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 10, $embedding)
           YIELD node AS chunk, score
           MATCH (sme:SMEKnowledge)-[:RELATED_TO]->(chunk)
           RETURN sme.question AS question, sme.answer AS answer,
                  sme.topic AS topic, sme.confidence AS confidence, score
           ORDER BY score DESC
           LIMIT 5`,
          { embedding }
        );
      } finally { await s.close(); }
    })(),
  ]);

  await driver.close();

  // Merge docs: vector results first, then fill with unique full-text results
  type ChunkRecord = { heading: string; text: string; title: string; section: string; score: number };
  const seen = new Set<string>();
  const merged: ChunkRecord[] = [];

  for (const r of vectorResult.records) {
    const key = r.get("heading");
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({ heading: r.get("heading"), text: r.get("text"), title: r.get("title"), section: r.get("section"), score: r.get("score") });
    }
  }
  for (const r of fulltextResult.records) {
    const key = r.get("heading");
    if (!seen.has(key)) {
      seen.add(key);
      merged.push({ heading: r.get("heading"), text: r.get("text"), title: r.get("title"), section: r.get("section"), score: r.get("score") });
    }
  }

  // Append UI navigation results as a separate section
  const uiChunks = uiResult.records.map((r) => {
    const desc = r.get("description") as string ?? "";
    return `[UI Navigation › ${r.get("name")}]\nURL path: ${r.get("path")}\n${desc.slice(0, 600)}`;
  });

  const docsPart = merged.length > 0
    ? merged.slice(0, 10).map((c) => `[${c.title} › ${c.heading}]\n${c.text}`).join("\n\n---\n\n")
    : "";

  const uiPart = uiChunks.length > 0
    ? `\n\n--- ATLAS UI NAVIGATION ---\n\n${uiChunks.join("\n\n---\n\n")}`
    : "";

  // Deduplicate SME Q&A by question text and format
  const seenSme = new Set<string>();
  const smePairs = smeResult.records
    .filter((r) => {
      const q = r.get("question") as string;
      if (seenSme.has(q)) return false;
      seenSme.add(q);
      return true;
    })
    .map((r) => `Q: ${r.get("question")}\nA: ${r.get("answer")}\n_(Topic: ${r.get("topic")} · Confidence: ${r.get("confidence")})_`);

  const smePart = smePairs.length > 0
    ? `\n\n--- FIELD KNOWLEDGE (AI Security SME Channel) ---\n\n${smePairs.join("\n\n---\n\n")}`
    : "";

  if (!docsPart && !uiPart && !smePart) return "No relevant Atlas documentation found for this query.";
  return (docsPart + uiPart + smePart).trim();
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "search_atlas_docs",
    description:
      "Search the Atlas AI Security knowledge base for product documentation, feature details, deployment guidance, API reference, and technical specs. Always use this before answering Atlas-related questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: { type: "string", description: "Specific search query — be detailed for better results" },
        section: {
          type: "string",
          description: "Optional: filter by section. Valid values: applications, overview, platform_services, competitive, faq, openapi_reference",
        },
      },
      required: ["query"],
    },
  },
];

async function executeTool(name: string, input: Record<string, string>): Promise<string> {
  if (name === "search_atlas_docs") return searchAtlasDocs(input.query, input.section);
  return `Unknown tool: ${name}`;
}

// ─── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT: Anthropic.Messages.TextBlockParam[] = [
  {
    type: "text",
    text: `You are an expert Varonis Atlas AI Security Platform advisor. You have access to the complete Atlas knowledge base via tools. Always search the knowledge base before answering technical questions — do not rely on memory alone.

Your audience is Varonis Sales Engineers and technical staff. Be accurate, concise, and direct.

RESPONSE STYLE:
- Answer directly and confidently
- Never say "based on the retrieved documentation" — just answer
- Use markdown formatting: headers, bullets, code blocks where appropriate
- Match depth to the question — short questions get short answers, detailed questions get thorough answers`,
    cache_control: { type: "ephemeral" },
  },
];

// ─── Main handler ─────────────────────────────────────────────────────────────

interface IncomingAttachment {
  name: string;
  mediaType: string;
  data: string;       // base64 for images/PDFs; extracted text for others
  isExtracted: boolean;
  size: number;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { question, history = [], attachments = [] }: {
      question: string;
      history: { role: "user" | "assistant"; content: string }[];
      attachments: IncomingAttachment[];
    } = await req.json();

    if (!question?.trim() && attachments.length === 0) {
      return NextResponse.json({ error: "question or attachment is required" }, { status: 400 });
    }

    // Build the user content block — text question + any file content
    type ContentBlock =
      | Anthropic.Messages.TextBlockParam
      | Anthropic.Messages.ImageBlockParam
      | Anthropic.Messages.DocumentBlockParam;

    const userContent: ContentBlock[] = [];

    // Prepend extracted file text as context blocks
    for (const att of attachments) {
      if (att.isExtracted) {
        userContent.push({
          type: "text",
          text: `[Attached file: ${att.name}]\n\n${att.data}`,
        });
      } else if (att.mediaType.startsWith("image/")) {
        userContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: att.mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
            data: att.data,
          },
        });
      } else if (att.mediaType === "application/pdf" || att.name.endsWith(".pdf")) {
        userContent.push({
          type: "document",
          source: { type: "base64", media_type: "application/pdf", data: att.data },
        } as Anthropic.Messages.DocumentBlockParam);
      }
    }

    if (question?.trim()) {
      userContent.push({ type: "text", text: question });
    }

    const messages: Anthropic.Messages.MessageParam[] = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: userContent as Anthropic.Messages.ContentBlockParam[] },
    ];

    // ── Agentic RAG loop ──────────────────────────────────────────────────────
    let currentMessages: Anthropic.Messages.MessageParam[] = messages;
    let finalAnswer = "";
    let iterations = 0;
    const MAX_ITERATIONS = 5;

    while (iterations < MAX_ITERATIONS) {
      iterations++;
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: TOOLS,
        messages: currentMessages,
      });

      if (response.stop_reason === "end_turn") {
        finalAnswer = response.content
          .filter((b) => b.type === "text")
          .map((b) => (b as Anthropic.Messages.TextBlock).text)
          .join("");
        break;
      }

      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter(
          (b) => b.type === "tool_use"
        ) as Anthropic.Messages.ToolUseBlock[];

        const toolResults: Anthropic.Messages.ToolResultBlockParam[] = await Promise.all(
          toolUseBlocks.map(async (tb) => ({
            type: "tool_result" as const,
            tool_use_id: tb.id,
            content: await executeTool(tb.name, tb.input as Record<string, string>),
          }))
        );

        currentMessages = [
          ...currentMessages,
          { role: "assistant" as const, content: response.content as Anthropic.Messages.ContentBlockParam[] },
          { role: "user" as const, content: toolResults },
        ];
      } else {
        finalAnswer = response.content
          .filter((b) => b.type === "text")
          .map((b) => (b as Anthropic.Messages.TextBlock).text)
          .join("");
        break;
      }
    }

    // Force final answer if loop exhausted
    if (!finalAnswer.trim()) {
      const finalResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tool_choice: { type: "none" },
        tools: TOOLS,
        messages: currentMessages,
      });
      finalAnswer = finalResponse.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.Messages.TextBlock).text)
        .join("");
    }

    // Return answer + updated history for next turn.
    // Include extracted attachment text in history so it persists across turns.
    const attachmentTexts = attachments
      .filter((a: IncomingAttachment) => a.isExtracted)
      .map((a: IncomingAttachment) => `[Attached file: ${a.name}]\n\n${a.data}`)
      .join("\n\n");
    const binaryNotes = attachments
      .filter((a: IncomingAttachment) => !a.isExtracted)
      .map((a: IncomingAttachment) => `[Attached: ${a.name} (${a.mediaType})]`)
      .join(" ");
    const historyQuestion = [attachmentTexts, binaryNotes, question?.trim()]
      .filter(Boolean)
      .join("\n\n") || attachments.map((a: IncomingAttachment) => `[${a.name}]`).join(" ");
    const updatedHistory = [
      ...history,
      { role: "user" as const, content: historyQuestion },
      { role: "assistant" as const, content: finalAnswer },
    ];

    return NextResponse.json({ answer: finalAnswer, history: updatedHistory });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
