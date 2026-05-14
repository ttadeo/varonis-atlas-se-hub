# prompt-reporting API Endpoints

## POST /v1/prompt-reporting/batches/initiate — Initiate Prompt Reporting Batch

**Endpoint**: `POST /v1/prompt-reporting/batches/initiate`
**Summary**: Initiate Prompt Reporting Batch
**Tags**: prompt-reporting

**Responses**:
- `201`: Successful Response

---

## POST /v1/prompt-reporting/batches/submit — Submit Prompt Reporting Batch

**Endpoint**: `POST /v1/prompt-reporting/batches/submit`
**Summary**: Submit Prompt Reporting Batch
**Tags**: prompt-reporting

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---
