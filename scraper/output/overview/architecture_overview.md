---
title: Architecture Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/architecture
section: overview
---

# Architecture Overview

- [](/_docs/)- Overview- Architecture OverviewExport PDFOn this page# Architecture Overview
The Atlas platform is built around two cooperating infrastructure components, called planes. The control plane runs as a multi-tenant SaaS on the Varonis network and hosts configuration, analytics, and the Admin Console. The data plane runs close to your AI traffic — inside your own AWS or Azure environment — and is where policy is evaluated in line. Applications and platform services in the control plane are layered on top of this split so that you can see, govern, and protect AI usage without sending unencrypted prompt and response data outside your control.

## Architecture at a glance[​](#architecture-at-a-glance)

The control plane provides the applications you interact with — AI Inventory, AI SPM, AI Red Team, AI Compliance, AI Third-Party Risk Management, AI Investigation, AI 360, AI Incidents, AI Usage, and AI MCP — together with the Admin Console and platform services such as Runtime Logging, SIEM integrations, notifications, reporting, and onboarding. The data plane runs AI Runtime, which evaluates LLM traffic in line and forwards encrypted records to the control plane. The two planes exchange only configuration in one direction and encrypted analytics in the other.

## Control plane[​](#control-plane)
The control plane is a multi-tenant SaaS hosted by Varonis. It is where you log in, where applications run, and where data from one or more data planes is aggregated for analysis.

The control plane is responsible for:

- Configuration of every application and platform service, including the policies that the data plane enforces.
- Analytics surfaces for AI Inventory, AI SPM, AI Red Team (including penetration tests and AI Evaluations), AI Compliance (including Compliance Compass), AI Third-Party Risk Management, AI 360 rollups, AI Investigation, AI Incidents, and AI Usage.
- Admin Console functions: organizations and projects, users, roles, API keys, Data Plane Status, Data Plane Management, Runtime Logging configuration, encryption key management, SIEM and integrations, notifications, reporting, and onboarding.
- Delivering events and analytics to downstream systems such as Splunk and ServiceNow.

LLM prompt and response content is never sent unencrypted to the control plane. Analytics that the data plane forwards is encrypted on the data plane before transit, and you retain control of the keys at all times. Encrypted runtime events aggregated from each data plane are stored on the control plane for analytics and downstream processing.

## Data plane[​](#data-plane)
The data plane is where AI Runtime evaluates traffic between your applications, agents, and the LLMs they call. It evaluates each request in line, encrypts the records it needs to forward, and sends them to the control plane — it does not retain a customer-facing runtime record store of its own.

The data plane is deployed inside your own AWS account or Azure subscription. AWS deployments use CloudFormation; Azure deployments use ARM templates. The data plane runs in a private network segment in your cloud account (a VPC on AWS or a virtual network on Azure).

You register, monitor, and remove data planes from the Admin Console under **Data Plane Management**. The current state of each data plane is available under **Data Plane Status**: selecting a data plane in the combobox shows that data plane's status, and the page automatically presents the cloud-appropriate cards based on whether the selected data plane runs in AWS or Azure. There is no separate management interface outside the Admin Console.

For step-by-step deployment instructions, see [Onboarding](/_docs/docs/platform_services/onboarding).

## How data flows between planes[​](#how-data-flows-between-planes)
The two planes exchange a deliberately narrow set of data:

- **Configuration flows from the control plane to the data plane.** Policies, allow-lists, logging settings, and similar configuration are pulled by the data plane from the control plane.
- **Rule processing happens on the data plane.** When AI Runtime is in the request path, all policy and guardrail evaluation occurs on the data plane. LLM prompt and response content does not leave the data plane in cleartext.
- **Encrypted analytics flow from the data plane to the control plane.** Data sent for analysis is encrypted on the data plane before transit, decrypted only with keys that you control, and stored on the control plane for analytics and downstream processing.

This means the applications in the control plane operate on data that you can revoke at any time by rotating or revoking the encryption keys.

## Where runtime data lives and who can see it[​](#where-runtime-data-lives-and-who-can-see-it)
**Storage location.** Encrypted runtime events from each data plane are aggregated on the control plane and stored there at rest. Encryption keys remain under your control through Bring Your Own Key (BYOK); revoking or deleting the key removes the platform's ability to read previously stored content, while key rotation keeps existing data readable because each envelope carries the wrapped DEK that originally encrypted it.

