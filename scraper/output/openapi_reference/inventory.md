# inventory API Endpoints

## GET /v1/inventory/resources/agent-manifest/{resource_instance_id} — Get the Agent Manifest for a discovered agent

**Endpoint**: `GET /v1/inventory/resources/agent-manifest/{resource_instance_id}`
**Summary**: Get the Agent Manifest for a discovered agent
**Tags**: inventory

Return the governance manifest for an agent in AI Inventory: the customer-approved layer (owners, approved purpose, data boundaries, behavioral constraints, runtime-identity expectations) combined with a live observed summary (connected tool/MCP-server counts and drift indicators) and a completion meter. Observed values are read live from inventory on every call — newly discovered resources appear automatically. An agent that has never been edited returns governance status NOT_STARTED with empty approved sections. Returns 404 if the resource does not exist or is not an agent. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory/resources/agent-manifest/{resource_instance_id} — Update an agent's manifest governance fields

**Endpoint**: `PATCH /v1/inventory/resources/agent-manifest/{resource_instance_id}`
**Summary**: Update an agent's manifest governance fields
**Tags**: inventory

Apply a partial update to the simple (header) governance fields of an agent's manifest: ownership, approved purpose, free-text data-boundary, governance notes, and runtime-identity expectations. Only fields present in the body are touched; a field sent as `null` clears the stored value, while an omitted field is left unchanged. Saving the first change materialises the manifest and moves its status from NOT_STARTED to DRAFT. Each changed field is recorded in the manifest's change history. The structured governance collections (per-tool reviews, approved-entry allowlists, behavioral constraints) and lifecycle transitions are not edited here. Returns the full recomputed manifest detail. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools — List tools and MCP servers for an agent's manifest review

**Endpoint**: `GET /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools`
**Summary**: List tools and MCP servers for an agent's manifest review
**Tags**: inventory

List of the tools and MCP servers associated with the agent, combining the live observed set, the member MCP servers fronted by the manifest's declared VMCPs (tagged with `via_vmcp` attribution), and any recorded review decisions. Includes capability classifications where available, per-item drift indicators, and previously approved targets that are no longer observed. Omit `page`/`per_page` to receive the full list in one response (page the section client-side); send either to page server-side. `search` matches substrings of the display name and tool name; `archetype` filters to tools or MCP servers. `source` is a multi-select facet (repeat the param) — a row matches if ANY of its applicable sources is requested; the six values are independent, not mutually exclusive (a directly-attached managed-platform tool is both DIRECTLY_ASSIGNED and MANAGED_PLATFORM). Values: DIRECTLY_ASSIGNED / MCP_INSPECTION / VMCP_IMPORT / MANAGED_PLATFORM / CODE_SCANNING / MANUALLY_ENTERED. When `source=VMCP_IMPORT`, `source_vmcp_resource_instance_id` narrows to a single declared VMCP's members. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `page` (query, optional): 
- `per_page` (query, optional): 
- `search` (query, optional): 
- `archetype` (query, optional): 
- `source` (query, optional): 
- `source_vmcp_resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools/{target_resource_instance_id}/review — Record a tool/MCP-server review decision for an agent

**Endpoint**: `PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools/{target_resource_instance_id}/review`
**Summary**: Record a tool/MCP-server review decision for an agent
**Tags**: inventory

Upsert the per-agent governance review for one tool or MCP server: the approval decision (APPROVED / NOT_APPROVED / NEEDS_REVIEW / ...) plus optional notes. The reviewer identity, the tool's capability classification at review time, and the MCP continuity key are captured server-side, so a later change to the tool's definition surfaces as capability drift. The target must be a tool or MCP server currently connected to the agent, or a member server fronted by one of the manifest's declared VMCPs (400 otherwise). Recording the first review materialises the manifest and moves NOT_STARTED to DRAFT. Returns the updated tool row plus the recomputed governance section (status, version, completion). Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `target_resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Target is not a tool/MCP server connected to the agent
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools/review — Record review decisions for many tools/MCP servers on an agent

**Endpoint**: `PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/tools/review`
**Summary**: Record review decisions for many tools/MCP servers on an agent
**Tags**: inventory

Record the per-agent governance review for a batch of tools or MCP servers in one request and one transaction — the bulk form of the single-tool review, for reviewing many tools at once instead of one call per tool. Each item carries a target plus the approval decision (APPROVED / NOT_APPROVED / NEEDS_REVIEW / ...) and optional notes and sensitivity; the reviewer identity, each tool's capability classification at review time, and the MCP continuity key are captured server-side, so a later change to a tool's definition surfaces as capability drift. All-or-nothing: every target must be a tool or MCP server currently connected to the agent, or a member server fronted by one of the manifest's declared VMCPs — if any target is not reviewable the whole batch is rejected (400) and nothing is written. A target may not repeat within one batch (422). Recording the first review materialises the manifest and moves NOT_STARTED to DRAFT. Returns one updated tool row per reviewed target plus the recomputed governance section (status, version, completion), computed once after all writes. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: One or more targets are not a tool/MCP server connected to the agent (nothing written)
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries — Add an approved-entry allowlist value to an agent's manifest

**Endpoint**: `POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries`
**Summary**: Add an approved-entry allowlist value to an agent's manifest
**Tags**: inventory

Add one value to the manifest's data-boundary allowlist — an approved destination / data source, or a DCE-backed (sensitive/prohibited) data category, selected by `entry_type`. An approved data source can instead be linked to an observed connection via `target_resource_instance_id` (the pick-from-observed path); the resource must be an observed data/knowledge source of the agent and its display name becomes the entry label. The first edit materialises the manifest and moves NOT_STARTED to DRAFT. Returns the full recomputed manifest detail. 409 if the source is already approved (by resource id) or the same (entry_type, value) already exists; 400 if the linked target is not an observed data source; 404 if the resource is missing or not an AGENT archetype. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid linked data source
- `404`: Agent not found
- `409`: Entry already exists
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries/bulk — Add many approved-entry allowlist values to an agent's manifest

**Endpoint**: `POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries/bulk`
**Summary**: Add many approved-entry allowlist values to an agent's manifest
**Tags**: inventory

Add a batch of values to the manifest's data-boundary allowlist in one request and one transaction — the bulk form of the single approved-entry add, for adding many entries at once instead of one call per entry. Each entry is an approved destination / data source or a DCE-backed (sensitive/prohibited) data category selected by `entry_type`, or an approved data source linked to an observed connection via `target_resource_instance_id` (the pick-from-observed path; the resource must be an observed data/knowledge source of the agent and its display name becomes the entry label). All-or-nothing: every entry is validated first — if any entry duplicates an existing one (409, by resource id for a linked source, else by (entry_type, value)) or links a target that is not an observed data source (400), the whole batch is rejected and nothing is written. An entry may not repeat within one batch (422). The first added entry materialises the manifest and moves NOT_STARTED to DRAFT. Returns the full recomputed manifest detail (reflecting every new entry). 404 if the resource is missing or not an AGENT archetype. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: One or more linked targets are not an observed data source (nothing written)
- `404`: Agent not found
- `409`: One or more entries already exist (nothing written)
- `422`: Empty batch, or a duplicate entry within the batch
- `500`: Unexpected server error

