---
title: AWS — Deploy by Command (CLI)
url: https://prod.alltrue-be.com/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli
section: admin_console
---

# AWS — Deploy by Command (CLI)

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- AWS — Deploy by Command (CLI)Export PDFOn this page# AWS — Deploy by Command (CLI)
Deploy the AWS data plane with the AWS CLI. Use this path for automation, CI/CD pipelines, or environments where console access is restricted. For the guided browser-based path see [AWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console); for the deployment-options overview see [Data Plane](/_docs/docs/admin_console/data_plane).

## Prerequisites[​](#prerequisites)

- AWS CLI v2 installed and configured (`aws configure`).
- Sufficient IAM permissions to create the stack's resources.
- An ACM certificate in `ISSUED` status for your custom domain, in the deployment Region.
- Onboarding credentials: Customer ID and Job Admin Key.

## Set environment variables[​](#set-environment-variables)
Setting your parameters as environment variables keeps the deploy command readable and easy to reuse across environments.

VariableDescription`STACK_NAME`Name for the CloudFormation stack. Must be unique within the Region.`REGION`AWS Region to deploy into (for example `us-east-1`). Must match the Region of your ACM certificate.`TEMPLATE_URL`S3 URL of the CloudFormation template. Provided during onboarding.`CUSTOMER_ID`Your Customer ID (UUID format). Provided during onboarding.`JOB_ADMIN_KEY`API key for control plane authentication. Provided during onboarding.`CUSTOM_DOMAIN`Fully-qualified domain name for the data plane API endpoint. You must own this domain.`CERT_ARN`ARN of an ACM certificate for the custom domain, in `ISSUED` status and in the same Region.
```
export STACK_NAME="&lt;stack-name&gt;"
export REGION="&lt;aws-region&gt;"
export TEMPLATE_URL="&lt;template-url&gt;"
export CUSTOMER_ID="&lt;customer-id&gt;"
export JOB_ADMIN_KEY="&lt;job-admin-key&gt;"
export CUSTOM_DOMAIN="&lt;custom-domain-name&gt;"
export CERT_ARN="&lt;acm-certificate-arn&gt;"

```
Optional variables — `RETENTION_DAYS` (CloudWatch log retention, default `30`), `EXISTING_VPC_ID` with `EXISTING_PRIVATE_SUBNET_1` / `EXISTING_PRIVATE_SUBNET_2` (deploy into an existing VPC), `EXTRA_CA_CERT_ARN` (TLS-inspection CA), and `CREATE_API_GATEWAY` (`false` to skip the API gateway):

```
export RETENTION_DAYS="30"
# export EXISTING_VPC_ID="&lt;vpc-id&gt;"
# export EXISTING_PRIVATE_SUBNET_1="&lt;subnet-id-az0&gt;"
# export EXISTING_PRIVATE_SUBNET_2="&lt;subnet-id-az1&gt;"

```
## Deploy the stack[​](#deploy-the-stack)
Default deployment (new VPC):

```
aws cloudformation create-stack \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --template-url "${TEMPLATE_URL}" \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters \
 ParameterKey=CustomerId,ParameterValue="${CUSTOMER_ID}" \
 ParameterKey=JobAdminKey,ParameterValue="${JOB_ADMIN_KEY}" \
 ParameterKey=CustomDomainName,ParameterValue="${CUSTOM_DOMAIN}" \
 ParameterKey=CustomDomainCertificateArn,ParameterValue="${CERT_ARN}" \
 ParameterKey=RetentionDays,ParameterValue="${RETENTION_DAYS:-30}"

```
To deploy into an existing VPC (BYOV), add the three VPC parameters (all required together):

```
aws cloudformation create-stack \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --template-url "${TEMPLATE_URL}" \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters \
 ParameterKey=CustomerId,ParameterValue="${CUSTOMER_ID}" \
 ParameterKey=JobAdminKey,ParameterValue="${JOB_ADMIN_KEY}" \
 ParameterKey=CustomDomainName,ParameterValue="${CUSTOM_DOMAIN}" \
 ParameterKey=CustomDomainCertificateArn,ParameterValue="${CERT_ARN}" \
 ParameterKey=ExistingVpcId,ParameterValue="${EXISTING_VPC_ID}" \
 ParameterKey=ExistingPrivateSubnet1Id,ParameterValue="${EXISTING_PRIVATE_SUBNET_1}" \
 ParameterKey=ExistingPrivateSubnet2Id,ParameterValue="${EXISTING_PRIVATE_SUBNET_2}"

```
To skip the API gateway and place your own in front, set `CreateApiGateway` to `false` (the load balancer and backend services are still deployed):

