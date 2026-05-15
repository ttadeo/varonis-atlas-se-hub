# Technical Skills & Expertise — Tim Tadeo

---

## AI Engineering & Agentic Systems

**RAG Architecture Design (Retrieval-Augmented Generation)**
Designed and built a production RAG pipeline from scratch — including document scraping, chunking strategy, vectorization, knowledge graph storage, multi-modal retrieval (vector + full-text + semantic), and LLM response generation. Implemented advanced embedding techniques including query-anchored embeddings — where chunks are embedded using representative queries rather than their raw text — to significantly improve retrieval precision for structured content (e.g., version release notes). Achieved evaluation scores of Answer Relevance 1.000, Context Relevance 1.000, Groundedness 0.696 across a 52-question golden evaluation set.

**Multi-Agent Workflow Orchestration (n8n)**
Built and maintained multi-node agentic pipelines in n8n Cloud, including RAG retrieval workflows, architecture generation agents, technical guide producers, and demo provisioning workflows. Designed inter-agent communication patterns, webhook authentication, temperature-controlled generation nodes, and JSON parsing pipelines. Debugged complex field routing issues across chained workflow nodes.

**LLM Integration & Prompt Engineering**
Integrated Anthropic Claude (claude-sonnet-4-6, claude-opus-4-6) and OpenAI APIs into production applications. Designed system prompts for specialized use cases including interactive learning, grounded Q&A, reference architecture generation, and technical guide authoring. Applied prompt engineering best practices: temperature control for factual consistency, max token management, grounding instructions, and role-specific personas.

**Vector Databases & Knowledge Graphs (Neo4j)**
Designed and implemented a Neo4j knowledge graph serving as the primary RAG datastore — 3,038 document chunks with 4 vector indexes (1,536-dimensional cosine similarity via OpenAI text-embedding-3-small). Modeled graph relationships between Users, Sessions, Interactions, and document Chunks to enable both vector retrieval and relationship-aware graph traversal. Wrote Cypher queries for analytics, retrieval, and session persistence.

**AI Evaluation with TruLens**
Designed and implemented a custom RAG evaluation harness using the TruLens framework to measure system quality across the RAG Triad:
- **Answer Relevance** — does the generated answer actually address the question?
- **Context Relevance** — did the retrieval pipeline surface relevant document chunks?
- **Groundedness** — is the answer supported by retrieved context, or is the model hallucinating?

Built a 52-question golden question set spanning Beginner, Intermediate, and Advanced content tiers, version-specific release note questions, and API reference questions. Ran iterative evaluation cycles to diagnose and fix retrieval failures — including identifying that zero-scoring version summary questions were caused by low-content stub chunks, not retrieval failures — and validated fixes through re-evaluation before deploying changes to production.

**Document Intelligence & Web Scraping**
Built authenticated Playwright scrapers for Docusaurus-based single-page applications (SPAs) — handling Auth0 login flows, SPA hydration timing, network interception, and content extraction. Scraped and ingested 37 Atlas documentation sections + 895 OpenAPI endpoint chunks. Built a post-ingestion patch pipeline to enrich stub chunks with consolidated content and re-embed with query-anchored vectors.

---

## AI Security & Varonis Atlas Platform

**Platform Architecture**
Deep working knowledge of the Varonis Atlas AI Security Platform architecture — including the control plane / customer plane separation, data plane deployment models (cloud and on-premises), AI Gateway proxy architecture, and the relationship between Atlas applications (AI 360, AI Inventory, AI SPM, AI Gateway, AI Investigation, AI Red Team, AI Compliance, TPRM).

**AI Gateway & Runtime Policy Enforcement**
Hands-on experience configuring Atlas AI Gateway as an OpenAI-compatible proxy — including LLM endpoint registration, Firewall Proxy key creation and scoping, runtime policy application, and the `x-alltrue-llm-endpoint-identifier` routing header pattern. Understands how Gateway intercepts, evaluates, and enforces policy on AI traffic in real time.

**AI Inventory & Discovery**
Experience with Atlas AI Inventory resource discovery across cloud environments (AWS Bedrock AgentCore, Snowflake, GitHub, Microsoft Copilot Studio). Understands resource types, dependency linking, and the role of discovery in building an AI asset registry. Programmatically created and linked inventory resources via the Atlas REST API for demo scenarios.

**AI SPM (Security Posture Management)**
Familiar with Atlas AI SPM findings, agentic findings, configuration checks, and policy-based posture scoring. Understands how SPM surfaces risks across AI applications and how findings escalate into the investigation workflow.

**AI Investigation**
Working knowledge of AI Investigation Sessions, Access Events (SASE integrations — Cloudflare, Netskope, Island Browser), anomaly detectors, performance metrics, and alert drilldowns. Understands how runtime events flow from Gateway enforcement into the investigation layer.

**AI Red Team & Pentesting**
Familiar with Atlas Red Team capabilities — LLM endpoint pentests, browser-based pentests, pentest strategies, red team templates, script generation agents, and evaluation/dataset management. Understands how to assess AI application resilience through structured attack approaches.

**Runtime Guardrails**
Knowledge of Atlas runtime guardrail types including PII detection, grounding, multi-modal guardrails, agentic guardrails (tool poisoning prevention), rate/burst limiting, and policy templates. Understands guardrail evaluation flow and how policies are applied per prompt source.

