---
title: AWS Bedrock
url: https://prod.alltrue-be.com/_docs/docs/providers/aws_bedrock
section: providers
---

# AWS Bedrock

- [](/_docs/)- [Providers](/_docs/docs/providers)- AWS BedrockExport PDFOn this page# AWS Bedrock
Atlas discovers AWS Bedrock resources through its AWS cloud-discovery pipeline and surfaces them in AI Inventory and AI SPM. This page explains what Bedrock resources Atlas inventories, how dependency graph relationships are captured, which posture checks apply, and what you need to configure in AWS for discovery to run. Runtime invocation of Bedrock from manually added LLM endpoints is a separate workflow covered on the AI Runtime and AI Red Team pages.

## How AWS Bedrock discovery works[​](#how-aws-bedrock-discovery-works)
Atlas runs an AWS discovery pipeline against each linked AWS cloud account. When a discovery scan starts for an AWS account, the pipeline executes a suite of AWS service-specific discovery steps, including dedicated steps for Bedrock model discovery, Bedrock agent discovery, and Bedrock AgentCore discovery.

You can review and trigger this workflow from the UI:

- Go to **AI Inventory &gt; Configuration &gt; Cloud Accounts** to view linked AWS accounts, their last scan status, and the resources they have discovered.
- Go to **AI Inventory &gt; Resource Management &gt; Add New Cloud Account** to link a new AWS account.
- From the Cloud Accounts page, use **Run Discovery Scan** to trigger an on-demand scan for a linked account, or wait for the next scheduled scan.

Discovered Bedrock resources are written into AI Inventory. Posture findings against those resources surface in AI SPM after the scan completes.

## Bedrock resources Atlas inventories[​](#bedrock-resources-atlas-inventories)
For each linked AWS account and each region where Bedrock is in use, Atlas inventories:

- **Foundation models** observed in invocation logs.
- **Imported models** and the import jobs that created them.
- **Marketplace model endpoints.**
- **Custom models**, provisioned model deployments, and customization jobs.
- **Bedrock agents** with their aliases, versions, drafts, and action groups.
- **Knowledge bases** and their data sources.
- **Flows** and **prompts**, including prompt configuration metadata.
- **AgentCore** runtimes, endpoints, versions, gateways and gateway targets, memories and sessions, credential providers, token vaults, policy engines, policy generations and assets, registries and records, browsers, and code interpreters.
- **Related AWS resources** referenced by the above, including IAM roles, Lambda functions linked to action groups, Redshift clusters referenced by data sources, and S3-backed data sources.

Each resource family is written to AI Inventory with the AWS identifiers Atlas captured, and is available for resource drill-down, search, and project assignment.

## Foundation model discovery from invocation logs[​](#foundation-model-discovery-from-invocation-logs)
Foundation model usage is inferred from S3-backed Bedrock invocation logs: Atlas reads model identifiers seen in actual invocations and adds the corresponding foundation models to inventory for the AWS account.

For this signal to be available, Bedrock model-invocation-logging must be turned on for the AWS account. Atlas does **not** enable it — you enable model-invocation-logging yourself in the AWS Bedrock console (per region), pointing it at an S3 bucket. Atlas's discovery role then reads the resulting logs. The account-linking CloudFormation provisions only the cross-account discovery role; it does not configure Bedrock logging.

Accounts that do not have Bedrock invocation logging configured will still surface other Bedrock resources (agents, imported models, marketplace endpoints, custom models, AgentCore), but foundation models inferred from invocations will be missing.

## Custom, imported, and marketplace model discovery[​](#custom-imported-and-marketplace-model-discovery)
In addition to foundation models inferred from logs, Atlas inventories models that the AWS account has explicitly created or subscribed to:

- **Imported models** and **import jobs** — discovered through the Bedrock APIs that list imported models and the import jobs that produced them. Each imported model appears in inventory with its associated import job context.
- **Marketplace model endpoints** — discovered through the Bedrock marketplace endpoint APIs. Each marketplace endpoint appears in inventory as its own resource.
- **Custom models, provisioned deployments, and customization jobs** — discovered through the Bedrock custom-model APIs. Customization jobs are linked to the custom models they produce, and provisioned deployments are linked to the model they serve.

These resources do not depend on invocation logging and are inventoried whenever the discovery role has read access to the corresponding Bedrock APIs.

