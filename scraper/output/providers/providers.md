---
title: Providers
url: https://prod.alltrue-be.com/_docs/docs/providers
section: providers
---

# Providers

- [](/_docs/)- ProvidersExport PDFOn this page# Providers
Each provider integration in Atlas can occupy one or more of four distinct **provider scopes**. This page names the scopes and orients you to the per-provider pages that cover each provider's full integration in detail.

## What "Providers" covers in Atlas[​](#what-providers-covers-in-atlas)
A provider integration in Atlas can occupy one or more of four distinct scopes. Reading from "what Atlas knows about your account" toward "what Atlas does at request time":

- **Cloud-discovery account link** — Atlas links a cloud account and runs a discovery pipeline that inventories provider-managed resources (for example, AWS Bedrock foundation models, agents, and AgentCore from a linked AWS account; or Azure OpenAI deployments, assistants, and usage from a linked Azure subscription). The resulting resources appear in AI Inventory and surface findings in AI SPM.
- **Hosted service link** — Atlas links a provider-managed SaaS account via API key (today, OpenAI) and inventories what that key can see. The Hosted Services configuration in [AI Inventory](/_docs/docs/applications/ai_inventory) lists each linked service.
- **Gateway-proxied runtime LLM endpoint** — Atlas registers a manually added LLM endpoint resource (with provider-specific credentials) and [AI Gateway](/_docs/docs/applications/ai_gateway) forwards runtime traffic to it. The same endpoint becomes the resource type that [AI Red Team](/_docs/docs/applications/ai_red_team) targets for pentests.
- **Evaluator LLM credential** — Atlas stores credentials for a provider's API and uses that provider's models internally for runtime guardrail evaluation, report generation, and pentest evaluations. See [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm).

Each per-provider page below maps that provider to the subset of scopes Atlas supports for it. The list of providers in the rest of this page is the canonical sign-post — pick the provider you want to integrate, and the deep-dive page covers the configuration, credentials, and surrounding workflows.

## AWS Bedrock[​](#aws-bedrock)
Atlas integrates with AWS Bedrock through the **AWS cloud-discovery pipeline**: Atlas links your AWS account, the discovery scan inventories Bedrock foundation models, imported models, marketplace endpoints, custom models, Bedrock agents (with aliases, versions, and action groups), and AgentCore resources, and posture findings surface in AI SPM. AWS Bedrock also supports a manually added LLM endpoint resource for runtime invocation through AI Gateway. Read more → [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

## Anthropic[​](#anthropic)
Atlas integrates with Anthropic through three independent surfaces: a manually added **Anthropic LLM endpoint** that AI Gateway proxies and AI Red Team pentests, an **Anthropic Compliance API log source** that pulls Claude usage history into the Atlas log pipeline, and an **Anthropic evaluator LLM** for runtime guardrail evaluation. Read more → [Anthropic](/_docs/docs/providers/anthropic).

## Azure[​](#azure)
Atlas consolidates Azure onboarding on a single provider page. Link your Azure subscriptions for discovery (all subscriptions in a tenant, or a selected set), and Atlas inventories your Azure AI environment — Azure OpenAI, Azure Databricks, Machine Learning, storage, AI Search, Copilot Studio, and AI Foundry resources — authenticating with a single read-only per-tenant identity. The Azure page also covers AI-aware SharePoint discovery, cross-links Azure OpenAI for runtime, and cross-links MS Copilot Studio for discovery and runtime, plus the optional Copilot Studio connection-identity enrichment opt-in. Read more → [Azure](/_docs/docs/providers/azure).

## Azure OpenAI[​](#azure-openai)
Atlas integrates with Microsoft's Azure OpenAI Service in three shapes: **Azure OpenAI** is a manually added LLM endpoint provider (AI Runtime forwards traffic to it; AI Red Team targets it); it is also cloud-discoverable — when an Azure subscription is linked, Atlas enumerates Azure OpenAI Cognitive Services accounts and their deployments (assistants, files, fine-tune jobs, models, vector stores, and usage) into AI Inventory, analogous to AWS Bedrock discovery; and **Azure AI Foundry** is a distinct evaluator-LLM provider used internally by report generation, pentest evaluations, and runtime guardrails. Read more → [Azure OpenAI](/_docs/docs/providers/azure_openai).

## Gemini[​](#gemini)
Atlas integrates with Google Gemini in two shapes: **Gemini** is available as an evaluator-LLM provider in two variants (Gemini Generative Language and Gemini Vertex AI), and as a manually added LLM endpoint resource under the **Google AI** provider label for AI Gateway runtime forwarding and AI Red Team pentest. Vertex AI is supported only as an Evaluator LLM, not as a manually added LLM endpoint resource. Read more → [Gemini](/_docs/docs/providers/gemini).

## OpenAI[​](#openai)
Atlas integrates with OpenAI as a **Hosted Service** (under the UI label *Choose AI Service Provider*) — you link your OpenAI organization with a project-level **API Key** and/or an organization-level **Admin API Key** (at least one must be provided), and Atlas inventories the OpenAI resources those keys can see. OpenAI is also available as a manually added LLM endpoint resource for AI Gateway runtime forwarding and as an evaluator-LLM provider. Read more → [OpenAI](/_docs/docs/providers/openai).

## Custom[​](#custom)
When the target endpoint is not one of the named providers — for example, an internal model gateway, a third-party chatbot API, or an OpenAI-compatible endpoint behind your own authentication — register it under the **Custom** provider as a manually added LLM endpoint. Atlas supports two authorization methods: **Header-Based Authorization** (static headers) and **Custom Authorization Script** (runtime auth steps authored as an [LLM DSL specification](/_docs/docs/applications/llm_dsl_specification)). Read more → [Custom LLM endpoints](/_docs/docs/providers/custom).
[PreviousMCP Server for Coding Agents](/_docs/docs/platform_services/mcp_server)[NextAWS](/_docs/docs/providers/aws)- [What "Providers" covers in Atlas](#what-providers-covers-in-atlas)- [AWS Bedrock](#aws-bedrock)- [Anthropic](#anthropic)- [Azure](#azure)- [Azure OpenAI](#azure-openai)- [Gemini](#gemini)- [OpenAI](#openai)- [Custom](#custom)