**MCP (Model Context Protocol) Governance**
Familiar with Atlas MCP server registration (STDIO and OAuth credential types), Virtual MCPs (VMCP), and effective view flattening. Understands how Atlas governs MCP servers as AI resources within the inventory and policy framework.

**TPRM (Third-Party Risk Management)**
Understands Atlas TPRM module for SaaS vendor AI assessments, audit redesign, and risk scoring of third-party AI tools.

**AI Compliance**
Familiar with Atlas Compliance Compass, compliance framework mapping (EU AI Act, NIST AI RMF), and policy builder workflows.

**Atlas REST & GraphQL APIs**
Hands-on experience with the Atlas API — JWT token issuance, inventory resource creation and dependency linking, project management, and resource discovery endpoints. Built production integrations against the Atlas API for automated demo provisioning.

---

## Cloud & Infrastructure

**Vercel (Next.js Hosting & CI/CD)**
Deployed and maintained a production Next.js application on Vercel — including environment variable management, automatic GitHub-triggered deployments, and serverless API route architecture. Configured project isolation to avoid affecting co-hosted applications.

**Cloudflare (DNS & Security)**
Configured Cloudflare as the authoritative DNS provider for a custom domain (Full DNS setup with delegated nameservers). Managed DNS records including MX, TXT (SPF, DKIM), and CNAME. Enabled AI crawler blocking and robots.txt management through Cloudflare's security dashboard.

**ngrok (Secure Tunneling)**
Configured ngrok on a paid plan for production use — including static TCP address reservation for permanent bolt tunnels, HTTP tunnels for API access, and systemd service configuration for automatic startup on reboot. Resolved SELinux execution blocking (`chcon -t bin_t`) on Red Hat-based Linux.

**Linux Server Administration**
Managed a local Linux server running Neo4j as a production datastore — including Neo4j service management, systemd configuration, disk and memory monitoring, backup procedures, and network configuration for local + cloud access.

---

## Full-Stack Web Development

**Next.js & React**
Built a production multi-page Next.js 16 application with React 19 and TypeScript — including server-side API routes, client-side streaming responses, multi-turn chat interfaces, file upload handling, and Mermaid.js diagram rendering with pop-out full-screen export.

**Authentication & Security Engineering**
Designed and implemented a multi-path authentication system from scratch:
- Email OTP flow with 6-digit codes, 10-minute TTL, single-use enforcement, and Redis-backed rate limiting (3 requests/10 minutes per email)
- HS256 JWT session tokens (via `jose`) with httpOnly, Secure, SameSite=Lax cookies
- Domain-restricted access (@varonis.com only, enforced at the API layer)
- Superuser bypass with hardcoded email + environment variable password
- Lucene injection sanitization for all Neo4j full-text queries

**Email Infrastructure**
Configured end-to-end transactional email delivery from a custom Google Workspace domain using Resend (Amazon SES backend) — including SPF, DKIM (resend._domainkey), and bounce-handling MX records in Cloudflare DNS. Achieved reliable delivery to corporate (@varonis.com) mail servers.

**API Design**
Designed 25+ REST API routes covering authentication, RAG Q&A, learning, meeting support, demo provisioning, analytics, and resource management. Implemented parallel API calls, error handling, and upstream webhook proxying patterns.

---

## AI Products & Tools Used

| Product | Category | How Used |
|---|---|---|
| **Anthropic Claude** (claude-sonnet-4-6, claude-opus-4-6) | LLM | Primary generation model for all Q&A, learning, architecture, and guide workflows |
| **OpenAI** (text-embedding-3-small) | Embeddings | Vector embeddings for all RAG retrieval (1,536 dimensions) |
| **OpenAI** (GPT-4o-mini) | LLM | Safety scoring in TruLens evaluation harness |
| **TruLens** | RAG Evaluation | Answer Relevance, Context Relevance, Groundedness scoring across 52 golden questions |
| **n8n Cloud** | Agent Orchestration | Multi-agent workflow builder for RAG, architecture, guide, and demo pipelines |
| **Neo4j** | Vector + Graph DB | Knowledge graph with 4 vector indexes for hybrid retrieval |
| **Vercel AI Gateway** | LLM Routing | LLM traffic routing, observability, and cost tracking layer |
| **Varonis Atlas** | AI Security Platform | Gateway proxy, inventory management, runtime enforcement, red team, investigation |
| **Playwright** | Browser Automation | Authenticated scraping of Docusaurus SPA with Auth0 login |
| **Resend** | Transactional Email | OTP code delivery via custom domain with full email authentication |
| **Upstash Redis** | Serverless Cache | OTP storage and rate limiting with TTL-based key management |
| **Mermaid.js** | Diagram Generation | AI-generated architecture diagrams rendered in-browser and exported to full-screen |
| **webhook.site** | Dev Tooling | Webhook payload inspection during n8n workflow development |

---

## Summary

Built a complete, production-deployed AI platform — from infrastructure and data pipelines through to authenticated multi-user web applications and rigorous evaluation frameworks — using modern agentic AI architecture patterns. Demonstrated the ability to design systems where AI models are not just tools but orchestrated agents operating within well-defined retrieval, grounding, and evaluation loops. Combines deep Varonis Atlas platform knowledge with practical AI engineering skills to build tools that directly accelerate SE productivity and demonstrate real-world AI security use cases.
