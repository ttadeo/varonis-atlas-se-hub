# Atlas MCP Server — Support Ticket

**Date:** 2026-07-21  
**Submitted by:** Tim Tadeo — Varonis SE  
**Environment:** Production (Shared AllTrue Varonis Lab tenant)  
**MCP Server:** https://mcp.prod.alltrue-be.com/mcp/  
**Severity:** High — blocking demo capability for customer-facing SE tool  

---

## Summary

We are building an AI-powered SE enablement platform that integrates with the Atlas MCP Server using the Anthropic SDK beta (`mcp-client-2025-04-04`). All four of our Atlas MCP-powered apps are consistently failing with 504 timeouts. Through systematic debugging we have isolated the failure to the Atlas control plane REST API being called internally by the MCP server's `call_api_operation` tool — not the MCP layer itself.

---

## What We Are Building

We have an internal SE learning and demo platform (Next.js, hosted on Vercel) with four AI-powered apps that use the Atlas MCP Server as their data source:

1. **AI Risk Briefing** — executive risk score and findings from live Atlas tenant data
2. **LLM Endpoint Audit** — per-endpoint risk assessment with missing policy gaps
3. **Shadow AI Report** — identifies projects with no registered LLM endpoints
4. **AI Posture Advisor** — conversational chat where Claude calls Atlas MCP tools autonomously to answer security posture questions

**Architecture:** We use the Anthropic Python/Node SDK beta (`anthropic.beta.messages.create`) with the `mcp_servers` parameter pointing to the Atlas MCP Server. Anthropic's backend handles all MCP round-trips server-side. Claude autonomously calls MCP tools to fetch live Atlas data and generate the analysis.

```
User (browser)
  → Vercel Next.js API route
    → Anthropic API (claude-sonnet-4-6, mcp-client-2025-04-04 beta)
      → Atlas MCP Server (mcp.prod.alltrue-be.com/mcp/)
        → Atlas Control Plane REST API  ← HANGING HERE
```

---

## What We Have Confirmed Works

| Test | Result | Time |
|---|---|---|
| `POST /mcp/` initialize | ✅ HTTP/2 200, session ID returned | ~350ms |
| `tools/list` | ✅ Returns all 9 tools | ~360ms |
| `search_api_operations` (e.g. query: "projects") | ✅ Returns ranked results | ~360ms |
| `call_api_operation` (actual Atlas REST API call) | ❌ Times out / hangs | >54s |

The MCP server connection, session establishment, and metadata tools all respond in under 400ms. The failure occurs specifically and consistently when `call_api_operation` executes — this is the tool that makes real Atlas control plane REST API calls to fetch tenant data (projects, LLM endpoint configurations, etc.).

---

## Observed Failure

**From Vercel function logs:**

```
POST api.anthropic.com/v1/messages → Status: Timeout → Duration: 54.47s
```

The Anthropic API call times out at approximately 54 seconds. This is the Anthropic SDK's default HTTP connection timeout being hit — meaning the Atlas MCP Server is holding the connection open waiting for a backend response that never arrives (or arrives too late).

**What Claude is attempting to do:**
1. `search_api_operations` — find the right operation for "list projects" → ✅ fast
2. `call_api_operation` with the resolved operation ID → ❌ hangs indefinitely

**User-facing result:** All four apps show our timeout error message. No Atlas data is returned. The feature is non-functional.

---

## What We Have Already Tried

1. **Confirmed MCP server is reachable** — curl test with initialize + tools/list both succeed in <400ms
2. **Added Anthropic client-level timeout** — set to 180s (app routes) and 240s (posture advisor); does not help because the Atlas backend never responds
3. **Increased Vercel function maxDuration** — 120s → 150s (app routes), 300s (posture advisor); does not help for same reason
4. **Tightened system prompts** — instructed Claude to call tools directly without exploration; reduces unnecessary `search_api_operations` calls but does not fix `call_api_operation` hangs
5. **Tested at different times** — failure is consistent, not time-of-day dependent

---

## Previous Incident (2026-07-17)

We experienced a similar 504 pattern on 2026-07-17 between approximately 11:15–12:20 ET. At that time, we identified via Atlas job logs that a background job (`discover_and_add_customer_cloud_resources`, job ID `0a266c26`) was running for 18 minutes on the shared `AllTrue Varonis Lab` tenant and appeared to be saturating the control plane backend. The issue resolved itself by 12:35 ET.

The current failure appears to be a recurrence of the same pattern — the shared tenant's control plane backend is under sustained load that causes `call_api_operation` to hang rather than return an error.

---

## Questions / What We Need

1. **Is the `AllTrue Varonis Lab` shared tenant control plane currently under load?** Are there background jobs running that could be causing `call_api_operation` to hang?

2. **Is there a timeout enforced on the Atlas side for `call_api_operation`?** If the backend is slow, should we expect a timeout error response rather than an indefinite hang?

3. **Can we get an isolated tenant?** The shared `AllTrue Varonis Lab` tenant appears vulnerable to noisy-neighbor effects (other SEs running discovery jobs, scans, etc.) that saturate the control plane and break MCP tool calls for all users. An isolated tenant with its own customer_id would prevent recurrence.

4. **Is there a status page or monitoring endpoint** we can check to determine Atlas control plane health before attempting MCP calls?

---

## Environment Details

| Item | Value |
|---|---|
| MCP Server URL | `https://mcp.prod.alltrue-be.com/mcp/` |
| MCP Server version | `control-plane-mcp v3.2.0` (confirmed via initialize) |
| Tenant | AllTrue Varonis Lab (shared SE tenant) |
| Anthropic SDK | `@anthropic-ai/sdk` latest, beta `mcp-client-2025-04-04` |
| Model | `claude-sonnet-4-6` |
| Hosting | Vercel (Washington D.C., iad1 region) |
| Auth | Bearer token (Atlas API key) |
| Protocol | Streamable HTTP, trailing slash required |

---

## Reproduction Steps

1. Make an authenticated `initialize` call to `https://mcp.prod.alltrue-be.com/mcp/` — succeeds
2. Use the returned session ID to call `tools/call` with `search_api_operations` — succeeds
3. Use the returned operation ID to call `tools/call` with `call_api_operation` — hangs/times out

Alternatively: trigger any of our four Atlas MCP app routes via the Anthropic SDK beta with `mcp_servers` pointing to the Atlas MCP Server — Claude will call `call_api_operation` within the first 2 tool calls and the request will time out.
