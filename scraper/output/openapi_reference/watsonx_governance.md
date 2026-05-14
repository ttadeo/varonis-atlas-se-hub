# watsonx-governance API Endpoints

## GET /v1/watsonx-governance/{watsonx_governance_integration_id} —  Get Watsonx Governance Integration

**Endpoint**: `GET /v1/watsonx-governance/{watsonx_governance_integration_id}`
**Summary**:  Get Watsonx Governance Integration
**Tags**: watsonx-governance

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/watsonx-governance/{watsonx_governance_integration_id} —  Patch Watsonx Governance Integration

**Endpoint**: `PATCH /v1/watsonx-governance/{watsonx_governance_integration_id}`
**Summary**:  Patch Watsonx Governance Integration
**Tags**: watsonx-governance

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/watsonx-governance/{watsonx_governance_integration_id} —  Delete Watsonx Governance Integration

**Endpoint**: `DELETE /v1/watsonx-governance/{watsonx_governance_integration_id}`
**Summary**:  Delete Watsonx Governance Integration
**Tags**: watsonx-governance

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/watsonx-governance —  Get Watsonx Governance Integrations

**Endpoint**: `GET /v1/watsonx-governance`
**Summary**:  Get Watsonx Governance Integrations
**Tags**: watsonx-governance

**Responses**:
- `200`: Successful Response

---

## POST /v1/watsonx-governance —  Create Watsonx Governance Integration

**Endpoint**: `POST /v1/watsonx-governance`
**Summary**:  Create Watsonx Governance Integration
**Tags**: watsonx-governance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/watsonx-governance/sync —  Sync Watsonx Governance Integration

**Endpoint**: `POST /v1/watsonx-governance/sync`
**Summary**:  Sync Watsonx Governance Integration
**Tags**: watsonx-governance

Synchronize the WatsonX Governance integration for a customer.

**Parameters**:
- `watsonx_governance_integration_id` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/watsonx-governance/sync/{watsonx_governance_integration_id} —  Sync Watsonx Governance Integration

**Endpoint**: `POST /v1/watsonx-governance/sync/{watsonx_governance_integration_id}`
**Summary**:  Sync Watsonx Governance Integration
**Tags**: watsonx-governance

Synchronize the WatsonX Governance integration for a customer.

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/watsonx-governance/sync-job —  Sync Job Watsonx Governance Integration

**Endpoint**: `POST /v1/watsonx-governance/sync-job`
**Summary**:  Sync Job Watsonx Governance Integration
**Tags**: watsonx-governance

Initiate a job to run in the background to initiate a discovery scan. Will run in the background, and
return a job_id that a caller can use for polling.

**Parameters**:
- `watsonx_governance_integration_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/watsonx-governance/sync-job/{watsonx_governance_integration_id} —  Sync Job Watsonx Governance Integration

**Endpoint**: `POST /v1/watsonx-governance/sync-job/{watsonx_governance_integration_id}`
**Summary**:  Sync Job Watsonx Governance Integration
**Tags**: watsonx-governance

Initiate a job to run in the background to initiate a discovery scan. Will run in the background, and
return a job_id that a caller can use for polling.

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/watsonx-governance/job-status/{job_id} — Get Governance Job Status

**Endpoint**: `GET /v1/watsonx-governance/job-status/{job_id}`
**Summary**: Get Governance Job Status
**Tags**: watsonx-governance

Get the status of a job that was initiated to run a watsonx governance scan.

**Parameters**:
- `job_id` (path, required): The unique identifier of the governance job

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/watsonx-governance/integration_resources/{watsonx_governance_integration_id} — Delete all the remote existing governance resources

**Endpoint**: `DELETE /v1/watsonx-governance/integration_resources/{watsonx_governance_integration_id}`
**Summary**: Delete all the remote existing governance resources
**Tags**: watsonx-governance

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/watsonx-governance/test-connection/{watsonx_governance_integration_id} — Tests the connection of a governance integration

**Endpoint**: `POST /v1/watsonx-governance/test-connection/{watsonx_governance_integration_id}`
**Summary**: Tests the connection of a governance integration
**Tags**: watsonx-governance

**Parameters**:
- `watsonx_governance_integration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
