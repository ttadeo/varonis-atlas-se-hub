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

## GET /v1/mcp/servers —  Get Mcp Server Configs

**Endpoint**: `GET /v1/mcp/servers`
**Summary**:  Get Mcp Server Configs
**Tags**: mcp, inventory

List all MCP server configurations for the customer

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
- `422`: Validation Error

---

## GET /v1/mcp/servers/issues —  Get Mcp Issues

**Endpoint**: `GET /v1/mcp/servers/issues`
**Summary**:  Get Mcp Issues
**Tags**: mcp, inventory

List all MCP related security issues (Drift, Shadow Servers, etc.)

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
- `422`: Validation Error

---

## GET /v1/mcp/servers/issues/{issue_id} —  Get Mcp Issue Detail

**Endpoint**: `GET /v1/mcp/servers/issues/{issue_id}`
**Summary**:  Get Mcp Issue Detail
**Tags**: mcp, inventory

Get specific details for a given MCP issue

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id} —  Get Mcp Server Config

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}`
**Summary**:  Get Mcp Server Config
**Tags**: mcp, inventory

Get MCP server configuration details

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

## DELETE /v1/mcp/servers/{mcp_server_config_id} —  Delete Mcp Server Config

**Endpoint**: `DELETE /v1/mcp/servers/{mcp_server_config_id}`
**Summary**:  Delete Mcp Server Config
**Tags**: mcp, inventory

Delete MCP server configuration

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/servers/{mcp_server_config_id}/test-connection —  Test Mcp Connection

**Endpoint**: `POST /v1/mcp/servers/{mcp_server_config_id}/test-connection`
**Summary**:  Test Mcp Connection
**Tags**: mcp, inventory

Test connection to the configured MCP server. HTTP / SSE transports return ``MCPServerTestConnectionResponse`` inline; stdio transports return ``MCPServerStdioJobAck`` with a ``job_id`` — poll ``GET /v1/mcp/servers/{mcp_server_config_id}/test-connection/{job_id}`` for the result.

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id}/test-connection/{job_id} —  Test Mcp Connection Status

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}/test-connection/{job_id}`
**Summary**:  Test Mcp Connection Status
**Tags**: mcp, inventory

Poll the result of an async stdio test-connection job. Returns ``state=running`` while in flight, ``state=succeeded`` with ``success=true`` once the connection test passes, or ``state=failed`` with an ``error`` string once it fails. Clients should gate on ``state``, not the truthiness of ``success`` / ``error`` (both can be ``null`` while running).

**Parameters**:
- `mcp_server_config_id` (path, required): 
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

## GET /v1/mcp/servers/probe/{job_id} —  Probe Mcp Connection Status

**Endpoint**: `GET /v1/mcp/servers/probe/{job_id}`
**Summary**:  Probe Mcp Connection Status
**Tags**: mcp, inventory

Poll the result of an async stdio probe job. Returns ``state=running`` while the job is in flight, ``state=succeeded`` with the typed ``MCPServerConnectionProbeResponse`` once complete, or ``state=failed`` with the taxonomy step + message.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/servers/connection-dependency —  Create Mcp Server Access Dependency

**Endpoint**: `POST /v1/mcp/servers/connection-dependency`
**Summary**:  Create Mcp Server Access Dependency
**Tags**: mcp, inventory

Create an ACCESSES dependency between an MCP connection and MCP server

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/servers/{mcp_server_config_id}/discover —  Run Mcp Discovery

**Endpoint**: `POST /v1/mcp/servers/{mcp_server_config_id}/discover`
**Summary**:  Run Mcp Discovery
**Tags**: mcp, inventory

Trigger manual discovery for this MCP server

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/servers/{mcp_server_config_id}/discovered-resources —  Get Mcp Server Discovered Resources

**Endpoint**: `GET /v1/mcp/servers/{mcp_server_config_id}/discovered-resources`
**Summary**:  Get Mcp Server Discovered Resources
**Tags**: mcp, inventory

Get a paginated list of resources discovered by this MCP server

**Parameters**:
- `mcp_server_config_id` (path, required): 
- `resource_type` (query, optional): Filter by resource type
- `search` (query, optional): Search by resource name
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/mcp/servers/resources/{resource_instance_id} —  Update Mcp Resource

**Endpoint**: `PATCH /v1/mcp/servers/resources/{resource_instance_id}`
**Summary**:  Update Mcp Resource
**Tags**: mcp, inventory

Update user-defined fields for an MCP resource

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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
