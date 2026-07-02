# Atlas Learning Platform — Architecture & Security Documentation

**Audience:** Internal (Varonis SEs and technical staff)  
**Last Updated:** 2026-07-01 (rev 6 — SMEKnowledge 92→102 (scraped 2026-06-30); Agentic Demo endpoint identifier now dynamic dropdown (all endpoints fetched on mount, wired through n8n headers); Demo cleanup safety: LLM endpoint types excluded from Delete All; owner-matching complete (orgId propagated through buildProjectMap); SME Knowledge Base open to all varonis.com users; Teams SME scraper fixed Chrome→Chromium; n8n atlas-mcp-research endpoint identifier dynamic)  
**Purpose:** Comprehensive reference covering system architecture, authentication/security, software stack, and data stores.

---

## 1. System Overview

The Atlas Learning Platform is an internal AI-powered tool for Varonis SEs. It provides:

- **Interactive learning** — 3-tier course on the Atlas AI Security Platform
- **Architecture Builder** — generates reference architectures grounded in Atlas documentation
- **Technical Guide Producer** — generates deployment guides grounded in Atlas docs + SME field knowledge
- **Meeting Co-Pilot** — real-time Q&A support during customer calls
- **Demo Provisioning** — describe a customer use case → Claude matches and auto-deploys Atlas policy templates
- **AI Runtime Demo** — fires live traffic through the Atlas Gateway across three simulation types: prompt traffic, MCP tool call chains, and multi-agent workflows; demonstrates real-time policy enforcement with per-scenario talking points and Atlas AI Investigation deep-links
- **SME Knowledge Base** — browsable Q&A extracted from the Varonis AI Security SME Teams channel; 102 field-validated entries across 12 topics; SME-first chat powered by a dedicated n8n workflow; visible to all authenticated varonis.com users
- **Agentic Demo** — AI Deal Research Agent: SE enters a company name → 5-agent n8n workflow fires (Orchestrator → Exa Research → Exa News → Risk Analyst → Report Agent), all LLM calls routed through Atlas Gateway using the SE's selected endpoint identifier → populates the selected Atlas project with real AI activity; blocked requests surface Atlas guardrail message in the UI within seconds
- **Agentic RAG** — all responses grounded in official Atlas documentation + SME field knowledge (92 nodes) via vector + semantic search

---

## 2. High-Level Architecture

```
Browser (SE / Internal User)
         │
         ▼
  Vercel (Next.js 16)
  ┌──────────────────────────────────────────┐
  │  UI Pages + API Routes                   │
  │  Authentication Middleware               │
  │  Direct Neo4j access (ask, meeting)      │
  └──────────┬───────────────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  n8n Cloud     Atlas API
  (Workflow      (Varonis
  Orchestration)  Platform)
      │
      ▼
  Neo4j (Local Linux Server)
  ┌─────────────────────────────────────┐
  │  ~2,070 DocChunk nodes               │
  │  102 SMEKnowledge nodes             │
  │  Vector indexes (OpenAI embeddings) │
  │  Graph relationships                │
  │  User + Session nodes               │
  └─────────────────────────────────────┘
      ▲
      │ (ngrok tunnel)
      │
  OpenAI API
  (Embeddings: text-embedding-3-small)

  Claude API (Anthropic)
  (Generation: claude-sonnet-4-6 / opus-4-6)

  Atlas Gateway
  (api.7df8a5a7.5.us-west-2.prod.alltrue-be.com)
  (AI Runtime Demo — live policy enforcement)
  (Agentic Demo — AI Deal Research Agent)
```

---

## 3. Application Pages & API Routes

### UI Pages

| Page | Path | Description |
|---|---|---|
| Home | `/` | Navigation hub |
| Login | `/login` | OTP email auth + superuser bypass |
| Learn | `/learn` | 3-tier interactive course (22 lessons) |
| Ask | `/ask` | Agentic RAG Q&A — direct Atlas knowledge queries |
| Meeting | `/meeting` | Meeting Co-Pilot — live customer Q&A with context |
| Demo | `/demo` | Three tabs: (1) **Chain of Custody** — use case → Atlas template match → auto-deploy; (2) **Agentic Demo** — AI Deal Research Agent (5-agent workflow via Atlas Gateway, fire-and-poll, blocked-state UI); (3) **Mock Scenario Builder** |
| Runtime | `/runtime` | AI Runtime Demo — prompt traffic, MCP tool call simulation, multi-agent workflow simulation, custom scenario builder; all through Atlas Gateway with live policy enforcement |
| Architect | `/architect` | Architecture Builder — Mermaid diagram + narrative |
| Guides | `/guides` | Technical Guide Producer — grounded in Atlas docs + SME field knowledge |
| Analytics | `/analytics` | Interaction analytics dashboard |
| Resources | `/resources` | Competitive resource library |
| Knowledge | `/knowledge` | SME Knowledge Base — topic browser (11 categories), Q&A cards with confidence badges, SME-first chat |

