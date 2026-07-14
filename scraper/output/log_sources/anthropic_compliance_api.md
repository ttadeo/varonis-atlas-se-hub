---
title: Anthropic Compliance API
url: https://prod.alltrue-be.com/_docs/docs/log_sources/anthropic_compliance_api
section: log_sources
---

# Anthropic Compliance API

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Anthropic Compliance APIExport PDFOn this page# Anthropic Compliance API
The **Anthropic Compliance API** integration is a pull-based Log Source that ingests Claude usage history into Atlas for offline policy evaluation. Atlas polls Anthropic's Compliance API on a schedule, reconstructs the returned chats into sessions, and evaluates them against your configured policies — so Claude activity that happens outside the Atlas gateway still shows up in AI Investigation and can raise policy violations.

This page walks through the integration end to end: what it is and its one important limitation, the prerequisites, how to configure it, how to pull historical activity, how ongoing sync works, what Atlas captures, and where the activity appears once it is flowing.

## Overview[​](#overview)
The Anthropic Compliance API is a *native, pull-based* Log Source. Its purpose, in the words of the integration card, is to "pull prompt and response logs from Anthropic's Compliance API for offline policy evaluation." Unlike the AI Runtime gateway — which sees traffic inline and can block or modify it — this integration receives a copy of activity after the fact by polling Anthropic.

Because evaluation is **offline**, there is one limitation to understand up front: there is no inline interception. Policies still evaluate every chat and raise violations, but policy actions configured to BLOCK or MODIFY cannot stop or alter a request that has already happened — they surface as ALERTs instead. This is the same offline behavior described for other Log Sources; see [Log Sources](/_docs/docs/admin_console/log_sources) for the general model and [Anthropic](/_docs/docs/providers/anthropic) for the other ways Atlas connects to Anthropic.

## Before you begin[​](#before-you-begin)
You need three things before you add the integration:

