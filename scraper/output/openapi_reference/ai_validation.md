# ai-validation API Endpoints

## GET /v2/ai-validation/categories - Get Categories

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

## GET /v2/ai-validation/categories/{ai_validation_category_id} - Get Category

**Endpoint**: `GET /v2/ai-validation/categories/{ai_validation_category_id}`
**Summary**: Get Category
**Tags**: ai-validation

**Parameters**:
- `ai_validation_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories - Get Customer Categories

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

## POST /v2/ai-validation/customer/{customer_id}/categories - Create Ai Validation Customer Category

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories`
**Summary**: Create Ai Validation Customer Category
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (query, optional): Id of template to associate this category with

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} - Get Customer Category

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

## PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} - Update Customer Category

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id}`
**Summary**: Update Customer Category
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/categories-with-test-cases - Get Customer Categories With Test Cases

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

## GET /v2/ai-validation/templates/{ai_validation_scan_template_id}/categories-with-test-cases - Get Template With Customer Categories With Test Cases

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

## POST /v2/ai-validation/customer/{customer_id}/templates - Create Ai Validation Customer Scan Template

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates`
**Summary**: Create Ai Validation Customer Scan Template
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates - Get Ai Validation Customer Scan Templates

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

## POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase - Create Ai Validation Customer Scan Template With Customer Category Testcase

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase`
**Summary**: Create Ai Validation Customer Scan Template With Customer Category Testcase
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase - Update Ai Validation Customer Scan Template With Customer Category Testcase

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase`
**Summary**: Update Ai Validation Customer Scan Template With Customer Category Testcase
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} - Get Ai Validation Customer Scan Template

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

## PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} - Update Ai Validation Template

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}`
**Summary**: Update Ai Validation Template
**Tags**: ai-validation

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan - Start Ai Validation Scan

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan`
**Summary**: Start Ai Validation Scan
**Tags**: ai-validation, internal

Start an AI Validation scan

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases - Create Use Case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases`
**Summary**: Create Use Case
**Tags**: ai-validation

Create a use case

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases - Get Use Cases

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

## PATCH /v2/ai-validation/use-cases/{use_case_id} - Update Use Case

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}`
**Summary**: Update Use Case
**Tags**: ai-validation

Update a use case

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config - Create Or Update Ai Validation Use Case Config

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Create Or Update Ai Validation Use Case Config
**Tags**: ai-validation

Create an AI validation use case config by its usecase id, updates if one already exists

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config - Get Ai Validation Use Case Config

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

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config - Update Ai Validation Use Case Config By Use Case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Update Ai Validation Use Case Config By Use Case
**Tags**: ai-validation

Update an AI validation use case config

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job - Get Schedule For Ai Validation Use Case Config

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

## POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job - Create Schedule For Ai Validation Use Case Config

**Endpoint**: `POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Create Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Create a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job - Delete Schedule For Ai Validation Use Case Config

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

## PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job - Update Schedule For Ai Validation Use Case Config

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Update Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Update a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id} - Update Ai Validation Use Case Config

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id}`
**Summary**: Update Ai Validation Use Case Config
**Tags**: ai-validation

Update an AI validation use case config

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_use_case_config_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id} - Get Use Case

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

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution - Get Baseline Execution

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

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution - Update Baseline Execution

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution`
**Summary**: Update Baseline Execution
**Tags**: ai-validation

Update a use case's baseline execution

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-csv - Import Test Cases from CSV File

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-csv`
**Summary**: Import Test Cases from CSV File
**Tags**: ai-validation

**Import test cases from a CSV file into an AI validation customer category with automatic correctness evaluation creation.**

**Parameters**:
- `customer_id` (path, required): The customer ID
- `customer_category_id` (path, required): The customer category ID
- `auto_create_correctness_evaluation` (query, optional): Whether to automatically create a Correctness (RESPONSE_SIMILARITY) evaluation when expected_output column is found in CSV. Defaults to True.

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/importable-datasets - List Importable Datasets For Customer Category

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

## POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset - Import Dataset as Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset`
**Summary**: Import Dataset as Test Cases
**Tags**: ai-validation

Transform capture replay dataset into test cases with optional expected outputs and auto-evaluation

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `customer_category_id` (path, required): Target customer category identifier for test case creation

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/import-csv - Parse CSV File for Test Cases

**Endpoint**: `POST /v2/ai-validation/import-csv`
**Summary**: Parse CSV File for Test Cases
**Tags**: ai-validation

**Parse a CSV file containing test case prompts and return structured JSON data for frontend consumption.**

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/importable-datasets - Get Importable Datasets for AI Validation

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

## GET /v2/ai-validation/job-status/{job_id} - Get Pentest Job

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

