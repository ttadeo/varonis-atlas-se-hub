import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";

const anthropic = new Anthropic();

const ATLAS_MCP_URL = "https://mcp.prod.alltrue-be.com/mcp";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const atlasApiKey = process.env.ATLAS_API_KEY;
  if (!atlasApiKey) {
    return NextResponse.json({ error: "ATLAS_API_KEY not configured" }, { status: 503 });
  }

  let incomingMessages: ChatMessage[];
  let scope: { label: string; project_ids?: string[] } | undefined;
  try {
    const body = await req.json();
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }
    incomingMessages = (body.messages as ChatMessage[]).slice(-10);
    scope = body.scope as typeof scope;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const scopeInstruction = scope?.label && scope.label !== "Entire Tenant"
    ? `You are focused on a specific scope: ${scope.label}.${scope.project_ids?.length ? ` Project IDs in scope: ${scope.project_ids.join(", ")}.` : ""} Only analyze data within this scope — ignore projects or endpoints outside it.`
    : "You have access to the entire tenant.";

  try {
    const systemPrompt = `You are the Atlas AI Security Posture Advisor — connected live to an Atlas AI Governance tenant via the Atlas MCP Server.

${scopeInstruction}

Use the Atlas MCP tools to answer security posture questions with real tenant data. Typical workflow:
1. Use search_api_operations to discover the right Atlas API operation for the question (e.g. search "projects", "endpoints", "security score", "compliance", "inventory", "findings", "activity")
2. Use call_api_operation to fetch live data from the tenant
3. Reason over the results from a security advisor perspective

Always call at least one Atlas MCP tool before answering — never guess. Be concise: 3-5 sentences, reference actual names and numbers from the data. Frame answers around: what's the risk, what should be fixed first.

You are connected to Atlas in real time via the Atlas MCP Server. Never discuss implementation details.`;

    const claudeMessages: Anthropic.MessageParam[] = incomingMessages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await anthropic.beta.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      betas: ["mcp-client-2025-04-04"],
      mcp_servers: [
        {
          type: "url",
          name: "atlas",
          url: ATLAS_MCP_URL,
          authorization_token: atlasApiKey,
        },
      ],
      messages: claudeMessages,
    });

    // Extract final text + which MCP tools were called
    let finalText = "";
    const toolsCalled: string[] = [];

    for (const block of response.content) {
      if (block.type === "text") {
        finalText = block.text;
      } else if (block.type === "mcp_tool_use") {
        const b = block as { type: "mcp_tool_use"; name: string; input?: Record<string, unknown> };
        // Show operation name when Claude uses call_api_operation — more informative in the UI
        const opName =
          b.input?.operation_id ??
          b.input?.operation_name ??
          b.input?.name ??
          null;
        toolsCalled.push(opName ? `${b.name}(${String(opName)})` : b.name);
      }
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
