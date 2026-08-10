---
title: Palo Alto Prisma
url: https://prod.alltrue-be.com/_docs/docs/shadow_ai_usage_monitoring/prisma
section: shadow_ai_usage_monitoring
---

# Palo Alto Prisma

- [](/_docs/)- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview)- Palo Alto PrismaExport PDFOn this page# Palo Alto Prisma
The Palo Alto Prisma integration helps you detect Shadow AI usage from Palo Alto firewall URL activity.

When users access AI services through a Palo Alto firewall, PAN-OS URL filtering records the access, and Strata Logging Service (Cortex Data Lake) forwards those logs to Atlas through an Amazon S3 destination. Atlas analyzes those events, matches them against the AI Service catalog, attributes the activity to users when user identity is available, and surfaces the activity across AI Usage, AI Inventory, AI Investigation, and Unauthorized AI Usage issues.

Use this integration to understand which AI services are being accessed through your Palo Alto firewalls, who is using them, and whether that usage aligns with your organization's AI governance policy.

## What this integration does[​](#what-this-integration-does)
The Prisma integration receives firewall URL logs that Strata Logging Service forwards to an Amazon S3 destination provided by Atlas.

Atlas uses those events to:

- Identify access to known AI services.
- Detect usage of custom AI services you define in Atlas.
- Show AI usage by user and service in AI Usage.
- Add discovered AI services to AI Inventory.
- Show individual access events in AI Investigation.
- Create or update Unauthorized AI Usage issues when a user accesses an AI service marked Unauthorized.

For example, if a user accesses ChatGPT, Claude, Gemini, or another AI service through a Palo Alto firewall, Atlas can identify the AI service from the URL log and show that activity in Atlas.

## Ingestion model[​](#ingestion-model)
Prisma uses a push-to-storage model based on Amazon S3.

You configure Strata Logging Service to forward firewall URL logs to an Amazon S3 destination that Atlas provides. Strata Logging Service writes the log objects to that location using a cross-account IAM role. Atlas reads the objects on a schedule, processes them asynchronously, and stores relevant AI service activity based on your AI Service policies.

There is no Prisma setup form in the Atlas UI. In Atlas, you only need to generate the listener API key. Atlas provides the S3 destination details, and you configure the forwarding in Strata Logging Service.

## What Atlas can and cannot see[​](#what-atlas-can-and-cannot-see)
This integration is based on Palo Alto firewall URL logs. It can identify that a user accessed an AI service, but it does not inspect the content of the AI interaction.

Atlas may show information such as:

- User
- AI service
- URL or domain
- IP address
- Event type
- Timestamp
- Source

Atlas does not collect prompts, responses, uploaded files, downloaded files, in-application actions, tool calls, or agent actions through this integration.

For prompt and response inspection, use Atlas runtime, gateway, or direct application log ingestion capabilities where supported.

## Before you begin[​](#before-you-begin)
Before configuring the integration, make sure you have:

- A Palo Alto deployment that sends URL filtering logs to Strata Logging Service (Cortex Data Lake).
- Permission to configure log forwarding to an external Amazon S3 destination in Strata Logging Service.
- A Prisma Listener API key generated from the Atlas Admin Console.
- The S3 destination details provided by Atlas: bucket, region, prefix, role ARN, and external ID.

## Step 1: Generate the Prisma Listener API key[​](#step-1-generate-the-prisma-listener-api-key)

- In Atlas, open the **Admin Console**.
- Go to **API Keys**.
- Select **Add API Key**.
- Give the key a meaningful name.
- Set **Type** to **Prisma Listener**.
- Submit, and note the key value. This key value forms part of your S3 destination prefix.

## Step 2: Obtain your S3 destination details[​](#step-2-obtain-your-s3-destination-details)
Atlas provides the destination Strata Logging Service will write to:

- **Bucket** — the Amazon S3 bucket, provided by Atlas.
- **Region** — the bucket region, provided by Atlas.
- **Prefix** — `api-key/&lt;your-prisma-api-key&gt;/data-source/Prisma/signature/panw/format/prisma/`
- **Role ARN** — the cross-account IAM role Strata Logging Service assumes to write to the bucket, provided by Atlas.
- **External ID** — the external ID required to assume that role, provided by Atlas.

The prefix is derived from the Prisma Listener API key you generated in Step 1, so you can construct it yourself once the key exists.

The bucket, region, role ARN, and external ID are not self-service values and are not shown in the Atlas UI. The bucket is an Atlas-managed log destination shared across tenants, and the cross-account role is provisioned per tenant. Request these four values from your Varonis representative or Varonis Support before you begin Step 3.

## Step 3: Configure S3 log forwarding in Strata Logging Service[​](#step-3-configure-s3-log-forwarding-in-strata-logging-service)

- In Strata Logging Service, open the log forwarding configuration for an external Amazon S3 destination.
- Add an Amazon S3 destination.
- Enter the **Bucket**, **Region**, and **Prefix** provided by Atlas.
- Configure cross-account access using the **Role ARN** and **External ID** provided by Atlas. Strata Logging Service assumes this role to write objects into the bucket prefix.
- Select the firewall **URL** log type. Atlas processes PAN-OS URL filtering records — `THREAT` logs carrying the `url` subtype — and ignores every other subtype.
- Save and enable the forwarding profile.

Strata Logging Service writes URL log objects to the prefix. Atlas reads them on a schedule and processes them asynchronously.

## After logs start flowing[​](#after-logs-start-flowing)
After Strata Logging Service begins writing logs, Atlas processes them and identifies AI service activity.

You can review Prisma-detected activity in the following areas:

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
Review individual access events detected from Palo Alto URL logs.

## Inventory resources and project assignment[​](#inventory-resources-and-project-assignment)
When Atlas identifies AI service activity from Prisma logs, Atlas creates or updates an **AI Service** resource in **AI Inventory** for the detected service.

Atlas creates one AI Service resource for each detected AI service, not one resource per request or per user. For example, if multiple users access the same AI service, Atlas associates that activity with the same AI Service resource.

Discovered AI Service resources and their related activity are automatically assigned to the **AI for Productivity** project. AI for Productivity is a default project that Atlas creates for each tenant to organize general employee use of external AI services.

After review, you can manage each service from **AI Usage &gt; Policies &gt; AI Services** by setting its policy to **Silence**, **Audit**, or **Unauthorized**.

## Source label in Access Events[​](#source-label-in-access-events)
Prisma events appear in **AI Investigation &gt; Events &gt; Access Events** with the Source column shown as **Prisma**.

## AI Service policy behavior[​](#ai-service-policy-behavior)
Prisma events are evaluated against the AI Service policy configured in Atlas.

**Silence** means Atlas does not log matching activity for that AI service.

**Audit** means Atlas records matching activity and shows it in AI Usage and AI Investigation.

**Unauthorized** means Atlas records matching activity and creates or updates an Unauthorized AI Usage issue for the user and AI service.

This integration does not automatically change Palo Alto firewall policy. If you want Palo Alto to block a service at the network layer, configure the appropriate policy in Palo Alto.

## Unauthorized AI Usage issues[​](#unauthorized-ai-usage-issues)
When a user accesses an AI service marked Unauthorized, Atlas creates an Unauthorized AI Usage issue for that user and AI service combination.

If the same user continues accessing the same Unauthorized AI service, Atlas updates the existing issue instead of creating duplicate issues.

To resolve Unauthorized AI Usage issues for a service, update the service policy in **AI Usage &gt; Policies &gt; AI Services**. For example, if the service is approved for use, change the policy from Unauthorized to Audit.

## Custom AI Services[​](#custom-ai-services)
If Atlas does not already recognize a service you want to monitor, add a custom AI Service from the AI Service catalog.

A custom AI Service can include browser URL patterns and network request patterns. Atlas uses those patterns to identify matching Prisma URL events.

Use custom AI Services for internal AI tools, niche AI products, or new AI services that are not yet included in the default catalog.

