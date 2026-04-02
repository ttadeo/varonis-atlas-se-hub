---
title: Atlas CISO Technical Review — Data Flows, Varonis Data Access, and Security Architecture
url: https://internal.varonis.com/atlas-ciso-data-flows
section: faq
---

# Atlas CISO Technical Review — Data Flows, Varonis Data Access, and Security Architecture

This document answers the questions a CISO or security architect will ask during a final technical review of Atlas. It covers exactly what data Varonis can and cannot access, what data leaves the customer environment, and how Atlas enforces data sovereignty.

---

## Does Varonis See Our Blocked Prompts?

**Short answer: No — Varonis does not see or store blocked prompts.**

Here is the precise data flow for a blocked prompt:

1. A user sends a prompt to an LLM application
2. The prompt is intercepted by the Atlas AI Gateway (NGINX proxy deployed in the customer's own AWS VPC)
3. The prompt is sent to the Atlas rules orchestrator (Control Plane) for policy evaluation
4. The rules orchestrator evaluates the prompt against configured guardrail policies and returns a verdict: BLOCK, MODIFY, WARN, or ALLOW
5. **The prompt data is NOT persisted anywhere during this evaluation** — it is processed in-memory and the verdict is returned
6. If the verdict is BLOCK, the prompt is blocked at the gateway and never forwarded to the LLM

**Key guarantee:** The Control Plane rules orchestrator receives LLM input/output data for evaluation, but **this data is never stored**. Over the near-term roadmap, Atlas is moving all rules processing to the customer Data Plane, eliminating this data path entirely.

---

## What Data Leaves Our Environment?

### Data That Stays in the Customer Environment (Data Plane)

The following data never leaves the customer's AWS VPC:

- **All LLM prompts and responses** (when observability/logging is enabled) — stored in OpenSearch within the customer Data Plane
- **Guardrail action logs** — stored in the customer Data Plane
- **Raw AI traffic** — processed by the NGINX proxy inside the customer environment

Varonis manages the infrastructure (the Data Plane is a Varonis-deployed component) but **Varonis has no access to data stored within it**.

### Data That Goes to the Control Plane (Varonis-Managed SaaS)

The following data leaves the customer environment and goes to the Atlas Control Plane:

| Data Type | Persisted? | Notes |
|-----------|-----------|-------|
| LLM input/output (for rules evaluation) | **No** | Processed in-memory, never stored |
| Prompts in policy violation alerts/issues | **Yes** | AES-256 encrypted, RBAC-restricted |
| AI inventory metadata (model names, endpoints, configs) | Yes | No prompt/response content |
| Compliance scan results and posture findings | Yes | No prompt/response content |
| TPRM vendor risk data | Yes | No prompt/response content |

### The Critical Distinction

The only customer prompt content stored in the Control Plane is prompts that appear in **policy violation alerts or issues** (e.g., a blocked prompt that triggered a security policy). These are:
- Encrypted with AES-256 at rest
- Accessible only to users with the **Prompt Reader** RBAC role
- Available as BYOK (Bring Your Own Key) or platform-managed via AWS KMS

---

## Can Varonis Access Our Data?

**Varonis does not have access to customer data stored in the Data Plane.** Varonis manages the infrastructure (deploys and maintains it) but the Data Plane runs inside the customer's AWS account. Varonis has infrastructure management access (for upgrades, patches) but not data access.

For Control Plane stored data (policy violation prompts, inventory metadata, compliance results):
- Data is encrypted at rest (AES-256)
- BYOK allows customers to hold their own encryption keys — even Varonis cannot decrypt without customer key access
- RBAC controls which users within the customer's own tenant can view sensitive prompt content

---

## Architecture Summary for CISO Briefing

```
Customer Environment (AWS VPC)
  └── Data Plane
        ├── NGINX AI Gateway (proxy) ← all LLM traffic flows here
        ├── OpenSearch (observability logs) ← prompt/response logs stay here
        └── Guardrail SDK / API Gateway plugin

Atlas Control Plane (Varonis SaaS)
  ├── Rules Orchestrator ← receives prompts for evaluation, never persists
  ├── AI Inventory / SPM
  ├── Compliance / GRC
  └── Alert/Issue Storage ← AES-256, BYOK, Prompt Reader RBAC
```

**The gateway lives in your environment. Your data stays in your environment.**

---

## Upcoming Architecture Change: Rules Processing on Data Plane

Atlas is moving guardrail rules processing from the Control Plane to the Data Plane. When this change is complete:
- Prompt evaluation for BLOCK/MODIFY/WARN decisions will happen entirely within the customer's environment
- No prompt data will ever leave the customer's AWS VPC for any reason
- This eliminates the current in-memory data path to the Control Plane rules orchestrator

This is the final step toward a fully data-sovereign architecture.

---

## Data Retention

| Location | Default Retention | Customer Configurable? |
|----------|-----------------|----------------------|
| Data Plane (OpenSearch) | 3 months indexed, 6 months S3 | Yes — can request shorter or longer |
| Data Plane (S3) | 6 months | Yes |
| Control Plane | No customer-configured limit | No |

---

## Regulatory and Compliance Posture

**EU AI Act:** Atlas automates compliance mapping to the EU AI Act. Atlas itself is designed with data sovereignty controls (BYOK, Data Plane in customer VPC) compatible with EU data residency requirements.

**NIST AI RMF:** Atlas maps controls to all four NIST AI RMF functions: GOVERN, MAP, MEASURE, MANAGE.

**OWASP LLM Top 10:** Atlas guardrails map directly to all 10 OWASP LLM risk categories.

**Multiple Data Planes:** Global enterprises with data residency requirements can deploy multiple Data Planes in different regions, keeping traffic and observability data close to where users and data reside.

---

## SE Talking Points

**"Does Varonis see our blocked prompts?"**
No. Prompts flow through the Control Plane's rules orchestrator for evaluation but are never persisted — that's an in-memory evaluation only. The only prompt content stored in the Control Plane is prompts that triggered policy violation alerts, and those are AES-256 encrypted with RBAC access controls.

**"What data actually leaves our environment?"**
Your LLM traffic logs stay in your Data Plane (your AWS VPC). What goes to Varonis: AI inventory metadata, compliance scan results, and the in-memory rules evaluation traffic (not persisted). If you want full data sovereignty, BYOK gives you control over the encryption keys for any data stored in the Control Plane.

**"We're a global financial services firm with EU data residency requirements — can Atlas accommodate that?"**
Yes. You can deploy multiple Data Planes — one per region — to keep traffic and logs local to where they originate. The BYOK key management option gives you control over any data stored in the Control Plane. The near-term roadmap moves rules processing fully to the Data Plane, which will mean no prompt data ever leaves your environment.
