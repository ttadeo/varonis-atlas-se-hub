# Atlas API — ingest

## POST /v1/ingest/jobs — Create Ingest Job

**Endpoint**: `POST /v1/ingest/jobs`
**Summary**: Create Ingest Job
**Tags**: ingest

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/jobs — List Ingest Jobs

**Endpoint**: `GET /v1/ingest/jobs`
**Summary**: List Ingest Jobs
**Tags**: ingest

**Parameters**:
- `configuration_id` (query, optional): 
- `after_id` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/jobs/next — Next Ingest Job

**Endpoint**: `GET /v1/ingest/jobs/next`
**Summary**: Next Ingest Job
**Tags**: ingest

**Responses**:
- `200`: Successful Response
- `404`: No pending ingest jobs

---

## GET /v1/ingest/jobs/{job_id} — Get Ingest Job

**Endpoint**: `GET /v1/ingest/jobs/{job_id}`
**Summary**: Get Ingest Job
**Tags**: ingest

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ingest/jobs/{job_id} — Patch Ingest Job

**Endpoint**: `PATCH /v1/ingest/jobs/{job_id}`
**Summary**: Patch Ingest Job
**Tags**: ingest

**Parameters**:
- `job_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ingest/jobs/{job_id} — Delete Ingest Job

**Endpoint**: `DELETE /v1/ingest/jobs/{job_id}`
**Summary**: Delete Ingest Job
**Tags**: ingest

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/ingest/configurations — Create Ingest Configuration

**Endpoint**: `POST /v1/ingest/configurations`
**Summary**: Create Ingest Configuration
**Tags**: ingest

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/configurations — List Ingest Configurations

**Endpoint**: `GET /v1/ingest/configurations`
**Summary**: List Ingest Configurations
**Tags**: ingest

**Parameters**:
- `after_id` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/configurations/{configuration_id} — Get Ingest Configuration

**Endpoint**: `GET /v1/ingest/configurations/{configuration_id}`
**Summary**: Get Ingest Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ingest/configurations/{configuration_id} — Patch Ingest Configuration

**Endpoint**: `PATCH /v1/ingest/configurations/{configuration_id}`
**Summary**: Patch Ingest Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ingest/configurations/{configuration_id} — Delete Ingest Configuration

**Endpoint**: `DELETE /v1/ingest/configurations/{configuration_id}`
**Summary**: Delete Ingest Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