---

## DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries/{entry_id} — Remove an approved-entry allowlist value from an agent's manifest

**Endpoint**: `DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/approved-entries/{entry_id}`
**Summary**: Remove an approved-entry allowlist value from an agent's manifest
**Tags**: inventory

Remove one allowlist entry by its id. Returns the full recomputed manifest detail. 404 if the entry does not exist on this agent's manifest. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `entry_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Agent or entry not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/declared-vmcps — Declare a VMCP the agent relies on as its MCP gateway

**Endpoint**: `POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/declared-vmcps`
**Summary**: Declare a VMCP the agent relies on as its MCP gateway
**Tags**: inventory

Add a manual, governance-only declaration that this agent relies on a VMCP as its MCP gateway to downstream MCP servers (v1). It records the relationship in the manifest for the MCP Servers tab; it does not wire the gateway — the customer updates the agent to route through the VMCP in their own application. VMCPs are not part of the observed reachability graph, so a declaration is the only way a VMCP appears on an agent today. The target must be one of the customer's VMCP resources (400 otherwise). The first edit materialises the manifest and moves NOT_STARTED to DRAFT. Returns the full recomputed manifest detail. 409 if the VMCP is already declared; 404 if the resource is missing or not an AGENT archetype. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Target is not a customer VMCP
- `404`: Agent not found
- `409`: VMCP already declared
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/declared-vmcps/{declared_vmcp_id} — Remove a declared VMCP from an agent's manifest

**Endpoint**: `DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/declared-vmcps/{declared_vmcp_id}`
**Summary**: Remove a declared VMCP from an agent's manifest
**Tags**: inventory

Remove one declared-VMCP governance entry by its id. Returns the full recomputed manifest detail. 404 if the declaration does not exist on this agent's manifest. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `declared_vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Agent or declaration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/behavioral-constraints/{capability_label_type}/{capability_value} — Set an agent's policy stance on a capability node

**Endpoint**: `PUT /v1/inventory/resources/agent-manifest/{resource_instance_id}/behavioral-constraints/{capability_label_type}/{capability_value}`
**Summary**: Set an agent's policy stance on a capability node
**Tags**: inventory

Upsert the customer's stance (ALLOWED / PROHIBITED / REQUIRES_APPROVAL / UNSPECIFIED) on one capability node, identified by its taxonomy label type (family / subcapability / modifier) and value. The first edit materialises the manifest and moves NOT_STARTED to DRAFT. Returns the full recomputed manifest detail. 400 if the capability value is not in the taxonomy for its label type; 404 if the resource is missing or not an AGENT archetype. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `capability_label_type` (path, required): 
- `capability_value` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid capability value
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/behavioral-constraints/{capability_label_type}/{capability_value} — Clear an agent's policy stance on a capability node

**Endpoint**: `DELETE /v1/inventory/resources/agent-manifest/{resource_instance_id}/behavioral-constraints/{capability_label_type}/{capability_value}`
**Summary**: Clear an agent's policy stance on a capability node
**Tags**: inventory

Remove the stance for one capability node (by taxonomy label type and value). Returns the full recomputed manifest detail. 404 if no constraint exists for that capability. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `capability_label_type` (path, required): 
- `capability_value` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Agent or constraint not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/transition — Transition an agent's manifest through its governance lifecycle

**Endpoint**: `POST /v1/inventory/resources/agent-manifest/{resource_instance_id}/transition`
**Summary**: Transition an agent's manifest through its governance lifecycle
**Tags**: inventory

Apply a governance lifecycle action: SUBMIT (move a draft — or a rejected / stale / needs-re-review — manifest into review), APPROVE, APPROVE_WITH_EXCEPTIONS, or REJECT (each valid only while in review). The review decisions — APPROVE, APPROVE_WITH_EXCEPTIONS, and REJECT — are restricted to the Admin and Security Analyst roles (403 otherwise); SUBMIT is not restricted. The acting reviewer is recorded automatically as the manifest's security reviewer on approve/reject, so a security reviewer never needs to be assigned before approval. Both APPROVE and APPROVE_WITH_EXCEPTIONS enforce the approval gate: every required completion item (both owners, an approved purpose, and all observed tools and MCP servers reviewed) must be satisfied — 422 with the missing items otherwise. APPROVE_WITH_EXCEPTIONS is not a gate bypass; it additionally requires a documented justification in `notes` (400 if absent) — recording why the fully-reviewed agent is being approved despite its residual risks — stored as the manifest's exception notes. Approval stamps the last-reviewed time. Each transition bumps the manifest version and is recorded in the change history. Returns the full recomputed manifest detail. 409 if the action is not valid from the current status; 404 if the resource is missing or not an AGENT archetype. Requires a user-bound token; scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Exception justification required for approve-with-exceptions
- `403`: Approve/reject requires the Admin or Security Analyst role
- `404`: Agent not found
- `409`: Action not valid from the current status
- `422`: Manifest incomplete — required items missing for approval
- `500`: Unexpected server error

---

## GET /v1/inventory/resources/agent-manifest/{resource_instance_id}/history — Get an agent manifest's governance change history

**Endpoint**: `GET /v1/inventory/resources/agent-manifest/{resource_instance_id}/history`
**Summary**: Get an agent manifest's governance change history
**Tags**: inventory

Paginated append-only change log for the agent's manifest, newest first. Each entry records one changed governance field — the field path, its previous and new values, who made the change (or the stale-check job for system changes), when, the resulting manifest version, and an optional note. Returns an empty page if the manifest has never been edited. 404 if the resource is missing or not an AGENT archetype. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Agent not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint — Add Llm Endpoint Resources

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint`
**Summary**: Add Llm Endpoint Resources
**Tags**: inventory, llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/customer/{customer_id}/resources/llm-endpoint — Add Llm Endpoint Resources

**Endpoint**: `POST /v1/inventory/customer/{customer_id}/resources/llm-endpoint`
**Summary**: Add Llm Endpoint Resources
**Tags**: inventory, llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/assign-dsl-spec-version/{llm_endpoint_dsl_spec_version_id} — Assign Existing Llm Endpoint To Existing Dsl Spec

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/assign-dsl-spec-version/{llm_endpoint_dsl_spec_version_id}`
**Summary**: Assign Existing Llm Endpoint To Existing Dsl Spec
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_version_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl-spec-assignment — Get DSL spec assignment for an LLM endpoint resource

**Endpoint**: `GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl-spec-assignment`
**Summary**: Get DSL spec assignment for an LLM endpoint resource
**Tags**: inventory

