# capture-replay API Endpoints

## GET /v2/capture-replay/customer/{customer_id}/requests/search — Search Llm Firewall Requests Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/search`
**Summary**: Search Llm Firewall Requests Route
**Tags**: capture-replay

Search and filter LLM firewall input requests for dataset compilation.

Enhanced implementation with comprehensive filtering including AI governance filters.
Supports both standard firewall filters and governance-based filtering by tag labels.
Uses Pydantic model validation for robust input handling.

**Multi-Select Filter Support (v7.0):**
All filter parameters support multi-select with OR logic. Use repeated query parameters
to filter by multiple values. Empty arrays or omitted parameters return all matching requests.

**Multi-Select Filter Parameters:**
- `llm_provider_name`: Filter by LLM provider(s). Example: `?llm_provider_name=openai&llm_provider_name=bedrock`
- `llm_model_name`: Filter by LLM model(s). Example: `?llm_model_name=gpt-4o&llm_model_name=claude-3-opus`
- `resource_instance_id`: Filter by endpoint resource(s). Example: `?resource_instance_id=uuid1&resource_instance_id=uuid2`
- `rule_type`: Filter by rule type(s). Example: `?rule_type=SatisfactoryAnswerRule&rule_type=SentimentRule`
- `action_type`: Filter by action type(s). Example: `?action_type=BLOCK&action_type=ALERT`
- `governance_tag`: Filter by governance tag(s). Example: `?governance_tag=refusal&governance_tag=incoherent`

**Filter Behavior:**
- **OR Logic**: Multiple values use OR logic (e.g., `llm_provider_name=openai&llm_provider_name=bedrock` returns requests from OpenAI OR Bedrock)
- **Case-Insensitive**: Provider and model names are matched case-insensitively (e.g., `BEDROCK` matches `bedrock`)
- **Empty Arrays**: Omitted parameters or empty arrays return all matching requests
- **Combined Filters**: Multiple filter types use AND logic (e.g., provider AND model AND rule_type)

**Rule Type & Action Type Filtering:**
- Use `rule_type` parameter to filter by rule types (e.g., 'LlmJudgeGovernanceRule', 'SentimentRule')
- Use `action_type` parameter to filter by action types (e.g., BLOCK, ALERT, LOG)
- Both support multiple values with OR logic: `?rule_type=FIREWALL&rule_type=GOVERNANCE`
- Query syntax: `?rule_type=value1&rule_type=value2` (repeat parameter for multiple values)

**Governance Tag Filtering:**
- Use `governance_tag` parameter to filter by computed tag labels
- Supports multiple tag labels: `?governance_tag=refusal&governance_tag=incoherent`
- Common tag labels: "Positive", "Negative", "Neutral",
  "Incoherent", "Refusal", "PII", "Toxicity", "Prompt Injection", etc.
- Combine with `governance_target` to specify input/output/both filtering
- When `governance_target=both` without `governance_tag`, returns requests with tags in input OR output (OR logic)

**Response Tags (v7.1):**
Each request returns directional governance tags:
- `input_tags`: Array of objects like `{ "tag_label": "..." }` from input evaluations
- `output_tags`: Array of objects like `{ "tag_label": "..." }` from output evaluations
- `ATTRIBUTE` actions are excluded from `input_actions` and `output_actions`

