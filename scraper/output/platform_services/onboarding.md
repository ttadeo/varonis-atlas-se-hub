---
title: Onboarding
url: https://prod.alltrue-be.com/_docs/docs/platform_services/onboarding
section: platform_services
---

# Onboarding

- [](/_docs/)- Platform Services- OnboardingExport PDFOn this page# Onboarding
When you first log in, the system guides you through the Onboarding Wizard. This process walks you through the key steps to set up and manage your AI estate.

## Onboarding Wizard overview[​](#onboarding-wizard-overview)
The Onboarding Wizard has six steps, presented in this order:

- Install Data Plane
- Create Organizations
- Define AI Projects
- Link Cloud Account
- Set Inventory Policies
- AI Discovery

Each step can be revisited later from the [Admin Console](/_docs/docs/admin_console/) — you do not need to complete every step in the initial wizard pass.

## Install Data Plane[​](#install-data-plane)
Install the Data Plane to enable the AI Investigation and AI Runtime Protection features. The wizard offers two self-install options, presented as side-by-side tabs:

- **AWS** — deploy via AWS CloudFormation, either by using the AWS Management Console or by running the provided command in your terminal.
- **Azure** — deploy via the Azure equivalent flow.

Each flow ends with a Test Connection step that verifies the Data Plane was installed correctly.

If you do not plan to use AI Runtime Protection or AI Investigation right now, you can skip this step. Skipping disables those features until you install the Data Plane later. You can install the Data Plane after onboarding from the Admin Console.

To learn more about the Data Plane, refer to the [Architecture Overview](/_docs/docs/overview/architecture).

### Install on AWS[​](#install-on-aws)
The AWS Data Plane is deployed into your AWS account as a CloudFormation stack. This section describes the compute, network, storage, and access requirements. For the deploy and post-deployment steps themselves — the stack command, the full parameter reference, and DNS and verification — follow the canonical guides: [AWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console) or [AWS — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/aws_deploy_by_command_cli).

#### Prerequisites[​](#prerequisites)
Before you deploy:

- An AWS account with sufficient service quotas — see the Service quota summary below. The Fargate on-demand vCPU minimum is **17 vCPU**.
- A region that Atlas supports. The CloudFormation template is region-specific.
- A custom domain name (for example, `atlas.customer.com`). After deployment, you will point a CNAME record at the API Gateway custom-domain.
- An ACM certificate for that domain, in the same region as the deployment, in **ISSUED** status.
- Credentials provided by Atlas:

`CustomerId` — UUID identifying your data plane.
- `JobAdminKey` — control-plane authentication key.
- `OpenSearchPassword` — at least 8 characters with at least one uppercase letter, lowercase letter, digit, and special character.

#### Required IAM permissions[​](#required-iam-permissions)
The user or role running the CloudFormation stack needs broad permissions to create all resources. The simplest option is the AWS managed policy **AdministratorAccess**, which covers every resource type and IAM role creation.

If `AdministratorAccess` is not permitted in your organization, the deploying identity needs at minimum:

Permission areaActions requiredCloudFormation`cloudformation:*` on the stackIAM`iam:CreateRole`, `iam:PutRolePolicy`, `iam:AttachRolePolicy`, `iam:PassRole` (the template creates ~12 IAM roles)EC2 / VPCCreate VPC, subnets, NAT gateways, security groups, VPC endpoints, EIPsECSCreate cluster, task definitions, servicesRDSCreate DB instances, subnet groups, parameter groupsOpenSearchCreate domainsAPI GatewayCreate HTTP APIs, routes, integrations, VPC links, custom domainsLambdaCreate functions, event source mappings, permissionsSQSCreate queuesS3Create buckets, configure notifications and lifecycleKMSCreate keys, manage key policiesSecrets ManagerCreate secrets, manage secretsSSMCreate and manage parametersCloudWatchCreate log groups, alarms, dashboardsApplication Auto ScalingRegister targets, create scaling policiesStep FunctionsCreate state machinesElastic Load BalancingCreate ALB, NLB, target groups, listenersSNSCreate topics (for alerting)
#### Compute[​](#compute)
The AWS Data Plane runs five Fargate ECS services, one one-time ECS task, six Lambda functions, an RDS PostgreSQL instance, and an OpenSearch cluster.

**ECS services (Fargate):**

