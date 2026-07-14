# ai-validation API Endpoints

## GET /v2/ai-validation/categories — List global AI validation categories

**Endpoint**: `GET /v2/ai-validation/categories`
**Summary**: List global AI validation categories
**Tags**: ai-validation

Returns the platform-wide catalogue of AI validation categories (e.g. safety, robustness, fairness). These are shared across all customers and are not tenant-specific. Filter by active status or by a specific category ID. Use to discover available categories before creating customer-specific category instances or scan templates.

**Parameters**:
- `ai_validation_category_id` (query, optional): 
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/categories/{ai_validation_category_id} — Get a global AI validation category by ID

**Endpoint**: `GET /v2/ai-validation/categories/{ai_validation_category_id}`
**Summary**: Get a global AI validation category by ID
**Tags**: ai-validation

Returns detail for a single platform-wide AI validation category identified by its ID. These categories are shared across all customers and define the test dimensions (e.g. safety, robustness) available for use in scan templates. Use this to inspect a category's metadata before referencing it in a customer category.

**Parameters**:
- `ai_validation_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories — List customer AI validation categories

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories`
**Summary**: List customer AI validation categories
**Tags**: ai-validation

Returns all AI validation customer categories for the specified customer, which are tenant-specific instantiations of the global categories containing the customer's own test cases. Filter by active status, a specific category ID, or by scan template ID to retrieve only the categories linked to a particular template. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (query, optional): Id of specific customer category to retrieve
- `ai_validation_scan_template_id` (query, optional): Id of template to filter categories by
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories — Create a customer AI validation category

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories`
**Summary**: Create a customer AI validation category
**Tags**: ai-validation

Creates a new customer-specific AI validation category, optionally linking it to an existing scan template. Customer categories are the containers that hold test cases for a particular validation dimension. Optionally pass a template ID via query parameter to associate the new category with that template immediately. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (query, optional): Id of template to associate this category with

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} — Get a customer AI validation category by ID

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id}`
**Summary**: Get a customer AI validation category by ID
**Tags**: ai-validation

Returns full detail for a single customer-specific AI validation category, including its name, description, active status, and association to a global category. Scoped to the customer identified by the path parameter. Use to inspect a category before updating it or viewing its test cases.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id} — Update a customer AI validation category

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/categories/{ai_validation_customer_category_id}`
**Summary**: Update a customer AI validation category
**Tags**: ai-validation

Partially updates a customer-specific AI validation category — for example to rename it, change its description, or toggle its active status. Only the fields supplied in the request body are modified; omitted fields are left unchanged. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_customer_category_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/categories-with-test-cases — List customer categories with their test cases

**Endpoint**: `GET /v2/ai-validation/categories-with-test-cases`
**Summary**: List customer categories with their test cases
**Tags**: ai-validation

Returns all customer AI validation categories together with their associated test cases in a single response. Filterable by active status, a specific category ID, or by scan template ID (when a template ID is supplied, returns test cases scoped to that template; otherwise returns the category's own test cases, excluding any created or edited via a template). Scoped to the token's customer.

**Parameters**:
- `filter_active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.
- `ai_validation_customer_category_id` (query, optional): Id of specific customer category to retrieve
- `ai_validation_scan_template_id` (query, optional): if given, will provide testcases from template. If not given, will provide testcases from customer category, and exclude any that were created/edited from template

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/templates/{ai_validation_scan_template_id}/categories-with-test-cases — Get a scan template with categories and test cases

**Endpoint**: `GET /v2/ai-validation/templates/{ai_validation_scan_template_id}/categories-with-test-cases`
**Summary**: Get a scan template with categories and test cases
**Tags**: ai-validation

Returns full detail for a specific AI validation scan template, including all its associated customer categories and their test cases. Useful when an agent needs to inspect the complete test plan defined by a template before configuring a use case or starting a scan. Filterable by active status. Scoped to the token's customer.

**Parameters**:
- `ai_validation_scan_template_id` (path, required): 
- `filter_active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/templates — Create an AI validation scan template

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates`
**Summary**: Create an AI validation scan template
**Tags**: ai-validation

Creates a new AI validation scan template for the customer, specifying which customer categories (and optionally project/organization scope) are included. Templates define the test plan that is applied when a validation scan is started against a use case. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates — List AI validation scan templates for the customer

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/templates`
**Summary**: List AI validation scan templates for the customer
**Tags**: ai-validation

Returns all scan templates available to the authenticated customer, optionally filtered by project or organization. Templates define the categories and test cases used when starting a validation scan. Use this to discover template IDs before configuring a use case or launching a scan.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (query, optional): Id of specific template to retrieve
- `active` (query, optional): Whether to filter to a particular status (active or inactive). Defaults to True.
- `project_id` (query, optional): Project ID of templates to filter by
- `organization_id` (query, optional): Organization ID of templates to filter by

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase — Create a scan template with new categories and test cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/templates/create-with-category-testcase`
**Summary**: Create a scan template with new categories and test cases
**Tags**: ai-validation

