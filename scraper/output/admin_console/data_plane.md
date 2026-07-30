---
title: Data Plane
url: https://prod.alltrue-be.com/_docs/docs/admin_console/data_plane
section: admin_console
---

# Data Plane

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Data PlaneExport PDFOn this page# Data Plane
This page covers two things: (1) the infrastructure-deployment requirements for running a Varonis data plane in a customer-owned AWS or Azure subscription, and (2) the in-product Admin Console **Data Plane** area, which exposes Status and Management tabs for a data plane that is already deployed.

## Overview[​](#overview)
Varonis uses a two-plane architecture: a multi-tenant SaaS control plane and a data plane that runs close to your AI traffic. The data plane runs either inside your own AWS or Azure environment or is managed for you. This page describes the customer-managed deployment options. For the conceptual split between control plane and data plane, see [Architecture](/_docs/docs/overview/architecture).

Two customer-managed deployment options are supported:

- **AWS** — provisioned via a Varonis-supplied CloudFormation template.
- **Azure** — provisioned via a Varonis-supplied ARM template (`mainTemplate.json`).

In both options, the customer provides a cloud account or subscription and a custom domain; Varonis's template provisions the remaining infrastructure (compute, network, storage, identity, monitoring) in that account.

## In the Admin Console[​](#in-the-admin-console)
The Admin Console's **Data Plane** area has two tabs for an already-deployed data plane.

### Status[​](#status)
The Status tab — titled **Data Plane Health Status** in the Admin Console — gives you a real-time overview of data plane infrastructure and services. A registration selector at the top lets you pick which deployed data plane to inspect; a **Refresh** button re-fetches the latest health snapshot on demand.

The cards displayed depend on whether the selected data plane runs on AWS or Azure.

**AWS data plane:**

- **Overview** — CloudFormation Stack Status, Alembic Stepfunction Status, last-refreshed time, and an overall health icon.
- **Gateway** — runtime health of the AI Runtime services running in the data plane.
- **Pen Test** — runtime health of the AI Red Team pentest workers.

**Azure data plane:**

- **Azure Overview** — ARM deployment status, alembic job status, and the depth of the rules-processor queue.
- **Proxy** — revision status, running replicas, and image metadata for the `proxy` Container App.
- **Rule API** — revision status, running replicas, and image metadata for the `rule-api` Container App.
- **Rqlite** — revision status, running replicas, and image metadata for the `rqlite` Container App.

### Management[​](#management)
The Management tab lists every data plane registered to your tenant. The registrations table shows the following columns:

ColumnDescriptionData Plane Account IDFriendly display name (falls back to the AWS account ID or Azure subscription ID).RegionThe AWS region or Azure region where the data plane is deployed.Cloud Provider`AWS` or `AZURE`.Role ConfigurationsBadges showing whether this data plane is the tenant's Control Plane DEK holder, its LLM Pentest Target, or both.Registered AtTimestamp when this data plane registered with the control plane.StatusCurrent deploy status (for AWS, the CloudFormation stack status).
Click a row to open a details drawer with the data plane's full registration record.

**Role configurations.** From this tab you can assign two tenant-scoped roles to one of your registered data planes:

- **Control Plane DEK** — the data plane that holds the data-encryption key used for control-plane-stored secrets. Only AWS data planes are eligible.
- **LLM Pentest Target** — the data plane that AI Red Team pentests run against. Any provider is eligible.

Changes are confirmed in a dialog before they are saved.

