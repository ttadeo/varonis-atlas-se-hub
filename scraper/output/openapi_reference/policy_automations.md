# policy-automations API Endpoints

## GET /v1/policy-automations —  List Policy Automations

**Endpoint**: `GET /v1/policy-automations`
**Summary**:  List Policy Automations
**Tags**: policy-automations

List policy automations for the authenticated customer.

**Parameters**:
- `is_enabled` (query, optional): 
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `page` (query, optional): Page number
- `per_page` (query, optional): Items per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/policy-automations —  Create Policy Automation

**Endpoint**: `POST /v1/policy-automations`
**Summary**:  Create Policy Automation
**Tags**: policy-automations

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
**Tags**: policy-automations

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
**Tags**: policy-automations

Soft-delete a policy automation.

**Parameters**:
- `automation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