**Who can see unmasked content.** Viewing the original prompt and response text in the control-plane UI requires the **Prompt Reader** role. Users without this role see masked placeholder content in place of prompts and responses; structural and operational metadata (timestamps, rule verdicts, endpoint identifiers, token counts) remain visible so workflows that do not need sensitive content can still operate normally.

**What gets forwarded at all.** You control what the data plane forwards from **Admin Console &gt; System Settings &gt; Runtime Logging**. The **Global** tab sets the tenant-wide defaults — what content is captured, at what level of detail, and which operational metrics are forwarded. The **Prompt Source** tab applies per-resource overrides where the global default permits them, so high-sensitivity endpoints can be configured more restrictively than the tenant default without changing the default itself. See [Runtime Logging](/_docs/docs/admin_console/runtime_logging) for the full Runtime Logging surface and [Data Encryption and Key Management](/_docs/docs/platform_services/encryption) for the encryption model behind the role-based masking.

## Encryption and key management[​](#encryption-and-key-management)
The platform uses envelope encryption with per-customer data encryption keys (DEKs), wrapped by a key encryption key (KEK) under your control through Bring Your Own Key (BYOK). Sensitive runtime data is encrypted on the data plane before it ever leaves your environment. On the control plane, users without the **Prompt Reader** role see masked content in place of prompts and responses. You can rotate or revoke keys at any time; revoking the KEK removes the ability of any party — including Varonis — to read previously stored ciphertext.

For implementation detail, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

