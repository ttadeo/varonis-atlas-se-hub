---
title: AI Investigation Handbook
url: https://prod.alltrue-be.com/_docs/docs/handbooks/ai_investigation_handbook
section: handbooks
---

# AI Investigation Handbook

- [](/_docs/)- Handbooks- AI Investigation HandbookExport PDFOn this page# AI Investigation Handbook
A practical runbook for teams using Atlas to monitor, investigate, and respond to runtime AI activity.

AI Investigation is the operational layer that turns runtime AI traffic into something your teams can actually review, understand, and act on. It combines trends, alerts, issues, individual events, and full session context so you can move from "something changed" to "here is exactly what happened." It is valuable for security, governance, and platform operations alike because it provides structured visibility into runtime behavior, policy outcomes, performance, and user experience.

This handbook explains how to use AI Investigation as an ongoing operational practice.

## What this handbook is for[​](#what-this-handbook-is-for)
This handbook is for teams that want to use AI Investigation to:

- detect risky or abnormal runtime AI activity
- investigate issues across prompts, responses, tools, and sessions
- monitor answer quality, sentiment, and user experience over time
- identify operational problems such as latency spikes and token growth
- validate that runtime protections are working as expected
- maintain evidence of runtime oversight, review, and control operation

AI Investigation supports these use cases by combining runtime protection policy (scanner) outcomes, performance telemetry, alerts, issues, events, and session-level reconstruction in one place. Quality metrics are driven by enabled runtime scanners, while performance metrics are driven by request- and session-level telemetry such as latency and tokens.

## Who should use it[​](#who-should-use-it)
### Security / GRC teams[​](#security--grc-teams)
Use AI Investigation to monitor prompt-based attacks, sensitive data exposure, tool misuse, policy violations, and custom risk indicators. Review issues as the operational queue for abnormal conditions, and use event and session evidence to investigate what happened and document follow-up. Monitoring spans both per-request signals (such as latency and token counts on each call) and per-session signals (such as tokens, requests, tool calls, and guardrail violations across a full conversation). This is also where you can demonstrate structured runtime oversight and explainability.

### Platform / AI infrastructure teams[​](#platform--ai-infrastructure-teams)
Use AI Investigation to understand latency, token usage, session behavior, and operational anomalies. Investigate spikes, tune alert thresholds, validate logging quality, and identify workflow patterns that degrade performance or increase cost. Coverage includes both per-request metrics (latency, prompt tokens, completion tokens, total tokens) and per-session metrics (tokens per session, requests per session, tool calls per session, guardrail violations per session).

### Application / agent developers[​](#application--agent-developers)
Use AI Investigation to understand how AI applications behave in production. Inspect prompts and responses, review how guardrails affected content, see what tools were available and called, and investigate multi-turn sessions in context. This is especially valuable when debugging agentic workflows or quality regressions that do not show up in traditional observability tools.

## Key idea: runtime protection is only half the story[​](#key-idea-runtime-protection-is-only-half-the-story)
Runtime protections help detect, block, or modify risky behavior. But you still need to know what actually happened in production.

AI Investigation provides that missing layer. It lets you:

- see trends over time
- configure alerts for important conditions
- triage repeated alerts as issues
- inspect individual events in detail
- reconstruct full sessions to understand the broader interaction context

This is what turns runtime protection from a black box into something observable, reviewable, and explainable.

## Operating model (recommended)[​](#operating-model-recommended)
Use this as the "golden path" when adopting AI Investigation.

### Step 0: Configure session policies[​](#step-0-configure-session-policies)
**Goal:** make sure findings that only make sense across a full conversation are captured before you start tuning alerts.

What to do:

- Open the AI Investigation Policies surface to review the session policy rules available to your tenant. (This surface is reachable from the AI Investigation area; there is no separate side-menu entry today.)
- Choose the hierarchy scope at which each rule should apply: Global, Organization, Project, or Endpoint. Lower scopes inherit from higher scopes by default.
- For each rule, decide whether to **Enable** or **Disable** it, set a **severity**, and choose the **action** to take when the condition fires.
- Each scope shows whether the current configuration is **Inherited** from a higher scope or has been overridden locally. Use **revert to inherited** when you want a scope to fall back to the parent configuration.
- For deeper guidance on individual rules and how scope inheritance works, see [Session Policies](/_docs/docs/applications/ai_monitor/session_policies).

