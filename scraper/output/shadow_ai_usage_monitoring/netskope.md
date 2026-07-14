---
title: Netskope
url: https://prod.alltrue-be.com/_docs/docs/shadow_ai_usage_monitoring/netskope
section: shadow_ai_usage_monitoring
---

# Netskope

- [](/_docs/)- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview)- NetskopeExport PDFOn this page# Netskope
The Netskope integration helps you detect Shadow AI usage from Netskope activity events.

When users access AI services through a network path monitored by Netskope, Atlas retrieves Netskope events, analyzes them for AI service activity, matches them against the AI Service catalog, and surfaces the results across AI Usage, AI Inventory, AI Investigation, and Unauthorized AI Usage issues.

Use this integration to understand which AI services are being accessed through Netskope, who is using them, and whether that usage aligns with your organization's AI governance policy.

## What this integration does[​](#what-this-integration-does)
The Netskope integration collects access activity from your Netskope tenant and uses that activity to identify AI service usage.

Atlas uses Netskope events to:

- Identify access to known AI services.
- Detect usage of custom AI services you define in Atlas.
- Show AI usage by user and service in AI Usage.
- Create or update AI Service resources in AI Inventory.
- Associate observed activity with the relevant AI Service resource.
- Show individual access events in AI Investigation.
- Create or update Unauthorized AI Usage issues when a user accesses an AI service marked Unauthorized.

For example, if a user accesses ChatGPT, Claude, Gemini, or another AI service through a Netskope-monitored path, Atlas can identify the AI service from Netskope activity and show that activity in Atlas.

## Ingestion model[​](#ingestion-model)
Netskope uses a pull model.

Unlike [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare), which pushes events to Atlas, the Netskope integration requires you to configure connection details in Atlas. After the integration is configured, Atlas periodically connects to Netskope, retrieves events using the Netskope API, processes the events, and stores relevant AI service activity according to your AI Service policies.

## What Atlas can and cannot see[​](#what-atlas-can-and-cannot-see)
This integration is based on Netskope access and activity events. It can identify that a user accessed an AI service, but it does not inspect the content of the AI interaction.

Atlas may show information such as:

- User
- AI service
- URL or domain
- Device
- IP address
- Event type
- Timestamp
- Source

Atlas does not collect prompts, responses, uploaded files, downloaded files, in-application actions, tool calls, or agent actions through this integration.

For prompt and response inspection, use Atlas runtime, gateway, or direct application log ingestion capabilities where supported.

## Before you begin[​](#before-you-begin)
Before configuring Netskope in Atlas, make sure you have:

- A Netskope tenant.
- A Netskope REST API token with read permission for the required event export endpoints.
- A Netskope data export iterator.
- The iterator name.
- Your Netskope tenant base URL.
- Permission to configure integrations in Atlas.

## Netskope tenant base URL[​](#netskope-tenant-base-url)
The tenant base URL is the Netskope custom domain used to access your Netskope tenant.

Enter only the Netskope tenant domain. Do not include `https://`.

Examples:

- `acme.goskope.com`
- `acme.eu.goskope.com`

Do not enter only the tenant name, and do not enter the full URL with protocol. For example:

- Correct: `acme.goskope.com`
- Incorrect: `acme`
- Incorrect: `https://acme.goskope.com`

## Netskope token requirements[​](#netskope-token-requirements)
Atlas requires a Netskope token that can read the event data used by the integration.

The token must have read permission, or the equivalent permission in your Netskope RBAC model, for the Netskope data export event endpoints used by the iterator.

In newer Netskope RBAC models, you may not create API tokens with scopes directly. Instead, you may need to create a role with the required read permissions and assign an administrator to that role. Use your organization's Netskope administration process to create a token that has read access to the required event export APIs.

Atlas expects read access only. Atlas does not require permission to create or modify the iterator if you create the iterator yourself before configuring the integration.

## Create a Netskope iterator[​](#create-a-netskope-iterator)
Before configuring Atlas, create a Netskope data export iterator.

Follow the Netskope REST API v2 documentation for data export iterator endpoints.

At a high level, the process is:

- Create or identify a Netskope REST API token with the required read permissions.
- Create an iterator in Netskope.
- Record the iterator name.
- Test that the iterator returns events.

