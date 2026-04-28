# data-plane API Endpoints

## POST /v1/data-plane/registrations - Register Data Plane 

**Endpoint**: `POST /v1/data-plane/registrations`
**Summary**: Register Data Plane 
**Tags**: data-plane

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations - List Data Plane Registrations

**Endpoint**: `GET /v1/data-plane/registrations`
**Summary**: List Data Plane Registrations
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (query, optional): 
- `is_opensearch_logs_sink` (query, optional): 
- `is_llm_pentest_target` (query, optional): Filter registrations by whether they are marked as the LLM pentest target.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/{data_plane_account_id} - List Data Plane Registrations

**Endpoint**: `GET /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: List Data Plane Registrations
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 
- `is_opensearch_logs_sink` (query, optional): 
- `is_llm_pentest_target` (query, optional): Filter registrations by whether they are marked as the LLM pentest target.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/data-plane/registrations/{data_plane_account_id} - Update Data Plane Registration 

**Endpoint**: `PATCH /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: Update Data Plane Registration 
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/data-plane/registrations/{data_plane_account_id} - Delete Data Plane Registration 

**Endpoint**: `DELETE /v1/data-plane/registrations/{data_plane_account_id}`
**Summary**: Delete Data Plane Registration 
**Tags**: data-plane

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/registrations/{data_plane_account_id}/set-control-plane-dek - Set Control Plane Dek

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

## POST /v1/data-plane/registrations/{data_plane_account_id}/set-opensearch-logs-sink - Set Registration As Sink For Opensearch Logs

**Endpoint**: `POST /v1/data-plane/registrations/{data_plane_account_id}/set-opensearch-logs-sink`
**Summary**: Set Registration As Sink For Opensearch Logs
**Tags**: data-plane

Set a particular data plane registration location of Opensearch logs to sync to dataplane.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/registrations/{data_plane_account_id}/set-llm-pentest-target - Set Registration As Llm Pentest Target

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

## GET /v1/data-plane/registrations/{data_plane_account_id}/cfn-template -  Get Customer Plane Cfn Template

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

## GET /v1/data-plane/registrations/azure/{subscription_id}/arm-template -  Get Customer Plane Arm Template

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

## PUT /v1/data-plane/registrations/{data_plane_account_id}/service-status - Update Data Plane Service Status 

**Endpoint**: `PUT /v1/data-plane/registrations/{data_plane_account_id}/service-status`
**Summary**: Update Data Plane Service Status 
**Tags**: data-plane

Record or update the service status for a customer's data plane.

**Parameters**:
- `data_plane_account_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/data-plane/registrations/{data_plane_account_id}/service-status - Get Data Plane Service Status 

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

## GET /v1/data-plane/opensearch/configurations/{data_plane_account_id} - Get Opensearch Configurations With Tabs

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

## GET /v1/data-plane/opensearch/configurations - Get Opensearch Configurations With Tabs

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

## POST /v1/data-plane/opensearch/configurations - Add Opensearch Configuration With Tabs

**Endpoint**: `POST /v1/data-plane/opensearch/configurations`
**Summary**: Add Opensearch Configuration With Tabs
**Tags**: data-plane, admin

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/data-plane/cfn-status - Receive Cfn Status

**Endpoint**: `POST /v1/data-plane/cfn-status`
**Summary**: Receive Cfn Status
**Tags**: data-plane

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