## POST /v2/ai-validation/customer/{customer_id}/sandbox - Create AI Validation Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox`
**Summary**: Create AI Validation Sandbox
**Tags**: ai-validation

Create a new AI validation sandbox for testing AI models and services with comprehensive configuration options

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox - List AI Validation Sandboxes

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox`
**Summary**: List AI Validation Sandboxes
**Tags**: ai-validation

Retrieve AI validation sandboxes with optional filtering and pagination

**Parameters**:
- `organization_id` (query, optional): Filter sandboxes by organization ID (optional)
- `project_id` (query, optional): Filter sandboxes by project ID (optional)
- `active_only` (query, optional): Return only active sandboxes (default: false - returns all)
- `search` (query, optional): Search term for sandbox display name (partial match) or ID (partial UUID match). Empty strings are ignored.
- `page` (query, optional): Page number (1-based).
- `per_page` (query, optional): Items per page (1-500).
- `sort_by` (query, optional): Field to sort by (DISPLAY_NAME or LAST_UPDATED)
- `sort_order` (query, optional): Sort direction. Defaults to DESC when not specified.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances - Get Resource Instances Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances`
**Summary**: Get Resource Instances Route
**Tags**: ai-validation

Get all resource instances that could be added to a sandbox.

**Parameters**:
- `resource_instance_id` (query, optional): Optional filter for a specific resource instance
- `available_only` (query, optional): Only show resources not already associated with a sandbox
- `active` (query, optional): Only show active resources

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} - Get AI Validation Sandbox Details

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Get AI Validation Sandbox Details
**Tags**: ai-validation

Retrieve detailed information about a specific AI validation sandbox

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} - Update AI Validation Sandbox

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Update AI Validation Sandbox
**Tags**: ai-validation

Modify configuration and settings of an existing AI validation sandbox

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} - Delete AI Validation Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Delete AI Validation Sandbox
**Tags**: ai-validation

Permanently remove an AI validation sandbox and all associated data including test cases, executions, and results

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone - Clone AI Validation Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone`
**Summary**: Clone AI Validation Sandbox
**Tags**: ai-validation

Create an identical copy of an existing sandbox with all configurations, test data, and evaluation settings

**Parameters**:
- `sandbox_id` (path, required): Unique identifier of sandbox to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort - Abort Sandbox Executions

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort`
**Summary**: Abort Sandbox Executions
**Tags**: ai-validation

Initiate abort of all active executions for a sandbox. Returns immediately; cleanup runs in the background.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources - Add AI Model/Service to Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Add AI Model/Service to Sandbox
**Tags**: ai-validation

Assign an existing AI model or service to a sandbox for testing and evaluation with execution ordering

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources - List Sandbox AI Models/Services

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: List Sandbox AI Models/Services
**Tags**: ai-validation

Retrieve all AI models and services assigned to a specific sandbox with execution configuration and status

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to query

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources - Remove AI Model/Service from Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Remove AI Model/Service from Sandbox
**Tags**: ai-validation

Remove one or more AI models/services from a sandbox environment by instance ID or resource ID

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing resources to remove
- `resource_instance_id` (query, optional): Remove ALL sandbox assignments of this resource instance
- `sandbox_resource_id` (query, optional): Remove specific sandbox resource by its unique ID

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id} - Update Sandbox AI Model/Service Configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}`
**Summary**: Update Sandbox AI Model/Service Configuration
**Tags**: ai-validation

Modify the configuration of an AI model or service within a sandbox including execution order and settings

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the resource
- `resource_id` (path, required): Unique identifier of the sandbox resource to update

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases - Add Test Cases to Sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: Add Test Cases to Sandbox
**Tags**: ai-validation

**Add one or more test cases to an AI validation sandbox with optional expected outputs and automatic correctness evaluation creation.**

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases - List Sandbox Test Cases

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: List Sandbox Test Cases
**Tags**: ai-validation

Retrieve paginated list of test cases configured for sandbox execution and validation

**Parameters**:
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

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} - Remove Test Case from Sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Remove Test Case from Sandbox
**Tags**: ai-validation

Permanently delete a test case and its configuration from the sandbox

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to remove

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} - Update Sandbox Test Case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Update Sandbox Test Case
**Tags**: ai-validation

Modify test case configuration including prompts and template variables

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to update

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant - Generate Test Cases with AI Assistant

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant`
**Summary**: Generate Test Cases with AI Assistant
**Tags**: ai-validation

Deprecated: Use POST /{sandbox_id}/generate-testcases instead.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for test case creation

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone - Clone Sandbox Test Case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone`
**Summary**: Clone Sandbox Test Case
**Tags**: ai-validation

Create an exact duplicate of an existing test case with new unique identifier

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the test case
- `testcase_id` (path, required): Test case identifier to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete - Bulk Delete Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete`
**Summary**: Bulk Delete Test Cases
**Tags**: ai-validation

