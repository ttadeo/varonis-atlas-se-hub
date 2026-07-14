# capture-replay API Endpoints

## GET /v2/capture-replay/customer/{customer_id}/requests/search — Search and filter LLM firewall requests

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/search`
**Summary**: Search and filter LLM firewall requests
**Tags**: capture-replay

Search LLM firewall requests captured by the tenant's firewall, with rich multi-select filtering by provider, model, endpoint, rule type, action type, and AI governance tags. Use this to browse the raw request log before curating a dataset, or to investigate specific incidents. All filters combine with AND logic across filter types and OR logic within a single multi-value filter. Results are paginated. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `governance_tag` (query, optional): Filter by governance tag label(s). Supports multiple values with OR logic: ?governance_tag=refusal&governance_tag=incoherent. Common tags include sentiment classifications ('Positive/Negative/Neutral Sentiment'), content safety tags ('PII', 'Toxicity'), and security tags ('Prompt Injection', 'Jailbreak'). Use with governance_target to specify input/output/both filtering.
- `llm_provider_name` (query, optional): Filter by LLM provider name(s) (e.g., 'openai', 'bedrock'). Supports multiple values: ?llm_provider_name=openai&llm_provider_name=anthropic. Case-insensitive.
- `llm_model_name` (query, optional): Filter by LLM model name(s) (e.g., 'gpt-4o', 'claude-3-opus'). Supports multiple values: ?llm_model_name=gpt-4&llm_model_name=claude-3. Case-insensitive.
- `resource_instance_id` (query, optional): Filter by endpoint resource instance ID(s). Supports multiple values: ?resource_instance_id=uuid1&resource_instance_id=uuid2. Use repeated query parameters for multi-select with OR logic.
- `rule_type` (query, optional): Filter by rule type(s) (e.g., 'LlmJudgeGovernanceRule', 'SentimentRule'). Supports multiple values: ?rule_type=LlmJudgeGovernanceRule&rule_type=SentimentRule. Use repeated query parameters for multi-select with OR logic.
- `action_type` (query, optional): Filter by action type(s) (e.g., 'BLOCK', 'ALERT', 'LOG'). Supports multiple values: ?action_type=BLOCK&action_type=ALERT. Use repeated query parameters for multi-select with OR logic.
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `user_session_id` (query, optional): 
- `user_session_user_id` (query, optional): 
- `user_session_user_ip` (query, optional): 
- `user_session_user_role` (query, optional): 
- `user_session_user_email` (query, optional): 
- `user_search` (query, optional): 
- `user_session_user_privileges` (query, optional): 
- `user_session_application_id` (query, optional): 
- `user_session_application_name` (query, optional): 
- `user_session_application_version` (query, optional): 
- `created_at_start` (query, optional): 
- `created_at_end` (query, optional): 
- `min_input_prompt_messages` (query, optional): 
- `max_input_prompt_messages` (query, optional): 
- `min_input_prompt_tokens` (query, optional): 
- `max_input_prompt_tokens` (query, optional): 
- `governance_target` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/requests/filter-options — Get dynamic filter options for LLM firewall requests

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/filter-options`
**Summary**: Get dynamic filter options for LLM firewall requests
**Tags**: capture-replay

