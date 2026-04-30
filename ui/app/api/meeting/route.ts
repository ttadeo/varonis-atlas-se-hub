import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import neo4j from "neo4j-driver";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Attachment {
  name: string;
  mediaType: string;
  data: string; // base64
  size: number; // bytes
}

interface MeetingContext {
  industry: string;
  meetingType: string;
  attendees: string;
  knownConcerns: string;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function getNeo4jDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
    { maxConnectionPoolSize: 1 } // serverless-safe
  );
}

// ─── Tool: search_atlas_docs ──────────────────────────────────────────────────

async function searchAtlasDocs(query: string, section?: string): Promise<string> {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = embeddingRes.data[0].embedding;

  const driver = getNeo4jDriver();
  const sectionFilter = section ? "AND node.section = $section" : "";

  // Run vector search, full-text search, and UI navigation search in parallel
  const [vectorResult, fulltextResult, uiResult] = await Promise.all([
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
          { query, section: section ?? null }
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

  if (!docsPart && !uiPart) return "No relevant Atlas documentation found for this query.";
  return (docsPart + uiPart).trim();
}

// ─── Tool: search_past_sessions ───────────────────────────────────────────────

async function searchPastSessions(query: string): Promise<string> {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const embedding = embeddingRes.data[0].embedding;

  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    // Search both session summaries and individual interaction questions
    const result = await session.run(
      `CALL db.index.vector.queryNodes('interaction_embeddings', 6, $embedding)
       YIELD node AS interaction, score
       WHERE score > 0.5
       MATCH (s:MeetingSession)-[:HAD]->(interaction)
       RETURN interaction.question AS question,
              interaction.answer AS answer,
              s.customer_industry AS industry,
              s.meeting_type AS meetingType,
              s.created_at AS date,
              score
       ORDER BY score DESC`,
      { embedding }
    );

    if (result.records.length === 0) {
      return "No similar past meeting sessions found.";
    }

    return result.records
      .map((r) => {
        const date = r.get("date")
          ? new Date(r.get("date")).toLocaleDateString()
          : "Unknown date";
        return `[Past session: ${r.get("industry")} · ${r.get("meetingType")} · ${date}]\nQuestion: ${r.get("question")}\nAnswer: ${r.get("answer")}`;
      })
      .join("\n\n---\n\n");
  } finally {
    await session.close();
    await driver.close();
  }
}

// ─── Tool executor ────────────────────────────────────────────────────────────

async function executeTool(
  name: string,
  input: Record<string, string>
): Promise<string> {
  if (name === "search_atlas_docs") {
    return searchAtlasDocs(input.query, input.section);
  }
  if (name === "search_past_sessions") {
    return searchPastSessions(input.query);
  }
  return `Unknown tool: ${name}`;
}

// ─── Tool definitions for Anthropic ──────────────────────────────────────────

const TOOLS: Anthropic.Messages.Tool[] = [
  {
    name: "search_atlas_docs",
    description:
      "Search the Atlas AI Security knowledge base for product documentation, feature details, deployment guidance, competitive positioning, and technical specs. Use this for any Atlas-related question.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description: "The search query — be specific for better results",
        },
        section: {
          type: "string",
          description:
            "Optional: filter by section. Valid values: applications, overview, platform_services, competitive, faq, openapi_reference",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_past_sessions",
    description:
      "Search past SE meeting sessions for similar customer questions, objections, or scenarios. Use this when the SE references a past interaction or wants to know how similar situations were handled.",
    input_schema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "The question or concern to search for in past sessions",
        },
      },
      required: ["query"],
    },
  },
];

// ─── System prompt builder ────────────────────────────────────────────────────

