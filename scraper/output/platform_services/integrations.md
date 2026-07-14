---
title: Integrations
url: https://prod.alltrue-be.com/_docs/docs/platform_services/integration
section: platform_services
---

# Integrations

- [](/_docs/)- Platform Services- IntegrationsExport PDFOn this page# Integrations
There are three types of integrations between the platform and other systems you use in your corporate environment:

- 
Outbound Integration: Integration with systems such as SIEM, service management, or observability applications where the system sends data about AI systems to those applications.

- 
Inbound Integration: Integration with systems such as DLP or ZTNA where applications forward logs or data to the system.

- 
API Integration: Integration with Atlas using published APIs.

## Outbound Integration[​](#outbound-integration)
Outbound integration includes:

- 
Sending issues to SIEM systems.

- 
Sending incidents to SIEM systems and to Service Now.

- 
Sending LLM events going through the AI Runtime Protection to Datadog.

To complete outbound integration, first define the outbound endpoint. These are HTTPS endpoints and require generating an API key on the receiving system and then defining the endpoint in the platform. Once the endpoint is defined, you select which endpoint should receive which type of data. This is done at the project level.

Outbound integrations are defined on the [Admin Console](/_docs/docs/admin_console/).

## Inbound Integration[​](#inbound-integration)
An example of inbound integration is receiving log push events from systems such as ZTNA (e.g., Cloudflare) to determine which external AI services are being used by company employees.

Inbound integration is done using an endpoint and an API key. Atlas endpoints function either as a Splunk HEC endpoint or as a Datadog log endpoint. This means that the setup is identical to the setup that is done when connecting either to Splunk HEC or to Datadog log push. The same fields need to be filled in.

To use inbound listeners, generate an API key of the appropriate type, have the appropriate role assigned to the API key (which is done automatically by the system), and then connect to the API endpoint.

## API Integration[​](#api-integration)
There are two types of API-based integrations - inbound or outbound.

Inbound API integration means that you can use all Atlas published APIs to perform activities in Atlas without using the GUI, allowing you to integrate with Atlas using scripts and DevOps processes. All functions in Atlas are exposed through APIs. [Click here to see](/_docs/api/overview) how to call APIs and what APIs are available.

Outbound API integrations are APIs in other systems that the platform calls to collect additional information about AI systems.

Read a brief tutorial on [calling APIs](/_docs/docs/platform_services/api)

### Microsoft Copilot API Setup[​](#microsoft-copilot-api-setup)
Atlas calls Microsoft Purview and Graph APIs in order to retrieve information about Microsoft Copilot usage.

To set up API access:

- Open your Azure portal. Make sure you sign in as an admin with permission to grant consent.
- Search for Enterprise applications and select All applications.
- Get an application ID from your account manager.
- Enter the application ID in the search bar and click Apply.
- Click on Permissions.
- Review the permissions the system is asking of you and click on "Grant admin consent for {tenant}". Click Accept.

### Microsoft Copilot Studio Discovery[​](#microsoft-copilot-studio-discovery)
Azure and Power Platform onboarding — tenant **admin consent**, the **Dataverse Application User (Service Reader)** setup, and the "+ Add an app" troubleshooting — now lives on the consolidated Azure provider page. See **[Providers → Azure → Grant Atlas access to your tenant](/_docs/docs/providers/azure/tenant_setup)**.

### Azure Databricks[​](#azure-databricks)
Azure Databricks onboarding now has its own page. See **[Providers → Databricks → Azure Databricks](/_docs/docs/providers/databricks/azure)** for the full per-workspace setup.

### Cloudflare LogPush Integration[​](#cloudflare-logpush-integration)
#### What this integration does[​](#what-this-integration-does)
The platform receives HTTP and DNS access events that your Cloudflare Zero Trust portal pushes from Gateway HTTP and Gateway DNS LogPush jobs. The platform matches each access against its catalog of AI services, attributes it to the user, and surfaces the result under **AI Investigation &gt; Events** with the Source column reading "ZTNA". No setup form exists in the platform UI for Cloudflare — configuration happens entirely in your Cloudflare Zero Trust portal.

#### Prerequisites[​](#prerequisites)

- A **Datadog Listener** or **Splunk Listener** API key issued from the [Admin Console](/_docs/docs/admin_console/), depending on which LogPush destination format your Cloudflare account is configured for.
- Your tenant API URL. If you do not know it, consult your account manager.
- A Cloudflare Zero Trust account with LogPush enabled on the Gateway HTTP and Gateway DNS datasets.

#### Option A — Datadog format LogPush job[​](#option-a--datadog-format-logpush-job)

- Issue a **Datadog Listener** API key from the Admin Console.
- In your Cloudflare Zero Trust portal, go to **Logs &gt; LogPush** and click **Create LogPush job**.
- Select **Datadog** as the destination.
- For **URL endpoint**, enter `&lt;your-tenant-api-url&gt;/v1/ai-usage/log-push/format/datadog`. The platform validates the key on its side as the `dd-api-key` request header.
- In the **Datadog API Key** field, paste the Datadog Listener key you issued in step 1.
- Set **ddsource** to `cloudflare`. Other fields can be left blank.
- Click **Continue**.
- Select the **Gateway HTTP** dataset, give the job a meaningful name, leave "All logs" selected, choose **Select All** for fields, and click **Submit**.
- Repeat steps 2–8 for the **Gateway DNS** dataset (one LogPush job per dataset).

