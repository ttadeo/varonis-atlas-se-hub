# Atlas API — ai-validation

## GET /v2/ai-validation/categories — Get Categories

**Endpoint**: `GET /v2/ai-validation/categories`
**Summary**: Get Categories
**Tags**: ai-validation

**Parameters**:
- `ai_validation_category_id` (query, optional): 
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/categories/{ai_validation_category_id} — Get Category

**Endpoint**: `GET /v2/ai-validation/categories/{ai_validation_category_id}`
**Summary**: Get Category
**Tags**: ai-validation

**Parameters**:
- `ai_validation_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories — Get Customer Categories

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories`
**Summary**: Get Customer Categories
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (query, optional): Id of specific customer category to retrieve
- `ai_validation_scan_template_id` (query, optional): Id of template to filter categories by
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories — Create Ai Validation Customer Category

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories`
**Summary**: Create Ai Validation Customer Category
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (query, optional): Id of template to associate this category with

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} — Get Customer Category

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id}`
**Summary**: Get Customer Category
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} — Update Customer Category

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id}`
**Summary**: Update Customer Category
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/categories-with-test-cases — Get Customer Categories With Test Cases

**Endpoint**: `GET /v2/ai-validation/categories-with-test-cases`
**Summary**: Get Customer Categories With Test Cases
**Tags**: ai-validation

Get all customer categories with test cases, filterable by template and category id

**Parameters**:
- `filter_active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.
- `ai_validation_customer_category_id` (query, optional): Id of specific customer category to retrieve
- `ai_validation_scan_template_id` (query, optional): if given, will provide testcases from template. If not given, will provide testcases from customer category, and exclude any that were created/edited from template

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/templates/{ai_validation_scan_template_id}/categories-with-test-cases — Get Template With Customer Categories With Test Cases

**Endpoint**: `GET /v2/ai-validation/templates/{ai_validation_scan_template_id}/categories-with-test-cases`
**Summary**: Get Template With Customer Categories With Test Cases
**Tags**: ai-validation

Get all template information along with customer categories and their test cases.

**Parameters**:
- `ai_validation_scan_template_id` (path, required): 
- `filter_active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/templates — Create Ai Validation Customer Scan Template

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates`
**Summary**: Create Ai Validation Customer Scan Template
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates — Get Ai Validation Customer Scan Templates

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/templates`
**Summary**: Get Ai Validation Customer Scan Templates
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (query, optional): Id of specific template to retrieve
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.
- `project_id` (query, optional): Project ID of templates to filter by
- `organization_id` (query, optional): Organization ID of templates to filter by

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase — Create Ai Validation Customer Scan Template With Customer Category Testcase

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase`
**Summary**: Create Ai Validation Customer Scan Template With Customer Category Testcase
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase — Update Ai Validation Customer Scan Template With Customer Category Testcase

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase`
**Summary**: Update Ai Validation Customer Scan Template With Customer Category Testcase
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} — Get Ai Validation Customer Scan Template

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}`
**Summary**: Get Ai Validation Customer Scan Template
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} — Update Ai Validation Template

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}`
**Summary**: Update Ai Validation Template
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan — Start Ai Validation Scan

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan`
**Summary**: Start Ai Validation Scan
**Tags**: ai-validation, internal

Start an AI Validation scan

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases — Create Use Case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases`
**Summary**: Create Use Case
**Tags**: ai-validation

Create a use case

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases — Get Use Cases

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases`
**Summary**: Get Use Cases
**Tags**: ai-validation

Get all use cases for a customer

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/use-cases/{use_case_id} — Update Use Case

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}`
**Summary**: Update Use Case
**Tags**: ai-validation

Update a use case

**Parameters**:
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Create Or Update Ai Validation Use Case Config

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Create Or Update Ai Validation Use Case Config
**Tags**: ai-validation

Create an AI validation use case config by its usecase id, updates if one already exists

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Get Ai Validation Use Case Config

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Get Ai Validation Use Case Config
**Tags**: ai-validation

Get an AI validation use case config by its usecase id

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Update Ai Validation Use Case Config By Use Case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Update Ai Validation Use Case Config By Use Case
**Tags**: ai-validation

Update an AI validation use case config

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Get Schedule For Ai Validation Use Case Config

**Endpoint**: `GET /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Get Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Get a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Create Schedule For Ai Validation Use Case Config

**Endpoint**: `POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Create Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Create a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Delete Schedule For Ai Validation Use Case Config

**Endpoint**: `DELETE /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Delete Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Delete a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Update Schedule For Ai Validation Use Case Config

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Update Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Update a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id} — Update Ai Validation Use Case Config

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id}`
**Summary**: Update Ai Validation Use Case Config
**Tags**: ai-validation

Update an AI validation use case config

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_use_case_config_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id} — Get Use Case

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}`
**Summary**: Get Use Case
**Tags**: ai-validation

Get a specific use case

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution — Get Baseline Execution

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution`
**Summary**: Get Baseline Execution
**Tags**: ai-validation

Get a use case's baseline execution

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution — Update Baseline Execution

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution`
**Summary**: Update Baseline Execution
**Tags**: ai-validation

Update a use case's baseline execution

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-csv — Import Test Cases from CSV File

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-csv`
**Summary**: Import Test Cases from CSV File
**Tags**: ai-validation

**Import test cases from a CSV file into an AI validation customer category with automatic correctness evaluation creation.**

**Parameters**:
- `customer_id` (path, required): The customer ID
- `customer_category_id` (path, required): The customer category ID
- `auto_create_correctness_evaluation` (query, optional): Whether to automatically create a Correctness (RESPONSE_SIMILARITY) evaluation when expected_output column is found in CSV. Defaults to True.

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/importable-datasets — List Importable Datasets For Customer Category

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/importable-datasets`
**Summary**: List Importable Datasets For Customer Category
**Tags**: ai-validation

