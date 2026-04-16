---
title: Microsoft Copilot Studio Integration
url: https://playground.alltrue-be.com/_docs/docs/platform_services/copilot_studio
section: platform_services
---

# Microsoft Copilot Studio Integration

- [](/_docs/)- Integration Examples- Microsoft Copilot Studio IntegrationOn this page# Microsoft Copilot Studio Integration
Microsoft [Copilot Studio](https://learn.microsoft.com/en-us/microsoft-copilot-studio/fundamentals-what-is-copilot-studio) lets you build custom AI agents that can invoke external tools, connectors, and APIs. TRiSM Hub integrates with Copilot Studio's [external threat detection](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider) feature to evaluate every tool invocation against your installed guardrail rules before the tool executes. If a rule blocks the action, Copilot Studio prevents the tool from running and reports the block reason to the user.

Note: External threat detection is a Microsoft preview feature and is subject to change. It only applies to generative agents that use generative orchestration — classic agents are not evaluated.

This integration covers two areas:

- **Discovery** — TRiSM Hub discovers your Copilot Studio agents, their components, tools, connectors, and authentication configurations across all Power Platform environments.
- **Runtime Controls** — Every tool invocation in a Copilot Studio agent is sent to TRiSM Hub for policy evaluation before execution. Guardrail rules (PII detection, prompt injection protection, topic blocking, etc.) run on your data plane and return an Allow or Block decision.

## How It Works[​](#how-it-works)
When a Copilot Studio agent is about to invoke a tool:

- **Token exchange** — Copilot Studio obtains a Federated Identity Credential (FIC) token for the registered Entra application and sends it to the TRiSM Hub webhook endpoint.
- **Token validation** — TRiSM Hub validates the Microsoft Entra ID token, extracting the tenant and agent identity.
- **Rule evaluation** — The tool invocation details (tool name, arguments, conversation context) are evaluated against all guardrail rules installed on the corresponding endpoint. Input and output rules run concurrently.
- **Decision** — TRiSM Hub returns an **Allow** or **Block** response. If blocked, Copilot Studio prevents the tool from executing and surfaces the block reason.

Copilot Studio expects a response within one second. If TRiSM Hub does not respond in time, Copilot Studio allows the tool to execute by default (configurable — see [error behavior](#step-2-configure-threat-detection-in-power-platform)).

All rule processing happens on the customer data plane. Rule settings are retrieved from the TRiSM Hub control plane, but no unencrypted LLM data leaves your account.

## Prerequisites[​](#prerequisites)
Before configuring the integration, you need:

- **An Azure AD tenant** with the Copilot Studio agents you want to protect.
- **Azure AD permissions** — an account with Application Administrator, Cloud Application Administrator, or Global Administrator role in Microsoft Entra ID.
- **Power Platform Administrator role** for configuring threat detection in the Power Platform Admin Center.
- **PowerShell** (5.1+ or PowerShell 7+) with the ability to install modules.
- **Guardrail rules installed** on the endpoint in TRiSM Hub. Use the AI Runtime Protection policy configuration to select which rules to apply.

## Agent Discovery[​](#agent-discovery)
TRiSM Hub automatically discovers Copilot Studio agents and their components (tools, connectors, prompts, workflows, authentication configurations) when you connect an Azure cloud account. To set up discovery, link your Azure tenant in the [AI Inventory](/_docs/docs/applications/ai_inventory) configuration under **Cloud Accounts**. Discovered agents and their dependencies appear in the **AI Inventory** and can be assigned to projects for governance. See [Adding a new Cloud Account](/_docs/docs/applications/ai_inventory#adding-a-new-cloud-account) for setup instructions.

## Configuration[​](#configuration)
Runtime controls use Copilot Studio's [external threat detection](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider) webhook to evaluate every tool invocation against your guardrail rules. Setup involves two steps: registering an Entra application and enabling threat detection in Power Platform.

### Step 1: Register the Entra Application[​](#step-1-register-the-entra-application)
The setup requires creating a Microsoft Entra application registration with a Federated Identity Credential (FIC). This allows Copilot Studio to authenticate with TRiSM Hub using token exchange.

Before you begin, verify that the TRiSM Hub endpoint domain (or a parent domain) is registered as a verified custom domain in your Entra ID tenant. Navigate to **Azure Portal &gt; Microsoft Entra ID &gt; Custom domain names** to check. If the domain is not verified, the application registration will fail.

You have the following values ready (available from the TRiSM Hub GUI — see below):

ValueDescription**Tenant ID**Your Azure AD tenant ID (GUID)**Endpoint**TRiSM Hub webhook URL. Format: `https://&lt;YOUR-DATA-PLANE&gt;/sdk/v1/webhooks/copilot-studio`**Data Plane ID**Identifier for your TRiSM Hub data plane
You can obtain these pre-filled from the TRiSM Hub GUI through either of these paths:

- **AI Runtime Protection** &gt; **Configure Runtime** &gt; select the resource with provider **Copilot Studio Agent**.
- **AI Inventory** &gt; select the Copilot Studio agent &gt; **Runtime Protection Policies** &gt; **Configure Runtime**.

- PowerShell Script (Recommended)- Manual Configuration (Azure Portal)The TRiSM Hub GUI displays a ready-to-run PowerShell script with all values pre-filled. Copy it and run in PowerShell.
To run the script manually instead:
```
# Download the setup script
irm "&lt;SCRIPT-DOWNLOAD-URL&gt;" -OutFile Setup-CopilotThreatDetection.ps1

# Preview what the script will do (recommended first run)
.\Setup-CopilotThreatDetection.ps1 `
 -TenantId "&lt;YOUR-AZURE-TENANT-ID&gt;" `
 -Endpoint "&lt;YOUR-TRISM-WEBHOOK-ENDPOINT&gt;" `
 -DataPlaneId "&lt;YOUR-DATA-PLANE-ID&gt;" `
 -DryRun

# Run for real
.\Setup-CopilotThreatDetection.ps1 `
 -TenantId "&lt;YOUR-AZURE-TENANT-ID&gt;" `
 -Endpoint "&lt;YOUR-TRISM-WEBHOOK-ENDPOINT&gt;" `
 -DataPlaneId "&lt;YOUR-DATA-PLANE-ID&gt;"

```ParameterDescriptionRequired`TenantId`Your Azure AD tenant ID (GUID format)Yes`Endpoint`TRiSM Hub webhook endpoint URL (must be HTTPS)Yes`DataPlaneId`Identifier for your TRiSM Hub data plane (used to derive display name and FIC name)Yes`DryRun`When specified, shows what would be created without making changesNoThe script authenticates via device code flow (you complete sign-in in your browser), validates the domain, creates the application registration and service principal, and configures the Federated Identity Credential. The script outputs the **App ID** you need for Step 2. If an application already exists for this endpoint, the script detects it and updates the configuration if needed.
If you prefer not to use the PowerShell script, you can register the Entra application and configure the Federated Identity Credential manually through the Azure portal. Follow the instructions in [Microsoft's documentation — Option B: Configure manually using Azure portal](https://learn.microsoft.com/en-us/microsoft-copilot-studio/external-security-provider#option-b-configure-manually-using-azure-portal).
When configuring, use the following values:

- **Endpoint**: your TRiSM Hub webhook URL (`https://&lt;YOUR-DATA-PLANE&gt;/sdk/v1/webhooks/copilot-studio`)
- **Tenant ID**: your Azure AD tenant ID
After completing the manual setup, copy the **Application (client) ID** — you need it for Step 2.

### Step 2: Configure Threat Detection in Power Platform[​](#step-2-configure-threat-detection-in-power-platform)
After the Entra application is registered, configure Copilot Studio to send tool invocations to TRiSM Hub. This setting is configured per Power Platform environment.

- Sign in to the [Power Platform Admin Center](https://aka.ms/ppac).
- Navigate to **Security &gt; Threat detection**.
- Select **Additional threat detection**.
- Select the environment you want to protect and click **Set up**.
- Enable **Allow Copilot Studio to share data with a threat detection provider**.
- Enter the **Azure Entra App ID** — this is the Application (client) ID output by the setup script.
- Enter the **Endpoint link** — this is the webhook endpoint URL you provided to the setup script (e.g., `https://&lt;YOUR-DATA-PLANE&gt;/sdk/v1/webhooks/copilot-studio`).
- Under **Set error behavior**, choose your preference:

**Allow the agent to respond** (default) — if TRiSM Hub is unreachable or does not respond within one second, allow the tool invocation (fail open).
- **Block the query** — if TRiSM Hub is unreachable, block the tool invocation (fail closed).

- Click **Save**. Copilot Studio validates the configuration by calling the `/validate` endpoint. The save fails if the Entra application is not properly configured or the endpoint is unreachable.

Note: Repeat these steps for each Power Platform environment you want to protect.

## How Tool Invocations Are Evaluated[​](#how-tool-invocations-are-evaluated)
When Copilot Studio calls TRiSM Hub for a tool invocation, the following data is included in the webhook payload:

FieldDescription**Planner context**The user's message, the agent's reasoning ("thought"), conversation history, and previous tool outputs**Tool definition**The tool being invoked — its name, description, input/output parameter schemas**Input values**The concrete argument values being passed to the tool**Conversation metadata**Agent identity (ID, tenant, environment, version), user identity, conversation ID, plan details
TRiSM Hub evaluates both the **input** (what is being sent to the tool) and the **output** (what the tool would produce) concurrently. If either evaluation triggers a rule violation, the tool invocation is blocked.

### Decision Outcomes[​](#decision-outcomes)
OutcomeWhat happens**Allow**The tool invocation proceeds normally**Block**Copilot Studio prevents the tool from executing and surfaces the block reason to the user
Note: Unlike the [LiteLLM integration](/_docs/docs/platform_services/litellm), Copilot Studio's threat detection webhook does not support content modification (e.g., PII redaction). If a rule would modify content, TRiSM Hub treats this as a block to prevent unmodified sensitive data from reaching the tool.

## Verifying the Integration[​](#verifying-the-integration)
After completing the setup:

- **Validate the webhook** — During the Power Platform setup (Step 2), Copilot Studio calls the `/validate` endpoint. If the configuration is saved successfully, the endpoint is reachable and authentication is working.
- **Test with a Copilot Studio agent** — Open a Copilot Studio agent in the configured environment, trigger a tool invocation, and verify:

The request appears in the TRiSM Hub **AI Runtime Protection** activity log.
- The agent identity and conversation details are captured correctly.

- **Test a blocked scenario** — Trigger a tool invocation that violates an installed guardrail rule (e.g., include PII in a message that invokes a connector). Verify that:

The tool invocation is blocked.
- The block reason is surfaced in Copilot Studio.
- The block appears in the TRiSM Hub activity log.

## Troubleshooting[​](#troubleshooting)
IssueResolution**Setup script fails with "Domain validation failed"**The endpoint domain must be verified in Microsoft Entra ID. Navigate to **Azure Portal &gt; Microsoft Entra ID &gt; Custom domain names** and add/verify the domain.**Setup script fails with 403 Forbidden**Ensure your account has Application Administrator, Cloud Application Administrator, or Global Administrator role in Entra ID.**Power Platform save fails with "problem connecting to the protection provider"**The endpoint is unreachable or timed out. Verify the endpoint URL is correct and accessible over HTTPS. Contact your account team if the data plane endpoint is not responding.**Power Platform save fails with "problem with the configuration"**Token acquisition failed. Check the Entra application configuration and Federated Identity Credentials. Select **Copy error info** in the Power Platform Admin Center for details.**Tool invocations are not appearing in TRiSM Hub**Check that threat detection is enabled for the correct Power Platform environment. Verify the Entra App ID matches the registered application.**All tool invocations are being blocked**Verify that guardrail rules are correctly configured for the endpoint. Check if the endpoint is marked as "sanctioned" in TRiSM Hub.**Authentication errors (401)**The Federated Identity Credential may be misconfigured. Re-run the setup script to verify or update the FIC configuration. The script detects existing applications and updates them if needed.**"No FIC configured on the app"**The Entra application has no Federated Identity Credential. Re-run the setup script to create the FIC.**"No matching federated identity record found for presented assertion issuer"**The FIC issuer does not match. Ensure the issuer is set to `https://login.microsoftonline.com/&lt;YOUR-TENANT-ID&gt;/v2.0`.[PreviousLiteLLM Proxy Integration](/_docs/docs/platform_services/litellm)[NextLLM Pentest Execution Workflow Using REST API](/_docs/docs/platform_services/llm_pentest)- [How It Works](#how-it-works)- [Prerequisites](#prerequisites)- [Agent Discovery](#agent-discovery)- [Configuration](#configuration)[Step 1: Register the Entra Application](#step-1-register-the-entra-application)- [Step 2: Configure Threat Detection in Power Platform](#step-2-configure-threat-detection-in-power-platform)- [How Tool Invocations Are Evaluated](#how-tool-invocations-are-evaluated)[Decision Outcomes](#decision-outcomes)- [Verifying the Integration](#verifying-the-integration)- [Troubleshooting](#troubleshooting)
