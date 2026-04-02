---
title: AI 360 — Risk Dashboard and Data Aggregation Explained
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_360
section: applications
---

# AI 360 — Risk Dashboard and Data Aggregation Explained

AI 360 is Atlas's unified risk dashboard. It aggregates data from every Atlas application into a single view, providing a complete AI risk snapshot for the organization.

## How AI 360 Aggregates Data Across the Platform

AI 360 does not generate its own data — it aggregates findings from all other Atlas modules. Each section of the dashboard pulls from a specific source:

| Dashboard Section | Data Source |
|---|---|
| **AI Safety Score** | Computed across all organizations and projects using findings from all modules |
| **AI Inventory Summary** | Pulled directly from the AI Inventory application — cloud accounts, code repos, hosted services |
| **Vulnerable AI Resources** | Pulled from AI SPM — library CVEs, model vulnerabilities, cloud misconfigurations |
| **AI Compliance Overview** | Pulled from AI Compliance — framework adherence percentages (OWASP, NIST, etc.) |
| **Issues by Severity** | Aggregated from all modules that generate issues — Inventory, SPM, Gateway, Usage |
| **GenAI App Activity** | Pulled from AI Usage and AI Gateway — daily request counts for the past 90 days |
| **Top MITRE ATLAS / OWASP Risks** | Cross-mapped from all findings to MITRE ATLAS and OWASP LLM Top 10 frameworks |
| **Riskiest AI Resources** | Ranked from AI Inventory and AI SPM — up to 20 resources with the most open issues |

## What Issues Feed Into AI 360

Issues in AI 360 come from all modules of the system:

- **AI Inventory** — a newly discovered model that is not sanctioned creates a Shadow AI issue
- **AI SPM** — a library vulnerability or cloud misconfiguration creates a vulnerability issue
- **AI Gateway** — a blocked or flagged prompt creates a policy violation issue
- **AI Compliance** — a compliance gap creates a compliance finding issue

This is why AI 360 is the right first screen to show a CISO — it answers "where are we exposed?" across all AI risk dimensions simultaneously.

## Hierarchy and Scoping

The dashboard view is scoped by the hierarchy menu selection:

- **All Organizations** — shows the safety score and metrics computed across the entire tenant
- **Specific Organization** — shows data from all projects within that organization
- **Specific Project** — shows data from only that project's resources and findings

This makes AI 360 useful both for executive-level conversations (all organizations view) and for technical deep-dives on a specific AI project.

## Key Metrics for Customer Conversations

**AI Safety Score** — A single number representing the overall AI security posture. Trend line shows improvement or degradation over the last three quarters. This is the headline metric to lead with in a CISO conversation.

**AI Inventory** — Shows total AI resources, with counts of Shadow AI (unreviewed/unsanctioned) and Unprotected AI (missing available controls). The AI inventory numbers only populate once cloud accounts, code repositories, or AI services are linked in AI Inventory.

**GenAI App Activity** — Daily request volume through sanctioned AI tools for the past 90 days. A useful baseline metric for showing the CISO the scale of AI usage in their environment.

**Top MITRE ATLAS and OWASP Risks** — Maps the organization's actual findings to recognized threat frameworks. Toggle between MITRE ATLAS and OWASP LLM Top 10. This is a strong talking point for customers who need to show their board or auditors that their AI security posture maps to industry standards.

## SE Positioning

AI 360 is the entry point for CISO-level conversations. It answers the question every CISO has:

> *"Do you know what your AI risk posture looks like right now — across everything your teams are building and using?"*

The answer before Atlas is typically no. AI 360 makes it yes, with a live dashboard that updates as new resources are discovered, vulnerabilities are found, and guardrails fire.
