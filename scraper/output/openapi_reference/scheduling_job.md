# scheduling-job API Endpoints

## POST /v1/scheduling-jobs/{customer_id}/jobs — Create a new scheduled job for a customer

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs`
**Summary**: Create a new scheduled job for a customer
**Tags**: scheduling-job, internal

Register a new recurring scheduled job for the customer, such as an LLM pentest scan or an AI validation recurring scan. The job type and its associated scan configuration are provided in the request body. A frequency is required for all supported job types. Use this to set up automated, recurring security scans on AI resources. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/scheduling-jobs/{customer_id}/jobs — List all scheduled jobs for a customer

**Endpoint**: `GET /v1/scheduling-jobs/{customer_id}/jobs`
**Summary**: List all scheduled jobs for a customer
**Tags**: scheduling-job

Return all scheduled jobs for the customer, each including its configuration and associated schedules. Optionally filter by one or more job types (e.g. LLM_PENTEST_SCAN, AI_VALIDATION_RECURRING_SCAN) using the job_types query parameter. Use this to inspect which automated scans are configured and their current scheduling state. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_types` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/scheduling-jobs/{customer_id}/jobs/{job_id} — Update a scheduled job's configuration or frequency

**Endpoint**: `PATCH /v1/scheduling-jobs/{customer_id}/jobs/{job_id}`
**Summary**: Update a scheduled job's configuration or frequency
**Tags**: scheduling-job

Modify an existing scheduled job's payload, scan configuration, or recurrence frequency. When the job's enabled state changes or its payload is updated, the underlying AWS EventBridge schedule is updated accordingly. Use this to change scan parameters or adjust how often a job recurs without recreating it. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/scheduling-jobs/{customer_id}/jobs/{job_id} — Delete a scheduled job and its schedule

**Endpoint**: `DELETE /v1/scheduling-jobs/{customer_id}/jobs/{job_id}`
**Summary**: Delete a scheduled job and its schedule
**Tags**: scheduling-job

Permanently mark a scheduled job as deleted and remove its associated AWS EventBridge schedule, stopping future executions. The job's associated schedule is also removed. This action is irreversible — the job will no longer run and cannot be re-enabled. Use with caution when decommissioning an automated scan. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 
- `deleted_by` (query, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules — Create a schedule for an existing scheduled job

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules`
**Summary**: Create a schedule for an existing scheduled job
**Tags**: scheduling-job

Add a cron-based schedule to an existing job, specifying the cron expression, frequency, start time, and optional end time. If the job is enabled, the schedule is immediately registered with AWS EventBridge to begin triggering the job at the specified cadence. Use this after creating a job to activate its recurrence. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules/sync — Re-sync a job's schedules with AWS EventBridge

**Endpoint**: `POST /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/schedules/sync`
**Summary**: Re-sync a job's schedules with AWS EventBridge
**Tags**: scheduling-job

Reconcile all schedules for a job against AWS EventBridge: removes any stale EventBridge entries and re-creates them from the stored schedule definitions. Use this to repair drift between the platform's schedule records and the cloud scheduler state, for example after an infrastructure incident or manual EventBridge change. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id} — Update an existing job schedule's timing

**Endpoint**: `PATCH /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id}`
**Summary**: Update an existing job schedule's timing
**Tags**: scheduling-job

Modify the cron expression, frequency, start time, or end time of an existing schedule. The corresponding AWS EventBridge schedule is updated immediately to reflect the new timing. If the new end time would fall before one full recurrence period, it is automatically adjusted forward. Use this to reschedule a job without deleting and recreating it. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `schedule_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Schedule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id} — Delete a job schedule and remove its cloud trigger

**Endpoint**: `DELETE /v1/scheduling-jobs/{customer_id}/schedules/{schedule_id}`
**Summary**: Delete a job schedule and remove its cloud trigger
**Tags**: scheduling-job

Remove the AWS EventBridge schedule entry for the given schedule and nullify its cloud ARN, stopping future automated executions for that schedule. The schedule record is retained for historical reference. Use this to permanently stop a specific recurrence without deleting the parent job. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `schedule_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Schedule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/executions — List execution history for a scheduled job

**Endpoint**: `GET /v1/scheduling-jobs/{customer_id}/jobs/{job_id}/executions`
**Summary**: List execution history for a scheduled job
**Tags**: scheduling-job

Return the execution history for a specific scheduled job, including each execution's status, start and end times, and failure details if applicable. Optionally filter by job type to include type-specific execution details such as LLM pentest scan outcome or AI validation scan status. Use this to audit past runs and diagnose failures. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `job_id` (path, required): 
- `job_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---