Why it matters:

- Session policies surface findings that span multiple requests in a conversation — for example, escalating guardrail violations, runaway tool loops, or cumulative token growth. Tuning them up front means the first conversation-level signal that fires will be one you actually want to see.

Success criteria:

- The session policy rules that matter for each AI System are enabled at the correct scope with sensible severity and action settings.
- Overrides are deliberate; everything else stays inherited so changes at a higher scope propagate as expected.

### Step 1: Enable the right runtime protections[​](#step-1-enable-the-right-runtime-protections)
**Goal:** make sure the quality signals you care about are actually being collected.

What to do:

- Review the runtime protections enabled for each important AI System.
- Make sure the scanners you want to monitor are turned on.
- Prioritize protections based on the risks that matter most for the system, such as jailbreaks, PII, tool misuse, answer quality, or sentiment.

Why it matters:

- Quality metrics only appear when the corresponding scanner is enabled, because the graphs and alerting are driven by runtime scanner outcomes.

Success criteria:

- Critical AI Systems have the relevant scanner coverage enabled.
- Teams agree which protections matter most for each production workflow.

### Step 2: Establish a baseline in the Dashboard[​](#step-2-establish-a-baseline-in-the-dashboard)
**Goal:** understand what "normal" looks like before tuning alerts.

What to do:

- Open AI Investigation for the selected AI System.
- Review both Quality Metrics and Performance Metrics over a meaningful time range.
- Look for typical rates, normal spikes, and predictable usage patterns.
- Note which systems appear highest in severity and why.

Why it matters:

- AI Investigation is most useful when you understand the difference between expected variation and meaningful change. The dashboard supports both quality and performance views, with time-bucketed trends and baseline comparison.

Success criteria:

- You know which metrics are stable and which vary naturally.
- You can identify the most important scanners and performance metrics for each system.

### Step 3: Configure alerts for the conditions that matter[​](#step-3-configure-alerts-for-the-conditions-that-matter)
**Goal:** turn important changes into actionable issues.

AI Investigation supports three alert modes for quality and performance signals. Use the mode that matches how the underlying condition behaves.

- **Absolute threshold.** Fires when a metric crosses a fixed value (for example, "PII detections exceed 50 per 5-minute interval"). Use this when you have a known operational ceiling — error budgets, latency SLOs, or rate-of-detection limits — and you want a stable, predictable trigger.
- **Relative threshold.** Fires when a metric moves by a configured amount versus a recent baseline (for example, "Prevent Jailbreak detections rise more than 2x compared to the prior hour"). Use this when absolute numbers are noisy across systems but a meaningful change in rate is what you actually care about.
- **Adaptive anomaly detection.** Fires when the observed value falls outside an automatically-learned expected range. Each anomaly carries an **explanation**, an **expected range**, and the **observed value**, and you tune a **sensitivity** setting. Use this when a metric has natural diurnal or workload variation and a fixed threshold would either fire constantly or miss real drift.

For each alert, also set the **granularity** (the evaluation window) and **severity** (operational importance). Start with a small number of high-value alerts per AI System rather than alerting on everything.

Examples:

- PII rate exceeds a defined threshold in a 5-minute interval (absolute)
- Prevent Jailbreak detections spike relative to baseline (relative)
- P95 latency drifts outside the expected range for that workload (adaptive)
- Answer Relevance drops after a deployment (relative or adaptive)
- Negative Sentiment rises for a customer-facing assistant (relative)

Why it matters:

- AI Investigation converts repeated alert conditions into issues so you have a manageable investigation queue rather than isolated signals.

Success criteria:

- Important changes create visible issues.
- You are not overwhelmed by low-value or noisy alerts.

### Step 4: Use Issues as the triage queue[​](#step-4-use-issues-as-the-triage-queue)
**Goal:** make issue review part of the regular operating rhythm.

What to do:

- Review open Quality Issues and Performance Issues regularly.
- Prioritize issues by severity and business criticality.
- Use issue detail to understand what triggered the condition and when.
- Close issues only after investigation or deliberate disposition.

