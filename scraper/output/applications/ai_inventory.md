---
title: AI Inventory
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_inventory
section: applications
---

# AI Inventory

- [](/_docs/)- Applications- AI InventoryOn this page# AI Inventory
Use the AI Inventory application to create and manage a catalog of AI resources utilized within your AI systems. Track development projects involving AI in one place, and maintain visibility over all AI resources used across projects. An AI resource, or asset, encompasses anything used in AI development, such as an LLM endpoint, a model, a library, and more.

Resources belong to technologies, and each technology has a type. For example, you may use various instances of Langchain; each instance is a resource, the technology is Langchain, and the type is AI Software. Similarly, if you use multiple OpenAI API Keys, each API Key represents a resource, categorized under the OpenAI Endpoint technology with a type of LLM Endpoint.

The AI Inventory dashboard provides an at-a-glance overview of your AI asset landscape, including total resource and technology counts, discovery asset metrics, and technologies categorized by inventory types including AI Platform-as-a-Service, AI Models, AI Software, and AI Services. Each inventory section displays key details like resource counts, organizational usage, and review status, helping you monitor and manage AI resources effectively.

## Technologies[​](#technologies)
View all your AI resources on this tab. Resources are discovered by inspecting cloud accounts, code repositories, and BOM-type documents. Discovered resources are then categorized, cataloged, and assigned to projects.

To get started, connect your environments by clicking the Add New button, selecting the type of discovery source to add, and then providing access for automated discovery.

Once resources have been added (e.g. from a cloud account), assign them to the appropriate project and review them.

## Discovery Configuration[​](#discovery-configuration)
Resources are typically added to your AI Inventory automatically through scans, but they can also be added manually. The TRiSM Hub can auto-discover your inventory by scanning your infrastructure (e.g. a cloud account), through uploading of dependency files, or by scanning code and code artifacts. Add a new scan target by clicking on the LinkNew Account button. Discovery configurations are viewed in the three tabs on the Configuration screen (Cloud Accounts, Dependency Files or Code Scanning). Scans run nightly by the ETL system but you can span a discovery scan by clicking the three dots and selecting Run Discovery.

### Adding a new Cloud Account[​](#adding-a-new-cloud-account)
Connect your cloud accounts to enable auto-discovery of your AI inventory as you build AI systems on the main AI clouds. You can add a cloud account either from the Technologies tab or the Configuration tab. In the Technologies tab you need to select the Add New Cloud Account tile whereas in the Configuration tab select the Link New Account button from the Cloud Accounts tab. Then choose from the following cloud providers:

- AWS
- Azure
- Google Cloud
- IBM Watsonx
- Databricks

Provide the required keys or credentials for access (different for each cloud source) and click Link Accounts to establish a connection.

Once the cloud account is linked, the scan will initiate automatically and discovered resources will be added to inventory upon successful completion. Initially, all discovered resources will be added to the Default Project and must then be reassigned to their respective projects using the Assign Cloud Resources tool. The scan will repeat nightly, capturing any updates or additions to the cloud account. New resources added to the cloud account will appear in the Default Project, while removed resources and version updates will be automatically reflected in inventory under their respective projects.

Ensure that the appropriate privileges are granted so the TRiSM Hub can perform the necessary read-only API calls for discovery. The following permissions are required per cloud; please review/request these from your Cloud Architecture team):

- AWS- Azure- Google Cloud- IBM WatsonX- DatabricksYou can link the tenant with your AWS account by running an AWS stack within your AWS account. This stack creates a role with ReadOnlyAccess to the AWS account and provides that role to the platform, as shown below:

To link an AWS account, follow the instructions provided in the interface. You have two options that leverage AWS CloudFormation:

- Manual Role Creation: Use the AWS Management Console to create the necessary role.
- Command Line Setup: Run the provided command in the AWS CLI terminal.
Once the roles are created and your AWS account is linked, click Test Connection to verify the setup and display a list of connected AWS accounts.
To complete this through the GUI, open one tab with your AWS account and another with the system, then click the Create Role button. Alternatively, you can download the CloudFormation script and run it from the AWS CLI.

