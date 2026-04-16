# Atlas API — session-policy

## GET /v1/session-policy/rules — Get Session Policy Rules

**Endpoint**: `GET /v1/session-policy/rules`
**Summary**: Get Session Policy Rules
**Tags**: session-policy

Return all session-type firewall rule definitions.

**Responses**:
- `200`: Successful Response

---

## GET /v1/session-policy/configs — Get Session Policy Configs

**Endpoint**: `GET /v1/session-policy/configs`
**Summary**: Get Session Policy Configs
**Tags**: session-policy

Return resolved session policy configs including disabled ones.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/customer — Stage Customer Settings

**Endpoint**: `POST /v1/session-policy/stage-settings/customer`
**Summary**: Stage Customer Settings
**Tags**: session-policy

Save session policy settings at customer level.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id} — Stage Organization Settings

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}`
**Summary**: Stage Organization Settings
**Tags**: session-policy

Save session policy settings at organization level.

**Parameters**:
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id} — Stage Project Settings

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}`
**Summary**: Stage Project Settings
**Tags**: session-policy

Save session policy settings at project level.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}/resource/{resource_id} — Stage Resource Settings

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}/resource/{resource_id}`
**Summary**: Stage Resource Settings
**Tags**: session-policy

Save session policy settings at resource level.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/customer — Toggle Customer Status

**Endpoint**: `POST /v1/session-policy/toggle/customer`
**Summary**: Toggle Customer Status
**Tags**: session-policy

Toggle session policy enabled/disabled at customer level.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id} — Toggle Organization Status

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}`
**Summary**: Toggle Organization Status
**Tags**: session-policy

Toggle session policy enabled/disabled at organization level.

**Parameters**:
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id} — Toggle Project Status

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}`
**Summary**: Toggle Project Status
**Tags**: session-policy

Toggle session policy enabled/disabled at project level.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}/resource/{resource_id} — Toggle Resource Status

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}/resource/{resource_id}`
**Summary**: Toggle Resource Status
**Tags**: session-policy

Toggle session policy enabled/disabled at resource level.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/session-policy/rules-default-settings/{rule_type} — Get Default Settings For Session Policy

**Endpoint**: `GET /v1/session-policy/rules-default-settings/{rule_type}`
**Summary**: Get Default Settings For Session Policy
**Tags**: session-policy

Return default settings for a session policy type.

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/session-policy/rule-settings-schema/{rule_type} — Get Settings Schema For Session Policy

**Endpoint**: `GET /v1/session-policy/rule-settings-schema/{rule_type}`
**Summary**: Get Settings Schema For Session Policy
**Tags**: session-policy

Return JSON schema for a session policy type's settings.

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/session-policy/rule-configs/{rule_type} — Get Rule Config For Session Policy

**Endpoint**: `GET /v1/session-policy/rule-configs/{rule_type}`
**Summary**: Get Rule Config For Session Policy
**Tags**: session-policy

Return composite config: rule metadata + default settings + JSON schema.

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
