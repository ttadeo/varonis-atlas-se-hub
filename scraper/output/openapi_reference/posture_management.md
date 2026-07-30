# posture-management API Endpoints

## POST /v1/posture-management/incidents — Create a new posture incident with linked issues

**Endpoint**: `POST /v1/posture-management/incidents`
**Summary**: Create a new posture incident with linked issues
**Tags**: posture-management, incidents

Deprecated: the assignee is supplied as an Auth0 subject id. Use ``POST /v2/posture-management/incidents`` (assignee keyed on the internal user_id) instead.

Create a posture incident for the token's customer, setting its type, severity, status, assignee, due date, and an optional list of posture issue IDs to link immediately. Use this when an agent needs to open a new incident to track one or more related posture findings. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Assignee user not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/incidents — List all posture incidents for the authenticated customer

**Endpoint**: `GET /v1/posture-management/incidents`
**Summary**: List all posture incidents for the authenticated customer
**Tags**: posture-management, incidents

Deprecated: each incident's assignee is returned as an Auth0 subject id. Use ``GET /v2/posture-management/incidents`` (assignee keyed on the internal user_id) instead.

Return all posture incidents belonging to the token's customer, each with their associated issues. Filter by project_id or organization_id to narrow scope; when project_id is provided, organization_id is ignored.

**Parameters**:
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id} — Get Incident

**Endpoint**: `GET /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id}`
**Summary**: Get Incident
**Tags**: posture-management, incidents

Get Incident by ID

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id} — Delete Incident

**Endpoint**: `DELETE /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id}`
**Summary**: Delete Incident
**Tags**: posture-management, incidents

Delete an Incident and its associated IncidentIssue records

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/{incident_id} — Get a single posture incident with its associated issues

**Endpoint**: `GET /v1/posture-management/incidents/{incident_id}`
**Summary**: Get a single posture incident with its associated issues
**Tags**: posture-management, incidents

Deprecated: the assignee is returned as an Auth0 subject id. Use ``GET /v2/posture-management/incidents/{incident_id}`` (assignee keyed on the internal user_id) instead.

Return the full detail of one posture incident — status, severity, assignee, timestamps, and the list of linked posture issues — scoped to the token's customer. Returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id} — Update metadata fields on a posture incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}`
**Summary**: Update metadata fields on a posture incident
**Tags**: posture-management, incidents

Deprecated: the assignee is supplied as an Auth0 subject id. Use ``PATCH /v2/posture-management/incidents/{incident_id}`` (assignee keyed on the internal user_id) instead.

Update editable fields — title, description, severity, or other metadata — on a posture incident owned by the token's customer. Returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/incidents/{incident_id} —  Delete Incident

**Endpoint**: `DELETE /v1/posture-management/incidents/{incident_id}`
**Summary**:  Delete Incident
**Tags**: posture-management, incidents

Deprecated: returns an untyped ``dict`` acknowledgement. Use ``DELETE /v2/posture-management/incidents/{incident_id}`` (204 No Content) instead.

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/customer/{customer_id} — Get All Incidents

**Endpoint**: `GET /v1/posture-management/incidents/customer/{customer_id}`
**Summary**: Get All Incidents
**Tags**: posture-management, incidents

Get all Incidents for a customer. If you specify project_id, ignores organization_id

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/update-issues — Update Issue In Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/update-issues`
**Summary**: Update Issue In Incident
**Tags**: posture-management, incidents

Update Incident with issues

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/update-issues — Link one or more posture issues to an incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/update-issues`
**Summary**: Link one or more posture issues to an incident
**Tags**: posture-management, incidents

Deprecated: returns an untyped ``dict`` acknowledgement. Use ``PATCH /v2/posture-management/incidents/{incident_id}/update-issues`` (returns the updated incident detail) instead.

Assign a list of posture issue IDs to the specified incident, creating issue-to-incident associations. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/delete-issues — Delete Issue From Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/delete-issues`
**Summary**: Delete Issue From Incident
**Tags**: posture-management, incidents

Delete Issues from Incident

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/delete-issues — Unlink one or more posture issues from an incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/delete-issues`
**Summary**: Unlink one or more posture issues from an incident
**Tags**: posture-management, incidents

Deprecated: returns an untyped ``dict`` acknowledgement. Use ``PATCH /v2/posture-management/incidents/{incident_id}/delete-issues`` (returns the updated incident detail) instead.

Remove the association between a list of posture issue IDs and the specified incident. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/status —  Update Incident Status

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/status`
**Summary**:  Update Incident Status
**Tags**: posture-management, incidents

Update Incident status, with a required comment if status is changed to CLOSED

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/status — Transition the status of a posture incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/status`
**Summary**: Transition the status of a posture incident
**Tags**: posture-management, incidents

Deprecated: part of the v1 incident surface superseded by v2. Use ``PATCH /v2/posture-management/incidents/{incident_id}/status`` instead.

Update the lifecycle status of a posture incident (e.g. open, in-progress, closed). Closing an incident requires a comment. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/assign — Assign Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/assign`
**Summary**: Assign Incident
**Tags**: posture-management, incidents

Assign an Incident to a user

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/assign — Assign a posture incident to a user

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/assign`
**Summary**: Assign a posture incident to a user
**Tags**: posture-management, incidents

Deprecated: the assignee is supplied as an Auth0 subject id. Use ``PATCH /v2/posture-management/incidents/{incident_id}/assign`` (assignee keyed on the internal user_id) instead.

Set or change the assignee of a posture incident by specifying the user's ID. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Incident not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/issue — Update status, severity, or triage state of a single posture issue

**Endpoint**: `PATCH /v1/posture-management/issue`
**Summary**: Update status, severity, or triage state of a single posture issue
**Tags**: posture-management

Deprecated: the assignee is supplied as an Auth0 subject id. Use ``PATCH /v2/posture-management/issue`` (assignee keyed on the internal user_id) instead.

