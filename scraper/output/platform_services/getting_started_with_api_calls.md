---
title: Getting Started with API Calls
url: https://prod.alltrue-be.com/_docs/docs/platform_services/api
section: platform_services
---

# Getting Started with API Calls

- [](/_docs/)- Platform Services- Getting Started with API CallsOn this page# Getting Started with API Calls
Use APIs for programmatic access and control over nearly every aspect of the platform. Below are the high-level steps to effectively use the API:

- 
Create an API Role: Define a role with granular permissions that specify access only to the platform components you want your API key to manage.

- 
Create an API Key: Generate an API key that will be used to obtain an authorization token. This key should be associated with the API role you created.

- 
Invoke the JWT Token API Call: Use your API key to acquire a temporary JWT token, which is required for making subsequent API calls.

- 
Invoke APIs Using the JWT Token: Use the obtained JWT token to access and interact with the various APIs.

Full API documentation can be found in the product docs under the OpenAPI API Reference (for REST APIs) and under the GraphQL API Reference.

## Preparation[​](#preparation)
### Create the API Role[​](#create-the-api-role)

- Navigate to the Admin Console.
- Click on User Roles.
- Click Add Role.
- Give your role a name and click Submit.
- Under the permissions tab, click Add Permissions.
- From the permissions list, select the APIs you’d like your key to have access to and click Submit.

### Create API Key[​](#create-api-key)

- From the Admin Console, click API Keys.
- Click Add API Keys.
- Give your API key a name and select “Custom Integrations”. Click Submit.
- Assign the role you created in step 1 to the API key. Click on the “Roles” tab, then click Add Roles.
- Find your role from the list and click Submit.

### Sample Execution Using Python[​](#sample-execution-using-python)
Calling an API involves two steps:

- Using your API key to request a JWT token.
- Using the JWT token to call APIs.

The following Python script demonstrates how to request a JWT token using the generated API key, then extract all user information from the system. Additional details can be found in the script comments.

ParameterDescriptionRequired`API_KEY`Environment variable containing the API key generated in the Admin Console. You can also place the API key directly in the script, although this is typically not recommended.Yes`API_URL`The base URL for the API endpoint on the Varonis control plane. Usually `https://api.prod.alltrue-be.com`Yes`CUSTOMER_ID`The customer ID for your tenant. Go to **Admin Console → System Settings → Company Profile → Company ID** to extract this information.Depends on the API call`api`The API you wish to execute. Note that some APIs require additional information such as `customer_id` to function properly. Refer to the API docs for specific information on supported APIs.Yes
The following code demonstrates a request for the JWT token, and then uses the token to run an API to extract user information from the customer tenant.

```

import os
import requests
import json

# Set up API URL and API key
API_URL = os.environ.get("API_URL") # Replace with the actual base URL of your Varonis tenant
API_KEY = os.environ.get("API_KEY") # Set your API key as an environment variable
CUSTOMER_ID = os.environ.get("CUSTOMER_ID") # Replace with your actual customer ID

def get_jwt_token(api_key):
 endpoint = f"{API_URL}/v1/auth/issue-jwt-token"
 headers = {"X-API-Key": f"{api_key}"}
 response = requests.post(endpoint, headers=headers)
 response.raise_for_status()
 return response.json()["access_token"]

# Get the JWT token
JWT_TOKEN = get_jwt_token(API_KEY)
print("JWT token obtained successfully.")

# Function to make API requests
def make_api_request(endpoint, token: str, method="GET", data=None):
 headers = {
 "Authorization": f"Bearer {token}",
 "Content-Type": "application/json"
 }
 url = f"{API_URL}{endpoint}"
 
 response = requests.request(method, url, headers=headers, json=data)
 response.raise_for_status()
 return response.json()

#####################################
#Test getting users from organization
#####################################
api = f"/v1/admin/auth0-customer/{CUSTOMER_ID}/users"
response = make_api_request(api, token=JWT_TOKEN, method="GET")
print(json.dumps(response, indent=2))

```[PreviousData Encryption and Key Management](/_docs/docs/platform_services/encryption)[NextMCP Server for Coding Agents](/_docs/docs/platform_services/mcp_server)- [Preparation](#preparation)[Create the API Role](#create-the-api-role)- [Create API Key](#create-api-key)- [Sample Execution Using Python](#sample-execution-using-python)
