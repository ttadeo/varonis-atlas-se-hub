# llm-gateway-provider-admin API Endpoints

## POST /v1/llm-gateway/provider-connections — Create Provider Connection

**Endpoint**: `POST /v1/llm-gateway/provider-connections`
**Summary**: Create Provider Connection
**Tags**: llm-gateway-provider-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/provider-connections — List Provider Connections

**Endpoint**: `GET /v1/llm-gateway/provider-connections`
**Summary**: List Provider Connections
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider` (query, optional): 
- `search` (query, optional): 
- `page` (query, optional): 
- `page_size` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/provider-connections/{provider_connection_id} — Get Provider Connection

**Endpoint**: `GET /v1/llm-gateway/provider-connections/{provider_connection_id}`
**Summary**: Get Provider Connection
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider_connection_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/llm-gateway/provider-connections/{provider_connection_id} — Update Provider Connection

**Endpoint**: `PATCH /v1/llm-gateway/provider-connections/{provider_connection_id}`
**Summary**: Update Provider Connection
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider_connection_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-gateway/provider-connections/{provider_connection_id} — Delete Provider Connection

**Endpoint**: `DELETE /v1/llm-gateway/provider-connections/{provider_connection_id}`
**Summary**: Delete Provider Connection
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider_connection_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/llm-gateway/provider-connections/{provider_connection_id}/exposed-models — Set Connection Exposed Models

**Endpoint**: `PUT /v1/llm-gateway/provider-connections/{provider_connection_id}/exposed-models`
**Summary**: Set Connection Exposed Models
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider_connection_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-gateway/provider-connections/{provider_connection_id}/verify — Verify Provider Connection

**Endpoint**: `POST /v1/llm-gateway/provider-connections/{provider_connection_id}/verify`
**Summary**: Verify Provider Connection
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider_connection_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/provider-catalog — Get Provider Catalog

**Endpoint**: `GET /v1/llm-gateway/provider-catalog`
**Summary**: Get Provider Catalog
**Tags**: llm-gateway-provider-admin

**Responses**:
- `200`: Successful Response

---

## GET /v1/llm-gateway/provider-catalog/{provider}/credential-fields — Get Provider Credential Fields

**Endpoint**: `GET /v1/llm-gateway/provider-catalog/{provider}/credential-fields`
**Summary**: Get Provider Credential Fields
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/llm-gateway/provider-catalog/{provider}/disabled — Set Provider Disabled

**Endpoint**: `PUT /v1/llm-gateway/provider-catalog/{provider}/disabled`
**Summary**: Set Provider Disabled
**Tags**: llm-gateway-provider-admin

**Parameters**:
- `provider` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
