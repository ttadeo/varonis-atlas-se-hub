# inventory API Endpoints

## POST /v1/inventory/resources/llm-endpoint — Add Llm Endpoint Resources

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint`
**Summary**: Add Llm Endpoint Resources
**Tags**: inventory, llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/customer/{customer_id}/resources/llm-endpoint — Add Llm Endpoint Resources

**Endpoint**: `POST /v1/inventory/customer/{customer_id}/resources/llm-endpoint`
**Summary**: Add Llm Endpoint Resources
**Tags**: inventory, llm-firewall

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/assign-dsl-spec-version/{llm_endpoint_dsl_spec_version_id} — Assign Existing Llm Endpoint To Existing Dsl Spec

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/assign-dsl-spec-version/{llm_endpoint_dsl_spec_version_id}`
**Summary**: Assign Existing Llm Endpoint To Existing Dsl Spec
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_version_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl-spec-assignment — Get Llm Endpoint Dsl Spec Assignment For Resource

**Endpoint**: `GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl-spec-assignment`
**Summary**: Get Llm Endpoint Dsl Spec Assignment For Resource
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}/llm-endpoint-pentest-connection — Get Llm Endpoint Pentest Connection

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}/llm-endpoint-pentest-connection`
**Summary**: Get Llm Endpoint Pentest Connection
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config — Patch Llm Endpoint Resource Additional Config

**Endpoint**: `PATCH /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config`
**Summary**: Patch Llm Endpoint Resource Additional Config
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config — Get Llm Endpoint Resource Additional Config

**Endpoint**: `GET /v1/inventory/customer/resource/{resource_instance_id}/llm-endpoint-resource-additional-config`
**Summary**: Get Llm Endpoint Resource Additional Config
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url — Get Pentest Connection Url

**Endpoint**: `GET /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url`
**Summary**: Get Pentest Connection Url
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url — Patch Pentest Connection Url

**Endpoint**: `PATCH /v1/inventory/resources/llm-endpoint/{resource_instance_id}/pentest-connection-url`
**Summary**: Patch Pentest Connection Url
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs — List Llm Endpoint Dsl Specs

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs`
**Summary**: List Llm Endpoint Dsl Specs
**Tags**: inventory

**Responses**:
- `200`: Successful Response

---

## POST /v1/inventory/llm-endpoint/dsl/specs — Create Llm Endpoint Dsl Spec

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs`
**Summary**: Create Llm Endpoint Dsl Spec
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id} — Get Llm Endpoint Dsl Spec

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}`
**Summary**: Get Llm Endpoint Dsl Spec
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/versions — List Llm Endpoint Dsl Spec Versions

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/versions`
**Summary**: List Llm Endpoint Dsl Spec Versions
**Tags**: inventory

**Responses**:
- `200`: Successful Response

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions — List Llm Endpoint Dsl Spec Versions For Spec

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions`
**Summary**: List Llm Endpoint Dsl Spec Versions For Spec
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec to filter versions.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions — Create Llm Endpoint Dsl Spec Version

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions`
**Summary**: Create Llm Endpoint Dsl Spec Version
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec to add a version to.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/versions/{llm_endpoint_dsl_spec_version_id} — Get Llm Endpoint Dsl Spec Version

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/versions/{llm_endpoint_dsl_spec_version_id}`
**Summary**: Get Llm Endpoint Dsl Spec Version
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_version_id` (path, required): The ID of the LLM Endpoint DSL Spec Version.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/latest-version — Get Latest Llm Endpoint Dsl Spec Version

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/latest-version`
**Summary**: Get Latest Llm Endpoint Dsl Spec Version
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/validate — Validate Llm Endpoint Dsl Spec

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/validate`
**Summary**: Validate Llm Endpoint Dsl Spec
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/llm-endpoint/dsl/specs-with-versions — List Llm Endpoint Dsl Specs With Versions

**Endpoint**: `GET /v1/inventory/llm-endpoint/dsl/specs-with-versions`
**Summary**: List Llm Endpoint Dsl Specs With Versions
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (query, optional): If provided, return only this spec (404 if not found).

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/test-connection — Test Llm Endpoint Pentest Connection

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/test-connection`
**Summary**: Test Llm Endpoint Pentest Connection
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions/{llm_endpoint_dsl_spec_version_id}/test-connection — Test Llm Endpoint Dsl Spec Connection

