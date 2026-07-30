---
title: AI Investigation
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_monitor
section: applications
---

# AI Investigation

- [](/_docs/)- Applications- AI InvestigationExport PDFOn this page# AI Investigation
AI Investigation is the platform's central hub for runtime visibility, investigation, and evidence. It gives AI Security and Governance teams a clear view into how AI Systems are actually being used by capturing and organizing the full runtime story: trends over time, fired alerts, individual events, complete sessions, prompts, responses, tool activity, policy outcomes, and performance behavior.

This is what turns AI Runtime from a black box into something teams can actually trust, review, and prove. Instead of only knowing that a policy exists, you can see what happened, which requests were risky, which sessions were affected, what tools were available or called, how the system responded, and how AI Runtime intervened. That makes AI Investigation valuable not only for threat detection and incident response, but also for demonstrating the kinds of logging, observability, traceability, explainability, and runtime oversight expected across many security, governance, and compliance frameworks.

AI Investigation helps teams answer questions such as:

- Are jailbreak attempts increasing for a specific AI System?
- Is sensitive data appearing more often in prompts or responses?
- Which exact requests triggered an alert?
- What happened in the full session that led to this event?
- Which tools were available, which were called, and what arguments were passed?
- Was content blocked, modified, tokenized, or otherwise changed by AI Runtime?
- Did latency, token usage, or session behavior spike for a particular workflow?

Unlike a simple monitoring dashboard, AI Investigation supports the full investigation workflow. You can start from a trend, alert, or issue and drill all the way down to the underlying events and sessions that explain what happened. You can review activity at the system level, inspect individual requests in chronological order, and reconstruct full conversations or agent flows in context. The result is a practical system of record for runtime AI activity that helps organizations detect risk faster, investigate with confidence, and maintain evidence of control effectiveness over time.

## Why AI Investigation matters[​](#why-ai-investigation-matters)
AI Systems are dynamic, and risk does not end once a runtime policy is enabled. Teams need to understand not only whether protections are configured, but how the system is behaving in practice: the prompts end users are sending to your AI Systems, how models are responding, how tools are being used, whether policies are firing, and whether operational patterns are changing over time.

AI Investigation gives organizations a structured way to do that. It provides visibility into runtime quality and safety trends, operational insight into performance and usage patterns, alert-driven workflows for triaging abnormal behavior, and detailed session- and event-level evidence for investigation and review.

For AI Security teams, this means faster detection and investigation of risky runtime behavior. For Governance teams, it provides a concrete record of runtime oversight and control operation. For platform and engineering teams, it provides the detail needed to troubleshoot latency spikes, token anomalies, and unusual system behavior. In short, AI Investigation helps teams move from "something seems wrong" to "here is exactly what happened."

## How AI Investigation works[​](#how-ai-investigation-works)
AI Investigation is powered by data collected at the AI Runtime layer. As requests pass through the platform, the system records two main categories of information.

**Quality outcomes**
Enabled runtime policies evaluate requests and responses and assign outcome tags based on what they detect. These outcomes power the quality-related charts, alerting, and investigation workflows.

**Performance telemetry**
The platform also records operational data such as latency, tool calls per session, and token usage. These metrics support performance analysis, anomaly review, and cost-related investigation workflows.

AI Investigation uses aggregated data for dashboard-style views and supports drill-down into the underlying request data when deeper analysis is needed. Everything in AI Investigation is scoped to the selected AI System and its hierarchy, so the charts, alerts, issues, sessions, and events shown for a resource reflect the runtime data collected for that specific system.

**Data freshness.** Aggregated dashboard charts lag real time by approximately five minutes. Alerts are evaluated only after the relevant interval window completes, so the platform can assess the full bucket accurately before raising a signal. A brief gap at the leading edge of a chart is expected and does not indicate missing data.

## AI Investigation at a glance[​](#ai-investigation-at-a-glance)
AI Investigation is organized into six main areas:

- **Dashboard** — Monitor quality and performance over time, configure alerts, and drill into suspicious intervals.
- **Sessions** — Reconstruct end-to-end AI interactions to understand prompts, tool activity, responses, and policy actions in context.
- **Events** — Inspect individual runtime events, including Prompt Events and Access Events.
- **Quarantines** — Review and manage quarantines created when a policy fires, and see what each one blocked.
- **Issues** — Review alert-driven issues, prioritize investigation, and track resolution.
- **Reports** — Export AI Investigation issue history for review and follow-up.

Together, these areas support a typical investigation workflow: detect a change, review the generated issue, drill into the exact events, examine activity in session context if needed, and export or share the results.

## Dashboard[​](#dashboard)
The Dashboard is the main entry point for monitoring activity across your AI Systems. It provides a high-level view of runtime quality signals and operational performance so you can quickly identify changes that may require investigation.

The dashboard is organized around a selected AI System. You choose a time range, review the systems in scope, select the one you want to investigate, and then explore the relevant quality and performance data for that system.

### AI System list and severity ranking[​](#ai-system-list-and-severity-ranking)
The left panel displays AI Systems within the selected scope. These systems are ranked by severity, allowing you to focus first on the systems with the most urgent open conditions. Severity is driven by the alerts and issues that remain open for the selected AI System. This makes the dashboard immediately useful as a prioritization surface, not just a reporting view.

When you select an AI System, the main dashboard updates to show the relevant metrics, charts, and alert settings for that system.

### Time range and interval controls[​](#time-range-and-interval-controls)
The dashboard supports time-based analysis, letting you review activity over a selected time range and adjust the level of detail you want to see.

For each metric, you can view data across different time granularities. AI Investigation supports broader trend analysis as well as interval-level investigation. This helps you move naturally from "something changed" to "this is exactly when it happened."

### Quality Metrics[​](#quality-metrics)
The **Quality Metrics** tab shows scanner-based metrics derived from AI Runtime outcomes. The set of graphs shown here depends on which runtime scanners are enabled for the selected AI System. If a scanner is not enabled in AI Runtime, data for that scanner will not appear in AI Investigation.

Each graph shows how that scanner's classifications changed over time. For a given scanner, the chart can include:

- counts for each outcome category
- a rate line showing the percentage of "bad" outcomes over time
- a 30-day average line to provide historical baseline context.

For example, a PII scanner graph can show how many requests contained PII versus how many did not, along with the overall rate of PII detections and how that rate compares to the recent baseline.

Quality scanners are grouped into the following categories so you can quickly orient yourself across the available signals:

- **Prompt Protection** — detection of prompt injection, jailbreak attempts, and related manipulation of model input.
- **Model Robustness** — content safety, data-leak and PII exposure, and other integrity signals on model output.
- **User Experience and Tone** — off-topic, brand, and tone-related signals for content quality.
- **Agentic Guardrails** — guardrails for tool use, tool-call arguments, and agent decision steps.
- **Multimodal Guardrails** — guardrails for non-text content such as images and files.

The exact scanners available within each category depend on which runtime policies are enabled for the AI System.

These views help you answer questions such as:

- Is this scanner triggering more often than usual?
- Did a spike occur during a specific period?
- Is this behavior isolated or part of a larger trend?

#### Quality metric drill-down[​](#quality-metric-drill-down)
Quality metrics are designed to support investigation, not just visualization.

You can start at a broader view, identify a suspicious time interval, and then drill into narrower windows to understand what caused the spike. Once you reach the most detailed level, you can open the event data for that interval and review the individual requests and tags associated with it.

This lets you move directly from a trend line to the underlying evidence.

### Performance Metrics[​](#performance-metrics)
The **Performance Metrics** tab focuses on operational behavior rather than scanner classifications. It helps you investigate system health, usage patterns, latency changes, token growth, and session-level behavior. The expanded metrics coverage includes both request-level and session-level metrics.

Examples of performance-related metrics include:

- latency
- prompt, completion, context, and total token counts
- requests per session
- tokens per session
- tool calls per session
- other per-request and per-session runtime metrics.

For each performance metric, AI Investigation surfaces a full percentile breakdown — **min, P10, P50, P90, P95, P99, and max** — alongside the running series. This makes it possible to investigate not just average behavior, but also tail behavior such as latency spikes or unusually expensive request patterns.

Performance Metrics are especially useful for questions like:

- When did latency spike?
- Are tokens per request or per session increasing?
- Are there signs of abnormal or costly behavior?
- Is operational performance degrading for a specific AI System?

#### Performance metric drill-down[​](#performance-metric-drill-down)
Performance metrics support the same investigative pattern as quality metrics: you can identify a suspicious interval and then open the underlying request data for that time window.

In a performance investigation, the detailed view focuses on the metric that triggered concern. For example:

- a latency investigation emphasizes latency values per request
- a token investigation emphasizes prompt, context, completion, or total tokens
- a session investigation emphasizes session-level usage patterns.

This helps you quickly isolate the requests that contributed most to the spike you are reviewing.

### Alert settings[​](#alert-settings)
AI Investigation supports alerting directly from dashboard metrics so you can be notified when behavior moves outside an acceptable range.

You can configure alerts for scanners and metrics using controls such as:

- time interval
- threshold type
- threshold value
- severity
- direction, where applicable
- multiple rules for the same scanner or metric.

AI Investigation supports three threshold models:

- **Absolute** — fires when a metric or rate crosses a fixed configured value.
- **Relative** — compares the current metric or rate to its 30-day baseline and fires when the configured change threshold is exceeded.
- **Adaptive** — uses anomaly detection over recent behavior to flag values that deviate from the learned pattern for that metric, without requiring you to set a fixed threshold.

Each alert rule is scoped to a specific AI System (and its hierarchy) and to a chosen time-interval granularity. One rule applies at one granularity, so you can run, for example, a tight short-interval rule and a broader long-interval rule side by side on the same metric without them interfering.

Alerts are evaluated after the relevant interval window completes, which makes them near real-time while still allowing the platform to assess the full bucket accurately.

## Issues[​](#issues)
The Issues page turns alerts into a practical operational workflow.

Rather than generating isolated notifications, AI Investigation groups related alerts into issues so teams can triage, track, and resolve conditions over time. This makes the feature much more useful for ongoing operations because you can see repeated or recurring problems as part of a single investigation history.

### Quality Issues and Performance Issues[​](#quality-issues-and-performance-issues)
Issues are separated into **Quality Issues** and **Performance Issues**.

This separation helps you distinguish between:

- content, safety, or control-related concerns
- operational, performance, or usage-related concerns.

A spike in prompt injection detections and a spike in latency are both important, but they typically involve different reviewers, different workflows, and different next steps.

### How issues work[​](#how-issues-work)
Each issue represents an underlying alert condition for a specific AI System and context. When a new alert fires for the same issue grouping, AI Investigation updates the existing issue rather than creating a completely new one each time. If the issue was previously closed and a new related alert fires, the issue is reopened.

This gives you a much cleaner investigation history:

- one issue tracks the broader condition
- each alert becomes an instance attached to that issue
- the issue can be reviewed, closed, and later reopened if the condition returns.

**Issue identity and severity.** Severity is part of an issue's identity. A new alert at a different severity for the same condition is treated as a distinct issue rather than rolled into the existing one. By contrast, differences in how the alert was aggregated (for example, the same condition observed across different aggregation rules) do not split issues — those alerts roll up into the same issue so the history stays continuous.

### Issue detail[​](#issue-detail)
Opening an issue shows the alert instances associated with it. This helps you understand:

- when the alerts fired
- what value triggered the alert
- how that value compared to the configured threshold
- how many alert instances are attached to the issue
- where to click to investigate the exact interval that triggered it.

From here, you can jump directly into the detailed event data for the exact time bucket to continue the investigation.

