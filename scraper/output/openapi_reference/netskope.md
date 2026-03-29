# Atlas API — netskope

## GET /v1/netskope/{netskope_credential_id} —  Get Netskope Integration

**Endpoint**: `GET /v1/netskope/{netskope_credential_id}`
**Summary**:  Get Netskope Integration
**Tags**: netskope

**Parameters**:
- `netskope_credential_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/netskope/{netskope_credential_id} —  Patch Netskope Integration

**Endpoint**: `PATCH /v1/netskope/{netskope_credential_id}`
**Summary**:  Patch Netskope Integration
**Tags**: netskope

**Parameters**:
- `netskope_credential_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/netskope/{netskope_credential_id} —  Delete Netskope Integration

**Endpoint**: `DELETE /v1/netskope/{netskope_credential_id}`
**Summary**:  Delete Netskope Integration
**Tags**: netskope

**Parameters**:
- `netskope_credential_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/netskope —  Get Netskope Integrations

**Endpoint**: `GET /v1/netskope`
**Summary**:  Get Netskope Integrations
**Tags**: netskope

**Responses**:
- `200`: Successful Response

---

## POST /v1/netskope —  Create Netskope Integration

**Endpoint**: `POST /v1/netskope`
**Summary**:  Create Netskope Integration
**Tags**: netskope

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/netskope/test-connection/{netskope_credential_id} — Tests the connection of a netskope integration

**Endpoint**: `POST /v1/netskope/test-connection/{netskope_credential_id}`
**Summary**: Tests the connection of a netskope integration
**Tags**: netskope

**Parameters**:
- `netskope_credential_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
