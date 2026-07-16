import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";
import { getAtlasJWT, atlasGet } from "@/lib/atlas-api";

const anthropic = new Anthropic();

interface EndpointRecord {
  endpoint_identifier?: string;
  project_id?: string;
  model?: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const token = await getAtlasJWT();

    // Paginate through all endpoint settings
    const PAGE_SIZE = 100;
    const all: EndpointRecord[] = [];
    let offset = 0;
    while (true) {
      const page = await atlasGet<EndpointRecord[]>(
        `/v1/llm-firewall/all-endpoint-settings?limit=${PAGE_SIZE}&offset=${offset}`,
        token
      );
      if (!Array.isArray(page) || page.length === 0) break;
      all.push(...page);
      if (page.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    if (all.length === 0) {
      return NextResponse.json({
        endpoints: [],
        summary: "No LLM endpoints found in this Atlas tenant.",
        total: 0,
      });
    }

    // Cap at 15 endpoints — keeps Claude output well within token limits
    const simplified = all.slice(0, 15).map((ep) => ({
      id: ep.endpoint_identifier ?? "unnamed",
      proj: ep.project_id ?? null,
      model: ep.model ?? null,
      keys: Object.keys(ep).length,
    }));

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are auditing LLM endpoint configurations in an Atlas AI Security tenant.

IMPORTANT: Be extremely concise. Each string field must be under 12 words. missing_policies max 3 items.

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "audited_endpoints": [
    {
      "identifier": "<string>",
      "project_id": "<string or null>",
      "risk_level": "<low|medium|high>",
      "risk_reason": "<max 10 words>",
      "missing_policies": ["<1-3 short policy names>"],
      "recommendation": "<max 10 words>"
    }
  ],
  "overall_posture": "<max 15 words>",
  "high_risk_count": <integer>,
  "medium_risk_count": <integer>,
  "low_risk_count": <integer>
}`,
      messages: [
        {
          role: "user",
          content: `Audit these ${simplified.length} endpoints (${all.length} total in tenant, showing first ${simplified.length}):\n${JSON.stringify(simplified)}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude did not return valid JSON", raw }, { status: 502 });
    }
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ...result, total: all.length });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