Modify fields on a single posture finding — such as status, severity, or in-progress flag — scoped to the token's customer. Use this to triage or acknowledge an individual issue. Returns 404 when the issue does not exist or belongs to a different tenant.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/posture-management/issues — Bulk-update status or severity on multiple posture issues

**Endpoint**: `PATCH /v1/posture-management/issues`
**Summary**: Bulk-update status or severity on multiple posture issues
**Tags**: posture-management

Deprecated: the assignee is supplied as an Auth0 subject id. Use ``PATCH /v2/posture-management/issues`` (assignee keyed on the internal user_id) instead.

Apply the same field changes — status, severity, in-progress flag — to a list of posture issue IDs in one request. Scoped to the token's customer; issues that do not belong to the customer are rejected. Useful for bulk triage or acknowledgement workflows.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: One or more issues not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/issue-types — List all posture issue types with display names

**Endpoint**: `GET /v1/posture-management/issue-types`
**Summary**: List all posture issue types with display names
**Tags**: posture-management

Return the complete catalogue of posture issue type identifiers and their human-readable display names. Use this to populate filter dropdowns or map issue type codes to labels in the UI. This is a static platform-wide reference — the list applies to all tenants equally and does not vary by customer context.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/posture-management/job-status/{job_id} — Get Discovery Job Status

**Endpoint**: `GET /v1/posture-management/job-status/{job_id}`
**Summary**: Get Discovery Job Status
**Tags**: posture-management

Get the status of a job that was initiated to run a discovery scan.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/policies — List all available posture management policies

**Endpoint**: `GET /v1/posture-management/policies`
**Summary**: List all available posture management policies
**Tags**: posture-management

Return the full catalog of posture management policies known to the platform, optionally filtered by policy_type (e.g. MODEL_POLICY, CLOUD_CONFIGURATION_POLICY). This endpoint is platform-wide and does not require a customer context — use it to discover which policy names can be activated for a customer via POST /customers/{customer_id}/policies.

**Parameters**:
- `policy_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/policy-groups — List all available posture management policy groups

**Endpoint**: `GET /v1/posture-management/policy-groups`
**Summary**: List all available posture management policy groups
**Tags**: posture-management

Return the full catalog of posture management policy groups known to the platform. Policy groups are named bundles of policies (e.g. 'NIST AI RMF', 'OWASP LLM Top 10'). This endpoint is platform-wide with no customer scoping — use it to discover which group names can be activated for a customer via POST /customers/{customer_id}/policy-groups.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/posture-management/policy-groups/{policy_group_name} — Get a single posture management policy group by name

**Endpoint**: `GET /v1/posture-management/policy-groups/{policy_group_name}`
**Summary**: Get a single posture management policy group by name
**Tags**: posture-management

Return the full definition of a single posture management policy group, including the list of policies it bundles. This endpoint is platform-wide with no customer scoping. Use to inspect which policies are included in a group before activating it for a customer.

**Parameters**:
- `policy_group_name` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy group not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policies — List active posture management policies for a customer

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policies`
**Summary**: List active posture management policies for a customer
**Tags**: posture-management

Return all posture management policies currently enabled for a customer, including the scope level at which each was activated (customer, organization, or project). Filter by organization_id, project_id, or policy_type to narrow results.

Deprecated: prefer listPosturePolicyConfiguration, which returns the full policy catalog merged with the same enabled_from_* flags in one pre-sorted response and derives the customer from the access token. This endpoint is retained for callers that need only the enabled subset and the activation source (individual vs group).

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `policy_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/policies — Add Security Posture Management Policies for a Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/policies`
**Summary**: Add Security Posture Management Policies for a Customer
**Tags**: posture-management

Activate one or more posture management policies for a customer. By default the policies are enabled at the customer level (all organizations and projects). Supply organization_id or project_id to limit activation to a specific scope. Scoped to the token's customer. Use listPosturePolicies to discover valid policy names.

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

## GET /v1/posture-management/policies/configuration — List posture policies with the customer's enablement state

**Endpoint**: `GET /v1/posture-management/policies/configuration`
**Summary**: List posture policies with the customer's enablement state
**Tags**: posture-management

Return the full posture management policy catalog (across all policy types, or a single type via policy_type) merged with the token customer's per-scope enablement state, ordered ascending by the visible policy label (display_name, nulls last). Each item carries enabled_from_global / enabled_from_organization / enabled_from_project flags, resolved inclusive of higher scope levels for the organization and project in scope. Policies with no activation are still returned with all flags false. This is a single pre-sorted read-model — the client renders it as-is, with no merge or sort. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `policy_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/policies/configuration/sensitive-data — List sensitive-data posture policies with the customer's enablement state

**Endpoint**: `GET /v1/posture-management/policies/configuration/sensitive-data`
**Summary**: List sensitive-data posture policies with the customer's enablement state
**Tags**: posture-management

Return the posture policy catalog narrowed to the Sensitive Data page's policy-type family (jupyter_notebook_configuration_policy, dataset_configuration_policy, sensitive_data_policy) merged with the token customer's per-scope enablement state, ordered ascending by the visible policy label (display_name, nulls last) across the whole merged list. The server owns the type family, so clients need one call and no per-type merge or re-sort. Item shape and semantics are identical to listPosturePolicyConfiguration. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/policies/{policy_name} — Delete a posture management policy activation for a customer

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/policies/{policy_name}`
**Summary**: Delete a posture management policy activation for a customer
**Tags**: posture-management

Deactivate a posture management policy for a customer. Supply organization_id or project_id to remove the activation only at that scope; omit both to remove the customer-level activation. Returns the remaining active policies after deletion. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy activation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups — List active posture management policy groups for a customer

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups`
**Summary**: List active posture management policy groups for a customer
**Tags**: posture-management

