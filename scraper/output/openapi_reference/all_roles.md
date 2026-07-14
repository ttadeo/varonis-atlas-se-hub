# all-roles API Endpoints

## POST /v1/docs/export — Start a documentation export job

**Endpoint**: `POST /v1/docs/export`
**Summary**: Start a documentation export job
**Tags**: all-roles

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/docs/export/status/{job_id} — Docs export job status

**Endpoint**: `GET /v1/docs/export/status/{job_id}`
**Summary**: Docs export job status
**Tags**: all-roles

Poll a docs export job. On COMPLETED, the result (s3_key) is returned only
if the exported file belongs to the caller's customer (404 otherwise).

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/docs/export/presigned_file_in_cloud — Presigned download URL for a docs export

**Endpoint**: `POST /v1/docs/export/presigned_file_in_cloud`
**Summary**: Presigned download URL for a docs export
**Tags**: all-roles

Presign a docs-export file for download. Only files under the caller's
own customer docs-export prefix are presignable (404 otherwise).

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---