Why it matters:

- Issues group repeated alerts into a trackable workflow. If the issue recurs, it can reopen with appended alert history rather than fragmenting into disconnected records.

Success criteria:

- Issues have owners and expected review timelines.
- You use issue history to track recurring patterns over time.

### Step 5: Investigate in Events and Sessions[​](#step-5-investigate-in-events-and-sessions)
**Goal:** move from the signal to the evidence.

When an alert fires — particularly an adaptive or relative alert — work the outlier in this order:

- Start at the alert. Read the **explanation**, **expected range**, and **observed value** so you know what the system thinks changed and by how much.
- Open the relevant interval in the Dashboard or directly from the issue.
- Drill into **Events** for that window to inspect the affected requests, their prompts, responses, tags, and runtime actions.
- Pivot into **Sessions** when single-request evidence is not enough — multi-turn flows, tool loops, retries, and policy interactions usually need the full conversation timeline.
- Inspect prompts, responses, tools, tool arguments, policy outcomes, and runtime actions until you can describe the root cause in your own words.

Why it matters:

- Many incidents do not make sense from a single request alone. Session reconstruction is one of the most valuable parts of AI Investigation because it shows the full execution flow across multiple related events. Sessions are only created when the client sends a stable `user_session_id`, so important production systems should provide one.

Success criteria:

- You can explain not just which request triggered a condition, but what happened before and after it.
- Investigations consistently use Sessions when context matters.

### Step 6: Escalate material findings to AI Incidents[​](#step-6-escalate-material-findings-to-ai-incidents)
**Goal:** when an investigation reveals something material, lift it out of the operational queue and into a tracked incident with linked evidence.

What to do:

- From the **Quality Issues** queue, open the issue you want to escalate.
- Use **Create Incident** to open a new AI Incident pre-linked to this issue, or **Associate Incident** to attach the issue to an existing incident.
- Capture the supporting evidence — affected events, sessions, and policy outcomes — as part of the incident record so reviewers can follow the trail without re-running the investigation.
- Where available on Performance Issues and on session-policy-driven issues, use the same escalation flow. Treat this as the canonical handoff between operational triage and incident response.

Why it matters:

- Issues are the right surface for day-to-day triage, but they are not the right surface for cross-team incident coordination, executive visibility, or audit-grade evidence. Escalation makes that boundary explicit.

Success criteria:

- Material findings are tracked as AI Incidents with linked issue, event, and session evidence.
- Routine alerts that do not warrant escalation remain in the issues queue and are closed there.

### Step 7: Tune controls and workflows over time[​](#step-7-tune-controls-and-workflows-over-time)
**Goal:** turn investigations into system improvement.

What to do:

- Use investigation findings to refine prompts, models, tool usage, or runtime protections.
- Adjust thresholds after establishing real baselines.
- Add custom policies where built-in scanners are not enough.
- Review issue patterns periodically to identify recurring weaknesses.

Success criteria:

- You close the loop between detection and remediation.
- Runtime oversight improves over time instead of becoming a passive dashboard exercise.

## What to monitor first[​](#what-to-monitor-first)
Most teams should not start by alerting on every available policy. Start with a focused set of signals that map to meaningful outcomes.

### Security and abuse[​](#security-and-abuse)
Recommended starting points:

- Prevent Jailbreak
- Prevent Prompt Injection
- PII
- Banned Substrings
- Prohibit Topics
- SQL Injection
- Code Injection and Generation Prevention
- Prevent Encoded Attacks
- Prevent Obfuscated Attacks
- Code Leakage Prevention
- XSS Prevention

Use these when your main concern is malicious prompts, prompt-based abuse, or unsafe input/output patterns.

### Agent and tool risk[​](#agent-and-tool-risk)
Recommended starting points:

- Agent Tool Selection
- Malicious Tool Detection
- Prevent Tool Poisoning
- Prevent Prompt Injection in Tool Responses
- Prevent PII in Tools
- Prevent Prompt Leakage in Tools
- Tool Banned Substrings

Use these when your systems are agentic, use tools, or operate in environments where tool misuse could create security or data risk.

