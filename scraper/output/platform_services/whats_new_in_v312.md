---
title: What's New in V3.1.2
url: https://playground.alltrue-be.com/_docs/docs/platform_services/312
section: platform_services
---

# What's New in V3.1.2

- [](/_docs/)- Release Notes- What's New in V3.1.2On this page# What's New in V3.1.2
Release Date: Dec 17, 2025

### Compliance UI Redesign[​](#compliance-ui-redesign)
Compliance audits are now fully managed within the Varonis application, retiring the legacy Asana-based workflow. The redesigned experience offers improved navigation, clearer task flows, and a more streamlined end-to-end audit process.

### Code Scanning Improvements[​](#code-scanning-improvements)
Added support for Hugging Face repository discovery, enabling model package detection consistent with prior methods while adding new code-scanning protections for models accessed from Hugging Face. Improved rate-limit handling ensures reliability on large or frequently updated repositories.

### AI Runtime Protection – Grounding Guardrail[​](#ai-runtime-protection--grounding-guardrail)
Introduced a new grounding guardrail that verifies model responses stay aligned with the AI System’s intended purpose and system prompt. Tuned for security, this guardrail is designed to catch clear deviations or successful jailbreaks, serving as a second line of defense rather than a quality-scoring mechanism.

### AI Runtime Protection – Selective Policy Installation[​](#ai-runtime-protection--selective-policy-installation)
Users can now review and install pending policies at a granular level—by organization, project, endpoint, or individual policy—rather than applying all pending policies at once. Inappropriate or irrelevant policies can be rejected.

### AI Runtime Protection – Policy Templates[​](#ai-runtime-protection--policy-templates)
Added predefined policy templates that allow users to enable recommended guardrails with a single click, including templates aligned to OWASP LLM Top 10.

### AI Runtime Protection – Rate and Burst Limiting[​](#ai-runtime-protection--rate-and-burst-limiting)
Added the ability to configure rate and burst limiting on the Data Plane.

### SPM Configuration Checks[​](#spm-configuration-checks)
Expanded SPM with new configuration policies for AWS SageMaker and Bedrock Agents, improving detection of misconfigurations and strengthening security posture across key AI services.

### AI Investigation – Performance Metrics[​](#ai-investigation--performance-metrics)
AI Investigation now includes detailed performance metrics, tracking latency, tokens per request, tokens per completion, and other runtime indicators to help teams understand model efficiency and operational behavior. Configurable alerts will be introduced in an upcoming release.
[PreviousWhat's New in V3.1.3](/_docs/docs/platform_services/313)[NextWhat's New in V3.1.1](/_docs/docs/platform_services/311)- [Compliance UI Redesign](#compliance-ui-redesign)- [Code Scanning Improvements](#code-scanning-improvements)- [AI Runtime Protection – Grounding Guardrail](#ai-runtime-protection--grounding-guardrail)- [AI Runtime Protection – Selective Policy Installation](#ai-runtime-protection--selective-policy-installation)- [AI Runtime Protection – Policy Templates](#ai-runtime-protection--policy-templates)- [AI Runtime Protection – Rate and Burst Limiting](#ai-runtime-protection--rate-and-burst-limiting)- [SPM Configuration Checks](#spm-configuration-checks)- [AI Investigation – Performance Metrics](#ai-investigation--performance-metrics)
