---
title: AWS
url: https://prod.alltrue-be.com/_docs/docs/providers/aws
section: providers
---

# AWS

- [](/_docs/)- [Providers](/_docs/docs/providers)- AWSExport PDFOn this page# AWS
Getting started with AWS AI security in Atlas centers on connecting your AWS-based AI environment so Atlas can discover it, review its posture, and protect its runtime traffic. This page walks through the connection points an AWS environment uses and how to set each one up. For the Bedrock resources Atlas inventories and the posture checks it applies to them, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

## How Atlas integrates with an AWS AI environment[​](#how-atlas-integrates-with-an-aws-ai-environment)
An AWS AI environment connects to Atlas through three points:

- **Cloud-discovery account link** — link an AWS account and run a discovery pipeline against it to inventory AI-related services, supporting infrastructure, identities, and data paths.
- **Code-repository link** — connect source repositories so code scanning can tie discovered resources back to the applications, dependencies, and AI components that use them.
- **Gateway-proxied runtime LLM endpoint** — register a manually added Bedrock LLM endpoint that AI Runtime forwards traffic to and that AI Red Team targets for pentests.

A fourth provider scope — an evaluator LLM credential — is not part of AWS onboarding and is out of scope for this page.

The sections below set up each connection point. Using the cloud, repository, and runtime connections together gives the strongest foundation for inventory, posture review, runtime protection, and blast-radius analysis.

## Connect your AWS account and deploy the discovery stack[​](#connect-your-aws-account-and-deploy-the-discovery-stack)
Link an AWS account from **AI Inventory &gt; Configuration &gt; Cloud Accounts** by selecting **Link New Account**. Atlas supports two deployment paths:

- **Single Account** — link one account, using either **Option 1: By Command** (run the provided discovery script against the account) or **Option 2: Manually** (a CloudFormation quick-create link that creates the read-only discovery role).
- **Multiple Accounts** — deploy the Cloud Discovery stack across your AWS organization with a CloudFormation **StackSet**. A StackSet deployment targets a single region.

In the **Multiple Accounts** (StackSet) flow, the stack parameters include `EnableBedrockLogging`, which accepts `true` or `false`. Enabling it turns on Bedrock invocation logging, which Atlas uses to discover foundation-model usage from logs (see [AWS Bedrock](/_docs/docs/providers/aws_bedrock)).

The discovery stack also exposes `EnableRedshiftCredentials` (default on), which lets discovery list the databases inside provisioned Redshift clusters, and `EnableBedrockInvocation` (default off), an optional non-read capability that lets the Atlas control plane invoke Bedrock models in your account. (This is separate from pentesting a specific Bedrock endpoint with AI Red Team, which uses a manually added Bedrock LLM endpoint with its own credentials — see [Add a Bedrock LLM endpoint](#add-a-bedrock-llm-endpoint) below.) For exactly what the read-only discovery role can access, why each permission is needed, what deploying the stack requires, and what each optional setting does, see [AWS Permission and Inventory Coverage](/_docs/docs/providers/aws/permission_breakdown).

After the stack is applied, use **Test Connection** to verify that Atlas can assume the provisioned discovery role before you commit the account. Role creation can take up to 5 minutes per account, and AWS account IDs are entered as 12-digit account numbers. The role created by the CloudFormation template or StackSet is the only AWS principal Atlas needs in order to run discovery, and it is scoped to the read-only API calls Atlas uses for inventory discovery.

## Connect your code repositories[​](#connect-your-code-repositories)
Connecting source repositories gives Atlas the application- and code-level context that links discovered AWS resources back to the systems that use them. Register repositories from **AI Inventory &gt; Configuration &gt; Code Scanning** by selecting **Link New Repositories**.

Code scanning supports GitHub, GitLab, Bitbucket, Azure DevOps, and Hugging Face Hub. It is not AWS-specific — it is one of the connection points an AWS-hosted AI environment uses alongside the cloud-account and runtime links. For the full repository-linking workflow, see [Code Scanning](/_docs/docs/applications/ai_inventory/code_scanning).

## Add a Bedrock LLM endpoint[​](#add-a-bedrock-llm-endpoint)
To route Bedrock traffic through AI Runtime, or to pentest a Bedrock-backed system with AI Red Team, add a Bedrock LLM endpoint resource. Go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint** and choose **Bedrock API Key** as the provider.

A Bedrock endpoint always requires credentials, provided with one of exactly two methods:

- **Use Assumed Role** (the default) — supply an **AWS Role ARN** for a role Atlas can assume. Use this when Atlas Gateway Runtime needs to forward Bedrock requests on your behalf: the Atlas data plane assumes the role to invoke Bedrock after runtime policies are evaluated.
- **Use Access Keys** — supply an **AWS Access Key ID** and an **AWS Secret Access Key**.

Select the **AWS Region** for the endpoint and set an **Endpoint Identifier**. The Endpoint Identifier is required for Bedrock and must be unique; it is the key that runtime policy binding and pentests use to target this endpoint (see the next section).

For an example IAM role policy and trust relationship for the assumed-role method, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

## Use the endpoint with AI Runtime and AI Red Team[​](#use-the-endpoint-with-ai-runtime-and-ai-red-team)
The Endpoint Identifier you set on the Bedrock endpoint is the binding key for both runtime protection and pentesting:

- **AI Runtime** forwards traffic to the endpoint and applies the runtime policies bound to it. Configure those policies on the **AI Runtime &gt; Policies** page. See [AI Gateway](/_docs/docs/applications/ai_gateway).
- **AI Red Team** targets the same endpoint resource when it runs a pentest. See [AI Red Team](/_docs/docs/applications/ai_red_team).

When you use the assumed-role method, the two paths assume the Bedrock role from different Atlas accounts:

- For **runtime**, the Atlas data-plane account (or accounts) assumes the role to invoke Bedrock after policies are evaluated.
- For **pentests**, the Atlas control-plane account assumes the role. If you want the same role to support pentesting, its trust policy must also include the control-plane account.

For the concrete trust-relationship and IAM policy examples, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).
[PreviousProviders](/_docs/docs/providers)[NextAWS Permission and Inventory Coverage](/_docs/docs/providers/aws/permission_breakdown)- [How Atlas integrates with an AWS AI environment](#how-atlas-integrates-with-an-aws-ai-environment)- [Connect your AWS account and deploy the discovery stack](#connect-your-aws-account-and-deploy-the-discovery-stack)- [Connect your code repositories](#connect-your-code-repositories)- [Add a Bedrock LLM endpoint](#add-a-bedrock-llm-endpoint)- [Use the endpoint with AI Runtime and AI Red Team](#use-the-endpoint-with-ai-runtime-and-ai-red-team)
