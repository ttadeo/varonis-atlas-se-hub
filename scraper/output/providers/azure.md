---
title: Azure
url: https://prod.alltrue-be.com/_docs/docs/providers/azure
section: providers
---

# Azure

- [](/_docs/)- [Providers](/_docs/docs/providers)- AzureExport PDFOn this page# Azure
Getting started with Azure AI security in Atlas centers on connecting your Azure-based AI environment so Atlas can discover it, review its posture, and protect its runtime traffic. This page walks through the connection points an Azure environment uses and how to set each one up. For the Azure OpenAI endpoints Atlas inventories and proxies at runtime, see [Azure OpenAI](/_docs/docs/providers/azure_openai).

## How Atlas integrates with an Azure AI environment[​](#how-atlas-integrates-with-an-azure-ai-environment)
An Azure AI environment connects to Atlas through these points:

- **Cloud-discovery accounts** — connect Azure subscription accounts and Power Platform environment accounts, each registered by one capability-selected installer, to run a discovery pipeline that inventories Azure OpenAI, Azure Databricks, Azure Machine Learning, storage, AI Search, Copilot Studio, and AI Foundry resources.
- **Gateway-proxied runtime LLM endpoint** — register an Azure OpenAI LLM endpoint that AI Runtime forwards traffic to and that AI Red Team targets for pentests.
- **Copilot Studio discovery and runtime** — Copilot Studio agents are discovered from a registered Power Platform environment account and protected at runtime.

Atlas authenticates all discovery with a single per-tenant identity: the **AllTrue AISec** enterprise application (Application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`). Azure onboarding registers it in your Microsoft Entra ID tenant, where you can confirm it under **Microsoft Entra ID → Enterprise applications**. Discovery is read-only — Atlas issues only list and read calls.

A fourth provider scope — an evaluator LLM credential (Azure AI Foundry) — is not part of Azure discovery onboarding and is out of scope for this page; it is covered on [Azure OpenAI](/_docs/docs/providers/azure_openai).

## Connect your Azure and Power Platform accounts for discovery[​](#link-your-azure-subscriptions-for-discovery)
Connect your Azure subscriptions and Power Platform environments from **AI Inventory → Resource Management → Add New Cloud Account**, selecting the **Azure** tile. One capability-selected installer covers both: select Azure Subscriptions, Copilot Studio (Power Platform), or both, set the scope for each, then generate and run a single command. Each Azure subscription and each Power Platform environment registers as its own cloud account, and the installer is idempotent — re-run the command later to add capabilities or environments. For the full step-by-step, see [Onboarding](/_docs/docs/providers/azure/onboarding).

Required roles for the Azure Subscriptions capability: **User Access Administrator, Owner, or Role Based Access Control Administrator**; and **Application Administrator or Cloud Application Administrator in Entra ID**.

**Grant tenant permissions.** Linking subscriptions grants Atlas read-only **Azure RBAC** — enough for Azure-native discovery (Azure OpenAI, Azure Machine Learning, storage, AI Search) and Azure Databricks *workspace enumeration*. **SharePoint** and **Copilot Studio** discovery additionally require a one-time **tenant admin consent**, and Copilot Studio also needs a **Dataverse Application User** — the [onboarding installer](/_docs/docs/providers/azure/onboarding) attempts both automatically as part of its Copilot Studio capability. Only follow [Grant Atlas access to your tenant](/_docs/docs/providers/azure/tenant_setup) if a Power Platform environment's provisioning status shows **Manual Follow-Up** or **Failed** on the Configuration → Cloud Accounts page — that page is the manual fallback for whatever the installer couldn't complete on its own.

## Discover Azure Databricks workspaces[​](#discover-azure-databricks-workspaces)
Azure Databricks discovery is part of Azure cloud-account onboarding — there is no separate connector to configure for Azure-hosted workspaces. Discovery is **read-only** and inventories workspaces, access connectors, Unity Catalog data assets, ML models and versions, vector indexes, job runs, and identities.

Each workspace requires a one-time setup: register the **AllTrue AISec** service principal in the workspace. For the per-workspace setup steps, see [Azure Databricks](/_docs/docs/providers/databricks/azure).

There are two Databricks surfaces. Workspaces hosted on Azure authenticate through Microsoft Entra ID and are discovered by the Azure onboarding above. Databricks accounts not hosted on Azure connect through a standalone Databricks connector instead — see [Databricks Onboarding](/_docs/docs/providers/databricks/onboarding).

## How Atlas discovers SharePoint[​](#how-atlas-discovers-sharepoint)
SharePoint discovery is AI-aware, and there is nothing to configure. Atlas materializes a SharePoint site in your inventory only when a discovered AI resource references it — a Copilot Studio agent knowledge source, or an Azure AI Foundry grounding connection. There is no standalone SharePoint scan and no SharePoint setup screen.

As a result, SharePoint sites, lists, drives, drive items, permissions, and pages appear in AI Inventory automatically, as the referenced targets of the AI resources that use them.

There is one tenant-level prerequisite: reading SharePoint uses Microsoft Graph, so the **AllTrue AISec** application needs **tenant admin consent** (granted once) — see [Grant Atlas access to your tenant](/_docs/docs/providers/azure/tenant_setup).

## Use Azure OpenAI with AI Runtime and AI Red Team[​](#use-azure-openai-with-ai-runtime-and-ai-red-team)
Azure OpenAI has two shapes in Atlas. It is a manually added runtime **LLM endpoint** that AI Runtime forwards traffic to and AI Red Team targets for pentests, and it is also **auto-discovered** from a linked Azure subscription — Atlas enumerates Cognitive Services accounts of kind `OpenAI` and their deployments into AI Inventory.

For the endpoint form fields, the discovered resource families, and the Azure AI Foundry evaluator, see [Azure OpenAI](/_docs/docs/providers/azure_openai).

## MS Copilot Studio: discovery and runtime[​](#ms-copilot-studio-discovery-and-runtime)
Copilot Studio is discovered as part of Azure onboarding and protected at runtime:

- **Discovery** — Atlas discovers your Copilot Studio agents, their components, tools, connectors, and authentication configurations from each Power Platform environment registered as its own cloud account, through the same Add New Cloud Account wizard used for Azure subscriptions. Enabling discovery requires **tenant admin consent** and a **Dataverse Application User** — see [Grant Atlas access to your tenant](/_docs/docs/providers/azure/tenant_setup). For what is discovered, see [MS Copilot Studio](/_docs/docs/providers/copilot_studio#agent-discovery).
- **Runtime** — every tool invocation in a Copilot Studio agent is sent to Atlas for policy evaluation before execution, returning an Allow or Block decision, through Copilot Studio's external threat detection (a Microsoft preview feature). See [MS Copilot Studio](/_docs/docs/providers/copilot_studio#how-tool-invocations-are-evaluated).

## Enable Copilot Studio connection identity (optional)[​](#enable-copilot-studio-connection-identity-optional)
This is an optional enrichment, separate from base onboarding — base discovery of your Copilot Studio agents, tools, connectors, and connections works without it. Opting in lets Atlas resolve each Copilot Studio connection's acting identity: the **Account Name** the connection authenticates as, whether it is an **SSO connection**, and who **Created** it.

To enable it, register the **AllTrue AISec** application (Application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`) as a Power Platform management application. A user holding the **Power Platform Administrator** or **Global Administrator** role runs this once, from Azure Cloud Shell:

```
az rest --method put \
 --url "https://api.bap.microsoft.com/providers/Microsoft.BusinessAppPlatform/adminApplications/0bc5e064-36f6-4d09-93ed-b7643dd05404?api-version=2020-10-01" \
 --resource "https://service.powerapps.com/"

```
Microsoft treats a management application as having Power Platform Administrator–equivalent access to the Power Platform management APIs, tenant-wide; by Microsoft's design this grant cannot be scoped to specific environments or narrowed to read-only. Atlas itself only ever issues read-only calls under it and modifies nothing in your Power Platform tenant.

The registration is reversible at any time. To revoke it, run the matching `delete` as a Power Platform Administrator or Global Administrator:

```
az rest --method delete \
 --url "https://api.bap.microsoft.com/providers/Microsoft.BusinessAppPlatform/adminApplications/0bc5e064-36f6-4d09-93ed-b7643dd05404?api-version=2020-10-01" \
 --resource "https://service.powerapps.com/"

```
Even after opting in, not every connection resolves a fixed identity. Tools configured to run as the end user show *Invoker mode tools have no fixed account names* — the runtime identity is whoever uses the agent — and connectors that use public, anonymous, key-based, or certificate-based authentication legitimately expose no account identity.
[PreviousAWS Permission and Inventory Coverage](/_docs/docs/providers/aws/permission_breakdown)[NextAzure + Copilot Studio onboarding](/_docs/docs/providers/azure/onboarding)- [How Atlas integrates with an Azure AI environment](#how-atlas-integrates-with-an-azure-ai-environment)- [Connect your Azure and Power Platform accounts for discovery](#link-your-azure-subscriptions-for-discovery)- [Discover Azure Databricks workspaces](#discover-azure-databricks-workspaces)- [How Atlas discovers SharePoint](#how-atlas-discovers-sharepoint)- [Use Azure OpenAI with AI Runtime and AI Red Team](#use-azure-openai-with-ai-runtime-and-ai-red-team)- [MS Copilot Studio: discovery and runtime](#ms-copilot-studio-discovery-and-runtime)- [Enable Copilot Studio connection identity (optional)](#enable-copilot-studio-connection-identity-optional)