List capture replay datasets available for import to customer category with importable content analysis.

**Dataset Discovery Workflow:**
Discovers all capture replay datasets accessible to the customer and analyzes their importability for test case creation in AI validation customer categories.

**Filtering Options:**
- **Organization Filter**: Scope datasets to specific organization context when `org_id` is provided
- **Project Filter**: Narrow datasets to project-specific captures when `project_id` is provided
- **Combined Filtering**: Apply both organization and project filters for precise dataset targeting

**Importable Content Analysis:**
- Analyzes firewall requests within each dataset for prompt extraction capability
- Counts requests with valid conversational structure (messages array with user content)
- Identifies requests with extractable prompts suitable for test case transformation
- Excludes malformed requests that cannot be converted to meaningful test cases

**Response Structure:**
- Complete dataset metadata (name, description, creation details)
- Total request count vs. importable request count for import planning
- Organization and project context for dataset source identification
- Pagination support for large dataset collections

**Content Validation:**
- Validates message array structure in firewall requests
- Ensures user messages contain extractable prompt content
- Filters out system-internal or malformed conversation data
- Provides accurate import feasibility assessment per dataset

**Example Use Cases:**
- Browse available datasets before initiating test case import workflows
- Assess dataset quality and importable content volume for planning
- Filter datasets by organizational scope for relevant content discovery
- Evaluate import potential across multiple capture replay sources

**Parameters**:
- `customer_id` (path, required): 
- `customer_category_id` (path, required): 
- `org_id` (query, optional): Organization ID filter
- `project_id` (query, optional): Project ID filter
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Number of results per page

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset — Import Dataset as Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset`
**Summary**: Import Dataset as Test Cases
**Tags**: ai-validation

Transform capture replay dataset into test cases with optional expected outputs and auto-evaluation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `customer_category_id` (path, required): Target customer category identifier for test case creation

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/import-csv — Parse CSV File for Test Cases

**Endpoint**: `POST /v2/ai-validation/import-csv`
**Summary**: Parse CSV File for Test Cases
**Tags**: ai-validation

**Parse a CSV file containing test case prompts and return structured JSON data for frontend consumption.**

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/importable-datasets — Get Importable Datasets for AI Validation

**Endpoint**: `GET /v2/ai-validation/importable-datasets`
**Summary**: Get Importable Datasets for AI Validation
**Tags**: ai-validation

**Get list of datasets available for import to AI validation test case creation.**

**Parameters**:
- `organization_id` (query, optional): Optional organization ID filter
- `project_id` (query, optional): Optional project ID filter

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/job-status/{job_id} — Get Pentest Job

**Endpoint**: `GET /v2/ai-validation/job-status/{job_id}`
**Summary**: Get Pentest Job
**Tags**: ai-validation

Get the status of a job that was initiated to run a discovery scan.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox — Create AI Validation Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox`
**Summary**: Create AI Validation Sandbox
**Tags**: ai-validation

Create a new AI validation sandbox for testing AI models and services with comprehensive configuration options

**Parameters**:
- `customer_id` (path, required): Customer identifier

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox — List AI Validation Sandboxes

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox`
**Summary**: List AI Validation Sandboxes
**Tags**: ai-validation

Retrieve AI validation sandboxes with optional filtering and pagination

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `organization_id` (query, optional): Filter sandboxes by organization ID (optional)
- `project_id` (query, optional): Filter sandboxes by project ID (optional)
- `active_only` (query, optional): Return only active sandboxes (default: false - returns all)
- `search` (query, optional): Search term for sandbox display name (partial match) or ID (partial UUID match). Empty strings are ignored.
- `page` (query, optional): Page number (1-based).
- `per_page` (query, optional): Items per page (1-500).

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances — Get Resource Instances Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances`
**Summary**: Get Resource Instances Route
**Tags**: ai-validation

Get all resource instances that could be added to a sandbox.

Retrieves available resource instances (AI models and services) that can be
assigned to a sandbox. These instances exist in the system but may not yet
be associated with any sandbox.

Supports filtering by availability status and whether they're currently active.
Returns both resource instances and categorized pentest models.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `resource_instance_id` (query, optional): Optional filter for a specific resource instance
- `available_only` (query, optional): Only show resources not already associated with a sandbox
- `active` (query, optional): Only show active resources

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Get AI Validation Sandbox Details

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Get AI Validation Sandbox Details
**Tags**: ai-validation

Retrieve detailed information about a specific AI validation sandbox

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Unique sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Update AI Validation Sandbox

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Update AI Validation Sandbox
**Tags**: ai-validation

Modify configuration and settings of an existing AI validation sandbox

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Unique sandbox identifier

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Delete AI Validation Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Delete AI Validation Sandbox
**Tags**: ai-validation

Permanently remove an AI validation sandbox and all associated data including test cases, executions, and results

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Unique sandbox identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone — Clone AI Validation Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone`
**Summary**: Clone AI Validation Sandbox
**Tags**: ai-validation

Create an identical copy of an existing sandbox with all configurations, test data, and evaluation settings

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Unique identifier of sandbox to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort — Abort Sandbox Executions

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort`
**Summary**: Abort Sandbox Executions
**Tags**: ai-validation

Terminate all active executions for a sandbox

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — Add AI Model/Service to Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Add AI Model/Service to Sandbox
**Tags**: ai-validation

Assign an existing AI model or service to a sandbox for testing and evaluation with execution ordering

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Target sandbox identifier

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — List Sandbox AI Models/Services

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: List Sandbox AI Models/Services
**Tags**: ai-validation

Retrieve all AI models and services assigned to a specific sandbox with execution configuration and status

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to query

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — Remove AI Model/Service from Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Remove AI Model/Service from Sandbox
**Tags**: ai-validation

