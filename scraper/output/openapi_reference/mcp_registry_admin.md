# mcp-registry-admin API Endpoints

## POST /v1/mcp/registries — Create an MCP registry

**Endpoint**: `POST /v1/mcp/registries`
**Summary**: Create an MCP registry
**Tags**: mcp-registry-admin

Create a registry of approved MCP servers/tools and expose it to one or more scopes (customer-wide, organization, or project). Admin/Security only.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `409`: Name/visibility conflict
- `422`: Validation Error

---

## GET /v1/mcp/registries — List MCP registries

**Endpoint**: `GET /v1/mcp/registries`
**Summary**: List MCP registries
**Tags**: mcp-registry-admin

Return a paginated list of the customer's MCP registries with their visible scopes and server/tool counts. Admin/Security only.

Filters (all combine with AND):
- `search`: case-insensitive match on registry name substrings.
- `scope_type` (+ optional `scope_organization_id` / `scope_project_id`): filter by visible scope, matched **exactly** against the registry's visibility rows — no hierarchy resolution. All provided scope predicates must be satisfied by a single visibility row, so contradictory combinations (e.g. `scope_type=CUSTOMER_WIDE` with a `scope_project_id`) return nothing by design.
- `contains_mcp_server_config_id` / `contains_tool_resource_instance_id`: reverse lookup — return only registries that include that server/tool as an entry.

**Parameters**:
- `search` (query, optional): Search by registry name
- `scope_type` (query, optional): Filter to registries with a visibility row of this scope tier, matched exactly (no hierarchy resolution).
- `scope_organization_id` (query, optional): Filter to registries visible to this organization. Matched exactly against a visibility row; combine with `scope_type=ORGANIZATION` to require an org-scoped row.
- `scope_project_id` (query, optional): Filter to registries visible to this project. Matched exactly against a visibility row (no parent-org/customer-wide inheritance).
- `contains_mcp_server_config_id` (query, optional): Reverse lookup: return only registries that contain this MCP server (by `mcp_server_config_id`) as an entry.
- `contains_tool_resource_instance_id` (query, optional): Reverse lookup: return only registries that contain this MCP tool (by tool `resource_instance_id`) as an entry.
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/registries/{mcp_registry_id} — Get an MCP registry

**Endpoint**: `GET /v1/mcp/registries/{mcp_registry_id}`
**Summary**: Get an MCP registry
**Tags**: mcp-registry-admin

**Parameters**:
- `mcp_registry_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## PATCH /v1/mcp/registries/{mcp_registry_id} — Update an MCP registry's name, description, or owner

**Endpoint**: `PATCH /v1/mcp/registries/{mcp_registry_id}`
**Summary**: Update an MCP registry's name, description, or owner
**Tags**: mcp-registry-admin

Patch a registry's metadata. Only fields present in the body change. `owner_user_id` reassigns the owner and must be a user in the caller's tenant (404 otherwise); pass null to clear it. Visibility is managed via the dedicated visibility endpoint, not here. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `409`: Name/visibility conflict
- `422`: Validation Error

---

## DELETE /v1/mcp/registries/{mcp_registry_id} — Delete an MCP registry

**Endpoint**: `DELETE /v1/mcp/registries/{mcp_registry_id}`
**Summary**: Delete an MCP registry
**Tags**: mcp-registry-admin

Delete a registry. Removes its availability (visibility, entries, requests) but never unassigns a server/tool from any project or VMCP. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## PUT /v1/mcp/registries/{mcp_registry_id}/visibility — Replace an MCP registry's visible scopes

**Endpoint**: `PUT /v1/mcp/registries/{mcp_registry_id}/visibility`
**Summary**: Replace an MCP registry's visible scopes
**Tags**: mcp-registry-admin

Replace the full set of scopes a registry is exposed to. Customer-wide is exclusive (cannot be combined with narrower scopes). Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `409`: Name/visibility conflict
- `422`: Validation Error

---

## GET /v1/mcp/registries/{mcp_registry_id}/visibility — List an MCP registry's visible scopes

**Endpoint**: `GET /v1/mcp/registries/{mcp_registry_id}/visibility`
**Summary**: List an MCP registry's visible scopes
**Tags**: mcp-registry-admin

**Parameters**:
- `mcp_registry_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## POST /v1/mcp/registries/{mcp_registry_id}/entries — Add a server or tool to an MCP registry

**Endpoint**: `POST /v1/mcp/registries/{mcp_registry_id}/entries`
**Summary**: Add a server or tool to an MCP registry
**Tags**: mcp-registry-admin

Add an MCP server (`entry_type=SERVER` + `mcp_server_config_id`) or a specific tool (`entry_type=TOOL` + `tool_resource_instance_id`) to a registry. Duplicates are allowed. Bumps the registry's `updated_at`. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `404`: Registry not found
- `400`: Server/tool not owned by customer
- `422`: Validation Error

---

## GET /v1/mcp/registries/{mcp_registry_id}/entries — List an MCP registry's entries

**Endpoint**: `GET /v1/mcp/registries/{mcp_registry_id}/entries`
**Summary**: List an MCP registry's entries
**Tags**: mcp-registry-admin

Return a paginated list of the registry's server/tool entries, optionally filtered by `entry_type`. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 
- `entry_type` (query, optional): Filter to SERVER or TOOL entries.
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## POST /v1/mcp/registries/{mcp_registry_id}/entries/bulk — Add multiple servers or tools to an MCP registry

**Endpoint**: `POST /v1/mcp/registries/{mcp_registry_id}/entries/bulk`
**Summary**: Add multiple servers or tools to an MCP registry
**Tags**: mcp-registry-admin

