# Atlas Learning Platform — Architecture & Security Documentation

**Audience:** Internal (Varonis SEs and technical staff)  
**Last Updated:** 2026-05-20 (rev 3 — added AI Runtime Demo, Atlas Gateway active, auto-deploy, project scoping)  
**Purpose:** Comprehensive reference covering system architecture, authentication/security, software stack, and data stores.

---

## 1. System Overview

The Atlas Learning Platform is an internal AI-powered tool for Varonis SEs. It provides:

- **Interactive learning** — 3-tier course on the Atlas AI Security Platform
- **Architecture Builder** — generates reference architectures grounded in Atlas documentation
- **Technical Guide Producer** — generates deployment and integration guides
- **Meeting Co-Pilot** — real-time Q&A support during customer calls
- **Demo Provisioning** — describe a customer use case → Claude matches and auto-deploys Atlas policy templates
- **AI Runtime Demo** — fires live prompt traffic through the Atlas Gateway to demonstrate real-time policy enforcement and AI Investigation visibility
- **Agentic RAG** — all responses are grounded in official Atlas documentation via vector + semantic search

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
  ┌────────────────────────────┐
  │  3,038 knowledge chunks    │
  │  Vector index (OpenAI emb) │
  │  Graph relationships       │
  │  User + Session nodes      │
  └────────────────────────────┘
      ▲
      │ (ngrok tunnel)
      │
  OpenAI API
  (Embeddings: text-embedding-3-small)

  Claude API (Anthropic)
  (Generation: claude-sonnet-4-6 / opus-4-6)
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
| Demo | `/demo` | Demo Provisioning (use case → template match → auto-deploy), Chain of Custody, Mock Scenario Builder |
| Runtime | `/runtime` | AI Runtime Demo — fires prompt traffic through Atlas Gateway, shows live policy enforcement in Atlas AI Investigation |
| Architect | `/architect` | Architecture Builder — Mermaid diagram + narrative |
| Guides | `/guides` | Technical Guide Producer |
| Analytics | `/analytics` | Interaction analytics dashboard |
| Resources | `/resources` | Competitive resource library |

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
| `/api/demo/discover` | POST | Proxy to n8n Discover workflow — Claude matches use case to Atlas templates, returns scored recommendations |
| `/api/demo/apply` | POST | Proxy to n8n Apply workflow — applies selected template to target Atlas project |
| `/api/demo/chain` | GET | Atlas API — full resource chain scan (read-only) |
| `/api/demo/chain/scenario` | POST | Atlas API — create mock scenario resources in Atlas inventory |
| `/api/demo/chain/projects` | GET | Atlas API — list all org projects (used to populate project dropdown) |
| `/api/demo/chain/resource` | GET | Atlas API — single resource detail |
| `/api/demo/chain/search` | POST | AI-powered resource search (Claude) |
| `/api/demo/runtime/simulate` | POST | Fires pre-crafted prompts through Atlas Gateway — returns blocked/sent/error per prompt |
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

All protected routes check for a valid `atlas_session` cookie on the server side (Next.js API routes read the cookie and verify the JWT). Unauthenticated requests return 401.

### Input Security

- **Lucene injection sanitization** — `/api/ask` and `/api/meeting` escape all Lucene special characters (`+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`) before passing queries to Neo4j full-text index
- **Domain restriction** — OTP flow rejects all non-@varonis.com addresses at the API layer
- **OTP rate limiting** — 3 requests per 10 minutes per email (Redis-enforced)
- **Single-use OTPs** — deleted from Redis immediately upon successful verification
- **Env var secrets** — all API keys, secrets, and passwords stored in Vercel environment variables (never in code or git)

