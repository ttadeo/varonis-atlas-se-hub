# code-scanning API Endpoints

## GET /v1/code-scanning/customer/{customer_id}/repositories — Get Repositories For Customer

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories`
**Summary**: Get Repositories For Customer
**Tags**: code-scanning

Get repositories for a customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/repositories — Add Repository Config

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/repositories`
**Summary**: Add Repository Config
**Tags**: code-scanning

Add a repository.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id} — Get Repository By Id

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}`
**Summary**: Get Repository By Id
**Tags**: code-scanning

Get repository by id.

**Parameters**:
- `repository_config_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id} — Update Repository Config

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}`
**Summary**: Update Repository Config
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id} — Delete Repository Config

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}`
**Summary**: Delete Repository Config
**Tags**: code-scanning

Delete a repository.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/details — Get Repository Config Details

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/details`
**Summary**: Get Repository Config Details
**Tags**: code-scanning, code-scanning, code-scanning-config

**Parameters**:
- `repository_config_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/repositories/bulk_verify_connections — Bulk Verify Connection For Repositories

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/repositories/bulk_verify_connections`
**Summary**: Bulk Verify Connection For Repositories
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_ids` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/verify-connection — Verify Connection For Repository

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/verify-connection`
**Summary**: Verify Connection For Repository
**Tags**: code-scanning

Verify connection for a repository.

**Parameters**:
- `repository_config_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/organization/configure-repositories — Add Repositories In Org In Bulk

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/organization/configure-repositories`
**Summary**: Add Repositories In Org In Bulk
**Tags**: code-scanning

Add a repository.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk_project_reassignment — Bulk Project Reassignment For Repositories

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk_project_reassignment`
**Summary**: Bulk Project Reassignment For Repositories
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_ids` (query, required): 
- `project_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/repositories/bulk_project_assignments — Bulk Update Repository Project Assignments

**Endpoint**: `PUT /v1/code-scanning/repositories/bulk_project_assignments`
**Summary**: Bulk Update Repository Project Assignments
**Tags**: code-scanning

Bulk update project assignments for multiple repositories.

All specified repositories will be updated to belong to exactly the projects
specified in project_ids. Each repository is processed independently - if one
fails, others will still be updated.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/repositories/with-projects — Add Repository Config With Projects

**Endpoint**: `POST /v1/code-scanning/repositories/with-projects`
**Summary**: Add Repository Config With Projects
**Tags**: code-scanning

Add a repository with support for multiple project assignments.

This endpoint allows you to create a repository and assign it to multiple projects
at creation time. Specify the list of project IDs you want the repository to belong to.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/repositories/{repository_config_id}/projects — Update Repository Project Assignments

**Endpoint**: `PUT /v1/code-scanning/repositories/{repository_config_id}/projects`
**Summary**: Update Repository Project Assignments
**Tags**: code-scanning

Update a repository's project assignments and/or other attributes.

**Parameters**:
- `repository_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/unlink-from-project — Unlink Repository Config

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/unlink-from-project`
**Summary**: Unlink Repository Config
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk-unlink-from-project — Bulk Unlink Repository Config

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk-unlink-from-project`
**Summary**: Bulk Unlink Repository Config
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/repositories/bulk_delete — Bulk Delete Repository Configs

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/repositories/bulk_delete`
**Summary**: Bulk Delete Repository Configs
**Tags**: code-scanning

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_ids` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs — Get Code Scan Job

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs`
**Summary**: Get Code Scan Job
**Tags**: code-scanning

Get a code scan job for a repository.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs — Add Code Scan Job

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs`
**Summary**: Add Code Scan Job
**Tags**: code-scanning

Add a code scan job for a repository.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Get Code Scan Job By Id

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Get Code Scan Job By Id
**Tags**: code-scanning

Get a code scan job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Update Scan Specs For Code Scan Job

**Endpoint**: `PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Update Scan Specs For Code Scan Job
**Tags**: code-scanning

Patch a code scan job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Delete Code Scan Job

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Delete Code Scan Job
**Tags**: code-scanning

Delete a code scan job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions — Get Scan Definitions For Job

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions`
**Summary**: Get Scan Definitions For Job
**Tags**: code-scanning

Get scan definitions for a job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions — Add Scan Definitions For Job

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions`
**Summary**: Add Scan Definitions For Job
**Tags**: code-scanning

Add scan definitions for a job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions/{code_scan_definition_id} — Update Scan Definition For Job

**Endpoint**: `PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions/{code_scan_definition_id}`
**Summary**: Update Scan Definition For Job
**Tags**: code-scanning

