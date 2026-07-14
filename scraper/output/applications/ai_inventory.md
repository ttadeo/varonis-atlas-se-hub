---
title: AI Inventory
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_inventory
section: applications
---

# AI Inventory

- [](/_docs/)- Applications- AI InventoryExport PDFOn this page# AI Inventory
Use the AI Inventory application to create and manage a catalog of AI resources used within your AI systems. Track development projects involving AI in one place and maintain visibility over all AI resources used across projects. An AI resource, or asset, encompasses anything used in AI development, such as an LLM endpoint, a model, a library, and more.

Resources belong to technologies, and each technology has a type. For example, you may use various instances of Langchain; each instance is a resource, the technology is Langchain, and the type is AI Software. Similarly, if you use multiple OpenAI API Keys, each API Key represents a resource, categorized under the OpenAI Endpoint technology with a type of LLM Endpoint.

The AI Inventory dashboard provides an at-a-glance overview of your AI asset landscape, including total resource and technology counts, discovery asset metrics, and technologies categorized by inventory type: AI Platform-as-a-Service, AI Models, AI Software, and AI Services. Each inventory section displays key details such as resource counts, organizational usage, and review status, helping you monitor and manage AI resources effectively.

## Technologies[​](#technologies)
View all your AI resources on this tab. Resources are discovered by inspecting cloud accounts, code repositories, and BOM-type documents. Discovered resources are then categorized, cataloged, and assigned to projects.

To get started, connect your environments by clicking the Add New button, selecting the type of discovery source to add, and then providing access for automated discovery.

Once resources have been added (e.g. from a cloud account), assign them to the appropriate project and review them.

## Discovery Configuration[​](#discovery-configuration)
Resources are typically added to your AI Inventory automatically through scans, but they can also be added manually. Atlas can auto-discover your inventory by scanning your infrastructure (e.g., a cloud account) or by scanning code and code artifacts. For cloud accounts, click Link New Account; code scanning, hosted services, and MCP each use their own linking flow on their respective Configuration tab. Discovery configurations are viewed in the four tabs on the Configuration screen (Cloud Accounts, Code Scanning, Hosted Services, and MCP). Scans run nightly via the ETL system, but you can trigger a discovery scan by clicking the three dots and selecting Run Discovery.

For the full list of the cloud providers, hosted services, and resource types Atlas inventories, see [Supported Services](/_docs/docs/applications/ai_inventory/supported_services).

### Adding a new Cloud Account[​](#adding-a-new-cloud-account)
Cloud account scanning has moved to its own page. See [Cloud Scanning](/_docs/docs/applications/ai_inventory/cloud_scanning) for the full workflow, and the [Providers](/_docs/docs/providers) pages for per-provider setup instructions.

### Adding a Code Repository[​](#adding-a-code-repository)
Code repository scanning is documented on the [Code Scanning](/_docs/docs/applications/ai_inventory/code_scanning) page, including supported version-control providers, the configuration form, and scan types.

### Adding a Hosted Service[​](#adding-a-hosted-service)
Hosted-service discovery is documented on the [Hosted Services](/_docs/docs/applications/ai_inventory/hosted_services) page, including the supported providers and the linking workflow.

### Adding a Resource Manually[​](#adding-a-resource-manually)
Manual addition allows you to capture specific resources that may not be identified during automated scans, ensuring your inventory remains complete and up to date. To add a resource manually, navigate to the Technologies tab and click the Add New button. Then select Add New Resources Manually, choose the type of resource you want to add, and fill in the required information. Click Add to Inventory to finalize the addition.

Some resources, such as LLM Endpoints and Vector Stores, can only be added manually and are not discoverable through automated scanning. Other resources, like Models and Libraries, are typically discovered through automated scans but can also be added manually to supplement automated discovery.

#### LLM Endpoints[​](#llm-endpoints)
To add an LLM Endpoint, start by selecting the Provider from the dropdown menu, such as OpenAI, Azure OpenAI, or other supported providers. Enter the API Key for the LLM, which must be unique to a single project. If you are using shared API keys across multiple AI systems, use the Endpoint Identifier field to differentiate each endpoint use case. Next, select the Project to which this LLM Endpoint will be assigned. Note: Each API Key can only be associated with one project.

For Azure OpenAI Endpoints, additional information is required, including the Resource Name and Deployment Name, which can be found in your Azure platform.