const STATIC_SYSTEM_PROMPT: Anthropic.Messages.TextBlockParam = {
  type: "text",
  text: `You are an expert Varonis Atlas AI Security advisor helping a Sales Engineer prepare for or run a customer meeting.

You have access to the complete Atlas knowledge base and past SE meeting sessions via tools. Always search the knowledge base before answering technical questions — do not rely on memory alone.

Your job:
- Answer technical Atlas questions accurately using the knowledge base
- Surface relevant past SE experiences when helpful
- Analyze any customer materials shared (screenshots, documents, diagrams)
- Help the SE anticipate and handle objections
- Be concise, direct, and confident — your audience is technical sales staff

RESPONSE STYLE:
- Answer directly and confidently
- Never say "based on the retrieved documentation" or similar framing — just answer
- Be SE-focused: skip developer-level detail unless asked
- If attachments are present, analyze them first before answering
- Match the depth of the answer to the question — short questions get short answers`,
  cache_control: { type: "ephemeral" },
};

function buildSystemPrompt(ctx: MeetingContext | null): Anthropic.Messages.TextBlockParam[] {
  if (!ctx) return [STATIC_SYSTEM_PROMPT];
  return [
    STATIC_SYSTEM_PROMPT,
    {
      type: "text",
      text: `MEETING CONTEXT:
- Customer Industry: ${ctx.industry}
- Meeting Type: ${ctx.meetingType}
- People in the room: ${ctx.attendees}
- Known concerns / objections: ${ctx.knownConcerns || "None specified"}

Tailor every answer to this customer profile. Reference their industry, the meeting type, and address their known concerns directly when relevant.`,
    },
  ];
}

function buildScriptPrompt(ctx: MeetingContext, demoLength: string): string {
  return `You are an expert Varonis Atlas AI Security Sales Engineer. Generate a complete, timed demo script for the following customer meeting.

MEETING DETAILS:
- Customer Industry: ${ctx.industry}
- Meeting Type: ${ctx.meetingType}
- People in the room: ${ctx.attendees || "Not specified"}
- Known concerns / objections: ${ctx.knownConcerns || "None specified"}
- Total demo time: ${demoLength} minutes

Search the Atlas knowledge base to ensure accuracy on product features, capabilities, and terminology before writing the script.

Generate a professional demo script with the following sections. Each section must show its time allocation clearly (e.g. "5 min"):

## Opening — Agenda & Framing
How to open the meeting for this specific audience. What to say to establish credibility and set expectations.

## Discovery Questions
3–5 targeted questions to ask this specific customer (based on their industry and known concerns) to uncover pain before diving into the demo.

## Demo Flow
Break the demo into timed segments that total ${demoLength} minutes. For each segment:
- What to show (specific Atlas feature or application)
- What to say (talking points, not a script word-for-word)
- The key value message for this audience

## The "Wow Moment"
The single most impactful thing to show this customer given their profile. Why it will resonate specifically with them.

## Objection Handling
For each known concern listed above, provide a direct response Atlas SE would give. If no concerns are listed, use the most common objections for this industry.

## Close & Next Steps
How to end the meeting and propose clear next steps appropriate for a ${ctx.meetingType}.

Write the script to be practical and immediately usable — not generic. Every section should reflect the specific customer profile above.`;
}

function buildCallGuidePrompt(ctx: MeetingContext): string {
  return `You are an expert Varonis Atlas AI Security Sales Engineer. Generate a complete call guide for the following customer meeting.

MEETING DETAILS:
- Customer Industry: ${ctx.industry}
- Meeting Type: ${ctx.meetingType}
- People in the room: ${ctx.attendees || "Not specified"}
- Known concerns / objections: ${ctx.knownConcerns || "None specified"}

Search the Atlas knowledge base to ensure accuracy on product features, capabilities, and terminology before writing the guide.

Generate a practical, immediately usable call guide with the following sections:

## Opening — How to Start the Call
What to say in the first 2 minutes to establish credibility, set the agenda, and build rapport with this specific audience.

## Discovery Questions
6–8 targeted questions for this specific customer (based on their industry and known concerns). For each question, include:
- The question itself
- Why you're asking it (what you're trying to uncover)

## Key Talking Points
The 3–4 most important things to communicate about Atlas for this customer profile. What problems does Atlas solve that are most relevant to their industry?

## Objection Handling
For each known concern listed above, provide a direct, confident response an Atlas SE would give. If no concerns are listed, use the most common objections for this industry.

## Qualification Criteria
What signals during this call indicate a strong opportunity vs. a poor fit? What questions reveal budget, authority, need, and timeline for this customer type?

## Close & Next Steps
How to end the call and propose clear next steps appropriate for a ${ctx.meetingType}.

Write the guide to be specific to this customer profile — not generic. Every section should reflect their industry, meeting type, and known concerns.`;
}

