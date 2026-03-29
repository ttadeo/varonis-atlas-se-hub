# Atlas API — mcp

## POST /v1/mcp/servers —  Create Mcp Server Config

**Endpoint**: `POST /v1/mcp/servers`
**Summary**:  Create Mcp Server Config
**Tags**: mcp, inventory

Register a new MCP server for discovery

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

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

Test connection to the configured MCP server

**Parameters**:
- `mcp_server_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/servers/probe —  Probe Mcp Connection

**Endpoint**: `POST /v1/mcp/servers/probe`
**Summary**:  Probe Mcp Connection
**Tags**: mcp, inventory

Test connection using provided parameters without saving

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