Once all required information is entered, click Add to Inventory to finalize the addition of the LLM Endpoint to your project’s inventory. Click the “+” button to add multiple LLM Endpoints simultaneously.

#### Models[​](#models)
To add a model, start by selecting the Storage Source for the model. Supported storage options include cloud storage services and Hugging Face Hub.

If you select a cloud storage option, you can choose from AWS S3, GCP Bucket, or Azure Blob. For cloud-stored models, you’ll need to provide specific details, such as the Cloud Account, Region, Bucket, and Storage Path to enable access to the model.

For models stored on Hugging Face Hub, select "Hugging Face Hub" as the storage source and enter the Model ID to validate the model. The Model ID can be found at the top of the model’s page on Hugging Face. Additionally, specify the Model Revision (default is "main") to ensure the correct version is added to the inventory.

In addition to specifying the storage details, choose the Model Type from the dropdown menu to classify the model appropriately. Finally, select the project to which the model should be assigned. You can assign the model to multiple projects simultaneously by using the “+” button to specify additional projects.

Once all the required information is entered, click Add to Inventory to finalize the addition of the model. Click the “+” button to add multiple Models simultaneously.

#### Libraries[​](#libraries)
To add a library to your inventory, start by selecting the Library Name from the dropdown menu. If the library you are looking for does not appear in the list, contact your Account Manager to have the library added.

Next, enter the Library Version in the format 0.0.0 or 0.0.0.0 as applicable. Note: Only final release versions are supported at this time. Do not include extra characters such as "v".

Select the Programming Language from the options available, which currently include Python and Go. Finally, select the project to which the library should be assigned. You can assign the library to multiple projects simultaneously by using the “+” button to specify additional projects.

Once all required information is entered, click Add to Inventory to complete the addition of the library. Click the “+” button to add multiple Libraries simultaneously.

## Resource Details Page[​](#resource-details-page)
The Resource Details page provides in-depth information about each resource, including an overview, properties, and summaries of applicable system features. On this page, you can view specific details such as resource descriptions, configuration settings, active protections, and any associated issues. Access the Resource Details page by navigating to the Technologies tab, selecting a technology, and choosing a resource from the list under that technology.

The Overview section provides a high-level description of the resource, along with an Insights Summary that highlights critical issues, vulnerabilities, or findings. The insights displayed vary by resource type; for example, libraries show vulnerabilities, while LLM Endpoints include runtime and penetration test results. The Properties section lists attributes of the resource, such as the Resource Name, Identifier, Resource Category, Resource Status, Programming Language, and other metadata like Library Version for libraries or Endpoint Identifier for LLM Endpoints.

Several actions can be performed directly on this page:

- Edit Resource Name: Click the pencil icon next to the resource name at the top of the page.
- Edit Project Associations: Click Edit Projects to adjust the projects associated with the resource.
- Delete Resource: Use this button to remove the resource from your inventory.

For LLM Endpoint resources with pentest connection details configured, the Properties section displays the **Pentest URL** — the target URL used when running penetration tests against the endpoint. You can edit the Pentest URL inline by clicking the pencil icon next to the URL. After saving, the system re-validates the full connection using the new URL with your existing credentials. If validation succeeds, the URL is updated and a success notification appears. If validation fails (for example, the new URL is unreachable or incompatible with the stored credentials), the original URL is preserved and an error notification appears. The Pentest URL is hidden for resources that do not have pentest connection details configured.

Some resources offer unique buttons for specific functionalities. For example, LLM Endpoints include an Initiate PenTest button to start a penetration test on the endpoint, and a Runtime Policies button for configuring runtime settings.

The Resource Details page includes tabs that vary by resource type, enabling quick navigation to relevant feature summaries. For example:

- LLM Endpoints have Runtime and PenTest tabs to view active runtime policies and completed penetration tests.
- Libraries have a Vulnerabilities tab to highlight potential security risks.
- Cloud resources include Configuration and Misconfigurations tabs to monitor compliance and identify security gaps.

By utilizing the Resource Details Page, you gain centralized access to all pertinent information, configurations, and actions available for managing and securing each resource within your organization’s inventory.

## Assigning Resources to Projects[​](#assigning-resources-to-projects)
Resources are organized within projects to help you govern the usage of AI assets within logical containers. There are some limitations regarding the assignment of resources to projects:

- Projects can include multiple cloud accounts and these accounts can be of the same type.
- Cloud accounts are not unique at the project level.
- Each endpoint API Key must be unique to a single project (using an identifier added to the header).
- Each dependency file must be unique to a single project in discovery.
- A code repository can be assigned to one or more projects in discovery.

