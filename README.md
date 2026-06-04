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
| **Guide Producer** `/guides` | Describe a deployment scenario → get a full technical guide grounded in Atlas docs + SME field knowledge. |
| **SME Knowledge Base** `/knowledge` | 62 field-validated Q&A entries from the Varonis AI Security SME Teams channel. Browse by topic (11 categories) or ask the SME chat. |
| **AI Runtime Demo** `/runtime` | Fire live AI traffic through the Atlas Gateway. Three simulation types: prompt traffic, MCP tool call chains, multi-agent workflows. Shows real-time policy enforcement with per-scenario SE talking points. |
| **Demo Provisioning** `/demo` | Describe a customer use case → Claude matches Atlas policy templates → auto-deploy to Atlas. Includes Chain of Custody viewer and Mock Scenario Builder. |
| **Analytics** `/analytics` | Interaction analytics dashboard across all platform usage. |
| **Resources** `/resources` | Competitive resource library. |

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Next.js 16 (React 19, TypeScript, Tailwind CSS) |
| Hosting | Vercel (auto-deploy on push to `main`) |
| Orchestration | n8n Cloud (`ttadeo.app.n8n.cloud`) |
| Knowledge Base | Neo4j — vector + knowledge graph RAG |
| LLM | Anthropic Claude (claude-sonnet-4-6 / claude-opus-4-6) |
| Embeddings | OpenAI text-embedding-3-small (1536 dimensions) |
| Auth | OTP email (Resend + Upstash Redis) + superuser bypass |
| Evaluation | TrueLens RAG Triad (Answer Relevance, Context Relevance, Groundedness) |

---

## Architecture

```
Varonis SE (Browser)
        │
        ▼
Vercel — Next.js 16
  UI Pages + API Routes
  JWT auth on every protected route
        │
        ├──────────────────────────────────┐
        │                                  │
        ▼                                  ▼
n8n Cloud Workflows               Direct Neo4j (bolt)
  learn, guides, architect         ask, meeting, knowledge,
  sme-query, demo-provisioning     analytics, auth
        │
        ├─→ OpenAI (embeddings)
        ├─→ Claude (generation)
        └─→ Neo4j HTTP (via ngrok)

                                  Atlas Gateway
                                  (AI Runtime Demo)
                                  live policy enforcement
```

Full architecture details: [ARCHITECTURE.md](ARCHITECTURE.md)

---

## Knowledge Base

**3,100 total nodes** in Neo4j:

| Source | Count | Type |
|---|---|---|
| Atlas documentation (37 sections) | ~2,143 | DocChunk |
| Atlas OpenAPI spec | ~895 | DocChunk |
| Varonis AI Security SME Teams channel | 62 | SMEKnowledge |

SMEKnowledge nodes are linked to related DocChunks via `RELATED_TO` edges and used by the Guide Producer and SME Knowledge Base chat.

---

## n8n Workflows

| Workflow | Purpose |
|---|---|
| atlas-rag-knowledge-retrieval | Powers /learn Q&A |
| atlas-architect | Architecture Builder |
| atlas-guide-producer | Guide Producer (DocChunks + SMEKnowledge) |
| atlas-sme-query | SME Knowledge Base chat |
| atlas-demo-provisioning | Demo template discovery |
| atlas-demo-apply | Demo template deployment |

---

## Evaluation

RAG pipeline evaluated with TrueLens. Baseline (2026-05-14, 52 golden questions):

| Metric | Score |
|---|---|
| Answer Relevance | 1.000 |
| Context Relevance | 1.000 |
| Groundedness | 0.696 |

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
│   │   ├── demo/                    # Demo Provisioning
│   │   ├── analytics/               # Analytics dashboard
│   │   ├── resources/               # Resource library
│   │   └── api/                     # All API routes
│   └── lib/
│       └── auth.ts                  # Shared requireAuth() JWT helper
├── scraper/                         # Scraping + ingestion scripts
│   ├── scrape_atlas_docs.py         # Playwright Atlas docs scraper
│   ├── scrape_openapi.py            # OpenAPI spec scraper
│   ├── scrape_teams_sme.py          # Teams SME channel scraper (CDP)
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
├── n8n/workflows/                   # n8n workflow exports (6 workflows)
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
