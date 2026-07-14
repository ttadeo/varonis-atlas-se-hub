---
title: ChatGPT Enterprise events from Varonis Data Security Platform
url: https://prod.alltrue-be.com/_docs/docs/log_sources/chatgpt_enterprise_varonis_dspm
section: log_sources
---

# ChatGPT Enterprise events from Varonis Data Security Platform

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- ChatGPT Enterprise events from Varonis Data Security PlatformExport PDFOn this page# ChatGPT Enterprise events from Varonis Data Security Platform
This Log Source pulls **ChatGPT Enterprise** prompt and response events from a **Varonis Data Security Platform** tenant — via the Varonis **DAC API** — into Atlas for offline runtime-policy evaluation, alerting, and a unified investigation view. It is for Varonis Data Security Platform customers who want their ChatGPT Enterprise activity monitored alongside the rest of their AI usage in Atlas.

## Before you begin[​](#before-you-begin)
Collect the following from the Varonis side before adding the integration:

- **Tenant DAC URL** — your Varonis Data Security Platform tenant's DAC endpoint (for example, `https://&lt;tenant&gt;.varonis.cloud/...`).
- **API Key** — a Varonis Data Security Platform DAC API key. Generate the key in the Varonis platform with the **PromptReader** role assigned to it.

This Log Source requires an **AWS data plane**; Azure data planes are not yet supported (see [Log Sources](/_docs/docs/log_sources/overview)).

## Add the integration[​](#add-the-integration)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **ChatGPT Enterprise events from Varonis Data Security Platform** card. Supply the **Tenant DAC URL** and **API Key** you collected above.

The rest of the setup — the four-step wizard, assigning the integration to a project, ongoing sync, backfill, and applying policies to the created resource — is the same for every Log Source. See [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## What gets ingested and how it is evaluated[​](#what-gets-ingested-and-how-it-is-evaluated)
Atlas pulls ChatGPT Enterprise **prompt and response events** from your Varonis Data Security Platform tenant on a schedule and evaluates them offline against your configured runtime policies. Because the activity is evaluated after the fact, policy actions configured to **BLOCK** or **MODIFY** are surfaced as **ALERTs** — Atlas cannot intercept the request in flight.

Ingested activity appears in [AI Investigation](/_docs/docs/applications/ai_monitor), where it can be reviewed alongside the rest of your AI activity.
[PreviousCopilot events from Varonis Data Security Platform](/_docs/docs/log_sources/copilot_varonis_dspm)[NextIsland Browser](/_docs/docs/log_sources/island_browser)- [Before you begin](#before-you-begin)- [Add the integration](#add-the-integration)- [What gets ingested and how it is evaluated](#what-gets-ingested-and-how-it-is-evaluated)
