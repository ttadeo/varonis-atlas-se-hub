---
title: What's New in V3.1.5
url: https://prod.alltrue-be.com/_docs/docs/release_notes/315
section: release_notes
---

# What's New in V3.1.5

- [](/_docs/)- Release Notes- What's New in V3.1.5Export PDFOn this page# What's New in V3.1.5
**Release Date: March 27, 2026**

### Prompt Reader Role[​](#prompt-reader-role)
Introduces a new role that controls who can view prompt and response content across the platform. Users without this role can still investigate requests and issues using metadata, but protected text is masked and Datasets access is blocked. Administrators should ensure this role is assigned to users who need prompt visibility.

### Copilot Studio Agent Runtime Protection[​](#copilot-studio-agent-runtime-protection)
Adds runtime guardrail support for Microsoft Copilot Studio Agents using platform-native webhooks. Policies can now be applied directly to discovered agent resources, with configuration available from the same AI Runtime policies workflow and activity visible in investigation and runtime views just like other protected traffic.

### LiteLLM Generic Guardrail Plugin[​](#litellm-generic-guardrail-plugin)
Adds support for LiteLLM’s generic guardrail API so LiteLLM Gateway traffic can be evaluated by the platform’s runtime guardrails. These integrations can be configured from the same policy flow, managed like other protected runtime integrations, and observed throughout AI Runtime and AI Investigation.

### Expanded Agentic Guardrails for Tools[​](#expanded-agentic-guardrails-for-tools)
Introduces dedicated tool-aware guardrails for agentic workflows, including protections for PII, prompt injection, prompt leakage, code leakage, and banned substrings in tool definitions, tool calls, and tool responses. Existing guardrails are also expanded with more precise content-type coverage and clearer tagging.

### MCP Support Added[​](#mcp-support-added)
Introduces the first phase of MCP support, including MCP discovery, cataloging, posture checks, governance, Virtual MCPs, MCP Quarantine, activity monitoring, and drift detection. This provides customers with an initial control plane for understanding, approving, and enforcing MCP tool usage across agentic environments.

### User Invitation Management Improvements[​](#user-invitation-management-improvements)
Improves user onboarding with validation that prevents inviting scoped users without access, clearer expired-invite and no-access error pages, and a new Invitations tab for admins to view, resend, revoke, and copy pending invite links.

### AI Red Team[​](#ai-red-team)
Moves Pentest into a dedicated AI Red Team feature with its own dashboard, issues, and reports pages. Model Scan is now separated into its own tab under AI SPM, making offensive testing and model vulnerability workflows easier to navigate and manage independently.

### Prompt Export in Runtime Reports[​](#prompt-export-in-runtime-reports)
Adds prompt export support from the Runtime Reports page, making it easier to review and share prompt activity. Access follows the new Prompt Reader permission model, so only authorized users can export prompt content.

### System Audit Trail in Platform[​](#system-audit-trail-in-platform)
Moves the system audit trail out of OpenSearch and into the platform control plane. Audit logs now use platform-managed storage and APIs, with filtering, search, pagination, and retention handled directly in the product.

### AI360 Alerts and Risks Consolidation[​](#ai360-alerts-and-risks-consolidation)
Consolidates issues across the platform’s modules into the AI360 Alerts and Risk pages, delivering a more unified experience while simplifying navigation and investigation. Detail panels will follow in the next release, and feature-specific issues pages remain accessible.

### SaaS Vendor TPRM Assessment[​](#saas-vendor-tprm-assessment)
Adds a new set of SaaS Vendor TPRM assessment questions to help teams evaluate third-party vendors more consistently. The new questions expand coverage of vendor risk areas and support more structured third-party reviews.

### AI Runtime and AI Investigation Renaming[​](#ai-runtime-and-ai-investigation-renaming)
Renames AI Gateway to **AI Runtime** and AI Monitor to **AI Investigation** to reflect broader platform coverage beyond LLM gateway traffic. This release also improves prompt investigation workflows and consolidates AI Monitor policy management into the AI Runtime policies page.
[PreviousWhat's New in V3.1.6](/_docs/docs/release_notes/316)[NextWhat's New in V3.1.4](/_docs/docs/release_notes/314)- [Prompt Reader Role](#prompt-reader-role)- [Copilot Studio Agent Runtime Protection](#copilot-studio-agent-runtime-protection)- [LiteLLM Generic Guardrail Plugin](#litellm-generic-guardrail-plugin)- [Expanded Agentic Guardrails for Tools](#expanded-agentic-guardrails-for-tools)- [MCP Support Added](#mcp-support-added)- [User Invitation Management Improvements](#user-invitation-management-improvements)- [AI Red Team](#ai-red-team)- [Prompt Export in Runtime Reports](#prompt-export-in-runtime-reports)- [System Audit Trail in Platform](#system-audit-trail-in-platform)- [AI360 Alerts and Risks Consolidation](#ai360-alerts-and-risks-consolidation)- [SaaS Vendor TPRM Assessment](#saas-vendor-tprm-assessment)- [AI Runtime and AI Investigation Renaming](#ai-runtime-and-ai-investigation-renaming)
