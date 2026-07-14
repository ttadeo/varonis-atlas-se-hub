# mcp API Endpoints

## POST /v1/mcp/servers —  Create Mcp Server Config

**Endpoint**: `POST /v1/mcp/servers`
**Summary**:  Create Mcp Server Config
**Tags**: mcp, inventory

Register a new MCP server for discovery

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers — List MCP server configurations for the customer

**Endpoint**: `GET /v1/mcp/servers`
**Summary**: List MCP server configurations for the customer
**Tags**: mcp, inventory

Return a paginated list of registered MCP server configurations for the token's customer. Supports filtering by status, classification, and category, as well as filtering by project or organization scope, and a text search on display name. Use to enumerate the AI agent tools that have been registered for discovery and monitoring. Scoped to the token's customer.

**Parameters**:
- `status` (query, optional): 
- `classification` (query, optional): 
- `category` (query, optional): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 
- `search` (query, optional): Search by display name
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/mcp/servers/issues — List MCP security issues for the customer

**Endpoint**: `GET /v1/mcp/servers/issues`
**Summary**: List MCP security issues for the customer
**Tags**: mcp, inventory

Return a paginated list of MCP-related security issues (e.g. configuration drift, shadow servers, unauthorized tool exposure) for the token's customer. Supports filtering by status, severity, project, organization, and issue display name, as well as text search. Use to surface actionable security findings across MCP servers in the customer's AI inventory. Scoped to the token's customer.

**Parameters**:
- `page` (query, optional): 
- `per_page` (query, optional): 
- `search` (query, optional): 
- `status` (query, optional): 
- `severity` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `display_name` (query, optional): Filter by multiple exact issue display names
- `order_by` (query, optional): 
- `order` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/mcp/servers/issues/{issue_id} — Get full detail for a single MCP security issue

**Endpoint**: `GET /v1/mcp/servers/issues/{issue_id}`
**Summary**: Get full detail for a single MCP security issue
**Tags**: mcp, inventory

Return the full detail for a specific MCP security issue, including the component-engine finding information (excluding sensitive blast-radius data) and the list of currently-published vMCP gateways that expose the affected MCP server. Use to investigate a specific security finding before deciding whether to remediate or accept the risk. Remediation guidance is fetched separately via ``GET /v1/posture-management/issues/{issue_id}/component-engine/remediation``. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id} — Get detail for a single MCP server configuration

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}`
**Summary**: Get detail for a single MCP server configuration
**Tags**: mcp, inventory

Return the full configuration detail for a specific registered MCP server, including transport settings, discovery status, OAuth configuration state, and classification metadata. Use to inspect the current state of an MCP server before updating its configuration or diagnosing connectivity issues. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP server configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/mcp/servers/{mcp_server_config_id} —  Update Mcp Server Config

**Endpoint**: `PATCH /v1/mcp/servers/{mcp_server_config_id}`
**Summary**:  Update Mcp Server Config
**Tags**: mcp, inventory

Update MCP server configuration or rotate credentials

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/mcp/servers/{mcp_server_config_id} — Permanently delete an MCP server configuration

**Endpoint**: `DELETE /v1/mcp/servers/{mcp_server_config_id}`
**Summary**: Permanently delete an MCP server configuration
**Tags**: mcp, inventory

Permanently remove a registered MCP server configuration and all associated discovery data from the customer's inventory. This action is irreversible — the server will no longer be scanned, and any security issues tied to it will be removed. Use only when decommissioning an MCP server or correcting a mistaken registration. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP server configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/mcp/servers/{mcp_server_config_id}/test-connection — Test connectivity to a registered MCP server

**Endpoint**: `POST /v1/mcp/servers/{mcp_server_config_id}/test-connection`
**Summary**: Test connectivity to a registered MCP server
**Tags**: mcp, inventory

Initiate a live connectivity test against the saved MCP server configuration. HTTP and SSE transports respond inline with a success flag and optional error message. Stdio transports respond with a job_id — poll GET /{mcp_server_config_id}/test-connection/{job_id} to retrieve the result once the background job completes. Use to verify reachability and credentials after registering or updating a server configuration. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP server configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id}/test-connection/{job_id} — Poll the status of an async stdio test-connection job

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}/test-connection/{job_id}`
**Summary**: Poll the status of an async stdio test-connection job
**Tags**: mcp, inventory

Retrieve the current status of a stdio MCP server test-connection job initiated by POST /{mcp_server_config_id}/test-connection. Returns state=running while the job is in flight, state=succeeded with success=true once the connection test passes, or state=failed with an error string if it fails. Gate on the state field — success and error may both be null while the job is running. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Test connection job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/mcp/servers/probe —  Probe Mcp Connection

