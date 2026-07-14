---
title: Anthropic OTEL Logs
url: https://prod.alltrue-be.com/_docs/docs/log_sources/anthropic_otel
section: log_sources
---

# Anthropic OTEL Logs

- [](/_docs/)- [Log Sources](/_docs/docs/log_sources/overview)- Anthropic OTEL LogsExport PDFOn this page# Anthropic OTEL Logs
This Log Source ingests OpenTelemetry (OTEL) logs emitted by **Anthropic Claude Code** and **Claude Cowork** clients into Atlas for offline runtime-policy evaluation, alerting, and a unified investigation view. It is a **push** source: each client exports telemetry to a collector endpoint that Atlas provisions for your data plane. You point the client at that collector with a few environment variables; the setup is the same for Claude Code and Claude Cowork.

This Log Source requires an **AWS data plane**; Azure data planes are not yet supported (see [Log Sources](/_docs/docs/log_sources/overview)).

## Get your collector endpoint and token[​](#get-your-collector-endpoint-and-token)
After you create the integration (see [Configuring Log Sources](/_docs/docs/log_sources/configuration)), open the integration's **Destination** details. They provide:

- the **collector endpoint URL** the client exports to, and
- an **API key** — a per-data-plane bearer token used to authenticate the export.

The plaintext token is shown only here, so copy it when you set up the client.

## Configure the client (environment variables)[​](#configure-the-client-environment-variables)
Set the following environment variables on the client (Claude Code or Claude Cowork), using the collector endpoint URL and token from the Destination details:

```
CLAUDE_CODE_ENABLE_TELEMETRY=1 # master switch
OTEL_LOGS_EXPORTER=otlp
OTEL_EXPORTER_OTLP_PROTOCOL=http/json
OTEL_EXPORTER_OTLP_ENDPOINT=&lt;collector_endpoint_url&gt; # from Destination details
OTEL_EXPORTER_OTLP_HEADERS="Authorization=Bearer &lt;api_key&gt;" # from Destination details
OTEL_LOG_USER_PROMPTS=1 # capture the user's prompt text
OTEL_LOG_RAW_API_BODIES=1 # capture the model's response
OTEL_LOGS_EXPORT_INTERVAL=2000 # optional; export flush interval in ms

```
Two flags govern what content is captured:

- `OTEL_LOG_USER_PROMPTS=1` is required to capture the **user's prompt text**.
- `OTEL_LOG_RAW_API_BODIES=1` is required to capture the **model's response**. Without it, you still get prompts, tool activity, and request metadata — but not the model's reply.

## What gets captured (event types)[​](#what-gets-captured-event-types)
Atlas captures the following event types:

EventWhat is capturedFlag required`user_prompt`The user's prompt text`OTEL_LOG_USER_PROMPTS=1` (for the text)`api_response_body`The assistant's reply text`OTEL_LOG_RAW_API_BODIES=1``tool_result`A tool invocation (an error is surfaced as a completion)—`tool_decision`Accept or reject of a tool action—`api_request`Metadata only — model and token counts—`api_error`Metadata only — model and error—
Other telemetry is **not** ingested: the full request envelope (`api_request_body`), hook-execution events, and any unknown or future event names are silently skipped.

## Evaluation, alerting, and where events appear[​](#evaluation-alerting-and-where-events-appear)
Anthropic OTEL Logs are evaluated **offline**: policy actions configured to BLOCK or MODIFY are surfaced as **ALERT**, since Atlas receives the activity after the fact. Ingested events appear in [AI Investigation](/_docs/docs/applications/ai_monitor).

For the shared mechanics — creating the integration, assigning it to a project, and applying runtime policies to the created resource — see [Configuring Log Sources](/_docs/docs/log_sources/configuration).
[PreviousIsland Browser](/_docs/docs/log_sources/island_browser)[NextAWS Bedrock](/_docs/docs/log_sources/aws_bedrock)- [Get your collector endpoint and token](#get-your-collector-endpoint-and-token)- [Configure the client (environment variables)](#configure-the-client-environment-variables)- [What gets captured (event types)](#what-gets-captured-event-types)- [Evaluation, alerting, and where events appear](#evaluation-alerting-and-where-events-appear)
