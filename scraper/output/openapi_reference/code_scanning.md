# code-scanning API Endpoints

## GET /v1/code-scanning/customer/{customer_id}/repositories — List repositories configured for code scanning

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories`
**Summary**: List repositories configured for code scanning
**Tags**: code-scanning

Returns all repository configurations registered for code scanning under a customer tenant. Use this to enumerate which source-code repositories are monitored, along with their VCS type, branch, programming language, and project assignments.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

## GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id} — Get a single repository configuration

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}`
**Summary**: Get a single repository configuration
**Tags**: code-scanning

Returns the repository configuration identified by repository_config_id for the given customer tenant. Includes VCS type, repository URL, default branch, programming language, and project assignments. Returns 404 if no matching repository exists for the customer.

**Parameters**:
- `repository_config_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Repository not found
- `500`: Unexpected server error
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

## DELETE /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id} — Permanently delete a repository configuration

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}`
**Summary**: Permanently delete a repository configuration
**Tags**: code-scanning

Deletes the specified repository configuration and its associated scan jobs and definitions. This action is irreversible. Returns 404 if the repository does not exist for this customer. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Repository not found
- `500`: Unexpected server error
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

## POST /v1/code-scanning/customer/{customer_id}/organization/configure-repositories — Onboard a VCS organization for automated code scanning

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/organization/configure-repositories`
**Summary**: Onboard a VCS organization for automated code scanning
**Tags**: code-scanning

Validates VCS credentials, persists an organization-level discovery config, and enqueues a background reconciler that discovers all repositories in the org and optionally triggers code scans. Idempotent — re-submitting the same (customer, VCS, organization, project) tuple updates mutable fields rather than creating a duplicate. Returns a job_id to poll via GET /v1/jobs/{job_id}.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Credential validation failed or invalid request
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk_project_reassignment — Bulk reassign repositories to a single project

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk_project_reassignment`
**Summary**: Bulk reassign repositories to a single project
**Tags**: code-scanning

Reassigns each of the specified repositories to the given project. Each repository is processed independently — repositories that fail (e.g., not found) are recorded in failed_repositories without stopping the remaining updates. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_ids` (query, required): 
- `project_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/code-scanning/repositories/bulk_project_assignments — Replace project assignments for multiple repositories

**Endpoint**: `PUT /v1/code-scanning/repositories/bulk_project_assignments`
**Summary**: Replace project assignments for multiple repositories
**Tags**: code-scanning

Updates each specified repository to belong to exactly the provided set of projects, replacing any existing project membership. Repositories are processed independently — failures for individual repositories are reported in failed_repositories without blocking the rest. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

## PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/unlink-from-project — Unlink a repository from its current project

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/unlink-from-project`
**Summary**: Unlink a repository from its current project
**Tags**: code-scanning

Removes the project assignment from the specified repository, leaving it unlinked. Use this to detach a repository from a project without deleting it. Returns the updated repository configuration with the project link cleared. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Repository not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk-unlink-from-project — Unlink multiple repositories from their projects

**Endpoint**: `PUT /v1/code-scanning/customer/{customer_id}/repositories/bulk-unlink-from-project`
**Summary**: Unlink multiple repositories from their projects
**Tags**: code-scanning

Removes the project assignment from each of the specified repositories in a single call. Repositories that cannot be unlinked (e.g., connection issues) are skipped with a logged error, and successfully updated repositories are returned in the response list. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/repositories/bulk_delete — Permanently delete multiple repository configurations

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/repositories/bulk_delete`
**Summary**: Permanently delete multiple repository configurations
**Tags**: code-scanning

Deletes each of the specified repository configurations for the customer. Each repository is processed independently — failures are captured in failed_repositories without halting the remaining deletions. This action is irreversible; associated scan jobs and results will also be removed. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_ids` (query, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs — Get the scan job configured for a repository

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs`
**Summary**: Get the scan job configured for a repository
**Tags**: code-scanning

Returns the code scan job (with its scan specifications) associated with the given repository. Each repository has at most one scan job. Use this to inspect scan frequency, enabled rule sets, and current job state for a specific repository. Returns 404 if no scan job exists for the repository.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found for this repository
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs — Add a scan job to a repository

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/repositories/{repository_config_id}/jobs`
**Summary**: Add a scan job to a repository
**Tags**: code-scanning

Creates a code scan job for the specified repository, configuring it with the provided scan specifications (rule sets). Each repository supports at most one scan job. Use this after registering a repository to enable scheduled and on-demand scanning. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `repository_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Repository not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Get a code scan job by ID

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Get a code scan job by ID
**Tags**: code-scanning

