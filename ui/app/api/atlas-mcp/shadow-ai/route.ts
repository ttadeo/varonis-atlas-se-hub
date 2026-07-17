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
    ? `Analyze ONLY the following scope for shadow AI risk: ${scope.label}.${scope.project_ids?.length ? ` Project IDs: ${scope.project_ids.join(", ")}.` : ""} Limit your analysis to projects in this scope.`
    : "Analyze the entire tenant for shadow AI risk.";

  // 75s internal timeout — clean exit before Vercel's 120s maxDuration
  const abort = new AbortController();
  const timeoutHandle = setTimeout(() => abort.abort(), 75_000);

  try {
    const response = await anthropic.beta.messages.create(
      {
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        betas: ["mcp-client-2025-04-04"],
        mcp_servers: [
          {
            type: "url",
            name: "atlas",
            url: ATLAS_MCP_URL,
            authorization_token: atlasApiKey,
          },
        ],
        system: `You are detecting Shadow AI risk in an Atlas AI Governance tenant via the Atlas MCP Server.

${scopeInstruction}

Shadow AI = AI projects or usage with no registered LLM endpoints in Atlas (unmonitored blind spots).

Steps:
1. Use Atlas MCP tools to fetch all projects and all registered LLM endpoints.
2. Cross-reference: projects WITH endpoints are monitored (covered). Projects WITHOUT endpoints are potential shadow AI.
3. Also check asset inventory if available for discovered AI tools outside Atlas control.
4. Respond with ONLY this exact JSON (no markdown, no explanation):
{
  "shadow_risk_score": <integer 0-100, higher = more unmonitored AI>,
  "shadow_risk_level": "<low|medium|high|critical>",
  "headline": "<max 12 words>",
  "at_risk_projects": [{"name": "<project name>", "reason": "<max 8 words>"}],
  "covered_projects": [{"name": "<project name>", "status": "monitored"}],
  "findings": ["<max 12 words>", "<max 12 words>", "<max 12 words>"],
  "cta": "<max 12 words — recommended next action>",
  "tenant_analysis": {
    "total_projects": <integer>,
    "total_endpoints": <integer>,
    "coverage_ratio": <float 0.0-1.0>
  }
}`,
        messages: [
          {
            role: "user",
            content: "Generate the Shadow AI Report now using live Atlas data.",
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
