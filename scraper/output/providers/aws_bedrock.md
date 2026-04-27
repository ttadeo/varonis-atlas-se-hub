---
title: AWS Bedrock
url: https://prod.alltrue-be.com/_docs/docs/providers/aws_bedrock
section: providers
---

# AWS Bedrock

- [](/_docs/)- Providers- AWS BedrockOn this page# AWS Bedrock
Atlas supports AWS Bedrock across multiple features, including Gateway Runtime and Pentests. Depending on how you want Atlas to invoke Bedrock, you can configure either direct credentials or an assumed role.

## Bedrock invocation options[​](#bedrock-invocation-options)
Atlas supports the following ways to invoke AWS Bedrock:

### Access keys[​](#access-keys)
You can configure Bedrock access using AWS access key credentials. In this case, Atlas uses the provided credentials to sign requests sent to Bedrock.

### Assumed role[​](#assumed-role)
You can configure Atlas to assume a customer-managed IAM role before invoking Bedrock. This is the recommended option when you want Atlas to invoke Bedrock without storing long-lived access keys and when you want tighter control over permissions.

Assumed roles are supported for:

- Gateway Runtime invocation from the data plane
- Pentest invocation from the control plane

These are separate execution paths and should be considered independently when configuring trust relationships.

## Gateway Runtime with AWS Bedrock[​](#gateway-runtime-with-aws-bedrock)
When using Gateway Runtime, your application sends Bedrock traffic to the Atlas proxy instead of directly to AWS Bedrock.

The flow works as follows:

- Your application sends the Bedrock request to the Atlas gateway.
- The Atlas data plane evaluates runtime policies and takes any configured actions.
- If the request is allowed to continue, Atlas re-signs the request and forwards it to AWS Bedrock.

If you configure Bedrock using an assumed role, the Atlas data plane assumes the IAM role you provide and uses the resulting credentials to invoke Bedrock on your behalf.

**Note:** When using the SDK, Bedrock authentication is not required by Atlas Runtime.

### When an assumed role is needed[​](#when-an-assumed-role-is-needed)
Use an assumed role when:

- You want Atlas Proxy Runtime to forward Bedrock requests on your behalf using AWS IAM-based authentication
- You do not want to provide long-lived AWS access keys directly
- You want to control which Bedrock resources Atlas can invoke

### How to configure it in Atlas[​](#how-to-configure-it-in-atlas)
To configure Gateway Runtime with an assumed role:

- Create or identify an IAM role in your AWS account that Atlas can assume.
- Grant that role the Bedrock permissions required for your use case (see details at the end of this document).
- Ensure the role trust relationship allows the relevant Atlas data plane account(s) to assume the role.
- Add or edit your Bedrock LLM Endpoint resource in Atlas.
- Select **Use Assumed Role**.
- Enter the role ARN in the **AWS Role ARN** field.
- Select the AWS region and complete the rest of the endpoint configuration.

## Pentests with AWS Bedrock[​](#pentests-with-aws-bedrock)
Atlas also supports Bedrock invocation from the control plane for Pentests. This is a separate feature from Gateway Runtime.

When Bedrock invocation is enabled during installation of the discovery stack, Atlas can automatically provision the role path needed for control-plane Bedrock invocation. This allows Pentests to make requests to Bedrock from the Atlas control plane.

**Important:** Gateway Runtime and Pentests do not run from the same place:

- Gateway Runtime invokes Bedrock from the Atlas **data plane**
- Pentests invoke Bedrock from the Atlas **control plane**

Because of this, the IAM trust relationship must match the feature or features you plan to use.

### Using one role for both Gateway Runtime and Pentests[​](#using-one-role-for-both-gateway-runtime-and-pentests)
If you want to support both:

- Gateway Runtime from the data plane, and
- Pentests from the control plane

then the IAM role must trust both:

- The relevant Atlas data plane AWS account(s), and
- The Atlas control-plane AWS account

A single role can be used for both as long as the trust relationship and permissions allow both execution paths.

## IAM role requirements[​](#iam-role-requirements)
The assumed role used for Bedrock must include:

- A trust relationship allowing the required Atlas AWS account(s) to assume it
- Permissions to invoke the relevant Bedrock resources
- The tag `varonis:atlas-bedrock-assume=true`

**Note:** The role name does not matter.

### Required role tag[​](#required-role-tag)
Add the following tag to the role:

`varonis:atlas-bedrock-assume=true`

### Example trust relationship[​](#example-trust-relationship)
For Gateway Runtime, the role must trust the Atlas data plane account or accounts that will process Bedrock traffic.

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
If you also want the same role to support Pentests, add the Atlas control-plane AWS account to the Principal list as well.

### Example role policy[​](#example-role-policy)
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
Replace:

- `&lt;ACCOUNT_ID&gt;` with your AWS account ID
- `&lt;DATAPLANE_1_ACCOUNT_ID&gt;`, `&lt;DATAPLANE_2_ACCOUNT_ID&gt;`, and any additional placeholders with the Atlas account IDs provided for your deployment

## Configuring the LLM Endpoint in Atlas[​](#configuring-the-llm-endpoint-in-atlas)
When adding a Bedrock LLM Endpoint in Atlas:

- Go to **AI Inventory &gt; Resource Management &gt; Add New Resources Manually &gt; Add New LLM Endpoint**
- Select **Bedrock API Key** as the provider
- Choose **Use Assumed Role**
- Enter the role ARN in **AWS Role ARN**
- Select the AWS region
- Assign the endpoint to the appropriate project
- Set the endpoint identifier if needed for policy targeting
- Add the endpoint to inventory

This LLM Endpoint resource is the object Atlas uses for policy assignment and runtime enforcement. The role ARN tells Atlas which IAM role it should assume when forwarding Bedrock traffic from the data plane.

## Summary[​](#summary)
Use an assumed role for Bedrock when you want Atlas to invoke Bedrock securely using AWS IAM-based access.

- For Gateway Runtime, the role must trust the Atlas data plane account(s)
- For Pentests, the role must trust the Atlas control-plane account
- For both features together, one role may be used if it trusts both sets of Atlas accounts
- The role must include Bedrock permissions and the tag `varonis:atlas-bedrock-assume=true`
[PreviousGetting Started with API Calls](/_docs/docs/platform_services/api)[NextLiteLLM Proxy Integration](/_docs/docs/integration_examples/litellm)- [Bedrock invocation options](#bedrock-invocation-options)[Access keys](#access-keys)- [Assumed role](#assumed-role)- [Gateway Runtime with AWS Bedrock](#gateway-runtime-with-aws-bedrock)[When an assumed role is needed](#when-an-assumed-role-is-needed)- [How to configure it in Atlas](#how-to-configure-it-in-atlas)- [Pentests with AWS Bedrock](#pentests-with-aws-bedrock)[Using one role for both Gateway Runtime and Pentests](#using-one-role-for-both-gateway-runtime-and-pentests)- [IAM role requirements](#iam-role-requirements)[Required role tag](#required-role-tag)- [Example trust relationship](#example-trust-relationship)- [Example role policy](#example-role-policy)- [Configuring the LLM Endpoint in Atlas](#configuring-the-llm-endpoint-in-atlas)- [Summary](#summary)