Return all posture management policy groups currently activated for a customer, including the scope at which each was enabled. Filter by organization_id or project_id to narrow to a specific organizational unit. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/policy-groups — Add Policy Groups for a Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/policy-groups`
**Summary**: Add Policy Groups for a Customer
**Tags**: posture-management

Activate one or more posture management policy groups for a customer, enabling all policies within each group. By default activated at the customer level. Supply organization_id or project_id to limit the activation scope. Returns the newly activated policy groups. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): Optional. If provided, the policy groups will only be activated for this specific organization.
- `project_id` (query, optional): Optional. If provided, the policy groups will only be activated for this specific project.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name} — Delete a policy group activation for a customer

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}`
**Summary**: Delete a policy group activation for a customer
**Tags**: posture-management

Deactivate a posture management policy group for a customer. Supply organization_id or project_id to remove the activation only at that scope; omit both to remove the customer-level activation. Returns the remaining active policy groups after deletion. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy group activation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/component-based-policies/configurable-inputs — List component-based policies + their configurable inputs by resource type and/or policy

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/component-based-policies/configurable-inputs`
**Summary**: List component-based policies + their configurable inputs by resource type and/or policy
**Tags**: posture-management

Return every component-based posture policy matching the supplied selectors, along with the configurable input parameters each policy exposes for customer tuning and an optional human-readable ``summary_template``. Filter by any combination of ``resource_type`` (policies binding that type), ``policy_type``, and ``policy_name`` — at least one selector is required and they AND-compose. Use this to discover which policies can be customized before upserting per-resource or customer-wide policy config overrides.

**Parameters**:
- `customer_id` (path, required): 
- `resource_type` (query, optional): Optional resource-type selector. When set, returns every component-based policy whose ``bound_resource_types`` includes this value. AND-composed with ``policy_type`` / ``policy_name``.
- `policy_type` (query, optional): Optional policy-type selector (e.g. ``mcp_configuration_policy``). When set, returns only policies of this type.
- `policy_name` (query, optional): Optional exact policy_name selector (e.g. ``mcp.tool_overexposure_v1``). When set, returns only that policy.
- `organization_id` (query, optional): Optional scope: resolve each policy's effective config as a scan scoped to this organization would. Mutually exclusive with ``project_id``; omit both for all-orgs.
- `project_id` (query, optional): Optional scope: resolve each policy's effective config as a scan scoped to this project would. Mutually exclusive with ``organization_id``; omit both for all-orgs.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs — List per-resource configurable-input overrides (paginated)

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs`
**Summary**: List per-resource configurable-input overrides (paginated)
**Tags**: posture-management

Return a paginated list of per-resource policy configuration overrides for a customer. Each override customizes the configurable inputs of a component-based policy for a specific resource instance. Filter by policy_name to narrow to a single policy, or by resource_type to narrow to resources of that type. Supports page/per_page pagination. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (query, optional): Optional. Filter to a single component-based policy.
- `resource_type` (query, optional): Optional. Filter to overrides anchored to resources of this type. Joined through ``resource_instance.resource_type``.
- `per_page` (query, optional): 
- `page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name} — Get a single per-resource configurable-input override

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name}`
**Summary**: Get a single per-resource configurable-input override
**Tags**: posture-management

Return the configurable-input override for a specific resource instance and policy combination. Returns the stored config_overrides dict applied on top of policy defaults for this resource. Returns 404 if no override has been set for this pair. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `policy_name` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource policy config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name} — Upsert a per-resource configurable-input override

**Endpoint**: `PUT /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name}`
**Summary**: Upsert a per-resource configurable-input override
**Tags**: posture-management

Create or replace the configurable-input override for a specific resource instance and component-based policy. The supplied config_overrides are merged on top of policy defaults at scan time, allowing per-resource tuning (e.g. custom thresholds or allow-lists). Use listPostureComponentPolicyInputs to discover which inputs a policy accepts. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `policy_name` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource instance or policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name} — Delete a per-resource configurable-input override (idempotent)

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/component-based-policies/resource-policy-configs/{resource_instance_id}/{policy_name}`
**Summary**: Delete a per-resource configurable-input override (idempotent)
**Tags**: posture-management

Remove the per-resource configurable-input override for a specific resource instance and policy, reverting to the customer-wide or policy-default configuration at next scan. Idempotent — returns 204 even when no override exists. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `policy_name` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs — List customer-wide configurable-input overrides (paginated)

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs`
**Summary**: List customer-wide configurable-input overrides (paginated)
**Tags**: posture-management

Return a paginated list of customer-wide policy configuration overrides. Unlike per-resource overrides, these apply to all resources of the relevant type unless a more specific per-resource override exists. Filter by policy_name, organization_id, or project_id to narrow results. Supports page/per_page pagination. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (query, optional): Optional. Filter to a single component-based policy.
- `organization_id` (query, optional): Optional. Filter to overrides scoped to this organization. Mutually exclusive with ``project_id`` — supplying both returns 400 (the underlying table forbids both-set rows). Omit to include every scope.
- `project_id` (query, optional): Optional. Filter to overrides scoped to this project. Mutually exclusive with ``organization_id`` — supplying both returns 400. Omit to include every scope.
- `per_page` (query, optional): 
- `page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name} — Get a single customer-wide configurable-input override

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name}`
**Summary**: Get a single customer-wide configurable-input override
**Tags**: posture-management

Return the customer-wide configurable-input override for a specific component-based policy. Optionally narrow to an organization or project scope via query params. Returns 404 if no override has been set at the requested scope. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (path, required): 
- `organization_id` (query, optional): Optional. Narrow to the override scoped to this organization. Omit to fetch the tenant-wide row.
- `project_id` (query, optional): Optional. Narrow to the override scoped to this project. Omit to fetch the tenant-wide row.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer policy config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name} — Upsert a customer-wide configurable-input override

**Endpoint**: `PUT /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name}`
**Summary**: Upsert a customer-wide configurable-input override
**Tags**: posture-management

