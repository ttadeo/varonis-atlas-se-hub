---
title: MCP Server for Coding Agents
url: https://prod.alltrue-be.com/_docs/docs/platform_services/mcp_server
section: platform_services
---

# MCP Server for Coding Agents

- [](/_docs/)- Platform Services- MCP Server for Coding AgentsExport PDFOn this page# MCP Server for Coding Agents
The Atlas MCP server lets a coding agent — Claude Code, OpenAI Codex CLI, Cursor, or any other [Model Context Protocol](https://modelcontextprotocol.io/) client — read and act on your AI-security posture from inside its normal chat or terminal session. Instead of switching to the Atlas UI to look up compliance percentages, open governance issues, or kick off a pentest run, you can ask your coding agent in natural language and it calls the platform through a single authenticated endpoint.

The server is a hosted, remote MCP endpoint operated by Atlas. There is nothing to install on your laptop beyond the one-time MCP entry in your coding agent's config, and the agent never sees your platform JWT — only the API key you provide stays with the agent.

## Why use the MCP server[​](#why-use-the-mcp-server)
Coding agents already have the model, the codebase, and the terminal. What they lack is structured access to your security and governance data — and giving them a raw REST URL plus a JWT is brittle: agents have to discover the right endpoint, read the OpenAPI doc, encode parameters correctly, and parse the response. The MCP server closes that gap by exposing a curated catalogue of operations with typed inputs and outputs, scope auto-fill, and a single error contract the agent can branch on.

Use the MCP server when you want to:

- Triage AI governance, posture, compliance, or TPRM issues without leaving your editor.
- Pull live inventory, usage, and risk data into engineering and security workflows.
- Drive multi-step actions (create policies, configure VMCPs, run pentest comparisons) from a coding agent loop.
- Give a coding agent enough Atlas context to make recommendations that account for your tenant's actual state, not generic best-practice text.

The MCP server **does not** evaluate prompts, intercept tool calls, or sit in the runtime data path of any LLM application. Runtime guardrails for coding agents are configured separately through the [Coding Agent Integrations](/_docs/docs/coding_agent_protection/runtime_protection) hooks system.

## How it works[​](#how-it-works)
The MCP server is a remote HTTP endpoint that speaks the MCP streamable-HTTP protocol. When your coding agent connects:

- The agent presents the Atlas API key as an `Authorization: Bearer &lt;api-key&gt;` header.
- The server exchanges that key for a short-lived JWT against the Atlas API. The JWT is held in server memory only and is never written to logs, audit records, or responses.
- The agent calls discovery tools (`list_api_surfaces`, `search_api_operations`, `get_api_operation`) to find the right operation for the task.
- The agent calls `validate_api_request` to confirm the input shape, then `call_api_operation` to actually run it.
- The server proxies the request to the Atlas REST or GraphQL API, signs it with the cached JWT, and returns the backend response byte-for-byte under a stable envelope: `{status, request_id, body}`.

All operations stay **scoped to your tenant**. The API key alone determines which customer the request runs against — the agent cannot supply a different customer ID, and any attempt to do so is rejected before the call reaches the backend.

### What the agent can reach[​](#what-the-agent-can-reach)
The catalogue is opt-in per operation:

- **Exposed by default** — reads and non-destructive create/update mutations.
- **Never exposed** — routes that handle credentials, OAuth tokens, secrets, webhook ingest, or internal platform plumbing.

## Region endpoints[​](#region-endpoints)
Use the URL that matches the Atlas region your tenant is hosted in.

RegionAtlas URLMCP server URLUS West (Oregon) — `us-west-2``https://prod.alltrue-be.com/``https://mcp.prod.alltrue-be.com/mcp`US East (N. Virginia) — `us-east-1``https://na-east.alltrue-be.com/``https://mcp.na-east.alltrue-be.com/mcp`EU Central (Frankfurt) — `eu-central-1``https://eu-central.alltrue-be.com/``https://mcp.eu-central.alltrue-be.com/mcp`
The MCP URL is always the Atlas URL with `mcp.` prepended and `/mcp` appended. Use the same region URL on every device that connects.

The remainder of this guide uses `https://mcp.prod.alltrue-be.com/mcp` in examples. Substitute your region's URL when you set things up.

## Prerequisites[​](#prerequisites)
Before you connect a coding agent, make sure you have:

- An Atlas user account with the **Admin** or **Security Admin** role, so you can issue API keys.
- An Atlas API key associated with a role that grants the permissions your coding agent needs to use. For day-to-day inventory, posture, compliance, and issues read access, a role with the read permissions across those products is sufficient. For agents that should also create policies, configure VMCPs, or run pentests, add the corresponding write permissions to the role.
- A coding agent that supports MCP — Claude Code, OpenAI Codex CLI, Cursor, or another MCP-compatible client.

Obtain the API key from the **Admin Console**. The full step-by-step (creating a role with the right permissions, then creating the key and assigning the role) is documented in [Getting Started with API Calls](/_docs/docs/platform_services/api). The same key the API guide describes works for the MCP server.

noteThe MCP server accepts both user-bound personal access keys and service keys. A user-bound key populates the full user profile (name, email) when an agent calls `get_user_context`; a service key returns the customer and role information only. Either works for tool execution.

## Connect from your coding environment[​](#connect-from-your-coding-environment)
The configuration is the same across coding agents: register a remote MCP server at the region URL, and have it send your API key as a bearer token. Pick the tab for your environment.

- Claude Code- OpenAI Codex CLI- Cursor- Other MCP clientsExport the API key first so the literal value stays out of your shell history and the `claude mcp add` invocation:
```
export ATLAS_API_KEY=&lt;YOUR-ATLAS-API-KEY&gt;

```Then register the MCP server. The shell expands `$ATLAS_API_KEY` before `claude` sees it:
```
claude mcp add --transport http atlas \
 https://mcp.prod.alltrue-be.com/mcp \
 --header "Authorization: Bearer $ATLAS_API_KEY"

```This writes the entry to your global Claude Code config (`~/.claude.json`). To install it per-project instead — so it travels with the repository — add `--scope project` to the command; Claude Code stores per-project MCP entries in `&lt;project&gt;/.mcp.json`. See the [Claude Code MCP documentation](https://docs.claude.com/en/docs/claude-code/mcp) for the full set of options.
Secrets at restClaude Code persists the resolved bearer value in `~/.claude.json` (or `&lt;project&gt;/.mcp.json` for project scope) in plaintext — `claude mcp add` does not keep the entry as an environment-variable reference. Protect the file with restrictive permissions, do not commit per-project MCP configs, and rotate the API key from the **Admin Console** if the file is exposed.
Verify the connection by running:
```
claude mcp list

```You should see `atlas` listed with status `Connected`. Start a Claude Code session and ask: *"Use the atlas MCP server to summarize my AI governance posture."*
Add the following block to your Codex CLI config file at `~/.codex/config.toml`:
```
[mcp_servers.atlas]
url = "https://mcp.prod.alltrue-be.com/mcp"
bearer_token_env_var = "ATLAS_API_KEY"

```Codex CLI reads the actual token from the environment variable named in `bearer_token_env_var`, so the secret never sits in `config.toml`. Export the API key in the shell that launches Codex:
```
export ATLAS_API_KEY=&lt;YOUR-ATLAS-API-KEY&gt;

```Add the `export` line to your shell profile (`~/.zshrc`, `~/.bashrc`) so it persists across sessions. Restart Codex CLI after editing the config file.
See the [Codex CLI MCP documentation](https://developers.openai.com/codex/cli/reference#codex-mcp) for the full set of transport and timeout options.
Add the following block to your Cursor global config at `~/.cursor/mcp.json`. If the file does not exist yet, create it with this content:
```
{
 "mcpServers": {
 "atlas": {
 "url": "https://mcp.prod.alltrue-be.com/mcp",
 "headers": {
 "Authorization": "Bearer ${env:ATLAS_API_KEY}"
 }
 }
 }
}

```To install it for a single project instead, create the file at `&lt;project&gt;/.cursor/mcp.json` with the same shape. Project-level configuration can be committed to source control so the whole team shares the same MCP entry.
Cursor expands `${env:NAME}` from your shell environment, so the actual token stays out of `mcp.json`. Export it before launching Cursor:
```
export ATLAS_API_KEY=&lt;YOUR-ATLAS-API-KEY&gt;

```Add the `export` line to your shell profile to persist it. Restart Cursor after editing the file.
See the [Cursor MCP documentation](https://cursor.com/docs/mcp) for the full set of options, including variable interpolation and per-workspace overrides.
Any client that speaks the [MCP streamable-HTTP transport](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#streamable-http) can connect. The two values it needs are:

- **URL** — the region MCP endpoint, for example `https://mcp.prod.alltrue-be.com/mcp`.
- **`Authorization: Bearer &lt;YOUR-ATLAS-API-KEY&gt;`** — sent on every request.
The server does not expose an SSE or STDIO transport. Use streamable-HTTP only.

## What you can do with it[​](#what-you-can-do-with-it)
Once connected, you can interact with the Atlas platform in **free text** through your coding agent. Anything the underlying REST or GraphQL API exposes is reachable, and the agent figures out which operations to call from your prompt — there is no fixed set of supported commands. The MCP server exposes nine tools (five for discovery, three for execution, and one for plain-language error explanation) and the agent picks the right ones for the request without you prompting it.

### Some usage examples[​](#some-usage-examples)
The workflows below give you a sense of the kinds of prompts that work well in practice. They are **illustrative**, not an exhaustive list — in general, anything you can do through the Atlas UI or the API is also reachable from the MCP server. For a visual tour of complete, real-world conversations — triaging risk, investigating a finding, mapping your estate, checking audit readiness — see [What Your Coding Agent Can Do with Atlas](/_docs/docs/handbooks/mcp_server_runbooks).

#### Inventory and shadow AI[​](#inventory-and-shadow-ai)
Ask the agent to enumerate the AI resources discovered in your tenant — models, ML artifacts, LLM endpoints, AI services, AI applications, Jupyter notebooks, software packages, log sources, guardrail integrations — and to filter by project, organization, cloud provider, technology category, review status, or severity of open issues. Common uses:

- Building an inventory summary for a quarterly review.
- Finding the resources most likely to be **shadow AI** — discovered but unowned and unreviewed.
- Pulling resource counts at two points in time to detect inventory drift.

#### Posture and compliance[​](#posture-and-compliance)
Ask the agent for your compliance posture across regulatory frameworks (EU AI Act, ISO 42001, NIST AI RMF, HITRUST, the Colorado AI Act, and more) or your posture-policy-group results (OWASP LLM, NIST AI RMF — Organizations, and others). Drill into specific policy groups, list failing policies, or summarize misconfiguration issues for a given resource.

#### Governance, posture, and TPRM issues[​](#governance-posture-and-tprm-issues)
Ask the agent to list and triage AI governance issues, posture misconfiguration issues, performance issues, agentic security issues, TPRM (third-party AI risk) issues, or unified inventory issues. Filter by severity, status, project, rule type, or affected resource. Update status (acknowledge, resolve, reopen) or bulk-update severity for issues that share a remediation plan.

#### LLM pentest[​](#llm-pentest)
Ask the agent to summarize unresolved pentest issues for a specific LLM endpoint, compare two pentest executions against a baseline to spot regressions, or poll a running pentest execution for progress. The agent can also trigger a report generation job and report back when it finishes.

#### Virtual MCPs (VMCP gateway)[​](#virtual-mcps-vmcp-gateway)
Ask the agent to create a new VMCP gateway configuration, fetch or create the draft version, add MCP servers and tools to the allowlist, and inspect the effective tool list before publication. See [MCP Security](/_docs/docs/applications/ai_mcp) for the underlying concepts.

#### AI usage and analytics[​](#ai-usage-and-analytics)
Ask the agent about endpoint-level usage trends, token consumption, latency patterns, or top tool-calling endpoints over a time range. Useful for capacity planning and for understanding where governance pressure should focus.

## Behind the scenes[​](#behind-the-scenes)
The MCP server exposes the following tools to the agent. You don't need to call them directly — coding agents pick the right tool for the request on their own — but knowing the catalogue helps when you want to give the agent a hint or read its tool trace.

ToolWhat it does`list_api_surfaces`Enumerate the REST and GraphQL surfaces and how many operations each contains.`get_user_context`Return the caller's identity, accessible organizations and projects, and the currently pinned active scope.`list_accessible_scopes`Paginated, filterable listing of customer / organization / project scopes the caller can reach.`set_active_scope`Pin a preferred scope for the session so downstream calls auto-fill the identifier.`search_api_operations`Keyword search across the entire catalogue, with deprecated-versus-active ranking.`get_api_operation`Return the full input and output schema for a specific operation.`validate_api_request`Pre-flight check on a proposed call without contacting the backend.`call_api_operation`Execute a REST or GraphQL operation and return the backend response.`explain_api_error`Plain-language explanation for any error code the server returns.
The server also publishes five read-only resources — the live REST OpenAPI document, both printed GraphQL SDLs, the full normalized operation catalogue, and individual operations by ID — that an agent can read directly when it wants raw schema rather than tool-mediated access.

## Walkthrough: triaging governance posture from Claude Code[​](#walkthrough-triaging-governance-posture-from-claude-code)
The walkthrough below mirrors a real session driven from Claude Code against a tenant connected to the MCP server. It shows the natural-language prompt the user types, the tool calls the agent makes under the hood, and the result the agent presents back. Endpoint names, counts, and percentages are illustrative.

**Setup.** The Atlas MCP server is registered as `atlas` in Claude Code with an API key that has read access across compliance and governance issues.

### The prompt[​](#the-prompt)
YouUse atlas to give me a one-page summary of my AI governance posture: which frameworks are we passing, which governance rule types are firing most, and the top open high/critical issues.

### What the agent does[​](#what-the-agent-does)
**Step 1 — discover the right operations.**
Claude calls `search_api_operations` with the query `"compliance posture"` and `getAiComplianceOverview` comes back in the results, alongside other compliance-related operations. It calls it again with `"governance issues"` and `listGovernanceIssues` returns as the top match.

**Step 2 — fetch the framework summary.**
Claude calls `call_api_operation` on `getAiComplianceOverview` with an empty input. The tenant scope is inferred from the API key, so no further parameters are needed. The backend returns every enabled compliance framework with its current compliance percentage — for example `The EU AI Act` at `22%`, `ISO 42001` at `6%`, and a long tail of frameworks at `0%`.

**Step 3 — pull the high-severity issues.**
Claude calls `validate_api_request` on `listGovernanceIssues` with `severities=["HIGH","CRITICAL"]` and `per_page=10` first. The validator echoes back `valid: true` with the resolved input. Claude then calls `call_api_operation` with the same input and gets back the first page of high/critical issues. Each issue carries a rule type (for example `BannedSubstringsRule`, `SentimentRule`, `ToolPiiRule`, `PreventToolPoisoningRule`), an affected LLM endpoint, a severity, and a current status (`UNRESOLVED`, `REMEDIATED`, `DISMISSED`, or `ARCHIVED`).

**Step 4 — render the summary.**
Claude composes the answer inline: the framework table, a rule-type breakdown of what's firing in the high/critical sample, and the still-open issues mapped to their endpoints.

### The result[​](#the-result)
AIHere's your AI governance posture in one page.
**Framework compliance**

- `The EU AI Act` — `22%`
- `ISO 42001` — `6%`
- A long tail of additional frameworks at `0%`, including `HITRUST`, `NIST AI RMF – Organizations`, `The Colorado AI Act`, and `NCSC Secure AI Guidelines`.
**Top firing rule types (within the high/critical sample)**

- `Banned Substrings` — 4
- `Sentiment Analysis` — 2
- `Detect AI Generated`, `Tool PII`, `Prevent Tool Poisoning`, `Prohibit Topics` — 1 each
**Open high/critical issues**
SeverityRuleEndpointCRITICALBanned Substrings`openai-support-bot-prod`CRITICALSentiment Analysis`openai-governance-scanner-test`HIGHBanned Substrings`copilot-agent-marketing`HIGHTool PII`openai-rag-internal-staging`The remaining high/critical issues from the page are already remediated, dismissed, or archived.

The whole exchange takes a few seconds and never leaves the chat window.

### Other prompts that follow the same pattern[​](#other-prompts-that-follow-the-same-pattern)
The same shape applies to any natural-language question the agent can map to an Atlas operation. A few more examples:

YouShow me which projects are most behind on EU AI Act controls.

Drives the same compliance call with a project-scope filter.

YouWhat pentest categories regressed in our last run vs. the baseline?

Drives `compareLlmPentestExecutions`.

YouSet up a VMCP for the cursor-driven team that includes only the Slack and Linear tools.

Drives `createVmcpConfig`, `getOrCreateVmcpDraft`, and a sequence of tool-addition calls.

## Sessions and active scope[​](#sessions-and-active-scope)
Each MCP connection has an isolated session. Within a session, the agent can pin a preferred scope (customer, organization, or project) by calling `set_active_scope`. After a scope is pinned, every subsequent `call_api_operation` and `validate_api_request` auto-fills the matching scope identifier — `organization_id`, `project_id`, `customerId` in GraphQL — when the agent omits it. Explicit identifiers in the input always win.

Active scope is a session-local convenience for the agent, not a backend enforcement boundary. The platform's own scope enforcement applies on every call regardless of the active scope.

A session ends when the client disconnects (closing the editor, restarting Claude Code, ending the Codex CLI process). The next connection starts with no pinned scope.

## Security and audit[​](#security-and-audit)

- **Authentication.** Each request carries your API key as a bearer header. The server exchanges that key for a short-lived JWT against the Atlas API. The JWT is held in process memory only.
- **Tenant isolation.** Every operation is scoped to the customer the API key resolves to. The agent cannot send a different customer ID, and any attempt is rejected before the call reaches the backend.
- **No secret leakage.** The MCP server does not log, audit, or echo back your API key, the `Authorization` header value, the minted JWT, or raw response bodies.

## Troubleshooting[​](#troubleshooting)
IssueResolution`INVALID_API_KEY` returned on every callConfirm the API key is valid, has not been revoked, and is associated with at least one role. Re-issue the key from the **Admin Console** if in doubt.`MISSING_PERMISSION` returned for a specific operationThe role attached to the API key does not grant the permission required by that operation. Add the permission to the role or use a key with a broader role.`SCOPE_REQUIRED` returned even though the agent supplied a scopeThe supplied scope identifier is not formatted correctly, or it refers to a scope the caller cannot reach. Have the agent call `list_accessible_scopes` to discover valid identifiers, then retry.`CATALOG_NOT_LOADED` returned shortly after the server startsThe catalogue is still loading. Retry after a few seconds.`BACKEND_UNAVAILABLE` returned intermittentlyThe upstream Atlas API is temporarily unreachable. The agent should retry with backoff. If it persists, contact Atlas support.Coding agent reports the MCP server is connected but tools are not visibleRestart the agent process. Some clients only enumerate tools on session start.Connection succeeds but the wrong tenant data is returnedThe API key is associated with a different customer tenant than expected. Confirm the key was issued in the correct tenant from the **Admin Console**.`RATE_LIMITED` returned during heavy useThe backend rate limit has been hit. The agent should back off and retry. Contact Atlas support if your sustained usage requires a higher limit.
For unrecognized error codes, the agent can call `explain_api_error` with the code to get a plain-language description of what it means and what to do next.

## Related documentation[​](#related-documentation)

- [What Your Coding Agent Can Do with Atlas](/_docs/docs/handbooks/mcp_server_runbooks) — a visual tour of real workflows you can run from your coding agent.
- [Getting Started with API Calls](/_docs/docs/platform_services/api) — creating API roles and keys.
- [Admin Console](/_docs/docs/admin_console/) — managing roles, keys, and user permissions.
- [Coding Agent Integrations](/_docs/docs/coding_agent_protection/runtime_protection) — runtime hook-based guardrails for coding agents (separate from this MCP server).
- [MCP Security](/_docs/docs/applications/ai_mcp) — discovery, governance, and runtime allowlisting of the MCP servers used by your applications and agents.
[PreviousGetting Started with API Calls](/_docs/docs/platform_services/api)[NextProviders](/_docs/docs/providers)- [Why use the MCP server](#why-use-the-mcp-server)- [How it works](#how-it-works)[What the agent can reach](#what-the-agent-can-reach)- [Region endpoints](#region-endpoints)- [Prerequisites](#prerequisites)- [Connect from your coding environment](#connect-from-your-coding-environment)- [What you can do with it](#what-you-can-do-with-it)[Some usage examples](#some-usage-examples)- [Behind the scenes](#behind-the-scenes)- [Walkthrough: triaging governance posture from Claude Code](#walkthrough-triaging-governance-posture-from-claude-code)[The prompt](#the-prompt)- [What the agent does](#what-the-agent-does)- [The result](#the-result)- [Other prompts that follow the same pattern](#other-prompts-that-follow-the-same-pattern)- [Sessions and active scope](#sessions-and-active-scope)- [Security and audit](#security-and-audit)- [Troubleshooting](#troubleshooting)- [Related documentation](#related-documentation)
