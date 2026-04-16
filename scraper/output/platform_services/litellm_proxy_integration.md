---
title: LiteLLM Proxy Integration
url: https://playground.alltrue-be.com/_docs/docs/platform_services/litellm
section: platform_services
---

# LiteLLM Proxy Integration

- [](/_docs/)- Integration Examples- LiteLLM Proxy IntegrationOn this page# LiteLLM Proxy Integration
If you use [LiteLLM Proxy](https://docs.litellm.ai/docs/simple_proxy) as your AI gateway, you can add TRiSM Hub guardrails to every LLM call without changing application code. LiteLLM Proxy's [Generic Guardrail API](https://docs.litellm.ai/docs/proxy/guardrails/quick_start) sends each request and response to the TRiSM Hub for policy evaluation. The TRiSM Hub applies all installed guardrail rules — PII detection, prompt injection protection, topic blocking, and more — and returns a decision that LiteLLM Proxy enforces automatically.

## How It Works[​](#how-it-works)
When a client sends a request through LiteLLM Proxy:

- **Pre-call evaluation** — Before the request reaches the LLM, the proxy sends it to TRiSM Hub. If a guardrail rule blocks the request, the proxy returns an error to the client and the LLM is never called. If a rule modifies the input (e.g., redacting PII), the modified content is forwarded to the LLM.
- **LLM call** — The (potentially modified) request is sent to the configured LLM provider.
- **Post-call evaluation** — After the LLM responds, the proxy sends the output to TRiSM Hub. Rules can block the response, modify it (e.g., re-identifying previously redacted PII), or let it pass through unchanged.
- **Response to client** — The client receives the final, guardrail-processed response.

All rule processing happens on the customer data plane. Rule settings are retrieved from the TRiSM Hub control plane, but no unencrypted LLM data leaves your account.

## Prerequisites[​](#prerequisites)
Before configuring the integration, you need:

- **A TRiSM Hub API key.** Generate one from the [Admin Console](/_docs/docs/platform_services/admin_console).
- **An endpoint identifier.** Create one in the TRiSM Hub to associate guardrail policies with your LLM endpoint.
- **LiteLLM Proxy** deployed and accessible to your applications (see [LiteLLM Proxy documentation](https://docs.litellm.ai/docs/simple_proxy)).
- **Guardrail rules installed** on the endpoint in TRiSM Hub. Use the AI Runtime Protection policy configuration to select which rules to apply.

## Configuration[​](#configuration)
Add a `guardrails` section to your LiteLLM Proxy `config.yaml`:

```
litellm_settings:
 guardrails:
 - guardrail_name: "trism-hub"
 litellm_params:
 guardrail: generic_guardrail_api
 mode: [pre_call, post_call]
 api_base: &lt;YOUR-TRISM-GUARDRAIL-BASE-URL&gt;
 api_key: &lt;YOUR-TRISM-API-KEY&gt;
 default_on: true

 extra_headers:
 - x-litellm-varonis-endpoint-identifier

 additional_provider_specific_params:
 llm-endpoint-identifier: &lt;YOUR-ENDPOINT-IDENTIFIER&gt;

```
### Configuration Parameters[​](#configuration-parameters)
ParameterDescriptionRequired`guardrail_name`A unique name for this guardrail (used by clients to reference it)Yes`guardrail`Must be `generic_guardrail_api`Yes`mode`When to evaluate: `pre_call`, `post_call`, `during_call`, or a list (e.g., `[pre_call, post_call]`)Yes`api_base`Base URL of the TRiSM Hub guardrail endpointYes`api_key`Your TRiSM Hub API keyYes`default_on`When `true`, this guardrail runs on every request automatically. When `false`, clients must opt in per requestNo (default: `false`)`unreachable_fallback`Behavior when TRiSM Hub is unreachable: `fail_closed` blocks the request, `fail_open` allows it throughNo (default: `fail_closed`)`extra_headers`List of client request header names to forward to the guardrail endpoint. Include `x-litellm-varonis-endpoint-identifier` so that per-request endpoint routing worksNo`additional_provider_specific_params`Key-value pairs passed to the guardrail in every request. Use `llm-endpoint-identifier` as a fallback when the header is not setNo
### Endpoint Identifier Resolution[​](#endpoint-identifier-resolution)
The TRiSM Hub uses an **endpoint identifier** to determine which guardrail policies apply to a given request. The identifier is resolved in this order:

- The `x-litellm-varonis-endpoint-identifier` request header (if forwarded via `extra_headers`)
- The `llm-endpoint-identifier` value in `additional_provider_specific_params`

If you have a single LLM endpoint, setting `llm-endpoint-identifier` in `additional_provider_specific_params` is the simplest approach. If you route multiple endpoints through the same proxy and need different policies per endpoint, have your clients set the `x-litellm-varonis-endpoint-identifier` header on each request.

### Guardrail Modes[​](#guardrail-modes)
ModeWhen it runsUse case`pre_call`Before the LLM callBlock or modify prompts before they reach the LLM`post_call`After the LLM respondsInspect and filter LLM output, re-identify redacted PII`during_call`In parallel with the LLM callEvaluate input while the LLM processes; blocks response delivery if a violation is found`logging_only`After the LLM respondsAudit and log without blocking or modifying
You can combine modes as a list. A typical configuration uses `[pre_call, post_call]` to evaluate both inputs and outputs.

## Sending Requests Through the Proxy[​](#sending-requests-through-the-proxy)
Once configured, applications send LLM requests to the LiteLLM Proxy as usual. The guardrail runs transparently.

- Python (OpenAI SDK)- Python (OpenAI SDK) with per-request endpoint identifier- REST API (cURL)- JavaScript (OpenAI SDK)```
import openai

client = openai.OpenAI(
 api_key="&lt;YOUR-LLM-API-KEY&gt;",
 base_url="&lt;YOUR-LITELLM-PROXY-URL&gt;"
)

# Guardrails run automatically when default_on is true
response = client.chat.completions.create(
 model="gpt-4o",
 messages=[
 {"role": "user", "content": "Summarize the quarterly report"}
 ]
)
print(response.choices[0].message.content)

``````
import openai

client = openai.OpenAI(
 api_key="&lt;YOUR-LLM-API-KEY&gt;",
 base_url="&lt;YOUR-LITELLM-PROXY-URL&gt;",
 default_headers={
 "x-litellm-varonis-endpoint-identifier": "&lt;YOUR-ENDPOINT-IDENTIFIER&gt;"
 }
)

response = client.chat.completions.create(
 model="gpt-4o",
 messages=[
 {"role": "user", "content": "Summarize the quarterly report"}
 ]
)
print(response.choices[0].message.content)

``````
curl --request POST \
 --url '&lt;YOUR-LITELLM-PROXY-URL&gt;/chat/completions' \
 --header 'Authorization: Bearer &lt;YOUR-LLM-API-KEY&gt;' \
 --header 'Content-Type: application/json' \
 --header 'x-litellm-varonis-endpoint-identifier: &lt;YOUR-ENDPOINT-IDENTIFIER&gt;' \
 --data '{
 "model": "gpt-4o",
 "messages": [
 {
 "role": "user",
 "content": "Summarize the quarterly report"
 }
 ]
}'

``````
import OpenAI from "openai";

const client = new OpenAI({
 apiKey: "&lt;YOUR-LLM-API-KEY&gt;",
 baseURL: "&lt;YOUR-LITELLM-PROXY-URL&gt;",
 defaultHeaders: {
 "x-litellm-varonis-endpoint-identifier": "&lt;YOUR-ENDPOINT-IDENTIFIER&gt;"
 }
});

const response = await client.chat.completions.create({
 model: "gpt-4o",
 messages: [
 { role: "user", content: "Summarize the quarterly report" }
 ]
});
console.log(response.choices[0].message.content);

```
## Guardrail Behavior[​](#guardrail-behavior)
When a request or response is evaluated, the TRiSM Hub returns one of three outcomes:

OutcomeWhat happensExample**Pass**The request or response proceeds unchangedContent passes all policy rules**Block**The proxy returns an error to the client; the LLM is not called (pre-call) or the response is not delivered (post-call)A prompt injection attempt is detected**Modify**The content is altered before continuingPII is redacted from the prompt before sending to the LLM, then re-identified in the response
When a request is blocked, the client receives an error response from LiteLLM Proxy:

```
{
 "error": {
 "message": "Violated guardrail policy",
 "type": "None",
 "param": "None",
 "code": "400"
 }
}

```
## Per-Request Guardrail Control[​](#per-request-guardrail-control)
If `default_on` is set to `false`, clients must explicitly request the guardrail on each call. This is useful when you want guardrails only on specific routes or use cases.

- Request body- OpenAI Python SDK- Key-level enforcementAdd the guardrail name to the `guardrails` field in the request body:
```
{
 "model": "gpt-4o",
 "messages": [{"role": "user", "content": "Hello"}],
 "guardrails": ["trism-hub"]
}

```Pass the guardrail name via `extra_body`:
```
response = client.chat.completions.create(
 model="gpt-4o",
 messages=[{"role": "user", "content": "Hello"}],
 extra_body={"guardrails": ["trism-hub"]}
)

```Assign guardrails when generating a LiteLLM virtual key to enforce them for all requests using that key:
```
curl --request POST \
 --url '&lt;YOUR-LITELLM-PROXY-URL&gt;/key/generate' \
 --header 'Authorization: Bearer &lt;YOUR-LITELLM-MASTER-KEY&gt;' \
 --header 'Content-Type: application/json' \
 --data '{
 "guardrails": ["trism-hub"]
 }'

```
## Unreachable Fallback[​](#unreachable-fallback)
The `unreachable_fallback` parameter controls what happens when the TRiSM Hub guardrail endpoint is unreachable (network errors, timeouts):

SettingBehavior`fail_closed` (default)Block the request. No LLM calls proceed until the guardrail is reachable again`fail_open`Allow the request through to the LLM without guardrail evaluation
For production environments where availability is critical, consider `fail_open` with `logging_only` mode as a secondary guardrail to ensure requests are still audited even when the primary guardrail is unavailable.

## Full Configuration Example[​](#full-configuration-example)
The following example shows a complete `config.yaml` with the TRiSM Hub guardrail alongside a model configuration:

```
model_list:
 - model_name: gpt-4o
 litellm_params:
 model: openai/gpt-4o
 api_key: os.environ/OPENAI_API_KEY

 - model_name: claude-sonnet
 litellm_params:
 model: anthropic/claude-sonnet-4-20250514
 api_key: os.environ/ANTHROPIC_API_KEY

litellm_settings:
 guardrails:
 - guardrail_name: "trism-hub"
 litellm_params:
 guardrail: generic_guardrail_api
 mode: [pre_call, post_call]
 api_base: &lt;YOUR-TRISM-GUARDRAIL-BASE-URL&gt;
 api_key: os.environ/TRISM_API_KEY
 default_on: true
 unreachable_fallback: fail_closed

 extra_headers:
 - x-litellm-varonis-endpoint-identifier

 additional_provider_specific_params:
 llm-endpoint-identifier: &lt;YOUR-ENDPOINT-IDENTIFIER&gt;

```
Note: LiteLLM supports reading environment variables in the config file using the `os.environ/VARIABLE_NAME` syntax. Use this for API keys instead of embedding them directly.

## Verifying the Integration[​](#verifying-the-integration)
After configuring the guardrail:

- Start (or restart) the LiteLLM Proxy with your updated `config.yaml`.
- Verify the guardrail is registered by calling the LiteLLM guardrails list endpoint:
```
curl &lt;YOUR-LITELLM-PROXY-URL&gt;/guardrails/list

```
You should see `trism-hub` in the response.
- Send a test request through the proxy and verify that LiteLLM returns the `x-litellm-applied-guardrails` response header.
- Check the TRiSM Hub **AI Runtime Protection** dashboard to confirm that the request appears in the activity log.
- Test a blocked scenario by sending a prompt that triggers one of your installed policy rules (e.g., a prompt containing PII if you have a PII detection rule installed).
[PreviousGetting Started with API Calls](/_docs/docs/platform_services/api)[NextMicrosoft Copilot Studio Integration](/_docs/docs/platform_services/copilot_studio)- [How It Works](#how-it-works)- [Prerequisites](#prerequisites)- [Configuration](#configuration)[Configuration Parameters](#configuration-parameters)- [Endpoint Identifier Resolution](#endpoint-identifier-resolution)- [Guardrail Modes](#guardrail-modes)- [Sending Requests Through the Proxy](#sending-requests-through-the-proxy)- [Guardrail Behavior](#guardrail-behavior)- [Per-Request Guardrail Control](#per-request-guardrail-control)- [Unreachable Fallback](#unreachable-fallback)- [Full Configuration Example](#full-configuration-example)- [Verifying the Integration](#verifying-the-integration)
