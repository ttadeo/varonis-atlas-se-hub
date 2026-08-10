---
title: Runtime Evaluator LLM
url: https://prod.alltrue-be.com/_docs/docs/admin_console/runtime_evaluator_llm
section: admin_console
---

# Runtime Evaluator LLM

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Runtime Evaluator LLMExport PDFOn this page# Runtime Evaluator LLM
Various elements in the system use LLMs to generate content and apply reasoning or decision-making. This includes report generation, pentest evaluations, and guardrails that evaluate prompts and responses. You can set which LLM you prefer to use within the context of your system, and the system does not ship with any predefined LLMs.

## Where to find it[​](#where-to-find-it)
Open **Admin Console &gt; Evaluator Credentials** to configure evaluator LLM providers, and **Admin Console &gt; Evaluator Budget** to track and cap your usage. **Evaluator Credentials** holds two tabs: **Runtime Policy Evaluator**, for the per-data-plane credentials described below, and **Session Policy Evaluator**, for the customer-level evaluator that LLM-based session policies use.

## Credentials tab[​](#credentials-tab)
The **Credentials** tab is where you wire up the LLM endpoint or endpoints that the platform should use as the runtime evaluator. The tab is scoped to a single **Data Plane** — the data-plane selector at the top of the page is the first control, and everything below is scoped to your selection.

### Endpoint groups and fallbacks[​](#endpoint-groups-and-fallbacks)
Endpoints are organized into groups. By default, only the **Main Group** is shown, and it holds a single endpoint that handles all evaluator traffic. Turning on **Fallbacks** unlocks two additional groups:

- **Main Group** — the primary evaluator endpoint. Required.
- **Primary Fallback** — used when the Main Group endpoint exceeds its allowed failure budget. Required when Fallbacks is on.
- **Secondary Fallback** — used when both Main and Primary are unavailable. Optional.

Each group holds a single endpoint.

When Fallbacks is on, a **Fallback Settings** card appears with four tunables:

- **Retries** — number of retries on the primary evaluation model before falling back (recommended value 0 for latency-sensitive deployments).
- **Allowed Failures** — number of times a deployment can fail in a minute before being added to cooldown (recommended value 3).
- **Cooldown Time** — time, in seconds, to keep a deployment out of rotation after it exceeds the allowed-failures threshold.
- **Max Fallbacks** — maximum number of fallbacks to try before exiting a call (recommended value 0 for latency-sensitive deployments).

### Adding an endpoint[​](#adding-an-endpoint)
Click **Add LLM Endpoint** on any group to open the endpoint editor. Every endpoint requires an **Endpoint Name**, a **Model** identifier, a **Provider**, and the credentials that provider needs. The supported providers and their credential fields are:

ProviderRequired credentialsOptional credentials**OpenAI**API KeyOrganization, Project, Base URL**Azure AI Foundry**Azure endpoint, API KeyAPI version**Anthropic**API KeyBase URL**Gemini Generative Language**API Key—**Gemini Vertex AI**Service Account JSON (must include `type`, `client_email`, `private_key`)Location, Project**Bedrock Meta**AWS Access Key ID, AWS Secret Access Key, Region—**Bedrock Anthropic**AWS Access Key ID, AWS Secret Access Key, Region—
This list is fixed — you select one of these providers, not an arbitrary endpoint. In particular, the Bedrock options are **Bedrock Anthropic** and **Bedrock Meta**; a model from another vendor that happens to be hosted on Bedrock cannot be configured as an evaluator. This is independent of which models you can protect at runtime: any Bedrock foundation model reachable through the Converse API can be routed through the AI Runtime proxy. See [AWS Bedrock runtime integration options](/_docs/docs/providers/aws_bedrock#runtime-integration-options).

Most providers have a recommended default model that is filled in for you when you select the provider. For example, OpenAI defaults to `gpt-4o-mini` and Anthropic defaults to `claude-3-5-haiku-20241022`. You can change the model identifier before saving, but we recommend keeping the default unless you have a specific requirement to use another model. Azure AI Foundry has no default — supply the deployment name yourself.

### Choosing an evaluator model[​](#choosing-an-evaluator-model)
The Runtime Evaluator LLM is used to evaluate prompt and response content for runtime decisions. It is not intended to be the same model that powers your production AI application.

For most deployments, select a model that is fast, inexpensive, and reliable. Larger frontier models can add unnecessary latency and cost to runtime evaluation without materially improving evaluator accuracy for most policy checks.

When you select a provider in the endpoint configuration screen, the recommended default model for that provider is filled in automatically (Azure AI Foundry is the exception — it has no default, so you supply the deployment name). In most cases, keep the default unless you have a specific requirement to use another model.

Recommended evaluator models include:

- **OpenAI** — `gpt-4o-mini`
- **Anthropic** — `claude-3-5-haiku-20241022`
- **Bedrock Anthropic** — `us.anthropic.claude-3-5-haiku-20241022-v1:0`
- **Gemini Vertex AI** — `gemini-2.5-flash-lite`
- **Bedrock Meta** — `us.meta.llama4-maverick-17b-instruct-v1:0`
- **Azure AI Foundry** — no default is provided; supply the deployment name for a comparably small, fast model.

Avoid using larger models — such as Sonnet, Opus, GPT frontier models, or premium reasoning models — as the primary evaluator unless directed by Varonis support. These models are usually slower and more expensive than required for evaluator traffic.

### Publishing changes[​](#publishing-changes)
Edits are held as a draft. Use **Publish** to apply the configuration to the selected data plane, or **Discard Draft** to revert to the last published state.

## Budget tab[​](#budget-tab)
The **Budget** tab is the spend-management dashboard for evaluator LLM traffic. It tracks how much you have spent in the current month, projects where you are headed at the current rate, and (optionally) caps and samples evaluator calls so you do not exceed a monthly budget.

The page is titled **Budget for Runtime LLM Evaluations** in the product and shows four headline cards:

- **Budget Cap** — month-to-date spend versus your configured monthly cap, with a progress bar and elapsed-days counter. If you have not set a cap, this reads **Unlimited**.
- **Current Sampling Rate** — the percentage of evaluator-eligible prompts currently being evaluated. The card subtitle tells you whether the rate is **Auto-adjusted daily** (Automatic mode) or a **Manual override**.
- **Average Daily Spend** — average spend per endpoint per day.
- **Projected Monthly Spend** — month-end projection based on the current rate.

Below the cards, the **Most Expensive Organization**, **Most Expensive Project**, and **Most Expensive Endpoint** are surfaced as a three-up breakdown, each showing the entity's month-to-date spend.

The daily spend chart at the bottom of the page lets you drill from organization down through project to endpoint by clicking a bar, and supports a custom date range.

### Manage Budget[​](#manage-budget)
Click **Manage Budget** (top right) or **Edit** on the Budget Cap card to open the **Manage Budget** drawer. The drawer takes four inputs:

- **Monthly Budget Cap (USD)** — the cap, in dollars. Leave blank or set to `0` to mark spend as unlimited.
- **Mode Selection** — `Automatic` or `Manual`. The mode controls how the sampling rate of prompts is adjusted to fit your budget limits and spending rate.

In **Automatic** mode, the platform auto-adjusts the sampling rate daily. You provide a **Minimum Sampling Rate (%)** as a floor — the sampling rate will not be lowered below this value, even if you are close to the budget cap.
- In **Manual** mode, the platform uses a fixed **Override Sampling Rate (%)** that you supply (default `100`%).

Click **Establish** to save the configuration.

## Setting a provider-side budget alert[​](#setting-a-provider-side-budget-alert)
The Budget tab caps and samples spend platform-side, but it does not call your cloud provider's billing API on your behalf. To be alerted when the bill on the provider's side crosses a number, set up a budget alert with the provider directly. Each vendor has a different setup; refer to your provider's documentation for details — for example:

- **AWS Budgets** for AWS Bedrock
- **Azure Cost Management** for Azure AI Foundry
- **Project-level usage limits** for OpenAI
- **Google Cloud Billing budgets** for Google Gemini

The Budget tab captures the thresholds you want to track in the platform; the provider-side alert is what actually surfaces budget breaches outside the platform.

### AWS Bedrock Setup[​](#aws-bedrock-setup)

- Organize/tag your usage so that you can track the key. Identify which API key or deployment/usage corresponds to that key. Isolate that key's usage into its own account or project/usage path, or use tagging to mark all invocations tied to that key. Make sure that the usage generated by that key is tagged and that cost allocation is enabled so that you can filter billing/usage by that tag.
- Turn on logging and usage visibility. In Bedrock, enable model invocation logging (to S3 or CloudWatch) so you can see usage details: model ID, token counts, request volumes, etc. In AWS Cost Explorer or Cost &amp; Usage Reports, enable cost allocation tags and make sure your tag is part of the report so you can filter by it. Verify in Cost Explorer that usage tied to your key/tag shows up separately (or at least identify the model/service costs you will associate with it).
- Create an AWS Budget for that usage segment. In the AWS Console, go to Billing → Budgets (via the AWS Budgets service). Choose the budget type: Cost budget (track dollar spend) or Usage budget (track usage units such as tokens or model invocations) depending on what you want to monitor. Set the budget period (e.g., monthly) and the amount or usage threshold (e.g., $500/month or 1 million tokens). In the budget filter settings, apply filters so that the budget only covers the tag you assigned (e.g., Tag: ApiKey = aisecurity) and the service is Bedrock (or more narrowly the model/inference usage) if desired. AWS supports filtering budgets by cost-allocation tags and by service.
- Configure alert thresholds &amp; notifications: Set one or more threshold alerts: e.g., when actual cost &gt; 80% of budget, or forecast cost &gt; 100% of budget. Choose how you will receive notifications: email and/or Amazon SNS topic so you can hook into Slack, Teams, or an automation. Optionally, you can also configure budget actions: when the budget is exceeded, AWS can perform actions (e.g., apply an IAM policy or service control policy), though note it may not stop Bedrock model usage automatically unless you build automation.

After creating the budget, monitor usage and filter by your tag to ensure that the budget is correctly capturing the usage of that key. If you notice drift (usage from other keys creeping into the same tag, or some usage not tagged), adjust your tagging or budget filter accordingly. Review your model usage and cost (via Cost Explorer and AWS Budgets dashboards) to verify that alerts will fire when expected.

If you want enforcement (i.e., automatically disable or throttle the key once the spend threshold is reached), you will need to build a small automation: e.g., budget notification -&gt; Lambda or SNS subscriber -&gt; disable key / stop service / change IAM role.

### Azure AI Foundry Setup[​](#azure-ai-foundry-setup)
Azure Cost Management is a sophisticated subsystem that lets you monitor and alert on usage and forecasts; [refer to Azure documentation for full details](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/tutorial-acm-create-budgets?tabs=psbudget). One simple method is to create a budget called Varonis or Guardium AI Security that includes the appropriate resource group or management group:

- In the Azure Portal, navigate to Cost Management + Billing.
- Choose the scope you want to monitor such as a resource group or a management group.
- In that scope, go to Budgets (or "Create budget").
- Define the budget: Give it a name, choose period (monthly, quarterly, annually) for reset, set the budget amount (e.g., $100/month).
- Add filters so the budget applies just to your Azure AI Foundry usage (or whatever subset you care about). For example: Service = AI Security, MeterSubCategory = Azure AI Foundry.
- Configure alert thresholds: For "Actual cost" (e.g., when actual spending reaches 80% of the budget). Use "Forecast cost" (e.g., when Azure projects that you will exceed 100% of the budget) if desired.
- Add email addresses (and optionally action groups) to receive the alert.

### OpenAI Setup[​](#openai-setup)
OpenAI does not support alerts per API key, only per project. Therefore, it is recommended that you create a project with a descriptive name such as Varonis or Guardium AI Security within your OpenAI account, and create the API key you will use within that project. Then:

- Go to the OpenAI Platform and sign in.
- Select the organization → then go to the project for which you want alerts.
- In that project's settings, go to "Limits" (or "Usage &amp; limits" / "Billing &amp; usage").
- Under the budget/usage section you'll see options such as:
a. Monthly budget (in dollars).
b. Notification threshold(s) — e.g., alert at 80% of budget.
- Configure the threshold(s) and save. When usage exceeds the threshold, you'll get an email to the org/project owners.

### Google Gemini Setup[​](#google-gemini-setup)
Under your Google Cloud project:

- Associate the API key with a dedicated resource or label it. Consider using a distinct project for that key (e.g., Varonis or Guardium AI Security). Alternatively (or in addition), use a label on the resources that the key uses (for example: gemini_key=key-1234 or usage_group=ai-security). Labels propagate into cost/usage data for filtering. Make sure you consistently use that label on all resources tied to that API key (deployments, endpoints, service accounts, etc.).
- Make sure billing export or usage tracking is set up. Ensure your Google Cloud billing data is visible (via reports) so you can slice by label, project, service, and SKU. Check that your Gemini usage shows up under a service or SKU you can filter.
- Create a budget in Billing → Budgets &amp; alerts. In the Google Cloud console go to Billing → Budgets &amp; alerts → Create budget. For Scope, select the billing account (or the specific project) that the key lives in. Set the Budget amount (e.g., $100/month). In Filters (under "Scope" or "budgetFilter"), set: Project = the project tied to the API key (if dedicated). Service = the Gemini/Generative AI service if possible. Labels = the key label you applied (for example: gemini_key=key-1234).
- Set one or more Threshold rules, e.g.: 50% of budget → send alert.
- Configure notification recipients (email, and/or Pub/Sub for automation).
- Save the budget and monitor.

Once saved, you will receive alert emails when the filtered spend crosses your thresholds. Use Reports -&gt; Filter by project/service/label to verify that you are actually capturing the spend for that key. If costs appear from unintended resources, adjust labels/filters.

Optional automation for enforcement: If you want to automatically stop usage once the budget is exceeded, use the budget's Pub/Sub notification to trigger a Cloud Function. The function can disable the API key or disable the resource/service endpoint tied to that key.

## Session Policy Evaluator[​](#session-policy-evaluator)
The Session Policy Evaluator is the evaluator LLM used by LLM-based session policies. Certain session policies rely on a large language model to assess session activity rather than deterministic rules alone; these policies cannot run unless an evaluator LLM is configured.

LLM-based session policies review an entire session and judge intent, rather than firing on a fixed signal like a banned word or a PII match. Examples include **Gradual Data Extraction** (a user steadily coaxing out secrets or bulk sensitive data across several turns), **Repeated Jailbreak Attempts** or **Repeated Prompt Injection** that unfold over multiple messages, and **Session Purpose Drift** where a session moves away from its intended use. Because these determinations require an LLM, the affected policies cannot run without a configured evaluator.

Unlike the runtime evaluator described above, which is configured per data plane, the Session Policy Evaluator is configured once at the customer level and applies across your entire account. It is invoked by the control plane during session policy evaluation and does not inherit from, or fall back to, any data-plane evaluator configuration — configuring one does not satisfy the other.

If no Session Policy Evaluator is configured, the LLM-backed portion of session-policy evaluation does not run. Your session-policy settings — whether a policy is on and its configured actions — are not changed or removed; only the LLM step stops running.

### Where to find it[​](#where-to-find-it-1)
In the Admin Console, open **Evaluator Credentials** from the left navigation, then select the **Session Policy Evaluator** tab.

The adjacent **Runtime Policy Evaluator** tab holds the per-data-plane evaluator configuration described above and is managed separately.

### Configuring the evaluator[​](#configuring-the-evaluator)

- On the **Session Policy Evaluator** tab, select **Add Evaluator LLM**.
- In the drawer, choose the **Provider** and **Model**, and enter the provider credential (for example, an API key) along with any provider-specific fields such as Organization ID, Project ID, Region, or Base URL.
- Select **Save**.

Only one Session Policy Evaluator may be configured per customer.

See [Session Policies](/_docs/docs/applications/ai_monitor/session_policies) for what these policies are and how they behave.
[PreviousAWS — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli)[NextOnboarding](/_docs/docs/platform_services/onboarding)- [Where to find it](#where-to-find-it)- [Credentials tab](#credentials-tab)[Endpoint groups and fallbacks](#endpoint-groups-and-fallbacks)- [Adding an endpoint](#adding-an-endpoint)- [Choosing an evaluator model](#choosing-an-evaluator-model)- [Publishing changes](#publishing-changes)- [Budget tab](#budget-tab)[Manage Budget](#manage-budget)- [Setting a provider-side budget alert](#setting-a-provider-side-budget-alert)[AWS Bedrock Setup](#aws-bedrock-setup)- [Azure AI Foundry Setup](#azure-ai-foundry-setup)- [OpenAI Setup](#openai-setup)- [Google Gemini Setup](#google-gemini-setup)- [Session Policy Evaluator](#session-policy-evaluator)[Where to find it](#where-to-find-it-1)- [Configuring the evaluator](#configuring-the-evaluator)