## Agent, knowledge base, flow, and prompt discovery[​](#agent-knowledge-base-flow-and-prompt-discovery)
Bedrock agents are inventoried with their full configuration tree:

- **Agents** with their aliases and versions, including drafts.
- **Action groups** attached to each agent, including their executor configuration.
- **Knowledge bases** referenced by agents, including the underlying data sources.
- **Flows** and **prompts** authored in Bedrock, including prompt configuration metadata.

Agent discovery also captures related-resource edges that become dependency graph relationships:

- **IAM role attachments** on agents.
- **Lambda function references** from action group executors.
- **Redshift references** from data sources backed by Redshift.
- **S3-backed data source links** for data sources stored in S3.

## AgentCore discovery[​](#agentcore-discovery)
AgentCore is covered by its own discovery step. For each region where AgentCore is in use, Atlas inventories:

- **Runtimes**, **endpoints**, and **versions** of the AgentCore service.
- **Gateways** and **gateway targets**.
- **Memories** and **sessions**.
- **Credential providers** and **token vaults**.
- **Policy engines**, **policy generations**, and **policy assets**.
- **Registries** and **registry records**.
- **Browsers** and **code interpreters**.

Each AgentCore resource family appears in AI Inventory under its AWS account and region, with child resources linked to their parent (for example, versions linked to their runtime, gateway targets linked to their gateway).

## Dependency graph relationships[​](#dependency-graph-relationships)
Discovered Bedrock resources appear in the AI Inventory dependency graph with the relationships that Atlas captures during discovery:

- **Model build and deployment lineage** — customization jobs to custom models, provisioned deployments to the model they serve, import jobs to imported models.
- **Agent configuration relationships** — agents to aliases and versions, agents to action groups, agents to knowledge bases and the data sources beneath them.
- **Knowledge base and data source access** — knowledge bases to their data sources, data sources to the S3 location or Redshift cluster that backs them.
- **Lambda invocation edges** — action groups to the Lambda functions they invoke.
- **Redshift access edges** — data sources to the Redshift clusters they read from.
- **IAM role permission edges** — agents and other resources to the IAM roles that grant them access, with edges materialized from the permissions those roles carry.

You can navigate these relationships from any Bedrock resource detail in AI Inventory.

## Posture checks for Bedrock resources[​](#posture-checks-for-bedrock-resources)
Atlas applies a set of Bedrock-specific posture checks to discovered resources. After a discovery scan writes resources into inventory, the corresponding findings surface in AI SPM. The implemented checks cover:

- **Agent encryption** and **agent-version encryption.**
- **Agent guardrails** and **agent-version guardrails.**
- **Flow encryption.**
- **Prompt encryption.**
- **Custom-model encryption.**
- **Prompt max-token configuration.**

Findings can be reviewed and triaged from AI SPM alongside posture findings for other AWS services.

## Cloud account setup requirements[​](#cloud-account-setup-requirements)
To enable Bedrock discovery for an AWS account, link the account from **AI Inventory &gt; Resource Management &gt; Add New Cloud Account** and choose the AWS provider. The linking form exposes the following setup options:

- **Single Account** setup, with either the **Command** option (a CLI command you run against the account) or the **Manual** option (a CloudFormation quick-create link).
- **Multiple Accounts** setup, which provides a CloudFormation **StackSet** template that you apply across the accounts in your AWS organization.
- **Test Connection** action, which verifies that Atlas can assume the discovery role you provisioned before you commit the linked account.

