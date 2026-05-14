# ci-cd API Endpoints

## POST /v1/ci-cd/jobs — Create a CI/CD check job

**Endpoint**: `POST /v1/ci-cd/jobs`
**Summary**: Create a CI/CD check job
**Tags**: ci-cd, internal

Start a new CI/CD job based on the provided request details.

**Parameters**:
- `request` (query, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/ci-cd/jobs/{job_id} — Get the status of a CI/CD check job

**Endpoint**: `GET /v1/ci-cd/jobs/{job_id}`
**Summary**: Get the status of a CI/CD check job
**Tags**: ci-cd, internal

Get the status of a CI/CD job

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