The endpoint returns HTTP 202 on accept and processes the batch asynchronously; gzipped bodies are supported.

#### Option B — Splunk format LogPush job[​](#option-b--splunk-format-logpush-job)

- Issue a **Splunk Listener** API key from the Admin Console.
- In your Cloudflare Zero Trust portal, go to **Logs &gt; LogPush** and click **Create LogPush job**.
- Select **Splunk** as the destination.
- For **URL endpoint**, enter `&lt;your-tenant-api-url&gt;/services/collector/raw?channel=&lt;any-non-empty-value&gt;`. The `channel` query parameter is required (Splunk HEC convention is a GUID, but any non-empty value is accepted).
- Set the **Authorization** header to the Splunk Listener key you issued in step 1 — pass the raw key value with no `Bearer` prefix.
- Select the **Gateway HTTP** dataset, give the job a meaningful name, choose **Select All** for fields, and click **Submit**.
- Repeat steps 2–6 for the **Gateway DNS** dataset (one LogPush job per dataset).

Both options are equally supported; pick whichever destination type your Cloudflare account is already configured for.

#### What you see after logs flow[​](#what-you-see-after-logs-flow)
Once the LogPush job is running, events appear under **AI Investigation &gt; Events** with the Source column reading "ZTNA". See [AI Investigation](/_docs/docs/applications/ai_monitor) for the events table reference and how to filter, drill in, and act on policy from there.

Cloudflare and Netskope events share the same "ZTNA" Source label in the events table — the UI does not split the Source column by upstream provider. If you operate both, distinguish them by other column values (such as the user agent or query URL pattern) rather than by Source.

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

#### Connecting to IBM watsonx.governance on-premises[​](#connecting-to-ibm-watsonxgovernance-on-premises)
If your IBM watsonx.governance is hosted on-premises rather than on IBM Cloud, choose the on-premises option in the Add Integration form. In addition to the base URL and API key, you supply the instance name for your on-premises deployment. The system uses these values to address your watsonx.governance instance and authenticate against it.

If you are unsure whether your deployment is IBM Cloud or on-premises, or you do not know your instance name, consult your account manager or your watsonx.governance administrator.

#### How Sync works[​](#how-sync-works)
The Sync button on the integration row starts a background synchronization job rather than running synchronously. After you click Sync, the system tracks the job's progress and, when it finishes, surfaces the outcome on the integration row as success, partial success, or failure. You can leave the page while the job runs and return later to check the result.

#### Daily synchronization and partial success[​](#daily-synchronization-and-partial-success)
In addition to manual Sync runs, the system synchronizes with watsonx.governance once per day. If some resources fail to sync during a run, the run is marked as partial success and the failures are surfaced in the integration's status. The next scheduled or manual run retries the failed resources.

#### How updates are kept in sync (drift handling)[​](#how-updates-are-kept-in-sync-drift-handling)
After the initial sync, the platform continues to push updates to model resources in watsonx.governance as long as those resources have not been edited inside watsonx.governance. Once a watsonx.governance user edits a resource directly, watsonx.governance becomes the editor of record for that resource and the platform stops pushing further updates to it, so that watsonx.governance-side changes are not overwritten.

If you want the platform to resume pushing updates for a resource that has drifted, remove the resource from watsonx.governance. The next sync recreates it from the current platform data and resumes normal synchronization for that resource.

#### Where synced resources live in watsonx.governance[​](#where-synced-resources-live-in-watsonxgovernance)
Each tenant has its own dedicated folder under your OpenPages root. The platform creates this folder on the first sync and stores all model resources it pushes inside it. You can browse the folder in watsonx.governance to see the synced resources.

Use cases imported from watsonx.governance arrive as projects, grouped under an auto-created organization in the platform that is dedicated to this integration. New use cases created in watsonx.governance after the integration is set up appear there on the next sync.

#### Disconnect versus remove synced resources[​](#disconnect-versus-remove-synced-resources)
There are two distinct destructive actions on the integration:

- **Delete integration** removes the connection between the platform and watsonx.governance. Any resources that have already been synced to watsonx.governance remain in place and are not touched. Use this when you want to stop synchronizing but keep the data that is already in watsonx.governance.
- **Delete All Resources** additionally removes the platform-managed folder and its contents from watsonx.governance. If you later reconnect the integration, the next sync rebuilds the folder from scratch. Use this when you want a clean slate in watsonx.governance.

#### Troubleshooting partial sync failures[​](#troubleshooting-partial-sync-failures)
If a sync run is marked as partial success, open the integration's detail view to see which resources failed. The status surfaced on the integration row always reflects the most recent run. After addressing the underlying cause (for example, a stale API key or a permission change in watsonx.governance), click Sync again to retry.
[PreviousOnboarding](/_docs/docs/platform_services/onboarding)[NextData Encryption and Key Management](/_docs/docs/platform_services/encryption)- [Outbound Integration](#outbound-integration)- [Inbound Integration](#inbound-integration)- [API Integration](#api-integration)[Microsoft Copilot API Setup](#microsoft-copilot-api-setup)- [Microsoft Copilot Studio Discovery](#microsoft-copilot-studio-discovery)- [Azure Databricks](#azure-databricks)- [Cloudflare LogPush Integration](#cloudflare-logpush-integration)- [Watsonx.Governance Integration](#watsonxgovernance-integration)
