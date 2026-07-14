# vmcp API Endpoints

## POST /v1/vmcp — Create a VMCP gateway configuration

**Endpoint**: `POST /v1/vmcp`
**Summary**: Create a VMCP gateway configuration
**Tags**: vmcp

Creates a new Virtual MCP (VMCP) gateway configuration for the authenticated customer. A VMCP defines a named, versioned set of MCP server and tool policies that can be published and assigned to LLM endpoints. Returns the newly created VMCP record including its ID, display name, and initial metadata.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp — List all VMCP gateway configurations for the customer

**Endpoint**: `GET /v1/vmcp`
**Summary**: List all VMCP gateway configurations for the customer
**Tags**: vmcp

Returns all Virtual MCP gateway configurations belonging to the authenticated customer. Optionally filter by vmcp_id to narrow to a single record. Use this to enumerate available VMCP configs before fetching version details, assigning to endpoints, or inspecting effective tool sets.

**Parameters**:
- `vmcp_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id} — Get a VMCP gateway configuration by ID

**Endpoint**: `GET /v1/vmcp/{vmcp_id}`
**Summary**: Get a VMCP gateway configuration by ID
**Tags**: vmcp

Returns the VMCP gateway configuration for the given vmcp_id, scoped to the authenticated customer. Use this to retrieve metadata (display name, description, security owner) for a specific VMCP. Returns 404 if the VMCP does not exist or belongs to a different tenant.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/vmcp/{vmcp_id} — Update metadata for a VMCP gateway configuration

**Endpoint**: `PATCH /v1/vmcp/{vmcp_id}`
**Summary**: Update metadata for a VMCP gateway configuration
**Tags**: vmcp

Updates the display name, description, security owner, or business owner of an existing VMCP gateway configuration. Only provided fields are changed; omitted fields retain their current values. Returns the updated VMCP record. Scoped to the authenticated customer — returns 404 if the VMCP does not exist.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id} — Soft-delete a VMCP gateway configuration

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}`
**Summary**: Soft-delete a VMCP gateway configuration
**Tags**: vmcp

Marks the specified VMCP as deleted so it no longer appears in normal queries. The VMCP and its version history are retained for audit purposes and can be recovered by support. All active scope assignments are also implicitly suppressed. Scoped to the authenticated customer — returns 404 if the VMCP does not exist.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft — Get the existing draft version of a VMCP, or create one if absent

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft`
**Summary**: Get the existing draft version of a VMCP, or create one if absent
**Tags**: vmcp

Returns the current draft version for the specified VMCP. If no draft exists, a new draft is created as a copy of the latest published version (or an empty draft for a brand-new VMCP). Use this as the first step before adding or modifying servers, tools, or tool overrides on a VMCP. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/draft — Get the current draft version of a VMCP

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/draft`
**Summary**: Get the current draft version of a VMCP
**Tags**: vmcp

Returns the in-progress draft version for the specified VMCP, including its list of MCP servers, tools, and tool overrides. Returns 404 if no draft currently exists for this VMCP. Use this to inspect draft changes before publishing. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft — Discard the current draft version of a VMCP

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft`
**Summary**: Discard the current draft version of a VMCP
**Tags**: vmcp

Permanently removes the in-progress draft for the specified VMCP without publishing it. If no draft currently exists the request is silently treated as a no-op and returns 204. Use this to abandon pending changes and start fresh from the last published version. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/publish — Publish the draft version of a VMCP

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/publish`
**Summary**: Publish the draft version of a VMCP
**Tags**: vmcp

Promotes the current draft for the specified VMCP to a published version, making it the active policy enforced by the gateway. The previous published version is archived. Returns 404 if no draft exists. After publishing, agents operating through assigned LLM endpoints will immediately see the updated tool set. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/rollback — Rollback a VMCP to a prior published version

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/rollback`
**Summary**: Rollback a VMCP to a prior published version
**Tags**: vmcp

Creates a new published version for the specified VMCP by copying the configuration of the target historical version, effectively reverting the live policy. The target must be a previously published version — passing a draft version ID returns 400. Useful for quickly undoing an undesirable publish. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP or version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/{vmcp_version_id} — Get a specific version of a VMCP by version ID

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/{vmcp_version_id}`
**Summary**: Get a specific version of a VMCP by version ID
**Tags**: vmcp

