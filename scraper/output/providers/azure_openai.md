---
title: Azure OpenAI
url: https://prod.alltrue-be.com/_docs/docs/providers/azure_openai
section: providers
---

# Azure OpenAI

- [](/_docs/)- [Providers](/_docs/docs/providers)- Azure OpenAIExport PDFOn this page# Azure OpenAI
Atlas integrates with Microsoft's Azure OpenAI Service in two distinct shapes that map to two different Atlas surfaces. **Azure OpenAI** is an LLM endpoint provider — once an endpoint is added, AI Runtime can forward traffic to it and AI Red Team can target it. **Azure AI Foundry** is a separate evaluator-LLM provider used internally by report generation, pentest evaluations, and runtime guardrails. This page documents both. Azure OpenAI endpoints can be added manually, and they can also be auto-discovered when an Azure subscription is linked under AI Inventory &gt; Discovery Configuration &gt; Cloud Accounts — Azure OpenAI Cognitive Services accounts and their deployments are enumerated via the Cognitive Services Management API, analogous to AWS Bedrock discovery.

## How Atlas integrates with Azure OpenAI[​](#how-atlas-integrates-with-azure-openai)
There are two Azure surfaces inside Atlas:

- **Azure OpenAI** — a manually added LLM endpoint provider. Once registered, the endpoint becomes a forwardable target for AI Runtime and an in-scope resource for AI Red Team.
- **Azure AI Foundry** — a separate evaluator-LLM provider configured under Admin Console &gt; Runtime Evaluator LLM. Atlas uses it for report generation, pentest evaluations, and runtime guardrails that evaluate prompts and responses.

Atlas supports two ingestion paths for Azure OpenAI: (a) automatic discovery when an Azure subscription is linked — Cognitive Services accounts of kind "OpenAI" and their deployments are enumerated, including assistants, files, fine-tune jobs, models, vector stores, and usage; and (b) manual registration of an individual endpoint by an operator. The rest of this page walks through the manual flow; see [Azure](/_docs/docs/providers/azure) for the Azure subscription-linking flow and the rest of the Azure AI environment.

## Manually adding an Azure OpenAI LLM endpoint[​](#manually-adding-an-azure-openai-llm-endpoint)
To add an Azure OpenAI endpoint, go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint** and select **Azure OpenAI** as the Provider. The form asks for:

- **API Key** — your Azure OpenAI key. Each API Key can only be associated with one project.
- **Endpoint Identifier** — set this when you are using the same API Key across multiple AI systems, to differentiate each endpoint's use case.
- **Project** — the project this endpoint is assigned to.

For Azure OpenAI endpoints, Atlas additionally requires two Azure-specific fields:

- **Resource Name**
- **Deployment Name**

Both can be found in your Azure portal. The next section explains what they map to.

For the broader Add New LLM Endpoint flow, see [AI Inventory](/_docs/docs/applications/ai_inventory).

## What "Resource Name" and "Deployment Name" mean[​](#what-resource-name-and-deployment-name-mean)
The two Azure-specific fields on the form map directly to the structure of an Azure OpenAI Service resource in the Azure portal:

- **Resource Name** is the name of your Azure OpenAI Service resource — the top-level Azure resource that hosts your model deployments.
- **Deployment Name** is the model deployment created inside that Azure OpenAI Service resource. A single Azure OpenAI Service resource typically hosts several deployments, one per model variant you operate.

You can find both in **Azure portal &gt; Azure OpenAI &gt; *your resource* &gt; Deployments**.

## Using Azure OpenAI endpoints with AI Runtime (Gateway)[​](#using-azure-openai-endpoints-with-ai-runtime-gateway)
Once an Azure OpenAI endpoint is added in AI Inventory, AI Runtime can forward traffic to it. Atlas enumerates Azure OpenAI alongside OpenAI, Anthropic, Gemini, and WatsonX as first-class routed providers in AI Runtime.

The Atlas-side routing setup is documented per provider on the AI Runtime page; see the Azure OpenAI section of [AI Gateway](/_docs/docs/applications/ai_gateway).

## Using Azure OpenAI endpoints with AI Red Team[​](#using-azure-openai-endpoints-with-ai-red-team)
Once an Azure OpenAI endpoint is added, you can target it from AI Red Team like any other manually added LLM endpoint.

For the AI Red Team workflow itself — scoping a run, configuring policies, reviewing findings — see [AI Red Team](/_docs/docs/applications/ai_red_team).

## Azure AI Foundry as an evaluator LLM[​](#azure-ai-foundry-as-an-evaluator-llm)
Atlas supports **Azure AI Foundry** as a runtime evaluator-LLM provider, separate from the Azure OpenAI LLM-endpoint flow above. Configure it under **Admin Console &gt; Runtime Evaluator LLM**.

In the **Credentials** tab, add Azure AI Foundry credentials. The form takes three fields:

- **Azure Endpoint** — your Azure AI Foundry endpoint URL (for example, `https://resource_name.openai.azure.com`).
- **API Key** — your Azure AI Foundry API key.
- **API Version (Optional)** — pin the API version you want Atlas to use.

You also identify the deployment you want Atlas to evaluate against — the **deployment ID** you created in Azure AI Foundry — and the **model** you deployed.

The evaluator LLM is what Atlas calls for report generation, pentest evaluations, and runtime guardrails that evaluate prompts and responses. The **Budget** tab tracks your spend; for the surrounding lifecycle and tab structure, see [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm).

For sibling provider pages, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).
[PreviousAnthropic Hosted Service](/_docs/docs/providers/anthropic/claude_hosted_service)[NextGemini](/_docs/docs/providers/gemini)- [How Atlas integrates with Azure OpenAI](#how-atlas-integrates-with-azure-openai)- [Manually adding an Azure OpenAI LLM endpoint](#manually-adding-an-azure-openai-llm-endpoint)- [What "Resource Name" and "Deployment Name" mean](#what-resource-name-and-deployment-name-mean)- [Using Azure OpenAI endpoints with AI Runtime (Gateway)](#using-azure-openai-endpoints-with-ai-runtime-gateway)- [Using Azure OpenAI endpoints with AI Red Team](#using-azure-openai-endpoints-with-ai-red-team)- [Azure AI Foundry as an evaluator LLM](#azure-ai-foundry-as-an-evaluator-llm)
