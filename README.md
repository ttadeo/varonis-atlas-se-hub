# Atlas Learning Platform

An interactive, AI-powered learning and field enablement platform for the Varonis Atlas AI Security Platform. Built for Varonis Sales Engineers — internal use only.

---

## What It Does

Eleven tools in one platform:

| Page | What It Does |
|---|---|
| **Learn** `/learn` | 31-lesson structured course across Beginner, Intermediate, and Advanced tiers — includes a Coding Agents tier (hook architecture, fleet deployment, log sources, shadow AI & IBAC, Atlas MCP Server). Conversational lessons, AI grading, voice support, progress persistence. |
| **Ask** `/ask` | Agentic RAG Q&A — ask anything about Atlas, grounded in official docs. Five parallel retrieval queries: vector similarity, fulltext, UI navigation, SME knowledge, community Q&A. Learns from high-quality interactions (LearnedQA). |
| **Meeting Co-Pilot** `/meeting` | Live customer Q&A support during calls. Attach customer docs (PDF, Word, Excel, images), get grounded answers in real time. |
| **Architecture Builder** `/architect` | Describe a customer environment → get a Mermaid reference architecture + narrative, grounded in Atlas documentation. Attach files for context. Sticky chat bar to refine iteratively after generation. |
| **Guide Producer** `/guides` | Describe a deployment scenario → get a full technical guide grounded in Atlas docs + SME field knowledge. Async generation (2-5 min), exports to PDF and .md. Attach files for customer context. Sticky chat bar to refine iteratively. |
| **SME Knowledge Base** `/knowledge` | 129 field-validated Q&A entries from the Varonis AI Security SME Teams channel. Browse by topic or ask the SME chat. |
| **AI Runtime Demo** `/runtime` | Fire live AI traffic through the Atlas Gateway. Four simulation types: prompt traffic, MCP tool call chains, multi-agent workflows, IDE Coding Agent scenario. Shows real-time policy enforcement with per-scenario SE talking points. |
| **Demo Provisioning** `/demo` | Three tabs: (1) **Chain of Custody** — describe a customer use case → Claude matches Atlas policy templates → auto-deploy to Atlas; (2) **Agentic Demo** — AI Deal Research Agent (5-agent workflow via Atlas Gateway), Red Team Attack Agent (5 obfuscation variants), MCP Quarantine Demo; (3) **Mock Scenario Builder**. |
| **Analytics** `/analytics` | Interaction analytics dashboard across all platform usage. |
| **Resources** `/resources` | Competitive resource library. |
| **Playbook** `/playbook` | SE playbook and field reference. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Next.js (React, TypeScript, Tailwind CSS) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Orchestration | n8n Cloud (`ttadeo.app.n8n.cloud`) |
| Knowledge Base | Neo4j — vector + knowledge graph RAG |
| Async job store | Upstash Redis (KV REST API — guide generation + MCP research results) |
| LLM | Anthropic Claude (claude-sonnet-4-6 default; claude-haiku-4-5 for scoring) |
| Embeddings | OpenAI text-embedding-3-small (1536 dimensions) |
| Auth | Superuser password login + JWT session cookie |
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
        ├──────────────────────────────────────┬────────────────────┐
        │                                      │                    │
        ▼                                      ▼                    ▼
n8n Cloud Workflows                   Upstash Redis (KV)    Claude API (direct)
  /guides, /architect                  async guide + MCP     /ask, /meeting
  /knowledge, /demo                    research results       agentic RAG loop
        │                              polled by UI every 3s  with tool use
        ├─→ OpenAI (embeddings)
        ├─→ Claude Sonnet 4.6 (generation)
        └─→ Neo4j via ngrok HTTP
               ├── Chunk nodes (Atlas v3.7.0 docs — 5,513 nodes) ← primary
               ├── SMEKnowledge nodes (Teams Q&A — 129 nodes)
               │         └── RELATED_TO → Chunk
               └── LearnedQA nodes (grows from /ask interactions — 171 nodes)

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

**5,813+ total nodes** in Neo4j (as of 2026-08-10, Atlas v3.7.0):

| Source | Count | Type |
|---|---|---|
| Atlas documentation (v3.7.0, scraped 2026-08-10) | 5,513 | Chunk ← primary schema |
| Varonis AI Security SME Teams channel | 129 | SMEKnowledge |
| Community Q&A from /ask interactions (quality-gated) | 171+ (grows) | LearnedQA |

**Note on schema:** The `Chunk` label is the current active schema used by all routes and n8n workflows via the `atlas_chunk_embeddings` vector index. Legacy `DocChunk` nodes (265) remain in Neo4j but are not queried.

Chunk properties: `text`, `source`, `section`, `heading`, `title`, `embedding`

SMEKnowledge nodes are linked to related Chunks via `RELATED_TO` edges and used by the Guide Producer and SME Knowledge Base chat.

