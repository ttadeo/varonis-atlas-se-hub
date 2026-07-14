# llm-gateway-routing-admin API Endpoints

## POST /v1/llm-gateway/access-tokens — Mint Access Token

**Endpoint**: `POST /v1/llm-gateway/access-tokens`
**Summary**: Mint Access Token
**Tags**: llm-gateway-routing-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/access-tokens — List Access Tokens

**Endpoint**: `GET /v1/llm-gateway/access-tokens`
**Summary**: List Access Tokens
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (query, optional): Optional. When provided, narrow the result to GATs that have a junction row to this Inference Endpoint — used by the UI's per-endpoint GAT list page. Omitting the filter returns all of the customer's GATs.
- `search` (query, optional): Optional case-insensitive substring match on the GAT name and token prefix.
- `page` (query, optional): 1-based page number.
- `page_size` (query, optional): Page size. Omit to return the full list (with total_count = result size).

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/access-tokens/{gat_id} — Get Access Token

**Endpoint**: `GET /v1/llm-gateway/access-tokens/{gat_id}`
**Summary**: Get Access Token
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `gat_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/llm-gateway/access-tokens/{gat_id} — Update Access Token

**Endpoint**: `PATCH /v1/llm-gateway/access-tokens/{gat_id}`
**Summary**: Update Access Token
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `gat_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-gateway/access-tokens/{gat_id} — Revoke Access Token

**Endpoint**: `DELETE /v1/llm-gateway/access-tokens/{gat_id}`
**Summary**: Revoke Access Token
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `gat_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/access-tokens/{gat_id}/spend — Get Access Token Spend

**Endpoint**: `GET /v1/llm-gateway/access-tokens/{gat_id}/spend`
**Summary**: Get Access Token Spend
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `gat_id` (path, required): 
- `days` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-gateway/access-tokens/{gat_id}/rotate — Rotate Access Token

**Endpoint**: `POST /v1/llm-gateway/access-tokens/{gat_id}/rotate`
**Summary**: Rotate Access Token
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `gat_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-gateway/inference-endpoints — Create Inference Endpoint

**Endpoint**: `POST /v1/llm-gateway/inference-endpoints`
**Summary**: Create Inference Endpoint
**Tags**: llm-gateway-routing-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/inference-endpoints — List Inference Endpoints

**Endpoint**: `GET /v1/llm-gateway/inference-endpoints`
**Summary**: List Inference Endpoints
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `deleted` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/inference-endpoints/route-availability — Check Endpoint Route Availability

**Endpoint**: `GET /v1/llm-gateway/inference-endpoints/route-availability`
**Summary**: Check Endpoint Route Availability
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `display_name` (query, required): Endpoint display name to preview the derived route slug for and check whether that route is free for this tenant.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id} — Get Inference Endpoint

**Endpoint**: `GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}`
**Summary**: Get Inference Endpoint
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/llm-gateway/inference-endpoints/{inference_endpoint_id} — Update Inference Endpoint

**Endpoint**: `PATCH /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}`
**Summary**: Update Inference Endpoint
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-gateway/inference-endpoints/{inference_endpoint_id} — Delete Inference Endpoint

**Endpoint**: `DELETE /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}`
**Summary**: Delete Inference Endpoint
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/publish — Publish Inference Endpoint

**Endpoint**: `POST /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/publish`
**Summary**: Publish Inference Endpoint
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/publish-history — Get Endpoint Publish History

**Endpoint**: `GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/publish-history`
**Summary**: Get Endpoint Publish History
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/aliases — Create Endpoint Alias

**Endpoint**: `POST /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/aliases`
**Summary**: Create Endpoint Alias
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/aliases — List Endpoint Aliases

**Endpoint**: `GET /v1/llm-gateway/inference-endpoints/{inference_endpoint_id}/aliases`
**Summary**: List Endpoint Aliases
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `inference_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/llm-gateway/aliases/{endpoint_alias_id} — Update Endpoint Alias

**Endpoint**: `PATCH /v1/llm-gateway/aliases/{endpoint_alias_id}`
**Summary**: Update Endpoint Alias
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `endpoint_alias_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/llm-gateway/aliases/{endpoint_alias_id} — Delete Endpoint Alias

**Endpoint**: `DELETE /v1/llm-gateway/aliases/{endpoint_alias_id}`
**Summary**: Delete Endpoint Alias
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `endpoint_alias_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/llm-gateway/model-registry — Get Model Registry

**Endpoint**: `GET /v1/llm-gateway/model-registry`
**Summary**: Get Model Registry
**Tags**: llm-gateway-routing-admin

**Parameters**:
- `project_id` (query, optional): 
- `provider` (query, optional): 
- `search` (query, optional): 
- `page` (query, optional): 
- `page_size` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/llm-gateway/model-registry/enablement — Set Model Enablement

**Endpoint**: `PUT /v1/llm-gateway/model-registry/enablement`
**Summary**: Set Model Enablement
**Tags**: llm-gateway-routing-admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
