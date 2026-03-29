# Atlas API — llm-firewall

## POST /v1/llm-firewall/chat/log/{process_stage} — Log Chat Record

**Endpoint**: `POST /v1/llm-firewall/chat/log/{process_stage}`
**Summary**: Log Chat Record
**Tags**: llm-firewall

**Parameters**:
- `process_stage` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/chat/session/{session_id} — Get Chat Session

**Endpoint**: `GET /v1/llm-firewall/chat/session/{session_id}`
**Summary**: Get Chat Session
**Tags**: llm-firewall

**Parameters**:
- `session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/fastgate/corpus/requests — Submit Fastgate Corpus Mark Request

**Endpoint**: `POST /v1/llm-firewall/fastgate/corpus/requests`
**Summary**: Submit Fastgate Corpus Mark Request
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/fastgate/corpus/generation — Submit Fastgate Corpus New Generation Request

**Endpoint**: `POST /v1/llm-firewall/fastgate/corpus/generation`
**Summary**: Submit Fastgate Corpus New Generation Request
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rules — Get Rules

**Endpoint**: `GET /v1/llm-firewall/rules`
**Summary**: Get Rules
**Tags**: llm-firewall, internal

**Responses**:
- `200`: Successful Response

---

## GET /v1/llm-firewall/rules/{rule_type} — Get Rule By Type

**Endpoint**: `GET /v1/llm-firewall/rules/{rule_type}`
**Summary**: Get Rule By Type
**Tags**: llm-firewall

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates/status — Get rules template statuses

**Endpoint**: `GET /v1/llm-firewall/templates/status`
**Summary**: Get rules template statuses
**Tags**: llm-firewall

Retrieve the status of rules templates for a hierarchy. Optional hierarchy levels can be provided as query parameters.

**Parameters**:
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/templates/apply — Apply a rules template to a hierarchy

**Endpoint**: `POST /v1/llm-firewall/templates/apply`
**Summary**: Apply a rules template to a hierarchy
**Tags**: llm-firewall

**Parameters**:
- `template_name` (query, required): Name of the template to apply
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates — List all rules templates

**Endpoint**: `GET /v1/llm-firewall/templates`
**Summary**: List all rules templates
**Tags**: llm-firewall

**Responses**:
- `200`: Successful Response

---

## POST /v1/llm-firewall/templates — Create a rules template

**Endpoint**: `POST /v1/llm-firewall/templates`
**Summary**: Create a rules template
**Tags**: llm-firewall, internal

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/llm-firewall/templates/{template_name} — Update a rules template

**Endpoint**: `PUT /v1/llm-firewall/templates/{template_name}`
**Summary**: Update a rules template
**Tags**: llm-firewall

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/templates/{template_name} — Delete a rules template

**Endpoint**: `DELETE /v1/llm-firewall/templates/{template_name}`
**Summary**: Delete a rules template
**Tags**: llm-firewall

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates/{template_name} — Get a rules template

**Endpoint**: `GET /v1/llm-firewall/templates/{template_name}`
**Summary**: Get a rules template
**Tags**: llm-firewall

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/templates/snapshot — Create a snapshot of rules templates

**Endpoint**: `POST /v1/llm-firewall/templates/snapshot`
**Summary**: Create a snapshot of rules templates
**Tags**: llm-firewall

Create a snapshot of the current rules templates hierarchy for backup or replication purposes.

**Parameters**:
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rules-default-settings/{rule_type} — Get Default Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/rules-default-settings/{rule_type}`
**Summary**: Get Default Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `rule_type` (path, required): 
- `sensitivity` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rule-settings-schema/{rule_type} — Get Settings Schema For Rule

**Endpoint**: `GET /v1/llm-firewall/rule-settings-schema/{rule_type}`
**Summary**: Get Settings Schema For Rule
**Tags**: llm-firewall

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rule-configs/{rule_type} — Get Rule Config

**Endpoint**: `GET /v1/llm-firewall/rule-configs/{rule_type}`
**Summary**: Get Rule Config
**Tags**: llm-firewall, internal

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rule-configs — Get All Rule Configs

**Endpoint**: `GET /v1/llm-firewall/rule-configs`
**Summary**: Get All Rule Configs
**Tags**: llm-firewall, internal

