# Azure Migration Plan — Atlas Learning Platform

**Audience:** Engineering / Infrastructure review  
**Date:** 2026-06-05  
**Purpose:** Map the current stack to Azure-native equivalents, estimate costs, and identify migration complexity.

---

## Current Stack vs Azure Equivalents

| Current | Azure Equivalent | Notes |
|---|---|---|
| Vercel (Next.js hosting) | Azure Static Web Apps | Best fit for Next.js; built-in CI/CD from GitHub |
| n8n Cloud | n8n self-hosted on Azure Container Apps | n8n has no Azure-managed offering; run it containerized |
| Neo4j (local Linux server + ngrok) | Neo4j AuraDB for Azure | Fully managed Neo4j, eliminates ngrok entirely |
| Anthropic Claude | Azure AI Foundry — Claude models | Claude 3.5/4.x available via Microsoft's AI Marketplace partnership |
| OpenAI Embeddings | Azure OpenAI Service | text-embedding-3-small available natively |
| Resend (OTP email) | Azure Communication Services — Email | Drop-in replacement, same SMTP/API pattern |
| Upstash Redis (OTP + rate limiting) | Azure Cache for Redis | Managed Redis, same API surface |
| GitHub (source control + CI/CD) | GitHub (keep) or Azure DevOps | GitHub Actions integrates natively with Azure Static Web Apps |
| ngrok (Neo4j tunnel) | Not needed | Eliminated when Neo4j moves to AuraDB for Azure |

---

## Azure Architecture

```
Varonis SE (Browser)
        │ HTTPS
        ▼
Azure Static Web Apps
  (Next.js 16 — UI + API Routes)
  GitHub Actions CI/CD (auto-deploy on push to main)
        │
        ├──────────────────────────────────────┐
        │                                      │
        ▼                                      ▼
Azure Container Apps                    Azure OpenAI Service
  (n8n self-hosted)                     - text-embedding-3-small
  - All 6 n8n workflows                 - GPT-4o (fallback if needed)
  - Scales to zero when idle            
        │                               Azure AI Foundry
        ▼                               - Claude Sonnet 4.6 / Opus 4.6
Neo4j AuraDB for Azure                  (via Microsoft AI Marketplace)
  - Fully managed Neo4j
  - Vector indexes preserved
  - No ngrok, no local server
  - 99.95% SLA
        
Azure Cache for Redis
  (OTP storage + rate limiting)

Azure Communication Services
  (OTP email delivery)

Atlas API + Atlas Gateway
  (unchanged — Varonis-hosted, no migration needed)
```

---

## Component Deep Dives

### 1. Vercel → Azure Static Web Apps

**Why Azure Static Web Apps:**
- Native Next.js support with server-side rendering
- Free tier available; Standard tier at $9/month
- GitHub Actions integration built-in (same push-to-deploy workflow)
- Built-in auth providers (can replace or supplement current JWT flow)
- Global CDN included

**Migration effort:** Low  
- Point GitHub repo at Azure Static Web Apps
- Migrate environment variables to Azure App Settings
- Update any Vercel-specific configs (vercel.json → staticwebapp.config.json)

**Alternative:** Azure App Service (more control, higher cost ~$55-138/month for production-grade)

---

### 2. n8n Cloud → n8n on Azure Container Apps

