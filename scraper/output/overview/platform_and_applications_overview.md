---
title: Platform and Applications Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/platform_and_applications#related-pages
section: overview
---

# Platform and Applications Overview

- [](/_docs/)- Overview- Platform and Applications OverviewExport PDFOn this page# Platform and Applications Overview
The Atlas AI security and GRC portfolio is delivered as a set of licensed applications running on top of a shared platform. Use this page to orient yourself: it explains what belongs in the application layer, what belongs in shared platform services, how licensing affects what you see, and where to go next for architecture, organizations and projects, navigation, and individual feature workflows.

## Applications vs Platform Services[​](#applications-vs-platform-services)
The product is organized into two layers:

- **Applications** are licensed, outcome-oriented workspaces that you spend most of your time in. Each application focuses on a specific job — discovering AI assets, governing usage, red-teaming models, evaluating runtime traffic, investigating activity, scanning for compliance, managing third-party AI risk, and so on. Applications appear in the **Features** group of the left navigation when your license entitles you to them.
- **Platform Services** are the shared capabilities that every application relies on: onboarding the data plane, administering users and projects, integrating with your existing tools, encrypting your data, and providing programmatic access through the API. Most platform services are reached from the **Admin Console** or are configured once during onboarding rather than visited day-to-day.

For administrators, the distinction matters because access to applications is governed primarily by license tiers and entitlements, while access to platform-service surfaces such as the Admin Console additionally depends on the permissions assigned to your user.

For application owners and analysts, the distinction matters because each application page documents its own workflows and tabs, while platform-service pages document the cross-cutting setup that makes those workflows possible.

## Applications[​](#applications)
The current Features menu groups the following applications. Each entry links to its dedicated documentation page; the page title in the UI is shown in **bold** where the documentation filename differs.

- [**AI 360**](/_docs/docs/applications/ai_360) — Executive summary view that rolls up posture, usage, runtime, and compliance signals from across the portfolio.
- [**AI Inventory**](/_docs/docs/applications/ai_inventory) — Discover and assign AI assets — models, endpoints, datasets, agents — and use it as the entry point that other applications operate on.
- [**AI Usage**](/_docs/docs/applications/ai_usage) — Govern how people in your organization use AI: which assistants and tools are in use, how often, and against which policies.
- [**AI Red Team**](/_docs/docs/applications/ai_red_team) — Pentest your AI systems and evaluate models against safety, security, and quality criteria.
- [**AI SPM**](/_docs/docs/applications/ai_spm) — AI Security Posture Management across your discovered AI assets, with prioritized findings and remediation guidance.
- [**AI Runtime**](/_docs/docs/applications/ai_gateway) — Inspect and protect AI traffic at runtime, applying guardrails to prompts and responses sent to and from your AI systems by end users and applications.
- [**AI MCP**](/_docs/docs/applications/ai_mcp) — Govern Model Context Protocol servers and the tools they expose to AI agents.
- [**AI Investigation**](/_docs/docs/applications/ai_monitor) — Investigate runtime sessions, events, and issues to understand what happened and why.
- [**AI Compliance**](/_docs/docs/applications/ai_compliance) — Run compliance scans against AI-relevant frameworks and track findings to closure.
- [**AI Third-Party Risk Management**](/_docs/docs/applications/ai_tprm) (AI TPRM) — Assess and monitor third-party AI vendors and the AI risk they introduce.
- [**AI Incidents**](/_docs/docs/applications/ai_incidents) — Triage and report on AI incidents detected across the platform, with rollups and exportable reports.

When you do not have a license for a given application, its menu item is disabled. The list above reflects the active Features menu; some documentation filenames retain earlier names for URL stability.

## Platform Services[​](#platform-services)
Platform services are the shared infrastructure that every application depends on.