## Validate the integration[​](#validate-the-integration)
After configuration, validate that events are flowing correctly.

- Confirm that the Strata Logging Service S3 forwarding profile is active.
- In **AI Usage &gt; Policies &gt; AI Services**, confirm that the AI service you plan to test is set to **Audit** or **Unauthorized**. A service set to **Silence** is not logged, so the validation steps below will not show activity for it.
- Access a known AI service through a network path covered by the Palo Alto firewall.
- Wait for Strata Logging Service to write the log to S3 and for Atlas to process it.
- In Atlas, open **AI Investigation &gt; Events &gt; Access Events**.
- Confirm that a matching event appears with Source set to **Prisma**.
- Open **AI Usage &gt; Dashboard** and confirm that AI usage activity is reflected.
- Open **AI Usage &gt; Policies &gt; AI Services** and confirm that the service appears with activity.

## Troubleshooting[​](#troubleshooting)
If Prisma activity does not appear in Atlas, check the following:

- Confirm that the Strata Logging Service S3 forwarding profile is active.
- Confirm that the bucket, region, and prefix exactly match the values provided by Atlas.
- Confirm that the cross-account role ARN and external ID are configured correctly, so Strata Logging Service can assume the role and write to the bucket.
- Confirm that the Prisma Listener API key in the prefix matches an active Prisma Listener key in Atlas.
- Confirm that URL filtering logs are enabled and flowing to Strata Logging Service.
- Confirm that the selected time range in Atlas includes the test activity.
- Confirm that the AI Service is not set to Silence, which prevents matching activity from being logged.

## Operational notes[​](#operational-notes)

- Request counts represent firewall URL access events, not prompts or conversations.
- A single visit to an AI service may generate multiple URL events.
- Only firewall URL logs are used. Other log subtypes are ignored.
- User attribution depends on the identity in the Palo Alto log. When the log carries a domain user rather than an email address, Atlas attributes the activity to that user identifier.
- Atlas reads from S3 on a schedule, so there may be a short delay before activity appears.
- Some browser-integrated AI features may not be distinguishable from general web browsing in firewall URL logs.
- Palo Alto and Strata Logging Service configuration is managed in Palo Alto. Atlas reads and analyzes the resulting logs.

## Related[​](#related)

- [Shadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview) — how Atlas detects unmanaged AI service usage, and the shared AI Service policy model.
- [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare) — the push-based Shadow AI monitoring integration for Cloudflare Zero Trust.
- [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope) — the pull-based Shadow AI monitoring integration.
- [AI Usage](/_docs/docs/applications/ai_usage) — where detected AI service usage and policies are reviewed.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where discovered AI Services appear as inventory resources.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where individual access events are reviewed.
[PreviousNetskope](/_docs/docs/shadow_ai_usage_monitoring/netskope)[NextLLM Pentest Execution Workflow Using REST API](/_docs/docs/integration_examples/llm_pentest)- [What this integration does](#what-this-integration-does)- [Ingestion model](#ingestion-model)- [What Atlas can and cannot see](#what-atlas-can-and-cannot-see)- [Before you begin](#before-you-begin)- [Step 1: Generate the Prisma Listener API key](#step-1-generate-the-prisma-listener-api-key)- [Step 2: Obtain your S3 destination details](#step-2-obtain-your-s3-destination-details)- [Step 3: Configure S3 log forwarding in Strata Logging Service](#step-3-configure-s3-log-forwarding-in-strata-logging-service)- [After logs start flowing](#after-logs-start-flowing)- [Inventory resources and project assignment](#inventory-resources-and-project-assignment)- [Source label in Access Events](#source-label-in-access-events)- [AI Service policy behavior](#ai-service-policy-behavior)- [Unauthorized AI Usage issues](#unauthorized-ai-usage-issues)- [Custom AI Services](#custom-ai-services)- [Validate the integration](#validate-the-integration)- [Troubleshooting](#troubleshooting)- [Operational notes](#operational-notes)- [Related](#related)