### API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/auth` | POST / DELETE | Username/password login (internal users), session cookie |
| `/api/auth/send-code` | POST | Send 6-digit OTP to @varonis.com email via Resend |
| `/api/auth/verify-code` | POST | Verify OTP, issue JWT session cookie |
| `/api/auth/superuser` | POST | Superuser password login (no OTP) |
| `/api/me` | GET | Return current session user |
| `/api/learn` | POST | Proxy to n8n RAG workflow for lesson Q&A |
| `/api/judge` | POST | AI grading of student answers |
| `/api/ask` | POST | Direct RAG (vector + full-text + graph) → Claude |
| `/api/meeting` | POST | Agentic RAG with multi-turn conversation + attachments |
| `/api/architect` | POST | Proxy to n8n Architecture Builder workflow |
| `/api/guides` | POST | Proxy to n8n Guide Producer workflow |
| `/api/analytics` | GET | Pull interaction stats from Neo4j |
| `/api/sme/topics` | GET | Query Neo4j SMEKnowledge nodes grouped by topic |
| `/api/sme/chat` | POST | Proxy to n8n atlas-sme-query workflow for SME-first chat |
| `/api/demo/discover` | POST | Proxy to n8n Discover workflow — Claude matches use case to Atlas templates |
| `/api/demo/apply` | POST | Proxy to n8n Apply workflow — applies selected template to target Atlas project |
| `/api/demo/chain` | GET | Atlas API — full resource chain scan (read-only) |
| `/api/demo/chain/scenario` | POST | Atlas API — create mock scenario resources in Atlas inventory |
| `/api/demo/chain/projects` | GET | Atlas API — list all org projects, enriched with owner_email + orgId |
| `/api/demo/chain/resource` | GET | Atlas API — single resource detail |
| `/api/demo/chain/search` | POST | AI-powered resource search (Claude) |
| `/api/demo/runtime/simulate` | POST | Fires prompt traffic, MCP tool call chains, or multi-agent workflows through Atlas Gateway; handles custom scenarios; returns per-step blocked/sent/error results |
| `/api/demo/mcp/research` | POST | Fires atlas-mcp-research n8n webhook (AI Deal Research Agent); returns `{jobId, status: "pending"}` |
| `/api/demo/mcp/status` | GET | Polls Upstash KV key `mcp:{jobId}`; returns `done` (report) or `blocked` (Atlas guardrail message) |
| `/api/demo/chain/endpoints` | GET | Atlas API — fetches all LLM endpoint identifiers for the account (org-level, no project filter); used to populate Agentic Demo endpoint dropdown |
| `/api/demo/cleanup` | GET / DELETE | GET: count scenario resources in project; DELETE: remove all non-LLM resources from project (LLM endpoint types are excluded by blocklist) |
| `/api/resources/[slug]` | GET | Serve competitive resource files |
| `/api/sessions/share` | POST | Share meeting session |
| `/api/extract-context` | POST | Extract customer context from URL/doc |
| `/api/scrape-customer` | POST | Scrape customer website for meeting context |
| `/api/notifications` | GET | User notifications |
| `/api/preferences` | GET / POST | User preferences |
| `/api/users` | GET | User list (admin) |

---

## 4. Authentication & Security

### Authentication Flow — Standard Users (@varonis.com)

```
1. User enters @varonis.com email
2. /api/auth/send-code
   → Validates domain (@varonis.com only — hard-coded)
   → Rate limits: max 3 OTP requests per email per 10 minutes (Upstash Redis)
   → Generates cryptographically random 6-digit OTP
   → Stores OTP in Redis with 10-minute TTL: key = otp:{email}
   → Sends email via Resend API
3. User enters 6-digit code
4. /api/auth/verify-code
   → Fetches stored OTP from Redis
   → Validates match (constant-time-safe string compare)
   → Deletes OTP immediately (single-use — cannot be replayed)
   → Signs HS256 JWT (jose library) with SESSION_SECRET env var
   → Sets httpOnly, Secure, SameSite=Lax cookie: atlas_session
   → TTL: 8 hours
   → Creates/merges User node in Neo4j (fire-and-forget, non-blocking)
```

### Authentication Flow — Superuser

```
1. User enters ttadeo@timthecoder.net
2. Password prompt appears (no OTP sent)
3. /api/auth/superuser
   → Validates email matches hardcoded SUPERUSER_EMAIL constant
   → Validates password against SUPERUSER_PASSWORD env var
   → Issues identical HS256 JWT + httpOnly cookie (same 8-hour session)
```

### Session Management

| Property | Value |
|---|---|
| Cookie name | `atlas_session` |
| Token type | HS256 JWT |
| Signing secret | `SESSION_SECRET` (Vercel env var) |
| Duration | 8 hours |
| Cookie flags | httpOnly, Secure (prod), SameSite=Lax |
| Storage | Client-side cookie only (stateless JWT — no server-side session store) |

### Route Protection

All protected routes use the shared `requireAuth()` helper (`ui/lib/auth.ts`) which reads the `atlas_session` cookie and verifies the JWT. Unauthenticated requests return 401. All API routes except the four public auth endpoints use `requireAuth()`.

**Public exceptions (no auth required):**
- `/api/auth/send-code`
- `/api/auth/verify-code`
- `/api/auth/superuser`
- `/api/auth`

### Input Security

