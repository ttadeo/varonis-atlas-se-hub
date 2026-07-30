---
title: Runtime Protection
url: https://prod.alltrue-be.com/_docs/docs/coding_agent_protection/runtime_protection
section: coding_agent_protection
---

# Runtime Protection

- [](/_docs/)- [Coding Agent Protection](/_docs/docs/coding_agent_protection/overview)- Runtime ProtectionExport PDFOn this page# Runtime Protection
Atlas applies runtime policy to coding-agent activity through a hook-based integration. When a coding agent runs — submitting prompts, calling tools, reading files, or producing responses — Atlas evaluates each action against your configured AI Runtime policies and can block the action, modify its content, or generate an audit record. This page covers how the hooks work, how to configure them, and which events and actions each agent supports. For the broader context of Coding Agent Protection, see the [Coding Agent Protection overview](/_docs/docs/coding_agent_protection/overview).

Each supported coding agent has its own configuration guide:

- [Cursor](/_docs/docs/coding_agent_protection/runtime_protection/cursor)
- [Claude Code](/_docs/docs/coding_agent_protection/runtime_protection/claude_code)
- [VS Code](/_docs/docs/coding_agent_protection/runtime_protection/vs_code)
- [GitHub Copilot](/_docs/docs/coding_agent_protection/runtime_protection/github_copilot)
- [OpenAI Codex](/_docs/docs/coding_agent_protection/runtime_protection/openai_codex)
- [Kiro CLI](/_docs/docs/coding_agent_protection/runtime_protection/kiro_cli)
- [Devin CLI](/_docs/docs/coding_agent_protection/runtime_protection/devin_cli)
- [Devin Desktop](/_docs/docs/coding_agent_protection/runtime_protection/devin_desktop)
- [Google Antigravity](/_docs/docs/coding_agent_protection/runtime_protection/google_antigravity)

## How it works[​](#how-it-works)
Coding agent integrations use a hook-based architecture. Each supported tool provides a hooks system that invokes an external script at key points in the agent workflow — before a prompt is submitted, before or after a tool runs, when a file is read, and when the agent produces a response.

When Atlas is configured as the hook target:

- The coding agent triggers a hook event (for example, a user submits a prompt).
- The hook sends the event payload to the Atlas data plane endpoint.
- Atlas evaluates the event against all applicable AI Runtime policies on the data plane.
- Atlas returns a response — allow, block, or modify — and the coding agent enforces the decision.
- The event is recorded in the activity log for audit and monitoring.

All policy evaluation happens on the customer data plane. No unencrypted LLM data leaves your account. For details on how data is encrypted, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

This page covers hook-based runtime enforcement for live coding-agent sessions. Atlas also offers a separate capability that discovers agentic coding artifacts — agent definitions, prompts, tools, and MCP servers — by scanning source repositories. That discovery workflow is distinct from the hook-based integration described here and does not depend on installing hooks in a developer environment.

## Prerequisites[​](#prerequisites)
Before setting up a coding agent integration, verify that you have:

- Access to **Inventory** in Atlas
- Permission to manually add new technology resources
- Permission to configure or inherit AI Runtime policies
- Access to the coding agent environment where hook files will be installed
- An Atlas data plane endpoint reachable from the coding agent environment over HTTPS
- A deployment plan for whether hooks will be installed for a single user or distributed across an organization

### Script runtime tooling[​](#script-runtime-tooling)
Script-based hooks run with tooling already present on the developer machine. Confirm the environment you plan to select has what its script needs:

- **macOS / Linux — Bash** — `bash`, with `curl` and `jq` available on the `PATH`. `curl` ships with macOS and most Linux distributions; `jq` is preinstalled on macOS 15 (Sequoia) and later, but is not present on macOS 14 or earlier or on minimal Linux images — install it there if it is missing. If `curl` or `jq` is absent, the hook logs a warning and fails open — agent activity continues without Atlas evaluation.
- **macOS / Linux — Python** and **Windows — Python** — Python 3 only; the script uses just the standard library, so there are no packages to install. On Windows the hook launches with the `py` launcher.
- **Windows — PowerShell** — Windows PowerShell 5.1 or later, built into Windows; it uses the built-in web client, so no `curl` or `jq` is required.