ServicevCPUMemoryDesired / Min / MaxAuto-scaling triggersproxy2 vCPU4 GB2 / 1 / 5CPU &gt; 80% or Memory &gt; 80%rule-api1 vCPU2 GB2 / 1 / 5CPU &gt; 80% or Memory &gt; 80%rule-worker1 vCPU2 GB2 / 1 / 5CPU &gt; 80% or Memory &gt; 80% or SQS depth &gt; 3opensearch-dashboards2 vCPU4 GB2 / 1 / 5CPU &gt; 80% or Memory &gt; 80%rqlite1 vCPU2 GB1 / 1 / 1None (fixed)

- Baseline compute: 9 vCPU, 18 GB memory.
- Peak compute: 17 vCPU, 34 GB memory.
- All services use the Fargate launch type with the deployment circuit breaker enabled.

**ECS one-time task:**

TaskvCPU / MemoryPurposerule-alembic0.5 vCPU / 1 GBDatabase migrations, triggered by a Step Function
**Lambda functions:**

FunctionMemoryTimeoutSchedule / TriggerMonitoring512 MB15 minEvery 5 min (EventBridge)ECS Updater512 MB15 minEvery 1 hour (EventBridge)Registrar512 MB15 minCloudFormation Custom ResourceRegistrarSecretValues512 MB5 minCloudFormation Custom ResourceFirstAlembic128 MB2 minCloudFormation Custom ResourceOSConfigurer512 MB15 minInvoked by Registrar Lambda (VPC-connected)
**RDS (PostgreSQL):**

SettingValueInstance class`db.t4g.medium` (2 vCPU, 4 GB RAM)EnginePostgreSQL 16.8Storage20 GB gp3 (auto-scaling up to 100 GB)Multi-AZYesBackup retention7 daysEncryptionEnabled (AWS managed key)Public accessNoDatabase name`fastgate`Port5432
**OpenSearch:**

SettingValueEngineOpenSearch 2.15Instance type`r7g.medium.search` (Graviton, 2 vCPU, 8 GB RAM)Instance count2Zone awarenessEnabledEBS storage100 GB gp3 per node (3000 IOPS)Encryption at restEnabledNode-to-node encryptionEnabledTLS policy1.2 (PFS-2023-10)Fine-grained access controlEnabled (internal user `atlas-user` + JWT)
#### Network resources[​](#network-resources)
By default the template creates a new VPC. To deploy into an existing VPC instead, see the bring-your-own-VPC options in the canonical AWS guides linked above.

**Default VPC** (10.0.0.0/16 across 2 Availability Zones):

SubnetCIDRAZRoutesPublic Subnet 110.0.1.0/24AZ-0NAT Gateway, Internet GatewayPublic Subnet 210.0.2.0/24AZ-1NAT Gateway, Internet GatewayPrivate Subnet 110.0.3.0/24AZ-0ECS, RDS, OpenSearch, LambdasPrivate Subnet 210.0.4.0/24AZ-1ECS, RDS, OpenSearch, Lambdas
**VPC interface endpoints** (DNS-enabled, deployed in both private subnets):

EndpointServiceSecrets Manager`com.amazonaws.REGION.secretsmanager`CloudWatch Logs`com.amazonaws.REGION.logs`SSM`com.amazonaws.REGION.ssm`
**Load balancers:**

TypeSchemeSubnetsListenersALBInternalPrivate Subnet 1 + 2Port 81 (rule-api), Port 83 (proxy), Port 5601 (OpenSearch Dashboards)NLBInternalPrivate Subnet 1 + 2Port 4001 (rqlite, TCP)
#### API Gateway (HTTP API)[​](#api-gateway-http-api)
The AWS Data Plane exposes a single HTTP API:

- **Protocol:** HTTP (with TLS on the custom domain)
- **TLS policy:** TLS 1.2
- **VPC Link:** routes to the internal ALB
- **Throttling:** 500 RPS per route, 1000 burst
- **Custom domain:** customer-provided domain plus the ACM certificate

**Routes:**

