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

Click **Deploy to Azure** in the app. The Azure Portal opens the **Custom Deployment** wizard on the **Basics** tab. The wizard presents six tabs in order: Basics → Network → Application Gateway → Island Log Ingestion → Advanced → Review + create.

## Basics tab[​](#basics-tab)
FieldDescriptionExample**Subscription**The Azure subscription for the deployment.`My Production Subscription`**Resource Group**Select or create a resource group. A dedicated resource group for the data plane is recommended.`rg-atlas-dataplane`**Region**Azure region for the deployment. Must match the resource group's region.`East US`**Customer ID**Your Customer ID (UUID format). Provided during onboarding.`550e8400-e29b-41d4-a716-446655440000`**Job Admin Key**Control plane authentication key. Provided during onboarding.*(provided during onboarding)***ACR Pull Token Password**Password for pulling container images from the Azure Container Registry. Provided during onboarding.*(provided during onboarding)*
## Network tab[​](#network-tab)
**Use existing Virtual Network?**

- **No** (default) — the template creates a new virtual network (`10.0.0.0/16`) with all required subnets.
- **Yes** — bring your own network (BYON). Provide the resource IDs of the subnets below; each must already have the required delegation and size.

Field (BYON)Requirements**Existing VNet Resource ID**Full resource ID of your virtual network.**Container Apps Subnet Resource ID**Minimum `/23`. Delegated to `Microsoft.App/environments`.**PostgreSQL Subnet Resource ID**Minimum `/24`. Delegated to `Microsoft.DBforPostgreSQL/flexibleServers`.**Private Endpoints Subnet Resource ID**No delegation required.**Deployment Scripts Subnet Resource ID**Delegated to `Microsoft.ContainerInstance/containerGroups`, with the `Microsoft.Storage` service endpoint and outbound internet via a NAT gateway.**Application Gateway Subnet Resource ID**`/24`. Required only when BYON is used together with an Application Gateway.
**Use existing Storage Account?** Leave **No** to create a new storage account, or choose **Yes** and provide the name of an existing account that is reachable from the virtual network. The `customer-data` and `ingestion` blob containers are created automatically if they do not exist.

## Application Gateway tab[​](#application-gateway-tab)
**Create Application Gateway?**

- **Yes** (default) — deploys a WAF v2 Application Gateway with OWASP 3.2 rules.
- **No** — skip Application Gateway creation. Use this when you bring your own gateway (for example Azure Front Door or a third-party WAF).

When creating the Application Gateway:

FieldDescription**Application Gateway Type****Public** (default) creates a public IP. **Private** creates a private-only frontend; you point DNS at the private IP within your network.**Application Gateway Private IP Address**Shown when the type is Private. A static IP within the Application Gateway subnet — for the default `10.0.5.0/24` subnet, the usable range is `10.0.5.4`–`10.0.5.254` (Azure reserves `.0`–`.3` and the broadcast address `.255`).**Custom Domain Name**FQDN for the HTTPS listener.**TLS Certificate (.pfx)**The PFX certificate file for the custom domain.**PFX Certificate Password**The password used when the PFX was exported.**Allowed IP Ranges**Optional CIDR ranges permitted to reach the gateway. Leave empty to allow all traffic. Applied once at deployment — to change them later, edit the WAF policy custom rules directly in the Azure Portal.
A private Application Gateway requires the `EnableApplicationGatewayNetworkIsolation` feature to be registered on the subscription before you deploy:

```
az feature register --namespace Microsoft.Network --name EnableApplicationGatewayNetworkIsolation
az provider register --namespace Microsoft.Network

```
Wait until the feature state is `Registered` (this can take up to 30 minutes) before deploying.

When you do **not** create the Application Gateway, the **Custom Domain Name** is still required (it is used for control plane registration), and you can optionally set the **Gateway Private IP Address** of your own gateway so containers resolve the custom domain within the virtual network.

## Island Log Ingestion tab[​](#island-log-ingestion-tab)
**Enable Island browser log ingestion?** Default **No**. Leave it **No** unless you use Island — nothing else in the data plane depends on it. The other three fields on this tab appear only when this is **Yes**, and setting it to **Yes** provisions the Island drop storage account, an Event Grid system topic, a Service Bus queue, an Event Hub, and the ingest worker.

FieldDefaultDescription**Start ingesting Island events now?**NoStarts the ingest worker consuming events as soon as it is deployed. Set it to **Yes** at deployment time if you want ingestion to begin straight away; to change it on a data plane that is already running, see [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane). Do not try to enable it by editing the container app's environment variables directly, since those are replaced on every deployment.**Use your own Storage Account for Island?**No**No** creates a storage account for the Island drop container. **Yes** lets you supply an account you already own.**Existing Island Storage Account Name**—Shown, and required, only when the field above is **Yes**. Name of an existing Storage Account in the same resource group; 3–24 lowercase letters and numbers.
**Network exposure:** Island uploads from the endpoint browser, so its drop container must be reachable from the internet. Azure applies network rules per storage account rather than per container, so Island always uses a separate account holding Island logs only — your main data plane storage account is never modified and keeps its private endpoint either way. If you let the deployment create that account, it is created with public network access enabled. Nothing becomes anonymously readable — a credential is still required — but the account reports as non-compliant under the built-in **Storage accounts should restrict network access** policy, and the deployment fails outright if your subscription sets that policy's effect to Deny. Set **Use your own Storage Account for Island?** to **Yes** in that case.

