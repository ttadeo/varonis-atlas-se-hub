# Atlas API — posture-management

## POST /v1/posture-management/incidents — Create Incident

**Endpoint**: `POST /v1/posture-management/incidents`
**Summary**: Create Incident
**Tags**: posture-management, incidents

Create Incident with issues

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents —  Get All Incidents

**Endpoint**: `GET /v1/posture-management/incidents`
**Summary**:  Get All Incidents
**Tags**: posture-management, incidents

Get all Incidents for a customer. If you specify project_id, ignores organization_id

**Parameters**:
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id} — Get Incident

**Endpoint**: `GET /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id}`
**Summary**: Get Incident
**Tags**: posture-management, incidents

Get Incident by ID

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id} — Delete Incident

**Endpoint**: `DELETE /v1/posture-management/incidents/customer/{customer_id}/incident/{incident_id}`
**Summary**: Delete Incident
**Tags**: posture-management, incidents

Delete an Incident and its associated IncidentIssue records

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/{incident_id} —  Get Incident

**Endpoint**: `GET /v1/posture-management/incidents/{incident_id}`
**Summary**:  Get Incident
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id} — Update Incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}`
**Summary**: Update Incident
**Tags**: posture-management, incidents

Update Incident

**Parameters**:
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/incidents/{incident_id} —  Delete Incident

**Endpoint**: `DELETE /v1/posture-management/incidents/{incident_id}`
**Summary**:  Delete Incident
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/incidents/customer/{customer_id} — Get All Incidents

**Endpoint**: `GET /v1/posture-management/incidents/customer/{customer_id}`
**Summary**: Get All Incidents
**Tags**: posture-management, incidents

Get all Incidents for a customer. If you specify project_id, ignores organization_id

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/update-issues — Update Issue In Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/update-issues`
**Summary**: Update Issue In Incident
**Tags**: posture-management, incidents

Update Incident with issues

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/update-issues —  Update Issue In Incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/update-issues`
**Summary**:  Update Issue In Incident
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/delete-issues — Delete Issue From Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/delete-issues`
**Summary**: Delete Issue From Incident
**Tags**: posture-management, incidents

Delete Issues from Incident

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/delete-issues —  Delete Issue From Incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/delete-issues`
**Summary**:  Delete Issue From Incident
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/status —  Update Incident Status

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/status`
**Summary**:  Update Incident Status
**Tags**: posture-management, incidents

Update Incident status, with a required comment if status is changed to CLOSED

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/status — Update Incident Status

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/status`
**Summary**: Update Incident Status
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/assign — Assign Incident

**Endpoint**: `PATCH /v1/posture-management/customer/{customer_id}/incidents/{incident_id}/assign`
**Summary**: Assign Incident
**Tags**: posture-management, incidents

Assign an Incident to a user

**Parameters**:
- `customer_id` (path, required): 
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/incidents/{incident_id}/assign —  Assign Incident

**Endpoint**: `PATCH /v1/posture-management/incidents/{incident_id}/assign`
**Summary**:  Assign Incident
**Tags**: posture-management, incidents

**Parameters**:
- `incident_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/issue —  Update Issue

**Endpoint**: `PATCH /v1/posture-management/issue`
**Summary**:  Update Issue
**Tags**: posture-management

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/posture-management/issue —  Update Issue

**Endpoint**: `PATCH /v1/posture-management/posture-management/issue`
**Summary**:  Update Issue
**Tags**: posture-management

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/posture-management/issues —  Update Issues

**Endpoint**: `PATCH /v1/posture-management/issues`
**Summary**:  Update Issues
**Tags**: posture-management

Update multiple issues in bulk.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/issue-types —  Get Issue Types

**Endpoint**: `GET /v1/posture-management/issue-types`
**Summary**:  Get Issue Types
**Tags**: posture-management

Get all issue types and their display names.

**Responses**:
- `200`: Successful Response

---

## GET /v1/posture-management/job-status/{job_id} — Get Discovery Job Status

**Endpoint**: `GET /v1/posture-management/job-status/{job_id}`
**Summary**: Get Discovery Job Status
**Tags**: posture-management

Get the status of a job that was initiated to run a discovery scan.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/policies —  Get All Policies

**Endpoint**: `GET /v1/posture-management/policies`
**Summary**:  Get All Policies
**Tags**: posture-management

Get all posture management policies