You can either connect to an Azure account and add all your subscriptions or you can add only certain subscriptions. In either case the system will provide a command that you can copy to be run within your Azure account using azure-cli. See the screen in Cloud Accounts.
Create a service account with the Viewer role in your Google Cloud account. Within Google Cloud, navigate to IAM &amp; Admin and select Service Accounts. Click on + CREATE SERVICE ACCOUNT and enter a name and ID. Add the Viewer role from the predefined basic roles. In the service accounts list select the three dots under Actions and click on Manage keys. Create a service account key and when prompted choose a JSON key.
Download the generated key and copy this into the API Credentials field along with the account name you selected.
Follow IBM instructions for more details [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/admin/admin-apikeys.html?context=wx&amp;audience=wdp). You need to create a Service ID and give it access to their project:

- Access IBM Cloud &gt; IAM &gt; Manage Identities &gt; Service IDs [https://cloud.ibm.com/iam/serviceids](https://cloud.ibm.com/iam/serviceids)
- Click Create Service ID
- Give it a meaningful name and description then click create
- Leave Access Groups as is with Public Access
- In Access Policies, add the following 4 policies and assign them
Service: IAM Identity Service
Resources: All
Role: Operator
Conditions: None
Service: Cloud Object Storage
Resources: All
Role: Viewer
Conditions: None
Service: watsonx.data
Resources: All
Role: Viewer
Conditions: None
Service: Resource group only
Resources: Default resource group
Role: Viewer
Conditions: None
- Go to the API Keys tab and select Create
- Enter a meaningful name and description then choose Disable the leaked key
- Copy the API Key
- Go back to the project in IBM Watsonx [https://dataplatform.cloud.ibm.com/projects/?context=wx](https://dataplatform.cloud.ibm.com/projects/?context=wx)
- Select a project, choose the manage tab, select access control, under collaborators choose Add Collaborators and select Add Service IDs
- Search for the newly added Service ID by name, select it, give it a role of Viewer and then add it to the project
- Repeat for each project for which you want to add discovery permissions
Follow Databricks instructions for more details [here](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html#language-Python) and [here](https://docs.databricks.com/en/admin/users-groups/service-principals.html):

- Create a service principal in the account and assign it to relevant workspaces.
- Assign the Account Admin role to the Databricks service principal.
- Grant access to the principal for the “Service principal: User or Manager” role in Permission.
- Create an M2M OAth secret for the service principal.
- Enter the client secret and client ID in the Varonis screen.
To support observability follow the instructions [here](https://docs.databricks.com/en/security/auth-authz/access-control/service-principal-acl.html):

- Add metastore-level managed storage.
- Grant READ FILES and BROWSER permissions to your Unity Catalog external locations.

### Adding a Code Repository[​](#adding-a-code-repository)
Code scanning automatically discovers and tracks AI resources in your code repositories, identifying libraries, models, and notebooks relevant to your AI projects. To add a code repository for AI resource scanning, navigate to the Technologies tab and click the Add New button. Then, select Add New Repository and choose from the available Version Control Systems (GitHub, BitBucket, GitLab, or Azure Devops). You will need to provide an API key with the necessary permissions, which may require assistance from your repository admin.

In the Configure a Repository for Code Scanning form, enter the following required details (parameters may differ depending on code repo):

- Organization: Specify the VCS organization associated with the repository.
- Repository Name: Enter the name of the repository you wish to scan.
- API Key: Input the API key with the required access permissions.
- Branch: (Optional) Select the branch of the repository to scan.
- Programming Language: (Optional) Specify the primary programming language used.
- Project: Choose the project where these resources should be cataloged. Note that each code repository can only be connected to one project.

For GitHub you can either use a Personal Access Token or use the Varonis GitHub app. After entering the details, select the code scanning tools to implement:

- Dependency File Scanning: Detects AI-related libraries in files such as requirements.txt and Dockerfile, ensuring accurate tracking of dependencies across projects.
- Hugging Face Model Scanning: Identifies models hosted on Hugging Face referenced in your code, tracking pre-trained models used within the project.
- Jupyter Notebook Scanning: Finds Jupyter notebooks, classifying them as new, rediscovered, or missing, to maintain an up-to-date record of notebooks in your repository.

Once the repository is linked, the scan will initiate automatically and discovered resources will be added to inventory upon successful completion. The scan will then repeat nightly, capturing any updates or additions to the repository. New resources added to the repository will be assigned to the configured project, while removed resources and version updates will be automatically reflected in inventory.

### Adding a Hosted Service[​](#adding-a-hosted-service)
Hosted service integration enables automatic discovery of AI resources managed by third-party providers such as OpenAI. This is especially useful when your AI systems rely on services that are not deployed within your cloud infrastructure or source code repositories but are instead hosted externally. By linking a hosted service, you enable Varonis to inventory relevant endpoints, models, and associated assets through the service’s API.

To add a hosted service:

- Navigate to the AI Inventory section from the left navigation bar.
- Click on the Configuration tab at the top, then select the Hosted Services sub-tab.
- Click the Link New Hosted Service button in the upper right.

This opens the "Link Hosted Service" form. Choose a provider below to view additional information:

#### Connecting to OpenAI[​](#connecting-to-openai)
You can link your OpenAI account to the AI Inventory feature to automatically discover and monitor the resources you use via the OpenAI platform. Once connected, your hosted models, fine-tuning jobs, files and agents will be visible in inventory.

The prerequisites are:

- Access to your OpenAI account with sufficient permissions to generate API keys
- Access to Varonis with a user role that possesses Write permissions on the AI Inventory &gt; Configurations page

**Step1: Create an API Key in OpenAI**

An API Key allows Varonis to scan your OpenAI environment.

To create an API Key in OpenAI:

- Log in to the [OpenAI Platform](https://platform.openai.com/settings/organization/general) and access *Settings*.
- Click *API keys* and then select *Create new secret key*.
- Enter a meaningful name, e.g. “alltrue-projectXYZ-discovery”.
- Select the Project that you wish to discover.
- Select permissions *Read only*.
- Click *Create secret key*.
- Copy the secret key to a safe location. Note that the secret key cannot be viewed later. Do not proceed without copying it to a safe location.
- Click *Done*.

**Step 2: Link your OpenAI Service in the Varonis platform**

- Open the *Link Hosted Service* workflow.
- Select the *OpenAI* tile under “Choose AI Service Provider.”
- Enter a *Display Name* - choose something meaningful for this connection (e.g., OpenAI Connector - AI Project XYZ).
- Paste your OpenAI API Key
- (Optional) Paste an Admin API Key
- Click *Link Service*

**What Happens Next?**

Once linked, the platform will begin scanning your OpenAI account. Discovered resources will be categorized and added to your AI Inventory automatically.

Supported resources include:

- Models
- Fine-Tuned Models
- Assistants
- Files
- Vector Stores
- Fine-Tuning Jobs
- CustomGPTs

If you provided an admin key, usage data will be used to determine which LLM models you are using so they can be added to inventory.

### Using Dependency Files[​](#using-dependency-files)
Dependency File scanning automatically analyzes and catalogs AI-related libraries and dependencies used within your development projects. By uploading dependency files, you can quickly capture resources relevant to your AI systems, ensuring your inventory is accurate and up-to-date. To add a dependency file, navigate to the Technologies tab and click the Add New button. Then, select Add New Dependency File and complete the required information in the form.

Supported File Types include:

- requirements.txt, Dockerfile, or environment.yml for Python projects
- go.mod for Go projects

In the Add Dependency File form:

- Assign Project: Select the project to which these resources belong. Note that each dependency file can only be connected to one project.
- Dependency File ID: Enter a unique identifier for this file. Each combination of project and dependency file ID must be unique.
- Nickname: Provide a nickname for easy reference.
- Language and File: Choose the programming language and dependency file type.
- Upload File: Click Choose File to upload the dependency file.

After filling out the details, click Upload File to add the file. All discovered resources will be automatically assigned to the configured project.

Note: This is a point-in-time scan, meaning it captures the current state of dependencies and does not update automatically. To reflect changes in dependencies, you will need to re-upload the file.

### Adding a Resource Manually[​](#adding-a-resource-manually)
Manual addition allows you to capture specific resources that may not be identified during automated scans, ensuring your inventory remains complete and up-to-date. To add a resource manually, navigate to the Technologies tab and click the Add New button. Then, select Add New Resources Manually, choose the type of resource you want to add, and fill in the required information. Click Add to Inventory to finalize the addition.

Some resources, such as LLM Endpoints and Vector Stores, can only be added manually and are not discoverable through automated scanning. Other resources, like Models and Libraries, are typically discovered through automated scans but can also be added manually to supplement automated discovery.

- LLM Endpoints- Models- LibrariesTo add an LLM Endpoint, start by selecting the Provider from the drop down menu, such as OpenAI, Azure OpenAI, or other supported providers. Enter the API Key for the LLM, which must be unique to a single project. If you are using shared API keys across multiple AI Systems, use the Endpoint Identifier field to differentiate each endpoint use case. Next, select the Project to which this LLM Endpoint will be assigned. Note: Each API Key can only be associated with one project.
For Azure OpenAI Endpoints, additional information is required, including the Resource Name and Deployment Name, which can be found in your Azure platform.
Once all required information is entered, click Add to Inventory to finalize the addition of the LLM Endpoint to your project’s inventory. Click the “+” button to add multiple LLM Endpoints simultaneously.
To add a model, start by selecting the Storage Source for the model. Supported storage options include cloud storage services and Hugging Face Hub.
If you select a cloud storage option, you can choose from AWS S3, GCP Bucket, or Azure Blob. For cloud-stored models, you’ll need to provide specific details, such as the Cloud Account, Region, Bucket, and Storage Path to enable access to the model.
For models stored on Hugging Face Hub, select "Hugging Face Hub" as the storage source and enter the Model ID to validate the model. The Model ID can be found at the top of the model’s page on Hugging Face. Additionally, specify the Model Revision (default is "main") to ensure the correct version is added to the inventory.

In addition to specifying the storage details, choose the Model Type from the dropdown menu to classify the model appropriately. Finally, select the project to which the model should be assigned. Note that you can assign the model to multiple projects simultaneously by using the “+” button to specify additional projects.
Once all the required information is entered, click Add to Inventory to finalize the addition of the model. Click the “+” button to add multiple Models simultaneously.
To add a library to your inventory, start by selecting the Library Name from the dropdown menu. If the library you are looking for does not appear in the list, contact your Account Manager to have the library added.
Next, enter the Library Version in the format 0.0.0 or 0.0.0.0 as applicable. Note: Only final release versions are supported at this time. Do not include extra characters such as "v".
Select the Programming Language from the options available, which currently include Python and Go. Finally, select the project to which the library should be assigned. Note that you can assign the library to multiple projects simultaneously by using the “+” button to specify additional projects.
Once all required information is entered, click Add to Inventory to complete the addition of the library. Click the “+” button to add multiple Libraries simultaneously.

## Resource Details Page[​](#resource-details-page)
The Resource Details page provides in-depth information about each resource, including an overview, properties, and summaries of applicable system features. On this page, you can view specific details such as resource descriptions, configuration settings, active protections, and any associated issues. Access the Resource Details page by navigating to the Technologies tab, selecting a technology, and choosing a resource from the list under that technology.

The Overview section provides a high-level description of the resource, along with an Insights Summary that highlights critical issues, vulnerabilities, or findings. The insights displayed vary by resource type; for example, libraries show vulnerabilities, while LLM Endpoints include gateway and penetration test results. The Properties section lists attributes of the resource, such as the Resource Name, Identifier, Resource Category, Resource Status, Programming Language, and other metadata like Library Version for libraries or Endpoint Identifier for LLM Endpoints.

Several actions can be performed directly on this page:

- Edit Resource Name: Click the pencil icon next to the resource name at the top of the page.
- Edit Project Associations: Click Edit Projects to adjust the projects associated with the resource.
- Delete Resource: Use this button to remove the resource from your inventory.

Some resources offer unique buttons for specific functionalities. For example, LLM Endpoints include an Initiate PenTest button to start a penetration test on the endpoint, and a Gateway Policies button for configuring gateway settings.

The Resource Details page includes tabs that vary by resource type, enabling quick navigation to relevant feature summaries. For example:

- LLM Endpoints have Gateway and PenTest tabs to view active gateway policies and completed penetration tests.
- Libraries have a Vulnerabilities tab to highlight potential security risks.
- Cloud resources include Configuration and Misconfigurations tabs to monitor compliance and identify security gaps.

By utilizing the Resource Details Page, you gain centralized access to all pertinent information, configurations, and actions available for managing and securing each resource within your organization’s inventory.

## Assigning Resources to Projects[​](#assigning-resources-to-projects)
Resources are organized within projects to help you govern the usage of AI assets within logical containers. There are some limitations regarding the assignment of resources to projects:

- Projects can include multiple cloud accounts and these accounts can be of the same type.
- Cloud accounts are not unique at the project level.
- Each endpoint API Key must be unique to a single project (using an identifier added to the header).
- Each dependency file must be unique to a single project in discovery.
- Each code repository must be unique to a single project in discovery.

Resources discovered through cloud scans will be automatically assigned to the default project. To assign these resources to other projects, navigate to Technologies &gt; Add New &gt; Assign Cloud Resources. Select the cloud account, choose the projects you want to distribute the resources to, and mark the various checkboxes as appropriate.

## Editing Resource Project Assignments[​](#editing-resource-project-assignments)
To manage project assignments for a resource, you can use either the Technologies page or the Resource Details page.

- From the Technologies Page: Select the desired technology, locate the specific resource in the list, click the three-dot menu, and choose Edit Projects from the drop down.
- From the Resource Details Page: Click the Edit Projects button.

Once in the project assignment editor, you can add or remove project assignments for the resource. Each resource must remain assigned to at least one project. When reassigning a resource to a different project, any associated issues will be automatically moved to the updated project and displayed there. Note that project-specific policies from the former project will no longer apply, and policies specific to the new project(s) will be enforced for the resource.

## Deleting Resources[​](#deleting-resources)
To delete a resource, you can choose either the Technologies page or the Resource Details page:

- From the Technologies Page: Select the desired technology, locate the specific resource in the list, click the three-dot menu, and choose Delete Resource from the drop down.
- From the Resource Details Page: Click the Delete Resource button.

Deleting a resource from either of these locations will remove it from all assigned projects. If you wish to remove a resource from only one specific project, use the Edit Projects option instead. Once a resource is deleted, all associated issues will be automatically remediated, active policies will no longer apply, and Varonis features related to the resource will cease functioning.

## Reviewing Resources and Technologies[​](#reviewing-resources-and-technologies)
To manage the approval process for your AI resources, navigate to the Technologies tab. Here, you can review, categorize, and manage each resource under your AI technologies. The Dashboard tab also provides an overview of your AI resources, categorizing them into PaaS, Models, Software, and Services. Selecting any category on the Dashboard directs you to the Technologies tab, displaying relevant resources based on your selection.

Each technology may contain one or more resources. Select a technology to view all associated resources, either within the current project, across the organization, or spanning all organizations, as defined by the top-left dropdown menu. Clicking on a specific resource opens the Resource Details page which provides detailed information, such as resource properties (including a model card if applicable), vulnerabilities and misconfiguration issues detected by the AI SPM application, pentest findings, gateway rules, and other aggregated data managed within the TRiSM Hub. This view provides a unified perspective on each AI resource.

When a resource is first discovered or added, it is automatically categorized under its technology and assigned an initial status of unreviewed. Resources can be reviewed in two ways:

- Reviewing by Resource Type: On the Technologies page, select the relevant technology, click the three-dot menu, and choose Review Resource Type. This option allows you to review all resources of the same type simultaneously.

- Reviewing Individual Resources: From the Resource Details page, click on the Resource Review Status field to update the review status of a specific resource.

In both cases, resources can be marked as Approved or Rejected. Rejected resources receive an "unapproved" status. Ensure that all new resources are reviewed to mitigate Shadow AI Risks.

If any resource within a technology remains unapproved, the technology itself will display an unapproved status until the unapproved resource is removed from inventory. Unapproved resources are clearly marked in the AI Inventory Dashboard, with counts displayed for easy tracking. Additionally, you can filter the technologies and resource lists by review status, simplifying the identification of unapproved items that remain active across your AI assets.

## Generating an AI-BOM[​](#generating-an-ai-bom)
An AI Bill of Materials (AI-BOM) provides a comprehensive inventory of AI components, resources, and dependencies within a project, helping organizations manage and track their AI assets for compliance and security.
To generate an AI-BOM:

- Go to the Technologies tab and click the AI-BOM button.
- Select the project for which you want to generate the BOM from the Select Project drop down menu.
- Previous versions of the AI-BOM for the selected project are listed below, showing the date and time they were generated. You can download any of these prior versions by clicking the download icon.
- To create a new AI-BOM, click the Generate New File button. This will generate an up-to-date AI-BOM that can be downloaded in CycloneDX format.

## Configuration[​](#configuration)
The Discovery Configuration page within the AI Inventory tab provides an organized view of all linked discovery assets that contribute to building your AI inventory. It includes three distinct tabs:

- Cloud Accounts: Displays all connected cloud accounts, showing details such as the cloud platform (e.g., AWS, Azure), the associated projects, the number of AI resources discovered, and status. Use the Link New Account button to add additional cloud accounts.
- Dependency Files: Lists all uploaded dependency files (e.g., requirements.txt) used in the discovery process. Each file entry shows the organization usage, upload date, number of resources found, and status. You can add new dependency files with the Add New File button.
- Code Scanning: Shows linked code repositories configured for code scanning, detailing the projects associated, the types of scans configured, the number of AI resources detected, and status. Use the Link New Repository button to connect additional repositories.

For each discovery asset, additional details are accessible by expanding the row with the dropdown arrow on the left. This allows for a closer look at specific configurations and related information.

From this page, you can:

- Link New Assets: Add new cloud accounts, dependency files, or code repositories.
- Initiate a Scan: Start a repeat scan of a previously configured discovery asset; resource updates will be automatically reflected in inventory.
- Edit Configurations: Modify existing configurations; this will trigger an immediate rescan, automatically updating your inventory. For dependency files, edit the configuration by replacing the uploaded file with a new version.
- Delete Configurations: Remove an existing discovery asset, which will mark all associated resources as deleted in your inventory. Refer to the Deleting Resources section for details on how these deleted resources are managed.

This configuration page provides a central point to manage your discovery assets, ensuring that your AI inventory remains current and complete.

## Inventory Issues[​](#inventory-issues)
As resources and technologies are discovered and loaded into the system, issues are generated to help you track and manage the composition of your AI systems.

- Shadow AI Issues: These include resources that have not been reviewed, have been rejected (unsanctioned), or have been discovered and added to the default project without being properly assigned to their correct projects.
- Unprotected AI Issues: These issues are generated for resources where protections available within the platform — such as adding an AI gateway to an LLM endpoint or scanning a model in inventory—have not been activated by the customer.

Note that these issues are generated only for newly discovered resources and do not include those flagged by AI SPM scans.

## Report[​](#report)
This tab provides a comprehensive report of all Shadow AI and Unprotected AI issues identified in your AI inventory, allowing you to search and filter issue data to customize the report as needed. Use the search bar and filter options to refine the report view, and save customized reports by clicking the Save button. To generate and download a report in CSV or XLSX format, click the Reporting button.
[PreviousAI 360](/_docs/docs/applications/ai_360)[NextAI Usage](/_docs/docs/applications/ai_usage)- [Technologies](#technologies)- [Discovery Configuration](#discovery-configuration)[Adding a new Cloud Account](#adding-a-new-cloud-account)- [Adding a Code Repository](#adding-a-code-repository)- [Adding a Hosted Service](#adding-a-hosted-service)- [Using Dependency Files](#using-dependency-files)- [Adding a Resource Manually](#adding-a-resource-manually)- [Resource Details Page](#resource-details-page)- [Assigning Resources to Projects](#assigning-resources-to-projects)- [Editing Resource Project Assignments](#editing-resource-project-assignments)- [Deleting Resources](#deleting-resources)- [Reviewing Resources and Technologies](#reviewing-resources-and-technologies)- [Generating an AI-BOM](#generating-an-ai-bom)- [Configuration](#configuration)- [Inventory Issues](#inventory-issues)- [Report](#report)