To create the iterator, call:

```
POST /api/v2/events/dataexport/iterator/{name}

```
Replace `{name}` with the iterator name you want to use.

To test the iterator, call:

```
GET /api/v2/events/dataexport/iterator/{name}/events?operation=next

```
If the test call returns Netskope events, the iterator is ready to use in Atlas.

## Configure Netskope in Atlas[​](#configure-netskope-in-atlas)
After you create and test the Netskope iterator, configure the integration in Atlas.

- In Atlas, open the integrations area.
- Select **Netskope**.
- Enter a **Display Name** for the integration.
- Enter the **Tenant Base URL**. Use the Netskope tenant domain only, such as `acme.goskope.com` or `acme.eu.goskope.com`. Do not include `https://`.
- Enter the **Iterator Name** you created in Netskope.
- Enter the **Netskope Token**.
- Submit the integration.

After the integration is saved, Atlas begins pulling Netskope events on the next sync cycle.

## How Atlas processes Netskope events[​](#how-atlas-processes-netskope-events)
After the integration is configured, Atlas performs the following process:

- Atlas connects to Netskope using the tenant base URL, token, and iterator name.
- Atlas retrieves new Netskope events from the iterator.
- Atlas converts and normalizes the event data.
- Atlas matches URLs, domains, and network patterns against the AI Service catalog.
- Atlas applies the configured AI Service policy.
- Atlas stores relevant activity as standard AI Usage data.
- Atlas creates or updates Inventory resources and Unauthorized AI Usage issues when applicable.

## Inventory resources and project assignment[​](#inventory-resources-and-project-assignment)
When Atlas identifies AI service activity from Netskope events, Atlas creates or updates an **AI Service** resource in **AI Inventory** for the detected service.

Atlas creates one AI Service resource for each detected AI service, not one resource per request or per user. For example, if multiple users access the same AI service through Netskope, Atlas associates that activity with the same AI Service resource.

The access events and usage activity detected for that service are associated with the corresponding AI Service resource. This lets you review the service in Inventory and understand the related usage observed from Netskope logs.

Discovered AI Service resources and their related activity are automatically assigned to the **AI for Productivity** project. AI for Productivity is a default project that Atlas creates for each tenant to organize general employee use of external AI services.

You can use this default project to review newly discovered AI services, determine whether they are approved for use, and route services for security, compliance, or vendor risk review.

## After logs start syncing[​](#after-logs-start-syncing)
After Atlas begins retrieving Netskope events, matching AI service activity appears in the following areas:

**AI Usage &gt; Dashboard**
View overall AI activity, top AI services, top users, and usage trends.

**AI Usage &gt; Users**
See which users are accessing AI services and how much activity is associated with each user.

**AI Usage &gt; Policies &gt; AI Services**
Review AI services with activity, set service policy, configure the default posture for newly detected services, and manage the AI Service catalog.

**AI Usage &gt; Issues**
Review Unauthorized AI Usage issues created when a user accesses an AI service marked Unauthorized.

**AI Inventory**
Review AI Service resources created from observed Netskope activity.

**AI Investigation &gt; Events &gt; Access Events**
Review individual access events detected from Netskope logs.

## Source label in Access Events[​](#source-label-in-access-events)
Netskope events appear in **AI Investigation &gt; Events &gt; Access Events** with the Source column shown as **ZTNA**.

[Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare) and Netskope events share the same **ZTNA** source label. If you use both integrations, distinguish events using other available fields, such as URL, user, device, IP address, user agent, or request pattern.

## AI Service policy behavior[​](#ai-service-policy-behavior)
Netskope events are evaluated against the AI Service policy configured in Atlas.

**Silence** means Atlas does not log matching activity for that AI service.

**Audit** means Atlas records matching activity and shows it in AI Usage and AI Investigation.

**Unauthorized** means Atlas records matching activity and creates or updates an Unauthorized AI Usage issue for the user and AI service.

This integration does not automatically change Netskope policy. If you want Netskope to block a service at the network layer, configure the appropriate policy in Netskope.

## Unauthorized AI Usage issues[​](#unauthorized-ai-usage-issues)
When a user accesses an AI service marked Unauthorized, Atlas creates an Unauthorized AI Usage issue for that user and AI service combination.