Remove one or more AI models/services from a sandbox environment by instance ID or resource ID

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing resources to remove
- `resource_instance_id` (query, optional): Remove ALL sandbox assignments of this resource instance
- `sandbox_resource_id` (query, optional): Remove specific sandbox resource by its unique ID

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id} — Update Sandbox AI Model/Service Configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}`
**Summary**: Update Sandbox AI Model/Service Configuration
**Tags**: ai-validation

Modify the configuration of an AI model or service within a sandbox including execution order and settings

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing the resource
- `resource_id` (path, required): Unique identifier of the sandbox resource to update

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases — Add Test Cases to Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: Add Test Cases to Sandbox
**Tags**: ai-validation

**Add one or more test cases to an AI validation sandbox with optional expected outputs and automatic correctness evaluation creation.**

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases — List Sandbox Test Cases

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: List Sandbox Test Cases
**Tags**: ai-validation

Retrieve paginated list of test cases configured for sandbox execution and validation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to query
- `page` (query, optional): Page number (1-based, optional). If not provided, returns all testcases.
- `per_page` (query, optional): Number of results per page (optional). If not provided, returns all testcases.
- `filter_evaluation_type` (query, optional): Filter by evaluation type (e.g., BINARY_CLASSIFICATION).
- `filter_passed` (query, optional): Filter by evaluation outcome: true=PASS only, false=FAIL only.
- `filter_evaluation_id` (query, optional): Filter by evaluation ID.
- `resource_ids` (query, optional): Filter by specific resource IDs (supports multiple).

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} — Remove Test Case from Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Remove Test Case from Sandbox
**Tags**: ai-validation

Permanently delete a test case and its configuration from the sandbox

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to remove

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} — Update Sandbox Test Case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Update Sandbox Test Case
**Tags**: ai-validation

Modify test case configuration including prompts and template variables

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to update

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant — Generate Test Cases with AI Assistant

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant`
**Summary**: Generate Test Cases with AI Assistant
**Tags**: ai-validation

Create test cases automatically using AI-powered generation from user description and requirements

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier for test case creation

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone — Clone Sandbox Test Case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone`
**Summary**: Clone Sandbox Test Case
**Tags**: ai-validation

Create an exact duplicate of an existing test case with new unique identifier

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing the test case
- `testcase_id` (path, required): Test case identifier to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete — Bulk Delete Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete`
**Summary**: Bulk Delete Test Cases
**Tags**: ai-validation

Delete multiple test cases from an AI validation sandbox in a single operation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing test cases to delete

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases — Generate AI-Powered Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases`
**Summary**: Generate AI-Powered Test Cases
**Tags**: ai-validation

Create comprehensive test cases using advanced AI models based on user requirements and specifications

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier for test case generation

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv — Import Test Cases from CSV File

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv`
**Summary**: Import Test Cases from CSV File
**Tags**: ai-validation

**Import test cases from a CSV file into an AI validation sandbox with support for VUP/non-VUP modes and automatic correctness evaluation creation.**

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `auto_create_correctness_evaluation` (query, optional): Whether to automatically create a Correctness (RESPONSE_SIMILARITY) evaluation when expected_output column is found in CSV. Defaults to True.
- `auto_create_binary_classification` (query, optional): Whether to automatically create a BINARY_CLASSIFICATION evaluation when actual_label column is found in CSV. Defaults to True.

**Request Body** (required):
- `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets — List Available Datasets for Import

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets`
**Summary**: List Available Datasets for Import
**Tags**: ai-validation

**Retrieve capture replay datasets available for import into a sandbox for test case generation and validation.**

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Target sandbox identifier for import validation
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset — Import Dataset as Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset`
**Summary**: Import Dataset as Test Cases
**Tags**: ai-validation

Transform capture replay dataset into test cases with optional expected outputs and auto-evaluation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Target sandbox identifier for test case creation

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute — Execute Sandbox (Async)

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute`
**Summary**: Execute Sandbox (Async)
**Tags**: ai-validation

Start asynchronous execution of AI models against test cases with background processing

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to execute

**Request Body** (optional):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions — List Sandbox Executions

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions`
**Summary**: List Sandbox Executions
**Tags**: ai-validation

Retrieve all execution records for a sandbox with optional status filtering

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to query
- `status_filter` (query, optional): Filter executions by status (pending, running, completed, failed, cancelled)

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} — Get Execution Summary

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Get Execution Summary
**Tags**: ai-validation

Retrieve detailed summary of execution status, progress, and result statistics

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to summarize

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} — Delete Sandbox Execution

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Delete Sandbox Execution
**Tags**: ai-validation

Permanently remove execution record and all associated test results

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results — List Execution Results

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results`
**Summary**: List Execution Results
**Tags**: ai-validation

Retrieve all test case results for a specific execution with detailed outcomes

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier for results

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} — Get Specific Execution Result

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Get Specific Execution Result
**Tags**: ai-validation

Retrieve detailed information for a single test case execution result

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Specific result identifier to retrieve

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} — Update Execution Result

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Update Execution Result
**Tags**: ai-validation

Modify execution result details and outcomes for manual corrections

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Result identifier to update

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results — Clear Execution Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results`
**Summary**: Clear Execution Results
**Tags**: ai-validation

Reset execution results while preserving execution history for re-execution

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to clear
- `clear_failed_only` (query, optional): If true, only clear failed execution results, preserving successful ones

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results — Clear Test Case Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results`
**Summary**: Clear Test Case Results
**Tags**: ai-validation

Reset execution results for a specific test case while preserving other results

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `testcase_id` (path, required): Test case identifier to clear results for

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases — Clear Multiple Test Case Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases`
**Summary**: Clear Multiple Test Case Results
**Tags**: ai-validation

Reset execution results for multiple test cases in batch operation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results — Get Latest Execution Results with Filtering and Pagination

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results`
**Summary**: Get Latest Execution Results with Filtering and Pagination
**Tags**: ai-validation