**Parameters**:
- `policy_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/policy-groups —  Get All Policy Groups

**Endpoint**: `GET /v1/posture-management/policy-groups`
**Summary**:  Get All Policy Groups
**Tags**: posture-management

Get all posture management policy groups

**Responses**:
- `200`: Successful Response

---

## GET /v1/posture-management/policy-groups/{policy_group_name} —  Get Policy Group

**Endpoint**: `GET /v1/posture-management/policy-groups/{policy_group_name}`
**Summary**:  Get Policy Group
**Tags**: posture-management

Get a particular posture management policy group

**Parameters**:
- `policy_group_name` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policies —  Get Customer Policies

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policies`
**Summary**:  Get Customer Policies
**Tags**: posture-management

Get all posture management policies for a customer

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `policy_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/policies — Add Security Posture Management Policies for a Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/policies`
**Summary**: Add Security Posture Management Policies for a Customer
**Tags**: posture-management

Add a set of security posture management policies for a customer.
This operation activates the specified policies for the customer.
By default, the policies are activated at the customer level, affecting all organizations and projects.
If organization_id or project_id are provided, the activation will be limited to the specified scope.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/policies/{policy_name} —  Delete Individual Customer Policies

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/policies/{policy_name}`
**Summary**:  Delete Individual Customer Policies
**Tags**: posture-management

Delete individual posture management policies for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups —  Get Customer Policy Groups

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups`
**Summary**:  Get Customer Policy Groups
**Tags**: posture-management

Get all posture management policy groups for a customer

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/policy-groups — Add Policy Groups for a Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/policy-groups`
**Summary**: Add Policy Groups for a Customer
**Tags**: posture-management

Add a set of posture management policy groups for a customer.
This operation activates the specified policy groups, which in turn enables all policies within those groups.
By default, the policy groups are activated at the customer level, affecting all organizations and projects.
If organization_id or project_id are provided, the activation will be limited to the specified scope.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): Optional. If provided, the policy groups will only be activated for this specific organization.
- `project_id` (query, optional): Optional. If provided, the policy groups will only be activated for this specific project.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name} —  Delete Customer Policy Groups

**Endpoint**: `DELETE /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}`
**Summary**:  Delete Customer Policy Groups
**Tags**: posture-management

Delete posture management policy groups for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/compliance — Get Customer Policy Groups Compliance

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/compliance`
**Summary**: Get Customer Policy Groups Compliance
**Tags**: posture-management

Get posture management policy groups compliance for a customer

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/posture-overtime — Get Customer Policy Group Posture Overtime

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/posture-overtime`
**Summary**: Get Customer Policy Group Posture Overtime
**Tags**: posture-management

Get posture management policy group posture overtime for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `start_date` (query, optional): 
- `end_date` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/compliance — Get Customer Policy Group Compliance

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/compliance`
**Summary**: Get Customer Policy Group Compliance
**Tags**: posture-management

Get posture management policy group compliance for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/last_scan_time — Get Customer Policy Group Last Scan Time

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/policy-groups/{policy_group_name}/last_scan_time`
**Summary**: Get Customer Policy Group Last Scan Time
**Tags**: posture-management

Get posture management policy group last scan time for a customer

**Parameters**:
- `customer_id` (path, required): 
- `policy_group_name` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/cloud-configuration/policies —  Get Cloud Configuration Policies

**Endpoint**: `GET /v1/posture-management/cloud-configuration/policies`
**Summary**:  Get Cloud Configuration Policies
**Tags**: posture-management

Get all cloud configuration policies

**Responses**:
- `200`: Successful Response

---

## GET /v1/posture-management/cloud-configuration/policies/{cloud_provider} —  Get Cloud Configuration Policies For Cloud Provider

**Endpoint**: `GET /v1/posture-management/cloud-configuration/policies/{cloud_provider}`
**Summary**:  Get Cloud Configuration Policies For Cloud Provider
**Tags**: posture-management

Get all cloud configuration policies for a specific cloud provider

**Parameters**:
- `cloud_provider` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/cloud-configuration/check-policies — Generate Cloud Misconfiguration Issues For Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/cloud-configuration/check-policies`
**Summary**: Generate Cloud Misconfiguration Issues For Customer
**Tags**: posture-management

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/check-policies — Scan Customers Jupyter Notebooks For Issues

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/check-policies`
**Summary**: Scan Customers Jupyter Notebooks For Issues
**Tags**: posture-management

Scan a customer's jupyter notebooks for issues

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): If true, will create notebook issues even if some notebooks fail to scan. If false (default) - will only create issues if all notebooks are scanned successfully.
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/agentic-scanning/check-policies — Scan Customers Agentic For Issues

**Endpoint**: `POST /v1/posture-management/agentic-scanning/check-policies`
**Summary**: Scan Customers Agentic For Issues
**Tags**: posture-management

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): If true, will create agentic resource issues even if some resources fail to scan. If false (default) - will only create issues if all resources are scanned successfully.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/dataset-scanning/check-policies — Scan Customers Dataset For Issues Synchronous

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/dataset-scanning/check-policies`
**Summary**: Scan Customers Dataset For Issues Synchronous
**Tags**: posture-management

