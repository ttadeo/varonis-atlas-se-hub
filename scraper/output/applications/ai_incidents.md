---
title: AI Incidents
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_incidents
section: applications
---

# AI Incidents

- [](/_docs/)- Applications- AI IncidentsExport PDFOn this page# AI Incidents
Use the AI Incidents application to escalate one or more AI-related issues into an incident, assign ownership and due dates, track status through closure, manage incidents that are forwarded to an external service like ServiceNow or Datadog, review dashboard rollups, configure project-scoped Service Management delivery, and export current or historical incident reports as CSV files.

Incidents are records you create or associate from issue surfaces in other applications. They are not generated automatically by the system. Once an incident exists, you manage it from AI Incidents — unless you have configured an external destination, in which case the external system owns the record and AI Incidents becomes a read-only tracking surface.

AI Incidents lives under **AI Incidents** in the Applications navigation. The menu exposes four tabs: **Dashboard**, **Configuration**, **Incidents**, and **Report**.

## What Creates an AI Incident[​](#what-creates-an-ai-incident)
An AI incident is a structured record that groups one or more issues, captures ownership and triage state, and supports closure with an audit trail. Each incident has:

- **Incident code** — a unique identifier generated when the incident is created (for example, **INC-123**). The code is displayed everywhere the incident is referenced.
- **Name** — a short title you provide on creation.
- **Type** — one of the shipped incident types (see [Incident Fields and Statuses](#incident-fields-and-statuses)).
- **Severity (urgency)** — Low, Medium, High, or Critical.
- **Status** — Open, Closed, Deleted, or Externally Managed.
- **Description** — optional free text.
- **Assignee** — the operator responsible for triage and resolution.
- **Due date** — optional target date for resolution; an "Overdue" badge appears in the UI when the due date has passed and the incident is still open.
- **Workflow** — currently **Serious Incident**.
- **Last action** — a UI-derived label summarizing the most recent meaningful change.
- **Timestamps** — created, updated, and (when applicable) closed.
- **Closure comment** — required when closing an incident.
- **Associated issues** — one or more source issues from any AI application (AI SPM, AI Investigation, AI Inventory, and others).
- **External provider details** — present when the incident is managed in an external Service Management system; includes the provider name and the external record identifier.

Incidents are always created or associated from an issue. There is no separate "create incident from scratch" button — every incident traces back to at least one source issue.

## Create or Associate an Incident from an Issue[​](#create-or-associate-an-incident-from-an-issue)
You start an incident from any issue list in any application that surfaces issues. The workflow is the same regardless of which application the issue originated in.

- From the issue row, open the row action menu (three-dots icon) and select **Create Incident** or **Associate Incident**.
- The **Incident Management** dialog opens with two tabs:

**Create New** — open a brand new incident and attach the selected issue to it.
- **Associate Existing** — search for an existing incident by code or name and add the selected issue to it.

- To create a new incident, fill in the form:

**Name** (required).
- **Type** (required) — see the list under [Incident Fields and Statuses](#incident-fields-and-statuses).
- **Severity** (required) — Low, Medium, High, or Critical.
- **Description** (optional).
- **Assignee** (optional) — pick a user from your organization.
- **Due date** (optional).

- Submit. AI Incidents creates the incident, links the originating issue, and surfaces the new incident in the Incidents list. The page also redirects or searches by the new incident code so you can continue working with the record.
- To associate an existing incident, select it from the search results in the dialog. The issue is attached to that incident.

You can later remove an associated issue from an incident from the incident's expanded detail view. Removing the last associated issue does not delete the incident — the incident remains and can still be edited or closed.

## Triage Incidents in the Incidents List[​](#triage-incidents-in-the-incidents-list)
The **Incidents** tab shows every incident in your current project or organization scope.

The table includes the following columns by default:

- **Incident** — the incident code and name.
- **Type** — the incident type.
- **Urgency** — the severity badge.
- **Assignee** — the assigned operator.
- **Due Date** — the target resolution date, with an "Overdue" indicator when applicable.
- **Status** — Open, Closed, Deleted, or Externally Managed.
- **Actions** — the row action menu (edit, close/reopen, delete) where available.

The table also supports:

- **Global search** — search by incident code or name from the search box above the table.
- **Per-column filters** — filter by type, urgency, assignee, due date, or status.
- **Default sort priority** — incidents sort by priority first (urgency and due date) so that the most pressing incidents float to the top.
- **Expandable rows** — expand a row to see associated issues, full description, owner, timestamps, last action, closure comments (if closed), and external provider details (if externally managed).
- **Pagination** — page through large incident lists.

Row actions vary by status:

- **Open incidents:** edit, change assignee, mark closed (with a closure comment), and delete.
- **Closed incidents:** reopen (which clears the closure fields) and delete.
- **Externally managed incidents:** row actions are hidden. The external system is the source of truth — make changes there. The expanded row in AI Incidents still shows the latest synced details so you can track the incident.

The Incidents list is scoped to the current project (or organization, depending on context) through the associated issues. You only see incidents whose issues belong to the projects you have access to.

## Incident Fields and Statuses[​](#incident-fields-and-statuses)
### Types[​](#types)
Every incident has exactly one type. The shipped types are:

- Bias and Fairness Violation
- Model Performance Error
- Regulation Non-Compliance
- AI System Error
- Third Party Non-Compliance

### Severity (Urgency)[​](#severity-urgency)
Severity reflects how urgent the incident is. The shipped severities are:

- Critical
- High
- Medium
- Low

### Statuses[​](#statuses)
An incident is always in one of four statuses:

- **Open** — the incident is being triaged.
- **Closed** — the incident has been resolved and a closure comment has been recorded. Closing an incident captures the closure comment and the closed timestamp. Reopening a closed incident clears the closure fields.
- **Deleted** — the incident has been removed and no longer appears in the active list.
- **Externally Managed** — the incident has been forwarded to an external Service Management system. The external system owns the record, and AI Incidents shows a synced read-only view.

The **Overdue** label you see on incident rows is not a separate status. It is derived in the UI from the due date and current status (incidents past their due date that are still Open).

### Workflow[​](#workflow)
The shipped workflow value is **Serious Incident**. Workflow is currently informational and used for downstream reporting.

## External Management Behavior[​](#external-management-behavior)
When you have configured a Service Management endpoint for the project (see [Service Management Configuration](#service-management-configuration)), creating a new incident can also create a record in the external system. The behavior is:

- The external record is created at incident-create time, according to the endpoint configuration.
- The external identifier is stored on the incident — for example, the ServiceNow record's sys_id, or the Datadog incident id.
- The incident's status is set to **Externally Managed**, and AI Incidents becomes the read-only tracking surface. Triage, assignment, and closure happen in the external system; AI Incidents reflects the synced state.
- Row actions on externally managed incidents are hidden. The expanded row shows the external provider name and identifier so you can navigate to the external record.

If you want to change which incidents are forwarded externally, update the project's Service Management Configuration. Existing incidents are not retroactively migrated — the configuration governs new incidents.

Endpoint setup for Service Management providers (ServiceNow, Email) lives in the Admin Console. AI Incidents &gt; Configuration maps an already-defined endpoint to a project and selects which events are forwarded.

## Dashboard Rollups[​](#dashboard-rollups)
The **Dashboard** tab gives you a top-level view of AI incidents over a configurable time window.

- **Date range picker** — choose the period the dashboard covers. The default is the last **30 days**. Changing the date range refreshes every widget on the page.
- **Resolution rate** — the percentage of incidents in the selected period that have been closed.
- **Summary counts** — totals for incidents opened, closed, and currently open in the period.
- **Open incidents by type** — a breakdown of currently open incidents grouped by incident type.
- **Open incidents by severity** — a breakdown of currently open incidents grouped by urgency.
- **Incidents over time** — a time series showing incidents opened and closed across the selected period.
- **Status by type** — a chart showing how incidents are distributed across statuses for each type, including Externally Managed.

Externally managed incidents are represented in the dashboard charts alongside incidents you manage directly, so you have a single rollup view across all sources.

noteSome dashboard elements are relevant only when incidents are managed inside the platform (for example, *Incidents over time*). If you manage incidents in ServiceNow, Splunk, or Datadog, use their respective incident views.

## Service Management Configuration[​](#service-management-configuration)
The **Configuration** tab is titled **Service Management Configuration**. It is where you decide which Service Management endpoint receives incidents for a given project, and which create or update events are forwarded.

- **Select a project.** The configuration is per-project — each project can route incidents to a different endpoint, or to none.
- **Add Configuration.** Click **Add Configuration** to bind a Service Management endpoint to the selected project. If you have not yet defined any endpoints, this button is disabled and a placeholder reads **All Integrations Configured** until endpoints exist in the Admin Console. Define endpoints in the Admin Console under System Settings.
- **Pick the endpoint and event toggles.** The form differs by provider:

**ServiceNow** — exposes a single toggle, **Send Created Incidents**, which forwards each newly created incident to the ServiceNow endpoint.
- **Other Service Management providers** — expose per-event toggles for issue created/updated and incident created/updated, depending on what the provider supports.

- **Edit or delete an existing configuration.** Each configured endpoint can be edited or removed without affecting incidents already forwarded.

Each project can hold one configuration per endpoint. To route incidents to a different endpoint, edit or delete the existing configuration and add a new one.

SIEM forwarding (for example, generic Datadog, Splunk, Panther, or Microsoft Sentinel incident forwarding from a SIEM perspective) is configured separately in the Admin Console under System Settings. AI Incidents &gt; Configuration covers the Service Management endpoint mapping per project; the SIEM area covers SIEM-routed forwarding.

## Export Current and Historical Incident Reports[​](#export-current-and-historical-incident-reports)
The **Report** tab generates CSV exports of incident data. Two report types are shipped:

- **Current Incidents Report.** Exports incidents currently in the system, filtered by **project** and **incident type**. Use this for a snapshot of active incident inventory.
- **Incident History Report.** Exports incidents across a historical window, filtered by **project**, **date range**, **incident type**, and **incident status**. Use this for audit, retrospective review, or evidence collection.

To generate a report:

- Open the **Report** tab.
- Choose **Current Incidents Report** or **Incident History Report**.
- Fill in the required filters for that report type.
- Submit. The CSV downloads to your browser.

The Report tab is an export tool, not a search interface — for searching and triaging incidents interactively, use the [Incidents](#triage-incidents-in-the-incidents-list) tab.

## Permissions and Prerequisites[​](#permissions-and-prerequisites)
To use AI Incidents you need:

- Access to the AI Incidents application (granted with the standard product tier).
- The relevant per-tab AI Incidents permissions:

**Dashboard permission** to view the Dashboard tab.
- **Configuration permission** to view and manage Service Management Configuration.
- **Incidents permission** to view and act on the Incidents list.
- **Report permission** to generate CSV exports.

Defining Service Management endpoints (ServiceNow, Email, and similar) happens in the Admin Console and requires the corresponding Admin Console integration permissions. Once endpoints exist, mapping them to projects from AI Incidents &gt; Configuration requires only the AI Incidents Configuration permission.
[PreviousAI Evaluations](/_docs/docs/applications/ai_red_team/ai_validation_sandbox)[NextAI Third-Party Risk Management](/_docs/docs/applications/ai_tprm)- [What Creates an AI Incident](#what-creates-an-ai-incident)- [Create or Associate an Incident from an Issue](#create-or-associate-an-incident-from-an-issue)- [Triage Incidents in the Incidents List](#triage-incidents-in-the-incidents-list)- [Incident Fields and Statuses](#incident-fields-and-statuses)[Types](#types)- [Severity (Urgency)](#severity-urgency)- [Statuses](#statuses)- [Workflow](#workflow)- [External Management Behavior](#external-management-behavior)- [Dashboard Rollups](#dashboard-rollups)- [Service Management Configuration](#service-management-configuration)- [Export Current and Historical Incident Reports](#export-current-and-historical-incident-reports)- [Permissions and Prerequisites](#permissions-and-prerequisites)