PathTargetPurpose`/openai/{proxy+}`Proxy (port 83)OpenAI`/anthropic/{proxy+}`Proxy (port 83)Anthropic`/google/{proxy+}`Proxy (port 83)Google Gemini`/bedrock/{proxy+}`Proxy (port 83)AWS Bedrock`/ibmwatsonx/{proxy+}`Proxy (port 83)IBM watsonx`/ibmwatsonx-assistant/{proxy+}`Proxy (port 83)IBM watsonx Assistant`/ibmwatsonx-ai-service/{proxy+}`Proxy (port 83)IBM watsonx AI Service`/custom/{proxy+}`Proxy (port 83)Custom provider`/sdk/{proxy+}`Rule API (port 81)SDK control-plane API`/opensearch/{proxy+}`OpenSearch Dashboards (port 5601)OpenSearch UI
The AWS API Gateway prefixes all routes under `/sdk/{proxy+}` for the Rule API and `/&lt;provider&gt;/{proxy+}` for the LLM proxies. This is why the AWS verification endpoint is `/sdk/health`, whereas Azure uses the bare `/health`.

#### Storage, messaging, and quotas[​](#storage-messaging-and-quotas)
**S3:**

BucketPurposeCustomerUsed by ECS tasks for data upload
**SQS:**

QueueSettings`rule-processor`30s default visibility timeout, 4 days message retention, 5 max receives before DLQ
Each queue has a corresponding dead-letter queue.

**Service quota summary:**

QuotaRequiredFargate vCPU (on-demand)17 vCPURDS instances (`db.t4g.medium`)1OpenSearch instances (`r7g.medium.search`)2Elastic IPs2NAT Gateways per AZ1VPC Endpoints3ALBs1NLBs1API Gateway HTTP APIs1Lambda concurrent executions6 functions (default 1000 quota is sufficient)SQS queues2 (1 main + 1 DLQ)S3 buckets1KMS keys1Secrets Manager secrets~9
### Install on Azure[​](#install-on-azure)
The Azure Data Plane is deployed into your Azure subscription as an ARM template, via `az deployment group create`. This section describes the compute, network, storage, and access requirements. For the deploy and post-deployment steps themselves — the deployment command, the full parameter reference, and DNS and verification — follow the canonical guides: [Azure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal) or [Azure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli).

#### Prerequisites[​](#prerequisites-1)
Before you deploy:

- An Azure subscription with sufficient quota — see the Quotas section below.
- A resource group in one of the supported regions.
- A custom domain name (for example, `atlas.customer.com`). After deployment, you will point a DNS A record at the Application Gateway public IP.
- A PFX certificate for the custom domain (base64-encoded) and its password.
- Credentials provided by Atlas:

`customerId` — UUID identifying your data plane.
- `jobAdminKey` — control-plane authentication key.
- `acrPassword` — customer registry pull token for accessing Atlas container images.

#### Required Azure roles[​](#required-azure-roles)
The user or service principal running the deployment needs:

- **Contributor** — to create infrastructure resources (VNet, Container Apps, PostgreSQL, Storage, Key Vault, App Gateway, Service Bus, etc.).
- **User Access Administrator** — the template creates RBAC role assignments for the managed identity (Contributor, AcrPull, Key Vault Secrets Officer, Service Data Owner, User Access Administrator).
- **Role Based Access Control Administrator** — alternative to User Access Administrator; allows creating role assignments with conditions.

**Minimum:** Contributor + User Access Administrator on the resource group.

If your organization uses custom roles, the deploying identity needs `Microsoft.Authorization/roleAssignments/write`.

#### Resource provider registration[​](#resource-provider-registration)
The following 11 resource providers must be registered on the subscription:

ProviderPurpose`Microsoft.Network`VNet, NAT Gateway, NSG, Public IP, Application Gateway, Private Endpoints, Private DNS Zones`Microsoft.App`Container Apps, Container Apps Environment, Container Apps Jobs`Microsoft.DBforPostgreSQL`PostgreSQL Flexible Server`Microsoft.Storage`Storage Account`Microsoft.KeyVault`Key Vault`Microsoft.ServiceBus`Service Bus Namespace`Microsoft.ManagedIdentity`User-assigned managed identity`Microsoft.OperationalInsights`Log Analytics Workspace`Microsoft.Insights`Azure Monitor Workbook`Microsoft.Resources`ARM Deployment Scripts`Microsoft.Authorization`RBAC Role Assignments, Resource Locks
#### Compute[​](#compute-1)
**Container Apps (Consumption workload profile):**

AppvCPUMemoryReplicas (min / max)Auto-scaling triggersproxy2 vCPU4 Gi2 / 20CPU &gt; 80%rule-api1 vCPU2 Gi2 / 20CPU &gt; 80%rqlite1 vCPU2 Gi1 / 1None (fixed)