### Quality and user experience[​](#quality-and-user-experience)
Recommended starting points:

- Answer Relevance
- Satisfactory Answer
- Hallucination
- Refutation Alerting
- Context Relevance
- Sentiment

Use these when your main concern is quality drift, answer trustworthiness, or rising user frustration.

### Operational health and cost[​](#operational-health-and-cost)
Operational signals come in two flavors. Per-request metrics describe a single call; per-session metrics describe a full conversation. Track both — many cost and reliability problems are only visible at the session level.

Per-request metrics:

- `latency_ms` (mean, P95, max)
- `prompt_tokens`
- `completion_tokens`
- `total_tokens`

Per-session metrics:

- `tokens_per_session`
- `requests_per_session`
- `tool_calls_per_session`
- `guardrail_violations_per_session`

Use these when your main concern is response time, cost, system efficiency, or conversation patterns.

### Business-specific monitoring[​](#business-specific-monitoring)
Recommended starting points:

- Custom Judge policies
- Regex Match policies
- LLM-as-a-Judge tagging

Use these when your organization needs to monitor behavior that is specific to your internal standards, regulatory obligations, product requirements, or customer promises.

## How to think about the main pages[​](#how-to-think-about-the-main-pages)
### Dashboard[​](#dashboard)
Use the Dashboard to answer:

- What changed?
- When did it change?
- Which AI System looks most urgent right now?
- Is this a quality problem, performance problem, or both?

### Issues[​](#issues)
Use Issues to answer:

- What requires review now?
- Has this happened before?
- How severe is it?
- Which interval and threshold triggered the issue?

The Issues page surfaces three operational queues:

- **Quality Issues** — driven by quality-scanner alerts.
- **Performance Issues** — driven by per-request and per-session performance alerts.
- **Session-policy alerts** — findings raised by session policy rules, grouped by policy, resource, and severity.

All three queues support an open/closed toggle, and a remediated issue can reopen automatically if the underlying condition recurs — so recurring patterns stay visible rather than disappearing on close.

### Events[​](#events)
Use Events to answer:

- Which individual requests were involved?
- What did the prompt and response actually contain?
- What tags or runtime actions were assigned?

The Events page has two tabs. **Prompt Events** covers LLM request/response activity and filters by endpoint, provider, model, date range, and interaction. **Access Events** covers identity and access activity and filters by service, user, source, device, URL, IP, event type, and blocked status.

### Sessions[​](#sessions)
Use Sessions to answer:

- What happened in the full interaction?
- Which tools were available and which were called?
- What arguments were passed?
- How did the system respond across multiple turns?
- Where did runtime protections intervene?

The Sessions timeline renders both LLM request events and tool calls in order, with blocked/stripped flags, guardrail triggers, the action taken, and the duration of each step. Selecting an entry opens a detail panel that switches between LLM request detail and tool call detail; tool call detail shows the tool name, tool type, and arguments. Because the timeline reconstructs the full multi-turn context, you can review what the model saw and did across the entire conversation, not just the request that fired an alert.

### Report[​](#report)
Use Report when you need to export issue history for review, documentation, or evidence of follow-up. Export coverage today spans governance and performance issue history; session-policy-driven exports are not part of Report yet.

## Why session context matters[​](#why-session-context-matters)
Individual events are useful, but many runtime problems only make sense in context.

Session visibility is especially high value for:

- agentic systems
- multi-turn assistants
- tool-using workflows
- investigations involving retries, escalation, or user frustration
- explaining how a policy action affected the broader conversation

A single flagged request might show that something unusual happened. A session can show why it happened, what led to it, and whether it was isolated or part of a larger pattern.

For that reason, the handbook's default recommendation is: **start from Dashboard or Issues, inspect the relevant Events, then move into Sessions when context matters.**

## Common scenarios and what to do[​](#common-scenarios-and-what-to-do)
### Scenario A: jailbreak attempts suddenly increase[​](#scenario-a-jailbreak-attempts-suddenly-increase)
**What it means:** the system may be receiving adversarial prompts, unsafe user experimentation, or a burst of malicious activity.

What to look at:

- Prevent Jailbreak trend
- relevant issue severity and timing
- affected events in the interval
- sessions linked to those events

