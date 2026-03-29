---
title: AI Gateway
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_gateway
section: applications
---

# AI Gateway

- [](/_docs/)- Applications- AI GatewayOn this page# AI Gateway
The AI gateway sits between an LLM endpoint and clients that utilize the endpoint by making API calls over HTTPS. The architecture is based on an nginx proxy that runs in a container on the customer plane and gets services from the control plane for evaluating what to do with each prompt and response. The architecture is shown below:

An application (or user using an application such as a chatbot) sends a prompt to the LLM. However, due to the application configuration the request is actually made to the proxy running within nginx. The proxy gets the prompt and forwards it to the rule orchestrator which passes it to all relevant policy rules that are installed and that are applicable to the LLM endpoint. Each policy rule processes the prompt based on it's definitions and returns a result to the orchestrator. If the policy rule action is alert or log then all this happens asynchronously. If the action is block or modify then processing is synchronous. If one of the policy rules needs to block then the proxy does not let the prompt through to the LLM and returns an error to the caller. If a policy rules has a modify action the prompt is modified per the rule and only then sent to the LLM.

A similar process happens with the response. Policy rules inspect the responses and decide whether to log, alert, modify the response or do nothing and just let the response pass through to the client untouched.

The AI Gateway forwards each input and output to the policy execution system which applies guardrails to the inputs an outputs. You can access guardrails directly without going through the proxy - by making calls from your applications or by integrating such calls from an existing API gateway.

## Pointing to the Proxy[​](#pointing-to-the-proxy)
To route your application's requests via the proxy, you will need to set the base URL of your request to that of the proxy
(for example: `https://your-proxy-hostname/v1`). For API call attribution to resources (recommended), add an endpoint identifier using a URL such
as `https://your-proxy-hostname/v1/endpoint/&lt;your-endpoint-identifier&gt;`, or specify the identifier in the `x-alltrue-llm-endpoint-identifier` header.
Refer to the following code snippets for how to set the base URL for different model providers.

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
 --url 'https://&lt;YOUR-PROXY-BASE-URL/v1/text/chat/completions' \
 --header 'Authorization: Bearer &lt;YOUR-API-KEY&gt;' \
 --header 'Content-Type: application/json' \
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \ # optionally set additional parameters for session tracking
 --header 'x-alltrue-llm-endpoint-identifier : "your-endpoint-identifier"' \ # optionally set additional parameters for endpoint identification
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
 --header 'api-key: Bearer &lt;YOUR_API_KEY&gt;' \
 --header 'Content-Type: application/json' \
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \ # optionally set additional parameters for session tracking
 --header 'x-alltrue-llm-endpoint-identifier : "your-endpoint-identifier"' \ # optionally set additional parameters for endpoint identification
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
from openai import AzureOpenAI

