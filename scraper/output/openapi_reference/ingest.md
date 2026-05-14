# ingest API Endpoints

## POST /v1/ingest/jobs — Create Ingest Job

**Endpoint**: `POST /v1/ingest/jobs`
**Summary**: Create Ingest Job
**Tags**: ingest

**Request Body**: Required
- Content-Type: `application/json`

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
- `include_children` (query, optional): When set with `configuration_id`, also include jobs whose configuration's parent_configuration_id points at the given config. Used by the Anthropic backfills tab so a parent card shows jobs from all its child backfills. Default off so the existing single-config contract is unchanged.
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

**Parameters**:
- `data_plane_account_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: No pending ingest jobs
- `422`: Validation Error

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

**Request Body**: Required
- Content-Type: `application/json`

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

## POST /v1/ingest/anthropic-compliance-configurations — Create Anthropic Compliance Configuration

**Endpoint**: `POST /v1/ingest/anthropic-compliance-configurations`
**Summary**: Create Anthropic Compliance Configuration
**Tags**: ingest

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/anthropic-compliance-configurations — List Anthropic Compliance Configurations

**Endpoint**: `GET /v1/ingest/anthropic-compliance-configurations`
**Summary**: List Anthropic Compliance Configurations
**Tags**: ingest

**Parameters**:
- `parent_configuration_id` (query, optional): Filter to children of a specific live-sync configuration (used by the Backfills tab). Omit to list every configuration.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/anthropic-compliance-configurations/{configuration_id} — Get Anthropic Compliance Configuration

**Endpoint**: `GET /v1/ingest/anthropic-compliance-configurations/{configuration_id}`
**Summary**: Get Anthropic Compliance Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ingest/anthropic-compliance-configurations/{configuration_id} — Patch Anthropic Compliance Configuration

**Endpoint**: `PATCH /v1/ingest/anthropic-compliance-configurations/{configuration_id}`
**Summary**: Patch Anthropic Compliance Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ingest/anthropic-compliance-configurations/{configuration_id} — Delete Anthropic Compliance Configuration

**Endpoint**: `DELETE /v1/ingest/anthropic-compliance-configurations/{configuration_id}`
**Summary**: Delete Anthropic Compliance Configuration
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/anthropic-compliance-configurations/jobs/next — Next Anthropic Job

**Endpoint**: `GET /v1/ingest/anthropic-compliance-configurations/jobs/next`
**Summary**: Next Anthropic Job
**Tags**: ingest

**Parameters**:
- `data_plane_account_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ingest/anthropic-compliance-configurations/{configuration_id}/jobs — Complete Anthropic Job

**Endpoint**: `PATCH /v1/ingest/anthropic-compliance-configurations/{configuration_id}/jobs`
**Summary**: Complete Anthropic Job
**Tags**: ingest

**Parameters**:
- `configuration_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
