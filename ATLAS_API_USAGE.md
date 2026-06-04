# Atlas API Usage — Atlas Learning Platform

**Audience:** Engineers reviewing API integration  
**Last Updated:** 2026-06-04  
**Purpose:** Complete inventory of every Atlas API call made by this platform — endpoint, method, auth, payload, and where in the codebase it lives.

---

## Overview

The platform makes two distinct types of Atlas API calls:

| Type | Base URL | Auth | Used By |
|---|---|---|---|
| **Atlas REST API** | `https://api.prod.alltrue-be.com` | JWT (issued from API key) | Demo Provisioning, Chain of Custody |
| **Atlas Gateway (AI Proxy)** | `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1` | Bearer = OpenAI API key + routing header | AI Runtime Demo |

---

## Authentication — Atlas REST API

All REST API calls follow a two-step auth pattern. There is no session reuse — a fresh JWT is fetched before every request.

### Step 1 — Issue JWT Token

**Every route that calls the Atlas REST API calls this first.**

```
POST https://api.prod.alltrue-be.com/v1/auth/issue-jwt-token
Header: X-API-Key: {ATLAS_API_KEY}
```

- `ATLAS_API_KEY` — Varonis custom integration key, stored as a Vercel environment variable
- Returns `{ access_token: "..." }` — short-lived JWT
- The JWT is then used as `Authorization: Bearer {token}` on all subsequent calls

**Implemented as a shared helper in each route file:**
```typescript
async function getAtlasJWT(): Promise<string>
```

Located in:
- [ui/app/api/demo/chain/route.ts](ui/app/api/demo/chain/route.ts)
- [ui/app/api/demo/chain/projects/route.ts](ui/app/api/demo/chain/projects/route.ts)
- [ui/app/api/demo/chain/resource/route.ts](ui/app/api/demo/chain/resource/route.ts)
- [ui/app/api/demo/chain/scenario/route.ts](ui/app/api/demo/chain/scenario/route.ts)

**Environment variables required:**
| Variable | Value |
|---|---|
| `ATLAS_API_KEY` | `zCnCRkSfcRUaoLBo5rtLiU4qsBOjTRvG` (custom integration key) |
| `ATLAS_CUSTOMER_ID` | `7df8a5a7-1173-4b29-b9a0-100281c010b2` |

---

## Atlas REST API Calls

### 1. List All Inventory Resources

**Used by:** `/demo` page → Chain of Custody tab  
**Platform route:** `GET /api/demo/chain`  
**Source file:** [ui/app/api/demo/chain/route.ts](ui/app/api/demo/chain/route.ts)

```
GET https://api.prod.alltrue-be.com/v1/inventory/customer/{customerId}/resources
Authorization: Bearer {jwt}
```

Returns all inventory resources for the customer. No pagination parameters — Atlas returns all resources in one response.

---

### 2. Get Dependency Graph

**Used by:** `/demo` page → Chain of Custody tab (fetched in parallel with resources)  
**Platform route:** `GET /api/demo/chain`  
**Source file:** [ui/app/api/demo/chain/route.ts](ui/app/api/demo/chain/route.ts)

```
GET https://api.prod.alltrue-be.com/v1/inventory/resources/dependency-graph?per_page=50&page=1
Authorization: Bearer {jwt}
```

Returns dependency graph edges between inventory resources. Used to build the Chain of Custody visualization.

---

### 3. List Organization Projects

**Used by:** `/demo` page → Chain of Custody tab AND project dropdown  
**Platform routes:** `GET /api/demo/chain` and `GET /api/demo/chain/projects`  
**Source files:**
- [ui/app/api/demo/chain/route.ts](ui/app/api/demo/chain/route.ts) — fetched in parallel as part of the full chain scan
- [ui/app/api/demo/chain/projects/route.ts](ui/app/api/demo/chain/projects/route.ts) — standalone endpoint for populating the project selector dropdown

```
GET https://api.prod.alltrue-be.com/v1/admin/customers/{customerId}/organizations/projects
Authorization: Bearer {jwt}
```

Returns all Atlas projects for the org. The platform uses this to populate the "Select Project" dropdown in the Mock Scenario Builder.

---

### 4. Get Single Resource Detail

**Used by:** `/demo` page → Chain of Custody → clicking a resource node  
**Platform route:** `GET /api/demo/chain/resource?id={resourceId}`  
**Source file:** [ui/app/api/demo/chain/resource/route.ts](ui/app/api/demo/chain/resource/route.ts)

```
GET https://api.prod.alltrue-be.com/v1/inventory/customer/{customerId}/resource/{resourceId}
Authorization: Bearer {jwt}
```

Returns full detail for a single inventory resource. Called on-demand when an SE clicks a resource node in the chain view.

---

### 5. Create Inventory Resources (Batch)

