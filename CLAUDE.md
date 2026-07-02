# Atlas Learning Platform — Claude Context

## Project Purpose
An interactive learning and field enablement platform for the Varonis Atlas AI Security Platform. Built for Varonis SEs and technical staff — internal use only, not customer-facing.

---

## Tech Stack
- **Vercel** — UI hosting (Next.js, auto-deploy on push to main)
- **n8n Cloud** — Agent workflow orchestration (ttadeo.app.n8n.cloud)
- **Neo4j** — RAG knowledge graph (vector + semantic search, local Linux server)
- **Upstash Redis** — Async job results store (guide generation fire-and-poll + Ask Atlas session history)
- **Anthropic Claude** — Primary LLM (claude-sonnet-4-6 default; claude-opus-4-8 available)
- **OpenAI** — Embeddings only (text-embedding-3-small)
- **Resend** — OTP email auth
- **GitHub** — Private repo (ttadeo/AtlasLearningPlatform)

---

## Architecture

```
Varonis SE (Browser)
        │
        ▼
Vercel — Next.js
  UI Pages + API Routes
  JWT auth (requireAuth) on every protected route
        │
        ├──────────────────────────────────────────┐
        │                                          │
        ▼                                          ▼
n8n Cloud Workflows                      Upstash Redis (KV)
  /guides, /architect                     async guide job results (guide:{jobId})
  /knowledge (atlas-sme-query)            Ask Atlas session history (ask_session:{id})
        │                                 polled by UI every 3s
        ├─→ OpenAI (text-embedding-3-small)
        ├─→ Claude Sonnet 4.6 (generation)
        └─→ Neo4j via ngrok HTTP
               ├── DocChunk nodes (Atlas v3.4.0 docs — 2,070 chunks)
               ├── SMEKnowledge nodes (Teams Q&A — 102 nodes)
               │         └── RELATED_TO → DocChunk
               └── LearnedQA nodes (community knowledge — grows with usage)
                         └── learned_qa_embeddings vector index

Direct Neo4j routes (bypass n8n): /ask, /meeting, /api/sme/topics

                                    Atlas Gateway
                                    (AI Runtime Demo)
                                    live policy enforcement
```

### Async Guide Generation Pattern
The Guide Producer bypasses Cloudflare's 100s timeout via fire-and-poll:
```
UI → POST /api/guides → n8n ACK (<1s, responseMode: onReceived)
                              │  runs 2-5 min asynchronously
                              └─→ Upstash Redis: SET guide:{jobId} via /pipeline

UI polls GET /api/guides/status?jobId=xxx every 3s → renders when done
```

---

## Platform Pages

| Page | Route | Status |
|---|---|---|
| Home | `/` | ✅ Live |
| Learning Course | `/learn` | ✅ Live — 23 lessons, 3 tiers |
| Atlas Q&A | `/ask` | ✅ Live — chat history, copy, RAG learning |
| SME Knowledge Base | `/knowledge` | ✅ Live — visible to all varonis.com users |
| Architecture Builder | `/architect` | ✅ Live |
| Technical Guide Producer | `/guides` | ✅ Live — async fire-and-poll |
| AI Runtime Demo | `/runtime` | ✅ Live — 4 simulation types |
| Demo Provisioning | `/demo` | ✅ Live |
| Meeting Co-Pilot | `/meeting` | ✅ Live |
| Analytics | `/analytics` | ✅ Live |

---

## Knowledge Base (Neo4j — 192.168.1.165:7687)

| Source | Count | Node Type |
|---|---|---|
| Atlas docs v3.4.0 (54 pages, scraped 2026-06-10) | 2,070 | DocChunk |
| Teams AI Security SME channel (scraped 2026-06-30) | 102 | SMEKnowledge |
| Community Q&A from /ask interactions (quality-gated) | grows | LearnedQA |

- Vector indexes: `atlas_chunk_embeddings`, `learned_qa_embeddings` (both text-embedding-3-small, 1536 dims)
- ngrok bolt tunnel: `bolt://7.tcp.ngrok.io:23280` — static, systemd auto-start
- ngrok HTTP tunnel: `https://uncompendious-unpurchased-shanita.ngrok-free.dev` — used by n8n
- Neo4j password: ttadeo123

