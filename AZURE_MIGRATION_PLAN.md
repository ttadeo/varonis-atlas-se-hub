# Azure Migration Plan — Atlas Learning Platform

**Audience:** Engineering / Infrastructure review  
**Date:** 2026-06-05  
**Purpose:** Map the current stack to Azure-native equivalents, with two architecture options, accurate pricing, and EA/MACC guidance for an Azure subscription customer.

---

## Two Architecture Options

### Option A — Azure AI Foundry + Neo4j AuraDB (Recommended)
Use Azure AI Foundry as the AI control plane (models, evaluation, tracing), keep Neo4j AuraDB for Azure to preserve graph relationships, and keep n8n for workflow orchestration.

### Option B — Full Azure Native (No third-party services)
Replace everything with Azure-native services. Uses Azure AI Search instead of Neo4j — loses graph relationship capabilities but stays entirely within Azure.

---

## Option A — Azure AI Foundry + Neo4j AuraDB (Recommended)

### Stack Mapping

| Current | Azure Equivalent | Code Change Required |
|---|---|---|
| Vercel (Next.js) | Azure Static Web Apps | Env vars only |
| n8n Cloud | n8n self-hosted on Azure Container Apps | Webhook URLs only |
| Neo4j local + ngrok | **Neo4j AuraDB for Azure** (Marketplace) | Connection string only |
| Anthropic Claude API | **Azure AI Foundry — Claude Sonnet 4.5** | Endpoint + key only |
| OpenAI Embeddings | **Azure OpenAI Service** (text-embedding-3-small) | Minor SDK config |
| Resend (OTP email) | Azure Communication Services Email | ~10 lines |
| Upstash Redis | Azure Cache for Redis | Redis client swap |
| ngrok | **Eliminated** | Removed |
| TrueLens evals | **Azure AI Evaluation** (built into Foundry) | New setup |

### Architecture Diagram

```
Varonis SE (Browser)
        │ HTTPS
        ▼
Azure Static Web Apps
  (Next.js 16 — UI + API Routes)
  GitHub Actions CI/CD
        │
   ┌────┴──────────────────────────┐
   │                               │
   ▼                               ▼
Azure Container Apps          Azure OpenAI Service
  (n8n self-hosted)            text-embedding-3-small
  All 6 workflows               $0.02/1M tokens
  Scales to zero
   │
   ▼
Neo4j AuraDB for Azure         Azure AI Foundry
  (Azure Marketplace)           Claude Sonnet 4.5
  Graph + Vector preserved      $3.00/$15.00 per 1M tokens
  No ngrok, no server           Built-in eval + tracing
  99.95% SLA (Business Critical)

Azure Cache for Redis           Azure Communication Services
  OTP + rate limiting            OTP email delivery

Azure Database for PostgreSQL
  n8n metadata store
```

### What Azure AI Foundry Gives You

- **Single portal** for model deployment, evaluation, tracing, and prompt management
- **Claude Sonnet 4.5** available natively — same model, Azure endpoint, counts toward MACC
- **Built-in RAG evaluation** — groundedness, relevance, coherence (replaces TrueLens or runs alongside it)
- **Automatic tracing** via OpenTelemetry — every LLM call, retrieval, and tool use captured
- **Model catalog** — swap between Claude, GPT-4o, Llama, Mistral without infrastructure changes

> **Note:** Azure Prompt Flow (formerly part of AI Foundry) was **retired April 20, 2026**. Microsoft recommends migrating to Microsoft Agent Framework. Do not build new workflows on Prompt Flow — use n8n (already your orchestrator) instead.

### Why Keep Neo4j AuraDB (Not Azure AI Search)

Azure has no native managed graph database. The options are:

| Option | Graph | Vector | Cypher | Effort |
|---|---|---|---|---|
| **Neo4j AuraDB for Azure** | ✅ | ✅ | ✅ | Zero code changes |
| Azure AI Search | ❌ | ✅ | ❌ | Full rewrite + lose graph |
| Azure Cosmos DB (Gremlin) | ✅ | ❌ | ❌ | Full rewrite, no vector |
| PostgreSQL + AGE extension | ⚠️ | ⚠️ | ⚠️ | Medium, immature |