**Endpoint**: `POST /v1/mcp/servers/probe`
**Summary**:  Probe Mcp Connection
**Tags**: mcp, inventory

Test connection using provided parameters without saving. HTTP / SSE transports return ``MCPServerConnectionProbeResponse`` inline; stdio transports return ``MCPServerStdioJobAck`` with a ``job_id`` — poll ``GET /v1/mcp/servers/probe/{job_id}`` for the result.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers/probe/{job_id} — Poll the status of an async stdio probe job

**Endpoint**: `GET /v1/mcp/servers/probe/{job_id}`
**Summary**: Poll the status of an async stdio probe job
**Tags**: mcp, inventory

Retrieve the current status of a stdio MCP server probe job initiated by POST /probe. Returns state=running while in flight, state=succeeded with the full MCPServerConnectionProbeResponse once complete, or state=failed with the taxonomy step and error message if the probe fails. Use to asynchronously await the result of an unsaved connection test against custom parameters. Scoped to the token's customer.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Probe job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/mcp/servers/connection-dependency — Link an MCP connection resource to an MCP server

**Endpoint**: `POST /v1/mcp/servers/connection-dependency`
**Summary**: Link an MCP connection resource to an MCP server
**Tags**: mcp, inventory

Create an ACCESSES dependency edge in the AI inventory graph between an MCP connection resource and an MCP server resource. Use this to explicitly declare that a given MCP connection has access to a specific MCP server, enabling accurate blast-radius and access-path analysis in the security posture. Both resource IDs must belong to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/mcp/servers/{mcp_server_config_id}/discover — Trigger manual discovery scan for an MCP server

**Endpoint**: `POST /v1/mcp/servers/{mcp_server_config_id}/discover`
**Summary**: Trigger manual discovery scan for an MCP server
**Tags**: mcp, inventory

Manually trigger a discovery scan for a specific MCP server configuration, causing the platform to enumerate the server's tools, resources, and prompts and refresh the AI inventory. Normally discovery runs on a scheduled cadence; use this endpoint to force an immediate refresh after registering a new server or updating its capabilities. Returns immediately — discovery runs asynchronously. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP server configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id}/discovered-resources — List resources discovered by an MCP server

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}/discovered-resources`
**Summary**: List resources discovered by an MCP server
**Tags**: mcp, inventory

Return a paginated list of AI resources (tools, data sources, prompts) discovered from a specific MCP server during the most recent discovery scan. Supports filtering by resource type and text search by resource name. Optionally narrow to the resources a specific credential would see via `credential_id` (per-(server, credential) discovery): when supplied, the result is the effective set for that credential — resources discovered with it OR via the shared/default scan (no credential). Use to inspect what capabilities an MCP server exposes and to assess its attack surface before applying security policies. Scoped to the token's customer.

**Parameters**:
- `mcp_server_config_id` (path, required): 
- `resource_type` (query, optional): Filter by resource type
- `search` (query, optional): Search by resource name
- `credential_id` (query, optional): Filter to the effective resource set for this credential: resources surfaced by per-(server, credential) discovery for it, plus the shared/default-scan baseline (no credential).
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP server configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/mcp/servers/resources/{resource_instance_id} — Update user-defined metadata on an MCP resource

**Endpoint**: `PATCH /v1/mcp/servers/resources/{resource_instance_id}`
**Summary**: Update user-defined metadata on an MCP resource
**Tags**: mcp, inventory

Partially update the user-editable fields on a specific MCP-discovered resource (e.g. display name overrides, classification tags, or risk annotations). Only the fields supplied in the request body are modified; platform-managed fields from discovery are not overwritten. Use to enrich or correct metadata on an MCP tool or data source in the AI inventory. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: MCP resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/mcp/servers/oauth/begin — Begin OAuth Connect flow

**Endpoint**: `POST /v1/mcp/servers/oauth/begin`
**Summary**: Begin OAuth Connect flow
**Tags**: mcp, inventory

Resolve OAuth discovery + DCR/pre-reg client + mint state, return the vendor authorize URL the user's browser should be sent to.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/servers/oauth/clients — Create DCR client

**Endpoint**: `POST /v1/mcp/servers/oauth/clients`
**Summary**: Create DCR client
**Tags**: mcp, inventory

Persist a customer-pre-registered (client_id, client_secret) for an authorization server that does not support Dynamic Client Registration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers/oauth/redirect-info — Get OAuth redirect info

**Endpoint**: `GET /v1/mcp/servers/oauth/redirect-info`
**Summary**: Get OAuth redirect info
**Tags**: mcp, inventory

Return the canonical OAuth callback URL the customer must register at their vendor's OAuth app config. Sourced from server settings.

**Responses**:
- `200`: Successful Response

---