- [**Onboarding**](/_docs/docs/platform_services/onboarding) — Install and connect your data plane, register your first organization and project, and complete the prerequisites every application expects.
- [**Admin Console**](/_docs/docs/admin_console/) — Administer tenants, users, roles and permissions, integrations, runtime logging, and data-plane operations from a single console (see the summary below).
- [**Integration**](/_docs/docs/platform_services/integration) — Connect inbound and outbound systems — identity providers, cloud accounts, SIEM, ticketing, notification channels — so applications can act on your environment.
- [**Encryption**](/_docs/docs/platform_services/encryption) — Understand how customer data is encrypted at rest and in transit and how key management works across the control plane and data plane.
- [**API**](/_docs/docs/platform_services/api) — Use the programmatic API to automate inventory, posture, runtime, and investigation workflows.

### Admin Console at a glance[​](#admin-console-at-a-glance)
The Admin Console organizes shared administration into these groups, each of which is documented on the Admin Console page:

- **System Settings** — Company Profile, integrations, notifications, runtime logging, and service management.
- **Directory** — Organizations, projects, and users.
- **Permissions** — Roles and permission assignments that govern what each user can see and do.
- **Activity Logs** — System Audit Logs and related platform activity.
- **Data Plane** — Status and management of your installed data plane.
- **Runtime Evaluator LLM** — Configure the evaluator LLM used by runtime evaluation workflows.

Admin Console entry points appear only for users whose permissions include Admin Console access, in addition to whatever license tier the customer holds.

## Licensing and Entitlements[​](#licensing-and-entitlements)
Licensing determines which applications are available to your tenant. The system uses three additive tiers plus a prompt add-on:

- **Tier 1** is the base tier. It enables AI Inventory, AI SPM, AI Red Team (including penetration tests), AI MCP, and the executive view in AI 360.
- **Tier 2** adds security-oriented applications on top of Tier 1: AI Usage, AI Runtime, and AI Investigation. AI Incidents surfaces alongside these runtime/investigation workflows.
- **Tier 3** adds compliance-oriented applications on top of Tier 2: AI Compliance and AI Third-Party Risk Management.

Two additional concepts shape what your tenant can do:

- **Project allowance.** Your license includes a project allowance. Creating a project beyond that allowance is blocked until the allowance is increased or projects are removed. Organizations and projects are described on the [Organizations and Projects](/_docs/docs/overview/orgs_and_projects) page.
- **Prompt cap and prompt add-on.** Runtime-evaluating applications consume a monthly prompt allowance. A separate prompt add-on increases that monthly cap independently of the tier.

Two visibility rules follow from these mechanics:

- Entitlements may disable Features menu items. If a menu item is disabled, the corresponding application is not part of your current license.
- Admin Console visibility additionally depends on Admin Console permissions assigned to your user. A user can hold a Tier 3 license and still see no Admin Console entry if their role does not grant Admin Console access.

If you are unsure which tier or add-ons your tenant has, your account team can confirm — the customer-facing UI does not surface internal pricing codes.

## Related pages[​](#related-pages)

- [Architecture](/_docs/docs/overview/architecture) — Control plane, data plane, data residency, and how runtime and observability fit together.
- [Organizations and Projects](/_docs/docs/overview/orgs_and_projects) — How tenants are partitioned and how project allowance is enforced.
- [GUI Navigation](/_docs/docs/overview/gui_navigation) — Left navigation, top tabs, and organization selector mechanics.
- [Admin Console](/_docs/docs/admin_console/) — Full reference for administration surfaces summarized above.
- [Onboarding](/_docs/docs/platform_services/onboarding) — Data-plane installation and platform setup.
- [Integration](/_docs/docs/platform_services/integration) — Inbound and outbound integration categories and configuration.
- [AI Inventory](/_docs/docs/applications/ai_inventory) — The common starting point for assigning AI assets that other applications operate on.
[NextArchitecture Overview](/_docs/docs/overview/architecture)- [Applications vs Platform Services](#applications-vs-platform-services)- [Applications](#applications)- [Platform Services](#platform-services)[Admin Console at a glance](#admin-console-at-a-glance)- [Licensing and Entitlements](#licensing-and-entitlements)- [Related pages](#related-pages)
