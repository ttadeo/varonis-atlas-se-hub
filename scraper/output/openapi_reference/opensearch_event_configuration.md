# Atlas API — opensearch_event_configuration

## GET /v1/opensearch_event_configuration/customer/{customer_id}/configurations — Get Opensearch Configurations

**Endpoint**: `GET /v1/opensearch_event_configuration/customer/{customer_id}/configurations`
**Summary**: Get Opensearch Configurations
**Tags**: opensearch_event_configuration

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 
- `configuration_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/opensearch_event_configuration/customer/{customer_id}/configuration — Add Opensearch Configuration

**Endpoint**: `POST /v1/opensearch_event_configuration/customer/{customer_id}/configuration`
**Summary**: Add Opensearch Configuration
**Tags**: opensearch_event_configuration

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/opensearch_event_configuration/customer/{customer_id}/configurations/{configuration_id} — Patch Opensearch Configuration

**Endpoint**: `PATCH /v1/opensearch_event_configuration/customer/{customer_id}/configurations/{configuration_id}`
**Summary**: Patch Opensearch Configuration
**Tags**: opensearch_event_configuration

**Parameters**:
- `customer_id` (path, required): 
- `configuration_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/opensearch_event_configuration/customer/{customer_id}/configurations/{configuration_id} — Delete Opensearch Configuration

**Endpoint**: `DELETE /v1/opensearch_event_configuration/customer/{customer_id}/configurations/{configuration_id}`
**Summary**: Delete Opensearch Configuration
**Tags**: opensearch_event_configuration

**Parameters**:
- `customer_id` (path, required): 
- `configuration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