// ─── Quick Response ───────────────────────────────────────────────────────────

function buildQuickResponsePrompt(
  question: string,
  ctx: MeetingContext,
  atlasDocs: string,
  pastSessions: string
): string {
  return `You are an expert Varonis Atlas AI Security Sales Engineer in a LIVE customer meeting. Answer the question below in exactly 3 sentences — no more.

MEETING CONTEXT:
- Industry: ${ctx.industry}
- Meeting Type: ${ctx.meetingType}
- Attendees: ${ctx.attendees || "Not specified"}
- Known concerns: ${ctx.knownConcerns || "None"}

ATLAS KNOWLEDGE BASE:
${atlasDocs}

PAST SE INTERACTIONS ON SIMILAR QUESTIONS:
${pastSessions}

CUSTOMER QUESTION: ${question}

RULES:
- Exactly 3 sentences. No bullet points. No headers.
- Sentence 1: Direct answer to the question.
- Sentence 2: One specific Atlas capability or proof point that supports the answer.
- Sentence 3: A bridge to next step or follow-up action.
- Use plain language an SE can say out loud right now.
- Never say "based on the documentation" or similar — just answer.`;
}

async function judgeQuickResponse(
  question: string,
  answer: string,
  atlasDocs: string
): Promise<{ score: number; label: string; reason: string }> {
  const prompt = `You are evaluating whether an AI-generated answer to a customer question is factually grounded and accurate based on the provided Atlas documentation.

CUSTOMER QUESTION: ${question}

AI ANSWER: ${answer}

ATLAS DOCUMENTATION USED:
${atlasDocs.slice(0, 3000)}

Score the answer from 0 to 100 based on:
- Is the answer factually supported by the documentation? (50 pts)
- Is it specific to Atlas (not generic AI security)? (25 pts)
- Is it accurate and not misleading? (25 pts)

Respond with valid JSON only — no markdown, no explanation outside the JSON:
{"score": <number>, "reason": "<one sentence explaining the score>"}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (response.content[0] as Anthropic.Messages.TextBlock).text.trim();
  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    const score: number = parsed.score ?? 0;
    const label = score >= 85 ? "High Confidence" : score >= 60 ? "Moderate Confidence" : "Low Confidence";
    return { score, label, reason: parsed.reason ?? "" };
  } catch {
    return { score: 0, label: "Low Confidence", reason: "Could not evaluate answer." };
  }
}

// ─── Quality gate judge for regular chat answers ─────────────────────────────

async function judgeChatResponse(
  question: string,
  answer: string,
  atlasDocs: string
): Promise<{ score: number; label: string; reason: string }> {
  const prompt = `You are a quality gate evaluating whether an AI-generated answer about the Varonis Atlas AI Security Platform is worth storing in a knowledge base for future reference.

CUSTOMER QUESTION: ${question}

AI ANSWER (may be long and use markdown formatting):
${answer.slice(0, 2000)}

ATLAS DOCUMENTATION RETRIEVED:
${atlasDocs.slice(0, 3000)}

Score the answer from 0 to 100 based on ONLY these criteria:
- Does the answer address a real Atlas product question (not off-topic, not a greeting)? (30 pts)
- Is the answer grounded in Atlas-specific facts, features, or capabilities? (40 pts)
- Is the answer accurate and not misleading or hallucinated? (30 pts)

A well-formed answer about Atlas features should score 70+.
A vague, off-topic, or clearly hallucinated answer should score below 70.
Do NOT penalize for length, formatting, or markdown usage.

Respond with valid JSON only — no markdown, no explanation outside the JSON:
{"score": <number>, "reason": "<one sentence explaining the score>"}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = (response.content[0] as Anthropic.Messages.TextBlock).text.trim();
  try {
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    const score: number = parsed.score ?? 0;
    const label = score >= 85 ? "High Confidence" : score >= 70 ? "Moderate Confidence" : "Low Confidence";
    return { score, label, reason: parsed.reason ?? "" };
  } catch {
    return { score: 0, label: "Low Confidence", reason: "Could not evaluate answer." };
  }
}

