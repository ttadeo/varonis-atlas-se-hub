# Atlas Learning Platform

An interactive, AI-powered learning and deployment assistant for the Varonis Atlas AI Security Platform. Built for Varonis Sales Engineers — internal use only.

---

## What It Does

Three tools in one platform:

1. **Atlas Learning Course** — 18-lesson structured course across Beginner, Intermediate, and Advanced tiers. Each lesson is conversational, ends with a check question, and offers follow-up prompts to go deeper before moving on.
2. **Deployment & Integration Assistant** — SE inputs customer requirements, gets a custom deployment guide *(coming soon)*
3. **Meeting Co-Pilot** — Live meeting support, answers customer questions in real time *(coming soon)*

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | Next.js 16 (React 19, TypeScript, Tailwind) |
| Hosting | Vercel |
| Orchestration | n8n Cloud (ttadeo.app.n8n.cloud) |
| Knowledge Base | Neo4j (vector + knowledge graph RAG) |
| LLM | Anthropic Claude (claude-sonnet-4-6) |
| Embeddings | OpenAI text-embedding-3-small |
| Evaluation | TruLens RAG Triad + custom Safety Score |

---

## Architecture

```
User opens chat UI (Vercel)
        │
        ▼
n8n webhook (workflow orchestration)
        │
        ├── OpenAI Embeddings API (vectorize question)
        │
        ├── Neo4j vector search (retrieve top-5 context chunks)
        │
        └── Anthropic Claude (generate grounded answer)
                │
                ▼
        Response returned to UI with conversation history
```

---

## Knowledge Base

**1,146 total chunks** ingested into Neo4j:
- 251 chunks from 37 Atlas documentation pages (Playwright authenticated scraper)
- 895 chunks from the Atlas OpenAPI spec
- Secondary documents hand-built to fix retrieval gaps (see `scraper/output/faq/`)

---

## Evaluation

The RAG pipeline was evaluated using TruLens across all 18 lessons before deployment.

| Metric | Score |
|---|---|
| Answer Relevance | 1.000 |
| Context Relevance | 0.974 |
| Groundedness | 0.686 |
| Safety Score | 1.000 |
| **Overall Average** | **0.887** |

All 18 lessons scored above 0.80. Zero safety flags across 38 questions including adversarial attack technique content. Full results in `evals/results/`.

---

## Project Structure

```
AtlasLearningPlatform/
├── ui/                         # Next.js app (deployed to Vercel)
│   └── app/
│       ├── page.tsx            # Landing page
│       ├── learn/page.tsx      # 18-lesson learning course
│       └── ask/page.tsx        # Free-form RAG Q&A
├── scraper/                    # Playwright Atlas docs scraper
│   ├── scrape_atlas_docs.py
│   ├── scrape_openapi.py
│   └── output/                 # Scraped + hand-built knowledge base docs
│       ├── applications/
│       ├── overview/
│       ├── faq/                # Secondary docs built to fix CR=0 failures
│       └── openapi_reference/
├── ingestion/                  # Neo4j ingestion pipeline
│   ├── ingest_to_neo4j.py
│   └── ingest_openapi.py
├── evals/                      # TruLens evaluation harness
│   ├── run_evals.py
│   ├── golden_questions.json   # 38 golden questions across 18 lessons
│   └── results/                # All eval run CSVs
├── n8n/                        # n8n workflow export
│   └── Atlas RAG - Knowledge Retrieval.json
└── guides/                     # SE guides on how this was built
    ├── part-1-how-to-build-ai-you-can-trust.md
    └── part-2-how-we-fixed-what-broke.md
```

---

## Local Development

```bash
cd ui
npm install
cp .env.local.example .env.local   # add NEXT_PUBLIC_N8N_WEBHOOK_URL
npm run dev
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | n8n webhook URL for the RAG pipeline |

---

## Learning Tiers

| Tier | Lessons | Focus |
|---|---|---|
| Beginner | 1–6 | What Atlas is, architecture, AI Gateway, policy types, AI Inventory, Guardrails |
| Intermediate | 7–12 | Observability, AI 360, AI SPM, Incidents, Compliance, full deployment scenario |
| Advanced | 13–18 | Prompt privacy, competitive positioning, deployment deep dive, objection handling, attack techniques, capstone |

---

## Deployment

Hosted on Vercel. Auto-deploys on push to `main`.

**Live:** atlas-learning-platform.vercel.app