Add multiple MCP servers and/or specific tools to a registry in one all-or-nothing request (the multi-select Add MCP Server / Add MCP Tool action). Each item is a SERVER (`entry_type=SERVER` + `mcp_server_config_id`) or a TOOL (`entry_type=TOOL` + `tool_resource_instance_id`). Every target is validated up front; if any is not owned by the customer the whole batch is rejected (400) with nothing persisted. Duplicates are allowed. Bumps the registry's `updated_at` once. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `404`: Registry not found
- `400`: Server/tool not owned by customer
- `422`: Validation Error

---

## DELETE /v1/mcp/registries/{mcp_registry_id}/entries/{mcp_registry_entry_id} — Remove an entry from an MCP registry

**Endpoint**: `DELETE /v1/mcp/registries/{mcp_registry_id}/entries/{mcp_registry_entry_id}`
**Summary**: Remove an entry from an MCP registry
**Tags**: mcp-registry-admin

Remove a server/tool entry from a registry. Bumps the registry's `updated_at`. Never unassigns the server/tool from any project or VMCP. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 
- `mcp_registry_entry_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## GET /v1/mcp/registries/{mcp_registry_id}/requests — List an MCP registry's request queue

**Endpoint**: `GET /v1/mcp/registries/{mcp_registry_id}/requests`
**Summary**: List an MCP registry's request queue
**Tags**: mcp-registry-admin

Return a paginated list of a registry's add-server/tool requests, newest first, optionally filtered by `status`. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 
- `status` (query, optional): Filter to PENDING, APPROVED, or DENIED.
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Registry not found
- `422`: Validation Error

---

## POST /v1/mcp/registries/{mcp_registry_id}/requests/{mcp_registry_request_id}/approve — Approve a pending MCP registry request

**Endpoint**: `POST /v1/mcp/registries/{mcp_registry_id}/requests/{mcp_registry_request_id}/approve`
**Summary**: Approve a pending MCP registry request
**Tags**: mcp-registry-admin

Approve a PENDING request: create the corresponding registry entry AND mark the request APPROVED, atomically. Bumps the registry's `updated_at`. `review_comment` is optional. Only a PENDING request can be reviewed. For an ADD_TOOL request the tool's source MCP server is pulled into the registry too; when the tool has more than one source connection the approval must name one via `source_mcp_server_config_id` (400 otherwise, naming the candidates). Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 
- `mcp_registry_request_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Registry or request not found
- `400`: Server/tool not owned by customer
- `409`: Request is not pending
- `422`: Validation Error

---

## POST /v1/mcp/registries/{mcp_registry_id}/requests/{mcp_registry_request_id}/deny — Deny a pending MCP registry request

**Endpoint**: `POST /v1/mcp/registries/{mcp_registry_id}/requests/{mcp_registry_request_id}/deny`
**Summary**: Deny a pending MCP registry request
**Tags**: mcp-registry-admin

Deny a PENDING request: mark it DENIED, optionally with a `review_comment` (the denial reason). Creates no entry. Only a PENDING request can be reviewed. Admin/Security only.

**Parameters**:
- `mcp_registry_id` (path, required): 
- `mcp_registry_request_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Registry or request not found
- `409`: Request is not pending
- `422`: Validation Error

---

## GET /v1/mcp/registry-requests — List all MCP registry requests (cross-registry admin queue)

**Endpoint**: `GET /v1/mcp/registry-requests`
**Summary**: List all MCP registry requests (cross-registry admin queue)
**Tags**: mcp-registry-admin

Return a paginated list of add-server/tool requests across the customer's registries, newest first, optionally filtered by `status`. This is the cross-registry admin queue (requirement §8.2) — unlike `GET /mcp/registries/{mcp_registry_id}/requests` it is not tied to a single registry. By default it spans ALL the customer's registries; pass `project_id` OR `organization_id` (mutually exclusive → 400) to restrict it to requests whose TARGET registry is visible to that scope (the admin Registries page's hierarchy selector — a view filter, not an access check). Scoped to the token's customer. Admin/Security only.

**Parameters**:
- `status` (query, optional): Filter to PENDING, APPROVED, or DENIED.
- `project_id` (query, optional): Restrict to requests whose target registry is visible to this project (own + parent-org + customer-wide). Mutually exclusive with `organization_id`.
- `organization_id` (query, optional): Restrict to requests whose target registry is visible to this organization (own + customer-wide). Mutually exclusive with `project_id`.
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: project_id and organization_id are mutually exclusive
- `422`: Validation Error

---

## GET /v1/mcp/registry-requests/pending-count — Count pending MCP registry requests

**Endpoint**: `GET /v1/mcp/registry-requests/pending-count`
**Summary**: Count pending MCP registry requests
**Tags**: mcp-registry-admin

Return the count of PENDING add-server/tool requests across the customer's registries — powers the admin "N requests pending" button (requirement §8.2). By default counts across ALL the customer's registries; pass `project_id` OR `organization_id` (mutually exclusive → 400) to restrict the count to requests whose TARGET registry is visible to that scope, matching the list endpoint's filter. Scoped to the token's customer. Admin/Security only.

**Parameters**:
- `project_id` (query, optional): Restrict the count to requests whose target registry is visible to this project. Mutually exclusive with `organization_id`.
- `organization_id` (query, optional): Restrict the count to requests whose target registry is visible to this organization. Mutually exclusive with `project_id`.

**Responses**:
- `200`: Successful Response
- `400`: project_id and organization_id are mutually exclusive
- `422`: Validation Error

---
