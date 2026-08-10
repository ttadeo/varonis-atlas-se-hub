---
title: Log Sources
url: https://prod.alltrue-be.com/_docs/docs/log_sources/overview
section: log_sources
---

# Log Sources

- [](/_docs/)- Log SourcesExport PDFOn this page# Log Sources
Log Sources bring AI activity that happens **outside** the Atlas inline gateway into Atlas for offline policy evaluation, alerting, and investigation. Where the AI Runtime gateway sees traffic inline and can act on it in flight, a Log Source receives a copy of prompt and response activity from another platform — an enterprise browser, a vendor-hosted assistant, a coding agent, or a cloud model service — and feeds it through the same policy engine after the fact.

## What Log Sources do[​](#what-log-sources-do)
A Log Source is an external system that streams prompt and response events into Atlas. Once the events arrive, Atlas evaluates them against your configured runtime policies and records them in the central AI Investigation, alongside the rest of your AI activity.

The benefit is coverage and a single pane of glass: AI usage that never passes through the Atlas gateway — Claude usage pulled from Anthropic, Microsoft 365 Copilot or ChatGPT Enterprise activity from the Varonis Data Security Platform, browser-based AI captured by Island Browser, Claude Code and Claude Cowork telemetry, AWS Bedrock model invocations, or Gemini App activity from your Google Workspace tenant's Google Vault — still shows up in your investigation view and can raise policy violations.

## How Log Sources work[​](#how-log-sources-work)
Each Log Source uses one of two sync mechanisms:

- **Pull** — Atlas polls the source on a schedule and ingests new activity.
- **Push** — the source writes event files to a secure destination that Atlas provisions for your tenant.

Whichever mechanism a source uses, the ingested events flow through the **data plane** of your choice, and Atlas applies your configured **AI Runtime policies** to them through the same policy engine that governs inline traffic. Evaluated events are logged to the central [AI Investigation](/_docs/docs/applications/ai_monitor), where each conversation, its events, and any policy violations can be reviewed.

For the mechanics that every Log Source shares — adding an integration, ongoing sync, backfill, applying policies to the created resource, and scoping an integration to a project — see [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## The offline limitation[​](#the-offline-limitation)
Log Sources are evaluated **offline**. Because the activity has already happened by the time Atlas receives it, policy actions configured to **BLOCK** or **MODIFY** cannot intercept the request in flight — they are surfaced as **ALERT** instead. This applies to every Log Source type.

## Current availability and requirements[​](#current-availability-and-requirements)
Log Source support is source-specific. The Connection step can use an AWS or Azure Data Plane when that source's prerequisites are provisioned:

- Generic **pull-based integrations** use the shared Data Plane selector. Their source-specific credentials and prerequisites are described on each source page.
- **Island Browser** is a **push-based integration**. An AWS Data Plane always has its Island destination provisioned; an Azure Data Plane has one only when it was deployed with Island log ingestion enabled, and it cannot be selected before then.
- **Anthropic OTEL Logs** can use a Data Plane that already has an OTEL collector provisioned. Collectors are provisioned on AWS Data Planes only, so an Azure Data Plane cannot be used for this source yet.
- **AWS Bedrock** still requires an AWS account and region with Bedrock invocation logging, but the Atlas Data Plane can be selected separately in the integration wizard.

See each source page for the provider-specific prerequisites.

## Available source types[​](#available-source-types)
Atlas supports the following Log Source types:

- [Anthropic Compliance API](/_docs/docs/log_sources/anthropic_compliance_api) — *pull*. Ingests Claude chat activity from Anthropic's Compliance API.
- [Copilot events from Varonis Data Security Platform](/_docs/docs/log_sources/copilot_varonis_dspm) — *pull*. Ingests Microsoft 365 Copilot prompt and response events from a Varonis Data Security Platform tenant.
- [ChatGPT Enterprise events from Varonis Data Security Platform](/_docs/docs/log_sources/chatgpt_enterprise_varonis_dspm) — *pull*. Ingests ChatGPT Enterprise prompt and response events from a Varonis Data Security Platform tenant.
- [Island Browser](/_docs/docs/log_sources/island_browser) — *push*. Ingests generative-AI activity captured by Island Browser.
- [Anthropic OTEL Logs](/_docs/docs/log_sources/anthropic_otel) — *push*. Ingests OpenTelemetry logs from Anthropic Claude Code and Claude Cowork clients.
- [AWS Bedrock](/_docs/docs/log_sources/aws_bedrock) — *pull*. Ingests AWS Bedrock model-invocation logs from your S3 bucket.
- [Gemini App](/_docs/docs/log_sources/gemini_app) — *pull*. Ingests standalone Gemini App prompt and response activity from your Google Workspace tenant's Google Vault.

## Related[​](#related)

- [Configuring Log Sources](/_docs/docs/log_sources/configuration) — the shared configuration mechanics every source inherits.
- [Data Plane](/_docs/docs/admin_console/data_plane) — the data-plane configuration Log Sources depend on.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where ingested activity is reviewed.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — the AI usage and resources discovered from ingested events.
- [Runtime Logging](/_docs/docs/admin_console/runtime_logging) — what the inline AI Runtime gateway forwards (a complementary, inline path).
[PreviousArtifact Discovery and Posture](/_docs/docs/coding_agent_protection/artifact_discovery_posture)[NextConfiguring Log Sources](/_docs/docs/log_sources/configuration)- [What Log Sources do](#what-log-sources-do)- [How Log Sources work](#how-log-sources-work)- [The offline limitation](#the-offline-limitation)- [Current availability and requirements](#current-availability-and-requirements)- [Available source types](#available-source-types)- [Related](#related)