Do this:

- Open the Dashboard and identify the spike interval.
- Drill into Events for that window.
- Inspect the flagged prompts.
- Open Sessions to determine whether this was isolated or part of a broader interaction pattern.
- Confirm whether runtime protections blocked all attempts, controlling the activity.

What success looks like: you can identify the source workflow or interaction pattern, know whether the protections worked as intended, and decide whether to tighten controls or treat the event as expected testing.

### Scenario B: PII starts appearing more often in prompts or outputs[​](#scenario-b-pii-starts-appearing-more-often-in-prompts-or-outputs)
**What it means:** sensitive data may be entering the system through end users, tools, or model output in a way that requires review.

What to look at:

- PII metric
- whether the condition occurred on input or output
- events in the affected interval
- sessions involving the flagged requests
- tool-related policies if tools may be involved

Do this:

- Review the PII graph and identify the interval where the rate changed.
- Drill into Events to review the exact prompts or outputs involved.
- Use Sessions to understand whether the PII originated from end-user input, model output, or tool usage.
- Determine whether the exposure was expected, acceptable, or a policy breach.

What success looks like: you understand where the sensitive data came from, can explain whether protections triggered as expected, and have evidence of review and follow-up.

### Scenario C: answer quality drops after a model, prompt, or retrieval change[​](#scenario-c-answer-quality-drops-after-a-model-prompt-or-retrieval-change)
**What it means:** the system may still be operational, but end users may be receiving less relevant, less useful, or lower-confidence answers after a deployment or configuration change.

What to look at:

- Answer Relevance
- Satisfactory Answer
- Refutation Alerting

Do this:

- Compare quality metrics before and after the suspected change window.
- Review whether **Answer Relevance** or **Satisfactory Answer** worsened during the affected period.
- Review **Refutation Alerting** to see whether the assistant also began refusing more often than expected, which can happen after a model, prompt, policy, or retrieval change.
- Inspect flagged Events for representative examples.
- Open Sessions to understand whether the issue is tied to a particular workflow, prompt pattern, retrieval path, or tool flow.

What success looks like: you identify that quality changed even though the system remained available, can explain whether the change appears to be driven by weaker answers, more refusals, or a broader workflow problem, and have concrete examples to support remediation.

### Scenario D: end users are becoming frustrated even though the system is still responding[​](#scenario-d-end-users-are-becoming-frustrated-even-though-the-system-is-still-responding)
**What it means:** the AI System is technically working, but the experience is getting worse. End users may be receiving less helpful answers, hitting more refusals, or spending more effort to get to a useful response.

What to look at:

- Sentiment
- Satisfactory Answer
- Answer Relevance
- Refutation Alerting
- Requests per Session
- Tokens per Session

Do this:

- Review the **Sentiment** trend to identify when user experience began deteriorating.
- Compare that period against **Satisfactory Answer** and **Answer Relevance** to see whether end users are also receiving less useful answers.
- Review **Refutation Alerting** to determine whether the assistant is refusing more often during the same interval.
- Check **Requests per Session** and **Tokens per Session** to see whether end users are retrying, reformulating, or getting stuck in longer conversations.
- Open Sessions to inspect full conversations and understand whether frustration is tied to poor answers, repeated refusals, slow responses, or ineffective tool flows.

What success looks like: you identify a user experience problem before it becomes a broader adoption or trust issue, can see whether the problem appears as lower-quality answers, more refusals, or inefficient conversations, and have session-level examples that show exactly what end users experienced.

### Scenario E: the assistant is refusing more often than expected[​](#scenario-e-the-assistant-is-refusing-more-often-than-expected)
**What it means:** the assistant is producing refusal-style responses more often than expected, including in cases where the workflow would normally succeed.

What to look at:

- Refutation Alerting
- Context Relevance
- Sentiment
- Requests per Session

Do this:

- Review **Refutation Alerting** over time to identify when refusal behavior increased.
- Compare the same interval against **Context Relevance** to understand whether relevance of requests dropped at the same time.
- Review **Sentiment** to see whether the higher refusal rate is also affecting end-user experience.
- Check **Requests per Session** to determine whether end users are retrying or rephrasing after being refused.
- Open Sessions to inspect the full interaction and determine whether refusals are isolated, repeated, or tied to a particular workflow step, tool dependency, or prompt type.

