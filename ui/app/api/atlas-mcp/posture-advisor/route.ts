import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";
import { getAtlasJWT, atlasGet, ATLAS_API_URL } from "@/lib/atlas-api";

const anthropic = new Anthropic();

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Tool definitions (Claude tool_use — mirrors the Atlas MCP Server tool surface) ──

const ATLAS_TOOLS: Anthropic.Tool[] = [
  {
    name: "get_tenant_overview",
    description:
      "Get a high-level overview of the Atlas tenant: total projects, total LLM endpoints, monitoring coverage ratio, and orphaned endpoints. Use this first for general posture or risk questions.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_projects",
    description:
      "Get the full list of projects in the Atlas tenant with their names, IDs, and organization structure. Use this when the user asks about specific projects, project ownership, or project-level risk.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_endpoints",
    description:
      "Get all registered LLM endpoint configurations including identifiers, assigned project, model, and available policy configuration keys. Use this for questions about endpoint risk, misconfiguration, or policy gaps.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max endpoints to return (default 50, max 100)" },
      },
      required: [],
    },
  },
  {
    name: "get_firewall_rules",
    description:
      "Get the available LLM firewall policy rule types that can be applied to endpoints in this tenant. Use this for questions about what policies are available, compliance readiness, or what guardrails can be enabled.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_asset_inventory",
    description:
      "Get discovered AI assets and resources across the org — includes shadow AI tools, Copilot usage, AI agents, models, and other AI systems detected by Atlas. Use this for questions about specific AI tools in use, user counts, shadow AI discovery, or the full AI estate.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max assets to return (default 50, max 200)" },
      },
      required: [],
    },
  },
  {
    name: "get_security_score",
    description:
      "Get the overall AI security posture score for this Atlas tenant — a numeric score with category breakdowns. Use this for questions about overall security health, posture grade, or score trends.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_findings",
    description:
      "Get active AI security alerts and the riskiest resources in the tenant. Returns open alerts (severity, type, description) and the top risky resources with their risk scores. Use this for 'what needs my attention right now', 'what should I fix first', or threat triage questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max alerts to return (default 20, max 50)" },
      },
      required: [],
    },
  },
  {
    name: "get_governance_issues",
    description:
      "Get the AI governance needs-attention queue — issues flagged for governance review including policy violations, unapproved models, and compliance gaps. Use this for governance, policy enforcement, or audit-readiness questions.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max issues to return (default 20, max 50)" },
      },
      required: [],
    },
  },
  {
    name: "get_compliance_status",
    description:
      "Get the status of continuous compliance framework assessments — which frameworks are active (EU AI Act, ISO 42001, NIST AI RMF, etc.), their current compliance percentage, and failing controls. Use this for audit readiness, compliance gap, or regulatory questions.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_ai_usage",
    description:
      "Get AI service activity across the organization — which AI services are being used, request volumes, and service-level breakdowns. Use this for questions about AI usage patterns, which teams are using AI, Copilot activity, or usage trends.",
    input_schema: {
      type: "object" as const,
      properties: {
        limit: { type: "number", description: "Max activity records to return (default 50)" },
      },
      required: [],
    },
  },
];

// ─── Atlas tool executor ──────────────────────────────────────────────────────

// Cap tool results to ~40k chars (~10k tokens) to stay well within Claude's context limit
const MAX_TOOL_RESULT_CHARS = 40_000;

