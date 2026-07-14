# llm-firewall API Endpoints

## POST /v1/llm-firewall/chat/log/{process_stage} — Log Chat Record

**Endpoint**: `POST /v1/llm-firewall/chat/log/{process_stage}`
**Summary**: Log Chat Record
**Tags**: llm-firewall

Single-record chat log endpoint.

Every provider (proxy/LiteLLM/Copilot-Studio, Cursor/Claude Code, etc.)
flows through ``process_chat_log_record`` ->
``persist_chat_record_as_events`` into the event tables. The deferred-task
wrapper here is identical to the batch endpoint's per-record dispatch
and the reporting-ingest worker's per-record call (production
prompt-reporting pipeline).

**Parameters**:
- `process_stage` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/chat/log-batch — Log Chat Record Batch

**Endpoint**: `POST /v1/llm-firewall/chat/log-batch`
**Summary**: Log Chat Record Batch
**Tags**: llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/ingestion/events — Post Ingestion Events

**Endpoint**: `POST /v1/llm-firewall/ingestion/events`
**Summary**: Post Ingestion Events
**Tags**: llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/fastgate/corpus/requests — Submit Fastgate Corpus Mark Request

**Endpoint**: `POST /v1/llm-firewall/fastgate/corpus/requests`
**Summary**: Submit Fastgate Corpus Mark Request
**Tags**: llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-firewall/fastgate/corpus/generation — Submit Fastgate Corpus New Generation Request

**Endpoint**: `POST /v1/llm-firewall/fastgate/corpus/generation`
**Summary**: Submit Fastgate Corpus New Generation Request
**Tags**: llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/rules — List all LLM firewall rules

**Endpoint**: `GET /v1/llm-firewall/rules`
**Summary**: List all LLM firewall rules
**Tags**: llm-firewall, internal

Returns every firewall rule registered for this tenant, including rule type, display name, and current enabled state. Use this to discover which security rules are available before querying their settings or summaries.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/llm-firewall/rules/{rule_type} — Get a single firewall rule by type

**Endpoint**: `GET /v1/llm-firewall/rules/{rule_type}`
**Summary**: Get a single firewall rule by type
**Tags**: llm-firewall

Retrieves metadata for one firewall rule identified by its type key. Returns null when the rule type does not exist in the shared firewall rule-type catalogue. Use after listFirewallRules to inspect a specific rule's display name and capabilities.

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates/status — Get applied-template statuses for a hierarchy level

**Endpoint**: `GET /v1/llm-firewall/templates/status`
**Summary**: Get applied-template statuses for a hierarchy level
**Tags**: llm-firewall

Returns the application status of each rules template at the requested hierarchy level (customer, organisation, project, or resource). Optionally narrow to a specific hierarchy node via query parameters. Use to see which templates are active or pending at a given scope.

**Parameters**:
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/templates/apply — Apply a rules template to a hierarchy level

**Endpoint**: `POST /v1/llm-firewall/templates/apply`
**Summary**: Apply a rules template to a hierarchy level
**Tags**: llm-firewall

Applies a named firewall rules template to the specified hierarchy scope (customer, organisation, project, or resource). Stages and installs all rules defined in the template at the target scope in one operation. Pass is_global=true to apply a platform-wide template. Scoped to the token's customer. Use to quickly configure a known rule set without manually staging each rule.

**Parameters**:
- `template_name` (query, required): Name of the template to apply
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates — List all firewall rules templates for this tenant

**Endpoint**: `GET /v1/llm-firewall/templates`
**Summary**: List all firewall rules templates for this tenant
**Tags**: llm-firewall

Returns all saved rules templates scoped to the authenticated customer. Each template bundles a named collection of firewall rule settings that can be applied to any hierarchy level in a single operation.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## POST /v1/llm-firewall/templates — Create a rules template

**Endpoint**: `POST /v1/llm-firewall/templates`
**Summary**: Create a rules template
**Tags**: llm-firewall, internal

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/llm-firewall/templates/{template_name} — Update an existing firewall rules template

**Endpoint**: `PUT /v1/llm-firewall/templates/{template_name}`
**Summary**: Update an existing firewall rules template
**Tags**: llm-firewall

Replaces the rule settings payload, description, and version of a named firewall rules template. Pass is_global=true to update a platform-wide template rather than a customer-owned one. Returns 404 when the template name does not exist for the requested scope. Scoped to the token's customer for customer-owned templates.

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/templates/{template_name} — Delete a firewall rules template permanently

**Endpoint**: `DELETE /v1/llm-firewall/templates/{template_name}`
**Summary**: Delete a firewall rules template permanently
**Tags**: llm-firewall

