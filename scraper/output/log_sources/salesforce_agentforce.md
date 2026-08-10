---
title: Salesforce Agentforce
url: https://prod.alltrue-be.com/_docs/docs/log_sources/salesforce_agentforce
section: log_sources
---

# Salesforce Agentforce

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Salesforce AgentforceExport PDFOn this page# Salesforce Agentforce
This Log Source ingests **live Salesforce Agentforce conversations** — user prompts, agent responses, and the per-turn tool calls in between — from your Salesforce org into Atlas for offline AI Runtime policy evaluation, alerting, and a unified investigation view. The data plane you select pulls the activity from your Salesforce org on a schedule, using the same OAuth client-credentials connection you set up for discovery.

This page covers prompt and response **log ingestion**. For discovering your Agentforce resources — agents, actions, and the rest — and for the shared Salesforce connection setup, see [Salesforce Agentforce Onboarding](/_docs/docs/providers/salesforce/onboarding).

This pull-based integration uses the Data Plane selected in the Connection step. An Azure Data Plane can be selected when it is provisioned for the customer (see [Log Sources](/_docs/docs/log_sources/overview)).

## Before you start[​](#before-you-start)
Ingestion builds on the Salesforce Agentforce discovery setup — it reuses the same connection and adds a single permission. Have these in place first:

- **Salesforce Agentforce discovery already onboarded.** Complete [Salesforce Agentforce Onboarding](/_docs/docs/providers/salesforce/onboarding) first. Discovery resolves your Salesforce org and is what lets Atlas attribute ingested activity to the right Agentforce agent. If discovery has not run, activity is still ingested but agent attribution shows as **unknown** until it does.
- **Data Cloud provisioned on your Salesforce org.** Agentforce conversation activity is read from Salesforce Data Cloud.
- **Agentforce enabled, with at least one deployed agent.**
- **The Run-As User granted the Data Cloud Permission Set License.** This is the one permission you add on top of the discovery setup. Assign it to the same Run-As User you created during onboarding.
- **Outbound network access from your data plane to your Salesforce org.** This pull-based integration runs from the Data Plane you select, so that data plane needs outbound network access to your org's **My Domain URL** — the same value you enter in the setup table below. There is no fixed Salesforce address to allow; the host is your own org's. Configuring Log Sources covers why the data plane is the originating caller.

You do **not** create a new External Client App. Ingestion reuses the same connection as discovery — you enter the same **Consumer Key** and **Consumer Secret** you already generated.

## What gets ingested[​](#what-gets-ingested)
Once the log source is enabled, the data plane pulls Agentforce activity from your Salesforce org and Atlas evaluates it offline against your AI Runtime policies:

- **Every user prompt and agent response**, along with the per-turn tool calls and tool responses and the assistant's messages, so a conversation can be reviewed turn by turn.
- **Each Agentforce conversation becomes a single Atlas session.** The session groups every turn of that conversation together.
- **Each Agentforce agent appears as a first-class resource** in [AI Inventory](/_docs/docs/applications/ai_inventory), with its own detail and history.
- **User attribution is preserved** — sessions are bound to the Salesforce user who initiated them, by email.

Agent attribution relies on Salesforce discovery having run for the org; until it has, activity is ingested but attributed to an **unknown** agent (see [Before you start](#before-you-start)).

## Add a Salesforce Agentforce log source[​](#add-a-salesforce-agentforce-log-source)
In **Admin Console &gt; System Settings &gt; Log Sources**, click **Add New Integration** and select the **Salesforce Agentforce** card. Give the integration a name in the **Integration Name** field, then enter the connection details:

FieldValueMy Domain URLYour Salesforce My Domain URL.Consumer KeyThe Consumer Key from the External Client App you created during onboarding.Consumer SecretThe Consumer Secret from the same External Client App.
The rest of the setup — the four-step wizard, assigning the integration to a project, applying policies to the created resource, and confirming ingestion — is the same for every Log Source. See [Configuring Log Sources](/_docs/docs/log_sources/configuration).

Ingestion is asynchronous, so events typically appear after a short delay rather than instantly. If you need lower ingestion latency, contact Atlas support.

## Offline evaluation and where events appear[​](#offline-evaluation-and-where-events-appear)
Salesforce Agentforce activity is evaluated **offline**: because the conversation has already happened by the time Atlas receives it, policy actions configured to BLOCK or MODIFY are surfaced as **ALERT** rather than intercepting anything in flight (see [Configuring Log Sources](/_docs/docs/log_sources/configuration) for detail). Because each Agentforce agent is its own resource, you can scope AI Runtime policies per agent, but evaluation remains alert-only.

Ingested events appear in [AI Investigation](/_docs/docs/applications/ai_monitor), and each Agentforce agent appears as a resource in [AI Inventory](/_docs/docs/applications/ai_inventory).

## Related[​](#related)

- [Configuring Log Sources](/_docs/docs/log_sources/configuration) — shared wizard, project scoping, and policy mechanics.
- [Log Sources](/_docs/docs/log_sources/overview) — the Log Sources overview and data-plane requirement.
- [Salesforce Agentforce Onboarding](/_docs/docs/providers/salesforce/onboarding) — the discovery prerequisite and the shared Salesforce connection setup.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — where ingested events appear.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — where each Agentforce agent appears as a resource.

## Troubleshooting[​](#troubleshooting)
SymptomWhat it meansWhat to doNo new Agentforce activity is arriving and the last-synced timestamp stops advancing.The data plane could not reach your Salesforce org, or the connection was rejected. Both look the same from Atlas — no new batches appear either way.Confirm outbound network access from the data plane to your org's **My Domain URL** is allowed, and restore it if it is blocked. If the path is open, re-check the Consumer Key, Consumer Secret, and the Run-As User's permissions from [Before you start](#before-you-start). Then wait for the next scheduled poll, and contact Atlas support if activity still does not arrive.
Check the Salesforce side too: if your org restricts API access by source address — through Login IP Ranges or a connected-app IP restriction — the data plane's outbound address must be permitted there as well.

For the shared explanation of why the data plane makes this call, see [Configuring Log Sources](/_docs/docs/log_sources/configuration).
[PreviousAWS Bedrock](/_docs/docs/log_sources/aws_bedrock)[NextGemini App](/_docs/docs/log_sources/gemini_app)- [Before you start](#before-you-start)- [What gets ingested](#what-gets-ingested)- [Add a Salesforce Agentforce log source](#add-a-salesforce-agentforce-log-source)- [Offline evaluation and where events appear](#offline-evaluation-and-where-events-appear)- [Related](#related)- [Troubleshooting](#troubleshooting)