What success looks like: you detect when the assistant has become overly restrictive, can determine whether the refusals are expected, policy-driven, or a sign of degraded usefulness, and have clear examples that support tuning prompts, policies, tools, or model behavior.

### Scenario F: tool misuse or agent overreach appears in runtime activity[​](#scenario-f-tool-misuse-or-agent-overreach-appears-in-runtime-activity)
**What it means:** an agent may be selecting risky tools, seeing tools it should not have, or processing unsafe tool inputs or responses.

What to look at:

- Agent Tool Selection
- Malicious Tool Detection
- Prevent Tool Poisoning
- Prevent Prompt Injection in Tool Responses
- Prevent PII in Tools
- Sessions waterfall
- Tool calls per session

Do this:

- Start from the relevant issue or event.
- Open the event detail to see the specific tool-related tags or actions.
- Move into Sessions to inspect the full tool flow.
- Review which tools were available, which were called, what arguments were sent, and how the platform intervened.
- Confirm whether the behavior was expected, misconfigured, or suspicious.

What success looks like: you can reconstruct the full tool-related interaction, know whether the agent attempted something unsafe or unexpected, and can update policy coverage, tool exposure, or application behavior accordingly.

### Scenario G: latency spikes affect a production workflow[​](#scenario-g-latency-spikes-affect-a-production-workflow)
**What it means:** end users may be getting slower responses or a specific workflow may be degrading under load or configuration change.

What to look at:

- latency statistic of interest, such as mean, P95, or max
- input prompt tokens
- completion tokens
- total tokens
- tool-related session metrics
- affected requests and sessions

Do this:

- Review the Performance Metrics graph and identify the spike interval.
- Open the associated issue if one exists.
- Drill into the relevant requests.
- Use Sessions to determine whether the problem is tied to a prompt pattern, long context, tool-heavy flow, or repeated retries.

What success looks like: you can isolate the requests or sessions driving the slowdown, distinguish between a model problem, prompt-size problem, or tool-sequencing problem, and make a targeted fix rather than treating latency as a generic platform issue.

### Scenario H: token usage grows unexpectedly[​](#scenario-h-token-usage-grows-unexpectedly)
**What it means:** the workflow may be becoming more expensive, more verbose, or less efficient. In some cases, it can also suggest misuse or looping behavior.

What to look at:

- prompt tokens per request
- completion tokens per request
- total tokens per request
- tokens per session
- requests per session
- tool call tokens or tool-heavy sessions

Do this:

- Review token trends and identify which metric moved first.
- Drill into the relevant Events.
- Use Sessions to see whether long conversations, repeated retries, large contexts, or tool loops are driving the growth.
- Decide whether the change is expected business growth or avoidable inefficiency.

What success looks like: you identify the real source of the cost increase and can improve prompt design, context size, or workflow logic with evidence.

### Scenario I: a custom policy detects a business-specific risk pattern[​](#scenario-i-a-custom-policy-detects-a-business-specific-risk-pattern)
**What it means:** a condition important to your organization is now being tracked and investigated in the same workflow as built-in policies.

Examples:

- responses missing a required disclaimer
- unsupported legal, financial, or policy claims
- prohibited brand or tone deviations
- outputs that fail required structure or escalation logic
- domain-specific compliance violations

What to look at:

- the custom policy's trend over time
- associated issues and severity
- affected Events
- Sessions for interaction context

Do this:

- Create or enable the custom policy that reflects the condition you care about.
- Configure alerts on meaningful thresholds.
- Review issues the same way you would built-in scanner issues.
- Use Events and Sessions to inspect examples and understand how the condition appears in practice.
- Adjust the policy, application behavior, or response templates based on findings.

What success looks like: the platform monitors your organization's own standards, not just built-in risks, and you can investigate custom business risk with the same evidence-rich workflow as any other runtime condition.

### Scenario J: proving that runtime protections and runtime oversight are operating[​](#scenario-j-proving-that-runtime-protections-and-runtime-oversight-are-operating)
**What it means:** a governance, security, or audit stakeholder wants evidence that runtime AI activity is being monitored, reviewed, and investigated in a structured way.