Permanently removes a named firewall rules template. Pass is_global=true to delete a platform-wide template. Returns 404 when the template name does not exist for the requested scope. Scoped to the token's customer for customer-owned templates. This cannot be undone — snapshot a replacement before deleting if the template is in use.

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/templates/{template_name} — Get a specific firewall rules template by name

**Endpoint**: `GET /v1/llm-firewall/templates/{template_name}`
**Summary**: Get a specific firewall rules template by name
**Tags**: llm-firewall

Retrieves a single saved rules template including its full rule-settings payload. Pass is_global=true to fetch a platform-wide template rather than a customer-owned one. Returns 404 when the template name does not exist for the requested scope.

**Parameters**:
- `template_name` (path, required): 
- `is_global` (query, optional): Whether this is a global template

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/templates/snapshot — Create a snapshot of current installed rule settings as a template

**Endpoint**: `POST /v1/llm-firewall/templates/snapshot`
**Summary**: Create a snapshot of current installed rule settings as a template
**Tags**: llm-firewall

Captures all currently enabled installed firewall rule settings at the specified hierarchy scope (customer, org, project, or resource) and saves them as a named rules template. Use for backup or to replicate a working configuration to another hierarchy scope. Returns 400 when no enabled installed settings are found at the target scope. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Optional organization ID
- `project_id` (query, optional): Optional project ID
- `resource_instance_id` (query, optional): Optional resource ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

## GET /v1/llm-firewall/rule-configs/{rule_type} — Get full configuration for a single firewall rule type

**Endpoint**: `GET /v1/llm-firewall/rule-configs/{rule_type}`
**Summary**: Get full configuration for a single firewall rule type
**Tags**: llm-firewall, internal

Returns the rule metadata, default settings, and JSON settings schema for a specific firewall rule type. Use this to understand the valid configuration options before staging changes to that rule.

**Parameters**:
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/rule-configs — List full configuration for all firewall rule types

**Endpoint**: `GET /v1/llm-firewall/rule-configs`
**Summary**: List full configuration for all firewall rule types
**Tags**: llm-firewall, internal

Returns rule metadata, default settings, and JSON settings schema for every available firewall rule type. Use this to get a complete picture of all configurable rules and their valid setting options in one call.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/rule/{rule_type} — Get installed settings for a single rule at customer level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get installed settings for a single rule at customer level
**Tags**: llm-firewall

Returns the currently installed (live) settings for one firewall rule type at the customer scope. Returns null when no customer-level installed config exists for that rule. Scoped to the customer identified by the path param. Use this before staging changes to understand the current baseline.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id} — Get installed settings for all rules at customer level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}`
**Summary**: Get installed settings for all rules at customer level
**Tags**: llm-firewall

Returns the currently installed (live) settings for every firewall rule at the customer scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no customer-level config exists. Scoped to the customer identified by the path param. Use to audit the full customer-level firewall baseline before making changes.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get installed settings for a single rule at organisation level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get installed settings for a single rule at organisation level
**Tags**: llm-firewall

Returns the currently installed (live) settings for one firewall rule type at the organisation scope. Returns null when no organisation-level installed config exists for that rule. Scoped to the specified customer and organisation. Use to understand which rules are configured at the org layer vs inherited from the customer level.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id} — Get installed settings for all rules at organisation level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get installed settings for all rules at organisation level
**Tags**: llm-firewall

Returns the currently installed (live) settings for every firewall rule at the organisation scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no organisation-level config exists. Scoped to the specified customer and organisation. Use to audit the organisation-layer firewall configuration.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get installed settings for a single rule at project level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get installed settings for a single rule at project level
**Tags**: llm-firewall

Returns the currently installed (live) settings for one firewall rule type at the project scope. Returns null when no project-level installed config exists for that rule. Scoped to the specified customer, organisation, and project. Use to understand project-specific rule overrides compared to the org baseline.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get installed settings for all rules at project level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get installed settings for all rules at project level
**Tags**: llm-firewall

Returns the currently installed (live) settings for every firewall rule at the project scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no project-level config exists. Scoped to the specified customer, organisation, and project. Use to audit project-layer firewall configuration before staging overrides.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get installed settings for a single rule at resource level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get installed settings for a single rule at resource level
**Tags**: llm-firewall

Returns the currently installed (live) settings for one firewall rule type at the resource (LLM endpoint) scope. Returns null when no resource-level installed config exists for that rule. Scoped to the specified customer, organisation, project, and resource. Use to inspect the most granular installed firewall config for a specific LLM endpoint.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get installed settings for all rules at resource level

**Endpoint**: `GET /v1/llm-firewall/installed-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get installed settings for all rules at resource level
**Tags**: llm-firewall

