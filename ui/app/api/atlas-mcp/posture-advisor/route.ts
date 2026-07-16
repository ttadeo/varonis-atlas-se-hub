import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";
import { getAtlasJWT, atlasGet } from "@/lib/atlas-api";

const anthropic = new Anthropic();

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface EndpointRecord {
  endpoint_identifier?: string;
  project_id?: string;
  model?: string;
  [key: string]: unknown;
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

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const customerId = process.env.ATLAS_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: "ATLAS_CUSTOMER_ID not configured" }, { status: 503 });
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }
    messages = (body.messages as ChatMessage[]).slice(-10);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const token = await getAtlasJWT();

    const [projectsData, endpointsRaw] = await Promise.all([
      atlasGet<unknown>(`/v1/admin/customers/${customerId}/organizations/projects`, token),
      atlasGet<EndpointRecord[]>(`/v1/llm-firewall/all-endpoint-settings?limit=100&offset=0`, token),
    ]);

    const endpoints = Array.isArray(endpointsRaw) ? endpointsRaw : [];
    const projects = extractProjects(projectsData);

    const coveredProjectIds = new Set<string>();
    for (const ep of endpoints) {
      if (ep.project_id && typeof ep.project_id === "string") {
        coveredProjectIds.add(ep.project_id);
      }
    }

    const coveredProjectCount = projects.filter(
      (p) => coveredProjectIds.has(String(p.id ?? p.project_id ?? ""))
    ).length;
    const uncoveredProjectCount = projects.length - coveredProjectCount;
    const coverageRatio = projects.length > 0
      ? Math.round((coveredProjectCount / projects.length) * 100)
      : 0;
    const orphanedEndpoints = endpoints.filter((ep) => !ep.project_id);

    const projectNames = projects
      .slice(0, 20)
      .map((p) => String(p.name ?? p.project_name ?? p.id ?? "unnamed"));

    const endpointIdentifiers = endpoints
      .slice(0, 20)
      .map((ep) => String(ep.endpoint_identifier ?? "unnamed"));

    const systemPrompt = `You are an AI Security Posture Advisor with live access to this Atlas AI Governance tenant.

## Live Tenant Snapshot (fetched moments ago)

- Total projects: ${projects.length}
- Project names: ${projectNames.length > 0 ? projectNames.join(", ") : "none found"}
- Total LLM endpoints registered: ${endpoints.length}
- Endpoint identifiers: ${endpointIdentifiers.length > 0 ? endpointIdentifiers.join(", ") : "none found"}
- Projects with at least one registered endpoint (monitored): ${coveredProjectCount}
- Projects with no registered endpoints (unmonitored): ${uncoveredProjectCount}
- Monitoring coverage: ${coverageRatio}%
- Orphaned endpoints (no project assigned): ${orphanedEndpoints.length}

## Instructions

- Reference actual project names and endpoint identifiers from the snapshot above — never use placeholders.
- Be a direct, concise security advisor. 3–5 sentences per answer maximum.
- Prioritize actionability: what to fix first, what an attacker would target, what a compliance auditor would flag.
- If asked about things not in the snapshot (alert history, policy violations, user behavior), say so honestly and describe what Atlas can tell you from available data.
- Do not repeat the full snapshot back unless the user explicitly asks for it.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: responseText });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
