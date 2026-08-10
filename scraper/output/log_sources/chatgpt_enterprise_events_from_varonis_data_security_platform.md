---
title: ChatGPT Enterprise events from Varonis Data Security Platform
url: https://prod.alltrue-be.com/_docs/docs/log_sources/chatgpt_enterprise_varonis_dspm
section: log_sources
---

# ChatGPT Enterprise events from Varonis Data Security Platform

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- ChatGPT Enterprise events from Varonis Data Security PlatformExport PDFOn this page# ChatGPT Enterprise events from Varonis Data Security Platform
This Log Source pulls **ChatGPT Enterprise** prompt and response events from a **Varonis Data Security Platform** tenant — via the Varonis **Export API** — into Atlas for offline runtime-policy evaluation, alerting, and a unified investigation view. It is for Varonis Data Security Platform customers who want their ChatGPT Enterprise activity monitored alongside the rest of their AI usage in Atlas.

## Before you begin[​](#before-you-begin)
Collect the following from the Varonis side before adding the integration:

- **Tenant Base URL** — your Varonis Data Security Platform tenant's base URL (for example, `https://&lt;tenant&gt;.varonis.io/...`).
- **API Key** — a Varonis Data Security Platform API key. Generate the key in the Varonis platform with the **AI Prompt auditor** role assigned to it (see [Generate an API key](#generate-an-api-key)).
- **Outbound access from your data plane to the tenant host.** The pull runs from the Data Plane you select, so that data plane needs outbound network access over HTTPS to your Varonis Data Security Platform tenant — the same **Tenant Base URL** you supply above. It is the only host this integration contacts. See [Configuring Log Sources](/_docs/docs/log_sources/configuration) for why the data plane is the originating caller.

This pull-based integration uses the Data Plane selected in the Connection step. An Azure Data Plane can be selected when it is provisioned for the customer (see [Log Sources](/_docs/docs/log_sources/overview)).

## Generate an API key[​](#generate-an-api-key)
Generate the API key in the Varonis platform:

- Go to **Settings &gt; API keys**.
- Select **New API key**.
- Fill in the required fields, assigning the **AI Prompt auditor** role.
- Click **Generate**.
- Copy the generated API key so you can paste it into the **API Key** field when you add the integration.

## Add the integration[​](#add-the-integration)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **ChatGPT Enterprise events from Varonis Data Security Platform** card. Supply the **Tenant Base URL** and **API Key** you collected above.

The rest of the setup — the four-step wizard, assigning the integration to a project, ongoing sync, backfill, and applying policies to the created resource — is the same for every Log Source. See [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## What gets ingested and how it is evaluated[​](#what-gets-ingested-and-how-it-is-evaluated)
The data plane pulls ChatGPT Enterprise **prompt and response events** from your Varonis Data Security Platform tenant on a schedule, and Atlas evaluates them offline against your configured runtime policies. Because the activity is evaluated after the fact, policy actions configured to **BLOCK** or **MODIFY** are surfaced as **ALERTs** — Atlas cannot intercept the request in flight.

Ingested activity appears in [AI Investigation](/_docs/docs/applications/ai_monitor), where it can be reviewed alongside the rest of your AI activity.

## Troubleshooting[​](#troubleshooting)
SymptomWhat it meansWhat to doNo new activity arrives, and the connection to your Varonis Data Security Platform tenant times out or the host cannot be reached.The outbound path from your data plane to the tenant host is blocked or unavailable.Confirm outbound HTTPS access from the data plane to the tenant host is allowed, and restore it if it is blocked. Then wait for the next scheduled poll. If access is confirmed open and activity still does not arrive, contact Atlas support.
If the tenant returns an error instead — for example a `403` — the host was reached and the credential or its permissions are the problem, not network access.

For the shared explanation of why the data plane makes this call, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).
[PreviousCopilot events from Varonis Data Security Platform](/_docs/docs/log_sources/copilot_varonis_dspm)[NextIsland Browser](/_docs/docs/log_sources/island_browser)- [Before you begin](#before-you-begin)- [Generate an API key](#generate-an-api-key)- [Add the integration](#add-the-integration)- [What gets ingested and how it is evaluated](#what-gets-ingested-and-how-it-is-evaluated)- [Troubleshooting](#troubleshooting)