Return the DSL spec version currently assigned to a specific LLM endpoint resource, including the input values in redacted form. Use to inspect which DSL template and version is active for a resource and confirm configuration is correctly applied. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource or assignment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}/llm-endpoint-pentest-connection — Get Llm Endpoint Pentest Connection

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}/llm-endpoint-pentest-connection`
**Summary**: Get Llm Endpoint Pentest Connection
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config — Update additional config for an LLM endpoint resource

**Endpoint**: `PATCH /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config`
**Summary**: Update additional config for an LLM endpoint resource
**Tags**: inventory

Partially update the additional configuration for a specific LLM endpoint resource, such as system-prompt support flags or other connection-level settings that supplement the DSL spec. Only supplied fields are changed. Scoped to the token's customer.

**Parameters**:
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

## GET /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config — Get additional config for an LLM endpoint resource

**Endpoint**: `GET /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config`
**Summary**: Get additional config for an LLM endpoint resource
**Tags**: inventory

Return the additional configuration for a specific LLM endpoint resource, including flags such as whether the endpoint supports system prompts. Use to inspect resource-level settings that supplement the assigned DSL spec. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url — Get pentest connection URL for an LLM endpoint resource

**Endpoint**: `GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url`
**Summary**: Get pentest connection URL for an LLM endpoint resource
**Tags**: inventory

Return the pentest connection URL configured for a specific LLM endpoint resource. This URL is used by the LLM penetration testing module to route test traffic through the endpoint. Use to verify the current pentest target URL before initiating a pentest run. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url — Update the pentest connection URL for an LLM endpoint resource

**Endpoint**: `PATCH /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url`
**Summary**: Update the pentest connection URL for an LLM endpoint resource
**Tags**: inventory

Set or replace the pentest connection URL for a specific LLM endpoint resource. The new URL will be used as the target for future LLM pentest runs against this resource. Use before starting a pentest to point it at the correct endpoint. Scoped to the token's customer.

**Parameters**:
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

## GET /v1/inventory/llm-endpoint/dsl/specs — List all LLM endpoint DSL specs for the customer

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs`
**Summary**: List all LLM endpoint DSL specs for the customer
**Tags**: inventory

Return all LLM endpoint DSL specs available to the customer. Each spec represents a reusable connection template (e.g., OpenAI, Azure OpenAI, Bedrock) that can be versioned and assigned to LLM endpoint resources. Use to discover available specs before creating versions or assignments. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## POST /v1/inventory/llm-endpoint/dsl/specs — Create Llm Endpoint Dsl Spec

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs`
**Summary**: Create Llm Endpoint Dsl Spec
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id} — Get a single LLM endpoint DSL spec by ID

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}`
**Summary**: Get a single LLM endpoint DSL spec by ID
**Tags**: inventory

Return the details of a specific LLM endpoint DSL spec, including its name, description, and metadata. Use to inspect a particular connection template before creating or assigning versions. Scoped to the token's customer.

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: DSL spec not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/versions — List all LLM endpoint DSL spec versions for the customer

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/versions`
**Summary**: List all LLM endpoint DSL spec versions for the customer
**Tags**: inventory

Return all DSL spec versions across all specs for the customer. Each version represents a concrete, immutable snapshot of a DSL connection template that can be assigned to an LLM endpoint resource. Use to audit all available versions or to find a specific version before assigning it. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions — List all versions of a specific LLM endpoint DSL spec

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions`
**Summary**: List all versions of a specific LLM endpoint DSL spec
**Tags**: inventory

Return all versions belonging to a specific LLM endpoint DSL spec. Use to inspect the version history of a connection template, compare versions, or select a version to assign to an LLM endpoint resource. Scoped to the token's customer.

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec to filter versions.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: DSL spec not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions — Create Llm Endpoint Dsl Spec Version

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions`
**Summary**: Create Llm Endpoint Dsl Spec Version
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec to add a version to.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/versions/{llm_endpoint_dsl_spec_version_id} — Get a single LLM endpoint DSL spec version by ID

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/versions/{llm_endpoint_dsl_spec_version_id}`
**Summary**: Get a single LLM endpoint DSL spec version by ID
**Tags**: inventory

Return the full details of a specific DSL spec version, including its definition, parameter schema, and status. Use to inspect the exact configuration of a version before assigning it to an LLM endpoint resource or comparing it against another version. Scoped to the token's customer.

**Parameters**:
- `llm_endpoint_dsl_spec_version_id` (path, required): The ID of the LLM Endpoint DSL Spec Version.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: DSL spec version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/latest-version — Get the latest version of a specific LLM endpoint DSL spec

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/latest-version`
**Summary**: Get the latest version of a specific LLM endpoint DSL spec
**Tags**: inventory

Return the most recently created version of a specific LLM endpoint DSL spec. Use as a convenience shortcut when you always want to assign or inspect the newest version without enumerating all versions first. Scoped to the token's customer.

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: DSL spec or version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/validate — Validate an LLM endpoint DSL spec definition

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/validate`
**Summary**: Validate an LLM endpoint DSL spec definition
**Tags**: inventory

Validate a DSL spec definition (YAML string) without persisting it. Returns the parsed spec on success, or a structured error with failure reason and remediation steps if the definition is invalid. Use before creating a spec or version to catch syntax and schema errors early. Does not require tenant context and does not modify any data.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs-with-versions — List LLM endpoint DSL specs with their versions

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs-with-versions`
**Summary**: List LLM endpoint DSL specs with their versions
**Tags**: inventory

Return all LLM endpoint DSL specs together with their nested versions in a single response. Optionally filter to a single spec by passing llm_endpoint_dsl_spec_id. Use when you need both spec metadata and the full version list in one call, for example when populating a DSL spec selector UI or auditing the version inventory. Scoped to the token's customer.

**Parameters**:
- `llm_endpoint_dsl_spec_id` (query, optional): If provided, return only this spec (404 if not found).

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/test-connection — Test Llm Endpoint Pentest Connection

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/test-connection`
**Summary**: Test Llm Endpoint Pentest Connection
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions/{llm_endpoint_dsl_spec_version_id}/test-connection — Test Llm Endpoint Dsl Spec Connection

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions/{llm_endpoint_dsl_spec_version_id}/test-connection`
**Summary**: Test Llm Endpoint Dsl Spec Connection
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec.
- `llm_endpoint_dsl_spec_version_id` (path, required): The ID of the LLM Endpoint DSL Spec Version.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl/specs/test-connection — Test the DSL spec connection assigned to an LLM endpoint resource

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl/specs/test-connection`
**Summary**: Test the DSL spec connection assigned to an LLM endpoint resource
**Tags**: inventory

Execute a live connection test using the DSL spec version currently assigned to a specific LLM endpoint resource. Sends a test prompt through the configured connection and records the result back to the resource. Use to verify that an already-assigned DSL spec is functional and the endpoint is reachable before relying on it for firewall or pentest operations. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): The ID of the LLM Endpoint Resource Instance.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource or DSL assignment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/dependencies/types — List all supported dependency types

