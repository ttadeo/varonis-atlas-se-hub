---
title: AI Usage
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_usage
section: applications
---

# AI Usage

- [](/_docs/)- Applications- AI UsageExport PDFOn this page# AI Usage
The AI Usage application gives you visibility into the AI services your organization consumes, lets you set policy on which services and LLM endpoints are allowed, supports custom AI service entries, exposes the access events generated when people in your organization interact with AI services, and surfaces Unauthorized AI Usage issues alongside a report you can export.

Usage data is ingested from ZTNA and cloud-log sources, then compared against a curated catalog of AI services. Some providers, such as Microsoft Copilot, are integrated directly. You manage how each service is treated using a three-state policy model — Silence, Audit, and Unauthorized — and you can enforce policy on LLM traffic through AI Runtime or through third-party AI gateways.

## Dashboard[​](#dashboard)
The Dashboard summarizes usage across all AI services your organization consumes from AI service providers, as well as the LLM traffic AI Runtime observes.

The Dashboard has two tabs:

- **Overview** — a cross-service summary with charts for active applications, active users, requests over time, top users, and top applications. You can scope the view with an AI service or provider dropdown and filter by time range, application type, and provider. The page also reflects the current configuration status of the data sources powering AI Usage.
- **Daily Usage** — a day-by-day breakdown of activity so you can spot trends and drill into specific days.

Use the widgets on either tab to toggle between user-oriented and application-oriented views.

### Per-service detail[​](#per-service-detail)
Selecting a service opens its detail view, which shows the date range, detailed activity for that service, LLM-specific data where applicable, daily request charts, and endpoint-specific model and request charts. For Microsoft Copilot, additional user and application breakdowns are available. Not every widget appears for every provider — the page adapts to the data each service exposes.

## Users[​](#users)
The Users section lists the people in your organization who have accessed AI services, together with a breakdown of which services each user is using.

The section includes:

- **List of AI Users** with the AI services each one accesses.
- **Total Users** counter showing how many distinct users are tracked.
- Per-user tracked usage counts so you can see how active each user is.
- Table filters to narrow the list by service, time range, or other attributes.
- A per-user view with activity details for that user, including the services and applications they used.

Selecting the count of GenAI applications next to a user expands the list of services that user has accessed.

## Policies[​](#policies)
The Policies page is where you decide how each AI service and LLM endpoint is treated. Policy is expressed in three states:

- **Silence** — the service is allowed and the activity is recorded without alerting.
- **Audit** — the service is allowed, the activity is recorded, and access events are generated for review.
- **Unauthorized** — the service is not allowed; activity is flagged as an Unauthorized AI Usage issue.

The page has two tabs.

### AI Services[​](#ai-services)
The AI Services tab lists the catalog of known AI services together with recent activity. For each service you can:

- Set the policy state — Silence, Audit, or Unauthorized.
- See the **default posture** that applies when no explicit policy is set, and override it for individual services.
- See whether the current policy is **inherited** from the default or set as an **explicit override**, and **reset to default** to remove an override.
- Apply **bulk policy actions** to multiple services at once.

Select View in Inventory on any service to see its inventory entry.

### Custom AI Services[​](#custom-ai-services)
In addition to the curated catalog, you can define **Custom AI Services** to represent AI tools that are specific to your organization.

A custom service entry includes:

- The service name and basic metadata.
- **Browser URL patterns** that identify the service when accessed through a browser.
- **Network request patterns** that identify the service in network logs.
- An optional **custom access policy** that overrides the default posture for that service.

Custom services are validated so that duplicates and conflicting patterns are caught when you save. Some entries restrict editing or deletion to protect the integrity of the patterns they depend on.

## Quarantine Policy for LLM Endpoints[​](#quarantine-policy-for-llm-endpoints)
The Quarantine Policy for LLM Endpoints controls which LLM endpoints can be used across your organization. It is managed from the LLM Endpoints tab of the AI Usage policies page, where you can toggle the policy on or off and review the status of individual endpoints.

The LLM Endpoints tab uses the shipped controls — **Authorized** and **Sanctioned** — to label per-endpoint state. Underlying behavior follows the three-state policy model:

- Endpoints you allow correspond to the Silence or Audit state, depending on whether you want their activity recorded only or surfaced for review.
- Endpoints you do not allow correspond to the Unauthorized state and are blocked when the quarantine policy is enabled.