Resources discovered through cloud scans will be automatically assigned to the default project. To assign these resources to other projects, navigate to Technologies &gt; Add New &gt; Assign Cloud Resources. Select the cloud account, choose the projects you want to distribute the resources to, and mark the various checkboxes as appropriate.

## Editing Resource Project Assignments[​](#editing-resource-project-assignments)
To manage project assignments for a resource, you can use either the Technologies page or the Resource Details page.

- From the Technologies Page: Select the desired technology, locate the specific resource in the list, click the three-dot menu, and choose Edit Projects from the dropdown.
- From the Resource Details Page: Click the Edit Projects button.

Once in the project assignment editor, you can add or remove project assignments for the resource. Each resource must remain assigned to at least one project. When reassigning a resource to a different project, any associated issues will be automatically moved to the updated project and displayed there. Note that project-specific policies from the former project will no longer apply, and policies specific to the new project(s) will be enforced for the resource.

## Deleting Resources[​](#deleting-resources)
To delete a resource, you can choose either the Technologies page or the Resource Details page:

- From the Technologies Page: Select the desired technology, locate the specific resource in the list, click the three-dot menu, and choose Delete Resource from the dropdown.
- From the Resource Details Page: Click the Delete Resource button.

Deleting a resource from either of these locations removes it from all assigned projects. If you wish to remove a resource from only one specific project, use the Edit Projects option instead. Once a resource is deleted, all associated issues are automatically remediated, active policies no longer apply, and Varonis features related to the resource cease functioning.

## Reviewing Resources and Technologies[​](#reviewing-resources-and-technologies)
To manage the approval process for your AI resources, navigate to the Technologies tab. Here, you can review, categorize, and manage each resource under your AI technologies. The Dashboard tab also provides an overview of your AI resources, categorizing them into PaaS, Models, Software, and Services. Selecting any category on the Dashboard directs you to the Technologies tab, displaying relevant resources based on your selection.

Each technology may contain one or more resources. Select a technology to view all associated resources -- either within the current project, across the organization, or spanning all organizations, as defined by the top-left dropdown menu. Clicking a specific resource opens the Resource Details page, which provides detailed information such as resource properties (including a model card if applicable), vulnerabilities and misconfiguration issues detected by the AI SPM application, pentest findings, runtime protection, and other aggregated data managed within Atlas. This view provides a unified perspective on each AI resource.

When a resource is first discovered or added, it is automatically categorized under its technology and assigned an initial status of unreviewed. Resources can be reviewed in two ways:

- Reviewing by Resource Type: On the Technologies page, select the relevant technology, click the three-dot menu, and choose Review Resource Type. This option allows you to review all resources of the same type simultaneously.

- Reviewing Individual Resources: From the Resource Details page, click on the Resource Review Status field to update the review status of a specific resource.

In both cases, resources can be marked as Approved or Rejected. Rejected resources receive an "unapproved" status. Ensure that all new resources are reviewed to mitigate Shadow AI Risks.

If any resource within a technology remains unapproved, the technology itself will display an unapproved status until the unapproved resource is removed from inventory. Unapproved resources are clearly marked in the AI Inventory Dashboard, with counts displayed for easy tracking. Additionally, you can filter the technologies and resource lists by review status, simplifying the identification of unapproved items that remain active across your AI assets.

## Generating an AI-BOM[​](#generating-an-ai-bom)
An AI Bill of Materials (AI-BOM) provides a comprehensive inventory of AI components, resources, and dependencies within a project, helping organizations manage and track their AI assets for compliance and security.
To generate an AI-BOM:

- Go to the Technologies tab and click the AI-BOM button.
- Select the project for which you want to generate the BOM from the Select Project dropdown menu.
- Previous versions of the AI-BOM for the selected project are listed below, showing the date and time they were generated. You can download any of these prior versions by clicking the download icon.
- To create a new AI-BOM, click the Generate New File button. This will generate an up-to-date AI-BOM that can be downloaded in CycloneDX format.

## Configuration[​](#configuration)
The Discovery Configuration page within the AI Inventory tab provides an organized view of all linked discovery assets that contribute to building your AI inventory. It includes four distinct tabs:

- 
**Cloud Accounts:** Displays all connected cloud accounts, showing details such as the cloud platform (e.g., AWS, Azure), the associated projects, the number of AI resources discovered, and status. Use the Link New Account button to add additional cloud accounts.

