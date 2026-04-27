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

### Microsoft Co-Pilot API Setup[​](#microsoft-co-pilot-api-setup)
The TRiSM Hub calls Microsoft Purview and Graph APIs in order to retrieve information about Microsoft Co-Pilot usage.

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
[PreviousAdmin Console](/_docs/docs/platform_services/admin_console)[NextData Encryption and Key Management](/_docs/docs/platform_services/encryption)- [Outbound Integration](#outbound-integration)- [Inbound Integration](#inbound-integration)- [API Integration](#api-integration)[Microsoft Co-Pilot API Setup](#microsoft-co-pilot-api-setup)- [Microsoft Copilot Studio Discovery](#microsoft-copilot-studio-discovery)- [Cloudflare LogPush Integration](#cloudflare-logpush-integration)- [Watsonx.Governance Integration](#watsonxgovernance-integration)