## Data handling, retention, and resilience[​](#data-handling-retention-and-resilience)
This section answers the questions that come up most often in security reviews: what platform data is stored and where, whether it is moved to cold storage, how long it is kept, whether you can access it, what happens during an outage, and how backups work. The infrastructure described here is operated by Varonis. It is distinct from the customer-controlled encryption of runtime content covered in [Encryption and key management](#encryption-and-key-management) above and in [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

### What is stored, and where[​](#what-is-stored-and-where)
Encrypted runtime events forwarded from each data plane are aggregated and stored on the control plane, which Varonis operates as a multi-tenant SaaS. The data plane keeps no customer-facing runtime record store of its own (see [Data plane](#data-plane) above). What runtime content is forwarded at all is governed by your Runtime Logging settings — see [Runtime Logging](/_docs/docs/admin_console/runtime_logging).

Platform data is held in production databases and storage inside a private virtual network, operated by Varonis as independent per-region deployments, with application workloads running in private subnets spread across multiple Availability Zones.

### Is customer data accessible to you[​](#is-customer-data-accessible-to-you)
Yes. You access your data through the control-plane applications and the Admin Console. Viewing the original prompt and response text requires the **Prompt Reader** role; users without it see masked placeholders while operational metadata stays visible — see [Where runtime data lives and who can see it](#where-runtime-data-lives-and-who-can-see-it) above. Because runtime content is encrypted under keys you control through BYOK, you can remove the platform's ability to read it at any time by rotating or revoking the key.

### Retention[​](#retention)
Control-plane retention is operated by Varonis and governed by policy. For the specific values that apply to your tenant, consult the Admin Console or contact support — there is no fixed customer-data deletion timer published here. Customer data is **not** moved to a separate cold-storage or archive tier; it is retained per the retention policy and then deleted.

The recovery windows that apply to the infrastructure are the backup-retention windows described under [Backups](#backups) below. Those are backup-recovery windows, not a customer-data deletion schedule.

### Resilience and outages[​](#resilience-and-outages)
Within a region, the platform is built for automatic failover across Availability Zones with no manual action. The primary database runs Multi-AZ, and the cache and queue layer runs with Multi-AZ automatic failover, each with a replica in a separate Availability Zone. If an Availability Zone fails, the platform fails over to a healthy zone in the same region automatically.

### Disaster recovery and regional failover[​](#disaster-recovery-and-regional-failover)
Within a region, Availability Zone failover is automatic, as described above. A regional-level event is handled through recovery rather than live failover: backups are copied to a second AWS region, and regional recovery is performed by restoring from those cross-region copies.

### Backups[​](#backups)
Backups of the production databases and platform data storage are encrypted at rest, retained per policy, and replicated to a separate AWS region so a copy survives the loss of a region. This infrastructure-level at-rest encryption is separate from the customer-controlled BYOK encryption of runtime content described in [Encryption and key management](#encryption-and-key-management) above. Restores are exercised periodically to verify recoverability, and access is restricted to Varonis operational roles — backups are not customer-accessible.

## Applications[​](#applications)
The control plane provides the following applications. Each is described in its own page; this list is the canonical naming used across the product:

- **AI 360** — cross-application risk and posture rollup.
- **AI Inventory** — discovery and catalog of AI systems, models, agents, and the data they touch.
- **AI Usage** — usage analytics for sanctioned and unsanctioned AI tools.
- **AI Red Team** — penetration tests and AI Evaluations against your AI systems.
- **AI SPM** — security posture management for AI systems and their supporting infrastructure.
- **AI Runtime** — in-line policy enforcement on LLM requests and responses from your AI Systems. Session Policies are configured here as a runtime control.
- **AI MCP** — registration, discovery, and security scanning of MCP servers, including Virtual MCPs that expose scoped tool allow-lists.
- **AI Investigation** — analytics and investigation surfaces over runtime activity.
- **AI Compliance** — compliance scanning and Compliance Compass.
- **AI Third-Party Risk Management** (AI TPRM) — third-party AI vendor assessment.
- **AI Incidents** — investigation workflow for detected issues.

## Platform services[​](#platform-services)
Platform services are shared capabilities that span the applications:

- **Admin Console** — the management surface for everything below.
- **Organizations and projects** — the tenancy model that scopes data and access.
- **Users, roles, and API keys** — identity, role assignment, and programmatic access.
- **Data Plane Status and Data Plane Management** — visibility into and lifecycle control over the data planes attached to your tenant.
- **Runtime Logging** — configuration that governs what AI Runtime forwards from the data plane to the control plane (prompt content, response content, and operational metrics), with per-Prompt-Source overrides where the global default allows them. Configured under **Admin Console &gt; System Settings &gt; Runtime Logging**.
- **Encryption and key management** — see the section above.
- **SIEM and integrations** — delivery of events to systems such as Splunk and ServiceNow.
- **Notifications** — channels and routing for platform alerts.
- **Reporting and export** — scheduled and on-demand exports.
- **Onboarding** — the guided setup that connects your tenant, your cloud accounts, and your first data plane.

For details on the management surface, see [Admin Console](/_docs/docs/admin_console/). For the tenancy model, see [Organizations and projects](/_docs/docs/overview/orgs_and_projects). For where everything lives in the UI, see [GUI navigation](/_docs/docs/overview/gui_navigation). For the application portfolio in context, see [Platform and applications](/_docs/docs/overview/platform_and_applications).

## Tiered access[​](#tiered-access)
The applications available to you depend on your subscription tier. The canonical tier-to-application mapping (plus prompt cap and project allowance) lives in the **Licensing and Entitlements** section of [Platform and Applications](/_docs/docs/overview/platform_and_applications).

Exact role-by-role permissions are documented alongside each application.

## Control plane and Data plane FAQ[​](#control-plane-and-data-plane-faq)
### Data plane related questions[​](#data-plane-related-questions)

- 
**Is AI Runtime part of the data plane?**
Yes. AI Runtime runs on the data plane, which is deployed inside your AWS or Azure environment. Each request is evaluated in line on the data plane; the encrypted records produced from that evaluation are then forwarded to the control plane.

- 
**What customer data does the data plane process?**
When AI Runtime is in the request path, traffic that traverses it is evaluated and, when Runtime Logging is configured to capture it, encrypted on the data plane and forwarded to the control plane. The exact fields captured — for example, prompt content, response content, and operational metrics — are controlled by your Runtime Logging settings.

- 
**Does the data plane handle customer sensitive data?**
This depends on configuration. If AI Runtime is deployed and sensitive data is present in prompts or responses, that content is evaluated on the data plane and may be captured for forwarding to the control plane. You control what is captured, and at what level of detail, from **Admin Console &gt; System Settings &gt; Runtime Logging** — a tenant-wide **Global** setting plus per-**Prompt Source** overrides where the global default allows them. Cleartext prompt and response content never leaves the data plane — encryption happens on the data plane before transit.

- 
**What type of data is forwarded from the data plane to the control plane?**
All rules processing takes place entirely on the data plane — no unencrypted LLM input or output data leaves your environment. Rule settings are retrieved from the control plane, but evaluation and processing happen on the data plane. Data sent to the control plane for analytics is encrypted on the data plane before transmission, and you retain full control over the encryption keys and can rotate them at any time. For more on how encryption works, including Bring Your Own Key (BYOK) and key rotation, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

- 
**What runtime data does the data plane retain locally?**
The data plane does not retain a customer-facing runtime record store. Runtime events are forwarded to the control plane per your Runtime Logging configuration; what is forwarded — and what is suppressed at source — is governed by **Admin Console &gt; System Settings &gt; Runtime Logging**.

### Control plane related questions[​](#control-plane-related-questions)

- 
**What type of data goes directly to the control plane?**
The control plane handles functions not tied to AI Runtime traffic on the data plane. It runs AI Inventory, AI SPM, AI Red Team (including penetration tests and AI Evaluations), AI Compliance (including Compliance Compass), AI Third-Party Risk Management, AI 360, AI Investigation analytics, AI Incidents, AI Usage, AI MCP, and the Admin Console, and it delivers events to integrations such as Splunk and ServiceNow. When AI Runtime is in use, all guardrail policy evaluation happens on the data plane — LLM activity is never sent unencrypted to the control plane. Encrypted runtime events from each data plane are aggregated and stored on the control plane for analytics and downstream processing. You retain control over the encryption keys at all times, and viewing unmasked prompt and response content requires the Prompt Reader role.

- 
**Is the control plane responsible for configuring and managing all components on the data plane, or is there a separate management layer on the data plane?**
All functions are managed from the control plane through the Admin Console. There is no separate management interface for the data plane.

- 
**What is the data retention threshold on the control plane?**
Control plane retention is operated by Varonis and governed by policy; for the values that apply to your tenant, consult the Admin Console or contact support. There is no fixed deletion timer published for stored runtime data. The recovery windows that apply to the infrastructure are the backup-retention windows described under [Data handling, retention, and resilience](#data-handling-retention-and-resilience). Customer data is not moved to a separate cold-storage tier — it is retained per policy and then deleted.

- 
**Is data moved to cold storage?**
No. Customer data is retained per the retention policy and then deleted; it is not moved to a separate cold-storage or archive tier.

- 
**What happens during an outage — and if a region goes down?**
Within a region, the platform fails over automatically across Availability Zones: the primary database and the cache and queue layer both run Multi-AZ, so the loss of an Availability Zone requires no manual action. A regional-level event is handled through recovery rather than live failover — backups are copied to a second AWS region, and regional recovery is performed by restoring from those cross-region copies. See [Data handling, retention, and resilience](#data-handling-retention-and-resilience).

- 
**Are backups taken — how often, where, and who can access them?**
Yes. Backups are encrypted at rest, retained per policy, and replicated to a separate AWS region so a copy survives the loss of a region. Restores are exercised periodically to verify recoverability, and access is restricted to Varonis operational roles — backups are not customer-accessible.

[PreviousPlatform and Applications Overview](/_docs/docs/overview/platform_and_applications)[NextOrganizations and Projects Overview](/_docs/docs/overview/orgs_and_projects)- [Architecture at a glance](#architecture-at-a-glance)- [Control plane](#control-plane)- [Data plane](#data-plane)- [How data flows between planes](#how-data-flows-between-planes)- [Where runtime data lives and who can see it](#where-runtime-data-lives-and-who-can-see-it)- [Encryption and key management](#encryption-and-key-management)- [Data handling, retention, and resilience](#data-handling-retention-and-resilience)[What is stored, and where](#what-is-stored-and-where)- [Is customer data accessible to you](#is-customer-data-accessible-to-you)- [Retention](#retention)- [Resilience and outages](#resilience-and-outages)- [Disaster recovery and regional failover](#disaster-recovery-and-regional-failover)- [Backups](#backups)- [Applications](#applications)- [Platform services](#platform-services)- [Tiered access](#tiered-access)- [Control plane and Data plane FAQ](#control-plane-and-data-plane-faq)[Data plane related questions](#data-plane-related-questions)- [Control plane related questions](#control-plane-related-questions)