Returns the currently installed (live) settings for every firewall rule at the resource (LLM endpoint) scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no resource-level config exists. Scoped to the specified customer, organisation, project, and resource. Use to audit the full installed firewall configuration for one LLM endpoint.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/rule/{rule_type} — Get staged settings for a single rule at customer level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get staged settings for a single rule at customer level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for one firewall rule type at the customer scope. Returns null when no staged changes exist for that rule. Scoped to the specified customer. Use to review pending changes before calling installStagedSettings.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/rule/{rule_type} — Get staged enabled status for a single rule at customer level

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/rule/{rule_type}`
**Summary**: Get staged enabled status for a single rule at customer level
**Tags**: llm-firewall

Returns the pending enabled/disabled status for one firewall rule type at the customer scope. Returns null when no staged status change exists for that rule. Scoped to the specified customer. Use to check whether a rule's on/off state has been toggled in staging before installing.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id} — Get staged settings for all rules at customer level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}`
**Summary**: Get staged settings for all rules at customer level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for every firewall rule at the customer scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no staged config exists. Scoped to the specified customer. Use to review all pending customer-level changes before installation.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get staged settings for a single rule at organisation level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get staged settings for a single rule at organisation level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for one firewall rule type at the organisation scope. Returns null when no staged changes exist for that rule at this level. Scoped to the specified customer and organisation. Use to review org-level pending changes before installation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get staged enabled status for a single rule at organisation level

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get staged enabled status for a single rule at organisation level
**Tags**: llm-firewall

Returns the pending enabled/disabled status for one firewall rule type at the organisation scope. Returns null when no staged status change exists at this level. Scoped to the specified customer and organisation. Use to check whether a rule's on/off state has been toggled in staging for this org.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id} — Get staged settings for all rules at organisation level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get staged settings for all rules at organisation level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for every firewall rule at the organisation scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no staged config exists. Scoped to the specified customer and organisation. Use to review all pending org-level changes before installation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get staged settings for a single rule at project level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get staged settings for a single rule at project level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for one firewall rule type at the project scope. Returns null when no staged changes exist for that rule at this level. Scoped to the specified customer, organisation, and project. Use to review project-level pending changes for a specific rule before installation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get staged enabled status for a single rule at project level

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get staged enabled status for a single rule at project level
**Tags**: llm-firewall

Returns the pending enabled/disabled status for one firewall rule type at the project scope. Returns null when no staged status change exists at this level. Scoped to the specified customer, organisation, and project. Use to check whether a rule is being toggled on or off for this project in staging.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get staged settings for all rules at project level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get staged settings for all rules at project level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for every firewall rule at the project scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no staged config exists. Scoped to the specified customer, organisation, and project. Use to review all pending project-level changes before installation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get staged settings for a single rule at resource level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get staged settings for a single rule at resource level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for one firewall rule type at the resource (LLM endpoint) scope. Returns null when no staged changes exist at this level. Scoped to the specified customer, organisation, project, and resource. Use to review resource-level pending rule changes before installation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get staged enabled status for a single rule at resource level

**Endpoint**: `GET /v1/llm-firewall/staged-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get staged enabled status for a single rule at resource level
**Tags**: llm-firewall

Returns the pending enabled/disabled status for one firewall rule type at the resource (LLM endpoint) scope. Returns null when no staged status change exists at this level. Scoped to the specified customer, organisation, project, and resource. Use to confirm whether a rule is being toggled for a specific LLM endpoint in staging.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get staged settings for all rules at resource level

**Endpoint**: `GET /v1/llm-firewall/staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get staged settings for all rules at resource level
**Tags**: llm-firewall

Returns the pending (staged but not yet installed) settings for every firewall rule at the resource (LLM endpoint) scope, keyed by rule type. Optionally filter to a single rule type. Returns null per rule when no staged config exists. Scoped to the specified customer, organisation, project, and resource. Use to audit all pending changes for one LLM endpoint.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type} — Get inherited settings for a single rule at organisation level

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/rule/{rule_type}`
**Summary**: Get inherited settings for a single rule at organisation level
**Tags**: llm-firewall

Returns the settings a given firewall rule would inherit at the organisation scope — i.e., the installed customer-level settings for that rule, if any. Returns null when no inherited settings exist. Scoped to the specified customer and organisation. Use to understand the baseline an org inherits before applying org-level overrides.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type} — Get inherited settings for a single rule at project level

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/rule/{rule_type}`
**Summary**: Get inherited settings for a single rule at project level
**Tags**: llm-firewall

