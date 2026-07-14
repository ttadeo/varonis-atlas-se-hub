---
title: Gemini
url: https://prod.alltrue-be.com/_docs/docs/providers/gemini
section: providers
---

# Gemini

- [](/_docs/)- [Providers](/_docs/docs/providers)- GeminiExport PDFOn this page# Gemini
Atlas integrates with Google Gemini in two distinct shapes: Gemini as a runtime **Evaluator LLM** that the Atlas platform calls internally for guardrail evaluation, and Gemini as a manually added **LLM endpoint resource** that AI Gateway forwards traffic to and AI Red Team can pentest. This page covers both. There is no Atlas-side discovery pipeline for Gemini analogous to AWS Bedrock — Gemini endpoints are added manually.

## Overview[​](#overview)
Gemini surfaces inside Atlas in two places:

- **Evaluator LLM** — set under **Admin Console &gt; Runtime Evaluator LLM**. Two Gemini sub-providers are available: **Gemini Generative Language** (API key against `generativelanguage.googleapis.com`) and **Gemini Vertex AI** (Service Account against Vertex AI).
- **Manually added LLM endpoint** — set under **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint**, selecting the **Google AI** provider. This endpoint accepts an API key against `generativelanguage.googleapis.com`. Atlas does NOT support adding a Vertex AI manually added endpoint here — Vertex AI is available only as an Evaluator LLM (see below).

The rest of this page maps each Atlas-side workflow (Evaluator LLM, AI Gateway, AI Red Team) to the corresponding Gemini shape.

## Gemini as an Evaluator LLM[​](#gemini-as-an-evaluator-llm)
Configure Gemini as an Evaluator LLM from **Admin Console &gt; Runtime Evaluator LLM &gt; Credentials**. The provider dropdown exposes two Gemini entries:

- **Gemini Generative Language** — connects to Google's Generative Language API. The credential is a single **API Key**.
- **Gemini Vertex AI** — connects to Vertex AI. The credential is a **Service Account Info JSON** (required), plus an optional **GCP Region** and an optional **GCP Project ID**.

For Gemini Vertex AI, the Service Account Info JSON must parse as JSON and contain at least `type`, `client_email`, and `private_key`. The **GCP Region** and **GCP Project ID** fields are optional. Leave them blank to use the project and region encoded in the Service Account JSON, or set them to override.

The default evaluator model for both Gemini sub-providers is in the Gemini 2.5 Flash family.

For the full evaluator-LLM credential lifecycle, see [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm).

## Gemini as a manually added LLM endpoint[​](#gemini-as-a-manually-added-llm-endpoint)
To register a Gemini endpoint for AI Gateway / AI Red Team use, go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint** and select **Google AI** as the provider. The endpoint takes a single API key. (If the API key value is pasted with a leading `Bearer ` prefix, Atlas strips it automatically.)

The manually added endpoint connects to Google's Generative Language API at `generativelanguage.googleapis.com`. Vertex AI is supported as an Evaluator LLM only; to send runtime traffic to Vertex AI, see [AI Gateway](/_docs/docs/applications/ai_gateway).

Once the endpoint is registered, Atlas can:

- Forward runtime traffic to it through AI Gateway (see next section).
- Pentest it from AI Red Team using a Gemini 2.5 Flash family model by default.

## Runtime forwarding via AI Gateway[​](#runtime-forwarding-via-ai-gateway)
Runtime traffic to a Gemini endpoint flows through AI Gateway. The Gateway exposes a built-in Google route and accepts a `google` proxy-type header for Gemini destinations. For the SDK example and the rest of the proxy lifecycle, see the Gemini section of [AI Gateway](/_docs/docs/applications/ai_gateway).

## Pentesting Gemini endpoints with AI Red Team[​](#pentesting-gemini-endpoints-with-ai-red-team)
AI Red Team pentests a Gemini endpoint with no additional setup beyond providing the API key on the LLM endpoint resource. Atlas selects a pentest model from the Gemini 2.5 Flash family by default.

For pentest run configuration and the rest of the AI Red Team workflow, see [AI Red Team](/_docs/docs/applications/ai_red_team).

## Related[​](#related)

- [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm)
- [AI Gateway](/_docs/docs/applications/ai_gateway)
- [AI Red Team](/_docs/docs/applications/ai_red_team)
- [AWS Bedrock](/_docs/docs/providers/aws_bedrock)
[PreviousAzure OpenAI](/_docs/docs/providers/azure_openai)[NextOpenAI](/_docs/docs/providers/openai)- [Overview](#overview)- [Gemini as an Evaluator LLM](#gemini-as-an-evaluator-llm)- [Gemini as a manually added LLM endpoint](#gemini-as-a-manually-added-llm-endpoint)- [Runtime forwarding via AI Gateway](#runtime-forwarding-via-ai-gateway)- [Pentesting Gemini endpoints with AI Red Team](#pentesting-gemini-endpoints-with-ai-red-team)- [Related](#related)