**Endpoint**: `POST /v1/inventory/llm-endpoint/dsl/specs/{llm_endpoint_dsl_spec_id}/versions/{llm_endpoint_dsl_spec_version_id}/test-connection`
**Summary**: Test Llm Endpoint Dsl Spec Connection
**Tags**: inventory

**Parameters**:
- `llm_endpoint_dsl_spec_id` (path, required): The ID of the LLM Endpoint DSL Spec.
- `llm_endpoint_dsl_spec_version_id` (path, required): The ID of the LLM Endpoint DSL Spec Version.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl/specs/test-connection — Test Assigned Llm Endpoint Dsl Spec Connection

**Endpoint**: `POST /v1/inventory/resources/llm-endpoint/{resource_instance_id}/dsl/specs/test-connection`
**Summary**: Test Assigned Llm Endpoint Dsl Spec Connection
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): The ID of the LLM Endpoint Resource Instance.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources/dependencies/types — List all dependency types with display names

**Endpoint**: `GET /v1/inventory/resources/dependencies/types`
**Summary**: List all dependency types with display names
**Tags**: inventory

**Responses**:
- `200`: Successful Response

---

## GET /v1/inventory/resource/{resource_instance_id}/dependency-suggestions — Get dependency suggestions for a resource instance

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/dependency-suggestions`
**Summary**: Get dependency suggestions for a resource instance
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/dependencies/manual — Add manual resource dependencies

**Endpoint**: `POST /v1/inventory/resources/dependencies/manual`
**Summary**: Add manual resource dependencies
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory/resources/dependencies/manual — Remove manual resource dependencies

**Endpoint**: `DELETE /v1/inventory/resources/dependencies/manual`
**Summary**: Remove manual resource dependencies
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/tag-definitions — List all tag definitions

**Endpoint**: `GET /v1/inventory/tag-definitions`
**Summary**: List all tag definitions
**Tags**: inventory

**Responses**:
- `200`: Successful Response

---

## GET /v1/inventory/resource/{resource_instance_id}/tags — Get all tags for a resource

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Get all tags for a resource
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/inventory/resource/{resource_instance_id}/tags — Assign or replace tags for a resource

**Endpoint**: `PUT /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Assign or replace tags for a resource
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory/resource/{resource_instance_id}/tags — Remove specific tags from a resource

**Endpoint**: `DELETE /v1/inventory/resource/{resource_instance_id}/tags`
**Summary**: Remove specific tags from a resource
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/tags/assign — Bulk assign tags to multiple resources

**Endpoint**: `POST /v1/inventory/resources/tags/assign`
**Summary**: Bulk assign tags to multiple resources
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/tags/remove — Bulk remove tags from multiple resources

**Endpoint**: `POST /v1/inventory/resources/tags/remove`
**Summary**: Bulk remove tags from multiple resources
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/tags/typeahead — Typeahead suggestions for tag values

**Endpoint**: `GET /v1/inventory/tags/typeahead`
**Summary**: Typeahead suggestions for tag values
**Tags**: inventory

**Parameters**:
- `category` (query, required): Tag category to search
- `prefix` (query, optional): Prefix to filter values
- `limit` (query, optional): Max results

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/job-status/{job_id} — Get Discovery Job Status

**Endpoint**: `GET /v1/inventory/job-status/{job_id}`
**Summary**: Get Discovery Job Status
**Tags**: inventory

Get the status of a job that was initiated to run a discovery scan.

Parameters:
- job_id (UUID): The unique identifier of the discovery job.

Returns:
- dict: A dictionary containing the current status and details of the discovery job.

**Parameters**:
- `job_id` (path, required): The unique identifier of the discovery job

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/technologies — Get Technologies

**Endpoint**: `GET /v1/inventory/technologies`
**Summary**: Get Technologies
**Tags**: inventory

**Parameters**:
- `provider` (query, optional): 
- `category` (query, optional): 
- `technology` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources-types — Get Resource Types

**Endpoint**: `GET /v1/inventory/resources-types`
**Summary**: Get Resource Types
**Tags**: inventory

**Parameters**:
- `provider` (query, optional): 
- `technology` (query, optional): 
- `resource_category` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources —  Api Add Multiple Resource Instance New

