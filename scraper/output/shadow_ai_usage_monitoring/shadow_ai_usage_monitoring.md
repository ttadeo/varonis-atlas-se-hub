---
title: Shadow AI Usage Monitoring
url: https://prod.alltrue-be.com/_docs/docs/shadow_ai_usage_monitoring/overview
section: shadow_ai_usage_monitoring
---

# Shadow AI Usage Monitoring

- [](/_docs/)- Shadow AI Usage MonitoringExport PDFOn this page# Shadow AI Usage Monitoring
Shadow AI Usage Monitoring helps you identify the use of unmanaged, unapproved, or previously unknown AI services across your organization.

Atlas collects access events from supported network and security platforms, analyzes those events for AI service activity, and shows you which users are accessing which AI services. This helps security, compliance, and vendor risk teams understand where AI is being used, determine whether that usage is approved, and follow up on unauthorized or risky AI services.

Shadow AI Usage Monitoring currently supports:

- [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare)
- [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope)

## What Shadow AI Usage Monitoring does[​](#what-shadow-ai-usage-monitoring-does)
Employees may access AI services directly from a browser, through a corporate network path, or through a security service such as a Zero Trust Network Access or Secure Web Gateway provider. These services often generate network request or access logs that show when a user attempted to reach a specific website, domain, or URL.

Atlas uses those logs to detect AI service usage.

For example, if a user accesses ChatGPT, Claude, Gemini, or another AI service through a supported network path, Atlas can identify that the user accessed that AI service and record the related activity. Atlas then displays the activity in AI Usage, AI Investigation, and AI Inventory, depending on the configured policy for that service.

Shadow AI Usage Monitoring can help you answer questions such as:

- Which AI services are employees using?
- Which users are accessing AI services?
- How frequently are specific AI services being accessed?
- Which AI services are approved, monitored, or unauthorized?
- Are users accessing AI services that should not be used?
- Which newly observed AI services need security, compliance, or vendor review?

## What data Atlas collects[​](#what-data-atlas-collects)
Atlas collects and processes access-level event data from supported sources. The exact fields depend on the source, but events may include information such as:

- User
- AI service or provider
- URL, domain, or network request pattern
- Device
- IP address
- Event type
- Timestamp
- Source integration

Atlas uses this information to identify AI service activity and attribute it to a user when the source provides user identity data.

## What Shadow AI Usage Monitoring does not collect[​](#what-shadow-ai-usage-monitoring-does-not-collect)
Shadow AI Usage Monitoring is based on access events and network request logs. It does not provide prompt, response, file, attachment, tool-call, or in-application action visibility.

For example, Atlas may show that a user accessed ChatGPT at a specific time, but this integration does not show:

- The prompt the user entered
- The response the user received
- Files uploaded or downloaded inside the AI service
- Actions taken inside the AI application
- Tool calls or agent actions performed by the AI service

For prompt and response inspection, use Atlas runtime, gateway, or direct application log ingestion capabilities where supported.

## How it works[​](#how-it-works)
Shadow AI Usage Monitoring follows a common flow across supported integrations.

- You configure a supported source, such as Cloudflare or Netskope.
- Atlas begins receiving or retrieving access events from that source.
- Atlas parses the events and compares URLs, domains, and request patterns against its AI Service catalog.
- Matching events are associated with known or custom AI Services.
- Atlas applies the configured access policy for the AI Service.
- Relevant activity is stored and displayed across Atlas.
- If the AI Service is marked Unauthorized, Atlas creates or updates an Unauthorized AI Usage issue.

Different integrations may use different ingestion methods. Cloudflare uses a push model, where Cloudflare sends events to Atlas. Netskope uses a pull model, where Atlas periodically retrieves events from Netskope.

## AI Service detection[​](#ai-service-detection)
Atlas identifies AI usage by matching access events against the AI Service catalog.

The catalog includes common AI services that Atlas can recognize automatically. You can also define custom AI Services for internal tools, niche AI products, or services that are not included in the default catalog.

A custom AI Service can include:

- Service name
- Description
- Browser URL patterns
- Network request patterns
- Custom access policy

After Atlas identifies activity for an AI Service, that service can appear in AI Usage and AI Inventory, based on its configured policy and observed activity.

## AI Service policies[​](#ai-service-policies)
AI Service policies control how Atlas handles activity for each detected AI service.

You can manage these policies from:

**AI Usage &gt; Policies &gt; AI Services**

Each AI Service can be assigned one of the following policy states.

### Silence[​](#silence)
Use Silence for services that you do not want Atlas to track in AI Usage.

When an AI Service is set to Silence, Atlas does not log matching access activity for that service, does not show the activity in AI Usage, and does not create Unauthorized AI Usage issues.

### Audit[​](#audit)
Use Audit for services that are allowed but should be monitored.

When an AI Service is set to Audit, Atlas records matching activity and displays it in AI Usage, AI Investigation, and related views. Audit does not create Unauthorized AI Usage issues.

### Unauthorized[​](#unauthorized)
Use Unauthorized for services that should not be used.

When an AI Service is set to Unauthorized and a user accesses it, Atlas records the activity and creates or updates an Unauthorized AI Usage issue for that user and AI Service.

