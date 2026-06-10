---
title: AI Inventory
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_inventory
section: applications
---

# AI Inventory

- [](/_docs/)- Applications- AI InventoryOn this page# AI Inventory
Use the AI Inventory application to create and manage a catalog of AI resources used within your AI systems. Track development projects involving AI in one place and maintain visibility over all AI resources used across projects. An AI resource, or asset, encompasses anything used in AI development, such as an LLM endpoint, a model, a library, and more.

Resources belong to technologies, and each technology has a type. For example, you may use various instances of Langchain; each instance is a resource, the technology is Langchain, and the type is AI Software. Similarly, if you use multiple OpenAI API Keys, each API Key represents a resource, categorized under the OpenAI Endpoint technology with a type of LLM Endpoint.

The AI Inventory dashboard provides an at-a-glance overview of your AI asset landscape, including total resource and technology counts, discovery asset metrics, and technologies categorized by inventory type: AI Platform-as-a-Service, AI Models, AI Software, and AI Services. Each inventory section displays key details such as resource counts, organizational usage, and review status, helping you monitor and manage AI resources effectively.

## Technologies[​](#technologies)
View all your AI resources on this tab. Resources are discovered by inspecting cloud accounts, code repositories, and BOM-type documents. Discovered resources are then categorized, cataloged, and assigned to projects.

To get started, connect your environments by clicking the Add New button, selecting the type of discovery source to add, and then providing access for automated discovery.

Once resources have been added (e.g. from a cloud account), assign them to the appropriate project and review them.

## Discovery Configuration[​](#discovery-configuration)
Resources are typically added to your AI Inventory automatically through scans, but they can also be added manually. The TRiSM Hub can auto-discover your inventory by scanning your infrastructure (e.g., a cloud account), through uploading dependency files, or by scanning code and code artifacts. Add a new scan target by clicking the Link New Account button. Discovery configurations are viewed in the five tabs on the Configuration screen (Cloud Accounts, Dependency Files, Code Scanning, Hosted Services, and MCP). Scans run nightly via the ETL system, but you can trigger a discovery scan by clicking the three dots and selecting Run Discovery.

### Adding a new Cloud Account[​](#adding-a-new-cloud-account)
Connect your cloud accounts to enable auto-discovery of your AI inventory as you build AI systems on the main AI clouds. You can add a cloud account either from the Technologies tab or the Configuration tab. In the Technologies tab you need to select the Add New Cloud Account tile whereas in the Configuration tab select the Link New Account button from the Cloud Accounts tab. Then choose from the following cloud providers:

- AWS
- Azure
- Google Cloud
- IBM Watsonx
- Databricks

Provide the required keys or credentials for access (different for each cloud source) and click Link Accounts to establish a connection.

Once the cloud account is linked, the scan initiates automatically and discovered resources are added to inventory upon successful completion. Initially, all discovered resources are added to the Default Project and must then be reassigned to their respective projects using the Assign Cloud Resources tool. The scan repeats nightly, capturing any updates or additions to the cloud account. New resources added to the cloud account appear in the Default Project, while removed resources and version updates are automatically reflected in inventory under their respective projects.

Ensure that the appropriate privileges are granted so the TRiSM Hub can perform the necessary read-only API calls for discovery. The following permissions are required per cloud (please review and request these from your Cloud Architecture team):

- AWS- Azure- Google Cloud- IBM WatsonX- DatabricksYou can link the tenant with your AWS account by running an AWS stack within your AWS account. This stack creates a role with ReadOnlyAccess to the AWS account and provides that role to the platform, as shown below:

To link an AWS account, follow the instructions provided in the interface. You have two options that leverage AWS CloudFormation:

- Manual Role Creation: Use the AWS Management Console to create the necessary role.
- Command Line Setup: Run the provided command in the AWS CLI terminal.
Once the roles are created and your AWS account is linked, click Test Connection to verify the setup and display a list of connected AWS accounts.
To complete this through the GUI, open one tab with your AWS account and another with the system, then click the Create Role button. Alternatively, you can download the CloudFormation script and run it from the AWS CLI.

