---
title: What's New in V3.7.0
url: https://prod.alltrue-be.com/_docs/docs/release_notes/370
section: release_notes
---

# What's New in V3.7.0

- [](/_docs/)- Release Notes- What's New in V3.7.0Export PDFOn this page# What's New in V3.7.0
**Release Date: August 7, 2026**

### Claude Inference Hooks[​](#claude-inference-hooks)
Atlas now supports Claude inference hooks for supported Claude runtime activity. Inference requests can be sent through Atlas runtime controls, providing inline enforcement, additional visibility and policy evaluation for Claude model interactions including Claude Chat, Claude Code, Claude Cowork, and Claude Design.

### Copilot Studio Onboarding Script[​](#copilot-studio-onboarding-script)
Atlas now provides a script to automate Microsoft Copilot Studio onboarding, replacing the previous manual per-environment Power Platform setup.

The script can onboard all environments or selected environments, with each Copilot Studio environment represented separately under Inventory &gt; Configuration &gt; Cloud Accounts.

### Google Gemini App Log Ingestion[​](#google-gemini-app-log-ingestion)
Google Gemini App activity can now be ingested into Atlas. Prompt and response activity from supported enterprise Gemini usage can be represented in AI Investigation, providing visibility into Gemini usage and supporting investigation, audit, and runtime policy workflows.

### Azure Data Plane Log Source Ingestion Parity[​](#azure-data-plane-log-source-ingestion-parity)
Azure-hosted data planes now support log source ingestion capabilities consistent with other supported Atlas data plane deployments. This expands the ability to ingest supported external activity directly through Azure data planes.

**Known Limitations:**

- Existing Azure data plane deployments must rerun the deployment template to enable this functionality.
- As part of the update, the Azure Storage account key must be retrieved and configured in Island Browser integrations.
- Anthropic OpenTelemetry Collector ingestion is not supported on Azure data planes in this release.

### Long Prompt Sampling for Runtime Analysis[​](#long-prompt-sampling-for-runtime-analysis)
Runtime policies can now use optional sampling when evaluating long prompts. Instead of requiring the entire prompt to be processed, Atlas selects representative content from the prompt for policy evaluation, allowing runtime protections to continue operating on long inputs while reducing processing overhead.

### MCP Registries[​](#mcp-registries)
Atlas now supports MCP Registries for centrally publishing and managing approved MCP connections. Registries provide a governed catalog of MCP resources that can be made available for use across supported projects and agent workflows.

### MCP Gateway Dashboard[​](#mcp-gateway-dashboard)
The MCP Gateway Dashboard provides visibility into MCP Gateway activity and usage. The dashboard helps users understand MCP traffic, connected servers, tool activity, and other gateway-related information from a centralized view.

### Agent Resource Review Workflow with Manifest and Insights[​](#agent-resource-review-workflow-with-manifest-and-insights)
Agent resource reviews now incorporate Agent Manifest information and Atlas security insights into the review workflow. Reviewers can evaluate an agent's approved purpose and expected behavior alongside observed configuration, access, and security findings to make a more informed governance decision.

This brings the agent's governance baseline and current security posture together within the same review process.

### MCP Issues on Resource Pages[​](#mcp-issues-on-resource-pages)
MCP-related issues are now displayed directly on applicable resource pages. Users can review security and governance findings in the context of the affected MCP resource without navigating separately to the MCP Issues screen.

### Claude Cowork Plugin for Windows[​](#claude-cowork-plugin-for-windows)
The Atlas Claude Cowork plugin is now supported on Windows. Windows users can deploy the plugin to apply Atlas runtime visibility and policy protections to supported Claude Cowork activity.

### Session Policy Evaluator LLM[​](#session-policy-evaluator-llm)
Session policies can now use a dedicated evaluator LLM for policy analysis. This allows session-level policies to evaluate activity using the configured evaluator model rather than relying solely on the model associated with the underlying AI application.

### AI Investigation Session Names[​](#ai-investigation-session-names)
AI Investigation sessions now include generated session names to make investigation activity easier to identify and navigate. Session names provide a more meaningful representation of the conversation or activity than relying only on session identifiers.