- **Lucene injection sanitization** — `/api/ask` and `/api/meeting` escape all Lucene special characters (`+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`) before passing queries to Neo4j full-text index
- **Domain restriction** — OTP flow rejects all non-@varonis.com addresses at the API layer
- **OTP rate limiting** — 3 requests per 10 minutes per email (Redis-enforced)
- **Single-use OTPs** — deleted from Redis immediately upon successful verification
- **Env var secrets** — all API keys, secrets, and passwords stored as **Sensitive** environment variables in Vercel (never in code or git; protected from plaintext read even by Vercel employees)

### Vercel Account Security (post-April 2026 incident)

- **2FA enabled** on `ttadeo` Vercel account (authenticator app)
- **Team 2FA enforcement enabled** — members without 2FA cannot access the team
- **All environment variables marked Sensitive** — protected from the env var enumeration attack vector that affected Vercel in April 2026

### Secrets Inventory (Vercel Environment Variables)

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | JWT signing secret |
| `SUPERUSER_PASSWORD` | Superuser bypass password |
| `RESEND_API_KEY` | Resend email API key (OTP delivery) |
| `KV_REST_API_URL` | Upstash Redis URL (OTP + rate limiting) |
| `KV_REST_API_TOKEN` | Upstash Redis auth token |
| `ANTHROPIC_API_KEY` | Claude API (generation) |
| `OPENAI_API_KEY` | OpenAI API key — dual use: embeddings (text-embedding-3-small) AND Atlas Gateway Bearer token |
| `NEO4J_URI` | Neo4j bolt URI (`bolt://7.tcp.ngrok.io:23280`) |
| `NEO4J_USER` | Neo4j username |
| `NEO4J_PASSWORD` | Neo4j password |
| `ATLAS_API_KEY` | Varonis Atlas custom integration key |
| `ATLAS_GATEWAY_URL` | Atlas Gateway base URL |
| `ATLAS_GATEWAY_ENDPOINT_ID` | Gateway endpoint identifier for AI Runtime Demo (`tadeo-demo-openai`, Unsanctioned-Tim project) |
| `ATLAS_DEMO_KEY` | Dedicated OpenAI API key registered ONLY in Tadeo-Demo-Environment — used by Agentic Demo (n8n `$vars.ATLAS_DEMO_KEY`); separate from `OPENAI_API_KEY` |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | n8n RAG workflow webhook (public, non-sensitive) |
| `N8N_ARCHITECT_WEBHOOK_URL` | n8n Architecture Builder webhook |
| `N8N_GUIDES_WEBHOOK_URL` | n8n Guide Producer webhook |
| `N8N_SME_WEBHOOK_URL` | n8n SME Knowledge chat webhook |
| `N8N_DEMO_DISCOVER_URL` | n8n Demo Provisioning Discover webhook |
| `N8N_MCP_WEBHOOK_URL` | n8n AI Deal Research Agent webhook (`atlas-mcp-research`) |
| `GITHUB_PAT` | GitHub personal access token |

---

## 5. Email Infrastructure & Domain Configuration

OTP login codes are sent from `ttadeo@timthecoder.net`. Delivering email reliably and securely from a custom domain requires three coordinated layers — domain DNS, email authentication records, and the sending service. Here's how they fit together:

### Domain: timthecoder.net

| Property | Value |
|---|---|
| Domain registrar | Google Domains |
| DNS management | Cloudflare (Full DNS setup) |
| Cloudflare nameservers | `amanda.ns.cloudflare.com`, `giancarlo.ns.cloudflare.com` |

The domain is registered through Google but **DNS is fully delegated to Cloudflare**. All DNS records (MX, TXT, CNAME) are managed in the Cloudflare dashboard, not in Google.

### Google Workspace (Email Receiving)

`ttadeo@timthecoder.net` is a Google Workspace mailbox. Inbound email is routed to Google via MX records in Cloudflare:

| Type | Name | Content |
|---|---|---|
| MX | timthecoder.net | aspmx.l.google.com (priority 1) |
| MX | timthecoder.net | alt1.aspmx.l.google.com (priority 5) |
| MX | timthecoder.net | alt2.aspmx.l.google.com (priority 5) |
| MX | timthecoder.net | alt3.aspmx.l.google.com (priority 10) |
| MX | timthecoder.net | alt4.aspmx.l.google.com (priority 10) |
| TXT | timthecoder.net | `v=spf1 include:_spf.google.com ~all` |
| TXT | google._domainkey | Google DKIM public key |

### Resend (Email Sending — OTP Codes)

**Resend** is the transactional email service that sends OTP login codes from `ttadeo@timthecoder.net` to `@varonis.com` recipients. Resend uses Amazon SES as its sending infrastructure under the hood.

For Resend to send *from* a Google Workspace domain without being flagged as spam, three DNS records are added to Cloudflare to authenticate Resend as an authorized sender:

| Type | Name | Content | Purpose |
|---|---|---|---|
| TXT | resend._domainkey | `p=MIGfMA0GCSqGSIb3D...` | DKIM — proves Resend signed the email |
| MX | send | feedback-smtp.us-east-1.amazonses.com | Bounce/complaint handling back to Resend |
| TXT | send | `v=spf1 include:amazonses.com ~all` | SPF — authorizes Amazon SES to send for this subdomain |