**Examples:**
- Single provider: `?llm_provider_name=openai`
- Multiple providers: `?llm_provider_name=openai&llm_provider_name=bedrock`
- Single resource: `?resource_instance_id=uuid1`
- Multiple resources: `?resource_instance_id=uuid1&resource_instance_id=uuid2`
- Combined filters: `?llm_provider_name=openai&llm_model_name=gpt-4o&rule_type=SatisfactoryAnswerRule`
- Filter by rule type: `?rule_type=FIREWALL`
- Filter by multiple rule types: `?rule_type=FIREWALL&rule_type=GOVERNANCE`
- Filter by action type: `?action_type=BLOCK&action_type=ALERT`
- Governance filtering: `?governance_target=both&governance_tag=refusal`
- Filter by multiple tags: `?governance_tag=incoherent&governance_tag=refusal&governance_target=input`

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
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/requests/filter-options — Get dynamic filter options for LLM firewall requests

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/filter-options`
**Summary**: Get dynamic filter options for LLM firewall requests
**Tags**: capture-replay

Get comprehensive filter options based on actual data in LLM Firewall Requests table.

    This endpoint provides dynamic lists of available filter values with request counts
    to enable smart filtering UIs that prevent "no results" scenarios. It supports
    hierarchy filtering through resource assignments and can filter options based on
    existing filter selections.

    The response includes both dynamic filters (based on actual data) and static
    filters (fixed options like governance targets). Each filter option includes
    a count of matching requests to help users make informed filtering decisions.

    **Multi-Select Filter Support (v7.0):**
    All filter parameters support multi-select with OR logic. Use repeated query parameters
    to filter by multiple values. Empty arrays or omitted parameters return all available options.

    **Multi-Select Filter Parameters:**
    - `llm_provider_name`: Filter by LLM provider(s). Example: `?llm_provider_name=openai&llm_provider_name=bedrock`
    - `llm_model_name`: Filter by LLM model(s). Example: `?llm_model_name=gpt-4o&llm_model_name=claude-3-opus`
    - `resource_instance_id`: Filter by endpoint resource(s). Example: `?resource_instance_id=uuid1&resource_instance_id=uuid2`
    - `rule_type`: Filter by rule type(s). Example: `?rule_type=LlmJudgeGovernanceRule&rule_type=SentimentRule`
    - `action_type`: Filter by action type(s). Example: `?action_type=BLOCK&action_type=ALERT`
    - `governance_tag`: Filter by governance tag(s). Example: `?governance_tag=refusal&governance_tag=incoherent`

    **User Session Filter Parameters (via filter_params):**
    - `user_session_id`: Filter by user session ID (partial match)
    - `user_session_user_id`: Filter by user ID (partial match)
    - `user_session_user_ip`: Filter by user IP address (partial match)
    - `user_session_user_role`: Filter by user role (partial match)
    - `user_session_user_email`: Filter by user email (partial match)
    - `user_session_user_privileges`: Filter by user privileges (partial match)
    - `user_session_application_id`: Filter by application ID (partial match)
    - `user_session_application_name`: Filter by application name (partial match)
    - `user_session_application_version`: Filter by application version (partial match)

    **Date Range Filter Parameters (via filter_params):**
    - `created_at_start`: Filter by request event start time (`request_start_at`, falling back to `created_at` for legacy rows)
    - `created_at_end`: Filter by request event end time (`request_start_at`, falling back to `created_at` for legacy rows, inclusive)

    **Message & Token Filter Parameters (via filter_params):**
    - `min_input_prompt_messages`: Minimum input prompt messages (integer >= 0)
    - `max_input_prompt_messages`: Maximum input prompt messages (integer >= 0)
    - `min_input_prompt_tokens`: Minimum input prompt tokens (integer >= 0)
    - `max_input_prompt_tokens`: Maximum input prompt tokens (integer >= 0)

    **Filter Behavior:**
    - **OR Logic**: Multiple values use OR logic (e.g., `llm_provider_name=openai&llm_provider_name=bedrock` returns requests from OpenAI OR Bedrock)
    - **Case-Insensitive**: Provider and model names are matched case-insensitively (e.g., `BEDROCK` matches `bedrock`)
    - **Partial Matching**: User session string filters use ILIKE for partial matching
    - **Empty Arrays**: Omitted parameters or empty arrays return all available options
    - **Combined Filters**: Multiple filter types use AND logic (e.g., provider AND model AND rule_type)

    **Governance Filtering:**
    - `governance_tags`: Available governance tag labels with counts (e.g., "Negative", "Incoherent")
    - `governance_targets`: Static options for input/output/both filtering
    - `governance_target`: Filter by tag location (`input`, `output`, or `both`). Works independently of `governance_tag`
    - When `governance_target=both` without `governance_tag`, returns requests with tags in input OR output (OR logic)

    **Hierarchy Filtering:**
    - `org_id`: Filter options by organization ID
    - `project_id`: Filter options by project ID
    - Hierarchy filters can be combined with multi-select filters

    **Examples:**
    - Single provider: `?llm_provider_name=openai`
    - Multiple providers: `?llm_provider_name=openai&llm_provider_name=bedrock`
    - Combined filters: `?llm_provider_name=openai&llm_model_name=gpt-4o&rule_type=SatisfactoryAnswerRule`
    - Governance filtering: `?governance_target=both&governance_tag=refusal`
    - Hierarchy + multi-select: `?org_id=uuid&project_id=uuid&llm_provider_name=openai`

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
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/requests/{request_id} — Get Firewall Request Details Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/requests/{request_id}`
**Summary**: Get Firewall Request Details Route
**Tags**: capture-replay