**Install a new data plane.** Use the install action on this tab to start onboarding a new data plane; the install flow dispatches to the AWS or Azure path depending on your choice. For the full install walkthrough, see [Onboarding — Install the data plane](/_docs/docs/platform_services/onboarding#install-data-plane).

## AWS data plane[​](#aws-data-plane)
### Prerequisites[​](#prerequisites)

- An AWS account with permission to deploy CloudFormation stacks. You supply the 12-digit AWS account ID during installation.
- A target deploy region. The installer defaults to `us-west-2`.
- An ACM certificate in **Issued** status, in the target region, covering the custom domain you intend to use.
- A Varonis-issued `JobAdminKey` (provided by your account team).

### Required CloudFormation parameters[​](#required-cloudformation-parameters)
The CloudFormation template accepts the following customer-facing parameters:

- `CustomDomainCertificateArn` — ACM certificate ARN for your custom domain.
- `CustomDomainName` — the FQDN where the data plane will be reachable.
- `JobAdminKey` — control plane authentication key provided by Varonis.

### Networking[​](#networking)
By default, the template provisions a new VPC with public and private subnets, NAT gateways, and the VPC endpoints listed below.

To deploy into an existing VPC ("bring your own VPC"), pass these three optional parameters together — they are all-or-nothing:

- `ExistingVpcId`
- `ExistingPrivateSubnet1Id`
- `ExistingPrivateSubnet2Id` (must be in a different Availability Zone from `ExistingPrivateSubnet1Id`)

If you use BYO VPC, the subnets you provide must allow outbound internet access and DNS resolution, and must reach the following AWS services (via NAT or VPC endpoints):

- Secrets Manager
- CloudWatch Logs
- SSM
- SQS
- ECR
- S3
- KMS

### What Varonis creates via CloudFormation[​](#what-varonis-creates-via-cloudformation)
The template provisions the following in your account.

**Compute — ECS on Fargate.** Seven application services plus an `rqlite` cluster for shared data-plane state:

ServicePurpose`rule-api`Configuration and policy API for the data plane.`rule-worker`Runtime guardrail evaluation.`pentest-worker`AI Red Team pentest execution.`code-scanning-worker`Source-code scanning.`model-scanning-worker`Model artifact scanning.`notebook-scanning-worker`Notebook scanning.`dataset-scanning-worker`Dataset scanning.`rqlite` (3-node)Shared data-plane state store.
**Messaging — SQS.** A `RuleProcessorSQS` queue paired with a dead-letter queue (`maxReceiveCount: 5`).

**Storage — S3.** Buckets for file ingestion and for control-plane synchronization. Bucket names are derived from the customer ID and the deployment region.

**Networking.** A VPC with private subnets across multiple Availability Zones, a NAT gateway, and VPC endpoints for the services listed under [Networking](#networking).

**Identity — IAM.**

- An ECR repository policy that allows your AWS account to pull Varonis container images.
- A trust relationship granting the Varonis control-plane account permission for callback paths (deploy status, registration).

**Callbacks — SNS.** A topic that notifies the control plane of deploy and status events.

**Auth.** Data-plane services obtain JWTs from the control plane endpoint `POST /v1/auth/issue-jwt-token` using the `JobAdminKey` parameter.

**Resource sizing.** Task vCPU and memory, autoscaling minimum and maximum replica counts, and queue retention values follow the CloudFormation template Varonis provides. Review the template before deployment to confirm it fits your account quotas.

For the deploy and post-deployment steps — the stack command, DNS, and verification — follow the canonical guides: [AWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console) or [AWS — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli).

For multi-data-plane-account trust patterns (when one IAM role spans multiple data-plane accounts), see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

## Azure data plane[​](#azure-data-plane)
The Azure data plane is generally available. The deployment uses an ARM template (`mainTemplate.json`) supplied by Varonis.

### Prerequisites[​](#prerequisites-1)
Before deploying, ensure the following:

- **An Azure subscription** with sufficient quota (see the [Subscription quota summary](#subscription-quota-summary)).
- **A resource group** in one of the supported regions.
- **A custom domain name** (for example `varonis-atlas.customer.com`) — you will point a DNS A record to the Application Gateway public IP after deployment.
- **A PFX certificate** for the custom domain (base64-encoded) and its password.
- **Credentials provided by Varonis:**

`customerId` — UUID identifying your data plane.
- `jobAdminKey` — control plane authentication key.
- `acrPassword` — container registry pull token for accessing Varonis container images.

### Required Azure RBAC roles for the deploying user[​](#required-azure-rbac-roles-for-the-deploying-user)
The person running the deployment needs the following Azure RBAC roles on the target resource group (or subscription):

RoleWhy**Contributor**Create all infrastructure resources (VNet, Container Apps, PostgreSQL, Storage, Key Vault, App Gateway, Service Bus, etc.)**User Access Administrator**The template creates RBAC role assignments for the managed identity (Contributor, AcrPull, Key Vault Secrets Officer, Service Bus Data Owner, User Access Administrator)**Role Based Access Control Administrator**Alternative to User Access Administrator — allows creating role assignments with conditions
**Minimum:** Contributor + User Access Administrator on the resource group. If your organization uses custom roles, the deploying identity needs `Microsoft.Authorization/roleAssignments/write` permission.

### Required Azure resource providers[​](#required-azure-resource-providers)
The following resource providers must be registered on the subscription:

ProviderService`Microsoft.Network`VNet, NAT Gateway, NSG, Public IP, Application Gateway, Private Endpoints, Private DNS Zones`Microsoft.App`Container Apps, Container Apps Environment, Container Apps Jobs`Microsoft.DBforPostgreSQL`PostgreSQL Flexible Server`Microsoft.Storage`Storage Account`Microsoft.KeyVault`Key Vault`Microsoft.ServiceBus`Service Bus`Microsoft.ManagedIdentity`User-Assigned Managed Identity`Microsoft.OperationalInsights`Log Analytics Workspace`Microsoft.Insights`Azure Monitor Workbook`Microsoft.Resources`ARM Deployment Scripts`Microsoft.Authorization`RBAC Role Assignments, Resource Locks
### Compute resources[​](#compute-resources)
**Container Apps (Consumption Workload Profile).**

Container AppvCPUMemoryMin ReplicasMax ReplicasScaling Trigger`proxy`24 Gi220CPU &gt; 80%`rule-api`12 Gi220CPU &gt; 80%`rqlite`12 Gi11None (fixed)

- **Baseline compute (min replicas):** 7 vCPU, 14 Gi memory.
- **Peak compute (max replicas):** 61 vCPU, 122 Gi memory.

**Container Apps Jobs.**

JobvCPUMemoryScheduleTimeout`alembic` (DB migration)0.51 GiManual trigger300s`container-updater`0.51 GiHourly (`0 * * * *`)600s`arm-updater`0.51 GiHourly (`30 * * * *`)1800s`monitoring`0.51 GiEvery 5 min (`*/5 * * * *`)240s`failure-monitor`0.51 GiEvery 5 min (`*/5 * * * *`)240s
Jobs use the `mcr.microsoft.com/azure-cli` image and run with the managed identity.

**PostgreSQL Flexible Server.**

PropertyValueSKU`Standard_D2ds_v4` (General Purpose)vCPU2Memory8 GiStorage32 GB (auto-grow enabled)VersionPostgreSQL 16High AvailabilityDisabledBackup Retention7 daysGeo-Redundant BackupDisabled
**Application Gateway.**

PropertyValueSKU / TierWAF_v2Min Capacity1 instanceMax Capacity3 instances (autoscale)WAF Rule SetOWASP 3.2Public IP SKUStandard, static allocation
### Network resources[​](#network-resources)
**VNet and subnets.**

You can either let the template create a new VNet or bring your own (BYON).

**Bring Your Own Network (BYON):** provide an existing VNet and four subnets by passing `existingVnetId` along with the four subnet resource IDs listed below. Recommended when you need to peer with existing corporate networks or comply with enterprise network policies.

**If creating a new VNet (default):** the template provisions a `/16` address space (`10.0.0.0/16`) with the following subnets:

SubnetCIDRMin SizeDelegationPurpose`container-apps``10.0.0.0/23``/23` (512 IPs)`Microsoft.App/environments`Container Apps Environment`postgres``10.0.3.0/24``/24` (256 IPs)`Microsoft.DBforPostgreSQL/flexibleServers`PostgreSQL Flexible Server`private-endpoints``10.0.4.0/24``/24` (256 IPs)NonePrivate endpoints (Storage, Key Vault)`appgw``10.0.5.0/24``/24` (256 IPs)NoneApplication Gateway
**If using BYON,** your subnets must meet the minimum sizes and delegations listed above. Pass the following parameters:

ParameterDescription`existingVnetId`Resource ID of your existing VNet`existingContainerAppsSubnetId`Delegated to `Microsoft.App/environments`, minimum `/23``existingPostgresSubnetId`Delegated to `Microsoft.DBforPostgreSQL/flexibleServers``existingPrivateEndpointsSubnetId`No delegation required`existingAppGwSubnetId``/24`, no delegations
**Additional network resources.**

ResourceSKUPurposeNAT GatewayStandardOutbound internet for Container AppsPublic IP (NAT)Standard, staticNAT GatewayPublic IP (AppGw)Standard, staticApplication Gateway frontendNSG (postgres)—Allow port 5432 from VNet onlyNSG (appgw)—Allow HTTP/HTTPS from internet; GatewayManager ports 65200-65535
**Private DNS Zones.**

ZoneFor`&lt;resource-group&gt;.private.postgres.database.azure.com`PostgreSQL`privatelink.blob.core.windows.net`Storage Account
**Private Endpoints.**

EndpointTargetSubnetBlob StorageStorage Account (blob sub-resource)`private-endpoints`
### Storage and Key Vault[​](#storage-and-key-vault)
**Azure Blob Storage.**

PropertyValueKindStorageV2SKUStandard_LRS (Locally Redundant)Public AccessDisabled (private endpoint only)TLS1.2 minimumContainers`customer-data`, `ingestion`LifecycleAuto-delete blobs after retention period (default: 30 days)
**Azure Key Vault.**

PropertyValueSKUStandardAuthorizationRBACSoft Delete7-day retentionPurge ProtectionEnabled
### Messaging (Service Bus)[​](#messaging-service-bus)
**Azure Service Bus.**

PropertyValueSKU / TierStandard
QueueMax Delivery CountLock DurationMessage TTL`rule-processor`55 min14 days`ingestion-file-queue`35 min4 days`ingestion-job-queue`32 min4 days
Dead-letter queues are created automatically by Service Bus for each queue.

### Monitoring[​](#monitoring)
**Log Analytics Workspace.**

PropertyValueSKUPerGB2018 (pay-as-you-go)RetentionConfigurable (default: 30 days)
An Azure Monitor Workbook is deployed with dashboards for container health, queue depth, Application Gateway metrics, and PostgreSQL metrics.

### Resource locks[​](#resource-locks)
The following resources are protected with `CanNotDelete` locks to prevent accidental deletion:

- Key Vault
- PostgreSQL Server
- Container Apps Environment
- Storage Account
- Service Bus Namespace

### Subscription quota summary[​](#subscription-quota-summary)
Ensure your subscription has sufficient quota in the target region:

ResourceMinimum RequiredContainer Apps vCPU (Consumption)61 vCPU (to allow max autoscaling)PostgreSQL vCPU (General Purpose Ddsv4)2 vCPUApplication Gateway (WAF_v2)1 instancePublic IP Addresses (Standard)2NAT Gateways1VNet address space`/16` (or 4 subnets if BYON)Service Bus Namespaces (Standard)1Storage Accounts1Key Vaults1
For the deploy and post-deployment steps — the deployment command, the full parameter reference, and DNS and verification — follow the canonical guides: [Azure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal) or [Azure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli).

## Related pages[​](#related-pages)

- [Architecture](/_docs/docs/overview/architecture) — conceptual control-plane / data-plane split.
- [Admin Console](/_docs/docs/admin_console/) — landing page for the Admin Console section.
- [Onboarding](/_docs/docs/platform_services/onboarding#install-data-plane) — step-by-step install walkthrough.
- [AI Runtime](/_docs/docs/applications/ai_gateway#data-encryption-on-the-data-plane) — encryption model used between data plane and control plane.
- [AI Runtime — rate and burst limiting](/_docs/docs/applications/ai_gateway#rate-and-burst-limiting) — AWS-only rate limit configuration.
- [AWS Bedrock](/_docs/docs/providers/aws_bedrock) — multi-data-plane-account trust patterns.
[PreviousLog Sources](/_docs/docs/admin_console/log_sources)[NextAzure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal)- [Overview](#overview)- [In the Admin Console](#in-the-admin-console)[Status](#status)- [Management](#management)- [AWS data plane](#aws-data-plane)[Prerequisites](#prerequisites)- [Required CloudFormation parameters](#required-cloudformation-parameters)- [Networking](#networking)- [What Varonis creates via CloudFormation](#what-varonis-creates-via-cloudformation)- [Azure data plane](#azure-data-plane)[Prerequisites](#prerequisites-1)- [Required Azure RBAC roles for the deploying user](#required-azure-rbac-roles-for-the-deploying-user)- [Required Azure resource providers](#required-azure-resource-providers)- [Compute resources](#compute-resources)- [Network resources](#network-resources)- [Storage and Key Vault](#storage-and-key-vault)- [Messaging (Service Bus)](#messaging-service-bus)- [Monitoring](#monitoring)- [Resource locks](#resource-locks)- [Subscription quota summary](#subscription-quota-summary)- [Related pages](#related-pages)
