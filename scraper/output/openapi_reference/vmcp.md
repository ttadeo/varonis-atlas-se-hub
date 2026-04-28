# vmcp API Endpoints

## POST /v1/vmcp - Create Vmcp

**Endpoint**: `POST /v1/vmcp`
**Summary**: Create Vmcp
**Tags**: vmcp

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp - Get Vmcps

**Endpoint**: `GET /v1/vmcp`
**Summary**: Get Vmcps
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id} - Get Vmcp

**Endpoint**: `GET /v1/vmcp/{vmcp_id}`
**Summary**: Get Vmcp
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/vmcp/{vmcp_id} - Update Vmcp

**Endpoint**: `PATCH /v1/vmcp/{vmcp_id}`
**Summary**: Update Vmcp
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id} - Delete Vmcp

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}`
**Summary**: Delete Vmcp
**Tags**: vmcp

Soft delete a VMCP by marking it as deleted.
This sets the deleted_at timestamp on the VMCP record.
The VMCP and its associated data remain in the database but are
excluded from normal queries. This allows for potential recovery
and audit trails.

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft - Get Or Create Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft`
**Summary**: Get Or Create Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/draft - Get Draft

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/draft`
**Summary**: Get Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft - Delete Draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft`
**Summary**: Delete Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/publish - Publish Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/publish`
**Summary**: Publish Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/rollback - Rollback To Version

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/rollback`
**Summary**: Rollback To Version
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/{vmcp_version_id} - List Vmcp Versions

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/{vmcp_version_id}`
**Summary**: List Vmcp Versions
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `vmcp_version_id` (path, required): 
- `draft` (query, optional): 
- `published` (query, optional): 
- `archived` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions - List Vmcp Versions

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions`
**Summary**: List Vmcp Versions
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `vmcp_version_id` (query, optional): 
- `draft` (query, optional): 
- `published` (query, optional): 
- `archived` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/versions/{vmcp_version_id} - Get Vmcp Version

**Endpoint**: `GET /v1/vmcp/versions/{vmcp_version_id}`
**Summary**: Get Vmcp Version
**Tags**: vmcp

**Parameters**:
- `vmcp_version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/versions/{vmcp_version_id}/details - Get Vmcp Version Details

**Endpoint**: `GET /v1/vmcp/versions/{vmcp_version_id}/details`
**Summary**: Get Vmcp Version Details
**Tags**: vmcp

**Parameters**:
- `vmcp_version_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/published - Get Published Version

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/published`
**Summary**: Get Published Version
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/versions/published/details - Get Published Version Details

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/versions/published/details`
**Summary**: Get Published Version Details
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers - Add Servers To Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers`
**Summary**: Add Servers To Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id} - Remove Server From Draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}`
**Summary**: Remove Server From Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/policy - Update Mcp Server In Draft

**Endpoint**: `PATCH /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/policy`
**Summary**: Update Mcp Server In Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tools - Add Tools To Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tools`
**Summary**: Add Tools To Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/tools/{mcp_tool_resource_instance_id} - Remove Tool From Draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/tools/{mcp_tool_resource_instance_id}`
**Summary**: Remove Tool From Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_tool_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides - Add Tool Override To Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides`
**Summary**: Add Tool Override To Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/batch - Add Tool Override Batch To Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/batch`
**Summary**: Add Tool Override Batch To Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk - Add Tool Override Bulk To Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk`
**Summary**: Add Tool Override Bulk To Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/{mcp_tool_resource_instance_id} - Remove Tool Override From Draft

**Endpoint**: `DELETE /v1/vmcp/{vmcp_id}/draft/servers/{mcp_server_resource_instance_id}/tool-overrides/{mcp_tool_resource_instance_id}`
**Summary**: Remove Tool Override From Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `mcp_server_resource_instance_id` (path, required): 
- `mcp_tool_resource_instance_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk-delete - Remove Tool Overrides Bulk From Draft

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/draft/tool-overrides/bulk-delete`
**Summary**: Remove Tool Overrides Bulk From Draft
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignment - Assign Vmcp To Scope

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignment`
**Summary**: Assign Vmcp To Scope
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/assignment - Get Vmcp Assignments

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/assignment`
**Summary**: Get Vmcp Assignments
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignments - Assign Vmcp To Scope In Bulk

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignments`
**Summary**: Assign Vmcp To Scope In Bulk
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/vmcp/{vmcp_id}/assignment/delete - Delete Vmcp Assignment

**Endpoint**: `POST /v1/vmcp/{vmcp_id}/assignment/delete`
**Summary**: Delete Vmcp Assignment
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/effective-tools - Get Effective Tools For Vmcp

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/effective-tools`
**Summary**: Get Effective Tools For Vmcp
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `version_id` (query, optional): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/llm-endpoint/{resource_instance_id}/effective-tools - Get Effective Tools For Resource Instance

**Endpoint**: `GET /v1/vmcp/llm-endpoint/{resource_instance_id}/effective-tools`
**Summary**: Get Effective Tools For Resource Instance
**Tags**: vmcp

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/vmcp/{vmcp_id}/pending-review-tools - Get Tools Pending Review

**Endpoint**: `GET /v1/vmcp/{vmcp_id}/pending-review-tools`
**Summary**: Get Tools Pending Review
**Tags**: vmcp

**Parameters**:
- `vmcp_id` (path, required): 
- `version_id` (query, optional): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