Get detailed information about a specific LLM firewall input request.

Returns the full request details including prompt content, metadata, input_actions,
output_actions, and related session info.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `request_id` (path, required): The firewall request ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/capture-replay/customer/{customer_id}/datasets — Create Dataset Route

**Endpoint**: `POST /v2/capture-replay/customer/{customer_id}/datasets`
**Summary**: Create Dataset Route
**Tags**: capture-replay

Create a new capture replay dataset.

Groups LLM firewall input requests under a single dataset identifier for reuse
in AI validation, pentest, and evaluation workflows.

**Parameters**:
- `customer_id` (path, required): The customer ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets — List Datasets Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets`
**Summary**: List Datasets Route
**Tags**: capture-replay

List all capture replay datasets for a customer with optional filtering and pagination.

Returns paginated list of datasets with basic metadata including request counts.
Uses Pydantic model validation for robust input handling.

**Query Parameters:**
- `org_id`: Filter by organization ID (optional)
- `project_id`: Filter by project ID (optional)
- `search_text`: Free-text search across dataset name and description (optional)
- `project`: Filter by project display name (optional)
- `page`: Page number for pagination (default: 1)
- `per_page`: Number of results per page (default: 50, max: 500)

**Filtering:**
- Multiple filters use AND logic (all specified filters must match)
- Search is case-insensitive and supports partial matches
- Empty/whitespace-only search terms are ignored
- Project filtering requires exact display name matches

**Examples:**
- `GET /v2/capture-replay/customer/{customer_id}/datasets?page=1&per_page=20`
- `GET /v2/capture-replay/customer/{customer_id}/datasets?search_text=machine`
- `GET /v2/capture-replay/customer/{customer_id}/datasets?project=MyProject&search_text=test`

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
- `422`: Validation Error

---

## POST /v2/capture-replay/datasets/bulk-delete — Bulk Delete Datasets

**Endpoint**: `POST /v2/capture-replay/datasets/bulk-delete`
**Summary**: Bulk Delete Datasets
**Tags**: capture-replay

Delete multiple capture replay datasets in a single operation

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Get Dataset Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Get Dataset Route
**Tags**: capture-replay

Get detailed information about a specific capture replay dataset.

Returns the full dataset details including all request IDs and metadata.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `200`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
- `422`: Validation Error

---

## PATCH /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Update Dataset Route

**Endpoint**: `PATCH /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Update Dataset Route
**Tags**: capture-replay

Update an existing capture replay dataset.

Supports partial updates (only specified fields will be updated).

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
- `422`: Validation Error

---

## DELETE /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id} — Delete Dataset Route

**Endpoint**: `DELETE /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}`
**Summary**: Delete Dataset Route
**Tags**: capture-replay

Delete a capture replay dataset.

Permanently removes the dataset and its metadata (does not affect the underlying firewall requests).

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID

**Responses**:
- `204`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
- `422`: Validation Error

---

## GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/requests — Get Dataset Requests Route

**Endpoint**: `GET /v2/capture-replay/customer/{customer_id}/datasets/{dataset_id}/requests`
**Summary**: Get Dataset Requests Route
**Tags**: capture-replay

Get paginated firewall requests associated with a capture replay dataset.

Response shape aligns with `GET /v2/capture-replay/customer/{customer_id}/requests/search`:
returns compact request rows with `input_actions`/`output_actions` and directional
governance tags (`input_tags` and `output_tags`).

Legacy governance summary fields are omitted from this list endpoint.

**Parameters**:
- `customer_id` (path, required): The customer ID
- `dataset_id` (path, required): The dataset ID
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `404`: Not Found
- `500`: Internal Server Error
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
