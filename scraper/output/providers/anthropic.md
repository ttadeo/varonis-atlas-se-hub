---
title: Anthropic
url: https://prod.alltrue-be.com/_docs/docs/providers/anthropic
section: providers
---

# Anthropic

- [](/_docs/)- [Providers](/_docs/docs/providers)- AnthropicExport PDFOn this page# Anthropic
Atlas integrates with Anthropic across provider APIs and Claude applications. You can configure Anthropic LLM endpoints for AI Gateway proxying and AI Red Team testing, ingest Claude usage history through the Anthropic Compliance API, use Claude models as runtime evaluator LLMs, and protect Claude application activity through runtime integrations for Claude Cowork and Claude Code.

This page explains where each Anthropic integration lives, what you need to configure, and which pages cover the surrounding workflows.

## How Atlas connects to Anthropic[​](#how-atlas-connects-to-anthropic)
Atlas does not require a cloud-account link for Anthropic. Anthropic surfaces are configured individually from the relevant Atlas screen:

- **Anthropic Endpoint** — a manually added LLM endpoint resource that AI Gateway proxies and AI Red Team pentests.
- **Anthropic Compliance API** — a pull-based log source that ingests Claude usage history into the Atlas log pipeline.
- **Anthropic evaluator LLM** — a credential the Atlas runtime uses to call Claude for guardrail evaluation.
- **Claude Cowork Runtime Integration** — a hook-based runtime integration that sends Claude Cowork activity to Atlas for runtime policy evaluation, logging, observability, and post-processing.
- **Claude Code Runtime Integration** — a coding-agent runtime integration for Claude Code activity. This integration is documented under Coding Agent Protection because it protects developer-agent activity.

Each surface has its own credentials, resource model, and configuration page. You can use any subset of them independently.

## Anthropic LLM endpoints in AI Inventory[​](#anthropic-llm-endpoints-in-ai-inventory)
To add a manually configured Anthropic endpoint, go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint** and select **Anthropic** as the provider. The endpoint accepts an API key and, optionally, a base URL override.

Once added, an Anthropic endpoint is:

- Routable through AI Gateway (see [Routing Anthropic traffic through AI Gateway](#routing-anthropic-traffic-through-ai-gateway) below).
- Pentestable from AI Red Team (see [AI Red Team coverage for Anthropic endpoints](#ai-red-team-coverage-for-anthropic-endpoints) below).

Atlas stores the API key with the endpoint so AI Red Team can run pentests against it (AI Red Team calls Anthropic directly using the stored key). For AI Gateway proxying, the key is supplied by the caller on each request rather than injected by Atlas — see [Routing Anthropic traffic through AI Gateway](#routing-anthropic-traffic-through-ai-gateway) below.

## Routing Anthropic traffic through AI Gateway[​](#routing-anthropic-traffic-through-ai-gateway)
Once an Anthropic endpoint is registered, AI Gateway exposes a proxy URL of the form `{api_endpoint}/anthropic/v1/messages`. Requests sent to that URL are inspected against the endpoint's policies and forwarded to Anthropic. The caller supplies the Anthropic API key on each request via the `x-api-key` header — Atlas does not inject the stored key on this path — and includes an endpoint-identifier header so the proxy can associate the request with this registered endpoint.

The proxy expects these headers on each call:

- `x-api-key: $ANTHROPIC_API_KEY` — your Anthropic API key, supplied by the caller.
- `anthropic-version: 2023-06-01`
- `content-type: application/json`
- `x-alltrue-llm-endpoint-identifier: &lt;endpoint-id&gt;` — identifies the registered endpoint. The exact value is shown in the endpoint's proxy info in AI Inventory.

A typical call looks like:

```
curl {api_endpoint}/anthropic/v1/messages \
 -H "x-api-key: $ANTHROPIC_API_KEY" \
 -H 'anthropic-version: 2023-06-01' \
 -H 'content-type: application/json' \
 -H "x-alltrue-llm-endpoint-identifier: &lt;endpoint-id&gt;" \
 -d '{
 "model": "claude-3-7-sonnet-20250219",
 "max_tokens": 1024,
 "messages": [
 {"role": "user", "content": "Hello, world"}
 ]
 }'

```
For policy attachment, routing rules, and the rest of the AI Gateway lifecycle, see [AI Gateway](/_docs/docs/applications/ai_gateway).

## AI Red Team coverage for Anthropic endpoints[​](#ai-red-team-coverage-for-anthropic-endpoints)
Anthropic LLM endpoints can be targeted from AI Red Team alongside OpenAI, Google AI, Bedrock, and WatsonX endpoints. Pentest runs are configured per endpoint from the AI Red Team workflow.

For the full pentest run workflow, see [AI Red Team](/_docs/docs/applications/ai_red_team).

## Ingesting Anthropic Compliance API logs[​](#ingesting-anthropic-compliance-api-logs)
The **Anthropic Compliance API log source** ingests Claude usage history into Atlas using Anthropic's Compliance API. Unlike runtime gateway proxying, this is a pull-based integration: Atlas polls Anthropic on an interval and writes the returned chats into the same ingestion pipeline that surfaces firewall events.

To configure it, go to **Admin Console &gt; System Settings &gt; Log Sources** and add an **Anthropic Compliance API** integration. The integration requires an Anthropic Compliance API key. Each configured tenant becomes a *live-sync card* that continuously pulls new activity on a recurring schedule. You can also trigger a *backfill* to pull a bounded historical window.

Once sync is enabled, Atlas periodically pulls Anthropic activity and the chats flow through the standard ingestion pipeline so they surface as firewall events attributed to a single resource instance per live-sync card.

This log source is not configured from the AI Gateway proxy drawer; it has its own pull-based lifecycle managed under Admin Console &gt; System Settings &gt; Log Sources. For the full end-to-end walkthrough — generating the API key, assigning a project and data plane, configuring runtime policies, triggering a backfill, and viewing the ingested activity in Sessions — see [Anthropic Compliance API](/_docs/docs/log_sources/anthropic_compliance_api). For where this source sits among Log Source types, see [Log Sources](/_docs/docs/log_sources/overview).

## Runtime protection for Claude applications[​](#runtime-protection-for-claude-applications)
Atlas supports runtime protection for Claude application activity through application-specific Guardrail Integration resources.

Use **Claude Cowork Runtime Integration** to protect Claude Cowork activity. This integration is configured as an inventoried Guardrail Integration resource, scoped to a project, attached to runtime policies, and distributed to users through a Claude plugin. Once installed, Claude Cowork events are sent to the selected Atlas data plane for policy evaluation, logging, observability in AI Investigation, and post-processing.

Use **Claude Code Runtime Integration** to protect Claude Code activity. Claude Code is documented under Coding Agent Protection because it protects coding-agent workflows and supports Claude Code hook deployment patterns.

Claude Cowork and Claude Code are separate runtime integrations. Use separate resources when you want separate policy scope, event attribution, audit trails, or source-application context.

For setup instructions, see [Claude Cowork Runtime Integration](/_docs/docs/providers/anthropic/claude_cowork_runtime_integration).

For Claude Code setup instructions, see [Claude Code Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection/claude_code).

## Using Anthropic models as evaluator LLMs[​](#using-anthropic-models-as-evaluator-llms)
You can use Claude as a runtime evaluator LLM for Atlas guardrails. Configure it from **Admin Console &gt; Runtime Evaluator LLM**.

Two provider options reach Claude:

- **Anthropic** — direct Anthropic API access. The form takes an **API Key** and an optional **Base URL**. The recommended default model is `claude-haiku-4-5-20251001`.
- **Bedrock Anthropic** — reach Claude via AWS Bedrock instead of directly. Use the Claude Haiku 4.5 model ID exposed in your AWS Bedrock region, for example `us.anthropic.claude-haiku-4-5-20251001-v1:0` where available. Credentials follow the AWS Bedrock evaluator flow; see [AWS Bedrock](/_docs/docs/providers/aws_bedrock) for details.

For evaluator-LLM lifecycle and how runtime guardrails call out to it, see [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm).

## Inventoried Anthropic resources[​](#inventoried-anthropic-resources)
Atlas labels models attributed to Anthropic with the provider name **Anthropic** in AI Inventory. Atlas does not run a dedicated Anthropic discovery pipeline; Anthropic-labeled models arrive in inventory through one of three paths:

- **Bedrock foundation models that are Claude** — discovered via the AWS Bedrock cloud-discovery pipeline; see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).
- **Models observed in AI Gateway invocation logs** routed via an Anthropic endpoint.
- **Manually added Anthropic LLM endpoints** — see [Anthropic LLM endpoints in AI Inventory](#anthropic-llm-endpoints-in-ai-inventory) above.

Claude Cowork Runtime Integration and Claude Code Runtime Integration are inventoried as **Guardrail Integration** resources. They are not LLM endpoint resources and are not used for AI Gateway provider routing. They represent protected Claude application environments that send runtime events to Atlas.

## Related pages[​](#related-pages)

- [AI Gateway](/_docs/docs/applications/ai_gateway)
- [AI Red Team](/_docs/docs/applications/ai_red_team)
- [Anthropic Compliance API](/_docs/docs/log_sources/anthropic_compliance_api)
- [Log Sources](/_docs/docs/log_sources/overview)
- [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm)
- [AWS Bedrock](/_docs/docs/providers/aws_bedrock)
- [Claude Cowork Runtime Integration](/_docs/docs/providers/anthropic/claude_cowork_runtime_integration)
- [Claude Code Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection/claude_code)
- [AI Investigation](/_docs/docs/applications/ai_monitor)
[PreviousAWS Bedrock](/_docs/docs/providers/aws_bedrock)[NextClaude Cowork](/_docs/docs/providers/anthropic/claude_cowork_runtime_integration)- [How Atlas connects to Anthropic](#how-atlas-connects-to-anthropic)- [Anthropic LLM endpoints in AI Inventory](#anthropic-llm-endpoints-in-ai-inventory)- [Routing Anthropic traffic through AI Gateway](#routing-anthropic-traffic-through-ai-gateway)- [AI Red Team coverage for Anthropic endpoints](#ai-red-team-coverage-for-anthropic-endpoints)- [Ingesting Anthropic Compliance API logs](#ingesting-anthropic-compliance-api-logs)- [Runtime protection for Claude applications](#runtime-protection-for-claude-applications)- [Using Anthropic models as evaluator LLMs](#using-anthropic-models-as-evaluator-llms)- [Inventoried Anthropic resources](#inventoried-anthropic-resources)- [Related pages](#related-pages)
