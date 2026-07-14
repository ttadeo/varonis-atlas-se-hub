# session-policy API Endpoints

## GET /v1/session-policy/rules — List all session policy rule definitions

**Endpoint**: `GET /v1/session-policy/rules`
**Summary**: List all session policy rule definitions
**Tags**: session-policy

Returns the catalogue of available session policy rule types for the platform. Each rule entry includes its identifier, display name, and description. Use this to discover which rule types can be configured via the stage-settings and toggle endpoints. These are platform-wide rule definitions; this endpoint does not expose tenant-specific settings values.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/session-policy/configs — Get resolved session policy configurations for a scope

**Endpoint**: `GET /v1/session-policy/configs`
**Summary**: Get resolved session policy configurations for a scope
**Tags**: session-policy

Returns the effective session policy settings for the authenticated customer, optionally scoped to an organization, project, or resource. Use shape='flat' (default) for one row per (level, rule_type) or shape='resolved' for one entry per rule_type with the full parent inheritance chain. Useful for inspecting which rules are active and at which hierarchy level they were configured.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_id` (query, optional): 
- `shape` (query, optional): Response shape: 'flat' returns one entry per (level, rule_type) row; 'resolved' returns one entry per rule_type with parent_chain.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/customer — Save session policy settings at customer level

**Endpoint**: `POST /v1/session-policy/stage-settings/customer`
**Summary**: Save session policy settings at customer level
**Tags**: session-policy

Persist session policy rule settings for the authenticated customer's top-level scope. These settings apply as the default for all organizations, projects, and resources unless overridden at a lower hierarchy level. Writes directly to the installed configuration — there is no staging or approval step. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id} — Save session policy settings at organization level

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}`
**Summary**: Save session policy settings at organization level
**Tags**: session-policy

Persist session policy rule settings for a specific organization within the authenticated customer's tenant. Organization-level settings override the customer-level defaults and serve as the baseline for all projects and resources under that organization. Writes directly to the installed configuration. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id} — Save session policy settings at project level

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}`
**Summary**: Save session policy settings at project level
**Tags**: session-policy

Persist session policy rule settings for a specific project within an organization. Project-level settings override both organization-level and customer-level defaults, applying to all AI resources under that project. Writes directly to the installed configuration. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}/resource/{resource_id} — Save session policy settings at resource level

**Endpoint**: `POST /v1/session-policy/stage-settings/organization/{organization_id}/project/{project_id}/resource/{resource_id}`
**Summary**: Save session policy settings at resource level
**Tags**: session-policy

Persist session policy rule settings for a specific AI resource. Resource-level settings are the most granular override in the hierarchy, taking precedence over project, organization, and customer defaults. Writes directly to the installed configuration. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/customer — Enable or disable session policy rules at customer level

**Endpoint**: `POST /v1/session-policy/toggle/customer`
**Summary**: Enable or disable session policy rules at customer level
**Tags**: session-policy

Enable or disable one or more session policy rules for the authenticated customer's top-level scope. These enable/disable states cascade to all organizations, projects, and resources unless overridden at a lower level. Use to activate or deactivate AI investigation policies tenant-wide. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id} — Enable or disable session policy rules at organization level

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}`
**Summary**: Enable or disable session policy rules at organization level
**Tags**: session-policy

Enable or disable one or more session policy rules for a specific organization. Organization-level toggles override the customer-level defaults for that organization and all its projects and resources. Use to apply different AI investigation policy activation states per organization. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id} — Enable or disable session policy rules at project level

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}`
**Summary**: Enable or disable session policy rules at project level
**Tags**: session-policy

Enable or disable one or more session policy rules for a specific project within an organization. Project-level toggles override both organization and customer defaults, applying to all AI resources under that project. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}/resource/{resource_id} — Enable or disable session policy rules at resource level

**Endpoint**: `POST /v1/session-policy/toggle/organization/{organization_id}/project/{project_id}/resource/{resource_id}`
**Summary**: Enable or disable session policy rules at resource level
**Tags**: session-policy

Enable or disable one or more session policy rules for a specific AI resource. Resource-level toggles are the most granular override, taking precedence over project, organization, and customer settings. Use to activate or deactivate AI investigation policies for individual AI resources. Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/{rule_type} — Revert organization-level session policy rule to inherited default

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/{rule_type}`
**Summary**: Revert organization-level session policy rule to inherited default
**Tags**: session-policy

Delete the organization-level override for a specific session policy rule type, causing that rule to fall back to the customer-level setting. Use when an organization-level customization should no longer diverge from the tenant default. Returns 204 on success (including when no override existed). Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization or rule type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/{rule_type} — Revert project-level session policy rule to inherited default

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/{rule_type}`
**Summary**: Revert project-level session policy rule to inherited default
**Tags**: session-policy

Delete the project-level override for a specific session policy rule type, causing that rule to walk up to the organization- or customer-level setting. Use when a project-level customization should no longer diverge from its parent. Returns 204 on success (including when no override existed). Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Project or rule type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/resource/{resource_id}/{rule_type} — Revert resource-level session policy rule to inherited default

**Endpoint**: `DELETE /v1/session-policy/override/organization/{organization_id}/project/{project_id}/resource/{resource_id}/{rule_type}`
**Summary**: Revert resource-level session policy rule to inherited default
**Tags**: session-policy

Delete the resource-level override for a specific session policy rule type, causing that rule to walk up to the project-, organization-, or customer-level setting. Use when a per-resource customization should no longer diverge from its parent. Returns 204 on success (including when no override existed). Scoped to the token's customer.

**Parameters**:
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource or rule type not found
- `500`: Unexpected server error
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

## POST /v1/session-policy/reprocess — Mark all customer sessions for session policy re-evaluation

**Endpoint**: `POST /v1/session-policy/reprocess`
**Summary**: Mark all customer sessions for session policy re-evaluation
**Tags**: session-policy, internal

Clears the processed-at timestamp on all LLM sessions for the authenticated customer, allowing them to be re-evaluated by the next session policy dispatch cycle. Use after enabling session policies that were previously inactive, so already-processed sessions are picked up. This is a blast-radius operation — it affects every session in the customer tenant. Restricted to the Admin role for external callers. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/session-policy/overruling-settings — Get child-level overrides that overrule a parent session policy scope

**Endpoint**: `GET /v1/session-policy/overruling-settings`
**Summary**: Get child-level overrides that overrule a parent session policy scope
**Tags**: session-policy, session-policy

Returns the child scopes (organizations, projects, or resources) that have overridden session policy settings at a level below the queried scope. Use this to identify which downstream entities have diverged from the inherited policy — for example, to populate an 'Overruled By' column in a policy management UI. Scoped to the authenticated customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---