### Assess tab: why an issue triggered[​](#assess-tab-why-an-issue-triggered)
The **Assess** tab explains why an issue was created. It is part of the **AI Runtime → Issues** view (see [AI Runtime](/_docs/docs/applications/ai_gateway#issues)) and appears when the issue has a trigger reason or supporting evidence to show. The AI Investigation per-event Assess view (below) presents the same reason-and-evidence model, described here.

The Assess tab presents:

- **A human-readable reason** the policy fired, explaining what condition was detected.
- **Supporting context** — the specific detected values that matched, such as a PII pattern, a banned substring, or a regex match.
- **Detected values** are capped at 100 characters for display purposes.

The tab automatically chooses which combination to show based on what the runtime policy provided — reason and evidence, reason only, or evidence only.

#### Intent-misalignment issues[​](#intent-misalignment-issues)
Issues from Intent-Based Access Control policies render a different panel on the Assess tab. Instead of the generic trigger reason and evidence model, these issues show a side-by-side comparison of:

- **Request Scope** — the declared or intended scope of the request
- **Observed Action Scope** — the scope of actions actually observed at runtime. This column is hidden when the issue has no observed-action tags.
- **Reason for Mismatch** — an explanation of why the observed actions did not align with the declared intent. It appears only when a reason is available.

This variant helps teams understand when runtime tool usage, data access, or other actions diverged from what the request originally declared or intended.

### Issue lifecycle[​](#issue-lifecycle)
After review, an issue can be closed and marked according to your investigation outcome. If a new related alert fires later, the issue is reopened so you can review the new activity. This keeps issue history continuous while still making it clear that something new occurred.

## Quarantines[​](#quarantines)
The Quarantines page lets you review and manage quarantines created when Session or Monitoring policies fire. A quarantine is an investigation action that blocks subsequent requests matching a quarantined identity or session attribute for a defined period. Unlike the inline AI Runtime guardrails that evaluate individual request content, a quarantine targets requests based on who or what initiated them — such as a specific user email, user IP, session, or application.

### What a quarantine is and how it is created[​](#what-a-quarantine-is-and-how-it-is-created)
Quarantines are created automatically by the system when a Session or Monitoring policy fires. The policy evaluates runtime behavior according to configured conditions, and when a threshold is crossed, the system creates a time-boxed quarantine targeting the identity or session attribute configured in that policy. The quarantine remains active for the specified duration unless you make it permanent or lift it manually.

The quarantine detail shows **Created by: System (triggered by runtime policy)** to reflect this automatic origin.

### Quarantines list[​](#quarantines-list)
The Quarantines page displays all active and historical quarantines for the selected AI System.

The list includes the following columns:

- **Resource** — the AI System affected by the quarantine.
- **Status** — **Active** (currently blocking), **Inactive** (expired or lifted), or **Permanent** (no expiration; blocks until manually removed).
- **Scope** — **Resource-wide** (affects all requests to the resource), or a specific attribute type and value (such as User Email + a specific address). A quarantine scoped to an identity attribute blocks only requests where that attribute matches the quarantined value.
- **Trigger** — the detection that caused the quarantine to be created. Trigger types include **PII**, **Prompt Injection Detection**, **Prevent Leakage**, **Prevent Jailbreak**, **Prohibit Topics**, **Prevent Toxicity Rule**, **Prevent Obfuscated Content**, and **Prevent Encoded Attribute Exfiltration**.
- **Started** — when the quarantine began.
- **Ends** — when the quarantine expires, or **No Expiration** for permanent quarantines. Quarantines approaching expiration show a visual indicator.
- **Blocked** — the count of requests blocked by the quarantine.

By default, the list shows only **Active** and **Permanent** quarantines. Use the **Show Inactive Quarantines** toggle to include expired and lifted quarantines in the view.

You can search quarantines by resource, attribute value, or trigger, and apply filters by **Resource**, **Attribute Type**, or **Attribute Value**. The list supports paginated export so you can download quarantine history for operational review or external follow-up.

### Quarantine detail[​](#quarantine-detail)
Opening a quarantine shows a detail drawer with two tabs: **Info** and **Blocked Requests**.

#### Info tab[​](#info-tab)
The Info tab provides context about the quarantine:

- **Trigger Event** — the policy and event that caused the quarantine to be created.
- **Related Issue** — the AI Investigation issue associated with the triggering alert, including rule, date, severity, and status. You can navigate directly to the issue for further investigation.
- **Lifecycle** — quarantine metadata:

**Started** — when the quarantine began blocking requests.
- **Ends** — the expiration time for time-boxed quarantines, or **No Expiration** for permanent ones.
- **Duration / TTL** — the original duration configured by the policy (for time-boxed quarantines) or an indication that the quarantine is permanent.
- **Created by** — **System (triggered by runtime policy)**.

#### Blocked Requests tab[​](#blocked-requests-tab)
The Blocked Requests tab shows the requests that were blocked by this quarantine. The summary displays the request count, session count, and unique user count affected by the quarantine:

**N requests across M sessions · K users identified**

Each request is shown with its timestamp, user, and a **View Request** link that opens the full session view for that request. This makes it easy to review exactly what was blocked and understand the session context that led to each blocked request.

### Quarantine actions[​](#quarantine-actions)
You can take two actions on a quarantine from the list or detail drawer:

- **Make Permanent** — removes the time-box (TTL) so the quarantine continues blocking matching requests indefinitely until you manually remove it. This action is available for active time-boxed quarantines but is disabled for resource-wide quarantines, quarantines that are already permanent, and inactive quarantines.
- **Lift Quarantine** — revokes the quarantine, making it inactive. Matching requests will no longer be blocked. This change can take up to 10 minutes to fully propagate, so subsequent requests may still be blocked during that window. This action is disabled for resource-wide quarantines and quarantines that are already inactive.

These actions give you fine-grained control over how long a quarantine remains in effect based on your investigation findings.

### Quarantine scope and identity attributes[​](#quarantine-scope-and-identity-attributes)
A quarantine can be scoped to a specific identity or session attribute, or applied resource-wide. When scoped to an attribute, only requests where that attribute matches the quarantined value are blocked. The available attribute types are:

- **User IP**
- **User Email**
- **User Role**
- **User ID**
- **Session ID**
- **Application Name**
- **Application ID**
- **Application Version**
- **User Privileges**

For Session policies, the **Session ID** attribute is not available because the quarantine action targets identities that can be tracked across sessions.

## Sessions[​](#sessions)
The Sessions page reconstructs runtime activity into a full session or conversation view. This is one of the richest investigation surfaces in AI Investigation because it shows how individual runtime events connect to each other over time.

For many investigations, context is everything. A single blocked request or suspicious tool call may not mean much by itself. The Sessions page helps you understand the broader interaction that led to it.

### What the Sessions page shows[​](#what-the-sessions-page-shows)
The Sessions page presents linked runtime activity as a waterfall of events, including LLM requests and tool calls. You can select an event within the session and inspect the detailed activity beneath the timeline.

This makes it possible to see:

- the order of events
- how long each step took
- where policy violations occurred
- what actions were taken by AI Runtime
- how prompts, tools, and model responses interacted across the session.

This is especially valuable for agentic and tool-using systems, where a single outcome often depends on multiple linked turns and tool interactions.

### Session requirements[​](#session-requirements)
Sessions are created only when the request includes a client-provided `user_session_id`. This identifier is used to link distinct events into a shared session. Without it, events can still be investigated individually, but they will not be reconstructed into the same session-level conversation view.

### Session timeline and event waterfall[​](#session-timeline-and-event-waterfall)
The session waterfall helps investigators see the full execution flow. It shows the sequencing and duration of different event types, such as LLM events and tool calls, and it highlights policy violations where they occurred. This makes it easier to understand not just what happened, but in what order and with what timing. The screenshot illustrates linked LLM and tool events laid out across time with a dedicated detail pane below.

### Event detail within a session[​](#event-detail-within-a-session)
When you select an event in the session timeline, the lower panel provides detailed evidence about that step in the interaction.

Depending on the event, this can include:

- user input
- assistant output
- tools available to the model
- tools actually called
- tool call arguments
- policy violations detected
- runtime actions taken
- modified versus original content where applicable.

When a runtime policy changes a field, AI Investigation can show the raw and modified values side by side so you can understand exactly how the platform intervened.

**Assess tab (per-event).** Each event's detail includes an Assess tab when policy violations are present. The tab shows one collapsible section per policy that fired, labeled **Triggered by [policy name]**. Each section presents the same trigger reason and supporting evidence described in [Assess tab: why an issue triggered](#assess-tab-why-an-issue-triggered). All sections are expanded by default so you can quickly review why each policy fired on that event. Intent-Based Access Control violations do not appear here — they render on the event's **Intent** tab instead.

### Why session context matters[​](#why-session-context-matters)
The Sessions page is ideal for investigations that require more than a single request view.

Use it when you need to answer questions like:

- What happened before this tool call?
- Which tools were available to the model when it made this choice?
- How did the tool's output affect the next turn?
- Where in the session did a guardrail intervene?
- Was this an isolated prompt or part of a broader interaction pattern?

### Session filtering[​](#session-filtering)
You can filter sessions by time range and investigate specific slices of activity. The page also supports filtering by resource, model, user metadata, application metadata, and usage characteristics so teams can isolate sessions of interest quickly and focus on the conditions most relevant to the investigation.

### Session policies[​](#session-policies)
Session and monitoring policies are now created, reviewed, and managed from the [AI Runtime Policies page](/_docs/docs/applications/ai_gateway) (AI Runtime → Policies, **Session Policies** tab). This gives you a single location for configuring all runtime controls. Session-level policies can generate AI Investigation alerts and issues. When a session policy fires, the resulting alert flows through the same Issues workflow as scanner-based and performance alerts, so session-level conditions show up alongside other quality and performance issues for the affected AI System. Monitoring policies also live on the AI Runtime Policies page as a **Monitoring Policies** tab.

Session policies support a **quarantine action** in addition to alert and block actions. When configuring a quarantine action, you choose an identity attribute to quarantine (such as User Email, User IP, or Application Name) and set a duration. The **Session ID** attribute is not available for quarantine actions on Session policies because quarantines are designed to track identities across sessions. If a quarantine action is configured but no identity attribute is chosen, the policy fires an alert but does not create a quarantine. For more detail on how quarantines work and how to manage them, see [Quarantines](#quarantines).

For more information on configuring session-level conditions, see [Session Policies](/_docs/docs/applications/ai_monitor/session_policies).

## Events[​](#events)
The Events page complements Sessions by showing every recorded runtime event in chronological order. The menu label for this page is **Events**, and it surfaces both **Prompt Events** (model requests and responses) and **Access Events** (access-related runtime activity).

Where Sessions emphasize context across related events, Events emphasize fast inspection of individual requests.

### What the Events page shows[​](#what-the-events-page-shows)
Each row on the Events page represents a single runtime event. The page provides a chronological stream of activity and typically includes:

- input
- output
- AI System or resource
- tags assigned by the system
- event time
- indicators for policy actions such as blocked or modified.

This makes the Events page a strong starting point when you want to inspect recent activity quickly or locate a specific request.

### Event detail[​](#event-detail)
From the Events page, you can open a detailed view for a specific request.

This detailed view can expose:

- the full prompt and response
- available tools and tool schemas
- tool call arguments
- tool responses
- latency and token-related metadata
- runtime policy violations
- actions taken by the platform
- for events flagged by an alert rule, the amount by which the observed value exceeded the configured threshold for that rule.

This makes the Events page especially useful when you already know which request you care about and want to inspect its evidence directly.

### Relationship between Events and Sessions[​](#relationship-between-events-and-sessions)
These two pages are complementary:

- **Events** are best when you want to inspect a specific request quickly.
- **Sessions** are best when you need to understand the broader context around that request.

In practice, you will often move between them during an investigation.

## Reports[​](#reports)
The Reports page lets you export AI Investigation issue history for operational review, documentation, or external follow-up.

The reporting behavior is consistent with issue exports elsewhere in the platform, which helps make the workflow familiar and easy to adopt.

## Common investigation workflows[​](#common-investigation-workflows)
### Investigate a spike in scanner detections[​](#investigate-a-spike-in-scanner-detections)
Start in the Dashboard, review the Quality Metrics graphs, identify the interval where the spike occurred, drill down into that time range, and inspect the underlying requests and tags to understand what changed.

### Investigate a latency or token spike[​](#investigate-a-latency-or-token-spike)
Open the Performance Metrics view or an issue generated from a performance alert, review the observed value and threshold comparison, then open the request data for the relevant interval to identify the requests that drove the spike.

### Investigate agent or tool behavior[​](#investigate-agent-or-tool-behavior)
Use the Events or Sessions page to inspect a request involving tool usage, then move into the session timeline to understand available tools, tool calls, arguments, tool responses, and the runtime actions that followed.

### Review alert-driven issues[​](#review-alert-driven-issues)
Open the Issues page to see unresolved conditions, prioritize by severity, review alert instances in the issue detail drawer, and drill into the exact time interval that triggered the issue. Use the **Assess** tab on an issue to understand the trigger reason and supporting evidence. For end-to-end operational guidance, see the [AI Investigation Handbook](/_docs/docs/handbooks/ai_investigation_handbook).

### Review and act on a quarantine[​](#review-and-act-on-a-quarantine)
Open the Quarantines page, select the quarantine you want to review, and open its detail drawer. Review the Trigger Event to understand what caused the quarantine, examine the Related Issue for additional context, and check the Blocked Requests tab to see what was blocked and who was affected. Based on your investigation, either **Lift Quarantine** to revoke it, or **Make Permanent** to remove the time limit and keep the quarantine active indefinitely.

## Best practices[​](#best-practices)
To get the most value from AI Investigation:

- Send a stable `user_session_id` if you want rich session reconstruction.
- Enable the AI Runtime policies you care about, since quality graphs are driven by enabled scanner outcomes. See [AI Runtime](/_docs/docs/applications/ai_gateway) for configuring policies and scanners.
- Use alerts to turn important quality and performance changes into actionable workflows.
- Start broad with dashboard trends, then drill into evidence through issues, events, and sessions.
- Use Sessions for context and Events for fast request-level inspection.
- Expect dashboard charts to lag real time by about five minutes — a brief gap at the leading edge is normal, not missing data.
- Set quarantine actions on Session and Monitoring policies for detections that warrant automatically holding an identity or session, then review and manage those quarantines from the Quarantines page to decide whether to lift or make them permanent.
- For a cross-system view of the same issues across your AI inventory, see [AI 360](/_docs/docs/applications/ai_360).
[PreviousAI MCP](/_docs/docs/applications/ai_mcp)[NextSession Policies](/_docs/docs/applications/ai_monitor/session_policies)- [Why AI Investigation matters](#why-ai-investigation-matters)- [How AI Investigation works](#how-ai-investigation-works)- [AI Investigation at a glance](#ai-investigation-at-a-glance)- [Dashboard](#dashboard)[AI System list and severity ranking](#ai-system-list-and-severity-ranking)- [Time range and interval controls](#time-range-and-interval-controls)- [Quality Metrics](#quality-metrics)- [Performance Metrics](#performance-metrics)- [Alert settings](#alert-settings)- [Issues](#issues)[Quality Issues and Performance Issues](#quality-issues-and-performance-issues)- [How issues work](#how-issues-work)- [Issue detail](#issue-detail)- [Assess tab: why an issue triggered](#assess-tab-why-an-issue-triggered)- [Issue lifecycle](#issue-lifecycle)- [Quarantines](#quarantines)[What a quarantine is and how it is created](#what-a-quarantine-is-and-how-it-is-created)- [Quarantines list](#quarantines-list)- [Quarantine detail](#quarantine-detail)- [Quarantine actions](#quarantine-actions)- [Quarantine scope and identity attributes](#quarantine-scope-and-identity-attributes)- [Sessions](#sessions)[What the Sessions page shows](#what-the-sessions-page-shows)- [Session requirements](#session-requirements)- [Session timeline and event waterfall](#session-timeline-and-event-waterfall)- [Event detail within a session](#event-detail-within-a-session)- [Why session context matters](#why-session-context-matters)- [Session filtering](#session-filtering)- [Session policies](#session-policies)- [Events](#events)[What the Events page shows](#what-the-events-page-shows)- [Event detail](#event-detail)- [Relationship between Events and Sessions](#relationship-between-events-and-sessions)- [Reports](#reports)- [Common investigation workflows](#common-investigation-workflows)[Investigate a spike in scanner detections](#investigate-a-spike-in-scanner-detections)- [Investigate a latency or token spike](#investigate-a-latency-or-token-spike)- [Investigate agent or tool behavior](#investigate-agent-or-tool-behavior)- [Review alert-driven issues](#review-alert-driven-issues)- [Review and act on a quarantine](#review-and-act-on-a-quarantine)- [Best practices](#best-practices)
