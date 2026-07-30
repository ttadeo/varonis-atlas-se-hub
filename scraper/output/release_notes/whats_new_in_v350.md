---
title: What's New in V3.5.0
url: https://prod.alltrue-be.com/_docs/docs/release_notes/350
section: release_notes
---

# What's New in V3.5.0

- [](/_docs/)- Release Notes- What's New in V3.5.0Export PDFOn this page# What's New in V3.5.0
**Release Date: July 13, 2026**

### IBAC Intent Drift Detection Policy[​](#ibac-intent-drift-detection-policy)
A new Intent-Based Access Control policy helps detect tool drift by evaluating whether a tool call aligns with the user's request or intended business task. This helps identify risky, unauthorized, or unexpected agent behavior.

### Intent Timeline[​](#intent-timeline)
AI Investigation Sessions now include an Intent Timeline for supported runtime investigations. Investigators can review how user intent, agent behavior, and tool activity evolved across a session, making it easier to understand why an IBAC policy triggered and what happened before and after the violation.

### Atlas MCP Server[​](#atlas-mcp-server)
The Atlas MCP Server lets MCP-compatible coding agents, including Claude Code, OpenAI Codex CLI, Cursor, and other MCP clients, access Atlas directly from their normal chat or terminal workflows. Users can ask their agent to retrieve AI inventory, review posture and governance issues, summarize compliance status, analyze usage, inspect pentest results, or work with VMCP configurations without switching to the Atlas UI.

### Coding Agent Support for Devin, Google Antigravity, Kiro, and OpenAI Codex[​](#coding-agent-support-for-devin-google-antigravity-kiro-and-openai-codex)
Runtime coverage for AI-assisted development tools now includes Devin CLI, Devin Desktop, Google Antigravity, Kiro, and OpenAI Codex. Activity from these coding agents can now be logged, reviewed, and evaluated through runtime policies, expanding visibility, governance, and enforcement across additional coding agent workflows.

### Claude Cowork Hooks[​](#claude-cowork-hooks)
Atlas now supports hook-based runtime protection for Claude Cowork through a plugin. Claude Cowork activity can be evaluated inline by runtime policies, enabling real-time enforcement, logging, visibility, and investigation for Claude Cowork workflows.

### Bedrock Log Ingestion[​](#bedrock-log-ingestion)
AWS Bedrock logs can now be ingested into the platform. Bedrock activity can be reviewed for investigation, auditability, and AI usage visibility, and runtime policies can be applied to ingested events to support alerting on risky or anomalous activity.

### Claude OTEL Log Ingestion[​](#claude-otel-log-ingestion)
Claude OpenTelemetry logs for Claude Cowork and Claude Code can now be ingested into the platform. Supported Claude activity can be reviewed for investigation and visibility, and runtime policies can be applied to ingested events to support alerting.

**Limitation:** This release supports a limited set of event types based on Claude support.

### Copilot and ChatGPT Enterprise Prompt Sync with Varonis DSPM[​](#copilot-and-chatgpt-enterprise-prompt-sync-with-varonis-dspm)
Prompt activity from Microsoft Copilot and ChatGPT Enterprise can now be synchronized with Varonis DSPM. This allows prompt activity to be correlated with DSPM context to improve sensitive data visibility and investigation workflows, and runtime policies can be applied to synced prompt events to support alerting.

### Data Access Graph[​](#data-access-graph)
The new Data Access Graph available on the Agent resource page shows relationships between Agents and the data they can access. This improves visibility into sensitive data exposure paths and agent access risk.

### Resource Graph Cleanup[​](#resource-graph-cleanup)
Resource Graph views have been improved to reduce noisy or unrelated relationships. The graph now provides clearer resource context and makes it easier to understand meaningful AI resource dependencies.

### Resource Sub-Lists for Agents, Tools, and MCPs[​](#resource-sub-lists-for-agents-tools-and-mcps)
Inventory now includes focused sub-lists for agents, tools, and MCP resources. These views make it easier to navigate and review key AI resource types.

### Tool Capability Classification[​](#tool-capability-classification)
Tools can now be classified by functional capability. Capability classification improves policy evaluation, investigation workflows, and visibility into agent and MCP risk.

### Salesforce Agentforce Discovery[​](#salesforce-agentforce-discovery)
Salesforce Agentforce resources can now be discovered by the platform by configuring accounts in the Hosted Services tab, improving visibility into Salesforce-hosted AI agents and related configuration.