### Secrets Inventory (Vercel Environment Variables)

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | JWT signing secret |
| `SUPERUSER_PASSWORD` | Superuser bypass password |
| `USERS` | Internal user list (format: `user:pass,user2:pass2`) |
| `RESEND_API_KEY` | Resend email API key (OTP delivery) |
| `KV_REST_API_URL` | Upstash Redis URL (OTP + rate limiting) |
| `KV_REST_API_TOKEN` | Upstash Redis auth token |
| `ANTHROPIC_API_KEY` | Claude API (generation) |
| `OPENAI_API_KEY` | OpenAI API (embeddings: text-embedding-3-small) |
| `NEO4J_URI` | Neo4j bolt URI (`bolt://7.tcp.ngrok.io:23280`) |
| `NEO4J_USER` | Neo4j username |
| `NEO4J_PASSWORD` | Neo4j password |
| `ATLAS_API_KEY` | Varonis Atlas custom integration key |
| `N8N_WEBHOOK_URL` | n8n RAG workflow webhook |
| `N8N_WEBHOOK_SECRET` | n8n webhook authentication header |
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Public n8n URL (client-side, non-sensitive) |

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
| **webhook.site** | Used during n8n workflow development to inspect raw webhook payloads — paste a webhook.site URL as the n8n webhook target to see exact JSON structure before wiring up real endpoints |
| **n8n webhook-test URLs** | n8n provides `-test` variants of every webhook URL (e.g., `/webhook-test/atlas-rag-query`) — used during active workflow editing; production uses `/webhook/...` |
| **Neo4j Browser** (localhost:7474) | GUI for running Cypher queries directly against the local Neo4j instance during development |
| **TruLens** | RAG evaluation framework — runs 52 golden questions against the live system, scores Answer Relevance, Context Relevance, and Groundedness |

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
| openai | 6.34.0 | OpenAI client (embeddings) |
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
| OpenAI Python SDK | Embedding generation during ingestion |
| neo4j Python driver | Bulk chunk ingestion into Neo4j |
| TruLens | RAG evaluation framework |
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
| `Chunk` | ~3,038 | Atlas documentation chunks (knowledge base) |
| `UIPage` | ~486 (readCount) | Atlas UI navigation pages |
| `User` | 1 per SE | Tracks SE identity for session + analytics |
| `Session` | 1 per meeting | Meeting Co-Pilot session metadata |
| `Interaction` | 1 per Q&A turn | Individual question/answer pairs |
| `MeetingSession` | 1 per meeting | Extended meeting context and history |

#### Vector Indexes

| Index Name | Labels | Dimensions | Similarity | Purpose |
|---|---|---|---|---|
| `atlas_chunk_embeddings` | Chunk | 1536 | Cosine | Main RAG retrieval index |
| `ui_page_embeddings` | UIPage | 1536 | Cosine | UI navigation search |
| `interaction_embeddings` | Interaction | 1536 | Cosine | Past interaction retrieval |
| `meeting_session_embeddings` | MeetingSession | 1536 | Cosine | Meeting context retrieval |

#### Knowledge Base Composition (3,038 chunks)

| Source | Chunks | Description |
|---|---|---|
| Atlas Docs (scraper) | ~2,143 | All Atlas documentation pages (37 sections) |
| OpenAPI Reference | ~895 | All Atlas API endpoints (by tag) |

#### RAG Retrieval Strategy (`/api/ask`, `/api/meeting`)
- **Vector search** — top-K cosine similarity via `atlas_chunk_embeddings`
- **Full-text search** — keyword match via Lucene full-text index (Lucene-sanitized query)
- **UI page search** — via `ui_page_embeddings`
- All three run in parallel, results merged and deduplicated before Claude generation

### Upstash Redis (Ephemeral / Auth)

**Provider:** Upstash (serverless Redis)  
**Access:** REST API via `@upstash/redis` client  
**Data stored:**

| Key Pattern | TTL | Content |
|---|---|---|
| `otp:{email}` | 10 minutes | 6-digit OTP code (deleted on use) |
| `ratelimit:{email}` | 10 minutes | OTP request counter (max 3) |

No persistent user data — Redis is used only for ephemeral auth state.

### Vercel (No persistent storage)

Vercel hosts the Next.js application. No database or file storage is used on Vercel itself — all persistence goes to Neo4j (knowledge + sessions) or Upstash Redis (auth).

---

## 9. n8n Workflows

All agentic pipelines run in **n8n Cloud** (`ttadeo.app.n8n.cloud`). The Next.js API routes call these workflows via authenticated webhooks.

| Workflow | Webhook URL | Purpose |
|---|---|---|
| Atlas RAG - Knowledge Retrieval | `/webhook/atlas-rag-query` | Powers /learn and proxied Q&A — embed → vector search → Claude |
| Atlas Architecture Builder | `/webhook/atlas-architecture-builder` | RAG-grounded Mermaid diagram + narrative generation |
| Atlas Guide Producer | `/webhook/atlas-guide-producer` | RAG-grounded technical guide generation |
| Atlas Demo Provisioning - Discover | `/webhook/atlas-demo-discover` | Webhook → Claude (Basic LLM Chain) → Code node → returns scored template matches as JSON |
| Atlas Demo Provisioning - Apply | `/webhook/atlas-demo-apply` | Webhook → Atlas API apply call → Respond to Webhook with result JSON |

### Demo Provisioning — Discover Workflow (n8n)

