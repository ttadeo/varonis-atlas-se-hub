---
title: Atlas FAQ — Sales (Sales-Enabling FAQs & Common Objections)
url: https://internal.varonis.com/atlas-faq
section: faq
---

# Atlas FAQ — Sales (Sales-Enabling FAQs & Common Objections)

## Sales Process

**Q: How do I schedule a client deep dive or demo with an SME?**
A: Use the Atlas Intake form and follow the on-screen guide to book a Zoom meeting with the appropriate SME. This form can also be used to kick off an Atlas evaluation.

**Q: How is pricing determined?**
A: The Varonis Atlas AI Security platform is licensed in a tiered model based upon the number of AI systems for the AI security posture solution (e.g. inventory, AI-SPM, and pen-testing) and GRC solution (e.g. compliance, third party risk management), and number of prompts for the AI runtime protection solution (e.g. prompt and response auditing and runtime guardrails).

**Q: Who is the ideal first customer profile for an Atlas POC?**
A: Organizations with active or budgeted AI initiatives, an executive sponsor, and assigned technical stakeholders (cloud, AI engineering, and security) who can participate in a 2–3 week evaluation.

**Q: What is the executive outcome of a successful POC?**
A: An executive-ready view of AI risk (inventory, posture findings, pen test outcomes, and any guardrail violations) plus a clear production rollout plan.

---

## Roadmap / Positioning

**Q: When will Varonis DSP be integrated?**
A: Varonis has already started integrating the two solutions and will be updating over the course of this year.

**Q: Does this replace Copilot/ChatGPT security in Varonis SaaS? What are the capability differences?**
A: No — Atlas does not replace our existing Copilot/ChatGPT support. Atlas provides a more comprehensive end-to-end AI security program beyond just prompt monitoring. In general, Atlas is more focused on in-house AI rather than third-party web services. For these in-house services, Atlas can both monitor and protect prompts via an AI Gateway, intercepting prompts and responses to enforce guardrails to redact sensitive information and block malicious prompts.

**Q: What is Atlas's key differentiator?**
A: No other technology combines each function of the AI security lifecycle, and no other technology will have as good a connection into the underlying data thanks to the Varonis portfolio. Many organizations look at multiple technologies to fulfill their requirements — Atlas delivers a single, integrated platform.

**Q: Will Atlas use the Varonis classification engine or its own?**
A: Work is underway to integrate Varonis classification with Atlas. Currently Atlas leverages its own classification engine.

---

## Competition

### Competitive Landscape

| Vendor | Platform Type | Primary Focus | Deployment | Market Position | Key Differentiator |
|--------|--------------|---------------|------------|----------------|-------------------|
| Varonis Atlas | AI TRiSM | Full AI lifecycle security & GRC | Cloud, SaaS | Emerging Leader | Out-of-box TRiSM with automated inventory & compliance |
| Portal26 | AI TRiSM | GenAI adoption management | Cloud, SaaS | Established | Shadow AI detection with NIST FIPS certified vault |
| Robust Intelligence (Cisco) | AI Security | AI validation & protection | Cloud, On-prem | Enterprise Leader | Acquired by Cisco Oct 2024 — AI Firewall + Validation |
| CalypsoAI | AI TRiSM | Inference layer security | Cloud, On-prem | Innovation Winner | RSAC 2025 Sandbox winner — Inference Perimeter |
| Lakera Guard | AI Security | LLM application security | API, Cloud | Developer-First | Real-time prompt injection protection |
| Protect AI Guardian | AI Security | ML model security | Cloud, On-prem | Open-Source Leader | 35+ model formats scanning — ModelScan based |
| HiddenLayer | AI Security | MLOps pipeline security | Cloud, SaaS | Comprehensive | End-to-end MLOps with AI Detection & Response |
| Wiz AI-SPM | AISPM | Cloud AI asset discovery | Agentless Cloud | CNAPP Leader | AI-BOM with graph correlation to data paths |
| CrowdStrike Falcon | AISPM | AI asset & identity context | Cloud, SaaS | Enterprise | Integrated with identity and data security modules |
| Orca Security | AISPM | Cloud AI posture management | Agentless Cloud | Established | Side Scanning technology — 50+ AI models coverage |
| SentinelOne | AISPM + DSPM | End-to-end AI security | Cloud, SaaS | Platform Leader | Feb 2026 expansion with DSPM for AI capabilities; acquired Prompt Security |
| Tenable Cloud | AISPM | AI exposure management | Cloud, SaaS | Risk-Focused | AI-SPM integrated with exposure workflows |
| Relyance AI | AISPM | AI governance & posture | Cloud, SaaS | Compliance-First | Model Cards, SBOMs, continuous posture scoring |
| Normalyze | DSPM + AI | Data security for LLMs | Cloud, SaaS | Data-Centric | Real-time sensitivity analysis for LLM data flows |
| Cyera | DSPM | Data security posture | Cloud, SaaS | Data Leader | AI-enhanced data discovery and classification |

**Q: Who are your main competitors?**
A: The top competitors are the AI solutions offered by the bigger vendors:
- Palo Alto / ProtectAI
- Cisco Security for AI
- Microsoft Agent365 — new offering, but will be pushed heavily by Microsoft with new E7 licenses

**Q: Do I need AI SPM if I already have a CSPM tool like Wiz?**
A: Wiz offers some AI discovery and AI SPM as a logical extension to their cloud security platform, but it is only a small portion of the overall lifecycle protection that Atlas provides. Atlas does much more: inventory goes beyond cloud to scan codebases, it does runtime protection and detection, automates compliance, and manages third-party risk. Atlas is purpose-built for AI security; Wiz's AI capabilities are a feature addition to a CSPM product.

---

## IBM

**Q: What is the relationship with IBM?**
A: AllTrue had an OEM relationship with IBM, where IBM could resell AllTrue. Varonis will honor the existing agreement while it is in effect. IBM has already substantially wound down sales efforts in this area.

**Q: Does Atlas integrate with other IBM products?**
A: Yes, Atlas can integrate with WatsonX.

---

## General

**Q: Are there customer success stories or testimonials available for Atlas?**
A: Nothing is authorized for external sharing at this time. For the latest customer narratives, reach out to Chris Brown or Jonathan Kofman, or watch for updates from the Varonis marketing team.

**Q: Does Atlas support Microsoft Fabric?**
A: Fabric's native Copilot is a black box from a security standpoint, but customers can regain control by deploying custom Copilot agents integrated with Atlas guardrails to enforce real-time data protection.

**Q: Does Atlas support Claude?**
A: Yes — Atlas offers comprehensive coverage for its flagship models by incorporating LLM Endpoints (API keys). This enables penetration testing, implementation of guardrails, inclusion of resources in inventory, and integration with the AI Usage module to monitor end user activity.
