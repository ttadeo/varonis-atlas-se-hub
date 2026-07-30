---
title: AWS — Direct Deploy (Console)
url: https://prod.alltrue-be.com/_docs/docs/admin_console/data_plane/aws_direct_deploy_console
section: admin_console
---

# AWS — Direct Deploy (Console)

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- AWS — Direct Deploy (Console)Export PDFOn this page# AWS — Direct Deploy (Console)
Deploy the AWS data plane from the AWS CloudFormation console using the **Create Stack** button in the app, which opens CloudFormation with the template URL pre-filled. This is the guided, browser-based path; for an automatable equivalent see [AWS — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli). For the deployment-options overview and the in-product Data Plane area, see [Data Plane](/_docs/docs/admin_console/data_plane).

## Before you begin[​](#before-you-begin)

- Sign in to the correct AWS account and Region.
- Have your onboarding credentials ready: **Customer ID** and **Job Admin Key**.
- Have an AWS Certificate Manager (ACM) certificate in `ISSUED` status, in the **same Region** as the stack, covering your custom domain.

## Open the CloudFormation console[​](#open-the-cloudformation-console)
Click **Create Stack** in the app. Your browser opens the CloudFormation **Create stack** page with the template URL already set. Confirm you are in the correct account and Region before continuing.

Enter a **stack name** — for example `atlas-dataplane`. The name must be unique within the Region.

## Required parameters[​](#required-parameters)
ParameterDescriptionExample`CustomerId`Your Customer ID (UUID format). Provided during onboarding.`550e8400-e29b-41d4-a716-446655440000``JobAdminKey`API key for control plane authentication. Provided during onboarding. This field is masked (NoEcho).*(provided during onboarding)*`CustomDomainName`The fully-qualified domain name for the data plane API endpoint. You must own this domain and will create a CNAME record after deployment.`atlas-api.customer.com``CustomDomainCertificateArn`ARN of an ACM certificate for the custom domain. Must be in the same Region as the stack and in `ISSUED` status. Required when `CreateApiGateway` is `true` (the default).`arn:aws:acm:us-east-1:123456789012:certificate/abc-123`
## Optional parameters and deployment scenarios[​](#optional-parameters-and-deployment-scenarios)
Leave optional parameters at their defaults for a standard deployment. Set them for the scenarios below.

ParameterDefaultDescription`RetentionDays``30`Data retention in days for CloudWatch logs. Set a higher value when your compliance or audit policy requires longer log retention.`CreateApiGateway``true`Set to `false` to skip API Gateway creation; the load balancer and backend services are still deployed. Use when you bring your own API gateway or load balancer.`ExistingVpcId`*(empty)*ID of an existing VPC to deploy into. Leave empty to create a new `10.0.0.0/16` VPC.`ExistingPrivateSubnet1Id`*(empty)*First private subnet (AZ-0), with outbound internet via a NAT gateway. Required when `ExistingVpcId` is set.`ExistingPrivateSubnet2Id`*(empty)*Second private subnet (AZ-1), with outbound internet via a NAT gateway. Required when `ExistingVpcId` is set.`ExtraCACertSecretArn`*(empty)*ARN of a Secrets Manager secret holding a PEM-encoded CA certificate, for enterprise VPCs with TLS-inspection firewalls.`IslandLogBucketPath``island/`S3 prefix for Island Browser log exports. Rarely changed.`OtelLogBucketPath``otel/`S3 prefix for OpenTelemetry collector log exports. Rarely changed.
### Scenario A: default deployment (new VPC)[​](#scenario-a-default-deployment-new-vpc)
Fill in only the required parameters. The template creates a new VPC (`10.0.0.0/16`) with public and private subnets, NAT gateways, and all networking resources.

### Scenario B: deploy into an existing VPC (BYOV)[​](#scenario-b-deploy-into-an-existing-vpc-byov)
To deploy into a corporate VPC with existing networking, set the required parameters plus `ExistingVpcId`, `ExistingPrivateSubnet1Id`, and `ExistingPrivateSubnet2Id`. Both subnets must be private (no auto-assigned public IPs), must have outbound internet access via a NAT gateway, and must be in different Availability Zones. All three VPC parameters must be provided together.

### Scenario C: enterprise VPC with TLS inspection[​](#scenario-c-enterprise-vpc-with-tls-inspection)
If your corporate firewall inspects outbound TLS traffic, set the Scenario B parameters plus `ExtraCACertSecretArn` — the ARN of a Secrets Manager secret containing the firewall's CA certificate in PEM format. The CA certificate is injected into the container trust stores so they accept the firewall's re-signed certificates.

### Scenario D: bring your own gateway[​](#scenario-d-bring-your-own-gateway)
To place your own API gateway or load balancer in front of the data plane, set `CreateApiGateway` to `false`. The load balancer and backend services are still deployed; route traffic from your gateway to the internal load balancer. `CustomDomainCertificateArn` is not required in this scenario.

## Create the stack[​](#create-the-stack)

- On **Configure stack options**, optionally add tags (for example `Environment=production`) and select a CloudFormation service role if you use one. Leave other settings at their defaults unless you have specific requirements.
- On the **Review** page, scroll to the bottom and select **I acknowledge that AWS CloudFormation might create IAM resources with custom names.** This is required because the template creates the IAM roles used by the backend services, functions, and other resources.
- Choose **Create stack**. Deployment takes approximately 30–45 minutes. You can follow progress on the **Events** tab.

If the stack fails with a `CustomDomainCertificateArn` error, verify that the certificate is in the same Region, is in `ISSUED` status, and covers the custom domain name.

## After deployment — configure DNS and verify[​](#after-deployment--configure-dns-and-verify)

- 
On the stack's **Outputs** tab, copy the value of `ApiGatewayRegionalDomainName` (the API Gateway regional domain).

- 
In your DNS provider, create a **CNAME record** pointing your custom domain at that value:

```
atlas-api.customer.com CNAME d-abc123.execute-api.us-east-1.amazonaws.com

```

- 
Verify the deployment:

```
curl https://atlas-api.customer.com/sdk/health
# Expected: HTTP 200

```

[PreviousAzure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli)[NextAWS — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli)- [Before you begin](#before-you-begin)- [Open the CloudFormation console](#open-the-cloudformation-console)- [Required parameters](#required-parameters)- [Optional parameters and deployment scenarios](#optional-parameters-and-deployment-scenarios)[Scenario A: default deployment (new VPC)](#scenario-a-default-deployment-new-vpc)- [Scenario B: deploy into an existing VPC (BYOV)](#scenario-b-deploy-into-an-existing-vpc-byov)- [Scenario C: enterprise VPC with TLS inspection](#scenario-c-enterprise-vpc-with-tls-inspection)- [Scenario D: bring your own gateway](#scenario-d-bring-your-own-gateway)- [Create the stack](#create-the-stack)- [After deployment — configure DNS and verify](#after-deployment--configure-dns-and-verify)