**Endpoint**: `GET /v1/inventory/resources/dependencies/types`
**Summary**: List all supported dependency types
**Tags**: inventory

Return the full enumeration of supported dependency relationship types between AI resources, each with its machine-readable value and a human-readable display name. Use before calling the add-manual-dependencies endpoint to discover which dependency_type values are valid. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/inventory/resource/{resource_instance_id}/dependency-suggestions — Get suggested dependencies for an AI resource

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/dependency-suggestions`
**Summary**: Get suggested dependencies for an AI resource
**Tags**: inventory

Return a list of AI resources that are likely dependencies of the given resource, inferred from shared infrastructure, naming patterns, and existing manual dependency data. Use to discover relationships before calling the manual-dependency add endpoint. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/dependencies/manual — Add manual dependency edges between AI resources

**Endpoint**: `POST /v1/inventory/resources/dependencies/manual`
**Summary**: Add manual dependency edges between AI resources
**Tags**: inventory

Create one or more explicit dependency relationships between AI resource instances, specifying which resource depends on which and the type of dependency. Accepts up to 100 edges per request. Per-edge results indicate success or the reason for failure (e.g. duplicate, resource not found). Use to model discovered or known data-flow relationships in the AI inventory. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory/resources/dependencies/manual — Remove manual dependency edges between AI resources

**Endpoint**: `DELETE /v1/inventory/resources/dependencies/manual`
**Summary**: Remove manual dependency edges between AI resources
**Tags**: inventory

Delete one or more previously created manual dependency relationships between AI resource instances. Accepts up to 100 edge identifiers per request. Per-edge results indicate success or the reason for failure. Only manually created dependencies can be removed via this endpoint; auto-discovered dependencies are managed by the discovery pipeline. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/merge — Merge two AI resources (redirect the loser into the winner)

**Endpoint**: `POST /v1/inventory/resources/merge`
**Summary**: Merge two AI resources (redirect the loser into the winner)
**Tags**: inventory

Merge one AI resource instance (the loser) into another (the winner) using redirect semantics: every reference to the loser is repointed at the winner and the loser is tombstoned. Properties are not field-merged — the winner keeps its own attributes. On a uniqueness collision the winner's row wins and the loser's is discarded (not reversible); the response summary reports how many rows were repointed and discarded. Same-archetype only unless force_cross_type is set. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Winner or loser not found
- `409`: Resource already merged
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/tool-capabilities/taxonomy — Get the live tool-capability taxonomy

**Endpoint**: `GET /v1/inventory/resources/tool-capabilities/taxonomy`
**Summary**: Get the live tool-capability taxonomy
**Tags**: inventory

Returns every label value the classifier can produce in the current taxonomy version — families, subcapabilities, and modifiers — each list ordered highest-risk first. Use to populate FE dropdowns / filter chips without hard-coding the enum on the client. Pure static read; no DB access, not tenant-scoped. The ``taxonomy_version`` string changes when label values are added / removed / renamed — the FE should treat that as an invalidation signal for any cached schema.

**Responses**:
- `200`: Successful Response
- `500`: Unexpected server error

---

## GET /v1/inventory/resources/tool-capabilities/{resource_instance_id} — Get current tool capability classification for a resource

**Endpoint**: `GET /v1/inventory/resources/tool-capabilities/{resource_instance_id}`
**Summary**: Get current tool capability classification for a resource
**Tags**: inventory

Return the latest tool-capability classification for an AI resource, including which tool categories it is able to invoke (e.g. file I/O, network, code execution) and the confidence level of the classification. Useful for assessing the blast radius of an agent or MCP service. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/tool-capabilities/{resource_instance_id}/history — Get tool capability classification history

**Endpoint**: `GET /v1/inventory/resources/tool-capabilities/{resource_instance_id}/history`
**Summary**: Get tool capability classification history
**Tags**: inventory

Returns the raw classification snapshots for a tool, newest-first — includes both LLM-produced (`source="llm"`) and operator-curated (`source="human"`) rows. For the merged audit trail with human reviews, auto-approvals, label edits, and override notifications, prefer `/v1/inventory/resources/tool-capabilities/{resource_instance_id}/timeline`. Accepts a `limit` parameter (1-100, default 20). Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/tool-capabilities/{resource_instance_id}/timeline — Get audit timeline for a tool capability classification

**Endpoint**: `GET /v1/inventory/resources/tool-capabilities/{resource_instance_id}/timeline`
**Summary**: Get audit timeline for a tool capability classification
**Tags**: inventory

Returns LLM classifications, auto-approvals, LLM reclassifications, human reviews, manual label edits, and human-edit override events merged into one chronological timeline, newest-first. Every human event records `actor_user_id`, the state transition, and any free-form comment. Re-submitting a review or label edit creates a new audit event. Returns `200 {"events": []}` for resources that haven't been classified yet — the endpoint is always callable. Server-side cap: 1000 events per resource — pagination is not supported in v1. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/tool-capabilities/classify — Trigger tool capability classification for one or more resources

**Endpoint**: `POST /v1/inventory/resources/tool-capabilities/classify`
**Summary**: Trigger tool capability classification for one or more resources
**Tags**: inventory

Enqueues an LLM-based tool-capability classification for one or more AI resource instances. The classification identifies which tool categories each resource can invoke (e.g. file I/O, network access, code execution) and sets an initial `review_state` of `pending`. Use when a new resource is discovered or when re-classification after a capability change is needed. Results are available via the history or timeline endpoints once processing is complete. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/tool-capabilities/{resource_instance_id}/review — Record a human review decision on a tool capability classification

**Endpoint**: `POST /v1/inventory/resources/tool-capabilities/{resource_instance_id}/review`
**Summary**: Record a human review decision on a tool capability classification
**Tags**: inventory

Records a human review decision (approve, mark for review, or reject) against a resource's current tool-capability classification, with an optional free-form comment. Every call appends an immutable audit event capturing the actor, the from-to state transition, and the comment. Re-submitting the same state without a comment is rejected as a no-op. Returns the updated classification. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: No change requested
- `404`: Resource not found
- `409`: Concurrent reviewer wrote first; refresh and retry
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/tool-capabilities/{resource_instance_id}/labels — Replace tool capability labels with a manual override

**Endpoint**: `POST /v1/inventory/resources/tool-capabilities/{resource_instance_id}/labels`
**Summary**: Replace tool capability labels with a manual override
**Tags**: inventory

Replaces the families / subcapabilities / modifiers on a tool's current classification with operator-supplied values. Creates a new ``source=human`` snapshot, defaults `review_state` to `approve`. ``lock`` is required — set ``true`` to prevent the next ETL pass from overwriting the edit, ``false`` to allow re-classification (in which case a ``HUMAN_EDIT_OVERRIDDEN`` event is recorded if it later happens). Locked tools may still be edited via this endpoint. Re-submitting the exact same labels with no comment is rejected as a no-op. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: No change requested
- `404`: Resource not classified yet
- `409`: Concurrent edit lost the race; refresh and retry
- `422`: Schema or enum validation failure
- `500`: Unexpected server error

---

## GET /v1/inventory/tag-definitions — List all tag definitions for the customer

**Endpoint**: `GET /v1/inventory/tag-definitions`
**Summary**: List all tag definitions for the customer
**Tags**: inventory

Return all tag definitions (categories and their allowed values or freeform rules) configured for the customer. Use this to discover valid tag categories before calling resource tag endpoints. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/inventory/resource/{resource_instance_id}/tags — Get all tags assigned to an AI resource

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Get all tags assigned to an AI resource
**Tags**: inventory

Return all key-value tags currently assigned to a specific AI resource. Tags can represent environment, team ownership, sensitivity, or custom classification attributes. Use alongside listInventoryTagDefinitions to interpret tag categories. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/resource/{resource_instance_id}/tags — Assign or replace tags on a resource

**Endpoint**: `PUT /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Assign or replace tags on a resource
**Tags**: inventory

