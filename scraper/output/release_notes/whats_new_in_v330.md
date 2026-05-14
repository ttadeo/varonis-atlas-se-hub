---
title: What's New in V3.3.0
url: https://prod.alltrue-be.com/_docs/docs/release_notes/330
section: release_notes
---

# What's New in V3.3.0

- [](/_docs/)- Release Notes- What's New in V3.3.0On this page# What's New in V3.3.0
**Release Date: May 8, 2026**

### Claude Code Runtime Enforcement[​](#claude-code-runtime-enforcement)
Adds plugin-based runtime enforcement for Claude Code. You can now apply runtime policies to Claude Code activity to provide governance, visibility, and enforcement for AI-assisted development workflows.

**Known issue:** IDE events shown in AI Investigation Sessions and Events may not display all captured events. These pages are being redesigned, and updated versions will be released soon to provide more complete visibility. The underlying event data is being stored, so no data will be lost when the updated visibility is added.

### Cursor Runtime Enforcement[​](#cursor-runtime-enforcement)
Adds hook-based runtime enforcement for Cursor. You can now configure Cursor hooks to send activity through runtime policies, enabling policy enforcement and auditability for Cursor-based AI coding workflows.

**Known issue:** IDE events shown in AI Investigation Sessions and Events may not display all captured events. These pages are being redesigned, and updated versions will be released soon to provide more complete visibility. The underlying event data is being stored, so no data will be lost when the updated visibility is added.

### Red Team Additional Strategies[​](#red-team-additional-strategies)
Adds new Red Team strategies to expand pentest coverage and provide more ways to evaluate AI application resilience across different attack approaches.

### Browser Chat Application Script Generation Agent[​](#browser-chat-application-script-generation-agent)
Adds a script generation agent for Browser Chat Application pentests. This helps generate browser interaction scripts for testing AI applications that are accessed through a web interface.

### AI Usage Policies[​](#ai-usage-policies)
Adds AI Usage Policies for tracking user AI activity passed through SASE integrations such as Cloudflare and Netskope. This includes a new default policy, catalog policies, and the ability to add custom AI services for activity tracking.

### AI Investigation Access Events[​](#ai-investigation-access-events)
Adds a new Access Events tab in AI Investigation for reviewing user AI activity collected through SASE integrations such as Cloudflare and Netskope.

### Island Browser Log Ingestion[​](#island-browser-log-ingestion)
Adds support for ingesting Island Browser logs. Island activity can now be processed through the platform to support AI usage visibility, runtime policy evaluation, and investigation workflows.

### Snowflake Discovery Updates[​](#snowflake-discovery-updates)
Adds updated Snowflake discovery capabilities, including support for new resource types and a new link authorization method.

**Upgrade note:** Existing Snowflake accounts must be reconnected using the new discovery method in order to access the new Snowflake resource types.

### STDIO MCP Server Registration[​](#stdio-mcp-server-registration)
Adds support for registering STDIO MCP servers, expanding the ways MCP servers can be represented and governed in the platform.

### MCP Server Registration with OAuth Credentials[​](#mcp-server-registration-with-oauth-credentials)
Adds support for registering MCP servers using OAuth-based credentials, enabling more secure and flexible authentication for MCP server integrations.

### LLM Endpoint Pentest Connection Detail Editing[​](#llm-endpoint-pentest-connection-detail-editing)
Adds the ability to edit connection details for LLM Endpoint pentest targets, making it easier to update pentest configurations without recreating the target.

### Red Team Default Templates[​](#red-team-default-templates)
Adds new default Red Team templates to help teams start pentests more quickly with preconfigured testing structures.

### Additional Red Team Pentest Details[​](#additional-red-team-pentest-details)
Adds new pentest detail fields to improve the information captured and used to generate test cases for dynamic Red Team assessments.

### VMCP Usability Improvements[​](#vmcp-usability-improvements)
Improves VMCP usability by adding support for effective views. You can now see the effective VMCP applied to a given endpoint after individual VMCPs are flattened and combined.
[PreviousGraphQL API Reference](/_docs/docs/)[NextWhat's New in V3.2.0](/_docs/docs/release_notes/320)- [Claude Code Runtime Enforcement](#claude-code-runtime-enforcement)- [Cursor Runtime Enforcement](#cursor-runtime-enforcement)- [Red Team Additional Strategies](#red-team-additional-strategies)- [Browser Chat Application Script Generation Agent](#browser-chat-application-script-generation-agent)- [AI Usage Policies](#ai-usage-policies)- [AI Investigation Access Events](#ai-investigation-access-events)- [Island Browser Log Ingestion](#island-browser-log-ingestion)- [Snowflake Discovery Updates](#snowflake-discovery-updates)- [STDIO MCP Server Registration](#stdio-mcp-server-registration)- [MCP Server Registration with OAuth Credentials](#mcp-server-registration-with-oauth-credentials)- [LLM Endpoint Pentest Connection Detail Editing](#llm-endpoint-pentest-connection-detail-editing)- [Red Team Default Templates](#red-team-default-templates)- [Additional Red Team Pentest Details](#additional-red-team-pentest-details)- [VMCP Usability Improvements](#vmcp-usability-improvements)