### AI Investigation Event Table Filters[​](#ai-investigation-event-table-filters)
The AI Investigation event table now includes additional filtering capabilities. Investigators can narrow displayed activity using supported event attributes, making it easier to isolate relevant events to a specific actor.

### Red Team Retry Strategy[​](#red-team-retry-strategy)
Red Team assessments now support automated retry of previously failed tests for ongoing regression testing and validation. Failed tests can be saved and rerun automatically, helping identify regressions and verify that previously identified weaknesses remain resolved over time.

### AI Compliance Redesign[​](#ai-compliance-redesign)
AI Compliance has been redesigned end to end. The redesign reduces manual effort, keeps your compliance picture current as your AI footprint changes, and makes it clearer where you stand and what remains.

A new framework is also available: the OWASP AI Testing Guide.

**Limitation:** audits started in the previous AI Compliance UI do not automatically appear in the new one. Upon request, completed audits remain available and in-progress audits can be ported across.

The redesign includes:

- **Redesigned UI Experience** — The experience is rebuilt around five tabs, of which three are new or redesigned: Dashboard, Policies, and Hub.
- **New Policies Tab** — The Policies tab lets you activate each framework at the granular "entity" scope it governs: the whole company, organizations, projects, vendors, models, datasets, or other resources. To guide your choice, the optional Compass questionnaire recommends frameworks that match your scope. Once a framework is active, newly added projects, vendors, models, datasets, and other resources flow into the compliance UI automatically as they join your inventory.
- **Redesigned Dashboard** — Each activated entity carries its own scoping questionnaire, controls, and required documents, as the framework requires. Where necessary, one entity's scoping questionnaire can also establish controls for related entities. Each entity produces its own evidence report once it is Complete.
- **Redesigned Knowledge Hub** — The unified Knowledge Hub is the one-stop portal for managing policy documents across all frameworks. Each document is provided once, scoped to the frameworks and entities it covers, and satisfies every matching required-document slot. Three tabs keep the picture clear: Active tracks what is supplied, Building tracks what is underway in Policy Builder, and Missing tracks what is outstanding.
- **Platform-Drafted Answers** — Answers may now be drafted on your behalf automatically from the Atlas platform itself, complementing the existing automation based on uploaded documents and video interviews. This platform automation is currently available for the HITRUST and OWASP frameworks and is being rolled out to the others.
- **OWASP AI Testing Guide** — The OWASP AI Testing Guide has been added as an activatable framework. It assesses whether in-scope AI systems and resources are tested against the Guide's recommended techniques. These include agentic behavior, embedding manipulation, model and data poisoning, and supply-chain tampering. Platform evidence is collected automatically after scoping and arrives as suggested responses for your review.
[PreviousGraphQL API Reference](/_docs/docs/)[NextWhat's New in V3.6.0](/_docs/docs/release_notes/360)- [Claude Inference Hooks](#claude-inference-hooks)- [Copilot Studio Onboarding Script](#copilot-studio-onboarding-script)- [Google Gemini App Log Ingestion](#google-gemini-app-log-ingestion)- [Azure Data Plane Log Source Ingestion Parity](#azure-data-plane-log-source-ingestion-parity)- [Long Prompt Sampling for Runtime Analysis](#long-prompt-sampling-for-runtime-analysis)- [MCP Registries](#mcp-registries)- [MCP Gateway Dashboard](#mcp-gateway-dashboard)- [Agent Resource Review Workflow with Manifest and Insights](#agent-resource-review-workflow-with-manifest-and-insights)- [MCP Issues on Resource Pages](#mcp-issues-on-resource-pages)- [Claude Cowork Plugin for Windows](#claude-cowork-plugin-for-windows)- [Session Policy Evaluator LLM](#session-policy-evaluator-llm)- [AI Investigation Session Names](#ai-investigation-session-names)- [AI Investigation Event Table Filters](#ai-investigation-event-table-filters)- [Red Team Retry Strategy](#red-team-retry-strategy)- [AI Compliance Redesign](#ai-compliance-redesign)