**Endpoint**: `POST /v1/inventory/resources`
**Summary**:  Api Add Multiple Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_source_type` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/resources — Api Patch Resource Instances New

**Endpoint**: `PATCH /v1/inventory/resources`
**Summary**: Api Patch Resource Instances New
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/customer/{customer_id}/resources — Api Add Multiple Resource Instance Deprecated

**Endpoint**: `POST /v1/inventory/customer/{customer_id}/resources`
**Summary**: Api Add Multiple Resource Instance Deprecated
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_source_type` (query, optional): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resources — Api Get Resource Instances

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resources`
**Summary**: Api Get Resource Instances
**Tags**: inventory

Returns in a list format of some basic resource information: does not return the full resource instance.

Pagination is opt-in: if neither ``page`` nor ``per_page`` is provided, every matching resource is returned
in a single response. When either is provided, the response additionally includes a ``pagination`` block.

**Parameters**:
- `customer_id` (path, required): 
- `organization` (query, optional): 
- `project` (query, optional): 
- `technology` (query, optional): 
- `cloud_provider_account` (query, optional): 
- `resource_category` (query, optional): 
- `resource_category_model_assets_filter` (query, optional): 
- `resource_type` (query, optional): 
- `omit_not_ai` (query, optional): 
- `has_valid_pentest_connection_details` (query, optional): 
- `pentest_connection_last_test_status` (query, optional): 
- `include_issue_summaries` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 
- `name_search` (query, optional): Case-insensitive substring filter against ``display_name``. Whitespace is trimmed; an empty/whitespace-only value is ignored. LIKE wildcards (``%``, ``_``) in the input are escaped and matched literally.
- `per_page` (query, optional): Items per page. Pass along with ``page`` to enable pagination.
- `page` (query, optional): 1-based page number. Pass along with ``per_page`` to enable pagination.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resource/{resource_instance_id}/dependency-graph — Get Dependency Graph

**Endpoint**: `GET /v1/inventory/resource/{resource_instance_id}/dependency-graph`
**Summary**: Get Dependency Graph
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/resources/dependency-graph — Get Dependency Graphs Paginated

**Endpoint**: `GET /v1/inventory/resources/dependency-graph`
**Summary**: Get Dependency Graphs Paginated
**Tags**: inventory

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_instance_ids` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/resource/{resource_instance_id} — Api Patch Resource Instance New

**Endpoint**: `PATCH /v1/inventory/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/resource/{resource_instance_id} — Api Patch Resource Instance New

**Endpoint**: `PATCH /v1/inventory/customer/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance New
**Tags**: inventory

**Parameters**:
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory/customer/{customer_id}/resource/{resource_instance_id} — Api Patch Resource Instance Old

**Endpoint**: `PATCH /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Api Patch Resource Instance Old
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id} — Api Get Resource Instance

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resource/{resource_instance_id}`
**Summary**: Api Get Resource Instance
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_instance_id` (path, required): 
- `include` (query, optional): Optional include flags for additional response blocks. Supported value: ``data_security_details`` — adds the DCE aggregates (recursive traversal). Omit for the default cheap response. Unknown flags fail with 422 so typos surface immediately rather than being silently dropped.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/supports-system-prompt/{resource_type} — Get Resource Type Supports System Prompt

**Endpoint**: `GET /v1/inventory/supports-system-prompt/{resource_type}`
**Summary**: Get Resource Type Supports System Prompt
**Tags**: inventory

Returns boolean whether a resource type supports system prompts.
Only applicable to resource types that are LlmEndpoints, it will be None if this is called with any other resource type

**Parameters**:
- `resource_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/inventory/resources/projects —  Update Resource Projects

**Endpoint**: `PUT /v1/inventory/resources/projects`
**Summary**:  Update Resource Projects
**Tags**: inventory

Update the project assignments for a list of resources.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/resources/review —  Review Multiple Resources

**Endpoint**: `POST /v1/inventory/resources/review`
**Summary**:  Review Multiple Resources
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory — Discover Inventory For Customer

**Endpoint**: `POST /v1/inventory/discover-inventory`
**Summary**: Discover Inventory For Customer
**Tags**: inventory

DEPRECATED: Use /inventory/discover-inventory/add-resources instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory/add-resources — Discover And Add Inventory