Scan a customer's dataset for issues

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `allow_partial_success` (query, optional): If true, will create notebook issues even if some dataset files fail to scan. If false (default) - will only create issues if all files are scanned successfully.
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/trigger-scan — Trigger Dataset Scanning

**Endpoint**: `POST /v1/posture-management/dataset-scanning/trigger-scan`
**Summary**: Trigger Dataset Scanning
**Tags**: posture-management

Trigger dataset scanning for a customer, creates scan jobs and returns their details.
The jobs are flushed to posture management scan job queue for processing.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/update-job-results — Update Dataset Scanning Job Queue Results

**Endpoint**: `POST /v1/posture-management/dataset-scanning/update-job-results`
**Summary**: Update Dataset Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Dataset Scanning Job in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/dataset-scanning/mark-job-failed — Mark Dataset Job As Failed

**Endpoint**: `POST /v1/posture-management/dataset-scanning/mark-job-failed`
**Summary**: Mark Dataset Job As Failed
**Tags**: posture-management, internal

Mark the dataset scanning job as failed in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/resource-hashing/check-policies — Scan Customers Resource Versions For Issues

**Endpoint**: `POST /v1/posture-management/resource-hashing/check-policies`
**Summary**: Scan Customers Resource Versions For Issues
**Tags**: posture-management

Scan a customer's resource versions for issues

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/resource-hashing/hashed-versions — Get Customers Resource Versions

**Endpoint**: `GET /v1/posture-management/resource-hashing/hashed-versions`
**Summary**: Get Customers Resource Versions
**Tags**: posture-management

**Parameters**:
- `resource_instance_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/resource-hashing/mark-safe — Mark Resource Version Safe

**Endpoint**: `POST /v1/posture-management/resource-hashing/mark-safe`
**Summary**: Mark Resource Version Safe
**Tags**: posture-management

Mark a version of a resource as safe

**Parameters**:
- `resource_instance_id` (query, required): 
- `version_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/model-scanning/check-policies — Scan Customers Models For Issues

**Endpoint**: `POST /v1/posture-management/model-scanning/check-policies`
**Summary**: Scan Customers Models For Issues
**Tags**: posture-management

Scan a customer's models for issues

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/model-scanning/check-policies — Scan Customers Models For Issues

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/model-scanning/check-policies`
**Summary**: Scan Customers Models For Issues
**Tags**: posture-management

Scan a customer's models for issues

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/model-scanning/trigger-scan — Trigger Model Scanning

**Endpoint**: `POST /v1/posture-management/model-scanning/trigger-scan`
**Summary**: Trigger Model Scanning
**Tags**: posture-management

Trigger model scanning for a customer, creates scan jobs and returns their details.
The jobs are flushed to posture management scan job queue for processing.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/notebook-scanning/trigger-scan — Trigger Notebook Scanning

**Endpoint**: `POST /v1/posture-management/notebook-scanning/trigger-scan`
**Summary**: Trigger Notebook Scanning
**Tags**: posture-management

Create notebook scanning jobs for a customer, creates scan jobs and returns their details.

The jobs are flushed to posture management notebook scan job queue for processing.

**Parameters**:
- `resource_instance_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `skip_unchanged_resources` (query, optional): If true, will skip scanning resources that have not changed since the last scan.

**Request Body** (optional):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/cve/populate-cve — Populate Cves For Customer

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/cve/populate-cve`
**Summary**: Populate Cves For Customer
**Tags**: posture-management

Populate CVEs for a customer inventory of libraries

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/customers/{customer_id}/heatmap — Get Heatmap

**Endpoint**: `GET /v1/posture-management/customers/{customer_id}/heatmap`
**Summary**: Get Heatmap
**Tags**: posture-management

Get the heat map.

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/posture-management/hugging-face-model-card/customer/{customer_id}/resource/{resource_instance_id} — Get Hugging Face Model Card

**Endpoint**: `GET /v1/posture-management/hugging-face-model-card/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Get Hugging Face Model Card
**Tags**: posture-management

