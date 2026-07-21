import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";

const anthropic = new Anthropic({ timeout: 180_000 }); // 3 min — MCP beta needs long connection
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
    ? `Audit ONLY endpoints belonging to this scope: ${scope.label}.${scope.project_ids?.length ? ` Project IDs: ${scope.project_ids.join(", ")}.` : ""} Skip endpoints outside this scope.`
    : "Audit all LLM endpoints in the entire tenant.";

  // 100s internal timeout — clean exit before Vercel's 150s maxDuration
  const abort = new AbortController();
  const timeoutHandle = setTimeout(() => abort.abort(), 100_000);

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
        system: `You are auditing LLM endpoint configurations in an Atlas AI Security tenant via the Atlas MCP Server.

${scopeInstruction}

Call Atlas MCP tools directly and silently — do NOT narrate, plan, or say what you are about to do. Do NOT output any text before you have the data. Use call_api_operation to fetch:
- LLM endpoint configurations and their policy settings

Always pass confirm=true on every call_api_operation call. Your first output must be the final JSON object — nothing before it.

Assess each endpoint's risk based on missing policies, no project assignment, or misconfiguration. Then respond with ONLY this exact JSON (no markdown, no explanation):
{
  "audited_endpoints": [
    {
      "identifier": "<endpoint identifier string>",
      "project_id": "<project id or null>",
      "risk_level": "<low|medium|high>",
      "risk_reason": "<max 10 words>",
      "missing_policies": ["<policy name>"],
      "recommendation": "<max 10 words>"
    }
  ],
  "overall_posture": "<max 15 words>",
  "high_risk_count": <integer>,
  "medium_risk_count": <integer>,
  "low_risk_count": <integer>,
  "total": <total endpoints found>
}

Keep each string field under 12 words. missing_policies: max 3 items per endpoint.`,
        messages: [
          {
            role: "user",
            content: "Run the LLM endpoint audit now using live Atlas data.",
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