**Responses**:
- `200`: Successful Response

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/rule/{rule_type} — Get Installed Rule Settings For Customer

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get Installed Rule Settings For Customer
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id} — Get All Installed Rules Settings For Customer

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}`
**Summary**: Get All Installed Rules Settings For Customer
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get Installed Rule Settings For Organization

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get Installed Rule Settings For Organization
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id} — Get All Installed Rules Settings For Organization

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get All Installed Rules Settings For Organization
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get Installed Rule Settings For Project

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get Installed Rule Settings For Project
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get All Installed Rules Settings For Project

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get All Installed Rules Settings For Project
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get Installed Rule Settings For Resource

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get Installed Rule Settings For Resource
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get All Installed Rules Settings For Resource

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get All Installed Rules Settings For Resource
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/rule/{rule_type} — Get Staged Customer Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get Staged Customer Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/rule/{rule_type} — Get Staged Customer Enabled For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get Staged Customer Enabled For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id} — Get All Staged Rules Settings For Customer

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}`
**Summary**: Get All Staged Rules Settings For Customer
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get Staged Organization Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get Staged Organization Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get Staged Organization Enabled For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get Staged Organization Enabled For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id} — Get All Staged Rules Settings For Organization

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get All Staged Rules Settings For Organization
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get Staged Project Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get Staged Project Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get Staged Project Enabled For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get Staged Project Enabled For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get All Staged Rules Settings For Project

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get All Staged Rules Settings For Project
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get Staged Resource Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get Staged Resource Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get Staged Resource Enabled For Rule

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get Staged Resource Enabled For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get All Staged Rules Settings For Resource

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get All Staged Rules Settings For Resource
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get Inherited Organization Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get Inherited Organization Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get Inherited Project Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get Inherited Project Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get Inherited Resource Settings For Rule

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get Inherited Resource Settings For Rule
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/all-endpoint-settings — Retrieve all sanctioned endpoint settings per customer

**Endpoint**: `GET /v1/llm-firewall/all-endpoint-settings`
**Summary**: Retrieve all sanctioned endpoint settings per customer
**Tags**: llm-firewall

**Parameters**:
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/all-endpoint-vmcp-effective-tools — Retrieves all the tools in VMCPs assigned to each endpoint for a customer

**Endpoint**: `GET /v1/llm-firewall/all-endpoint-vmcp-effective-tools`
**Summary**: Retrieves all the tools in VMCPs assigned to each endpoint for a customer
**Tags**: llm-firewall

**Parameters**:
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/endpoint-settings/{api_provider} — Retrieve endpoint settings per customer and api key from cache

**Endpoint**: `GET /v1/llm-firewall/endpoint-settings/{api_provider}`
**Summary**: Retrieve endpoint settings per customer and api key from cache
**Tags**: llm-firewall

function for all levels rules settings customer_id is a part of url,
other levels are optional and can be passed as query params.

**Parameters**:
- `api_provider` (path, required): 
- `endpoint_identifier` (query, optional): 
- `x-alltrue-llm-api-headers` (header, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id} — Get Settings Summary For Customer

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}`
**Summary**: Get Settings Summary For Customer
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get Overruling Settings

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get Overruling Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id} — Get Overruling Settings

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get Overruling Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (query, optional): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id} — Get Overruling Settings

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}`
**Summary**: Get Overruling Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id} — Get Settings Summary For Organization

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get Settings Summary For Organization
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get Settings Summary For Project

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get Settings Summary For Project
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get Settings Summary For Resource

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get Settings Summary For Resource
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id} — Stage Customer Settings

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}`
**Summary**: Stage Customer Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id} — Stage Organization Settings

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Stage Organization Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Stage Project Settings

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Stage Project Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Stage Resource Settings

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Stage Resource Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id} — Stage Customer Settings Status

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}`
**Summary**: Stage Customer Settings Status
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id} — Stage Organization Settings Status

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}`
**Summary**: Stage Organization Settings Status
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Stage Project Settings Status

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Stage Project Settings Status
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Stage Resource Settings Status

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Stage Resource Settings Status
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id} — Discard Staged Customer Settings

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}`
**Summary**: Discard Staged Customer Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id} — Discard Staged Organization Settings

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Discard Staged Organization Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Discard Staged Project Settings

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Discard Staged Project Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Discard Staged Resource Settings

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Discard Staged Resource Settings
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/all — Discard Staged Customer Settings All

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/all`
**Summary**: Discard Staged Customer Settings All
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/policies — Discard Staged Settings By Policies

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/policies`
**Summary**: Discard Staged Settings By Policies
**Tags**: llm-firewall