- 
**Code Scanning:** Shows linked code repositories configured for code scanning, detailing the projects associated, the types of scans configured, the number of AI resources detected, and status. Use the Link New Repository button to connect additional repositories.

- 
**Hosted Services:** Hosted Services enable discovery of AI assets managed by external AI providers, such as OpenAI. When a service is linked, the platform scans the provider's API and automatically inventories hosted models, fine‑tuned models, assistants, files, vector stores, and other supported entities.
Use Link New Hosted Service to connect a provider using API keys and assign discovered assets to the correct project.

- 
**MCP:** The MCP tab lists all connected Model Context Protocol servers. MCP integrations allow the platform to discover AI agent tools and capabilities exposed through MCP‑compatible endpoints. Use Connect New MCP to register a new MCP server, test connectivity, configure authentication, and assign the integration to a project.

For each discovery asset, additional details are accessible by expanding the row with the dropdown arrow on the left. This allows for a closer look at specific configurations and related information.

### From the Configuration page, you can:[​](#from-the-configuration-page-you-can)
**Link New Assets:** Add new cloud accounts, code repositories, hosted services, or MCP servers.

**Initiate a Scan:** Run a manual scan for any configured discovery asset. Updated or newly discovered resources will automatically appear in the inventory.

**Edit Configurations:** Modify existing configurations (e.g., update credentials, change project assignment). Editing triggers an immediate rescan.

**Delete Configurations:** Remove a discovery asset. Deleting a configuration marks all associated resources as deleted in your inventory.

**Manage Discovery Policy:** Control which types of AI resources are collected across all discovery sources.

This configuration page provides a central point to manage your discovery assets, ensuring that your AI inventory remains current and complete.

## Discovery Policy[​](#discovery-policy)
A Discovery Policy panel is available within the Configuration page to control which categories of AI resources are collected during automated scans. Administrators can enable or disable discovery for specific resource types across cloud accounts, hosted services, code repositories, and MCP sources.

**Supported categories include:**

- AI Services
- AI Software
- AI Models
- LLM Endpoints
- Vector Databases
- Jupyter Notebooks
- Datasets
- Cloud‑Hosted Models
- Chatbots
- AI Pipelines
- Agentic components
- Model Artifacts

Adjusting these policies influences future scans and helps organizations tailor discovery to their governance requirements.

## Inventory Issues[​](#inventory-issues)
As resources and technologies are discovered and loaded into the system, issues are generated to help you track and manage the composition of your AI systems.

- Shadow AI Issues: These include resources that have not been reviewed, have been rejected (unsanctioned), or have been discovered and added to the default project without being properly assigned to their correct projects.
- Unprotected AI Issues: These issues are generated for resources where protections available within the platform -- such as adding AI Runtime Protection to an LLM endpoint or scanning a model in inventory -- have not been activated by the customer.

Note that these issues are generated only for newly discovered resources and do not include those flagged by AI SPM scans.

## Report[​](#report)
This tab provides a comprehensive report of all Shadow AI and Unprotected AI issues identified in your AI inventory, allowing you to search and filter issue data to customize the report as needed. Use the search bar and filter options to refine the report view, and save customized reports by clicking the Save button. To generate and download a report in CSV or XLSX format, click the Reporting button.
[PreviousAI 360](/_docs/docs/applications/ai_360)[NextCode Scanning](/_docs/docs/applications/ai_inventory/code_scanning)- [Technologies](#technologies)- [Discovery Configuration](#discovery-configuration)[Adding a new Cloud Account](#adding-a-new-cloud-account)- [Adding a Code Repository](#adding-a-code-repository)- [Adding a Hosted Service](#adding-a-hosted-service)- [Adding a Resource Manually](#adding-a-resource-manually)- [Resource Details Page](#resource-details-page)- [Assigning Resources to Projects](#assigning-resources-to-projects)- [Editing Resource Project Assignments](#editing-resource-project-assignments)- [Deleting Resources](#deleting-resources)- [Reviewing Resources and Technologies](#reviewing-resources-and-technologies)- [Generating an AI-BOM](#generating-an-ai-bom)- [Configuration](#configuration)[From the Configuration page, you can:](#from-the-configuration-page-you-can)- [Discovery Policy](#discovery-policy)- [Inventory Issues](#inventory-issues)- [Report](#report)
