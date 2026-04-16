---
title: AI Investigation
url: https://playground.alltrue-be.com/_docs/docs/applications/ai_monitor
section: applications
---

# AI Investigation

- [](/_docs/)- Applications- AI InvestigationOn this page# AI Investigation
AI Investigation is the platform's central hub for runtime visibility, investigation, and evidence. It gives AI Security and Governance teams a clear view into how AI systems are actually being used by capturing and organizing the full runtime story: trends over time, fired alerts, individual events, complete sessions, prompts, responses, tool activity, policy outcomes, and performance behavior.

This is what turns runtime protection from a black box into something teams can actually trust, review, and prove. Instead of only knowing that a policy exists, users can see what happened, which requests were risky, which sessions were affected, what tools were available or called, how the system responded, and how runtime protections intervened. That makes AI Investigation valuable not only for threat detection and incident response, but also for demonstrating the kinds of logging, observability, traceability, explainability, and runtime oversight expected across many security, governance, and compliance frameworks.

AI Investigation helps teams answer questions such as:

- Are jailbreak attempts increasing for a specific AI System?
- Is sensitive data appearing more often in prompts or responses?
- Which exact requests triggered an alert?
- What happened in the full session that led to this event?
- Which tools were available, which were called, and what arguments were passed?
- Was content blocked, modified, tokenized, or otherwise changed by runtime protections?
- Did latency, token usage, or session behavior spike for a particular workflow?

Unlike a simple monitoring dashboard, AI Investigation supports the full investigation workflow. Users can start from a trend, alert, or issue and drill all the way down to the underlying events and sessions that explain what happened. They can review activity at the system level, inspect individual requests in chronological order, and reconstruct full conversations or agent flows in context. The result is a practical system of record for runtime AI activity that helps organizations detect risk faster, investigate with confidence, and maintain evidence of control effectiveness over time.

## Why AI Investigation matters[​](#why-ai-investigation-matters)
AI systems are dynamic, and risk does not end once a runtime policy is enabled. Teams need to understand not only whether protections are configured, but how the system is behaving in practice: what users are sending, how models are responding, how tools are being used, whether policies are firing, and whether operational patterns are changing over time.

AI Investigation gives organizations a structured way to do that. It provides visibility into runtime quality and safety trends, operational insight into performance and usage patterns, alert-driven workflows for triaging abnormal behavior, and detailed session- and event-level evidence for investigation and review.

For AI Security teams, this means faster detection and investigation of risky runtime behavior. For Governance teams, it provides a concrete record of runtime oversight and control operation. For platform and engineering teams, it provides the detail needed to troubleshoot latency spikes, token anomalies, and unusual system behavior. In short, AI Investigation helps teams move from "something seems wrong" to "here is exactly what happened."

## How AI Investigation works[​](#how-ai-investigation-works)
AI Investigation is powered by data collected at the Runtime Protection layer. As requests pass through the platform, the system records two main categories of information.

**Quality outcomes**
Enabled runtime policies evaluate requests and responses and assign outcome tags based on what they detect. These outcomes power the quality-related charts, alerting, and investigation workflows.

**Performance telemetry**
The platform also records operational data such as latency, tool calls per session, and token usage. These metrics support performance analysis, anomaly review, and cost-related investigation workflows.

AI Investigation uses aggregated data for dashboard-style views and supports drill-down into the underlying request data when deeper analysis is needed. Everything in AI Investigation is scoped to the selected AI System and hierarchy, so the charts, alerts, issues, sessions, and events shown for a resource reflect the runtime data collected for that specific system.

## AI Investigation at a glance[​](#ai-investigation-at-a-glance)
AI Investigation is organized into five main areas:

- **Dashboard** — Monitor quality and performance over time, configure alerts, and drill into suspicious intervals.
- **Sessions** — Reconstruct end-to-end AI interactions to understand prompts, tool activity, responses, and policy actions in context.
- **Events** — Inspect individual runtime events.
- **Issues** — Review alert-driven issues, prioritize investigation, and track resolution.
- **Reports** — Export AI Investigation issue history for review and follow-up.

Together, these areas support a typical investigation workflow: detect a change, review the generated issue, drill into the exact events, examine activity in session context if needed, and export or share the results.

# Dashboard
The Dashboard is the main entry point for monitoring activity across your AI Systems. It provides a high-level view of runtime quality signals and operational performance so users can quickly identify changes that may require investigation.

The dashboard is organized around a selected AI System. Users choose a time range, review the systems in scope, select the one they want to investigate, and then explore the relevant quality and performance data for that system.

