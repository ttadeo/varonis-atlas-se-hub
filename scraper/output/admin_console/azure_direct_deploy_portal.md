---
title: Azure — Direct Deploy (Portal)
url: https://prod.alltrue-be.com/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal
section: admin_console
---

# Azure — Direct Deploy (Portal)

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Azure — Direct Deploy (Portal)Export PDFOn this page# Azure — Direct Deploy (Portal)
Deploy the Azure data plane from the Azure Portal using the **Deploy to Azure** button in the app, which opens the Custom Deployment wizard with the ARM template pre-loaded. This is the guided, browser-based path; for an automatable equivalent see [Azure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli). For the deployment-options overview and the in-product Data Plane area, see [Data Plane](/_docs/docs/admin_console/data_plane).

## Before you begin[​](#before-you-begin)

- Sign in to the correct Azure tenant and subscription.
- Have your onboarding credentials ready: **Customer ID**, **Job Admin Key**, and **ACR Pull Token Password**.
- If you create the Application Gateway, have a PFX certificate for your custom domain and its password.

## Launch the Custom Deployment wizard[​](#launch-the-custom-deployment-wizard)
Click **Deploy to Azure** in the app. The Azure Portal opens the **Custom Deployment** wizard on the **Basics** tab.

## Basics tab[​](#basics-tab)
FieldDescriptionExample**Subscription**The Azure subscription for the deployment.`My Production Subscription`**Resource Group**Select or create a resource group. A dedicated resource group for the data plane is recommended.`rg-atlas-dataplane`**Region**Azure region for the deployment. Must match the resource group's region.`East US`**Customer ID**Your Customer ID (UUID format). Provided during onboarding.`550e8400-e29b-41d4-a716-446655440000`**Job Admin Key**Control plane authentication key. Provided during onboarding.*(provided during onboarding)***ACR Pull Token Password**Password for pulling container images from the Azure Container Registry. Provided during onboarding.*(provided during onboarding)*
## Network tab[​](#network-tab)
**Use existing virtual network?**

- **No** (default) — the template creates a new virtual network (`10.0.0.0/16`) with all required subnets.
- **Yes** — bring your own network (BYON). Provide the resource IDs of the subnets below; each must already have the required delegation and size.

Field (BYON)Requirements**Existing VNet Resource ID**Full resource ID of your virtual network.**Container Apps Subnet ID**Minimum `/23`. Delegated to `Microsoft.App/environments`.**PostgreSQL Subnet ID**Minimum `/24`. Delegated to `Microsoft.DBforPostgreSQL/flexibleServers`.**Private Endpoints Subnet ID**No delegation required.**Deployment Scripts Subnet ID**Delegated to `Microsoft.ContainerInstance/containerGroups`, with the `Microsoft.Storage` service endpoint and outbound internet via a NAT gateway.**Application Gateway Subnet ID**`/24`. Required only when BYON is used together with an Application Gateway.
**Use existing storage account?** Leave **No** to create a new storage account, or choose **Yes** and provide the name of an existing account that is reachable from the virtual network. The required blob containers are created automatically if they do not exist.

## Application Gateway tab[​](#application-gateway-tab)
**Create Application Gateway?**

- **Yes** (default) — deploys a WAF v2 Application Gateway with OWASP 3.2 rules.
- **No** — skip Application Gateway creation. Use this when you bring your own gateway (for example Azure Front Door or a third-party WAF).

When creating the Application Gateway:

FieldDescription**Application Gateway Type****Public** (default) creates a public IP. **Private** creates a private-only frontend; you point DNS at the private IP within your network.**Application Gateway Private IP**Shown when the type is Private. A static IP within the Application Gateway subnet.**Custom Domain Name**FQDN for the HTTPS listener.**TLS Certificate (.pfx)**The PFX certificate file for the custom domain.**PFX Certificate Password**The password used when the PFX was exported.**Allowed IP Ranges**Optional CIDR ranges permitted to reach the gateway. Leave empty to allow all traffic.
A private Application Gateway requires the `EnableApplicationGatewayNetworkIsolation` feature to be registered on the subscription before you deploy:

```
az feature register --namespace Microsoft.Network --name EnableApplicationGatewayNetworkIsolation
az provider register --namespace Microsoft.Network

```
Wait until the feature state is `Registered` (this can take up to 30 minutes) before deploying.

When you do **not** create the Application Gateway, the **Custom Domain Name** is still required (it is used for control plane registration), and you can optionally set the **Gateway Private IP** of your own gateway so containers resolve the custom domain within the virtual network.

## Advanced tab[​](#advanced-tab)
FieldDefaultDescription**Data Retention (days)**`30`Retention for blob storage lifecycle and the Log Analytics workspace. Range: 30–730 days.**ARM Updater Mode**Automatic**Automatic** checks for template updates on a schedule; **Manual** disables the schedule so you trigger updates explicitly.
## Review, create, and configure DNS[​](#review-create-and-configure-dns)
Choose **Review + create**. The portal validates the parameters; fix any errors, then choose **Create**. Deployment takes approximately 20–30 minutes.

After deployment completes, open the deployment's **Outputs**:

- **Public** Application Gateway — copy `applicationGatewayPublicIp` and create a DNS **A record** pointing your custom domain at that IP.
- **Private** Application Gateway — copy `applicationGatewayPrivateIp` and create the corresponding record in your internal DNS.

Then verify:

```
curl https://atlas-api.customer.com/health
# Expected: HTTP 200

```
## Deployment scenarios[​](#deployment-scenarios)

- **Default (new VNet, public gateway).** Fill in Basics, keep the network and gateway defaults, set the custom domain, and upload the PFX certificate.
- **Existing VNet (BYON).** Set **Use existing virtual network = Yes** and provide the subnet resource IDs, each with the required delegation and size.
- **Private Application Gateway.** Set the gateway type to **Private** and provide a static private IP; register the preview feature first.
- **Bring your own gateway.** Set **Create Application Gateway = No**; backend services are still deployed, and you route traffic from your own gateway to their internal endpoint.
- **Existing storage account.** Set **Use existing storage account = Yes** and provide an account reachable from the virtual network.
- **IP-restricted access.** When creating the gateway, add CIDR ranges under **Allowed IP Ranges**; only those ranges reach the gateway. IP restrictions are applied at deployment — to change them later, edit the WAF policy in the Azure Portal.
[PreviousData Plane](/_docs/docs/admin_console/data_plane)[NextAzure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli)- [Before you begin](#before-you-begin)- [Launch the Custom Deployment wizard](#launch-the-custom-deployment-wizard)- [Basics tab](#basics-tab)- [Network tab](#network-tab)- [Application Gateway tab](#application-gateway-tab)- [Advanced tab](#advanced-tab)- [Review, create, and configure DNS](#review-create-and-configure-dns)- [Deployment scenarios](#deployment-scenarios)
