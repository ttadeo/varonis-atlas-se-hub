---
title: Artifact Discovery and Posture
url: https://prod.alltrue-be.com/_docs/docs/coding_agent_protection/artifact_discovery_posture
section: coding_agent_protection
---

# Artifact Discovery and Posture

- [](/_docs/)- [Coding Agent Protection](/_docs/docs/coding_agent_protection/overview)- Artifact Discovery and PostureExport PDFOn this page# Artifact Discovery and Posture
Coding agents are shaped by artifacts that live in a repository — skills, instructions, rules, plugins, hooks, and MCP server configurations. These artifacts persist across sessions and can change how an agent behaves, which makes them both a governance surface and a potential supply-chain or insider-risk vector. Atlas discovers these artifacts through code scanning and applies posture policies to them, including detection of malicious skills.

This is distinct from runtime enforcement: artifact discovery scans repositories for the configuration that shapes agent behavior, while [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection) governs live agent sessions through hooks. For the broader feature context, see the [Coding Agent Protection overview](/_docs/docs/coding_agent_protection/overview).

## What artifact discovery covers[​](#what-artifact-discovery-covers)
When Atlas scans a connected repository, it discovers the Claude Code artifacts it contains — skills, plus the broader Claude Code artifact set such as plugins, instructions, rules, hooks, and MCP server configurations. Discovered artifacts appear as resources in [AI Inventory](/_docs/docs/applications/ai_inventory/code_scanning) alongside the rest of your code-scanning results.

The discovered unit that the malicious-skill posture policies evaluate is the **skill** — a Claude Code skill found in the repository.

## Discovery capability by coding agent[​](#discovery-capability-by-coding-agent)
Artifact discovery today covers **Claude Code**. Atlas discovers Claude Code artifacts from scanned repositories; it does not currently discover repository artifacts for other coding agents.

Other coding agents are governed through runtime enforcement rather than artifact discovery — Atlas observes and controls their activity at runtime through hooks. For the agents covered there and what each supports, see [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection).

## Malicious Skill Detection policies[​](#malicious-skill-detection-policies)
Atlas ships six AI SPM policies that evaluate discovered Claude Code skills for malicious or risky patterns. They belong to the **Agentic Threats** policy group and are **disabled by default** — you enable each one on the AI SPM Policies page (see [How findings surface](#how-findings-surface)).

PolicySeveritySkill Allows Unrestricted Shell ExecutionHighSkill Uses Dynamic Shell ContextHighSkill Accesses Local Credentials in Executable ContextLowSkill Performs External Data Transfer in Executable ContextLowMalicious Skill Exfiltration PatternCriticalSkill Contains Hardcoded CredentialHigh

- **Skill Allows Unrestricted Shell Execution** (High) — Detects skills that grant unrestricted shell access to the agent, including skills configured to run any command without per-command restriction. Open-ended shell grants amplify the impact of any malicious or compromised skill body.
- **Skill Uses Dynamic Shell Context** (High) — Detects skills that run shell commands at load time to populate the agent context, including embedded commands that read credentials, contact external services, or enumerate sensitive files. These commands execute before the agent reviews what the skill is loading.
- **Skill Accesses Local Credentials in Executable Context** (Low) — Detects skills that read local credentials as part of their setup, including cloud authentication tokens, SSH keys, and environment secrets. Once loaded into the agent context, those credentials can be misused by any subsequent instruction.
- **Skill Performs External Data Transfer in Executable Context** (Low) — Detects skills that send data to external destinations or download remote payloads as part of their setup, including outbound uploads and download-and-execute chains. External transfers in skill setup are a common channel for data exfiltration and remote code execution.
- **Malicious Skill Exfiltration Pattern** (Critical) — Detects skills that combine unrestricted shell access, local credential reads, and outbound data transfer in a single skill — the canonical credential-exfiltration pattern. When this pattern is detected on a skill, it consolidates the four lower-severity policies above for that skill into this single critical finding so you see one high-signal issue rather than several overlapping ones.
- **Skill Contains Hardcoded Credential** (High) — Detects a credential embedded directly in a skill body, such as an API key, token, or private key.

## How findings surface[​](#how-findings-surface)
The six policies appear in the **Agentic Threats** group on the AI SPM Policies page. Each policy is opt-in: toggle **Enable** to turn it on. Enabling a policy also auto-creates issues for any discovered skill that violates it.

When a skill violates an enabled policy, Atlas raises an **Agentic Finding** on that skill resource, visible in the resource's issue drawer with the matched behavior and evidence. Because policies are evaluated per scanned repository, a skill that appears in more than one repository produces a finding per affected resource. For more on the AI SPM policy model and the Enable behavior, see [AI SPM](/_docs/docs/applications/ai_spm).

## Scope and boundaries[​](#scope-and-boundaries)

- **Artifact discovery vs. runtime protection.** Artifact discovery and posture currently apply to Claude Code repository artifacts. Governing other coding agents — and governing live sessions for any agent — is the job of [Runtime Protection](/_docs/docs/coding_agent_protection/runtime_protection).
- **Agentic Findings vs. Sensitive Data.** A credential embedded in a skill body (Skill Contains Hardcoded Credential), and credentials read in an executable skill context (Skill Accesses Local Credentials in Executable Context), surface as **Agentic Findings** in the Agentic Threats group — not as Sensitive Data issues. The Sensitive Data policy group targets other resource types, such as notebooks and datasets.
[PreviousVisibility](/_docs/docs/coding_agent_protection/visibility)[NextLog Sources](/_docs/docs/log_sources/overview)- [What artifact discovery covers](#what-artifact-discovery-covers)- [Discovery capability by coding agent](#discovery-capability-by-coding-agent)- [Malicious Skill Detection policies](#malicious-skill-detection-policies)- [How findings surface](#how-findings-surface)- [Scope and boundaries](#scope-and-boundaries)