- **An Anthropic Compliance Access Key.** This key is generated in claude.ai (under **Organization settings &gt; API**), not in Atlas, and only the **Primary Owner of your Anthropic organization** can create one — so coordinate with whoever holds that role. See [Generate the Compliance Access Key](#generate-the-compliance-access-key) below for the steps. You enter the key in a required **API Key** field during setup; Atlas stores it securely and never displays it again.
- **An eligible data plane.** The integration runs against a provisioned data plane. If none is available, the wizard blocks with a "No data plane provisioned for this customer" message. See [Data Plane](/_docs/docs/admin_console/data_plane) for how data planes are set up.
- **A project to assign the integration to.** Log Source integrations are scoped per project, not tenant-wide, so you pick the owning project as part of setup. The project you choose also controls **who can view the ingested data** — visibility is scoped to the project, so only users with access to that project can see the Claude activity Atlas pulls in. Pick the project whose members should be able to see this activity.

### Generate the Compliance Access Key[​](#generate-the-compliance-access-key)
Generate the key in claude.ai before you start setup in Atlas. These steps are performed by the Anthropic organization's **Primary Owner**; for the full reference, see Anthropic's [Get access to the Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api-access).

- **Enable the Compliance API for the parent organization** (one-time). The primary owner enables it in claude.ai. If compliance scopes are not selectable when you create a key, it has not been enabled yet.
- Go to **claude.ai &gt; Organization settings &gt; API** ([claude.ai/admin-settings/api-access](https://claude.ai/admin-settings/api-access)) and open the **Keys** section.
- Click **Create key**, name it, and select the scopes **`read:compliance_org_data`** and **`read:compliance_user_data`** — these cover the organization metadata, users, chats, and messages Atlas reads. Click **Create**.
- Copy the secret. A Compliance Access Key begins with `sk-ant-api01-`, and it is shown only once.

Do **not** use an Admin API key (`sk-ant-admin01-...`, Activity Feed only) or a standard Claude API key (`sk-ant-api03-...`, model calls only) — neither can read chats or org data, and both return `403`.

## Configure the integration[​](#configure-the-integration)
Open **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration**, and select the **Anthropic Compliance API** card. The wizard has the same four steps as other Log Sources:

- **Basic Setup** — choose the **Integration Type** (Anthropic Compliance API), give it an **Integration Name**, and use **Assign to Project** to pick the owning project. The project also scopes who can view the ingested activity (see [Before you begin](#before-you-begin)). All three are required to continue.
- **Connection** — paste your **API Key** and pick the **Data Plane** that will run the integration.
- **Create Use Cases** — for most Log Sources this step configures how captured activity is evaluated. **You can skip it for the Anthropic Compliance API integration** — it does not apply here. Policies for this integration are configured separately (see [Configuring policies](#configuring-policies)).
- **Review and Finalize** — confirm the configuration and create the integration.

When you create the integration, Atlas adds a corresponding resource to your AI Inventory (see [AI Inventory](/_docs/docs/applications/ai_inventory) for working with it). Runtime policies are not set in this wizard — they are configured against that resource on a separate page, covered next in [Configuring policies](#configuring-policies).

## Configuring policies[​](#configuring-policies)
Policies for the Anthropic Compliance API are **not** configured in the Log Sources wizard — they live on the **AI Runtime Policies** page (**AI Runtime &gt; Policies**), the same place you manage policies for the rest of your AI traffic. This is worth calling out, because whoever sets up the log source is not always the person familiar with the Policies page, and it is an easy step to miss.

To apply a policy to the activity this integration ingests:

- Go to **AI Runtime &gt; Policies**.
- Create a new policy or edit an existing one, and **scope it to the resource** the integration created. That resource appears in [AI Inventory](/_docs/docs/applications/ai_inventory) once the integration is saved.
- Set the conditions you want to evaluate and the action to take when they match.

Keep the offline limitation in mind when you choose an action. Because this is an offline log source, there is no inline interception: a policy action set to BLOCK or MODIFY cannot stop or change a request that has already happened — it is recorded as an **ALERT** instead. For how the Policies page works in general, see [AI Runtime](/_docs/docs/applications/ai_gateway).

## Backfill historical activity[​](#backfill-historical-activity)
A new integration starts capturing activity going forward. To pull activity from before you set it up, open the integration and use the **Backfill** tab to **Create Backfill** over a date range.

A backfill window is bounded:

- The range is **past only** — neither the start nor the end date can be in the future.
- The range can be at most **12 months** long.

A backfill runs against the existing integration: it reuses the same API key and feeds the same resource, rather than creating a separate one. The Backfill tab lists the backfill jobs for the integration, and you can cancel a running job from there (Atlas confirms with a "Backfill job cancelled." message).

## Ongoing sync[​](#ongoing-sync)
Once the integration is active, Atlas pulls new Claude activity automatically on a recurring schedule. Sync advances only after a full interval has closed, so activity appears in near-real time rather than instantly.

You control the integration through its status:

- **Active** — Atlas is pulling new activity on the regular interval.
- **Paused** — Atlas stops pulling but keeps the integration's place; resuming continues from where it left off.
- **Cancelled** — the integration is stopped.

A completed state is set by Atlas automatically (for example, when a bounded backfill finishes) and is not something you assign.

## What gets captured[​](#what-gets-captured)
Atlas ingests Claude **chats** only — both the **user messages** and the **assistant messages** in each conversation, covering Claude API and Claude chat activity. Atlas does **not** ingest Anthropic Audit Events or the other event types the Compliance API can expose; only chats are pulled and evaluated.

From each chat, Atlas extracts:

- **The end user** who made the request and **the Claude model** used. Both user prompts and assistant responses are tagged with the provider and model, so you can filter activity by model.
- **Input and output token counts**, captured per message.

When a chat includes attachments, Atlas pulls those as well: files a user uploaded, files Claude generated, and artifacts produced during the conversation.

Activity timestamps reflect when the chat actually happened in Anthropic, not when Atlas ingested it, so historical and backfilled activity lands on its real date.

## Observe activity in Sessions[​](#observe-activity-in-sessions)
Ingested Anthropic Compliance API activity appears under **AI Investigation &gt; Sessions**. Each chat is reconstructed into a full session (conversation) view showing the individual requests, the events within them, and token counts. Configured policies are evaluated against this activity, and any violations are surfaced inline in the session. See [AI Investigation](/_docs/docs/applications/ai_monitor) for how the Sessions view works.

In the example above, the session is attributed to the resource shown as "Atlas-Anthropic-Compliance-API", the request and event counts and token totals are summarized at the top, and the session records one policy violation — an assistant message flagged as "Violation Detected" — demonstrating that policies raise alerting violations on this offline activity even though they do not act on it inline.

## Where activity appears across Atlas[​](#where-activity-appears-across-atlas)
Beyond the Sessions view, the activity this integration ingests rolls up into the standard Atlas surfaces:

- **AI Runtime Dashboard** — runtime metrics, including activity volume and policy violations, alongside the rest of your AI traffic. See [AI Runtime](/_docs/docs/applications/ai_gateway).
- **AI Runtime Issues** — each policy violation creates an issue you can triage. See [AI Runtime](/_docs/docs/applications/ai_gateway#issues).
- **AI Investigation Events** — individual events can be viewed and searched on the Events page. See [AI Investigation](/_docs/docs/applications/ai_monitor#events).
- **AI Usage dashboard** — usage metrics for the integration. The ingested activity appears as a provider (for example, "Anthropic Compliance API Log Source") in **Top AI Activity by Provider**, with per-user and per-application breakdowns, total request counts, and the integration's tracking status. See [AI Usage](/_docs/docs/applications/ai_usage).

[PreviousConfiguring Log Sources](/_docs/docs/log_sources/configuration)[NextCopilot events from Varonis Data Security Platform](/_docs/docs/log_sources/copilot_varonis_dspm)- [Overview](#overview)- [Before you begin](#before-you-begin)[Generate the Compliance Access Key](#generate-the-compliance-access-key)- [Configure the integration](#configure-the-integration)- [Configuring policies](#configuring-policies)- [Backfill historical activity](#backfill-historical-activity)- [Ongoing sync](#ongoing-sync)- [What gets captured](#what-gets-captured)- [Observe activity in Sessions](#observe-activity-in-sessions)- [Where activity appears across Atlas](#where-activity-appears-across-atlas)