```
Webhook (POST /webhook/atlas-demo-discover)
  → Basic LLM Chain (Anthropic Chat Model: claude-sonnet-4-6)
      System prompt: match use case to Atlas templates, return JSON with
      existing_matches[], custom_recommendation, recommendation, recommendation_reason
  → Code node: parse + validate JSON output
  → Respond to Webhook: return structured JSON to Next.js
```

### Demo Provisioning — Auto-Deploy Flow

When the SE enables the **Auto-Deploy** toggle in `/demo`:
1. Discover runs → top-scored template or custom recommendation identified
2. Apply fires immediately (no Step 2 review)
3. SE lands directly on Step 3 "Demo Environment Ready"
4. If apply fails, falls back to Step 2 for manual review

Without auto-deploy: SE reviews scored results at Step 2 and clicks "Apply This →" manually.

### n8n → Neo4j Connection

- **URL:** `https://uncompendious-unpurchased-shanita.ngrok-free.dev/db/neo4j/tx/commit`
- **Auth:** Basic auth (Neo4j credentials)
- **Required header:** `ngrok-skip-browser-warning: true`

---

## 10. Atlas API Integration

The platform integrates directly with the Varonis Atlas API for demo provisioning and resource management.

| Property | Value |
|---|---|
| Base URL | `https://api.prod.alltrue-be.com` |
| Auth method | POST `/v1/auth/issue-jwt-token` with `X-API-Key` header |
| API Key | `ATLAS_API_KEY` Vercel env var |
| Customer ID | `7df8a5a7-1173-4b29-b9a0-100281c010b2` |

### Atlas Gateway (ACTIVE — confirmed working 2026-05-19)

| Property | Value |
|---|---|
| Gateway URL | `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1` |
| Auth pattern | `Authorization: Bearer <OPENAI_API_KEY>` — use the OpenAI sk-proj-... key, NOT the Firewall Proxy key |
| Routing header | `x-alltrue-llm-endpoint-identifier: tadeo-demo-openai` (required — omitting returns 400 "Unsanctioned endpoint") |
| Registered endpoint | `tadeo-demo-openai` — display name: OpenAI API Key (Tadeo-Demo), Status: Active/Approved |
| Endpoint resource ID | `0f051c49-d1ad-401d-b10e-f1e72023a9f7` |
| Atlas project | Unsanctioned-Tim-The-AI-Guy (`68869c92-9502-432c-8508-713264a919c7`) |
| Vercel env vars | `ATLAS_GATEWAY_URL`, `ATLAS_GATEWAY_ENDPOINT_ID`, `OPENAI_API_KEY` |
| Traffic visibility | AI Usage counts + AI Investigation → Events → Prompt Events |
| Policy pending | PII Detection — enable in AI Inventory → OpenAI API Key (Tadeo-Demo) → Runtime Protection Policies → Alert |

**Note:** The Firewall Proxy key (`vSHNaaNO9W0G0Olau2xouE7fgCwehqer`) is for Atlas SDK/admin operations only — never use it as Gateway Bearer.

---

## 11. Infrastructure Diagram (Detailed)

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
│  ┌─────────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   /learn    │  │  /ask    │  │ /meeting │  │  /demo      │ │
│  │   /guides   │  │/architect│  │/analytics│  │  /resources │ │
│  └──────┬──────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘ │
│         │              │              │                │         │
│  ┌──────▼──────────────▼──────────────▼────────────────▼──────┐ │
│  │                   API Routes                                │ │
│  │  Auth: JWT verify on every request                         │ │
│  └────┬────────────────┬──────────────┬───────────────────────┘ │
└───────┼────────────────┼──────────────┼─────────────────────────┘
        │                │              │
        ▼                ▼              ▼
   n8n Cloud        Neo4j (bolt)    Atlas API
   Workflows        via ngrok       (prod.alltrue-be.com)
        │
        ├─→ OpenAI (embeddings)
        ├─→ Claude (generation)
        └─→ Neo4j HTTP (via ngrok)

External APIs called from Next.js API routes:
  ├─→ Anthropic Claude (ask, meeting, judge, demo search)
  ├─→ OpenAI (ask, meeting — embeddings)
  ├─→ Neo4j bolt (ask, meeting, analytics, auth — direct)
  ├─→ Resend (send-code — OTP email)
  └─→ Upstash Redis (send-code, verify-code — OTP store)
```

---

## 12. Data Flow — RAG Query (/ask)

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

## 13. Local Infrastructure (Linux Server)

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

---

## 14. Deployment Process

1. Code changes committed to `main` branch on GitHub
2. Vercel detects push → automatic build and deploy (CI/CD)
3. No manual deploy steps required
4. Environment variables managed in Vercel dashboard (not in git)

**Default behavior:** Always push to Vercel (commit + push to GitHub). Only test locally when explicitly instructed.
