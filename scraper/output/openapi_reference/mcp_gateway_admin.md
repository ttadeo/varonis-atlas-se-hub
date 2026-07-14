# mcp-gateway-admin API Endpoints

## POST /v1/mcp-gateway/access-tokens — Mint Access Token

**Endpoint**: `POST /v1/mcp-gateway/access-tokens`
**Summary**: Mint Access Token
**Tags**: mcp-gateway-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp-gateway/access-tokens — List Access Tokens

**Endpoint**: `GET /v1/mcp-gateway/access-tokens`
**Summary**: List Access Tokens
**Tags**: mcp-gateway-admin

**Parameters**:
- `vmcp_id` (query, optional): Optional. When provided, narrow the result to GATs that have a junction row to this vMCP — used by the UI's per-vMCP GAT list page. Omitting the filter returns all of the customer's active GATs (the original behavior).
- `q` (query, optional): Optional case-insensitive substring search on the GAT name. Composes with vmcp_id (both filters apply).

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp-gateway/access-tokens/{gat_id} — Get Access Token

**Endpoint**: `GET /v1/mcp-gateway/access-tokens/{gat_id}`
**Summary**: Get Access Token
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/mcp-gateway/access-tokens/{gat_id} — Update Access Token

**Endpoint**: `PATCH /v1/mcp-gateway/access-tokens/{gat_id}`
**Summary**: Update Access Token
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/mcp-gateway/access-tokens/{gat_id} — Revoke Access Token

**Endpoint**: `DELETE /v1/mcp-gateway/access-tokens/{gat_id}`
**Summary**: Revoke Access Token
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp-gateway/access-tokens/{gat_id}/detail — Get Access Token Detail

**Endpoint**: `GET /v1/mcp-gateway/access-tokens/{gat_id}/detail`
**Summary**: Get Access Token Detail
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 
- `current_page` (query, optional): Page over the bound-server list (tool lists within a row are not paginated).
- `per_page` (query, optional): 
- `q` (query, optional): Optional case-insensitive filter on server name or credential display name.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/mcp-gateway/access-tokens/{gat_id}/bindings — Update Access Token Bindings

**Endpoint**: `PATCH /v1/mcp-gateway/access-tokens/{gat_id}/bindings`
**Summary**: Update Access Token Bindings
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp-gateway/access-tokens/{gat_id}/rotate — Rotate Access Token

**Endpoint**: `POST /v1/mcp-gateway/access-tokens/{gat_id}/rotate`
**Summary**: Rotate Access Token
**Tags**: mcp-gateway-admin

**Parameters**:
- `gat_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/credentials — Create Credential

**Endpoint**: `POST /v1/mcp/credentials`
**Summary**: Create Credential
**Tags**: mcp-gateway-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/credentials — List Credentials

**Endpoint**: `GET /v1/mcp/credentials`
**Summary**: List Credentials
**Tags**: mcp-gateway-admin

**Parameters**:
- `server` (query, optional): Optional. Narrow to credentials usable for this MCP server config.
- `q` (query, optional): Optional case-insensitive display-name search.
- `limit` (query, optional): 
- `offset` (query, optional): 
- `include_revoked` (query, optional): Include soft-revoked credentials (status=REVOKED). Default false hides them, matching prior behavior.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/credentials/test-connection — Test Connection

**Endpoint**: `POST /v1/mcp/credentials/test-connection`
**Summary**: Test Connection
**Tags**: mcp-gateway-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/credentials/test-connection/{job_id} — Get Test Connection Status

**Endpoint**: `GET /v1/mcp/credentials/test-connection/{job_id}`
**Summary**: Get Test Connection Status
**Tags**: mcp-gateway-admin

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/credentials/{credential_id} — Get Credential

**Endpoint**: `GET /v1/mcp/credentials/{credential_id}`
**Summary**: Get Credential
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/mcp/credentials/{credential_id} — Update Credential

**Endpoint**: `PATCH /v1/mcp/credentials/{credential_id}`
**Summary**: Update Credential
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/mcp/credentials/{credential_id} — Revoke Credential

**Endpoint**: `DELETE /v1/mcp/credentials/{credential_id}`
**Summary**: Revoke Credential
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/credentials/{credential_id}/servers — List Credential Servers

**Endpoint**: `GET /v1/mcp/credentials/{credential_id}/servers`
**Summary**: List Credential Servers
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/mcp/credentials/{credential_id}/servers — Replace Credential Servers

**Endpoint**: `PUT /v1/mcp/credentials/{credential_id}/servers`
**Summary**: Replace Credential Servers
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/mcp/credentials/{credential_id}/auth — Rotate Credential Auth

**Endpoint**: `PATCH /v1/mcp/credentials/{credential_id}/auth`
**Summary**: Rotate Credential Auth
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/mcp/credentials/{credential_id}/test-connection — Test Saved Credential Connection

**Endpoint**: `POST /v1/mcp/credentials/{credential_id}/test-connection`
**Summary**: Test Saved Credential Connection
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/mcp/credentials/{credential_id}/test-connection/{job_id} — Get Saved Credential Test Status

**Endpoint**: `GET /v1/mcp/credentials/{credential_id}/test-connection/{job_id}`
**Summary**: Get Saved Credential Test Status
**Tags**: mcp-gateway-admin

**Parameters**:
- `credential_id` (path, required): 
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