Returns a single VMCP version record identified by both vmcp_id and vmcp_version_id. Use this to confirm which version is draft or published, or to fetch version metadata before requesting full details via the /details endpoint. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `vmcp_version_id` (path, required): 
- `draft` (query, optional): 
- `published` (query, optional): 
- `archived` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions — List all versions for a VMCP gateway configuration

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions`
**Summary**: List all versions for a VMCP gateway configuration
**Tags**: vmcp

Returns the version history for the specified VMCP, optionally filtered by status (draft, published, archived). Each version captures the state of MCP servers, tools, and overrides at a point in time. Use this to browse available versions before fetching details or comparing configurations. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `vmcp_version_id` (query, optional): 
- `draft` (query, optional): 
- `published` (query, optional): 
- `archived` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/versions/{vmcp_version_id} — Get a VMCP version by its version ID

**Endpoint**: `GET /v1/vmcp/versions/{vmcp_version_id}`
**Summary**: Get a VMCP version by its version ID
**Tags**: vmcp

Returns the metadata and status of a single VMCP version identified directly by vmcp_version_id, without needing to know the parent VMCP ID. Use this when you have a version ID from a previous publish or rollback response and need to confirm its status or retrieve its full metadata. Returns 404 if the version does not exist or belongs to a different tenant. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/versions/{vmcp_version_id}/details — Get full details of a VMCP version by version ID

**Endpoint**: `GET /v1/vmcp/versions/{vmcp_version_id}/details`
**Summary**: Get full details of a VMCP version by version ID
**Tags**: vmcp

Returns the complete contents of a VMCP version — including all MCP servers, their tool lists, and per-tool policy overrides — identified by vmcp_version_id directly. Use this when you have a version ID and want to inspect the full policy snapshot without needing the parent VMCP ID. Returns 404 if the version does not exist or belongs to a different tenant. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/published — Get the currently published version of a VMCP

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/published`
**Summary**: Get the currently published version of a VMCP
**Tags**: vmcp

Returns the version record for the currently active (published) configuration of the specified VMCP. Use this to retrieve the version ID and metadata of the live policy without loading the full server/tool detail — follow up with getVmcpPublishedVersionDetails if full contents are needed. Returns 404 if no published version exists yet. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Published version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/published/details — Get full details of the published version of a VMCP

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/published/details`
**Summary**: Get full details of the published version of a VMCP
**Tags**: vmcp

Returns the complete published version of the specified VMCP, including all MCP servers, their tool lists, and any per-tool policy overrides. This is the authoritative live configuration that the gateway enforces. Use this to audit or display the active policy for a VMCP. Returns 404 if no published version exists. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Published version not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers — Add MCP servers to a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers`
**Summary**: Add MCP servers to a VMCP draft
**Tags**: vmcp

Attaches one or more MCP server resource instances to the draft version of the specified VMCP. Each server is identified by its resource instance ID. Returns 400 if a resource is not an MCP server type or is already present in the draft. Call getOrCreateVmcpDraft first to ensure a draft exists. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id} — Remove an MCP server from a VMCP draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}`
**Summary**: Remove an MCP server from a VMCP draft
**Tags**: vmcp

Detaches the specified MCP server resource instance from the draft version of the VMCP. Any tool overrides associated with this server in the draft are also removed. Returns 404 if the draft or the server entry does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft or server not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/policy — Update the tool policy for an MCP server in a VMCP draft

**Endpoint**: `PATCH /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/policy`
**Summary**: Update the tool policy for an MCP server in a VMCP draft
**Tags**: vmcp

Updates the new-tool policy for the specified MCP server within the draft of the given VMCP. The new-tool policy controls how the gateway handles tools discovered on the server that do not yet have an explicit override — for example, auto-allow or auto-block new tools. Returns the updated server entry. Returns 404 if the draft or server does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft or server not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tools — Add individual MCP tools to a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tools`
**Summary**: Add individual MCP tools to a VMCP draft
**Tags**: vmcp

Attaches one or more MCP tool resource instances directly to the draft version of the specified VMCP (rather than via a server). Returns 400 if a resource is not an MCP tool type or is already present in the draft. Call getOrCreateVmcpDraft first to ensure a draft exists. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/tools/{mcp_tool_resource_instance_id} — Remove an MCP tool from a VMCP draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/tools/{mcp_tool_resource_instance_id}`
**Summary**: Remove an MCP tool from a VMCP draft
**Tags**: vmcp

Detaches the specified MCP tool resource instance from the draft version of the VMCP. Any overrides scoped to this tool in the draft are also removed. Returns 404 if the draft or the tool entry does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_tool_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft or tool not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides — Add a single tool override for an MCP server in a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides`
**Summary**: Add a single tool override for an MCP server in a VMCP draft
**Tags**: vmcp

Creates an explicit per-tool policy override (include or exclude) for one MCP tool within a specific MCP server in the VMCP draft. The override takes precedence over the server-level new-tool policy. Returns 400 if the tool does not belong to the server or is not an MCP tool resource. Returns 404 if the draft or server is not found. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft, server, or tool not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/batch — Batch-add tool overrides for one MCP server in a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/batch`
**Summary**: Batch-add tool overrides for one MCP server in a VMCP draft
**Tags**: vmcp

Creates multiple per-tool policy overrides for a single MCP server within the VMCP draft in one request. Each override specifies a tool resource instance ID and whether to include or exclude it. Returns the list of created overrides. Returns 400 if any tool is invalid or not in the server; returns 404 if the draft or server is not found. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft, server, or tool not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk — Bulk-add tool overrides across multiple servers in a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk`
**Summary**: Bulk-add tool overrides across multiple servers in a VMCP draft
**Tags**: vmcp