**Used by:** `/demo` page → Mock Scenario Builder → "Create Scenario"  
**Platform route:** `POST /api/demo/chain/scenario`  
**Source file:** [ui/app/api/demo/chain/scenario/route.ts](ui/app/api/demo/chain/scenario/route.ts)

```
POST https://api.prod.alltrue-be.com/v1/inventory/resources
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "resources": [
    {
      "display_name": string,
      "resource_type": string,         // e.g. "GenAiApp", "CustomLlmEndpoint", "DataStore"
      "resource_data": { ... },        // type-specific fields
      "technology_types": [],          // must be empty — Atlas validates against its own catalog
      "project_ids": ["{projectId}"],
      "reviewed": boolean,
      "tenant_global_resource": false
    },
    ...
  ]
}
```

Creates multiple inventory resources in a single batch call. Resources are created for the selected Atlas project.

**Known constraint:** `technology_types` must always be an empty array. Atlas validates technology type values against its internal catalog and rejects unknown values.

**Known constraint:** `CustomLlmEndpoint` resources use `endpoint_identifier` as a unique key. The platform appends a timestamp suffix (`Date.now().toString(36)`) to prevent 409 conflicts on repeat runs.

**Resource types used in scenario definitions:**

| Resource Type | resource_data fields |
|---|---|
| `GenAiApp` | `app_url`, `app_name` |
| `CustomLlmEndpoint` | `endpoint_identifier`, `endpoint_url`, `llm_provider` |
| `DataStore` | `store_type`, `store_name` |
| `IdentityProvider` | `provider_type` |

---

### 6. Create Resource Dependencies (Manual Links)

**Used by:** `/demo` page → Mock Scenario Builder → immediately after resource creation  
**Platform route:** `POST /api/demo/chain/scenario` (same call, second step)  
**Source file:** [ui/app/api/demo/chain/scenario/route.ts](ui/app/api/demo/chain/scenario/route.ts)

```
POST https://api.prod.alltrue-be.com/v1/inventory/resources/dependencies/manual
Authorization: Bearer {jwt}
Content-Type: application/json

{
  "dependencies": [
    {
      "resource_instance_id": "{resourceId}",
      "depends_on_resource_instance_id": "{parentResourceId}"
    },
    ...
  ]
}
```

Links newly created resources into a sequential dependency chain. Called immediately after batch resource creation using the resource IDs returned from call #5.

The platform links resources in order: `resources[0] → resources[1] → resources[2] → ...` (each resource depends on the next).

This call is best-effort — if it fails, resource creation is still considered successful and the error is surfaced as a warning, not a failure.

---

## Atlas Gateway Calls (AI Runtime Demo)

The AI Runtime Demo fires traffic through the Atlas Gateway to demonstrate live policy enforcement. The Gateway proxies requests to OpenAI and Atlas policies intercept before the LLM processes content.

**Base URL:** `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1`  
**Source file:** [ui/app/api/demo/runtime/simulate/route.ts](ui/app/api/demo/runtime/simulate/route.ts)

### Auth — Atlas Gateway

The Gateway uses a different auth pattern from the REST API:

```
Authorization: Bearer {OPENAI_API_KEY}   ← OpenAI sk-proj-... key, NOT the Atlas Firewall Proxy key
x-alltrue-llm-endpoint-identifier: tadeo-demo-openai
x-alltrue-llm-firewall-user-session: { "user-session-id": "...", "user-session-user-id": "...", "user-session-user-email": "..." }
```

**Important:** The Bearer token is the OpenAI API key. The Atlas Firewall Proxy key is for admin operations only — using it here returns a 400 "Unsanctioned endpoint" error.

**Environment variables required:**
| Variable | Value |
|---|---|
| `ATLAS_GATEWAY_URL` | `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1` |
| `ATLAS_GATEWAY_ENDPOINT_ID` | `tadeo-demo-openai` |
| `OPENAI_API_KEY` | OpenAI sk-proj-... key (also used as Bearer for Gateway) |

---

### 7. Chat Completions — Prompt Traffic

**Used by:** AI Runtime Demo → Prompt Traffic simulation  
**Platform route:** `POST /api/demo/runtime/simulate` with `simulation_type: "prompt"`

```
POST {ATLAS_GATEWAY_URL}/chat/completions
Authorization: Bearer {OPENAI_API_KEY}
x-alltrue-llm-endpoint-identifier: tadeo-demo-openai
x-alltrue-llm-firewall-user-session: { ... }
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [{ "role": "user", "content": "{prompt}" }],
  "max_tokens": 150
}
```

Fires a single user prompt through the Atlas Gateway. Atlas policies scan the prompt before forwarding to OpenAI. If a policy triggers, Atlas returns `{ error: { code: "content_policy_violation", message: "..." } }` instead of a completion.

---

### 8. Chat Completions — MCP Tool Call Chain

**Used by:** AI Runtime Demo → MCP Call Simulation  
**Platform route:** `POST /api/demo/runtime/simulate` with `simulation_type: "mcp"`

