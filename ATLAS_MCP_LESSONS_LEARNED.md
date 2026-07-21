# Atlas MCP Server — Integration Lessons Learned

**Date:** 2026-07-21  
**Author:** Tim Tadeo — Varonis SE  
**Context:** Building 4 AI-powered apps using the Atlas MCP Server via Anthropic SDK beta (`mcp-client-2025-04-04`). All issues resolved. Documented here so others don't repeat the same debugging journey.

---

## Architecture We Were Building

```
Browser → Vercel API route → Anthropic SDK (beta mcp-client-2025-04-04)
  → Atlas MCP Server (mcp.prod.alltrue-be.com/mcp/)
    → Atlas Control Plane REST API
```

Claude autonomously calls Atlas MCP tools (`search_api_operations`, `call_api_operation`) to fetch live tenant data and return structured JSON or conversational answers.

---

## Issue 1 — Trailing Slash Required on MCP URL

**Symptom:** Every MCP call triggered a 307 redirect, adding latency to every request.

**Root cause:** The Atlas MCP Server URL requires a trailing slash.

```
❌ https://mcp.prod.alltrue-be.com/mcp
✅ https://mcp.prod.alltrue-be.com/mcp/
```

**Fix:** Always use the trailing slash in your MCP server URL configuration. Without it, every Anthropic SDK call gets a 307 redirect before the actual request.

---

## Issue 2 — Anthropic SDK Default Timeout Too Low for MCP Beta

**Symptom:** All MCP routes returning 504. Vercel logs showed:

```
POST api.anthropic.com/v1/messages → Timeout → 54.47s
```

**Root cause:** The Anthropic SDK has a default HTTP connection timeout (~60s). The MCP beta involves multiple sequential tool call round-trips — each one is a full Anthropic → Atlas MCP → Atlas REST API cycle. With 3-6 tool calls, total time easily exceeds 60s.

**Fix:** Set an explicit timeout on the Anthropic client at instantiation:

```ts
const anthropic = new Anthropic({ timeout: 180_000 }); // 3 min for report apps
const anthropic = new Anthropic({ timeout: 240_000 }); // 4 min for conversational chat
```

Also set your server-side AbortController and Vercel `maxDuration` generously:

```ts
// Server-side abort — fires before Vercel hard-kills
const abort = new AbortController();
const timeoutHandle = setTimeout(() => abort.abort(), 100_000); // 100s
```

```json
// vercel.json
{
  "functions": {
    "app/api/atlas-mcp/posture-advisor/route.ts": { "maxDuration": 300 },
    "app/api/atlas-mcp/risk-briefing/route.ts": { "maxDuration": 150 },
    "app/api/atlas-mcp/endpoint-audit/route.ts": { "maxDuration": 150 },
    "app/api/atlas-mcp/shadow-ai/route.ts": { "maxDuration": 150 }
  }
}
```

---

## Issue 3 — CONFIRMATION_REQUIRED Gate Breaks Single-Shot Apps

**Symptom:** Report card apps returning "Claude did not return valid JSON." Claude's actual response was conversational text like: *"I'll fetch the live Atlas data immediately — calling both the projects list and LLM endpoint configurations in parallel right now."*

**Root cause:** The Atlas MCP Server has a risk-based confirmation gate on `call_api_operation`. Operations at or above the configured risk threshold return `CONFIRMATION_REQUIRED` before executing. In a conversational flow (like the Posture Advisor chat), Claude can ask the user "shall I proceed?" and the user responds "yes." In single-shot report generation apps, there is no back-and-forth — Claude receives `CONFIRMATION_REQUIRED` and responds with a confirmation request (text), not JSON. The app's JSON parser finds nothing and fails.

**Fix:** Instruct Claude in the system prompt to always pass `confirm=true` on every `call_api_operation` call:

```
Always pass confirm=true on every call_api_operation call.
Do not wait for confirmation — proceed immediately.
```

This bypasses the confirmation gate and forces immediate execution. Only do this for read-only operations — do not use `confirm=true` for write/destructive operations.

---

