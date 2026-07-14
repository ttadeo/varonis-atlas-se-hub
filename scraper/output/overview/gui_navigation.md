---
title: GUI Navigation
url: https://prod.alltrue-be.com/_docs/docs/overview/gui_navigation
section: overview
---

# GUI Navigation

- [](/_docs/)- Overview- GUI NavigationExport PDFOn this page# GUI Navigation
This page orients you to Atlas user interface — how the workspace is laid out, how to move between applications, how to scope what you see to a specific organization or project, and how administrators switch to the separate Admin Console navigation.

It is not a feature reference. For details on each application, follow the cross-links from the application reference below.

## Layout at a glance[​](#layout-at-a-glance)
Atlas UI is organized around four elements:

- A **main panel** in the center that shows the currently selected view.
- A **left navigation** that lists the applications and functional areas you can open.
- A **top bar** with per-application tabs, search, documentation, notifications, and your user menu.
- An **organization and project selector** at the top-left that scopes the data shown in the main panel.

An alternative layout is also supported: it omits the top bar and places per-application sub-items in the left navigation instead. The information you can reach is the same; only the placement of the per-application tabs differs.

Selecting an application from the left navigation updates the top tabs to that application's views (for example, dashboards, issue lists, policies). Each selection updates the main panel based on the chosen application and view. For example, opening **AI Inventory** and selecting the **Technologies** tab shows the technologies in use, filtered by the organization or project you have selected.

## Left navigation[​](#left-navigation)
The left navigation lists the applications you can open. The order and content match the current product registration. Hidden, internal-only, or unreleased surfaces are not shown here.

ApplicationWhat it is forPrimary tabs**AI 360**Executive view of AI risk posture across the platform.Dashboard, Report**AI Inventory**Discovers and catalogs AI technologies, models, and configurations in your environment.Dashboard, Technologies, Configuration, Issues, Report**AI Usage**Tracks how employees use AI tools and applies usage policies.Dashboard, Users, Policies, Issues, Report**AI Red Team**Runs adversarial tests and evaluations against your AI systems.Dashboard, PenTests, **Evaluate**, Datasets, Issues, Report**AI SPM**AI security posture management for models, configurations, and policies.Dashboard, Policies, Model Scan, Issues, Report**AI Runtime**Runtime protection for AI traffic, including policies and issues for in-flight requests.Dashboard, Policies, Issues, Report**AI MCP**Catalog, virtual MCPs, activity, and policies for Model Context Protocol surfaces.Catalog, Virtual MCPs, Activity, Policies, Issues, Report**AI Investigation**Session-level visibility into AI activity for investigation and response.Dashboard, Sessions, Events, Issues, Report**AI Compliance**Compliance audit, hub, and Compass workspace for AI controls.Dashboard, Audit, Hub, Compass, Issues, Report**AI Third-Party Risk Management**Manages AI risk from third-party vendors. After first reference, also called AI TPRM.Dashboard, Vendors, Policies, Issues, Report**AI Incidents**Tracks AI-related incidents and incident configuration.Dashboard, Configuration, Incidents, Report
A **Home** entry sits above the application list and returns you to your starting view.

## Top bar[​](#top-bar)
The top bar provides controls that apply across the platform:

- **Per-application tabs.** The tabs shown match the application you have open in the left navigation. Selecting a tab updates the main panel.
- **Organization and project selector.** See [Organization and project selector](#organization-and-project-selector) below.
- **Search.** Opens a search dialog that finds in-product destinations and documentation.
- **Documentation.** Opens the documentation site in a new tab.
- **Notifications.** Shows your recent notifications and a link to notification preferences.
- **User menu.** Provides account actions, sign-out, and — when you have administrative access — a link to the Admin Console.

## Organization and project selector[​](#organization-and-project-selector)
The selector at the top-left controls the data shown in the main panel. You can choose:

- **All Organizations** — the broadest scope; shows data aggregated across every organization and project you can access.
- **An organization** — scopes the view to that organization, including all projects you can access within it.
- **A specific project** — scopes the view to a single project within an organization.

The selector includes a search box for finding an organization or project by name. Your current scope is reflected in the URL, so links you copy preserve the scope you were viewing.

If you open a link to a scope you do not have access to, the UI returns you to a default scope you can access. For background on the hierarchy itself, see [Organizations and Projects](/_docs/docs/overview/orgs_and_projects). The platform-level overview is in [Platform and Applications](/_docs/docs/overview/platform_and_applications), and infrastructure context is in [Architecture](/_docs/docs/overview/architecture).

## What you see depends on your access[​](#what-you-see-depends-on-your-access)
The applications, tabs, and Admin Console areas available to you depend on three things:

- **Role permissions.** Your assigned role determines which destinations you can open. If a destination requires a permission you do not have, it is hidden or you see an access-denied state.
- **Entitlement tier.** Some applications are available only at higher entitlement tiers. When you do not have access at your current tier, the destination is disabled and a brief upgrade note is shown.
- **Organization and project assignment.** You only see data for the organizations and projects you are assigned to.

Two people viewing the same Atlas may see different navigation. This is expected.

## Admin Console navigation[​](#admin-console-navigation)
When you have administrative access, your user menu includes a link to the **Admin Console**. The Admin Console has its own left navigation and top bar, and it does not show the organization and project selector — administrative settings apply across the platform.

The Admin Console groups its destinations as:

- **System Settings** — Company Profile, SIEM, Service Management, Integrations, Notifications, Runtime Logging, Log Sources.
- **Directory** — Organizations, Projects, Users.
- **Permissions** — User Roles, API Keys.
- **Activity Logs** — System Audit Logs.
- **Data Plane** — Status, Management.
- **Runtime Evaluator LLM** — Credentials, Budget.

To leave the Admin Console, use **Back to Application** in the Admin Console top bar. You return to the application UI at the scope you were last viewing.

For detailed administration guidance, see [Admin Console](/_docs/docs/admin_console/).
[PreviousOrganizations and Projects Overview](/_docs/docs/overview/orgs_and_projects)[NextAI 360](/_docs/docs/applications/ai_360)- [Layout at a glance](#layout-at-a-glance)- [Left navigation](#left-navigation)- [Top bar](#top-bar)- [Organization and project selector](#organization-and-project-selector)- [What you see depends on your access](#what-you-see-depends-on-your-access)- [Admin Console navigation](#admin-console-navigation)