**Why Container Apps:**
- n8n publishes an official Docker image (`n8nio/n8n`)
- Container Apps scales to zero when idle — no cost during off-hours
- Managed ingress, TLS, and custom domains included
- Persistent storage via Azure Files (required for n8n's SQLite or use PostgreSQL)

**Recommended setup:**
```
Azure Container Apps (n8n)
  - Image: n8nio/n8n:latest
  - Min replicas: 0 (scale to zero)
  - Max replicas: 2
  - CPU: 1 vCPU, Memory: 2Gi
  - Persistent volume: Azure Files (n8n data)
  - DB: Azure Database for PostgreSQL (n8n metadata) OR SQLite on Azure Files
```

**Migration effort:** Medium  
- Export all 6 workflows from n8n Cloud (already done — in `n8n/workflows/`)
- Deploy n8n container to Azure Container Apps
- Import workflows
- Update all webhook URLs in Vercel env vars
- Update n8n credentials (Neo4j, OpenAI, Anthropic connections)

---

### 3. Neo4j Local + ngrok → Neo4j AuraDB for Azure

**Why AuraDB:**
- Fully managed — no server maintenance, no ngrok, no stale PID issues
- Native Azure deployment (same region as other services)
- Vector index support (required for RAG)
- Automatic backups included
- Private networking via Azure Private Link (Enterprise tier)

**Migration effort:** Medium  
- `neo4j-admin dump` from local instance
- Restore into AuraDB instance using `neo4j-admin push-to-cloud` or AuraDB import
- Update `NEO4J_URI` env var in Azure Static Web Apps + n8n
- Remove ngrok entirely

**Data to migrate:**
- 3,038 DocChunk nodes + embeddings
- 69 SMEKnowledge nodes + embeddings
- All vector indexes
- User, Session, Interaction, MeetingSession nodes

---

### 4. Anthropic Claude → Azure AI Foundry (Claude)

**Why this works:**  
Anthropic and Microsoft have a partnership — Claude models (Sonnet, Opus, Haiku) are available through Azure AI Foundry via the Azure Marketplace. The API surface is identical to the Anthropic API with an Azure endpoint.

**Migration effort:** Low  
- Provision Claude model in Azure AI Foundry
- Update `ANTHROPIC_API_KEY` → Azure AI Foundry endpoint + key
- SDK stays the same (`@anthropic-ai/sdk`) with endpoint override

**Alternative:** Keep calling Anthropic API directly from Azure (outbound HTTPS call — works fine, just not "fully Azure")

---

### 5. OpenAI Embeddings → Azure OpenAI Service

**Why Azure OpenAI:**
- `text-embedding-3-small` available natively
- Same API surface as OpenAI — SDK works unchanged with endpoint + key swap
- Data stays within Azure boundary (compliance benefit)

**Migration effort:** Low  
- Provision Azure OpenAI resource
- Deploy `text-embedding-3-small` model
- Update `OPENAI_API_KEY` + add `AZURE_OPENAI_ENDPOINT` env var
- Minor SDK config change (add `azureOpenAI: true` flag)

---

### 6. Resend → Azure Communication Services Email

**Migration effort:** Low  
- Provision Azure Communication Services resource
- Verify sending domain (timthecoder.net) — same DNS records
- Update `RESEND_API_KEY` → ACS connection string
- Update email sending code (~10 lines in `/api/auth/send-code`)

---

### 7. Upstash Redis → Azure Cache for Redis

**Migration effort:** Low  
- Provision Azure Cache for Redis (C1 Standard recommended for production)
- Update `KV_REST_API_URL` + `KV_REST_API_TOKEN` → Azure Redis connection string
- `@upstash/redis` client → `ioredis` or `redis` npm package (minor code change)

---

## Cost Estimate

All prices are USD/month estimates based on Azure public pricing (East US region, 2026).

### Minimum Viable (Dev/Test)

| Service | Tier | Est. Cost/mo |
|---|---|---|
| Azure Static Web Apps | Free | $0 |
| Azure Container Apps (n8n) | Consumption (scale to zero) | ~$10–20 |
| Neo4j AuraDB for Azure | Free (4GB limit) | $0 |
| Azure OpenAI Service | Pay-per-use (embeddings) | ~$5–15 |
| Azure AI Foundry — Claude | Pay-per-use | ~$20–50 |
| Azure Cache for Redis | C0 Basic (250MB) | ~$16 |
| Azure Communication Services | Pay-per-use (~500 emails/mo) | ~$1 |
| **Total** | | **~$52–102/mo** |

### Production Grade

| Service | Tier | Est. Cost/mo |
|---|---|---|
| Azure Static Web Apps | Standard | $9 |
| Azure Container Apps (n8n) | Dedicated (1 vCPU, 2Gi) | ~$50–80 |
| Neo4j AuraDB for Azure | Professional (8GB+) | ~$65–130 |
| Azure OpenAI Service | Pay-per-use | ~$15–40 |
| Azure AI Foundry — Claude | Pay-per-use (Sonnet) | ~$50–150 |
| Azure Cache for Redis | C1 Standard (1GB) | ~$50 |
| Azure Communication Services | Pay-per-use | ~$2 |
| Azure Database for PostgreSQL | B1ms (n8n metadata) | ~$25 |
| **Total** | | **~$266–486/mo** |

### Enterprise Grade (with Private Networking + SLA)

| Service | Tier | Est. Cost/mo |
|---|---|---|
| Azure Static Web Apps | Standard | $9 |
| Azure Container Apps (n8n) | Dedicated + autoscale | ~$150 |
| Neo4j AuraDB for Azure | Enterprise (Private Link) | ~$400+ |
| Azure OpenAI Service | Provisioned throughput | ~$200+ |
| Azure AI Foundry — Claude | Pay-per-use (Opus) | ~$200+ |
| Azure Cache for Redis | P1 Premium (6GB) | ~$200 |
| Azure Communication Services | Standard | ~$10 |
| Azure Database for PostgreSQL | GP_Gen5_2 | ~$100 |
| Azure Monitor + Log Analytics | Standard | ~$50 |
| **Total** | | **~$1,319+/mo** |

---

## Migration Complexity Summary

| Component | Effort | Risk | Blocker? |
|---|---|---|---|
| Vercel → Azure Static Web Apps | Low | Low | No |
| n8n Cloud → Azure Container Apps | Medium | Medium | Webhook URLs change |
| Neo4j local → AuraDB | Medium | Medium | Data migration + index rebuild |
| Anthropic → Azure AI Foundry | Low | Low | No |
| OpenAI → Azure OpenAI | Low | Low | Minor SDK config |
| Resend → Azure Comm Services | Low | Low | No |
| Upstash → Azure Cache for Redis | Low | Low | Minor client code change |
| ngrok | None | None | Eliminated |

**Total estimated migration effort:** 2–3 weeks for a single engineer.

---

## What Doesn't Change

- Atlas API (`api.prod.alltrue-be.com`) — Varonis-hosted, no migration
- Atlas Gateway — Varonis-hosted, no migration
- GitHub source control — stays as-is
- All application code — no changes required (env vars only)
- n8n workflow logic — exported JSON imports cleanly into self-hosted n8n
- Auth flow (JWT + OTP) — identical, just different email provider

---

## Key Recommendation

For an internal SE tool at current scale, **Production Grade (~$300-500/month)** is the right target. The main cost driver is Neo4j AuraDB Professional — if budget is a constraint, running Neo4j on an Azure VM (B2s ~$35/month) instead of AuraDB cuts that line significantly at the cost of managing the instance yourself (same situation as today, just in Azure instead of local).

If Varonis has an existing Azure Enterprise Agreement, most of these services would be covered under committed spend — actual incremental cost may be significantly lower.