## Issue 4 — Claude Planning Narration Returned as Final Response

**Symptom:** After fixing Issue 3, report cards still failing with "Claude did not return valid JSON." Claude's actual response was: *"I'll fetch the live Atlas data immediately — calling both the projects list and LLM endpoint configurations in parallel right now."*

**Root cause:** The Anthropic MCP beta (`mcp-client-2025-04-04`) processes all tool calls server-side in a single API call. When Claude decides to make tool calls, it sometimes emits an intermediate text block ("I'll now fetch...") before the tool use blocks. If Claude's `max_tokens` budget runs out or the response is truncated, this planning narration becomes the only text block returned — and it's not JSON.

**Fix:** Explicitly instruct Claude in the system prompt not to narrate before fetching:

```
Call Atlas MCP tools directly and silently — do NOT narrate, plan, or say
what you are about to do. Do NOT output any text before you have the data.
Your first output must be the final JSON object — nothing before it.
```

Also increase `max_tokens` to give Claude enough budget for multi-tool reasoning plus a full JSON response:

```ts
max_tokens: 2048  // not 1024 — multi-tool chains need more headroom
```

---

## Issue 5 — Starter Questions Triggering Too Many Tool Calls

**Symptom:** Predefined starter questions ("Am I ready for an ISO 42001 audit?") consistently failed, while manually typed simple questions worked fine.

**Root cause:** Complex compliance questions trigger 5-8 sequential `call_api_operation` calls across compliance, audit, and framework APIs. Even with `confirm=true` in the system prompt, Claude may miss passing it on one of the 6 calls, causing that call to return `CONFIRMATION_REQUIRED` which breaks the chain mid-way. The app has no way to recover.

**Fix:** Design starter/predefined questions to require only 1-2 tool calls. Use simple data queries, not multi-domain analysis questions:

```ts
// ❌ Too complex — triggers 6+ tool calls across compliance, audit, framework APIs
"Am I ready for an ISO 42001 audit?"
"What would an attacker target first in my tenant?"

// ✅ Simple — 1-2 tool calls, read_only risk level, no confirmation gate
"How many LLM endpoints are in my tenant?"
"Which projects have registered endpoints?"
"Give me an overview of my tenant."
```

Users can still ask complex questions manually once the conversation is established.

---

## Debugging Checklist

If you're getting unexpected failures with the Atlas MCP Server + Anthropic SDK beta, check these in order:

- [ ] **Trailing slash** — is your MCP URL `https://mcp.prod.alltrue-be.com/mcp/` (with slash)?
- [ ] **Anthropic client timeout** — have you set `new Anthropic({ timeout: 180_000 })`?
- [ ] **confirm=true** — does your system prompt instruct Claude to pass `confirm=true` on all `call_api_operation` calls?
- [ ] **No narration instruction** — does your system prompt tell Claude not to output text before fetching data?
- [ ] **max_tokens** — is it at least 2048?
- [ ] **MCP server health** — test with a raw `initialize` + `tools/list` curl call (should respond in <500ms)
- [ ] **CONFIRMATION_REQUIRED** — surface `raw` in your error response to see Claude's actual text output when JSON parsing fails

---

## What Works Well

- The MCP server itself is fast — `initialize`, `tools/list`, `search_api_operations` all respond in <400ms
- `call_api_operation` with real Atlas REST calls works reliably once the above issues are resolved
- The Anthropic SDK beta handles all MCP round-trips server-side — no client-side tool loop needed
- Scoped queries (filtering by org/project) work cleanly via the system prompt instruction
- Conversational multi-turn chat (Posture Advisor pattern) is the most robust use case — Claude can handle confirmation requests naturally in conversation

---

## Reference — Working System Prompt Pattern

```
You are [role] connected to Atlas via the Atlas MCP Server.

[Scope instruction here]

Call Atlas MCP tools directly and silently — do NOT narrate, plan, or say what
you are about to do. Do NOT output any text before you have the data. Always
pass confirm=true on every call_api_operation call. Do not wait for confirmation
— proceed immediately.

[Output format instruction — JSON schema or conversational]
```