Returns the settings a given firewall rule would inherit at the project scope — the first installed config found when searching upward through organisation, then customer. Returns null when no ancestor has installed that rule. Scoped to the specified customer, organisation, and project. Use to understand what a project inherits before applying project overrides.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type} — Get inherited settings for a single rule at resource level

**Endpoint**: `GET /v1/llm-firewall/inherited-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}/rule/{rule_type}`
**Summary**: Get inherited settings for a single rule at resource level
**Tags**: llm-firewall

Returns the settings a given firewall rule would inherit at the resource (LLM endpoint) scope — the first installed config found when searching upward through project, organisation, then customer. Returns null when no ancestor has installed that rule. Scoped to the specified hierarchy. Use to understand what a resource inherits before applying resource-level overrides.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
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

## GET /v1/llm-firewall/all-endpoint-vmcp-effective-tools — List effective VMCP tools for all LLM endpoints

**Endpoint**: `GET /v1/llm-firewall/all-endpoint-vmcp-effective-tools`
**Summary**: List effective VMCP tools for all LLM endpoints
**Tags**: llm-firewall

Returns the effective set of VMCP (virtual MCP) tools assigned to each LLM endpoint for the authenticated customer. Supports limit/offset pagination. Scoped to the token's customer. Use to discover which tools each endpoint exposes to the firewall for enforcement or audit purposes.

**Parameters**:
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/endpoint-settings — Retrieve endpoint settings by endpoint identifier (provider-agnostic)

**Endpoint**: `GET /v1/llm-firewall/endpoint-settings`
**Summary**: Retrieve endpoint settings by endpoint identifier (provider-agnostic)
**Tags**: llm-firewall

Retrieve endpoint settings. The api_provider is optional; when omitted the
endpoint is resolved solely by endpoint_identifier.

**Parameters**:
- `endpoint_identifier` (query, optional): 
- `api_provider` (query, optional): 
- `x-alltrue-llm-api-headers` (header, optional): 

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
- `x-alltrue-llm-api-headers` (header, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id} — Get firewall rule settings summary at customer level

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}`
**Summary**: Get firewall rule settings summary at customer level
**Tags**: llm-firewall

Returns a per-rule summary of installed, staged, and inherited settings for the customer scope. Optionally filter to a single rule type. Use this to quickly audit which rules are enabled or overridden at the top of the policy hierarchy.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get overruling firewall settings at project level

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get overruling firewall settings at project level
**Tags**: llm-firewall

Returns the overruling (policy-level override) firewall settings for every rule at the project scope. Optionally filter to a single rule type. Scoped to the specified customer, organisation, and project. Use to identify which rules have project-level overrides that supersede resource-level configs.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer, organisation, or project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id} — Get overruling firewall settings at organisation level

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get overruling firewall settings at organisation level
**Tags**: llm-firewall

Returns the overruling (policy-level override) firewall settings for every rule at the organisation scope. Optionally filter to a single rule type. Scoped to the specified customer and organisation. Use to identify which rules have org-level overrides that take precedence over project or resource configs.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (query, optional): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer, organisation, or project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/overruling-settings/customer/{customer_id} — Get overruling firewall settings at customer level

**Endpoint**: `GET /v1/llm-firewall/overruling-settings/customer/{customer_id}`
**Summary**: Get overruling firewall settings at customer level
**Tags**: llm-firewall

Returns the overruling (policy-level override) firewall settings for every rule at the customer scope. Optionally filter to a single rule type. Scoped to the specified customer. Use to identify which rules have customer-level overrides that take precedence over lower-level configurations.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer, organisation, or project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id} — Get firewall rule settings summary at organisation level

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}`
**Summary**: Get firewall rule settings summary at organisation level
**Tags**: llm-firewall

Returns a per-rule summary of installed, staged, and inherited settings scoped to a specific organisation within the customer. Optionally filter to a single rule type. Use to see how firewall policy differs from the customer-level defaults for this org.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Get firewall rule settings summary at project level

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Get firewall rule settings summary at project level
**Tags**: llm-firewall

Returns a per-rule summary of installed, staged, and inherited settings scoped to a specific project within an organisation. Optionally filter to a single rule type. Use to audit project-level firewall overrides relative to the organisation.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Get firewall rule settings summary at resource level

**Endpoint**: `GET /v1/llm-firewall/settings-summary/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Get firewall rule settings summary at resource level
**Tags**: llm-firewall

Returns a per-rule summary of installed, staged, and inherited settings scoped to a specific LLM endpoint resource within a project. Optionally filter to a single rule type. Use to audit the most granular level of the firewall policy hierarchy for a given LLM endpoint.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id} — Stage firewall rule settings at customer level

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}`
**Summary**: Stage firewall rule settings at customer level
**Tags**: llm-firewall

