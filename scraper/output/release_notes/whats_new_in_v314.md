---
title: What's New in V3.1.4
url: https://prod.alltrue-be.com/_docs/docs/release_notes/314
section: release_notes
---

# What's New in V3.1.4

- [](/_docs/)- Release Notes- What's New in V3.1.4Export PDFOn this page# What's New in V3.1.4
Release Date: February 20, 2026

### Agentic Guardrail – Prevent Tool Poisoning[​](#agentic-guardrail--prevent-tool-poisoning)
Detects and mitigates tool poisoning attempts at runtime by validating tool definitions. When suspicious or tampered tool metadata is identified, the guardrail can block the call, strip poisoned tools (rewrite the invocation to remove them), or alert/log the event for investigation.

### Runtime Budget Management[​](#runtime-budget-management)
Introduces monthly evaluator LLM budget caps for the Runtime. Set a maximum spend for evaluator calls and the system will automatically adjust evaluation sampling rates over time to stay within budget—while preserving coverage as effectively as possible.

### Runtime Evaluator Fallbacks[​](#runtime-evaluator-fallbacks)
Improves evaluator reliability by adding configurable fallback models and retries. If an evaluator model errors, times out, or becomes unavailable, the Runtime can retry and/or fail over to designated fallback evaluators to keep guardrails running consistently.

### Policy Builder Knowledge Agent[​](#policy-builder-knowledge-agent)
Accelerates policy creation by letting you upload existing documentation and policies as inputs. The Knowledge Agent extracts relevant details and auto-populates policy fields in the Policy Builder, reducing manual copy/paste and speeding up onboarding.

### First-class AI Resources[​](#first-class-ai-resources)
Reduces discovery noise by introducing classification logic that marks certain discovered secondary resources as "not-AI" when they are not directly related to AI assets. This helps keep inventory, findings, and workflows focused on what is actually relevant to AI systems.

### AI Investigation Sessions View[​](#ai-investigation-sessions-view)
Added a dedicated Sessions view for investigating interactions in context when a session ID is provided with requests. Connect individual turns into a complete conversation session, making it easier to review timelines, guardrail outcomes, modifications, and escalations end-to-end.

### TPRM Audit Redesign[​](#tprm-audit-redesign)
TPRM Audit workflows are now fully managed within the Varonis application, replacing the previous Asana-based process. The redesigned experience improves usability, clarity, and end-to-end vendor audit management.

### Microsoft Sentinel SIEM Integration[​](#microsoft-sentinel-siem-integration)
Added native integration with **Microsoft Sentinel** to forward security events into your Sentinel workspace for centralized monitoring, correlation, and incident response—so your SOC can triage AI-related threats in the same SIEM workflows as the rest of your security telemetry.
[PreviousWhat's New in V3.1.5](/_docs/docs/release_notes/315)[NextWhat's New in V3.1.3](/_docs/docs/release_notes/313)- [Agentic Guardrail – Prevent Tool Poisoning](#agentic-guardrail--prevent-tool-poisoning)- [Runtime Budget Management](#runtime-budget-management)- [Runtime Evaluator Fallbacks](#runtime-evaluator-fallbacks)- [Policy Builder Knowledge Agent](#policy-builder-knowledge-agent)- [First-class AI Resources](#first-class-ai-resources)- [AI Investigation Sessions View](#ai-investigation-sessions-view)- [TPRM Audit Redesign](#tprm-audit-redesign)- [Microsoft Sentinel SIEM Integration](#microsoft-sentinel-siem-integration)
