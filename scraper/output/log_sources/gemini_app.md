---
title: Gemini App
url: https://prod.alltrue-be.com/_docs/docs/log_sources/gemini_app
section: log_sources
---

# Gemini App

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Gemini AppExport PDFOn this page# Gemini App
This Log Source ingests **Gemini App prompts and responses** — from the standalone Gemini assistant at gemini.google.com — from your Google Workspace tenant's Google Vault `GEMINI` corpus into Atlas for offline AI Runtime policy evaluation, alerting, and a unified investigation view. If an interaction is not in Google Vault, Atlas cannot ingest it.

This page covers ingestion behavior — what gets pulled in, how to add the integration, ingestion timing, and how to triage a missing chat. For the Google-side tenant setup (Service Account, Domain-Wide Delegation, Google Vault prerequisites), see [Google Workspace onboarding](/_docs/docs/providers/google_workspace/onboarding).

This pull-based integration uses the Data Plane selected in the Connection step. An Azure Data Plane can be selected when it is provisioned for the customer (see [Log Sources](/_docs/docs/log_sources/overview)).

## Before you start[​](#before-you-start)
A Google Workspace connection must already exist for your Workspace primary domain before you can create any Organizational Unit integration — the service-account key lives on that connection, and every Organizational Unit integration under it shares it. One connection covers one Workspace primary domain; a single Atlas customer can have connections to multiple Workspace tenants.

Complete [Google Workspace onboarding](/_docs/docs/providers/google_workspace/onboarding) first if you haven't already. That page is canonical for the Domain-Wide Delegation scopes, admin privileges, setup script, and key upload — none of it is repeated here.

This is a pull-based integration, so the outbound calls to Google are made by the data plane you select — not by Atlas. That data plane needs outbound HTTPS access to Google Vault (`vault.googleapis.com`), to Google's OAuth token endpoint (`oauth2.googleapis.com`, where the Domain-Wide Delegation credential is minted — this is the `token_uri` in your service-account key), and to Google Cloud Storage (`storage.googleapis.com`, where completed Vault exports are downloaded from). See [Configuring Log Sources](/_docs/docs/log_sources/configuration) for why the data plane is the originating caller.

## What gets ingested[​](#what-gets-ingested)
Atlas reads from the Google Vault `GEMINI` corpus, scoped per Organizational Unit. Only the standalone Gemini App at gemini.google.com is covered — Gemini embedded in Gmail, Docs, or other Workspace surfaces is not in the `GEMINI` corpus and is not ingested.

- **Every conversation turn** — the user's prompt text, the assistant's response text, when it happened, and which user sent it. A turn whose response is missing or truncated is still ingested, prompt-only, and re-asks or regenerations are ingested as distinct events rather than de-duplicated.
- **Each Gemini conversation becomes a single Atlas session.** Every turn of that conversation is grouped together, labeled with the conversation's own topic (or "Gemini App" when a conversation has no topic), and attributed to the Workspace user by email.
- **The model shows as Gemini** in AI Investigation.
- **Each Organizational Unit integration appears as its own resource** in [AI Inventory](/_docs/docs/applications/ai_inventory), and AI Runtime policies attach to that resource.

## Add a Gemini App log source[​](#add-a-gemini-app-log-source)
After completing the Google-side setup, continue in the Atlas wizard at the Organizational Unit picker:

- **Pick one or more Organizational Units to monitor.** Each selected Organizational Unit (OU) becomes its own integration sharing the same Workspace connection. The picker is a flat, path-sorted list indented to convey hierarchy — not an expandable tree. Rows already configured are greyed out and not selectable.
- **Root OU (all users)** appears at the top of the list. Atlas adds this entry because Google's Organizational Unit listing returns child OUs only — the root OU is never in the response. Selecting it monitors every user in the Workspace. (The integration's detail view shows the same OU as "Entire organization" — same object, two labels in different parts of the flow.) A tenant with no child Organizational Units at all yields an empty picker aside from this entry.
- **Overlapping selections are allowed, behind a confirmation.** Selecting an OU that overlaps one you've already configured is permitted, but Atlas warns you first: activity in the overlap is ingested by both integrations, producing duplicate events, and each duplicate consumes Google Vault export capacity you could be spending elsewhere (see below). Pause or delete one of the integrations if you don't want duplicates.
- **Each selected OU becomes its own integration**, with its own display name (defaulted to `&lt;Workspace domain&gt; — &lt;OU path&gt;`, editable, minimum 3 characters).

You can add more Organizational Units to an existing Workspace connection at any time without redoing any Google-side setup — from the connection's **Add OU** action, which re-enters the wizard directly at the Organizational Unit picker. Atlas allows only one integration per (Workspace domain, Organizational Unit) pair; adding a duplicate is rejected until you cancel or delete the existing one.