Discard staged settings for a list of policies identified by their staged config IDs.

This API does NOT require hierarchy path parameters (organization/project/resource).
Backend will:
- Look up each policy_id in the staged tables
- Validate that they all belong to the given customer_id
- Call the existing discard_*_configs helpers to reset staged configs back to
  installed or inherited values for those specific policies only.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/install-staged-settings —  Install Staged Configs For Customer

**Endpoint**: `POST /v1/llm-firewall/install-staged-settings`
**Summary**:  Install Staged Configs For Customer
**Tags**: llm-firewall

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-versions/versions/customer/{customer_id} — Get Installed Versions

**Endpoint**: `GET /v1/llm-firewall/settings-versions/versions/customer/{customer_id}`
**Summary**: Get Installed Versions
**Tags**: llm-firewall

Get all versions for a customer. For each, give details on version (when it was installed, IDs, etc) and an
indication of whether it is the active version.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-versions/active-version/customer/{customer_id} —  Get Active Version For Customer

**Endpoint**: `GET /v1/llm-firewall/settings-versions/active-version/customer/{customer_id}`
**Summary**:  Get Active Version For Customer
**Tags**: llm-firewall

Get the active version for a project

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/settings-versions/rollback/customer/{customer_id}/version/{version_id} — Rollback To Version

**Endpoint**: `POST /v1/llm-firewall/settings-versions/rollback/customer/{customer_id}/version/{version_id}`
**Summary**: Rollback To Version
**Tags**: llm-firewall

Rollback to a particular version for a project

**Parameters**:
- `customer_id` (path, required): 
- `version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/admin/reset-endpoint-manager/customer/{customer_id} — Reset Endpoint Manager For Customer

**Endpoint**: `POST /v1/llm-firewall/admin/reset-endpoint-manager/customer/{customer_id}`
**Summary**: Reset Endpoint Manager For Customer
**Tags**: llm-firewall

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/admin/resource/{resource_instance_id}/proxy-info —  Get Proxy Info For Llm Endpoint Resource

**Endpoint**: `GET /v1/llm-firewall/admin/resource/{resource_instance_id}/proxy-info`
**Summary**:  Get Proxy Info For Llm Endpoint Resource
**Tags**: llm-firewall

**Parameters**:
- `resource_instance_id` (path, required): 
- `data_plane_account_id` (query, optional): Data plane account ID associated with the resource. If not provided, the system will attempt to infer it based on the resource.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions — List User Sessions

**Endpoint**: `GET /v1/llm-firewall/user-sessions`
**Summary**: List User Sessions
**Tags**: llm-firewall

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `model` (query, optional): 
- `user_session_id` (query, optional): 
- `user_id` (query, optional): 
- `user_ip` (query, optional): 
- `user_role` (query, optional): 
- `user_email` (query, optional): 
- `user_privileges` (query, optional): 
- `application_id` (query, optional): 
- `application_name` (query, optional): 
- `application_version` (query, optional): 
- `min_events` (query, optional): 
- `max_events` (query, optional): 
- `min_tokens` (query, optional): 
- `max_tokens` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-session-filters — Get User Session Filters

**Endpoint**: `GET /v1/llm-firewall/user-session-filters`
**Summary**: Get User Session Filters
**Tags**: llm-firewall

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `max_options` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id} — Get User Session Detail

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}`
**Summary**: Get User Session Detail
**Tags**: llm-firewall

**Parameters**:
- `user_session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/session — Get User Session Llm Request Detail

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/session`
**Summary**: Get User Session Llm Request Detail
**Tags**: llm-firewall

**Parameters**:
- `user_session_id` (path, required): 
- `session_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/tool-call/{tool_call_id} — Get User Session Tool Call Detail

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/tool-call/{tool_call_id}`
**Summary**: Get User Session Tool Call Detail
**Tags**: llm-firewall

**Parameters**:
- `user_session_id` (path, required): 
- `tool_call_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/session-context/{session_id} — Get User Session Context

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/session-context/{session_id}`
**Summary**: Get User Session Context
**Tags**: llm-firewall

