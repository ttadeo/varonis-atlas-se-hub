# dac-exports API Endpoints

## GET /v1/dac-exports/config — Get Dac Config

**Endpoint**: `GET /v1/dac-exports/config`
**Summary**: Get Dac Config
**Tags**: dac-exports

Return the current DAC exports config. 404 if not yet configured.

**Responses**:
- `200`: Successful Response

---

## PUT /v1/dac-exports/config — Upsert Dac Config

**Endpoint**: `PUT /v1/dac-exports/config`
**Summary**: Upsert Dac Config
**Tags**: dac-exports

Create or fully replace the DAC exports config. Resets last_export_at.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/dac-exports/config — Patch Dac Config

**Endpoint**: `PATCH /v1/dac-exports/config`
**Summary**: Patch Dac Config
**Tags**: dac-exports

Partially update the DAC exports config (used by ingestion to advance the cursor).

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