Assign or fully replace the set of key-value tags on a specific AI resource. Existing tags not included in the request body are removed (full replacement semantics). Use when an agent needs to classify or re-classify a resource with environment, team, sensitivity, or custom taxonomy tags. Scoped to the token's customer.

**Parameters**:
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

## DELETE /v1/inventory/resource/{resource_instance_id}/tags — Remove specific tags from a resource

**Endpoint**: `DELETE /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Remove specific tags from a resource
**Tags**: inventory

Remove a targeted set of key-value tags from a specific AI resource without affecting other tags. The request body specifies exactly which tag keys (or key-value pairs) to remove. Use when an agent needs to delete stale or incorrect classifications from a single resource. Scoped to the token's customer.

**Parameters**:
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

## POST /v1/inventory/resources/tags/assign — Bulk assign tags to multiple resources

**Endpoint**: `POST /v1/inventory/resources/tags/assign`
**Summary**: Bulk assign tags to multiple resources
**Tags**: inventory

Assign or replace tags on multiple AI resources in a single request. Each operation in the batch specifies a resource and its new tag set (full replacement semantics per resource). Use when an agent needs to classify or re-classify many resources at once, such as after a new taxonomy is defined or following a bulk import. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/tags/remove — Bulk remove tags from multiple resources

**Endpoint**: `POST /v1/inventory/resources/tags/remove`
**Summary**: Bulk remove tags from multiple resources
**Tags**: inventory

Remove specific tags from multiple AI resources in a single request. Each operation specifies a resource and the exact tag keys (or key-value pairs) to delete, leaving other tags on the resource intact. Use when an agent needs to purge outdated or incorrect classifications across many resources at once. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/tags/typeahead — Get typeahead suggestions for tag values

**Endpoint**: `GET /v1/inventory/tags/typeahead`
**Summary**: Get typeahead suggestions for tag values
**Tags**: inventory

Return a ranked list of existing tag values for a given category that match an optional prefix string, up to the specified limit. Use to power autocomplete or suggest valid values when assigning tags to resources. Supports the `category` filter (required) and `prefix` filter (optional). Scoped to the token's customer.

**Parameters**:
- `category` (query, required): Tag category to search
- `prefix` (query, optional): Prefix to filter values
- `limit` (query, optional): Max results

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/job-status/{job_id} — Get Discovery Job Status

**Endpoint**: `GET /v1/inventory/job-status/{job_id}`
**Summary**: Get Discovery Job Status
**Tags**: inventory

Get the status of a job that was initiated to run a discovery scan.

Parameters:
- job_id (UUID): The unique identifier of the discovery job.

Returns:
- dict: A dictionary containing the current status and details of the discovery job.

**Parameters**:
- `job_id` (path, required): The unique identifier of the discovery job

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/technologies — List supported AI technologies

**Endpoint**: `GET /v1/inventory/technologies`
**Summary**: List supported AI technologies
**Tags**: inventory

Return the catalogue of supported AI technologies, optionally filtered by cloud provider, technology category, or exact technology type. Use this to discover valid technology values for resource filtering and classification across the inventory. Not tenant-scoped — returns the global technology catalogue.

**Parameters**:
- `provider` (query, optional): 
- `category` (query, optional): 
- `technology` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid provider or category
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources-types — List supported AI resource types

**Endpoint**: `GET /v1/inventory/resources-types`
**Summary**: List supported AI resource types
**Tags**: inventory

Return the catalogue of supported AI resource types, optionally filtered by cloud provider, technology type, resource category, capabilities, or archetypes. Use this to discover valid resource_type values for inventory queries and to understand which capabilities (e.g. agentic, generative) each type supports. Not tenant-scoped — returns the global resource-type catalogue.

**Parameters**:
- `provider` (query, optional): 
- `technology` (query, optional): 
- `resource_category` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid filter parameter
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources —  Api Add Multiple Resource Instance New

**Endpoint**: `POST /v1/inventory/resources`
**Summary**:  Api Add Multiple Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_source_type` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/resources — Bulk update properties of multiple AI resource instances

**Endpoint**: `PATCH /v1/inventory/resources`
**Summary**: Bulk update properties of multiple AI resource instances
**Tags**: inventory

Apply field-level patches to multiple AI resource instances in a single request. Each entry in the request body targets one resource by ID and carries the set of properties to update (e.g. display name, status, lifecycle state). Use when batch-editing many resources at once. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/customer/{customer_id}/resources — Api Add Multiple Resource Instance Deprecated

**Endpoint**: `POST /v1/inventory/customer/{customer_id}/resources`
**Summary**: Api Add Multiple Resource Instance Deprecated
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_source_type` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resources — List AI inventory resources for a customer

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resources`
**Summary**: List AI inventory resources for a customer
**Tags**: inventory

Return discovered AI resources (models, datasets, applications, agents, MCP services, etc.) for the given customer. The response is summary-shaped — use the resource-detail endpoints to fetch full per-resource state. Filter by organization, project, technology, cloud account, resource category/type, AI-only-vs-all, pentest connection state, capability, archetype, or a case-insensitive name substring via ``name_search``. Pagination is opt-in: pass both ``page`` and ``per_page`` to receive a ``pagination`` block.