Creates an AI validation scan template together with its customer categories and test cases in a single atomic operation. Use this instead of the basic template-create endpoint when the categories and test cases do not yet exist and need to be provisioned at the same time as the template. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase — Update a scan template with categories and test cases

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}/update-with-category-testcase`
**Summary**: Update a scan template with categories and test cases
**Tags**: ai-validation

Replaces the categories and test cases associated with an existing AI validation scan template in a single operation. Supports adding new categories, updating existing ones, and updating their test cases simultaneously. If the template is linked to benchmark use cases, a confirmation flag may be required to proceed. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or benchmark confirmation required
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} — Get a specific AI validation scan template by ID

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}`
**Summary**: Get a specific AI validation scan template by ID
**Tags**: ai-validation

Retrieves full detail for a single AI validation scan template scoped to the authenticated customer. Returns template metadata, associated category IDs, and project/organization context. Use this to inspect a template's structure before creating a use case config or starting a validation scan.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id} — Update an AI validation scan template

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/templates/{ai_validation_scan_template_id}`
**Summary**: Update an AI validation scan template
**Tags**: ai-validation

Partially updates an existing AI validation scan template — for example to rename it, change its description, or modify its category associations. Only the fields supplied in the request body are modified; omitted fields are left unchanged. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_scan_template_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan — Start an AI validation scan for a use case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/start-ai-validation-scan`
**Summary**: Start an AI validation scan for a use case
**Tags**: ai-validation, internal

Initiates an AI validation scan for the specified use case, running all configured test cases against the target AI model. Returns a scan execution ID and job reference that can be used to poll progress. Scoped to the authenticated customer; requires a valid use case with a template and resource instance already configured.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or use case misconfigured
- `404`: Use case or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases — Create an AI validation use case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases`
**Summary**: Create an AI validation use case
**Tags**: ai-validation

Creates a new AI validation use case for the customer. A use case represents an AI system under validation and acts as the container that binds a scan template and a resource instance together. After creation, configure the use case with a template and resource using the use-case-config endpoint before starting validation scans. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases — List AI validation use cases for the customer

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases`
**Summary**: List AI validation use cases for the customer
**Tags**: ai-validation

Returns all AI validation use cases belonging to the authenticated customer tenant. Each use case represents an AI system under validation with its associated configuration, template assignment, and resource bindings. Call this to discover which use cases exist before retrieving per-use-case configs or starting a scan.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/use-cases/{use_case_id} — Update an AI validation use case

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}`
**Summary**: Update an AI validation use case
**Tags**: ai-validation

Partially updates an existing AI validation use case — for example to rename it or change its description. Only the fields supplied in the request body are modified; omitted fields are left unchanged. The customer is identified from the JWT token. Scoped to the token's customer.

**Parameters**:
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Create or update the AI validation config for a use case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Create or update the AI validation config for a use case
**Tags**: ai-validation

Creates the AI validation configuration for a use case if it does not yet exist, or replaces it if one already exists (upsert semantics). The config links the use case to a specific scan template and resource instance. Both the template and resource instance must already exist. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case, template, or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Get the AI validation configuration for a use case

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Get the AI validation configuration for a use case
**Tags**: ai-validation

Returns the validation configuration for a specific use case, including the assigned scan template ID and resource instance ID. Scoped to the authenticated customer tenant. Use this to verify what template and resource are configured before starting a validation scan or checking if a config needs to be created.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config — Update the AI validation config for a use case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/use-case-config`
**Summary**: Update the AI validation config for a use case
**Tags**: ai-validation

Partially updates the AI validation configuration for a specific use case, allowing the assigned scan template or resource instance to be changed independently. Unlike the POST upsert endpoint, this only updates an existing config. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Get the scheduled scan job for a use case

**Endpoint**: `GET /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Get the scheduled scan job for a use case
**Tags**: ai-validation

Returns the scheduled job and its recurrence configuration for a specific AI validation use case. Use this to check whether a recurring scan schedule is active, inspect its cron expression or frequency, and retrieve the job status. Scoped to the token's customer.

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case or schedule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Create Schedule For Ai Validation Use Case Config

**Endpoint**: `POST /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Create Schedule For Ai Validation Use Case Config
**Tags**: ai-validation

Create a scheduled job for an AI validation use case config by its usecase id