### How many Organizational Units to monitor[​](#how-many-organizational-units-to-monitor)
Google Vault rate-limits how fast exports can be created, and the limit is **per Google Cloud project**: roughly **two export creations per minute** (Vault allows 20 export write-units per minute per project, and each export creation costs 10 of them). Every Organizational Unit integration creates its own exports on every poll, so monitoring a large number of Organizational Units from a single Google Cloud project can exhaust that budget.

When it's exhausted, Google Vault returns `429 Too Many Requests` and **ingestion is delayed, not lost** — Atlas retries the window on its next cycle, so the conversations still arrive, just later than the usual ~20 minutes.

The quota is fixed to one project per Workspace tenant: Atlas holds a single Google Workspace connection per Workspace primary domain, that connection names one Google Cloud project, and every Organizational Unit integration under it uses that project. So the way to give yourself more room within a tenant is to raise the quota, not to spread the load:

**Request a higher Vault export quota — this is free.** The Google Vault API is included with your Google Workspace subscription at no extra cost, so there is no paid tier to buy. You can request an increase to the *ExportWritesPerMinutePerProject* quota in **Google Cloud Console → IAM &amp; Admin → Quotas &amp; System Limits**, for the project registered on the connection. Approval isn't guaranteed and larger increases take Google longer to review — for occasional spikes, Google recommends relying on automatic retry-with-backoff, which Atlas already does, rather than raising the quota.

(Separate Workspace tenants are unaffected by each other: each has its own connection, its own Google Cloud project, and therefore its own independent export quota.)

Avoiding overlapping Organizational Units helps here too: an overlap has every conversation in it exported twice, spending the same budget for no additional coverage.