## AI System list and severity ranking[​](#ai-system-list-and-severity-ranking)
The left panel displays AI Systems within the selected scope. These systems are ranked by severity, allowing users to focus first on the systems with the most urgent open conditions. Severity is driven by the alerts and issues that remain open for the selected AI System. This makes the dashboard immediately useful as a prioritization surface, not just a reporting view.

When a user selects an AI System, the main dashboard updates to show the relevant metrics, charts, and alert settings for that system.

## **Time range and interval controls**[​](#time-range-and-interval-controls)
The dashboard supports time-based analysis, allowing users to review activity over a selected time range and adjust the level of detail they want to see.

For each metric, the user can view data across different time granularities. AI Investigation supports broader trend analysis as well as interval-level investigation. This helps users move naturally from "something changed" to "this is exactly when it happened."

## **Quality Metrics**[​](#quality-metrics)
The **Quality Metrics** tab shows scanner-based metrics derived from runtime protection outcomes. The set of graphs shown here depends on which runtime scanners are enabled for the selected AI System. If a scanner is not enabled in runtime protection, data for that scanner will not appear in AI Investigation.

Each graph shows how that scanner's classifications changed over time. For a given scanner, the chart can include:

- counts for each outcome category
- a rate line showing the percentage of "bad" outcomes over time
- a 30-day average line to provide historical baseline context.

For example, a PII scanner graph can show how many requests contained PII versus how many did not, along with the overall rate of PII detections and how that rate compares to the recent baseline.

These views help users answer questions such as:

- Is this scanner triggering more often than usual?
- Did a spike occur during a specific period?
- Is this behavior isolated or part of a larger trend?

### **Quality metric drill-down**[​](#quality-metric-drill-down)
Quality metrics are designed to support investigation, not just visualization.

A user can start at a broader view, identify a suspicious time interval, and then drill into narrower windows to understand what caused the spike. Once they reach the most detailed level, they can open the event data for that interval and review the individual requests and tags associated with it.

This lets users move directly from a trend line to the underlying evidence.

## **Performance Metrics**[​](#performance-metrics)
The **Performance Metrics** tab focuses on operational behavior rather than scanner classifications. It helps users investigate system health, usage patterns, latency changes, token growth, and session-level behavior. The expanded metrics coverage includes both request-level and session-level metrics.

Examples of performance-related metrics include:

- latency
- prompt, completion, context, and total token counts
- requests per session
- tokens per session
- tool calls per session
- other per-request and per-session runtime metrics.

These graphs can emphasize statistical views such as mean, median, P50, P95, max, and related summaries, depending on the metric. This makes it possible to investigate not just average behavior, but also tail behavior such as latency spikes or unusually expensive request patterns.

Performance Metrics are especially useful for questions like:

- When did latency spike?
- Are tokens per request or per session increasing?
- Are there signs of abnormal or costly behavior?
- Is operational performance degrading for a specific AI System?

### **Performance metric drill-down**[​](#performance-metric-drill-down)
Performance metrics support the same investigative pattern as quality metrics: users can identify a suspicious interval and then open the underlying request data for that time window.

In a performance investigation, the detailed view focuses on the metric that triggered concern. For example:

- a latency investigation emphasizes latency values per request
- a token investigation emphasizes prompt, context, completion, or total tokens
- a session investigation emphasizes session-level usage patterns.

This helps users quickly isolate the requests that contributed most to the spike they are reviewing.

## **Alert settings**[​](#alert-settings)
AI Investigation supports alerting directly from dashboard metrics so users can be notified when behavior moves outside an acceptable range.

Users can configure alerts for scanners and metrics using controls such as:

- time interval
- threshold type
- threshold value
- severity
- direction, where applicable
- multiple rules for the same scanner or metric.

Supported threshold models include:

- **Absolute thresholds**, where a metric or rate must exceed a fixed configured value
- **Relative thresholds**, where a metric or rate is compared to its 30-day average baseline and fires when the configured change threshold is exceeded.

Alerts are evaluated after the relevant interval window completes, which makes them near real-time while still allowing the platform to assess the full bucket accurately. The design also includes automatic silencing behavior to avoid repeatedly generating duplicate alerts for the same ongoing spike.

# **Issues**
The Issues page turns alerts into a practical operational workflow.

Rather than generating isolated notifications, AI Investigation groups related alerts into issues so teams can triage, track, and resolve conditions over time. This makes the feature much more useful for ongoing operations because users can see repeated or recurring problems as part of a single investigation history.