```
POST {ATLAS_GATEWAY_URL}/chat/completions
Authorization: Bearer {OPENAI_API_KEY}
x-alltrue-llm-endpoint-identifier: tadeo-demo-openai
x-alltrue-llm-firewall-user-session: { ... }
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [
    { "role": "user", "content": "{userAsk}" },
    {
      "role": "assistant",
      "content": null,
      "tool_calls": [{
        "id": "{callId}",
        "type": "function",
        "function": { "name": "{toolName}", "arguments": "{toolArgs}" }
      }]
    },
    {
      "role": "tool",
      "tool_call_id": "{callId}",
      "content": "{toolResult}"    ← sensitive data from MCP server — Atlas intercepts here
    }
  ],
  "tools": [{ "type": "function", "function": { ... } }],
  "max_tokens": 200
}
```

Constructs the exact multi-turn message format that an AI Gateway sees when proxying real MCP traffic. Atlas scans the full context window including the `tool` role message. Policy violations are triggered by the sensitive data in the tool result, not the user message.

---

### 9. Chat Completions — Multi-Agent Workflow Steps

**Used by:** AI Runtime Demo → Multi-Agent Workflow simulation  
**Platform route:** `POST /api/demo/runtime/simulate` with `simulation_type: "agent"`

```
POST {ATLAS_GATEWAY_URL}/chat/completions
Authorization: Bearer {OPENAI_API_KEY}
x-alltrue-llm-endpoint-identifier: tadeo-demo-openai
x-alltrue-llm-firewall-user-session: { ... }
Content-Type: application/json

{
  "model": "gpt-4o-mini",
  "messages": [{ "role": "user", "content": "{stepPrompt}" }],
  "max_tokens": 150
}
```

Fires one request per agent step, sequentially. If any step returns `content_policy_violation`, execution stops and all remaining steps are marked `skipped`. Each step is a separate gateway request — Atlas logs them individually, enabling per-step tracing in AI Investigation.

---

### 10. Chat Completions — Custom Scenario

**Used by:** AI Runtime Demo → Custom Scenario tab  
**Platform route:** `POST /api/demo/runtime/simulate` with `simulation_type: "prompt"` and `scenario_id: "custom"`

Same request shape as call #7, using the SE-provided prompt text.

---

## Active Atlas Policies (on `tadeo-demo-openai` endpoint)

| Policy | Status | What It Catches |
|---|---|---|
| PII Detection | ✅ Active — confirmed 2026-06-03 | SSNs, MRNs, DOBs, credit cards in prompt and tool result content |
| MCP Quarantine Rule | ✅ Active | MCP tool call chains containing sensitive data |

Both policies are configured on the **OpenAI API Key (Tadeo-Demo)** endpoint in Atlas AI Inventory. The same policies cover all three simulation types (prompt, MCP, agent) because Atlas scans the entire message context regardless of role.

---

## Atlas Tenant Details

| Property | Value |
|---|---|
| Base API URL | `https://api.prod.alltrue-be.com` |
| Customer ID | `7df8a5a7-1173-4b29-b9a0-100281c010b2` |
| Atlas Project (demo) | `Unsanctioned-Tim-The-AI-Guy` |
| Atlas Project ID | `68869c92-9502-432c-8508-713264a919c7` |
| Gateway endpoint name | `OpenAI API Key (Tadeo-Demo)` |
| Gateway endpoint ID | `tadeo-demo-openai` |
| Gateway resource ID | `0f051c49-d1ad-401d-b10e-f1e72023a9f7` |
| AI Investigation URL | `https://prod.alltrue-be.com/ai-monitor?organization=985dfc2e-2cfd-4b4a-9c8a-6a98ec1efbdb&project=68869c92-9502-432c-8508-713264a919c7` |

---

## Call Map by Platform Page

| Platform Page | API Route | Atlas Calls Made |
|---|---|---|
| `/demo` → Chain of Custody | `GET /api/demo/chain` | #1 List resources, #2 Dependency graph, #3 List projects (all parallel) |
| `/demo` → Project dropdown | `GET /api/demo/chain/projects` | #3 List projects |
| `/demo` → Resource detail | `GET /api/demo/chain/resource?id=` | #4 Single resource |
| `/demo` → Mock Scenario Builder | `POST /api/demo/chain/scenario` | #5 Create resources, #6 Link dependencies |
| `/runtime` → Prompt Traffic | `POST /api/demo/runtime/simulate` | #7 Gateway chat completions (2 calls per scenario) |
| `/runtime` → MCP Simulation | `POST /api/demo/runtime/simulate` | #8 Gateway MCP tool chain (2 calls per scenario) |
| `/runtime` → Multi-Agent Workflow | `POST /api/demo/runtime/simulate` | #9 Gateway per-step (up to 4 calls, stops at first block) |
| `/runtime` → Custom Scenario | `POST /api/demo/runtime/simulate` | #10 Gateway chat completions (1 call) |