**Email authentication chain for an OTP email:**
```
1. SE enters @varonis.com email on /login
2. Next.js API calls Resend API with: from="ttadeo@timthecoder.net", to="{se}@varonis.com"
3. Resend routes through Amazon SES infrastructure
4. Receiving mail server (Google/Microsoft) validates:
   - SPF: send.timthecoder.net includes amazonses.com ✓
   - DKIM: resend._domainkey.timthecoder.net signature matches ✓
5. Email delivered to SE's @varonis.com inbox — "Your Atlas login code"
6. SE enters 6-digit code → verified against Upstash Redis → JWT issued
```

### Cloudflare Additional Features in Use

| Feature | Configuration |
|---|---|
| DNS management | Full (all records managed in Cloudflare) |
| AI crawler blocking | Enabled — "Block on all pages" (Cloudflare-managed rule) |
| robots.txt | "Instruct AI bot traffic with robots.txt" |
| Proxy status | `_domainconnect` CNAME is proxied; all email-related records are DNS-only (required for email auth) |

---

## 6. Development & Testing Tools

These tools were used during development and are not part of the production runtime.

| Tool | Purpose |
|---|---|
| **webhook.site** | Used during n8n workflow development to inspect raw webhook payloads |
| **n8n webhook-test URLs** | n8n provides `-test` variants of every webhook URL — used during active workflow editing; production uses `/webhook/...` |
| **Neo4j Browser** (localhost:7474) | GUI for running Cypher queries directly against the local Neo4j instance |
| **TrueLens** | RAG evaluation framework — runs 52 golden questions against the live system, scores Answer Relevance, Context Relevance, and Groundedness. Baseline: AR 1.000, CR 1.000, G 0.696 (2026-05-14) |

---

## 7. Software Stack

### Frontend

| Software | Version | Role |
|---|---|---|
| Next.js | 16.2.1 | Full-stack React framework (UI + API routes) |
| React | 19.2.4 | UI component library |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 4.x | Utility-first CSS framework |
| Mermaid.js | 11.15.0 | Architecture diagram rendering |
| react-markdown | 10.1.0 | Markdown rendering in chat UI |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown support |
| mammoth | 1.12.0 | Word document (.docx) parsing for meeting uploads |

### Backend / API

| Software | Version | Role |
|---|---|---|
| Next.js API Routes | 16.2.1 | Server-side API layer (runs on Vercel Edge/Node) |
| @anthropic-ai/sdk | 0.90.0 | Claude API client (generation) |
| openai | 6.34.0 | OpenAI client (embeddings + Atlas Gateway Bearer) |
| neo4j-driver | 6.0.1 | Neo4j graph database client |
| jose | 6.2.2 | JWT signing and verification (HS256) |
| resend | 6.12.2 | Transactional email (OTP delivery) |
| @upstash/redis | 1.37.0 | Redis client (OTP storage + rate limiting) |

### Infrastructure & Services

| Service | Plan | Role |
|---|---|---|
| Vercel | Hobby | UI hosting, CI/CD (auto-deploy on GitHub push), env var management |
| GitHub | Private repo | Source control (`ttadeo/AtlasLearningPlatform`) |
| n8n Cloud | Cloud | Workflow orchestration (agent pipelines) |
| Anthropic Claude | API | LLM generation (claude-sonnet-4-6 / claude-opus-4-6) |
| OpenAI | API | Text embeddings (text-embedding-3-small, 1536 dimensions) |
| Resend | Free tier | Transactional email (OTP codes) |
| Upstash Redis | Serverless | OTP storage, rate limiting (TTL-based) |
| ngrok | Paid | Tunnels for Neo4j: static TCP (bolt) + HTTP |

### Scraping & Ingestion (local tooling)

| Software | Role |
|---|---|
| Python 3.13 | Scraper + ingestion scripts |
| Playwright (async) | Authenticated browser scraping of Atlas Docusaurus docs |
| Playwright + CDP | Teams SME channel scraping — connects to existing Chrome session via Chrome DevTools Protocol |
| OpenAI Python SDK | Embedding generation during ingestion |
| neo4j Python driver | Bulk chunk ingestion into Neo4j |
| TrueLens | RAG evaluation framework |
| PyYAML | OpenAPI YAML spec parsing |

---

## 8. Data Stores

### Neo4j (Primary Knowledge & Session Store)

**Location:** Linux server at 192.168.1.165:7687 (local network)  
**Access from Vercel:** Via ngrok static TCP tunnel — `bolt://7.tcp.ngrok.io:23280`  
**Access from n8n:** Via ngrok HTTP tunnel — `https://uncompendious-unpurchased-shanita.ngrok-free.dev`

#### Node Types

| Label | Count | Purpose |
|---|---|---|
| `DocChunk` / `Chunk` | ~2,070 | Atlas documentation chunks (knowledge base, v3.4.0, 54 pages) |
| `SMEKnowledge` | 102 | Field-validated Q&A extracted from Varonis AI Security SME Teams channel |
| `UIPage` | ~486 (readCount) | Atlas UI navigation pages |
| `User` | 1 per SE | Tracks SE identity for session + analytics |
| `Session` | 1 per meeting | Meeting Co-Pilot session metadata |
| `Interaction` | 1 per Q&A turn | Individual question/answer pairs |
| `MeetingSession` | 1 per meeting | Extended meeting context and history |

