---
title: Configuring Log Sources
url: https://prod.alltrue-be.com/_docs/docs/log_sources/configuration
section: log_sources
---

# Configuring Log Sources

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Configuring Log SourcesExport PDFOn this page# Configuring Log Sources
This page covers the configuration mechanics that every Log Source shares — adding an integration, how ongoing sync runs, what a backfill does, applying runtime policies to the resource an integration creates, and scoping an integration to a project. Source-specific details (API keys, destinations, supported event types) live on each source's own page; see [Log Sources](/_docs/docs/log_sources/overview) for the list.

Log Sources currently require an **AWS data plane**; Azure data planes are not yet supported (see [Log Sources](/_docs/docs/log_sources/overview)).

## Add a Log Source integration[​](#add-a-log-source-integration)
Open **Admin Console &gt; System Settings &gt; Log Sources** and click **Add New Integration**. The wizard has four steps:

- **Basic Setup** — choose the **Integration Type**, give the integration an **Integration Name**, and use **Assign to Project** to pick the owning project. All three are required.
- **Connection** — pick the **Data Plane** that will receive the activity, and supply any source-specific connection fields. Those fields differ per source type and are documented on each source's page.
- **Create Use Cases** — configure how captured activity is evaluated. This step appears for every integration type; if you do not configure routing, a default use case is created and all of the integration's activity is stored under one resource.
- **Review and Finalize** — confirm the configuration and create the integration. On success, the new integration appears in the Log Sources table.

There is no Test Connection button. The **Jobs** tab on an integration's detail drawer is the verification surface — it lists each ingested batch with its status and timestamps.

## How ongoing sync works[​](#how-ongoing-sync-works)
After creation, the integration syncs in the background. The mechanism depends on the source type, shown as a **PULL** or **PUSH** badge:

- **Pull** sources — Atlas polls the source on a recurring interval and ingests new activity. A live-sync integration exposes its status (active, paused, cancelled, or completed) and can be paused and resumed; pausing preserves the integration's place so a resume continues where it left off.
- **Push** sources — the source writes event files to the secure destination Atlas provisioned on creation, and Atlas ingests them as they arrive.

Either way, activity feeds the same offline-evaluation pipeline. Ingestion is asynchronous, so events typically appear after a short delay rather than instantly.

## Backfill historical activity[​](#backfill-historical-activity)
For pull sources, the **Backfill** tab pulls a window of past activity into the integration. A backfill:

- covers **a bounded, past-only window** (up to 12 months); neither end of the range can be in the future;
- runs against the **existing** integration — it reuses the same stored credential and feeds the same resource, rather than creating a separate integration or resource;
- appears in the Backfill tab's job list, where a running backfill can be cancelled.

## Apply policies to the created resource[​](#apply-policies-to-the-created-resource)
Creating a Log Source integration automatically creates a corresponding **resource** in your [AI Inventory](/_docs/docs/applications/ai_inventory), scoped to the project you assigned. Runtime policies are **not** configured in the Log Sources wizard — they are applied to that resource:

- From the integration's **Resources** tab, use **Configure Policies** to open the resource in AI Inventory; or
- Go to **AI Runtime &gt; Policies** and scope a policy to the resource.

Policies are optional — an integration can run for visibility only. Because Log Sources are evaluated offline, any policy action configured to **BLOCK** or **MODIFY** is surfaced as an **ALERT** rather than intercepting the request in flight.

## Scope a Log Source to a project (data-level security)[​](#scope-a-log-source-to-a-project-data-level-security)
The project you choose in **Assign to Project** scopes the integration per project rather than tenant-wide, and it also controls **who can view** the ingested activity: only members of that project can see it. Use the project assignment to keep each Log Source's activity visible to the right audience.
[PreviousLog Sources](/_docs/docs/log_sources/overview)[NextAnthropic Compliance API](/_docs/docs/log_sources/anthropic_compliance_api)- [Add a Log Source integration](#add-a-log-source-integration)- [How ongoing sync works](#how-ongoing-sync-works)- [Backfill historical activity](#backfill-historical-activity)- [Apply policies to the created resource](#apply-policies-to-the-created-resource)- [Scope a Log Source to a project (data-level security)](#scope-a-log-source-to-a-project-data-level-security)
