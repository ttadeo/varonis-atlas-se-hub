import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";

const anthropic = new Anthropic();
const ATLAS_MCP_URL = "https://mcp.prod.alltrue-be.com/mcp/";

interface ScopeSelection {
  label: string;
  project_ids?: string[];
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const atlasApiKey = process.env.ATLAS_API_KEY;
  if (!atlasApiKey) {
    return NextResponse.json({ error: "ATLAS_API_KEY not configured" }, { status: 503 });
  }

  let scope: ScopeSelection | undefined;
  try {
    const body = await req.json().catch(() => ({}));
    scope = body.scope as ScopeSelection | undefined;
  } catch {
    // scope is optional
  }

  const scopeInstruction = scope?.label && scope.label !== "Entire Tenant"
    ? `Focus your analysis ONLY on this scope: ${scope.label}.${scope.project_ids?.length ? ` Project IDs: ${scope.project_ids.join(", ")}.` : ""} Ignore data from projects outside this scope.`
    : "Analyze the entire tenant.";

  // 75s internal timeout — clean exit before Vercel's 120s maxDuration
  const abort = new AbortController();
  const timeoutHandle = setTimeout(() => abort.abort(), 75_000);

  try {
    const response = await anthropic.beta.messages.create(
      {
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        betas: ["mcp-client-2025-04-04"],
        mcp_servers: [
          {
            type: "url",
            name: "atlas",
            url: ATLAS_MCP_URL,
            authorization_token: atlasApiKey,
          },
        ],
        system: `You are generating an executive AI Risk Briefing from live Atlas tenant data via the Atlas MCP Server.

${scopeInstruction}

Steps:
1. Use Atlas MCP tools to fetch projects, LLM endpoint configurations, and any available security score or findings data.
2. Analyze the data from a security perspective.
3. Respond with ONLY this exact JSON (no markdown, no explanation, no surrounding text):
{
  "risk_score": <integer 0-100, based on coverage gaps and misconfigurations>,
  "risk_level": "<low|medium|high|critical>",
  "headline": "<max 15 words summarizing the posture>",
  "findings": ["<max 12 words>", "<max 12 words>", "<max 12 words>"],
  "recommendations": ["<max 12 words>", "<max 12 words>", "<max 12 words>"],
  "data_sources_used": ["<list the Atlas API operations you called>"],
  "tenant_snapshot": {
    "total_projects": <integer>,
    "total_endpoints": <integer>
  }
}`,
        messages: [
          {
            role: "user",
            content: "Generate the AI Risk Briefing now using live Atlas data.",
          },
        ],
      },
      { signal: abort.signal }
    );

    const textBlock = response.content.find((b) => b.type === "text");
    const raw = textBlock?.type === "text" ? textBlock.text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude did not return valid JSON", raw }, { status: 502 });
    }
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    const isTimeout = (err as Error)?.name === "AbortError" || String(err).includes("aborted");
    if (isTimeout) {
      return NextResponse.json(
        { error: "The Atlas MCP Server is taking too long. Please try again in a moment." },
        { status: 504 }
      );
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    clearTimeout(timeoutHandle);
  }
}
