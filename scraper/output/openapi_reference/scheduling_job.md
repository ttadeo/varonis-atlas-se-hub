# Atlas API — scheduling-job

## POST /v1/scheduling-jobs/{customer_id}/jobs — Post Job

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs`
**Summary**: Post Job
**Tags**: scheduling-job, internal

Created a new scheduled job for a customer.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/scheduling-jobs/{customer_id}/jobs — Get Jobs

**Endpoint**: `GET /v1/scheduling-jobs/{customer_id}/jobs`
**Summary**: Get Jobs
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_types` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/scheduling-jobs/{customer_id}/jobs/{job_id} — Patch Job

**Endpoint**: `PATCH /v1/scheduling-jobs/{customer_id}/jobs/{job_id}`
**Summary**: Patch Job
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/scheduling-jobs/{customer_id}/jobs/{job_id} — Delete Job

**Endpoint**: `DELETE /v1/scheduling-jobs/{customer_id}/jobs/{job_id}`
**Summary**: Delete Job
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 
- `deleted_by` (query, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules — Post Schedule

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules`
**Summary**: Post Schedule
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules/sync — Sync Schedules

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules/sync`
**Summary**: Sync Schedules
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id} — Patch Schedule

**Endpoint**: `PATCH /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id}`
**Summary**: Patch Schedule
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `schedule_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id} — Delete Schedule

**Endpoint**: `DELETE /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id}`
**Summary**: Delete Schedule
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `schedule_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/scheduling-jobs/{customer_id}/pentest_scan_schedule/{schedule_id} — Edit Pentest Scan Schedule

**Endpoint**: `PATCH /v1/scheduling-jobs/{customer_id}/pentest_scan_schedule/{schedule_id}`
**Summary**: Edit Pentest Scan Schedule
**Tags**: scheduling-job

Updates a customer's scheduled job by modifying its timing and associated scan template.
If a template ID is provided, the job's endpoint is updated;
otherwise, a new template is created and assigned.

**Parameters**:
- `customer_id` (path, required): 
- `schedule_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/executions — Get Job Executions

**Endpoint**: `GET /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/executions`
**Summary**: Get Job Executions
**Tags**: scheduling-job

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 
- `job_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
