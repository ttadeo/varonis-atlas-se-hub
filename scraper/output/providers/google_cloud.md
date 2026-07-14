---
title: Google Cloud
url: https://prod.alltrue-be.com/_docs/docs/providers/gcp
section: providers
---

# Google Cloud

- [](/_docs/)- [Providers](/_docs/docs/providers)- Google CloudExport PDFOn this page# Google Cloud
Connect a Google Cloud account so Atlas can discover the AI-related resources running in it. Setup is script-driven: you download a discovery script, run it against the scope you choose, and then verify the connection.

## How Atlas integrates with a Google Cloud environment[​](#how-atlas-integrates-with-a-google-cloud-environment)
Linking a Google Cloud account lets the Atlas cloud-discovery pipeline inventory the AI-related resources in that account. Once an account is connected, discovery runs on the normal schedule and the resources it finds appear in your AI Inventory.

You can link a Google Cloud account from two places:

- **In-app:** AI Inventory &gt; Configuration &gt; Cloud Accounts &gt; Link New Account &gt; Google Cloud.
- **During onboarding:** the Link Cloud Account step of initial AI Discovery setup.

Both entry points open the same Google Cloud setup flow described below.

## Before you start: required permissions[​](#before-you-start-required-permissions)
The Google Cloud user who runs the setup script must hold the following IAM roles:

- `roles/iam.organizationRoleAdmin`
- `roles/resourcemanager.organizationAdmin`

These roles are required so the script can create service accounts, create custom roles, and assign permissions. They are prerequisites on your own Google Cloud identity, and are distinct from the service account and custom role that the script itself creates (see the optional parameters below).

## Connect your Google Cloud account[​](#connect-your-google-cloud-account)
Setup is a three-step command flow. The Atlas UI generates the exact commands for your tenant (including the script download URL and your API key); the values shown as `&lt;placeholders&gt;` below are filled in for you.

### Step 1 — Download the script[​](#step-1--download-the-script)
Download the discovery script into a temporary installation folder:

```
mkdir alltrue_installation &amp;&amp; cd alltrue_installation &amp;&amp; curl &lt;gcp_template_url&gt; -o gcp_discovery.py

```
### Step 2 — Run the script[​](#step-2--run-the-script)
Choose the scope you want to discover, then run the generated command. There are three ways to scope the run:

- **All organizations and projects** — use `--all`.
- **Specific organization(s)** — use `--organization_id` with one or more organization IDs.
- **Specific project(s)** — use `--project_id` with one or more project IDs.

The generated command has the following shape (the `&lt;scope&gt;` segment is one of the three options above):

```
python3 gcp_discovery.py &lt;scope&gt; --alltrue_api_key &lt;api_key&gt; --base_url &lt;control_plane_endpoint&gt; --customer_id &lt;customer_id&gt; --alltrue_service_account &lt;service_account_name&gt; --custom_role_id &lt;custom_role_id&gt;

```
Use the **Get Command** action in the UI to generate the command for your selected scope, then run it from a shell with the Google Cloud SDK available. The command is not run automatically.

**Optional parameters:**

- `--alltrue_service_account` — the name of the service account the script creates. Defaults to `AllTrueScannerService`.
- `--custom_role_id` — the custom role ID the script creates. Defaults to `AlltrueCustomerScannerRole_V5`.

These control what the script creates in your Google Cloud organization, and are separate from the prerequisite roles your own user already needs.

### Step 3 — Clean up[​](#step-3--clean-up)
After the script finishes, remove the temporary folder:

```
cd .. &amp;&amp; rm -rf alltrue_installation

```
## Verify the connection[​](#verify-the-connection)
Role creation may take up to 5 minutes per account. To confirm the account is linked, enter your GCP project ID(s) and click **Test Connection** — Atlas lists the connected cloud accounts it can see.

If you linked an organization, enter the project IDs within that organization to test the connection.

## What Atlas discovers in Google Cloud[​](#what-atlas-discovers-in-google-cloud)
After the account is linked, Atlas discovers the following Google Cloud services:

- Vertex AI
- BigQuery
- Cloud Storage (region-agnostic and region-specific)
- Cloud Functions
- Cloud TPU
- Compute Engine

AI Inventory is the authoritative source for what Atlas inventories per provider — see the [Supported Services](/_docs/docs/applications/ai_inventory/supported_services) page for the full, current list across all cloud providers. For the other cloud providers, see [AWS](/_docs/docs/providers/aws) and [Azure](/_docs/docs/providers/azure).
[PreviousTenant setup](/_docs/docs/providers/azure/tenant_setup)[NextAWS Bedrock](/_docs/docs/providers/aws_bedrock)- [How Atlas integrates with a Google Cloud environment](#how-atlas-integrates-with-a-google-cloud-environment)- [Before you start: required permissions](#before-you-start-required-permissions)- [Connect your Google Cloud account](#connect-your-google-cloud-account)[Step 1 — Download the script](#step-1--download-the-script)- [Step 2 — Run the script](#step-2--run-the-script)- [Step 3 — Clean up](#step-3--clean-up)- [Verify the connection](#verify-the-connection)- [What Atlas discovers in Google Cloud](#what-atlas-discovers-in-google-cloud)
