# pull-requests API Endpoints

## GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/commands — Get available PR remediation commands for an issue

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/commands`
**Summary**: Get available PR remediation commands for an issue
**Tags**: pull-requests

Return the set of pull request commands that can be executed to remediate a specific security issue. Each command describes a dependency-file update that would fix a CVE detected in the customer's AI resource. Only unresolved CVE issues with a known fixed version and associated dependency files produce commands. Use this before calling executePullRequestCommands to discover what automated remediations are available. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/commands — Get available PR remediation commands for a resource

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/commands`
**Summary**: Get available PR remediation commands for a resource
**Tags**: pull-requests

Return the set of pull request commands that can be executed to remediate all unresolved CVE issues detected across a specific AI resource instance. Aggregates commands from every unresolved CVE issue linked to the resource and deduplicates them. Use this to discover all automated dependency-update PRs that can be opened for a given resource before calling executePullRequestCommands. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource instance not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/pull-requests/customer/{customer_id}/commands — Execute pull request remediation commands

**Endpoint**: `POST /v1/pull-requests/customer/{customer_id}/commands`
**Summary**: Execute pull request remediation commands
**Tags**: pull-requests

Open one or more automated pull requests on the customer's connected VCS repositories to remediate CVE vulnerabilities by updating dependency files. Each command in the request body specifies a repository and dependency file to update; the platform uses an AI agent to compute the minimal file diff, then opens the PR via the repository's configured credential. Returns the list of created or updated pull requests with their VCS URLs and current status. Requires the GitHub App to be installed with write permissions — a read-only GitHub App installation will be rejected with 403. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `internal_access` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `403`: GitHub app is read-only, or the repository API key lacks write permission
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/pull-request/{pull_request_id} — Get a single pull request by ID

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/pull-request/{pull_request_id}`
**Summary**: Get a single pull request by ID
**Tags**: pull-requests

Return details for a single automated pull request, including its VCS URL, title, and current open/merged/closed status. The status is served from cache and refreshed from the upstream VCS repository in the background (throttled per PR), so a status that just changed upstream may take until a subsequent call to appear. Use to check whether a previously opened remediation PR has been merged or closed. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `pull_request_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Pull request not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/pull-requests — List pull requests linked to a security issue

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/issue/{issue_id}/pull-requests`
**Summary**: List pull requests linked to a security issue
**Tags**: pull-requests

Return all automated pull requests that were opened to remediate a specific security issue. Each pull request's status is served from cache and refreshed from the upstream VCS repository in the background (throttled per PR). Use to check whether a CVE issue has an open, merged, or closed remediation PR, and to retrieve the PR URL for review. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `issue_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/pull-requests — List pull requests linked to an AI resource instance

**Endpoint**: `GET /v1/pull-requests/customer/{customer_id}/resource/{resource_instance_id}/pull-requests`
**Summary**: List pull requests linked to an AI resource instance
**Tags**: pull-requests

Return all automated pull requests opened to remediate CVE issues across all issues linked to a specific AI resource instance. Aggregates pull requests from every issue on the resource and deduplicates them. Each PR's status is served from cache and refreshed from the upstream VCS repository in the background (throttled per PR). Use to get a consolidated view of all remediation PRs for a given resource. Scoped to the customer identified by customer_id in the path.

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource instance not found
- `500`: Unexpected server error
- `422`: Validation Error

---
