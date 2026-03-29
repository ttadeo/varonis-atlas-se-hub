---
title: Using Quarantining APIs from Kong Konnect
url: https://prod.alltrue-be.com/_docs/docs/platform_services/kong
section: platform_services
---

# Using Quarantining APIs from Kong Konnect

- [](/_docs/)- Integration Examples- Using Quarantining APIs from Kong KonnectOn this page# Using Quarantining APIs from Kong Konnect
The system provides a facility for managing access to LLMs through sanctioning/unsanctioning resources ([see Quarantining Policy for LLMs](/_docs/docs/applications/ai_usage#quarantine-policy-for-llm-endpoints) ).

This can be done using the built-in [AI Gateway](/_docs/docs/applications/ai_gateway) or by integrating with third-party API gateways. This integration note describes how to provide this quarantining functionality when using Kong Konnect Enterprise Edition.

When you use Kong as your AI gateway, all access to LLMs will be through the Kong proxy. The integration with the TRiSM system uses a Kong plugin to call the quarantining API to determine whether an LLM is sanctioned or unsanctioned and thus provide access or deny access. Requests to access the LLM go through Kong and are passed to the [Request Callout plugin](https://docs.konghq.com/hub/kong-inc/request-callout/configuration/). At that point an API call is made to the TRiSM Hub. The API call receives the LLM endpoint or the API key from the request. These are compared with LLMs inventories by the TRiSM Hub. If the LLM is unsanctioned the API call returns an unsanctioned status and the plugin prevents the request from reaching the LLM. If the LLM is sanctioned then the request is let through to the LLM. Caching is configured at the plugin level with a TTL that can be chosen (typically 300 seconds) so that the additional latency does not affect operation. Note that this means that when you update the sanctioned/unsanctioned attribute on the TRiSM hub the effect may take up to 300 seconds to take effect (or whatever TTL you selected).

## Sample Configuration of the Request Callout Plugin[​](#sample-configuration-of-the-request-callout-plugin)
First you need to generate an API key for the TRiSM Hub in the [Admin Console](/_docs/docs/platform_services/admin_console).

Then you enable the Request Callout plugin (see Kong Konnect documentation). Typically there will be two callouts - the first to attain a JWT Token using an API key and the second to make the API call for evaluating whether the LLM is sanctioned or unsanctioned.

Callout 1:

```
{
 "cache": {
 "bypass": false
 },
 "depends_on": [],
 "name": "alltrue_token",
 "request": {
 "body": {
 "custom": {
 "api_key": "b6S--------gDh"
 },
 "decode": false,
 "forward": false
 },
 "by_lua": null,
 "error": {
 "error_response_code": 400,
 "error_response_msg": "service callout error",
 "http_statuses": null,
 "on_error": "fail",
 "retries": 2
 },
 "headers": {
 "custom": {},
 "forward": false
 },
 "http_opts": {
 "proxy": null,
 "ssl_server_name": null,
 "ssl_verify": false,
 "timeouts": null
 },
 "method": "POST",
 "query": {
 "custom": {},
 "forward": false
 },
 "url": "https://api.prod.alltrue-be.com/v1/auth/issue-jwt-token"
 },
 "response": {
 "body": {
 "decode": true,
 "store": true
 },
 "by_lua": null,
 "headers": {
 "store": true
 }
 }
}

```
Callout 2:

```
{
 "cache": {
 "bypass": false
 },
 "depends_on": [
 "alltrue_token"
 ],
 "name": "alltrue_quarantine",
 "request": {
 "body": {
 "custom": {},
 "decode": true,
 "forward": false
 },
 "by_lua": "if kong.request.get_header(\"x-alltrue-llm-endpoint-identifier\") ~= nil then\n kong.ctx.shared.callouts.alltrue_quarantine.request.params.body = '{\"endpoint_identifier\":\"' .. kong.request.get_header(\"x-alltrue-llm-endpoint-identifier\") .. '\"}'\n kong.ctx.shared.callouts.alltrue_quarantine.caching.cache_key = 'alltrue_quarantine:ei:' .. kong.request.get_header(\"x-alltrue-llm-endpoint-identifier\")\nelse\n kong.ctx.shared.callouts.alltrue_quarantine.request.params.body = '{\"api_key\":\"' .. string.sub(kong.request.get_header(\"Authorization\"), 8, -1) .. '\"}'\n kong.ctx.shared.callouts.alltrue_quarantine.caching.cache_key = 'alltrue_quarantine:ky:' .. string.sub(kong.request.get_header(\"Authorization\"), 8, -1)\nend\n\nkong.log.notice(\" &lt;- headers -&gt; \", kong.ctx.shared.callouts.alltrue_quarantine.request.params.headers)\nkong.log.notice(\" &lt;- key -&gt; \", kong.ctx.shared.callouts.alltrue_quarantine.caching.cache_key)\nkong.log.notice(\" &lt;- body -&gt; \", kong.ctx.shared.callouts.alltrue_quarantine.request.params.body)",
 "error": {
 "error_response_code": 400,
 "error_response_msg": "service callout error",
 "http_statuses": null,
 "on_error": "fail",
 "retries": 0
 },
 "headers": {
 "custom": {
 "Authorization": "$(callouts.alltrue_token.response.body.token_type) $(callouts.alltrue_token.response.body.access_token)"
 },
 "forward": false
 },
 "http_opts": {
 "proxy": null,
 "ssl_server_name": null,
 "ssl_verify": false,
 "timeouts": null
 },
 "method": "POST",
 "query": {
 "custom": {},
 "forward": false
 },
 "url": "https://api.prod.alltrue-be.com/v1/ai-usage/quarantine/llm-endpoint"
 },
 "response": {
 "body": {
 "decode": true,
 "store": true
 },
 "by_lua": "kong.log.notice(\" &lt;- before:cache -&gt; \", kong.ctx.shared.callouts.alltrue_quarantine.caching.cache_key)",
 "headers": {
 "store": true
 }
 }
}

```
You then configure the Callout plugin to looks for the sanctioned element to determine whether to continue upstream or not:

Finally, you control what LLMs are snactioned/unsanctioned by enabling LLM endpoints quarantining policy and sanctioning/approving LLMs on the AI Usage -&gt; Policies page:

[PreviousLLM Pentest Execution Workflow Using REST API](/_docs/docs/platform_services/llm_pentest)[NextGraphQL API Reference](/_docs/docs/)- [Sample Configuration of the Request Callout Plugin](#sample-configuration-of-the-request-callout-plugin)