**What is applied to an account you supply:** the `island-browser-log` container is created if absent, blob write and delete diagnostic settings are sent to the Log Analytics workspace, and the managed identity is granted **Storage Blob Data Contributor** at account scope — that role is account-wide rather than container-scoped, so do not point this at an account that holds unrelated data.

**What is not applied:** network rules, the retention lifecycle policy, and the delete lock. Those stay yours to configure, including making the account reachable from the endpoint browser and deciding how long Island logs are kept.

The Event Hub itself is created as soon as Island log ingestion is enabled and retains events for only 24 hours, independently of **Start ingesting Island events now?** — if Island is pointed at the hub while that switch is still **No**, anything older than 24 hours is never ingested (the interaction artifacts remain in blob storage, but nothing reconciles them). Turning that switch on also stops the blob-upload path from feeding the platform, since the two paths carry the same records and cannot both be active.

See [Island Browser](/_docs/docs/log_sources/island_browser) for what Island logs contain and how the Island side is configured.

## Advanced tab[​](#advanced-tab)
FieldDefaultDescription**Data Retention (days)**`30`Retention for blob storage lifecycle and the Log Analytics workspace. Range: 30–730 days. Also covers the Island drop container when the deployment creates that account for you — a customer-supplied Island account gets no retention lifecycle from this setting.**ARM Updater Mode**Automatic**Automatic** checks for template updates hourly; **Manual** disables the schedule so you trigger updates explicitly. Choosing **Manual** means later configuration changes — including [enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane) — do not take effect until you trigger a refresh.
## Review, create, and configure DNS[​](#review-create-and-configure-dns)
Choose **Review + create**. The portal validates the parameters; fix any errors, then choose **Create**. Deployment takes approximately 20–30 minutes.

After deployment completes, open the deployment's **Outputs**:

- **Public** Application Gateway — copy `applicationGatewayPublicIp` and create a DNS **A record** pointing your custom domain at that IP.
- **Private** Application Gateway — copy `applicationGatewayPrivateIp` and create the corresponding record in your internal DNS.
- **`proxyFqdn`** — present in every deployment, unlike the two gateway IP outputs above. The internal FQDN of the proxy Container App; this is the backend endpoint a bring-your-own gateway routes to.

Then verify:

```
curl https://atlas-api.customer.com/health
# Expected: HTTP 200

```
## Deployment scenarios[​](#deployment-scenarios)

- **Default (new VNet, public gateway).** Fill in Basics, keep the network and gateway defaults, set the custom domain, and upload the PFX certificate.
- **Existing VNet (BYON).** Set **Use existing virtual network = Yes** and provide the subnet resource IDs, each with the required delegation and size.
- **Private Application Gateway.** Set the gateway type to **Private** and provide a static private IP; register the preview feature first.
- **Bring your own gateway.** Set **Create Application Gateway = No**; backend services are still deployed, and you route traffic from your own gateway to the `proxyFqdn` deployment output.
- **Existing storage account.** Set **Use existing storage account = Yes** and provide an account reachable from the virtual network.
- **IP-restricted access.** When creating the gateway, add CIDR ranges under **Allowed IP Ranges**; only those ranges reach the gateway. IP restrictions are applied at deployment — to change them later, edit the WAF policy in the Azure Portal.
- **Island log ingestion.** Set **Enable Island browser log ingestion = Yes**. If your subscription policy blocks a storage account with public network access, also set **Use your own Storage Account for Island = Yes** and name a pre-approved account — otherwise the deployment creates the Island storage account itself, with public network access, and fails under a Deny policy. Leaving **Enable Island browser log ingestion** at **No** deploys no Island resources at all.

## Enabling Island on an existing data plane[​](#enabling-island-on-an-existing-data-plane)
The **Island Log Ingestion** tab applies when the data plane is first deployed. If your data plane is already running and you now want Island browser log ingestion, re-running the wizard is not the way to enable it: a deployed data plane keeps its own stored configuration and refreshes itself from it, so a change made only through a fresh deployment is reverted at the next refresh. Enrolling an existing data plane means updating that stored configuration as well, which the wizard does not reach.

Enrolling an existing data plane is a command-line step. Your account team provides a script, `enable-island-ingestion.sh`, that you run once against the data plane's resource group; it updates the stored configuration so the next scheduled refresh provisions the Island resources and re-registers the data plane with the control plane. For the command, its prerequisites, and its caveats — it starts ingestion immediately, it creates the Island storage account for you, and it must not be run on a data plane already ingesting Island logs — see [Enabling Island on an existing data plane](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli#enabling-island-on-an-existing-data-plane) on the CLI page.

The script does not deploy anything itself; it changes the stored configuration that the next refresh reads. If this data plane was deployed with **ARM Updater Mode = Automatic**, run the script and wait — refreshes are hourly. If it was deployed with **Manual**, there is no schedule to pick the change up, so you must trigger a refresh yourself; the CLI page has that command.
[PreviousData Plane](/_docs/docs/admin_console/data_plane)[NextAzure — Deploy by Command (CLI)](/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli)- [Before you begin](#before-you-begin)- [Basics tab](#basics-tab)- [Network tab](#network-tab)- [Application Gateway tab](#application-gateway-tab)- [Island Log Ingestion tab](#island-log-ingestion-tab)- [Advanced tab](#advanced-tab)- [Review, create, and configure DNS](#review-create-and-configure-dns)- [Deployment scenarios](#deployment-scenarios)- [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane)