The **Claude Plugin** scope has no environment selector — it requires Node.js on the developer machine instead.

## Authenticate the hook script[​](#authenticate-the-hook-script)
The hook script authenticates with Atlas using an API key. Configure the key before verifying the integration.

**Option 1: `ai-atlas.conf` (recommended)**

The **Configure Runtime** drawer generates an `ai-atlas.conf` file alongside the hook script. It is pre-filled with the webhook URL and endpoint identifier, and carries an API-key placeholder. Install it next to the hook script (the script reads `ai-atlas.conf` from its own directory) and replace the placeholder with your key:

```
AI_ATLAS_API_KEY=&lt;YOUR-API-KEY&gt;

```
To keep the file elsewhere, point the `AI_ATLAS_CONFIG` environment variable at its full path. See [Hook configuration reference](#hook-configuration-reference-ai-atlasconf) for everything else the file can configure.

**Option 2: Environment variable**

Export the API key in your shell environment:

```
export AI_ATLAS_API_KEY=&lt;YOUR-API-KEY&gt;

```
An `AI_ATLAS_*` environment variable always overrides the same key in a configuration file. If no API key is found through any method, the script fails open and the coding agent continues without Atlas policy evaluation.

## Configure the runtime integration[​](#configure-the-runtime-integration)
After you create a resource, generate its hook configuration from the **Configure Runtime** drawer. The same drawer is used for every coding agent — you choose the agent as the provider — so these steps apply to every supported coding agent.

- Go to **AI Runtime** &gt; **Policies**.
- Click **Configure Runtime** to open the **AI Runtime Configuration** drawer.
- Select the **Provider** that matches your coding agent (for example, **Cursor** or **Claude Code**).
- Select the **Resource/Endpoint** — the resource you created for this integration.
- Select the **Scope** that matches how you intend to deploy the hooks. The available scopes depend on the provider (for example, project-level, user-level, **Managed Settings** for an organization-wide Claude Code deployment, or **Claude Plugin** for a downloadable plugin bundle).
- For script-based scopes, select the **Environment** that matches the developer machines: **macOS / Linux — Bash**, **macOS / Linux — Python**, **Windows — PowerShell**, or **Windows — Python**.
- The drawer generates the configuration for that provider, resource, scope, and environment and shows it in code blocks. Use the copy button on each block; click **View All** to see the full configuration. Plugin-bundle scopes also offer a zip download.

Depending on the provider and scope, the drawer produces one of the following:

- **Script-based hooks** — a hook configuration file (such as `hooks.json` or `ai-atlas.json`) with a ready-to-use launch command, the hook script for the selected environment (`ai-atlas-hook.sh`, `ai-atlas-hook.py`, or `ai-atlas-hook.ps1`), and an `ai-atlas.conf` file. The launch command takes no arguments — all integration-specific values (your Atlas data plane webhook URL, your endpoint identifier, and an API-key placeholder) live in `ai-atlas.conf`, which you install next to the script.
- **A settings block** — a single configuration block (such as the Claude Code managed-settings block) that you paste into the agent's configuration file; it embeds the webhook URL and endpoint identifier directly.
- **A plugin bundle** — a downloadable zip (Claude Code) containing the plugin files plus `ai-atlas.conf`.

Each agent's configuration guide (listed at the top of this page) lists what it produces and where to install it.

The AI Runtime policies that evaluate this activity are managed on the **AI Runtime** &gt; **Policies** page. Policies can be inherited from a parent scope, applied directly to the resource, or overridden where more specific behavior is required. Typical policies include controls for prompt inspection, sensitive data exposure, unsafe tool usage, file access, and agent response evaluation.

### Get your firewall API key[​](#get-your-firewall-api-key)
The hook configuration authenticates to Atlas with a firewall API key. To obtain one:

- Go to **Admin Console** &gt; **Permissions** &gt; **API Keys**.
- Click **Add API Key**.
- Give the key a name and select the type **Firewall Proxy**.
- Copy the generated key value from the **Key** column.

How you apply the key depends on the kind of configuration the drawer produced:

- **Script-based hooks and plugin bundles** read the key as `AI_ATLAS_API_KEY` — replace the `&lt;API Key&gt;` placeholder in the generated `ai-atlas.conf`, or export it as an environment variable. See [Authenticate the hook script](#authenticate-the-hook-script).
- **HTTP / managed-settings hooks** (a settings block, such as the Claude Code managed-settings configuration) carry the key in the configuration itself as `AI_ATLAS_KEY`, alongside the endpoint identifier as `AI_ATLAS_IDENTIFIER`; the hook entries send these as the `X-API-KEY` and `X-VARONIS-ENDPOINT-IDENTIFIER` headers. Replace the placeholder key value in the copied configuration with your firewall API key.

## Hook configuration reference (ai-atlas.conf)[​](#hook-configuration-reference-ai-atlasconf)
Script-based hooks and plugin bundles read their settings from the `ai-atlas.conf` file next to the hook script (override the location with the `AI_ATLAS_CONFIG` environment variable). Every key can also be set as an environment variable of the same name; the environment variable wins. Boolean keys accept `1`/`true` and `0`/`false` (case-insensitive).

KeyPurpose`AI_ATLAS_API_URL`The Atlas webhook this integration posts hook events to (pre-filled).`AI_ATLAS_ENDPOINT_IDENTIFIER`Identifies this integration's endpoint in Atlas (pre-filled).`AI_ATLAS_API_KEY`Your write-only Atlas firewall API key. Replace the `&lt;API Key&gt;` placeholder.`AI_ATLAS_USER_ID`User attribution sent to Atlas. Defaults to the OS username (`$USER` / `$USERNAME`).`AI_ATLAS_USER_EMAIL`User email attribution sent to Atlas. Set to override auto-detection.`AI_ATLAS_PULL_CLAUDE_EMAIL`Claude Code only. Pull the signed-in Claude user's email automatically (from the `CLAUDE_CODE_USER_EMAIL` environment variable, then `~/.claude.json`). Defaults to `true`; set to `false` to disable auto-detection. An explicit `AI_ATLAS_USER_EMAIL` is always sent regardless.`AI_ATLAS_CA_FILE`Path to a PEM bundle for a TLS-inspecting proxy. The certificate is trusted in addition to the system roots.`AI_ATLAS_INSECURE`Set to `true` to skip TLS verification (last resort; not recommended).`AI_ATLAS_DEBUG`Set to `true` for verbose hook logging — including the full event payload and webhook response — to the debug log file. The log can contain sensitive content (prompts, tool arguments, file contents); restrict access to the log file, enable this only while troubleshooting, and delete the log afterward.`AI_ATLAS_DEBUG_LOG`Debug log file path. Defaults to `~/ai-atlas-debug.log`.
## Capability matrices[​](#capability-matrices)
The following matrices show which hook events and enforcement actions each supported agent provides. Per-agent setup details live on each agent's configuration guide (listed at the top of this page).

### Monitored activity[​](#monitored-activity)
After installation, hooks automatically send events to Atlas at key points in the agent workflow. The event types are:

- **Prompt submission** — evaluates user input before the agent processes it.
- **Pre-tool use** — evaluates tool calls before execution.
- **Post-tool use** — evaluates tool output after execution.
- **File read** — evaluates file content before the agent reads it.
- **Agent response** — evaluates the agent's final response for monitoring and audit.
- **Agent thought** — monitors agent reasoning activity where available.

The following table shows which events each tool supports.

ToolPrompt submissionPre-tool usePost-tool useFile readAgent responseAgent thoughtCursor✓✓✓✓✓✓Claude Code✓✓✓—✓—VS Code✓✓✓———GitHub Copilot✓✓✓———OpenAI Codex✓✓✓—✓—Kiro CLI✓✓✓—✓—Devin CLI✓✓✓—✓—Devin Desktop✓✓✓✓✓—Google Antigravity—✓————
### Action support by integration[​](#action-support-by-integration)
Not all enforcement actions (block, modify) are available for every hook event on every integration. The following table shows which actions each integration supports.

ToolPrompt submission: BlockPre-tool use: BlockPre-tool use: Modify inputPost-tool use: BlockPost-tool use: Modify outputCursor✓✓✓—MCP tools onlyClaude Code✓✓✓✓✓VS Code✓✓✓✓—GitHub Copilot—✓✓—✓OpenAI Codex✓✓✓✓—Kiro CLI—✓ †———Devin CLI✓✓✓——Devin Desktop✓✓———Google Antigravity—✓———
† Atlas applies this action, but the agent does not currently honor it — the block or modification is recorded in Atlas while the agent proceeds with the original behavior. This is a current third-party agent limitation, not an Atlas one; see **Known limitations** below and on the agent's configuration guide.

The matrix above covers block and modify support. **Require Approval** — a policy action that holds an operation for a person to approve rather than blocking or modifying it — is configured on the AI Gateway; see [Policy Actions](/_docs/applications/ai_gateway#policy-actions) for what it does and how a held operation resolves. Whether a specific coding-agent integration can enforce a Require Approval hold depends on that integration's hook capabilities; the same per-integration hook constraints described below apply.

Holding an operation for approval requires the agent to expose a native ask/confirm response on the hook event. Only **pre-tool use** can, and only on integrations whose pre-tool-use hook provides one — post-tool use is an allow-or-block channel on every integration, and prompt submission, file read, agent response, and agent thought cannot hold either. Where an event cannot hold, Require Approval currently falls back to blocking: the operation is denied rather than held for a decision. Pre-tool use is therefore the event to target when you want a hold rather than a block.

#### Known limitations[​](#known-limitations)

- **Cursor — post-tool use cannot block.** Cursor's post-tool use hook does not support a block response. Atlas can add context or modify MCP tool output, but cannot prevent the agent from continuing with the tool result.
- **GitHub Copilot — prompt submission cannot block.** GitHub Copilot does not process the hook response for prompt submission events. Atlas still records the event for audit purposes, but block actions on prompts are not enforced. Use pre-tool use policies to block specific tool calls instead.
- **GitHub Copilot — post-tool use cannot block but can modify.** GitHub Copilot's post-tool use hook does not support a block response. Instead, Atlas can modify the tool result (for example, redacting sensitive data) or inject additional context that the model sees alongside the tool output.
- **VS Code — post-tool use cannot modify output.** VS Code does not expose an outbound rewrite channel for tool output. If a guardrail needs to address tool output content, use pre-tool use policies to inspect and modify the tool input, or rely on the block action to halt the agent.
- **VS Code and GitHub Copilot — no file read or agent response events.** These integrations evaluate the three core hook events (prompt submission, pre-tool use, post-tool use). File reads and agent responses are not intercepted as separate events.
- **Kiro CLI — only pre-tool use can block; no content modification.** Kiro signals decisions through exit codes, and only its pre-tool-use hook can stop an action. Prompt submission and post-tool use record the event and surface the policy reason to the developer as a warning, but the prompt or tool result still proceeds. Kiro provides no rewrite channel, so no event supports content modification.
- **OpenAI Codex — post-tool use can block but cannot modify output.** Codex documents no tool-output rewrite channel, so Atlas can block on post-tool use (the policy reason is surfaced to the agent) but cannot rewrite the tool output. Pre-tool use supports both blocking and input modification.
- **Devin CLI — post-tool use is observational.** Devin CLI's hooks are Claude Code-compatible for prompt submission and pre-tool use (block and modify input), but Devin CLI does not process the hook response on post-tool use — Atlas records the event for audit, but block and modify actions on tool output are not enforced. Use pre-tool use policies to stop or rewrite specific tool calls instead.
- **Devin Desktop — post-hooks cannot block; no content modification.** Cascade honors blocking on pre-hooks only (prompt submission, file read, file write, command execution, and MCP tool calls). Post-tool use and agent response are observational. Cascade does not read hook output, so no event supports content modification.
- **Google Antigravity — pre-tool use only.** Antigravity intercepts tool calls only; there are no prompt submission, post-tool use, file read, or agent response events. Pre-tool use can block (`deny`) or pass through (`ask`, which respects the developer's "Always Allow" settings), but cannot modify tool input.

#### Current third-party agent limitations[​](#current-third-party-agent-limitations)
These are current bugs in the coding agents themselves, not Atlas limitations. Third-party hook support is new and evolving, so these may change without notice. Each is also listed on the affected agent's configuration guide.

- **Claude Code — organization-required plugins are not enforced in the CLI or on the web.** Claude Code CLI does not read plugins from the claude.ai plugin registry, and Claude Code on the web ignores plugins entirely (both personally installed and organization-required); only the Claude Desktop app (and [Claude Cowork](/_docs/docs/providers/anthropic/claude_cowork_runtime_integration)) honor organization-required plugins. To enforce hooks in the CLI and web environments, use the **Managed Settings** scope — for web sessions, server-delivered managed settings with the Atlas domain added to the environment's trusted domains. See [Support by Claude Code environment](/_docs/docs/coding_agent_protection/runtime_protection/claude_code#support-by-claude-code-environment).
- **Cursor — `afterAgentThought` fires twice.** Cursor nightly builds from 2026.07.01 fire the agent-thought hook twice per thought (a default-model placeholder and the resolved `composer-2.5` event).
- **Cursor — subagent runs are not linked to their parent session.** Cursor's `SubagentStart` hook reports the parent conversation id equal to the subagent's own conversation id, so each subagent run appears in Atlas as its own session instead of nested under the parent ([Cursor forum #163054](https://forum.cursor.com/t/subagentstart-hook-parent-conversation-id-always-equals-conversation-id-and-subagent-conversations-have-no-link-back-to-their-parent/163054)).
- **Kiro CLI — block not enforced and hooks may not fire on Windows 11.** On Windows 11, Kiro's pre-tool-use block is not applied and the pre- and post-tool-use hooks may not fire at all ([kirodotdev/Kiro#8264](https://github.com/kirodotdev/Kiro/issues/8264)).

### Blocking vs. observational events[​](#blocking-vs-observational-events)
Some events can block agent activity; others are observational:

- **Prompt submission** is blocking for Cursor, Claude Code, VS Code, OpenAI Codex, Devin CLI, and Devin Desktop — it can prevent the prompt from being processed. For GitHub Copilot and Kiro CLI, prompt submission is observational only (Kiro surfaces the policy reason as a warning). Google Antigravity does not intercept prompt submission.
- **Pre-tool use** is blocking across all integrations — it can prevent the tool from executing. It can also modify the tool input on Cursor, Claude Code, VS Code, GitHub Copilot, OpenAI Codex, and Devin CLI.
- **File read** is blocking for Cursor and Devin Desktop — it can prevent the agent from reading a file.
- **Post-tool use** varies by integration. Because it runs after the tool has completed, a post-tool-use block stops the agent from continuing with the result but cannot undo the tool's side effects. For Claude Code it can block, or modify tool output for all tools (surfacing the policy reason alongside the rewrite as additional context). For Cursor it can add context or modify MCP tool output but cannot block. For VS Code and OpenAI Codex it can block only. For GitHub Copilot it can modify the tool result or add context but cannot block. For Kiro CLI, Devin CLI, and Devin Desktop it is observational.
- **Agent response** and **agent thought** are observational — they record activity for audit and policy evaluation but do not block.

### Content modification[​](#content-modification)
Only specific events support modifying the content the agent sees:

- **Pre-tool use** can modify tool input on Cursor, Claude Code, VS Code, GitHub Copilot, OpenAI Codex, and Devin CLI. Kiro CLI, Devin Desktop, and Google Antigravity provide no rewrite channel, so pre-tool use can block but not modify on those integrations.
- **Post-tool use** content modification varies:

Claude Code can modify tool output for **all tool types** through the `updatedToolOutput` response field, and surface the policy reason alongside the rewrite as additional context.
- GitHub Copilot can modify tool output for **all tool types** through the `modifiedResult` response field.
- Cursor can modify tool output for **MCP tools only**. For built-in tools (such as Shell, Read, or Edit), Cursor does not accept output replacements.
- VS Code, OpenAI Codex, Kiro CLI, Devin CLI, and Devin Desktop do **not** support modifying tool output. If a guardrail needs to address built-in tool output, use the pre-tool use hook or rely on blocking.

## Hooks distribution[​](#hooks-distribution)
For organizations deploying coding agent integrations across multiple developers, each tool provides mechanisms to distribute hook configurations at scale rather than requiring individual installation on each machine. The distribution methods are tool-specific — see the **Hooks distribution** section on each agent's configuration guide (listed at the top of this page) for the project-level, user-level, and enterprise options that apply to it.

## Timeout and fail-open behavior[​](#timeout-and-fail-open-behavior)
Hook configurations include timeouts for each event type so that the coding agent does not wait indefinitely for a response.

By default, hooks are configured to **fail open**. If a hook times out, fails, or cannot reach Atlas, agent activity is allowed to continue. This default reduces disruption to developer workflows during initial deployment.

Organizations that require stricter enforcement can configure fail-closed behavior where supported.

## Troubleshooting[​](#troubleshooting)
IssueResolutionActivity does not appear in AtlasConfirm the resource was created in the correct project and the endpoint identifier matches the hook configuration.Resource not enforcing policiesConfirm the resource is marked as **Approved**. Unapproved resources do not participate in policy enforcement.Policies not applyingConfirm AI Runtime policies are enabled either directly on the resource or inherited from a parent scope.Hook not runningConfirm the hook configuration, the hook script, and `ai-atlas.conf` were copied to the correct location, and that the `command` paths in the hook configuration point to the actual location of the script.Permission errors on hook scriptConfirm the script has execute permissions (`chmod +x ai-atlas-hook.sh`; same for the `.py` variant).Authentication failureConfirm the API key is configured. Replace the `&lt;API Key&gt;` placeholder in `ai-atlas.conf`, or export `AI_ATLAS_API_KEY` as an environment variable. See [Authenticate the hook script](#authenticate-the-hook-script).Need to see what the hook sends and receivesSet `AI_ATLAS_DEBUG=true` in `ai-atlas.conf` and check `~/ai-atlas-debug.log` — it records the full event payload, the webhook response, and any errors.TLS errors behind an inspecting proxyPoint `AI_ATLAS_CA_FILE` in `ai-atlas.conf` at your proxy's PEM bundle.Network errorsConfirm the coding agent environment can reach Atlas data plane endpoint over HTTPS. For cloud-based agent environments with a network allowlist (such as Claude Code on the web), confirm the Atlas domain is in the environment's trusted domains — an untrusted domain makes the hook fail open silently.Wrong resource receiving activityFor multi-resource deployments, confirm each installation uses the intended endpoint identifier.All activity is being blockedReview the AI Runtime policy rules configured for the resource. Verify the policies match the intended enforcement level.[PreviousCoding Agent Protection](/_docs/docs/coding_agent_protection/overview)[NextCursor](/_docs/docs/coding_agent_protection/runtime_protection/cursor)- [How it works](#how-it-works)- [Prerequisites](#prerequisites)[Script runtime tooling](#script-runtime-tooling)- [Authenticate the hook script](#authenticate-the-hook-script)- [Configure the runtime integration](#configure-the-runtime-integration)[Get your firewall API key](#get-your-firewall-api-key)- [Hook configuration reference (ai-atlas.conf)](#hook-configuration-reference-ai-atlasconf)- [Capability matrices](#capability-matrices)[Monitored activity](#monitored-activity)- [Action support by integration](#action-support-by-integration)- [Blocking vs. observational events](#blocking-vs-observational-events)- [Content modification](#content-modification)- [Hooks distribution](#hooks-distribution)- [Timeout and fail-open behavior](#timeout-and-fail-open-behavior)- [Troubleshooting](#troubleshooting)