### Ingestion Pipeline (run in order after every scrape)
```bash
# Atlas docs
python scraper/scrape_atlas_docs.py        # real Chrome, has saved Varonis session
python ingestion/chunk_and_ingest.py
python scraper/patch_release_notes_chunks.py  # ← always run after doc scrape

# Teams SME (incremental — SCRAPE_SINCE auto-detected)
# Launch Chromium first (NOT Chrome — Chromium has saved Varonis/Teams session):
#   /Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222
source scraper/atlas-docs-scraper/bin/activate
set -a && source ui/.env.local && set +a   # EXA_API_KEY warning on line 18 is harmless
python scraper/scrape_teams_sme.py         # hit Enter when prompted
python scraper/regroup_threads.py
python scraper/process_teams_sme.py        # ~10-15 min; Anthropic 500s are non-fatal
echo "1" | python scraper/ingest_teams_sme.py  # option 1 = MERGE (incremental)
```

---

## n8n Workflows (ttadeo.app.n8n.cloud)

All exported to `n8n/workflows/` — commit after every change, import back to n8n.

| Workflow | Webhook path | Purpose |
|---|---|---|
| atlas-rag-query | `/webhook/atlas-rag-query` | Q&A with conversation history |
| atlas-sme-query | `/webhook/atlas-sme-query` | SME-first chat (/knowledge) |
| atlas-architect | `/webhook/atlas-architect` | Architecture Builder |
| Atlas - Technical Guide Producer | `/webhook/atlas-guide-producer` | Async guide → Upstash write |
| atlas-mcp-research | `/webhook/atlas-mcp-research` | AI Deal Research Agent — 5-agent workflow through Atlas Gateway; endpoint identifier dynamic (={{ $json.endpointId }}); writes result to Upstash KV mcp:{jobId} |

**n8n Variables** (Settings → Variables):
- `UPSTASH_KV_TOKEN` — used by Write Guide to KV node (`$vars.UPSTASH_KV_TOKEN`)
- `ATLAS_DEMO_KEY` — OpenAI key registered in Tadeo-Demo-Environment; used by atlas-mcp-research (`$vars.ATLAS_DEMO_KEY`)

**Important:** n8n Cloud blocks `$env` access — always use `$vars` for secrets.

**Re-import note:** When modifying n8n workflow JSON locally, always tell the user to re-import the specific file (e.g. `n8n/workflows/atlas-mcp-research.json`) into n8n manually. Error output connections are NOT preserved on import — must be reconnected in the canvas after import.

---

## Auth & Security

- OTP email flow for @varonis.com addresses (Resend)
- JWT session cookie (`atlas_session`) signed with `SESSION_SECRET`
- All API routes use shared `requireAuth()` helper — `ui/lib/auth.ts`
- Vercel Deployment Protection: **DISABLED** (was blocking n8n webhook callbacks)
- 4 public endpoints only: send-otp, verify-otp, logout, guides/callback

---

## Vercel Environment Variables

```
# n8n webhooks
NEXT_PUBLIC_N8N_WEBHOOK_URL        atlas-rag-query
N8N_ARCHITECT_WEBHOOK_URL          atlas-architect
N8N_GUIDES_WEBHOOK_URL             atlas-guide-producer
N8N_SME_WEBHOOK_URL                atlas-sme-query
N8N_MCP_WEBHOOK_URL                atlas-mcp-research (AI Deal Research Agent)

# Upstash Redis
KV_REST_API_URL
KV_REST_API_TOKEN

# Auth
SESSION_SECRET
RESEND_API_KEY

# LLMs (server-side only)
ANTHROPIC_API_KEY
OPENAI_API_KEY                     embeddings + AI Runtime Demo Atlas Gateway Bearer

# Atlas
ATLAS_API_KEY                      Varonis Atlas admin API key
ATLAS_CUSTOMER_ID                  7df8a5a7-1173-4b29-b9a0-100281c010b2
ATLAS_GATEWAY_URL                  Atlas Gateway base URL
ATLAS_GATEWAY_ENDPOINT_ID          tadeo-demo-openai (AI Runtime Demo)
ATLAS_DEMO_KEY                     Dedicated OpenAI key for Agentic Demo (Tadeo-Demo-Environment)

# Neo4j (direct bolt for some routes)
NEO4J_URI                          bolt://7.tcp.ngrok.io:23280
NEO4J_USER
NEO4J_PASSWORD
```

