# Atlas Learning Platform

An interactive, AI-powered learning and field enablement platform for the Varonis Atlas AI Security Platform. Built for Varonis Sales Engineers — internal use only.

---

## What It Does

Ten tools in one platform:

| Page | What It Does |
|---|---|
| **Learn** `/learn` | 22-lesson structured course across Beginner, Intermediate, and Advanced tiers. Conversational lessons, AI grading, voice support, progress persistence. |
| **Ask** `/ask` | Agentic RAG Q&A — ask anything about Atlas, grounded in official docs. |
| **Meeting Co-Pilot** `/meeting` | Live customer Q&A support during calls. Attach customer docs, get grounded answers in real time. |
| **Architecture Builder** `/architect` | Describe a customer environment → get a Mermaid reference architecture + narrative, grounded in Atlas documentation. |
| **Guide Producer** `/guides` | Describe a deployment scenario → get a full technical guide grounded in Atlas docs + SME field knowledge. Async generation (2-5 min), exports to PDF and .md. |
| **SME Knowledge Base** `/knowledge` | 92 field-validated Q&A entries from the Varonis AI Security SME Teams channel. Browse by topic or ask the SME chat. |
| **AI Runtime Demo** `/runtime` | Fire live AI traffic through the Atlas Gateway. Four simulation types: prompt traffic, MCP tool call chains, multi-agent workflows, custom scenarios. Shows real-time policy enforcement with per-scenario SE talking points. |
| **Demo Provisioning** `/demo` | Three tabs: (1) **Chain of Custody** — describe a customer use case → Claude matches Atlas policy templates → auto-deploy to Atlas; (2) **Agentic Demo** — AI Deal Research Agent that runs a real multi-agent workflow (Orchestrator → Exa Research → Exa News → Risk Analyst → Report Agent) routing all LLM calls through Atlas Gateway to populate a live Atlas project with real AI activity; (3) **Mock Scenario Builder**. |
| **Analytics** `/analytics` | Interaction analytics dashboard across all platform usage. |
| **Resources** `/resources` | Competitive resource library. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Next.js (React, TypeScript, Tailwind CSS) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Orchestration | n8n Cloud (`ttadeo.app.n8n.cloud`) |
| Knowledge Base | Neo4j — vector + knowledge graph RAG |
| Async job store | Upstash Redis (KV REST API — guide generation + MCP research results) |
| LLM | Anthropic Claude (claude-sonnet-4-6) |
| Embeddings | OpenAI text-embedding-3-small (1536 dimensions) |
| Auth | OTP email (Resend) + JWT session cookie |
| Evaluation | TrueLens RAG Triad (Answer Relevance, Context Relevance, Groundedness) |

---

## Architecture

```
Varonis SE (Browser)
        │
        ▼
Vercel — Next.js
  UI Pages + API Routes (JWT auth on every route)
        │
        ├──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
n8n Cloud Workflows                   Upstash Redis (KV)
  /guides, /architect, /ask            async guide + MCP research results
  /learn, /knowledge, /demo            polled by UI every 3s
        │
        ├─→ OpenAI (embeddings)
        ├─→ Claude Sonnet 4.6 (generation)
        └─→ Neo4j via ngrok HTTP
               ├── DocChunk nodes (Atlas v3.4.0 docs)
               └── SMEKnowledge nodes (Teams Q&A — 92 nodes)

                                  Atlas Gateway
                                  (AI Runtime Demo + Agentic Demo)
                                  live policy enforcement
```

### Async Guide Generation Pattern

The Guide Producer and AI Deal Research Agent bypass Cloudflare's 100s timeout via fire-and-poll:

```
UI → POST /api/guides (or /api/demo/mcp/research) → n8n ACK (<1s, responseMode: onReceived)
                              │  runs asynchronously (guides: 2-5 min, research: ~30s)
                              └─→ Upstash Redis: SET guide:{jobId} or mcp:{jobId}

UI polls GET /api/guides/status (or /api/demo/mcp/status) every 3s → renders when done
```

### Atlas Gateway Integration (Agentic Demo)

The AI Deal Research Agent routes all LLM calls through the Atlas AI Gateway proxy:

```
n8n workflow → Atlas Gateway proxy → OpenAI gpt-4o
                     │
                     ├─→ Applies project-level policies (PII, guardrails)
                     ├─→ Logs all LLM traffic to Atlas project
                     └─→ Blocks/alerts on policy violations → writes status to Upstash → UI shows blocked state
```