#### SMEKnowledge Node Schema

```
(SMEKnowledge {
  thread_id,          // unique identifier
  question,           // the field question
  answer,             // validated field answer
  topic,              // category (Gateway Architecture, Guardrails, Deployment, etc.)
  confidence,         // sme_validated | community_consensus | tentative | incomplete
  key_contributors,   // author list (often "Unknown" due to Teams MCAS proxy)
  date_sensitive,     // boolean — answer may become stale
  notes,              // caveats or follow-up context
  source,             // "teams_ai_security_sme"
  raw_date,           // derived from Teams message ID (ms Unix timestamp)
  processed_at,       // pipeline processing timestamp
  embedding           // 1536-dim OpenAI vector
})
(SMEKnowledge)-[:RELATED_TO {score}]->(DocChunk)
```

#### SMEKnowledge Topic Distribution

102 nodes total (last scraped 2026-06-30). Distribution from last run:

| Topic | Count |
|---|---|
| gateway_architecture | 14 |
| deployment | 14 |
| guardrails | 12 |
| discovery | 12 |
| roadmap | 5 |
| competitive | 4 |
| other | 4 |
| shadow_ai | 3 |
| licensing | 3 |
| compliance | 3 |
| ide_support | 2 |
| pii_detection | 1 |

#### Vector Indexes

| Index Name | Labels | Dimensions | Similarity | Purpose |
|---|---|---|---|---|
| `atlas_chunk_embeddings` | DocChunk | 1536 | Cosine | Main RAG retrieval index |
| `ui_page_embeddings` | UIPage | 1536 | Cosine | UI navigation search |
| `interaction_embeddings` | Interaction | 1536 | Cosine | Past interaction retrieval |
| `meeting_session_embeddings` | MeetingSession | 1536 | Cosine | Meeting context retrieval |
| *(SMEKnowledge embedding)* | SMEKnowledge | 1536 | Cosine | SME knowledge retrieval |

#### Knowledge Base Composition

| Source | Nodes | Description |
|---|---|---|
| Atlas Docs (Playwright scraper, v3.4.0) | ~2,070 DocChunk | 54 documentation pages, scraped 2026-06-10 |
| Teams AI Security SME Channel | 102 SMEKnowledge | Field-validated Q&A, 12 topics, last scraped 2026-06-30 |

#### RAG Retrieval Strategy (`/api/ask`, `/api/meeting`)
- **Vector search** — top-K cosine similarity via `atlas_chunk_embeddings`
- **Full-text search** — keyword match via Lucene full-text index (Lucene-sanitized query)
- **UI page search** — via `ui_page_embeddings`
- All three run in parallel, results merged and deduplicated before Claude generation

#### Guide Producer Retrieval Strategy (`/api/guides` → n8n)
- **DocChunks** — top-10 by vector similarity
- **SMEKnowledge** — top-6 via RELATED_TO edges from matched DocChunks
- Both fed to Claude with a prompt instructing it to surface SME field notes as callouts

#### SME Chat Retrieval Strategy (`/api/sme/chat` → n8n → atlas-sme-query)
- **SMEKnowledge** — top-5 by vector similarity (score > 0.6 threshold)
- **DocChunks** — top-3 supplementary (score > 0.5 threshold)
- Claude generates SME-first answer, citing field knowledge over docs

### Upstash Redis (Ephemeral / Auth)

**Provider:** Upstash (serverless Redis)  
**Access:** REST API via `@upstash/redis` client  
**Data stored:**

| Key Pattern | TTL | Content |
|---|---|---|
| `otp:{email}` | 10 minutes | 6-digit OTP code (deleted on use) |
| `ratelimit:{email}` | 10 minutes | OTP request counter (max 3) |
| `guide:{jobId}` | 24 hours | Async guide generation result (Guide Producer fire-and-poll) |
| `mcp:{jobId}` | 24 hours | Async AI Deal Research Agent result — `{status: "done"\|"blocked", company, report, risk_analysis, sources, atlas_audit}` or `{status: "blocked", blocked_at, atlas_message, atlas_audit}` |

### Vercel (No persistent storage)

Vercel hosts the Next.js application. No database or file storage is used on Vercel itself — all persistence goes to Neo4j (knowledge + sessions) or Upstash Redis (auth).

---

## 9. n8n Workflows

All agentic pipelines run in **n8n Cloud** (`ttadeo.app.n8n.cloud`). The Next.js API routes call these workflows via authenticated webhooks.