Retrieve slim latest results with optional filtering and pagination. Supports filtering by testcase IDs, resource IDs, status, and evaluation ID. No aggregations included; statuses are normalized to strings; tri-state 'passed' preserved; optional 'score' included when available. Backward compatible: omit pagination params to get all results.

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier for latest results
- `page` (query, optional): Page number (1-based, optional). If not provided, returns all results.
- `per_page` (query, optional): Items per page (1-1000, optional). Defaults to 50 if page provided.
- `testcase_ids` (query, optional): Filter by specific testcase IDs (supports multiple).
- `resource_ids` (query, optional): Filter by specific resource IDs (supports multiple).
- `filter_status` (query, optional): Filter by execution status (SUCCESS, FAILED, PENDING, etc.).
- `filter_evaluation_type` (query, optional): Filter by evaluation type (e.g., BINARY_CLASSIFICATION).
- `filter_passed` (query, optional): Filter by evaluation outcome: true=PASS, false=FAIL (excludes INCONCLUSIVE).
- `filter_evaluation_id` (query, optional): Filter by evaluation ID.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations — Create Sandbox Evaluation

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: Create Sandbox Evaluation
**Tags**: ai-validation

Define evaluation criteria and configuration for AI model output assessment and validation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier for evaluation configuration

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations — List Sandbox Evaluations

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: List Sandbox Evaluations
**Tags**: ai-validation

Retrieve all evaluation configurations and criteria defined for the sandbox

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to query evaluations
- `page` (query, optional): Page number (ignored for top-level results)
- `per_page` (query, optional): Number of evaluations per page (ignored for top-level results)
- `testcase_ids` (query, optional): Filter nested testcase data (expected_outputs_per_testcase, actual_labels_per_testcase, etc.) to only include these testcase IDs. If omitted or empty, all testcase data is included.
- `filter_evaluation_type` (query, optional): Filter by evaluation type (e.g., BINARY_CLASSIFICATION). If both filters and testcase_ids are provided, testcase_ids takes precedence.
- `filter_passed` (query, optional): Filter by evaluation outcome: true=PASS only, false=FAIL only. If both filters and testcase_ids are provided, testcase_ids takes precedence.
- `filter_evaluation_id` (query, optional): Filter by evaluation ID. If both filters and testcase_ids are provided, testcase_ids takes precedence.
- `resource_ids` (query, optional): Filter by specific resource IDs (supports multiple). If both filters and testcase_ids are provided, testcase_ids takes precedence.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Get Evaluation Configuration

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Get Evaluation Configuration
**Tags**: ai-validation

Retrieve detailed configuration and parameters for a specific evaluation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to retrieve

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Update Evaluation Configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Update Evaluation Configuration
**Tags**: ai-validation

Modify evaluation parameters, criteria, and configuration settings

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to update

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Delete Evaluation Configuration

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Delete Evaluation Configuration
**Tags**: ai-validation

Permanently remove evaluation configuration and all associated settings

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluate — Execute Evaluations (Async)

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluate`
**Summary**: Execute Evaluations (Async)
**Tags**: ai-validation

Queue comprehensive evaluation of all sandbox results using configured evaluation criteria

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier for evaluation execution

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary — Generate Sandbox Commentary Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary`
**Summary**: Generate Sandbox Commentary Route
**Tags**: ai-validation

Generate AI commentary for a sandbox to help understand which resource performed best
against the user-defined goal.

This endpoint:
1. Validates that the sandbox has a defined goal
2. Retrieves the latest execution results and evaluations
3. Sends data to the LLM-Pentest service for analysis
4. Stores the commentary in the sandbox
5. Returns the generated commentary

Args:
    customer_id: The customer ID
    sandbox_id: The sandbox ID
    session: Database session

Returns:
    Dict containing commentary text, best resource, and metadata

Raises:
    HTTPException: If no goal is defined, no executions exist, or commentary generation fails

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/stream — Stream Sandbox Execution Updates

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/stream`
**Summary**: Stream Sandbox Execution Updates
**Tags**: ai-validation

Stream sandbox execution updates in real-time using Server-Sent Events (SSE).

Provides live updates about the execution progress, including status changes
and new results as they become available. Ensures a 'complete' event is sent
when the stream finishes or encounters an unrecoverable error.

Args:
    customer_id: The customer ID
    sandbox_id: The sandbox ID
    execution_id: The execution ID to stream updates for
    pollInterval: Polling interval in seconds (1-60, default: 3)

Returns:
    A streaming response with SSE events

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `execution_id` (path, required): The execution ID
- `pollInterval` (query, optional): Polling interval in seconds

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/progressive-state — Get Progressive Execution State (Slim)

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/progressive-state`
**Summary**: Get Progressive Execution State (Slim)
**Tags**: ai-validation

Get current progressive execution state aligned with the slim latest-results structure. Returns minimal results with normalized statuses and evaluations_metadata; includes execution context fields.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `execution_id` (path, required): The execution ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/all/active-jobs — Check for Global Active Jobs

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/all/active-jobs`
**Summary**: Check for Global Active Jobs
**Tags**: ai-validation

Check for all active evaluation jobs across all sandboxes for the customer

**Parameters**:
- `customer_id` (path, required): The customer ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/active-jobs — Check for Active Jobs

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/active-jobs`
**Summary**: Check for Active Jobs
**Tags**: ai-validation

Check if sandbox has active evaluation jobs for polling state restoration

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone — Clone Sandbox Resource Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone`
**Summary**: Clone Sandbox Resource Route
**Tags**: ai-validation

Clone an existing AI Validation Sandbox resource within the same sandbox.
The new resource will have a new ID and the next available execution_order.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `resource_id` (path, required): The resource ID to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/validate — Validate Single LLM Endpoint Resource

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/validate`
**Summary**: Validate Single LLM Endpoint Resource
**Tags**: ai-validation