Returns a code scan job record including its current state, linked repository, and scan specifications. Use this to retrieve job details directly by job ID, for example after receiving a job_id from a trigger operation. Returns 404 if the job does not exist for this customer.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Replace scan specifications for a code scan job

**Endpoint**: `PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Replace scan specifications for a code scan job
**Tags**: code-scanning

Replaces the full set of scan specifications (rule sets) attached to a code scan job. All existing definitions are deleted and re-created from the submitted list. Use this to change which security checks run during a scan. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id} — Delete a code scan job and its definitions

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}`
**Summary**: Delete a code scan job and its definitions
**Tags**: code-scanning

Permanently deletes a code scan job and all its associated scan definitions. This stops future scheduled scans for the linked repository. The repository configuration is not affected. This action is irreversible. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions — List scan definitions (rule sets) for a scan job

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions`
**Summary**: List scan definitions (rule sets) for a scan job
**Tags**: code-scanning

Returns the list of scan definitions attached to a code scan job. Each definition describes a specific scanning rule set or tool configuration (e.g., secret detection, SAST, dependency audit). Use this to inspect which security checks are enabled for a given scan job within the customer tenant.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions — Add scan definitions (rule sets) to a scan job

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions`
**Summary**: Add scan definitions (rule sets) to a scan job
**Tags**: code-scanning

Appends one or more scan definitions to an existing code scan job. Each definition specifies a scan type (e.g., secret detection, SAST) and its configuration parameters. Returns 409 if a definition of the same type already exists for the job. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions/{code_scan_definition_id} — Update a single scan definition on a scan job

**Endpoint**: `PATCH /v1/code-scanning/customer/{customer_id}/jobs/{code_scan_job_id}/definitions/{code_scan_definition_id}`
**Summary**: Update a single scan definition on a scan job
**Tags**: code-scanning

Partially updates a specific scan definition attached to a code scan job. Use this to change the configuration parameters of an individual rule set without replacing the full set of definitions. Returns the updated scan definition. Scoped to the customer identified by the path customer_id.

**Parameters**:
- `customer_id` (path, required): 
- `code_scan_job_id` (path, required): 
- `code_scan_definition_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan definition not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/code-scanning/start-job/{code_scan_job_id} — Trigger a code scan job for a repository

**Endpoint**: `POST /v1/code-scanning/start-job/{code_scan_job_id}`
**Summary**: Trigger a code scan job for a repository
**Tags**: code-scanning

Enqueues a background code scan for the specified scan job. Returns a job_id immediately; poll GET /v1/code-scanning/job-status/{job_id} to track progress. Scoped to the authenticated customer tenant via JWT token.

**Parameters**:
- `code_scan_job_id` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
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

## POST /v1/code-scanning/start-job/{code_scan_job_id}/synchronous — Trigger a synchronous code scan job run

**Endpoint**: `POST /v1/code-scanning/start-job/{code_scan_job_id}/synchronous`
**Summary**: Trigger a synchronous code scan job run
**Tags**: code-scanning

Enqueues a synchronous (blocking-style) code scan for the specified scan job. Unlike the async variant, this path waits for the scan to complete before returning. Use for scenarios where downstream steps depend on scan results being available immediately. Scoped to the token's customer.

**Parameters**:
- `code_scan_job_id` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Scan job not found
- `500`: Unexpected server error
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

## POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization} — Trigger all code scan jobs for a VCS organization

**Endpoint**: `POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}`
**Summary**: Trigger all code scan jobs for a VCS organization
**Tags**: code-scanning

Enqueues background code scans for every repository configured under the specified VCS organization for the authenticated customer tenant. Returns a job_id immediately; poll GET /v1/code-scanning/job-status/{job_id} for completion. Useful for forcing a full re-scan after configuration changes or security incidents.

**Parameters**:
- `organization` (path, required): 
- `vcs` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

## POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}/synchronous — Synchronously trigger all code scans for a VCS organization

**Endpoint**: `POST /v1/code-scanning/start-job/vcs/{vcs}/organization/{organization}/synchronous`
**Summary**: Synchronously trigger all code scans for a VCS organization
**Tags**: code-scanning

Enqueues synchronous (blocking-style) code scans for every repository in the specified VCS organization under the authenticated customer. Unlike the async variant, this path runs discovery synchronously. Use when downstream steps depend on all scan results being available immediately. Scoped to the token's customer.

**Parameters**:
- `organization` (path, required): 
- `vcs` (path, required): 
- `callback_control_plane` (query, optional): Whether to callback to control plane with job results
- `force_run` (query, optional): Whether to skip last_update_hash checks and always run

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

## GET /v1/code-scanning/job-status/{job_id} — Poll the status of a code scan or discovery job

**Endpoint**: `GET /v1/code-scanning/job-status/{job_id}`
**Summary**: Poll the status of a code scan or discovery job
**Tags**: code-scanning

Returns the current status and metadata for an async code scan or discovery job. Use this to poll progress after triggering a scan via triggerCodeScanJob, triggerAllCodeScanJobsForOrganization, or onboardOrganizationForCodeScanning. Terminal states include COMPLETED and FAILED.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/code-scanning/cloud-storage/trigger-scanning — Trigger code scanning on cloud storage resources

**Endpoint**: `POST /v1/code-scanning/cloud-storage/trigger-scanning`
**Summary**: Trigger code scanning on cloud storage resources
**Tags**: code-scanning

Enqueues background code scans against cloud storage resources (S3 buckets, Azure Blob containers, GCS buckets) for the authenticated customer tenant. Supports optional filters by organization, project, resource instance, and resource types. Returns a job_id immediately; poll GET /v1/code-scanning/job-status/{job_id} for progress.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/organization-configs — List organization-level discovery configurations for code scanning

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/organization-configs`
**Summary**: List organization-level discovery configurations for code scanning
**Tags**: code-scanning

