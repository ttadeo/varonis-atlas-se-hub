---
title: AI Runtime
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_gateway
section: applications
---

# AI Runtime

- [](/_docs/)- Applications- AI RuntimeExport PDFOn this page# AI Runtime
AI Runtime (previously: AI Runtime Protection) applies runtime guardrails to LLM requests and responses. It sits between an LLM endpoint and the clients that call it, intercepting traffic over HTTPS. The architecture is based on an nginx proxy that runs in a container on your data plane. All rules processing and policy evaluation happen entirely on the data plane — rule settings are retrieved from the control plane, but no unencrypted LLM data leaves your account. The architecture is shown below:

An application (or an end user interacting through an application such as a chatbot) sends a prompt to the LLM. Because of the application's configuration, the request is actually made to the proxy running within nginx. The proxy receives the prompt and forwards it to the policy evaluation system, which passes it to all relevant policy rules that are installed and applicable to the LLM endpoint. Each policy rule processes the prompt based on its definitions and returns a result. If the policy rule action is alert or log, processing happens asynchronously. If the action is block or modify, processing is synchronous. If one of the policy rules needs to block, the proxy does not let the prompt through to the LLM and returns an error to the caller. If a policy rule has a modify action, the prompt is modified per the rule and only then sent to the LLM.

A similar process happens with the response. Policy rules inspect responses and decide whether to log, alert, modify the response, or do nothing and let the response pass through to the client untouched.

AI Runtime forwards each input and output to the policy execution system, which applies guardrails to the inputs and outputs. You can also call guardrails directly without going through the proxy — by making calls from your applications or by integrating such calls from an existing API gateway.

## Data Encryption on the Data Plane[​](#data-encryption-on-the-data-plane)
All LLM content -- including prompts, responses, and conversation messages -- is encrypted on the data plane before being sent to the control plane. The encryption uses AES-256-GCM with customer-managed keys (BYOK), meaning:

- **No unencrypted LLM data leaves your account.** Every prompt and response is encrypted on your infrastructure before any network transmission to the control plane.
- **You own the encryption keys.** The Data Encryption Key (DEK) is stored in your cloud secret manager and protected by your KMS master key. You can rotate or revoke keys at any time.
- **The control plane stores only encrypted data.** When it needs to display content in the UI, it decrypts on-demand using your keys -- but plaintext is never persisted on the control plane.

Non-content metadata (such as rule verdicts, action types, model names, and token counts) is not encrypted, as it is required for analytics dashboards and does not contain LLM input/output data.

For a complete overview of the encryption architecture, including key rotation and revocation, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

## Pointing to the Proxy[​](#pointing-to-the-proxy)
To route your application's requests via the proxy, you set the base URL of your request to that of the proxy
(for example: `https://your-proxy-hostname/v1`). For API call attribution to resources (recommended), add an endpoint identifier using a URL such
as `https://your-proxy-hostname/v1/endpoint/&lt;your-endpoint-identifier&gt;`, or specify the identifier in the `x-alltrue-llm-endpoint-identifier` header.
Refer to the code snippets below for how to set the base URL for different model providers.

Supported integration pathsAI Runtime supports the major integration paths customers reach for first:

- [LiteLLM](/_docs/docs/integration_examples/litellm) — proxy traffic from any LiteLLM-compatible client.
- [Microsoft Copilot Studio](/_docs/docs/providers/copilot_studio) — point a Copilot Studio agent at AI Runtime.
- [Coding agents (Cursor, Claude Code, and similar)](/_docs/docs/coding_agent_protection/runtime_protection) — route developer-tool LLM traffic through AI Runtime.
For the full provider-specific examples (OpenAI, Azure OpenAI, Anthropic, Gemini, WatsonX), see the sections below.