**Parameters**:
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Delete the scheduled scan job for a use case

**Endpoint**: `DELETE /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Delete the scheduled scan job for a use case
**Tags**: ai-validation

Removes the recurring scan schedule from an AI validation use case, stopping future automatic scan runs. The use case and its configuration remain intact; only the schedule is deleted. Returns the updated use case config after deletion. Scoped to the token's customer. This action cannot be undone — the schedule must be recreated to resume automatic scans.

**Parameters**:
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case or schedule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job — Update the scheduled scan job for a use case

**Endpoint**: `PATCH /v2/ai-validation/use-cases/{use_case_id}/use-case-config/scheduled-job`
**Summary**: Update the scheduled scan job for a use case
**Tags**: ai-validation

Modifies the recurring scan schedule for an AI validation use case — for example to change the cron expression, frequency, enabled state, or start/end window. Only the fields provided in the request body are updated. Returns the updated job and schedule detail. Scoped to the token's customer.

**Parameters**:
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case or schedule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id} — Update an AI validation use case config by config ID

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-case-configs/{ai_validation_use_case_config_id}`
**Summary**: Update an AI validation use case config by config ID
**Tags**: ai-validation

Partially updates an AI validation use case configuration identified directly by its config ID rather than by use case ID. Use this when you have the config ID and want to update the assigned scan template or resource instance. Only the fields provided are modified. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `ai_validation_use_case_config_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case config not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id} — Get a specific AI validation use case by ID

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}`
**Summary**: Get a specific AI validation use case by ID
**Tags**: ai-validation

Retrieves full detail for a single AI validation use case scoped to the authenticated customer. Returns the use case name, status, associated template, resource configuration, and project/organization context. Use this after listing use cases to inspect a specific use case before starting a scan or reading its config.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution — Get the baseline execution for a use case

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution`
**Summary**: Get the baseline execution for a use case
**Tags**: ai-validation

Returns the baseline execution ID pinned to a use case, which is used as the reference point for regression comparisons in subsequent validation scans. Scoped to the authenticated customer tenant. Returns null for the execution ID if no baseline has been set yet.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution — Set the baseline execution for a use case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/use-cases/{use_case_id}/baseline-execution`
**Summary**: Set the baseline execution for a use case
**Tags**: ai-validation

Pins a specific scan execution as the baseline for a use case. The baseline execution acts as the reference point for regression comparisons in future validation scans. Supply the execution ID to pin; subsequent scans will compare their results against this baseline. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `use_case_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Use case or execution not found
- `500`: Unexpected server error
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

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/importable-datasets — List importable datasets for a customer category

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/importable-datasets`
**Summary**: List importable datasets for a customer category
**Tags**: ai-validation

Lists all capture replay datasets available to the customer that can be imported as test cases into the specified customer category. Each result includes the dataset's metadata and a count of how many requests within it contain extractable prompts suitable for test case creation. Supports filtering by organization or project and paginated results (page, per_page). Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `customer_category_id` (path, required): 
- `org_id` (query, optional): Organization ID filter
- `project_id` (query, optional): Project ID filter
- `page` (query, optional): Page number (1-based)
- `per_page` (query, optional): Number of results per page

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer category not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset — Import a capture replay dataset as test cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/categories/{customer_category_id}/import-from-dataset`
**Summary**: Import a capture replay dataset as test cases
**Tags**: ai-validation

Transforms firewall requests from a capture replay dataset into AI validation test cases and imports them into the specified customer category. Supports filtering to only requests with extractable expected outputs, and optionally includes full conversation context in prompts. Returns a summary of successful and failed transformations plus the generated test cases ready for review. Scoped to the customer identified by the path parameter.

**Parameters**:
- `customer_id` (path, required): Customer identifier
- `customer_category_id` (path, required): Target customer category identifier for test case creation

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer category or dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/import-csv — Parse CSV File for Test Cases

**Endpoint**: `POST /v2/ai-validation/import-csv`
**Summary**: Parse CSV File for Test Cases
**Tags**: ai-validation

**Parse a CSV file containing test case prompts and return structured JSON data for frontend consumption.**

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/importable-datasets — List importable datasets for AI validation

**Endpoint**: `GET /v2/ai-validation/importable-datasets`
**Summary**: List importable datasets for AI validation
**Tags**: ai-validation

Returns all capture replay datasets available to the token's customer that can be imported as test cases for AI validation scans. Each result includes dataset metadata and the count of importable requests. Optionally filter by organization ID or project ID to narrow results to a specific scope. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Optional organization ID filter
- `project_id` (query, optional): Optional project ID filter

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
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

Creates a new AI validation sandbox for testing AI models and services against configured test cases and evaluations. The sandbox acts as a container for resources (AI models), test cases, evaluations, and execution history. Scoped to the authenticated customer tenant; optionally assignable to a project or organization.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox — List AI Validation Sandboxes

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox`
**Summary**: List AI Validation Sandboxes
**Tags**: ai-validation

