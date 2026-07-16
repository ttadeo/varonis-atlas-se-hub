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

    // Strip down each endpoint to what Claude needs — avoid sending huge raw configs
    const simplified = all.map((ep) => ({
      identifier: ep.endpoint_identifier ?? "unnamed",
      project_id: ep.project_id ?? null,
      model: ep.model ?? null,
      raw_keys: Object.keys(ep),
    }));

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: `You are auditing LLM endpoint configurations in an Atlas AI Security tenant.

For each endpoint, assess risk based on: identifier naming conventions (generic names = higher risk), whether a project is assigned, the model being used, and available configuration keys. Common Atlas policy keys include: pii_detection, prompt_injection, content_policy, data_loss_prevention, toxicity, guardrails, logging.

Respond with ONLY valid JSON (no markdown) in this shape:
{
  "audited_endpoints": [
    {
      "identifier": "<string>",
      "project_id": "<string or null>",
      "risk_level": "<low|medium|high>",
      "risk_reason": "<one sentence>",
      "missing_policies": ["<policy 1>", ...],
      "recommendation": "<one actionable sentence>"
    }
  ],
  "overall_posture": "<one sentence summary of the fleet's security posture>",
  "high_risk_count": <integer>,
  "medium_risk_count": <integer>,
  "low_risk_count": <integer>
}`,
      messages: [
        {
          role: "user",
          content: `Audit these ${simplified.length} LLM endpoints from the Atlas tenant:\n\n${JSON.stringify(simplified, null, 2)}`,
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
