# Atlas Learning Platform — n8n Workflows

All workflows run on [ttadeo.app.n8n.cloud](https://ttadeo.app.n8n.cloud). All are published and active.

## Workflows

### 1. Atlas RAG - Knowledge Retrieval
**File:** `workflows/atlas-rag-knowledge-retrieval.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-rag-query`  
**Called by:** `/api/ask`, `/api/meeting`, and internally by Architecture Builder + Guide Producer  
**What it does:** Core RAG pipeline — embeds the question via OpenAI, vector searches Neo4j, builds context, calls Claude to generate a grounded answer with source attribution. Supports conversation history.

---

### 2. Atlas Architecture Builder
**File:** `workflows/atlas-architecture-builder.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-architect`  
**Env var:** `N8N_ARCHITECT_WEBHOOK_URL`  
**Called by:** `/api/architect`  
**What it does:** Takes customer profile (industry, use case, tech stack, concerns, audience) → RAG searches Atlas docs → generates a Mermaid diagram (Generate Diagram node) → generates an 800-word markdown narrative (Generate Narrative node) → returns `{ diagram, narrative }`.  
**Timeout:** 300s (set in workflow settings). Claude generation takes 20-60s.

---

### 3. Atlas - Technical Guide Producer
**File:** `workflows/atlas-guide-producer.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-guide-producer`  
**Env var:** `N8N_GUIDES_WEBHOOK_URL`  
**Called by:** `/api/guides`  
**What it does:** Takes topic, guide type, audience, industry, tech stack → RAG searches Atlas docs → Claude generates a full markdown technical guide → returns `{ guide }`.

---

### 4. Atlas Demo Provisioning - Discover (active)
**File:** `workflows/atlas-demo-provisioning-v1.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-demo-provisioning`  
**Env var:** `N8N_DEMO_DISCOVER_URL` (defaults to this URL in code)  
**Called by:** `/api/demo/discover`  
**What it does:** Fetches real templates and rules from Atlas API, passes them to Claude with the customer use case, returns scored template matches and a custom recommendation. Uses live Atlas data — not a hardcoded list.

---

### 5. Atlas Demo Provisioning - Apply
**File:** `workflows/atlas-demo-apply.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-demo-apply`  
**Env var:** `N8N_DEMO_APPLY_URL`  
**Called by:** `/api/demo/apply`  
**What it does:** Authenticates with Atlas API, then either applies an existing template to a project (`selection_type: existing`) or creates a new custom template (`selection_type: custom`). Returns `{ success, demo_name, message }`.

---

### 6. Atlas Demo Provisioning - Discover (archived)
**File:** `workflows/atlas-demo-discover-archived.json`  
**Webhook:** `POST https://ttadeo.app.n8n.cloud/webhook/atlas-demo-discover`  
**Status:** Archived — not called by any UI route. Replaced by `atlas-demo-provisioning-v1.json`.  
**What it does:** Earlier version — Claude recommends templates from a hardcoded list (no live Atlas API call).

---

## Credentials Required in n8n

| Credential | Used By |
|---|---|
| Anthropic account (`WioShNHmyXcJmy8m`) | Architecture Builder, Guide Producer, Demo Discover |
| OpenAI - Atlas (`QKOKask5bV39Hn2N`) | RAG Knowledge Retrieval (embeddings) |
| Neo4j-Auth (`kENlY4V8sLKJinYH`) | RAG Knowledge Retrieval (vector search) |
| Header Auth account (`lgILDx4ml8xXy6yX`) | RAG Knowledge Retrieval |

## Notes

- The RAG workflow calls Neo4j via ngrok HTTP tunnel (`uncompendious-unpurchased-shanita.ngrok-free.dev`) — requires the Linux server and ngrok to be running
- The `Augment Query` node in the RAG workflow is **disconnected by design** — do not reconnect
- Architecture Builder and Guide Producer both call the RAG workflow internally as a sub-call to `atlas-rag-query`
