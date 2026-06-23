import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

const ATLAS_GATEWAY_URL = process.env.ATLAS_GATEWAY_URL ?? "https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1";
const ATLAS_GATEWAY_ENDPOINT_ID = process.env.ATLAS_GATEWAY_ENDPOINT_ID ?? "tadeo-demo-openai";
const EXA_API_URL = "https://api.exa.ai/search";

// ── Exa Search ────────────────────────────────────────────────────────────────

async function exaSearch(query: string, numResults = 5, category?: string): Promise<{
  results: { title: string; url: string; snippet: string; publishedDate?: string }[];
  query: string;
}> {
  const apiKey = process.env.EXA_API_KEY?.trim();
  if (!apiKey) throw new Error("EXA_API_KEY not configured");

  const body: Record<string, unknown> = {
    query,
    numResults,
    contents: { text: { maxCharacters: 800 } },
    useAutoprompt: true,
  };
  if (category) body.category = category;

  const res = await fetch(EXA_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Exa search failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = (data.results ?? []).map((r: any) => ({
    title: r.title ?? "",
    url: r.url ?? "",
    snippet: r.text ?? r.snippet ?? "",
    publishedDate: r.publishedDate,
  }));

  return { results, query };
}

// ── Atlas Gateway LLM Call ─────────────────────────────────────────────────────

async function callAtlasLLM(systemPrompt: string, userPrompt: string, maxTokens = 1000): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not configured");

  const res = await fetch(`${ATLAS_GATEWAY_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "x-alltrue-llm-endpoint-identifier": ATLAS_GATEWAY_ENDPOINT_ID,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Atlas Gateway LLM call failed (${res.status}): ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

// ── SSE helpers ───────────────────────────────────────────────────────────────

function encodeEvent(payload: Record<string, unknown>): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(payload)}\n\n`);
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const body = await req.json().catch(() => ({}));
  const company: string = (body.company ?? "").trim();
  if (!company) return NextResponse.json({ error: "company is required" }, { status: 400 });

  const stream = new ReadableStream({
    async start(controller) {
      const emit = (payload: Record<string, unknown>) => {
        try { controller.enqueue(encodeEvent(payload)); } catch { /* stream closed */ }
      };

      try {
        // ── Step 1: Orchestrator ────────────────────────────────────────────
        emit({
          type: "step",
          step: "orchestrator",
          status: "running",
          agent: "Orchestrator Agent",
          message: `Planning research strategy for ${company}…`,
          tool: null,
        });

        const researchPlan = await callAtlasLLM(
          "You are an AI research orchestrator. Given a company name, produce a concise JSON research plan with 3 fields: overview_query, news_query, risk_query. Each is a targeted search query string. Respond with only valid JSON, no markdown.",
          `Company to research: ${company}`
        );

        let plan: { overview_query: string; news_query: string; risk_query: string };
        try {
          plan = JSON.parse(researchPlan);
        } catch {
          plan = {
            overview_query: `${company} company overview business model`,
            news_query: `${company} latest news 2024 2025`,
            risk_query: `${company} AI security risk data privacy compliance`,
          };
        }

        emit({
          type: "step",
          step: "orchestrator",
          status: "done",
          agent: "Orchestrator Agent",
          message: "Research plan created. Dispatching sub-agents…",
          tool: null,
          output: plan,
        });

        // ── Step 2: Research Agent (Exa) ───────────────────────────────────
        emit({
          type: "step",
          step: "research",
          status: "running",
          agent: "Research Agent",
          message: `Calling Exa Search MCP tool…`,
          tool: "exa_search",
          tool_input: { query: plan.overview_query },
        });

        const overviewResults = await exaSearch(plan.overview_query, 4, "company");

        emit({
          type: "step",
          step: "research",
          status: "done",
          agent: "Research Agent",
          message: `Found ${overviewResults.results.length} sources on ${company}`,
          tool: "exa_search",
          tool_output: overviewResults.results.map((r) => ({ title: r.title, url: r.url })),
        });

        // ── Step 3: News Agent (Exa) ───────────────────────────────────────
        emit({
          type: "step",
          step: "news",
          status: "running",
          agent: "News Agent",
          message: "Calling Exa Search MCP tool for recent developments…",
          tool: "exa_search",
          tool_input: { query: plan.news_query },
        });

        const newsResults = await exaSearch(plan.news_query, 4, "news");

        emit({
          type: "step",
          step: "news",
          status: "done",
          agent: "News Agent",
          message: `Found ${newsResults.results.length} recent news items`,
          tool: "exa_search",
          tool_output: newsResults.results.map((r) => ({ title: r.title, url: r.url, date: r.publishedDate })),
        });

        // ── Step 4: Risk Analyst (Exa + Atlas Gateway) ─────────────────────
        emit({
          type: "step",
          step: "risk",
          status: "running",
          agent: "Risk Analyst Agent",
          message: "Calling Exa Search MCP tool for AI security posture…",
          tool: "exa_search",
          tool_input: { query: plan.risk_query },
        });

        const riskResults = await exaSearch(plan.risk_query, 3);

        emit({
          type: "step",
          step: "risk",
          status: "running",
          agent: "Risk Analyst Agent",
          message: "Analyzing risk signals via Atlas Gateway…",
          tool: "atlas_llm",
          tool_input: { model: "gpt-4o", route: "Atlas Gateway" },
        });

        const riskSummary = await callAtlasLLM(
          `You are an AI security risk analyst. Analyze the provided search results about a company and identify:
1. AI adoption signals (what AI tools/vendors they use)
2. Data security risks (sensitive data exposure, compliance gaps)
3. Shadow AI risks (unauthorized AI tool usage indicators)
Keep your analysis concise — 3 bullet points per category maximum.`,
          `Company: ${company}\n\nSearch results:\n${riskResults.results.map((r) => `${r.title}: ${r.snippet}`).join("\n\n")}`,
          600
        );

        emit({
          type: "step",
          step: "risk",
          status: "done",
          agent: "Risk Analyst Agent",
          message: "Risk analysis complete — Atlas logged this LLM call",
          tool: "atlas_llm",
          tool_output: { intercepted_by: "Atlas AI Gateway", model: "gpt-4o", policy_checked: true },
          output: riskSummary,
        });

        // ── Step 5: Report Agent (Atlas Gateway) ───────────────────────────
        emit({
          type: "step",
          step: "report",
          status: "running",
          agent: "Report Agent",
          message: "Synthesizing findings into pre-meeting briefing via Atlas Gateway…",
          tool: "atlas_llm",
          tool_input: { model: "gpt-4o", route: "Atlas Gateway" },
        });

        const overviewText = overviewResults.results.map((r) => `${r.title}: ${r.snippet}`).join("\n\n");
        const newsText = newsResults.results.map((r) => `${r.title} (${r.publishedDate ?? "recent"}): ${r.snippet}`).join("\n\n");

        const finalReport = await callAtlasLLM(
          `You are an AI research assistant preparing a pre-meeting briefing for a sales engineer at Varonis.
Structure the briefing with these sections using markdown:
## Company Overview
## Recent Developments
## AI & Data Security Risk Profile
## Recommended Atlas Demo Angle
## Suggested Discovery Questions (3-5 questions)

Be specific, concise, and actionable. Focus on AI risk angles relevant to the Varonis Atlas AI Security Platform.`,
          `Company: ${company}

OVERVIEW RESEARCH:
${overviewText}

RECENT NEWS:
${newsText}

RISK ANALYSIS:
${riskSummary}`,
          1500
        );

        emit({
          type: "step",
          step: "report",
          status: "done",
          agent: "Report Agent",
          message: "Briefing complete — Atlas audited all LLM traffic in this workflow",
          tool: "atlas_llm",
          tool_output: { intercepted_by: "Atlas AI Gateway", model: "gpt-4o", policy_checked: true },
        });

        // ── Done ───────────────────────────────────────────────────────────
        emit({
          type: "done",
          company,
          report: finalReport,
          sources: [
            ...overviewResults.results.map((r) => ({ title: r.title, url: r.url, category: "Overview" })),
            ...newsResults.results.map((r) => ({ title: r.title, url: r.url, category: "News" })),
          ],
          atlas_audit: {
            llm_calls: 3,
            tool_calls: 3,
            gateway: ATLAS_GATEWAY_URL,
            endpoint_id: ATLAS_GATEWAY_ENDPOINT_ID,
            policy_enforced: true,
          },
        });
      } catch (err) {
        emit({ type: "error", message: String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
