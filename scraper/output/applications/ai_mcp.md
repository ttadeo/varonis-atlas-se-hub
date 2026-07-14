---
title: AI MCP
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_mcp
section: applications
---

# AI MCP

- [](/_docs/)- Applications- AI MCPExport PDFOn this page# AI MCP
## MCP Security[​](#mcp-security)
MCP Security helps you discover, review, govern, and control Model Context Protocol (MCP) usage across your environment. In Atlas, MCP Servers and their associated tools are added to inventory so they can participate in the same ownership, review, risk, and governance workflows used for other AI resources. The MCP experience is organized around six core areas: Catalog, Virtual MCPs, Activity, Policies, Issues, and Reports.

## **Why use MCP Security**[​](#why-use-mcp-security)
MCP allows agents and applications to discover and invoke tools dynamically. That flexibility makes it easier to expand agent capabilities, but it also creates new governance and security challenges. Teams need visibility into which MCP Servers are in use, what tools those servers expose, which tools have been reviewed, and which tools are actually allowed at runtime. MCP Security is designed to provide that visibility and control.

# **Key concepts**
## **MCP Server**[​](#mcp-server)
An MCP Server is a tool provider that an MCP client connects to in order to discover capabilities and invoke tools. In Atlas, MCP Servers are first-class inventory resources. They act as the parent resource for the tools, prompts, and MCP resources they expose.

## **Tool**[​](#tool)
A Tool is a callable capability exposed by an MCP Server. Tool records include metadata such as the tool name, description, parameters, schema, and version history so teams can review and govern them over time.

## **Shadow MCP**[​](#shadow-mcp)
A Shadow MCP represents MCP usage that has been detected but does not yet have sufficient visibility into the underlying MCP Server. In practice, this usually starts when code scanning discovers an MCP connection before that connection has been linked to a visible MCP Server or to a working MCP Inspector configuration. Shadow MCP is based on the visibility state of the connection, not simply on whether a server has been manually registered.

## **Virtual MCP**[​](#virtual-mcp)
A Virtual MCP, or VMCP, is a curated allowlist of approved tools. A VMCP can include tools from one or more MCP Servers and is used to define which tools are allowed for a given scope. VMCPs support draft and published versions so changes can be prepared safely before taking effect.

## **MCP Quarantine**[​](#mcp-quarantine)
MCP Quarantine is a runtime guardrail that enforces the allowlist defined by applicable Virtual MCPs. When enabled, it compares incoming tool definitions to the effective allowlist and strips tools that are not permitted before other guardrails run.

# **How MCP Security works**
## **Discover MCP usage**[​](#discover-mcp-usage)
Atlas identifies MCP usage through discovery workflows such as code scanning and MCP Inspector. Code scanning helps surface MCP connections and MCP Servers referenced in code. MCP Inspector acts like an MCP client: it connects to a configured MCP Server, performs discovery, and syncs the server and its exposed resources into inventory.

Because MCP Servers and tools are stored in inventory, they benefit from inventory-wide capabilities such as ownership, review status, risk classification, and inclusion in the AI-BOM.

## **Review MCP Servers and tools**[​](#review-mcp-servers-and-tools)
The Catalog gives you a centralized view of MCP Servers and their tools. From there, you can inspect metadata, review exposed tools, and open the related inventory records for deeper investigation. The Tool Catalog provides a flattened, cross-server view of tools for easier searching and review.

## **Build allowlists with Virtual MCPs**[​](#build-allowlists-with-virtual-mcps)
Virtual MCPs let you define a bounded set of tools for a workflow or target environment. Instead of exposing every tool from every connected server, you can select only the tools that should be available.

## **Enforce the allowlist at runtime**[​](#enforce-the-allowlist-at-runtime)
Once a VMCP has been published and applied to scope, MCP Quarantine can enforce its allowlist at runtime. The effective allowlist is flattened from all VMCPs that apply to the endpoint or other protected resource. If a tool is not on that allowlist, the guardrail can strip it before it reaches the model.

