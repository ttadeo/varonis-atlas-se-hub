---
title: Organizations and Projects Overview
url: https://prod.alltrue-be.com/_docs/docs/overview/orgs_and_projects
section: overview
---

# Organizations and Projects Overview

- [](/_docs/)- Overview- Organizations and Projects OverviewExport PDF# Organizations and Projects Overview
Atlas consolidates information about all your AI systems, projects, and usage so that you can get a clear and concise view into the risk AI might introduce to your organization. As such, Atlas catalogs, monitors, tracks, and protects a large number of AI systems that may be developed and/or used by different business units (BUs), geographies, and teams.

To provide good access control to this data and ensure that the right people see and manage the appropriate AI systems, the system enforces a model based on organizations and projects.

When you are onboarded to the Atlas platform, your company has a single customer ID, and everything you can access or see belongs only to this customer ID. When you are first onboarded, you have one organization (the Default Organization) and that organization has one project (the Default Project). If your company is small and has only one AI system, this may suffice, and you can do all your work within that organization and project. In most cases, however, the company has many AI systems and many uses of AI. Different BUs may each be developing or using their own AI systems, different vendors might be managed separately (each introducing AI into your supply chain), etc.

When you work with Atlas, you will usually create multiple organizations, and each organization will typically have multiple projects. A project usually contains a single AI system, and an organization is a container of projects. Neither of these needs to align with your BUs and organizational structure, and you are free to structure your hierarchy any way you see fit. However, remember that data is aggregated by these definitions -- for example, technology lists and issue lists are shown per project or per organization (i.e., all projects within that organization). Furthermore, there are certain limitations on how many AI assets of a certain type can belong to a project.

Limitations include:

- 
Each endpoint API Key must be unique to a single project (using an identifier added to the header) in order to apply runtime policies.

- 
Each requirements.txt file must be unique to a single project in discovery.

- 
Each cloud account must be assigned to exactly one organization.

To take full advantage of the platform, you should structure projects to reflect AI systems, which we define as each application that implements AI techniques to learn, reason, and make decisions designed to address a particular function or goal.

Distinct projects are important because they allow you to:

- 
Apply custom policies at an AI System level that reflect the nuances of the system, such as specific configuration policies, runtime protection, and access controls.

- 
Perform targeted compliance audits in a manner that aligns with how regulations are written, avoiding the imposition of 'high-risk' requirements on a broader spectrum of features than necessary.

- 
Achieve granular visibility with respect to inventory, logs, and issues.

Organizations serve as containers for projects within the application, allowing you to organize your portfolio and apply features according to your organizational structure. Organizations are intended to reflect segregation within the company's structure -- teams with distinct cloud accounts, distinct AI systems, and distinct security needs would be expected to use different organizations to maximize the benefits of the platform. This provides meaningful visibility across your organizational structure and allows the assignment of organization-wide policies without affecting other independent organizations. Each cloud account must be assigned to exactly one organization, though customers can assign multiple cloud accounts to the same organization as needed.

Users with the Admin role can manage the organizational hierarchy in the [Admin Console](/_docs/docs/admin_console/) and create, update, or delete organizations and projects.
[PreviousArchitecture Overview](/_docs/docs/overview/architecture)[NextGUI Navigation](/_docs/docs/overview/gui_navigation)
