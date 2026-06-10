---
title: Integrations
url: https://prod.alltrue-be.com/_docs/docs/platform_services/integration
section: platform_services
---

# Integrations

- [](/_docs/)- Platform Services- IntegrationsOn this page# Integrations
There are three types of integrations between the platform and other systems you use in your corporate environment:

- 
Outbound Integration: Integration with systems such as SIEM, service management, or observability applications where the system sends data about AI systems to those applications.

- 
Inbound Integration: Integration with systems such as DLP or ZTNA where applications forward logs or data to the system.

- 
API Integration: Integration with the TRiSM Hub using published APIs.

## Outbound Integration[​](#outbound-integration)
Outbound integration includes:

- 
Sending issues to SIEM systems.

- 
Sending incidents to SIEM systems and to Service Now.

- 
Sending LLM events going through the AI Runtime Protection to Datadog.

To complete outbound integration, first define the outbound endpoint. These are HTTPS endpoints and require generating an API key on the receiving system and then defining the endpoint in the platform. Once the endpoint is defined, you select which endpoint should receive which type of data. This is done at the project level.

Outbound integrations are defined on the [admin console](/_docs/docs/platform_services/admin_console).

## Inbound Integration[​](#inbound-integration)
An example of inbound integration is receiving log push events from systems such as ZTNA (e.g., Cloudflare) to determine which external AI services are being used by company employees.

Inbound integration is done using an endpoint and an API key. TRiSM Hub endpoints function either as a Splunk HEC endpoint or as a Datadog log endpoint. This means that the setup is identical to the setup that is done when connecting either to Splunk HEC or to Datadog log push. The same fields need to be filled in.

To use inbound listeners, generate an API key of the appropriate type, have the appropriate role assigned to the API key (which is done automatically by the system), and then connect to the API endpoint.

## API Integration[​](#api-integration)
There are two types of API-based integrations - inbound or outbound.

Inbound API integration means that you can use all TRiSM Hub published APIs to perform activities in the TRiSM Hub without using the GUI, allowing you to integrate with the TRiSM Hub using scripts and DevOps processes. All functions in the TRiSM Hub are exposed through APIs. [Click here to see](/_docs/api/overview) how to call APIs and what APIs are available.

Outbound API integrations are APIs in other systems that the platform calls to collect additional information about AI systems.

Read a brief tutorial on [calling APIs](/_docs/docs/platform_services/api)

### Microsoft Copilot API Setup[​](#microsoft-copilot-api-setup)
The TRiSM Hub calls Microsoft Purview and Graph APIs in order to retrieve information about Microsoft Copilot usage.

To set up API access:

- Open your Azure portal. Make sure you sign in as an admin with permission to grant consent.
- Search for Enterprise applications and select All applications.
- Get an application ID from your account manager.
- Enter the application ID in the search bar and click Apply.
- Click on Permissions.
- Review the permissions the system is asking of you and click on "Grant admin consent for {tenant}". Click Accept.

### Microsoft Copilot Studio Discovery[​](#microsoft-copilot-studio-discovery)
To enable Copilot Studio Discovery, you must manually register the Varonis AISec enterprise application as an Application User in your Power Platform environment. This one-time setup grants the application the necessary permissions (Service Reader role) to access your environment's data through Microsoft Dataverse.