## **Monitor posture and activity over time**[​](#monitor-posture-and-activity-over-time)
MCP Activity, Policies, Issues, and Reports help you understand how MCP is being used, detect governance gaps, investigate problems, and export findings for follow-up.

# **Catalog**
The MCP Catalog is the main governance view for MCP Servers discovered across your environment. It helps you answer questions such as:

- Which MCP Servers are present in my environment?
- Are they internal or marketplace servers?
- What tools do they expose?
- Who owns them?
- Have they been reviewed?

The MCP Catalog provides a server-centric view of MCP usage. Each MCP Server can be opened to review its tools and metadata, including fields such as risk level, sensitive data access, discovery source, and review status. The Tool Catalog provides a tool-centric view across all discovered MCP Servers, making it easier to review tools independently of the MCP Server that exposes them.

Catalog data is shown within your current hierarchy scope, so the MCP Servers and tools you see depend on the organization or project currently selected in Atlas.

The Catalog is used for governance metadata such as ownership, risk, sensitivity, and review status. Connection details such as transport type, URL, and credentials are managed through MCP Server registration and configuration rather than in the Catalog.

## **Marketplace and Internal MCP Servers**[​](#marketplace-and-internal-mcp-servers)
Marketplace MCP Servers are provided by a third party. Internal MCP Servers are built and maintained by your organization. This distinction is used throughout MCP Security for governance and review workflows.

# **Shadow MCP**
The Shadow MCP page shows MCP connections that need additional visibility or follow-up. This workflow is especially important because code scanning often reveals that a team is using an MCP Server before the platform has been connected to that server for authoritative inspection.

## **When a connection appears as Shadow MCP**[​](#when-a-connection-appears-as-shadow-mcp)
A connection is treated as Shadow MCP when Atlas detects that it is being used but does not yet have sufficient visibility into the corresponding MCP Server. This can happen when:

- an MCP connection is discovered through code scanning but there is no corresponding visible MCP Server
- visibility depends on MCP Inspector and the inspection connection is failing

A connection is not considered Shadow MCP just because a server lacks inspector credentials. If Atlas already has sufficient visibility through another supported discovery path, that connection is not shadow.

## **Resolve a Shadow MCP**[​](#resolve-a-shadow-mcp)
From the Shadow MCP detail view, you can either:

- add it as a new MCP Server
- link it to an existing MCP Server already in inventory

Use **Add as New Server** when the MCP Server is not yet configured in Atlas. Use **Link to Existing Server** when the shadow connection corresponds to a server that has already been registered or discovered elsewhere in the platform. Linking the connection is what enables full posture and catalog visibility for that usage.

# **Register an MCP Server**
You can register an MCP Server from the Catalog. The registration flow is designed to test connectivity, capture metadata, assign scope, and create the server configuration used by MCP Inspector.

## **Connection type**[​](#connection-type)
During registration, you define whether the server is Marketplace or Internal, specify its transport type, configure authentication, and test the connection. The registration flow stores the server's configuration so the platform can perform discovery and keep inventory data up to date.

### **Transport types**[​](#transport-types)
Atlas supports three MCP transports. The transport is fixed at registration and determines which authentication options are available.

TransportDescriptionTypical use**HTTP** (Streamable)The current MCP transport. MCP Inspector POSTs JSON-RPC requests to a single URL and consumes the streaming response.Managed and self-hosted servers exposed over HTTPS. The default choice for production.**SSE** (Server-Sent Events)The earlier streaming transport. MCP Inspector opens a `GET` for the event stream and `POST` requests on a paired URL.Legacy MCP servers that haven't migrated to Streamable HTTP yet.**STDIO**The subprocess transport. Atlas spawns the MCP server as a child process and communicates over its stdin/stdout.Local MCP servers packaged as binaries or `npx` / `uvx` invocations — mirrors the Claude Desktop and Cursor format.
### **Authentication types**[​](#authentication-types)
The authentication options available during registration depend on the transport you selected.