**Endpoint**: `POST /v1/inventory/discover-inventory/add-resources`
**Summary**: Discover And Add Inventory
**Tags**: inventory

Run full discovery for customer - including cloud resources in cloud accounts and models in those cloud accounts.
Customer can optionally filter the cloud accounts to filter to.
Then add the resources to the database (one cloud provider account
at a time). Group all results together in one response showing all the resources that were added.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/discover-inventory/start-discovery-job — Start Customer Discovery Job

**Endpoint**: `POST /v1/inventory/discover-inventory/start-discovery-job`
**Summary**: Start Customer Discovery Job
**Tags**: inventory

Initiate a job to run in the background to initiate a discovery scan. Will run in the background, and
return a job_id that a caller can use for polling.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/discover/jupyter-notebooks/customer/{customer_id} — Discover Jupyter Notebooks Inventory For Customer

**Endpoint**: `POST /v1/inventory/discover/jupyter-notebooks/customer/{customer_id}`
**Summary**: Discover Jupyter Notebooks Inventory For Customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/add-resources/discover/jupyter-notebooks — Discover And Add Jupyter Notebooks Inventory

**Endpoint**: `POST /v1/inventory/add-resources/discover/jupyter-notebooks`
**Summary**: Discover And Add Jupyter Notebooks Inventory
**Tags**: inventory

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/add-resources/discover/jupyter-notebooks/customer/{customer_id} — Discover And Add Jupyter Notebooks Inventory

**Endpoint**: `POST /v1/inventory/add-resources/discover/jupyter-notebooks/customer/{customer_id}`
**Summary**: Discover And Add Jupyter Notebooks Inventory
**Tags**: inventory

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/cloud-discoveries — Get Past Cloud Discovery List

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/cloud-discoveries`
**Summary**: Get Past Cloud Discovery List
**Tags**: inventory, internal

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/project-ai-bom/{project_id}/versions — Get Project Ai Bom Versions

**Endpoint**: `GET /v1/inventory/project-ai-bom/{project_id}/versions`
**Summary**: Get Project Ai Bom Versions
**Tags**: inventory

Get the AI BOM versions for a project

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/project-ai-bom/{project_id} — Get Project Ai Bom

**Endpoint**: `GET /v1/inventory/project-ai-bom/{project_id}`
**Summary**: Get Project Ai Bom
**Tags**: inventory

Get the most recent AI BOM for a project

**Parameters**:
- `project_id` (path, required): 
- `version` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/inventory/project-ai-bom/customer/{customer_id}/project/{project_id} — Create Project Ai Bom

**Endpoint**: `POST /v1/inventory/project-ai-bom/customer/{customer_id}/project/{project_id}`
**Summary**: Create Project Ai Bom
**Tags**: inventory

Create an AI BOM for a project

**Parameters**:
- `project_id` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/customer/{customer_id}/resources/dependency-files — Get Active Dependency Files

**Endpoint**: `GET /v1/inventory/customer/{customer_id}/resources/dependency-files`
**Summary**: Get Active Dependency Files
**Tags**: inventory

Get the active dependency files for a customer

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory/customer/{customer_id}/resources/dependency-file — Delete Dependency File

**Endpoint**: `DELETE /v1/inventory/customer/{customer_id}/resources/dependency-file`
**Summary**: Delete Dependency File
**Tags**: inventory

Delete a dependency file and update resource instances accordingly.

:param customer_id: The customer ID
:param project_id: The project ID
:param dependency_file_identifier: The identifier for the dependency file
:param session: The SQLAlchemy database session

:return: None

**Parameters**:
- `customer_id` (path, required): 
- `project_id` (query, required): 
- `dependency_file_identifier` (query, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/inventory/customer/{customer_id}/resources/dependency-file — Reassign Dependency File Project

**Endpoint**: `PUT /v1/inventory/customer/{customer_id}/resources/dependency-file`
**Summary**: Reassign Dependency File Project
**Tags**: inventory

Reassign a dependency file to a new project, along with all resources associated with it.

:param customer_id: The customer ID
:param current_project_id: The current project ID
:param reassign_project_id: The project ID to reassign to
:param dependency_file_identifier: The identifier for the dependency file
:param session: The SQLAlchemy database session

:return: None

**Parameters**:
- `customer_id` (path, required): 
- `current_project_id` (query, required): 
- `reassign_project_id` (query, required): 
- `dependency_file_identifier` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory/customer/{customer_id}/resources/dependency-files-bulk — Bulk Delete Dependency File

**Endpoint**: `DELETE /v1/inventory/customer/{customer_id}/resources/dependency-files-bulk`
**Summary**: Bulk Delete Dependency File
**Tags**: inventory

Delete a dependency file and update resource instances accordingly.

:param customer_id: The customer ID
:param session: The SQLAlchemy database session
:param requests: List of dependency file actions to delete
:return: None

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/inventory/customer/{customer_id}/resources/dependency-file/bulk-unlink-from-project — Bulk Unlink Dependency File Project

**Endpoint**: `PUT /v1/inventory/customer/{customer_id}/resources/dependency-file/bulk-unlink-from-project`
**Summary**: Bulk Unlink Dependency File Project
**Tags**: inventory

Unlink dependency files from their current project, along with all resources associated with it.

:param customer_id: The customer ID
:param requests: Project id and dependency file identifiers for unlinking
:param session: The SQLAlchemy database session

:return: None

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/inventory-filter-options — Get Inventory Filter Options

**Endpoint**: `GET /v1/inventory/inventory-filter-options`
**Summary**: Get Inventory Filter Options
**Tags**: inventory

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `technology_type` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/technology-filter-options — Get Technology Filter Options

**Endpoint**: `GET /v1/inventory/technology-filter-options`
**Summary**: Get Technology Filter Options
**Tags**: inventory

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `resource_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/repository-search-results — Get Repository Search Results

