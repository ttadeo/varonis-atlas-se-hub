---
title: Service Management
url: https://prod.alltrue-be.com/_docs/docs/admin_console/service_management
section: admin_console
---

# Service Management

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Service ManagementExport PDFOn this page# Service Management
Configure Service Management integrations to route AI incidents to your existing IT-service-management or ticketing destination. The Admin Console exposes two destination types: **ServiceNow** and **Email**.

Incidents routed through Service Management are independent of [SIEM](/_docs/docs/admin_console/siem) forwarding — the two integrations can be enabled side by side for the same incident.

## Where to find it[​](#where-to-find-it)
Open **Admin Console &gt; System Settings &gt; Service Management** to add, edit, and remove incident-management destinations. The Service Management tab is one of two views over your customer's outbound endpoints; the other is the [SIEM](/_docs/docs/admin_console/siem) tab.

## What gets sent[​](#what-gets-sent)
The Service Management integration forwards **AI incidents** created within the system. AI incidents are not generated automatically — they are records you create or associate from issue surfaces in other applications, then manage from AI Incidents (or, when an external destination such as ServiceNow is configured, from that destination). See [AI Incidents](/_docs/docs/applications/ai_incidents) for the full lifecycle.

Per-destination event support:

- **ServiceNow** — Incident **create** events. Updates to existing incidents are not pushed.
- **Email** — Incident **create** and **update** events.

Per-project routing (which incidents fire to which destination) is configured on the AI Incidents Configuration tab; see [AI Incidents](/_docs/docs/applications/ai_incidents) for that workflow.

## ServiceNow[​](#servicenow)
The ServiceNow destination opens a ticket on your ServiceNow instance for each AI incident routed to it. The form collects:

- **Host** — your ServiceNow instance hostname (for example, `dev265133.service-now.com`).
- **User** — the ServiceNow user the integration authenticates as.
- **Password** — that user's password. Stored masked.
- **Caller ID** — the ServiceNow caller ID to attribute the opened incident to.

Click **Test connection** to validate credentials before saving. ServiceNow supports incident creation only — updates to an open AI incident in Atlas are not propagated to an existing ServiceNow ticket.

## Email[​](#email)
The Email destination sends a formatted message to any inbox. The form collects a single field:

- **Email Address** — the address messages should be delivered to. Any deliverable mailbox works (an individual address, a distribution list, or a shared inbox).

Email supports both incident **create** and **update** events. When an Atlas incident is created and later updated, the Email destination sends a separate message for each event.

## Relationship to SIEM integration[​](#relationship-to-siem-integration)
Service Management and [SIEM](/_docs/docs/admin_console/siem) are two independent integrations that can both subscribe to the same incident. They live as separate Admin Console tabs because they target different downstream tools — Service Management for IT-service-management or ticketing, SIEM for security-tool log ingestion. Both subscribe to incidents through the per-project configuration; an incident created in Atlas may fan out to a ServiceNow ticket, an Email inbox, and one or more SIEM destinations at the same time.

For configuring SIEM destinations (Splunk, Datadog, Panther, MS Sentinel), see [SIEM](/_docs/docs/admin_console/siem). For where in the product per-project incident routing is set, see [AI Incidents](/_docs/docs/applications/ai_incidents).
[PreviousSIEM Integrations](/_docs/docs/admin_console/siem)[NextIntegrations](/_docs/docs/admin_console/integrations)- [Where to find it](#where-to-find-it)- [What gets sent](#what-gets-sent)- [ServiceNow](#servicenow)- [Email](#email)- [Relationship to SIEM integration](#relationship-to-siem-integration)
