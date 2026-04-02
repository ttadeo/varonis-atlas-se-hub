---
title: Atlas TPRM — Third-Party AI Risk Management
url: https://internal.varonis.com/atlas-tprm
section: overview
---

# Atlas TPRM — Third-Party AI Risk Management

## What Is TPRM?

TPRM stands for **Third-Party Risk Management**. In the context of AI security, TPRM addresses the risk that comes from using vendor-provided AI tools, SaaS AI applications, and external AI services — rather than only the AI that the organization builds and controls internally.

The vast majority of enterprise AI usage is third-party: ChatGPT Enterprise, Microsoft Copilot, GitHub Copilot, Salesforce Einstein, Grammarly, Notion AI, and hundreds of other AI-powered SaaS tools. TPRM is how organizations govern and assess the risk those tools introduce.

---

## Why TPRM Matters for AI Security

### The Supply Chain Risk Problem

When an employee uses a third-party AI tool, they are potentially:
- Sending proprietary data to an external vendor's infrastructure
- Accepting the vendor's AI governance policies (which may not align with the organization's)
- Exposing the organization to any security failures or breaches at the vendor
- Creating compliance obligations depending on what data is processed

Traditional vendor risk management processes were built for software vendors — not for AI vendors who process live organizational data in real time.

### AI Vendors Are Different

AI vendor risk requires assessing:
- **What data the AI vendor trains on** — does the vendor use customer prompts to improve their model?
- **Data retention policies** — how long does the vendor store your data?
- **Model security** — has the vendor's model been tested for adversarial vulnerabilities?
- **Compliance posture** — does the vendor hold SOC 2, ISO 27001, EU AI Act alignment?
- **Contractual terms** — do the vendor's DPA and AI-specific terms meet the organization's requirements?

---

## What Atlas TPRM Does

Atlas TPRM provides a structured framework for assessing and managing the risk of third-party AI vendors.

### Vendor AI Risk Assessments
Atlas enables security teams to create and track risk assessments for each AI vendor the organization uses. Assessments cover:
- Data handling practices
- Model security posture
- Compliance certifications
- Contractual risk terms

### Vendor Inventory
TPRM builds on Atlas AI Inventory — the same discovery process that identifies AI assets in cloud environments also identifies third-party AI services employees are using (via AI Usage / ZTNA data). This creates a comprehensive vendor AI inventory.

### Risk Scoring and Reporting
Atlas aggregates TPRM findings into risk scores for each vendor, enabling security and procurement teams to:
- Prioritize high-risk vendor relationships
- Track remediation of identified gaps
- Produce board-level AI supply chain risk reports

### Compliance Integration
TPRM findings feed directly into Atlas's compliance automation. Frameworks like NIST AI RMF and the EU AI Act include specific controls for third-party AI risk — Atlas maps TPRM assessments to these requirements automatically.

---

## TPRM vs Internal AI Security

| Risk Area | Internal AI (Built in-house) | Third-Party AI (Vendor SaaS) |
|-----------|------------------------------|------------------------------|
| Runtime protection | AI Gateway guardrails | AI Usage monitoring, TPRM assessment |
| Inventory | AI Inventory scanning | AI Usage ZTNA + TPRM registry |
| Compliance evidence | Atlas guardrail logs, AI Observability | TPRM assessment documentation |
| Data control | Full (runs in customer environment) | Dependent on vendor terms |
| Remediation | Configure guardrails, adjust code | Vendor negotiation, block unsanctioned tools |

---

## Why TPRM Is a Key Atlas Differentiator

Most AI security tools focus exclusively on AI the customer builds. Atlas covers both:

1. **Internal AI** — the models, endpoints, and applications the customer builds and deploys
2. **Third-party AI** — the vendor AI tools employees use every day

This full-spectrum coverage is what makes Atlas a complete AI governance platform rather than a point tool for model security or cloud AI posture.

Competitors like Wiz AI-SPM, CrowdStrike, and most cloud-native AI security tools do not include TPRM capabilities. Atlas's TPRM is a significant differentiator, especially for enterprises with mature vendor risk programs.

---

## SE Talking Points

**"What is TPRM in the context of Atlas and why does it matter for AI security?"**
TPRM is third-party AI risk management — it governs the risk from AI vendor tools your employees use, like ChatGPT, Copilot, and Grammarly. Most AI security tools only look at AI you build internally. Atlas covers both sides: the AI you build and the AI you buy. TPRM gives you a structured way to assess what data vendors process, how they handle it, and whether their AI practices meet your compliance requirements.

**"We already assess our software vendors — why do we need a separate AI risk management process?"**
AI vendors process live data in real time — every prompt an employee types potentially trains the vendor's model or is retained in their infrastructure. Traditional vendor risk questionnaires don't address this. Atlas TPRM provides AI-specific assessment criteria: data retention, model training policies, adversarial testing, and AI-specific compliance certifications.

**"Which compliance frameworks does TPRM help with?"**
NIST AI RMF, EU AI Act, and SOC 2 AI-related controls all include third-party AI risk requirements. Atlas maps TPRM assessments directly to these framework requirements, giving auditors the evidence they need.
