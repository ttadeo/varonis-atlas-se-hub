---
title: Configuring Log Sources
url: https://prod.alltrue-be.com/_docs/docs/log_sources/configuration
section: log_sources
---

# Configuring Log Sources

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Configuring Log SourcesExport PDFOn this page# Configuring Log Sources
This page covers the configuration mechanics that every Log Source shares — adding an integration, how ongoing sync runs, what a backfill does, applying runtime policies to the resource an integration creates, and scoping an integration to a project. Source-specific details (API keys, destinations, supported event types) live on each source's own page; see [Log Sources](/_docs/docs/log_sources/overview) for the list.

The **Data Plane** is selected in the Connection step. Depending on the source, the selector can use an AWS or Azure Data Plane; source-specific prerequisites are documented on each source page. See [Log Sources](/_docs/docs/log_sources/overview) for the availability summary.

## Add a Log Source integration[​](#add-a-log-source-integration)
Open **Admin Console &gt; System Settings &gt; Log Sources** and click **Add New Integration**. The wizard has four steps:

- **Basic Setup** — choose the **Integration Type**, give the integration an **Integration Name**, and use **Assign to Project** to pick the owning project. All three are required.
- **Connection** — pick the **Data Plane** that will receive the activity, and supply any source-specific connection fields. Those fields differ per source type and are documented on each source's page.
- **Create Use Cases** — configure how captured activity is evaluated. This step appears for every integration type; if you do not configure routing, a default use case is created and all of the integration's activity is stored under one resource.
- **Review and Finalize** — confirm the configuration and create the integration. On success, the new integration appears in the Log Sources table.

There is no Test Connection button. The **Jobs** tab on an integration's detail drawer is the verification surface — it lists each ingested batch with its status and timestamps.

## How ongoing sync works[​](#how-ongoing-sync-works)
After creation, the integration syncs in the background. The mechanism depends on the source type, shown as a **PULL** or **PUSH** badge:

- **Pull** sources — your data plane polls the source on a recurring interval and ingests new activity. A live-sync integration exposes its status (active, paused, cancelled, or completed) and can be paused and resumed; pausing preserves the integration's place so a resume continues where it left off.
- **Push** sources — the source writes event files to the secure destination Atlas provisioned on creation, and Atlas ingests them as they arrive.

Either way, activity feeds the same offline-evaluation pipeline. Ingestion is asynchronous, so events typically appear after a short delay rather than instantly.

## Outbound network access for pull sources[​](#outbound-network-access-for-pull-sources)
For a pull-based integration, the outbound call to the source is made by the **Data Plane** you selected in the Connection step — not by Atlas. The data plane polls the source directly, stages what it retrieves for evaluation, and reports its position back to Atlas.

That has one practical consequence for your network configuration: **the data plane needs outbound network access (egress) to the source it is pulling from.** If outbound access to the source is blocked, the integration is created successfully and appears healthy, but no activity arrives.

Each source page lists the endpoints that source needs the data plane to reach. For where a data plane runs and how it is deployed, see [Data Plane](/_docs/docs/admin_console/data_plane) — and if your firewall inspects outbound TLS on an AWS data plane, see the data plane deployment options for the certificate setting.

This applies to pull-based integrations only. Push sources work in the opposite direction: the source writes to a destination Atlas provisions, so no outbound access from the data plane to the source is required.

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

## Troubleshooting[​](#troubleshooting)
SymptomWhat it meansWhat to doA pull integration still shows as active, but no new activity is arriving and **Last Synced at** is stale.The data plane could not reach the source. The sync position only moves forward after a successful read, so it freezes at the last good poll — nothing is marked failed and no error is shown.Confirm the source is reachable from the network the data plane runs in. Check that outbound access to the source's endpoints is permitted, using the endpoints listed on that source's page. Then restore outbound access and wait for the next scheduled poll. If access is confirmed open and activity still does not arrive, contact Atlas support.
Note that a credential accepted in the **Add New Integration** wizard is validated by Atlas, not by the data plane — so a credential that passed validation does not confirm that the selected data plane can reach the source.
[PreviousLog Sources](/_docs/docs/log_sources/overview)[NextAnthropic Compliance API](/_docs/docs/log_sources/anthropic_compliance_api)- [Add a Log Source integration](#add-a-log-source-integration)- [How ongoing sync works](#how-ongoing-sync-works)- [Outbound network access for pull sources](#outbound-network-access-for-pull-sources)- [Backfill historical activity](#backfill-historical-activity)- [Apply policies to the created resource](#apply-policies-to-the-created-resource)- [Scope a Log Source to a project (data-level security)](#scope-a-log-source-to-a-project-data-level-security)- [Troubleshooting](#troubleshooting)