### AWS Databricks Discovery and Azure Databricks Agent Enhancements[​](#aws-databricks-discovery-and-azure-databricks-agent-enhancements)
Databricks discovery coverage has been expanded with native Databricks discovery and enhanced Azure Databricks discovery for Databricks Agents. This provides broader Databricks AI inventory coverage across Databricks hosted in AWS and Azure environments.

### Ongoing Organization Repository Discovery[​](#ongoing-organization-repository-discovery)
Organization-level repository discovery can now run on an ongoing basis. The platform can automatically discover newly added repositories and keep repository-based AI resource discovery current as repositories are added or changed over time.

### Read-Only GitHub App[​](#read-only-github-app)
Customers can now connect GitHub using a read-only GitHub App for repository discovery. This supports least-privilege access for code scanning and AI artifact discovery workflows where automated remediations are not required.

### TypeScript Code Scanning Discovery[​](#typescript-code-scanning-discovery)
Repository code scanning now supports TypeScript. AI resources and artifacts defined in TypeScript repositories can be identified and represented in inventory.

### Strands Framework Agentic Code Scanning[​](#strands-framework-agentic-code-scanning)
Agentic code scanning now supports the Strands framework. Supported Strands agent artifacts can be discovered from repository code scanning.

### AgentCore Runtime Scanning[​](#agentcore-runtime-scanning)
AgentCore Runtime discovery now combines AWS cloud scanning with code scanning of the runtime artifact. After the runtime is discovered through AWS, the platform can analyze the associated artifact to identify AI resources defined inside the runtime, including agents, tools, and related configuration.

### Claude Managed Agent Hosted Service[​](#claude-managed-agent-hosted-service)
Claude Managed Agent Hosted Service is now represented as a supported hosted service resource. Claude managed agent activity can be shown more clearly in inventory and governance workflows.

### Prohibited Tool Capability Detection on Tool Calls[​](#prohibited-tool-capability-detection-on-tool-calls)
Runtime activity can now be evaluated against prohibited tool capability categories during tool calls. This helps identify when agents attempt to use tools that violate configured policy expectations.

### AI MCP Issue Investigation Drawer[​](#ai-mcp-issue-investigation-drawer)
AI MCP Issues now have a dedicated investigation drawer. Users can review MCP-related findings with clearer context, affected resources, supporting evidence, and remediation guidance.

### MCP Gateway Runtime Policies and Logging[​](#mcp-gateway-runtime-policies-and-logging)
MCP Gateway activity now supports runtime policy enforcement and logging. MCP tool calls can be evaluated through runtime policies to provide governance, visibility, and enforcement for MCP-based workflows.

### Multimodal Pentest Strategy[​](#multimodal-pentest-strategy)
Red Team assessments can now include image-based test inputs for supported scenarios. This improves coverage for attacks that rely on visual content or multimodal prompt injection.

### Copilot Studio AI SPM Policies[​](#copilot-studio-ai-spm-policies)
New AI SPM policies are available for Copilot Studio agents.

The new policies include:

- **Agent Does Not Require Authentication** — Detects Copilot Studio agents that do not require authentication.
- **Agent Has No Active Owner** — Detects Copilot Studio agents that do not have an active owner.
- **Agent Shared Too Broadly** — Detects Copilot Studio agents that are shared more broadly than expected.
- **Tool Uses Creator-Owned Runtime Identity** — Detects Copilot Studio tools that run using creator-owned credentials instead of an appropriate runtime identity.

### Malicious Skill Detection AI SPM Policies and Issues[​](#malicious-skill-detection-ai-spm-policies-and-issues)
New AI SPM policies and Issues help detect malicious or risky AI skills.

The new policies include:

- **Malicious Skill Exfiltration Pattern** — Detects skills that contain patterns associated with data exfiltration.
- **Skill Accesses Local Credentials in Executable Context** — Detects skills that attempt to access local credentials during execution.
- **Skill Allows Unrestricted Shell Execution** — Detects skills that allow unrestricted shell command execution.
- **Skill Contains Hardcoded Credential** — Detects skills that contain hardcoded credentials.
- **Skill Performs External Data Transfer in Executable Context** — Detects skills that transfer data externally during execution.
- **Skill Uses Dynamic Shell Context** — Detects skills that use dynamic shell execution patterns that may increase execution risk.

### Doc AI Search[​](#doc-ai-search)
AI-powered documentation search helps users find relevant product guidance and security information more efficiently.