**Endpoint**: `GET /v1/inventory/repository-search-results`
**Summary**: Get Repository Search Results
**Tags**: inventory

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `exclude_deleted` (query, optional): 
- `search_repo_name` (query, optional): 
- `order_field` (query, optional): 
- `ascending_order` (query, optional): 
- `limit` (query, optional): 
- `offset` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory/repository-configs/{repository_config_id}/resource-instances-by-type — Get Repo Resource Instances By Type

**Endpoint**: `GET /v1/inventory/repository-configs/{repository_config_id}/resource-instances-by-type`
**Summary**: Get Repo Resource Instances By Type
**Tags**: inventory

**Parameters**:
- `repository_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/resource_types — Gets all the resource types seperated by resource category

**Endpoint**: `GET /v1/inventory-policy/resource_types`
**Summary**: Gets all the resource types seperated by resource category
**Tags**: inventory

**Parameters**:
- `resource_category` (query, optional): 
- `capabilities` (query, optional): 
- `archetypes` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy — Create or update inventory policies for the customer

**Endpoint**: `PATCH /v1/inventory-policy`
**Summary**: Create or update inventory policies for the customer
**Tags**: inventory

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy — Get the inventory policy for the customer

**Endpoint**: `GET /v1/inventory-policy`
**Summary**: Get the inventory policy for the customer
**Tags**: inventory

**Responses**:
- `200`: Successful Response

---

## DELETE /v1/inventory-policy — Resets the inventory policies for a customer

**Endpoint**: `DELETE /v1/inventory-policy`
**Summary**: Resets the inventory policies for a customer
**Tags**: inventory

**Parameters**:
- `resource_category` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/resource_category/{resource_category} — Create or update a inventory policy for the customer on a particular category

**Endpoint**: `PATCH /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Create or update a inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/resource_category/{resource_category} — Get the inventory policy for the customer on a particular category

**Endpoint**: `GET /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Get the inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/resource_category/{resource_category} — Resets the inventory policy for a customer

**Endpoint**: `DELETE /v1/inventory-policy/resource_category/{resource_category}`
**Summary**: Resets the inventory policy for a customer
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/resource_category/{resource_category}/toggle_cloud_storage/{cloud_storage_type} — Toggle a cloud storage type for the customer

**Endpoint**: `PATCH /v1/inventory-policy/resource_category/{resource_category}/toggle_cloud_storage/{cloud_storage_type}`
**Summary**: Toggle a cloud storage type for the customer
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `cloud_storage_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Create or update a inventory policy for the customer on a particular category

