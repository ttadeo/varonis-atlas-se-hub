# ai-usage API Endpoints

## POST /v1/ai-usage/customer/{customer_id}/logging/copilot/microsoft - Pull Copilot Logs

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

## POST /v1/ai-usage/log-push/format/datadog - Cloudflare Log Push Datadog Format

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

## POST /v1/ai-usage/quarantine/llm-endpoint - Get Llm Endpoint Quarantine Status

**Endpoint**: `POST /v1/ai-usage/quarantine/llm-endpoint`
**Summary**: Get Llm Endpoint Quarantine Status
**Tags**: ai-usage

Validate whether then given LLM endpoint (resolved either by API key or endpoint identifier) is sanctioned according to
AI Usage Quarantine Policy settings.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-usage-policy/quarantine/{resource_category} - Get Quarantine Policy Settings

**Endpoint**: `GET /v1/ai-usage-policy/quarantine/{resource_category}`
**Summary**: Get Quarantine Policy Settings
**Tags**: ai-usage

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ai-usage-policy/quarantine/{resource_category} - Set Quarantine Policy Settings

**Endpoint**: `PATCH /v1/ai-usage-policy/quarantine/{resource_category}`
**Summary**: Set Quarantine Policy Settings
**Tags**: ai-usage

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
