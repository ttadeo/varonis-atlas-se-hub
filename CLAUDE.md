# Atlas Learning Platform — Claude Context

## Project Purpose
An interactive, chat-capable learning and deployment assistant platform for Varonis Atlas AI Security Platform. Built for Varonis SEs and technical staff — internal use only, not customer-facing.

## Three Components (Build in this order)
1. **Atlas Learning Course** — Three-tier interactive learning (Beginner, Intermediate, Advanced)
2. **Deployment & Integration Assistant** — SE inputs customer requirements, gets custom deployment guide
3. **Meeting Co-Pilot** — Live meeting support, answers customer questions in real time

---

## Tech Stack
- **Vercel** — UI hosting (Next.js, fresh project), AI Gateway for LLM routing
- **n8n Cloud** — Agent workflow orchestration (ttadeo.app.n8n.cloud)
- **Neo4j** — RAG knowledge graph (vector + semantic search)
- **Anthropic Claude** — Primary LLM for all learning/assistant interactions
- **GitHub** — Private repo, same approach as AtlasAdversarialTesting

## Architecture
```
User opens chat UI
        │
        ▼
Vercel (Next.js UI + AI Gateway)
        │
        ▼
n8n webhook (workflow orchestration)
        │
        ▼
Neo4j RAG (Atlas knowledge retrieval)
        │
        ▼
Claude (response generation)
        │
        ▼
Response streamed back to user
```

---

## Atlas Documentation
- **Docs URL**: https://prod.alltrue-be.com/_docs/docs/overview/platform_and_applications
- **Auth**: Auth0 login at https://ai-security-production.us.auth0.com — Varonis company credentials
- **Scraping approach**: Playwright authenticated scraper (runs locally, credentials never leave machine)
- **Status**: Scraped — 37 pages (251 chunks) + 895 OpenAPI endpoint chunks = 1,146 total chunks in Neo4j
- **OpenAPI spec URL**: https://api.prod.alltrue-be.com/openapi/external

## Documentation Ingestion Pipeline
1. Playwright scraper → authenticated crawl of all docs sections
2. Clean and chunk content by section (not arbitrary character counts)
3. Vectorize chunks
4. Store in Neo4j as knowledge graph
5. Expose via n8n RAG retrieval workflow

---

## Three Learning Tiers
| Tier | Focus | Hands-on? |
|---|---|---|
| Beginner | What is Atlas, key concepts, policy types, AI Gateway basics | Conversational Q&A only |
| Intermediate | Policy configuration, guardrail setup, scenario-based questions | Guided scenarios |
| Advanced | Adversarial testing framework, live attacks, forensic analysis | Full AtlasAdversarialTesting framework |

The Advanced tier connects directly to the existing AtlasAdversarialTesting project.

---

## Vercel Setup
- Existing Vercel account: ttadeo's projects
- Existing project on Vercel: Preflight Checker (preserve — do not touch)
- This project: fresh Vercel project, do not affect existing projects
- AI Gateway: use Vercel AI Gateway for LLM routing (replaces OpenRouter)

---

## Why This Stack
- **Vercel over OpenRouter**: Built-in observability, cost tracking, firewall, analytics, storage — OpenRouter is routing only
- **n8n for orchestration**: Visual workflow builder, multi-agent pipelines, external integrations — better than pure code for SE-maintained systems
- **Neo4j for RAG**: Knowledge graph enables relationship-aware retrieval — better than flat vector search for interconnected Atlas concepts (policies → attacks → guardrails)
- **Claude as primary LLM**: Trusted, resistant to manipulation, strong reasoning — appropriate for a security-focused learning platform

---

## Related Projects
- **AtlasAdversarialTesting**: `/Users/timtadeo/Desktop/AtlasAdversarialTesting/` — provides the Advanced tier content and live attack demos
- **VaronisPreflightChecker**: Separate Vercel project — do not touch

---

## Career Context
This project is being built to develop production-level agentic AI skills. Skills being developed and demonstrated:
- RAG architecture (Neo4j vector + knowledge graph)
- Semantic routing and intent detection
- Multi-tier agent orchestration
- Authenticated web scraping and document ingestion
- Streaming responses
- Observability and evaluation
- Multi-tenant, authenticated UI

Target role profile: Principal AI Platform Architect / AI Security Engineer

---

## Build Sequence
### Phase 1 — Foundation
- [x] Create Playwright Atlas docs scraper
- [x] Set up Neo4j instance (local, 192.168.1.165:7687, ngrok tunnel for cloud access)
- [x] Scrape Atlas docs — 37 pages, 251 chunks
- [x] Scrape OpenAPI spec — 895 endpoint chunks
- [x] Build ingestion pipeline (scrape → chunk → vectorize → Neo4j) — 1,146 total chunks
- [x] Build Atlas RAG - Knowledge Retrieval n8n workflow (end-to-end working)
- [x] Add conversation history support to workflow
- [x] Create GitHub repo (private)
- [ ] Set up Vercel project (fresh)

### Phase 2 — Learning Course (Tier 1: Beginner)
- [ ] n8n workflow for beginner Q&A
- [ ] Vercel chat UI
- [ ] RAG retrieval from Neo4j
- [ ] Tier progression logic

### Phase 3 — Learning Course (Tiers 2 & 3)
- [ ] Intermediate scenario-based workflows
- [ ] Advanced tier connecting to AtlasAdversarialTesting

### Phase 4 — Deployment Assistant
- [ ] Customer requirements intake
- [ ] Custom deployment guide generator

### Phase 5 — Meeting Co-Pilot
- [ ] Fast-response Q&A optimized for live meetings
- [ ] Edge case handling

---

## SE Interaction Memory System (Phase 5 Design)
The Meeting Co-Pilot must store every SE-customer interaction in Neo4j to create a flywheel effect where the tool improves over time.

### Neo4j Node Types for Interaction Memory
- `Session` — one per SE meeting (SE name, customer, date, use case/industry)
- `Interaction` — one per question/answer turn within a session
- `Feedback` — SE rating/edit of the answer (good/bad/edited text)

### Graph Relationships
```
(Session)-[:HAD]->(Interaction)-[:RETRIEVED]->(Chunk)
(Interaction)-[:RECEIVED]->(Feedback)
(Interaction)-[:ANSWERED_WITH]->(GeneratedResponse)
```

### RAG Retrieval Enhancement
Once interactions are stored, the vector search query retrieves BOTH:
1. Atlas documentation chunks (current)
2. Past SE-validated interactions on similar questions (new)

This creates a compounding knowledge base — early users get doc-based answers,
later users benefit from real SE-validated responses to similar customer questions.

### Why This Matters
- Tool gets measurably smarter with each SE interaction
- Captures tribal knowledge that lives only in experienced SEs' heads
- Enables analytics: which questions come up most, which answers need improvement
- Significant differentiator vs static RAG tools

---

## User Preferences
- Concise communication
- Non-developer friendly where possible (SE audience)
- Python 3.11+ for scraping and ingestion scripts
- n8n for all agent workflows
- Security-first mindset