Returns paginated AI validation sandboxes for the authenticated customer, with optional filtering by project, organization, active status, and name search. Each sandbox contains its configuration, current execution status, and resource assignments. Use this to discover sandbox IDs before listing test cases, executions, or results.

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
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances — List AI model resource instances available for sandboxes

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/resource-instances`
**Summary**: List AI model resource instances available for sandboxes
**Tags**: ai-validation

Returns all AI model and service resource instances that can be added to a sandbox, with optional filtering by specific instance ID, availability status, and active state. Also returns available pentest models grouped by type. Use this to discover resources before calling the add-resource endpoint. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (query, optional): Optional filter for a specific resource instance
- `available_only` (query, optional): Only show resources not already associated with a sandbox
- `active` (query, optional): Only show active resources

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Get AI Validation Sandbox Details

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Get AI Validation Sandbox Details
**Tags**: ai-validation

Retrieves full detail for a single AI validation sandbox scoped to the authenticated customer. Returns sandbox configuration, current execution status, resource assignments, evaluation definitions, and project/organization context. Use this after listing sandboxes to inspect a specific sandbox before running executions or reading results.

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Update AI validation sandbox configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Update AI validation sandbox configuration
**Tags**: ai-validation

Partially updates an existing AI validation sandbox — rename it, change its goal, toggle active status, or reassign its project/organization. Only provided fields are changed; omitted fields are left as-is. Returns the updated sandbox. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id} — Permanently delete an AI validation sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}`
**Summary**: Permanently delete an AI validation sandbox
**Tags**: ai-validation

Irreversibly deletes a sandbox and all associated data including test cases, resources, evaluations, execution records, and results. Deletion triggers background cleanup tasks. Confirm the sandbox ID before calling — this action cannot be undone. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Unique sandbox identifier to delete

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone — Clone an AI validation sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/clone`
**Summary**: Clone an AI validation sandbox
**Tags**: ai-validation

Creates a full copy of an existing sandbox including its configuration, test cases, evaluations, and resource assignments. The cloned sandbox is independent — changes to one do not affect the other. Use this to fork a sandbox for parallel experimentation without affecting production evaluations. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Unique identifier of sandbox to clone

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort — Abort all active executions for a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/abort`
**Summary**: Abort all active executions for a sandbox
**Tags**: ai-validation

Initiates an abort of all currently running or pending executions for the specified sandbox. Returns HTTP 202 immediately; actual teardown continues in the background. Use this to stop a running evaluation before it completes. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `202`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — Add an AI model or service to a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Add an AI model or service to a sandbox
**Tags**: ai-validation

Assigns an existing AI model/service resource instance to the sandbox for inclusion in evaluation executions. Configure display name, model name, system prompt, execution order, and whether guardrails are applied. Use listAiValidationSandboxResourceInstances first to find available resource IDs. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or resource instance not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — List AI model resources assigned to a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: List AI model resources assigned to a sandbox
**Tags**: ai-validation

Returns all AI model and service resources currently assigned to a sandbox, including their display names, model configuration, execution order, and guardrail settings. Use this to inspect which models will be evaluated during execution. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to query

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources — Remove an AI model or service from a sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources`
**Summary**: Remove an AI model or service from a sandbox
**Tags**: ai-validation

Removes an AI model/service resource assignment from the sandbox. Provide either sandbox_resource_id to remove a specific assignment, or resource_instance_id to remove all assignments of that instance from this sandbox. Exactly one must be supplied. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing resources to remove
- `resource_instance_id` (query, optional): Remove ALL sandbox assignments of this resource instance
- `sandbox_resource_id` (query, optional): Remove specific sandbox resource by its unique ID

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id} — Update an AI model resource configuration in a sandbox

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}`
**Summary**: Update an AI model resource configuration in a sandbox
**Tags**: ai-validation

Partially updates the configuration for a specific AI model resource assigned to a sandbox — change display name, model name, system prompt, execution order, or guardrail settings. Only provided fields are changed. Returns the updated resource. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the resource
- `resource_id` (path, required): Unique identifier of the sandbox resource to update

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases — Add one or more test cases to a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: Add one or more test cases to a sandbox
**Tags**: ai-validation

