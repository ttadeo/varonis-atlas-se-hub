# Atlas Learning Platform — Azure Migration Meeting Prep

**Date:** 2026-07-20  
**Audience:** IT Business Apps team  
**Purpose:** Confirm design decisions and open questions before migration sprint begins

---

## 1. Architecture Summary

The Atlas Learning Platform is an internal AI-powered enablement tool for Varonis SEs. The current stack is a mix of best-available SaaS tools (Vercel, n8n, Neo4j, Upstash, Resend) chosen for speed of iteration. The proposed migration moves all hosting, integration, auth, and AI orchestration to Microsoft/Azure to align with Varonis enterprise standards, reduce vendor sprawl, and leverage existing IT-managed infrastructure.

**The Next.js codebase is not changing.** This is a lift-and-shift at the hosting and services layer — not a rewrite.

| Component | Current | Future (Azure/Microsoft) |
|---|---|---|
| UI / Hosting | Vercel (Next.js, auto-deploy from GitHub) | Azure Static Web Apps (same Next.js build) |
| AI Workflow Orchestration | n8n Cloud (guide gen, Q&A, architect flows) | Copilot Studio Autonomous Agent |
| Integration / Automation | n8n Cloud (webhooks, data routing) | Workato |
| Knowledge Base / RAG | Neo4j — local Linux server + ngrok tunnel | Azure AI Search (hybrid vector + BM25 keyword) |
| Async Job Store | Upstash Redis (fire-and-poll, 2–5 min jobs) | Workato record storage or Azure equivalent |
| Auth | Custom OTP email flow via Resend (@varonis.com) | Azure Entra ID SSO (existing Varonis tenant) |
| LLMs | Anthropic Claude Sonnet 4.6 (primary) | Stays — API calls from Azure SWA routes |
| Embeddings | OpenAI text-embedding-3-small | Stays as-is, or swap to Azure OpenAI (optional) |
| AI Governance | Atlas MCP Server (mcp.prod.alltrue-be.com) | No change — already enterprise |
| Evals | TrueLens RAG Triad (local Python, 52 golden Qs) | Stays local — retrieval updated to Azure AI Search (~20 lines of code) |

---

## 2. Open Questions / Decision Checklist

Items IT needs to confirm before the sprint begins:

- [ ] **Azure AI Search** — Confirm Basic tier is provisionable in our subscription. Our dataset: ~3,200 documents, 1536-dim vectors.
- [ ] **Copilot Studio Autonomous Agent** — Confirm AG capability is included in our license tier. Required for guide generation and Q&A orchestration.
- [ ] **Azure Static Web Apps** — Confirm service is available in our subscription and that GitHub Actions CI/CD integration is permitted.
- [ ] **Workato** — Confirm access and which connector tier we have. Need HTTP/webhook connectors at minimum.
- [ ] **Azure Entra ID app registration** — Confirm we can register a new internal app and issue tokens for @varonis.com users without delays.
- [ ] **Azure OpenAI** — Optional: confirm if we want to route embeddings through Azure OpenAI for data residency/compliance purposes. Not a blocker for Day 1.

---

## 3. Migration Timeline

5-day sprint running in parallel to the live system. No downtime. Traffic cuts over on Day 5 only after evaluation validation.

| Day | Focus | Key Activities |
|---|---|---|
| **Day 1** | Knowledge Base | Provision Azure AI Search index. Export Neo4j data (DocChunk, SMEKnowledge, LearnedQA nodes). Re-embed and load into Azure AI Search. Validate hybrid search results against Neo4j baseline. |
| **Day 2** | Hosting | Deploy Next.js to Azure Static Web Apps. Migrate all Vercel environment variables. Confirm GitHub Actions CI/CD build pipeline. |
| **Day 3** | Auth | Swap custom OTP/Resend auth for Azure Entra ID SSO. Register app in tenant. Test @varonis.com login end-to-end. |
| **Day 4** | AI Workflows | Migrate n8n workflows (guide gen, Q&A, architect builder) to Copilot Studio AG + Workato. Migrate async job store (Upstash → Workato record storage). Validate fire-and-poll pattern for 2–5 min guide generation jobs. |
| **Day 5** | Testing + Cutover | Run TrueLens RAG Triad (52 golden questions) against new Azure AI Search backend. Compare scores to baseline (Answer Relevance 1.000, Context Relevance 0.994, Groundedness 0.689). Cut traffic if evals pass. Keep old stack warm 48h for rollback. |

---

## 4. Notes / Constraints

- **Atlas MCP Server stays as-is.** Already enterprise (`mcp.prod.alltrue-be.com`). Not part of this migration.
- **No rewrite.** Same Next.js API routes, same UI pages, same business logic. Only the runtime environment and backing services change.
- **TrueLens evals continue.** Eval harness stays local. Only the retrieval call needs updating to point at Azure AI Search instead of Neo4j — estimated ~20 lines of code. Evals must pass before cutover on Day 5.
- **Vibe / Power Apps — Phase 2 only.** Not in scope for this sprint.
- **No downtime.** Old stack stays live throughout the sprint. Cutover happens only after Day 5 eval validation. 48-hour rollback window before decommissioning Vercel, n8n, and Neo4j.
- **ngrok eliminated.** Local Linux server and tunnel go away entirely when Neo4j is replaced by Azure AI Search.
- **Anthropic Claude API stays direct.** Server-side calls from Azure SWA API routes. No change to LLM provider or model (Sonnet 4.6 default).