Persists pending (staged) firewall rule settings for one or more rules at the customer scope. Staged changes are not active until installStagedSettings is called. Scoped to the specified customer. Use to prepare customer-level rule configuration changes before a controlled rollout.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id} — Stage firewall rule settings at organisation level

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Stage firewall rule settings at organisation level
**Tags**: llm-firewall

Persists pending (staged) firewall rule settings for one or more rules at the organisation scope. Staged changes are not active until installStagedSettings is called. Scoped to the specified customer and organisation. Use to prepare org-level rule overrides before a controlled rollout.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Stage firewall rule settings at project level

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Stage firewall rule settings at project level
**Tags**: llm-firewall

Persists pending (staged) firewall rule settings for one or more rules at the project scope. Staged changes are not active until installStagedSettings is called. Scoped to the specified customer, organisation, and project. Use to prepare project-level rule overrides before a controlled rollout.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Stage firewall rule settings at resource level

**Endpoint**: `POST /v1/llm-firewall/stage-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Stage firewall rule settings at resource level
**Tags**: llm-firewall

Persists pending (staged) firewall rule settings for one or more rules at the resource (LLM endpoint) scope. Staged changes are not active until installStagedSettings is called. Scoped to the specified customer, organisation, project, and resource. Use to prepare resource-level rule overrides for a specific LLM endpoint before a controlled rollout.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id} — Stage enabled/disabled status for rules at customer level

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}`
**Summary**: Stage enabled/disabled status for rules at customer level
**Tags**: llm-firewall

Stages the enabled or disabled status for one or more firewall rules at the customer scope without changing their detailed settings. Staged status changes are not active until installStagedSettings is called. Scoped to the specified customer. Use to toggle rules on or off at the customer level in staging.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id} — Stage enabled/disabled status for rules at organisation level

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}`
**Summary**: Stage enabled/disabled status for rules at organisation level
**Tags**: llm-firewall

Stages the enabled or disabled status for one or more firewall rules at the organisation scope without changing their detailed settings. Staged status changes are not active until installStagedSettings is called. Scoped to the specified customer and organisation. Use to toggle rules on or off for a specific org in staging.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Stage enabled/disabled status for rules at project level

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Stage enabled/disabled status for rules at project level
**Tags**: llm-firewall

Stages the enabled or disabled status for one or more firewall rules at the project scope without changing their detailed settings. Staged status changes are not active until installStagedSettings is called. Scoped to the specified customer, organisation, and project. Use to toggle rules on or off for a specific project in staging.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Stage enabled/disabled status for rules at resource level

**Endpoint**: `POST /v1/llm-firewall/stage-rule-status/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Stage enabled/disabled status for rules at resource level
**Tags**: llm-firewall

Stages the enabled or disabled status for one or more firewall rules at the resource (LLM endpoint) scope without changing their detailed settings. Staged status changes are not active until installStagedSettings is called. Scoped to the specified customer, organisation, project, and resource. Use to toggle rules on or off for a specific LLM endpoint in staging.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id} — Discard staged settings for a rule at customer level

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}`
**Summary**: Discard staged settings for a rule at customer level
**Tags**: llm-firewall

Removes pending (staged but not yet installed) firewall rule settings at the customer scope, reverting them to the currently installed config. Optionally filter to a specific rule type to discard only that rule's staged changes. Scoped to the specified customer. This operation cannot be undone.

**Parameters**:
- `customer_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id} — Discard staged settings for a rule at organisation level

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}`
**Summary**: Discard staged settings for a rule at organisation level
**Tags**: llm-firewall

Removes pending (staged but not yet installed) firewall rule settings at the organisation scope, reverting them to the currently installed config. Optionally filter to a specific rule type to discard only that rule's staged changes. Scoped to the specified customer and organisation. This operation cannot be undone.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id} — Discard staged settings for a rule at project level

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}`
**Summary**: Discard staged settings for a rule at project level
**Tags**: llm-firewall

Removes pending (staged but not yet installed) firewall rule settings at the project scope, reverting them to the currently installed config. Optionally filter to a specific rule type to discard only that rule's staged changes. Scoped to the specified customer, organisation, and project. This operation cannot be undone.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id} — Discard staged settings for a rule at resource level

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/organization/{organization_id}/project/{project_id}/resource/{resource_instance_id}`
**Summary**: Discard staged settings for a rule at resource level
**Tags**: llm-firewall

Removes pending (staged but not yet installed) firewall rule settings at the resource (LLM endpoint) scope, reverting them to the currently installed config. Optionally filter to a specific rule type to discard only that rule's staged changes. Scoped to the specified customer, organisation, project, and resource. This operation cannot be undone.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 
- `project_id` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/all — Discard all staged settings across every hierarchy level

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/all`
**Summary**: Discard all staged settings across every hierarchy level
**Tags**: llm-firewall

