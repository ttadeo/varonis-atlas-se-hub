# session-policy API Endpoints

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
- `shape` (query, optional): Response shape: 'flat' returns one entry per (level, rule_type) row; 'resolved' returns one entry per rule_type with parent_chain.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/customer — Stage Customer Settings

**Endpoint**: `POST /v1/session-policy/stage-settings/customer`
**Summary**: Stage Customer Settings
**Tags**: session-policy

Save session policy settings at customer level.

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/customer — Toggle Customer Status

**Endpoint**: `POST /v1/session-policy/toggle/customer`
**Summary**: Toggle Customer Status
**Tags**: session-policy

Toggle session policy enabled/disabled at customer level.

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/{rule_type} — Revert Organization Override Route

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/{rule_type}`
**Summary**: Revert Organization Override Route
**Tags**: session-policy

Delete the org-level installed override row; resolution falls back to the customer level.

**Parameters**:
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/{rule_type} — Revert Project Override Route

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/{rule_type}`
**Summary**: Revert Project Override Route
**Tags**: session-policy

Delete the project-level installed override row; resolution walks up to the parent.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/resource/{resource_id}/{rule_type} — Revert Resource Override Route

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/resource/{resource_id}/{rule_type}`
**Summary**: Revert Resource Override Route
**Tags**: session-policy

Delete the resource-level installed override row; resolution walks up to the parent.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
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

## POST /v1/session-policy/reprocess — Reprocess Sessions

**Endpoint**: `POST /v1/session-policy/reprocess`
**Summary**: Reprocess Sessions
**Tags**: session-policy, internal

Clear session_policies_processed_at for a customer's sessions.

This allows previously processed sessions to be re-evaluated by the
next dispatch cycle. Use when policies are enabled after sessions
were already marked as processed.

Callable by both internal (ETL) and external Admin tokens; the route
is gated to the ``Admin`` role for external callers in
``permissions_roles_config.json`` because clearing
``session_policies_processed_at`` for the entire customer is a
blast-radius-heavy operation. The successful clear is audited via
logfire so admin invocations are attributable.

**Responses**:
- `200`: Successful Response

---