What to look at:

- quality and performance trends
- issues and their review history
- individual Events showing policy outcomes
- Sessions showing full interaction context
- Report exports of issue history

Do this:

- Use dashboard trends to show that important runtime conditions are being monitored over time.
- Use issue history to show that abnormal changes were surfaced and reviewed.
- Use event detail to show the exact requests, responses, and policy outcomes involved.
- Use Sessions to show how flagged activity fit into the broader interaction, including multi-turn flows, tool usage, and runtime actions.
- Export issue history or investigation artifacts as needed for internal review, audit preparation, or governance reporting.

What success looks like: you can show that runtime activity is not only controlled, but observable and reviewable, demonstrate that you can investigate down to the event and session level when something changes, and provide practical evidence of runtime oversight, not just static configuration.

### Scenario K: a session policy raises a finding[​](#scenario-k-a-session-policy-raises-a-finding)
**What it means:** a rule that evaluates a full conversation — not a single request — has fired. Typical triggers include cumulative guardrail violations across a session, runaway tool loops, or token growth that exceeds a configured ceiling.

What to look at:

- the grouped session-policy alert in the Issues queue (grouped by policy, resource, and severity)
- the linked session timeline
- per-session metrics for that session (tokens, requests, tool calls, guardrail violations)
- the policy configuration at the scope where it fired

Do this:

- Open the Issues queue and find the grouped session-policy alert. Use grouping by policy, resource, and severity to see whether the same policy is firing in multiple places.
- Drill into the linked session and walk the timeline. Inspect the LLM request events, tool calls, blocked/stripped flags, and guardrail triggers in order.
- Decide whether the finding reflects a real problem (tighten the policy, raise severity, or change the action) or expected behavior at this scope (override at a lower scope, or **revert to inherited** if a local override is no longer needed). For configuration details, see [Session Policies](/_docs/docs/applications/ai_monitor/session_policies).
- Where the finding is material, escalate to AI Incidents using the same flow described in Step 6 so the conversation-level evidence stays linked.

What success looks like: conversation-level findings have a clear owner, the policy configuration matches the operational reality, and material session-policy findings flow into incident response with their evidence intact.

## How to use custom policies effectively[​](#how-to-use-custom-policies-effectively)
Custom policies are especially powerful when built-in scanners do not fully capture your needs.

Use custom policies when:

- the condition is unique to your business or regulatory environment
- the issue is about product behavior rather than generic AI abuse
- your teams need a direct way to monitor internal standards or promises

Best practices for custom policies:

- Start with one high-value condition rather than trying to encode everything at once.
- Use clear pass/fail criteria so investigation outcomes are easy to interpret.
- Pair custom policies with alerting only after you understand the baseline frequency.
- Review examples in Events and Sessions before tightening thresholds.
- Treat custom policy issues the same way you treat built-in policy issues.

## Best practices[​](#best-practices)

- **Start with a small number of high-value alerts.** Too many early alerts make it harder to trust the system.
- **Review both quality and performance.** A system can be secure but low quality, or fast but risky.
- **Use Sessions whenever context matters.** Many important issues only make sense once you see the full interaction.
- **Require stable `user_session_id` for important applications.** Without it, session reconstruction will be limited.
- **Tune thresholds after observing real usage.** Baselines are more useful when grounded in production behavior.
- **Treat issues as an owned queue.** The value comes from consistent review and follow-up, not passive dashboards.
- **Use custom policies for the conditions that matter most to your business.** The feature is most powerful when it reflects your actual standards and risks.
- **Use session policies for findings that only make sense across a full conversation, not at a single request.** Conversation-level signals — cumulative violations, tool loops, token growth — belong here.
- **Close the loop.** Use investigation findings to update prompts, models, tools, policies, or workflow design.

## What success looks like[​](#what-success-looks-like)
A mature AI Investigation practice looks like this:

- Important AI Systems have meaningful scanner coverage enabled.
- You know which quality and performance metrics matter most for each workflow.
- Alerting is tuned to create actionable issues rather than noise.
- Issues are reviewed with clear ownership.
- Events are used to inspect exact requests.
- Sessions are used to reconstruct important interactions in context.
- Material findings are escalated into AI Incidents with linked issue evidence.
- Investigation findings lead to prompt, model, tool, or policy improvements.
- Governance teams can show evidence of runtime oversight, not just configuration.

In other words, success is not just that the feature is turned on. Success is that you can answer, with confidence, **what happened, why it mattered, and what was done next**.
[PreviousWhat Your Coding Agent Can Do with Atlas](/_docs/docs/handbooks/mcp_server_runbooks)[NextAWS AI Security Handbook](/_docs/docs/handbooks/aws_ai_security_handbook)- [What this handbook is for](#what-this-handbook-is-for)- [Who should use it](#who-should-use-it)[Security / GRC teams](#security--grc-teams)- [Platform / AI infrastructure teams](#platform--ai-infrastructure-teams)- [Application / agent developers](#application--agent-developers)- [Key idea: runtime protection is only half the story](#key-idea-runtime-protection-is-only-half-the-story)- [Operating model (recommended)](#operating-model-recommended)[Step 0: Configure session policies](#step-0-configure-session-policies)- [Step 1: Enable the right runtime protections](#step-1-enable-the-right-runtime-protections)- [Step 2: Establish a baseline in the Dashboard](#step-2-establish-a-baseline-in-the-dashboard)- [Step 3: Configure alerts for the conditions that matter](#step-3-configure-alerts-for-the-conditions-that-matter)- [Step 4: Use Issues as the triage queue](#step-4-use-issues-as-the-triage-queue)- [Step 5: Investigate in Events and Sessions](#step-5-investigate-in-events-and-sessions)- [Step 6: Escalate material findings to AI Incidents](#step-6-escalate-material-findings-to-ai-incidents)- [Step 7: Tune controls and workflows over time](#step-7-tune-controls-and-workflows-over-time)- [What to monitor first](#what-to-monitor-first)[Security and abuse](#security-and-abuse)- [Agent and tool risk](#agent-and-tool-risk)- [Quality and user experience](#quality-and-user-experience)- [Operational health and cost](#operational-health-and-cost)- [Business-specific monitoring](#business-specific-monitoring)- [How to think about the main pages](#how-to-think-about-the-main-pages)[Dashboard](#dashboard)- [Issues](#issues)- [Events](#events)- [Sessions](#sessions)- [Report](#report)- [Why session context matters](#why-session-context-matters)- [Common scenarios and what to do](#common-scenarios-and-what-to-do)[Scenario A: jailbreak attempts suddenly increase](#scenario-a-jailbreak-attempts-suddenly-increase)- [Scenario B: PII starts appearing more often in prompts or outputs](#scenario-b-pii-starts-appearing-more-often-in-prompts-or-outputs)- [Scenario C: answer quality drops after a model, prompt, or retrieval change](#scenario-c-answer-quality-drops-after-a-model-prompt-or-retrieval-change)- [Scenario D: end users are becoming frustrated even though the system is still responding](#scenario-d-end-users-are-becoming-frustrated-even-though-the-system-is-still-responding)- [Scenario E: the assistant is refusing more often than expected](#scenario-e-the-assistant-is-refusing-more-often-than-expected)- [Scenario F: tool misuse or agent overreach appears in runtime activity](#scenario-f-tool-misuse-or-agent-overreach-appears-in-runtime-activity)- [Scenario G: latency spikes affect a production workflow](#scenario-g-latency-spikes-affect-a-production-workflow)- [Scenario H: token usage grows unexpectedly](#scenario-h-token-usage-grows-unexpectedly)- [Scenario I: a custom policy detects a business-specific risk pattern](#scenario-i-a-custom-policy-detects-a-business-specific-risk-pattern)- [Scenario J: proving that runtime protections and runtime oversight are operating](#scenario-j-proving-that-runtime-protections-and-runtime-oversight-are-operating)- [Scenario K: a session policy raises a finding](#scenario-k-a-session-policy-raises-a-finding)- [How to use custom policies effectively](#how-to-use-custom-policies-effectively)- [Best practices](#best-practices)- [What success looks like](#what-success-looks-like)
