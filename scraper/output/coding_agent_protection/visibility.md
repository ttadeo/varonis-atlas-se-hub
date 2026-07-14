---
title: Visibility
url: https://prod.alltrue-be.com/_docs/docs/coding_agent_protection/visibility
section: coding_agent_protection
---

# Visibility

- [](/_docs/)- [Coding Agent Protection](/_docs/docs/coding_agent_protection/overview)- VisibilityExport PDFOn this page# Visibility
Once coding-agent hooks are installed and sending events (see [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection)), Atlas records that activity and makes it available for monitoring and investigation. This page describes what you can see.

## What you can see[​](#what-you-can-see)
There is no separate coding-agent screen. Coding-agent activity is recorded alongside other AI runtime activity and viewed in two shared surfaces:

- **AI Investigation** — the runtime activity surface, with sub-views including **Dashboard**, **Sessions**, **Events**, **Policies**, and **Quarantines**. Coding-agent activity is identified here by its session classification and by resource and provider filters.
- **AI Usage** — the usage and adoption dashboard, which tracks activity and token consumption across users and applications.

Because coding-agent sessions flow into these shared surfaces, you filter and classify them rather than navigating to a dedicated coding-agent dashboard. For the broader feature context, see the [Coding Agent Protection overview](/_docs/docs/coding_agent_protection/overview).

## The activity log (Events)[​](#the-activity-log-events)
The **Events** view under **AI Investigation** is the request- and event-level activity log. Each record captures a single piece of agent activity together with its resource, the user, and the time it occurred.

Coding-agent events include the content kinds the hooks emit — for example a user prompt, an agent thought, a tool call, a tool response, and an assistant message. The view supports filtering so you can narrow to coding-agent activity and to specific outcomes, with filters such as use case, provider, model, policy type, action type, session, and token or message counts. (Exact column and filter labels are part of the shared AI Investigation experience; see [AI Investigation](/_docs/docs/applications/ai_monitor) for the full reference.)

## Session view and forensic reconstruction (Sessions)[​](#session-view-and-forensic-reconstruction-sessions)
The **Sessions** view groups events into sessions and reconstructs what happened during each one. A coding-agent session is labeled with a classification that identifies the agent and how it connected — for example "Cursor · IDE Hooks", "VS Code · IDE Hooks", "JetBrains · IDE Hooks", or "Copilot · Action Sequence". These classification labels are evolving as integrations are added, so treat them as current examples rather than a fixed list.

Opening a session reconstructs its request timeline and summarizes it with stat tiles — for example the number of requests, events, tokens, tool calls, and policy violations — and lets you expand individual requests to see the underlying events. This is the forensic view: it turns "something happened in the IDE" into a timeline of user activity, agent behavior, and the policy decisions that were applied.

## Policy-decision records[​](#policy-decision-records)
Every evaluated event carries the decision Atlas made. Allow, block, modify, and alert outcomes appear on the event and session views — for example as policy-violation badges and the action taken on a request — so you can see not only what the agent did but how policy responded.

Two AI Investigation sub-views focus on enforcement:

- **Policies** — the policy decisions applied to runtime activity.
- **Quarantines** — users or attributes that have been quarantined after repeated violations (see [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection) for how quarantine and permanent-deny enforcement work).

## Usage and token tracking[​](#usage-and-token-tracking)
The **AI Usage** dashboard tracks adoption and cost across your environment, with **Overview** and **Daily Usage** tabs. Its cards summarize activity such as a usage overview, top AI sources by requests, top activity by user, and top activity by application, and you can drill into per-user activity. Coding-agent usage appears within these shared views, filterable by source and application — letting you see who is using coding agents, how often, and how many tokens they consume, rather than through a dedicated coding-agent usage page.

## What attribution is recorded[​](#what-attribution-is-recorded)
Each recorded event ties activity to a who, a session, and a resource:

- **Who** — the user identity on the event, including user email, IP address, and role.
- **Which session** — the session identifier that groups the events of one coding-agent session.
- **Which agent / resource** — the coding-agent resource the activity belongs to, along with the model and token counts for the event.

This attribution is what lets the Sessions view reconstruct a coherent timeline and the AI Usage dashboard aggregate activity by user and application.
[PreviousGoogle Antigravity](/_docs/docs/coding_agent_protection/runtime_protection/google_antigravity)[NextArtifact Discovery and Posture](/_docs/docs/coding_agent_protection/artifact_discovery_posture)- [What you can see](#what-you-can-see)- [The activity log (Events)](#the-activity-log-events)- [Session view and forensic reconstruction (Sessions)](#session-view-and-forensic-reconstruction-sessions)- [Policy-decision records](#policy-decision-records)- [Usage and token tracking](#usage-and-token-tracking)- [What attribution is recorded](#what-attribution-is-recorded)