```
aws cloudformation create-stack \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --template-url "${TEMPLATE_URL}" \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters \
 ParameterKey=CustomerId,ParameterValue="${CUSTOMER_ID}" \
 ParameterKey=JobAdminKey,ParameterValue="${JOB_ADMIN_KEY}" \
 ParameterKey=CustomDomainName,ParameterValue="${CUSTOM_DOMAIN}" \
 ParameterKey=CreateApiGateway,ParameterValue="false"

```
For enterprise VPCs with TLS inspection, also pass `ExtraCACertSecretArn` (the Secrets Manager ARN of the firewall's PEM CA certificate) alongside the existing-VPC parameters.

## Wait for completion and monitor progress[​](#wait-for-completion-and-monitor-progress)
```
aws cloudformation wait stack-create-complete \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}"

```
This blocks until the stack reaches `CREATE_COMPLETE` or fails; deployment takes approximately 30–45 minutes. To inspect failures while it runs:

```
aws cloudformation describe-stack-events \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --query "StackEvents[?ResourceStatus=='CREATE_FAILED'].[LogicalResourceId,ResourceStatusReason]" \
 --output table

```
## Configure DNS and verify[​](#configure-dns-and-verify)
Read the API Gateway domain from the stack outputs, then create a CNAME record for your custom domain:

```
APIGW_DOMAIN=$(aws cloudformation describe-stacks \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --query "Stacks[0].Outputs[?OutputKey=='ApiGatewayRegionalDomainName'].OutputValue" \
 --output text)

echo "Create a CNAME record: ${CUSTOM_DOMAIN} -&gt; ${APIGW_DOMAIN}"

```
After the CNAME record exists, verify the deployment:

```
curl -s -o /dev/null -w "%{http_code}" "https://${CUSTOM_DOMAIN}/sdk/health"
# Expected: 200

```
If you deployed with `CreateApiGateway=false`, the stack does not create an API Gateway domain. Point your custom domain at your own gateway or load balancer (which forwards to the internal load balancer the stack creates), then run the same health check.

## Update an existing stack[​](#update-an-existing-stack)
To change parameters on a running stack, reuse the unchanged values and set the ones you want to update:

```
aws cloudformation update-stack \
 --stack-name "${STACK_NAME}" \
 --region "${REGION}" \
 --template-url "${TEMPLATE_URL}" \
 --capabilities CAPABILITY_NAMED_IAM \
 --parameters \
 ParameterKey=CustomerId,UsePreviousValue=true \
 ParameterKey=JobAdminKey,UsePreviousValue=true \
 ParameterKey=CustomDomainName,UsePreviousValue=true \
 ParameterKey=CustomDomainCertificateArn,UsePreviousValue=true \
 ParameterKey=RetentionDays,ParameterValue="90"

```
## Parameter reference[​](#parameter-reference)
ParameterRequiredDefaultDescription`CustomerId`Yes—Customer ID (UUID format).`JobAdminKey`Yes—Control plane authentication key (masked).`CustomDomainName`Yes—FQDN for the data plane endpoint.`CustomDomainCertificateArn`Conditional*(empty)*ACM certificate ARN. Required when `CreateApiGateway` is `true`.`RetentionDays`No`30`CloudWatch Logs retention period.`CreateApiGateway`No`true`Set `false` to skip the API gateway; load balancer and backend services still created.`ExistingVpcId`No*(empty)*Existing VPC ID for BYOV. When set, all three VPC parameters are required.`ExistingPrivateSubnet1Id`No*(empty)*Private subnet in AZ-0 with a NAT route.`ExistingPrivateSubnet2Id`No*(empty)*Private subnet in AZ-1 with a NAT route.`ExtraCACertSecretArn`No*(empty)*Secrets Manager ARN of a PEM CA certificate for TLS-inspection environments.`IslandLogBucketPath`No`island/`S3 prefix for Island Browser log exports.`OtelLogBucketPath`No`otel/`S3 prefix for OpenTelemetry collector log exports.[PreviousAWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console)[NextRuntime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm)- [Prerequisites](#prerequisites)- [Set environment variables](#set-environment-variables)- [Deploy the stack](#deploy-the-stack)- [Wait for completion and monitor progress](#wait-for-completion-and-monitor-progress)- [Configure DNS and verify](#configure-dns-and-verify)- [Update an existing stack](#update-an-existing-stack)- [Parameter reference](#parameter-reference)