## **Quality Issues and Performance Issues**[​](#quality-issues-and-performance-issues)
Issues are separated into **Quality Issues** and **Performance Issues**.

This separation helps users distinguish between:

- content, safety, or control-related concerns
- operational, performance, or usage-related concerns

A spike in prompt injection detections and a spike in latency are both important, but they typically involve different reviewers, different workflows, and different next steps.

## **How issues work**[​](#how-issues-work)
Each issue represents an underlying alert condition for a specific AI System and context. When a new alert fires for the same issue grouping, AI Investigation updates the existing issue rather than creating a completely new one each time. If the issue was previously closed and a new related alert fires, the issue is reopened.

This gives users a much cleaner investigation history:

- one issue tracks the broader condition
- each alert becomes an instance attached to that issue
- the issue can be reviewed, closed, and later reopened if the condition returns

## **Issue detail**[​](#issue-detail)
Opening an issue shows the alert instances associated with it. This helps users understand:

- when the alerts fired
- what value triggered the alert
- how that value compared to the configured threshold
- how many alert instances are attached to the issue
- where to click to investigate the exact interval that triggered it.

From here, the user can jump directly into the detailed event data for the exact time bucket and continue the investigation.

## **Issue lifecycle**[​](#issue-lifecycle)
After review, an issue can be closed and marked according to the user's investigation outcome. If a new related alert fires later, the issue is reopened so the user can review the new activity. This keeps issue history continuous while still making it clear that something new occurred.

# **Sessions**
The Sessions page reconstructs runtime activity into a full session or conversation view. This is one of the richest investigation surfaces in AI Investigation because it shows how individual runtime events connect to each other over time.

For many investigations, context is everything. A single blocked request or suspicious tool call may not mean much by itself. The Sessions page helps users understand the broader interaction that led to it.

## **What the Sessions page shows**[​](#what-the-sessions-page-shows)
The Sessions page presents linked runtime activity as a waterfall of events, including LLM requests and tool calls. Users can select an event within the session and inspect the detailed activity beneath the timeline.

This makes it possible to see:

- the order of events
- how long each step took
- where policy violations occurred
- what actions were taken by runtime protections
- how prompts, tools, and model responses interacted across the session

This is especially valuable for agentic and tool-using systems, where a single outcome often depends on multiple linked turns and tool interactions.

## **Session requirements**[​](#session-requirements)
Sessions are created only when the request includes a client-provided `user_session_id`. This identifier is used to link distinct events into a shared session. Without it, events can still be investigated individually, but they will not be reconstructed into the same session-level conversation view.

## **Session timeline and event waterfall**[​](#session-timeline-and-event-waterfall)
The session waterfall helps investigators see the full execution flow. It shows the sequencing and duration of different event types, such as LLM events and tool calls, and it highlights policy violations where they occurred. This makes it easier to understand not just what happened, but in what order and with what timing. The screenshot illustrates linked LLM and tool events laid out across time with a dedicated detail pane below.

## **Event detail within a session**[​](#event-detail-within-a-session)
When a user selects an event in the session timeline, the lower panel provides detailed evidence about that step in the interaction.

Depending on the event, this can include:

- user input
- assistant output
- tools available to the model
- tools actually called
- tool call arguments
- policy violations detected
- runtime actions taken
- modified versus original content where applicable

When a runtime policy changes a field, AI Investigation can show the raw and modified values side by side so users can understand exactly how the platform intervened.

## **Why session context matters**[​](#why-session-context-matters)
The Sessions page is ideal for investigations that require more than a single request view.

Use it when you need to answer questions like:

- What happened before this tool call?
- Which tools were available to the model when it made this choice?
- How did the tool's output affect the next turn?
- Where in the session did a guardrail intervene?
- Was this an isolated prompt or part of a broader interaction pattern?

## **Session filtering**[​](#session-filtering)
Users can filter sessions by time range and investigate specific slices of activity. The feature also includes filtering by resource, model, user metadata, application metadata, and usage characteristics so teams can isolate sessions of interest quickly and focus on the conditions most relevant to the investigation.

# **Events**
The Events page complements Sessions by showing every recorded runtime event in chronological order.

Where Sessions emphasize context across related events, Events emphasize fast inspection of individual requests.

## **What the Events page shows**[​](#what-the-events-page-shows)
Each row on the Events page represents a single runtime event. The page provides a chronological stream of activity and typically includes:

- input
- output
- AI System or resource
- tags assigned by the system
- event time
- indicators for policy actions such as blocked or modified