Adds a single test case or a batch of test cases to a sandbox. Bulk mode accepts an array of test cases with optional expected outputs and actual labels; individual mode accepts a single test case schema for backward compatibility. Supports auto-creation of correctness or binary-classification evaluations when expected outputs are provided. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases — List test cases in a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases`
**Summary**: List test cases in a sandbox
**Tags**: ai-validation

Returns paginated test cases for a sandbox, with optional filtering by evaluation type, pass/fail outcome, evaluation ID, and resource IDs. Omitting page/per_page returns all test cases. Use this to inspect, search, or export test case configurations and results. Scoped to the token's customer.

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
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} — Remove a test case from a sandbox

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Remove a test case from a sandbox
**Tags**: ai-validation

Permanently deletes a test case and all its associated data from the sandbox. This does not delete execution results for completed executions that included this test case. Confirm the test case ID before calling. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to remove

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id} — Update a sandbox test case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}`
**Summary**: Update a sandbox test case
**Tags**: ai-validation

Partially updates a test case configuration — change the prompt, display name, or template variable values. Only provided fields are changed. Returns the updated test case. Use this to refine a test case without recreating it. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `testcase_id` (path, required): Test case identifier to update

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant — Generate Test Cases with AI Assistant

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/generate_with_ai_assistant`
**Summary**: Generate Test Cases with AI Assistant
**Tags**: ai-validation

Deprecated: Use POST /{sandbox_id}/generate-testcases instead.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for test case creation

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone — Clone a sandbox test case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/clone`
**Summary**: Clone a sandbox test case
**Tags**: ai-validation

Creates an exact duplicate of an existing test case with a new unique identifier, preserving the prompt, display name, and template variables. Use this to create variations of a test case for comparative evaluation. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the test case
- `testcase_id` (path, required): Test case identifier to clone

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete — Bulk delete test cases from a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/bulk-delete`
**Summary**: Bulk delete test cases from a sandbox
**Tags**: ai-validation

Deletes multiple test cases from a sandbox in a single operation. Optionally also clears associated execution results. Returns per-test-case success/failure details. Use this to remove a set of test cases identified by IDs without deleting the sandbox. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing test cases to delete

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases — Generate test cases using AI for a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-testcases`
**Summary**: Generate test cases using AI for a sandbox
**Tags**: ai-validation

Uses an AI model to generate test cases for a sandbox based on a user-provided description of the intended model behavior and the desired number of cases. Generated test cases are automatically added to the sandbox. Use this to rapidly populate a new sandbox with representative test cases. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for test case generation

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv — Import Test Cases from CSV File

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-csv`
**Summary**: Import Test Cases from CSV File
**Tags**: ai-validation

**Import test cases from a CSV file into an AI validation sandbox with support for VUP/non-VUP modes and automatic correctness evaluation creation.**

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `auto_create_correctness_evaluation` (query, optional): Whether to automatically create a Correctness (RESPONSE_SIMILARITY) evaluation when expected_output column is found in CSV. Defaults to True.
- `auto_create_binary_classification` (query, optional): Whether to automatically create a BINARY_CLASSIFICATION evaluation when actual_label column is found in CSV. Defaults to True.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets — List capture replay datasets available for import

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/importable-datasets`
**Summary**: List capture replay datasets available for import
**Tags**: ai-validation

Returns capture replay datasets that can be imported as test cases into the specified sandbox, with optional filtering by organization and project. Supports pagination. Use this before calling importDatasetToSandbox to discover available dataset IDs. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier for import validation
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset — Import a capture replay dataset as sandbox test cases

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/import-from-dataset`
**Summary**: Import a capture replay dataset as sandbox test cases
**Tags**: ai-validation

Transforms a capture replay dataset into test cases and adds them to the sandbox. Optionally includes conversation context and filters to only test cases that have expected outputs for automatic evaluation creation. Use listSandboxImportableDatasets first to discover available dataset IDs. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Target sandbox identifier for test case creation

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute — Start an asynchronous sandbox execution

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/execute`
**Summary**: Start an asynchronous sandbox execution
**Tags**: ai-validation

Triggers an asynchronous evaluation run that sends each test case to every assigned AI model resource and scores results against the sandbox's evaluations. Returns HTTP 202 immediately with an execution record; actual test-case processing continues in the background. Use listSandboxExecutions or getAiValidationSandboxActiveJobs to track progress. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to execute

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions — List Sandbox Executions

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions`
**Summary**: List Sandbox Executions
**Tags**: ai-validation

Returns all execution records for an AI validation sandbox, optionally filtered by status. Each record includes the execution ID, start/end timestamps, overall status, and test-case pass/fail counts. Scoped to the authenticated customer tenant. Use this to find an execution ID before fetching detailed results.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier to query
- `status_filter` (query, optional): Filter executions by status (pending, running, completed, failed, cancelled)

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} — Get Execution Summary

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Get Execution Summary
**Tags**: ai-validation

Returns an execution summary including overall status, progress percentage, total/passed/failed test-case counts, and per-resource breakdown. Scoped to the authenticated customer tenant. Use this to poll a running execution for progress or to get a high-level outcome before fetching the individual test-case results.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to summarize

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id} — Delete a sandbox execution record

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}`
**Summary**: Delete a sandbox execution record
**Tags**: ai-validation

