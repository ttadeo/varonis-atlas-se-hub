import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import neo4j from "neo4j-driver";
import { NextRequest, NextResponse } from "next/server";

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

async function searchAtlasDocs(query: string, section?: string): Promise<string> {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = embeddingRes.data[0].embedding;

  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    const sectionFilter = section ? "AND node.section = $section" : "";
    const result = await session.run(
      `CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 8, $embedding)
       YIELD node, score
       WHERE score > 0.45 ${sectionFilter}
       RETURN node.heading AS heading, node.text AS text,
              node.title AS title, node.section AS section,
              node.url AS url, score
       ORDER BY score DESC`,
      { embedding, section: section ?? null }
    );

    if (result.records.length === 0) return "No relevant Atlas documentation found for this query.";

    return result.records
      .map((r) => {
        const score = (r.get("score") as number).toFixed(3);
        return `[${r.get("title")} › ${r.get("heading")}] (relevance: ${score})\n${r.get("text")}`;
      })
      .join("\n\n---\n\n");
  } finally {
    await session.close();
    await driver.close();
  }
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

const SYSTEM_PROMPT = `You are an expert Varonis Atlas AI Security Platform advisor. You have access to the complete Atlas knowledge base via tools. Always search the knowledge base before answering technical questions — do not rely on memory alone.

Your audience is Varonis Sales Engineers and technical staff. Be accurate, concise, and direct.

RESPONSE STYLE:
- Answer directly and confidently
- Never say "based on the retrieved documentation" — just answer
- Use markdown formatting: headers, bullets, code blocks where appropriate
- Match depth to the question — short questions get short answers, detailed questions get thorough answers`;

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { question, history = [] }: {
      question: string;
      history: { role: "user" | "assistant"; content: string }[];
    } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const messages: Anthropic.Messages.MessageParam[] = [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: question },
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

    // Return answer + updated history for next turn
    const updatedHistory = [
      ...history,
      { role: "user" as const, content: question },
      { role: "assistant" as const, content: finalAnswer },
    ];

    return NextResponse.json({ answer: finalAnswer, history: updatedHistory });
  } catch (err) {
    console.error("Ask API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