Removes ALL pending (staged but not yet installed) firewall rule settings for the specified customer across every hierarchy level — customer, organisation, project, and resource. This resets the entire staging area back to the currently installed baseline. This is a broad, irreversible operation; prefer the per-level discard endpoints when possible.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/policies — Discard staged settings for specific policy IDs

**Endpoint**: `DELETE /v1/llm-firewall/discard-staged-settings/customer/{customer_id}/policies`
**Summary**: Discard staged settings for specific policy IDs
**Tags**: llm-firewall

Removes pending (staged but not yet installed) firewall rule settings for a specific list of staged policy IDs, without requiring hierarchy path parameters. Each policy ID is validated to belong to the specified customer before being discarded. Scoped to the specified customer. Use when the caller knows the exact staged config IDs to discard rather than a hierarchy level.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/install-staged-settings — Install staged firewall settings into the active configuration

**Endpoint**: `POST /v1/llm-firewall/install-staged-settings`
**Summary**: Install staged firewall settings into the active configuration
**Tags**: llm-firewall

Promotes pending (staged) firewall rule settings to the active (installed) configuration for the authenticated customer. Use the request body to control which hierarchy levels (customer, organisations, projects, resources) are installed, and optionally filter by feature type or specific policy IDs. Returns the newly installed settings keyed by rule type. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-versions/versions/customer/{customer_id} — List all installed firewall settings versions for a customer

**Endpoint**: `GET /v1/llm-firewall/settings-versions/versions/customer/{customer_id}`
**Summary**: List all installed firewall settings versions for a customer
**Tags**: llm-firewall

Returns every versioned snapshot of installed firewall settings for the customer, including installation timestamps and an indicator of which version is currently active. Use to audit configuration history or identify the version to roll back to.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/settings-versions/active-version/customer/{customer_id} — Get the currently active firewall settings version

**Endpoint**: `GET /v1/llm-firewall/settings-versions/active-version/customer/{customer_id}`
**Summary**: Get the currently active firewall settings version
**Tags**: llm-firewall

Returns the version details of the currently active (live) firewall settings snapshot for the specified customer. Returns null when no version has been installed yet. Scoped to the specified customer. Use alongside getFirewallInstalledVersions to identify the active version before rollback.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/settings-versions/rollback/customer/{customer_id}/version/{version_id} — Rollback firewall settings to a previous version

**Endpoint**: `POST /v1/llm-firewall/settings-versions/rollback/customer/{customer_id}/version/{version_id}`
**Summary**: Rollback firewall settings to a previous version
**Tags**: llm-firewall

Restores the active firewall settings for the specified customer to a previously installed version snapshot. The target version must exist in the version history returned by getFirewallInstalledVersions. Scoped to the specified customer. This replaces the currently active configuration and the change takes effect immediately.