Permanently removes a sandbox execution record and all associated test-case results. Background cleanup is triggered for large result sets. This action cannot be undone — verify the execution ID before calling. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to delete

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results — List Execution Results

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results`
**Summary**: List Execution Results
**Tags**: ai-validation

Returns all test-case results for a specific sandbox execution. Each result includes the test case prompt, the AI model response, pass/fail outcome, evaluation scores, and latency. Scoped to the authenticated customer tenant. Use this after an execution completes to inspect per-test-case outcomes, or to identify which test cases failed.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier for results

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} — Get Specific Execution Result

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Get Specific Execution Result
**Tags**: ai-validation

Retrieves the full detail for a single test-case execution result including the prompt sent, the AI model's response, pass/fail outcome, per-evaluation scores, latency, and any error details. Scoped to the authenticated customer tenant. Use this when you need the complete response text or evaluation breakdown for a specific failing test case.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Specific result identifier to retrieve

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Result not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id} — Update a specific test-case execution result

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/results/{result_id}`
**Summary**: Update a specific test-case execution result
**Tags**: ai-validation

Partially updates an execution result — useful for manually correcting an AI response outcome, overriding a pass/fail verdict, or adding human-reviewed scores. Only provided fields are changed. Returns the updated result. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `result_id` (path, required): Result identifier to update

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Result not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results — Clear all results for a sandbox execution

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-results`
**Summary**: Clear all results for a sandbox execution
**Tags**: ai-validation

Deletes all test-case results for an execution while preserving the execution record itself. Optionally clears only failed results to preserve passing ones. Returns the count of cleared results. Use this before re-running an execution to get a clean slate. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier to clear
- `clear_failed_only` (query, optional): If true, only clear failed execution results, preserving successful ones

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results — Clear results for a single test case

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/testcases/{testcase_id}/clear-results`
**Summary**: Clear results for a single test case
**Tags**: ai-validation

Deletes all execution results for a specific test case within an execution while leaving results for all other test cases intact. Use this to selectively re-run a single failing test case without disturbing the rest of the execution. Returns the count of cleared results. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier
- `testcase_id` (path, required): Test case identifier to clear results for

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution or test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases — Clear results for multiple test cases in bulk

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/executions/{execution_id}/clear-multiple-testcases`
**Summary**: Clear results for multiple test cases in bulk
**Tags**: ai-validation

Deletes execution results for a batch of test cases within a specific execution, allowing them to be re-run without deleting the entire execution record. Returns the count of cleared results. Use this to selectively reset a subset of test case results before re-executing. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier
- `execution_id` (path, required): Execution identifier

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Execution not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results — Get latest execution results for all test cases in a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latest-results`
**Summary**: Get latest execution results for all test cases in a sandbox
**Tags**: ai-validation

Returns the most recent result for every test case in the sandbox, with optional filtering by test case IDs, resource IDs, execution status, evaluation type, and pass/fail outcome. Results include a slim shape with status, pass/fail flag, and score where available. Scoped to the authenticated customer tenant. Use this for a current health snapshot without selecting a specific execution.

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
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations — Create an evaluation for a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: Create an evaluation for a sandbox
**Tags**: ai-validation

Creates a new evaluation definition that specifies how AI model outputs are assessed during sandbox execution. Evaluation types include response similarity, binary classification, and custom criteria. Use this before executing the sandbox so results are automatically scored. Returns the created evaluation. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier for evaluation configuration

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations — List evaluations for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations`
**Summary**: List evaluations for a sandbox
**Tags**: ai-validation

Returns all evaluation definitions for a sandbox, with optional filtering by evaluation type, pass/fail outcome, or specific test case IDs. Pagination is over test cases (not evaluations), so per_page controls how many test cases' data is included in the nested evaluation results. Use this to inspect scoring criteria and per-test-case outcomes. Scoped to the token's customer.

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
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Get a specific sandbox evaluation

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Get a specific sandbox evaluation
**Tags**: ai-validation

Returns the full configuration for a specific evaluation definition within a sandbox, including evaluation type, scoring criteria, and expected outputs. Use this to inspect a single evaluation before modifying it or to verify its configuration. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to retrieve

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Evaluation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Update a sandbox evaluation configuration

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Update a sandbox evaluation configuration
**Tags**: ai-validation

Partially updates an existing evaluation definition — change scoring thresholds, criteria, expected outputs, or display name. Only provided fields are changed. Returns the updated evaluation. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to update

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Evaluation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id} — Delete a sandbox evaluation

**Endpoint**: `DELETE /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/evaluations/{evaluation_id}`
**Summary**: Delete a sandbox evaluation
**Tags**: ai-validation

Permanently deletes an evaluation definition and all its associated settings from the sandbox. Existing execution results that referenced this evaluation will lose their scoring data. Confirm the evaluation ID before calling — this cannot be undone. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier containing the evaluation
- `evaluation_id` (path, required): Evaluation identifier to delete

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Evaluation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary — Generate AI commentary on sandbox evaluation results

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/generate-commentary`
**Summary**: Generate AI commentary on sandbox evaluation results
**Tags**: ai-validation