| Workflow | Webhook Path | Purpose |
|---|---|---|
| Atlas RAG - Knowledge Retrieval | `atlas-rag-query` | Powers /learn and proxied Q&A — embed → vector search → Claude |
| Atlas Architecture Builder | `atlas-architect` | RAG-grounded Mermaid diagram + narrative generation |
| Atlas Guide Producer | `atlas-guide-producer` | Queries DocChunks (top 10) + SMEKnowledge (top 6 via RELATED_TO) → Claude; generates guides with SME field notes |
| Atlas Demo Provisioning - Discover | `atlas-demo-discover` | Webhook → Claude (Basic LLM Chain) → Code node → scored template matches |
| Atlas Demo Provisioning - Apply | `atlas-demo-apply` | Webhook → Atlas API apply call → result JSON |
| Atlas SME Query | `atlas-sme-query` | SME-first chat for /knowledge page — embed → SMEKnowledge search (top 5) → DocChunk search (top 3) → Claude |
| Atlas MCP Multi-Agent Research | `atlas-mcp-research` | AI Deal Research Agent — Orchestrator → Exa Research → Exa News → Risk Analyst → Report Agent; all LLM calls through Atlas Gateway; writes result to Upstash KV; handles blocked state via error output |

### Atlas SME Query Workflow (n8n)

```
Webhook (POST /webhook/atlas-sme-query)
  → Embed Question (OpenAI text-embedding-3-small)
  → Prepare SME Query (Cypher: SMEKnowledge vector search, top 5, score > 0.6)
  → Query Neo4j SMEKnowledge
  → Prepare Doc Query (Cypher: DocChunk vector search, top 3, score > 0.5)
  → Query Neo4j DocChunks
  → Merge Contexts
  → Generate Answer (Claude Sonnet — SME-first system prompt)
  → Format Response (confidence badge, source attribution)
  → Respond to Webhook
```

### Atlas Guide Producer Workflow — Updated (n8n)

```
Webhook (POST /webhook/atlas-guide-producer)
  → Embed Query
  → Query DocChunks (top 10, vector search)
  → Query SMEKnowledge (top 6, via RELATED_TO edges from matched chunks)
  → Merge both context sets
  → Claude (system prompt: surface SME notes as "Field Note" callouts)
  → Respond to Webhook
```

### AI Deal Research Agent Workflow (atlas-mcp-research)

```
Webhook (POST /webhook/atlas-mcp-research, responseMode: onReceived → ACK immediately)
  → Prepare Orchestrator Body
  → Orchestrator LLM (Atlas Gateway, gpt-4o) ─── [ERROR] → Handle Orchestrator Block → Write Blocked to Upstash
  → Parse Research Plan
  → Exa Research Search (sequential)
  → Exa News Search (sequential)
  → Prepare Risk Body
  → Risk Analyst LLM (Atlas Gateway, gpt-4o) ──── [ERROR] → Handle Risk Block → Write Blocked to Upstash
  → Prepare Report Body
  → Report Agent LLM (Atlas Gateway, gpt-4o) ──── [ERROR] → Handle Report Block → Write Blocked to Upstash
  → Build Final Result
  → Write to Upstash (mcp:{jobId}, 24hr TTL)
```

**Error handling:** Each LLM node has `onError: "continueErrorOutput"` — Atlas 4xx/block responses trigger the error pin, handler writes `{status: "blocked", blocked_at, atlas_message}` to Upstash, UI surfaces the message within seconds (no 5-minute timeout).

**n8n import note:** Error output connections are NOT preserved on workflow import. After importing, manually set each LLM node's "On Error" to "Continue (using error output)" and draw the error pin connections in the canvas.

### Demo Provisioning — Auto-Deploy Flow

When the SE enables the **Auto-Deploy** toggle in `/demo`:
1. Discover runs → top-scored template or custom recommendation identified
2. Apply fires immediately (no Step 2 review)
3. SE lands directly on Step 3 "Demo Environment Ready"
4. If apply fails, falls back to Step 2 for manual review

### n8n → Neo4j Connection

- **URL:** `https://uncompendious-unpurchased-shanita.ngrok-free.dev/db/neo4j/tx/commit`
- **Auth:** Basic auth (Neo4j credentials)
- **Required header:** `ngrok-skip-browser-warning: true`

---

## 10. AI Runtime Demo

The `/runtime` page fires live AI traffic through the Atlas Gateway and displays results with per-step status, policy violation details, and SE talking points.

### Simulation Types

| Type | Description |
|---|---|
| **Prompt Traffic** | Fires pre-crafted prompts directly through the Gateway. 3 scenarios: Healthcare (PHI), Financial Services (MNPI/PII), E-Commerce (injection + exfiltration) |
| **MCP Call Simulation** | Constructs full OpenAI multi-turn message chains (user → assistant tool_call → tool result) simulating real MCP server responses. Atlas intercepts at the tool result layer. 3 scenarios × 2 tool chains each |
| **Multi-Agent Workflow** | Fires a sequential 4-step agent pipeline (plan → retrieve → summarize → write). When Atlas blocks a step, remaining steps are marked skipped — chain interrupted. 2 scenarios |
| **Custom Scenario** | SE enters any prompt, optional label, and risk type — fires directly through the Gateway against live policies |

### MCP Simulation — How It Works

Each MCP scenario constructs the exact OpenAI multi-turn message format an AI Gateway sees when proxying real MCP traffic:

```
Message 1: role="user"      → SE's original request to the AI agent
Message 2: role="assistant" → Agent's tool_call decision (no content, just function call)
Message 3: role="tool"      → MCP server's response (the sensitive data — where Atlas fires)
```

Atlas scans the entire context window including `tool` role messages. The sensitive data in the tool result (credentials, PHI, M&A data) triggers `content_policy_violation` before the LLM processes it.