If the same user continues accessing the same Unauthorized AI service, Atlas updates the existing issue instead of creating duplicate issues.

To resolve Unauthorized AI Usage issues for a service, update the service policy in **AI Usage &gt; Policies &gt; AI Services**. For example, if the service is approved for use, change the policy from Unauthorized to Audit.

## Custom AI Services[​](#custom-ai-services)
If Atlas does not already recognize a service you want to monitor, add a custom AI Service from the AI Service catalog.

A custom AI Service can include browser URL patterns and network request patterns. Atlas uses those patterns to identify matching Netskope events.

Use custom AI Services for internal AI tools, niche AI products, or new AI services that are not yet included in the default catalog.

## Validate the integration[​](#validate-the-integration)
After configuration, validate that Atlas is pulling and processing Netskope events.

- Confirm that the Netskope iterator returns events when tested directly in Netskope.
- Confirm that the same iterator name is configured in Atlas.
- Confirm that the Netskope token configured in Atlas has read access to the required event export APIs.
- Confirm that the tenant base URL is entered as the Netskope domain only, without `https://`.
- Access a known AI service through a Netskope-monitored path.
- Wait for Atlas to complete the next sync and processing cycle.
- In Atlas, open **AI Investigation &gt; Events &gt; Access Events**.
- Confirm that a matching event appears with Source set to **ZTNA**.
- Open **AI Usage &gt; Dashboard** and confirm that AI usage activity is reflected.
- Open **AI Usage &gt; Policies &gt; AI Services** and confirm that the service appears with activity.

## Troubleshooting[​](#troubleshooting)
If Netskope activity does not appear in Atlas, check the following:

- Confirm that the integration is enabled in Atlas.
- Confirm that the tenant base URL is correct and does not include `https://`.
- Confirm that the Netskope token is valid.
- Confirm that the token has read permission, or the equivalent RBAC permission, for the required event export endpoints.
- Confirm that the iterator exists in Netskope.
- Confirm that the iterator name in Atlas exactly matches the iterator name in Netskope.
- Confirm that the iterator returns events when tested directly.
- Confirm that users are accessing AI services through a Netskope-monitored path.
- Confirm that the selected time range in Atlas includes the test activity.
- Confirm that the AI Service is not set to Silence, which prevents matching activity from being logged.
- Allow time for Netskope to generate events and for Atlas to retrieve and process them.

## Operational notes[​](#operational-notes)

- Request counts represent Netskope events, not prompts or conversations.
- A single visit to an AI service may generate multiple events.
- User attribution depends on the identity information included in the Netskope event.
- Detection depends on the Netskope events available to Atlas and the AI Service patterns configured in Atlas.
- Netskope configuration requires both setup in Netskope and setup in Atlas.

## Related[​](#related)

- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview) — how Atlas detects unmanaged AI service usage, and the shared AI Service policy model.
- [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare) — the push-based Shadow AI monitoring integration.
- [AI Usage](/_docs/docs/applications/ai_usage) — where detected AI service usage and policies are reviewed.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where discovered AI Services appear as inventory resources.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where individual access events are reviewed.
[PreviousCloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare)[NextLiteLLM Proxy Integration](/_docs/docs/integration_examples/litellm)- [What this integration does](#what-this-integration-does)- [Ingestion model](#ingestion-model)- [What Atlas can and cannot see](#what-atlas-can-and-cannot-see)- [Before you begin](#before-you-begin)- [Netskope tenant base URL](#netskope-tenant-base-url)- [Netskope token requirements](#netskope-token-requirements)- [Create a Netskope iterator](#create-a-netskope-iterator)- [Configure Netskope in Atlas](#configure-netskope-in-atlas)- [How Atlas processes Netskope events](#how-atlas-processes-netskope-events)- [Inventory resources and project assignment](#inventory-resources-and-project-assignment)- [After logs start syncing](#after-logs-start-syncing)- [Source label in Access Events](#source-label-in-access-events)- [AI Service policy behavior](#ai-service-policy-behavior)- [Unauthorized AI Usage issues](#unauthorized-ai-usage-issues)- [Custom AI Services](#custom-ai-services)- [Validate the integration](#validate-the-integration)- [Troubleshooting](#troubleshooting)- [Operational notes](#operational-notes)- [Related](#related)
