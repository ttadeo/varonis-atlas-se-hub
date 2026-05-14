# general API Endpoints

## POST /v1/admin/get-secret —  Get Secret

**Endpoint**: `POST /v1/admin/get-secret`
**Summary**:  Get Secret

Get a secret for a customer.

Returns the secret value upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/set-secret —  Set Secret

**Endpoint**: `POST /v1/admin/set-secret`
**Summary**:  Set Secret

Set a secret for a customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/delete-secret —  Delete Secret

**Endpoint**: `POST /v1/admin/delete-secret`
**Summary**:  Delete Secret

Delete a secret for a customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/get-parameter —  Get Parameter

**Endpoint**: `POST /v1/admin/get-parameter`
**Summary**:  Get Parameter

Get a parameter for a customer.

Returns the parameter value upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
