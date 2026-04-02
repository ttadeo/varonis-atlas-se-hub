---
title: Atlas AI Observability — Audit Trail, Logging, and Data Retention
url: https://internal.varonis.com/atlas-observability
section: overview
---

# Atlas AI Observability — Audit Trail, Logging, and Data Retention

## What Is AI Observability?

AI Observability is the Atlas application that provides a complete, searchable audit trail of all AI interactions flowing through the AI Gateway. It answers the question: **"What did our AI systems do, and what data was involved?"**

AI Observability is deployed as part of the Data Plane (inside the customer's own AWS environment) and runs on OpenSearch, a managed search and analytics platform.

---

## What AI Observability Captures

When the AI Gateway is deployed, AI Observability can log:

- **LLM prompts** — the full text of every request sent to an AI model
- **LLM responses** — the full text of every model output
- **Guardrail actions** — every WARN, BLOCK, or MODIFY action taken by Atlas policies, including which rule fired and why
- **Metadata** — timestamps, user/application identifiers, model endpoints, token counts

This creates a complete, immutable record of all AI interactions across the organization's AI applications.

---

## Where Is the Data Stored?

All AI Observability data is stored in **OpenSearch within the customer's Data Plane** (their AWS VPC). This is critical:

- **Varonis does not have access to observability logs**
- Prompt and response content never leaves the customer's AWS environment
- The customer owns and controls the OpenSearch instance
- Varonis manages the infrastructure but has no visibility into the data it contains

---

## Data Retention Policy

### Default Retention
| Storage Layer | Default Retention |
|--------------|------------------|
| OpenSearch index (hot storage, fast search) | **3 months** |
| S3 files (cold storage, archival) | **6 months** |

### Configurable Retention
Customers can request their specific retention policy to be modified — either shorter (to minimize data exposure) or longer (to meet compliance requirements that mandate extended audit history). This is configured at the tenant level.

---

## Observability Is Customer-Configurable

Prompt and response logging is **not mandatory** — it is configurable per project:

- Customers can disable prompt logging entirely for sensitive AI workloads
- Customers can configure what gets logged and at what log level (e.g., log guardrail actions only, not prompt content)
- Configuration is managed under **AI Observability → Configuration** in the Atlas platform
- Coming in April 2026: endpoint-level logging controls for even more granular management

---

## Audit Trail Use Cases

### Legal and Compliance Audit
A legal team or auditor requesting a complete history of all prompts sent to an AI system for the past 90 days — AI Observability provides this. The 3-month default index retention covers this window; the 6-month S3 archive covers extended requirements.

### Security Incident Investigation
When a guardrail fires on a suspicious prompt, investigators can pull the full context: what was the exact prompt, what response was generated (if any), which policy fired, and which application/user sent the request.

### Regulatory Evidence
For frameworks requiring evidence of AI oversight (NIST AI RMF, EU AI Act, SOC 2), AI Observability logs serve as the documentary evidence that AI traffic was monitored and governed.

### Behavioral Baselining
Security teams can review observability data to understand normal AI usage patterns and identify anomalies — unusual access to sensitive endpoints, unusually large data transfers, or off-hours AI activity.

---

## AI Observability vs AI Audit Trail — Same Thing

"AI Observability," "the audit trail," and "the observability layer" all refer to the same component: the OpenSearch-backed logging system in the Data Plane that records all AI interactions.

---

## SE Talking Points

**"A customer's legal team wants a complete audit trail of every prompt sent to their AI chatbot for the past 90 days. Which Atlas component provides this, and where is that data stored?"**
AI Observability — it's deployed as part of the customer's Data Plane and runs on OpenSearch inside their own AWS environment. The default retention is 3 months in the searchable index and 6 months in S3 archive. Varonis has no access to this data — it lives entirely in the customer's cloud account.

**"What is the default data retention period for the AI Observability layer, and can it be changed?"**
3 months in the OpenSearch index, 6 months in S3. Both can be modified on request — shorter for customers who want to minimize data retention, longer for customers with compliance requirements mandating extended audit history.

**"If we use Atlas, can Varonis see what our employees are typing into AI tools?"**
No. The Observability layer sits inside your own AWS VPC. Varonis manages the software but has no access to the data it contains. Your prompts and AI interaction logs are yours.