Patch a scan definition for a job.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 
- `code_scan_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/start-job/{code_scan_job_id} — Run Code Scanning Job

**Endpoint**: `POST /v1/code-scanning/start-job/{code_scan_job_id}`
**Summary**: Run Code Scanning Job
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `code_scan_job_id` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/start-job/{code_scan_job_id} — Run Code Scanning Job

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/start-job/{code_scan_job_id}`
**Summary**: Run Code Scanning Job
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `code_scan_job_id` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/start-job/{code_scan_job_id}/synchronous — Run Code Scanning Job Synchronous

**Endpoint**: `POST /v1/code-scanning/start-job/{code_scan_job_id}/synchronous`
**Summary**: Run Code Scanning Job Synchronous
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `code_scan_job_id` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/update-job-results — Update Code Scanning Results

**Endpoint**: `POST /v1/code-scanning/update-job-results`
**Summary**: Update Code Scanning Results
**Tags**: code-scanning, internal

Update code scanning results.

This endpoint automatically routes to the appropriate job queue table
(cloud storage or VCS) based on the job_queue_id.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/mark-job-failed — Mark Code Scanning Job Failed

**Endpoint**: `POST /v1/code-scanning/mark-job-failed`
**Summary**: Mark Code Scanning Job Failed
**Tags**: code-scanning, internal

Mark a code scanning job as failed.

This endpoint automatically routes to the appropriate job queue table
(cloud storage or VCS) based on the job_queue_id.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/cloud-storage/flush-job-queue — Flush Cloud Storage Code Scanning Job Queue

**Endpoint**: `POST /v1/code-scanning/cloud-storage/flush-job-queue`
**Summary**: Flush Cloud Storage Code Scanning Job Queue
**Tags**: code-scanning, internal

Flush the Cloud Storage Code Scanning Job Queue, processing pending jobs and jobs up for retry.

If `cloud_storage_code_scanning_execution_id` is provided, only jobs related to that execution will be processed.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization} — Run All Code Scan Jobs For Customer

**Endpoint**: `POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}`
**Summary**: Run All Code Scan Jobs For Customer
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `organization` (path, required): 
- `vcs` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/start-job/vcs/{vcs}/organization/{organization} — Run All Code Scan Jobs For Customer

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/start-job/vcs/{vcs}/organization/{organization}`
**Summary**: Run All Code Scan Jobs For Customer
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `organization` (path, required): 
- `vcs` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}/synchronous — Run All Code Scan Jobs For Customer Synchronously

**Endpoint**: `POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}/synchronous`
**Summary**: Run All Code Scan Jobs For Customer Synchronously
**Tags**: code-scanning

Run a code scan job

**Parameters**:
- `organization` (path, required): 
- `vcs` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/model-discovery-on-cloud-storage/customer/start — Start Model Discovery In Cloud Storage For Customer

**Endpoint**: `POST /v1/code-scanning/model-discovery-on-cloud-storage/customer/start`
**Summary**: Start Model Discovery In Cloud Storage For Customer
**Tags**: code-scanning

[DEPRECATED] Start model discovery in cloud storage for a customer.

This endpoint is deprecated. Use POST /code-scanning/cloud-storage/trigger-scanning instead.

This endpoint initiates a background job to perform model discovery across specified
cloud storage types and scan specifications. If no specific cloud storage types or scan
specifications are provided, it defaults to scanning S3 buckets with a predefined scan spec.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/code-scanning/job-status/{job_id} — Get Discovery Job Status

**Endpoint**: `GET /v1/code-scanning/job-status/{job_id}`
**Summary**: Get Discovery Job Status
**Tags**: code-scanning

Get the status of a job that was initiated to run a discovery scan.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/code-scanning/cloud-storage/trigger-scanning — Trigger Code Scanning On Cloud Resources

**Endpoint**: `POST /v1/code-scanning/cloud-storage/trigger-scanning`
**Summary**: Trigger Code Scanning On Cloud Resources
**Tags**: code-scanning

Trigger code scanning on cloud storage resources for a customer.

This endpoint allows you to trigger code scanning on cloud storage resources
(S3 buckets, Azure blob containers, GCS buckets) based on optional filters
for organization, project, resource instance, and resource types.

Args:
    request: Request body with optional filters and scan specifications
    customer_id: The customer ID (from token authentication)
    session: Database session (authentication guard)
    job_id: Unique job ID for tracking
    background_tasks: Background task manager

Returns:
    JobStart with job_id for tracking the background job

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