Return available filter values with request counts for the LLM firewall request log, computed from actual data so the UI can avoid presenting options that yield zero results. Supports the same multi-select, date range, user-session, token-count, governance, and hierarchy filters as the search endpoint — pre-applying any active filters causes the returned option lists to reflect only the subset of data still in view. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): Customer UUID
- `governance_tag` (query, optional): Pre-filter by governance tag label(s) to narrow down available filter options. Supports multiple values with OR logic: ?governance_tag=refusal&governance_tag=incoherent. Same format as search endpoint: ['Negative', 'Incoherent', etc.]
- `llm_provider_name` (query, optional): Pre-filter by LLM provider name(s) (e.g., 'openai', 'bedrock'). Supports multiple values: ?llm_provider_name=openai&llm_provider_name=anthropic. Case-insensitive.
- `llm_model_name` (query, optional): Pre-filter by LLM model name(s) (e.g., 'gpt-4o', 'claude-3-opus'). Supports multiple values: ?llm_model_name=gpt-4&llm_model_name=claude-3. Case-insensitive.
- `resource_instance_id` (query, optional): Pre-filter by endpoint resource instance ID(s). Supports multiple values: ?resource_instance_id=uuid1&resource_instance_id=uuid2. Use repeated query parameters for multi-select with OR logic.
- `rule_type` (query, optional): Pre-filter by rule type(s) (e.g., 'LlmJudgeGovernanceRule', 'SentimentRule'). Supports multiple values: ?rule_type=LlmJudgeGovernanceRule&rule_type=SentimentRule. Use repeated query parameters for multi-select with OR logic.
- `action_type` (query, optional): Pre-filter by action type(s) (e.g., 'BLOCK', 'ALERT', 'LOG'). Supports multiple values: ?action_type=BLOCK&action_type=ALERT. Use repeated query parameters for multi-select with OR logic.
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `user_session_id` (query, optional): 
- `user_session_user_id` (query, optional): 
- `user_session_user_ip` (query, optional): 
- `user_session_user_role` (query, optional): 
- `user_session_user_email` (query, optional): 
- `user_search` (query, optional): 
- `user_session_user_privileges` (query, optional): 
- `user_session_application_id` (query, optional): 
- `user_session_application_name` (query, optional): 
- `user_session_application_version` (query, optional): 
- `created_at_start` (query, optional): 
- `created_at_end` (query, optional): 
- `min_input_prompt_messages` (query, optional): 
- `max_input_prompt_messages` (query, optional): 
- `min_input_prompt_tokens` (query, optional): 
- `max_input_prompt_tokens` (query, optional): 
- `governance_target` (query, optional): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/requests/{request_id} — Get full details for a single firewall request

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/{request_id}`
**Summary**: Get full details for a single firewall request
**Tags**: capture-replay

Retrieve the complete record for one LLM firewall request, including the prompt content, conversation messages, session metadata, and the full set of firewall and governance actions (input and output). Use this after finding a request of interest via the search endpoint to inspect its exact content and evaluation results. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `request_id` (path, required): The firewall request ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Firewall request not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/capture-replay/customer/{customer_id}/datasets — Create a capture replay dataset from firewall requests

**Endpoint**: `POST /v2/capture-replay/customer/{customer_id}/datasets`
**Summary**: Create a capture replay dataset from firewall requests
**Tags**: capture-replay

Create a named dataset by grouping one or more LLM firewall request IDs under a single identifier. Datasets are the unit of work for AI validation, pentest, and evaluation workflows — create one here, then reference it in those features. Optionally scope the dataset to a specific organization or project within the tenant. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets — List capture replay datasets with filtering and pagination

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets`
**Summary**: List capture replay datasets with filtering and pagination
**Tags**: capture-replay

Return a paginated list of capture replay datasets for the customer. Supports optional filtering by organization, project, and free-text search across dataset name and description. Each result includes basic metadata and the count of associated firewall requests. Use this to discover existing datasets before referencing them in AI validation or pentest workflows. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `org_id` (query, optional): 
- `project_id` (query, optional): 
- `search_text` (query, optional): 
- `project` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/capture-replay/datasets/bulk-delete — Bulk delete multiple capture replay datasets

**Endpoint**: `POST /v2/capture-replay/datasets/bulk-delete`
**Summary**: Bulk delete multiple capture replay datasets
**Tags**: capture-replay

Permanently delete up to 500 capture replay datasets in a single request. Each dataset is validated for ownership before deletion; the response reports per-dataset success or failure so the caller knows exactly which IDs were removed. Underlying firewall requests are not affected. Use this to clean up stale or unwanted datasets in bulk. Scoped to the token's customer via the JWT — no customer_id path param needed.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Get details of a specific capture replay dataset

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Get details of a specific capture replay dataset
**Tags**: capture-replay

Retrieve the full record for one capture replay dataset, including its name, description, the list of associated firewall request IDs, and project/organization scope. Use this to inspect a dataset's contents or verify its request membership before using it in evaluation or pentest runs. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Partially update a capture replay dataset

**Endpoint**: `PATCH /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Partially update a capture replay dataset
**Tags**: capture-replay

Update one or more fields of an existing capture replay dataset. Only fields included in the request body are changed; omitted fields retain their current values. Updatable fields include name, description, organization scope, project scope, and the list of associated firewall request IDs. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Delete a single capture replay dataset

**Endpoint**: `DELETE /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Delete a single capture replay dataset
**Tags**: capture-replay

Permanently delete a capture replay dataset by ID. The underlying firewall requests are not deleted — only the dataset grouping is removed. Returns 204 on success. Use bulk-delete to remove multiple datasets in one call. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/requests — List firewall requests belonging to a dataset

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/requests`
**Summary**: List firewall requests belonging to a dataset
**Tags**: capture-replay

Return a paginated list of LLM firewall requests that are members of the specified capture replay dataset. Each item includes the same compact request shape as the search endpoint — firewall actions, directional governance tags (input/output), and session metadata. Use this to review the exact requests in a dataset before running it through AI validation or pentest. Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Dataset not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/export — Export Dataset Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/export`
**Summary**: Export Dataset Route
**Tags**: capture-replay

Export a capture replay dataset as a downloadable JSON file.

Returns a simplified, customer-focused JSON representation of the dataset including
relevant firewall requests, metadata, and export information. Internal system fields
are excluded for cleaner exports. The response is streamed for efficient handling
of large datasets.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `200`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/export-csv — Export Dataset Csv Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/export-csv`
**Summary**: Export Dataset Csv Route
**Tags**: capture-replay

Export a capture replay dataset as a downloadable CSV file.

Returns a CSV file with 3 columns:
- Input: Last user prompt from the conversation
- Response: Last assistant response from the conversation
- Full Conversation Thread: Complete message history as JSON string

The CSV format is optimized for training data and analysis workflows.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `200`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
- `422`: Validation Error

---
