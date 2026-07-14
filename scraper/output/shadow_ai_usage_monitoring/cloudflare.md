---
title: Cloudflare
url: https://prod.alltrue-be.com/_docs/docs/shadow_ai_usage_monitoring/cloudflare
section: shadow_ai_usage_monitoring
---

# Cloudflare

- [](/_docs/)- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview)- CloudflareExport PDFOn this page# Cloudflare
The Cloudflare integration helps you detect Shadow AI usage from Cloudflare Zero Trust access events.

When users access AI services through Cloudflare Gateway, Cloudflare can send HTTP and DNS access events to Atlas using Logpush. Atlas analyzes those events, matches them against the AI Service catalog, attributes the activity to users when user identity is available, and surfaces the activity across AI Usage, AI Inventory, AI Investigation, and Unauthorized AI Usage issues.

Use this integration to understand which AI services are being accessed through Cloudflare, who is using them, and whether that usage aligns with your organization's AI governance policy.

## What this integration does[​](#what-this-integration-does)
The Cloudflare integration receives access events from Cloudflare Zero Trust Gateway HTTP and Gateway DNS Logpush jobs.

Atlas uses those events to:

- Identify access to known AI services.
- Detect usage of custom AI services you define in Atlas.
- Show AI usage by user and service in AI Usage.
- Add discovered AI services to AI Inventory.
- Show individual access events in AI Investigation.
- Create or update Unauthorized AI Usage issues when a user accesses an AI service marked Unauthorized.

For example, if a user accesses ChatGPT, Claude, Gemini, or another AI service through Cloudflare Gateway, Atlas can identify the AI service from the Cloudflare event and show that activity in Atlas.

## Ingestion model[​](#ingestion-model)
Cloudflare uses a push model.

You configure Logpush jobs in Cloudflare Zero Trust, and Cloudflare sends events to an Atlas listener endpoint. Atlas accepts the events, processes them asynchronously, and stores relevant AI service activity based on your AI Service policies.

There is no Cloudflare setup form in the Atlas UI. Configuration is performed in Cloudflare Zero Trust. In Atlas, you only need to generate the listener API key and obtain your tenant API URL.

## What Atlas can and cannot see[​](#what-atlas-can-and-cannot-see)
This integration is based on Cloudflare access events. It can identify that a user accessed an AI service, but it does not inspect the content of the AI interaction.

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
Before configuring the integration, make sure you have:

- A Cloudflare Zero Trust account with Logpush enabled.
- Access to the Gateway HTTP and Gateway DNS datasets.
- Permission to create Logpush jobs in Cloudflare.
- Your Atlas tenant API URL.
- A Datadog Listener or Splunk Listener API key generated from the Atlas Admin Console.

Use the listener type that matches the destination format you plan to configure in Cloudflare. Both Datadog and Splunk formats are supported.

## Choose a destination format[​](#choose-a-destination-format)
Cloudflare Logpush can send events to Atlas using either Datadog format or Splunk format.

Use **Datadog format** if your Cloudflare account is already configured to send Logpush data to Datadog-style destinations.

Use **Splunk format** if your Cloudflare account is already configured to send Logpush data to Splunk HEC-style destinations.

Both options are equally supported. You only need to configure one format.

## Option A: Configure Cloudflare Logpush using Datadog format[​](#option-a-configure-cloudflare-logpush-using-datadog-format)

- 
In Atlas, open the Admin Console.

- 
Generate a **Datadog Listener** API key.

- 
In Cloudflare Zero Trust, go to **Logs &gt; Logpush**.

- 
Select **Create Logpush job**.

- 
Select **Datadog** as the destination.

- 
For the URL endpoint, enter:

`&lt;your-tenant-api-url&gt;/v1/ai-usage/log-push/format/datadog`

- 
In the Datadog API Key field, paste the Datadog Listener API key generated in Atlas.

- 
Set `ddsource` to `cloudflare`.

- 
Leave the other fields blank unless your Cloudflare configuration requires them.

- 
Click **Continue**.

- 
Select the **Gateway HTTP** dataset.

- 
Give the job a meaningful name.

- 
Leave **All logs** selected.

- 
Choose **Select All** for fields.

- 
Submit the Logpush job.

- 
Repeat the same process for the **Gateway DNS** dataset.

Create one Logpush job for Gateway HTTP and one Logpush job for Gateway DNS.

Atlas returns HTTP 202 when it accepts the batch. Accepted batches are processed asynchronously. Gzipped request bodies are supported.