**Parameters**:
- `user_session_id` (path, required): 
- `session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/check-connection/{provider} — Check Connection

**Endpoint**: `POST /v1/llm-firewall/chat/check-connection/{provider}`
**Summary**: Check Connection
**Tags**: llm-firewall

**Parameters**:
- `provider` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/openai — Process Openai Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/openai`
**Summary**: Process Openai Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/azure-openai — Process Azure Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/azure-openai`
**Summary**: Process Azure Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/openai — Process Openai Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/openai`
**Summary**: Process Openai Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/azure-openai — Process Azure Openai Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/azure-openai`
**Summary**: Process Azure Openai Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/anthropic — Process Anthropic Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/anthropic`
**Summary**: Process Anthropic Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/anthropic — Process Anthropic Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/anthropic`
**Summary**: Process Anthropic Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/google — Process Gemini Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/google`
**Summary**: Process Gemini Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/google — Process Gemini Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/google`
**Summary**: Process Gemini Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/bedrock — Process Bedrock Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/bedrock`
**Summary**: Process Bedrock Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/bedrock — Process Bedrock Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/bedrock`
**Summary**: Process Bedrock Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/ibmwatsonx — Process Ibmwatsonx Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/ibmwatsonx`
**Summary**: Process Ibmwatsonx Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/ibmwatsonx — Process Ibmwatsonx Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/ibmwatsonx`
**Summary**: Process Ibmwatsonx Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/ibmwatsonx-ai-service — Process Ibmwatsonx Ai Service Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/ibmwatsonx-ai-service`
**Summary**: Process Ibmwatsonx Ai Service Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/ibmwatsonx-ai-service — Process Ibmwatsonx Ai Service Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/ibmwatsonx-ai-service`
**Summary**: Process Ibmwatsonx Ai Service Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/ibmwatsonx-assistant — Process Ibmwatsonx Assistant Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/ibmwatsonx-assistant`
**Summary**: Process Ibmwatsonx Assistant Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/ibmwatsonx-assistant — Process Ibmwatsonx Assistant Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/ibmwatsonx-assistant`
**Summary**: Process Ibmwatsonx Assistant Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/any — Process Flexible Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/any`
**Summary**: Process Flexible Completions Input
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/any — Process Flexible Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/any`
**Summary**: Process Flexible Completions Output
**Tags**: llm-firewall

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/batch/process-input/{api_provider} — Process Batch Completions Input

**Endpoint**: `POST /v1/llm-firewall/chat/batch/process-input/{api_provider}`
**Summary**: Process Batch Completions Input
**Tags**: llm-firewall

**Parameters**:
- `api_provider` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/batch/process-output/{api_provider} — Process Batch Completions Output

**Endpoint**: `POST /v1/llm-firewall/chat/batch/process-output/{api_provider}`
**Summary**: Process Batch Completions Output
**Tags**: llm-firewall

**Parameters**:
- `api_provider` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/rules — Process Rules On Input

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/rules`
**Summary**: Process Rules On Input
**Tags**: llm-firewall