- Baseline compute: 7 vCPU, 14 Gi memory.
- Peak compute: 61 vCPU, 122 Gi memory.

**Container Apps jobs** (image `mcr.microsoft.com/azure-cli`, run with managed identity):

JobvCPU / MemoryScheduleTimeoutalembic0.5 / 1 GiManual trigger (DB migration)300 scontainer-updater0.5 / 1 GiHourly (`0 * * * *`)600 sarm-updater0.5 / 1 GiHourly (`30 * * * *`)1800 smonitoring0.5 / 1 GiEvery 5 min (`*/5 * * * *`)240 sfailure-monitor0.5 / 1 GiEvery 5 min240 s
**PostgreSQL Flexible Server:**

SettingValueSKU`Standard_D2ds_v4` (General Purpose)vCPU2Memory8 GiStorage32 GB (auto-grow enabled)VersionPostgreSQL 16HADisabledBackup retention7 daysGeo-redundant backupDisabled
**Application Gateway:**

SettingValueSKU / Tier`WAF_v2`Min capacity1Max capacity3 (autoscale)WAF rule setOWASP 3.2Public IP SKUStandard, static allocation
#### Network resources[​](#network-resources-1)
You can either let the template create a new VNet or point it at an existing one.

**Default VNet** (10.0.0.0/16):

SubnetCIDRSizeDelegation / Purpose`container-apps`10.0.0.0/23512 IPs`Microsoft.App/environments` — Container Apps Environment`postgres`10.0.3.0/24256 IPs`Microsoft.DBforPostgreSQL/flexibleServers``private-endpoints`10.0.4.0/24256 IPs(no delegation)`appgw`10.0.5.0/24256 IPsApplication Gateway frontend
**Bring Your Own Network (BYON):** to use an existing VNet, pass these parameters. Subnets must meet the minimum sizes and delegations:

ParameterRequirement`existingVnetId`Existing VNet resource ID`existingContainerAppsSubnetId`Delegated to `Microsoft.App/environments`, minimum /23`existingPostgresSubnetId`Delegated to `Microsoft.DBforPostgreSQL/flexibleServers``existingPrivateEndpointsSubnetId`No delegation required`existingAppgwSubnetId`/24, no delegations
**Additional network resources:**

- NAT Gateway (Standard) — outbound internet for Container Apps
- 2 Public IPs (Standard, static): one for NAT, one for the Application Gateway frontend
- 2 Network Security Groups:

`postgres` — allow port 5432 from the VNet only
- `appgw` — allow HTTP/HTTPS from the internet, plus GatewayManager ports 65200–65535

**Private DNS zones:**

ZoneLinked to`&lt;resource-group&gt;.private.postgres.database.azure.com`PostgreSQL Flexible Server`privatelink.blob.core.windows.net`Storage Account
**Private endpoints:**

EndpointSub-resourceSubnetBlob Storage`blob` on the Storage Account`private-endpoints`
#### Storage, Key Vault, messaging, monitoring, and resource locks[​](#storage-key-vault-messaging-monitoring-and-resource-locks)
**Azure Blob Storage:**

SettingValueKindStorageV2SKUStandard_LRSPublic accessDisabled (private endpoint only)TLS minimum1.2Containers`customer-data`, `ingestion`LifecycleAuto-delete blobs after retention period (default 30 days)
**Azure Key Vault:**

SettingValueSKUStandardAuthorizationRBACSoft delete7-day retentionPurge protectionEnabled
**Azure Service Bus (Standard):**

QueueMax deliveryLockTTL`rule-processor`55 min14 days`ingestion-file-queue`35 min4 days`ingestion-job-queue`32 min4 days
Dead-letter queues are created automatically by Service Bus for each queue.

**Monitoring:**

- Log Analytics Workspace, SKU `PerGB2018` (pay-as-you-go), retention configurable (default 30 days).
- An Azure Monitor Workbook is deployed with dashboards for container health, queue depth, App Gateway metrics, and PostgreSQL metrics.

**Resource locks:** the following resources are protected with `CanNotDelete` locks to prevent accidental deletion:

- Key Vault
- PostgreSQL Server
- Container Apps Environment
- Storage Account
- Service Bus Namespace

