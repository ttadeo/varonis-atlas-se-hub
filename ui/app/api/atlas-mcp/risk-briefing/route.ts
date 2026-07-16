import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";
import { getAtlasJWT, atlasGet } from "@/lib/atlas-api";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const customerId = process.env.ATLAS_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: "ATLAS_CUSTOMER_ID not configured" }, { status: 503 });
  }

  try {
    const token = await getAtlasJWT();

    const [projectsData, endpointsRaw] = await Promise.all([
      atlasGet<unknown>(`/v1/admin/customers/${customerId}/organizations/projects`, token),
      atlasGet<unknown[]>(`/v1/llm-firewall/all-endpoint-settings?limit=100&offset=0`, token),
    ]);

    // Summarize what we fetched for Claude — avoid sending full raw payload
    const endpoints = Array.isArray(endpointsRaw) ? endpointsRaw : [];
    const projects = extractProjects(projectsData);

    const summary = {
      total_projects: projects.length,
      projects: projects.map((p) => ({
        name: p.name ?? p.project_name ?? p.id ?? "unknown",
        id: p.id ?? p.project_id ?? null,
        org: p.org_name ?? p.organization_name ?? null,
      })),
      total_endpoints: endpoints.length,
      endpoints: endpoints.map((e) => ({
        identifier: (e as Record<string, unknown>).endpoint_identifier ?? "unknown",
        project_id: (e as Record<string, unknown>).project_id ?? null,
        model: (e as Record<string, unknown>).model ?? null,
        policies_enabled: extractPolicies(e as Record<string, unknown>),
      })),
    };

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: `You are an Atlas AI Security analyst generating an executive AI Risk Briefing from live tenant data.

Respond with ONLY valid JSON (no markdown, no explanation) in this exact shape:
{
  "risk_score": <integer 0-100, higher = more risk>,
  "risk_level": "<low|medium|high|critical>",
  "headline": "<one sentence executive summary of the AI security posture>",
  "findings": ["<finding 1>", "<finding 2>", "<finding 3>"],
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"],
  "data_sources_used": ["Atlas Projects API", "Atlas Endpoint Settings API"]
}

Base your analysis on: number of projects vs monitored endpoints (coverage gaps = higher risk), endpoint count, and any identifiable patterns. If the tenant looks well-configured, give a lower risk score with positive findings.`,
      messages: [
        {
          role: "user",
          content: `Here is live data from the Atlas tenant:\n\n${JSON.stringify(summary, null, 2)}\n\nGenerate the AI Risk Briefing JSON.`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude did not return valid JSON", raw }, { status: 502 });
    }
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ...result, tenant_snapshot: summary });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function extractProjects(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
  // Shape: { organizations: [ { projects: [...] } ] }
  if (Array.isArray(obj.organizations)) {
    const all: Record<string, unknown>[] = [];
    for (const org of obj.organizations as Record<string, unknown>[]) {
      if (Array.isArray(org.projects)) all.push(...(org.projects as Record<string, unknown>[]));
    }
    return all;
  }
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  return [];
}

function extractPolicies(endpoint: Record<string, unknown>): string[] {
  const policies: string[] = [];
  const check = (key: string, label: string) => {
    const val = endpoint[key];
    if (val === true || val === "enabled" || (typeof val === "object" && val !== null)) {
      policies.push(label);
    }
  };
  check("pii_detection", "PII Detection");
  check("prompt_injection", "Prompt Injection");
  check("content_policy", "Content Policy");
  check("data_loss_prevention", "DLP");
  check("toxicity", "Toxicity Filter");
  check("guardrails", "Guardrails");
  // Generic fallback — any key that looks like a policy
  for (const [k, v] of Object.entries(endpoint)) {
    if (
      (k.includes("policy") || k.includes("detection") || k.includes("filter") || k.includes("guard")) &&
      !policies.some((p) => p.toLowerCase().includes(k.toLowerCase())) &&
      (v === true || v === "enabled")
    ) {
      policies.push(k);
    }
  }
  return policies;
}