**Parameters**:
- `customer_id` (path, required): 
- `organization` (query, optional): 
- `project` (query, optional): 
- `technology` (query, optional): 
- `cloud_provider_account` (query, optional): 
- `resource_category` (query, optional): 
- `resource_category_model_assets_filter` (query, optional): 
- `resource_type` (query, optional): 
- `omit_not_ai` (query, optional): 
- `has_valid_pentest_connection_details` (query, optional): 
- `pentest_connection_last_test_status` (query, optional): 
- `include_issue_summaries` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 
- `name_search` (query, optional): Case-insensitive substring filter against ``display_name``. Whitespace is trimmed; an empty/whitespace-only value is ignored. LIKE wildcards (``%``, ``_``) in the input are escaped and matched literally.
- `per_page` (query, optional): Items per page. Pass along with ``page`` to enable pagination.
- `page` (query, optional): 1-based page number. Pass along with ``per_page`` to enable pagination.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resource/{resource_instance_id}/dependency-graph — Get the dependency graph for a single AI resource

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/dependency-graph`
**Summary**: Get the dependency graph for a single AI resource
**Tags**: inventory

Return the dependency graph (nodes and edges) centred on one resource instance. Useful for understanding how a model, agent, or application connects to other AI assets in the customer's inventory. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/resources/dependency-graph — List paginated dependency graphs for AI resources

**Endpoint**: `GET /v1/inventory/resources/dependency-graph`
**Summary**: List paginated dependency graphs for AI resources
**Tags**: inventory

Return a paginated set of dependency graphs for the customer's AI resources. Optionally filter by organization, project, or a specific list of resource IDs. Each graph item shows nodes and directional edges so agents can map how AI assets relate to each other. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_ids` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory/resource/{resource_instance_id} — Api Patch Resource Instance New

**Endpoint**: `PATCH /v1/inventory/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/resource/{resource_instance_id} — Api Patch Resource Instance New

**Endpoint**: `PATCH /v1/inventory/customer/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/{customer_id}/resource/{resource_instance_id} — Api Patch Resource Instance Old

**Endpoint**: `PATCH /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance Old
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id} — Get full detail for a single AI inventory resource

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Get full detail for a single AI inventory resource
**Tags**: inventory

Return the complete record for one AI resource in the customer's inventory, including resource properties, technology types, project assignments, lifecycle status, model type, cloud provider account, review state, and an optional data-security summary. Pass ``include=data_security_details`` to add the heavier recursive data-classification aggregates (e.g. when rendering the data-security tab). Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `include` (query, optional): Optional include flags for additional response blocks. Supported value: ``data_security_details`` — adds the DCE aggregates (recursive traversal). Omit for the default cheap response. Unknown flags fail with 422 so typos surface immediately rather than being silently dropped.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/supports-system-prompt/{resource_type} — Get Resource Type Supports System Prompt

**Endpoint**: `GET /v1/inventory/supports-system-prompt/{resource_type}`
**Summary**: Get Resource Type Supports System Prompt
**Tags**: inventory

Returns boolean whether a resource type supports system prompts.
Only applicable to resource types that are LlmEndpoints, it will be None if this is called with any other resource type

**Parameters**:
- `resource_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/inventory/resources/projects — Update project assignments for multiple resources

**Endpoint**: `PUT /v1/inventory/resources/projects`
**Summary**: Update project assignments for multiple resources
**Tags**: inventory

Assign or unassign AI resources to projects in a single call. Each entry specifies a resource and two lists — projects to add and projects to remove. At least one project must remain assigned after the operation. Use to bulk re-organise resource ownership across projects. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/resources/review — Mark multiple AI resources as reviewed or unreviewed

**Endpoint**: `POST /v1/inventory/resources/review`
**Summary**: Mark multiple AI resources as reviewed or unreviewed
**Tags**: inventory

Set the review state (reviewed / unreviewed) for a list of AI resource instances in one call. Use to acknowledge newly discovered resources or to reset review status during audits. Returns 204 on success. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory — Discover Inventory For Customer

**Endpoint**: `POST /v1/inventory/discover-inventory`
**Summary**: Discover Inventory For Customer
**Tags**: inventory

DEPRECATED: Use /inventory/discover-inventory/add-resources instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory/add-resources — Trigger cloud AI resource discovery and persist results

**Endpoint**: `POST /v1/inventory/discover-inventory/add-resources`
**Summary**: Trigger cloud AI resource discovery and persist results
**Tags**: inventory

Kick off a background discovery job that scans the customer's cloud accounts for AI resources (models, endpoints, notebooks, agents, etc.) and persists them into the inventory. Optionally filter by cloud provider, specific account, or regions. Returns a job_id for polling via the job-status endpoint. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory/start-discovery-job — Start a background cloud AI resource discovery job

**Endpoint**: `POST /v1/inventory/discover-inventory/start-discovery-job`
**Summary**: Start a background cloud AI resource discovery job
**Tags**: inventory

Enqueue a background discovery job for the customer's cloud accounts and return a job_id immediately for async polling. Optionally scope the scan to a specific cloud provider, account, or set of regions. Use when you want non-blocking discovery and intend to poll the job-status endpoint for results. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/discover/jupyter-notebooks/customer/{customer_id} — Discover Jupyter Notebooks for a customer

**Endpoint**: `POST /v1/inventory/discover/jupyter-notebooks/customer/{customer_id}`
**Summary**: Discover Jupyter Notebooks for a customer
**Tags**: inventory

Scan the customer's connected infrastructure for Jupyter Notebooks and return the discovery result synchronously. Unlike the async variant, this blocks until discovery completes. Use for real-time notebook inventory checks when the caller can tolerate a longer response time. Scoped to the path customer_id, which must match the token's customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/add-resources/discover/jupyter-notebooks — Discover and persist Jupyter Notebooks asynchronously

**Endpoint**: `POST /v1/inventory/add-resources/discover/jupyter-notebooks`
**Summary**: Discover and persist Jupyter Notebooks asynchronously
**Tags**: inventory

Enqueue a background job that scans the customer's infrastructure for Jupyter Notebooks and persists discovered notebooks into the inventory. Optionally restrict the scan to specific regions. Returns a job_id for polling the job-status endpoint. Use when you need non-blocking notebook discovery. Scoped to the token's customer.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/add-resources/discover/jupyter-notebooks/customer/{customer_id} — Discover And Add Jupyter Notebooks Inventory

