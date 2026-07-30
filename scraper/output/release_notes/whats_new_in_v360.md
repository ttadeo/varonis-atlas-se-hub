---
title: What's New in V3.6.0
url: https://prod.alltrue-be.com/_docs/docs/release_notes/360
section: release_notes
---

# What's New in V3.6.0

- [](/_docs/)- Release Notes- What's New in V3.6.0Export PDFOn this page# What's New in V3.6.0
**Release Date: July 24, 2026**

### Require Approval Action[​](#require-approval-action)
Introduces a Require Approval action for runtime policy enforcement. When a policy is triggered, the applicable AI activity can be held until an authorized reviewer approves or rejects the request. This provides a human-in-the-loop option for sensitive tool call interactions that should not be automatically allowed or permanently blocked.

### Agent Manifest[​](#agent-manifest)
Agent Manifest provides a structured definition of an agent's approved purpose, expected behavior, tools, capabilities, and ownership. This creates a governance baseline that can be compared with observed agent activity and used to determine whether the agent is operating within its intended scope.

### Salesforce Agentforce Prompt Log Ingestion[​](#salesforce-agentforce-prompt-log-ingestion)
Salesforce Agentforce prompt activity can now be ingested into the platform. The resulting events and sessions are available in AI Investigation, providing visibility into how Agentforce agents are being used and supporting investigation, auditing, and usage analysis.

### Multiple Credentials for MCP Server Registration[​](#multiple-credentials-for-mcp-server-registration)
Adds support for configuring multiple credentials when registering an MCP server. This allows the same MCP server to support multiple authentication configurations and access contexts.

### Per-Token MCP Gateway Credentials[​](#per-token-mcp-gateway-credentials)
Adds support for configuring MCP server credentials for each Gateway Access Token. Different Gateway Access Tokens can now use separate credentials when connecting to MCP servers, enabling more granular identity and access control.

### Copilot Studio Connector Credential Discovery[​](#copilot-studio-connector-credential-discovery)
Adds discovery of credentials associated with Microsoft Copilot Studio connectors. Discovered credentials provide additional visibility into the identities and authentication mechanisms used by agents to access connected services.

### Runtime Policy Consolidation[​](#runtime-policy-consolidation)
Session and monitoring policies are now configured from the Runtime Policies page. Bringing these policy types into the existing runtime policy experience provides a single location for creating, reviewing, and managing runtime controls.

### Sensitive Data AI SPM Policies[​](#sensitive-data-ai-spm-policies)
Adds new AI SPM Sensitive Data policies for identifying insufficient governance, weak sharing controls, risky runtime identities, and unapproved tools involving sensitive data.

The new policies include:

- **Sensitive Access Uses Shared or Privileged Runtime Identity** — Detects access to sensitive data through a shared or privileged runtime identity, which can reduce accountability and increase the potential impact of credential misuse.
- **Sensitive Data Has Weak Sharing Control Path** — Detects sensitive data that can be accessed through a path with weak or insufficient sharing controls.
- **Sensitive Workflow Uses Rejected Tools** — Detects sensitive data workflows that include tools that were rejected during governance review.
- **Sensitive Write Access Lacks Approved Governance** — Detects write-capable access to sensitive data that has not completed the required governance review and approval process.
- **Sensitive Access Lacks Approved Governance** — Detects access to sensitive data that has not completed the required governance review and approval process.
- **Sensitive Access Review Expired** — Detects access to sensitive data where the previous governance review is no longer current and must be renewed.

### Runtime OpenTelemetry Export[​](#runtime-opentelemetry-export)
Runtime logs can now be exported to a customer-configured OpenTelemetry destination. Export occurs directly from the Atlas data plane, allowing customers to send runtime activity to their observability or security platform without routing the logs through the Atlas control plane.

### AI Investigation Issue Detail Drawers[​](#ai-investigation-issue-detail-drawers)
Adds issue detail drawers to AI Investigation. Users can now open and review issue context, evidence, and related information without leaving the current investigation page.

### Runtime Issues Assess Tab[​](#runtime-issues-assess-tab)
Runtime issue details now include an Assess tab that explains why the issue was created. The tab presents the applicable trigger reasons and supporting context, making it easier for analysts to validate the finding and understand which parts of the activity contributed to the policy violation.

### Prompt Sensitive Content Masking[​](#prompt-sensitive-content-masking)
Sensitive content identified within prompts can now be masked before it is stored or displayed. This reduces unnecessary exposure of sensitive information while retaining enough surrounding context for investigation and audit workflows.

### AI Investigation Alert and Session Quarantines[​](#ai-investigation-alert-and-session-quarantines)
Adds quarantine actions to AI Investigation alert and session workflows. Users can now initiate and manage quarantines from these Session and Monitoring policies.

### Configurable Prompt Data Retention[​](#configurable-prompt-data-retention)
Adds configurable retention settings for prompt data. Administrators can now control how long prompt content is retained to better align the platform with organizational privacy, compliance, and investigation requirements.

### LlamaIndex Artifact Discovery from Repository Code Scanning[​](#llamaindex-artifact-discovery-from-repository-code-scanning)
Adds support for discovering LlamaIndex artifacts through repository code scanning. LlamaIndex agents, tools, workflows, and related components identified in source code can now be represented in inventory to improve visibility into agentic applications and their capabilities.
[PreviousGraphQL API Reference](/_docs/docs/)[NextWhat's New in V3.5.0](/_docs/docs/release_notes/350)- [Require Approval Action](#require-approval-action)- [Agent Manifest](#agent-manifest)- [Salesforce Agentforce Prompt Log Ingestion](#salesforce-agentforce-prompt-log-ingestion)- [Multiple Credentials for MCP Server Registration](#multiple-credentials-for-mcp-server-registration)- [Per-Token MCP Gateway Credentials](#per-token-mcp-gateway-credentials)- [Copilot Studio Connector Credential Discovery](#copilot-studio-connector-credential-discovery)- [Runtime Policy Consolidation](#runtime-policy-consolidation)- [Sensitive Data AI SPM Policies](#sensitive-data-ai-spm-policies)- [Runtime OpenTelemetry Export](#runtime-opentelemetry-export)- [AI Investigation Issue Detail Drawers](#ai-investigation-issue-detail-drawers)- [Runtime Issues Assess Tab](#runtime-issues-assess-tab)- [Prompt Sensitive Content Masking](#prompt-sensitive-content-masking)- [AI Investigation Alert and Session Quarantines](#ai-investigation-alert-and-session-quarantines)- [Configurable Prompt Data Retention](#configurable-prompt-data-retention)- [LlamaIndex Artifact Discovery from Repository Code Scanning](#llamaindex-artifact-discovery-from-repository-code-scanning)