### Results Panel

After each simulation run:
- **Result cards** — per-prompt or per-step status (BLOCKED / SENT / SKIPPED / ERROR)
- **Simulation timestamp** — "Fired at HH:MM:SS" badge for correlating with Atlas AI Investigation
- **Atlas Investigation deep-link** — opens AI Investigation pre-filtered to your tenant
- **Talking Points panel** — what just happened, Atlas features demonstrated, suggested next customer questions (per scenario)

### Atlas Gateway Configuration

**Key principle:** Atlas attributes gateway traffic by **API key** (Bearer token), NOT by endpoint identifier. The identifier header is metadata/label only. If the same API key is registered in multiple projects, Atlas routes to the first-registered project regardless of the identifier. Each demo target needs its own dedicated API key.

#### AI Runtime Demo (`/runtime`)

| Property | Value |
|---|---|
| Gateway URL | `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1` |
| Auth | `Authorization: Bearer <OPENAI_API_KEY>` (Vercel env var) |
| Endpoint identifier | `x-alltrue-llm-endpoint-identifier: tadeo-demo-openai` |
| Model | `gpt-4o-mini` |
| Atlas project | Unsanctioned-Tim-The-AI-Guy (`68869c92-9502-432c-8508-713264a919c7`) |
| Active policies | PII Detection — CONFIRMED WORKING; MCP Quarantine Rule active |
| Session header | `x-alltrue-llm-firewall-user-session` (required) |

#### Agentic Demo — AI Deal Research Agent (`/demo` Agentic tab)

| Property | Value |
|---|---|
| Gateway URL | `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1/chat/completions` |
| Auth | `Authorization: Bearer <ATLAS_DEMO_KEY>` (n8n variable `$vars.ATLAS_DEMO_KEY`) |
| Endpoint identifier | `x-alltrue-llm-endpoint-identifier: ={{ $json.endpointId }}` (dynamic — SE selects from dropdown) |
| Endpoint dropdown | Populated on mount by `/api/demo/chain/endpoints` — fetches all LLM endpoints at account/org level |
| Model | `gpt-4o` |
| Atlas project | SE selects project from dropdown; traffic attributed via API key |
| Session header | `x-alltrue-llm-firewall-user-session` (required) |
| Blocked state | n8n error output → Handle *X* Block node → Upstash write `{status: "blocked", atlas_message: ...}` → UI surfaces Atlas guardrail message within ~8s |
| Policy demo flow | Policy OFF → full 5-step research report; Policy ON → Atlas block message appears in UI at the step that triggered it |

**CRITICAL — Delete All safety:** The cleanup route (`/api/demo/cleanup`) excludes LLM endpoint resource types (`OpenAIEndpoint`, `CustomLlmEndpoint`, `ModelPackage`) from deletion. These are registered at the org level — patching their `project_ids` to `[]` removes them from the org entirely, not just the project. Only scenario-builder resources (users, apps, data stores, policies) are deleted.

---

## 11. Atlas API Integration

The platform integrates directly with the Varonis Atlas API for demo provisioning and resource management.

| Property | Value |
|---|---|
| Base URL | `https://api.prod.alltrue-be.com` |
| Auth method | POST `/v1/auth/issue-jwt-token` with `X-API-Key` header |
| API Key | `ATLAS_API_KEY` Vercel env var |
| Customer ID | `7df8a5a7-1173-4b29-b9a0-100281c010b2` |

---

## 12. Teams SME Pipeline

Extracts field-validated Q&A from the Varonis AI Security SME Teams channel and ingests into Neo4j as `SMEKnowledge` nodes. All scripts are in `scraper/`.

### Pipeline Steps

| Step | Script | Input | Output |
|---|---|---|---|
| 1. Scrape | `scrape_teams_sme.py` | Chromium (CDP) on Teams channel | `raw_threads_latest.json` |
| 2. Regroup | `regroup_threads.py` | raw_threads | `regrouped_threads_latest.json` |
| 3. LLM Process | `process_teams_sme.py` | regrouped_threads | `processed_qa_latest.json` |
| 4. Ingest | `ingest_teams_sme.py` | processed_qa | Neo4j SMEKnowledge nodes |

### Step Details

**Step 1 — Scrape (Playwright + CDP):**
- Connects to an already-open **Chromium** session via `--remote-debugging-port=9222`
- **Must use Chromium, NOT Chrome** — Chromium has the saved Varonis/Teams session
- Launch: `/Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222`
- Does NOT launch a new browser — requires Chromium running with CDP enabled
- Extracts message text and IDs (IDs are ms Unix timestamps, used for ordering)
- Output: raw message list with derived timestamps

**Step 2 — Regroup (temporal proximity):**
- Groups adjacent messages within a 5-minute gap into conversation threads
- 934 messages → 475 threads (2026-06-03 run)

**Step 3 — LLM Process (Haiku + Sonnet):**
- **Haiku classify:** is this thread a meaningful Q&A or noise? 475 → 234 kept
- **Sonnet extract:** pull structured question, answer, topic, confidence, date_sensitive flag
- 234 threads → 62 active Q&A pairs (6 superseded)