Returns a paginated list of VCS organization discovery configurations for the customer tenant. Each config represents an onboarded VCS organization whose repositories are auto-discovered and scanned. Supports filtering by project_id or organization_id. Use limit/offset for pagination.

**Parameters**:
- `customer_id` (path, required): 
- `limit` (query, optional): 
- `offset` (query, optional): 
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id} — Get detail for one organization discovery configuration

**Endpoint**: `GET /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id}`
**Summary**: Get detail for one organization discovery configuration
**Tags**: code-scanning

Returns full detail for a single VCS organization discovery config including its status, credential reference, scan spec template, and a paginated slice of derived repository configurations. Use repos_limit and repos_offset to page through repositories discovered from this org config.

**Parameters**:
- `customer_id` (path, required): 
- `organization_discovery_config_id` (path, required): 
- `repos_limit` (query, optional): 
- `repos_offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization discovery config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id} — Update Organization Discovery Config

**Endpoint**: `PATCH /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id}`
**Summary**: Update Organization Discovery Config
**Tags**: code-scanning

Partial-update an org discovery config (scan specs, credential, projects).

Body is :class:`OrganizationDiscoveryConfigUpdate` — all fields optional,
at least one must be set. Returns the refreshed
:class:`OrganizationDiscoveryConfigRead`.

Credential update runs ``validate_organization_credential`` synchronously;
on failure returns 400 with structured ``failure_reason`` mirroring the
onboarding endpoint. ``project_ids`` is validated against the caller's
effective scope (400 on unknown or out-of-scope ids). Scan-spec update
validates discriminator values at request-validation time. The session
dependency commits on success and rolls back on exception.

**Parameters**:
- `customer_id` (path, required): 
- `organization_discovery_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id} — Delete a VCS organization discovery configuration

**Endpoint**: `DELETE /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id}`
**Summary**: Delete a VCS organization discovery configuration
**Tags**: code-scanning

Deletes the specified organization discovery configuration asynchronously. By default (cascade=false), only the org config row is removed and derived repository configurations survive unlinked. Pass cascade=true to also delete all derived repository configurations (and their resources / unshared credentials). The shared credential record is never cascade-deleted. Scoped to the customer identified by the path customer_id. Returns a job_id immediately; poll GET /v1/code-scanning/job-status/{job_id} for the terminal status — on success the job's return_value carries derived_repos_deleted.

**Parameters**:
- `customer_id` (path, required): 
- `organization_discovery_config_id` (path, required): 
- `cascade` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Organization discovery config not found
- `409`: Discovery is in progress; retry once it completes
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id}/trigger-discovery — Manually trigger a repository discovery run for an org config

**Endpoint**: `POST /v1/code-scanning/customer/{customer_id}/organization-configs/{organization_discovery_config_id}/trigger-discovery`
**Summary**: Manually trigger a repository discovery run for an org config
**Tags**: code-scanning

Enqueues a reconciler run for the specified organization discovery config, re-discovering repositories and syncing any additions or removals against the customer's registered repository list. Returns 404 if the config does not belong to this customer. Poll GET /v1/jobs/{job_id} in the response for terminal state.

**Parameters**:
- `customer_id` (path, required): 
- `organization_discovery_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request or org config in a non-triggerable state
- `404`: Organization discovery config not found
- `500`: Unexpected server error
- `422`: Validation Error

---
