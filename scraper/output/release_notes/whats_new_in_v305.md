---
title: What's New in V3.0.5
url: https://prod.alltrue-be.com/_docs/docs/release_notes/305
section: release_notes
---

# What's New in V3.0.5

- [](/_docs/)- Release Notes- What's New in V3.0.5Export PDFOn this page# What's New in V3.0.5
The major new features in v3.0.5 are:

## Inventory[​](#inventory)
### Discovery Policies[​](#discovery-policies)
Gain greater control over your AI inventory with customizable discovery policies. Choose which resource types to discover and define whether you want to review all discovered items or only new additions. Policies can be applied broadly by category or tailored to specific resource types.

### GitHub Discovery Improvements[​](#github-discovery-improvements)
GitHub integration is now more flexible and scalable. Configure access using either a GitHub App or a Personal Access Token, and choose between targeting a specific repository or enabling discovery across all authorized repositories.

## Security Posture Management (SPM)[​](#security-posture-management-spm)
### Pentest Templates &amp; Evaluation Customization[​](#pentest-templates--evaluation-customization)
The new Templates tab in the PenTests module lets you build and manage reusable pentest configurations. You can also define custom evaluation logic for each scan category—enabling you to tailor test outcomes to your organization’s risk thresholds (e.g., requiring a refusal or a specific keyword in responses).

### Automated Version Control System PR Remediations[​](#automated-version-control-system-pr-remediations)
Streamline remediation workflows by choosing whether to generate a pull request that addresses a single vulnerable resource or all affected resources in the repository. This flexibility helps teams balance precision and coverage when fixing risky AI dependencies.

## AI Runtime Protection[​](#ai-runtime-protection)
### Proxy Configuration[​](#proxy-configuration)
A new “Configure Proxy” button on the AI Runtime Protection Policies page simplifies deployment. Select your LLM provider and the resource or endpoint to secure, and the platform will generate all necessary proxy configuration details.

### Observability SDK[​](#observability-sdk)
The new Observability SDK enables you to enforce AI Runtime Protection guardrails and capture prompt-level logs—without needing to route traffic through a proxy. This lightweight integration offers the same protection and visibility, with support for asynchronous mode to accommodate latency-sensitive environments.

The SDK is available [here](https://github.com/Varonis-Systems/Atlas-alltrue-llm-observability).

## AI Compliance[​](#ai-compliance)
### Compliance Compass[​](#compliance-compass)
The Compliance Compass helps you identify which AI-related regulations and frameworks are applicable to your system. Based on your responses, Varonis will proactively notify you as new or updated regulatory obligations emerge—keeping you ahead of compliance risks.

### Video Evidence Collection[​](#video-evidence-collection)
You can now launch a real-time video session directly from your audit project to collect evidence. Share your screen while discussing specific requirements with the Varonis agent, and the system will automatically transcribe, extract, and attach the relevant content to your audit—saving hours of manual work.
[PreviousWhat's New in V3.0.6](/_docs/docs/release_notes/306)[NextVersions Prior to V3.0.5](/_docs/docs/release_notes/prior)- [Inventory](#inventory)[Discovery Policies](#discovery-policies)- [GitHub Discovery Improvements](#github-discovery-improvements)- [Security Posture Management (SPM)](#security-posture-management-spm)[Pentest Templates &amp; Evaluation Customization](#pentest-templates--evaluation-customization)- [Automated Version Control System PR Remediations](#automated-version-control-system-pr-remediations)- [AI Runtime Protection](#ai-runtime-protection)[Proxy Configuration](#proxy-configuration)- [Observability SDK](#observability-sdk)- [AI Compliance](#ai-compliance)[Compliance Compass](#compliance-compass)- [Video Evidence Collection](#video-evidence-collection)
