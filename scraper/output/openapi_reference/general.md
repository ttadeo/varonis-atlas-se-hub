# general API Endpoints

## POST /v1/secrets/get-secret —  Get Secret

**Endpoint**: `POST /v1/secrets/get-secret`
**Summary**:  Get Secret

Get a secret for a customer.

Returns the secret value upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/secrets/set-secret —  Set Secret

**Endpoint**: `POST /v1/secrets/set-secret`
**Summary**:  Set Secret

Set a secret for a customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/secrets/delete-secret —  Delete Secret

**Endpoint**: `POST /v1/secrets/delete-secret`
**Summary**:  Delete Secret

Delete a secret for a customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/parameters/get-parameter —  Get Parameter

**Endpoint**: `POST /v1/parameters/get-parameter`
**Summary**:  Get Parameter

Get a parameter for a customer.

Returns the parameter value upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/policy-automations —  List Policy Automations

**Endpoint**: `GET /v1/policy-automations`
**Summary**:  List Policy Automations

List policy automations for the authenticated customer.

**Parameters**:
- `is_enabled` (query, optional): 
- `page` (query, optional): Page number
- `per_page` (query, optional): Items per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/policy-automations —  Create Policy Automation

**Endpoint**: `POST /v1/policy-automations`
**Summary**:  Create Policy Automation

Create a new policy automation.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/policy-automations/{automation_id} —  Update Policy Automation

**Endpoint**: `PATCH /v1/policy-automations/{automation_id}`
**Summary**:  Update Policy Automation

Update an existing policy automation (partial update).

**Parameters**:
- `automation_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/policy-automations/{automation_id} —  Delete Policy Automation

**Endpoint**: `DELETE /v1/policy-automations/{automation_id}`
**Summary**:  Delete Policy Automation

Soft-delete a policy automation.

**Parameters**:
- `automation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