---

## Evaluations

TrueLens RAG Triad — 52 golden questions.

**Latest baseline (v3.4.0, 2026-06-10):**
| Metric | Score |
|---|---|
| Answer Relevance | 1.000 |
| Context Relevance | 0.994 |
| Groundedness | 0.689 |

```bash
source evals/venv/bin/activate
set -a && source evals/.env && set +a
python3 evals/run_evals.py
```

Groundedness (0.689) is the primary optimization target.

---

## LLM Model Reference (as of 2026-06-11)

| Model | API ID | Input | Output | Best for |
|---|---|---|---|---|
| Claude Opus 4.8 | `claude-opus-4-8` | $5/M | $25/M | Long-horizon agentic tasks, overnight eval agent |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | $3/M | $15/M | Default — guides, architect, Q&A |
| Claude Haiku 4.5 | `claude-haiku-4-5-20251001` | $1/M | $5/M | TrueLens scoring, high-volume cheap calls |

---

## Key Files

```
ui/lib/auth.ts                           — shared requireAuth() JWT helper (use for ALL new API routes)
ui/app/ask/page.tsx                      — Ask Atlas UI (history panel, copy button, session management)
ui/app/api/ask/route.ts                  — RAG handler + LearnedQA storage (5 parallel Neo4j queries)
ui/app/api/ask/sessions/route.ts         — session CRUD (GET/POST/DELETE) → Upstash KV
ui/app/api/meeting/route.ts              — Meeting Co-Pilot (5 parallel RAG queries + SME)
ui/app/guides/page.tsx                   — Guide Producer UI (fire-and-poll, 5-min timeout)
ui/app/api/guides/route.ts               — fires n8n, returns jobId immediately
ui/app/api/guides/status/route.ts        — polls Upstash KV via /pipeline endpoint
ui/app/architect/page.tsx                — Architecture Builder
ui/app/knowledge/page.tsx                — SME Knowledge Base (open to all varonis.com users)
ui/app/demo/page.tsx                     — Demo Center (Chain of Custody, Agentic Demo, Mock Scenario tabs)
ui/app/api/demo/chain/projects/route.ts  — Atlas projects enriched with owner_email + orgId
ui/app/api/demo/chain/endpoints/route.ts — All LLM endpoint identifiers (org-level, no filter)
ui/app/api/demo/cleanup/route.ts         — Delete All; LLM endpoint types excluded from deletion
ui/app/api/demo/mcp/research/route.ts    — fires atlas-mcp-research n8n webhook, returns jobId
ui/app/api/demo/mcp/status/route.ts      — polls Upstash KV mcp:{jobId}
ui/vercel.json                           — maxDuration overrides for long-running routes
n8n/workflows/atlas-mcp-research.json    — AI Deal Research Agent (endpoint identifier dynamic)
n8n/workflows/                           — all workflow exports (import cycle: export → commit → re-import)
scraper/scrape_teams_sme.py              — Teams SME scraper (Chromium CDP — NOT Chrome)
scraper/patch_release_notes_chunks.py    — run after EVERY doc scrape
scraper/scrape_atlas_docs.py             — use real Chrome (has saved Varonis session)
evals/golden_questions.json              — 52 golden questions for RAG eval
```

---

## What's Next

1. Re-add LLM endpoints in Atlas UI (OpenAIKey-Tadeo-Demo, tadeo-demo-env) — deleted by cleanup incident 2026-06-30
2. Delete temp diagnostic route `ui/app/api/demo/chain/test-users/route.ts`
3. Add "Simulate Traffic" button to Demo Provisioning — fires scenario-matched prompts through Atlas Gateway post-provisioning so Observability is populated (Option A from architecture discussion)
4. Neo4j backup — dump and scp to Mac
5. TrueLens baselines for /knowledge and /guides
6. Switch TrueLens scoring model from OpenAI to Claude Haiku
7. OpenAPI spec auto-refresh in n8n
8. Resource Library scraper in n8n
9. Neo4j persistence for generated guides (Guide node in knowledge graph)

---

## User Preferences
- Concise communication
- n8n for all agent workflows
- Python 3.11+ for scraping and ingestion scripts
- Security-first mindset
- Push to Vercel by default (auto-deploys on push to main)