### Doc Export[​](#doc-export)
Supported documentation can now be exported for offline review, sharing, and audit workflows.

### AI Usage Policy Authorization and Block Rules[​](#ai-usage-policy-authorization-and-block-rules)
AI Usage Policies now include expanded controls for agents and guardrail integrations. Users can authorize or quarantine resources using dedicated policy tabs, and define resource-level block rules based on attributes such as user ID, user email, role, application, and other supported request context. Matching requests are automatically blocked.

### Python and PowerShell Scripts for Existing Coding Agent Integrations[​](#python-and-powershell-scripts-for-existing-coding-agent-integrations)
Python and PowerShell scripts are now available for existing coding agent integrations, simplifying deployment and configuration for supported runtime hook integrations.

### Optional User Attribution for Claude Code Runtime Hooks[​](#optional-user-attribution-for-claude-code-runtime-hooks)
Claude Code runtime hooks now support optional user attribution. The hook script can pull the user from the Claude session and inject that identity into runtime events, allowing Claude Code activity to be associated with the correct user in AI Investigation, usage visibility, and audit workflows.

### Dataset Sensitive Data Scanning Deprecation[​](#dataset-sensitive-data-scanning-deprecation)
Dataset sensitive data scanning is deprecated. Sensitive data classification should now rely on DCE classifications from Varonis DSPM.
[PreviousWhat's New in V3.6.0](/_docs/docs/release_notes/360)[NextWhat's New in V3.4.0](/_docs/docs/release_notes/340)- [IBAC Intent Drift Detection Policy](#ibac-intent-drift-detection-policy)- [Intent Timeline](#intent-timeline)- [Atlas MCP Server](#atlas-mcp-server)- [Coding Agent Support for Devin, Google Antigravity, Kiro, and OpenAI Codex](#coding-agent-support-for-devin-google-antigravity-kiro-and-openai-codex)- [Claude Cowork Hooks](#claude-cowork-hooks)- [Bedrock Log Ingestion](#bedrock-log-ingestion)- [Claude OTEL Log Ingestion](#claude-otel-log-ingestion)- [Copilot and ChatGPT Enterprise Prompt Sync with Varonis DSPM](#copilot-and-chatgpt-enterprise-prompt-sync-with-varonis-dspm)- [Data Access Graph](#data-access-graph)- [Resource Graph Cleanup](#resource-graph-cleanup)- [Resource Sub-Lists for Agents, Tools, and MCPs](#resource-sub-lists-for-agents-tools-and-mcps)- [Tool Capability Classification](#tool-capability-classification)- [Salesforce Agentforce Discovery](#salesforce-agentforce-discovery)- [AWS Databricks Discovery and Azure Databricks Agent Enhancements](#aws-databricks-discovery-and-azure-databricks-agent-enhancements)- [Ongoing Organization Repository Discovery](#ongoing-organization-repository-discovery)- [Read-Only GitHub App](#read-only-github-app)- [TypeScript Code Scanning Discovery](#typescript-code-scanning-discovery)- [Strands Framework Agentic Code Scanning](#strands-framework-agentic-code-scanning)- [AgentCore Runtime Scanning](#agentcore-runtime-scanning)- [Claude Managed Agent Hosted Service](#claude-managed-agent-hosted-service)- [Prohibited Tool Capability Detection on Tool Calls](#prohibited-tool-capability-detection-on-tool-calls)- [AI MCP Issue Investigation Drawer](#ai-mcp-issue-investigation-drawer)- [MCP Gateway Runtime Policies and Logging](#mcp-gateway-runtime-policies-and-logging)- [Multimodal Pentest Strategy](#multimodal-pentest-strategy)- [Copilot Studio AI SPM Policies](#copilot-studio-ai-spm-policies)- [Malicious Skill Detection AI SPM Policies and Issues](#malicious-skill-detection-ai-spm-policies-and-issues)- [Doc AI Search](#doc-ai-search)- [Doc Export](#doc-export)- [AI Usage Policy Authorization and Block Rules](#ai-usage-policy-authorization-and-block-rules)- [Python and PowerShell Scripts for Existing Coding Agent Integrations](#python-and-powershell-scripts-for-existing-coding-agent-integrations)- [Optional User Attribution for Claude Code Runtime Hooks](#optional-user-attribution-for-claude-code-runtime-hooks)- [Dataset Sensitive Data Scanning Deprecation](#dataset-sensitive-data-scanning-deprecation)