You enable the quarantine policy with the toggle at the top of the LLM Endpoints tab. When the policy is on, requests to endpoints that are not allowed are blocked, and requests to allowed endpoints proceed. The set of endpoints you can allow is tied to the review state of those endpoints in your AI Inventory — only reviewed endpoints can be allowed for use.

### Policy controls[​](#policy-controls)

- **Enable / Disable Policy** — Use the toggle at the top of the AI Usage policies page to activate or deactivate the quarantine policy.
- **Manage Endpoint Status** — Use the list view to mark LLM endpoints as **sanctioned** (approved) or **unsanctioned** (blocked).
- **Inventory Integration** — The sanction status of an LLM endpoint is directly tied to its **Approved / Unapproved** review status in your AI Inventory. Only approved resources can be sanctioned.

### API: Check LLM Endpoint Quarantine Status[​](#api-check-llm-endpoint-quarantine-status)
`POST /v1/ai-usage/quarantine/llm-endpoint`

Checks whether an LLM endpoint is **sanctioned** (allowed) or **unsanctioned** (blocked) based on its identifier, API key, or API request metadata.

#### Request body[​](#request-body)
FieldTypeDescription`endpoint_identifier`stringIdentifier associated with a known LLM endpoint`api_key`stringAPI key registered with the LLM endpoint`llm_api_request`objectOriginal request metadata used to resolve provider and headers
**`llm_api_request` object fields:**

- `provider` (string) — Name of the LLM provider (for example, OpenAI, Google, Anthropic).
- `request_headers` (object) — JSON object of original HTTP headers sent with the LLM request.

#### Response[​](#response)
Returns whether the endpoint is sanctioned:

```
{
 "sanctioned": true,
 "message": "Optional message if applicable"
}

```
Examples:

- 
Sanctioned:

```
{"sanctioned": true}

```

- 
Unsanctioned:

```
{"sanctioned": false}

```

- 
With note:

```
{"sanctioned": true, "message": "Skipped validation due to system issue"}

```

## Access Events[​](#access-events)
Each time someone in your organization interacts with an AI service, an access event is recorded. Access events are powered by AI Usage data and are reviewed under **AI Investigation &gt; Events**, where you can filter by service, user or search term, time range, source, device, URL, IP, and event type.

For the full investigation workflow — including drilldowns and request inspection — see [AI Investigation](/_docs/docs/applications/ai_monitor). The AI Usage page surfaces access events as a starting point; the operational tooling lives in AI Investigation.

## Issues[​](#issues)
The Issues section lists the **Unauthorized AI Usage** issues generated when activity violates your AI Usage policy — for example, when a user accesses a service set to Unauthorized. Select an issue to see the affected user, service, and the events that triggered the issue.

## Report[​](#report)
Use the AI Usage report to search through Unauthorized AI Usage issues, present or past. You can export the issues as a CSV through the shared report layout for offline review or for sharing with other teams.

## Permissions[​](#permissions)
Access to AI Usage requires tier 2 entitlement. Within tier 2, each subpage is gated by its own AI Usage permission — Dashboard, Users, Policies, Issues, and Report — so you can grant access to individual sections without granting access to the rest.

Access Events are surfaced under the AI Investigation Events route, which may additionally require the AI Investigation requests permission.

Related applications:

- [AI Inventory](/_docs/docs/applications/ai_inventory) — distinguishes inventory review state from the AI Usage three-state access policy.
- [AI Gateway](/_docs/docs/applications/ai_gateway) — the AI Runtime that enforces policy on LLM traffic.
- [AI Investigation](/_docs/docs/applications/ai_monitor) — AI Investigation, including the Events view where Access Events are reviewed.
- [AI 360](/_docs/docs/applications/ai_360) — risk rollups across AI Usage and related applications.
[PreviousSupported Resource Types](/_docs/docs/applications/ai_inventory/supported_resource_types)[NextAI SPM](/_docs/docs/applications/ai_spm)- [Dashboard](#dashboard)[Per-service detail](#per-service-detail)- [Users](#users)- [Policies](#policies)[AI Services](#ai-services)- [Custom AI Services](#custom-ai-services)- [Quarantine Policy for LLM Endpoints](#quarantine-policy-for-llm-endpoints)[Policy controls](#policy-controls)- [API: Check LLM Endpoint Quarantine Status](#api-check-llm-endpoint-quarantine-status)- [Access Events](#access-events)- [Issues](#issues)- [Report](#report)- [Permissions](#permissions)
