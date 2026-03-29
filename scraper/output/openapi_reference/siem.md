# Atlas API — siem

## GET /v1/siem/endpoints — Get Siem Endpoints

**Endpoint**: `GET /v1/siem/endpoints`
**Summary**: Get Siem Endpoints
**Tags**: siem

**Parameters**:
- `incident` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/siem/endpoint — Add Siem Endpoint

**Endpoint**: `POST /v1/siem/endpoint`
**Summary**: Add Siem Endpoint
**Tags**: siem

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/siem/endpoint/{siem_endpoint_id} — Patch Siem Endpoint

**Endpoint**: `PATCH /v1/siem/endpoint/{siem_endpoint_id}`
**Summary**: Patch Siem Endpoint
**Tags**: siem

**Parameters**:
- `siem_endpoint_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/siem/endpoint/{siem_endpoint_id} — Delete Siem Endpoint

**Endpoint**: `DELETE /v1/siem/endpoint/{siem_endpoint_id}`
**Summary**: Delete Siem Endpoint
**Tags**: siem

**Parameters**:
- `siem_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/siem/endpoint/configuration — Update Siem Configuration

**Endpoint**: `PUT /v1/siem/endpoint/configuration`
**Summary**: Update Siem Configuration
**Tags**: siem

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/siem/endpoint/{siem_endpoint_id}/configuration — Get Siem Endpoint Configuration

**Endpoint**: `GET /v1/siem/endpoint/{siem_endpoint_id}/configuration`
**Summary**: Get Siem Endpoint Configuration
**Tags**: siem

**Parameters**:
- `siem_endpoint_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/siem/endpoint/{siem_endpoint_id}/configuration — Delete Siem Endpoint Configuration

**Endpoint**: `DELETE /v1/siem/endpoint/{siem_endpoint_id}/configuration`
**Summary**: Delete Siem Endpoint Configuration
**Tags**: siem

**Parameters**:
- `siem_endpoint_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/siem/endpoint/configurations — Get Siem Endpoint Configurations

**Endpoint**: `GET /v1/siem/endpoint/configurations`
**Summary**: Get Siem Endpoint Configurations
**Tags**: siem

Get all the configurations for the customer's SIEM endpoints. When queried with project or organization id,
still returns all of the endpoint configurations relevant for that project or organization

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `incident` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/siem/customer/{customer_id}/endpoints —  Get Siem Endpoints

**Endpoint**: `GET /v1/siem/customer/{customer_id}/endpoints`
**Summary**:  Get Siem Endpoints
**Tags**: siem

**Parameters**:
- `customer_id` (path, required): 
- `incident` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id} —  Patch Siem Endpoint

**Endpoint**: `PATCH /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}`
**Summary**:  Patch Siem Endpoint
**Tags**: siem

**Parameters**:
- `customer_id` (path, required): 
- `siem_endpoint_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id} —  Delete Siem Endpoint

**Endpoint**: `DELETE /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}`
**Summary**:  Delete Siem Endpoint
**Tags**: siem

**Parameters**:
- `customer_id` (path, required): 
- `siem_endpoint_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}/configuration —  Get Siem Endpoint Configuration

**Endpoint**: `GET /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}/configuration`
**Summary**:  Get Siem Endpoint Configuration
**Tags**: siem

**Parameters**:
- `customer_id` (path, required): 
- `siem_endpoint_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}/configuration —  Delete Siem Endpoint Configuration

**Endpoint**: `DELETE /v1/siem/customer/{customer_id}/endpoint/{siem_endpoint_id}/configuration`
**Summary**:  Delete Siem Endpoint Configuration
**Tags**: siem

**Parameters**:
- `customer_id` (path, required): 
- `siem_endpoint_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/siem/customer/{customer_id}/endpoint/configurations —  Get Siem Endpoint Configurations

**Endpoint**: `GET /v1/siem/customer/{customer_id}/endpoint/configurations`
**Summary**:  Get Siem Endpoint Configurations
**Tags**: siem

Get all the configurations for the customer's SIEM endpoints. When queried with project or organization id,
still returns all of the endpoint configurations relevant for that project or organization

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `incident` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
