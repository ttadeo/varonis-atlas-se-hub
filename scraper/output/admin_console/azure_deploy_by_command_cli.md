---
title: Azure — Deploy by Command (CLI)
url: https://prod.alltrue-be.com/_docs/docs/admin_console/data_plane/azure_deploy_by_command_cli
section: admin_console
---

# Azure — Deploy by Command (CLI)

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Azure — Deploy by Command (CLI)Export PDFOn this page# Azure — Deploy by Command (CLI)
Deploy the Azure data plane with the Azure CLI. Use this path for automation, CI/CD pipelines, or environments where portal access is restricted. For the guided browser-based path see [Azure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal); for the deployment-options overview see [Data Plane](/_docs/docs/admin_console/data_plane).

## Prerequisites[​](#prerequisites)

- Azure CLI v2.50+ installed (`az --version`).
- Signed in to the correct tenant (`az login`) with the target subscription selected (`az account set --subscription &lt;subscription-id&gt;`).
- **Contributor** and **User Access Administrator** roles on the target resource group.
- The required resource providers registered on the subscription.
- If you create the Application Gateway, a base64-encoded PFX certificate for your custom domain and its password.
- Onboarding credentials: Customer ID, Job Admin Key, and ACR Password. See [Onboarding](/_docs/docs/platform_services/onboarding#install-data-plane) for how these are issued.

## Set environment variables[​](#set-environment-variables)
VariableDescription`RESOURCE_GROUP`Name of the Azure resource group. A dedicated resource group for the data plane is recommended.`LOCATION`Azure region (for example `eastus`). Must match the resource group location.`TEMPLATE_URI`URI of the ARM template. Provided during onboarding.`CUSTOMER_ID`Your Customer ID (UUID format). Provided during onboarding.`JOB_ADMIN_KEY`API key for control plane authentication. Provided during onboarding.`ACR_PASSWORD`ACR pull-token password for container images. Provided during onboarding.`CUSTOM_DOMAIN`Fully-qualified domain name for the data plane endpoint. You must own this domain.`CERT_PFX`Base64-encoded PFX certificate for the custom domain. Required when creating the Application Gateway.`CERT_PASSWORD`Password for the PFX certificate. Required when creating the Application Gateway.`DEPLOYMENT_NAME`A name for this ARM deployment; reused when reading its outputs.
```
export RESOURCE_GROUP="&lt;resource-group-name&gt;"
export LOCATION="&lt;azure-region&gt;"
export TEMPLATE_URI="&lt;template-uri&gt;"
export CUSTOMER_ID="&lt;customer-id&gt;"
export JOB_ADMIN_KEY="&lt;job-admin-key&gt;"
export ACR_PASSWORD="&lt;acr-pull-token-password&gt;"
export CUSTOM_DOMAIN="&lt;custom-domain-name&gt;"
export CERT_PFX="&lt;base64-encoded-pfx&gt;"
export CERT_PASSWORD="&lt;pfx-password&gt;"
export DEPLOYMENT_NAME="atlas-dataplane"

```
If you are enabling Island log ingestion and supplying your own storage account, also set:

```
export ISLAND_STORAGE_ACCOUNT="&lt;island-storage-account-name&gt;"

```
`ISLAND_STORAGE_ACCOUNT` must be 3–24 lowercase letters and numbers, and the account must live in the same resource group as the rest of the deployment.

## Create the resource group[​](#create-the-resource-group)
```
az group create --name "${RESOURCE_GROUP}" --location "${LOCATION}"

```
## Deploy[​](#deploy)
Default deployment (new VNet, public Application Gateway):

```
az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 customDomainCertificatePfx="${CERT_PFX}" \
 customDomainCertificatePassword="${CERT_PASSWORD}"

```
Deploy into an existing VNet (BYON) by adding the VNet and subnet resource IDs:

```
az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 customDomainCertificatePfx="${CERT_PFX}" \
 customDomainCertificatePassword="${CERT_PASSWORD}" \
 existingVnetId="&lt;vnet-resource-id&gt;" \
 existingContainerAppsSubnetId="&lt;container-apps-subnet-id&gt;" \
 existingPostgresSubnetId="&lt;postgres-subnet-id&gt;" \
 existingPrivateEndpointsSubnetId="&lt;private-endpoints-subnet-id&gt;" \
 existingAppGwSubnetId="&lt;appgw-subnet-id&gt;" \
 existingDeploymentScriptsSubnetId="&lt;deployment-scripts-subnet-id&gt;"

```
For a private Application Gateway, register the `EnableApplicationGatewayNetworkIsolation` feature first (wait until it reports `Registered`), then deploy with `privateAppGateway=true` and `appGatewayPrivateIpAddress`:

```
az feature register --namespace Microsoft.Network --name EnableApplicationGatewayNetworkIsolation
az provider register --namespace Microsoft.Network
az feature show --namespace Microsoft.Network --name EnableApplicationGatewayNetworkIsolation --query properties.state -o tsv

az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 customDomainCertificatePfx="${CERT_PFX}" \
 customDomainCertificatePassword="${CERT_PASSWORD}" \
 privateAppGateway=true \
 appGatewayPrivateIpAddress="&lt;private-ip-address&gt;"

```
To skip the Application Gateway and use your own, set `createAppGateway=false` (no PFX certificate is needed); optionally set `gatewayPrivateIp` so containers resolve the custom domain to your gateway:

```
az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 createAppGateway=false \
 gatewayPrivateIp="&lt;gateway-private-ip&gt;"

```
Other supported parameters include `existingStorageAccountName` (use an existing storage account), `appGwAllowedIpRanges` (a JSON array of `{"cidr":"...","description":"..."}` objects for WAF IP restrictions), and `armUpdaterType` (`Automatic` or `Manual`).

Deploy with Island log ingestion by adding `enableIslandLogIngestion=true`. Leave it unset (default `false`) unless you use Island — nothing else in the data plane depends on it:

```
az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 customDomainCertificatePfx="${CERT_PFX}" \
 customDomainCertificatePassword="${CERT_PASSWORD}" \
 enableIslandLogIngestion=true

```
**Network exposure:** Island uploads from the endpoint browser, so its drop container must be reachable from the internet. Azure applies network rules per storage account rather than per container, so Island always uses a separate account holding Island logs only — your main data plane storage account is never modified and keeps its private endpoint either way.

If you let the deployment create that account, it is created with public network access enabled. Nothing becomes anonymously readable — a credential is still required — but the account reports as non-compliant under the built-in **Storage accounts should restrict network access** policy, and the deployment fails outright if your subscription sets that policy's effect to Deny. Use `existingIslandStorageAccountName` in that case:

```
az deployment group create \
 --name "${DEPLOYMENT_NAME}" \
 --resource-group "${RESOURCE_GROUP}" \
 --template-uri "${TEMPLATE_URI}" \
 --parameters \
 customerId="${CUSTOMER_ID}" \
 jobAdminKey="${JOB_ADMIN_KEY}" \
 acrPassword="${ACR_PASSWORD}" \
 customDomainName="${CUSTOM_DOMAIN}" \
 customDomainCertificatePfx="${CERT_PFX}" \
 customDomainCertificatePassword="${CERT_PASSWORD}" \
 enableIslandLogIngestion=true \
 existingIslandStorageAccountName="${ISLAND_STORAGE_ACCOUNT}"

```
**What is applied to an account you supply:** the `island-browser-log` container is created if absent, blob write and delete diagnostic settings are sent to the Log Analytics workspace, and the managed identity is granted Storage Blob Data Contributor **at account scope** — that role is account-wide rather than container-scoped, so do not point this at an account that holds unrelated data.

**What is not applied:** network rules, the retention lifecycle policy, and the delete lock. Those stay yours to configure, including making the account reachable from the endpoint browser and deciding how long Island logs are kept.

To start the Event Hub ingest worker consuming events as soon as it is deployed, add `enableIslandEventHubIngest=true` (default `false`; ignored unless `enableIslandLogIngestion` is also true). The Event Hub itself is created as soon as Island log ingestion is enabled and retains events for only 24 hours, independently of this switch — if Island is pointed at the hub while this stays `false`, anything older than 24 hours is never ingested (the interaction artifacts remain in blob storage, but nothing reconciles them). Turning this on also stops the blob-upload path from feeding the platform, since the two paths carry the same records and cannot both be active. Set it at deploy time rather than on the container app afterward — a container app's environment variables are replaced on every deployment, so a manual change is reverted on the next update. To change it on a data plane that is already running, see [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane).

## Enabling Island on an existing data plane[​](#enabling-island-on-an-existing-data-plane)
The Island parameters above take effect when the data plane is first deployed. If your data plane is already running and you now want Island browser log ingestion, re-running `az deployment group create` with `enableIslandLogIngestion=true` is not enough on its own: a deployed data plane keeps its own stored configuration and refreshes itself from it, so a one-off redeploy is reverted at the next refresh. Enrolling an existing data plane means updating that stored configuration as well, which the deploy command does not reach.

Your account team provides `enable-island-ingestion.sh` for this. Run it once, against the data plane's resource group:

```
./enable-island-ingestion.sh &lt;resource-group&gt;

```
Before you run it:

- Sign in to the correct tenant and select the subscription that holds the data plane (`az login`, then `az account set --subscription &lt;subscription-id&gt;`).
- You need **Contributor** on that resource group. The script creates a short-lived deployment inside the data plane's virtual network to update the stored configuration, and removes the data plane's registration resource so it is recreated on the next refresh.
- The resource group must be the one containing the data plane itself. The script locates the managed identity, storage account, key vault, and deployment-scripts subnet from it, and stops with an error listing whatever it could not find.

The script updates the stored configuration and clears the marker that tells the data plane its template is unchanged. The next refresh then provisions the Island resources and re-registers the data plane with the control plane. The script does not perform that refresh itself — when it finishes, nothing has been deployed yet, and what happens next depends on how the data plane handles updates:

- 
**Automatic updates** (`armUpdaterType=Automatic`, the default) — refreshes run hourly, at 30 minutes past the hour. Run the script and wait; the Island resources appear within the hour.

- 
**Manual updates** (`armUpdaterType=Manual`) — the schedule is disabled, so the script's changes stay pending until you trigger a refresh yourself:

```
az containerapp job start -g &lt;resource-group&gt; -n arm-updater

```

To check which applies to a running data plane:

```
az containerapp job show -g &lt;resource-group&gt; -n arm-updater \
 --query properties.configuration.triggerType -o tsv
# Automatic updates report "Schedule"; manual updates report "Manual"

```
Either way there is no redeployment window and no change to your existing endpoints.

Three things to know before running it:

- **It starts ingestion, not just the pipeline.** The script sets both the provisioning switch and the Event Hub ingest switch, so the worker begins consuming as soon as the resources exist. Because the two paths cannot both be active, this also stops the blob-upload path from feeding the platform.
- **It creates the Island storage account for you.** The script does not name an existing account, so the deployment creates one with public network access — see the network-exposure note above. If your subscription sets the built-in **Storage accounts should restrict network access** policy to Deny, the refresh fails; contact your account team to enroll with a pre-approved account instead.
- **Do not run it on a data plane that is already ingesting Island logs.** Moving between ingestion paths has to be staged so that no records are lost or duplicated while it takes effect. Contact your account team to coordinate that sequence.

## Configure DNS and verify[​](#configure-dns-and-verify)
Read the gateway IP from the deployment outputs and create the DNS record for your custom domain:

```
APPGW_IP=$(az deployment group show \
 --resource-group "${RESOURCE_GROUP}" \
 --name "${DEPLOYMENT_NAME}" \
 --query "properties.outputs.applicationGatewayPublicIp.value" -o tsv)

echo "Create a DNS A record: ${CUSTOM_DOMAIN} -&gt; ${APPGW_IP}"

```
For a private Application Gateway, read `applicationGatewayPrivateIp` instead and create the record in your internal DNS. Then verify:

```
curl -s -o /dev/null -w "%{http_code}" "https://${CUSTOM_DOMAIN}/health"
# Expected: 200

```
If you deployed with `createAppGateway=false`, no Application Gateway is created. Point your custom domain at your own gateway — the `gatewayPrivateIp` you supplied, or the backend's internal endpoint — then run the same health check.

## Parameter reference[​](#parameter-reference)
ParameterTypeRequiredDefaultDescription`customerId`stringYes—Customer ID (UUID format).`jobAdminKey`secureStringYes—Control plane authentication key.`acrPassword`secureStringYes—ACR pull-token password for container images.`customDomainName`stringYes—FQDN for the data plane endpoint.`customDomainCertificatePfx`secureStringConditional*(empty)*Base64-encoded PFX certificate. Required when `createAppGateway=true`.`customDomainCertificatePassword`secureStringConditional*(empty)*PFX password. Required when `createAppGateway=true`.`createAppGateway`boolNo`true`Set `false` to skip the Application Gateway; backend services still created.`privateAppGateway`boolNo`false`Creates a private-only Application Gateway. Requires the preview feature to be registered.`appGatewayPrivateIpAddress`stringConditional*(empty)*Static private IP for a private Application Gateway. Required when `privateAppGateway=true`.`gatewayPrivateIp`stringNo*(empty)*Private IP of your own gateway; creates a private DNS zone. Used when `createAppGateway=false`.`retentionDays`intNo`30`Data retention (30–730 days) for blob lifecycle and Log Analytics.`existingVnetId`stringNo*(empty)*Existing VNet resource ID for BYON.`existingContainerAppsSubnetId`stringConditional*(empty)*Container Apps subnet (`/23`, delegated). Required with BYON.`existingPostgresSubnetId`stringConditional*(empty)*PostgreSQL subnet (`/24`, delegated). Required with BYON.`existingPrivateEndpointsSubnetId`stringConditional*(empty)*Private endpoints subnet. Required with BYON.`existingAppGwSubnetId`stringConditional*(empty)*Application Gateway subnet (`/24`). Required with BYON plus an Application Gateway.`existingDeploymentScriptsSubnetId`stringConditional*(empty)*Deployment scripts subnet (delegated to `Microsoft.ContainerInstance/containerGroups`). Required with BYON.`existingStorageAccountName`stringNo*(empty)*Name of an existing storage account reachable from the VNet.`enableIslandLogIngestion`boolNo`false`Set at initial deployment. Deploys the Island browser log-ingestion pipeline. Leave `false` unless you use Island; nothing else in the data plane depends on it. To enable it on a data plane that is already running, see [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane).`existingIslandStorageAccountName`stringNo*(empty)*Set at initial deployment. Existing storage account in the same resource group to use as Island's drop target instead of creating one. Read only when `enableIslandLogIngestion` is `true`. The enrollment script does not set this parameter, so enrolling an existing data plane always creates the account.`enableIslandEventHubIngest`boolNo`false`Set at initial deployment. Starts the Island Event Hub ingest worker consuming. Ignored unless `enableIslandLogIngestion` is `true`; enabling it stops the blob path from feeding the platform. Do not set it by editing the container app's environment, and note that redeploying an existing data plane does not change it — see [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane).`appGwAllowedIpRanges`string (JSON)No*(empty)*JSON array of `{"cidr":"...","description":"..."}` objects for WAF IP restrictions.`armUpdaterType`stringNo`Automatic``Automatic` refreshes the data plane hourly; `Manual` disables that schedule, so refreshes run only when you trigger them. With `Manual`, later configuration changes — including [enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane) — stay pending until you trigger a refresh.[PreviousAzure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal)[NextAWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console)- [Prerequisites](#prerequisites)- [Set environment variables](#set-environment-variables)- [Create the resource group](#create-the-resource-group)- [Deploy](#deploy)- [Enabling Island on an existing data plane](#enabling-island-on-an-existing-data-plane)- [Configure DNS and verify](#configure-dns-and-verify)- [Parameter reference](#parameter-reference)