Triggers AI-generated commentary that analyzes the sandbox evaluation results and identifies which resource performed best. Stores the commentary on the sandbox and returns commentary text, the best resource ID, generation timestamp, and the source execution ID. Use this after an execution completes to get an interpretive summary. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/all/active-jobs — List active evaluation jobs across all sandboxes

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/all/active-jobs`
**Summary**: List active evaluation jobs across all sandboxes
**Tags**: ai-validation

Returns information about all active evaluation jobs running across every sandbox for the authenticated customer. Use this to poll for overall execution activity or restore client state after reconnecting. The path customer_id must match the authenticated token's customer; mismatches are rejected. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/active-jobs — Get active evaluation jobs for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/active-jobs`
**Summary**: Get active evaluation jobs for a sandbox
**Tags**: ai-validation

Returns active evaluation job information for a specific sandbox, indicating whether any executions are currently running or queued. Use this to poll for running execution state or restore UI state after reconnecting. Returns immediately with current status. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone — Clone a sandbox resource within the same sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/{resource_id}/clone`
**Summary**: Clone a sandbox resource within the same sandbox
**Tags**: ai-validation

Creates an identical copy of an existing AI model resource within the same sandbox, preserving all configuration including model name, system prompt, and guardrail settings. Use this to create model variants for A/B comparison without recreating configuration from scratch. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `resource_id` (path, required): The resource ID to clone

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate — Validate LLM endpoint resources in a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/resources/validate`
**Summary**: Validate LLM endpoint resources in a sandbox
**Tags**: ai-validation

Checks all LLM endpoint resources assigned to the sandbox, verifying that required API key secrets exist and that the provider API key is live and valid. Use this before executing a sandbox to surface misconfigured or expired credentials. Returns per-resource validation results. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables — Get all template variable names for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/template-variables`
**Summary**: Get all template variable names for a sandbox
**Tags**: ai-validation

Returns the unique set of template variable names defined across all test cases in the sandbox. Use this to discover which variable names are available before setting or updating variable values on individual test cases. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Replace all template variables for a test case

**Endpoint**: `PUT /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Replace all template variables for a test case
**Tags**: ai-validation

Replaces the complete set of template variable values for a test case with the provided values (full replacement — any existing variables not in the request are deleted). Set allow_new=true to permit variables not yet defined in sandbox templates. Use PATCH instead to merge/update without replacing all variables. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Partially update template variables for a test case

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Partially update template variables for a test case
**Tags**: ai-validation

Merges the provided template variable values into a test case's existing variables — only listed variables are updated, others are preserved. Set allow_new=true to add variables not yet defined in sandbox templates. Use PUT instead for full replacement. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID
- `allow_new` (query, optional): Allow setting variables not yet defined in sandbox templates

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables — Get template variable values for a test case

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/testcases/{testcase_id}/variables`
**Summary**: Get template variable values for a test case
**Tags**: ai-validation

Returns the current template variable values for a specific test case. Variables are named placeholders used in VUP (Variable User Prompt) mode to inject different inputs per test run. Use this to inspect variable state before updating. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `testcase_id` (path, required): The test case ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Test case not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation — Create a commentary conversation for a sandbox

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Create a commentary conversation for a sandbox
**Tags**: ai-validation

Creates a new commentary conversation thread for an AI validation sandbox, optionally seeded with an initial message. Only one conversation per sandbox is expected — use this to start commentary discussions on evaluation results. Returns the created conversation with its ID for subsequent message operations. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation — Get the commentary conversation for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation`
**Summary**: Get the commentary conversation for a sandbox
**Tags**: ai-validation