Create or replace a customer-wide configurable-input override for a component-based policy. The override applies to all resources (unless a per-resource override takes precedence) at the specified scope (organization_id, project_id, or tenant-wide). Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name} — Delete (revert) a customer-wide configurable-input override at a scope

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/component-based-policies/customer-policy-configs/{policy_name}`
**Summary**: Delete (revert) a customer-wide configurable-input override at a scope
**Tags**: posture-management

Delete this scope's override row so the scope re-inherits from its parent
(or the policy defaults). Idempotent — a no-op (still 204) when no row
exists at the scope, so a double-clicked revert can't error. Pair with
``configurable-inputs``'s ``inherited_config`` to refresh the UI in one
request.

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (path, required): 
- `organization_id` (query, optional): Optional. Revert the override scoped to this organization. Mutually exclusive with ``project_id`` (400 if both set). Omit both to revert the all-orgs / tenant-wide override.
- `project_id` (query, optional): Optional. Revert the override scoped to this project. Mutually exclusive with ``organization_id`` (400 if both set). Omit both to revert the all-orgs / tenant-wide override.

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/issues/{issue_id}/evidence-tree — Get the materialized evidence-tree snapshot for an agentic issue

**Endpoint**: `GET /v1/posture-management/issues/{issue_id}/evidence-tree`
**Summary**: Get the materialized evidence-tree snapshot for an agentic issue
**Tags**: posture-management

Return the JSON evidence-tree for the specified agentic posture issue, representing the chain of findings and sub-checks that contributed to the issue. Returns 404 when the issue does not exist, belongs to a different tenant, or was created before evidence trees were captured.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue or evidence tree not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/issues/{issue_id}/component-engine/info — Get the Info-tab payload for a sensitive-data posture finding

**Endpoint**: `GET /v1/posture-management/issues/{issue_id}/component-engine/info`
**Summary**: Get the Info-tab payload for a sensitive-data posture finding
**Tags**: posture-management

Return the full Info-tab payload for a sensitive-data posture finding (shown in the sensitive-data issue drawer), including policy identity, severity, AI-generated summary and evidence, impact assessment, bound resource details, contributing resources, matched-condition display names, and sensitive-data blast-radius aggregates. The payload is the sensitive-data projection of a component-engine finding — today every finding routed here is sensitive-data. Returns 404 when the issue is not a component-engine finding or belongs to a different tenant.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found or not a component-engine finding
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/issues/{issue_id}/component-engine/remediation — Get the Remediation-tab payload for a component-engine finding

**Endpoint**: `GET /v1/posture-management/issues/{issue_id}/component-engine/remediation`
**Summary**: Get the Remediation-tab payload for a component-engine finding
**Tags**: posture-management

Return the Remediation-tab payload for a component-engine posture finding, including the AI-generated per-finding recommendation and the policy's authored remediation steps. Returns 404 when the issue does not exist, is not a component-engine finding, or belongs to a different tenant.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found or not a component-engine finding
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/agentic/issues/{issue_id} — Get the Info-tab payload for an agentic posture finding

**Endpoint**: `GET /v1/posture-management/agentic/issues/{issue_id}`
**Summary**: Get the Info-tab payload for an agentic posture finding
**Tags**: posture-management

Return the full payload for an agentic posture finding — shown in the agentic issue drawer's Info tab. Includes policy identity, severity, status, the AI-generated Summary / Evidence / Impact assessment, the bound resource, contributing resources, and matched-condition display names. Returns 404 if the issue does not exist or belongs to a different tenant.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found or belongs to a different tenant.
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/compliance — Get compliance summary for all posture policy groups for a customer

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/compliance`
**Summary**: Get compliance summary for all posture policy groups for a customer
**Tags**: posture-management

Return a compliance summary for every posture policy group enabled for the customer, keyed by policy group name. Each summary includes pass/fail counts and an overall compliance score. Filter by organization_id or project_id to scope the result to a specific organizational unit.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/posture-overtime — Get daily posture compliance score history for a policy group

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/posture-overtime`
**Summary**: Get daily posture compliance score history for a policy group
**Tags**: posture-management

Return daily posture compliance scores over time for a specific policy group, enabling trend analysis of the customer's security posture. Use start_date and end_date to bound the date range. Filter by organization_id or project_id to narrow scope.

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy group not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/compliance — Get latest scan compliance result for a specific posture policy group

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/compliance`
**Summary**: Get latest scan compliance result for a specific posture policy group
**Tags**: posture-management

Return the most recent scan compliance result for a single posture policy group, including per-policy pass/fail values. Use this to inspect the current compliance posture for a specific policy group such as 'NIST AI RMF' or 'OWASP LLM'. Filter by organization_id or project_id to narrow scope.

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy group not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/last_scan_time — Get Customer Policy Group Last Scan Time

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/last_scan_time`
**Summary**: Get Customer Policy Group Last Scan Time
**Tags**: posture-management

Get posture management policy group last scan time for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/cloud-configuration/policies — List all cloud configuration policies

**Endpoint**: `GET /v1/posture-management/cloud-configuration/policies`
**Summary**: List all cloud configuration policies
**Tags**: posture-management

Return the full catalog of cloud configuration policies (cloud misconfig checks). This endpoint is platform-wide with no customer scoping — use it to discover which cloud configuration policies exist before triggering a misconfiguration scan.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/posture-management/cloud-configuration/policies/{cloud_provider} — List cloud configuration policies for a specific cloud provider

**Endpoint**: `GET /v1/posture-management/cloud-configuration/policies/{cloud_provider}`
**Summary**: List cloud configuration policies for a specific cloud provider
**Tags**: posture-management

Return the cloud configuration policies applicable to a specific cloud provider (e.g. AWS, GCP, Azure). This endpoint is platform-wide with no customer scoping. Use to discover which misconfiguration checks are available for a given cloud provider before triggering a scan.

**Parameters**:
- `cloud_provider` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Cloud provider not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/cloud-configuration/check-policies — Trigger a cloud misconfiguration posture scan for a customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/cloud-configuration/check-policies`
**Summary**: Trigger a cloud misconfiguration posture scan for a customer
**Tags**: posture-management

