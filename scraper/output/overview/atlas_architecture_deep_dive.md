---
title: Atlas Architecture — Control Plane and Data Plane Explained
url: https://prod.alltrue-be.com/_docs/docs/overview/architecture
section: overview
---

# Atlas Architecture — Control Plane and Data Plane Explained

Atlas uses a two-plane architecture. Understanding why is essential for customer conversations about data sovereignty, compliance, and trust.

## The Two Planes

### Control Plane (Varonis-hosted SaaS)

The control plane runs on the Varonis network as a SaaS service. It handles all platform functions except the AI Gateway and Observability:

- AI Inventory scanning (cloud accounts, code repos, dependency files)
- SPM scanning including penetration testing
- GRC services: compliance audits, TPRM
- SIEM integrations (Splunk, ServiceNow)
- Rules orchestration for Guardrail policy evaluation — LLM input/output is passed through for evaluation but never stored

All management and configuration of data plane components is done from the control plane. There is no separate management interface for the data plane.

### Data Plane (Customer-hosted in AWS)

The data plane runs within the customer's own AWS VPC. It contains two components:

- **AI Gateway (nginx proxy)** — intercepts LLM traffic, applies guardrails, enforces policies
- **AI Observability layer (OpenSearch instance)** — logs all LLM inputs/outputs and guardrail actions

Data retention defaults: 3 months in the index, 6 months in S3 files. Customers can request modifications to this policy.

## Why the Proxy Runs on the Customer Plane — Not Varonis Infrastructure

This is one of the most important architectural decisions in Atlas, and it directly addresses the core threat model.

The problem Atlas solves is sensitive data leaving an organization's environment without authorization. If the proxy ran on Varonis infrastructure, you would be solving a data leakage problem by routing all prompts through a third-party vendor's network — which is a contradiction.

By running the proxy within the customer's own AWS VPC:

| Concern | How It's Addressed |
|---|---|
| **Data sovereignty** | Prompt content never leaves the customer's environment to reach Varonis |
| **Regulatory compliance** | Audit logs and inspection happen within the customer's own boundary |
| **Trust model** | Varonis manages control plane policy configuration but never touches data plane traffic |
| **Vendor risk** | Customers don't have to trust Varonis with PHI, PII, source code, or credentials |

## What Varonis Does and Does Not See

**Varonis does NOT store:**
- Prompt content (LLM inputs)
- LLM responses (outputs)
- Any sensitive data flowing through the Gateway

**Varonis DOES manage:**
- Policy rules and guardrail configuration (via control plane)
- Guardrail rule evaluation — the rules orchestrator on the control plane receives LLM input/output for evaluation purposes, but this data is never persisted. The roadmap includes moving all rules processing to the customer data plane.

**The customer's data plane stores:**
- All LLM inputs and outputs traversing the Gateway (in their own OpenSearch instance)
- Guardrail actions that fired on each request
- This data stays entirely within the customer's AWS environment

## The SE Framing for Customer Conversations

When a CISO asks *"but now I'm routing everything through Varonis"* — the answer is: **you're not.** The Gateway is running in *your* AWS account. Varonis controls the policy configuration from the SaaS control plane, but the actual prompt traffic stays inside your environment.

This is a key differentiator in competitive conversations. The architecture is designed so that Varonis has zero access to customer data, which makes the compliance and trust story significantly stronger.

**Good qualifying question:** Ask the customer where their current LLM traffic goes today. Most have no idea — which reinforces exactly why the data plane isolation matters.

## Data Plane FAQ Answers

**Are AI Gateway and Observability part of the data plane?**
Yes. Both reside on the data plane, deployed in the customer's own AWS environment (VPC).

**Is the data plane collecting any sensitive customer data?**
Depends on configuration. If the AI Gateway is deployed and there is sensitive data in LLM inputs/outputs, these may be logged in the observability layer. This is controlled per-project in AI Observability → Configuration → Gateway/Firewall section. Log events reside within the data plane inside the customer's organization.

**What type of data goes to the control plane?**
The control plane handles AI Inventory scanning, SPM scanning, GRC services, and SIEM integrations. For Guardrail policies, LLM activity is sent to the control plane for rule evaluation, but this data is not stored. Rules processing is moving to the data plane in a future release.

**Who manages the data plane?**
All functions are managed from the control plane. There is no separate management interface for the data plane that is directly accessible by the customer.