// ─── Session save ─────────────────────────────────────────────────────────────

async function saveInteraction(
  sessionId: string,
  question: string,
  answer: string,
  modelUsed: string,
  hadAttachments: boolean,
  isScript = false,
  isQuickResponse = false,
  confidenceScore: number | null = null
) {
  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const embedding = embeddingRes.data[0].embedding;

  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    await session.run(
      `MATCH (s:MeetingSession {id: $sessionId})
       CREATE (i:Interaction {
         id: $id,
         session_id: $sessionId,
         question: $question,
         answer: $answer,
         model_used: $modelUsed,
         had_attachments: $hadAttachments,
         is_script: $isScript,
         is_quick_response: $isQuickResponse,
         confidence_score: $confidenceScore,
         embedding: $embedding,
         created_at: datetime()
       })
       CREATE (s)-[:HAD]->(i)`,
      {
        sessionId,
        id: randomUUID(),
        question,
        answer,
        modelUsed,
        hadAttachments,
        isScript,
        isQuickResponse,
        confidenceScore,
        embedding,
      }
    );
  } finally {
    await session.close();
    await driver.close();
  }
}

async function createSession(
  userId: string,
  ctx: MeetingContext,
  name?: string,
  description?: string
): Promise<string> {
  const sessionId = randomUUID();
  const summary = `${ctx.meetingType} with ${ctx.industry} customer. Attendees: ${ctx.attendees}. Concerns: ${ctx.knownConcerns}`;

  const embeddingRes = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: summary,
  });

  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    await session.run(
      `MERGE (u:User {id: $userId})
       ON CREATE SET u.created_at = datetime()
       WITH u
       CREATE (s:MeetingSession {
         id: $sessionId,
         user_id: $userId,
         customer_industry: $industry,
         meeting_type: $meetingType,
         attendees: $attendees,
         known_concerns: $knownConcerns,
         name: $name,
         description: $description,
         summary: $summary,
         embedding: $embedding,
         created_at: datetime()
       })
       CREATE (u)-[:HAS_SESSION]->(s)`,
      {
        userId,
        sessionId,
        industry: ctx.industry,
        meetingType: ctx.meetingType,
        attendees: ctx.attendees,
        knownConcerns: ctx.knownConcerns,
        name: name ?? `${ctx.meetingType} · ${ctx.industry}`,
        description: description ?? "",
        summary,
        embedding: embeddingRes.data[0].embedding,
      }
    );
    return sessionId;
  } finally {
    await session.close();
    await driver.close();
  }
}