AuthenticationHTTPSSESTDIOWhen to use**None**✓✓✓The server doesn't require client authentication.**API Key** (Bearer)✓✓—The server expects a static `Authorization: Bearer &lt;token&gt;` header on every request.**Environment Variable**——✓STDIO servers that read secrets from process environment variables (for example, `OPENAI_API_KEY`).**OAuth**✓✓—Vendors that implement RFC 7591 Dynamic Client Registration (Notion, Linear, …) or vendors where you have a pre-registered OAuth app (Atlassian, GitHub, Plaid, …).**AWS IAM (SigV4)**✓——MCP servers fronted by AWS IAM — most commonly Amazon Bedrock AgentCore runtimes, but also any server behind API Gateway with IAM authorization.
#### **API Key**[​](#api-key)
For HTTP and SSE servers that accept a static bearer token, paste the token under **API Key**. Atlas adds `Authorization: Bearer &lt;token&gt;` to every request. The token is stored encrypted and is not displayed back after submission.

#### **Environment Variable**[​](#environment-variable)
STDIO servers receive secrets through process environment variables. Paste the standard MCP launch configuration — the same JSON shape that Claude Desktop and Cursor use:

```
{
 "command": "uvx",
 "args": ["mcp-server-time", "--local-timezone", "UTC"],
 "env": { "OPENAI_API_KEY": "sk-..." }
}

```
Each `env` entry is stored as an encrypted secret and injected into the subprocess at runtime. Values inside `env` are not displayed back after submission. Arguments in `args` are sent verbatim; if you embed a recognizable secret prefix there, Atlas warns you and recommends moving the value into `env`.

#### **OAuth**[​](#oauth)
For HTTP and SSE servers protected by OAuth 2.1, Atlas handles the authorization-code flow on the customer's behalf. The setup varies by whether the vendor supports auto-registration:

- **Auto-registered (Notion, Linear, …)** — Leave **Client ID** and **Client secret** blank. Atlas calls the vendor's RFC 7591 Dynamic Client Registration endpoint and registers a new OAuth client per MCP server.
- **Pre-registered (Atlassian, GitHub, Plaid, …)** — Create an OAuth application at the vendor's developer console, register the Atlas callback URL shown in the form, then paste the resulting client ID and client secret.

For vendors that don't expose RFC 9728 / RFC 8414 discovery (or that implement non-standard variants), an **Advanced OAuth configuration** disclosure lets you override the authorization URL, token URL, registration URL, and scope per server. Discovery still runs and Atlas merges your overrides on top, per field.

#### **AWS IAM (SigV4)**[​](#aws-iam-sigv4)
For MCP servers fronted by AWS IAM — most commonly Amazon Bedrock AgentCore — Atlas signs each request with AWS Signature V4. Choose how Atlas obtains the AWS credentials used for signing:

- **Access Key** — Paste long-lived AWS access keys (with an optional session token for temporary credentials).
- **Assume Role** — Provide an IAM role ARN in your AWS account. Atlas calls `sts:AssumeRole` on each refresh window. The role must trust the Atlas platform account, carry the required tag, and grant the relevant invoke permissions — see [Setting up an IAM role for AWS IAM (SigV4)](#setting-up-an-iam-role-for-aws-iam-sigv4) below for the full template.

For Amazon Bedrock AgentCore servers, you can paste the **agent runtime ARN** instead of constructing the invocation URL manually. Atlas builds the invocation URL with the ARN correctly percent-encoded and pre-fills the AWS region from the ARN's region segment. The URL and region fields remain editable afterward, so you can still target a specific runtime endpoint qualifier or override either value if needed.

### **Setting up an IAM role for AWS IAM (SigV4)**[​](#setting-up-an-iam-role-for-aws-iam-sigv4)
The **Assume Role** credential mode for [AWS IAM (SigV4)](#aws-iam-sigv4) requires you to create an IAM role in your AWS account that Atlas can assume. The role must include:

- A **trust relationship** allowing the Atlas platform AWS account to assume it.
- **Permissions** to invoke the target MCP runtime (for example, `bedrock-agentcore:InvokeAgentRuntime` for Bedrock AgentCore servers).
- The **required tag** `varonis:atlas-mcp-sigv4-assume=true` — see [Required role tag](#required-role-tag) below for the full rationale.

The role name does not matter.

#### **Required role tag**[​](#required-role-tag)
Add the following tag to the role:

`varonis:atlas-mcp-sigv4-assume=true`

The Atlas platform's `sts:AssumeRole` IAM policy is scoped by `iam:ResourceTag` rather than by wildcard `Resource`, so AWS STS rejects any AssumeRole call where the target role is missing this tag. The check happens at the STS layer in AWS — no Atlas application code is involved. The result is that a compromised Atlas worker can only assume customer roles you've explicitly opted in to this flow, never arbitrary roles that happen to trust the platform account for other reasons.

This parallels the `varonis:atlas-bedrock-assume=true` convention used for [AWS Bedrock LLM endpoints](/_docs/docs/providers/aws_bedrock); the tags are separate so each feature's scope stays independent.

#### **Example trust relationship**[​](#example-trust-relationship)
```
{
 "Version": "2012-10-17",
 "Statement": [
 {
 "Effect": "Allow",
 "Principal": {
 "AWS": "arn:aws:iam::&lt;ATLAS_PLATFORM_ACCOUNT_ID&gt;:root"
 },
 "Action": "sts:AssumeRole"
 }
 ]
}

```
Replace `&lt;ATLAS_PLATFORM_ACCOUNT_ID&gt;` with the Atlas control-plane AWS account ID provided for your deployment.

#### **Example permission policy (Bedrock AgentCore)**[​](#example-permission-policy-bedrock-agentcore)
For Bedrock AgentCore servers, attach a policy that allows `InvokeAgentRuntime` on the runtime ARNs you want Atlas to reach. The example below is the minimal policy verified end-to-end against an AgentCore runtime:

```
{
 "Version": "2012-10-17",
 "Statement": [
 {
 "Effect": "Allow",
 "Action": [
 "bedrock-agentcore:InvokeAgentRuntime"
 ],
 "Resource": [
 "arn:aws:bedrock-agentcore:&lt;REGION&gt;:&lt;ACCOUNT_ID&gt;:runtime/*"
 ]
 }
 ]
}

```
Replace `&lt;REGION&gt;` with the AWS region of your AgentCore runtimes (for example, `us-west-2`) and `&lt;ACCOUNT_ID&gt;` with your AWS account ID. Narrow the `Resource` list to specific runtime IDs (for example, `runtime/server-abc123`) if you want to limit which runtimes Atlas can invoke through this role.

Two cases require extending the example:

- If your agents are invoked with end-user identity context, add `bedrock-agentcore:InvokeAgentRuntimeForUser` to the `Action` list.
- If you target a named runtime endpoint qualifier (anything other than the default), add `arn:aws:bedrock-agentcore:&lt;REGION&gt;:&lt;ACCOUNT_ID&gt;:runtime/*/runtime-endpoint/*` to the `Resource` list.

For MCP servers behind API Gateway with IAM authorization, replace the action and resource with the appropriate API Gateway invoke permission (`execute-api:Invoke` on `arn:aws:execute-api:&lt;REGION&gt;:&lt;ACCOUNT_ID&gt;:&lt;API_ID&gt;/&lt;STAGE&gt;/&lt;METHOD&gt;/&lt;RESOURCE&gt;`).

#### **Configuring the role in Atlas**[​](#configuring-the-role-in-atlas)
Once the role exists with the trust relationship, the required tag, and the invoke permissions in place, paste the role ARN into the **IAM Role ARN** field on the MCP server registration form. The first **Test Connection** attempt exercises the `sts:AssumeRole` round-trip and the runtime invocation in sequence; if the trust doesn't allow the Atlas account, the role is missing the tag, or the role lacks the invoke permission, AWS surfaces the corresponding error and the form shows it inline so you can correct the role and retry without leaving the page.

## **Scope**[​](#scope)
When registering an MCP Server, you assign it to the relevant projects. Scope determines which projects and organizations the MCP Server belongs to in Atlas. Assign the server to the locations where it is used so it appears in the correct inventory, catalog, and governance views.

## **What happens after registration**[​](#what-happens-after-registration)
After an MCP Server is registered, Atlas uses MCP Inspector to connect to the server and perform discovery. MCP Inspector behaves like an MCP client: it connects to the server, initializes the session, and retrieves the server's exposed capabilities. Atlas then syncs the MCP Server and its discovered tools into inventory, and when available, also syncs prompts and MCP resources. These discovered items are linked to the MCP Server so they can be reviewed and governed through the Catalog. Atlas uses the saved configuration to repeat discovery over time, helping keep inventory current and making it possible to identify changes to the server and its exposed tools. Registering an MCP Server provides visibility and governance context, but it does not by itself allow the server's tools at runtime. Runtime allowlisting is controlled separately through Virtual MCPs and MCP Quarantine.

After an MCP Server is registered, it can be managed from the Inventory Configuration page using the same operational workflows used for other configured assets in Atlas. This includes viewing and updating configuration details, monitoring discovery status, and reviewing the most recent discovery results.

# **Virtual MCPs**
Virtual MCPs are used to create and manage MCP tool allowlists. They allow you to define which tools are permitted for a given workflow or protected resource. VMCPs are especially useful when you want to reduce tool sprawl, create a reusable approved toolset, or ensure that only reviewed tools are available at runtime.

## **Create a Virtual MCP**[​](#create-a-virtual-mcp)
When creating a VMCP, you provide basic metadata such as name and description, then assign scope. After the VMCP is created, you can add MCP Servers and enable specific tools from those servers. You can also add individual custom tools where supported by your environment.

## **VMCP scope**[​](#vmcp-scope)
Scope determines where a Virtual MCP is enforced. A VMCP assigned at a broader level applies to the resources beneath that level, while a VMCP assigned more narrowly applies only to the selected resources. The effective allowlist for a resource is built from all applicable VMCPs.

## **Draft and published versions**[​](#draft-and-published-versions)
VMCPs use a draft and published workflow. Changes can be made in draft form without affecting runtime behavior. Those changes only take effect after the new version is published. This allows teams to prepare and review updates before enforcement changes are applied.

## **Add MCP Servers and tools to a VMCP**[​](#add-mcp-servers-and-tools-to-a-vmcp)
Within a VMCP, you can add MCP Servers and then choose which tools from those servers should be enabled. The per-server view lets you review the server, inspect the available tools, and toggle specific tools on or off.

## **Effective tools**[​](#effective-tools)
The Effective Tools view shows the complete set of tools currently allowed by a VMCP. This is useful for validating what a VMCP will contribute before or after publication.

## **Tool Update Handling**[​](#tool-update-handling)
For each MCP Server included in a Virtual MCP, you can choose how newly discovered tools are handled. **Auto-Enable** automatically adds newly discovered tools from that server to the VMCP's allowed toolset. **Require Review** keeps newly discovered tools out of the allowed toolset until they have been reviewed and explicitly enabled.

MCP Server and tool approval status also affects what can be allowed. MCP Servers and tools that are not approved are not allowed by default and cannot be included in the effective allowlist until they are approved.

# **Runtime enforcement with MCP Quarantine**
MCP Quarantine is a policy offered in the Runtime Protection Policies page that enforces Virtual MCP allowlists at runtime. When enabled, it reviews the tool definitions included in a request and compares them to the effective allowlist for the protected resource. When the Strip (Modify) action is configured, tools that are not allowed are removed before the request is passed to the model or evaluated by other guardrails.

MCP Quarantine runs early in the runtime protection flow so that downstream guardrails evaluate only the tools that remain available after allowlist enforcement. This helps ensure that runtime protection reflects the actual tool set exposed to the model.

The effective allowlist is built from all applicable Virtual MCPs. If more than one VMCP applies to the same resource, the allowlist is additive: a tool is allowed if it is approved and included in any VMCP that applies to that resource. Because VMCPs can be assigned at different levels of the hierarchy, runtime behavior reflects both direct and inherited scope.

MCP Quarantine uses the allowlist defined by Virtual MCPs, but the allowlist itself is managed separately through VMCP configuration. This means teams can review MCP Servers and tools, define which tools should be allowed, assign scope, and then rely on MCP Quarantine to enforce those decisions consistently at runtime.

## **What MCP Quarantine checks**[​](#what-mcp-quarantine-checks)
At runtime, MCP Quarantine checks whether the tools presented to the model are part of the effective allowlist for that resource. If a tool is not approved through the applicable Virtual MCPs, it is not made available to the model. This helps reduce tool sprawl, limit unintended capability exposure, and ensure that only reviewed tools are available at runtime.

# **Activity**
The Activity page provides operational visibility into MCP usage. It is designed to help teams monitor MCP Servers, tool invocation patterns, quarantined tools, active endpoints, and token usage over time. Activity views are scoped to the selected hierarchy so the data shown reflects the organization or project currently in context.

Use Activity to:

- monitor overall MCP usage
- identify the most active endpoints
- review the most popular tools
- understand which tools are being quarantined
- observe usage trends over time

**What you can see on this page**

**Summary**

Shows the current number of MCP Servers and tools in scope, including how many are standard versus shadow.

**Tool Activity**

Shows the total number of tools observed in the selected time range and breaks them down by allowed versus quarantined tools.

**Tool Activity Timeline**

Shows how MCP tool activity changes over time, including both allowed and quarantined activity.

**Most Active Tool Calling Endpoints**

Highlights the endpoints with the highest volume of MCP tool activity in the selected time range.

**Most Popular Tools**

Shows which tools are being called most often and which endpoints are calling them.

**Most Quarantined Tools**

Shows the tools most frequently affected by MCP Quarantine. Depending on the selected tab, this can reflect quarantined tool calls or quarantined tool definitions.

**Token Usage**

Shows token consumption associated with MCP activity, broken down by tool definitions, tool responses, and tool calls.

# **Policies**
Policies define the governance checks used to detect MCP-related risks. Examples include Shadow MCP detection, tool drift, unreviewed marketplace MCP Servers, new tools added to approved servers, failed inspections, duplicate tool names, and governance metadata gaps.

## **Policy inheritance**[​](#policy-inheritance)
Policies follow the same inheritance model used elsewhere in the platform. A policy enabled at a broader level, such as All Organizations, applies to the child organizations and projects beneath that scope unless it is changed at a lower level. This lets teams define MCP governance centrally while still supporting lower-level administration where needed.

## **Supported MCP Policies**[​](#supported-mcp-policies)
**Detect Shadow MCP Servers**

Identifies MCP connections that have been detected in use but do not yet have sufficient visibility into the underlying MCP Server. This helps surface MCP usage that should be linked, registered, or reviewed before it becomes part of the approved environment.

**Detect MCP Tool Drift**

Identifies changes to an MCP tool's definition, such as its name, description, or input schema. This helps teams detect when a previously known tool has changed and may need to be reviewed again.

**Detect Unreviewed Marketplace MCP Servers**

Identifies marketplace MCP Servers that have not yet completed review in the Catalog. This helps teams find third-party MCP Servers that may introduce new capabilities before they have been properly governed.

**Detect New Tools Added to Approved MCP Servers**

Identifies newly discovered tools added to an MCP Server that has already been approved. This helps prevent capability expansion from going unnoticed after a server has already been reviewed.

**Alert on Failed MCP Inspections**

Identifies MCP Servers whose inspection runs are failing. This helps teams find discovery gaps that may reduce visibility into the server and its exposed tools.

**Detect Duplicate Tool Names Across MCP Servers**

Identifies tools that share the same name across different MCP Servers. This helps surface naming collisions that may create confusion during review, investigation, or allowlist management.

**Detect Marketplace MCP Auto-Enable in VMCPs**

Identifies Virtual MCP configurations where a marketplace MCP Server is set to auto-enable newly discovered tools. This helps highlight cases where third-party tool expansion could occur without explicit review.

**Detect Sensitive Data Access Without Owner or Risk Label**

Identifies MCP Servers marked as having sensitive data access that are missing important governance metadata such as ownership or risk classification. This helps ensure sensitive MCP usage has the minimum context needed for review and accountability.

# **Issues**
The Issues page tracks MCP governance findings and posture gaps. Issues are linked to the affected MCP resource, such as an MCP connection, MCP Server, or tool, so teams can move directly from the finding to the underlying object.

Examples of findings that can appear here include:

- Shadow MCP Server detected
- MCP tool drift detected
- Unreviewed marketplace MCP Server detected
- Duplicate tool name collision detected

Use Issues to:

- investigate posture problems
- prioritize remediation
- track governance gaps over time
- move directly to the affected MCP resource

# **Reports**
The Reports area lets you export MCP issue history for analysis, remediation tracking, or sharing with stakeholders. Reporting is centered on issue-based export workflows.

# **Recommended workflow**
A typical governance workflow for MCP Security looks like this:

- Review the Catalog to understand which MCP Servers and tools are present in your environment.
- Investigate the Shadow MCP page to find MCP connections that need visibility or linking.
- Register new MCP Servers or link Shadow MCPs to existing servers so Atlas can collect authoritative visibility.
- Review server and tool metadata, including ownership, risk, and sensitivity.
- Create a VMCP for each major workflow and enable the tools that should be allowed.
- Assign VMCP scope so the allowlist applies to the correct resources.
- Publish the VMCP and validate the effective tools.
- Enable MCP Quarantine to enforce the allowlist at runtime.
- Use Activity, Policies, Issues, and Reports to monitor usage and maintain posture over time.
[PreviousAI Runtime](/_docs/docs/applications/ai_gateway)[NextAI Investigation](/_docs/docs/applications/ai_monitor)- [MCP Security](#mcp-security)- [**Why use MCP Security**](#why-use-mcp-security)- [**MCP Server**](#mcp-server)- [**Tool**](#tool)- [**Shadow MCP**](#shadow-mcp)- [**Virtual MCP**](#virtual-mcp)- [**MCP Quarantine**](#mcp-quarantine)- [**Discover MCP usage**](#discover-mcp-usage)- [**Review MCP Servers and tools**](#review-mcp-servers-and-tools)- [**Build allowlists with Virtual MCPs**](#build-allowlists-with-virtual-mcps)- [**Enforce the allowlist at runtime**](#enforce-the-allowlist-at-runtime)- [**Monitor posture and activity over time**](#monitor-posture-and-activity-over-time)- [**Marketplace and Internal MCP Servers**](#marketplace-and-internal-mcp-servers)- [**When a connection appears as Shadow MCP**](#when-a-connection-appears-as-shadow-mcp)- [**Resolve a Shadow MCP**](#resolve-a-shadow-mcp)- [**Connection type**](#connection-type)[**Transport types**](#transport-types)- [**Authentication types**](#authentication-types)- [**Setting up an IAM role for AWS IAM (SigV4)**](#setting-up-an-iam-role-for-aws-iam-sigv4)- [**Scope**](#scope)- [**What happens after registration**](#what-happens-after-registration)- [**Create a Virtual MCP**](#create-a-virtual-mcp)- [**VMCP scope**](#vmcp-scope)- [**Draft and published versions**](#draft-and-published-versions)- [**Add MCP Servers and tools to a VMCP**](#add-mcp-servers-and-tools-to-a-vmcp)- [**Effective tools**](#effective-tools)- [**Tool Update Handling**](#tool-update-handling)- [**What MCP Quarantine checks**](#what-mcp-quarantine-checks)- [**Policy inheritance**](#policy-inheritance)- [**Supported MCP Policies**](#supported-mcp-policies)
