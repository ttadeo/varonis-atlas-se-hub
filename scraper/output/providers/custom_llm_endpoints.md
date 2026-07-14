---
title: Custom LLM endpoints
url: https://prod.alltrue-be.com/_docs/docs/providers/custom
section: providers
---

# Custom LLM endpoints

- [](/_docs/)- [Providers](/_docs/docs/providers)- Custom LLM endpointsExport PDFOn this page# Custom LLM endpoints
The **Custom** provider lets you register any HTTP-reachable LLM-style endpoint with Atlas as a manually added LLM Endpoint resource. Once added, Atlas can route runtime traffic to that endpoint through AI Gateway, run AI Red Team pentests against it, and include it in guardrail evaluation alongside endpoints from the named providers. This page covers when to use Custom, how to add an endpoint, and the two supported authorization methods.

## Overview[​](#overview)
A Custom LLM endpoint is a manually added LLM Endpoint resource in [AI Inventory](/_docs/docs/applications/ai_inventory). You give Atlas a URL plus authorization details; Atlas treats the resulting endpoint as a first-class destination for runtime forwarding and pentest. The page is about *connecting* to an endpoint you already operate — Atlas does not install, deploy, or host the model.

## When to use a Custom provider[​](#when-to-use-a-custom-provider)
Use the Custom provider when the target endpoint is not one of the other named providers — for example, an internal model gateway, a third-party chatbot API, or an OpenAI-compatible endpoint behind your own authentication.

**Common pattern: OpenAI-compatible endpoints.** Many customers register self-hosted vLLM, Together, or internal-proxy endpoints that speak the OpenAI chat-completions protocol. There is no dedicated Atlas branch for "OpenAI-compatible Custom" — the endpoint is registered as a normal Custom endpoint with **Header-Based Authorization** (passing the bearer token or API key as a static header).

## How to add a Custom LLM endpoint[​](#how-to-add-a-custom-llm-endpoint)
To register a Custom endpoint:

- Go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint**.
- Choose **Custom** as the provider.
- Enter the **Endpoint Name** (placeholder *Set Endpoint Name*). This field is required; the project assignment and authorization-method controls only become active once it is set.
- Assign the endpoint to a project.
- Choose an authorization method (see below).

Note: Custom always requires credentials. The *skip pentest credentials* option used by some other providers is not available for Custom endpoints.

## Authorization methods[​](#authorization-methods)
Once the Endpoint Name is set, the **Authorization Method** radio offers two choices:

- **Header-Based Authorization** — pass static headers (such as a bearer token or API key header) with each request. Use this when a fixed credential string is enough to authenticate.
- **Custom Authorization Script** — run a small Atlas-side script to obtain credentials at runtime (for example, to fetch a short-lived token before each call). The script is authored as an LLM DSL specification.

## Header-Based Authorization setup[​](#header-based-authorization-setup)
Configure these fields, in the order shown in the form:

- **Pentest URL** — the full URL Atlas will call when forwarding requests or running a pentest.
- **Method** — the HTTP method.
- **Headers** — the static request headers, including any authorization header.
- **Body** — the request body template.
- **Response JSON Paths** — JSON paths Atlas uses to extract the model's reply from the response payload.
- **Response Type** — the expected response shape.
- **Response Error Values** — values that indicate the request failed even when the HTTP status is `200`.

A **Review Headers** banner reminds you to double-check the headers carry the credentials the endpoint expects.

## Custom Authorization Script setup[​](#custom-authorization-script-setup)
If your endpoint needs runtime authorization (for example, exchanging a refresh token for a short-lived access token before each call), choose **Custom Authorization Script** and pick a **File Configuration** from the dropdown (placeholder *Select Configuration*). Click **New** to author a fresh specification.

A File Configuration is an LLM DSL specification — Atlas runs the script against the endpoint and uses the resulting credentials for runtime forwarding and pentest. For the DSL syntax and authoring guide, see [LLM DSL Specification](/_docs/docs/applications/llm_dsl_specification).

## Runtime and pentest behavior[​](#runtime-and-pentest-behavior)
Atlas treats a Custom endpoint like any other manually added LLM endpoint:

- **AI Gateway** forwards runtime traffic to the URL you configured (the Pentest URL for Header-Based Authorization, or the base URL from the DSL specification for Custom Authorization Script). See [AI Gateway](/_docs/docs/applications/ai_gateway).
- **AI Red Team** replays pentest prompts against the same URL using the configured authorization. See [AI Red Team](/_docs/docs/applications/ai_red_team).
- **Guardrail integration** is available for Custom endpoints in the same way as for endpoints from named providers.
- **AI Evaluations** recognizes Custom as a first-class endpoint type alongside other manually added endpoints. See [AI Evaluations](/_docs/docs/applications/ai_red_team/ai_validation_sandbox).
[PreviousOpenAI](/_docs/docs/providers/openai)[NextMS Copilot Studio](/_docs/docs/providers/copilot_studio)- [Overview](#overview)- [When to use a Custom provider](#when-to-use-a-custom-provider)- [How to add a Custom LLM endpoint](#how-to-add-a-custom-llm-endpoint)- [Authorization methods](#authorization-methods)- [Header-Based Authorization setup](#header-based-authorization-setup)- [Custom Authorization Script setup](#custom-authorization-script-setup)- [Runtime and pentest behavior](#runtime-and-pentest-behavior)