- Gateway URL: `https://api.7df8a5a7.5.us-west-2.prod.alltrue-be.com/openai/v1`
- Endpoint identifier: `OpenAIKey-Tadeo-Demo` (registered in Tadeo-Demo-Environment project)
- Auth: dedicated OpenAI API key registered only in Tadeo-Demo-Environment (n8n variable: `ATLAS_DEMO_KEY`)
- Key lesson: Atlas attributes gateway traffic by **API key**, not endpoint identifier — each SE needs a dedicated key registered in their project

---

## Knowledge Base

**2,162+ total nodes** in Neo4j (as of 2026-06-24):

| Source | Count | Type |
|---|---|---|
| Atlas documentation (54 pages, v3.4.0) | ~2,070 | DocChunk |
| Varonis AI Security SME Teams channel | 92 | SMEKnowledge |

SMEKnowledge nodes are linked to related DocChunks via `RELATED_TO` edges and used by the Guide Producer and SME Knowledge Base chat.

---

## n8n Workflows

| Workflow | Purpose |
|---|---|
| atlas-rag-query | Q&A with conversation history |
| atlas-architect | Architecture Builder |
| atlas-guide-producer | Async guide generation → direct Upstash write |
| atlas-sme-query | SME Knowledge Base chat |
| atlas-mcp-research | AI Deal Research Agent — multi-agent research → Atlas Gateway → Upstash write |

All workflows exported to `n8n/workflows/` and committed to this repo. Import cycle: export from n8n → commit → re-import updated version.

---

## Evaluation

RAG pipeline evaluated with TrueLens. Latest baseline (v3.4.0, 2026-06-10):

| Metric | Score |
|---|---|
| Answer Relevance | 1.000 |
| Context Relevance | 0.994 |
| Groundedness | 0.689 |

Full results in `evals/results/`.

---

## Project Structure

```
AtlasLearningPlatform/
├── ui/                              # Next.js app (deployed to Vercel)
│   ├── app/
│   │   ├── page.tsx                 # Home / navigation hub
│   │   ├── learn/                   # 22-lesson course
│   │   ├── ask/                     # RAG Q&A
│   │   ├── meeting/                 # Meeting Co-Pilot
│   │   ├── architect/               # Architecture Builder
│   │   ├── guides/                  # Guide Producer
│   │   ├── knowledge/               # SME Knowledge Base
│   │   ├── runtime/                 # AI Runtime Demo
│   │   ├── demo/                    # Demo Provisioning + Agentic Demo
│   │   ├── analytics/               # Analytics dashboard
│   │   ├── resources/               # Resource library
│   │   └── api/                     # All API routes
│   └── lib/
│       └── auth.ts                  # Shared requireAuth() JWT helper
├── scraper/                         # Scraping + ingestion scripts
│   ├── scrape_atlas_docs.py         # Playwright Atlas docs scraper (use real Chrome)
│   ├── scrape_openapi.py            # OpenAPI spec scraper
│   ├── scrape_teams_sme.py          # Teams SME channel scraper (Chromium CDP)
│   ├── regroup_threads.py           # Temporal proximity thread grouper
│   ├── process_teams_sme.py         # Haiku classify + Sonnet extract pipeline
│   ├── ingest_teams_sme.py          # Neo4j SMEKnowledge ingestion
│   ├── patch_release_notes_chunks.py # Post-scrape RAG quality fix (run after every scrape)
│   └── output/                      # Scraped docs and SME output
├── ingestion/                       # Doc chunk ingestion pipeline
├── evals/                           # TrueLens evaluation harness
│   ├── run_evals.py
│   ├── golden_questions.json        # 52 golden questions
│   └── results/
├── n8n/workflows/                   # n8n workflow exports (5 workflows)
└── ARCHITECTURE.md                  # Full architecture + security reference
```

---

## Security

- **Auth:** OTP email flow for @varonis.com addresses (Resend + Upstash Redis). Superuser bypass for `ttadeo@timthecoder.net`.
- **Route protection:** All API routes use shared `requireAuth()` JWT helper (`ui/lib/auth.ts`). Four public auth endpoints only.
- **Vercel:** 2FA enabled, team 2FA enforcement on, all env vars marked Sensitive.
- **Input sanitization:** Lucene injection protection on all Neo4j full-text queries.

---

## Deployment

Hosted on Vercel. Auto-deploys on push to `main` — no manual steps required.

All environment variables are managed in the Vercel dashboard (marked Sensitive). Never stored in code or git.