You can either connect to an Azure account and add all your subscriptions or you can add only certain subscriptions. In either case the system will provide a command that you can copy to be run within your Azure account using azure-cli. See the screen in Cloud Accounts.
**Copilot Studio note:**
Discovery of Copilot Studio resources requires additional permissions in **Power Platform** beyond the cloud account connection. To complete setup, add the Varonis enterprise application as an **Application User** in the target Power Platform environment and assign the required role. See **Platform Services &gt; Integrations** for step-by-step instructions.
Create a service account with the Viewer role in your Google Cloud account. Within Google Cloud, navigate to IAM &amp; Admin and select Service Accounts. Click + CREATE SERVICE ACCOUNT and enter a name and ID. Add the Viewer role from the predefined basic roles. In the service accounts list, select the three dots under Actions and click Manage keys. Create a service account key and, when prompted, choose a JSON key.
Download the generated key and copy this into the API Credentials field along with the account name you selected.
Follow IBM instructions for more details [here](https://dataplatform.cloud.ibm.com/docs/content/wsj/admin/admin-apikeys.html?context=wx&amp;audience=wdp). You need to create a Service ID and give it access to the project:

- Access IBM Cloud &gt; IAM &gt; Manage Identities &gt; Service IDs [https://cloud.ibm.com/iam/serviceids](https://cloud.ibm.com/iam/serviceids)
- Click Create Service ID
- Give it a meaningful name and description, then click create
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
- Enter a meaningful name and description, then choose Disable the leaked key
- Copy the API Key
- Go back to the project in IBM Watsonx at [https://dataplatform.cloud.ibm.com/projects/?context=wx](https://dataplatform.cloud.ibm.com/projects/?context=wx)
- Select a project, choose the Manage tab, select Access Control, under Collaborators choose Add Collaborators, and select Add Service IDs
- Search for the newly added Service ID by name, select it, give it the Viewer role, and add it to the project
- Repeat for each project for which you want to add discovery permissions
The TRiSM Hub authenticates to Databricks using OAuth machine-to-machine (M2M) with a service principal you create in your Databricks account. Discovery runs in two authentication hops, both of which must succeed:

- **Account-level auth** — the TRiSM Hub calls the account OIDC token endpoint to get an account-scoped access token, then lists the workspaces under your account.
- **Workspace-level auth** — for each workspace, the TRiSM Hub calls the workspace OIDC token endpoint to mint a workspace-scoped token, then enumerates resources in that workspace.
The same service principal must be granted (a) an account-level role with permission to list workspaces, and (b) workspace membership with appropriate entitlements in every workspace you want the TRiSM Hub to scan. Granting only one of these is the most common cause of discovery failures.
**Who needs to do this:** someone with the **Account Admin** role on the Databricks account console, and **Workspace Admin** on each workspace you want scanned.
**What you will collect.** By the end of this setup you will have four values to enter into the TRiSM Hub:
FieldExampleWhere it comes from`host``https://accounts.cloud.databricks.com` (AWS), `https://accounts.azuredatabricks.net` (Azure), or `https://accounts.gcp.databricks.com` (GCP)The Databricks **account console** URL for your cloud.`account_id``b495f5af-2d52-4ebb-b1ec-ee069c0eb663`Account console → top-right user menu → copy the **Account ID**.`client_id``9d1e3a7c-8b2f-...`The **Application ID** of the OAuth secret you generate below.`client_secret`Shown once on generationThe **Secret** value you generate below. Databricks shows this only once; copy it immediately.Only the account-level `host` is entered into the TRiSM Hub — per-workspace hosts are discovered automatically once the account-level connection is established, so do not enter a workspace URL here. If you lose the `client_secret` you must generate a new one — there is no way to retrieve an existing secret.
**Account-level setup.** Sign in to the Databricks account console (not a workspace) as an Account Admin.

- 
Create the service principal.

Open **User Management** → **Service Principals**.
- Click **Add service principal**.
- Choose **Databricks managed** (do not select a federated identity unless you have a specific reason to).
- Give it a clear name, e.g. `Varonis-discovery-sp`.
- Click **Add**.

- 
Assign the **Account Admin** role.

Click into the service principal you just created.
- Open the **Roles** tab.
- Enable **Account admin**.

The Account Admin role lets the TRiSM Hub list every workspace under your account and (for Unity Catalog discovery) read metastore-level objects. If your security posture requires a narrower role, contact your account team — a custom role is possible but currently has to be validated case by case.

- 
(Unity Catalog only) Grant metastore admin. If you use Unity Catalog and want the TRiSM Hub to discover catalogs, schemas, tables, external locations, and model registry entries, open **Catalog** in the account console, select your metastore, and either set the service principal (or a group containing it) as the **Metastore admin**, or grant the following specific privileges:

`USE_CATALOG` on each catalog the TRiSM Hub should see
- `USE_SCHEMA` on the schemas inside those catalogs
- `BROWSE` on catalogs and schemas (to enumerate metadata without reading row data)
- `READ_VOLUME` if you want volume metadata discovered

- 
Generate the OAuth secret.

Still on the service principal detail page, open the **Credentials &amp; secrets** tab.
- Click **Generate secret** under the **OAuth secrets** section.
- Pick a lifetime (90 days minimum recommended; the TRiSM Hub will alert before expiry).
- Copy both values: the **Client ID** (also the service principal's Application ID) and the **Secret**. The secret is shown only once.

**Workspace-level setup.** Repeat the following for each workspace the TRiSM Hub should discover. Account-level admin does not automatically grant workspace access — a service principal that exists at the account level but is not added to a workspace will fail to mint workspace-scoped tokens, and the TRiSM Hub will report an authentication error for every resource type in that workspace.

- Add the service principal to the workspace from the account console.

In the account console, open **Workspaces**.
- Click the workspace the TRiSM Hub should scan.
- Open the **Permissions** tab.
- Click **Add permissions**, search for your service principal (by name or Application ID), and add it with the **Admin** permission level.

- Grant entitlements inside the workspace.

Open the workspace itself.
- Go to **Settings** (gear icon, bottom-left) → **Identity and access** → **Service principals**.
- If the service principal is not already listed, click **Add service principal** and search by the Application ID (the `client_id` from the previous section).
- Click into the service principal.
- Under **Entitlements**, enable **Workspace admin** (recommended).

**Verify before sending credentials.** You can confirm the setup is correct before entering anything in the TRiSM Hub. Use any HTTP client (the Databricks CLI, Postman, or a small script). Both checks below should succeed.
The Databricks CLI offers the same check via `databricks auth token` after configuring an OAuth M2M profile. See the Databricks docs section [OAuth machine-to-machine authentication](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html#language-Python) for the exact CLI invocation for your platform.
*Account-level token check:*
Endpoint`{host}/oidc/accounts/{account_id}/v1/token`AuthHTTP Basic with `client_id` / `client_secret`Body (form-encoded)`grant_type=client_credentials` and `scope=all-apis`Expected responseHTTP 200 with a JSON body containing an `access_token`If you get `invalid_client`, the `client_id` or `client_secret` is wrong, or the OAuth secret was revoked or expired. If you get `invalid_request`, the `account_id` in the URL does not match the account that owns the service principal — verify the SP belongs to this account. HTTP 404 usually means the wrong cloud (AWS / Azure / GCP) host or wrong `account_id`.
*Workspace-level token check:*
Endpoint`https://{workspace-host}/oidc/v1/token`AuthHTTP Basic with the same `client_id` / `client_secret`Body (form-encoded)`grant_type=client_credentials` and `scope=all-apis`Expected responseHTTP 200 with an `access_token`Run this for at least one workspace you want the TRiSM Hub to scan. HTTP 401 means the service principal is not a member of this workspace — re-check the workspace-level setup steps. HTTP 403 means the SP is a member of the workspace but lacks the entitlement needed for the operation — verify the Workspace admin entitlement.
**Enter the credentials in the TRiSM Hub.** Once both verification calls succeed, enter the four values (`host`, `account_id`, `client_id`, `client_secret`) on the Cloud Accounts screen. Once the credentials are confirmed, a Databricks discovery scan will run automatically.
**Troubleshooting:**
SymptomMost likely causeWhere to fix`Failed to authenticate with Databricks` on every scan, no workspaces discoveredAccount-level OAuth failing: wrong `client_id` or `client_secret`, secret expired, or SP not provisioned at account level.Account-level setup steps 1 and 4 — and re-run the account-level token check.Workspaces are listed but every resource fails with 401Service principal is at account level but not a member of the workspace.Workspace-level setup — re-run the workspace-level token check.Some workspaces work, others failService principal added to some workspaces but not others, or different entitlements per workspace.Repeat the workspace-level setup for each failing workspace.Workspace auth succeeds but certain resource types are missingSP has workspace access but is missing entitlements for those resource types (e.g. Unity Catalog privileges, model registry access).Account-level setup step 3 (Unity Catalog) and the workspace-level entitlements step.`invalid_request` from the account token endpoint`account_id` in the credentials does not match the account that owns the SP — e.g. you have multiple Databricks accounts and used the wrong one.Re-copy the Account ID from the user menu of the same console where the SP was created.For background on the underlying Databricks concepts, see the Databricks docs for [service principals](https://docs.databricks.com/en/admin/users-groups/service-principals.html), [OAuth M2M authentication](https://docs.databricks.com/en/dev-tools/auth/oauth-m2m.html#language-Python), and [service principal ACLs](https://docs.databricks.com/en/security/auth-authz/access-control/service-principal-acl.html).

### Adding a Code Repository[​](#adding-a-code-repository)
Code scanning automatically discovers and tracks AI resources in your code repositories by identifying libraries, models, and notebooks relevant to your AI projects. To add a code repository for AI resource scanning, navigate to the Technologies tab and click the Add New button. Then select Add New Repository and choose from the available version control systems (GitHub, BitBucket, GitLab, Azure DevOps, or Hugging Face). You will need to provide an API key with the necessary permissions, which may require assistance from your repository admin.

In the Configure a Repository for Code Scanning form, enter the following required details (parameters may differ depending on the code repository):

- Organization: Specify the VCS organization associated with the repository.
- Repository Name: Enter the name of the repository you wish to scan.
- API Key: Input the API key with the required access permissions.
- Branch: (Optional) Select the branch of the repository to scan.
- Programming Language: (Optional) Specify the primary programming language used.
- Project: Choose the project where these resources should be cataloged. Note that each code repository can only be connected to one project.

For GitHub you can either use a Personal Access Token or use the Varonis GitHub app.

**Hugging Face repositories:** The API Key field is optional for Hugging Face. If you do not provide a token, a warning banner reminds you that some repositories may require authentication for deeper scans. If you do provide a token, it is validated during registration to confirm it can access file contents, not just list files. If the token is invalid or lacks the required permissions (for example, if you have not accepted a gated repository's terms and conditions), registration is blocked with a specific error message on the API Key field.

After entering the details, select the code scanning tools to implement:

- Dependency File Scanning: Detects AI-related libraries in files such as requirements.txt and Dockerfile, ensuring accurate tracking of dependencies across projects.
- Hugging Face Model Scanning: Identifies models hosted on Hugging Face referenced in your code, tracking pre-trained models used within the project.
- Jupyter Notebook Scanning: Finds Jupyter notebooks, classifying them as new, rediscovered, or missing, to maintain an up-to-date record of notebooks in your repository.

Once the repository is linked, the scan initiates automatically and discovered resources are added to inventory upon successful completion. The scan then repeats nightly, capturing any updates or additions to the repository. New resources added to the repository are assigned to the configured project, while removed resources and version updates are automatically reflected in inventory.

### Adding a Hosted Service[​](#adding-a-hosted-service)
Hosted service integration enables automatic discovery of AI resources managed by third-party providers such as OpenAI. This is especially useful when your AI systems rely on services that are not deployed within your cloud infrastructure or source code repositories but are instead hosted externally. By linking a hosted service, you enable Varonis to inventory relevant endpoints, models, and associated assets through the service’s API.

To add a hosted service:

- Navigate to the AI Inventory section from the left navigation bar.
- Click on the Configuration tab at the top, then select the Hosted Services sub-tab.
- Click the Link New Hosted Service button in the upper right.

This opens the "Link Hosted Service" form. Choose a provider below to view additional information.

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

Once linked, the platform begins scanning your OpenAI account. Discovered resources are categorized and added to your AI Inventory automatically.

Supported resources include:

- Models
- Fine-Tuned Models
- Assistants
- Files
- Vector Stores
- Fine-Tuning Jobs
- CustomGPTs

If you provided an admin key, usage data is used to determine which LLM models you are using so they can be added to inventory.

### Using Dependency Files[​](#using-dependency-files)
Dependency file scanning automatically analyzes and catalogs AI-related libraries and dependencies used within your development projects. By uploading dependency files, you can quickly capture resources relevant to your AI systems, ensuring your inventory is accurate and up to date. To add a dependency file, navigate to the Technologies tab and click the Add New button. Then select Add New Dependency File and complete the required information in the form.

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
Manual addition allows you to capture specific resources that may not be identified during automated scans, ensuring your inventory remains complete and up to date. To add a resource manually, navigate to the Technologies tab and click the Add New button. Then select Add New Resources Manually, choose the type of resource you want to add, and fill in the required information. Click Add to Inventory to finalize the addition.

Some resources, such as LLM Endpoints and Vector Stores, can only be added manually and are not discoverable through automated scanning. Other resources, like Models and Libraries, are typically discovered through automated scans but can also be added manually to supplement automated discovery.

- LLM Endpoints- Models- LibrariesTo add an LLM Endpoint, start by selecting the Provider from the dropdown menu, such as OpenAI, Azure OpenAI, or other supported providers. Enter the API Key for the LLM, which must be unique to a single project. If you are using shared API keys across multiple AI systems, use the Endpoint Identifier field to differentiate each endpoint use case. Next, select the Project to which this LLM Endpoint will be assigned. Note: Each API Key can only be associated with one project.
For Azure OpenAI Endpoints, additional information is required, including the Resource Name and Deployment Name, which can be found in your Azure platform.
Once all required information is entered, click Add to Inventory to finalize the addition of the LLM Endpoint to your project’s inventory. Click the “+” button to add multiple LLM Endpoints simultaneously.
To add a model, start by selecting the Storage Source for the model. Supported storage options include cloud storage services and Hugging Face Hub.
If you select a cloud storage option, you can choose from AWS S3, GCP Bucket, or Azure Blob. For cloud-stored models, you’ll need to provide specific details, such as the Cloud Account, Region, Bucket, and Storage Path to enable access to the model.
For models stored on Hugging Face Hub, select "Hugging Face Hub" as the storage source and enter the Model ID to validate the model. The Model ID can be found at the top of the model’s page on Hugging Face. Additionally, specify the Model Revision (default is "main") to ensure the correct version is added to the inventory.

In addition to specifying the storage details, choose the Model Type from the dropdown menu to classify the model appropriately. Finally, select the project to which the model should be assigned. You can assign the model to multiple projects simultaneously by using the “+” button to specify additional projects.
Once all the required information is entered, click Add to Inventory to finalize the addition of the model. Click the “+” button to add multiple Models simultaneously.
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
- Each code repository must be unique to a single project in discovery.

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

Each technology may contain one or more resources. Select a technology to view all associated resources -- either within the current project, across the organization, or spanning all organizations, as defined by the top-left dropdown menu. Clicking a specific resource opens the Resource Details page, which provides detailed information such as resource properties (including a model card if applicable), vulnerabilities and misconfiguration issues detected by the AI SPM application, pentest findings, runtime protection, and other aggregated data managed within the TRiSM Hub. This view provides a unified perspective on each AI resource.

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
The Discovery Configuration page within the AI Inventory tab provides an organized view of all linked discovery assets that contribute to building your AI inventory. It includes five distinct tabs:

- 
**Cloud Accounts:** Displays all connected cloud accounts, showing details such as the cloud platform (e.g., AWS, Azure), the associated projects, the number of AI resources discovered, and status. Use the Link New Account button to add additional cloud accounts.

- 
**Dependency Files:** Lists all uploaded dependency files (e.g., requirements.txt) used in the discovery process. Each file entry shows the organization usage, upload date, number of resources found, and status. You can add new dependency files with the Add New File button.

- 
**Code Scanning:** Shows linked code repositories configured for code scanning, detailing the projects associated, the types of scans configured, the number of AI resources detected, and status. Use the Link New Repository button to connect additional repositories.

- 
**Hosted Services:** Hosted Services enable discovery of AI assets managed by external AI providers, such as OpenAI. When a service is linked, the platform scans the provider's API and automatically inventories hosted models, fine‑tuned models, assistants, files, vector stores, and other supported entities.
Use Link New Hosted Service to connect a provider using API keys and assign discovered assets to the correct project.

- 
**MCP:** The MCP tab lists all connected Model Context Protocol servers. MCP integrations allow the platform to discover AI agent tools and capabilities exposed through MCP‑compatible endpoints. Use Connect New MCP to register a new MCP server, test connectivity, configure authentication, and assign the integration to a project.

For each discovery asset, additional details are accessible by expanding the row with the dropdown arrow on the left. This allows for a closer look at specific configurations and related information.

### From the Configuration page, you can:[​](#from-the-configuration-page-you-can)
**Link New Assets:** Add new cloud accounts, dependency files, code repositories, hosted services, or MCP servers.

**Initiate a Scan:** Run a manual scan for any configured discovery asset. Updated or newly discovered resources will automatically appear in the inventory.

**Edit Configurations:** Modify existing configurations (e.g., update credentials, change project assignment, replace dependency files). Editing triggers an immediate rescan.

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
[PreviousAI 360](/_docs/docs/applications/ai_360)[NextAI Usage](/_docs/docs/applications/ai_usage)- [Technologies](#technologies)- [Discovery Configuration](#discovery-configuration)[Adding a new Cloud Account](#adding-a-new-cloud-account)- [Adding a Code Repository](#adding-a-code-repository)- [Adding a Hosted Service](#adding-a-hosted-service)- [Using Dependency Files](#using-dependency-files)- [Adding a Resource Manually](#adding-a-resource-manually)- [Resource Details Page](#resource-details-page)- [Assigning Resources to Projects](#assigning-resources-to-projects)- [Editing Resource Project Assignments](#editing-resource-project-assignments)- [Deleting Resources](#deleting-resources)- [Reviewing Resources and Technologies](#reviewing-resources-and-technologies)- [Generating an AI-BOM](#generating-an-ai-bom)- [Configuration](#configuration)[From the Configuration page, you can:](#from-the-configuration-page-you-can)- [Discovery Policy](#discovery-policy)- [Inventory Issues](#inventory-issues)- [Report](#report)
