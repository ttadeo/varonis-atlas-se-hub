---
title: Coding Agent Protection
url: https://prod.alltrue-be.com/_docs/docs/coding_agent_protection/overview
section: coding_agent_protection
---

# Coding Agent Protection

- [](/_docs/)- Coding Agent ProtectionExport PDFOn this page# Coding Agent Protection
Coding Agent Protection is the set of Atlas capabilities for governing AI-powered coding agents that run inside developer environments. It is an independent governance layer that applies across IDE coding agents — runtime enforcement, visibility, and artifact discovery — regardless of which agent or vendor a developer uses. Policy, observability, and enforcement stay consistent whether a developer reaches for one tool today or a different one next quarter, and they do not depend on any single IDE or model vendor's native guardrails.

## Why coding agents need governance[​](#why-coding-agents-need-governance)
Coding agents are no longer assistants that only suggest snippets. They operate inside developer environments with access to source code, local files, terminals, credentials, repositories, tools, and MCP servers, and they combine natural-language instructions with the ability to act on them. A developer may ask an agent to make a small change, but the agent can choose tools, commands, files, or MCP servers that were never intended or approved.

Traditional endpoint, application, and cloud controls were not built for this kind of activity, so they leave questions unanswered: which agents are in use, what they are accessing, whether their actions match the developer's intent, and what exactly happened during a session. Atlas answers those questions by observing and enforcing at the point of action. It does this through a hook-based architecture, evaluating agent activity at key points in the workflow — prompt submission, before and after a tool runs, when a file is read, and when the agent produces a response. For how the hooks work and how to set them up, see [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection).

## Supported coding agents[​](#supported-coding-agents)
Atlas supports the following coding agents as limited-availability resource types:

- Cursor
- Claude Code
- VS Code
- GitHub Copilot
- OpenAI Codex
- Kiro CLI
- Devin CLI
- Devin Desktop
- Google Antigravity

These resource types are not yet exposed to every customer. If you do not see them when adding a Guardrail Integration, contact your account team.

Enforcement is delivered through runtime hooks that integrate directly into each agent's workflow. Hooks can be distributed centrally — through managed settings for supported providers, or through your existing MDM — so controls roll out across a developer fleet without per-machine setup. For per-agent configuration and the full list of supported events and actions, see [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection).

## What Atlas provides[​](#what-atlas-provides)
Coding Agent Protection brings together several capabilities. Each is summarized here, with a link to its detail page where one exists.

- **Runtime protection and Intent-Based Access Control (IBAC).** Runtime hooks let Atlas block, modify, alert on, or log agent activity in real time against your AI Runtime policies. Intent-Based Access Control goes further than allow or deny: it evaluates whether a tool call aligns with the user's stated intent, so an agent taking an action outside the intended scope can be caught even when that action is technically permitted. See [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection).
- **Visibility.** Atlas records detailed events for each coding-agent session — who used the agent, which agent or IDE, the prompts made, the tools and MCP servers called, the policy decisions applied, and what was allowed, blocked, or modified — so a session can be reconstructed for investigation. It also tracks usage and token consumption across users, teams, and projects. See [Visibility](/_docs/docs/coding_agent_protection/visibility).
- **Artifact discovery and posture.** Atlas discovers repository-level coding-agent artifacts — skills, memory, instructions, agent files, and MCP configurations — separately from the runtime hook path, and applies posture policies that include malicious-skill detection. See [Artifact Discovery and Posture](/_docs/docs/coding_agent_protection/artifact_discovery_posture).
- **Threat detection.** Atlas analyzes session-level activity to surface repeated or anomalous policy violations and suspicious tool or MCP usage that is not obvious from a single event.
- **Quarantine and permanent-deny enforcement.** When a user or attribute repeatedly violates policy, Atlas can apply a time-boxed quarantine or a non-expiring permanent deny to contain risky behavior while keeping coding agents available for trusted users.

All policy evaluation happens on the customer data plane; no unencrypted LLM data leaves your account. For how data is encrypted, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

## How it fits together[​](#how-it-fits-together)
The three detail pages cover Coding Agent Protection from three angles:

- [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection) — enforcement at the point of action: how the hooks work, what each agent supports, and how to configure them.
- [Visibility](/_docs/docs/coding_agent_protection/visibility) — what you can see after activity occurs: session reconstruction, policy decisions, and usage and token tracking.
- [Artifact Discovery and Posture](/_docs/docs/coding_agent_protection/artifact_discovery_posture) — repository-level posture: which agent artifacts exist and which carry risk.

To set up an integration for a specific agent, start from the [coding agent integration guides](/_docs/docs/coding_agent_protection/runtime_protection).
[PreviousGoogle Workspace Permission Breakdown for Gemini App](/_docs/docs/providers/google_workspace/permission_breakdown)[NextRuntime Protection](/_docs/docs/coding_agent_protection/runtime_protection)- [Why coding agents need governance](#why-coding-agents-need-governance)- [Supported coding agents](#supported-coding-agents)- [What Atlas provides](#what-atlas-provides)- [How it fits together](#how-it-fits-together)
