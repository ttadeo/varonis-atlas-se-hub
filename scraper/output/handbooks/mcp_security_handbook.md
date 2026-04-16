---
title: MCP Security Handbook
url: https://playground.alltrue-be.com/_docs/docs/handbooks/mcp_security_handbook
section: handbooks
---

# MCP Security Handbook

- [](/_docs/)- Handbooks- MCP Security HandbookOn this page# MCP Security Handbook
Practical runbook for teams adopting MCP with Atlas's capabilities (Discovery → Catalog → Virtual MCPs → Gateway Enforcement → Monitoring).

## What this handbook is for[​](#what-this-handbook-is-for)
This handbook explains how to safely adopt MCP tools using Atlas's MCP Security Practices. It's written for engineering, security, and platform teams who need to:

- Identify which MCP servers are in use (including "shadow" MCPs)
- Understand what tools are being exposed to agents
- Approve and curate toolsets for specific workflows
- Enforce allowlisted tools at runtime (optional rollout)
- Monitor drift and investigate MCP-related incidents

## Who should use it[​](#who-should-use-it)
**Security / GRC teams**
Own MCP governance and risk decisions: review and approve MCP servers and tools, set risk and sensitivity posture, and monitor drift, unapproved exposure and usage, and quarantine events.

**Platform / AI infrastructure teams**
Operationalize the feature: configure and maintain MCP Inspector discovery, ensure inventory and catalog data stays current, and publish and manage Virtual MCPs that can be reused across teams and endpoints.

**Application / Agent developers**
Build with MCP safely: adopt approved MCP servers and Virtual MCP toolsets, keep integrations from becoming "shadow MCPs," and remediate issues triggered by tool drift or unapproved tool exposure and usage (e.g., updating VMCP selections or removing unintended tool definitions). Mitigate security concerns to unlock adoption.

## Key idea: MCP changes the security model[​](#key-idea-mcp-changes-the-security-model)
MCP can expand an agent's capabilities without a traditional deployment. A single external MCP URL can expose dozens of tools via `list_tools`, and that set can change over time. Atlas's MCP protections are designed to make MCP usage visible, governable, and (optionally) enforceable.

## Operating model (recommended)[​](#operating-model-recommended)
Use this as the "golden path" for teams adopting MCP.

### Step 1: Discover MCP servers in use[​](#step-1-discover-mcp-servers-in-use)
**Goal:** find MCP servers that exist today—especially remote servers connected through code.

What to do:

- Connect code repositories for agentic code scanning discovery
- Review the MCP Catalog for **Shadow MCP Servers** discovered via code scanning
- Confirm ownership: who is responsible for each MCP server and its usage
- For any production-impacting MCP server, require it to be in a reviewed state

Success criteria:

- All MCP servers used in production are represented in inventory
- Shadow MCPs have a clear owner and next step (inspect or remove)

### Step 2: Add MCPs to MCP Inspector (to get authoritative tool visibility)[​](#step-2-add-mcps-to-mcp-inspector-to-get-authoritative-tool-visibility)
**Goal:** move from "we know it exists" to "we know exactly what it exposes."

What to do:

- Configure the MCP server in the MCP Inspector
- Validate discovery status (connection healthy, last discovered updated)
- Review the tool list populated from inspection

Success criteria:

- All MCPs used in production have Inspector-based discovery enabled
- Tool lists are current and tracked via versioning

### Step 3: Review and govern MCPs in the Catalog[​](#step-3-review-and-govern-mcps-in-the-catalog)
**Goal:** ensure every MCP server and tool has an explicit governance posture.

What to do:

- For each MCP Server: set owner, environment, risk level, and sensitive flag (if applicable)
- For tools: approve or reject based on risk and expected use
- Watch for drift: new tools, schema changes, or description changes

Success criteria:

- MCP servers and tools are not "unreviewed by default" in production
- Drift events lead to explicit review, not silent acceptance

### Step 4: Create a Virtual MCP for each use case (tool allowlisting)[​](#step-4-create-a-virtual-mcp-for-each-use-case-tool-allowlisting)
**Goal:** expose only the tools required for a given endpoint or agent.

What to do:

- Create a Virtual MCP per major use case (e.g., "Release Management", "Support Triage")
- Add one or more MCP servers and select the specific tools needed
- Set a new-tool policy:

**Require Review** for production workflows
- **Auto-enable** only for low-risk dev/test workflows

Success criteria:

- Endpoints receive a bounded, purpose-built toolset
- New tools do not silently appear in critical workflows

### Step 5: Enable MCP Quarantine enforcement (optional rollout)[​](#step-5-enable-mcp-quarantine-enforcement-optional-rollout)
**Goal:** enforce that endpoints only receive allowlisted tools.

How it works:

- With the MCP Quarantine guardrail enabled, the gateway strips any tool definitions not in the allowlist before other guardrails and before the model call.

Rollout guidance:

- Start in **log / alert mode** to observe what would be stripped
- Promote to **quarantine mode** once Virtual MCP coverage is in place

Success criteria:

- Un-allowlisted tools are not exposed at runtime (when policy is on)
- Teams aren't surprised because rollout was staged and measurable

### Step 6: Monitor activity and respond to issues[​](#step-6-monitor-activity-and-respond-to-issues)
**Goal:** operationalize MCP governance.

What to monitor:

- Top tool invocations, most active endpoints
- Tools quarantined or stripped (if enforcement enabled)
- Nightly MCP issues:

Unknown remote MCP without inspection
- Unapproved tool exposure or usage
- Tool drift
- Dormant tools expanding surface area

How to respond:

- Drift / unapproved exposure → review tool changes and update approvals or Virtual MCPs
- Unknown remote MCP → configure inspector or remove integration
- Dormant tools → remove from tool definitions or VMCP to reduce attack surface

Success criteria:

- Issues are treated as a queue with owners and SLAs
- Catalog hygiene improves over time (fewer unknowns, less drift risk)

## Common scenarios and what to do[​](#common-scenarios-and-what-to-do)
### Scenario A: "We found a Shadow MCP Server in code scanning"[​](#scenario-a-we-found-a-shadow-mcp-server-in-code-scanning)
**What it means:** an MCP server is being used, but there is no authoritative visibility into its tools yet.

Do this:

- Assign an owner.
- Configure MCP Inspector discovery.
- Review tools and approve or reject them.
- Add approved tools to a Virtual MCP for the relevant endpoints.

### Scenario B: "A new tool appeared overnight"[​](#scenario-b-a-new-tool-appeared-overnight)
**What it means:** MCP tool surface expanded (supply-chain drift).

Do this:

- Review the tool diff (schema or description changes).
- Decide: approve, reject, or keep unreviewed.
- If production VMCPs use that MCP server, require explicit review before enabling the tool.
- If MCP Quarantine is enabled, validate whether the tool was exposed or stripped at runtime.

### Scenario C: "Unapproved tool usage issue triggered"[​](#scenario-c-unapproved-tool-usage-issue-triggered)
**What it means:** a tool was invoked that isn't approved, or drift created a new version not yet approved.

Do this:

- Identify which endpoint invoked it and why.
- Confirm whether it was expected behavior or suspicious.
- Update approvals and/or VMCP allowlist.
- If suspicious: enable MCP Quarantine (or tighten it) for the affected endpoint.

### Scenario D: "Tools are being stripped unexpectedly"[​](#scenario-d-tools-are-being-stripped-unexpectedly)
**What it means:** MCP Quarantine is active and the client is passing tools outside the allowlist.

Do this:

- Check which tools were stripped and which endpoint caused it.
- Decide whether to:

Add the tool to the endpoint's VMCP (if legitimate), or
- Fix the client configuration to stop sending it.

- Keep enforcement on; treat this as proof the allowlist is working.

## Best practices[​](#best-practices)

- **Treat third-party MCPs as untrusted by default**; approve narrowly and scope tightly.
- **Use Virtual MCPs as the default mechanism** for production endpoints (bounded toolsets).
- **Require Review** for new tools in production VMCPs to prevent silent expansion.
- **Adopt MCP Quarantine in stages**: log → alert → quarantine.
- **Close the loop on drift**: every new or changed tool should result in an explicit review outcome.
[PreviousUsing Quarantining APIs from Kong Konnect](/_docs/docs/platform_services/kong)[NextAI Investigation Handbook](/_docs/docs/handbooks/ai_investigation_handbook)- [What this handbook is for](#what-this-handbook-is-for)- [Who should use it](#who-should-use-it)- [Key idea: MCP changes the security model](#key-idea-mcp-changes-the-security-model)- [Operating model (recommended)](#operating-model-recommended)[Step 1: Discover MCP servers in use](#step-1-discover-mcp-servers-in-use)- [Step 2: Add MCPs to MCP Inspector (to get authoritative tool visibility)](#step-2-add-mcps-to-mcp-inspector-to-get-authoritative-tool-visibility)- [Step 3: Review and govern MCPs in the Catalog](#step-3-review-and-govern-mcps-in-the-catalog)- [Step 4: Create a Virtual MCP for each use case (tool allowlisting)](#step-4-create-a-virtual-mcp-for-each-use-case-tool-allowlisting)- [Step 5: Enable MCP Quarantine enforcement (optional rollout)](#step-5-enable-mcp-quarantine-enforcement-optional-rollout)- [Step 6: Monitor activity and respond to issues](#step-6-monitor-activity-and-respond-to-issues)- [Common scenarios and what to do](#common-scenarios-and-what-to-do)[Scenario A: "We found a Shadow MCP Server in code scanning"](#scenario-a-we-found-a-shadow-mcp-server-in-code-scanning)- [Scenario B: "A new tool appeared overnight"](#scenario-b-a-new-tool-appeared-overnight)- [Scenario C: "Unapproved tool usage issue triggered"](#scenario-c-unapproved-tool-usage-issue-triggered)- [Scenario D: "Tools are being stripped unexpectedly"](#scenario-d-tools-are-being-stripped-unexpectedly)- [Best practices](#best-practices)