## Option B: Configure Cloudflare Logpush using Splunk format[​](#option-b-configure-cloudflare-logpush-using-splunk-format)

- 
In Atlas, open the Admin Console.

- 
Generate a **Splunk Listener** API key.

- 
In Cloudflare Zero Trust, go to **Logs &gt; Logpush**.

- 
Select **Create Logpush job**.

- 
Select **Splunk** as the destination.

- 
For the URL endpoint, enter:

`&lt;your-tenant-api-url&gt;/services/collector/raw?channel=&lt;any-non-empty-value&gt;`

The `channel` query parameter is required. Splunk HEC commonly uses a GUID, but Atlas accepts any non-empty value.

- 
Set the Authorization header to the Splunk Listener API key generated in Atlas.

- 
Use the raw key value. Do not add a `Bearer` prefix.

- 
Select the **Gateway HTTP** dataset.

- 
Give the job a meaningful name.

- 
Choose **Select All** for fields.

- 
Submit the Logpush job.

- 
Repeat the same process for the **Gateway DNS** dataset.

Create one Logpush job for Gateway HTTP and one Logpush job for Gateway DNS.

## Why both HTTP and DNS datasets are recommended[​](#why-both-http-and-dns-datasets-are-recommended)
Atlas uses Cloudflare access events to identify AI service usage. Gateway HTTP and Gateway DNS events provide different visibility into user activity.

Gateway HTTP events can include request-level details that help Atlas identify specific AI service access.

Gateway DNS events can help identify domain-level activity, including cases where only DNS-level access is available.

Configure both datasets to improve detection coverage.

## After logs start flowing[​](#after-logs-start-flowing)
After Cloudflare begins sending events, Atlas processes the logs and identifies AI service activity.

You can review Cloudflare-detected activity in the following areas:

**AI Usage &gt; Dashboard**
View overall AI activity, top AI services, top users, and usage trends.

**AI Usage &gt; Users**
See which users are accessing AI services and how much activity is associated with each user.

**AI Usage &gt; Policies &gt; AI Services**
Review AI services with activity, set service policy, configure the default posture for newly detected services, and manage the AI Service catalog.

**AI Usage &gt; Issues**
Review Unauthorized AI Usage issues created when a user accesses an AI service marked Unauthorized.

**AI Inventory**
Review AI Service resources discovered from observed access activity.

**AI Investigation &gt; Events &gt; Access Events**
Review individual access events detected from Cloudflare logs.

## Inventory resources and project assignment[​](#inventory-resources-and-project-assignment)
When Atlas identifies AI service activity from Cloudflare events, Atlas creates or updates an **AI Service** resource in **AI Inventory** for the detected service.

Atlas creates one AI Service resource for each detected AI service, not one resource per request or per user. For example, if multiple users access the same AI service through Cloudflare, Atlas associates that activity with the same AI Service resource.

The access events and usage activity detected for that service are associated with the corresponding AI Service resource. This lets you review the service in Inventory and understand the related usage observed from Cloudflare logs.

Discovered AI Service resources and their related activity are automatically assigned to the **AI for Productivity** project. AI for Productivity is a default project that Atlas creates for each tenant to organize general employee use of external AI services.

You can use this default project to review newly discovered AI services, determine whether they are approved for use, and route services for security, compliance, or vendor risk review.

After review, you can manage each service from **AI Usage &gt; Policies &gt; AI Services** by setting its policy to **Silence**, **Audit**, or **Unauthorized**.

## Source label in Access Events[​](#source-label-in-access-events)
Cloudflare events appear in **AI Investigation &gt; Events &gt; Access Events** with the Source column shown as **ZTNA**.

Cloudflare and [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope) events share the same **ZTNA** source label. If you use both integrations, distinguish events using other available fields, such as URL, user, device, IP address, user agent, or request pattern.

## AI Service policy behavior[​](#ai-service-policy-behavior)
Cloudflare events are evaluated against the AI Service policy configured in Atlas.

**Silence** means Atlas does not log matching activity for that AI service.

**Audit** means Atlas records matching activity and shows it in AI Usage and AI Investigation.

**Unauthorized** means Atlas records matching activity and creates or updates an Unauthorized AI Usage issue for the user and AI service.

This integration does not automatically change Cloudflare Gateway policy. If you want Cloudflare to block a service at the network layer, configure the appropriate policy in Cloudflare.

