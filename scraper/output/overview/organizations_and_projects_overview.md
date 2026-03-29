---
title: Organizations and Projects Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/orgs_and_projects
section: overview
---

# Organizations and Projects Overview

- [](/_docs/)- Overview- Organizations and Projects Overview# Organizations and Projects Overview
The TRiSM Hub consolidates information about all your AI systems, projects and usage so that you can get a clear an concise view into the risk AI might introduce to your organization. As such, the TRiSM hub catalogs, monitors, tracks and protects a great number of AI systems, potentially being developed and/or used by different business units (BUs) geographies and teams.

To provide good access control to this data and ensure that the right people see and manage the appropriate AI systems, the system enforces a model based on organizations and projects.

When you are onboarded to the TRiSM Hub platform your company has a single customer ID and everything you can access or see belongs only to this customer ID. When you get onboarded you have one organization (the Default Organization) and that organization has one project (the Default Project). If your company is small and you have only one AI system this may suffice and you can do all your work within that organization and project. In most cases however, the company has many AI systems and many usages of AI. Different BUs many each be developing or using their own AI systems, different vendors might be managed separately (each introducing AI into your supply chain) etc.

When you work with the TRiSM Hub you will usually create multiple organizations and each organization will typically have multiple projects. A project will usually contain a single AI system and an organization is a container of projects. Neither of these need to align with your BUs and organizations and you are free to structure your hierarchy anyway you see fit. However, remember that data is aggregated by these definitions - e.g. technology lists and issues list are shown per project or per organization (i.e. all projects within that organization). Furthermore, there are certain limitations on how many AI assets of a certain type can belong to a project.

Limitations include:

- 
Each endpoint API Key must be unique to a single project (using an identifier added to the header) in order to apply gateway policies.

- 
Each requirements.txt file must be unique to a single project in discovery.

- 
Each Cloud Account must be assigned to exactly one organization

To take full advantage of the benefits of our system, you should structure projects to reflect AI Systems, which we define as each application that implements AI techniques to learn, reason, and make decisions designed to address a particular function or goal.

Distinct projects are important because they allow you to:

- 
Apply custom policies at an AI System level that reflect the nuances of the system, such as specific configuration policies, gateway rules, and access controls.

- 
Perform targeted compliance audits in a manner that aligns with how regulations are written, avoiding the imposition of 'high-risk' requirements on a broader spectrum of features than necessary.

- 
Achieve granular visibility with respect to inventory, logs, and issues.

Organizations serve as containers for projects within the application, allowing you to organize your portfolio and apply features according to your organizational structure. Organizations are intended to reflect segregation within the company's structure - teams with distinct cloud accounts, distinct AI Systems, and distinct security needs would be expected to utilize different organizations to maximize the benefits of the platform. This provides meaningful visibility across your organizational structure and allows the assignment of organization-wide policies without affecting other independent organizations. Each Cloud Account must be assigned to exactly one organization, though customers can assign multiple cloud accounts to the same organization as needed.

Users with the Admin role can manage the organizational hierarchy in the [admin console](/_docs/docs/platform_services/admin_console) and create, update or delete organizations and projects.
[PreviousArchitecture Overview](/_docs/docs/overview/architecture)[NextGUI Overview](/_docs/docs/overview/gui_navigation)
