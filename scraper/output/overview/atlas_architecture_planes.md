---
title: Atlas Architecture — Control Plane vs Data Plane (Customer Plane)
url: https://internal.varonis.com/atlas-architecture-planes
section: overview
---

# Atlas Architecture — Control Plane vs Data Plane (Customer Plane)

## Overview

Atlas is built around a strict two-plane architecture that separates governance functions from runtime data handling. The two planes are referred to interchangeably as:

- **Data Plane** = **Customer Plane** = the infrastructure deployed inside the customer's own environment
- **Control Plane** = Varonis-managed SaaS = the centralized platform for configuration and governance

These two terms — Data Plane and Customer Plane — mean the same thing. The Data Plane is called the "customer plane" because it runs in the customer's environment, not Varonis's.

---

## The Control Plane (Varonis-Managed SaaS)

The Control Plane is hosted and managed by Varonis. It provides:

- Platform configuration and management UI
- AI Inventory scanning and asset discovery
- AI Security Posture Management (AI SPM)
- Compliance, GRC, and TPRM workflows
- SIEM and ticketing integrations (Splunk, ServiceNow)
- Alert and issue management
- Rules orchestration (policy evaluation engine)

**The Control Plane does not sit in the inline data path for customer AI traffic.** It is the brain of the platform — it configures what the Data Plane does, but LLM traffic does not flow through Varonis infrastructure.

---

## The Data Plane (Customer Plane — Deployed in Customer's AWS VPC)

The Data Plane is deployed inside the customer's own AWS environment (their VPC). Varonis manages the infrastructure (deploys and maintains it), but it runs entirely within the customer's cloud account.

The Data Plane contains:

- **AI Gateway (NGINX reverse proxy)** — intercepts and inspects all LLM traffic
- **Observability layer (OpenSearch)** — stores logs of LLM interactions (prompts, responses, guardrail actions)
- **Guardrail enforcement** — applies configured policy rules to each LLM request
- **Guardrails SDK** — alternative to proxy for code-level integration

**Why this matters:** All LLM prompts, responses, and interaction logs stay within the customer's environment. Varonis has no access to this data. This is the core data sovereignty guarantee.

---

## What Flows Between the Two Planes

### From Data Plane → Control Plane
- LLM input/output data sent to the rules orchestrator for policy evaluation **— processed in memory only, never persisted**
- Metadata: policy violation events that become alerts/issues
- AI inventory scan results (model names, endpoints, configurations — not prompt content)

### From Control Plane → Data Plane
- Policy configuration updates
- Guardrail rule definitions
- Software updates and patches

### What Never Leaves the Customer/Data Plane
- Raw LLM prompts and responses (when logging is enabled)
- Observability logs
- Interaction history stored in OpenSearch

---

## Key Differences: Control Plane vs Data Plane (Customer Plane)

| Feature | Control Plane | Data Plane (Customer Plane) |
|---------|--------------|----------------------------|
| Hosted by | Varonis (SaaS) | Customer (their AWS account) |
| Contains | Configuration, governance, compliance | AI Gateway, observability, runtime enforcement |
| Processes LLM traffic? | Only for rule evaluation (in-memory) | Yes — all traffic flows through here |
| Stores prompt content? | Only in policy violation alerts (encrypted) | Yes — observability logs (if enabled) |
| Varonis data access | Admin access to configuration | Infrastructure management only, no data access |
| Customer control | Full via UI/API | Customer owns the AWS account |

---

## Multiple Data Planes

Customers with global operations or strict data residency requirements can deploy multiple Data Planes — one per region. This keeps AI traffic and observability logs local to where users and data reside. Each regional Data Plane is managed from the single Control Plane.

---

## SE Talking Points

**"What is the difference between the control plane and the customer plane?"**
The customer plane (also called the Data Plane) is the infrastructure deployed inside your own AWS environment — your AI Gateway and your observability logs run there. The Control Plane is the Varonis-managed SaaS that configures everything. Your AI traffic stays in your plane; Varonis manages the configuration in theirs.

**"Why does Atlas run the proxy in the customer environment rather than Varonis infrastructure?"**
Because your LLM prompts may contain sensitive data — employee PII, customer records, internal IP. If the proxy ran in Varonis infrastructure, that data would cross your network boundary. By deploying the Data Plane inside your AWS VPC, your prompts never leave your environment. Varonis manages the software but never touches the data.
