# Atlas API — pull-requests

## GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/commands — Get Pull Request Commands For Issue

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/commands`
**Summary**: Get Pull Request Commands For Issue
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/commands — Get Pull Request Commands For Resource Instance

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/commands`
**Summary**: Get Pull Request Commands For Resource Instance
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/pull-requests/customer/{customer_id}/commands — Execute Pull Request Commands

**Endpoint**: `POST /v1/pull-requests/customer/{customer_id}/commands`
**Summary**: Execute Pull Request Commands
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `internal_access` (query, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/pull-request/{pull_request_id} — Get Pull Request

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/pull-request/{pull_request_id}`
**Summary**: Get Pull Request
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `pull_request_id` (path, required): 
- `internal_access` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/pull-requests — Get Pull Requests For Issue

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/pull-requests`
**Summary**: Get Pull Requests For Issue
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `issue_id` (path, required): 
- `internal_access` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/pull-requests — Get Pull Requests For Resource Instance

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/pull-requests`
**Summary**: Get Pull Requests For Resource Instance
**Tags**: pull-requests

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `internal_access` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