**Parameters**:
- `customer_id` (path, required): 
- `version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/admin/resource/{resource_instance_id}/proxy-info — Get proxy routing info for a gateway LLM resource

**Endpoint**: `GET /v1/llm-firewall/admin/resource/{resource_instance_id}/proxy-info`
**Summary**: Get proxy routing info for a gateway LLM resource
**Tags**: llm-firewall

Returns the proxy endpoint configuration for a specific LLM gateway resource, including data-plane routing details per registered data plane. Optionally filter to a single data plane account. Scoped to the token's customer. Use to inspect how traffic is routed for a given LLM endpoint in the gateway.

**Parameters**:
- `resource_instance_id` (path, required): 
- `data_plane_account_id` (query, optional): Data plane account ID associated with the resource. If not provided, the system will attempt to infer it based on the resource.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/admin/resource/{resource_instance_id}/guardrail-integration-config — Get guardrail integration config for a gateway resource

**Endpoint**: `GET /v1/llm-firewall/admin/resource/{resource_instance_id}/guardrail-integration-config`
**Summary**: Get guardrail integration config for a gateway resource
**Tags**: llm-firewall

Returns the guardrail integration configuration for a specific LLM gateway resource, covering all registered data planes (or a single data plane when data_plane_account_id is supplied). Scoped to the token's customer. Use to verify how guardrail rules are configured and propagated to the gateway for a given LLM endpoint.

**Parameters**:
- `resource_instance_id` (path, required): 
- `data_plane_account_id` (query, optional): Data plane account ID associated with the resource. If not provided, configs for all registered dataplanes are returned.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions — List LLM firewall user sessions with filtering and pagination

**Endpoint**: `GET /v1/llm-firewall/user-sessions`
**Summary**: List LLM firewall user sessions with filtering and pagination
**Tags**: llm-firewall

Returns a paginated list of LLM user sessions observed by the firewall for the authenticated tenant. Supports filtering by time range, organisation, project, endpoint, model, user attributes, application attributes, and token/event count ranges. Use this to surface sessions for investigation or monitoring.

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
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-session-filters — Get available filter options for LLM user session queries

**Endpoint**: `GET /v1/llm-firewall/user-session-filters`
**Summary**: Get available filter options for LLM user session queries
**Tags**: llm-firewall

Returns the distinct filter values (endpoints, models, users, applications) available for the user-session list query within an optional time range and hierarchy scope. Call this before listFirewallUserSessions to populate filter dropdowns or constrain search parameters.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `max_options` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/events — List individual firewall events across all sessions

**Endpoint**: `GET /v1/llm-firewall/events`
**Summary**: List individual firewall events across all sessions
**Tags**: llm-firewall

Paginated list of individual events (user prompts, tool calls, tool responses, assistant messages, agent thoughts) across all firewall sessions for the authenticated tenant. Supports rich filtering by session metadata, user metadata, application metadata, model, provider, event kind, policy state, rule/action/governance tags, tokens, event count, and time range.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 
- `model` (query, optional): 
- `provider` (query, optional): 
- `user_id` (query, optional): 
- `user_ip` (query, optional): 
- `user_role` (query, optional): 
- `user_email` (query, optional): 
- `user_privileges` (query, optional): 
- `application_id` (query, optional): 
- `application_name` (query, optional): 
- `application_version` (query, optional): 
- `min_tokens` (query, optional): 
- `max_tokens` (query, optional): 
- `min_events` (query, optional): 
- `max_events` (query, optional): 
- `rule_type` (query, optional): 
- `action_type` (query, optional): 
- `governance_tag` (query, optional): 
- `kind` (query, optional): 
- `policy_state` (query, optional): 
- `session_id` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/events/filter-options — Get filter dropdown options for the firewall events list

**Endpoint**: `GET /v1/llm-firewall/events/filter-options`
**Summary**: Get filter dropdown options for the firewall events list
**Tags**: llm-firewall

Dropdown option lists backing the AI Investigation Events filter panel: LLM endpoints, providers, models, rule types, action types, governance tags, user roles, user privileges, application names, and application versions. Endpoint/provider/model and user/application facets are derived from the tenant's own traffic in the requested window (with per-request counts); rule and action types come from the platform rule/action catalog. Options are scoped to the authenticated tenant and, when ``organization_id`` / ``project_id`` is given, further to that organization / project — matching how the events list is scoped, so a project's dropdowns only list that project's endpoints, providers, models, and governance tags. When no time range is given, the same default 24h window as the events list applies.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/events/{event_id}/tool-payload — Get full tool payload for a single firewall event

**Endpoint**: `GET /v1/llm-firewall/events/{event_id}/tool-payload`
**Summary**: Get full tool payload for a single firewall event
**Tags**: llm-firewall

Lazy-loads the full payload for one tool_call or tool_response event from the AI Monitor Events page. Returns 404 when the event does not exist for the authenticated tenant or is not a tool event. Payload fields are capped at 10,000 characters and set truncated=true when any field is clipped.

**Parameters**:
- `event_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Tool payload not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/events/{event_id}/content — Get full prose content for a single firewall event

**Endpoint**: `GET /v1/llm-firewall/events/{event_id}/content`
**Summary**: Get full prose content for a single firewall event
**Tags**: llm-firewall

Lazy-loads the full content for one user_prompt, agent_thought, or assistant_message event from the AI Monitor Events page — the session-independent content path for events that carry no user session id. Returns 404 when the event does not exist for the authenticated tenant or is not a prose event. Content fields are capped at 10,000 characters and set truncated=true when any field is clipped.