Returns the commentary conversation associated with a specific sandbox, including its status and metadata. Use this to retrieve the conversation ID before fetching messages or adding new ones. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox or conversation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages — Add a message to a sandbox commentary conversation

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: Add a message to a sandbox commentary conversation
**Tags**: ai-validation

Appends a new message (from a user or AI) to an existing commentary conversation. Use this to record manual annotations or AI-generated commentary on evaluation results. Returns the updated conversation with all messages. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Conversation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages — List messages from a sandbox commentary conversation

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/messages`
**Summary**: List messages from a sandbox commentary conversation
**Tags**: ai-validation

Returns a paginated list of messages from a commentary conversation, ordered by creation time. Supports limit/offset pagination. Use this to read or display the message history for a sandbox discussion thread. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID
- `limit` (query, optional): Number of messages to return
- `offset` (query, optional): Number of messages to skip

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Conversation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status — Update the status of a commentary conversation

**Endpoint**: `PATCH /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/conversation/{conversation_id}/status`
**Summary**: Update the status of a commentary conversation
**Tags**: ai-validation

Changes the status of a sandbox commentary conversation (e.g., from active to resolved or archived). Use this to mark a discussion as complete after reviewing evaluation results. Returns the updated conversation. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID
- `conversation_id` (path, required): The conversation ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Conversation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations — List commentary conversations for the customer

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/commentary/conversations`
**Summary**: List commentary conversations for the customer
**Tags**: ai-validation

Returns all AI commentary conversations across sandboxes for the authenticated customer, with optional status filtering and offset-based pagination. Use this to browse or resume previous commentary sessions. Supports limit/offset pagination. Scoped to the token's customer.

**Parameters**:
- `limit` (query, optional): Number of conversations to return
- `offset` (query, optional): Number of conversations to skip
- `status_filter` (query, optional): Filter by conversation status

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send — Send a message and get an AI response in commentary chat

**Endpoint**: `POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat/send`
**Summary**: Send a message and get an AI response in commentary chat
**Tags**: ai-validation

Sends a user message to the sandbox commentary chat and returns an AI-generated response. The AI has context of the sandbox evaluation results to answer questions about model performance. Use this to interactively explore evaluation outcomes. Returns both the user message ID and AI response message ID for threading. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat — Get sandbox commentary chat with AI suggestions

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/commentary/chat`
**Summary**: Get sandbox commentary chat with AI suggestions
**Tags**: ai-validation

Returns the commentary conversation for a sandbox along with AI-generated discussion suggestions and sandbox context. Use this to initialize or resume an AI commentary chat session — the suggestions guide the user towards meaningful questions about evaluation results. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): The sandbox ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/export-csv — Export AI Evaluation to CSV

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

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary — Get summary statistics for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/summary`
**Summary**: Get summary statistics for a sandbox
**Tags**: ai-validation

Returns aggregated statistics for a sandbox: test case counts, last execution status, overall pass rate, per-resource health, and per-evaluation scores. Use this for a quick health check of a sandbox without fetching full execution results. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): Sandbox identifier

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latency-distribution — Get latency distribution for a sandbox

**Endpoint**: `GET /v2/ai-validation/customer/{customer_id}/sandbox/{sandbox_id}/latency-distribution`
**Summary**: Get latency distribution for a sandbox
**Tags**: ai-validation

Returns bucketed latency data and summary statistics (p50, p90, p99, mean) for AI model response times across all test cases in the sandbox. Configure the bucket width in milliseconds and optionally filter to a specific resource. Use this to build latency histograms and identify performance outliers. Scoped to the token's customer.

**Parameters**:
- `sandbox_id` (path, required): 
- `resource_id` (query, optional): Filter to specific sandbox resource
- `bucket_size_ms` (query, optional): Bucket width in ms

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Sandbox not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/update-batch-results — Update Batch Sandbox Results

**Endpoint**: `POST /v2/ai-validation-sandbox/update-batch-results`
**Summary**: Update Batch Sandbox Results
**Tags**: ai-validation, internal

Update execution results from llm-pentest batch processing.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/ai-validation-sandbox/mark-batch-complete — Mark Sandbox Batch Complete

**Endpoint**: `POST /v2/ai-validation-sandbox/mark-batch-complete`
**Summary**: Mark Sandbox Batch Complete
**Tags**: ai-validation, internal

Mark a sandbox batch as complete.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/ai-validation-sandbox/active-sandboxes — List active AI validation sandboxes

**Endpoint**: `GET /v2/ai-validation-sandbox/active-sandboxes`
**Summary**: List active AI validation sandboxes
**Tags**: ai-validation

Returns all sandboxes that currently have active evaluation jobs running for the authenticated customer. Use this to populate the evaluations dashboard table and quickly identify which sandboxes are actively executing test cases. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---