**Step 4 — Ingest:**
- Embeds each Q&A pair (OpenAI text-embedding-3-small on the question text)
- MERGE into Neo4j (upsert by thread_id — safe for incremental re-runs)
- Creates RELATED_TO edges to matching DocChunk nodes (vector similarity)

### Re-run Instructions

```bash
# 1. Launch Chromium with CDP (Chromium has saved Varonis/Teams session — NOT Chrome)
/Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222
# Navigate to the "AI Security - SME" Teams channel

cd /Users/timtadeo/Desktop/AtlasLearningPlatform
source scraper/atlas-docs-scraper/bin/activate
set -a && source ui/.env.local && set +a  # EXA_API_KEY warning is harmless

python scraper/scrape_teams_sme.py        # Step 1 — hit Enter when prompted
python scraper/regroup_threads.py         # Step 2
python scraper/process_teams_sme.py       # Step 3 (~10-15 min, Anthropic 500s non-fatal)
echo "1" | python scraper/ingest_teams_sme.py  # Step 4 — option 1 = MERGE (incremental)
```

**Known constraints:**
- Authors show as "Unknown" — Teams MCAS proxy hides author names in DOM
- `SCRAPE_SINCE` is auto-detected from last run — no manual date edits needed

---

## 13. Infrastructure Diagram (Detailed)

```
┌─────────────────────────────────────────────────────────────────┐
│                        Varonis SE Browser                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Vercel (Next.js 16)                           │
│  atlas-learning-platform.vercel.app                             │
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │  /learn  │ │   /ask   │ │ /meeting │ │  /demo           │  │
│  │  /guides │ │/architect│ │/analytics│ │  /resources      │  │
│  │ /runtime │ │/knowledge│ │  /login  │ │  /               │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘  │
│       │             │            │                 │             │
│  ┌────▼─────────────▼────────────▼─────────────────▼─────────┐ │
│  │                     API Routes                              │ │
│  │  requireAuth() JWT check on every protected route          │ │
│  └────┬────────────┬──────────────┬────────────────┬──────────┘ │
└───────┼────────────┼──────────────┼────────────────┼────────────┘
        │            │              │                 │
        ▼            ▼              ▼                 ▼
   n8n Cloud    Neo4j (bolt)   Atlas API        Atlas Gateway
   Workflows    via ngrok      (prod.alltrue)   (runtime demo)
        │
        ├─→ OpenAI (embeddings)
        ├─→ Claude (generation)
        └─→ Neo4j HTTP (via ngrok)

External APIs called directly from Next.js API routes:
  ├─→ Anthropic Claude  (ask, meeting, judge, demo search)
  ├─→ OpenAI            (ask, meeting — embeddings)
  ├─→ Neo4j bolt        (ask, meeting, analytics, sme/topics, auth)
  ├─→ Atlas Gateway     (runtime/simulate — prompt, MCP, agent, custom)
  ├─→ Atlas API         (demo/chain endpoints)
  ├─→ Resend            (auth/send-code — OTP email)
  └─→ Upstash Redis     (auth/send-code, auth/verify-code)
```

---

## 14. Data Flow — RAG Query (/ask)

```
1. SE types question in /ask
2. POST /api/ask { question, sessionId }
3. API route runs in parallel:
   a. OpenAI: embed question → 1536-dim vector
   b. Build Lucene-sanitized keyword query
4. Neo4j (3 parallel queries):
   a. Vector search: atlas_chunk_embeddings, top-8 by cosine similarity
   b. Full-text search: atlas_chunk_text index, keyword match
   c. UI page search: ui_page_embeddings, top-3
5. Merge + deduplicate results → context string
6. Anthropic Claude: system prompt + context + question → answer
7. Response streamed back to browser
8. Interaction stored in Neo4j (Session → Interaction → Chunk relationships)
```

---

## 15. Local Infrastructure (Linux Server)

| Property | Value |
|---|---|
| IP | 192.168.1.165 |
| Neo4j bolt port | 7687 |
| Neo4j HTTP port | 7474 |
| RAM | 62 GB |
| Swap | 31 GB |
| Disk (home) | 851 GB |
| Disk (root) | 70 GB (15% used) |
| Disk (models) | 932 GB at /data/models |

### ngrok Tunnel Configuration (Paid Plan)

| Tunnel | Type | Address | Used By |
|---|---|---|---|
| neo4j-bolt | TCP (static) | `7.tcp.ngrok.io:23280` | Vercel → Neo4j |
| neo4j-http | HTTP | `https://uncompendious-unpurchased-shanita.ngrok-free.dev` | n8n → Neo4j |

- Paid plan: no 30-second timeout, no browser interstitial
- Static TCP address is permanent (reserved on paid plan)
- ngrok runs as systemd service — starts automatically on reboot
- Stale PID fix applied: `ExecStartPre` PID cleanup in `/etc/systemd/system/neo4j.service.d/override.conf`

---

## 16. Deployment Process

1. Code changes committed to `main` branch on GitHub
2. Vercel detects push → automatic build and deploy (CI/CD)
3. No manual deploy steps required
4. Environment variables managed in Vercel dashboard (all marked Sensitive)

**Default behavior:** Always push to Vercel (commit + push to GitHub). Only test locally when explicitly instructed.