---

## n8n Workflows

| Workflow | Purpose |
|---|---|
| atlas-rag-query | Q&A with conversation history; mode-aware (learn vs ask) |
| atlas-architect | Architecture Builder |
| atlas-guide-producer | Async guide generation → direct Upstash write |
| atlas-sme-query | SME Knowledge Base chat |
| atlas-mcp-research | AI Deal Research Agent — multi-agent research → Atlas Gateway → Upstash write |
| atlas-redteam-attack | Red Team Attack Agent — 5 obfuscation variants fired at Atlas Gateway |
| atlas-mcp-quarantine | MCP Quarantine Demo — malicious tool interception simulation |

All workflows exported to `n8n/workflows/` and committed to this repo. Import cycle: export from n8n → commit → re-import. **Note:** error output connections are NOT preserved on import — reconnect manually in the canvas after import.

---

## Evaluation

RAG pipeline evaluated with TrueLens. Latest baseline (v3.6.0):

| Metric | Score |
|---|---|
| Answer Relevance | 0.987 |
| Context Relevance | 1.000 |
| Groundedness | 0.777 |

Groundedness (0.777) is the primary optimization target. Retrieval is the bottleneck — not the prompt.

Full results in `evals/results/`. Golden question set: `evals/golden_questions.json` (52 questions).

```bash
source evals/venv/bin/activate
set -a && source evals/.env && set +a
python3 evals/run_evals.py
```

---

## Project Structure

```
AtlasLearningPlatform/
├── ui/                              # Next.js app (deployed to Vercel)
│   ├── app/
│   │   ├── page.tsx                 # Home / navigation hub
│   │   ├── learn/                   # 31-lesson course
│   │   ├── ask/                     # Agentic RAG Q&A (direct Neo4j, 5 parallel queries)
│   │   ├── meeting/                 # Meeting Co-Pilot
│   │   ├── architect/               # Architecture Builder
│   │   ├── guides/                  # Guide Producer (async fire-and-poll)
│   │   ├── knowledge/               # SME Knowledge Base
│   │   ├── runtime/                 # AI Runtime Demo
│   │   ├── demo/                    # Demo Provisioning + Agentic Demo
│   │   ├── analytics/               # Analytics dashboard
│   │   ├── resources/               # Resource library
│   │   ├── playbook/                # SE Playbook
│   │   └── api/                     # All API routes (all protected with requireAuth)
│   └── lib/
│       └── auth.ts                  # Shared requireAuth() JWT helper
├── scraper/                         # Scraping + ingestion scripts
│   ├── scrape_atlas_docs.py         # Playwright Atlas docs scraper (use real Chrome)
│   ├── scrape_teams_sme.py          # Teams SME channel scraper (Chromium CDP)
│   ├── regroup_threads.py           # Temporal proximity thread grouper
│   ├── process_teams_sme.py         # Haiku classify + Sonnet extract pipeline
│   ├── ingest_teams_sme.py          # Neo4j SMEKnowledge ingestion
│   └── patch_release_notes_chunks.py # Post-scrape RAG quality fix (run after every scrape)
├── ingestion/                       # Doc chunk ingestion pipeline
├── evals/                           # TrueLens evaluation harness
│   ├── run_evals.py
│   ├── golden_questions.json        # 52 golden questions
│   └── results/
├── n8n/workflows/                   # n8n workflow exports
└── ARCHITECTURE.md                  # Full architecture + security reference
```

---

## Auth

- **Model:** Superuser password login — 5 users with personal email addresses
- **@varonis.com users:** Access discontinued — discontinuation message shown at login
- **OTP flow:** Fully preserved in code (`send-code`, `verify-code` routes) — re-enableable without rebuild
- **Session:** JWT cookie (`atlas_session`, 8h expiry, HS256, signed with `SESSION_SECRET`)
- **Route protection:** All API routes use shared `requireAuth()` helper (`ui/lib/auth.ts`). Four public endpoints only: send-code, verify-code, logout, guides/callback

---

## Security

- All API routes protected with `requireAuth()` JWT guard — no unprotected routes except the 4 public auth endpoints
- Input sanitization: Lucene injection protection on all Neo4j fulltext queries
- All environment variables in Vercel marked Sensitive — never stored in code or git
- API keys (OpenAI, Anthropic, Atlas) are server-side only — never reach the client
- AI-specific: model cannot see other users' data; prompt injection surface documented in ARCHITECTURE.md

---

## Deployment

Hosted on Vercel. Auto-deploys on push to `main` — no manual steps required.

All environment variables managed in Vercel dashboard. To rotate a key:
```bash
npx vercel env rm KEY_NAME production --yes
echo "new_value" | npx vercel env add KEY_NAME production
git commit --allow-empty -m "Rotate KEY_NAME" && git push
```