**Endpoint**: `POST /v1/inventory/add-resources/discover/jupyter-notebooks/customer/{customer_id}`
**Summary**: Discover And Add Jupyter Notebooks Inventory
**Tags**: inventory

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/cloud-discoveries — List past cloud discovery scan records for a customer

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/cloud-discoveries`
**Summary**: List past cloud discovery scan records for a customer
**Tags**: inventory, internal

Return the history of cloud discovery scans for the specified customer, including scan IDs, associated cloud provider account, and start timestamps. Use to audit when and which accounts were last scanned for AI resources. Scoped to the path customer_id, which must match the token's customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/project-ai-bom/{project_id}/versions — List all AI BOM versions for a project

**Endpoint**: `GET /v1/inventory/project-ai-bom/{project_id}/versions`
**Summary**: List all AI BOM versions for a project
**Tags**: inventory

Return the list of available AI Bill of Materials versions for a project, with version numbers and metadata. Use this to discover available snapshots before fetching a specific version via getProjectAiBom. Scoped to the token's customer.

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/project-ai-bom/{project_id} — Get the AI Bill of Materials for a project

**Endpoint**: `GET /v1/inventory/project-ai-bom/{project_id}`
**Summary**: Get the AI Bill of Materials for a project
**Tags**: inventory

Return the AI Bill of Materials (AI BOM) for a project, optionally at a specific version number. If no version is specified, the most recent snapshot is returned. The BOM lists all AI resources and their dependencies captured at snapshot time. Scoped to the token's customer.

**Parameters**:
- `project_id` (path, required): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project or BOM version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/inventory/project-ai-bom/customer/{customer_id}/project/{project_id} — Generate a new AI BOM snapshot for a project

**Endpoint**: `POST /v1/inventory/project-ai-bom/customer/{customer_id}/project/{project_id}`
**Summary**: Generate a new AI BOM snapshot for a project
**Tags**: inventory

Enqueue a background job to generate a new AI Bill of Materials snapshot for the specified project, capturing all current AI resources and their dependency graph. Returns a job_id for polling. Use after significant inventory changes or on a compliance cadence. Scoped to the path customer_id.

**Parameters**:
- `project_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resources/dependency-files — List active dependency files for a customer

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resources/dependency-files`
**Summary**: List active dependency files for a customer
**Tags**: inventory

Return all active dependency files (e.g. requirements.txt, package.json) tracked in the customer's inventory, optionally filtered by project. Use to see which dependency manifests have been uploaded or discovered, and to identify candidates for reassignment or deletion. Scoped to the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory/customer/{customer_id}/resources/dependency-file — Delete a dependency file and its linked resources

**Endpoint**: `DELETE /v1/inventory/customer/{customer_id}/resources/dependency-file`
**Summary**: Delete a dependency file and its linked resources
**Tags**: inventory

Permanently delete a dependency file identified by its path/identifier within a project, and cascade-update all AI resource instances that were sourced from it. Optionally scope to a specific repository config. This is a destructive operation — resource associations are removed along with the file. Scoped to the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, required): 
- `dependency_file_identifier` (query, required): 
- `repository_config_id` (query, optional): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Dependency file not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/customer/{customer_id}/resources/dependency-file — Move a dependency file from one project to another

**Endpoint**: `PUT /v1/inventory/customer/{customer_id}/resources/dependency-file`
**Summary**: Move a dependency file from one project to another
**Tags**: inventory

Reassign a dependency file (and all AI resources sourced from it) from its current project to a different project. Provide the current project, the target project, and the dependency file identifier. Optionally scope to a specific repository config. All resource-to-project links are updated atomically. Scoped to the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `current_project_id` (query, required): 
- `reassign_project_id` (query, required): 
- `dependency_file_identifier` (query, required): 
- `repository_config_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Dependency file or project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory/customer/{customer_id}/resources/dependency-files-bulk — Delete multiple dependency files and their linked resources

**Endpoint**: `DELETE /v1/inventory/customer/{customer_id}/resources/dependency-files-bulk`
**Summary**: Delete multiple dependency files and their linked resources
**Tags**: inventory

Permanently delete a batch of dependency files in one request. Each entry specifies a project and dependency file identifier. All AI resource instances sourced from the specified files are updated accordingly. The entire batch is rolled back on any failure. This is a destructive bulk operation. Scoped to the path customer_id.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Dependency file not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/inventory/customer/{customer_id}/resources/dependency-file/bulk-unlink-from-project — Unlink multiple dependency files from their projects

**Endpoint**: `PUT /v1/inventory/customer/{customer_id}/resources/dependency-file/bulk-unlink-from-project`
**Summary**: Unlink multiple dependency files from their projects
**Tags**: inventory

Move a batch of dependency files (and all resources associated with them) away from their current projects and into the customer's default project. Use to reset project assignments in bulk, for example when restructuring project boundaries. Each entry specifies a project and dependency file identifier. Scoped to the path customer_id.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Dependency file or project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/inventory-filter-options — Get available filter options for the AI inventory list

**Endpoint**: `GET /v1/inventory/inventory-filter-options`
**Summary**: Get available filter options for the AI inventory list
**Tags**: inventory

Return the set of filter values currently applicable to the customer's AI inventory — cloud providers, resource categories, statuses, and other facets. Optionally scope by organization or project. Use this to populate filter dropdowns and to discover which values are valid before calling listAiInventoryResources. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `technology_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid filter parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/technology-filter-options — Get technology filter options for the inventory

**Endpoint**: `GET /v1/inventory/technology-filter-options`
**Summary**: Get technology filter options for the inventory
**Tags**: inventory

Return the distinct technology types and related facets that are present in the customer's current AI inventory, optionally scoped by organization, project, or resource active status. Use to populate technology filter dropdowns before calling listAiInventoryResources. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/repository-search-results — Search and list repositories in the customer inventory

**Endpoint**: `GET /v1/inventory/repository-search-results`
**Summary**: Search and list repositories in the customer inventory
**Tags**: inventory

Search and paginate through repositories (code repos, data repos) tracked in the customer's inventory. Filter by organization, project, discovery config, active/deleted state, or a name substring. Results are sortable by field and direction. Use limit/offset for pagination. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `organization_discovery_config_id` (query, optional): 
- `exclude_deleted` (query, optional): 
- `search_repo_name` (query, optional): 
- `order_field` (query, optional): 
- `ascending_order` (query, optional): 
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory/repository-configs/{repository_config_id}/resource-instances-by-type — Get AI resources grouped by type for a repository config

**Endpoint**: `GET /v1/inventory/repository-configs/{repository_config_id}/resource-instances-by-type`
**Summary**: Get AI resources grouped by type for a repository config
**Tags**: inventory

Return all AI resource instances discovered from a specific repository configuration, grouped by resource type (e.g. model, dataset, application). Use to inspect what AI assets a given repository contributed to the inventory. Scoped to the token's customer.

**Parameters**:
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Repository config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory-policy/resource_types — List all resource types grouped by category

**Endpoint**: `GET /v1/inventory-policy/resource_types`
**Summary**: List all resource types grouped by category
**Tags**: inventory

Return every supported AI resource type, grouped by resource category. Optionally filter by category name, one or more capability flags, or one or more archetype flags. Use this to discover valid resource types before configuring inventory policies. This endpoint is not tenant-scoped — it reflects the platform-wide resource type registry and is safe to call without a customer context.

**Parameters**:
- `resource_category` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory-policy — Upsert all inventory policies for the customer

**Endpoint**: `PATCH /v1/inventory-policy`
**Summary**: Upsert all inventory policies for the customer
**Tags**: inventory

Create or replace the full set of inventory policies for the token's customer. Each entry in the request specifies a resource category with its discovery policy, review policies, and allowed cloud storage sources. Existing policies not present in the payload will be left unchanged; entries in the payload are upserted atomically. Scoped to the token's customer. Use when you want to configure or bulk-update how discovered AI resources are inventoried and reviewed.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory-policy — Get all inventory policies for the customer

**Endpoint**: `GET /v1/inventory-policy`
**Summary**: Get all inventory policies for the customer
**Tags**: inventory

Return the complete set of inventory policies for the token's customer, one entry per configured resource category. Each entry includes the discovery policy, initial and ongoing review policies, per-type overrides, and allowed cloud storage sources. Scoped to the token's customer. Use to read the current inventory configuration before deciding whether an update is needed.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## DELETE /v1/inventory-policy — Reset all inventory policies for the customer