**Parameters**:
- `event_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Event content not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/llm-session/{session_id} — Get LLM request detail using a firewall session ID

**Endpoint**: `GET /v1/llm-firewall/llm-session/{session_id}`
**Summary**: Get LLM request detail using a firewall session ID
**Tags**: llm-firewall

Returns full LLM_REQUEST event detail for the firewall session identified by the given session ID, including raw prompts, completions, token counts, and policy outcomes. Returns 404 when the session ID is not found for the authenticated tenant. Scoped to the token's customer. Use as an alternative to the user-session endpoint when you have a firewall session_id directly.

**Parameters**:
- `session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Session not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id} — Get timeline and summary detail for a user session

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}`
**Summary**: Get timeline and summary detail for a user session
**Tags**: llm-firewall

Returns the full timeline summary for a single LLM user session, including all firewall sub-sessions and their policy outcomes. Returns 404 when the user_session_id does not exist for the authenticated tenant.

**Parameters**:
- `user_session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User session not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/events — Get all events for a specific user session

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/events`
**Summary**: Get all events for a specific user session
**Tags**: llm-firewall

Returns the ordered list of firewall events for a single user session, covering all sub-sessions in that user interaction. Returns 404 when the user_session_id is not found for the tenant. Use this to inspect every prompt, tool call, and response in a session.

**Parameters**:
- `user_session_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User session not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/session — Get LLM request detail for a specific session within a user session

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/session`
**Summary**: Get LLM request detail for a specific session within a user session
**Tags**: llm-firewall

Returns the full LLM_REQUEST detail for a specific firewall session inside a user session, including raw prompts, completion, token counts, and policy outcomes. Optionally pass session_id to target a specific sub-session; omit to get the most recent. Scoped to the authenticated tenant.

**Parameters**:
- `user_session_id` (path, required): 
- `session_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Session not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/llm-firewall/user-sessions/{user_session_id}/sessions/batch — Batch fetch firewall session details

**Endpoint**: `POST /v1/llm-firewall/user-sessions/{user_session_id}/sessions/batch`
**Summary**: Batch fetch firewall session details
**Tags**: llm-firewall

Fetch LLM_REQUEST detail for multiple firewall sessions in one call. FE uses this on Expand-All to avoid issuing ~50-100 concurrent single-session requests. Max 50 session IDs per call.

**Parameters**:
- `user_session_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-firewall/user-sessions/{user_session_id}/tool-call/{tool_call_id} — Get detail for a specific tool call within a user session

**Endpoint**: `GET /v1/llm-firewall/user-sessions/{user_session_id}/tool-call/{tool_call_id}`
**Summary**: Get detail for a specific tool call within a user session
**Tags**: llm-firewall

Returns the full detail for a single tool call event identified by tool_call_id within the specified user session. Includes input arguments, output results, policy outcomes, and associated governance tags. Scoped to the token's customer. Use to drill into a specific tool invocation observed during a user session.

**Parameters**:
- `user_session_id` (path, required): 
- `tool_call_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Tool call not found
- `500`: Unexpected server error
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

## GET /v1/llm-firewall/combined-settings-all — Retrieve combined firewall settings across all hierarchy levels

**Endpoint**: `GET /v1/llm-firewall/combined-settings-all`
**Summary**: Retrieve combined firewall settings across all hierarchy levels
**Tags**: llm-firewall

Returns the merged firewall rule settings across all hierarchy levels (customer, organisation, project, resource) for the authenticated tenant. Filter by status (staged/installed/inherited/inactive), feature type, or a single hierarchy scope. Use this as the primary read for the current effective firewall configuration.

**Parameters**:
- `status` (query, optional): 
- `feature_type` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/llm-firewall/combined-settings-all/customer/{customer_id} — Retrieve combined firewall settings across all hierarchy levels

**Endpoint**: `GET /v1/llm-firewall/combined-settings-all/customer/{customer_id}`
**Summary**: Retrieve combined firewall settings across all hierarchy levels
**Tags**: llm-firewall

Returns the merged firewall rule settings across all hierarchy levels (customer, organisation, project, resource) for the authenticated tenant. Filter by status (staged/installed/inherited/inactive), feature type, or a single hierarchy scope. This legacy path variant accepts customer_id in the URL but resolves it from the JWT token. Use the no-param variant getFirewallCombinedSettings as the preferred path for new integrations.

**Parameters**:
- `status` (query, optional): 
- `feature_type` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/gateway/logging-settings — Get Resource Logging Policy

**Endpoint**: `GET /v1/gateway/logging-settings`
**Summary**: Get Resource Logging Policy
**Tags**: llm-firewall

Returns the explicit resource override, or null if inheriting admin defaults.

**Parameters**:
- `resource_instance_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/gateway/logging-settings — Create Resource Logging Policy

**Endpoint**: `POST /v1/gateway/logging-settings`
**Summary**: Create Resource Logging Policy
**Tags**: llm-firewall

**Parameters**:
- `resource_instance_id` (query, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/gateway/logging-settings — Patch Resource Logging Policy

**Endpoint**: `PATCH /v1/gateway/logging-settings`
**Summary**: Patch Resource Logging Policy
**Tags**: llm-firewall

**Parameters**:
- `resource_instance_id` (query, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/gateway/logging-settings — Delete Resource Logging Policy

**Endpoint**: `DELETE /v1/gateway/logging-settings`
**Summary**: Delete Resource Logging Policy
**Tags**: llm-firewall

**Parameters**:
- `resource_instance_id` (query, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