function truncateResult(json: string): string {
  if (json.length <= MAX_TOOL_RESULT_CHARS) return json;
  return json.slice(0, MAX_TOOL_RESULT_CHARS) + `\n... [truncated — ${json.length} chars total, showing first ${MAX_TOOL_RESULT_CHARS}]`;
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

async function executeTool(
  toolName: string,
  toolInput: Record<string, unknown>,
  token: string,
  customerId: string
): Promise<string> {
  try {
    switch (toolName) {
      case "get_tenant_overview": {
        const [projectsData, endpointsRaw] = await Promise.all([
          atlasGet<unknown>(`/v1/admin/customers/${customerId}/organizations/projects`, token),
          atlasGet<Record<string, unknown>[]>(
            `/v1/llm-firewall/all-endpoint-settings?limit=100&offset=0`,
            token
          ),
        ]);
        const projects = extractProjects(projectsData);
        const endpoints = Array.isArray(endpointsRaw) ? endpointsRaw : [];
        const coveredIds = new Set(
          endpoints.filter((e) => e.project_id).map((e) => String(e.project_id))
        );
        const covered = projects.filter((p) =>
          coveredIds.has(String(p.id ?? p.project_id ?? ""))
        ).length;
        const orphaned = endpoints.filter((e) => !e.project_id).length;
        return JSON.stringify({
          total_projects: projects.length,
          total_endpoints: endpoints.length,
          monitored_projects: covered,
          unmonitored_projects: projects.length - covered,
          coverage_percent: projects.length > 0 ? Math.round((covered / projects.length) * 100) : 0,
          orphaned_endpoints: orphaned,
        });
      }

      case "get_projects": {
        const data = await atlasGet<unknown>(
          `/v1/admin/customers/${customerId}/organizations/projects`,
          token
        );
        const projects = extractProjects(data);
        return JSON.stringify(
          projects.slice(0, 50).map((p) => ({
            name: p.name ?? p.project_name ?? "unnamed",
            id: p.id ?? p.project_id,
            org: p.org_name ?? p.organization_name ?? null,
          }))
        );
      }

      case "get_endpoints": {
        const limit = Math.min(Number(toolInput.limit ?? 50), 100);
        const data = await atlasGet<Record<string, unknown>[]>(
          `/v1/llm-firewall/all-endpoint-settings?limit=${limit}&offset=0`,
          token
        );
        const endpoints = Array.isArray(data) ? data : [];
        return JSON.stringify(
          endpoints.map((ep) => ({
            identifier: ep.endpoint_identifier ?? "unnamed",
            project_id: ep.project_id ?? null,
            model: ep.model ?? null,
            config_keys: Object.keys(ep),
          }))
        );
      }

      case "get_firewall_rules": {
        const data = await atlasGet<unknown>(`/v1/llm-firewall/rules`, token);
        return JSON.stringify(data);
      }

      case "get_asset_inventory": {
        const limit = Math.min(Number(toolInput.limit ?? 50), 100);
        const res = await fetch(
          `${ATLAS_API_URL}/v1/inventory/customer/${customerId}/resources?limit=${limit}&offset=0`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!res.ok) {
          return JSON.stringify({ error: `Inventory API returned ${res.status}`, items: [] });
        }
        const raw = await res.json();
        // Slim each item to only the fields Claude needs — avoids context overflow
        const items: unknown[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.resources)
          ? raw.resources
          : [];
        const slimmed = items.slice(0, 50).map((item) => {
          const r = item as Record<string, unknown>;
          return {
            name: r.name ?? r.resource_name ?? r.tool_name ?? r.service_name ?? "unknown",
            type: r.type ?? r.resource_type ?? r.category ?? null,
            user_count: r.user_count ?? r.users ?? r.num_users ?? null,
            risk_level: r.risk_level ?? r.risk ?? null,
            status: r.status ?? null,
          };
        });
        return truncateResult(JSON.stringify({ total: items.length, assets: slimmed }));
      }

      case "get_security_score": {
        const res = await fetch(
          `${ATLAS_API_URL}/v1/ai-360/customer/${customerId}/ai-security-score`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!res.ok) {
          return JSON.stringify({ error: `Security score API returned ${res.status}` });
        }
        const data = await res.json();
        return JSON.stringify(data);
      }

      case "get_findings": {
        const limit = Math.min(Number(toolInput.limit ?? 20), 50);
        const [alertsRes, riskiestRes] = await Promise.all([
          fetch(`${ATLAS_API_URL}/v1/ai-360/alerts?limit=${limit}&offset=0`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }),
          fetch(`${ATLAS_API_URL}/v1/ai-360/customer/${customerId}/riskiest-resources?limit=10`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }),
        ]);

        const alerts = alertsRes.ok ? await alertsRes.json() : { error: `Alerts API returned ${alertsRes.status}` };
        const riskiest = riskiestRes.ok ? await riskiestRes.json() : { error: `Riskiest resources API returned ${riskiestRes.status}` };

        return JSON.stringify({ alerts, riskiest_resources: riskiest });
      }

      case "get_governance_issues": {
        const limit = Math.min(Number(toolInput.limit ?? 20), 50);
        const res = await fetch(
          `${ATLAS_API_URL}/v2/ai-governance/needs-attention-queue?limit=${limit}&offset=0`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!res.ok) {
          return JSON.stringify({ error: `Governance API returned ${res.status}` });
        }
        const data = await res.json();
        return JSON.stringify(data);
      }

      case "get_compliance_status": {
        const res = await fetch(
          `${ATLAS_API_URL}/v1/control-plane/continuous-compliance/frameworks`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!res.ok) {
          return JSON.stringify({ error: `Compliance API returned ${res.status}` });
        }
        const data = await res.json();
        return JSON.stringify(data);
      }

      case "get_ai_usage": {
        const limit = Math.min(Number(toolInput.limit ?? 50), 100);
        const res = await fetch(
          `${ATLAS_API_URL}/v1/ai-service-activity?limit=${limit}&offset=0`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(15000),
          }
        );
        if (!res.ok) {
          return JSON.stringify({ error: `AI usage API returned ${res.status}` });
        }
        const raw = await res.json();
        const items: unknown[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.items)
          ? raw.items
          : Array.isArray(raw?.activity)
          ? raw.activity
          : [];
        const slimmed = items.slice(0, 50).map((item) => {
          const r = item as Record<string, unknown>;
          return {
            service: r.service ?? r.service_name ?? r.name ?? "unknown",
            user_count: r.user_count ?? r.users ?? r.num_users ?? null,
            request_count: r.request_count ?? r.requests ?? r.total_requests ?? null,
            type: r.type ?? r.service_type ?? null,
          };
        });
        return truncateResult(JSON.stringify({ total: items.length, usage: slimmed }));
      }

      default:
        return JSON.stringify({ error: `Unknown tool: ${toolName}` });
    }
  } catch (err) {
    return JSON.stringify({ error: String(err) });
  }
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const customerId = process.env.ATLAS_CUSTOMER_ID;
  if (!customerId) {
    return NextResponse.json({ error: "ATLAS_CUSTOMER_ID not configured" }, { status: 503 });
  }

  let incomingMessages: ChatMessage[];
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }
    incomingMessages = (body.messages as ChatMessage[]).slice(-10);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const token = await getAtlasJWT();

    const systemPrompt = `You are the Atlas AI Security Posture Advisor — an AI assistant connected to a live Atlas AI Governance tenant via the Atlas MCP Server. You have tools to query real tenant data.

Always call at least one tool before answering — never guess or make up data. Use the tools that are most relevant to the user's question. You may call multiple tools if needed.

Be concise: 3-5 sentences in your final answer. Reference actual names and numbers from the tool results. Frame answers from a security advisor perspective — what's the risk, what should be fixed first.

Never reveal implementation details. If asked whether you're connected to Atlas, say yes — you query Atlas in real time via MCP tools.`;

    // Build message history in Anthropic format
    const claudeMessages: Anthropic.MessageParam[] = incomingMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const toolsCalled: string[] = [];
    let finalText = "";
    const MAX_ITERATIONS = 6;

    // ── Agentic tool_use loop ──────────────────────────────────────────────────
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        tools: ATLAS_TOOLS,
        messages: claudeMessages,
      });

      if (response.stop_reason === "end_turn") {
        for (const block of response.content) {
          if (block.type === "text") {
            finalText = block.text;
            break;
          }
        }
        break;
      }

      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter(
          (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
        );

        if (toolUseBlocks.length === 0) break;

        claudeMessages.push({ role: "assistant", content: response.content });

        const toolResults: Anthropic.ToolResultBlockParam[] = [];
        for (const toolUse of toolUseBlocks) {
          toolsCalled.push(toolUse.name);
          const result = await executeTool(
            toolUse.name,
            (toolUse.input as Record<string, unknown>) ?? {},
            token,
            customerId
          );
          // Final safety net: never send > 40k chars of tool result to Claude
          toolResults.push({
            type: "tool_result",
            tool_use_id: toolUse.id,
            content: truncateResult(result),
          });
        }

        claudeMessages.push({ role: "user", content: toolResults });
        continue;
      }

      break;
    }

    if (!finalText) {
      finalText = "I was unable to complete the analysis. Please try again.";
    }

    return NextResponse.json({
      response: finalText,
      tools_called: [...new Set(toolsCalled)],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