**Endpoint**: `PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Create or update a inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Resets the inventory policy for a customer

**Endpoint**: `DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Resets the inventory policy for a customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_category` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category} — Get the inventory policy for the customer on a particular category

**Endpoint**: `GET /v1/inventory-policy/customer/{customer_id}/inventory_policy/{resource_category}`
**Summary**: Get the inventory policy for the customer on a particular category
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy — Resets the inventory policies for a customer

**Endpoint**: `DELETE /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Resets the inventory policies for a customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 
- `resource_category` (query, optional): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/inventory-policy/customer/{customer_id}/inventory_policy — Get the inventory policy for the customer

**Endpoint**: `GET /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Get the inventory policy for the customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy — Create or update inventory policies for the customer

**Endpoint**: `PATCH /v1/inventory-policy/customer/{customer_id}/inventory_policy`
**Summary**: Create or update inventory policies for the customer
**Tags**: inventory

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/inventory-policy/inventory_policy/{resource_category}/toggle_cloud_storage/{cloud_storage_type} — Toggle a cloud storage type for the customer

**Endpoint**: `PATCH /v1/inventory-policy/inventory_policy/{resource_category}/toggle_cloud_storage/{cloud_storage_type}`
**Summary**: Toggle a cloud storage type for the customer
**Tags**: inventory

**Parameters**:
- `resource_category` (path, required): 
- `cloud_storage_type` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service/{hosted_service_id} —  Get Hosted Service

**Endpoint**: `GET /v1/hosted-service/{hosted_service_id}`
**Summary**:  Get Hosted Service
**Tags**: inventory

Get a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/hosted-service/{hosted_service_id} —  Delete Hosted Service

**Endpoint**: `DELETE /v1/hosted-service/{hosted_service_id}`
**Summary**:  Delete Hosted Service
**Tags**: inventory

Deletes a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/hosted-service/{hosted_service_id} —  Patch Hosted Service

**Endpoint**: `PATCH /v1/hosted-service/{hosted_service_id}`
**Summary**:  Patch Hosted Service
**Tags**: inventory

Updates a particular hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service —  Get Hosted Services

**Endpoint**: `GET /v1/hosted-service`
**Summary**:  Get Hosted Services
**Tags**: inventory

Get hosted services for a customer with cursor pagination

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `hosted_service_type` (query, optional): 
- `limit` (query, optional): 
- `cursor` (query, optional): 
- `reverse` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service —  Add Hosted Service

**Endpoint**: `POST /v1/hosted-service`
**Summary**:  Add Hosted Service
**Tags**: inventory

Creates a new hosted service

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/hosted-service/bulk —  Delete Hosted Service In Bulk

**Endpoint**: `DELETE /v1/hosted-service/bulk`
**Summary**:  Delete Hosted Service In Bulk
**Tags**: inventory

Deletes a particular hosted service

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/hosted-service/hosted-services/bulk-unlink-from-project —  Unlink Hosted Service From Project In Bulk

**Endpoint**: `PUT /v1/hosted-service/hosted-services/bulk-unlink-from-project`
**Summary**:  Unlink Hosted Service From Project In Bulk
**Tags**: inventory

Updates hosted services by unlinking them from their current project

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service/sync-discovery/{hosted_service_id} —  Sync Run Hosted Service Discovery

**Endpoint**: `POST /v1/hosted-service/sync-discovery/{hosted_service_id}`
**Summary**:  Sync Run Hosted Service Discovery
**Tags**: inventory

Synchronously runs discovery for a hosted service

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/hosted-service/start-discovery-job/{hosted_service_id} — Run Hosted Service Discovery Job

**Endpoint**: `POST /v1/hosted-service/start-discovery-job/{hosted_service_id}`
**Summary**: Run Hosted Service Discovery Job
**Tags**: inventory

Initiate a job to run in the background to initiate a discovery scan. Will run in the background, and
return a job_id that a caller can use for polling.

**Parameters**:
- `hosted_service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/hosted-service/job-status/{job_id} — Get Hosted Service Job Status

**Endpoint**: `GET /v1/hosted-service/job-status/{job_id}`
**Summary**: Get Hosted Service Job Status
**Tags**: inventory

Get the status of a job that was initiated to run a hosted service discovery scan.

**Parameters**:
- `job_id` (path, required): The unique identifier of the hosted service discovery job

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