**Endpoint**: `DELETE /v1/inventory-policy`
**Summary**: Reset all inventory policies for the customer
**Tags**: inventory

Delete all stored inventory policies for the token's customer, reverting every resource category to the platform default. This is a destructive, non-reversible operation — all customized discovery policies, review policies, cloud storage allow-lists, and per-type overrides across all categories are permanently removed. Scoped to the token's customer. Use only when a full policy reset is intentional.

**Parameters**:
- `resource_category` (query, optional): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/resource_category/{resource_category} — Upsert inventory policy for one resource category

**Endpoint**: `PATCH /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Upsert inventory policy for one resource category
**Tags**: inventory

Create or replace the inventory policy for a single resource category for the token's customer. The policy controls discovery behavior (scan vs ignore), initial and ongoing review policies, per-type overrides, and allowed cloud storage sources for that category. Scoped to the token's customer. Use when you need to update the policy for one category without touching the rest.

**Parameters**:
- `resource_category` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/inventory-policy/resource_category/{resource_category} — Get inventory policy for one resource category

**Endpoint**: `GET /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Get inventory policy for one resource category
**Tags**: inventory

Return the inventory policy for a single resource category for the token's customer. Includes the discovery policy, initial and ongoing review policies, per-resource-type overrides, and the list of allowed cloud storage sources. Scoped to the token's customer. Use to inspect the policy for a specific category before making targeted updates.

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/resource_category/{resource_category} — Reset inventory policy for one resource category

**Endpoint**: `DELETE /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Reset inventory policy for one resource category
**Tags**: inventory

Delete the stored inventory policy for the specified resource category, reverting it to the platform default for the token's customer. This is a destructive operation — all customizations for that category (discovery policy, review policies, cloud storage allow-list, and per-type overrides) are permanently removed. Scoped to the token's customer. Use with caution; prefer upsert if you want to change rather than erase the policy.

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/resource_category/{resource_category}/toggle_cloud_storage/{cloud_storage_type} — Toggle a cloud storage source for a resource category

**Endpoint**: `PATCH /v1/inventory-policy/resource_category/{resource_category}/toggle_cloud_storage/{cloud_storage_type}`
**Summary**: Toggle a cloud storage source for a resource category
**Tags**: inventory

Add or remove a cloud storage type from the allowed sources list in the inventory policy for the specified resource category. If the storage type is currently allowed it is removed; if it is not present it is added. Returns the updated inventory policy for the category. Scoped to the token's customer. Use when you want to quickly enable or disable a single cloud storage source without rewriting the entire policy.

**Parameters**:
- `resource_category` (path, required): 
- `cloud_storage_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Create or update a inventory policy for the customer on a particular category

**Endpoint**: `PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Create or update a inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Resets the inventory policy for a customer

**Endpoint**: `DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Resets the inventory policy for a customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_category` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Get the inventory policy for the customer on a particular category

**Endpoint**: `GET /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Get the inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy — Resets the inventory policies for a customer

**Endpoint**: `DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Resets the inventory policies for a customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_category` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/customer/{customer_id}/inventory_policy — Get the inventory policy for the customer

**Endpoint**: `GET /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Get the inventory policy for the customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy — Create or update inventory policies for the customer

**Endpoint**: `PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Create or update inventory policies for the customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/inventory_policy/{resource_category}/toggle_cloud_storage/{cloud_storage_type} — Toggle a cloud storage type for the customer

**Endpoint**: `PATCH /v1/inventory-policy/inventory_policy/{resource_category}/toggle_cloud_storage/{cloud_storage_type}`
**Summary**: Toggle a cloud storage type for the customer
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `cloud_storage_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service/{hosted_service_id} —  Get Hosted Service

**Endpoint**: `GET /v1/hosted-service/{hosted_service_id}`
**Summary**:  Get Hosted Service
**Tags**: inventory

Get a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/hosted-service/{hosted_service_id} —  Delete Hosted Service

**Endpoint**: `DELETE /v1/hosted-service/{hosted_service_id}`
**Summary**:  Delete Hosted Service
**Tags**: inventory

Deletes a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/hosted-service/{hosted_service_id} —  Patch Hosted Service

**Endpoint**: `PATCH /v1/hosted-service/{hosted_service_id}`
**Summary**:  Patch Hosted Service
**Tags**: inventory

Updates a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service —  Get Hosted Services

**Endpoint**: `GET /v1/hosted-service`
**Summary**:  Get Hosted Services
**Tags**: inventory

Get hosted services for a customer with cursor pagination

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `hosted_service_type` (query, optional): 
- `limit` (query, optional): 
- `cursor` (query, optional): 
- `reverse` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service —  Add Hosted Service

**Endpoint**: `POST /v1/hosted-service`
**Summary**:  Add Hosted Service
**Tags**: inventory

Creates a new hosted service

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/hosted-service/bulk —  Delete Hosted Service In Bulk

**Endpoint**: `DELETE /v1/hosted-service/bulk`
**Summary**:  Delete Hosted Service In Bulk
**Tags**: inventory

Deletes a particular hosted service

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/hosted-service/hosted-services/bulk-unlink-from-project —  Unlink Hosted Service From Project In Bulk

**Endpoint**: `PUT /v1/hosted-service/hosted-services/bulk-unlink-from-project`
**Summary**:  Unlink Hosted Service From Project In Bulk
**Tags**: inventory

Updates hosted services by unlinking them from their current project

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service/sync-discovery/{hosted_service_id} —  Sync Run Hosted Service Discovery

**Endpoint**: `POST /v1/hosted-service/sync-discovery/{hosted_service_id}`
**Summary**:  Sync Run Hosted Service Discovery
**Tags**: inventory

Synchronously runs discovery for a hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service/{hosted_service_id}/test-connection —  Test Hosted Service Connection

**Endpoint**: `POST /v1/hosted-service/{hosted_service_id}/test-connection`
**Summary**:  Test Hosted Service Connection
**Tags**: inventory

Synchronously tests the stored credential against the provider's health endpoint. Persists the sanitized outcome on the row's ``last_test_*`` columns and returns it. Per WB-eaac #5.

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service/start-discovery-job/{hosted_service_id} — Run Hosted Service Discovery Job

**Endpoint**: `POST /v1/hosted-service/start-discovery-job/{hosted_service_id}`
**Summary**: Run Hosted Service Discovery Job
**Tags**: inventory

Initiate a job to run in the background to initiate a discovery scan. Will run in the background, and
return a job_id that a caller can use for polling.

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service/job-status/{job_id} — Get Hosted Service Job Status

**Endpoint**: `GET /v1/hosted-service/job-status/{job_id}`
**Summary**: Get Hosted Service Job Status
**Tags**: inventory

Get the status of a job that was initiated to run a hosted service discovery scan.

**Parameters**:
- `job_id` (path, required): The unique identifier of the hosted service discovery job

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