Enqueue an asynchronous cloud misconfiguration scan for the customer. The scan evaluates cloud configuration policies against the customer's discovered cloud resources and creates posture issues for any violations. Returns a job_id that can be polled for status. Requires a user-bound token (M2M tokens are rejected). Scoped to the token's customer.

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

## POST /v1/posture-management/agentic-scanning/check-policies — Trigger an agentic posture scan for the authenticated customer

**Endpoint**: `POST /v1/posture-management/agentic-scanning/check-policies`
**Summary**: Trigger an agentic posture scan for the authenticated customer
**Tags**: posture-management

Enqueue an asynchronous agentic posture scan for the token's customer. The scan evaluates agentic policies against customer resources and creates posture issues for violations. Optionally narrow the scan to a specific resource_instance_id, organization, or project. Set allow_partial_success=true to persist findings even if some resources fail. Returns a job_id for status polling. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): If true, will create agentic resource issues even if some resources fail to scan. If false (default) - will only create issues if all resources are scanned successfully.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/component-based-scanning/check-policies — Trigger a component-based posture scan for the authenticated customer

**Endpoint**: `POST /v1/posture-management/component-based-scanning/check-policies`
**Summary**: Trigger a component-based posture scan for the authenticated customer
**Tags**: posture-management

Enqueue an asynchronous component-based posture scan for the token's customer. Returns a job_id that can be polled for status. Optionally narrow the scan to a single resource_type, a specific resource_instance_id, or a named policy_name. Component-based scans run only the modern engine; the legacy agentic dispatch path is not triggered.

**Parameters**:
- `resource_type` (query, optional): Optional. Restrict the scan to resources of this `resource_type` (e.g. `CopilotStudioAgent`). When set, only policies whose `bound_resource_types` includes this type run; other enabled component-based policies are skipped for this invocation.
- `policy_name` (query, optional): Optional. Single-policy convenience knob — fires only this component-based policy. Equivalent to passing ``policy_names=[policy_name]`` in the body. Cannot be combined with ``body.policy_names``; supplying both is rejected with 400 to avoid ambiguity. Useful for the FE's per-row 're-check this policy' affordance.
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): Controls per-policy failure isolation in the dispatch loop. When ``true`` (lenient), a raising policy is logged and the scan continues with the rest of the enabled component-based policies; findings from the policies that succeeded are persisted. When ``false`` (default, strict), the first per-policy raise is logged and re-raised so the scan transitions to FAILED and no partial findings are persisted. NOTE: persistence itself is incremental (``add_agentic_issue_creates_to_database`` opens a session per finding, mirroring the legacy path) so ``false`` does not provide a true transactional all-or-nothing guarantee if a failure happens AFTER dispatch returns; the flag's effect is scoped to the evaluator stage.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/dataset-scanning/check-policies — Trigger a sensitive-data posture scan for a customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/dataset-scanning/check-policies`
**Summary**: Trigger a sensitive-data posture scan for a customer
**Tags**: posture-management

Enqueue an asynchronous sensitive-data posture scan for the customer. The scan dispatches the customer's enabled sensitive-data component-based policies and creates posture issues for findings. Optionally scope to a specific resource_instance_id or org/project, or narrow to specific policy names via policies_to_scan. The deprecated legacy dataset content scan no longer runs on this endpoint. Returns a job_id for polling. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): Controls per-policy failure isolation in the engine dispatch loop. When true (lenient), a raising policy is logged and the scan continues with the remaining enabled sensitive-data policies. When false (default, strict), the first per-policy raise fails the scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/trigger-scan — Trigger dataset scanning and return created scan jobs

**Endpoint**: `POST /v1/posture-management/dataset-scanning/trigger-scan`
**Summary**: Trigger dataset scanning and return created scan jobs
**Tags**: posture-management

Create dataset scanning jobs for the token's customer and flush them to the scan processing queue. Unlike the check-policies endpoint, this returns full job queue details for each created scan job. Scope to a specific resource_instance_id, organization, or project as needed. Set skip_unchanged_resources=true to skip unmodified datasets. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/update-job-results — Update Dataset Scanning Job Queue Results

**Endpoint**: `POST /v1/posture-management/dataset-scanning/update-job-results`
**Summary**: Update Dataset Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Dataset Scanning Job in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/mark-job-failed — Mark Dataset Job As Failed

**Endpoint**: `POST /v1/posture-management/dataset-scanning/mark-job-failed`
**Summary**: Mark Dataset Job As Failed
**Tags**: posture-management, internal

Mark the dataset scanning job as failed in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/resource-hashing/check-policies — Trigger a resource version-hash posture scan

**Endpoint**: `POST /v1/posture-management/resource-hashing/check-policies`
**Summary**: Trigger a resource version-hash posture scan
**Tags**: posture-management

Enqueue an asynchronous resource version-hash scan for the token's customer. The scan computes hashes of resource versions and evaluates them against policy rules, creating posture issues for any violations. Optionally scope to a specific resource_instance_id, organization, or project. Returns a job_id for polling scan status. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
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

## GET /v1/posture-management/resource-hashing/hashed-versions — List resource instance hash versions for a customer

**Endpoint**: `GET /v1/posture-management/resource-hashing/hashed-versions`
**Summary**: List resource instance hash versions for a customer
**Tags**: posture-management

Return all tracked hash versions for the token's customer's resource instances. Optionally filter to a single resource_instance_id. Each entry records the hash of a resource version, whether it has been marked safe, and who marked it. Use to review version integrity state before triggering a resource-hash scan. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/resource-hashing/mark-safe — Mark a resource version hash as safe

