# report API Endpoints

## POST /v1/report/presigned_file_in_cloud — Post Presigned File In Cloud

**Endpoint**: `POST /v1/report/presigned_file_in_cloud`
**Summary**: Post Presigned File In Cloud
**Tags**: report

Presigned File in Cloud

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/report/jupyter-notebook-vulnerabilities/versions — Get Jupyter Notebook Vulnerabilities Versions

**Endpoint**: `GET /v1/report/jupyter-notebook-vulnerabilities/versions`
**Summary**: Get Jupyter Notebook Vulnerabilities Versions
**Tags**: report

Get the versions of the Jupyter Notebook vulnerabilities

**Parameters**:
- `customer_id` (query, required): 
- `project_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/report/customer/{customer_id}/jupyter-notebook-vulnerabilities — Create Report For Notebook Vulnerabilities

**Endpoint**: `POST /v1/report/customer/{customer_id}/jupyter-notebook-vulnerabilities`
**Summary**: Create Report For Notebook Vulnerabilities
**Tags**: report, posture-management

Create a report for notebook vulnerabilities

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/report/customer/{customer_id}/tprm/vendor/{vendor_id}/generate-report — Create Report For Vendor Tprm

**Endpoint**: `POST /v1/report/customer/{customer_id}/tprm/vendor/{vendor_id}/generate-report`
**Summary**: Create Report For Vendor Tprm
**Tags**: report

Create a report for vendor TPRM

**Parameters**:
- `customer_id` (path, required): 
- `vendor_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/report/gateway-prompts/filter-options — Get Gateway Prompts Filter Options

**Endpoint**: `GET /v1/report/gateway-prompts/filter-options`
**Summary**: Get Gateway Prompts Filter Options
**Tags**: report

**Parameters**:
- `scope` (query, required): 
- `created_at_from` (query, required): 
- `created_at_to` (query, required): 
- `project_id` (query, optional): 
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/report/export — Export Data Async

**Endpoint**: `POST /v1/report/export`
**Summary**: Export Data Async
**Tags**: report

Async export endpoint — returns a job ID to poll via GET /v1/report/job-status/{job_id}.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/report/ai-validation-sandbox/{ai_validation_sandbox_id}/generate-report — Create Report For Ai Validation Sandbox

**Endpoint**: `POST /v1/report/ai-validation-sandbox/{ai_validation_sandbox_id}/generate-report`
**Summary**: Create Report For Ai Validation Sandbox
**Tags**: report

Create a report for AI Validation Sandbox

**Parameters**:
- `ai_validation_sandbox_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/report/job-status/{job_id} — Get Report Job Status

**Endpoint**: `GET /v1/report/job-status/{job_id}`
**Summary**: Get Report Job Status
**Tags**: report

Get the status of a job that was initiated to run a report generation.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
