---
title: Coding Agent Integrations
url: https://prod.alltrue-be.com/_docs/docs/integration_examples/coding_agents
section: integration_examples
---

# Coding Agent Integrations

- [](/_docs/)- Integration Examples- Coding Agent IntegrationsOn this page# Coding Agent Integrations
TRiSM Hub integrates with AI-powered coding agents to monitor and enforce runtime policies on agent activity. When a coding agent runs — submitting prompts, calling tools, reading files, or producing responses — TRiSM Hub evaluates each action against your configured guardrail policies. If a policy violation occurs, TRiSM Hub can block the action, modify its content, or generate an audit record.

Use coding agent integrations when you want to:

- Apply guardrails to developer tool usage across your organization
- Maintain an audit trail of agent activity for compliance and security review
- Enforce controls on prompt content, tool execution, file access, and agent output
- Track coding agent activity separately from other AI applications

TRiSM Hub currently supports the following coding agents:

ToolResource type in Inventory[Cursor](https://www.cursor.com/)Cursor Runtime Integration[Claude Code](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/overview)Claude Code Runtime Integration
Additional integrations are planned for future releases.

## How it works[​](#how-it-works)
Coding agent integrations use a hook-based architecture. Each supported tool provides a hooks system that invokes an external script at key points in the agent workflow — before a prompt is submitted, before or after a tool runs, when a file is read, and when the agent produces a response.

When TRiSM Hub is configured as the hook target:

- The coding agent triggers a hook event (for example, a user submits a prompt).
- The hook sends the event payload to the TRiSM Hub data plane endpoint.
- TRiSM Hub evaluates the event against all applicable runtime policies on the data plane.
- TRiSM Hub returns a response — allow, block, or modify — and the coding agent enforces the decision.
- The event is recorded in the activity log for audit and monitoring.

All policy evaluation happens on the customer data plane. No unencrypted LLM data leaves your account. For details on how data is encrypted, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

## Prerequisites[​](#prerequisites)
Before setting up a coding agent integration, verify that you have:

- Access to **Inventory** in TRiSM Hub
- Permission to manually add new technology resources
- Permission to approve inventory resources
- Permission to configure or inherit runtime policies
- Access to the coding agent environment where hook files will be installed
- A deployment plan for whether hooks will be installed for a single user or distributed across an organization

## Authenticate the hook script[​](#authenticate-the-hook-script)
The hook script authenticates with TRiSM Hub using an API key. Configure the key before verifying the integration.

**Option 1: Configuration file (recommended)**

Create the file `~/.ai-atlas/config` and add your API key:

```
AI_ATLAS_API_KEY=&lt;YOUR-API-KEY&gt;

```
**Option 2: Environment variable**

Export the API key in your shell environment:

```
export AI_ATLAS_API_KEY=&lt;YOUR-API-KEY&gt;

```
The hook script checks the environment variable first. If the variable is not set, the script reads from the configuration file. If no API key is found through either method, the script fails open and the coding agent continues without TRiSM Hub policy evaluation.

You can override the default configuration file path by setting the `AI_ATLAS_CONFIG` environment variable to a custom file path, or `AI_ATLAS_CONFIG_DIR` to a custom directory (the script looks for a file named `config` in that directory).

## Set up Cursor[​](#set-up-cursor)
### Step 1: Create the resource[​](#step-1-create-the-resource)
Create a resource in TRiSM Hub to represent the Cursor environment that sends runtime events.

- Go to **Inventory**.
- Select **Technologies**.
- Click **Add New**.
- Select **Add New Resources Manually**.
- Under **Guardrail Integration**, select **Cursor Runtime Integration**.
- Assign the resource to the appropriate **Project**.
- Enter an **Endpoint Identifier**.
- Create the resource.

The endpoint identifier distinguishes this Cursor integration from other resources. Each Cursor environment that should be tracked, governed, or audited separately needs its own resource with a unique endpoint identifier.

You may want separate resources for:

- Different teams (engineering, security, QA)
- Different environments (production, sandbox, test)
- Different business units or projects that require separate audit trails

### Step 2: Approve the resource[​](#step-2-approve-the-resource)
After creating the resource, approve it to enable policy enforcement and monitoring.

- Open the newly created Cursor Runtime Integration resource.
- Review the resource details.
- Mark the resource as **Approved**.

Approval confirms that the resource is authorized for use. Once approved, the resource participates in policy enforcement and contributes activity to the relevant monitoring and audit views.

### Step 3: Configure runtime policies[​](#step-3-configure-runtime-policies)
Configure the runtime policies that apply to Cursor activity.

- Go to **Runtime Policies**.
- Select the appropriate scope:

Use a parent scope if the policies should apply broadly across multiple resources.
- Use the Cursor Runtime Integration resource scope if the policies should apply only to this integration.

- Enable the guardrails and policies that should evaluate Cursor runtime activity.
- Configure any policy-specific settings.
- Save or stage the policy changes according to your normal workflow.

Policies can be inherited from higher scopes, applied directly to the resource, or overridden where more specific behavior is required. Typical policies include controls for prompt inspection, sensitive data exposure, unsafe tool usage, file access, and agent response evaluation.

### Step 4: Download the hook files[​](#step-4-download-the-hook-files)
Download the generated hook files from the resource setup page in TRiSM Hub. The download package contains two files:

- **`hooks.json`** — the hook configuration file that tells Cursor which events to intercept and which script to run for each event.
- **`ai-atlas-hook.sh`** — the hook script that `hooks.json` calls. This script handles communication with the TRiSM Hub data plane, including sending event payloads and enforcing policy decisions. It contains integration-specific values (webhook URL and endpoint identifier) that associate activity with the correct TRiSM Hub resource.

### Step 5: Install the hook files[​](#step-5-install-the-hook-files)
Install the downloaded hook files in the Cursor environment. Cursor supports multiple hook configuration locations. Choose the one that matches your deployment model.

Installation methodConfiguration pathScopeProject-level`&lt;project&gt;/.cursor/hooks.json`Applies to a single project. Can be committed to source control so all team members share the same hooks.User-level (global)`~/.cursor/hooks.json`Applies to all projects for that user.Enterprise (system-wide)Managed through the Cursor admin console or deployed to system paths via MDMApplies to all users on a managed device. See [Hooks distribution](#hooks-distribution).
#### Individual user installation[​](#individual-user-installation)
Use this option when the integration applies to a single user's local Cursor instance.

- Copy `hooks.json` to the project directory at `&lt;project&gt;/.cursor/hooks.json`, or to the user-level directory at `~/.cursor/hooks.json`.
- Copy `ai-atlas-hook.sh` to the scripts directory (for example, `&lt;project&gt;/.cursor/scripts/ai-atlas-hook.sh` for project-level or `~/.cursor/scripts/ai-atlas-hook.sh` for user-level).
- Confirm `ai-atlas-hook.sh` is executable (`chmod +x ai-atlas-hook.sh`).
- Verify that the `command` paths in `hooks.json` point to the location where you placed `ai-atlas-hook.sh`.
- Configure the API key for authentication. See [Authenticate the hook script](#authenticate-the-hook-script).
- Restart Cursor if required.
- Trigger a Cursor agent action to confirm the hook is running.

Note: Project-level hooks run from the project root directory. User-level hooks run from `~/.cursor/`. Adjust script paths in `hooks.json` accordingly.

#### Enterprise deployment[​](#enterprise-deployment)
Use this option when the integration applies across multiple users or managed workstations.

- Place both `hooks.json` and `ai-atlas-hook.sh` in a shared or managed location.
- Distribute both files using your organization's device management or developer environment configuration process.
- Confirm users receive both the hook configuration and the hook script.
- Confirm each deployed Cursor instance uses the intended TRiSM Hub endpoint identifier.
- Configure the API key on each machine. See [Authenticate the hook script](#authenticate-the-hook-script).
- Validate that activity appears in TRiSM Hub after users begin using Cursor.

For organization-wide deployments, reuse the same endpoint identifier only when activity should be grouped under the same resource. If different teams or environments require separate policy treatment or audit trails, create separate Cursor Runtime Integration resources.

For more details on Cursor's hooks system, see the [Cursor hooks documentation](https://cursor.com/docs/hooks).

### Step 6: Verify the integration[​](#step-6-verify-the-integration)

- Open Cursor.
- Start a new agent session.
- Submit a test prompt.
- Trigger at least one tool action, such as reading a file or making an edit.
- Return to TRiSM Hub.
- Open the Cursor Runtime Integration resource.
- Confirm that activity is associated with the correct resource.
- Confirm that configured runtime policies are being applied.
- Confirm that relevant audit events, issues, or policy outcomes are visible in the expected views.

If you have multiple Cursor Runtime Integration resources, confirm that the activity appears under the correct endpoint identifier.

## Set up Claude Code[​](#set-up-claude-code)
### Step 1: Create the resource[​](#step-1-create-the-resource-1)
Create a resource in TRiSM Hub to represent the Claude Code environment that sends runtime events.

- Go to **Inventory**.
- Select **Technologies**.
- Click **Add New**.
- Select **Add New Resources Manually**.
- Under **Guardrail Integration**, select **Claude Code Runtime Integration**.
- Assign the resource to the appropriate **Project**.
- Enter an **Endpoint Identifier**.
- Create the resource.

As with Cursor, use separate resources and endpoint identifiers for environments that require separate policy treatment or audit trails.

### Step 2: Approve the resource[​](#step-2-approve-the-resource-1)

- Open the newly created Claude Code Runtime Integration resource.
- Review the resource details.
- Mark the resource as **Approved**.

### Step 3: Configure runtime policies[​](#step-3-configure-runtime-policies-1)
Follow the same process as [Cursor runtime policies](#step-3-configure-runtime-policies). Policies can be applied at the resource scope or inherited from a parent scope. The Claude Code integration supports the same runtime policy model as Cursor.

### Step 4: Download the hook files[​](#step-4-download-the-hook-files-1)
Download the generated hook files from the resource setup page in TRiSM Hub. The download package contains two files:

- **Hook configuration** — the JSON hook definitions to add to Claude Code's settings file. This tells Claude Code which events to intercept and which script to run for each event.
- **`ai-atlas-hook.sh`** — the hook script that the hook configuration calls. This script handles communication with the TRiSM Hub data plane, including sending event payloads and enforcing policy decisions. It contains integration-specific values (webhook URL and endpoint identifier) that associate activity with the correct TRiSM Hub resource.

### Step 5: Install the hook files[​](#step-5-install-the-hook-files-1)
Install the downloaded hook files in the Claude Code environment. Claude Code supports multiple hook configuration locations. Choose the one that matches your deployment model.

Installation methodConfiguration pathScopeProject-level`&lt;project&gt;/.claude/settings.json`Applies to a single project. Can be committed to source control so all team members share the same hooks.Project-local`&lt;project&gt;/.claude/settings.local.json`Per-machine overrides for a single project. Not committed to source control.User-level (global)`~/.claude/settings.json`Applies to all projects for that user.Managed policyOrganization-wide managed settingsApplies to all users in the organization. See [Hooks distribution](#hooks-distribution).
Hooks in Claude Code are defined inside the `hooks` key of the settings JSON file, not in a separate file.

#### Individual user installation[​](#individual-user-installation-1)

- Copy `ai-atlas-hook.sh` to the scripts directory (for example, `&lt;project&gt;/.claude/scripts/ai-atlas-hook.sh` for project-level or `~/.claude/scripts/ai-atlas-hook.sh` for user-level).
- Confirm `ai-atlas-hook.sh` is executable (`chmod +x ai-atlas-hook.sh`).
- Open or create the appropriate settings file — `&lt;project&gt;/.claude/settings.json` for project-level, or `~/.claude/settings.json` for user-level.
- Add the hook configuration from the downloaded package into the `hooks` key of the settings file. Verify that the `command` paths in the configuration point to the location where you placed `ai-atlas-hook.sh`.
- Configure the API key for authentication. See [Authenticate the hook script](#authenticate-the-hook-script).
- Restart Claude Code or start a new session for the hooks to take effect.
- Run a test command to confirm the hook is active.

#### Enterprise deployment[​](#enterprise-deployment-1)

- Place both the hook configuration and `ai-atlas-hook.sh` in a shared or managed location.
- Distribute both files using your organization's endpoint management process.
- Confirm each Claude Code installation has `ai-atlas-hook.sh` in place and the hook configuration added to the settings file with the correct script path.
- Confirm each installation uses the intended endpoint identifier.
- Configure the API key on each machine. See [Authenticate the hook script](#authenticate-the-hook-script).
- Validate that activity appears in TRiSM Hub after users begin using Claude Code.

For more details on Claude Code's hooks system, see the [Claude Code hooks documentation](https://code.claude.com/docs/en/hooks).

### Step 6: Verify the integration[​](#step-6-verify-the-integration-1)

- Open a terminal and start Claude Code.
- Submit a test prompt.
- Trigger a tool action, such as reading a file or running a command.
- Return to TRiSM Hub and confirm activity appears under the correct resource.

## Monitored activity[​](#monitored-activity)
After installation, hooks automatically send events to TRiSM Hub at key points in the agent workflow. The following table shows which events each tool supports and whether the event can block agent activity.

Event typeDescriptionCursorClaude CodePrompt submissionEvaluates user input before the agent processes it. Can block the prompt.✓✓Pre-tool useEvaluates tool calls before execution. Can block the tool or modify its input.✓✓Post-tool useEvaluates tool output after execution. Can add context or modify MCP tool output.✓✓File readEvaluates file content before the agent reads it. Can block the read.✓—Agent responseEvaluates the agent's final response for monitoring and audit.✓✓Agent thoughtMonitors agent reasoning activity where available.✓—
### Blocking vs. observational events[​](#blocking-vs-observational-events)
Some events can block agent activity; others are observational:

- **Prompt submission** and **pre-tool use** are blocking — they can prevent the prompt from being processed or the tool from executing.
- **File read** (Cursor only) is blocking — it can prevent the agent from reading a file.
- **Post-tool use** is observational for Cursor (can add context or modify MCP tool output, but cannot block) and blocking for Claude Code (can block based on tool output).
- **Agent response** and **agent thought** are observational — they record activity for audit and policy evaluation but do not block.

### Content modification[​](#content-modification)
Only specific events support modifying the content the agent sees:

- **Pre-tool use** can modify tool input for all tool types in both Cursor and Claude Code.
- **Post-tool use** can modify tool output for **MCP tools only**. For built-in tools (such as Shell, Read, or Edit), the coding agent does not accept output replacements. If a guardrail needs to address built-in tool output, use the pre-execution hook or the post-tool-use additional context to surface a warning rather than modifying the output directly.

## Hooks distribution[​](#hooks-distribution)
For organizations deploying coding agent integrations across multiple developers, each tool provides mechanisms to distribute hook configurations at scale rather than requiring individual installation on each machine.

### Cursor[​](#cursor)
Cursor supports several distribution methods for hooks:

- **Project-level hooks:** Place `hooks.json` and `ai-atlas-hook.sh` in the `&lt;project&gt;/.cursor/` directory (for example, `&lt;project&gt;/.cursor/hooks.json` and `&lt;project&gt;/.cursor/scripts/ai-atlas-hook.sh`) and commit both to source control. All team members who clone the repository automatically receive the hook configuration and script.
- **Enterprise cloud distribution:** Cursor Enterprise includes cloud-based hook distribution that syncs hooks to all team members from the admin console. Configure hooks in the Cursor web dashboard and they are automatically applied to team members' environments.
- **MDM or system-wide deployment:** Deploy hooks to the system-level configuration path using your organization's device management tools (for example, Group Policy on Windows or MDM profiles on macOS). Enterprise-managed hooks run from the enterprise config directory and apply to all users on the device.

All matching hooks from every source (project, user, enterprise, and team) run when triggered. When responses conflict, higher-priority sources take precedence. For more details, see the [Cursor hooks documentation](https://cursor.com/docs/hooks).

### Claude Code[​](#claude-code)
Claude Code supports several distribution methods for hooks:

- **Project-level hooks:** Add hooks to `.claude/settings.json` in the project root and place `ai-atlas-hook.sh` in the `.claude/scripts/` directory. Commit both to source control. All team members who clone the repository automatically receive the hook configuration and script.
- **Managed policy settings:** Organization administrators can define hooks through managed policy settings that apply to all users across the organization. Managed settings have the highest precedence and cannot be overridden by user or project settings.
- **Plugin distribution:** Hooks can be bundled as part of a Claude Code plugin. When the plugin is enabled for the team, the hooks are active for all users who have the plugin installed.

Hooks from all configuration sources (user, project, local, managed) merge together at runtime. For more details, see the [Claude Code hooks documentation](https://code.claude.com/docs/en/hooks).

## Timeout and fail-open behavior[​](#timeout-and-fail-open-behavior)
Hook configurations include timeouts for each event type so that the coding agent does not wait indefinitely for a response.

By default, hooks are configured to **fail open**. If a hook times out, fails, or cannot reach TRiSM Hub, agent activity is allowed to continue. This default reduces disruption to developer workflows during initial deployment.

Organizations that require stricter enforcement can configure fail-closed behavior where supported.

## Troubleshooting[​](#troubleshooting)
IssueResolutionActivity does not appear in TRiSM HubConfirm the resource was created in the correct project and the endpoint identifier matches the hook configuration.Resource not enforcing policiesConfirm the resource is marked as **Approved**. Unapproved resources do not participate in policy enforcement.Policies not applyingConfirm runtime policies are enabled either directly on the resource or inherited from a parent scope.Hook not runningConfirm both the hook configuration and `ai-atlas-hook.sh` were copied to the correct location, and that the `command` paths in the hook configuration point to the actual location of `ai-atlas-hook.sh`.Permission errors on hook scriptConfirm `ai-atlas-hook.sh` has execute permissions (`chmod +x ai-atlas-hook.sh`).Authentication failureConfirm the API key is configured. Add `AI_ATLAS_API_KEY=&lt;YOUR-API-KEY&gt;` to `~/.ai-atlas/config` or export it as an environment variable. See [Authenticate the hook script](#authenticate-the-hook-script).Network errorsConfirm the coding agent environment can reach the TRiSM Hub data plane endpoint over HTTPS.Wrong resource receiving activityFor multi-resource deployments, confirm each installation uses the intended endpoint identifier.All activity is being blockedReview the guardrail rules configured for the resource. Verify the policies match the intended enforcement level.[PreviousMicrosoft Copilot Studio Integration](/_docs/docs/integration_examples/copilot_studio)[NextLLM Pentest Execution Workflow Using REST API](/_docs/docs/integration_examples/llm_pentest)- [How it works](#how-it-works)- [Prerequisites](#prerequisites)- [Authenticate the hook script](#authenticate-the-hook-script)- [Set up Cursor](#set-up-cursor)[Step 1: Create the resource](#step-1-create-the-resource)- [Step 2: Approve the resource](#step-2-approve-the-resource)- [Step 3: Configure runtime policies](#step-3-configure-runtime-policies)- [Step 4: Download the hook files](#step-4-download-the-hook-files)- [Step 5: Install the hook files](#step-5-install-the-hook-files)- [Step 6: Verify the integration](#step-6-verify-the-integration)- [Set up Claude Code](#set-up-claude-code)[Step 1: Create the resource](#step-1-create-the-resource-1)- [Step 2: Approve the resource](#step-2-approve-the-resource-1)- [Step 3: Configure runtime policies](#step-3-configure-runtime-policies-1)- [Step 4: Download the hook files](#step-4-download-the-hook-files-1)- [Step 5: Install the hook files](#step-5-install-the-hook-files-1)- [Step 6: Verify the integration](#step-6-verify-the-integration-1)- [Monitored activity](#monitored-activity)[Blocking vs. observational events](#blocking-vs-observational-events)- [Content modification](#content-modification)- [Hooks distribution](#hooks-distribution)[Cursor](#cursor)- [Claude Code](#claude-code)- [Timeout and fail-open behavior](#timeout-and-fail-open-behavior)- [Troubleshooting](#troubleshooting)