client = AzureOpenAI(
 api_key
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

httpx_client = httpx.Client(http2=True, verify=False)
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
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \ # optionally set additional parameters for session tracking
 --header 'x-alltrue-llm-endpoint-identifier : "your-endpoint-identifier"' \ # optionally set additional parameters for endpoint identification
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
- Python SDKTo use the proxy with the [Gemini Python SDK](https://github.com/google-gemini/generative-ai-python), you can define a
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
Calling the WatsonX Model APIs requires a two step process:

- **Obtain access token**: Using an API key, you can obtain an access token from the WatsonX API.
- **Call the model API**: Using the access token, you can call the WatsonX model API.

To use the proxy with the WatsonX API, you must:

- Replace the base URL with that of the proxy.
- Include an endpoint identifier using the `x-alltrue-llm-endpoint-identifier` header. This header must match the one you
defined when adding the endpoint resource to your inventory in the TRiSM platform.

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
 --header 'x-alltrue-llm-firewall-user-session: {"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}' \ # optionally set additional parameters for session tracking
 --header 'x-alltrue-llm-endpoint-identifier : "your-endpoint-identifier"' \ # optionally set additional parameters for endpoint identification
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
The proxy calls the policy execution system / guardrails system for evaluating prompts and responses. You can call these directly using a Python SDK or using REST APIs.

The Python SDK is available [here](https://github.com/AllTrue-ai/alltrue-llm-observability).

In addition to SDK and proxy, you can use the Rule Processing APIs.

## Authentication[​](#authentication)
To use Rule Processing APIs, the first step will be to authorize an access token with the provided VARONIS API Key with a "Firewall Proxy" type.

- API Endpoint:
-https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/auth/token
- Method:
-POST
- Request Schema:

`api_key`: VARONIS API Key

- Response Schema:

`acccess_token`: an access token valid up to 24 hours for API endpoint authorization

### Usage Example[​](#usage-example)
Using [httpie](https://httpie.io/) as an example, run below command to retrieve an access token for later usage

```

http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/auth/otken api_key=&lt;VARONIS_API_KEY&gt;

```
And the response should be similar to

```

{

 "access_token": "&lt;ACCESS_TOKEN&gt;"

}

```
To get the value appropriate for your tenant for the VARONIS_API_URL navigate to AI Gateway-&gt;Policies and use the Configure Proxy button to extract the prefix.

## Processing Inputs[​](#processing-inputs)

- API Endpoint:

https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/rules/process-input/`&lt;LLM_API_PROVIDER&gt;`

- Method:

POST

- Request Schema:

- `endpoint-identifer`: the endpoint-identifier for rule processing
- `original_request_body`: the LLM API request body to be evaluated in string form
- `completion_request_id`: an unique ID to be paired with output process and for future reference
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
Below example demonstrates using [httpie](https://httpie.io/) command to process a OpenAI request.

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
If evaluation passed the rules processing system the result will be similar to:

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
Or, when policy violation detected in the message, the response could be similar to:

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
### Free Form Messages[​](#free-form-messages)
The API has built-in endpoints for common providers such as `process-input/openai` and `process-input/google`. The `any` endpoint allows you to send a JSON message from any application to be evaluated by the guardrails system and can be used without a specific LLM target.

The following example shows how to process free form messages with control parameters.

- By targeting `/any` endpoint to allow processing free format messages.
- By assigning control parameter `x-alltrue-llm-cache-control` to `no-cache` to disable caching during the process
- By assigning control parameter `x-alltrue-llm-request-processor` with the JSONPath queries the API could use to extract the contents from the given free form messages

```
http POST https://&lt;VARONIS_API_URL&gt;/sdk/v1/rules/process-input/any Authorization:"Bearer &lt;VARONIS_ACCESS_TOKEN&gt;" &lt;&lt; EOF
{
 "original_request_body": "[\"User Message 1\", \"User Message 2\"]",
 "completion_request_id": "&lt;UNIQUE_MESSAGE_ID&gt;",
 "method": "POST",
 "headers": [
 [
 "x-alltrue-llm-cache-control",
 "no-cache"
 ],
 [
 "x-alltrue-llm-request-processor",
 "{\"processor_type\":\"jsonpath\",\"pre-input\":\"[*]\",\"post-input\":\"[*]\",\"pre-output\":\"[*]\",\"post-output\":\"[*]\"}"
 ]
 ],
 "client_ip": "&lt;YOUR_LOCAL_IP_ADDRESS&gt;",
 "client_port": 0,
 "endpoint_identifier": "&lt;ENDPOINT-IDENTIFIER&gt;",
 "url": "https://httpbin.org",
 "host": "httpbin.org",
 "port": 443,
 "scheme": "https"
}

```
## Output Process[​](#output-process)

- API Endpoint:

https://`&lt;VARONIS_API_URL&gt;`/sdk/v1/rules/process-output/`&lt;LLM_API_PROVIDER&gt;`

- Method:

POST

- Request Schema:

- `endpoint-identifer`: the endpoint-identifier for rule processing
- `original_request_body`: the LLM API request body to be evaluated in string form
- `original_response_body`: the LLM API response body to be evaluated in string form
- `completion_request_id`: an unique ID to be paired with output process and for future reference
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
Below example demonstrates using [httpie](https://httpie.io/) command to process a OpenAI request.

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

- OpenAI - ([https://platform.openai.com/docs/api-reference/chat/create)[https://platform.openai.com/docs/api-reference/chat/create](https://platform.openai.com/docs/api-reference/chat/create)%5Bhttps://platform.openai.com/docs/api-reference/chat/create)]
- Anthropic - ([https://docs.anthropic.com/en/api/messages)[https://docs.anthropic.com/en/api/messages](https://docs.anthropic.com/en/api/messages)%5Bhttps://docs.anthropic.com/en/api/messages)]
- Bedrock - ([https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)[https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html](https://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)%5Bhttps://docs.aws.amazon.com/bedrock/latest/APIReference/API_runtime_Converse.html)]
- Gemini - ([https://ai.google.dev/gemini-api/docs/text-generation)[https://ai.google.dev/gemini-api/docs/text-generation](https://ai.google.dev/gemini-api/docs/text-generation)%5Bhttps://ai.google.dev/gemini-api/docs/text-generation)]

## Building Policies[​](#building-policies)
A Policy consists of a set of Rules where each Rule has specific Settings that define the Actions needed to be taken in case of a gateway violation. The ‘Settings’ consists of the following main components:

- Direction (‘Input Guard’/’Output Guard’) :

Refers to the applied gateway actions within a given LLM prompt direction. For example, Input Guard means that before a prompt is passed on to a LLM model it will first go through the Rule gateway tests and provided the results it would either pass it to the LLM, should everything turn out okay or perform the Action requested.
- Rule Action :

Defines the Action to apply on the input/output
- Message :

States the message to display to the user. Can be either default, customized or whatever the ChatGPT returns.
- Specific fields :

Additional optional fields (filters) the user can add to make his Settings more specific.

See “settings” window for example :

### Policies Page Overview[​](#policies-page-overview)
The Policies page contains two types of Rule Groups e.g. ‘Prompt Protection’ and ‘Model Robustness’. These groups are detailed in the ‘Policy Types’ section below.

Below is the ‘Policy’ page:

Expanding either the ‘Prompt Protection’ and ‘Model Robustness’ group will reveal a ‘Policy’ column , ‘Tags’, ‘Enabled’, ‘Status’ and ‘Rule Details’. Where, under Policy we have a list of Policy Rules, under Tags, the direction (input to an LLM or the output response of such an Input) the gateway rules will be applied to, under Enabled , we have a two-way toggle switch for the user to set, under Status, a descriptive wordings of the action’s state (Inactive, Pending, Active) and last ,under Rule Details, a description of the fraction of the total Rule Settings that has been assigned by the user (not applicable to all rules).

Below is an example of how the rules ‘Tags’, ‘Enabled’, ‘Status’ and ‘Rule Details’ would look like.

### Policy Rule Settings[​](#policy-rule-settings)
Each rule has its own settings to be configured by the user. The settings include an ‘Action’ (see “Policy Action” section below) and a message to be displayed when this rule is violated. In some cases such as in the ‘MODIFY’ Action the message will be replaced by ‘Replacement String’.

Setting up a rule:
In order to set a Rule you will need to take the following steps:

- Go to the ‘Policy’ page
- Choose a hierarchy level (see “Varonis gateway rules hierarchy” section below) via a dropdown menu. This will bring you to the relevant Policy Hierarchy page.
- Pick a rule and expand it. This will reveal the rule’s settings.
- Set the Rules settings to your desire.
- Turn on the rule by using the toggle switch under ‘Tags’. This will do the following:

Change the toggle position and color.
- Change the ‘Status’ state to ‘Pending’. This means your Rule and Settings have not yet been enforced rather in a ‘Staging’ mode, meaning they have been saved temporarily and waiting to be approved.

- Head to the ‘View Pending Changes’ button in the upper right corner and click it. This will bring you to the ‘Pending Policy Changes Page’ where you will get details of the changes made from last approval. You will also see the changes status state in “Pending Install”, which means that once approved they will be moved from “staging” mode into “installed”.
- Head to the ‘Apply Changes’ and click the button. This will approve all changes and install them.

NOTE: if you change your mind before approving the changes you can go back to the Policy page by clicking the Policy tab on top.

Policies have either input guardrails (InputGuard), output guardrails (OutputGuard) or both. An InputGuard puts guard rails on the prompts and an OutputGuard puts guard rails on the response. InputGuard therefore operate on the prompts and can log, alert, block or modify when prompts do not conform to the policy while OutPutGuards can log, alert, block or modify responses.

## Policy Actions[​](#policy-actions)
An Action is part of a Rule settings, it defines the operation the Gateway should take when a rule has been violated. Depending on the rule in hand, each Action can be applied to the input (Input Guard), output (Output Guard) or both directions. There are Three possible configurable Actions a user can set, Warn, Block and Modify.

- WARN -
Can be set for both Input prompts and completion (Output Guard) prompts. When a rule is violated the system will allow the prompt to be processed using its defined GPT (OpenAI/Anthropic/Gemini etc.) and a “Warning” issue will be created alongside with a warning message.

Below is an example for WARN Action:

- BLOCK -
Can be set for both Input prompts (Input Guard) and completion (Output Guard) prompts. When a rule is violated the system will not allow the prompt to be processed using its defined GPT (OpenAI/Anthropic/Gemini etc.) and a “Block” issue will be created alongside with a message.

Below is an example for 'BLOCK' Action:

- MODIFY -
Can be set for both Input prompts and completion (Output Guard) prompts. When a rule is violated the system will modify the input prompt first and only then allow the prompt to be processed using its defined GPT (OpenAI/Anthropic/Gemini etc.), same for the output.

Below is an example for 'MODIFY' Action:

Below is an example of combining a 'BLOCK' Action on the InputGuard and 'WARN' Action on the OutputGuard

## Policy Hierarchy[​](#policy-hierarchy)
The rules hierarchy levels are: Customer (All organizations) -&gt; Organization -&gt; Project. Rules that are applied at a higher level will be inherited by all lower levels, but if a more specific rule is set at a lower level then that lower level will take precedence.

For example, if a rule is set at the highest level (Customer - “all-organizations”), it will apply to all downstream levels e.g. Organization A and all Projects below , Organization B and all Projects below etc. At this point the “status” tab in the Gateway Rules page will be changed from “inactive” to “Inherit” should no specific rules be set.

On the other hand, if a rule is turned on or modified at a lower level, e.g. at the level of Project A, that rule will override the one from the higher level. At this point the “status” tab in the Gateway Rules page will be changed to “pending” as it requires an approval. Once approved it will be changed to “active”

If a change has been made on the Organization level, e.g. in a specific Organization “Name”, all changes will take place only to the projects located at the “Project level” and not on any other cross Organizations.

After a change has been made at a lower, more specific level , and then modified at a higher level it will not apply to the lower level and the rule will remain “active”; but it will take action at the higher level (and for example all projects within that organization that do not have a specific rule).

Below is an example of the policy 'Drop Down' selector

## Policy Types[​](#policy-types)
### Prompt Protection[​](#prompt-protection)
#### Bad Signature[​](#bad-signature)
This rule detect signature patterns (EICAR, GTUBE and GTPHISH) in the prompt that could potentially reveal system vulnerabilities

Background:
Attackers could potentially misuse the concept of signature patterns in the context of LLM prompts to test the model's behavior or bypass security measures.

#### Code Injection and Generation Prevention[​](#code-injection-and-generation-prevention)
This rule Identifies selected programming languages used in responses and prevents LLM outputs from injecting code into applications and generating unsanctioned code.

Background:
Attackers might attempt to inject malicious code into software applications to alter or manipulate data. This code is often crafted to install malware or cause harm if executed. They may also conceal code within other text or spread it across multiple prompts to evade detection. For instance, an attacker might inject harmful code into a SQL database to steal sensitive information.

#### Code Leakage Prevention[​](#code-leakage-prevention)
Prevents leakage of sensitive code to the LLM in prompt inputs.

#### Detect Languages[​](#detect-languages)
This rule detect unsupported languages from a list of selected languages in the input prompt

Background:
Phishing emails or social engineering attacks often exploit language differences. Identifying the prompt language can help detect phishing attempts that use languages not commonly used within an organization. For example, model might produce an output in unexpected language

#### Detect Malicious URL[​](#detect-malicious-url)
This rule detects URLs with harmful intent.

#### Detect Topics[​](#detect-topics)
Detect certain topics in the prompt or reposponses. You can use built-in topics or add your own custom strings.

#### Function Call[​](#function-call)
Prevents or alerts/logs function call argument injections in the prompt output.

Background:
In cybersecurity, safeguarding against issues related to function calling focuses on protecting software from vulnerabilities and attacks that exploit how functions are executed.

#### Outliers[​](#outliers)
This rule checks for deviation between a prompt input and historical prompts and flags abnormal prompt content.

Background:
Prompt injection attacks often involve input that is contextually or semantically different from what a legitimate user would typically input. For instance, if a user usually asks business-related queries and suddenly starts inputting complex commands or code, this could be detected as an outlier.

#### PII[​](#pii)
This rule identifies the presence of Personally Identifiable Information (PII) in user messages or assistant responses, according to the specified sensitive data types.

Background:
The PII policy is established to safeguard sensitive data by identifying and blocking the exposure of Personally Identifiable Information (PII) during user interactions. Its main purpose is to maintain the privacy and security of user information by detecting and handling PII appropriately.

#### Prevent Encoded Attacks[​](#prevent-encoded-attacks)
This rule detects different types of encoded data used in prompts

Background:
Attackers often use encodings to obfuscate their payloads or malicious instructions. By encoding content, they can hide the true nature of their input, making it harder for security systems to detect malicious intent. For example, Base64 encoding can be used to disguise a command or a piece of code that might otherwise be flagged as harmful.

#### Prevent Jail-Break[​](#prevent-jail-break)
This rule identifies prompts that attempt to cause jailbreaks.

Background:
An attacker might try to input data that causes the LLM to bypass its safety controls and perform actions it normally wouldn’t. This is often achieved through "role playing" scenarios or by using complex and misleading prompts.

#### Prevent Leakage[​](#prevent-leakage)
This rule identifies prompts that may cause leakage of sensitive data

Background:
Refers to a scenario where an attacker manipulates the input prompts to extract sensitive or confidential information from the LLM, which the model should not reveal. This can happen if the LLM has access to private data or is used in an application that processes sensitive information.

#### Prevent Obfuscated Attacks[​](#prevent-obfuscated-attacks)
This rule Identify cases where user is attempting prompt smuggling and flags them

Background:
Attackers may attempt to evade filters. In particular, replace certain words/tokens that would trigger filters with synonyms of themselves or modify them to include a typo.

#### Profanity Check[​](#profanity-check)
This rule makes sure no inappropriate words are detected either in the user prompt or its assistant generated content.

#### Prohibit Topics[​](#prohibit-topics)
This rule detect outputs that touch upon topics that are considered sensitive

Background:
Even with managed prompts, LLMs might generate outputs that address themes or subjects deemed sensitive, controversial, or beyond the intended scope of interactions. Without proper safeguards, this could result in responses that do not align with the platform’s guidelines or values.

#### Refutation Alerting[​](#refutation-alerting)
This rule detects refusals in the output of LLMs.

Background:
Refusals are responses produced by language models when confronted with prompts that are considered to be against the policies set by the model. Such refusals are important safety mechanisms, guarding against misuse of the model. Examples of refusals can include statements like "Sorry, I can't assist with that" or "I'm unable to provide that information."

#### Remove Invisible Text[​](#remove-invisible-text)
This rule identifies and removes Invisible text

Background:
Steganography using invisible text can be found in various online environments, including Amazon reviews, emails, websites, and even security logs. For example by using characters that, while valid in Unicode, are not rendered by most fonts.

#### SQL Injection[​](#sql-injection)
Detects or prevents SQL Injection attacks in the prompt or response.

#### XSS Projection[​](#xss-projection)
This rule detects and prevent Cross Site Scripting attacks in prompt messages

Background:
Refers to a scenario where an attacker injects malicious scripts or HTML code into a prompt, aiming to execute it within the context of a web application or user interface that processes the model’s output. While traditional XSS attacks target web browsers, similar concepts can be applied to LLMs when they are integrated into web-based systems or applications.

Background:
A malicious URL is a link created with the purpose of promoting scams, attacks, and frauds. When clicked on, malicious URLs can download ransomware, lead to phishing or spearphishing emails, or cause other forms of cybercrime.

### Model Robustness[​](#model-robustness)
#### Boolean Validation[​](#boolean-validation)
This rule detects and flags prompts with boolean characters

Background:
Boolean content can sometimes be used in injection attacks where malicious actors try to manipulate the model's behavior by inserting logical conditions or payloads. Detecting Boolean patterns can help identify and block such attacks before they affect the model's output.

#### Clip Token[​](#clip-token)
This rule caps any prompt tokens to the model Token limit.

Background:
The large size and complexity of LLMs make them prone to significant resource consumption, particularly when handling extended prompts. Malicious actors may take advantage of this by submitting excessively long inputs, intending to disrupt service or cause high computational expenses.

#### JSON Validation[​](#json-validation)
identifies and validates the presence of JSON structures within given prompts, and returns a repaired JSON if possible

Background:
Ensuring that the JSON data used as input to or output from the model is properly formatted and does not contain malicious or unintended content that could exploit vulnerabilities.

#### Message Count Control[​](#message-count-control)
This rule makes sure the number of messages within an input prompt are below a certain limit

Background:
A common cybersecurity concern is prompt injection, where an attacker manipulates the input prompts to make the LLM behave in unintended ways, such as leaking sensitive information or performing unauthorized actions. By monitoring the number of input prompt messages, it becomes easier to detect unusual patterns or sequences of prompts that might indicate an ongoing injection attack.

#### Policy Message Rule[​](#policy-message-rule)
Appends a policy message to the end of the LLM Response (banner)

#### String Validation[​](#string-validation)
This Rule removes unwanted sub strings from your prompts. It can also filter the outputs generated by LLMs.

## Issues[​](#issues)
When you define a policy, you select whether to create an issue when a policy fires and at what severity. These issues are then displayed on the issues tab.

## Report[​](#report)
Search through prompts and responses that were recorded by the AI gateway.

## Observability[​](#observability)
All AI gateway events are logged within the observability layer in the ai-ocsf-firewall index. There are four types of events logged, differing in the event_name field:

- Process Prompt Input is an event per prompt that describes the prompt and all actions tables by policy input guards.
- Process Prompt Output is an event per response that describes the response and all actions tables by policy output guards.
- Execute Action on Prompt Input is an event per action taken by a single policy input guard.
- Execute Action on Prompt Output is an event per action taken by a single policy output guard.

## Session Features[​](#session-features)
Optional parameters can be sent alongside completion requests. These are recorded in the system and can be used for richer analytics and enable advanced features.

### Parameters[​](#parameters)
ParameterField NameTypeExplanation / Use Case**Session ID**`user-session-id``str`An identifier used to link individual requests into “sessions”. For example, all requests in one conversation can be linked in a session.**User ID**`user-session-user-id``str`An identifier assigned to each user. Helps in personalizing user experiences and managing user-specific data or preferences.**User IP**`user-session-user-ip``str`The IP address of the user. Can be used for auditing, security purposes, or geolocation-based customization.**User Role**`user-session-user-role``str`The designation or role of the user (e.g., admin, editor, viewer).**User Email**`user-session-user-email``str`An email associated with the user. Useful for communication, notifications, or identifying user accounts.**User Privileges**`user-session-user-privileges``str`Defines the permissions or access levels granted to the user.**Application ID**`user-session-application-id``str`A unique identifier for the application instance. Useful for monitoring and analytics across different instances or deployments.**Application Name**`user-session-application-name``str`The name of the application using the LLM client. Helps in logging and identification of the application in multi-app environments.**Application Version**`user-session-application-version``str`The specific version of the application. Valuable for debugging, tracking updates, or identifying compatibility issues.
### Passing Parameters from Clients[​](#passing-parameters-from-clients)
When using the proxy, optional parameters are passed a header object when making the request to the LLM provider.

For example, if we want to pass the following parameters:

- Session ID: abc123
- User ID: User1
- User Email: [user@email.com](mailto:user@email.com)

Then we add add these values as a stringified JSON object under the **x-alltrue-llm-firewall-user-session** header

```
{ 
'x-alltrue-llm-firewall-user-session': '{"user-session-id": "abc123", "user-session-user-id": "User1", "user-session-user-email": "user@email.com"}'
}

```
## Rate and Burst Limiting[​](#rate-and-burst-limiting)
The AI Gateway and the guardrails evaluation system run wihin the Customer Data Plane which runs within a self-managed AWS account. You can configure rate and burst limits easily using AWS tools.

### Understanding Rate Limit and Burst Limit[​](#understanding-rate-limit-and-burst-limit)
Rate limit (requests per second) defines the long-term average request throughput that a route is allowed to sustain.
Burst limit (requests) defines the maximum number of requests that can be accepted in a short spike beyond the steady-state rate.

The AI Gateway enforces these limits using a token-bucket algorithm: tokens are replenished at the configured rate limit (tokens per second), up to a maximum bucket size equal to the burst limit. Each request consumes one token; when the bucket is empty, additional requests are throttled.

### Configuring[​](#configuring)
You can set these up using the AWS Console or using the CLI.

To set up rate and burst limiting using the console:

- Navigate to the AWS Console within the Data Plane AWS account and select API Gateway.
- Select the "AllTrueAPI" HTTP Gateway.
- In the left menu select Protect -&gt; Throttling.
- Select the "$default" stgae to view and modify the rate limit and burst limit for each Gateway route.

To set up rate and burst limits using the CLI run this command within the Data Plane account for the routes you want to change the rate limit:

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
[PreviousAI SPM](/_docs/docs/applications/ai_spm)[NextAI Monitor](/_docs/docs/applications/ai_monitor)- [Pointing to the Proxy](#pointing-to-the-proxy)[OpenAI](#openai)- [Azure OpenAI](#azure-openai)- [Anthropic](#anthropic)- [Gemini](#gemini)- [WatsonX](#watsonx)- [Calling Guardrails Directly](#calling-guardrails-directly)- [Authentication](#authentication)[Usage Example](#usage-example)- [Processing Inputs](#processing-inputs)[Usage Example](#usage-example-1)- [Free Form Messages](#free-form-messages)- [Output Process](#output-process)[Usage Example](#usage-example-2)- [Building Policies](#building-policies)[Policies Page Overview](#policies-page-overview)- [Policy Rule Settings](#policy-rule-settings)- [Policy Actions](#policy-actions)- [Policy Hierarchy](#policy-hierarchy)- [Policy Types](#policy-types)[Prompt Protection](#prompt-protection)- [Model Robustness](#model-robustness)- [Issues](#issues)- [Report](#report)- [Observability](#observability)- [Session Features](#session-features)[Parameters](#parameters)- [Passing Parameters from Clients](#passing-parameters-from-clients)- [Rate and Burst Limiting](#rate-and-burst-limiting)[Understanding Rate Limit and Burst Limit](#understanding-rate-limit-and-burst-limit)- [Configuring](#configuring)
