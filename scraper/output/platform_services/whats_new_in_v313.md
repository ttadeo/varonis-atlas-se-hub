---
title: What's New in V3.1.3
url: https://playground.alltrue-be.com/_docs/docs/platform_services/313
section: platform_services
---

# What's New in V3.1.3

- [](/_docs/)- Release Notes- What's New in V3.1.3On this page# What's New in V3.1.3
Release Date: Jan 30, 2026

### Multiple Data Planes[​](#multiple-data-planes)
Added support for multiple data plane installations to optimize runtime request handling by region and meet data residency requirements. Each data plane operates with its own proxy and OpenSearch instance. Officially supported regions now include eu-central-1, us-east-1, and us-west-2, with additional regions available upon request.

### Data Plane Status and Management[​](#data-plane-status-and-management)
Introduced two new Admin Console pages:

- Status: View health and operational metrics for each installed data plane.
- Management: Register additional data planes, designate the control plane DEK holder, configure the OpenSearch logs sink, and select the data plane used for runtime-routed LLM pentests.

### PII Guardrail - Generic Tokenization and Allow Lists[​](#pii-guardrail---generic-tokenization-and-allow-lists)
Expanded the PII guardrail with allow lists for automatically released fragments and generic tokenization, replacing detected values with typed counters (e.g., Name1, Name2) instead of synthetic substitutions.

### Compliance Policy Builder Redesign[​](#compliance-policy-builder-redesign)
Policy builder workflows within the Compliance module are now fully managed within the Varonis application, replacing the previous Asana-based process. The redesigned experience improves usability, clarity, and end-to-end policy management.

### Copilot Studio Agents Discovery Improvements[​](#copilot-studio-agents-discovery-improvements)
Enhanced Copilot Studio discovery to include additional resource types such as tools and MCPs, along with discovery of managed identities and improved mapping between agents and users.

### AI 360 Dashboard Lowest-Rated Projects[​](#ai-360-dashboard-lowest-rated-projects)
Added a new AI360 dashboard widget highlighting the lowest-rated projects across the tenant, enabling faster identification of risk areas and direct drill-down for investigation.

### AI Observability Threat Detection Removed[​](#ai-observability-threat-detection-removed)
Removed the Threat Detection tab from AI Observability. OpenSearch-based alerting has been replaced with native alerting in AI Investigation, including drill-down and investigation capabilities. Native anomaly detection will be introduced in an upcoming release.
[PreviousWhat's New in V3.1.4](/_docs/docs/platform_services/314)[NextWhat's New in V3.1.2](/_docs/docs/platform_services/312)- [Multiple Data Planes](#multiple-data-planes)- [Data Plane Status and Management](#data-plane-status-and-management)- [PII Guardrail - Generic Tokenization and Allow Lists](#pii-guardrail---generic-tokenization-and-allow-lists)- [Compliance Policy Builder Redesign](#compliance-policy-builder-redesign)- [Copilot Studio Agents Discovery Improvements](#copilot-studio-agents-discovery-improvements)- [AI 360 Dashboard Lowest-Rated Projects](#ai-360-dashboard-lowest-rated-projects)- [AI Observability Threat Detection Removed](#ai-observability-threat-detection-removed)
