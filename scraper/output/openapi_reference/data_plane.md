# data-plane API Endpoints

## GET /v1/data-plane/mcp-gateway/config — Get Mcp Gateway Config

**Endpoint**: `GET /v1/data-plane/mcp-gateway/config`
**Summary**: Get Mcp Gateway Config
**Tags**: data-plane, mcp-gateway, internal

Full MCP gateway config snapshot for the calling customer. Returns vMCP definitions, MCP server registrations (without secret material), and all VMCP assignment rows. Mirrors rule-processor's full-snapshot pattern: deletes are implicit by absence. The gateway polls this endpoint and replaces its in-memory state per response.

**Responses**:
- `200`: Successful Response

---

## GET /v1/data-plane/mcp-gateway/credentials — Get Mcp Gateway Credentials

**Endpoint**: `GET /v1/data-plane/mcp-gateway/credentials`
**Summary**: Get Mcp Gateway Credentials
**Tags**: data-plane, mcp-gateway, internal

Bulk-fetch all runtime MCP-server credentials for the calling customer (OAuth bundles + static tokens). The gateway polls this endpoint on the same cadence as /config and uses the result to drive its in-memory credential cache; per upstream MCP request the gateway looks up by credential_id locally — never round-trips here on the request hot path.

Defense in depth: requires the additional header `x_alltrue_credential_query_secrets` whose value must equal the calling customer_id. Mirrors the customer-LLM credentials pattern (`x_alltrue_llm_query_secrets`) — a customer API key alone is not sufficient to read credentials.

**Parameters**:
- `x-alltrue-credential-query-secrets` (header, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/mcp-gateway/credentials/refresh — Refresh Mcp Gateway Credential

**Endpoint**: `POST /v1/data-plane/mcp-gateway/credentials/refresh`
**Summary**: Refresh Mcp Gateway Credential
**Tags**: data-plane, mcp-gateway, internal

Just-in-time refresh of a single PER_USER OAuth credential, identified by `(gat_id, mcp_server_config_id)`. The gateway calls this when a per-user access token from the snapshot is at/near expiry; CP derives the owning user from the GAT's `created_by_user_id`, rotates the bundle under a per-user lock (CP holds the refresh token + OAuth client secret), persists it, and returns the fresh payload. Returns 409 `requires_reconnect` when the user must redo the OAuth flow.

Same defense-in-depth header guard as `/credentials`: `x_alltrue_credential_query_secrets` must equal the calling customer_id.

**Parameters**:
- `x-alltrue-credential-query-secrets` (header, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/llm-gateway/config — Get Llm Gateway Config

**Endpoint**: `GET /v1/data-plane/llm-gateway/config`
**Summary**: Get Llm Gateway Config
**Tags**: data-plane, llm-gateway, internal

Full LLM gateway config snapshot for the calling customer. Returns Inference Endpoints, Provider Connections (without secret material), published model aliases, and the `events_ingest_ready` flag. Mirrors the MCP gateway's full-snapshot pattern: deletes are implicit by absence. The gateway polls this endpoint and replaces its in-memory state per response.

**Responses**:
- `200`: Successful Response

---

## GET /v1/data-plane/llm-gateway/credentials — Get Llm Gateway Credentials

**Endpoint**: `GET /v1/data-plane/llm-gateway/credentials`
**Summary**: Get Llm Gateway Credentials
**Tags**: data-plane, llm-gateway, internal

Bulk-fetch all runtime provider credentials for the calling customer (LLM provider API keys) plus the inbound-auth GAT entries. The gateway polls this endpoint on the same cadence as /config and uses the result to drive its in-memory credential + bearer caches; per request the gateway looks up locally — never round-trips here on the request hot path.

Defense in depth: requires the additional header `x-alltrue-credential-query-secrets` whose value must equal the calling customer_id. Mirrors the MCP-gateway credentials pattern — a customer API key alone is not sufficient to read provider credentials.

**Parameters**:
- `x-alltrue-credential-query-secrets` (header, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/registrations — Register Data Plane 

**Endpoint**: `POST /v1/data-plane/registrations`
**Summary**: Register Data Plane 
**Tags**: data-plane

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations — List Data Plane Registrations

**Endpoint**: `GET /v1/data-plane/registrations`
**Summary**: List Data Plane Registrations
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (query, optional): 
- `is_llm_pentest_target` (query, optional): Filter registrations by whether they are marked as the LLM pentest target.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/{data_plane_account_id} — List Data Plane Registrations

**Endpoint**: `GET /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: List Data Plane Registrations
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 
- `is_llm_pentest_target` (query, optional): Filter registrations by whether they are marked as the LLM pentest target.

**Responses**:
- `200`: Successful Response
- `404`: Data plane registrations not found
- `422`: Validation Error

---

## PATCH /v1/data-plane/registrations/{data_plane_account_id} — Update Data Plane Registration 

**Endpoint**: `PATCH /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: Update Data Plane Registration 
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/data-plane/registrations/{data_plane_account_id} — Delete Data Plane Registration 

**Endpoint**: `DELETE /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: Delete Data Plane Registration 
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/registrations/{data_plane_account_id}/set-control-plane-dek — Set Control Plane Dek

**Endpoint**: `POST /v1/data-plane/registrations/{data_plane_account_id}/set-control-plane-dek`
**Summary**: Set Control Plane Dek
**Tags**: data-plane

Set the DEK of the specified data plane registration as the control plane DEK for the customer.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/registrations/{data_plane_account_id}/set-llm-pentest-target — Set Registration As Llm Pentest Target

**Endpoint**: `POST /v1/data-plane/registrations/{data_plane_account_id}/set-llm-pentest-target`
**Summary**: Set Registration As Llm Pentest Target
**Tags**: data-plane

Set the specified data plane registration as the target for LLM pentesting.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/{data_plane_account_id}/cfn-template —  Get Customer Plane Cfn Template

**Endpoint**: `GET /v1/data-plane/registrations/{data_plane_account_id}/cfn-template`
**Summary**:  Get Customer Plane Cfn Template
**Tags**: data-plane, admin

**Parameters**:
- `data_plane_account_id` (path, required): 
- `deploy_region` (query, required): AWS region to deploy the customer plane

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/azure/{subscription_id}/arm-template —  Get Customer Plane Arm Template

**Endpoint**: `GET /v1/data-plane/registrations/azure/{subscription_id}/arm-template`
**Summary**:  Get Customer Plane Arm Template
**Tags**: data-plane, admin

**Parameters**:
- `subscription_id` (path, required): 
- `resource_group_name` (query, required): Azure resource group name

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/data-plane/registrations/{data_plane_account_id}/service-status — Update Data Plane Service Status 

**Endpoint**: `PUT /v1/data-plane/registrations/{data_plane_account_id}/service-status`
**Summary**: Update Data Plane Service Status 
**Tags**: data-plane

Record or update the service status for a customer's data plane.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/{data_plane_account_id}/service-status — Get Data Plane Service Status 

**Endpoint**: `GET /v1/data-plane/registrations/{data_plane_account_id}/service-status`
**Summary**: Get Data Plane Service Status 
**Tags**: data-plane

Get the service status for a customer's data plane.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/cfn-status — Receive Cfn Status

**Endpoint**: `POST /v1/data-plane/cfn-status`
**Summary**: Receive Cfn Status
**Tags**: data-plane

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
