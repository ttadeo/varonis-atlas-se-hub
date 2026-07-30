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
ParameterTypeRequiredDefaultDescription`customerId`stringYes—Customer ID (UUID format).`jobAdminKey`secureStringYes—Control plane authentication key.`acrPassword`secureStringYes—ACR pull-token password for container images.`customDomainName`stringYes—FQDN for the data plane endpoint.`customDomainCertificatePfx`secureStringConditional*(empty)*Base64-encoded PFX certificate. Required when `createAppGateway=true`.`customDomainCertificatePassword`secureStringConditional*(empty)*PFX password. Required when `createAppGateway=true`.`createAppGateway`boolNo`true`Set `false` to skip the Application Gateway; backend services still created.`privateAppGateway`boolNo`false`Creates a private-only Application Gateway. Requires the preview feature to be registered.`appGatewayPrivateIpAddress`stringConditional*(empty)*Static private IP for a private Application Gateway. Required when `privateAppGateway=true`.`gatewayPrivateIp`stringNo*(empty)*Private IP of your own gateway; creates a private DNS zone. Used when `createAppGateway=false`.`retentionDays`intNo`30`Data retention (30–730 days) for blob lifecycle and Log Analytics.`existingVnetId`stringNo*(empty)*Existing VNet resource ID for BYON.`existingContainerAppsSubnetId`stringConditional*(empty)*Container Apps subnet (`/23`, delegated). Required with BYON.`existingPostgresSubnetId`stringConditional*(empty)*PostgreSQL subnet (`/24`, delegated). Required with BYON.`existingPrivateEndpointsSubnetId`stringConditional*(empty)*Private endpoints subnet. Required with BYON.`existingAppGwSubnetId`stringConditional*(empty)*Application Gateway subnet (`/24`). Required with BYON plus an Application Gateway.`existingDeploymentScriptsSubnetId`stringConditional*(empty)*Deployment scripts subnet (delegated to `Microsoft.ContainerInstance/containerGroups`). Required with BYON.`existingStorageAccountName`stringNo*(empty)*Name of an existing storage account reachable from the VNet.`appGwAllowedIpRanges`string (JSON)No*(empty)*JSON array of `{"cidr":"...","description":"..."}` objects for WAF IP restrictions.`armUpdaterType`stringNo`Automatic``Automatic` runs on a schedule; `Manual` requires explicit triggers.[PreviousAzure — Direct Deploy (Portal)](/_docs/docs/admin_console/data_plane/azure_direct_deploy_portal)[NextAWS — Direct Deploy (Console)](/_docs/docs/admin_console/data_plane/aws_direct_deploy_console)- [Prerequisites](#prerequisites)- [Set environment variables](#set-environment-variables)- [Create the resource group](#create-the-resource-group)- [Deploy](#deploy)- [Configure DNS and verify](#configure-dns-and-verify)- [Parameter reference](#parameter-reference)