## Default posture for new AI Services[​](#default-posture-for-new-ai-services)
Atlas can apply a default posture when a previously unknown or newly active AI Service is first detected.

The default posture determines how Atlas treats newly observed AI services before you configure a service-specific policy. It uses the same policy states described above — **Silence** (ignore low-value services), **Audit** (automatically monitor new AI service usage), or **Unauthorized** (flag newly observed services for follow-up) — depending on your organization's governance model.

You configure the default posture, and override it for any individual AI Service, from **AI Usage &gt; Policies &gt; AI Services**.

## Where Shadow AI usage appears[​](#where-shadow-ai-usage-appears)
After Atlas processes access events, the data appears in several areas of the platform.

### AI Usage Dashboard[​](#ai-usage-dashboard)
The AI Usage dashboard provides a summary of AI activity across the organization. You can view request volume, top AI services, top users, active AI applications, and unauthorized usage trends.

### AI Usage Users[​](#ai-usage-users)
The Users page shows users who have accessed AI services. For each user, you can see which AI services they used and the related activity count.

### AI Usage Policies[​](#ai-usage-policies)
The Policies page lets you manage the access policy for each AI Service. You can review services with activity, update policy states, configure the default posture, open the AI Service catalog, and add custom AI Services.

### Unauthorized AI Usage Issues[​](#unauthorized-ai-usage-issues)
The Issues page shows unauthorized usage detected by Atlas. An issue is created when a user accesses an AI Service marked Unauthorized.

Issues are grouped by user and AI Service. If the same user continues to access the same Unauthorized AI Service, Atlas updates the existing issue instead of creating duplicate issues.

If the AI Service is later approved, you can resolve the unauthorized usage by changing the service policy away from Unauthorized.

### AI Inventory[​](#ai-inventory)
AI Services identified from monitored access activity can appear in AI Inventory. This gives security, compliance, and vendor risk teams a place to review discovered services as part of the broader AI asset inventory.

### AI Investigation Access Events[​](#ai-investigation-access-events)
Access events appear in:

**AI Investigation &gt; Events &gt; Access Events**

This view shows individual access-level events detected from supported sources. Depending on the source data, events may include the user, source, URL, device, IP address, event type, and timestamp.

## Understanding request counts[​](#understanding-request-counts)
Request counts represent access events or network requests observed by the connected source. They do not necessarily represent prompts.

A single visit to an AI application may generate multiple requests. For example, loading a page, refreshing a session, calling backend APIs, or accessing related domains may all create separate events.

Use request counts as an indicator of activity volume, not as an exact count of prompts or conversations.

## Recommended workflow[​](#recommended-workflow)
A typical Shadow AI Usage Monitoring workflow is:

- Configure a supported integration.
- Confirm that AI access events are flowing into Atlas.
- Review the AI Usage dashboard to understand overall usage.
- Review the Users page to identify active users.
- Review the AI Services policy list and catalog.
- Set approved services to Audit.
- Set services that should not be used to Unauthorized.
- Add custom AI Services for tools that are not already in the catalog.
- Review Unauthorized AI Usage issues.
- Use AI Inventory to route discovered services for security, compliance, or vendor risk review.

## Supported integrations[​](#supported-integrations)
Shadow AI Usage Monitoring currently supports the following integrations:

- [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare)
- [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope)

Each supported integration has its own setup page with configuration steps and source-specific requirements.

## Related[​](#related)

- [Cloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare) — push-based Shadow AI monitoring via Cloudflare Zero Trust Logpush.
- [Netskope](/_docs/docs/shadow_ai_usage_monitoring/netskope) — pull-based Shadow AI monitoring via the Netskope data export iterator.
- [AI Usage](/_docs/docs/applications/ai_usage) — where detected AI service usage, policies, and unauthorized-usage issues are reviewed.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where discovered AI Services appear as inventory resources.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where individual access events are reviewed.
[PreviousSalesforce Agentforce](/_docs/docs/log_sources/salesforce_agentforce)[NextCloudflare](/_docs/docs/shadow_ai_usage_monitoring/cloudflare)- [What Shadow AI Usage Monitoring does](#what-shadow-ai-usage-monitoring-does)- [What data Atlas collects](#what-data-atlas-collects)- [What Shadow AI Usage Monitoring does not collect](#what-shadow-ai-usage-monitoring-does-not-collect)- [How it works](#how-it-works)- [AI Service detection](#ai-service-detection)- [AI Service policies](#ai-service-policies)[Silence](#silence)- [Audit](#audit)- [Unauthorized](#unauthorized)- [Default posture for new AI Services](#default-posture-for-new-ai-services)- [Where Shadow AI usage appears](#where-shadow-ai-usage-appears)[AI Usage Dashboard](#ai-usage-dashboard)- [AI Usage Users](#ai-usage-users)- [AI Usage Policies](#ai-usage-policies)- [Unauthorized AI Usage Issues](#unauthorized-ai-usage-issues)- [AI Inventory](#ai-inventory)- [AI Investigation Access Events](#ai-investigation-access-events)- [Understanding request counts](#understanding-request-counts)- [Recommended workflow](#recommended-workflow)- [Supported integrations](#supported-integrations)- [Related](#related)