**Endpoint**: `POST /v1/posture-management/resource-hashing/mark-safe`
**Summary**: Mark a resource version hash as safe
**Tags**: posture-management

Mark a specific version of a resource instance as safe, recording the caller's email as the approver. Once marked safe, the version no longer generates posture issues on subsequent hash scans. Use listResourceHashVersions to find version_id values. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, required): 
- `version_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/model-scanning/check-policies — Scan Customers Models For Issues

**Endpoint**: `POST /v1/posture-management/model-scanning/check-policies`
**Summary**: Scan Customers Models For Issues
**Tags**: posture-management

Scan a customer's models for issues

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/model-scanning/check-policies — Scan Customers Models For Issues

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/model-scanning/check-policies`
**Summary**: Scan Customers Models For Issues
**Tags**: posture-management

Scan a customer's models for issues

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/model-scanning/trigger-scan — Trigger model scanning and return created scan jobs

**Endpoint**: `POST /v1/posture-management/model-scanning/trigger-scan`
**Summary**: Trigger model scanning and return created scan jobs
**Tags**: posture-management

Create model scanning jobs for the token's customer and flush them to the scan processing queue. Returns full job queue details for each created scan job. Optionally scope to a specific resource_instance_id, organization, or project. Set skip_unchanged_resources=true to skip models that have not changed since the last scan. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/notebook-scanning/trigger-scan — Trigger Jupyter notebook scanning and return created scan jobs

**Endpoint**: `POST /v1/posture-management/notebook-scanning/trigger-scan`
**Summary**: Trigger Jupyter notebook scanning and return created scan jobs
**Tags**: posture-management

Create Jupyter notebook scanning jobs for the token's customer and flush them to the scan processing queue. Returns full job queue details for each created scan job. Optionally scope to a specific resource_instance_id, organization, or project. Set skip_unchanged_resources=true to skip notebooks that have not changed since the last scan. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/cve/populate-cve — Populate CVE data for a customer's library inventory

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/cve/populate-cve`
**Summary**: Populate CVE data for a customer's library inventory
**Tags**: posture-management

Fetch and store CVE (Common Vulnerabilities and Exposures) data for all libraries in the customer's AI inventory. Returns the list of CVE records created or updated. Use to refresh vulnerability data before running a CVE posture check. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/heatmap — Get posture compliance heatmap for a customer

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/heatmap`
**Summary**: Get posture compliance heatmap for a customer
**Tags**: posture-management

Return a two-dimensional compliance heatmap keyed by organization and policy group name. Each cell contains the compliance summary (pass/fail counts and score) for that organization × policy group combination, or null when no scan data exists. Optionally filter to a specific project or organization. Use to surface a quick visual overview of posture compliance across the tenant. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/posture-management/hugging-face-model-card/customer/{customer_id}/resource/{resource_instance_id} — Get the Hugging Face model card for a resource instance

**Endpoint**: `GET /v1/posture-management/hugging-face-model-card/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Get the Hugging Face model card for a resource instance
**Tags**: posture-management

Return the Hugging Face model card for the specified resource instance, including the model name, license, library name, tags, and the raw model card text. card_exists is false when the model has no card on Hugging Face. Returns 404 when the resource does not exist or is not a Hugging Face model. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource instance or model card not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/posture-management/scan-executions/{scan_execution_id} — Delete Posture Management Scan Execution

**Endpoint**: `DELETE /v1/posture-management/scan-executions/{scan_execution_id}`
**Summary**: Delete Posture Management Scan Execution
**Tags**: posture-management

**Parameters**:
- `scan_execution_id` (path, required): 
- `customer_id` (query, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/scan-executions/bulk-delete — Bulk delete posture management scan execution records

**Endpoint**: `POST /v1/posture-management/scan-executions/bulk-delete`
**Summary**: Bulk delete posture management scan execution records
**Tags**: posture-management

Permanently delete multiple posture management scan execution records in one call. Returns a response indicating which scans were successfully deleted and which failed. Returns 207 when some deletions fail, 400 when all fail, and 200 when all succeed. Scoped to the token's customer. This is a destructive irreversible operation.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `207`: Partial success — some scans were deleted and some failed
- `400`: Invalid request parameters or all deletions failed
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/whitelist-findings — Whitelist Jupyter Notebook Findings

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/whitelist-findings`
**Summary**: Whitelist Jupyter Notebook Findings
**Tags**: posture-management

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, required): 
- `issue_id` (query, required): 
- `hash` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/dataset-scanning/whitelist-findings — Whitelist Dataset Findings

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/dataset-scanning/whitelist-findings`
**Summary**: Whitelist Dataset Findings
**Tags**: posture-management

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, required): 
- `issue_id` (query, required): 
- `hash` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/issue-policy — Upsert all issue policies for the customer

**Endpoint**: `PATCH /v1/issue-policy`
**Summary**: Upsert all issue policies for the customer
**Tags**: posture-management

Create or update the full set of issue policies for the token's customer in one call. Each policy controls how a posture issue category is handled — for example its severity override, suppression rules, or remediation SLA. Only the issue types included in the request body are written; omitted categories are left unchanged. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/issue-policy — Reset all issue policies to platform defaults

**Endpoint**: `DELETE /v1/issue-policy`
**Summary**: Reset all issue policies to platform defaults
**Tags**: posture-management

Delete all customer-defined issue policies for the token's customer, restoring every posture issue category to the platform default behavior. This is a bulk-reset operation — all custom severity overrides, suppression rules, and remediation SLAs are removed. Scoped to the token's customer.

**Parameters**:
- `issue_type` (query, optional): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/issue-policy — Get all issue policies for the customer

**Endpoint**: `GET /v1/issue-policy`
**Summary**: Get all issue policies for the customer
**Tags**: posture-management

Return all posture issue policies configured for the token's customer, covering every issue category. For categories where the customer has not set a custom policy, the platform default policy is returned. Use this to inspect the full set of severity overrides, suppression rules, and remediation SLAs in effect. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PATCH /v1/issue-policy/issue-type/{issue_type} — Upsert the issue policy for one category

**Endpoint**: `PATCH /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Upsert the issue policy for one category
**Tags**: posture-management