Delete multiple test cases from an AI validation sandbox in a single operation

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing test cases to delete

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases - Generate AI-Powered Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases`
**Summary**: Generate AI-Powered Test Cases
**Tags**: ai-validation

Create comprehensive test cases using advanced AI models based on user requirements and specifications

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for test case generation

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv - Import Test Cases from CSV File

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv`
**Summary**: Import Test Cases from CSV File
**Tags**: ai-validation

**Import test cases from a CSV file into an AI validation sandbox with support for VUP/non-VUP modes and automatic correctness evaluation creation.**

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `auto_create_correctness_evaluation` (query, optional): Whether to automatically create a Correctness (RESPONSE_SIMILARITY) evaluation when expected_output column is found in CSV. Defaults to True.
- `auto_create_binary_classification` (query, optional): Whether to automatically create a BINARY_CLASSIFICATION evaluation when actual_label column is found in CSV. Defaults to True.

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets - List Available Datasets for Import

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets`
**Summary**: List Available Datasets for Import
**Tags**: ai-validation

**Retrieve capture replay datasets available for import into a sandbox for test case generation and validation.**

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier for import validation
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset - Import Dataset as Test Cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset`
**Summary**: Import Dataset as Test Cases
**Tags**: ai-validation

Transform capture replay dataset into test cases with optional expected outputs and auto-evaluation

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier for test case creation

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute - Execute Sandbox (Async)

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute`
**Summary**: Execute Sandbox (Async)
**Tags**: ai-validation

Start asynchronous execution of AI models against test cases with background processing

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to execute

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions - List Sandbox Executions

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions`
**Summary**: List Sandbox Executions
**Tags**: ai-validation

Retrieve all execution records for a sandbox with optional status filtering

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to query
- `status_filter` (query, optional): Filter executions by status (pending, running, completed, failed, cancelled)

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} - Get Execution Summary

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Get Execution Summary
**Tags**: ai-validation

Retrieve detailed summary of execution status, progress, and result statistics

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to summarize

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} - Delete Sandbox Execution

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Delete Sandbox Execution
**Tags**: ai-validation

Permanently remove execution record and all associated test results

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results - List Execution Results

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results`
**Summary**: List Execution Results
**Tags**: ai-validation

Retrieve all test case results for a specific execution with detailed outcomes

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier for results

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} - Get Specific Execution Result

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Get Specific Execution Result
**Tags**: ai-validation

Retrieve detailed information for a single test case execution result

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Specific result identifier to retrieve

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} - Update Execution Result

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Update Execution Result
**Tags**: ai-validation

Modify execution result details and outcomes for manual corrections

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Result identifier to update

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results - Clear Execution Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results`
**Summary**: Clear Execution Results
**Tags**: ai-validation

Reset execution results while preserving execution history for re-execution

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to clear
- `clear_failed_only` (query, optional): If true, only clear failed execution results, preserving successful ones

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results - Clear Test Case Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results`
**Summary**: Clear Test Case Results
**Tags**: ai-validation

Reset execution results for a specific test case while preserving other results

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `testcase_id` (path, required): Test case identifier to clear results for

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases - Clear Multiple Test Case Results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases`
**Summary**: Clear Multiple Test Case Results
**Tags**: ai-validation

Reset execution results for multiple test cases in batch operation

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results - Get Latest Execution Results with Filtering and Pagination

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results`
**Summary**: Get Latest Execution Results with Filtering and Pagination
**Tags**: ai-validation

Retrieve slim latest results with optional filtering and pagination. Supports filtering by testcase IDs, resource IDs, status, and evaluation ID. No aggregations included; statuses are normalized to strings; tri-state 'passed' preserved; optional 'score' included when available. Backward compatible: omit pagination params to get all results.

**Parameters**:
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

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations - Create Sandbox Evaluation

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: Create Sandbox Evaluation
**Tags**: ai-validation

Define evaluation criteria and configuration for AI model output assessment and validation

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for evaluation configuration

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations - List Sandbox Evaluations

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: List Sandbox Evaluations
**Tags**: ai-validation

Retrieve all evaluation configurations and criteria defined for the sandbox

**Parameters**:
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

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} - Get Evaluation Configuration

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Get Evaluation Configuration
**Tags**: ai-validation

Retrieve detailed configuration and parameters for a specific evaluation

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to retrieve

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} - Update Evaluation Configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Update Evaluation Configuration
**Tags**: ai-validation

Modify evaluation parameters, criteria, and configuration settings

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to update

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} - Delete Evaluation Configuration

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Delete Evaluation Configuration
**Tags**: ai-validation

Permanently remove evaluation configuration and all associated settings

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary - Generate Sandbox Commentary Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary`
**Summary**: Generate Sandbox Commentary Route
**Tags**: ai-validation

