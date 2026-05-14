# ai-usage API Endpoints

## POST /v1/ai-usage/customer/{customer_id}/logging/copilot/microsoft — Pull Copilot Logs

**Endpoint**: `POST /v1/ai-usage/customer/{customer_id}/logging/copilot/microsoft`
**Summary**: Pull Copilot Logs
**Tags**: ai-usage

Pull logs from the Copilot service

**Parameters**:
- `customer_id` (path, required): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-usage/log-push/format/datadog — Cloudflare Log Push Datadog Format

**Endpoint**: `POST /v1/ai-usage/log-push/format/datadog`
**Summary**: Cloudflare Log Push Datadog Format
**Tags**: ai-usage, no-auth

Endpoint that mimics Datadog log push format from Cloudflare

**Parameters**:
- `ddsource` (query, optional): 
- `ddtags` (query, optional): 
- `host` (query, optional): 
- `service` (query, optional): 
- `dd-api-key` (header, optional): 

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-usage/quarantine/llm-endpoint — Get Llm Endpoint Quarantine Status

**Endpoint**: `POST /v1/ai-usage/quarantine/llm-endpoint`
**Summary**: Get Llm Endpoint Quarantine Status
**Tags**: ai-usage

Validate whether then given LLM endpoint (resolved either by API key or endpoint identifier) is sanctioned according to
AI Usage Quarantine Policy settings.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-usage-policy/quarantine/{resource_category} — Get Quarantine Policy Settings

**Endpoint**: `GET /v1/ai-usage-policy/quarantine/{resource_category}`
**Summary**: Get Quarantine Policy Settings
**Tags**: ai-usage

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ai-usage-policy/quarantine/{resource_category} — Set Quarantine Policy Settings

**Endpoint**: `PATCH /v1/ai-usage-policy/quarantine/{resource_category}`
**Summary**: Set Quarantine Policy Settings
**Tags**: ai-usage

**Parameters**:
- `resource_category` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list — List Quarantine Block List

**Endpoint**: `GET /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list`
**Summary**: List Quarantine Block List
**Tags**: ai-usage

**Parameters**:
- `resource_instance_id` (path, required): 
- `source` (query, optional): 
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list — Upsert Quarantine Block List

**Endpoint**: `PUT /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list`
**Summary**: Upsert Quarantine Block List
**Tags**: ai-usage

**Parameters**:
- `resource_instance_id` (path, required): 
- `delete` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list/{entry_id} — Delete Quarantine Block List Entry

**Endpoint**: `DELETE /v1/ai-usage-policy/quarantine/llm-endpoint/{resource_instance_id}/block-list/{entry_id}`
**Summary**: Delete Quarantine Block List Entry
**Tags**: ai-usage

**Parameters**:
- `resource_instance_id` (path, required): 
- `entry_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-policy/default-posture — Get Default Posture

**Endpoint**: `GET /v1/ai-service-policy/default-posture`
**Summary**: Get Default Posture
**Tags**: ai-usage

**Responses**:
- `200`: Successful Response

---

## PUT /v1/ai-service-policy/default-posture — Update Default Posture

**Endpoint**: `PUT /v1/ai-service-policy/default-posture`
**Summary**: Update Default Posture
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/ai-service-policy/overrides — Create Or Update Override

**Endpoint**: `PUT /v1/ai-service-policy/overrides`
**Summary**: Create Or Update Override
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/ai-service-policy/overrides/bulk — Bulk Create Or Update Overrides

**Endpoint**: `PUT /v1/ai-service-policy/overrides/bulk`
**Summary**: Bulk Create Or Update Overrides
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ai-service-policy/overrides/bulk — Bulk Delete Overrides

**Endpoint**: `DELETE /v1/ai-service-policy/overrides/bulk`
**Summary**: Bulk Delete Overrides
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ai-service-policy/overrides/{service_id} — Delete Override

**Endpoint**: `DELETE /v1/ai-service-policy/overrides/{service_id}`
**Summary**: Delete Override
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-catalog — Get Catalog

**Endpoint**: `GET /v1/ai-service-catalog`
**Summary**: Get Catalog
**Tags**: ai-usage

**Parameters**:
- `search` (query, optional): 
- `service_type` (query, optional): 
- `effective_policy` (query, optional): 
- `offset` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-catalog/{service_id} — Get Catalog Entry

**Endpoint**: `GET /v1/ai-service-catalog/{service_id}`
**Summary**: Get Catalog Entry
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-service-catalog/custom — Create Custom Service

**Endpoint**: `POST /v1/ai-service-catalog/custom`
**Summary**: Create Custom Service
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/ai-service-catalog/custom/{service_id} — Update Custom Service

**Endpoint**: `PUT /v1/ai-service-catalog/custom/{service_id}`
**Summary**: Update Custom Service
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ai-service-catalog/custom/{service_id} — Delete Custom Service

**Endpoint**: `DELETE /v1/ai-service-catalog/custom/{service_id}`
**Summary**: Delete Custom Service
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-access-events — Get Access Events

**Endpoint**: `GET /v1/ai-access-events`
**Summary**: Get Access Events
**Tags**: ai-usage

**Parameters**:
- `service_id` (query, optional): 
- `user_email` (query, optional): 
- `time_start` (query, optional): 
- `time_end` (query, optional): 
- `source_in` (query, optional): 
- `device_in` (query, optional): 
- `url_contains` (query, optional): 
- `ip_in` (query, optional): 
- `event_type_in` (query, optional): 
- `offset` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-activity — Get Service Activity

**Endpoint**: `GET /v1/ai-service-activity`
**Summary**: Get Service Activity
**Tags**: ai-usage

**Parameters**:
- `time_start` (query, optional): 
- `time_end` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-activity/{service_id} — Get Service Detail

**Endpoint**: `GET /v1/ai-service-activity/{service_id}`
**Summary**: Get Service Detail
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 
- `time_start` (query, optional): 
- `time_end` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