// ─── Main route handler ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      question,
      history = [],
      attachments = [],
      meetingContext = null,
      sessionId = null,
      userId = "anonymous",
      saveSession = false,
      generateScript = false,
      generateCallGuide = false,
      quickResponse = false,
      demoLength = "30",
      sessionName = "",
      sessionDescription = "",
      createSessionOnly = false,
    }: {
      question: string;
      history: ConversationMessage[];
      attachments: Attachment[];
      meetingContext: MeetingContext | null;
      sessionId: string | null;
      userId: string;
      saveSession: boolean;
      generateScript: boolean;
      generateCallGuide: boolean;
      quickResponse: boolean;
      demoLength: string;
      sessionName: string;
      sessionDescription: string;
      createSessionOnly: boolean;
    } = body;

    // ── Eager session creation (toggle-on with locked context) ───────────────
    if (createSessionOnly && meetingContext) {
      const newSessionId = await createSession(
        userId,
        meetingContext,
        sessionName || undefined,
        sessionDescription || undefined
      );
      return NextResponse.json({ sessionId: newSessionId });
    }

    // ── Quick Response path ──────────────────────────────────────────────────
    if (quickResponse && meetingContext && question.trim()) {
      const [atlasDocs, pastSessions] = await Promise.all([
        searchAtlasDocs(`${question} ${meetingContext.industry}`),
        searchPastSessions(question),
      ]);

      const qrPrompt = buildQuickResponsePrompt(question, meetingContext, atlasDocs, pastSessions);

      const qrResponse = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 512,
        messages: [{ role: "user", content: qrPrompt }],
      });

      const answer = qrResponse.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.Messages.TextBlock).text)
        .join("").trim();

      const confidence = await judgeQuickResponse(question, answer, atlasDocs);

      let activeSessionId = sessionId;
      const quickPassesGate = confidence.score >= 70;
      if (saveSession && quickPassesGate) {
        if (!activeSessionId) {
          activeSessionId = await createSession(userId, meetingContext, sessionName || undefined, sessionDescription || undefined);
        }
        await saveInteraction(activeSessionId, question, answer, "claude-sonnet-4-6", false, false, true, confidence.score);
      }

      return NextResponse.json({
        answer,
        model: "claude-sonnet-4-6",
        isQuickResponse: true,
        confidence,
        savedToMemory: quickPassesGate,
        sessionId: activeSessionId,
      });
    }

    // ── Demo script generation path ──────────────────────────────────────────
    if (generateScript && meetingContext) {
      // Pre-fetch relevant Atlas docs in parallel, then generate in one direct call
      const [docsGeneral, docsFeatures] = await Promise.all([
        searchAtlasDocs(`${meetingContext.industry} AI security demo ${meetingContext.meetingType}`),
        searchAtlasDocs(`Atlas guardrails policies AI Gateway features capabilities`),
      ]);

      const ragContext = `ATLAS KNOWLEDGE BASE (use this to ensure accuracy):\n\n${docsGeneral}\n\n---\n\n${docsFeatures}`;
      const scriptPrompt = buildScriptPrompt(meetingContext, demoLength);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: buildSystemPrompt(meetingContext),
        messages: [
          {
            role: "user" as const,
            content: `${ragContext}\n\n---\n\n${scriptPrompt}`,
          },
        ],
      });

      const scriptAnswer = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.Messages.TextBlock).text)
        .join("");

      if (!scriptAnswer.trim()) {
        console.error("[script] Empty response from Claude. stop_reason:", response.stop_reason);
        return NextResponse.json(
          { error: "Script generation returned empty content." },
          { status: 500 }
        );
      }

      // Save script as an interaction if session saving is enabled
      let activeSessionId = sessionId;
      if (saveSession && meetingContext) {
        if (!activeSessionId) {
          activeSessionId = await createSession(userId, meetingContext, sessionName || undefined, sessionDescription || undefined);
        }
        await saveInteraction(
          activeSessionId,
          `Generate a ${demoLength}-minute demo script for this meeting.`,
          scriptAnswer,
          "claude-sonnet-4-6",
          false,
          true // isScript
        );
      }

      return NextResponse.json({
        answer: scriptAnswer,
        model: "claude-sonnet-4-6",
        isScript: true,
        sessionId: activeSessionId,
      });
    }

    // ── Call guide generation path ───────────────────────────────────────────
    if (generateCallGuide && meetingContext) {
      const [docsGeneral, docsDiscovery] = await Promise.all([
        searchAtlasDocs(`${meetingContext.industry} AI security ${meetingContext.meetingType}`),
        searchAtlasDocs(`Atlas discovery questions objection handling value proposition`),
      ]);

      const ragContext = `ATLAS KNOWLEDGE BASE (use this to ensure accuracy):\n\n${docsGeneral}\n\n---\n\n${docsDiscovery}`;
      const callGuidePrompt = buildCallGuidePrompt(meetingContext);

      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 8192,
        system: buildSystemPrompt(meetingContext),
        messages: [{ role: "user" as const, content: `${ragContext}\n\n---\n\n${callGuidePrompt}` }],
      });

      const guideAnswer = response.content
        .filter((b) => b.type === "text")
        .map((b) => (b as Anthropic.Messages.TextBlock).text)
        .join("");

      if (!guideAnswer.trim()) {
        return NextResponse.json({ error: "Call guide generation returned empty content." }, { status: 500 });
      }

      let activeSessionId = sessionId;
      if (saveSession && meetingContext) {
        if (!activeSessionId) {
          activeSessionId = await createSession(userId, meetingContext, sessionName || undefined, sessionDescription || undefined);
        }
        await saveInteraction(activeSessionId, `Generate a call guide for this ${meetingContext.meetingType}.`, guideAnswer, "claude-sonnet-4-6", false, true);
      }

      return NextResponse.json({ answer: guideAnswer, model: "claude-sonnet-4-6", isScript: true, sessionId: activeSessionId });
    }

    // ── Model selection ──────────────────────────────────────────────────────
    const hasImages = attachments.some((a) =>
      a.mediaType.startsWith("image/")
    );
    // Images go to GPT-4o (better vision); everything else to Claude
    const model = hasImages ? "gpt-4o" : "claude-sonnet-4-6";

    // ── Build user message content ───────────────────────────────────────────
    type ContentBlock =
      | Anthropic.Messages.TextBlockParam
      | Anthropic.Messages.ImageBlockParam
      | Anthropic.Messages.DocumentBlockParam;

    const userContent: ContentBlock[] = [
      { type: "text", text: question },
    ];

    for (const att of attachments) {
      if (att.mediaType.startsWith("image/")) {
        userContent.push({
          type: "image",
          source: {
            type: "base64",
            media_type: att.mediaType as
              | "image/jpeg"
              | "image/png"
              | "image/gif"
              | "image/webp",
            data: att.data,
          },
        });
      } else if (att.mediaType === "application/pdf") {
        userContent.push({
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: att.data,
          },
        } as Anthropic.Messages.DocumentBlockParam);
      }
    }

    // ── Build messages array ─────────────────────────────────────────────────
    const messages: Anthropic.Messages.MessageParam[] = [
      ...history.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: userContent as Anthropic.Messages.ContentBlockParam[] },
    ];

    // ── Agentic RAG loop (Claude only — GPT-4o path below) ───────────────────
    let finalAnswer = "";
    const retrievedDocs: string[] = []; // accumulate RAG results for quality gate

    if (model === "claude-sonnet-4-6") {
      let currentMessages: Anthropic.Messages.MessageParam[] = messages;
      let iterations = 0;
      const MAX_ITERATIONS = 5;

      while (iterations < MAX_ITERATIONS) {
        iterations++;
        const response = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: buildSystemPrompt(meetingContext),
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
            toolUseBlocks.map(async (tb) => {
              const result = await executeTool(tb.name, tb.input as Record<string, string>);
              if (tb.name === "search_atlas_docs") retrievedDocs.push(result);
              return { type: "tool_result" as const, tool_use_id: tb.id, content: result };
            })
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

      // Force final text response if loop exhausted without answer
      if (!finalAnswer.trim()) {
        const finalResponse = await anthropic.messages.create({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: buildSystemPrompt(meetingContext),
          tool_choice: { type: "none" },
          tools: TOOLS,
          messages: currentMessages,
        });
        finalAnswer = finalResponse.content
          .filter((b) => b.type === "text")
          .map((b) => (b as Anthropic.Messages.TextBlock).text)
          .join("");
      }
    } else {
      // GPT-4o path for image attachments
      // First: use GPT-4o to analyze the image + answer using its knowledge
      // Then: augment with Atlas RAG via a follow-up Claude call
      const gptMessages = [
        {
          role: "system" as const,
          content: buildSystemPrompt(meetingContext),
        },
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        {
          role: "user" as const,
          content: userContent.map((block) => {
            if (block.type === "text") return { type: "text" as const, text: block.text };
            if (block.type === "image") {
              const src = (block as Anthropic.Messages.ImageBlockParam).source as Anthropic.Messages.Base64ImageSource;
              return {
                type: "image_url" as const,
                image_url: {
                  url: `data:${src.media_type};base64,${src.data}`,
                },
              };
            }
            return { type: "text" as const, text: "[attachment]" };
          }),
        },
      ];

      const gptResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 4096,
        messages: gptMessages,
      });
      finalAnswer = gptResponse.choices[0].message.content ?? "";
    }

    // ── Quality gate — judge answer before persisting to Neo4j ──────────────
    let chatConfidence: { score: number; label: string; reason: string } | null = null;
    let passesGate = true; // default: save (for GPT-4o image path — no judge)

    if (saveSession && meetingContext && model === "claude-sonnet-4-6" && finalAnswer.trim()) {
      // Use docs from the RAG loop if Claude called the tool; otherwise fetch directly for the judge
      let docsForJudge = retrievedDocs.join("\n\n---\n\n").slice(0, 4000);
      if (!docsForJudge) {
        docsForJudge = (await searchAtlasDocs(question)).slice(0, 4000);
      }
      chatConfidence = await judgeChatResponse(question, finalAnswer, docsForJudge);
      passesGate = chatConfidence.score >= 70;
      console.log(`[quality-gate] score=${chatConfidence.score} passes=${passesGate} question="${question.slice(0, 60)}"`);
    }

    // ── Persist to Neo4j if saving and passes quality gate ────────────────────
    let activeSessionId = sessionId;
    if (saveSession && meetingContext && passesGate) {
      if (!activeSessionId) {
        activeSessionId = await createSession(userId, meetingContext, sessionName || undefined, sessionDescription || undefined);
      }
      await saveInteraction(
        activeSessionId,
        question,
        finalAnswer,
        model,
        attachments.length > 0
      );
    }

    return NextResponse.json({
      answer: finalAnswer,
      model,
      sessionId: activeSessionId,
      savedToMemory: passesGate,
      ...(chatConfidence && { confidence: chatConfidence }),
    });
  } catch (err) {
    console.error("Meeting API error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 }
    );
  }
}