Checks secret existence and performs live provider API key validation for the specified resource instance

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `resource_id` (path, required): The sandbox resource ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate — Validate All LLM Endpoint Resources

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate`
**Summary**: Validate All LLM Endpoint Resources
**Tags**: ai-validation

Checks all LLM Endpoint resources in the specified sandbox for secret existence and live provider API key validity

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables — Get Sandbox Template Variables Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables`
**Summary**: Get Sandbox Template Variables Route
**Tags**: ai-validation

Get all unique template variable names for a sandbox.

This endpoint discovers all unique variable names used across
all resource prompt templates in the specified sandbox.

Returns a list of variable names that can be used for creating
structured test case variable forms.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Update Testcase Variables Route Put

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Update Testcase Variables Route Put
**Tags**: ai-validation

Update variable values for a specific test case (PUT - full replacement).

This endpoint allows updating the variable data for a test case using
a structured key-value format instead of raw JSON.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Update Testcase Variables Route Patch

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Update Testcase Variables Route Patch
**Tags**: ai-validation

Update variable values for a specific test case (PATCH - partial update).

This endpoint allows updating the variable data for a test case using
a structured key-value format instead of raw JSON.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Get Testcase Variables Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Get Testcase Variables Route
**Tags**: ai-validation

Get current variable values for a specific test case.

Returns the structured variable data for a test case that can be
used to populate forms or display current variable assignments.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation — Create Commentary Conversation Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Create Commentary Conversation Route
**Tags**: ai-validation

**Create a new commentary conversation for an AI validation sandbox.**

**Conversation Requirements:**
- Commentary must be generated for the sandbox before conversation creation
- Only available after sandbox has `commentary_generated_at` timestamp
- Each sandbox can have only one active conversation at a time
- Creates threaded conversation where users can discuss sandbox commentary with automated responses

**Initial Message Handling:**
- Optionally accepts `initial_message_content` to start the conversation
- If provided, creates the first user message in the conversation thread
- Initial messages are attributed to the specified `sender_id`
- Conversation timestamps are updated based on message activity

**Conversation Behavior:**
- New conversations automatically receive "active" status
- Conversation data initialized with empty message thread structure
- System responses use enhanced context-aware chat service for optimal quality
- Message threading supports follow-up questions and contextual continuity

**Frontend Integration:**
- Returns complete conversation metadata for UI state management
- Includes `message_count`, `status`, and `last_activity` for real-time updates
- Conversation ID required for all subsequent message operations
- Auto-generates discussion suggestions based on sandbox commentary

**Performance Features:**
- Optimized JSONB operations for efficient message storage
- Conversation caching for improved response times
- Smart context extraction based on sandbox execution results

**Error Handling:**
- Validates sandbox exists and belongs to customer
- Checks commentary generation status before allowing conversation creation
- Prevents duplicate conversations for the same sandbox
- Handles concurrent conversation creation attempts gracefully

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- request: CreateConversationRequest with optional initial_message_content and sender_id
- session: Database session

**Returns:**
- `ConversationResponse` with conversation_id, metadata, timestamps, and message_count

**Raises:**
- HTTPException 400: Commentary not yet generated for sandbox
- HTTPException 404: Sandbox not found or doesn't belong to customer
- HTTPException 409: Conversation already exists for this sandbox
- HTTPException 422: Invalid request data or missing required fields

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation — Get Commentary Conversation Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Get Commentary Conversation Route
**Tags**: ai-validation

**Get the commentary conversation for an AI validation sandbox.**

**Availability Requirements:**
- Commentary must be generated before conversation can be retrieved
- Only returns conversations for sandboxes with valid `commentary_generated_at` timestamp
- Conversation must be associated with the specified sandbox and customer
- Returns 404 if no conversation exists or sandbox lacks commentary

**Conversation Data Structure:**
- Complete conversation metadata including message count and status
- Timestamps for creation, last update, and last activity
- JSONB conversation data with threaded message structure
- Participant information and conversation settings

**Response Information:**
- `conversation_id`: Unique identifier for subsequent operations
- `message_count`: Total number of messages in conversation thread
- `status`: Current conversation status (active, archived, closed)
- `last_activity`: Timestamp of most recent message or status change
- `conversation_data`: Complete JSONB structure with message thread

**Frontend Integration:**
- Use conversation_id for message operations and real-time updates
- Monitor `last_activity` for conversation freshness indicators
- Display `message_count` for conversation length in UI
- Handle conversation status to control user interaction capabilities

**Performance Considerations:**
- Optimized query using GIN indexes on JSONB conversation data
- Efficient metadata retrieval without loading full message content
- Cached conversation lookups for frequently accessed sandboxes

**Error Handling:**
- Validates sandbox exists and belongs to customer
- Checks commentary generation status before conversation lookup
- Returns appropriate 404 when conversation doesn't exist
- Handles database connection issues gracefully

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- session: Database session

**Returns:**
- `ConversationResponse` with complete conversation metadata and structure

**Raises:**
- HTTPException 400: Commentary not yet generated for sandbox
- HTTPException 404: Sandbox or conversation not found
- HTTPException 403: Conversation doesn't belong to customer

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages — Add Message To Conversation Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: Add Message To Conversation Route
**Tags**: ai-validation

**Add a new message to an existing commentary conversation.**

**Message Requirements:**
- Conversation must exist and be in "active" status
- Commentary must be generated for the associated sandbox
- Message content must be non-empty and within length limits
- Sender type must be either "user" or "ai" with valid sender_id

**Message Threading:**
- Supports threaded conversations with `response_to` message references
- Messages are appended to JSONB conversation data using atomic operations
- Maintains chronological order with precise timestamps
- Updates conversation metadata (message_count, last_activity) automatically