[Guide to Adding Enterprise Applications as Application Users in Power Platform](/_docs/files/varonis-power-platform-enterprise-apps.pdf)
The application registered in Microsoft Entra ID retains its legacy display name **AllTrue AISec** (Application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`), so that is the name and ID you will see in Cloud Shell command output and in the Microsoft Entra portal throughout the setup and the troubleshooting steps below.

Re-run admin consentIf admin consent for the application has never been granted in your tenant — or if there is any doubt about its state — re-running the admin-consent flow is a deterministic way to either grant it (if missing) or refresh it (if already present).
A Global Administrator (or Privileged Role Administrator) signed into the target tenant opens this URL in a browser, replacing `&lt;TENANT_ID&gt;` with your Power Platform environment's tenant ID:
```
https://login.microsoftonline.com/&lt;TENANT_ID&gt;/adminconsent?client_id=0bc5e064-36f6-4d09-93ed-b7643dd05404

```Sign in if prompted, review the consent prompt, and click **Accept**.
If consent grants immediately, wait a few minutes for the grant to propagate from Microsoft Entra to Dataverse before retrying. Propagation is typically under 5 minutes but can take up to 15 in some tenants. If your tenant has the admin consent workflow enabled (Microsoft Entra portal → **Enterprise Applications** → **Consent and permissions** → **Admin consent settings**), accepting the prompt creates a pending request rather than granting consent immediately; a designated reviewer must approve it via **Enterprise Applications** → **Admin consent requests**.

#### Troubleshooting: PPAC "+ Add an app" picker returns no results[​](#troubleshooting-ppac--add-an-app-picker-returns-no-results)
If, when following the setup guide above, the Power Platform Admin Center "+ Add an app" picker returns no results after you search for the AllTrue AISec Application ID, work through the steps below in order. Each step is a discrete check; stop as soon as one of them resolves the issue.

StepWhat it checks1The AllTrue AISec service principal exists and is healthy in your tenant2Your account has the Dataverse System Administrator role on the target environment3The target environment's type allows Application User creation4(Optional) Whether the failure is tenant-wide or specific to the target environment5Tenant-level governance policies are not filtering the application6Programmatic provisioning via the Dataverse Web API (last-resort fallback)
Before you start[​](#before-you-start)
You will need:

- Azure Cloud Shell access (`bash` mode), or a local terminal with the Azure CLI (`az`), `curl`, and `python3` installed (Step 6 uses `python3` for JSON parsing; Cloud Shell has it pre-installed).
- One of these Microsoft Entra directory roles in the tenant where your Power Platform environment lives: **Global Administrator**, **Power Platform Administrator**, or **Dynamics 365 Administrator**.
- **System Administrator** security role on the target Dataverse environment. Tenant-level admin alone does not always grant this; verifying it is part of Step 2.

Find your tenant ID, environment ID, and environment URL[​](#find-your-tenant-id-environment-id-and-environment-url)
These three values drive every command in this guide. Get them from the Power Platform Admin Center (PPAC) — it is the canonical source for which tenant your Power Platform environment is bound to. The tenant ID is the most important: the steps below only make sense relative to the specific tenant your environment lives in, which is not necessarily the same tenant your Azure subscriptions are in.

**Tenant ID and environment ID** — from PPAC Session Details:

- Sign in to `https://admin.powerplatform.microsoft.com`.
- Click the gear icon in the top-right corner.
- Select **Session details**.
- Copy the values for **Tenant ID** and **Environment ID**.

**Environment URL** — from the environment's Details page:

- PPAC → **Manage** → **Environments**.
- Click the target environment.
- On the Details page, copy the value next to **Environment URL**. It looks like `https://yourorg.crm.dynamics.com`.

Variables[​](#variables)
Open Cloud Shell (bash mode) and set these for the session. Replace each angle-bracketed value with yours. Type the values directly into Cloud Shell rather than pasting from a chat client or document — those often auto-correct straight quotes (`"`) into smart curly quotes, which bash will leave embedded in your variable values. The variables are exported so that a child process (e.g. `bash /tmp/step6.sh`) inherits them.

```
export TENANT_ID="&lt;tenant-id-from-pp-session-details&gt;"
export ENV_ID="&lt;environment-id-from-pp-session-details&gt;"
export ORG_URL="https://&lt;yourorg&gt;.crm.dynamics.com" # full URL with https://, no trailing slash
export APP_ID="0bc5e064-36f6-4d09-93ed-b7643dd05404" # AllTrue AISec — do not change

# Sign in to the correct tenant
az login --tenant "$TENANT_ID"

```
Verify your shell is now in the right tenant and your variables took:

```
az account show --query "{tenantId:tenantId, user:user.name}" -o json
echo "ORG_URL=[$ORG_URL]"

```
The `tenantId` in the `az` output must match `$TENANT_ID`. The `ORG_URL=[...]` echo should show your URL between square brackets with a leading `https://` and no smart-quote characters.

Step 1 — Confirm the AllTrue AISec service principal exists in your tenant[​](#step-1--confirm-the-alltrue-aisec-service-principal-exists-in-your-tenant)
The picker can only return what your directory contains. Run:

```
az ad sp show --id "$APP_ID" \
 --query "{accountEnabled:accountEnabled, tags:tags, \
 servicePrincipalType:servicePrincipalType, \
 appRoleAssignmentRequired:appRoleAssignmentRequired, \
 disabledByMicrosoftStatus:disabledByMicrosoftStatus, \
 displayName:displayName, appId:appId}"

```
Compare the JSON output against the table below.

OutputMeaningActionError: `Resource '0bc5e064-...' does not exist` or `Service principal not found`The service principal does not exist in this tenant. The Azure-side onboarding most likely ran against a different tenant.Re-run the Azure onboarding for the correct tenant. In the TRiSM Hub, navigate to **AI Inventory → Configuration → Cloud Accounts → Link New Account → Azure** and follow the onboarding flow. Once it completes, retry the original "+ Add an app" step.`accountEnabled: false`The service principal is disabled.Microsoft Entra portal → **Enterprise Applications** → **AllTrue AISec** → **Properties** → set **Enabled for users to sign-in?** to **Yes**. Save and retry.`disabledByMicrosoftStatus` is non-nullMicrosoft has tenant-side disabled the application, usually for compliance or publisher-verification reasons.Open the Microsoft Entra audit log for context, then follow Microsoft's documented remediation for the specific status code.`tags` array contains `HideApp` (or any value starting with `Hidden`)The service principal is hidden from end-user UIs.Run `az ad sp show --id "$APP_ID" --query tags` to find the zero-based index of the offending entry, then `az ad sp update --id "$APP_ID" --remove tags &lt;index&gt;`. Retry.`appRoleAssignmentRequired: true`The application requires explicit user/group assignment.Microsoft Entra portal → **Enterprise Applications** → **AllTrue AISec** → **Properties** → set **Assignment required?** to **No** (or assign your user explicitly under **Users and Groups**).All clean: `accountEnabled: true`, no `HideApp`-style tag, `servicePrincipalType: "Application"`, `displayName: "AllTrue AISec"`, `disabledByMicrosoftStatus: null`The service principal is healthy and visible.Continue to Step 2.
Step 2 — Verify Dataverse System Administrator role on the target environment[​](#step-2--verify-dataverse-system-administrator-role-on-the-target-environment)
This is the most common cause when the service principal looks healthy. Microsoft Entra tenant-level admin roles do not always propagate to System Administrator on a specific Dataverse environment.

- PPAC → **Manage** → **Environments**.
- Click the target environment.
- **Settings** → **Users + permissions** → **Users**.
- Search for your own user by UPN.
- Open your user record and look at the **Security roles** assigned.
- Confirm **System Administrator** is in the list.

Outcomes:

- **System Administrator is missing:** click **Manage Roles**, check **System Administrator**, save, and wait 60–120 seconds for the assignment to propagate. Then retry.
- **System Administrator is present:** continue to Step 3.

If your account does not appear in the environment's Users list at all, click **+ Add user**, add your UPN, then assign System Administrator. Some environments do not auto-populate tenant admins as Dataverse users.

Step 3 — Confirm the environment's type and provisioning state[​](#step-3--confirm-the-environments-type-and-provisioning-state)
Some environment types have additional restrictions on Application User creation.

- PPAC → **Manage** → **Environments**.
- Locate the target environment in the list and note the value in the **Type** column.
- Click the environment name to open its Details page and check three things:

**Type** (Production, Sandbox, Developer, Trial, or Default).
- Whether a **Managed Environment** badge or label appears next to the name or under **Governance**.
- Whether an **Environment URL** of the form `https://&lt;org&gt;.crm.dynamics.com` is shown — its presence means Dataverse is provisioned.

What you seeActionType is `Production` or `Sandbox`, no Managed Environment badge, Environment URL presentNo environment-type restriction. Continue to Step 4.**Managed Environment** badge presentConfirm your account holds the **Power Platform Administrator** role at the tenant level. Managed Environments require this. If missing, ask a Global Administrator to grant it. Retry.Type is `Developer` or `Trial`Application User creation has known limitations on these environment types. Try the same setup against a Production or Sandbox environment if one exists. Otherwise, proceed to Step 6.No Environment URL is shown on the Details pageThe target environment is not Dataverse-backed and cannot host an Application User. Select or provision a Dataverse-backed environment for AllTrue AISec discovery.
Step 4 — Control test in another environment (optional)[​](#step-4--control-test-in-another-environment-optional)
If your tenant has more than one Power Platform environment, repeat the "+ Add an app" step in a different environment to determine whether the failure is tenant-wide or specific to the target environment.

- **The other environment works:** the issue is specific to the target environment. Likely causes include a recent provisioning state change, environment-level access restriction, or a Dataverse data inconsistency. Either complete the AllTrue AISec assignment in the working environment if business requirements permit, or contact Microsoft support for the target environment.
- **The other environment also fails:** the issue is tenant-wide. Continue to Step 5.
- **No other environment exists:** continue to Step 5.

Step 5 — Check tenant-level governance policies[​](#step-5--check-tenant-level-governance-policies)
Some tenant policies can filter third-party applications from administrative UIs without disabling them.

**5a — Microsoft Entra application management policies.** App management policies are only queryable via Microsoft Graph; there is no direct `az ad` subcommand. Use `az rest`:

```
# Tenant-wide default app management policy
az rest --method get \
 --url "https://graph.microsoft.com/v1.0/policies/defaultAppManagementPolicy" \
 -o json

# Custom policies that can target specific applications
az rest --method get \
 --url "https://graph.microsoft.com/v1.0/policies/appManagementPolicies" \
 -o json

```
Look for an `applicationRestrictions` (or `servicePrincipalRestrictions`) block with `state: "enabled"` and rule entries for credential restrictions, audience restrictions, or specific application IDs. If a rule explicitly references the AllTrue AISec application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`, or restricts third-party multi-tenant applications broadly, exempt AllTrue AISec or adjust the rule, then retry.

If `az rest` returns an authorization error, your account does not have `Policy.Read.All`. Either skip this check or have a Global Administrator run it.

**5b — Cross-tenant access settings.** In Microsoft Entra portal → **External Identities** → **Cross-tenant access settings** → **Organization settings**, confirm there is no entry for the Varonis AllTrue AISec publisher tenant ID (`7b2547ee-f218-4d3d-8bda-c5b53ca30e96`) with restrictive inbound rules. If there is, ease the rule for "B2B collaboration" and "Applications," then retry.

Step 6 — Programmatic provisioning (last-resort fallback)[​](#step-6--programmatic-provisioning-last-resort-fallback)
If Steps 1–5 do not unblock the picker, you can create the Application User directly through the Dataverse Web API. This bypasses the PPAC picker entirely; the resulting record is identical to one the picker would create.

**Pre-requisites:** all variables from the top of this section are still set, and your account has Dataverse System Administrator on the target environment (verified in Step 2).

Run the entire block as a single script. The script is wrapped in a `( ... )` subshell so that any error inside the script will not terminate your interactive Cloud Shell session. The script is idempotent — it checks whether the Application User already exists before creating one, and checks whether the Service Reader role is already assigned before assigning it — so it is safe to re-run after a disconnect.

```
(
set -e

# 0. Validate that all required variables are set
: "${TENANT_ID:?TENANT_ID is required — see the Variables section above}"
: "${ENV_ID:?ENV_ID is required — see the Variables section above}"
: "${ORG_URL:?ORG_URL is required — see the Variables section above}"
: "${APP_ID:?APP_ID is required — see the Variables section above}"

# Defensive normalization of ORG_URL — handles common copy-paste mishaps:
# - Markdown link syntax: [text](url) → url
# - Markdown bold/italic markers
# - smart/curly quotes wrapping the value
# - missing https:// scheme
# - leading or trailing whitespace
# - trailing slash
if [[ "$ORG_URL" == *"]("*")"* ]]; then
 TEMP="${ORG_URL#*\](}"
 ORG_URL="${TEMP%%)*}"
fi
while [[ "$ORG_URL" == _* || "$ORG_URL" == \** ]]; do
 ORG_URL="${ORG_URL#_}"
 ORG_URL="${ORG_URL#\*}"
done
while [[ "$ORG_URL" == *_ || "$ORG_URL" == *\* ]]; do
 ORG_URL="${ORG_URL%_}"
 ORG_URL="${ORG_URL%\*}"
done
ORG_URL="${ORG_URL//$'“'/}"
ORG_URL="${ORG_URL//$'”'/}"
ORG_URL="${ORG_URL//$'‘'/}"
ORG_URL="${ORG_URL//$'’'/}"
ORG_URL="${ORG_URL#"${ORG_URL%%[![:space:]]*}"}"
ORG_URL="${ORG_URL%"${ORG_URL##*[![:space:]]}"}"
case "$ORG_URL" in
 https://*) ;;
 http://*) ORG_URL="https://${ORG_URL#http://}" ;;
 *) ORG_URL="https://$ORG_URL" ;;
esac
ORG_URL="${ORG_URL%/}"
echo "Using ORG_URL: $ORG_URL"

# 1. Get a Dataverse-scoped access token.
TOKEN=$(az account get-access-token --resource "$ORG_URL" --query accessToken -o tsv 2&gt;/dev/null) || true
if [ -z "$TOKEN" ]; then
 echo "ERROR: Could not get a Dataverse token."
 echo " Most common cause: you are signed into Cloud Shell with the default managed identity,"
 echo " which does not support Dataverse audiences. Run the following, then retry this script:"
 echo ""
 echo " az login --tenant \"$TENANT_ID\""
 echo ""
 exit 1
fi

# 2. Look up the root business unit
BU_FILE=$(mktemp)
BU_HTTP=$(curl -sS -o "$BU_FILE" -w "%{http_code}" \
 "$ORG_URL/api/data/v9.2/businessunits?\$filter=_parentbusinessunitid_value%20eq%20null&amp;\$select=businessunitid" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Accept: application/json")
echo "businessunits HTTP $BU_HTTP"
if [ "$BU_HTTP" != "200" ]; then
 echo "ERROR: Could not look up the root business unit. Response below."
 cat "$BU_FILE"
 exit 1
fi
ROOT_BU=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["value"][0]["businessunitid"])' "$BU_FILE")
echo "Root business unit: $ROOT_BU"

# 3. Check whether the Application User already exists (idempotency)
EXIST_FILE=$(mktemp)
EXIST_HTTP=$(curl -sS -o "$EXIST_FILE" -w "%{http_code}" \
 "$ORG_URL/api/data/v9.2/systemusers?\$filter=applicationid%20eq%20$APP_ID&amp;\$select=systemuserid" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Accept: application/json")
echo "check-existing HTTP $EXIST_HTTP"
if [ "$EXIST_HTTP" != "200" ]; then
 echo "ERROR: Could not check for an existing Application User. Response below."
 cat "$EXIST_FILE"
 exit 1
fi
EXIST_COUNT=$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))["value"]))' "$EXIST_FILE")

if [ "$EXIST_COUNT" -gt 0 ]; then
 NEW_USER=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["value"][0]["systemuserid"])' "$EXIST_FILE")
 echo "Application User already exists; systemuserid: $NEW_USER"
 echo "Skipping creation; continuing to role assignment."
else
 # 4. Create the Application User
 SU_FILE=$(mktemp)
 SU_HTTP=$(curl -sS -o "$SU_FILE" -w "%{http_code}" -X POST \
 "$ORG_URL/api/data/v9.2/systemusers" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -H "OData-MaxVersion: 4.0" \
 -H "OData-Version: 4.0" \
 -H "Prefer: return=representation" \
 -d "{
 \"applicationid\": \"$APP_ID\",
 \"businessunitid@odata.bind\": \"/businessunits($ROOT_BU)\"
 }")
 echo "create systemuser HTTP $SU_HTTP"
 if [ "$SU_HTTP" != "201" ]; then
 echo "ERROR: Did not create the Application User. Response below."
 cat "$SU_FILE"
 exit 1
 fi
 NEW_USER=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["systemuserid"])' "$SU_FILE")
 echo "Created Application User systemuserid: $NEW_USER"
fi

# 5. Look up the Service Reader security role in the same business unit as the user.
ROLE_FILE=$(mktemp)
ROLE_HTTP=$(curl -sS -o "$ROLE_FILE" -w "%{http_code}" \
 "$ORG_URL/api/data/v9.2/roles?\$filter=name%20eq%20'Service%20Reader'%20and%20_businessunitid_value%20eq%20$ROOT_BU&amp;\$select=roleid&amp;\$top=1" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Accept: application/json")
echo "roles HTTP $ROLE_HTTP"
if [ "$ROLE_HTTP" != "200" ]; then
 echo "ERROR: Could not look up the Service Reader role. Response below."
 cat "$ROLE_FILE"
 exit 1
fi
ROLE_COUNT=$(python3 -c 'import json,sys; print(len(json.load(open(sys.argv[1]))["value"]))' "$ROLE_FILE")
if [ "$ROLE_COUNT" = "0" ]; then
 echo "ERROR: 'Service Reader' role was not found in the root business unit of this environment."
 echo " Service Reader is included in environments with Customer Service or Field Service"
 echo " capabilities, and is not guaranteed in bare Dataverse environments."
 exit 1
fi
ROLE_ID=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["value"][0]["roleid"])' "$ROLE_FILE")
echo "Service Reader role id: $ROLE_ID"

# 6. Check whether Service Reader is already assigned (idempotency)
EXISTING_ROLES_FILE=$(mktemp)
ER_HTTP=$(curl -sS -o "$EXISTING_ROLES_FILE" -w "%{http_code}" \
 "$ORG_URL/api/data/v9.2/systemusers($NEW_USER)/systemuserroles_association?\$select=roleid" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Accept: application/json")
echo "existing-roles HTTP $ER_HTTP"
if [ "$ER_HTTP" != "200" ]; then
 echo "ERROR: Could not list user's existing roles. Response below."
 cat "$EXISTING_ROLES_FILE"
 exit 1
fi
ALREADY_ASSIGNED=$(python3 -c 'import json,sys; data=json.load(open(sys.argv[1]))["value"]; print("yes" if any(r["roleid"]==sys.argv[2] for r in data) else "no")' "$EXISTING_ROLES_FILE" "$ROLE_ID")

if [ "$ALREADY_ASSIGNED" = "yes" ]; then
 echo "Service Reader role already assigned to this user; skipping assignment."
else
 # 7. Assign the Service Reader role
 ASSIGN_HTTP=$(curl -sS -o /dev/null -w "%{http_code}" -X POST \
 "$ORG_URL/api/data/v9.2/systemusers($NEW_USER)/systemuserroles_association/\$ref" \
 -H "Authorization: Bearer $TOKEN" \
 -H "Content-Type: application/json" \
 -d "{\"@odata.id\": \"$ORG_URL/api/data/v9.2/roles($ROLE_ID)\"}")
 echo "assign role HTTP $ASSIGN_HTTP"
 if [ "$ASSIGN_HTTP" != "204" ]; then
 echo "ERROR: Service Reader role assignment failed."
 exit 1
 fi
fi

echo ""
echo "SUCCESS: AllTrue AISec Application User present in this environment with Service Reader assigned."
)

```
**Paste corruption in Cloud Shell.** When you paste a long multi-line block into the Cloud Shell web terminal, characters or whole lines occasionally get reordered or dropped. If you see lines like `bash /tmp/step6.shTrue AISec...` smashed together, switch to the Cloud Shell editor:

```
code /tmp/step6.sh

```
Paste into the editor, save with `Ctrl+S`, close with `Ctrl+Q`, then run `bash /tmp/step6.sh`. The exported variables from the Variables block carry over to the child shell.

**Common error responses from the script:**

OutputMeaningResolution`TENANT_ID is required` (or similar) at the very startOne of the required variables is unset.Re-run the Variables block.`ERROR: Could not get a Dataverse token``az` session is signed into the wrong tenant, or `ORG_URL` is incorrect.Re-run `az login --tenant "$TENANT_ID"` and double-check `ORG_URL` against PPAC → Environment → Details.`businessunits HTTP 401`The `az` token is for the wrong identity or tenant.Run `az account show` and confirm the tenant. Re-`az login` if needed.`create systemuser HTTP 403` with a body mentioning privilegesYour account does not have Dataverse System Administrator on this environment.Return to Step 2.`create systemuser HTTP 400` with a body mentioning `applicationid`The AllTrue AISec service principal does not exist in this tenant.Return to Step 1 and re-run the Azure onboarding for this tenant.`'Service Reader' role was not found`The role does not exist in this environment's root business unit.The role ships with Customer Service / Field Service capabilities and may be missing in a bare Dataverse environment. Confirm with your Power Platform administrator.
**Verify the result.** In PPAC → target environment → **Settings** → **Users + permissions** → **Application users**, confirm a row exists with:

- Microsoft Entra application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`
- Status: **Active**
- Security roles include **Service Reader**

If those three things are true, AllTrue AISec discovery will run on its next scheduled cycle.

If none of these steps resolve the issue[​](#if-none-of-these-steps-resolve-the-issue)
Capture the following and send it to your Varonis point of contact:

- Your Microsoft Entra tenant ID.
- The target Power Platform environment ID and its Environment URL.
- The full output of the Step 1 `az ad sp show` command.
- The HTTP status codes printed by Step 6 (if attempted) and the body of any non-success response.
- A screenshot of the PPAC "+ Add an app" search dialog when you enter the Application ID and see no results.

### Azure Databricks[​](#azure-databricks)
Azure Databricks discovery requires a one-time, per-workspace setup: you register the Varonis Atlas service principal — display name **AllTrue AISec**, Application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404` — as a service principal in your Azure Databricks workspace. Once it is registered with the entitlements below, Atlas authenticates to the workspace REST API with a workspace-scoped Microsoft Entra OAuth token and discovers the workspace's identity, compute, Unity Catalog data assets, and AI/ML resources. Discovery is **read-only**: Atlas issues only list and read calls, so it never creates clusters or instance pools and never writes to the workspace.

Perform this setup once for each workspace you want Atlas to discover. It mirrors the [Microsoft Copilot Studio Discovery](#microsoft-copilot-studio-discovery) service-principal pattern above. In Atlas, Azure Databricks discovery is part of Azure cloud-account onboarding, under **AI Inventory → Configuration → Cloud Accounts → Link New Account → Azure**.

#### Prerequisites[​](#prerequisites)

- **Workspace admin** on the target Azure Databricks workspace, or **Account admin** on the Databricks account console (account admin lets you do this for many workspaces at once).
- The **AllTrue AISec** enterprise application is registered in your Microsoft Entra ID tenant. The Atlas Azure onboarding creates it; confirm it in the Azure portal under **Microsoft Entra ID → Enterprise applications**.
- The Microsoft Entra **Directory ID** of the workspace you want to discover (Azure portal → the Databricks workspace → **Properties** → **Directory ID**).

FieldValueApplication name`AllTrue AISec`Application ID`0bc5e064-36f6-4d09-93ed-b7643dd05404`
#### Step 1 — Confirm the service principal exists[​](#step-1--confirm-the-service-principal-exists)

- Sign in to the Azure portal at `https://portal.azure.com`.
- Go to **Microsoft Entra ID → Enterprise applications**.
- Search for `AllTrue AISec` and confirm its Application ID matches `0bc5e064-36f6-4d09-93ed-b7643dd05404`.

If the application is not present, complete the Atlas Azure onboarding for this tenant first, then return here.

#### Step 2 — Verify the service principal and workspace share a tenant[​](#step-2--verify-the-service-principal-and-workspace-share-a-tenant)
This is the most common cause of "I added the service principal but Atlas sees nothing." Do it before touching the Databricks UI.

- In the Azure portal, open the Databricks workspace and note **Properties → Directory ID** — the Entra tenant the workspace lives in.
- In **Microsoft Entra ID → Overview**, note the **Tenant ID**.
- Compare the two:

**They match:** the **AllTrue AISec** service principal already exists in the workspace's tenant. Continue to Step 3.
- **They differ:** the workspace is in a different Entra tenant from the one where onboarding created the application. Perform the multi-tenant admin consent described under [Troubleshooting](#troubleshooting-azure-databricks) before continuing.

Most customers run a single Entra tenant for both their Azure subscriptions and their identity store, in which case this is a quick confirmation.

#### Step 3 — Sign in to the Databricks workspace[​](#step-3--sign-in-to-the-databricks-workspace)

- Open the workspace URL — shown in the Azure portal as the workspace's **URL** property, or click **Launch Workspace** from the workspace blade. It has the form `https://adb-&lt;workspace-id&gt;.&lt;n&gt;.azuredatabricks.net`.
- Sign in with a Microsoft Entra ID account that has the **Workspace admin** role on this workspace (or that is a Databricks **Account admin**).

#### Step 4 — Open workspace identity settings[​](#step-4--open-workspace-identity-settings)

- Click your user avatar in the top-right corner and select **Settings**.
- Under **Workspace admin**, select **Identity and access**.
- Next to **Service principals**, click **Manage**.

#### Step 5 — Add the Atlas service principal[​](#step-5--add-the-atlas-service-principal)

- Click **Add service principal**.
- Select **Microsoft Entra ID managed** (the default for Azure Databricks).
- Enter the Application ID `0bc5e064-36f6-4d09-93ed-b7643dd05404`. The display name should resolve to **AllTrue AISec**. If it does not resolve, return to Step 2 — this usually means the service principal is in a different Entra tenant.
- Click **Add**.

#### Step 6 — Assign workspace entitlements[​](#step-6--assign-workspace-entitlements)
Open the service principal from the list and set its entitlements:

EntitlementSettingWhy**Workspace access**RequiredGranted automatically when you add the service principal. Without it, every Atlas API call to the workspace is rejected.**Databricks SQL access**RecommendedLets Atlas discover SQL warehouses, AI/BI dashboards, and Genie spaces. Without it, those surfaces are invisible.**Allow unrestricted cluster creation**Do not grantAtlas discovery is read-only; granting it adds risk without enabling any discovery.**Allow instance-pool creation**Do not grantSame reasoning.
Confirm **Workspace access** is on, enable **Databricks SQL access**, leave the others off, and save.

#### Step 7 — (Optional) Grant admin access for token inventory[​](#step-7--optional-grant-admin-access-for-token-inventory)
Enabling **Admin access** for the service principal grants the workspace-admin capability, which lets Atlas additionally inventory the workspace's Personal Access Tokens (PATs) — including their owners and expiry — so it can flag long-lived tokens and tokens owned by departed users.

This step is optional. If you skip it, every other resource type is still discovered; only the PAT inventory is empty for this workspace, and Atlas records a warning. As a least-privilege default, grant **Admin access** only if PAT inventory matters to your review.

#### Step 8 — Grant Unity Catalog BROWSE on the metastore[​](#step-8--grant-unity-catalog-browse-on-the-metastore)
Workspace access alone does not expose Unity Catalog objects — Unity Catalog list endpoints only return securables the caller has been granted a privilege on. Grant the service principal the **BROWSE** privilege at the metastore level so Atlas can see every catalog, schema, table, volume, function, share, and recipient:

- In the workspace, click **Catalog** in the left navigation.
- At the top of the catalog tree, click the **gear icon** and select **Metastore**.

- Open the **Permissions** tab and click **Grant**.
- In the principal field, search for and select **AllTrue AISec** (or paste the Application ID).
- Check **BROWSE**.
- Click **Grant**.

**BROWSE** grants metadata visibility only — it does not grant `SELECT` on table contents.

#### Step 9 — Discovery runs automatically[​](#step-9--discovery-runs-automatically)
The service principal is now provisioned. On its next scheduled discovery run — or one you trigger from the Atlas UI — Atlas acquires a workspace-scoped OAuth token for the **AllTrue AISec** application, authenticates to the workspace REST API, and discovers the workspace's identity, compute, Unity Catalog data assets, and AI/ML resources. The inventory and posture findings then appear in the Atlas UI.

If you operate more than one workspace, repeat Steps 2–8 for each. You do not need to repeat Step 1 — the enterprise application is created once per Entra tenant.

#### Verification[​](#verification)

- In **Settings → Identity and access → Service principals**, open the service principal and confirm: the Application ID matches `0bc5e064-36f6-4d09-93ed-b7643dd05404`, the display name is **AllTrue AISec**, it is **Active**, and **Workspace access** and **Databricks SQL access** are enabled (plus **Admin access** if you granted it).
- In **Catalog → gear → Metastore → Permissions**, confirm the service principal has **BROWSE**.
- In the Atlas UI, trigger a discovery scan (or wait for the next scheduled one) and confirm the workspace and its resources appear in the inventory.

#### Troubleshooting (Azure Databricks)[​](#troubleshooting-azure-databricks)
**The service principal does not resolve when you enter the Application ID.** Most often the service principal does not exist in the Entra tenant the workspace lives in — return to Step 2 and verify the tenants match. Otherwise check for a typo; the exact value is `0bc5e064-36f6-4d09-93ed-b7643dd05404`.

**The workspace is in a different Entra tenant.** The **AllTrue AISec** application is a multi-tenant Entra application. To use it in a second tenant, a user with the **Global Administrator** or **Privileged Role Administrator** role in that tenant performs a one-time admin consent: open `https://login.microsoftonline.com/&lt;workspace-tenant-id&gt;/adminconsent?client_id=0bc5e064-36f6-4d09-93ed-b7643dd05404` in a browser (substitute the workspace's tenant ID) and click **Accept**. The consent prompt lists a read-only Azure Databricks scope and Microsoft Graph read scopes. This creates the service principal in the workspace's tenant; then return to Step 3.

**"Insufficient permissions" when adding the service principal.** You need the **Workspace admin** role on this workspace, or **Databricks Account admin**. Azure Owner or Contributor on the workspace resource is not sufficient — Databricks workspace roles are managed separately from Azure RBAC.

**Atlas shows zero Unity Catalog resources.** Step 8 (metastore **BROWSE**) was likely skipped — Unity Catalog list endpoints return empty without it. Confirm **Catalog → gear → Metastore → Permissions** shows the service principal with **BROWSE**.

**PAT inventory is empty.** Expected if **Admin access** was not granted in Step 7. This is a graceful fallback: Atlas records a warning and still discovers every other resource type. Grant **Admin access** if you want PAT visibility.

**The service principal shows as Inactive.** The underlying Entra enterprise application may have been disabled or deleted. Confirm **AllTrue AISec** is enabled for sign-in in the Azure portal under **Microsoft Entra ID → Enterprise applications**.

### Cloudflare LogPush Integration[​](#cloudflare-logpush-integration)
Receive HTTP and DNS access events from Cloudflare using inbound integrations:

- Get a Datadog listener API key as described in the API Keys section of the [admin console](/_docs/docs/platform_services/admin_console)
- Login to your Cloudflare tenant, select Zero Trust, select Logs and click on Logpush.
- Click on Create logpush job.
- Select Datadog.
- For the URL endpoint, enter: your tenant API URL/v1/ai-usage/log-push/format/datadog.
- In the Datadog API Key field, enter the Datadog Listener API Key created above.
- Enter `cloudflare` in the Datadog ddsource field. The other fields are optional and can be left blank.
- Click Continue.
- Select Gateway HTTP. Enter a meaningful job name, leave All logs selected, choose Select All for fields to send and click Submit.

Repeat steps 3-9 for a Gateway DNS logpush job.

If you do not know your tenant's API URL, consult your account manager.

### Watsonx.Governance Integration[​](#watsonxgovernance-integration)
To set up integration between the system and watsonx.governance, first create an API key in watsonx.governance, then create an integration within the system.

#### Getting a watsonx.governance API Key[​](#getting-a-watsonxgovernance-api-key)
You can either manually create a Service ID or create one using the Cloud shell. To use the Cloud shell:

- Login to your IBM Cloud account.
- Click on IBM Cloud Shell icon at the top.
- Copy the following script and run it in the shell.
- The output of running the script will have the following form:

```
Deleting old Guardium-AI-Security-dataSharing-apikey....
Regenerating....
Creating apikey....
2025-05-21 19:24:12,301 - INFO - Api key successfully created for ******** Account: ImfuGLcN************jxlvZj_cbo

```
(API key has been partially redacted above)
5. Copy the API key, you will need it for the second phase.

```
mkdir -p gdsc-aisec-installation &amp;&amp; cd gdsc-aisec-installation &amp;&amp; echo -ne "

import sys
import logging
import logging.config
import traceback
import subprocess
import re

# Logger setup and other constants as defined in the provided script
LOGFILE_NAME = 'watsonx-gov.log'
LOGGING_CONFIG = { 
 'version': 1,
 'disable_existing_loggers': True,
 'formatters': { 
 'standard': { 
 'format': '%(asctime)s - %(levelname)s - %(message)s'
 }
 },
 'handlers': { 
 'console_handler': { 
 'level': 'INFO',
 'formatter': 'standard',
 'class': 'logging.StreamHandler',
 'stream': 'ext://sys.stdout'
 },
 'file_handler': {
 'level': 'DEBUG',
 'formatter': 'standard',
 'class': 'logging.FileHandler',
 'filename': LOGFILE_NAME,
 'mode': 'w',
 } 
 },
 'loggers': { 
 '': { # root logger
 'handlers': ['console_handler', 'file_handler'],
 'level': 'DEBUG',
 'propagate': False
 },
 '__main__': {
 'handlers': ['console_handler', 'file_handler'],
 'level': 'DEBUG',
 'propagate': False
 }
 } 
}

# Setup logger

try:
 logging.config.dictConfig(LOGGING_CONFIG)
 logger = logging.getLogger(__name__) 
except Exception as e:
 print('Failed to setup logger !')
 print(traceback.format_exc())
 sys.exit(1)

# Fixed values

FIXED_CMD = 'ibmcloud iam'
SERVICEID_NAME = 'Guardium-AI-Security-dataSharing-serviceId'
APIKEYNAME = 'Guardium-AI-Security-dataSharing-apikey'
FAILED_MSG = 'Something was not right. Please contact support with this information:'

def check_serviceId_exists(service_id_name):
 # Define the command to check for the service I
 check_command = f'{FIXED_CMD} service-id {service_id_name}'
 return_code= run_shell(check_command, use_shell=True)
 if return_code[0] == 0:
 return True
 else:
 return False

def create_service_id_cmd(cmd, serviceId_name):
 cmd = f'{cmd} service-id-create {serviceId_name} --description \"{serviceId_name}\" '
 return cmd

def create_api_key_cmd(cmd, api_key_name, serviceId_name):
 cmd = f'{cmd} service-api-key-create {api_key_name} {serviceId_name} --description \"{api_key_name}\"'
 return cmd

def delete_api_key_cmd(cmd, api_key_name, serviceId_name):
 cmd = f'{cmd} service-api-key-delete {api_key_name} {serviceId_name} -f'
 return cmd

def account_details_cmd():
 cmd = f'ibmcloud account show'
 return cmd

def assign_access_cmd(cmd,serviceId_name):
 cmd = f'{cmd} service-policy-create {serviceId_name} --service-name openpages --roles Administrator'
 return cmd

def assign_access_func(fixed_cmd,serviceId_name):
 #Assign the access to serviceId
 assign_access_command = assign_access_cmd(fixed_cmd, serviceId_name)
 output= run_shell(assign_access_command, use_shell=True)
 if output[0]!=0:
 raise Exception('Failed to assign permission for dataSharing serviceId.')

def list_all_policies_cmd(fixed_cmd,serviceId_name):
 cmd = f'{fixed_cmd} service-policies {serviceId_name}'
 return cmd

def contain_policy_value(arr, value):
 return value in set(arr)

def policy_exist(fixed_cmd,serviceId_name):
 policies_cmd = list_all_policies_cmd(fixed_cmd,serviceId_name)
 output= run_shell(policies_cmd, use_shell=True)
 if output[0] != 0:
 raise Exception('Failed to get the policies for dataSharing-serviceID.')
 policies = re.findall(r'Service Name\s+(.*)', output[1].decode('utf-8'))
 if not contain_policy_value(policies, 'openpages'):
 print('Assigning Permissions: OpenPages to dataSharing ServiceId')
 assign_access_func(fixed_cmd,serviceId_name)

def run_shell(cmd, working_dir=None, use_shell=True):
 process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=working_dir, shell=use_shell)
 stdout, stderr = process.communicate()
 return_code = process.returncode
 return return_code, stdout, stderr

def extract_from_output(output,prefix):
 # Define a regular expression pattern to match prefix
 pattern = rf'{prefix}\s*(\S*.*)'
 match = re.search(pattern, output)
 if match:
 return match.group(1)
 return None

def generate_api_key(fixed_cmd,serviceId_name,api_key_name,account_name):
 print('Creating apikey....')
 logger.debug(f'API Key Name: {api_key_name}')
 api_key_cmd = create_api_key_cmd(fixed_cmd, api_key_name, serviceId_name)
 output= run_shell(api_key_cmd, use_shell=True)
 if output[0] != 0:
 raise Exception('Failed to Create API key')
 api_key = extract_from_output(output[1].decode('utf-8'), 'API Key')
 if not api_key:
 raise Exception('Failed to extract API key')
 logger.info(f'Api key successfully created for {account_name}: {api_key}')

def run_cli(fixed_cmd):
 try:
 details_cmd =account_details_cmd()
 details_output = run_shell(details_cmd)
 account_name= extract_from_output(details_output[1].decode('utf-8'),'Account Name:')
 serviceId_name = SERVICEID_NAME
 api_key_name = APIKEYNAME
 # Check if the service ID already exists
 if check_serviceId_exists(serviceId_name):
 policy_exist(fixed_cmd,serviceId_name)
 delete_key_cmd = delete_api_key_cmd(fixed_cmd,api_key_name,serviceId_name)
 print('Deleting old Guardium-AI-Security-dataSharing-apikey....')
 output = run_shell(delete_key_cmd,use_shell=True)
 if output[0]!=0:
 print('No Guardium-AI-Securit-dataSharing-apikey exists. Triggering for the generation....')
 else:
 print('Regenerating....')
 generate_api_key(fixed_cmd,serviceId_name,api_key_name,account_name)
 else:
 #Generate the serviceId
 serviceId_command = create_service_id_cmd(fixed_cmd, serviceId_name)
 return_code, serviceId_output, stderr = run_shell(serviceId_command, use_shell=True)
 if return_code != 0:
 raise Exception('Failed to Create service ID')
 serviceId_id = extract_from_output(serviceId_output.decode('utf-8'), 'ID')
 if not serviceId_id:
 raise Exception('Failed to extract service ID')
 logger.debug(f' Created Service ID: {serviceId_id}')
 #Generate the Api key 
 assign_access_func(fixed_cmd,serviceId_name)
 generate_api_key(fixed_cmd,serviceId_name,api_key_name,account_name)
 except Exception as err:
 logger.debug(traceback.format_exc())
 raise 

def main():
 try:
 logging.config.dictConfig(LOGGING_CONFIG)
 logger = logging.getLogger(__name__)
 run_cli(FIXED_CMD)
 sys.exit(0)
 except Exception as e:
 logger.error(f'{FAILED_MSG} {e}')
 logger.debug(traceback.format_exc())
 sys.exit(1)
if __name__ == '__main__':
 main()
" | python3 &amp;&amp; cd .. &amp;&amp; rm -rf gdsc-aisec-installation

```
To create a Service ID and API key manually:

- In IBM Cloud go to IAM.
- Click on Service IDs.
- Click on Create Service ID.
- Enter a name and description and click Create.
- Click on Assign Access.
- In Service, select OpenPages.
- Click Next.
- Select All Resources and click Next.
- Select Platform Access -&gt; Administrator and click Next.
- Click Add.
- Click Assign.
- Click on the API Keys tab and click Create.
- Give it a name and description and create the API key.
- Download and save your API key - you will need it in the next phase.

#### Getting the Open Pages Base URL[​](#getting-the-open-pages-base-url)
Login to your IBM Cloud account and navigate to your Open Pages instance. Once there, copy the URL from your browser tab (e.g. [https://gov-console-*******************.stg.openpages.ibm.com/app/jspview/react/grc/dashboard/Home](https://gov-console-*******************.stg.openpages.ibm.com/app/jspview/react/grc/dashboard/Home)).

The base URL is [https://gov-console-********************.stg.openpages.ibm.com](https://gov-console-********************.stg.openpages.ibm.com)

(Part of the URL has been redacted.)

#### Creating an Integration in the AI Security System[​](#creating-an-integration-in-the-ai-security-system)
You need to have the Admin role to create an integration.

- Click on your profile name at the top right.
- Select Admin Console.
- Click on Integration in the left-hand menu.
- Click on Add Integration.
- Select the watsonx tile and Submit.
- Enter the base URL to your system (that you noted in the previous step) and the API key generated in the previous step and include a descriptive name.
- Click Submit.

The system will attempt to connect and validate your API key and base URL and will display whether it was successful or not.

Back on the integrations list, you can also click the Sync button to verify that the systems are linked (a notification will indicate whether the connection is working). Once linked, the systems synchronize nightly.

At this point the system will synchronize with your watsonx.governance system. Specifically:

- New use cases created in watsonx.governance will create new projects in the system.
- Model resources discovered automatically within the system will create models within watsonx.governance. If a use case does not exist for these models, one will also be created based on the project name in the system.
- Updates to models made in the system will be synced to watsonx.governance as long as watsonx.governance users have not updated data within watsonx.governance. If they have, the synchronization will treat watsonx.governance as the master record and will no longer push updates from the system, so as not to overwrite changes made within watsonx.governance.

If you want to disconnect the two systems, you can delete the integration. Note that this does not delete resources already synced to watsonx.governance, but you can click Delete All Resources to remove all previously synced resources from watsonx.governance.
[PreviousAdmin Console](/_docs/docs/platform_services/admin_console)[NextData Encryption and Key Management](/_docs/docs/platform_services/encryption)- [Outbound Integration](#outbound-integration)- [Inbound Integration](#inbound-integration)- [API Integration](#api-integration)[Microsoft Copilot API Setup](#microsoft-copilot-api-setup)- [Microsoft Copilot Studio Discovery](#microsoft-copilot-studio-discovery)- [Azure Databricks](#azure-databricks)- [Cloudflare LogPush Integration](#cloudflare-logpush-integration)- [Watsonx.Governance Integration](#watsonxgovernance-integration)
