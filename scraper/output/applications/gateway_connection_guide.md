---
title: Connecting an Application to the Atlas AI Gateway Proxy
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_gateway
section: applications
---

# Connecting an Application to the Atlas AI Gateway Proxy

To route an application's LLM traffic through the Atlas AI Gateway, you make a single configuration change: replace the LLM provider's base URL with the Atlas proxy URL. No code changes are required beyond updating where requests are pointed and how authentication is handled.

## The Core Change — Base URL Swap

Every major LLM SDK accepts a `base_url` parameter. To route through Atlas, set that parameter to your Atlas proxy URL instead of the provider's default endpoint.

### OpenAI Example

**Without Proxy (direct to OpenAI):**
```
POST https://api.openai.com/v1/chat/completions
Authorization: Bearer <YOUR-OPENAI-API-KEY>
```

**With Atlas Proxy:**
```
POST https://<YOUR-PROXY-BASE-URL>/v1/chat/completions
Authorization: Bearer <YOUR-OPENAI-API-KEY>
x-alltrue-llm-endpoint-identifier: <your-endpoint-identifier>
```

In the OpenAI Python SDK:
```python
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url="https://<YOUR-PROXY-BASE-URL>/v1"
)
```

The API key stays the same. The only change is `base_url`.

### Anthropic Example

**Without Proxy:**
```
POST https://api.anthropic.com/v1/messages
```

**With Atlas Proxy:**
```python
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ.get("ANTHROPIC_API_KEY"),
    base_url="https://<YOUR-PROXY-BASE-URL>"
)
```

### Azure OpenAI Example

For Azure OpenAI, replace the Azure resource URL with the Atlas proxy URL and add the required headers for proxy routing:

```
POST <YOUR_VARONIS_PROXY_URL>/custom/openai/deployments/<deployment-id>/chat/completions
x-alltrue-llm-base-url: https://<YOUR_RESOURCE_NAME>.openai.azure.com
x-alltrue-llm-proxy-type: azure-openai
```

## Where to Find Your Proxy URL

Navigate to **AI Gateway → Policies → Configure Proxy** in the Atlas platform. The proxy base URL is displayed there for your specific tenant.

The format is: `https://api.<tenant-id>.<region>.prod.alltrue-be.com/openai/v1`

## Endpoint Identifier — For Attribution

To attribute LLM traffic to a specific resource in AI Inventory, add the endpoint identifier either:

- **In the URL path**: `https://<proxy-base-url>/v1/endpoint/<your-endpoint-identifier>/`
- **In a request header**: `x-alltrue-llm-endpoint-identifier: <your-endpoint-identifier>`

The endpoint identifier links requests to the specific LLM endpoint resource registered in AI Inventory, enabling per-endpoint policy enforcement and audit trail.

## What Changes Immediately After Routing Through Atlas

Once an application points at the Atlas Gateway instead of directly at the LLM provider:

- All prompts pass through guardrail evaluation before reaching the LLM
- BLOCK rules can stop requests inline before they reach the provider
- MODIFY rules redact sensitive content before forwarding the prompt
- Every request is logged in the AI Observability layer (in the customer's data plane)
- Issues are created in Atlas for any policy violations
- The security team gains a complete audit trail: who sent what, to which endpoint, when

## Supported LLM Providers

The Atlas AI Gateway supports routing for:
- OpenAI (direct API and Python SDK)
- Azure OpenAI
- Anthropic Claude (direct API and Python SDK, including via LangChain)
- Google Gemini
- IBM WatsonX

For each provider, the integration pattern is the same: replace the base URL, keep the API key, optionally add the endpoint identifier header.

## SE Talking Point

The message for customers: *nothing changes in the application logic*. One endpoint swap gives the security team full visibility, enforcement, and audit trail with zero changes to the application code or developer workflow.