Create or update the issue policy for a single posture issue category (identified by issue_type) for the token's customer. Use this for targeted updates to one category without affecting other categories. Returns the updated policy. Scoped to the token's customer.

**Parameters**:
- `issue_type` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/issue-policy/issue-type/{issue_type} — Reset the issue policy for one category to default

**Endpoint**: `DELETE /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Reset the issue policy for one category to default
**Tags**: posture-management

Delete the customer-defined issue policy for the specified posture issue category, restoring that category to the platform default behavior. Use when a previous override is no longer needed and the default policy should apply. Scoped to the token's customer.

**Parameters**:
- `issue_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/issue-policy/issue-type/{issue_type} — Get the issue policy for a specific category

**Endpoint**: `GET /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Get the issue policy for a specific category
**Tags**: posture-management

Return the posture issue policy for the specified issue category for the token's customer. If the customer has not configured a custom policy for this category, the platform default policy is returned. Use to inspect or compare the policy for a single category before making targeted updates. Scoped to the token's customer.

**Parameters**:
- `issue_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/issue-policy/customer/{customer_id}/issue_policy — Create or update issue policies for the customer

**Endpoint**: `PATCH /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Create or update issue policies for the customer
**Tags**: posture-management

Creates or updates multiple issue policies for a customer. If an IssueType is not sent, it will NOT
update that resource category.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy/customer/{customer_id}/issue_policy — Resets the issue policies for a customer

**Endpoint**: `DELETE /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Resets the issue policies for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `customer_id` (path, required): 
- `issue_type` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy/customer/{customer_id}/issue_policy — Get the issue policy for the customer

**Endpoint**: `GET /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Get the issue policy for the customer
**Tags**: posture-management

Gets all the current customers issue policies.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Create or update a issue policy for the customer on a particular category

**Endpoint**: `PATCH /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Create or update a issue policy for the customer on a particular category
**Tags**: posture-management

Creates or updates the issue policy for a customer on a particular category.

**Parameters**:
- `issue_type` (path, required): 
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Resets the issue policy for a customer

**Endpoint**: `DELETE /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Resets the issue policy for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `customer_id` (path, required): 
- `issue_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Get the issue policy for the customer on a particular category

**Endpoint**: `GET /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Get the issue policy for the customer on a particular category
**Tags**: posture-management

Gets the current customer's issue policy for a particular category.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Parameters**:
- `issue_type` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/shadow-ai/issue-policy — Get the current shadow AI issue policy

**Endpoint**: `GET /v1/shadow-ai/issue-policy`
**Summary**: Get the current shadow AI issue policy
**Tags**: posture-management

Return the shadow AI issue policy currently active for the token's customer, including the policy scope (ALL_INVENTORY, FUTURE_INVENTORY, AFTER_INITIAL, or NEVER), the list of enabled issue types, and the grace period in days. If no policy has been explicitly configured, the platform default is returned. Use to inspect how the tenant is set up to detect and flag ungoverned AI resources before adjusting thresholds or scope. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PUT /v1/shadow-ai/issue-policy — Create or update the shadow AI issue policy

**Endpoint**: `PUT /v1/shadow-ai/issue-policy`
**Summary**: Create or update the shadow AI issue policy
**Tags**: posture-management

Persist the shadow AI issue policy for the token's customer, controlling which resources trigger shadow AI issues and when. The policy determines the scope (ALL_INVENTORY, FUTURE_INVENTORY, AFTER_INITIAL, or NEVER), which optional issue types are enabled (e.g. unreviewed, unassigned), and the grace period in days before an issue is raised. Issue generation itself runs asynchronously in a periodic ETL job — this endpoint only saves the configuration. Use to tune how aggressively the platform flags ungoverned AI resources for the tenant. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/posture-management/incidents — Create a new posture incident with linked issues

**Endpoint**: `POST /v2/posture-management/incidents`
**Summary**: Create a new posture incident with linked issues
**Tags**: posture-management

Create a posture incident for the token's customer. The assignee is specified as an internal user_id. Optionally link posture issue IDs on creation. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/incidents — List posture incidents for the authenticated customer

**Endpoint**: `GET /v2/posture-management/incidents`
**Summary**: List posture incidents for the authenticated customer
**Tags**: posture-management

Return a page of posture incidents belonging to the token's customer, each with their associated issues. Filter by project_id or organization_id; when project_id is provided, organization_id is ignored. Results are page-based (page/per_page) and ordered by creation time, newest first; the response carries the total match count in its pagination envelope.

**Parameters**:
- `project_id` (query, optional): 
- `organization_id` (query, optional): 
- `page` (query, optional): Page number (1-based).
- `per_page` (query, optional): Results per page.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/incidents/{incident_id} — Get a single posture incident with its associated issues

**Endpoint**: `GET /v2/posture-management/incidents/{incident_id}`
**Summary**: Get a single posture incident with its associated issues
**Tags**: posture-management

Return the full detail of one posture incident — status, severity, assignee (internal user_id), timestamps, and the list of linked posture issues. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/incidents/{incident_id} — Update metadata fields on a posture incident

**Endpoint**: `PATCH /v2/posture-management/incidents/{incident_id}`
**Summary**: Update metadata fields on a posture incident
**Tags**: posture-management

Update editable metadata — title, description, severity, assignee (internal user_id), workflow, or due date — on a posture incident. Lifecycle status is not changed here; use ``PATCH /v2/posture-management/incidents/{incident_id}/status`` to transition status. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/posture-management/incidents/{incident_id} — Delete a posture incident

**Endpoint**: `DELETE /v2/posture-management/incidents/{incident_id}`
**Summary**: Delete a posture incident
**Tags**: posture-management

Soft-delete a posture incident by transitioning it to DELETED. Scoped to the token's customer; returns 404 when the incident does not exist or belongs to a different tenant.

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/incidents/{incident_id}/status — Transition the status of a posture incident

**Endpoint**: `PATCH /v2/posture-management/incidents/{incident_id}/status`
**Summary**: Transition the status of a posture incident
**Tags**: posture-management

Update the lifecycle status of a posture incident. Closing an incident requires a comment. Scoped to the token's customer.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/incidents/{incident_id}/assign — Assign a posture incident to a user

**Endpoint**: `PATCH /v2/posture-management/incidents/{incident_id}/assign`
**Summary**: Assign a posture incident to a user
**Tags**: posture-management

Set or change the assignee of a posture incident by internal user_id. Scoped to the token's customer.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/incidents/{incident_id}/update-issues — Link one or more posture issues to an incident

**Endpoint**: `PATCH /v2/posture-management/incidents/{incident_id}/update-issues`
**Summary**: Link one or more posture issues to an incident
**Tags**: posture-management

Associate a list of posture issue IDs with the incident and return the updated incident with its full issue set. Scoped to the token's customer.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/incidents/{incident_id}/delete-issues — Unlink one or more posture issues from an incident

**Endpoint**: `PATCH /v2/posture-management/incidents/{incident_id}/delete-issues`
**Summary**: Unlink one or more posture issues from an incident
**Tags**: posture-management

Remove the association between a list of posture issue IDs and the incident and return the updated incident with its remaining issue set. Scoped to the token's customer.

**Parameters**:
- `incident_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/issue — Update status, severity, assignee, or triage state of a single issue

