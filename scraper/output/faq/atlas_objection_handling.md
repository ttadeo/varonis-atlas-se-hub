---
title: Atlas Objection Handling — Common Sales Objections and Responses
url: https://internal.varonis.com/atlas-objection-handling
section: faq
---

# Atlas Objection Handling — Common Sales Objections and Responses

## "We Run Our AI Workloads in Azure, Not AWS — Does Atlas Support Azure?"

**Direct answer:** Yes. Atlas supports Azure AI workloads today, and is expanding Azure infrastructure support in Q2 2026.

### What Atlas Supports Today on Azure

Atlas protects AI regardless of which cloud or provider the LLM lives in. The AI Gateway (proxy, SDK, or API gateway integration) can be deployed to intercept and protect calls to:
- **Azure OpenAI Service** — the most common Azure AI deployment
- **Azure Machine Learning** endpoints
- Any other LLM endpoint, regardless of cloud

Atlas's cloud-agnostic guardrails, AI inventory, and compliance automation work on Azure AI models just like AWS or on-prem models.

### Azure Data Plane Support (Q2 2026 Roadmap)

Today, the Atlas Data Plane (the infrastructure that hosts the AI Gateway and Observability layer) is deployed in the customer's **AWS** account. This is the only current limitation for Azure-first organizations.

In **Q2 2026**, Atlas will introduce:
- Azure-based Data Plane support — customers can deploy the Data Plane in their Azure environment
- Prompt logging in the Control Plane (with AES-256 encryption, BYOK, Prompt Reader RBAC) to replace the AWS OpenSearch dependency

### How to Frame This for an Azure Customer

"Atlas protects your Azure OpenAI and Azure ML workloads today — the gateway and guardrails are cloud-agnostic. The one thing coming in Q2 2026 is the ability to host the Data Plane infrastructure itself in Azure rather than AWS. If you're Azure-first, that roadmap item is important to know. In the meantime, many Azure-first customers use Atlas with a lightweight AWS footprint just for the Data Plane."

---

## "Our AI Usage Is Minimal — We're Not Ready for AI Security Yet"

This is one of the most common initial objections. The answer reframes timing as a risk decision, not a readiness decision.

### Why "Minimal Usage" Is the Wrong Metric

The question is not how much AI your organization has deployed intentionally — it's how much AI is already running without your knowledge. Shadow AI adoption typically runs 3–5x ahead of what IT and security teams are aware of. Employees use ChatGPT, Copilot, Grammarly, and dozens of other AI-enabled tools daily, often pasting sensitive company data into them.

By the time an organization feels "ready" to address AI security, the exposure has already accumulated.

### The Cost of Waiting

- **AI proliferation is accelerating, not slowing.** Every month of delay means more AI assets, more shadow usage, and more compliance exposure.
- **Regulators are not waiting.** The EU AI Act, NIST AI RMF, and emerging SEC AI disclosure guidance are active frameworks. Organizations without AI governance documentation are already behind.
- **Attackers don't wait for readiness.** Prompt injection attacks, data exfiltration via AI, and model manipulation are not theoretical — they are actively exploited.

### The Right Positioning Response

"'Not ready' usually means 'we haven't started yet' — which is exactly the right time to start. Atlas's AI inventory discovery will show you what AI is actually running in your environment. Most organizations are surprised. The risk isn't from the AI you've approved — it's from the AI you don't know about yet. Starting now means you build governance ahead of the mandate, not in response to an incident."

### The Starter Path

For customers who genuinely have limited AI exposure, Atlas's natural entry point is **AI Discovery and Inventory** — a read-only, no-proxy capability that maps what AI is already in the environment. This is a low-risk first step that almost always reveals shadow AI and creates internal urgency.

---

## "We Don't Want to Route Our LLM Traffic Through a Third-Party Proxy"

This is a data sovereignty objection. The correct response centers on the Data Plane architecture.

**Key fact:** The Atlas AI Gateway is deployed **in the customer's own AWS environment** (their VPC). Traffic does not leave the customer's environment to reach Varonis. Varonis manages the infrastructure but never has access to the customer's LLM inputs or outputs.

"The proxy runs in your own AWS account — it's not routing through Varonis infrastructure. Your prompts and responses stay in your environment. Varonis manages the software, but your data is yours."

For customers who still cannot use a proxy, Atlas also offers the Python SDK (code-level integration) and API Gateway integration (Kong/Apigee plugin).

---

## "We Already Have Microsoft Copilot Security / Defender for Cloud AI — Why Do We Need Atlas?"

Microsoft's AI security capabilities (Agent365, Defender for Cloud AI) are distribution plays bundled with E5/E7 licenses. They are broad but not purpose-built for AI security.

**What Microsoft covers:**
- Basic AI asset visibility for Microsoft AI services (Copilot, Azure OpenAI)
- General posture management extensions from Defender for Cloud
- Limited to Microsoft AI ecosystem

**What Atlas adds:**
- Multi-cloud, multi-vendor AI inventory (AWS Bedrock, GCP Vertex, third-party SaaS tools, on-prem models, shadow AI)
- Runtime protection via AI Gateway — inline guardrails with BLOCK/MODIFY/WARN actions
- Automated compliance mapping (OWASP LLM Top 10, NIST AI RMF, EU AI Act)
- LLM Endpoint Pentesting — adversarial testing of any LLM endpoint
- TPRM — third-party AI risk management for vendor tools
- CI/CD integration for security-gated AI deployments

"If you only use Microsoft AI, Defender gives you a starting point. But most enterprises have AI running across multiple clouds and dozens of third-party tools. Atlas is the single platform that covers all of it — not just the Microsoft slice."

---

## "The Timing Isn't Right — We're in Budget Freeze / Evaluating Next Quarter"

This is a timing stall, not a technical objection. Use it to establish a roadmap milestone.

**Positioning approach:**
- Agree with the timing and offer to run AI Discovery now (often no-cost) to build the internal business case
- Frame the Q2 2026 Azure Data Plane release as a natural milestone for Azure customers
- Tie the urgency to a specific regulatory deadline (EU AI Act enforcement, board-level AI risk reporting)
- Offer to run a proof-of-concept scoped to one AI project to demonstrate value within the budget cycle