### OpenAI[​](#openai)
- Rest API (cURL)- Python SDKTo use the proxy with the OpenAI API, direct your requests to the proxy base URL.
Without Proxy:
```
curl --request POST \
 --url https://api.openai.com/v1/chat/completions \
 --header 'Authorization: Bearer &lt;YOUR-API-KEY&gt;' \
 --header 'Content-Type: application/json' \
 --data '{
 "model": "gpt-4o-mini",
 "messages": [
 {
 "role": "user",
 "content": "Say this is a test",
 }
 ],
 "temperature": 0.7
}'

```With Proxy:
```
curl --request POST \
 --url 'https://&lt;YOUR-PROXY-BASE-URL&gt;/v1/text/chat/completions' \
 --header 'Authorization: Bearer &lt;YOUR-API-KEY&gt;' \
 --header 'Content-Type: application/json' \
 # Optional: additional parameters for session tracking and endpoint identification
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \
 --header 'x-alltrue-llm-endpoint-identifier: your-endpoint-identifier' \
 --data '{
 "model": "gpt-4o-mini",
 "messages": [
 {
 "role": "user",
 "content": "Say this is a test"
 }
 ],
 "temperature": 0.7
}'

```To use the proxy with the [OpenAI Python SDK](https://github.com/openai/openai-python), you can pass the `base_url` parameter to the `OpenAI` constructor.
Without Proxy:
```
import os
from openai import OpenAI

client = OpenAI(
 api_key=os.environ.get("OPENAI_API_KEY"),
)

chat_completion = client.chat.completions.create(
 messages=[
 {
 "role": "user",
 "content": "Say this is a test",
 }
 ],
 model="gpt-3.5-turbo",
)

```With Proxy:
```
import os
from openai import OpenAI

# Can optionally set additional parameters in the 'x-alltrue-llm-firewall-user-session' header for session tracking
# and `x-alltrue-llm-endpoint-identifier` header for endpoint identification
session_headers = {
 'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "Email1"}',
 'x-alltrue-llm-endpoint-identifier': 'your-endpoint-identifier'
}

client = OpenAI(
 api_key=os.environ.get("OPENAI_API_KEY"),
 base_url="INSERT BASE URL HERE",
 default_headers=session_headers
)

chat_completion = client.chat.completions.create(
 messages=[
 {
 "role": "user",
 "content": "Say this is a test",
 }
 ],
 model="gpt-3.5-turbo",
)

```
### Azure OpenAI[​](#azure-openai)
To use the proxy with the Azure OpenAI API, direct your requests to the proxy base URL.

- Rest API (cURL)- Python SDKWithout Proxy:
```
curl --request POST \
 --url https://&lt;AZURE_OPENAI_ENDPOINT&gt;/openai/deployments/&lt;your-deployment-id&gt;/chat/completions \
 --header 'Authorization: Bearer &lt;YOUR_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 --data '{
 "messages": [
 {
 "role": "user",
 "content": "Say this is a test"
 }
 ]
 }'

```With Proxy:
```
curl --request POST \
 --url &lt;YOUR_VARONIS_PROXY_URL&gt;/custom/openai/deployments/your-deployment-id/chat/completions?api-version=2024-10-21 \
 --header 'api-key: &lt;YOUR_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 # Optional: additional parameters for session tracking and endpoint identification
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \
 --header 'x-alltrue-llm-endpoint-identifier: your-endpoint-identifier' \
 --header 'x-alltrue-llm-base-url: https://&lt;YOUR_RESOURCE_NAME&gt;.openai.azure.com' \
 --header 'x-alltrue-llm-domain-matchers: [".*"]' \
 --header 'x-alltrue-llm-path-matchers: [".*"]' \
 --header 'x-alltrue-llm-proxy-type: azure-openai' \
 --data '{
 "messages": [
 {
 "role": "user",
 "content": "Say this is a test"
 }
 ]
 }'

```Without Proxy:
```
import os

from openai import AzureOpenAI

client = AzureOpenAI(
 api_key=os.environ.get("AZURE_OPENAI_API_KEY")
)

client.chat.completions.create(
 model="your-deployed-model",
 messages=[
 {
 "role": "user",
 "content": "Say this is a test",
 }
 ]
)

```With Proxy:
```
from openai import AzureOpenAI
import httpx

# Can optionally set additional parameters in the 'x-alltrue-llm-firewall-user-session' header for session tracking
# and `x-alltrue-llm-endpoint-identifier` header for endpoint identification
session_headers = {
 'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}',
 'x-alltrue-llm-endpoint-identifier': 'your-endpoint-identifier'
} # set this dynamically

httpx_client = httpx.Client(http2=True) # Note: enable verify=True (default) in production; disable only for local testing against self-signed certificates
client = AzureOpenAI(
 api_key=YOUR_API_KEY,
 base_url=YOUR_VARONIS_PROXY_URL,
 http_client=httpx_client,
 default_headers=session_headers
)

client.chat.completions.create(
 model="your-deployed-model",
 messages=[
 {
 "role": "user",
 "content": "Say this is a test",
 }
 ]
)

```
### Anthropic[​](#anthropic)
- Rest API (cURL)- Python SDK- LangChainWithout Proxy:
```
curl --request POST \
 --url https://api.anthropic.com/v1/messages \
 --header 'Authorization: Bearer &lt;YOUR_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 --data '{
 "model": "claude-3-opus-20240229",
 "max_tokens": 1024,
 "messages": [
 {
 "role": "user",
 "content": "Say this is a test"
 }
 ]
 }'

```With Proxy:
```
curl --request POST \
 --url &lt;INSERT_BASE_URL&gt;/v1/messages \
 --header 'Authorization: Bearer &lt;YOUR_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 # Optional: additional parameters for session tracking and endpoint identification
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \
 --header 'x-alltrue-llm-endpoint-identifier: your-endpoint-identifier' \
 --data '{
 "model": "claude-3-opus-20240229",
 "max_tokens": 1024,
 "messages": [
 {
 "role": "user",
 "content": "Hello, Claude"
 }
 ]
 }'

```To use the proxy with the Python SDK, you can pass the `base_url` parameter to the `Anthropic` constructor.
Without Proxy:
```
import os
from anthropic import Anthropic

client = Anthropic(
 api_key=os.environ.get("ANTHROPIC_API_KEY"),
)

message = client.messages.create(
 max_tokens=1024,
 messages=[
 {
 "role": "user",
 "content": "Hello, Claude",
 }
 ],
 model="claude-3-opus-20240229",
)
print(message.content)

```With Proxy:
```
import os
from anthropic import Anthropic

# Optionally set additional parameters in the 'x-alltrue-llm-firewall-user-session' header for session tracking and
# `x-alltrue-llm-endpoint-identifier` header for endpoint identification
session_headers = {
 'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "Email1"}',
 'x-alltrue-llm-endpoint-identifier': 'your-endpoint-identifier'
} # set this dynamically

client = Anthropic(
 api_key=os.environ.get("ANTHROPIC_API_KEY"),
 base_url="INSERT BASE URL",
 default_headers=session_headers
)

message = client.messages.create(
 max_tokens=1024,
 messages=[
 {
 "role": "user",
 "content": "Hello, Claude",
 }
 ],
 model="claude-3-opus-20240229",
)
print(message.content)

```To use the [ChatAnthropic](https://python.langchain.com/v0.2/docs/integrations/chat/anthropic/) class from Langchain, you can pass the base_url parameter to the constructor.
Without Proxy:
```
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(
 model="claude-3-5-sonnet-20240620",
 temperature=0,
 max_tokens=1024,
 timeout=None,
 max_retries=2,
 # other params...
)
messages = [
 (
 "system",
 "You are a helpful assistant that translates English to French. Translate the user sentence.",
 ),
 ("human", "Say this is a test"),
]
ai_msg = llm.invoke(messages)

```With Proxy:
```

# Optionally set additional parameters in the 'x-alltrue-llm-firewall-user-session' header for session tracking and
# and `x-alltrue-llm-endpoint-identifier` header for endpoint identification

session_headers = {
 'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "Email1"}',
 'x-alltrue-llm-endpoint-identifier': 'your-endpoint-identifier'
} # set this dynamically

llm = ChatAnthropic(
 model="claude-3-5-sonnet-20240620",
 temperature=0,
 max_tokens=1024,
 timeout=None,
 max_retries=2,
 base_url= "INSERT BASE URL HERE",
 default_headers=session_headers
 # other params...
)
messages = [
 (
 "system",
 "You are a helpful assistant that translates English to French. Translate the user sentence.",
 ),
 ("human", "Say this is a test"),
]
ai_msg = llm.invoke(messages)

```
### Gemini[​](#gemini)
- Python SDKTo use the proxy with the [Gemini Python SDK](https://github.com/googleapis/python-genai), you can define a
`ClientOptions` object with the `base_url` parameter set to the proxy base URL. Then pass this object to the `genai.configure` function.
Without Proxy:
```
import google.generativeai as genai
import os

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

model = genai.GenerativeModel('gemini-1.5-flash')
response = model.generate_content("The opposite of hot is")
print(response.text)

```With Proxy:
```
import google.generativeai as genai
import os
from google.api_core.client_options import ClientOptions

# Optionally set additional parameters in the 'x-alltrue-llm-firewall-user-session' header for session tracking and
# and `x-alltrue-llm-endpoint-identifier` header for endpoint identification
session_headers = {
 'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "Email1"}',
 'x-alltrue-llm-endpoint-identifier': 'your-endpoint-identifier'
} # set this dynamically

genai.configure(api_key=os.environ["GEMINI_API_KEY"])

genai.configure(
 api_key=os.environ["GEMINI_API_KEY"],
 client_options=ClientOptions(
 api_endpoint="INSERT BASE URL" # add the proxy base URL here
 ),
 default_metadata=session_headers
 )
model = genai.GenerativeModel('gemini-1.5-flash')

response = model.generate_content("The opposite of hot is")
print(response.text)

```
## WatsonX[​](#watsonx)
Calling the WatsonX Model APIs requires a two-step process:

- **Obtain access token**: Using an API key, you can obtain an access token from the WatsonX API.
- **Call the model API**: Using the access token, you can call the WatsonX model API.

To use the proxy with the WatsonX API, you must:

- Replace the base URL with that of the proxy.
- Include an endpoint identifier using the `x-alltrue-llm-endpoint-identifier` header. This header must match the one you
defined when adding the endpoint resource to your inventory in Atlas.

- Rest API (cURL)Without proxy:
```
# Step 1: Obtain a token using your API key

curl --request POST \
 --url https://iam.cloud.ibm.com/identity/token \
 --header 'Content-Type: application/x-www-form-urlencoded' \
 --data grant_type=urn:ibm:params:oauth:grant-type:apikey \
 --data apikey=&lt;YOUR_API_KEY_HERE&gt; # Replace &lt;YOUR_API_KEY_HERE&gt; with your IBM Cloud API key

# Step 2: Use the token to make an API call

curl --request POST \
 --url 'https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-05-29' \
 --header 'Accept: application/json' \
 --header 'Authorization: Bearer &lt;ACCESS_TOKEN&gt;' # Replace &lt;ACCESS_TOKEN&gt; with the token obtained in Step 1
 --header 'Content-Type: application/json' \
 --data '{
 "model_id": "&lt;MODEL_ID&gt;", # Replace &lt;MODEL_ID&gt; with your desired model ID (e.g., "ibm/granite-20b-code-instruct")
 "project_id": "&lt;PROJECT_ID&gt;", # Replace &lt;PROJECT_ID&gt; with your project ID
 "messages": [
 {
 "role": "user",
 "content": "Say that this is a test!"
 }
 ]
}'

```With proxy:
```
# Step 1: Obtain a token using your API key

curl --request POST \
 --url https://iam.cloud.ibm.com/identity/token \
 --header 'Content-Type: application/x-www-form-urlencoded' \
 --data grant_type=urn:ibm:params:oauth:grant-type:apikey \
 --data apikey=&lt;YOUR_API_KEY_HERE&gt; # Replace &lt;YOUR_API_KEY_HERE&gt; with your IBM Cloud API key

# Step 2: Use the token to make an API call

curl --request POST \
 --url '&lt;PROXY_BASE_URL&gt;/ml/v1/text/chat?version=2023-05-29' # replace &lt;PROXY_BASE_URL&gt; with the proxy base URL
 --header 'Accept: application/json' \
 --header 'Authorization: Bearer &lt;ACCESS_TOKEN&gt;' # Replace &lt;ACCESS_TOKEN&gt; with the token obtained in Step 1
 --header 'Content-Type: application/json' \
 --header 'User-Agent: your-user-agent' # Optional: Replace 'your-user-agent' with your user agent
 # Optional: additional parameters for session tracking and endpoint identification
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \
 --header 'x-alltrue-llm-endpoint-identifier: your-endpoint-identifier' \
 --data '{
 "model_id": "&lt;MODEL_ID&gt;", # Replace &lt;MODEL_ID&gt; with your desired model ID (e.g., "ibm/granite-3-2b-instruct")
 "project_id": "&lt;PROJECT_ID&gt;", # Replace &lt;PROJECT_ID&gt; with your project ID
 "messages": [
 {
 "role": "user",
 "content": "Say that this is a test!"
 }
 ]
}'

```
## Calling Guardrails Directly[​](#calling-guardrails-directly)
The proxy calls the policy execution system / guardrails system for evaluating prompts and responses. You can call these directly using a Python SDK or REST APIs.

The Python SDK is available [here](https://github.com/Varonis-Systems/Atlas-alltrue-llm-observability).

In addition to the SDK and proxy, you can use the Rule Processing APIs.

### Authentication[​](#authentication)
To use the Rule Processing APIs, first authorize an access token with the provided VARONIS API Key of type "Firewall Proxy".

- API Endpoint:
-https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/auth/token
- Method:
-POST
- Request Schema:

`api_key`: VARONIS API Key

- Response Schema:

`access_token`: an access token valid for up to 24 hours for API endpoint authorization

### Usage Example[​](#usage-example)
Using [httpie](https://httpie.io/) as an example, run the command below to retrieve an access token for later use:

```

http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/auth/token api_key=&lt;VARONIS_API_KEY&gt;

```
The response should be similar to:

```

{

 "access_token": "&lt;ACCESS_TOKEN&gt;"

}

```
To get the appropriate VARONIS_API_URL value for your tenant, navigate to AI Runtime -&gt; Policies and use the Configure Runtime button to extract the prefix.

### Processing Inputs[​](#processing-inputs)

- API Endpoint:

https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/rules/process-input/`&lt;LLM_API_PROVIDER&gt;`

- Method:

POST

- Request Schema:

- `endpoint-identifier`: the endpoint identifier for rule processing
- `original_request_body`: the LLM API request body to be evaluated, in string form
- `completion_request_id`: a unique ID to be paired with output processing and for future reference
- `headers`: optional API control parameter key-value pairs, for example:

Set `x-alltrue-llm-cache-control` to `no-cache` to disable cache
- Set `x-alltrue-llm-request-processor` with the JSONPath queries for parsing/reconstructing the payload before/after rule processing

- `client_ip`: local machine IP address
- `client_port`: local machine port
- `url`: LLM API URL
- `host`: LLM API host
- `port`: LLM API port
- `scheme`: LLM API scheme
- `method`: HTTP method

- Response Schema:

- `status_code`: the evaluation status code, same as HTTP status code, i.e. `200` means OK, `403` means block, etc.
- `body`: the evaluated/processed message
- `headers`: the evaluated/processed headers; could be null if no change
- `message`: the evaluation/processing message given when evaluation result is not passing (status code other than 200)

### Usage Example[​](#usage-example-1)
#### OpenAI Request[​](#openai-request)
The example below demonstrates using the [httpie](https://httpie.io/) command to process an OpenAI request.

```
http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/rules/process-input/openai Authorization:"Bearer &lt;VARONIS_ACCESS_TOKEN&gt;" &lt;&lt; EOF
{
 "original_request_body": "{\"messages\": [{\"role\": \"user\", \"content\": \"Hello world!\"}], \"model\": \"gpt-4o\"}",
 "completion_request_id": "&lt;UNIQUE_MESSAGE_ID&gt;",
 "method": "POST",
 "headers": [],
 "client_ip": "&lt;YOUR_LOCAL_IP_ADDRESS&gt;",
 "client_port": 0,
 "endpoint_identifier": "&lt;ENDPOINT-IDENTIFIER&gt;",
 "url": "https://api.openai.com",
 "host": "api.openai.com",
 "port": 443,
 "scheme": "https"
}
EOF

```
If the evaluation passes the rules processing system, the result will be similar to:

```
{
 "body": {
 "messages": [
 {
 "content": "Hello world!",
 "role": "user"
 }
 ],
 "model": "gpt-4o"
 },
 "status_code": 200
}

```
When a policy violation is detected in the message, the response will be similar to:

```
{
 "body": {
 "messages": [
 {
 "content": "HELL WORLD!!",
 "role": "rule"
 }
 ],
 "model": "gpt-4o"
 },
 "message": "Blocked: Toxic content detected in input",
 "status_code": 403
}

```
### Free Form Messages (Custom Endpoints)[​](#free-form-messages-custom-endpoints)
The API has built-in endpoints for common providers such as `process-input/openai` and `process-input/google`. These built-in providers know the exact JSON structure used by each LLM and automatically extract prompts and responses from the correct locations.

The **`any`** endpoint allows you to send a JSON message from any application — including custom or proprietary LLM APIs — to be evaluated by the guardrails system. When using the `any` endpoint, you must tell the system **where** in your JSON payload the text content lives. You do this by providing JSONPath (or JQ) expressions via the `x-alltrue-llm-request-processor` control parameter.

#### How It Works[​](#how-it-works)
When a request arrives at the `any` endpoint, the system uses your processor configuration to:

- **Extract** text content from your request body using `pre-input` (for inputs) or `pre-output` (for outputs)
- **Run guardrails** (PII detection, profanity, jailbreak prevention, etc.) against the extracted text
- **Inject** the processed text back into the original JSON structure using `post-input` / `post-output`
- **Return** the full payload with modifications applied only to the matched fields

This means your original JSON structure is preserved — only the text content at the specified paths is inspected and potentially modified.

#### The `x-alltrue-llm-request-processor` Configuration[​](#the-x-alltrue-llm-request-processor-configuration)
The processor configuration is a JSON object passed as a header value inside the `headers` field of the request body. It has the following fields:

FieldRequiredDescription`processor_type`YesThe expression language to use: `"jsonpath"` or `"jq"``pre-input`YesExpression to **extract** text from the request body before guardrail processing`post-input`YesExpression to **write back** processed text into the request body after guardrail processing`pre-output`YesExpression to **extract** text from the response body before guardrail processing`post-output`YesExpression to **write back** processed text into the response body after guardrail processing
tipFor JSONPath, the `pre-*` and `post-*` expressions are usually identical — the same path is used to read and write. For JQ, the write-back expression is different because JQ uses a transformation syntax to update values.

#### JSONPath Expressions[​](#jsonpath-expressions)
JSONPath expressions use the [JSONPath-ng](https://github.com/h2non/jsonpath-ng) syntax. Common patterns:

ExpressionMatches`[*]`All elements in a top-level array`messages[*].content`The `content` field of every object in the `messages` array`choices[*].message.content`Nested field access through arrays`data.text`A single field at a known path`results[0].output`The first element of an array
#### Examples[​](#examples)
Simple Array of Strings[​](#simple-array-of-strings)
If your application sends prompts as a flat JSON array:

```
["User Message 1", "User Message 2"]

```
Use `[*]` to match every element:

```
http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/rules/process-input/any Authorization:"Bearer &lt;VARONIS_ACCESS_TOKEN&gt;" &lt;&lt; EOF
{
 "original_request_body": "[\"User Message 1\", \"User Message 2\"]",
 "completion_request_id": "&lt;UNIQUE_MESSAGE_ID&gt;",
 "method": "POST",
 "headers": [
 ["x-alltrue-llm-cache-control", "no-cache"],
 ["x-alltrue-llm-request-processor", "{\"processor_type\":\"jsonpath\",\"pre-input\":\"[*]\",\"post-input\":\"[*]\",\"pre-output\":\"[*]\",\"post-output\":\"[*]\"}"]
 ],
 "client_ip": "&lt;YOUR_LOCAL_IP_ADDRESS&gt;",
 "client_port": 0,
 "endpoint_identifier": "&lt;ENDPOINT-IDENTIFIER&gt;",
 "url": "https://httpbin.org",
 "host": "httpbin.org",
 "port": 443,
 "scheme": "https"
}
EOF

```
OpenAI-Compatible Custom API[​](#openai-compatible-custom-api)
If your custom LLM API uses a format similar to OpenAI (with `messages[].content` for input and `choices[].message.content` for output):

**Input body:**

```
{
 "model": "my-custom-model",
 "messages": [
 {"role": "system", "content": "You are a helpful assistant."},
 {"role": "user", "content": "Tell me about data security."}
 ]
}

```
**Processor configuration:**

```
{
 "processor_type": "jsonpath",
 "pre-input": "messages[*].content",
 "post-input": "messages[*].content",
 "pre-output": "choices[*].message.content",
 "post-output": "choices[*].message.content"
}

```
**Full request:**

```
http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/rules/process-input/any Authorization:"Bearer &lt;VARONIS_ACCESS_TOKEN&gt;" &lt;&lt; EOF
{
 "original_request_body": "{\"model\":\"my-custom-model\",\"messages\":[{\"role\":\"system\",\"content\":\"You are a helpful assistant.\"},{\"role\":\"user\",\"content\":\"Tell me about data security.\"}]}",
 "completion_request_id": "&lt;UNIQUE_MESSAGE_ID&gt;",
 "method": "POST",
 "headers": [
 ["x-alltrue-llm-request-processor", "{\"processor_type\":\"jsonpath\",\"pre-input\":\"messages[*].content\",\"post-input\":\"messages[*].content\",\"pre-output\":\"choices[*].message.content\",\"post-output\":\"choices[*].message.content\"}"]
 ],
 "client_ip": "&lt;YOUR_LOCAL_IP_ADDRESS&gt;",
 "client_port": 0,
 "endpoint_identifier": "&lt;ENDPOINT-IDENTIFIER&gt;",
 "url": "https://my-custom-llm.example.com",
 "host": "my-custom-llm.example.com",
 "port": 443,
 "scheme": "https"
}
EOF

```
In this example, the guardrails system extracts `"You are a helpful assistant."` and `"Tell me about data security."` from the `messages` array, runs all configured policy rules against them, and writes any modifications back into the same locations.

Proprietary API with Non-Standard Structure[​](#proprietary-api-with-non-standard-structure)
If your API uses a completely different structure, such as:

**Input body:**

```
{
 "request_id": "abc-123",
 "payload": {
 "prompt": "What is the capital of France?",
 "context": "Geography quiz"
 }
}

```
**Response body:**

```
{
 "request_id": "abc-123",
 "result": {
 "answer": "The capital of France is Paris.",
 "confidence": 0.98
 }
}

```
**Processor configuration:**

```
{
 "processor_type": "jsonpath",
 "pre-input": "payload.prompt",
 "post-input": "payload.prompt",
 "pre-output": "result.answer",
 "post-output": "result.answer"
}

```
This configuration tells the system to inspect and protect only the `payload.prompt` field on input and the `result.answer` field on output, leaving all other fields (`request_id`, `context`, `confidence`) untouched.

#### Using Custom Endpoints Through the Proxy[​](#using-custom-endpoints-through-the-proxy)
When routing traffic through the proxy (instead of calling the guardrails API directly), you can use the `x-alltrue-llm-request-processor` header on your HTTP request. The proxy forwards all `x-alltrue-llm-*` headers to the policy evaluation system on the data plane automatically.

**Proxy configuration for a custom endpoint:**

```
curl --request POST \
 --url '&lt;YOUR_PROXY_BASE_URL&gt;/v1/endpoint/&lt;YOUR_ENDPOINT_ID&gt;/base-url/&lt;YOUR_LLM_URL&gt;/proxy-type/any/your/api/path' \
 --header 'Authorization: Bearer &lt;YOUR_LLM_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 --header 'x-alltrue-llm-request-processor: {"processor_type":"jsonpath","pre-input":"payload.prompt","post-input":"payload.prompt","pre-output":"result.answer","post-output":"result.answer"}' \
 --data '{
 "payload": {
 "prompt": "What is the capital of France?"
 }
 }'

```
Alternatively, you can pass the routing parameters as headers instead of encoding them in the URL:

```
curl --request POST \
 --url '&lt;YOUR_PROXY_BASE_URL&gt;/your/api/path' \
 --header 'Authorization: Bearer &lt;YOUR_LLM_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 --header 'x-alltrue-llm-endpoint-identifier: &lt;YOUR_ENDPOINT_ID&gt;' \
 --header 'x-alltrue-llm-base-url: https://my-custom-llm.example.com' \
 --header 'x-alltrue-llm-proxy-type: any' \
 --header 'x-alltrue-llm-domain-matchers: [".*"]' \
 --header 'x-alltrue-llm-path-matchers: [".*"]' \
 --header 'x-alltrue-llm-request-processor: {"processor_type":"jsonpath","pre-input":"payload.prompt","post-input":"payload.prompt","pre-output":"result.answer","post-output":"result.answer"}' \
 --data '{
 "payload": {
 "prompt": "What is the capital of France?"
 }
 }'

```
#### Proxy Control Headers Reference[​](#proxy-control-headers-reference)
The following headers can be set on requests going through the proxy to control routing and processing behavior:

HeaderDescription`x-alltrue-llm-endpoint-identifier`Associates the request with a specific endpoint configured in the platform`x-alltrue-llm-base-url`The target LLM URL to forward the request to`x-alltrue-llm-proxy-type`The provider type for the policy evaluation system to use (`openai`, `azure-openai`, `anthropic`, `google`, `bedrock`, `ibmwatsonx`, `any`)`x-alltrue-llm-request-processor`JSON processor configuration for extracting/injecting text content (used with `any` proxy type)`x-alltrue-llm-cache-control`Set to `no-cache` to disable caching`x-alltrue-llm-domain-matchers`JSON array of regex patterns for matching request URL domains (e.g., `[".*"]`)`x-alltrue-llm-path-matchers`JSON array of regex patterns for matching request URL paths (e.g., `["/v1/chat/.*"]`)`x-alltrue-llm-authorization`Override the `Authorization` header sent to the target LLM
#### Endpoint Spec Fallback[​](#endpoint-spec-fallback)
If the `x-alltrue-llm-request-processor` header is not provided, the system falls back to the endpoint specification configured in the platform. When configuring an endpoint in the platform, you can define a body template that includes a `&lt;&lt;PROMPT&gt;&gt;` placeholder. The system automatically discovers the JSONPath to the placeholder and uses it for extraction. Additionally, you can configure `response_jsonpaths` on the endpoint to specify where to find the response text.

This means that for endpoints configured in the platform with the correct body template, no per-request header is needed — the JSONPath extraction is determined automatically from the endpoint configuration.

### Output Process[​](#output-process)

- API Endpoint:

https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/rules/process-output/`&lt;LLM_API_PROVIDER&gt;`

- Method:

POST

- Request Schema:

- `endpoint-identifier`: the endpoint identifier for rule processing
- `original_request_body`: the LLM API request body to be evaluated, in string form
- `original_response_body`: the LLM API response body to be evaluated, in string form
- `completion_request_id`: a unique ID to be paired with output processing and for future reference
- `headers`: optional API control parameter key-value pairs, for example:

Set `x-alltrue-llm-cache-control` to `no-cache` to disable cache
- Set `x-alltrue-llm-request-processor` with the JSONPath queries for parsing/reconstructing the payload before/after rule processing

- `response_headers`: the LLM API response headers for evaluation
- `client_ip`: local machine IP address
- `client_port`: local machine port
- `url`: LLM API URL
- `host`: LLM API host
- `port`: LLM API port
- `scheme`: LLM API scheme
- `method`: HTTP method

- Response Schema:

- same as Input Process API

### Usage Example[​](#usage-example-2)
#### OpenAI Response[​](#openai-response)
The example below demonstrates using the [httpie](https://httpie.io/) command to process an OpenAI response.

```
http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/rules/process-output/openai Authorization:"Bearer &lt;VARONIS_ACCESS_TOKEN&gt;" &lt;&lt; EOF
{
 "original_request_body": "{\"messages\": [{\"role\": \"user\", \"content\": \"Hello world!\"}], \"model\": \"gpt-4o\"}",
 "original_response_body": "{\"choices\": [...], \"model\": \"gpt-4o\", ...}",
 "completion_request_id": "&lt;UNIQUE_MESSAGE_ID&gt;",
 "method": "POST",
 "headers": [],
 "response_headers": [],
 "client_ip": "&lt;YOUR_LOCAL_IP_ADDRESS&gt;",
 "client_port": 0,
 "endpoint_identifier": "&lt;ENDPOINT-IDENTIFIER&gt;",
 "url": "https://api.openai.com",
 "host": "api.openai.com",
 "port": 443,
 "scheme": "https"
}
EOF

```
For more information on the message content by provider see:

- OpenAI - [https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)
- Anthropic - [https://docs.anthropic.com/en/api/messages](https://docs.anthropic.com/en/api/messages)
- Bedrock - [https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)
- Gemini - [https://ai.google.dev/gemini-api/docs/text-generation](https://ai.google.dev/gemini-api/docs/text-generation)

## Building Policies[​](#building-policies)
A Policy consists of a set of Rules, where each Rule has specific Settings that define the Actions to take in case of a runtime violation. The Settings consist of the following main components:

- Direction (Input Guard / Output Guard): Indicates whether the runtime actions apply to prompts entering the LLM (Input Guard) or outputs produced by the LLM (Output Guard). For example, an Input Guard runs Rule tests before forwarding a prompt to the LLM and either allows the prompt to proceed or triggers the configured Action based on the test results.
- Rule Action:
Defines the Action to apply to the input/output.
- Message:
Specifies the message to display when the rule is violated. Can be the default, a custom message, or the LLM response.
- Specific fields:
Additional optional fields (filters) you can add to make the Settings more specific.

For the full grammar that describes how Rules and Settings are expressed, see the [LLM DSL Specification](/_docs/docs/applications/llm_dsl_specification).

See the Settings window for an example:

### Policies Page Overview[​](#policies-page-overview)
The Policies page contains two types of Rule Groups: Prompt Protection and Model Robustness. These groups are detailed in the Policy Types section below.

Below is the Policies page:

Expanding either the Prompt Protection or Model Robustness group reveals columns for Policy, Tags, Enabled, Status, and Rule Details. The Policy column lists the Policy Rules. Tags indicates the direction (input to an LLM or the output response) to which the runtime protection applies. Enabled provides a toggle switch to activate or deactivate the rule. Status shows the current state (Inactive, Pending, or Active). Rule Details describes how many of the total Rule Settings have been configured (not applicable to all rules).

Below is an example of how the Tags, Enabled, Status, and Rule Details columns appear.

### Policy Rule Settings[​](#policy-rule-settings)
Each rule has its own settings to configure. The settings include an Action (see the "Policy Actions" section below) and a message to display when the rule is violated. In some cases, such as the MODIFY action, the message is replaced by a Replacement String.

#### Staged Install and Rollback[​](#staged-install-and-rollback)
Rule changes follow a **staged install and rollback** workflow so you can preview the impact of changes before they take effect:

- Go to the Policies page.
- Choose a hierarchy level (see the "Policy Hierarchy" section below) from the dropdown menu. This takes you to the relevant Policy Hierarchy page.
- Select a rule and expand it to reveal its settings.
- Configure the Rule settings as needed.
- Turn on the rule using the toggle switch under Tags. This will:

Change the toggle position and color.
- Change the Status to **Pending**, meaning the Rule and Settings are staged — saved temporarily and awaiting approval, but not yet enforced.

- Click the **View Pending Changes** button in the upper right corner. This opens the **Pending Policy Changes** page, where you can review every staged change since the last approval. Pending changes appear with a status of "Pending Install."
- Click **Apply Changes** to approve and install all pending changes. They move from staging to **Active** and are enforced from that point forward.

If you change your mind before approving, return to the Policies page by clicking the Policy tab at the top — staged changes remain in **Pending** until you either apply them or revert them.

Policies have either input guardrails (InputGuard), output guardrails (OutputGuard), or both. An InputGuard applies guardrails to prompts and an OutputGuard applies guardrails to responses. InputGuards therefore operate on prompts and can log, alert, block, or modify when prompts do not conform to the policy, while OutputGuards can log, alert, block, or modify responses.

#### Policy Templates[​](#policy-templates)
A **policy template** is a reusable bundle of recommended guardrails that you apply to an AI System in a single step, instead of enabling each policy by hand. Applying a template enables the template's policies that are not already enabled at the scope you choose, using the same [Staged Install and Rollback](#staged-install-and-rollback) workflow — the policies are staged as **Pending** and take effect once installed. Policies you have already enabled are preserved.

Atlas provides two kinds of templates:

- **Predefined templates** — built-in bundles of recommended guardrails, including templates aligned to industry frameworks such as the OWASP Top 10 for LLM Applications. Use these to apply a recognized baseline of protections quickly.
- **Custom templates** — templates you create from any guardrail configuration. When an endpoint is configured the way you want, select **Make Template** on the endpoint's guardrail configuration screen, give the template a name (and an optional description), and Atlas saves the current configuration as a reusable template. Custom templates are versioned and immutable: editing one creates a new version rather than changing configurations that already use it.

Manage your templates from the template management view, where you can browse predefined and custom templates, inspect a template's details, create a template with **Make Template**, and delete custom templates you no longer need.

Templates are also what [Policy Automations](#policy-automations) apply for you automatically when the conditions you define are met.

#### Policy Automations[​](#policy-automations)
In addition to authoring policies directly on the Policies page, you can configure **Policy Automations** that apply a policy template to your AI Systems automatically when conditions you define are met. This keeps the right guardrails aligned with the risk profile of each AI system, so your teams do not have to manually remember which policies should be enabled as projects and endpoints change.

Instead of reacting every time a new agent, tool, endpoint, or risk signal appears, you define automations that monitor your projects or endpoints for the conditions that matter — for example, open issues of a given type or severity, a project risk score crossing a threshold, the sensitivity of the data an AI System can access, specific resource types being present, or AI Monitor alerts. When those conditions are met, AI Runtime applies the appropriate policy template for you. You choose whether the automation requires approval — staging the recommended policy changes for review — or installs them automatically. This gives you a way to continuously enforce the right AI security controls as your environment changes, reducing manual work and improving consistency.

You manage automations from the **Policy Automations** tab on the AI Runtime Policies page (shown in product as **Automated Policy Templates**). The tab lists your existing automations in a table with the following columns:

- **Automation name** — the name you gave the automation.
- **Scope** — whether the automation applies at the Project or Endpoint level.
- **Trigger Conditions** — a summary of the conditions that must be met.
- **Applied Template** — the policy template the automation applies (see [Policy Templates](#policy-templates)).
- **Approval** — whether applying the template requires approval (**Required**) or installs automatically (**Not Required**).
- **Enabled** — a per-row toggle to turn the automation on or off. Only enabled automations are evaluated.

Select **Create Automation** to define a new one.

**Trigger conditions**

An automation triggers based on one or more conditions. The condition types available depend on the scope you choose:

- **Issue Type** — trigger when the number of open issues of one or more selected types reaches a threshold count.
- **Issue Severity** — trigger when the number of open issues at or above a minimum severity reaches a threshold count.
- **Risk Score** — trigger when a project's risk score crosses a threshold. Available for Project scope only.
- **Resource Type** — trigger when resources of one or more selected types are present.
- **AI Monitor Alert Policy** — trigger when one or more selected AI Investigation alert policies are present. Available for Endpoint scope only.
- **Exposure Score** — trigger when an AI System's exposure score, derived from its Data Sensitivity Profile, reaches or exceeds a threshold you set.
- **Sensitive Data Classification** — trigger when an AI System can access data of one or more selected sensitivity classifications — for example PII, PHI, PCI, or source code. Choose whether *any* or *all* of the selected classifications must be present.

When you add more than one condition, choose how they combine:

- **All Conditions** — the automation triggers only if every condition in the group is true.
- **Any Condition** — the automation triggers if at least one condition in the group is true.

**Automation scope: projects and endpoints**

Each automation applies at one of two scopes:

- **Project** — the automation evaluates project-level signals and, when triggered, applies the template at the project level. Endpoints in the project inherit the policies through the normal [Policy Hierarchy](#policy-hierarchy).
- **Endpoint** — the automation evaluates each active endpoint and applies the template at the endpoint level only.

**Approval modes: require approval vs. automatic install**

Under **Execution Mode**, the **Require Approval** toggle controls what happens when an automation applies a template:

- **Require Approval on** — the automation stages the matching policies only. They appear as **Pending** and wait for you to approve them through the existing [Staged Install and Rollback](#staged-install-and-rollback) workflow (**View Pending Changes ▸ Apply Changes**).
- **Require Approval off** — the automation stages the matching policies and installs them automatically in the same pass, so the guardrails take effect without manual review.

The **Approval** column in the automations table shows this setting as **Required** or **Not Required**.

**Applying templates: add missing or replace existing**

When an automation applies a template, you choose how it interacts with policies already configured on the target:

- **Add missing policies only** (default) — the automation enables the template's policies that are not yet present and leaves your existing policies unchanged.
- **Replace existing configuration** — the automation replaces the target's configuration with the template's. A guardrail that is currently installed but disabled in the template stays installed, so a replace never silently drops an active protection.

**When multiple automations match**

If more than one automation applies to the same target, each automation has a **priority**, where a lower number takes precedence. Atlas evaluates automations in priority order and flattens their results into a single set of policies to apply, so higher-priority automations win wherever they overlap.

**Evaluation schedule and the already-satisfied rule**

Enabled automations run on an evaluation schedule you configure per automation — **Daily**, **Weekly**, or **Monthly** — and you can also run an automation **On-demand**. The system records when each automation was last evaluated and last triggered.

When an automation's conditions are met, it applies the template only to targets where that template is not already satisfied — that is, where the template's policies are not already installed, staged, or inherited. Targets that already have the template are skipped, so an automation does not create redundant pending changes or re-install policies that are already in place.

## Policy Actions[​](#policy-actions)
An Action is part of a Rule's settings and defines the operation AI Runtime should take when a rule is violated. Depending on the rule, each Action can be applied to the input (Input Guard), output (Output Guard), or both directions. There are three configurable Actions: Warn, Block, and Modify.

- WARN -
Can be set for both input prompts and completion (Output Guard) prompts. When a rule is violated, the system allows the prompt to be processed by the configured LLM (OpenAI, Anthropic, Gemini, etc.) and creates a Warning issue along with a warning message.

Below is an example for WARN Action:

- BLOCK -
Can be set for both input prompts (Input Guard) and completion (Output Guard) prompts. When a rule is violated, the system blocks the prompt from being processed by the configured LLM (OpenAI, Anthropic, Gemini, etc.) and creates a Block issue along with a message.

Below is an example for 'BLOCK' Action:

- MODIFY -
Can be set for both input prompts and completion (Output Guard) prompts. When a rule is violated, the system modifies the input prompt first and only then allows it to be processed by the configured LLM (OpenAI, Anthropic, Gemini, etc.). The same applies to outputs.

Below is an example for 'MODIFY' Action:

Below is an example of combining a BLOCK Action on the InputGuard and a WARN Action on the OutputGuard:

## Policy Hierarchy[​](#policy-hierarchy)
Policies are evaluated across **four** scope levels, from most general to most specific:

- **Customer (All organizations)** — defaults that apply across every organization in your tenant.
- **Organization** — overrides that apply to all projects within a single organization.
- **Project** — overrides scoped to a single project.
- **Resource (endpoint)** — the most specific scope. Resource-level overrides apply to a single endpoint and take precedence over every higher scope.

Rules applied at a higher level are inherited by all lower levels, but if a more specific rule is set at a lower level, that lower-level rule takes precedence. Resource-level settings are user-configurable from the endpoint's configuration page and override everything inherited from Project, Organization, and Customer.

For example, if a rule is set at the highest level (Customer — "all-organizations"), it applies to all downstream levels (e.g., Organization A and all its Projects and endpoints, Organization B and all its Projects, etc.). At this point, the Status column on the Runtime page changes from "Inactive" to "Inherit" if no specific rule is set at lower levels.

If a rule is turned on or modified at a lower level (e.g., at the Project A level), that rule overrides the one from the higher level. The Status column on the Runtime page changes to "Pending" because it requires approval. Once approved, it changes to "Active."

If a change is made at the Organization level (e.g., for a specific Organization), it applies only to the projects within that Organization, not to projects in other Organizations.

After a change has been made at a lower, more specific level, subsequent modifications at a higher level will not override the lower level — the lower-level rule remains Active. The higher-level change still takes effect at its own level (for example, for all projects within that organization that do not have a specific rule).

Below is an example of the policy hierarchy dropdown selector:

## Policy Types[​](#policy-types)
A Policy Type is a category of runtime rules. Each rule has a direction — `Input Guard` (inspects traffic flowing toward the model) or `Output Guard` (inspects traffic flowing back from the model) — and a set of targets that determine which part of the traffic it inspects: `User`, `Assistant`, `Tool Definition`, `Tool Call`, `Tool Response`, and for multimodal rules `File Input`, `Image Input`, `Audio Input`, or `Video Input`. Use the five categories below to find the right rule for what you want to protect. To enable, configure, or order these rules in a policy, see [Building Policies](#building-policies) and [Policy Actions](#policy-actions).

### Prompt Protection[​](#prompt-protection)
Detects sensitive data, injection attempts, prohibited content, and other prompt-level risks in user input and assistant output.

#### Profanity Check[​](#profanity-check)
Detects inappropriate language in user prompts and assistant responses.
Inspects: Input Guard and Output Guard · User, Assistant.

#### PII[​](#pii)
Identifies Personally Identifiable Information — such as names, addresses, phone numbers, and other sensitive identifiers — in user messages and assistant responses, based on the data types you configure.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Prevent Jailbreak[​](#prevent-jailbreak)
Identifies prompts that attempt to make the model bypass its safety controls — for example, role-play scenarios or layered instructions designed to override system constraints.
Inspects: Input Guard · User, Tool Definition, Tool Response.

#### XSS Protection[​](#xss-protection)
Detects likely cross-site scripting payloads or script-injection content in prompts and responses before they are stored, rendered, or passed downstream.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Code Injection and Generation Prevention[​](#code-injection-and-generation-prevention)
Identifies programming-language code in assistant output and prevents responses from injecting code into downstream applications or generating unsanctioned code.
Inspects: Output Guard · Assistant.

#### Code Leakage Prevention[​](#code-leakage-prevention)
Prevents sensitive code from being sent to the model in prompt inputs.
Inspects: Input Guard · User.

#### SQL Injection[​](#sql-injection)
Detects likely SQL injection payloads or suspicious SQL content in input or output text.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Remove Invisible Text[​](#remove-invisible-text)
Identifies and removes invisible characters used to hide instructions or content — for example, zero-width or non-rendering Unicode characters used in steganography.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Prohibit Topics[​](#prohibit-topics)
Blocks prompts and responses that touch on topics you have marked as off-limits. You can use built-in topics or add your own.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Detect Topics[​](#detect-topics)
Detects when prompts or responses touch on topics you care about, without necessarily blocking them. You can use built-in topics or add your own custom strings.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Prevent Obfuscated Attacks[​](#prevent-obfuscated-attacks)
Identifies prompt smuggling attempts where users substitute synonyms or introduce typos to evade other filters.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Prevent Leakage[​](#prevent-leakage)
Identifies prompts that may cause the model to leak sensitive or confidential information it has access to.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Prevent Encoded Attacks[​](#prevent-encoded-attacks)
Detects encoded payloads — for example Base64, ROT13, or hex — used to disguise malicious instructions from other filters.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Function Call[​](#function-call)
Prevents function-call argument injection in assistant output, where crafted text would coerce the model into invoking functions with unsafe arguments.
Inspects: Output Guard · Assistant.

#### Detect Malicious URL[​](#detect-malicious-url)
Detects URLs that point to scams, phishing pages, malware distribution, or other harmful destinations.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Detect Languages[​](#detect-languages)
Detects unsupported languages in input prompts or assistant output from a list of allowed languages — for example to flag content in languages not used by your organization.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Prevent Prompt Injection[​](#prevent-prompt-injection)
Detects prompt-injection instructions in user input — text designed to override the system prompt or change the model's behavior.
Inspects: Input Guard · User.

#### Prevent Toxicity[​](#prevent-toxicity)
Detects toxic content — harassment, hate, threats, or otherwise harmful language — in input and output.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call, Tool Response.

#### Content Types[​](#content-types)
Identifies prompts that contain disallowed input types (for example image, audio, or file attachments) based on the restrictions you configure.
Inspects: Input Guard · User.

#### Banned Substrings[​](#banned-substrings)
Detects organization-specific banned strings, identifiers, or keywords in input or output.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Detect Sexual Content[​](#detect-sexual-content)
Detects sexually explicit content in input and output.
Inspects: Input Guard and Output Guard · User, Assistant.

#### AI-Generated Content Detection[​](#ai-generated-content-detection)
Detects whether user-supplied text was likely written by a human or generated by an AI model, based on linguistic and stylistic cues.
Inspects: Input Guard · User.

### Model Robustness[​](#model-robustness)
Keeps prompts and responses well-formed and bounded — token limits, message counts, structured-output validation, and standing policy messages.

#### Clip Token[​](#clip-token)
Caps prompt tokens to the model's token limit to prevent oversized inputs from disrupting service or driving excessive compute cost.
Inspects: Input Guard · User.

#### Boolean Validation[​](#boolean-validation)
Ensures the assistant's response is a boolean value when a boolean is expected.
Inspects: Output Guard · Assistant.

#### JSON Validation[​](#json-validation)
Validates that the assistant's response is well-formed JSON, and returns a repaired JSON when possible.
Inspects: Output Guard · Assistant.

#### String Validation[​](#string-validation)
Ensures the assistant's response matches a pre-defined list of allowed outputs, and can also filter unwanted substrings.
Inspects: Output Guard · Assistant.

#### Message Count Control[​](#message-count-control)
Prevents prompts from exceeding a configured limit on the number of messages — useful for detecting unusual sequences that may indicate an injection attempt.
Inspects: Input Guard · User.

#### Policy Message Rule[​](#policy-message-rule)
Appends or prepends a standing policy message (a banner) to the assistant's response.
Inspects: Output Guard · Assistant.

### User Experience and Tone[​](#user-experience-and-tone)
Measures the emotional quality of the conversation rather than its safety.

#### Sentiment[​](#sentiment)
Detects the emotional tone or attitude expressed in input and output, categorizes it as positive, negative, or neutral, and scores overall sentiment over time.
Inspects: Input Guard and Output Guard · User, Assistant.

### Agentic Guardrails[​](#agentic-guardrails)
Protects agentic and Model Context Protocol (MCP) workflows by inspecting tool definitions, tool calls, and tool responses. For MCP-specific surfaces, see also [AI MCP](/_docs/docs/applications/ai_mcp).

#### Agent Tool Selection[​](#agent-tool-selection)
Ensures the agent chooses the correct tool for the request and flags unauthorized or inappropriate tool usage.
Inspects: Input Guard · Tool Call.

#### Agent Parameter Evaluation[​](#agent-parameter-evaluation)
Ensures the agent provides accurate, justified, and properly scoped parameters in tool calls. Flags vague, missing, irrelevant, or unsafe parameters — including signs of data leakage or injection.
Inspects: Input Guard · Tool Call.

#### Malicious Tool Detection[​](#malicious-tool-detection)
Detects and blocks attempts by an agent to invoke a tool that exhibits malicious, poisoned, or untrusted characteristics — including tools whose definitions show indicators of data exfiltration, prompt injection, or unauthorized code execution.
Inspects: Input Guard · Tool Call.

#### Prevent Tool Poisoning[​](#prevent-tool-poisoning)
Detects tool-poisoning attacks embedded in tool definitions — descriptions or schemas crafted to redirect the agent toward unsafe behavior.
Inspects: Input Guard · Tool Definition.

#### MCP Quarantine[​](#mcp-quarantine)
Quarantines tool definitions and tool calls that violate the MCP policies you configure.
Inspects: Input Guard · Tool Definition, Tool Call.

#### Prohibited Tool Capabilities[​](#prohibited-tool-capabilities)
Detects and blocks tool definitions that expose capabilities you have prohibited — for example tools that can execute arbitrary code or access sensitive systems.
Inspects: Input Guard · Tool Definition.

#### Grounding Guardrail[​](#grounding-guardrail)
Catches blatantly ungrounded model responses that clearly fall outside the configured intended purpose and scope of the AI system.
Inspects: Output Guard · Assistant.

#### Prevent Tool Name Collisions[​](#prevent-tool-name-collisions)
Detects and prevents ambiguous tool invocation caused by duplicate tool names across MCP servers within a single request.
Inspects: Input Guard · Tool Definition.

#### Prevent PII in Tools[​](#prevent-pii-in-tools)
Detects Personally Identifiable Information in tool definitions, tool-call arguments, and tool responses.
Inspects: Input Guard and Output Guard · Tool Definition, Tool Call, Tool Response.

#### Prevent Prompt Injection in Tools[​](#prevent-prompt-injection-in-tools)
Detects prompt-injection instructions delivered through tool-returned or externally retrieved content rather than directly by the user — for example untrusted tool responses, retrieved documents, web content, or external data that attempt to manipulate agent behavior.
Inspects: Input Guard and Output Guard · Tool Definition, Tool Response.

#### Prevent Prompt Leakage in Tools[​](#prevent-prompt-leakage-in-tools)
Detects leakage of the model's system prompt or other privileged context through tool definitions, tool calls, or tool responses.
Inspects: Input Guard and Output Guard · Tool Definition, Tool Call, Tool Response.

#### Prevent Code Injection in Tool Calls[​](#prevent-code-injection-in-tool-calls)
Detects code payloads in tool calls. Use this guardrail to identify or prevent agents from invoking tools with arguments that contain code.
Inspects: Input Guard · Tool Call.

#### Prevent Code Leakage in Tool Responses[​](#prevent-code-leakage-in-tool-responses)
Detects source code, scripts, configuration content, or other code-like material returned in tool responses — useful when you do not want agents pulling code or implementation details out of connected systems, repositories, files, databases, or external services.
Inspects: Output Guard · Tool Response.

#### Tool Banned Substrings[​](#tool-banned-substrings)
Detects configured banned strings, identifiers, patterns, or keywords in tool definitions, tool calls, and tool responses — for organization-specific prohibited values in tool-related content.
Inspects: Input Guard and Output Guard · Tool Definition, Tool Call, Tool Response.

### Multimodal Guardrails[​](#multimodal-guardrails)
Applies the same protections as the text-based rules above to non-text input — images, files, audio, and video. Multimodal rules support the MODIFY → Strip Content action defined in [Policy Actions](#policy-actions); see that section for details.

#### Multimodal Prompt Injection Detection[​](#multimodal-prompt-injection-detection)
Detects prompt-injection attempts embedded in multimodal content. Evaluates visual text, scanned content, and audio transcripts for injection patterns.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Jailbreak Detection[​](#multimodal-jailbreak-detection)
Detects jailbreak attempts in multimodal content — visual or embedded instructions designed to bypass safety guidelines.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal PII Detection[​](#multimodal-pii-detection)
Detects Personally Identifiable Information — names, addresses, phone numbers, and other sensitive data — in visual, scanned, or audio content.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Leakage Detection[​](#multimodal-leakage-detection)
Detects leakage of confidential or proprietary information — company secrets, API keys, credentials, and sensitive data — in embedded or scanned multimodal content.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Encoded Attacks Detection[​](#multimodal-encoded-attacks-detection)
Detects encoded attack attempts in multimodal content — for example ROT13, Base64, hex, or unicode encodings used to hide malicious instructions.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Invisible Text Detection[​](#multimodal-invisible-text-detection)
Detects hidden, obfuscated, or invisible text in multimodal content — steganographic or encoded messages that may carry malicious instructions.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Sexual Content Detection[​](#multimodal-sexual-content-detection)
Detects sexually explicit or adult content in visual, audio, or scanned multimodal input.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Prohibited Topics Detection[​](#multimodal-prohibited-topics-detection)
Detects prohibited topics in multimodal content — organization-specific forbidden subjects in visual, scanned, or audio input.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

#### Multimodal Code Leakage Detection[​](#multimodal-code-leakage-detection)
Detects source code or implementation details in multimodal content — code snippets, repository information, or technical secrets in visual or scanned input.
Inspects: Input Guard · Image Input, File Input, Audio Input, Video Input.

### Quality and Accuracy[​](#quality-and-accuracy)
Rules that judge the quality, relevance, and factual grounding of model responses against the user prompt.

#### Answer Relevance[​](#answer-relevance)
Checks whether the assistant response stays on topic by comparing it against a configured list of relevant topics using an LLM yes/no judgment.
Inspects: Output Guard · Assistant.

#### Context Relevance[​](#context-relevance)
Checks whether the user prompt falls within the configured relevant-topics list, flagging inputs that drift outside the intended use case.
Inspects: Input Guard · User.

#### Gibberish[​](#gibberish)
Detects incoherent or nonsensical content in both user prompts and assistant responses using a cached transformer classifier, with an optional LLM fallback.
Inspects: Input Guard and Output Guard · User, Assistant.

#### Hallucination[​](#hallucination)
Output-side check that uses an LLM judge to flag assistant responses containing ungrounded or fabricated information, given the user prompt as context.
Inspects: Output Guard · User, Assistant.

#### Refutation Alerting[​](#refutation-alerting)
Detects when the assistant refuses to answer the user prompt, using regex refusal patterns plus an LLM judgment over the prompt-response pair.
Inspects: Output Guard · User, Assistant.

#### Satisfactory Answer[​](#satisfactory-answer)
Output-side LLM judgment over the prompt-response pair that flags responses which fail to address what the user actually asked.
Inspects: Output Guard · User, Assistant.

### Bias and Fairness[​](#bias-and-fairness)
Rules that surface user inputs likely to introduce or expose demographic bias.

#### Sensitive Features[​](#sensitive-features)
Uses an LLM classifier to flag user prompts that reference sensitive demographic or identity attributes from a configurable list (defaults include age, race, gender, and similar features).
Inspects: Input Guard · User.

### Custom Tagging[​](#custom-tagging)
Rules that apply customer-defined classifications to traffic using an LLM-based judge.

#### LLM-as-a-Judge[​](#llm-as-a-judge)
Customer supplies separate natural-language judge prompts for input and output; an LLM evaluates each side and applies user-defined tags. Tool definitions and tool calls can optionally be included in the judgment.
Inspects: Input Guard and Output Guard · User, Assistant, Tool Definition, Tool Call.

## Issues[​](#issues)
When you define a policy, you select whether to create an issue when a policy fires and at what severity. These issues are then displayed on the Issues tab.

Issues raised by AI Runtime feed into the broader risk picture across the platform:

- **[AI 360](/_docs/docs/applications/ai_360)** surfaces AI Runtime issues as one of the risk factors that contribute to a project's overall risk score.
- **[AI Investigation](/_docs/docs/applications/ai_monitor)** correlates AI Runtime issues with end-user behaviour and conversation context so you can drill into who triggered a violation and what they were trying to do.
- **[AI Usage](/_docs/docs/applications/ai_usage)** can quarantine end users whose runtime violations cross thresholds you configure.

## Report[​](#report)
Search through prompts and responses recorded by AI Runtime. You can filter recorded traffic by endpoint, model, user-session, and rule outcome, and export the matching prompts for offline review or sharing with another team.

## Observability[​](#observability)
All AI Runtime events are logged within the observability layer in the `ai-ocsf-firewall` index. There are four types of events logged, differing in the event_name field:

- Process Prompt Input is an event per prompt that describes the prompt and all actions taken by policy input guards.
- Process Prompt Output is an event per response that describes the response and all actions taken by policy output guards.
- Execute Action on Prompt Input is an event per action taken by a single policy input guard.
- Execute Action on Prompt Output is an event per action taken by a single policy output guard.

For where to configure SIEM forwarding of these events, see [SIEM Integrations](/_docs/docs/admin_console/siem).

## Session Features[​](#session-features)
Optional parameters can be sent alongside completion requests. These are recorded in the system and can be used for richer analytics and to enable advanced features.

### Parameters[​](#parameters)
ParameterField NameTypeExplanation / Use Case**Session ID**`user-session-id``str`An identifier used to link individual requests into "sessions". For example, all requests in one conversation can be linked in a session.**User ID**`user-session-user-id``str`An identifier assigned to each user. Helps in personalizing user experiences and managing user-specific data or preferences.**User IP**`user-session-user-ip``str`The IP address of the user. Can be used for auditing, security purposes, or geolocation-based customization.**User Role**`user-session-user-role``str`The designation or role of the user (e.g., admin, editor, viewer).**User Email**`user-session-user-email``str`An email associated with the user. Useful for communication, notifications, or identifying user accounts.**User Privileges**`user-session-user-privileges``str`Defines the permissions or access levels granted to the user.**Application ID**`user-session-application-id``str`A unique identifier for the application instance. Useful for monitoring and analytics across different instances or deployments.**Application Name**`user-session-application-name``str`The name of the application using the LLM client. Helps in logging and identification of the application in multi-app environments.**Application Version**`user-session-application-version``str`The specific version of the application. Valuable for debugging, tracking updates, or identifying compatibility issues.
### Passing Parameters from Clients[​](#passing-parameters-from-clients)
When using the proxy, optional parameters are passed as a header object when making the request to the LLM provider.

For example, if you want to pass the following parameters:

- Session ID: abc123
- User ID: User1
- User Email: [user@email.com](mailto:user@email.com)

Then add these values as a stringified JSON object under the **x-alltrue-llm-firewall-user-session** header:

```
{
'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}'
}

```
## Rate and Burst Limiting[​](#rate-and-burst-limiting)
AI Runtime and the guardrails evaluation system run within the Customer Data Plane, which runs in a self-managed AWS or Azure account.

For AWS data planes, you can configure rate and burst limits using AWS tools (described below). Azure data planes — which run on Azure Container Apps with an Application Gateway ingress — do not currently ship an AllTrue-managed equivalent of API Gateway throttling.

### Understanding Rate Limit and Burst Limit[​](#understanding-rate-limit-and-burst-limit)
Rate limit (requests per second) defines the long-term average request throughput that a route is allowed to sustain.
Burst limit (requests) defines the maximum number of requests that can be accepted in a short spike beyond the steady-state rate.

AI Runtime enforces these limits using a **token-bucket algorithm**: tokens replenish at the configured rate limit (tokens per second) up to a maximum bucket size equal to the burst limit. Each request consumes one token; when the bucket is empty, additional requests are throttled.

### Configuring[​](#configuring)
You can set these up using the AWS Console or using the CLI.

To set up rate and burst limiting using the console:

- Navigate to the AWS Console within the Data Plane AWS account and select API Gateway.
- Select the "AllTrueAPI" HTTP Gateway.
- In the left menu select Protect -&gt; Throttling.
- Select the "$default" stage to view and modify the rate limit and burst limit for each Gateway route.

To set up rate and burst limits using the CLI, run this command within the Data Plane account for the routes where you want to change the rate limit:

```
aws apigatewayv2 update-stage --api-id $(aws apigatewayv2 get-apis --query "Items[?Name=='AllTrueAPI'].ApiId" --output text) --stage-name "\$default" --route-settings '{
 "ANY /google/{proxy+}": {
 "ThrottlingBurstLimit": 100,
 "ThrottlingRateLimit": 200
 }
 }'

```
Possible options for route settings are:

- `/google/{proxy+}`
- `/openai/{proxy+}`
- `/anthropic/{proxy+}`
- `/ibmwatsonx/{proxy+}`
- `/ibmwatsonx-assistant/{proxy+}`
- `/ibmwatsonx-ai-service/{proxy+}`
- `/bedrock/{proxy+}`
- `/sdk/{proxy+}`
- `/custom/{proxy+}`
- `/prod/{proxy+}`

## Known limitations[​](#known-limitations)

- **Streaming is not currently supported.** Streaming is not currently supported with AI Runtime. When using AI Runtime, set `streaming` to `false`. Streaming support is planned for a future release and is on the product roadmap.
[PreviousAI SPM](/_docs/docs/applications/ai_spm)[NextAI MCP](/_docs/docs/applications/ai_mcp)- [Data Encryption on the Data Plane](#data-encryption-on-the-data-plane)- [Pointing to the Proxy](#pointing-to-the-proxy)[OpenAI](#openai)- [Azure OpenAI](#azure-openai)- [Anthropic](#anthropic)- [Gemini](#gemini)- [WatsonX](#watsonx)- [Calling Guardrails Directly](#calling-guardrails-directly)[Authentication](#authentication)- [Usage Example](#usage-example)- [Processing Inputs](#processing-inputs)- [Usage Example](#usage-example-1)- [Free Form Messages (Custom Endpoints)](#free-form-messages-custom-endpoints)- [Output Process](#output-process)- [Usage Example](#usage-example-2)- [Building Policies](#building-policies)[Policies Page Overview](#policies-page-overview)- [Policy Rule Settings](#policy-rule-settings)- [Policy Actions](#policy-actions)- [Policy Hierarchy](#policy-hierarchy)- [Policy Types](#policy-types)[Prompt Protection](#prompt-protection)- [Model Robustness](#model-robustness)- [User Experience and Tone](#user-experience-and-tone)- [Agentic Guardrails](#agentic-guardrails)- [Multimodal Guardrails](#multimodal-guardrails)- [Quality and Accuracy](#quality-and-accuracy)- [Bias and Fairness](#bias-and-fairness)- [Custom Tagging](#custom-tagging)- [Issues](#issues)- [Report](#report)- [Observability](#observability)- [Session Features](#session-features)[Parameters](#parameters)- [Passing Parameters from Clients](#passing-parameters-from-clients)- [Rate and Burst Limiting](#rate-and-burst-limiting)[Understanding Rate Limit and Burst Limit](#understanding-rate-limit-and-burst-limit)- [Configuring](#configuring)- [Known limitations](#known-limitations)