**Endpoint**: `PATCH /v2/posture-management/issue`
**Summary**: Update status, severity, assignee, or triage state of a single issue
**Tags**: posture-management

Modify fields on a single posture finding — status, severity, assignee (internal user_id), or in-progress flag — scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/posture-management/issues — Bulk-update status, severity, or assignee on multiple issues

**Endpoint**: `PATCH /v2/posture-management/issues`
**Summary**: Bulk-update status, severity, or assignee on multiple issues
**Tags**: posture-management

Apply the same field changes — status, severity, assignee (internal user_id), in-progress flag — to a list of posture issue IDs in one request. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/update-job-results — Update Model Scanning Job Queue Results

**Endpoint**: `POST /v2/posture-management/model-scanning/update-job-results`
**Summary**: Update Model Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Model Scanning Job in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/mark-job-failed — Mark Model Scanning Job As Failed

**Endpoint**: `POST /v2/posture-management/model-scanning/mark-job-failed`
**Summary**: Mark Model Scanning Job As Failed
**Tags**: posture-management, internal

Mark the Model Scanning Job as failed in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/flush-job-queue — Flush Model Scan Job Queue

**Endpoint**: `POST /v2/posture-management/model-scanning/flush-job-queue`
**Summary**: Flush Model Scan Job Queue
**Tags**: posture-management, internal

Flush the Model Scan Job Queue, processing pending jobs and the jobs up for retry.

If `scan_id` is provided, only jobs related to scan id will be marked processed.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/expire-jobs — Expire Jobs In Job Queue

**Endpoint**: `POST /v2/posture-management/model-scanning/expire-jobs`
**Summary**: Expire Jobs In Job Queue
**Tags**: posture-management, internal

Expire stale model scan jobs in the job queue.

If `scan_id` is provided, only jobs related to scan id will be marked expired.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/model-scanning/post-process-expired-jobs — Post Process Expired Jobs

**Endpoint**: `GET /v2/posture-management/model-scanning/post-process-expired-jobs`
**Summary**: Post Process Expired Jobs
**Tags**: posture-management, internal

Triggers post processing steps for expired model scanning jobs.
All the jobs in job queue must be in FAILED or SUCCESS state in order for post processing to be triggered.

**Responses**:
- `204`: Successful Response

---

## POST /v2/posture-management/notebook-scanning/update-job-results — Update Notebook Scanning Job Queue Results

**Endpoint**: `POST /v2/posture-management/notebook-scanning/update-job-results`
**Summary**: Update Notebook Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Notebook Scanning Job in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/mark-job-failed — Mark Notebook Scan Job As Failed

**Endpoint**: `POST /v2/posture-management/notebook-scanning/mark-job-failed`
**Summary**: Mark Notebook Scan Job As Failed
**Tags**: posture-management, internal

Mark the Notebook Scanning Job as failed in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/flush-job-queue — Flush Notebook Scan Job Queue

**Endpoint**: `POST /v2/posture-management/notebook-scanning/flush-job-queue`
**Summary**: Flush Notebook Scan Job Queue
**Tags**: posture-management, internal

Flush the Notebook Scan Job Queue, processing pending jobs and the jobs up for retry.
If `scan_id` is provided, only jobs related to scan id will be marked processed.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/expire-jobs — Expire Jobs In Job Queue

**Endpoint**: `POST /v2/posture-management/notebook-scanning/expire-jobs`
**Summary**: Expire Jobs In Job Queue
**Tags**: posture-management, internal

Expire stale notebook scan jobs in the job queue.
If `scan_id` is provided, only jobs related to scan id will be marked expired.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/notebook-scanning/post-process-expired-jobs — Post Process Expired Jobs

**Endpoint**: `GET /v2/posture-management/notebook-scanning/post-process-expired-jobs`
**Summary**: Post Process Expired Jobs
**Tags**: posture-management, internal

Triggers post processing steps for expired notebook scanning jobs.
All the jobs in job queue must be in FAILED or SUCCESS state in order for post processing to be triggered.

**Responses**:
- `204`: Successful Response

---
