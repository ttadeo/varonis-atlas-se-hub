# internal API Endpoints

## GET /v1/internal/microservice-settings —  Get Microservice Settings

**Endpoint**: `GET /v1/internal/microservice-settings`
**Summary**:  Get Microservice Settings
**Tags**: internal

Get microservice settings for all microservices

**Responses**:
- `200`: Successful Response

---

## PUT /v1/internal/microservice-settings —  Update Microservice Setting

**Endpoint**: `PUT /v1/internal/microservice-settings`
**Summary**:  Update Microservice Setting
**Tags**: internal

Update microservice setting to run on dataplane or not

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/internal/microservice-settings/capabilities — Report which debugging-surface operator controls are available here

**Endpoint**: `GET /v1/internal/microservice-settings/capabilities`
**Summary**: Report which debugging-surface operator controls are available here
**Tags**: internal

Which operator controls the UI should render. Env-derived, not
customer-specific — e.g. the dataplane-target switch is playground-only, so
the UI reads this instead of probing the gated endpoint.

**Responses**:
- `200`: Successful Response

---

## GET /v1/internal/microservice-settings/dataplane-target —  Get Dataplane Target

**Endpoint**: `GET /v1/internal/microservice-settings/dataplane-target`
**Summary**:  Get Dataplane Target
**Tags**: internal

Playground only: which cloud (AWS/Azure) the job topic currently targets.

**Responses**:
- `200`: Successful Response

---

## PUT /v1/internal/microservice-settings/dataplane-target —  Set Dataplane Target

**Endpoint**: `PUT /v1/internal/microservice-settings/dataplane-target`
**Summary**:  Set Dataplane Target
**Tags**: internal

Playground only: repoint the job topic at the AWS or Azure ARN (from SSM).

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/internal/session-policy/alerts —  Post Session Policy Callback

**Endpoint**: `POST /v1/internal/session-policy/alerts`
**Summary**:  Post Session Policy Callback
**Tags**: internal

Receive a session-policy evaluation callback and persist alerts.

Sync handler by design: delegates to a sync service that runs SQLAlchemy
queries, a row-level ``SELECT ... FOR UPDATE``, and a savepoint. Running
those under ``async def`` with a sync session blocks the event loop;
using plain ``def`` lets FastAPI dispatch to the threadpool.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /verify-connection — Verify Connection

**Endpoint**: `GET /verify-connection`
**Summary**: Verify Connection
**Tags**: internal

**Responses**:
- `200`: Successful Response

---

## GET /openapi/external — Get Openapi For External Tag

**Endpoint**: `GET /openapi/external`
**Summary**: Get Openapi For External Tag
**Tags**: internal, all-roles

**Responses**:
- `200`: Successful Response

---
