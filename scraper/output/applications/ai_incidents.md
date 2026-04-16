---
title: AI Incidents
url: https://playground.alltrue-be.com/_docs/docs/applications/ai_incidents
section: applications
---

# AI Incidents

- [](/_docs/)- Applications- AI IncidentsOn this page# AI Incidents
Create incidents from issues and manage them either within the system or within your service operations system such as ServiceNow, Datadog, or Splunk. You decide when an issue or collection of issues should be elevated to incident status.

You create an incident by elevating an issue or a set of issues to incident status. On any list of issues in any application, click the three dots and choose "Create Incident" or "Associate Incident". The latter allows you to add additional issues to an existing incident. Because incident response is a focus in all AI regulations, managing it within Varonis enables automated evidence collection. Alternatively, you can create the incident in Varonis but mark it as managed within ServiceNow, Splunk, Datadog, etc.

When you create an incident, you determine the severity and assignee. In the AI Incidents application, you can change any of these values or mark the incident as resolved.

## Dashboard[​](#dashboard)
The dashboard gives you an overview of all AI-related incidents, their statuses, and open/close times. Note that some elements of this dashboard are only relevant when you manage incidents within the system (e.g., the Incidents Opened and Closed Over Time view). If you manage incidents in ServiceNow, Splunk, or Datadog, use their respective incident views.

## Configuration[​](#configuration)
You can manage AI incidents within the TRiSM platform, or you can create them in the platform (from issues) and immediately export them to a service management system such as ServiceNow where they are managed and handled. For example, to set up the export to ServiceNow you need to:

- Define the integration with ServiceNow in the Admin Console.
- Configure the export.

This export is configured per project, allowing you to control where you manage incidents on a per-project basis.

Select the project for which you want to export incidents, select the integration endpoint from the dropdown (these are all the service management endpoints defined by your admin), and check the **Send All Incidents** checkbox.

## Incidents[​](#incidents)
View and manage your list of incidents. If you choose to manage incidents externally, this view is read-only.

## Report[​](#report)
Use the AI Incidents report to search through all AI incidents, present or past.
[PreviousAI Observability](/_docs/docs/applications/ai_observability)[NextAI TPRM](/_docs/docs/applications/ai_tprm)- [Dashboard](#dashboard)- [Configuration](#configuration)- [Incidents](#incidents)- [Report](#report)