Creates per-tool policy overrides across multiple MCP servers in a single request against the VMCP draft. Each override entry specifies the server, the tool, and the include/exclude decision. Returns the list of created override records. Returns 400 if any tool or server reference is invalid; returns 404 if the draft is not found. Use this instead of repeated single-override calls when configuring many tools at once. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft, server, or tool not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/{mcp_tool_resource_instance_id} — Remove a single tool override from a VMCP draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/{mcp_tool_resource_instance_id}`
**Summary**: Remove a single tool override from a VMCP draft
**Tags**: vmcp

Deletes the explicit per-tool policy override for the specified tool on the specified server within the VMCP draft. After removal the tool falls back to the server-level new-tool policy. Returns 404 if the draft, server, or override does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 
- `mcp_tool_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft, server, or override not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk-delete — Bulk-remove tool overrides from a VMCP draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk-delete`
**Summary**: Bulk-remove tool overrides from a VMCP draft
**Tags**: vmcp

Removes multiple per-tool policy overrides from the VMCP draft in a single request. Each entry in the request identifies a server and tool whose override should be deleted. Affected tools revert to the server-level new-tool policy. Returns 404 if the draft or a specified server/override does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Draft, server, or override not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignment — Assign a VMCP to a scope (organization, project, or LLM endpoint)

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignment`
**Summary**: Assign a VMCP to a scope (organization, project, or LLM endpoint)
**Tags**: vmcp

Associates the published configuration of the specified VMCP with a single scope — an organization, a project, or a specific LLM endpoint resource instance. Once assigned, the gateway enforces the VMCP's tool policy for requests matching that scope. Returns 400 if the target resource is not an LLM endpoint when scoped to a resource instance; returns 404 if the VMCP or target resource does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP or target resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/assignment — Get the scope assignments for a VMCP gateway configuration

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/assignment`
**Summary**: Get the scope assignments for a VMCP gateway configuration
**Tags**: vmcp

Returns the list of scope assignments (organizations, projects, or LLM endpoint resource instances) that the specified VMCP is currently assigned to. Use this to determine which resources will have the VMCP policy enforced. Scoped to the authenticated customer — returns 404 if the VMCP does not exist.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignments — Bulk-assign a VMCP to multiple scopes at once

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignments`
**Summary**: Bulk-assign a VMCP to multiple scopes at once
**Tags**: vmcp

Associates the published configuration of the specified VMCP with multiple scopes (organizations, projects, or LLM endpoint resource instances) in a single request. Use this to efficiently apply a VMCP policy to many endpoints or projects simultaneously. Returns 400 if any target is not an LLM endpoint when required; returns 404 if the VMCP or any target resource does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP or target resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignment/delete — Remove a VMCP scope assignment

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignment/delete`
**Summary**: Remove a VMCP scope assignment
**Tags**: vmcp

Removes the association between the specified VMCP and one or more scopes, so the gateway no longer enforces the VMCP's tool policy for those scopes. Uses POST with a body (rather than DELETE) to allow specifying multiple assignments in a single call. Returns 404 if the VMCP does not exist. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/effective-tools — Get the effective tool list for a VMCP version

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/effective-tools`
**Summary**: Get the effective tool list for a VMCP version
**Tags**: vmcp

Returns the resolved list of MCP tools that the VMCP would expose, taking into account per-server new-tool policies and any explicit per-tool overrides. Defaults to the published version; pass version='draft' or version_id to inspect a specific version. Use this to preview what tools an agent will see after the VMCP is applied. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `version_id` (query, optional): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/llm-endpoint/{resource_instance_id}/effective-tools — Get effective MCP tools for a specific LLM endpoint

**Endpoint**: `GET /v1/vmcp/llm-endpoint/{resource_instance_id}/effective-tools`
**Summary**: Get effective MCP tools for a specific LLM endpoint
**Tags**: vmcp

Returns the resolved list of MCP tools that are currently exposed to the specified LLM endpoint resource instance, based on the VMCP assignment and its published policy (server-level new-tool policy and per-tool overrides). Use this to determine exactly which tools an agent connecting through a given LLM endpoint is permitted to call. Returns 400 if the resource is not an LLM endpoint; returns 404 if the resource or its VMCP assignment does not exist. Scoped to the authenticated customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource or VMCP assignment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/pending-review-tools — Get tools pending security review for a VMCP version

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/pending-review-tools`
**Summary**: Get tools pending security review for a VMCP version
**Tags**: vmcp

Returns the list of MCP tools that have been discovered in the VMCP's MCP servers but have not yet been explicitly approved or denied via a tool override. These are tools awaiting a security review decision. Defaults to the published version; pass version='draft' to inspect pending items in the draft. Scoped to the authenticated customer.

**Parameters**:
- `vmcp_id` (path, required): 
- `version_id` (query, optional): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: VMCP or version not found
- `500`: Unexpected server error
- `422`: Validation Error

---