Generate AI commentary for a sandbox to help understand which resource performed best

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/all/active-jobs - Check for Global Active Jobs

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

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/active-jobs - Check for Active Jobs

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

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone - Clone Sandbox Resource Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone`
**Summary**: Clone Sandbox Resource Route
**Tags**: ai-validation

Clone an existing AI Validation Sandbox resource within the same sandbox.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `resource_id` (path, required): The resource ID to clone

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate - Validate All LLM Endpoint Resources

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate`
**Summary**: Validate All LLM Endpoint Resources
**Tags**: ai-validation

Checks all LLM Endpoint resources in the specified sandbox for secret existence and live provider API key validity

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables - Get Sandbox Template Variables Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables`
**Summary**: Get Sandbox Template Variables Route
**Tags**: ai-validation

Get all unique template variable names for a sandbox.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables - Update Testcase Variables Route Put

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Update Testcase Variables Route Put
**Tags**: ai-validation

Replace all variable values for a specific test case (PUT - full replacement).

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables - Update Testcase Variables Route Patch

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Update Testcase Variables Route Patch
**Tags**: ai-validation

Partially update variable values for a specific test case (PATCH - merge).

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables - Get Testcase Variables Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Get Testcase Variables Route
**Tags**: ai-validation

Get current variable values for a specific test case.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation - Create Commentary Conversation Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Create Commentary Conversation Route
**Tags**: ai-validation

Create a new commentary conversation for an AI validation sandbox.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation - Get Commentary Conversation Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Get Commentary Conversation Route
**Tags**: ai-validation

Get the commentary conversation for an AI validation sandbox.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages - Add Message To Conversation Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: Add Message To Conversation Route
**Tags**: ai-validation

Add a new message to an existing commentary conversation.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages - Get Conversation Messages Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: Get Conversation Messages Route
**Tags**: ai-validation

Get messages from a commentary conversation with pagination.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID
- `limit` (query, optional): Number of messages to return
- `offset` (query, optional): Number of messages to skip

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status - Update Conversation Status Route

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status`
**Summary**: Update Conversation Status Route
**Tags**: ai-validation

Update the status of a commentary conversation.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations - List Conversations Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations`
**Summary**: List Conversations Route
**Tags**: ai-validation

List all commentary conversations for a customer.

**Parameters**:
- `limit` (query, optional): Number of conversations to return
- `offset` (query, optional): Number of conversations to skip
- `status_filter` (query, optional): Filter by conversation status

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send - Send Message And Get Ai Response Route

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send`
**Summary**: Send Message And Get Ai Response Route
**Tags**: ai-validation

Send a user message and receive an AI response in commentary chat.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat - Get Commentary Chat With Suggestions Route

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat`
**Summary**: Get Commentary Chat With Suggestions Route
**Tags**: ai-validation

Get commentary conversation with AI-generated discussion suggestions.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/export-csv - Export AI Evaluation to CSV

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/export-csv`
**Summary**: Export AI Evaluation to CSV
**Tags**: ai-validation

Generate CSV report of sandbox evaluation results with all resources and evaluations

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to export

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary - Get Sandbox Summary

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary`
**Summary**: Get Sandbox Summary
**Tags**: ai-validation

Retrieve comprehensive summary statistics for a sandbox including test case counts, execution metrics, resource health, and evaluation scores

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latency-distribution - Get Latency Distribution

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latency-distribution`
**Summary**: Get Latency Distribution
**Tags**: ai-validation

Returns bucketed latency distribution with summary statistics for charting

**Parameters**:
- `sandbox_id` (path, required): 
- `resource_id` (query, optional): Filter to specific sandbox resource
- `bucket_size_ms` (query, optional): Bucket width in ms

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/update-batch-results - Update Batch Sandbox Results

**Endpoint**: `POST /v2/ai-validation-sandbox/update-batch-results`
**Summary**: Update Batch Sandbox Results
**Tags**: ai-validation, internal

Update execution results from llm-pentest batch processing.

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/mark-batch-complete - Mark Sandbox Batch Complete

**Endpoint**: `POST /v2/ai-validation-sandbox/mark-batch-complete`
**Summary**: Mark Sandbox Batch Complete
**Tags**: ai-validation, internal

Mark a sandbox batch as complete.

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation-sandbox/active-sandboxes - List Active Sandboxes

**Endpoint**: `GET /v2/ai-validation-sandbox/active-sandboxes`
**Summary**: List Active Sandboxes
**Tags**: ai-validation

Get all active sandboxes for the evaluations dashboard table

**Responses**:
- `200`: Successful Response

---
