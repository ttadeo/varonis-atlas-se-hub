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
      atlasGet<Record<string, unknown>[]>(
        `/v1/llm-firewall/all-endpoint-settings?limit=100&offset=0`,
        token
      ),
    ]);

    const endpoints = Array.isArray(endpointsRaw) ? endpointsRaw : [];
    const projects = extractProjects(projectsData);

    // Build a set of project IDs that have at least one registered endpoint
    const coveredProjectIds = new Set<string>();
    for (const ep of endpoints) {
      if (ep.project_id && typeof ep.project_id === "string") {
        coveredProjectIds.add(ep.project_id);
      }
    }

    const coveredProjects = projects
      .filter((p) => coveredProjectIds.has(String(p.id ?? p.project_id ?? "")))
      .map((p) => ({ name: p.name ?? p.project_name ?? "unnamed", id: p.id ?? p.project_id }));

    const uncoveredProjects = projects
      .filter((p) => !coveredProjectIds.has(String(p.id ?? p.project_id ?? "")))
      .map((p) => ({ name: p.name ?? p.project_name ?? "unnamed", id: p.id ?? p.project_id }));

    const analysis = {
      total_projects: projects.length,
      total_endpoints: endpoints.length,
      covered_projects: coveredProjects,
      uncovered_projects: uncoveredProjects,
      endpoints_without_project: endpoints.filter((e) => !e.project_id).map((e) => e.endpoint_identifier ?? "unnamed"),
      coverage_ratio: projects.length > 0 ? coveredProjects.length / projects.length : 0,
    };

    // Cap project lists to avoid token bloat
    const cappedAnalysis = {
      ...analysis,
      covered_projects: analysis.covered_projects.slice(0, 10),
      uncovered_projects: analysis.uncovered_projects.slice(0, 10),
    };

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system: `You are an AI security analyst detecting Shadow AI in an Atlas tenant.

IMPORTANT: Be extremely concise. Every string field must be under 12 words. findings: exactly 3 items, max 12 words each.

Respond with ONLY valid JSON (no markdown):
{
  "shadow_risk_score": <integer 0-100>,
  "shadow_risk_level": "<low|medium|high|critical>",
  "headline": "<max 12 words>",
  "at_risk_projects": [{"name": "<string>", "reason": "<max 8 words>"}],
  "covered_projects": [{"name": "<string>", "status": "monitored"}],
  "findings": ["<max 12 words>", "<max 12 words>", "<max 12 words>"],
  "cta": "<max 12 words>"
}`,
      messages: [
        {
          role: "user",
          content: `Shadow AI analysis for Atlas tenant:\n${JSON.stringify(cappedAnalysis)}`,
        },
      ],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Claude did not return valid JSON", raw }, { status: 502 });
    }
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ ...result, tenant_analysis: analysis });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

function extractProjects(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== "object") return [];
  const obj = data as Record<string, unknown>;
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
