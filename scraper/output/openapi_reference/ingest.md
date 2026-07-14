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
- `resource_type_id` (query, optional): Filter to a single resource type (e.g. AnthropicOtelLogSource).
- `parent_configuration_id` (query, optional): Filter to children of a top-level configuration (Compliance backfills).
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

## GET /v1/ingest/configurations/{configuration_id}/destination — Get Ingest Configuration Destination

**Endpoint**: `GET /v1/ingest/configurations/{configuration_id}/destination`
**Summary**: Get Ingest Configuration Destination
**Tags**: ingest

Return Claude Console setup values for an Anthropic OTEL configuration.

Uses the ``write`` rate-limit tier despite being a GET — the response
body carries a plaintext credential (the OTEL API key from
SecretRouter), so the ``read`` tier (30/sec, 600/min) would let a
token holder extract long-lived credential material via repeated
requests. ``with_internal_customer_context`` is required to set up
the customer-scoped encryption context the SecretRouter relies on
when decrypting the plaintext key.

Only Anthropic OTEL rows produce a destination payload today; other
log-source types return 400.

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

## POST /v1/ingest/anthropic-otel/authenticate — Authenticate Anthropic Otel

**Endpoint**: `POST /v1/ingest/anthropic-otel/authenticate`
**Summary**: Authenticate Anthropic Otel
**Tags**: ingest

Resolve an Anthropic OTEL configuration identity for a data plane.

Authenticated as a data-plane callback via the same JWT contract used
by the Anthropic Compliance puller's callbacks, and always scoped to the
token's ``customer_id`` so a caller on tenant X can never resolve a
configuration belonging to tenant Y. The collector supplies ``key_hash``
to narrow to its exact key; the ingestion worker omits it and resolves
the data plane's single OTEL configuration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/bedrock-invocation-log-configurations/polling-targets — List Polling Targets

**Endpoint**: `GET /v1/ingest/bedrock-invocation-log-configurations/polling-targets`
**Summary**: List Polling Targets
**Tags**: ingest

List every active Bedrock invocation log configuration the rule-processor data-plane worker should poll. Each item carries the assumed-role ARN, discovered bucket name + key prefix, region, and cursor state so the worker can issue an S3 ListObjects against the customer's bucket without a second round-trip. Internal callback authenticated via the data-plane JWT; results are scoped to the caller's customer_id.

**Responses**:
- `200`: Successful Response

---

## GET /v1/ingest/bedrock-invocation-log-configurations/eligible-regions — List Eligible Regions

**Endpoint**: `GET /v1/ingest/bedrock-invocation-log-configurations/eligible-regions`
**Summary**: List Eligible Regions
**Tags**: ingest

Probe one customer-connected AWS account across all Bedrock-supported regions and return only those where ``bedrock:GetModelInvocationLoggingConfiguration`` reports an S3 destination. Used by the Admin Console integration picker to scope the region dropdown to actually-ingestable combinations. Authenticated via the data-plane JWT (``token_customer_id``); the account ARN is validated up front (preflight assume-role), so a broken trust policy surfaces as 4xx rather than a silent empty list.

**Parameters**:
- `cloud_provider_account_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/ingest/bedrock-invocation-log-configurations/{configuration_id}/cursor — Update Polling Cursor

**Endpoint**: `PATCH /v1/ingest/bedrock-invocation-log-configurations/{configuration_id}/cursor`
**Summary**: Update Polling Cursor
**Tags**: ingest

Persist the cursor + lifecycle state reported by the rule-processor polling worker after one iteration. Advances ``last_synced_at`` (always the LastModified of the most recent successfully-copied object) and, for backfill rows whose ``end_time`` has passed, transitions status to ``completed``. Internal callback authenticated via the data-plane JWT; request is scoped to the caller's customer_id.

**Parameters**:
- `configuration_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/ingest/bedrock-invocation-log-configurations/{configuration_id}/customer-credentials — Issue Customer Credentials

**Endpoint**: `POST /v1/ingest/bedrock-invocation-log-configurations/{configuration_id}/customer-credentials`
**Summary**: Issue Customer Credentials
**Tags**: ingest

Mint short-lived STS credentials for the rule-processor Bedrock fetcher scoped to one Bedrock invocation log configuration. The data-plane worker runs in the customer-plane AWS account and cannot assume the customer's scan role directly — that role's trust policy only allows the control plane. cp performs the AssumeRole on the worker's behalf and returns the credentials in snake_case (``access_key_id``/``secret_access_key``/``session_token``/``expiration``) to match the rest of cp's public API; the worker maps them back to the camel-cased keys botocore expects when constructing a boto3 Session. Internal callback authenticated via the data-plane JWT; request is scoped to the caller's customer_id.

**Parameters**:
- `configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ingest/varonis-saas-configurations/polling-targets — List Polling Targets

**Endpoint**: `GET /v1/ingest/varonis-saas-configurations/polling-targets`
**Summary**: List Polling Targets
**Tags**: ingest

List every active Varonis SaaS prompt ingest configuration the rule-processor data-plane worker should poll. Each item carries the DAC tenant endpoint URL, the API-key secret reference, the DAC ``dataSource.type`` filter, and cursor state so the worker can export events without a second round-trip. Internal callback authenticated via the data-plane JWT; results are scoped to the caller's customer_id.

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/ingest/varonis-saas-configurations/{configuration_id}/cursor — Update Polling Cursor

**Endpoint**: `PATCH /v1/ingest/varonis-saas-configurations/{configuration_id}/cursor`
**Summary**: Update Polling Cursor
**Tags**: ingest

Persist the cursor + lifecycle state reported by the rule-processor polling worker after one iteration. Advances ``cursor`` / ``last_synced_at`` (the watermark of the most recent successfully exported window) and, for backfill rows whose ``end_time`` has passed, transitions status to ``completed``. Internal callback authenticated via the data-plane JWT; request is scoped to the caller's customer_id.

**Parameters**:
- `configuration_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