**Sender Types & Metadata:**
- **User Messages**: Include sender_id, optional response_to for threading
- **AI Messages**: Include ai_metadata with model, processing_time, tokens_used
- Message IDs auto-generated for unique identification
- Timestamps recorded in UTC with millisecond precision

**AI Response Integration:**
- AI messages benefit from enhanced context-aware chat service
- Context includes sandbox commentary, execution results, and conversation history
- Smart query analysis for relevant data extraction
- Performance-optimized caching for faster response times

**Conversation State Updates:**
- Automatically updates `last_activity` timestamp
- Increments `message_count` for conversation length tracking
- Maintains conversation status and participant information
- Triggers cache invalidation for real-time updates

**Frontend Integration:**
- Returns updated conversation metadata for UI state management
- Include message threading information for conversation flow display
- Monitor conversation updates for real-time chat interfaces
- Handle message acknowledgment and delivery status

**Performance Features:**
- Atomic JSONB append operations prevent data corruption
- Optimized queries using PostgreSQL JSONB functions
- Message validation and sanitization for security
- Bulk operation support for multiple message additions

**Error Handling:**
- Validates conversation exists and is accessible
- Checks commentary generation status before allowing messages
- Prevents messages to closed or archived conversations
- Handles concurrent message additions safely

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- conversation_id: Target conversation ID (from path parameter)
- request: AddMessageRequest with sender_type, sender_id, content, optional response_to, optional ai_metadata
- session: Database session

**Returns:**
- `ConversationResponse` with updated conversation metadata and message count

**Raises:**
- HTTPException 400: Commentary not generated, conversation closed, or invalid message data
- HTTPException 404: Sandbox, conversation, or referenced message not found
- HTTPException 403: Conversation doesn't belong to customer
- HTTPException 422: Invalid sender_type, empty content, or malformed ai_metadata

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages — Get Conversation Messages Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: Get Conversation Messages Route
**Tags**: ai-validation

**Get messages from a commentary conversation with pagination.**

**Pagination Features:**
- Standard limit/offset pagination (1-100 messages per request)
- Messages ordered chronologically from oldest to newest
- Total count included for frontend pagination controls
- Efficient JSONB querying for large conversation threads

**Message Structure:**
- Complete message data including content, timestamps, and metadata
- Sender information (type, sender_id) for proper attribution
- Threading information (`response_to`) for conversation flow
- AI metadata (model, processing_time, tokens) for AI messages

**Conversation Requirements:**
- Commentary must be generated for the associated sandbox
- Conversation must exist and be accessible to the customer
- Returns empty list if conversation has no messages
- Validates conversation ownership before message retrieval

**Performance Optimizations:**
- Uses PostgreSQL JSONB path operations for efficient message extraction
- GIN indexes on conversation data for fast query performance
- Minimal data transfer with pagination boundaries
- Cached conversation metadata for repeated requests

**Frontend Integration:**
- Use `total_count` for pagination UI controls and message indicators
- Messages include complete metadata for rendering conversation threads
- Support for infinite scroll with offset-based loading
- Real-time updates can append new messages to existing lists

**Message Content:**
- Full message text content with preserved formatting
- UTC timestamps for accurate chronological ordering
- Message IDs for unique identification and threading
- Sender attribution for proper conversation flow display

**Error Handling:**
- Validates conversation exists and belongs to customer
- Checks commentary generation status before message retrieval
- Handles invalid pagination parameters gracefully
- Returns appropriate errors for inaccessible conversations

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- conversation_id: Target conversation ID (from path parameter)
- limit: Number of messages to return (1-100, default 50)
- offset: Number of messages to skip (default 0)
- session: Database session

**Returns:**
- `ConversationMessagesResponse` with messages array, total_count, limit, and offset

**Raises:**
- HTTPException 400: Commentary not generated or invalid pagination parameters
- HTTPException 404: Sandbox, conversation not found
- HTTPException 403: Conversation doesn't belong to customer
- HTTPException 422: Invalid limit or offset values

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID
- `limit` (query, optional): Number of messages to return
- `offset` (query, optional): Number of messages to skip

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status — Update Conversation Status Route

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status`
**Summary**: Update Conversation Status Route
**Tags**: ai-validation

**Update the status of a commentary conversation.**

**Status Management:**
- **Active**: Conversation open for new messages and AI interactions
- **Archived**: Conversation preserved but no new messages allowed
- **Closed**: Conversation terminated, read-only access for history
- Status changes automatically update `last_activity` timestamp

**Status Transition Rules:**
- Active → Archived: Preserves conversation for historical reference
- Active → Closed: Permanently ends conversation, blocks new messages
- Archived → Active: Reactivates conversation for continued discussion
- Closed conversations cannot be reactivated (create new conversation instead)

**Conversation Requirements:**
- Commentary must be generated for the associated sandbox
- Conversation must exist and belong to the customer
- Only active conversations accept new messages
- Status changes preserve all existing conversation data and messages

**Behavioral Impact:**
- **Active Status**: Full functionality - messages, AI responses, threading
- **Archived Status**: Read-only access, no new messages or AI interactions
- **Closed Status**: Historical access only, all interactive features disabled
- Status affects UI controls and available actions in frontend

**Frontend Integration:**
- Use status to control message input availability and UI state
- Display status indicators for conversation management
- Handle status transitions with appropriate user notifications
- Update conversation lists to reflect current status

**Metadata Updates:**
- Automatically updates `last_activity` with status change timestamp
- Preserves `message_count` and conversation creation data
- Maintains conversation_id and all relationship information
- Updates conversation data JSONB with status change metadata

**Performance Considerations:**
- Atomic status updates prevent concurrent modification issues
- Cached conversation status for fast UI state management
- Optimized queries using indexed status fields
- Minimal data transfer with focused status updates

**Error Handling:**
- Validates conversation exists and belongs to customer
- Checks commentary generation status before status updates
- Prevents invalid status transitions (e.g., reactivating closed conversations)
- Handles concurrent status update attempts safely

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- conversation_id: Target conversation ID (from path parameter)
- request: UpdateConversationStatusRequest with new status value
- session: Database session

**Returns:**
- `ConversationResponse` with updated conversation metadata and status

**Raises:**
- HTTPException 400: Commentary not generated, invalid status transition, or conversation already in target status
- HTTPException 404: Sandbox or conversation not found
- HTTPException 403: Conversation doesn't belong to customer
- HTTPException 422: Invalid status value or malformed request

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations — List Conversations Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations`
**Summary**: List Conversations Route
**Tags**: ai-validation