Neo4j AuraDB for Azure is available on the Azure Marketplace, counts toward MACC (Azure benefit-eligible), and requires zero code or query changes. The RELATED_TO edges between SMEKnowledge and DocChunk nodes — which power the Guide Producer and SME chat — are preserved entirely.

---

## Option B — Full Azure Native (No Third-Party Services)

Replaces Neo4j with Azure AI Search and n8n with Microsoft Agent Framework. Loses graph relationships.

| Current | Azure Native | Tradeoff |
|---|---|---|
| Neo4j (graph + vector) | Azure AI Search | Lose RELATED_TO graph edges |
| n8n Cloud | Microsoft Agent Framework | AI-specific only, no 400+ connectors |
| All others | Same as Option A | — |

**Not recommended** unless there is a hard requirement to eliminate all third-party services. The graph relationship loss degrades Guide Producer and SME chat quality significantly.

---

## Pricing — Option A (Azure AI Foundry + Neo4j AuraDB)

All prices are **East US region, pay-as-you-go list price** unless noted. EA/MACC discounts applied separately (see below).

### Tier 1 — Dev / POC

| Service | Tier | Monthly Cost |
|---|---|---|
| Azure Static Web Apps | Free | $0 |
| Azure Container Apps (n8n) | Consumption — scale to zero | ~$5–15 |
| Neo4j AuraDB for Azure | Free (200K nodes limit) | $0 |
| Azure OpenAI (embeddings) | Pay-per-use | ~$1–5 |
| Azure AI Foundry — Claude Sonnet 4.5 | Pay-per-use | ~$10–30 |
| Azure Cache for Redis | C0 Basic (250MB) | $16.06 |
| Azure Communication Services | Pay-per-use (~500 emails/mo) | ~$0.13 |
| Azure Database for PostgreSQL | B1ms (n8n metadata) | $12.41 |
| **Total** | | **~$44–78/mo** |

> Neo4j Free tier caps at 200,000 nodes / 400,000 relationships — sufficient for POC but not production (you currently have 3,100+ nodes).

---

### Tier 2 — Production (Recommended for Internal SE Tool)

| Service | Tier | Monthly Cost |
|---|---|---|
| Azure Static Web Apps | Standard | $9.00 |
| Azure Container Apps (n8n) | Consumption (1 vCPU, 2 GiB, moderate usage) | ~$30–60 |
| Neo4j AuraDB for Azure | Professional — 1GB | $65.00 |
| Azure OpenAI (embeddings) | Pay-per-use | ~$5–15 |
| Azure AI Foundry — Claude Sonnet 4.5 | Pay-per-use (~5M input / 2M output tokens) | ~$45 |
| Azure Cache for Redis | C1 Standard (1GB, replicated) | $50.37 |
| Azure Communication Services | Pay-per-use | ~$0.50 |
| Azure Database for PostgreSQL | B1ms Flexible Server | $12.41 |
| Azure Monitor + Log Analytics | ~2 GB/mo ingestion | ~$4.60 |
| **Total (list price)** | | **~$222–261/mo** |
| **After ~15% EA discount** | | **~$189–222/mo** |

---

### Tier 3 — Enterprise (Private Networking, SLAs, Compliance)

| Service | Tier | Monthly Cost |
|---|---|---|
| Azure Static Web Apps | Standard | $9.00 |
| Azure Container Apps (n8n) | Dedicated D4 profile | ~$150–200 |
| Neo4j AuraDB for Azure | Business Critical (99.95% SLA, Private Link, 30-day PITR) | $146/GB — min ~$146–292 |
| Azure OpenAI (embeddings) | Pay-per-use | ~$15–30 |
| Azure AI Foundry — Claude Sonnet 4.5 | Pay-per-use (higher volume) | ~$100–200 |
| Azure Cache for Redis | P1 Premium (6GB, geo-replication) | $202.21 |
| Azure Communication Services | Pay-per-use | ~$1.00 |
| Azure Database for PostgreSQL | D2ds_v6 General Purpose (2 vCore, 8 GiB) | $163.52 |
| Azure Monitor + Log Analytics | ~10 GB/mo ingestion | ~$23.00 |
| Azure Private Link (Neo4j) | ~$0.01/GB + endpoint hours | ~$10–20 |
| **Total (list price)** | | **~$819–1,039/mo** |
| **After ~15% EA discount** | | **~$696–883/mo** |
| **After 1-yr reserved (PostgreSQL)** | | Save ~$65/mo additional |