#### Quotas[​](#quotas)
QuotaRequiredContainer Apps vCPU (Consumption)61 vCPUPostgreSQL vCPU (General Purpose Ddsv4)2 vCPUApplication Gateway (`WAF_v2`)1 instancePublic IP Addresses (Standard)2NAT Gateways1VNet address space/16 (or 4 subnets if BYON)Service Bus Namespaces (Standard)1Storage Accounts1Key Vaults1
The Azure verification endpoint is `/health`, while AWS uses `/sdk/health`. The difference is that the AWS API Gateway prefixes all routes under `/sdk/{proxy+}` for the Rule API, whereas the Azure Application Gateway routes the bare path directly.

## Create Organizations[​](#create-organizations)
Organizations serve as containers for AI Systems, allowing you to structure your portfolio according to your needs. Creating organizations also lets you manage access control so that the right teams have visibility into the appropriate AI systems.

The system has already created a **Default Organization** for you, shown in an accordion at the top of the step. You can keep using just the Default Organization, add more organizations during the wizard, or create additional organizations later from within the system. There is no upper limit on the number of organizations.

For more detailed guidance on how organizations work, refer to the [Organizations and Projects Overview](/_docs/docs/overview/orgs_and_projects).

## Define AI Projects[​](#define-ai-projects)
In this step, you define AI projects within each organization. Each AI project represents a machine-based system designed to autonomously perform specific business functions. Defining projects lets you apply tailored policies, run compliance audits, and monitor specific AI systems separately.

The wizard renders one card per organization, and you enter one or more project names per card. The Default Organization comes with some default projects already in place, so you can leave it as-is or extend it.

You can also create additional projects later from within the system.

For further details on how to structure projects, refer to the [Organizations and Projects Overview](/_docs/docs/overview/orgs_and_projects).

## Link Cloud Account[​](#link-cloud-account)
Link the cloud accounts that host the AI resources you want the system to discover. The step exposes provider tabs across the top:

- **AWS**
- **Azure**
- **GCP**
- **Snowflake**
- **Others** — covers IBM WatsonX and Databricks.

Select the tab for your provider and follow the on-screen instructions to add an account. Each provider's add flow includes a Test Connection step to verify the credentials before the account is saved. You can add multiple accounts across any combination of providers.

When you finish, the wizard advances to Set Inventory Policies. You can also skip this step and link cloud accounts later from the [Admin Console](/_docs/docs/admin_console/); the wizard will still advance to the next step.

For provider-specific credential guidance, refer to [Adding a new Cloud Account](/_docs/docs/applications/ai_inventory).

## Set Inventory Policies[​](#set-inventory-policies)
Configure how the system handles AI resources it discovers. The step (whose on-screen page header reads "AI Inventory Policies") collects two policy choices:

- **Per-resource inventory policy** — for each resource type, choose how the system should treat existing and future instances when they are discovered.
- **Shadow AI issue policy** — pick one option that controls when Shadow AI issues are generated:

**All inventory** — every resource ever discovered.
- **Future inventory only** — only resources discovered after this setting is saved.
- **After the initial scan** — only resources discovered after the initial Discovery scan completes.
- **Never** — do not generate Shadow AI issues from inventory.

Submitting this step advances the wizard to the AI Discovery scan. You can revisit these policies later from [AI Inventory](/_docs/docs/applications/ai_inventory).

## AI Discovery[​](#ai-discovery)
The final step kicks off a background Discovery scan that inspects your linked cloud accounts and adds the AI resources it finds to your inventory.

- **If you linked at least one cloud account**, the wizard starts the Discovery job in the background. The scan can take a few hours depending on the number and size of your linked accounts. You can click Continue at any point to access the system; the scan keeps running in the background and the results land in your inventory when it completes.
- **If you skipped linking cloud accounts**, the wizard explains that no scan will run now. You can still click Continue to enter the system, and you can run a Discovery scan later from system settings once you have linked an account.

Click **Continue** to leave the wizard and start using the system.
[PreviousRuntime Evaluator LLM](/_docs/docs/admin_console/runtime_evaluator_llm)[NextIntegrations](/_docs/docs/platform_services/integration)- [Onboarding Wizard overview](#onboarding-wizard-overview)- [Install Data Plane](#install-data-plane)[Install on AWS](#install-on-aws)- [Install on Azure](#install-on-azure)- [Create Organizations](#create-organizations)- [Define AI Projects](#define-ai-projects)- [Link Cloud Account](#link-cloud-account)- [Set Inventory Policies](#set-inventory-policies)- [AI Discovery](#ai-discovery)
