---
title: What's New in V3.4.0
url: https://prod.alltrue-be.com/_docs/docs/release_notes/340
section: release_notes
---

# What's New in V3.4.0

- [](/_docs/)- Release Notes- What's New in V3.4.0Export PDFOn this page# What's New in V3.4.0
**Release Date: June 8, 2026**

### VS Code Runtime Hooks[​](#vs-code-runtime-hooks)
Adds hook-based runtime enforcement for VS Code. VS Code activity can now be sent through runtime policies to provide governance, visibility, and enforcement for AI-assisted development workflows.

### GitHub Copilot CLI Runtime Hooks[​](#github-copilot-cli-runtime-hooks)
Adds hook-based runtime enforcement for GitHub Copilot CLI. You can now apply runtime policies to GitHub Copilot CLI activity to support enforcement and auditability for command-line AI coding workflows.

### Anthropic Compliance API Log Ingestion[​](#anthropic-compliance-api-log-ingestion)
Adds support for ingesting logs from the Anthropic Compliance API. Anthropic activity can now be processed through the platform to support investigation, auditability, and AI usage visibility.

### Multi-Turn Pentests[​](#multi-turn-pentests)
Adds support for multi-turn pentests. Red Team assessments can now evaluate AI applications across conversational flows instead of only single request/response interactions, improving coverage for attacks that require context buildup or repeated interaction.

### Trigger Quarantine Action[​](#trigger-quarantine-action)
Adds a new Trigger Quarantine action for runtime policy enforcement. Policies can now quarantine a user, agent, or other configured attribute after a blocking policy violation, preventing additional activity for the configured quarantine duration.

### AI Investigation Quarantines[​](#ai-investigation-quarantines)
Adds quarantine management in AI Investigation. Users can now view active quarantines, review quarantine history, and manage quarantines from the AI Investigation page.

### AI Investigation Sessions Page Redesign[​](#ai-investigation-sessions-page-redesign)
Redesigns the AI Investigation Sessions page to improve session review, navigation, and visibility into AI activity.

### AI Investigation Events Page Redesign[​](#ai-investigation-events-page-redesign)
Redesigns the AI Investigation Events page to improve event review and provide clearer visibility into runtime, access, and investigation activity.

### AI Investigation Session Policies and Issues[​](#ai-investigation-session-policies-and-issues)
Adds support for AI Investigation Session Policies and related Issues. Session-level policy violations can now be reviewed as issues, improving investigation workflows and making it easier to identify risky behavior across AI sessions.

### Azure Databricks Discovery[​](#azure-databricks-discovery)
Adds Azure Databricks discovery through Azure Cloud Account discovery. The platform can now discover Databricks resources as part of Azure discovery workflows.

**Upgrade note:** Native Databricks linking and direct Databricks discovery will be supported in the next release.

### Skill Discovery from Repository Code Scanning[​](#skill-discovery-from-repository-code-scanning)
Adds discovery of AI skills from repository code scanning. Skills identified in source code can now be represented in inventory to improve visibility into agent capabilities and AI application behavior defined in code.

### Claude Code Artifact Discovery from Repository Code Scanning[​](#claude-code-artifact-discovery-from-repository-code-scanning)
Adds discovery of Claude Code artifacts through repository code scanning, including agents, project instructions, rules, hooks, and plugins. This improves visibility into where Claude Code is configured and how it is being customized across repositories.

### Sensitive Data AI SPM Policies[​](#sensitive-data-ai-spm-policies)
Adds new AI SPM Sensitive Data policies for identifying sensitive data exposure paths involving agents and knowledge sources.

**Private preview note:** These policies are available in private preview only.

The new policies include:

**Sensitive Data with External Transfer Paths** — Detects agents with access to knowledge sources containing sensitive data when those agents also have egress capabilities through tools or MCPs.

**Dormant Sensitive Access Paths** — Detects agents with access to knowledge sources containing sensitive data that have been classified as dormant.

**Limitation:** These policies currently support AWS Bedrock and Copilot Studio agents with knowledge stores. Support for additional platforms and connected services such as tools and MCPs will be added in future releases.

### AI MCP Policies[​](#ai-mcp-policies)
Adds new AI MCP security policies for detecting risky MCP server, tool, package, authentication, and governance conditions.

New MCP policies include:

- Detect MCP Capability Expansion Since Last Review
- Detect MCP Servers Exposing Excessive Tool Count
- Detect MCP Servers Exposing High-Risk Capability Tools
- Detect Incomplete MCP Audit Metadata
- Detect MCP Servers Missing Authentication
- Detect Orphaned MCP Servers and Tools with Active Credentials
- Detect MCP Servers Backed by OSS Packages with Restrictive or Missing Licenses
- Detect OSS MCP Servers That Are Not Runnable
- Detect MCP Servers Exposing Stale High-Risk Capability Tools
- Detect Virtual MCP Gateways Exposing Tools Beyond Actual Usage
- Detect MCP Servers with Unknown or Low-Confidence Capability Tools
- Detect MCP Servers Backed by a Vulnerable OSS Package
[PreviousWhat's New in V3.5.0](/_docs/docs/release_notes/350)[NextWhat's New in V3.3.0](/_docs/docs/release_notes/330)- [VS Code Runtime Hooks](#vs-code-runtime-hooks)- [GitHub Copilot CLI Runtime Hooks](#github-copilot-cli-runtime-hooks)- [Anthropic Compliance API Log Ingestion](#anthropic-compliance-api-log-ingestion)- [Multi-Turn Pentests](#multi-turn-pentests)- [Trigger Quarantine Action](#trigger-quarantine-action)- [AI Investigation Quarantines](#ai-investigation-quarantines)- [AI Investigation Sessions Page Redesign](#ai-investigation-sessions-page-redesign)- [AI Investigation Events Page Redesign](#ai-investigation-events-page-redesign)- [AI Investigation Session Policies and Issues](#ai-investigation-session-policies-and-issues)- [Azure Databricks Discovery](#azure-databricks-discovery)- [Skill Discovery from Repository Code Scanning](#skill-discovery-from-repository-code-scanning)- [Claude Code Artifact Discovery from Repository Code Scanning](#claude-code-artifact-discovery-from-repository-code-scanning)- [Sensitive Data AI SPM Policies](#sensitive-data-ai-spm-policies)- [AI MCP Policies](#ai-mcp-policies)
