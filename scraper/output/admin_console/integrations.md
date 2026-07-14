---
title: Integrations
url: https://prod.alltrue-be.com/_docs/docs/admin_console/integrations
section: admin_console
---

# Integrations

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- IntegrationsExport PDFOn this page# Integrations
Use the **Integrations** tab to connect Atlas to third-party services that are not SIEM, Service Management, or an authentication provider.

## Where to find it[​](#where-to-find-it)
Open **Admin Console &gt; System Settings &gt; Integrations** to view, add, edit, and remove third-party integrations.

## What "Integrations" covers[​](#what-integrations-covers)
The Integrations tab currently manages two integration types:

- **Watsonx** (Watsonx Governance) — Pushes AI Inventory artifacts to IBM's Watsonx Governance product so governance teams can manage AI assets discovered by Atlas alongside the rest of their AI inventory.
- **Netskope** — Connects to your Netskope tenant as a secure-access log source. The platform polls Netskope's dataexport iterator on a schedule and converts each access event it returns into an AI Usage / Access Event. See [AI Usage](/_docs/docs/applications/ai_usage) for what the resulting events look like and how policy applies to them.

## Add an integration[​](#add-an-integration)

- Go to **Admin Console &gt; System Settings &gt; Integrations**.
- Click **Add Integration**.
- Select the integration type (Watsonx or Netskope). The form switches to the parameters that type requires.
- Fill in the required parameters (see the per-type tables below). Sensitive credential fields are stored masked.
- Click **Submit**. The new integration appears in the table.

### Watsonx parameters[​](#watsonx-parameters)
FieldNotesDisplay NameLabel shown in the integrations table.Configure Type**IBM Cloud** or **IBM On-Prem**.Base URLThe base URL of your Watsonx Governance deployment.API keyThe API key the integration authenticates with. Stored masked.Instance NameRequired only when **Configure Type** is **IBM On-Prem**.
### Netskope parameters[​](#netskope-parameters)
Each field on the Netskope form is used by the platform when it polls Netskope on your behalf. The platform validates the iterator and token against Netskope before saving — a bad token rejects the row at submit time.

FieldNotesDisplay NameLabel shown in the integrations table.Iterator NameThe dataexport iterator you've configured in Netskope; the platform reads access events from that iterator on a schedule.Netskope TokenAuthentication token for your Netskope tenant. The platform sends it as a bearer token when it pulls events from the configured iterator. Stored encrypted; only the first 5 characters are ever returned on read.
## Manage an existing integration[​](#manage-an-existing-integration)
Each saved integration row exposes the following actions.

**Actions available on every integration (Watsonx and Netskope):**

- **Edit** — Open the integration's form to change parameters. For Netskope, if you change the Iterator Name or Netskope Token, the platform re-validates against Netskope before persisting; failed re-validation aborts the update.
- **Test Connection** — Run a live connectivity check against the integration's endpoint and credentials. Available only after the integration is saved; at create time the same live-credentials check runs automatically as part of submit. Failure surfaces as a toast: "Connection Test Failed: &lt;detail&gt;".
- **Delete** — Remove the integration from Atlas. For Netskope, the platform stops polling that iterator and removes the stored token from the secrets manager.

**Watsonx-only actions:**

- **Sync** — Trigger a sync between Atlas and Watsonx Governance. Does not appear on Netskope rows.
- **Delete all remote resources** — Remove the resources this integration created on the remote side. Does not appear on Netskope rows.

## Related integrations with their own tabs[​](#related-integrations-with-their-own-tabs)
A few integration types have their own dedicated Admin Console tabs because they have richer configuration than a single endpoint:

- **SIEM forwarding** for Splunk, Datadog, Panther, and MS Sentinel is configured on the [SIEM](/_docs/docs/admin_console/siem) tab.
- **ServiceNow and Email** incident routing is configured on the [Service Management](/_docs/docs/admin_console/service_management) tab.
- **Authentication** providers (Microsoft Entra, Google Workspace, LDAP) for enterprise SSO are configured per the [Authentication](/_docs/docs/platform_services/authentication) workflow.
[PreviousService Management](/_docs/docs/admin_console/service_management)[NextRuntime Logging](/_docs/docs/admin_console/runtime_logging)- [Where to find it](#where-to-find-it)- [What "Integrations" covers](#what-integrations-covers)- [Add an integration](#add-an-integration)[Watsonx parameters](#watsonx-parameters)- [Netskope parameters](#netskope-parameters)- [Manage an existing integration](#manage-an-existing-integration)- [Related integrations with their own tabs](#related-integrations-with-their-own-tabs)