This makes the Events page a strong starting point when a user wants to inspect recent activity quickly or locate a specific request.

## **Event detail**[​](#event-detail)
From the Events page, users can open a detailed view for a specific request.

This detailed view can expose:

- the full prompt and response
- available tools and tool schemas
- tool call arguments
- tool responses
- latency and token-related metadata
- runtime policy violations
- actions taken by the platform

This makes the Events page especially useful when the user already knows which request they care about and wants to inspect its evidence directly.

## **Relationship between Events and Sessions**[​](#relationship-between-events-and-sessions)
These two pages are complementary:

- **Events** are best when the user wants to inspect a specific request quickly
- **Sessions** are best when the user needs to understand the broader context around that request

In practice, users often move between them during an investigation.

# **Reports**
The Reports page allows users to export AI Investigation issue history for operational review, documentation, or external follow-up.

The reporting behavior is consistent with issue exports elsewhere in the platform, which helps make the workflow familiar and easy to adopt.

# **Common investigation workflows**
## **Investigate a spike in scanner detections**[​](#investigate-a-spike-in-scanner-detections)
Start in the Dashboard, review the Quality Metrics graphs, identify the interval where the spike occurred, drill down into that time range, and inspect the underlying requests and tags to understand what changed.

## **Investigate a latency or token spike**[​](#investigate-a-latency-or-token-spike)
Open the Performance Metrics view or an issue generated from a performance alert, review the observed value and threshold comparison, then open the request data for the relevant interval to identify the requests that drove the spike.

## **Investigate agent or tool behavior**[​](#investigate-agent-or-tool-behavior)
Use the Events or Sessions page to inspect a request involving tool usage, then move into the session timeline to understand available tools, tool calls, arguments, tool responses, and the runtime actions that followed.

## **Review alert-driven issues**[​](#review-alert-driven-issues)
Open the Issues page to see unresolved conditions, prioritize by severity, review alert instances in the issue detail drawer, and drill into the exact time interval that triggered the issue.

# **Best practices**
To get the most value from AI Investigation:

- Send a stable `user_session_id` if you want rich session reconstruction.
- Enable the runtime protection policies you care about, since quality graphs are driven by enabled scanner outcomes.
- Use alerts to turn important quality and performance changes into actionable workflows.
- Start broad with dashboard trends, then drill into evidence through issues, events, and sessions.
- Use Sessions for context and Events for fast request-level inspection.

# **Summary**
AI Investigation is the platform's runtime investigation and operational assurance layer. It helps teams monitor quality and performance, detect abnormal behavior, triage issues, and inspect the exact evidence behind runtime activity. By combining trends, alerts, issues, sessions, and event-level evidence in one place, it gives users a practical way to understand what happened and respond with confidence.
[PreviousAI MCP](/_docs/docs/applications/ai_mcp)[NextAI Compliance](/_docs/docs/applications/ai_compliance)- [Why AI Investigation matters](#why-ai-investigation-matters)- [How AI Investigation works](#how-ai-investigation-works)- [AI Investigation at a glance](#ai-investigation-at-a-glance)- [AI System list and severity ranking](#ai-system-list-and-severity-ranking)- [**Time range and interval controls**](#time-range-and-interval-controls)- [**Quality Metrics**](#quality-metrics)[**Quality metric drill-down**](#quality-metric-drill-down)- [**Performance Metrics**](#performance-metrics)[**Performance metric drill-down**](#performance-metric-drill-down)- [**Alert settings**](#alert-settings)- [**Quality Issues and Performance Issues**](#quality-issues-and-performance-issues)- [**How issues work**](#how-issues-work)- [**Issue detail**](#issue-detail)- [**Issue lifecycle**](#issue-lifecycle)- [**What the Sessions page shows**](#what-the-sessions-page-shows)- [**Session requirements**](#session-requirements)- [**Session timeline and event waterfall**](#session-timeline-and-event-waterfall)- [**Event detail within a session**](#event-detail-within-a-session)- [**Why session context matters**](#why-session-context-matters)- [**Session filtering**](#session-filtering)- [**What the Events page shows**](#what-the-events-page-shows)- [**Event detail**](#event-detail)- [**Relationship between Events and Sessions**](#relationship-between-events-and-sessions)- [**Investigate a spike in scanner detections**](#investigate-a-spike-in-scanner-detections)- [**Investigate a latency or token spike**](#investigate-a-latency-or-token-spike)- [**Investigate agent or tool behavior**](#investigate-agent-or-tool-behavior)- [**Review alert-driven issues**](#review-alert-driven-issues)