**List all commentary conversations for a customer.**

**Pagination & Filtering:**
- Standard limit/offset pagination (1-100 conversations per request)
- Optional status filtering (active, archived, closed)
- Conversations ordered by last_activity (most recent first)
- Total count included for pagination controls and dashboard metrics

**Conversation Requirements:**
- Only returns conversations for sandboxes with generated commentary
- Filters out conversations for sandboxes without `commentary_generated_at`
- Validates customer ownership for all returned conversations
- Includes conversations across all accessible sandboxes

**Conversation Metadata:**
- Complete conversation information including message counts and timestamps
- Associated sandbox_id for linking conversations to specific sandboxes
- Status information for conversation management and UI controls
- Last activity timestamps for conversation freshness indicators

**Status Filter Options:**
- **No filter**: Returns all conversations regardless of status
- **"active"**: Only conversations accepting new messages
- **"archived"**: Only preserved conversations (read-only)
- **"closed"**: Only terminated conversations (historical access)
- Invalid status values return empty results

**Frontend Integration:**
- Use for conversation dashboard and management interfaces
- Display conversation lists with status indicators and activity timestamps
- Support conversation selection and navigation to specific sandbox chats
- Implement conversation management actions (archive, close, reactivate)

**Performance Optimizations:**
- Efficient queries with indexes on customer_id, status, and last_activity
- Minimal data transfer with pagination boundaries
- Cached conversation counts for dashboard metrics
- Optimized JSONB operations for conversation metadata extraction

**Conversation Context:**
- Each conversation linked to specific sandbox for context navigation
- Conversation data includes participant information and settings
- Message counts provide conversation activity indicators
- Timestamps enable conversation aging and cleanup policies

**Error Handling:**
- Validates customer exists and has appropriate permissions
- Handles invalid status filter values gracefully
- Returns empty list when no conversations meet criteria
- Manages pagination boundary conditions properly

**Args:**
- customer_id: Customer ID (from path parameter)
- limit: Number of conversations to return (1-100, default 50)
- offset: Number of conversations to skip (default 0)
- status_filter: Optional status filter ("active", "archived", "closed")
- session: Database session

**Returns:**
- `ConversationListResponse` with conversations array, total_count, limit, and offset

**Raises:**
- HTTPException 400: Invalid pagination parameters or status filter
- HTTPException 404: Customer not found or no accessible conversations
- HTTPException 422: Invalid limit, offset, or status_filter values

**Parameters**:
- `customer_id` (path, required): The customer ID
- `limit` (query, optional): Number of conversations to return
- `offset` (query, optional): Number of conversations to skip
- `status_filter` (query, optional): Filter by conversation status

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send — Send Message And Get Ai Response Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send`
**Summary**: Send Message And Get Ai Response Route
**Tags**: ai-validation

**Send a user message and receive an AI response in commentary chat.**

**Enhanced Chat Architecture:**
- Uses context-aware AI service for optimal response quality
- Smart query analysis extracts relevant sandbox data based on user intent
- Comprehensive context building from conversation history and commentary
- Performance-optimized caching reduces response times for similar queries
- Advanced model selection based on query complexity and type

**Conversation Requirements:**
- Commentary must be generated for the sandbox before chat functionality
- Creates conversation automatically if none exists for the sandbox
- Only works with active conversations (not archived or closed)
- User message must be non-empty and within reasonable length limits

**Message Processing Flow:**
1. **Message Addition**: Adds user message to conversation thread with timestamp
2. **Query Analysis**: Analyzes message intent (performance, comparison, troubleshooting, etc.)
3. **Context Extraction**: Gathers relevant sandbox data based on query type
4. **History Integration**: Builds context from recent conversation messages
5. **AI Response Generation**: Creates context-aware response using enhanced chat service
6. **Response Caching**: Caches AI responses for improved performance on similar queries
7. **Conversation Update**: Adds AI response to thread and updates metadata

**Context-Aware Responses:**
- **Performance Queries**: Includes execution metrics, timing data, and optimization suggestions
- **Model Comparisons**: Provides comparative analysis across different model results
- **Test Case Questions**: References specific test cases and their results
- **Error Analysis**: Extracts error patterns and provides troubleshooting guidance
- **General Discussion**: Uses full sandbox commentary for comprehensive responses

**Conversation Reset Behavior:**
- **New Commentary Generation**: Conversations are reset when sandbox commentary is regenerated
- **Context Refresh**: Cache invalidation occurs when commentary content changes
- **Thread Continuity**: Existing conversations maintain threading unless commentary is updated
- **Performance Cache**: Response cache cleared when underlying sandbox data changes

**AI Response Quality Features:**
- Follow-up question detection for contextual continuity
- Smart context extraction based on query keywords and intent
- Conversation threading awareness for multi-turn discussions
- Fallback handling for service unavailability with informative error messages

**Frontend Integration:**
- Returns both user and AI message IDs for thread management
- Includes processing metadata (model, timing, tokens) for transparency
- Conversation updates enable real-time chat interface functionality
- Supports message acknowledgment and delivery status tracking

**Performance Optimizations:**
- Response caching with TTL for frequently asked questions
- Atomic message operations prevent conversation data corruption
- Optimized JSONB operations for efficient message storage
- Smart context extraction reduces AI processing overhead

**Error Handling & Fallbacks:**
- Graceful degradation when AI service is unavailable
- Fallback responses for temporary service interruptions
- Message validation prevents malformed conversation data
- Comprehensive error logging for debugging and monitoring

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- request: SendMessageRequest with message content, sender_id, optional response_to
- session: Database session

**Returns:**
- `SendMessageResponse` with conversation_id, user_message_id, ai_message_id, ai_response, and processing_metadata

**Raises:**
- HTTPException 400: Commentary not generated, conversation closed, or empty message
- HTTPException 404: Sandbox not found or doesn't belong to customer
- HTTPException 422: Invalid message content, sender_id, or malformed request
- HTTPException 500: AI service unavailable (returns fallback response)

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat — Get Commentary Chat With Suggestions Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat`
**Summary**: Get Commentary Chat With Suggestions Route
**Tags**: ai-validation