## Unauthorized AI Usage issues[​](#unauthorized-ai-usage-issues)
When a user accesses an AI service marked Unauthorized, Atlas creates an Unauthorized AI Usage issue for that user and AI service combination.

If the same user continues accessing the same Unauthorized AI service, Atlas updates the existing issue instead of creating duplicate issues.

To resolve Unauthorized AI Usage issues for a service, update the service policy in **AI Usage &gt; Policies &gt; AI Services**. For example, if the service is approved for use, change the policy from Unauthorized to Audit.

## Custom AI Services[​](#custom-ai-services)
If Atlas does not already recognize a service you want to monitor, add a custom AI Service from the AI Service catalog.

A custom AI Service can include browser URL patterns and network request patterns. Atlas uses those patterns to identify matching Cloudflare access events.

Use custom AI Services for internal AI tools, niche AI products, or new AI services that are not yet included in the default catalog.

## Validate the integration[​](#validate-the-integration)
After configuration, validate that events are flowing correctly.

- Confirm that both Cloudflare Logpush jobs are active.
- Access a known AI service through a network path covered by Cloudflare Gateway.
- Wait for Cloudflare to send the Logpush event and for Atlas to process it.
- In Atlas, open **AI Investigation &gt; Events &gt; Access Events**.
- Confirm that a matching event appears with Source set to **ZTNA**.
- Open **AI Usage &gt; Dashboard** and confirm that AI usage activity is reflected.
- Open **AI Usage &gt; Policies &gt; AI Services** and confirm that the service appears with activity.

## Troubleshooting[​](#troubleshooting)
If Cloudflare activity does not appear in Atlas, check the following:

- Confirm that the Gateway HTTP Logpush job is active.
- Confirm that the Gateway DNS Logpush job is active.
- Confirm that both jobs are sending to the correct Atlas tenant API URL.
- Confirm that the listener API key is valid.
- Confirm that the listener type matches the selected destination format.
- Confirm that Datadog format uses the Datadog Listener key.
- Confirm that Splunk format uses the Splunk Listener key as the raw Authorization header value with no `Bearer` prefix.
- Confirm that the Splunk URL includes a non-empty `channel` query parameter.
- Confirm that users are accessing AI services through Cloudflare Gateway.
- Confirm that the selected time range in Atlas includes the test activity.
- Confirm that the AI Service is not set to Silence, which prevents matching activity from being logged.

## Operational notes[​](#operational-notes)

- Request counts represent Cloudflare access events, not prompts or conversations.
- A single visit to an AI service may generate multiple HTTP or DNS events.
- User attribution depends on the identity information included in the Cloudflare event.
- Detection depends on the Cloudflare datasets, selected fields, and AI Service patterns available to Atlas.
- Cloudflare configuration is managed in Cloudflare Zero Trust. Atlas receives and analyzes the resulting logs.

## Related[​](#related)

- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview) — how Atlas detects unmanaged AI service usage, and the shared AI Service policy model.
- [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope) — the pull-based Shadow AI monitoring integration.
- [AI Usage](/_docs/docs/applications/ai_usage) — where detected AI service usage and policies are reviewed.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where discovered AI Services appear as inventory resources.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where individual access events are reviewed.
[PreviousShadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview)[NextNetskope](/_docs/docs/shadow_ai_usage_monitoring/netskope)- [What this integration does](#what-this-integration-does)- [Ingestion model](#ingestion-model)- [What Atlas can and cannot see](#what-atlas-can-and-cannot-see)- [Before you begin](#before-you-begin)- [Choose a destination format](#choose-a-destination-format)- [Option A: Configure Cloudflare Logpush using Datadog format](#option-a-configure-cloudflare-logpush-using-datadog-format)- [Option B: Configure Cloudflare Logpush using Splunk format](#option-b-configure-cloudflare-logpush-using-splunk-format)- [Why both HTTP and DNS datasets are recommended](#why-both-http-and-dns-datasets-are-recommended)- [After logs start flowing](#after-logs-start-flowing)- [Inventory resources and project assignment](#inventory-resources-and-project-assignment)- [Source label in Access Events](#source-label-in-access-events)- [AI Service policy behavior](#ai-service-policy-behavior)- [Unauthorized AI Usage issues](#unauthorized-ai-usage-issues)- [Custom AI Services](#custom-ai-services)- [Validate the integration](#validate-the-integration)- [Troubleshooting](#troubleshooting)- [Operational notes](#operational-notes)- [Related](#related)