The discovery role is the only AWS principal Atlas needs in order to inventory Bedrock resources; the account-linking CloudFormation creates only that cross-account role. It does **not** enable Bedrock model-invocation-logging — that is a separate, manual step you perform in the AWS Bedrock console (see [Foundation model discovery from invocation logs](#foundation-model-discovery-from-invocation-logs) above).

## Related runtime: manually added Bedrock endpoints[​](#related-runtime-manually-added-bedrock-endpoints)
If you want the platform to invoke Bedrock at runtime — for example, to route application traffic through AI Runtime or to run AI Red Team pentests — you configure that separately from cloud-account discovery. A manually added Bedrock LLM endpoint is its own resource in AI Inventory and accepts either an **assumed role ARN** or **AWS access keys** plus a region. Manually added endpoints are independent of the AWS cloud account link used for discovery.

### When to use an assumed role[​](#when-to-use-an-assumed-role)
Use an assumed role when:

- You want the platform to forward Bedrock requests on your behalf using AWS IAM-based authentication.
- You do not want to provide long-lived AWS access keys directly.
- You want to control which Bedrock resources the platform can invoke.

### How to configure an assumed-role Bedrock endpoint[​](#how-to-configure-an-assumed-role-bedrock-endpoint)

- Create or identify an IAM role in your AWS account that the platform can assume.
- Grant that role the Bedrock permissions required for your use case (model invocation, agent invocation, knowledge-base retrieval, list/describe — your account team can supply a reference policy).
- Ensure the role's trust relationship allows the relevant data plane account(s) to assume it.
- Add or edit your Bedrock LLM Endpoint resource: **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint**.
- Select **Bedrock API Key** as the provider.
- Choose **Use Assumed Role** and enter the role ARN in the **AWS Role ARN** field.
- Select the AWS region and complete the rest of the endpoint configuration (project assignment, endpoint identifier).

The endpoint resource is what the platform uses for policy assignment and runtime enforcement. The role ARN tells the platform which IAM role to assume when forwarding Bedrock traffic.

### IAM role requirements[​](#iam-role-requirements)
The assumed role used for Bedrock must include:

- A trust relationship allowing the required platform AWS account(s) to assume it.
- Permissions to invoke the relevant Bedrock resources (foundation models, custom or imported models, agents, knowledge bases).
- The tag `varonis:atlas-bedrock-assume=true`.

The role name does not matter.

#### Example trust relationship[​](#example-trust-relationship)
For Gateway Runtime, the role must trust the data plane account(s) that will process Bedrock traffic. If you also want the same role to support Pentests (which invoke Bedrock from the control plane), add the control-plane AWS account to the `Principal` list as well.

```
{
 "Version": "2012-10-17",
 "Statement": [
 {
 "Effect": "Allow",
 "Principal": {
 "AWS": [
 "arn:aws:iam::&lt;DATAPLANE_1_ACCOUNT_ID&gt;:root",
 "arn:aws:iam::&lt;DATAPLANE_2_ACCOUNT_ID&gt;:root"
 ]
 },
 "Action": "sts:AssumeRole"
 }
 ]
}

```
Replace each `&lt;DATAPLANE_n_ACCOUNT_ID&gt;` with the account IDs your account team provides for your deployment.

#### Example role policy[​](#example-role-policy)
Attach a policy equivalent to the following to the role:

```
{
 "Version": "2012-10-17",
 "Statement": [
 {
 "Sid": "FoundationModelInvoke",
 "Effect": "Allow",
 "Action": [
 "bedrock:InvokeModel",
 "bedrock:InvokeModelWithResponseStream"
 ],
 "Resource": [
 "arn:aws:bedrock:*::foundation-model/*",
 "arn:aws:bedrock:*:&lt;ACCOUNT_ID&gt;:inference-profile/*"
 ]
 },
 {
 "Sid": "CustomModels",
 "Effect": "Allow",
 "Action": [
 "bedrock:InvokeModel",
 "bedrock:InvokeModelWithResponseStream"
 ],
 "Resource": [
 "arn:aws:bedrock:*:&lt;ACCOUNT_ID&gt;:custom-model/*",
 "arn:aws:bedrock:*:&lt;ACCOUNT_ID&gt;:provisioned-model/*"
 ]
 },
 {
 "Sid": "Agents",
 "Effect": "Allow",
 "Action": [
 "bedrock:InvokeAgent"
 ],
 "Resource": "arn:aws:bedrock:*:&lt;ACCOUNT_ID&gt;:agent-alias/*"
 },
 {
 "Sid": "KnowledgeBase",
 "Effect": "Allow",
 "Action": [
 "bedrock:Retrieve",
 "bedrock:RetrieveAndGenerate"
 ],
 "Resource": "arn:aws:bedrock:*:&lt;ACCOUNT_ID&gt;:knowledge-base/*"
 },
 {
 "Sid": "ListAndDescribe",
 "Effect": "Allow",
 "Action": [
 "bedrock:ListFoundationModels",
 "bedrock:GetFoundationModel",
 "bedrock:ListCustomModels",
 "bedrock:GetCustomModel",
 "bedrock:ListProvisionedModelThroughputs",
 "bedrock:GetProvisionedModelThroughput",
 "bedrock:ListAgents",
 "bedrock:GetAgent",
 "bedrock:ListAgentAliases",
 "bedrock:GetAgentAlias",
 "bedrock:ListKnowledgeBases",
 "bedrock:GetKnowledgeBase"
 ],
 "Resource": "*"
 }
 ]
}

```
Replace `&lt;ACCOUNT_ID&gt;` with your AWS account ID. Scope the `Resource` fields down further if you only want the role to invoke a specific subset of Bedrock resources.

## Runtime integration options[​](#runtime-integration-options)
After you add an AWS Bedrock endpoint, choose the integration approach that fits your application:

- **Route Bedrock traffic through the AI Runtime proxy** when you want AI Runtime to apply policies to requests and responses as your application calls Bedrock.
- **Call guardrails directly** when you want your application or an existing API gateway to submit content for evaluation without routing the Bedrock request through the proxy.

### Route traffic through the proxy[​](#route-traffic-through-the-proxy)
AI Runtime supports the AWS Bedrock Converse and ConverseStream APIs through the proxy. For ConverseStream, AI Runtime buffers the complete response, evaluates it with guardrails, and returns the response after processing rather than releasing response chunks incrementally. ConverseStream applies only to models that support response streaming — a model can support Converse without supporting ConverseStream.

See [Pointing to the Proxy](/_docs/docs/applications/ai_gateway#pointing-to-the-proxy) for the Bedrock proxy configuration and code examples.

InvokeModel and InvokeModelWithResponseStream requests are not evaluated by AI Runtime guardrails. Such a request is forwarded to Bedrock unevaluated rather than rejected, so do not route those APIs through the proxy when you require policy enforcement. See [Supported Bedrock operations](/_docs/docs/applications/ai_gateway#supported-bedrock-operations) for the full operation matrix.

Any Bedrock foundation model you can call through the Converse API can be routed through the proxy, whichever vendor publishes it. Reachability depends on the model being available and enabled in the AWS region configured on the endpoint, and streaming additionally depends on that model supporting response streaming. See [Model coverage](/_docs/docs/applications/ai_gateway#model-coverage). Note that this is separate from the models available for policy evaluation — the Runtime Evaluator LLM accepts a fixed set of providers, of which the Bedrock options are Bedrock Anthropic and Bedrock Meta. See [Runtime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm#adding-an-endpoint).

### Call guardrails directly[​](#call-guardrails-directly)
You can call AI Runtime guardrails with the Python SDK or Rule Processing APIs instead of using the proxy. Direct guardrails calls evaluate the content you submit; they do not send your Bedrock request to the model.

For authentication and SDK/API usage, see [Calling Guardrails Directly](/_docs/docs/applications/ai_gateway#calling-guardrails-directly).
[PreviousGoogle Cloud](/_docs/docs/providers/gcp)[NextAnthropic](/_docs/docs/providers/anthropic)- [How AWS Bedrock discovery works](#how-aws-bedrock-discovery-works)- [Bedrock resources Atlas inventories](#bedrock-resources-atlas-inventories)- [Foundation model discovery from invocation logs](#foundation-model-discovery-from-invocation-logs)- [Custom, imported, and marketplace model discovery](#custom-imported-and-marketplace-model-discovery)- [Agent, knowledge base, flow, and prompt discovery](#agent-knowledge-base-flow-and-prompt-discovery)- [AgentCore discovery](#agentcore-discovery)- [Dependency graph relationships](#dependency-graph-relationships)- [Posture checks for Bedrock resources](#posture-checks-for-bedrock-resources)- [Cloud account setup requirements](#cloud-account-setup-requirements)- [Related runtime: manually added Bedrock endpoints](#related-runtime-manually-added-bedrock-endpoints)[When to use an assumed role](#when-to-use-an-assumed-role)- [How to configure an assumed-role Bedrock endpoint](#how-to-configure-an-assumed-role-bedrock-endpoint)- [IAM role requirements](#iam-role-requirements)- [Runtime integration options](#runtime-integration-options)[Route traffic through the proxy](#route-traffic-through-the-proxy)- [Call guardrails directly](#call-guardrails-directly)