**Get commentary conversation with AI-generated discussion suggestions.**

**Conversation & Suggestion Requirements:**
- Commentary must be generated for the sandbox before suggestions can be provided
- Returns existing conversation or indicates when conversation creation is available
- AI suggestions are generated based on sandbox commentary content and execution results
- Only available for sandboxes with valid `commentary_generated_at` timestamp

**AI-Generated Discussion Suggestions:**
- **Performance Questions**: Suggested inquiries about execution speed, latency, and optimization
- **Model Comparison Queries**: Questions about comparing different model performance
- **Test Case Analysis**: Suggestions for discussing specific test cases and their results
- **Error Investigation**: Questions about failures, issues, and troubleshooting approaches
- **General Commentary**: Open-ended questions about overall sandbox findings

**Conversation State Handling:**
- **Existing Conversation**: Returns complete conversation metadata with current status
- **No Conversation**: Returns null conversation with suggestions for starting discussion
- **Conversation Reset**: Suggestions updated when commentary is regenerated
- **Status-Aware**: Suggestions reflect current conversation state and activity

**Suggestion Generation Context:**
- Analyzes sandbox execution results for relevant discussion topics
- Considers model performance metrics and comparison opportunities
- Reviews error patterns and failure cases for troubleshooting questions
- Incorporates test case diversity for comprehensive discussion suggestions
- Uses commentary content themes for contextually relevant questions

**Frontend Integration:**
- Use suggestions to populate quick-action buttons or suggested questions UI
- Display conversation status to control chat interface availability
- Show suggestions as conversation starters when no messages exist
- Update suggestions dynamically based on conversation progression

**Sandbox Context Information:**
- Includes relevant sandbox metadata for suggestion context
- Execution status and results summary for informed discussion
- Model configuration details for technical discussions
- Test case statistics for conversation scope understanding

**Performance Optimizations:**
- Suggestion caching for frequently accessed sandboxes
- Efficient context extraction for suggestion generation
- Minimal data transfer with focused conversation metadata
- Smart suggestion refresh based on sandbox data changes

**Discussion Facilitation:**
- Suggestions designed to encourage meaningful commentary exploration
- Questions target different aspects of sandbox results for comprehensive coverage
- Progressive complexity from basic observations to advanced analysis
- Context-aware suggestions based on sandbox execution characteristics

**Error Handling:**
- Validates sandbox exists and belongs to customer
- Checks commentary generation status before suggestion creation
- Handles AI service unavailability with default suggestion sets
- Graceful degradation when suggestion generation fails

**Args:**
- customer_id: Customer ID (from path parameter)
- sandbox_id: Target sandbox ID (from path parameter)
- session: Database session

**Returns:**
- `ConversationWithSuggestionsResponse` with conversation (or null), ai_suggestions array, and sandbox_context

**Raises:**
- HTTPException 400: Commentary not yet generated for sandbox
- HTTPException 404: Sandbox not found or doesn't belong to customer
- HTTPException 500: AI suggestion service temporarily unavailable

**Parameters**:
- `customer_id` (path, required): The customer ID
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/export-csv — Export AI Evaluation to CSV

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/export-csv`
**Summary**: Export AI Evaluation to CSV
**Tags**: ai-validation

Generate CSV report of sandbox evaluation results with all resources and evaluations

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier to export

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary — Get Sandbox Summary

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary`
**Summary**: Get Sandbox Summary
**Tags**: ai-validation

Retrieve comprehensive summary statistics for a sandbox including test case counts, execution metrics, resource health, and evaluation scores

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/update-batch-results — Update Batch Sandbox Results

**Endpoint**: `POST /v2/ai-validation-sandbox/update-batch-results`
**Summary**: Update Batch Sandbox Results
**Tags**: ai-validation, internal

Update execution results from llm-pentest batch processing.

This endpoint is called by the llm-pentest service to update
execution results as they are processed in a batch.

**Security:**
- Requires internal role OR matching customer_id in JWT

**Workflow:**
1. Validates batch exists for customer
2. Updates each execution result with outcome, output, timing data
3. Creates/updates evaluation results if provided
4. Extends batch expiration time
5. Releases processed test cases from batch

**Tags:** internal, external

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/mark-batch-complete — Mark Sandbox Batch Complete

**Endpoint**: `POST /v2/ai-validation-sandbox/mark-batch-complete`
**Summary**: Mark Sandbox Batch Complete
**Tags**: ai-validation, internal

Mark a sandbox batch as complete.

This endpoint is called by the llm-pentest service when
batch processing has finished (successfully or with errors).

Uses AI evaluations queue (longer timeout) because this triggers
the refill process which fires bundles to llm-pentest.

**Security:**
- Requires internal role OR matching customer_id in JWT

**Workflow:**
1. Validates batch exists for customer
2. Marks any remaining test cases as failed or up for retry
3. Updates batch status to COMPLETED or FAILED
4. Releases all test cases from batch
5. Triggers refill to fire next bundle

**Tags:** internal, external

**Request Body** (required):
- `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---
