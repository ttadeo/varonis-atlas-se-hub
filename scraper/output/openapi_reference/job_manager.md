# Atlas API — job-manager

## POST /v1/job-manager/jobs — Create Job

**Endpoint**: `POST /v1/job-manager/jobs`
**Summary**: Create Job
**Tags**: job-manager

Create a job for a given customer/service.

If idempotency_key is provided and matches an existing job, this is an
idempotent replay and created=False.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/job-manager/jobs/{job_id} — Get Job

**Endpoint**: `GET /v1/job-manager/jobs/{job_id}`
**Summary**: Get Job
**Tags**: job-manager

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/job-manager/jobs/{job_id}/timeline — Get Job Timeline

**Endpoint**: `GET /v1/job-manager/jobs/{job_id}/timeline`
**Summary**: Get Job Timeline
**Tags**: job-manager

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/job-manager/jobs/cancel — Cancel Job

**Endpoint**: `POST /v1/job-manager/jobs/cancel`
**Summary**: Cancel Job
**Tags**: job-manager

simple cancel:
- If terminal (SUCCEEDED/FAILED/CANCELLED) -> noop, just return current status
- Otherwise mark as CANCELLED with a reason.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/job-manager/worker/start — Worker Claim And Start

**Endpoint**: `POST /v1/job-manager/worker/start`
**Summary**: Worker Claim And Start
**Tags**: job-manager, worker

Transition QUEUED -> RUNNING for a given job_id.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/job-manager/worker/heartbeat — Worker Heartbeat

**Endpoint**: `POST /v1/job-manager/worker/heartbeat`
**Summary**: Worker Heartbeat
**Tags**: job-manager, worker

Extend lease for RUNNING job if claim_id is still valid.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/job-manager/worker/complete — Worker Complete

**Endpoint**: `POST /v1/job-manager/worker/complete`
**Summary**: Worker Complete
**Tags**: job-manager, worker

Mark job as SUCCEEDED if (job_id, claim_id) still owns it.

Implementation is idempotent:
- If already SUCCEEDED, service layer returns the job as-is.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/job-manager/worker/fail — Worker Fail

**Endpoint**: `POST /v1/job-manager/worker/fail`
**Summary**: Worker Fail
**Tags**: job-manager, worker

Mark job as FAILED or requeue it depending on attempts/max_attempts.

- Guards on (job_id, claim_id)
- When retrying, status will be QUEUED and claim_id reset to NULL.
- When terminal, status will be FAILED and completed_at set.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