**Parameters**:
- `session_id` (query, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, required): 
- `endpoint_identifier` (query, optional): 
- `llm_provider_name` (query, optional): 
- `llm_model_name` (query, optional): 
- `start_time` (query, optional): 
- `src_ip_address` (query, optional): 
- `src_hostname` (query, optional): 
- `dest_url` (query, optional): 
- `dest_port` (query, optional): 
- `dest_scheme` (query, optional): 
- `x-alltrue-llm-user-session` (header, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/rules — Process Rules On Output

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/rules`
**Summary**: Process Rules On Output
**Tags**: llm-firewall

**Parameters**:
- `session_id` (query, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `llm_provider_name` (query, optional): 
- `llm_model_name` (query, optional): 
- `start_time` (query, optional): 
- `src_ip_address` (query, optional): 
- `src_hostname` (query, optional): 
- `dest_url` (query, optional): 
- `dest_port` (query, optional): 
- `dest_scheme` (query, optional): 
- `resource_instance_id` (query, required): 
- `endpoint_identifier` (query, optional): 
- `x-alltrue-llm-user-session` (header, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-input/customer/{customer_id} — Process Chat Completions Input Using Customer Settings

**Endpoint**: `POST /v1/llm-firewall/chat/process-input/customer/{customer_id}`
**Summary**: Process Chat Completions Input Using Customer Settings
**Tags**: llm-firewall

Process rules according to current settings on the request.
On the circumstance that no block/modify input actions defined in the rules,
the request would be considered to be able to be returned immediately without waiting on the process results,
as no change will be applied to the request.

**Parameters**:
- `customer_id` (path, required): 
- `session_id` (query, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `endpoint_identifier` (query, optional): 
- `llm_provider_name` (query, optional): 
- `llm_model_name` (query, optional): 
- `start_time` (query, optional): 
- `src_ip_address` (query, optional): 
- `src_hostname` (query, optional): 
- `dest_url` (query, optional): 
- `dest_port` (query, optional): 
- `dest_scheme` (query, optional): 
- `quick_release` (query, optional): 
- `x-alltrue-llm-user-session` (header, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/process-output/customer/{customer_id} — Process Chat Completions Output Using Customer Settings

**Endpoint**: `POST /v1/llm-firewall/chat/process-output/customer/{customer_id}`
**Summary**: Process Chat Completions Output Using Customer Settings
**Tags**: llm-firewall

Process rules according to current settings on the request.
On the circumstance that no block/modify input actions defined in the rules,
the request would be considered to be able to be returned immediately without waiting on the process results,
as no change will be applied to the request.

**Parameters**:
- `customer_id` (path, required): 
- `session_id` (query, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, required): 
- `endpoint_identifier` (query, optional): 
- `llm_provider_name` (query, optional): 
- `llm_model_name` (query, optional): 
- `start_time` (query, required): 
- `src_ip_address` (query, optional): 
- `src_hostname` (query, optional): 
- `dest_url` (query, optional): 
- `dest_port` (query, optional): 
- `dest_scheme` (query, optional): 
- `quick_release` (query, optional): 
- `x-alltrue-llm-user-session` (header, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/combined-settings-all — Retrieve combined, settings for all levels

**Endpoint**: `GET /v1/llm-firewall/combined-settings-all`
**Summary**: Retrieve combined, settings for all levels
**Tags**: llm-firewall

function for all levels rules settings customer_id is a part of url,
other levels are optional and can be passed as query params.

**Parameters**:
- `status` (query, optional): 
- `feature_type` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/combined-settings-all/customer/{customer_id} — Retrieve combined, settings for all levels

**Endpoint**: `GET /v1/llm-firewall/combined-settings-all/customer/{customer_id}`
**Summary**: Retrieve combined, settings for all levels
**Tags**: llm-firewall

function for all levels rules settings customer_id is a part of url,
other levels are optional and can be passed as query params.

**Parameters**:
- `status` (query, optional): 
- `feature_type` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/combined-settings/{api_provider} — Retrieve combined settings per customer and api key from cache

**Endpoint**: `GET /v1/llm-firewall/combined-settings/{api_provider}`
**Summary**: Retrieve combined settings per customer and api key from cache
**Tags**: llm-firewall

function for all levels rules settings customer_id is a part of url,
other levels are optional and can be passed as query params.

**Parameters**:
- `api_provider` (path, required): 
- `endpoint_identifier` (query, optional): 
- `x-alltrue-llm-api-headers` (header, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/install-staged-settings/customer/{customer_id} —  Install Staged Configs For Customer Deprecated

**Endpoint**: `POST /v1/llm-firewall/install-staged-settings/customer/{customer_id}`
**Summary**:  Install Staged Configs For Customer Deprecated
**Tags**: llm-firewall

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/get-secret —  Get Secret

**Endpoint**: `POST /v1/admin/get-secret`
**Summary**:  Get Secret
**Tags**: llm-firewall, job-manager

Get a secret for a customer.

Returns the secret value upon completion.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/set-secret —  Set Secret

**Endpoint**: `POST /v1/admin/set-secret`
**Summary**:  Set Secret
**Tags**: llm-firewall, job-manager

Set a secret for a customer.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/delete-secret —  Delete Secret

**Endpoint**: `POST /v1/admin/delete-secret`
**Summary**:  Delete Secret
**Tags**: llm-firewall, job-manager

Delete a secret for a customer.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/get-parameter —  Get Parameter

**Endpoint**: `POST /v1/admin/get-parameter`
**Summary**:  Get Parameter
**Tags**: llm-firewall, job-manager

Get a parameter for a customer.

Returns the parameter value upon completion.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