Get model card from resource instance id

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/posture-management/scan-executions/{scan_execution_id} — Delete Posture Management Scan Execution

**Endpoint**: `DELETE /v1/posture-management/scan-executions/{scan_execution_id}`
**Summary**: Delete Posture Management Scan Execution
**Tags**: posture-management

**Parameters**:
- `scan_execution_id` (path, required): 
- `customer_id` (query, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/scan-executions/bulk-delete — Bulk Delete Posture Management Scans

**Endpoint**: `POST /v1/posture-management/scan-executions/bulk-delete`
**Summary**: Bulk Delete Posture Management Scans
**Tags**: posture-management

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/whitelist-findings — Whitelist Jupyter Notebook Findings

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/jupyter-notebook-scanning/whitelist-findings`
**Summary**: Whitelist Jupyter Notebook Findings
**Tags**: posture-management

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, required): 
- `issue_id` (query, required): 
- `hash` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/posture-management/customers/{customer_id}/dataset-scanning/whitelist-findings — Whitelist Dataset Findings

**Endpoint**: `POST /v1/posture-management/customers/{customer_id}/dataset-scanning/whitelist-findings`
**Summary**: Whitelist Dataset Findings
**Tags**: posture-management

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (query, required): 
- `issue_id` (query, required): 
- `hash` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/issue-policy — Create or update issue policies for the customer

**Endpoint**: `PATCH /v1/issue-policy`
**Summary**: Create or update issue policies for the customer
**Tags**: posture-management

Creates or updates multiple issue policies for a customer. If an IssueType is not sent, it will NOT
update that resource category.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy — Resets the issue policies for a customer

**Endpoint**: `DELETE /v1/issue-policy`
**Summary**: Resets the issue policies for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `issue_type` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy — Get the issue policy for the customer

**Endpoint**: `GET /v1/issue-policy`
**Summary**: Get the issue policy for the customer
**Tags**: posture-management

Gets all the current customers issue policies.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/issue-policy/issue-type/{issue_type} — Create or update a issue policy for the customer on a particular category

**Endpoint**: `PATCH /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Create or update a issue policy for the customer on a particular category
**Tags**: posture-management

Creates or updates the issue policy for a customer on a particular category.

**Parameters**:
- `issue_type` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy/issue-type/{issue_type} — Resets the issue policy for a customer

**Endpoint**: `DELETE /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Resets the issue policy for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `issue_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy/issue-type/{issue_type} — Get the issue policy for the customer on a particular category

**Endpoint**: `GET /v1/issue-policy/issue-type/{issue_type}`
**Summary**: Get the issue policy for the customer on a particular category
**Tags**: posture-management

Gets the current customer's issue policy for a particular category.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Parameters**:
- `issue_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/issue-policy/customer/{customer_id}/issue_policy — Create or update issue policies for the customer

**Endpoint**: `PATCH /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Create or update issue policies for the customer
**Tags**: posture-management

Creates or updates multiple issue policies for a customer. If an IssueType is not sent, it will NOT
update that resource category.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy/customer/{customer_id}/issue_policy — Resets the issue policies for a customer

**Endpoint**: `DELETE /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Resets the issue policies for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `customer_id` (path, required): 
- `issue_type` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy/customer/{customer_id}/issue_policy — Get the issue policy for the customer

**Endpoint**: `GET /v1/issue-policy/customer/{customer_id}/issue_policy`
**Summary**: Get the issue policy for the customer
**Tags**: posture-management

Gets all the current customers issue policies.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Create or update a issue policy for the customer on a particular category

**Endpoint**: `PATCH /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Create or update a issue policy for the customer on a particular category
**Tags**: posture-management

Creates or updates the issue policy for a customer on a particular category.

**Parameters**:
- `issue_type` (path, required): 
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Resets the issue policy for a customer

**Endpoint**: `DELETE /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Resets the issue policy for a customer
**Tags**: posture-management

Resets the issue policy for a customer on a particular category.

**Parameters**:
- `customer_id` (path, required): 
- `issue_type` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type} — Get the issue policy for the customer on a particular category

**Endpoint**: `GET /v1/issue-policy/customer/{customer_id}/issue_policy/{issue_type}`
**Summary**: Get the issue policy for the customer on a particular category
**Tags**: posture-management

Gets the current customer's issue policy for a particular category.
If the customer does not have an issue policy for a particular category, it will return the default
category policy.

**Parameters**:
- `issue_type` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/shadow-ai/issue-policy — Get the issue policy for the customer

**Endpoint**: `GET /v1/shadow-ai/issue-policy`
**Summary**: Get the issue policy for the customer
**Tags**: posture-management

Gets the customers current shadow AI policy.
If the policy does not exist in the database, gets a default.

**Responses**:
- `200`: Successful Response

---

## PUT /v1/shadow-ai/issue-policy — Update the shadow ai issue policy for a customer

**Endpoint**: `PUT /v1/shadow-ai/issue-policy`
**Summary**: Update the shadow ai issue policy for a customer
**Tags**: posture-management

Updates the shadow AI issue policy for a customer.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/update-job-results — Update Model Scanning Job Queue Results

**Endpoint**: `POST /v2/posture-management/model-scanning/update-job-results`
**Summary**: Update Model Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Model Scanning Job in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/mark-job-failed — Mark Model Scanning Job As Failed

**Endpoint**: `POST /v2/posture-management/model-scanning/mark-job-failed`
**Summary**: Mark Model Scanning Job As Failed
**Tags**: posture-management, internal

Mark the Model Scanning Job as failed in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/flush-job-queue — Flush Model Scan Job Queue

**Endpoint**: `POST /v2/posture-management/model-scanning/flush-job-queue`
**Summary**: Flush Model Scan Job Queue
**Tags**: posture-management, internal

Flush the Model Scan Job Queue, processing pending jobs and the jobs up for retry.

If `scan_id` is provided, only jobs related to scan id will be marked processed.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/model-scanning/expire-jobs — Expire Jobs In Job Queue

**Endpoint**: `POST /v2/posture-management/model-scanning/expire-jobs`
**Summary**: Expire Jobs In Job Queue
**Tags**: posture-management, internal

Expire stale model scan jobs in the job queue.

If `scan_id` is provided, only jobs related to scan id will be marked expired.

**Parameters**:
- `expire_on_commit` (query, optional): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/model-scanning/post-process-expired-jobs — Post Process Expired Jobs

**Endpoint**: `GET /v2/posture-management/model-scanning/post-process-expired-jobs`
**Summary**: Post Process Expired Jobs
**Tags**: posture-management, internal

Triggers post processing steps for expired model scanning jobs.
All the jobs in job queue must be in FAILED or SUCCESS state in order for post processing to be triggered.

**Parameters**:
- `expire_on_commit` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/update-job-results — Update Notebook Scanning Job Queue Results

**Endpoint**: `POST /v2/posture-management/notebook-scanning/update-job-results`
**Summary**: Update Notebook Scanning Job Queue Results
**Tags**: posture-management, internal

Update the results of Notebook Scanning Job in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/mark-job-failed — Mark Notebook Scan Job As Failed

**Endpoint**: `POST /v2/posture-management/notebook-scanning/mark-job-failed`
**Summary**: Mark Notebook Scan Job As Failed
**Tags**: posture-management, internal

Mark the Notebook Scanning Job as failed in the database.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/flush-job-queue — Flush Notebook Scan Job Queue

**Endpoint**: `POST /v2/posture-management/notebook-scanning/flush-job-queue`
**Summary**: Flush Notebook Scan Job Queue
**Tags**: posture-management, internal

Flush the Notebook Scan Job Queue, processing pending jobs and the jobs up for retry.
If `scan_id` is provided, only jobs related to scan id will be marked processed.

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/posture-management/notebook-scanning/expire-jobs — Expire Jobs In Job Queue

**Endpoint**: `POST /v2/posture-management/notebook-scanning/expire-jobs`
**Summary**: Expire Jobs In Job Queue
**Tags**: posture-management, internal

Expire stale notebook scan jobs in the job queue.
If `scan_id` is provided, only jobs related to scan id will be marked expired.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/posture-management/notebook-scanning/post-process-expired-jobs — Post Process Expired Jobs

**Endpoint**: `GET /v2/posture-management/notebook-scanning/post-process-expired-jobs`
**Summary**: Post Process Expired Jobs
**Tags**: posture-management, internal

Triggers post processing steps for expired notebook scanning jobs.
All the jobs in job queue must be in FAILED or SUCCESS state in order for post processing to be triggered.

**Responses**:
- `204`: Successful Response

---
