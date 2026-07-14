---
title: IBM Watsonx
url: https://prod.alltrue-be.com/_docs/docs/providers/ibm_watsonx
section: providers
---

# IBM Watsonx

- [](/_docs/)- [Providers](/_docs/docs/providers)- IBM WatsonxExport PDFOn this page# IBM Watsonx
Connect an IBM Watsonx account so Atlas can discover the watsonx.ai resources in it. Setup is done in IBM Cloud — you create a Service ID, grant it a small set of read-only access policies, generate an API key, add the Service ID to each project you want discovered, and then enter two values in Atlas.

## Overview[​](#overview)
Connecting an IBM Watsonx account gives Atlas read-only discovery of your watsonx.ai resources — models, prompts, deployments, projects, spaces, notebooks, data assets, and connections. An administrator who can create IBM Cloud IAM identities performs the setup.

You finish the IBM-side steps with two values that you enter in Atlas:

- an **API key** for a Service ID, and
- your **Cloud Account Identifier** (your watsonx project ID).

## Create a Service ID[​](#create-a-service-id)
See the [IBM API key documentation](https://dataplatform.cloud.ibm.com/docs/content/wsj/admin/admin-apikeys.html?context=wx&amp;audience=wdp) for more detail. Create a Service ID and give it access to your projects:

- Go to IBM Cloud &gt; IAM &gt; Manage Identities &gt; Service IDs ([https://cloud.ibm.com/iam/serviceids](https://cloud.ibm.com/iam/serviceids)).
- Click **Create Service ID**.
- Give it a meaningful name and description, then click Create.
- Leave Access Groups as-is, with Public Access.

## Grant the four access policies[​](#grant-the-four-access-policies)
In the Service ID's Access Policies, add exactly the following four policies. Conditions are None on all four.

ServiceResourcesRoleIAM Identity ServiceAllOperatorCloud Object StorageAllViewerwatsonx.dataAllViewerResource group onlyDefault resource groupViewer
These four are the only policies required — do not add others.

## Create the API key[​](#create-the-api-key)

- On the Service ID's **API Keys** tab, select **Create**.
- Enter a meaningful name and description, then choose **Disable the leaked key**.
- Copy the API key and store it somewhere safe — it is shown only once.

You will enter this key in Atlas in the last step.

## Add the Service ID to each project[​](#add-the-service-id-to-each-project)
Grant the Service ID access to every watsonx project you want Atlas to discover:

- Open your projects in IBM Watsonx at [https://dataplatform.cloud.ibm.com/projects/?context=wx](https://dataplatform.cloud.ibm.com/projects/?context=wx).
- Select a project, choose the **Manage** tab, select **Access Control**, and under **Collaborators** choose **Add Collaborators &gt; Add Service IDs**.
- Search for the Service ID by name, select it, give it the **Viewer** role, and add it to the project.
- Repeat for each project you want discovered.

## Connect the account in Atlas[​](#connect-the-account-in-atlas)

- In Atlas, go to AI Inventory &gt; Configuration &gt; Cloud Accounts &gt; Link New Account.
- Choose **IBM Watsonx** as the provider.
- Enter the two required fields:

**API key** — the key you copied from the Service ID.
- **Cloud Account Identifier** — your watsonx project ID.

- Save to link the account.

Once the account is linked, the scan runs automatically and discovered resources are added to inventory on completion. All discovered resources initially land in the Default Project and can then be reassigned using the Assign Cloud Resources tool. The scan repeats nightly. Discovered resources appear in your [AI Inventory](/_docs/docs/applications/ai_inventory).
[PreviousMS Copilot Studio](/_docs/docs/providers/copilot_studio)[NextDatabricks Integration (Hosted on Databricks or AWS)](/_docs/docs/providers/databricks/onboarding)- [Overview](#overview)- [Create a Service ID](#create-a-service-id)- [Grant the four access policies](#grant-the-four-access-policies)- [Create the API key](#create-the-api-key)- [Add the Service ID to each project](#add-the-service-id-to-each-project)- [Connect the account in Atlas](#connect-the-account-in-atlas)