**Backfills draw on the same quota.** A [backfill](#backfill-historical-activity) creates Vault exports as well, competing with live polling for the same ~2-per-minute budget. Run one backfill at a time, and avoid starting one while a large number of Organizational Units are actively syncing.

## How ingestion timing works[​](#how-ingestion-timing-works)
The data plane polls every **5 minutes** and deliberately stays **15 minutes** behind the present moment, because Google Vault needs time to index a conversation before it can be exported. In practice, a Gemini App chat is generally investigatable in Atlas within about **20 minutes**; if it still isn't there after **30 minutes**, treat that as unexpected (see [Troubleshooting a missing chat](#troubleshooting-a-missing-chat) below).

Each poll resumes exactly where the previous *successful* poll ended, so nothing between successful polls is skipped. A source that falls behind catches up over successive polls rather than losing the gap. The one exception is a window that can never be produced — see **Ingestion does not stall** below. A newly added Organizational Unit's first poll starts from roughly 30 minutes before the integration was created — it does not reach further back than that; use a backfill for older activity.

**Pause, resume, and cancel.** A paused integration is skipped entirely — no polling happens while it's paused. On resume, polling continues from where it stopped and the gap since is filled rather than skipped, subject to your Google Vault retention. Cancelling stops ingestion permanently for that Organizational Unit.

**Ingestion does not stall.** If Google Vault cannot produce the activity for one polling window, that window is skipped rather than blocking everything after it — later activity is unaffected. A window that fails for a recoverable reason is retried on the next cycle before it is ever skipped.

The trade-off is that a permanently failed window leaves a gap: gap-free ingestion is guaranteed across successful polls, not unconditionally. A gap shows up as activity that is present in Google Vault but absent from Atlas, for one Organizational Unit over a bounded stretch of time, with later activity arriving normally. Recover it with a [backfill](#backfill-historical-activity) over that window — a backfill re-requests the export independently of live polling, so it can succeed where the original window did not, as long as the activity is still inside your Google Vault retention.

In your own Google Vault console, you'll see matters and exports Atlas creates — one Vault matter per Organizational Unit integration, and one export per polling window, with names beginning `atlas-gemini`. These are expected; don't delete them while the integration is active.

This integration's detail view has **Configuration**, **Resources**, and **Backfill** tabs.

## Backfill historical activity[​](#backfill-historical-activity)
To pull in activity from before an integration existed, start a backfill from the **Backfill** tab of an existing Gemini App integration: supply a start of the window, an end of the window, and a name. The Workspace connection and Organizational Unit are inherited from the integration you start it from — you don't pick them again. A backfill runs alongside ongoing ingestion without pausing it, and finishes on its own once it has fully processed its window (a wide window is processed over successive cycles); the ongoing Organizational Unit integration keeps running regardless.

Your Google Vault retention policy is the hard limit on how far back a backfill can reach — activity Google has already purged cannot be recovered by any backfill. A backfill's upper end is still held 15 minutes behind the present, same as live ingestion. Backfilled events are evaluated against your AI Runtime policies exactly like live ones.

For the generic backfill mechanics every Log Source shares, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).

## Offline evaluation and where events appear[​](#offline-evaluation-and-where-events-appear)
Gemini App activity is evaluated **offline**: because the conversation has already happened by the time Atlas receives it, policy actions configured to BLOCK or MODIFY are surfaced as **ALERT** rather than intercepting anything in flight, the same as every Log Source (see [Configuring Log Sources](/_docs/docs/log_sources/configuration) for detail).

Ingested events appear in [AI Investigation](/_docs/docs/applications/ai_monitor), grouped by conversation, and each Organizational Unit integration appears as its own resource in [AI Inventory](/_docs/docs/applications/ai_inventory). Policy violations raise alerts like any other source.

## Troubleshooting a missing chat[​](#troubleshooting-a-missing-chat)
Use this table when a chat happened but doesn't show up in Atlas.

SymptomWhat it meansWhat to doIt's been less than ~20 minutesAtlas deliberately stays 15 minutes behind and polls every 5 minutes.Wait and check again.The chat isn't in Google VaultIn your Google Vault console, run a search against the **Gemini app** service for the same user and time.If Vault doesn't have it, Atlas cannot have it.Gemini conversation history is off for that userWith history turned off — by the user or by an admin policy — Google doesn't save the conversation to the user's Gemini Apps Activity, so it never reaches Vault. Note that a Vault retention rule or legal hold covering the Gemini app takes precedence over the history setting and preserves the conversation anyway.Turn conversation history back on, or put a Vault retention rule or hold in place, for the users you intend to monitor. Conversations from before that change aren't recoverable.The user isn't in a monitored Organizational UnitCompare the integration's Organizational Unit against the user's OU in admin.google.com.Add an Organizational Unit integration if it isn't covered.The integration is pausedPolling has stopped for that Organizational Unit.Resume it — polling continues from where it stopped.The chat predates the integrationAn Organizational Unit's first poll starts about 30 minutes before it was created.Run a backfill for older activity.The chat is older than your Vault retentionGoogle has already purged it.No backfill can reach it.The interaction wasn't the standalone Gemini AppGemini inside Gmail, Docs, or other Workspace surfaces isn't covered by Vault's Gemini app service.Not ingestible from this source.Last synced is stale across every Gemini App integrationThe Workspace connection itself may have a credential or permission problem.Re-run the connection test on the Workspace connection; if it fails, work through [Google Workspace onboarding](/_docs/docs/providers/google_workspace/onboarding).Last synced is stale across every Gemini App integration, and the connection test succeedsThe data plane cannot reach Google's endpoints at all — this looks identical to the row above, so work through both: the connection test passing points at the network path rather than the credential.Confirm the data plane has outbound access to all three Google endpoints listed in [Before you start](#before-you-start) — Vault, `oauth2.googleapis.com`, and Cloud Storage — and restore it if any is blocked. A blocked token endpoint alone stops every poll, because no credential can be minted. Then wait for the next scheduled poll. See [Configuring Log Sources](/_docs/docs/log_sources/configuration) for the shared checks.
If the chat is in Vault, inside a monitored Organizational Unit, and still absent after 30 minutes, contact Atlas support.

## Related[​](#related)

- [Google Workspace onboarding](/_docs/docs/providers/google_workspace/onboarding) — the Google-side prerequisite: Service Account, Domain-Wide Delegation, and Google Vault setup.
- [Google Workspace permission breakdown](/_docs/docs/providers/google_workspace/permission_breakdown) — what each Domain-Wide Delegation scope and admin privilege grants.
- [Configuring Log Sources](/_docs/docs/log_sources/configuration) — shared wizard, project scoping, and policy mechanics.
- [Log Sources](/_docs/docs/log_sources/overview) — the Log Sources overview and data-plane requirement.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where ingested events appear.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where each Organizational Unit integration appears as a resource.
[PreviousSalesforce Agentforce](/_docs/docs/log_sources/salesforce_agentforce)[NextShadow AI Usage Monitoring](/_docs/docs/shadow_ai_usage_monitoring/overview)- [Before you start](#before-you-start)- [What gets ingested](#what-gets-ingested)- [Add a Gemini App log source](#add-a-gemini-app-log-source)[How many Organizational Units to monitor](#how-many-organizational-units-to-monitor)- [How ingestion timing works](#how-ingestion-timing-works)- [Backfill historical activity](#backfill-historical-activity)- [Offline evaluation and where events appear](#offline-evaluation-and-where-events-appear)- [Troubleshooting a missing chat](#troubleshooting-a-missing-chat)- [Related](#related)