---

## Pricing — Option B (Full Azure Native, AI Search replaces Neo4j)

| Service | Tier | Monthly Cost |
|---|---|---|
| Azure AI Search | Basic (2 GB, sufficient for current index) | $73.73 |
| All other services | Same as Option A Tier 2 | ~$157–196 |
| **Total (list price)** | | **~$231–270/mo** |
| **After ~15% EA discount** | | **~$196–230/mo** |

> Marginally cheaper than Option A Production, but loses graph relationships. Not recommended.

---

## EA and MACC Guidance

### Enterprise Agreement (EA) Discounts

- EA discounts are **custom-negotiated** — no published standard percentage
- Typical range for mid-market customers: **10–15% off list price** on Azure-native services
- Large commitments ($10M+/year): up to 20–25% possible
- **Not all services receive the same discount** — Azure-native services (Static Web Apps, Container Apps, Redis, PostgreSQL, OpenAI) are typically covered; marketplace items like Neo4j AuraDB are often excluded from EA discounts but covered by MACC (see below)

### MACC (Microsoft Azure Consumption Commitment)

- MACC = pre-committed Azure spend contracted over 1–5 years in exchange for discounts
- **Neo4j AuraDB for Azure counts 100% of pretax spend toward MACC** — it is Azure Marketplace benefit-eligible
- Azure AI Foundry model inference (Claude, GPT-4o) also counts toward MACC
- To verify: look for the **"Azure benefit eligible"** badge on the Azure Marketplace listing before purchasing

### Reserved Capacity Discounts (No EA Required)

| Service | 1-Year Reserved | 3-Year Reserved |
|---|---|---|
| PostgreSQL GP D2ds_v6 | ~40% off (~$98/mo) | ~60% off (~$65/mo) |
| Azure Cache for Redis C1 | ~30% off (~$35/mo) | ~45% off (~$28/mo) |
| Container Apps Dedicated | Available, varies | Available, varies |

Reserved capacity is the fastest way to reduce cost without negotiating — commit for 1 year and save immediately.

---

## Migration Effort Summary

| Component | Effort | Risk | Notes |
|---|---|---|---|
| Vercel → Azure Static Web Apps | Low | Low | Env vars + staticwebapp.config.json |
| n8n Cloud → Azure Container Apps | Medium | Medium | Webhook URLs change, re-configure credentials |
| Neo4j local → AuraDB for Azure | Medium | Medium | dump → push-to-cloud, rebuild vector indexes |
| Anthropic → Azure AI Foundry Claude | Low | Low | Endpoint + key change only |
| OpenAI → Azure OpenAI | Low | Low | Minor SDK azureOpenAI flag |
| Resend → Azure Comm Services | Low | Low | ~10 lines in send-code route |
| Upstash → Azure Cache for Redis | Low | Low | Redis client npm package swap |
| ngrok | None | None | Eliminated entirely |
| **Total** | **2–3 weeks** | **Low–Medium** | Single engineer |

---

## What Doesn't Change

- Atlas API (`api.prod.alltrue-be.com`) — Varonis-hosted, no migration
- Atlas Gateway — Varonis-hosted, no migration
- GitHub source control — stays as-is
- All application and n8n workflow code — zero changes
- Auth flow (JWT + OTP) — identical logic, different email provider
- All Cypher queries — identical (Neo4j AuraDB is fully Cypher-compatible)

---

## Recommended Path for a Varonis Azure Subscription Customer

1. **Start with Option A — Production tier** (~$189–222/mo after EA discount)
2. Purchase **Neo4j AuraDB Professional via Azure Marketplace** — counts toward MACC
3. Purchase **Claude Sonnet 4.5 via Azure AI Foundry** — counts toward MACC, same model you use today
4. Use **Azure OpenAI** for embeddings — EA-covered, same API surface
5. Add **1-year reserved capacity** for PostgreSQL and Redis immediately — saves ~$30–40/mo with no other changes
6. Upgrade to **AuraDB Business Critical** only if private networking or 99.95% SLA is a compliance requirement

**Total estimated monthly cost for Varonis (Azure EA customer, Option A Production):**
**~$189–222/month** — likely lower if MACC committed spend applies credits to Neo4j and Foundry inference costs.
