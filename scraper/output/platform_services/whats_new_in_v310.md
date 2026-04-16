---
title: What's New in V3.1.0
url: https://playground.alltrue-be.com/_docs/docs/platform_services/310
section: platform_services
---

# What's New in V3.1.0

- [](/_docs/)- Release Notes- What's New in V3.1.0On this page# What's New in V3.1.0
Release Date: Oct 16, 2025

### NextGen Pentests[​](#nextgen-pentests)
Added dynamic pentest categories that generate tailored test cases based on system descriptions or uploaded datasets. Added support for enabling system prompts when testing foundation models and applying active Varonis guardrails during pentests.

### Runtime Architecture[​](#runtime-architecture)
Runtime rule processing now runs in the data plane, ensuring that your data never leaves your environment.

### New Runtime Policies[​](#new-runtime-policies)
Added policies to detect sexual content and match custom regex patterns.

### Runtime Latency Optimization[​](#runtime-latency-optimization)
Added latency-optimized blocking on runtime input actions. Requests are sent to the model immediately, with rule processing performed in parallel and blocking applied before responses are returned.

### SPM Agentic Findings[​](#spm-agentic-findings)
New SPM policies secure agentic systems by detecting tool poisoning issues and automatically generating findings for agentic architectures.

### AI Evaluations[​](#ai-evaluations)
Perform side-by-side evaluations of AI systems using configurable test cases and out-of-the-box evals. Compare results across systems, make adjustments, and iterate.

### AI Datasets[​](#ai-datasets)
Generate and store datasets derived from production data, curated by tags, policy actions, or user metadata. Datasets can be used in pentests, evaluations, or exported for external use.

### Notifications[​](#notifications)
Configure default (customer-wide) notification settings in the Admin Console or user-level customized notifications in your profile. Notifications are sent by email to relevant stakeholders.

### Custom Endpoint Authorization Script[​](#custom-endpoint-authorization-script)
Added support for custom endpoints for pentests and evaluations using a custom authorization script instead of header-based authentication.

### S3 Discovery of AI Models that Trigger Automated Scanning[​](#s3-discovery-of-ai-models-that-trigger-automated-scanning)
Trigger AI Model discovery scans of S3 buckets or folders and automatically scan all discovered models for vulnerabilities.

### Copilot Studio Agent Usage Discovery[​](#copilot-studio-agent-usage-discovery)
Discover Copilot Studio usage via Microsoft Purview integration and add Copilot Studio agents to AI Inventory.

### Multiple Speed Improvements on All Screens[​](#multiple-speed-improvements-on-all-screens)
### User/IP Anomaly Detection in Threat Detectors[​](#userip-anomaly-detection-in-threat-detectors)
### New Scanners Discovering Hidden Layers in Models[​](#new-scanners-discovering-hidden-layers-in-models)
### Known Issues:[​](#known-issues)
OpenSearch Logging Defaults Not Applied Automatically on New Projects:

When a new project is created, the Runtime OpenSearch logging settings on the Observability Configuration page appear as enabled by default in the user interface. However, these settings are not yet committed to the customer plane, meaning OpenSearch logging is not actually active until the settings are explicitly saved. To ensure that logging is properly applied:

- Select your newly created project from the project dropdown.
- Review the OpenSearch logging settings and confirm they are turned on.
- Click Save Changes to store the configuration and activate logging.

Resolution:
This behavior will be corrected in an upcoming release so that OpenSearch logging will automatically default to enabled for all new projects without requiring manual confirmation.
[PreviousWhat's New in V3.1.1](/_docs/docs/platform_services/311)[NextWhat's New in V3.0.14](/_docs/docs/platform_services/3014)- [NextGen Pentests](#nextgen-pentests)- [Runtime Architecture](#runtime-architecture)- [New Runtime Policies](#new-runtime-policies)- [Runtime Latency Optimization](#runtime-latency-optimization)- [SPM Agentic Findings](#spm-agentic-findings)- [AI Evaluations](#ai-evaluations)- [AI Datasets](#ai-datasets)- [Notifications](#notifications)- [Custom Endpoint Authorization Script](#custom-endpoint-authorization-script)- [S3 Discovery of AI Models that Trigger Automated Scanning](#s3-discovery-of-ai-models-that-trigger-automated-scanning)- [Copilot Studio Agent Usage Discovery](#copilot-studio-agent-usage-discovery)- [Multiple Speed Improvements on All Screens](#multiple-speed-improvements-on-all-screens)- [User/IP Anomaly Detection in Threat Detectors](#userip-anomaly-detection-in-threat-detectors)- [New Scanners Discovering Hidden Layers in Models](#new-scanners-discovering-hidden-layers-in-models)- [Known Issues:](#known-issues)