// ─── Session management endpoints ────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const userId = searchParams.get("userId") ?? "anonymous";

  if (action === "list") {
    const driver = getNeo4jDriver();
    const session = driver.session();
    try {
      // Own sessions
      const ownResult = await session.run(
        `MATCH (u:User {id: $userId})-[:HAS_SESSION]->(s:MeetingSession)
         OPTIONAL MATCH (s)-[:HAD]->(i:Interaction)
         WITH s, count(i) AS turnCount
         RETURN s.id AS id, s.name AS name, s.description AS description,
                s.customer_industry AS industry,
                s.meeting_type AS meetingType, s.attendees AS attendees,
                s.summary AS summary, s.created_at AS createdAt,
                turnCount
         ORDER BY s.created_at DESC LIMIT 50`,
        { userId }
      );
      // Shared with me
      const sharedResult = await session.run(
        `MATCH (s:MeetingSession)-[:SHARED_WITH]->(u:User {id: $userId})
         MATCH (owner:User)-[:HAS_SESSION]->(s)
         OPTIONAL MATCH (s)-[:HAD]->(i:Interaction)
         WITH s, count(i) AS turnCount, owner.id AS sharedBy
         RETURN s.id AS id, s.name AS name, s.description AS description,
                s.customer_industry AS industry,
                s.meeting_type AS meetingType, s.attendees AS attendees,
                s.summary AS summary, s.created_at AS createdAt,
                turnCount, sharedBy
         ORDER BY s.created_at DESC LIMIT 50`,
        { userId }
      );

      const toSession = (r: import("neo4j-driver").Record, sharedBy: string | null = null) => ({
        id: r.get("id"),
        name: r.get("name") ?? "",
        description: r.get("description") ?? "",
        industry: r.get("industry"),
        meetingType: r.get("meetingType"),
        attendees: r.get("attendees"),
        summary: r.get("summary"),
        createdAt: r.get("createdAt")?.toString() ?? "",
        turnCount: r.get("turnCount")?.toNumber?.() ?? 0,
        sharedBy,
      });

      const own = ownResult.records.map((r) => toSession(r, null));
      const shared = sharedResult.records.map((r) => toSession(r, r.get("sharedBy") ?? null));

      // Merge, deduplicate by id, sort by createdAt desc
      const seen = new Set<string>();
      const sessions = [...own, ...shared]
        .filter((s) => { if (seen.has(s.id)) return false; seen.add(s.id); return true; })
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 50);

      return NextResponse.json({ sessions });
    } finally {
      await session.close();
      await driver.close();
    }
  }

  if (action === "session") {
    const sessionId = searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ error: "sessionId required" }, { status: 400 });

    const driver = getNeo4jDriver();
    const dbSession = driver.session();
    try {
      // Fetch session metadata
      const sessionResult = await dbSession.run(
        `MATCH (s:MeetingSession {id: $sessionId})
         RETURN s.customer_industry AS industry,
                s.meeting_type AS meetingType,
                s.attendees AS attendees,
                s.known_concerns AS knownConcerns,
                s.name AS name,
                s.description AS description`,
        { sessionId }
      );

      if (sessionResult.records.length === 0) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      // Fetch interactions ordered by creation time
      const interactionResult = await dbSession.run(
        `MATCH (s:MeetingSession {id: $sessionId})-[:HAD]->(i:Interaction)
         RETURN i.question AS question, i.answer AS answer,
                i.is_script AS isScript, toString(i.created_at) AS createdAt
         ORDER BY i.created_at ASC`,
        { sessionId }
      );

      const r = sessionResult.records[0];
      const interactions = interactionResult.records.map((i) => {
        const question: string = i.get("question") ?? "";
        const isScriptFlag: boolean = i.get("isScript") ?? false;
        // Fallback: detect script interactions by question text for older saved sessions
        const isScript = isScriptFlag || /generate a \d+-minute demo script/i.test(question);
        return {
          question,
          answer: i.get("answer") ?? "",
          isScript,
          createdAt: i.get("createdAt") ?? "",
        };
      });

      return NextResponse.json({
        industry: r.get("industry") ?? "",
        meetingType: r.get("meetingType") ?? "",
        attendees: r.get("attendees") ?? "",
        knownConcerns: r.get("knownConcerns") ?? "",
        name: r.get("name") ?? "",
        description: r.get("description") ?? "",
        interactions,
      });
    } finally {
      await dbSession.close();
      await driver.close();
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const driver = getNeo4jDriver();
  const session = driver.session();
  try {
    await session.run(
      `MATCH (s:MeetingSession {id: $sessionId})
       OPTIONAL MATCH (s)-[:HAD]->(i:Interaction)
       DETACH DELETE s, i`,
      { sessionId }
    );
    return NextResponse.json({ deleted: true });
  } finally {
    await session.close();
    await driver.close();
  }
}
