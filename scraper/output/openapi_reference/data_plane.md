# Atlas API — data-plane

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

## GET /v1/data-plane/opensearch/configurations/{data_plane_account_id} — Get Opensearch Configurations With Tabs

**Endpoint**: `GET /v1/data-plane/opensearch/configurations/{data_plane_account_id}`
**Summary**: Get Opensearch Configurations With Tabs
**Tags**: data-plane, admin

**Parameters**:
- `data_plane_account_id` (path, required): 
- `is_opensearch_logs_sink` (query, optional): Filter configurations by whether they are associated with the Opensearch logs sink.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/opensearch/configurations — Get Opensearch Configurations With Tabs

**Endpoint**: `GET /v1/data-plane/opensearch/configurations`
**Summary**: Get Opensearch Configurations With Tabs
**Tags**: data-plane, admin

**Parameters**:
- `data_plane_account_id` (query, optional): 
- `is_opensearch_logs_sink` (query, optional): Filter configurations by whether they are associated with the Opensearch logs sink.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/opensearch/configurations — Add Opensearch Configuration With Tabs

**Endpoint**: `POST /v1/data-plane/opensearch/configurations`
**Summary**: Add Opensearch Configuration With Tabs
**Tags**: data-plane, admin

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---
