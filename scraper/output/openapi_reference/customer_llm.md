# customer-llm API Endpoints

## GET /v1/customer-llm/llm-config-for-workload-and-feature-groups — Get LLM configuration for a workload type and feature group

**Endpoint**: `GET /v1/customer-llm/llm-config-for-workload-and-feature-groups`
**Summary**: Get LLM configuration for a workload type and feature group
**Tags**: customer-llm

Returns the resolved LiteLLM configurations for the specified workload type and feature group combination. Scoped to the authenticated customer. Use when an agent needs to discover which LLM models and endpoints are configured for a given use case such as firewall processing or evaluation workloads.

**Parameters**:
- `dataplane_id` (query, optional): 
- `feature` (query, optional): 
- `workload` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid workload or feature group
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/customer-llm/llm-config-for-workload-and-feature-groups — Post Llm Config For Feature Group And Use Case For Customer External

**Endpoint**: `POST /v1/customer-llm/llm-config-for-workload-and-feature-groups`
**Summary**: Post Llm Config For Feature Group And Use Case For Customer External
**Tags**: customer-llm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/customer-llm/configurations — Register a new customer LLM configuration

**Endpoint**: `POST /v1/customer-llm/configurations`
**Summary**: Register a new customer LLM configuration
**Tags**: customer-llm

Creates and persists a new LLM provider configuration for the customer, optionally verifying connectivity to the provider before saving. Scoped to the authenticated customer. Use when onboarding a new LLM endpoint or API key for use in firewall rules or AI evaluation workloads.

**Parameters**:
- `verify_connection` (query, optional): Verify the connection to the LLM provider before saving the configuration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid configuration parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations — List all customer LLM configurations

**Endpoint**: `GET /v1/customer-llm/configurations`
**Summary**: List all customer LLM configurations
**Tags**: customer-llm

Returns all LLM provider configurations registered for the customer, with optional filtering by provider, enabled status, and last connection test result. Scoped to the authenticated customer. Use to discover which LLM integrations are active and their current connectivity status before creating or updating firewall rules.

**Parameters**:
- `customer_llm_configuration_id` (query, optional): 
- `provider` (query, optional): Filter configurations by LLM provider. If not provided, all providers are included.
- `enabled` (query, optional): Filter configurations by enabled status. If not provided, all configurations are included.
- `connection_test_successful` (query, optional): Filter configurations by whether the last connection test was successful or not. If not provided, all configurations are included.

**Responses**:
- `200`: Successful Response
- `400`: Invalid filter parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/customer-llm/configurations/{customer_llm_configuration_id} — Update an existing customer LLM configuration

**Endpoint**: `PUT /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Update an existing customer LLM configuration
**Tags**: customer-llm

Updates fields on an existing LLM provider configuration, such as model name, API base URL, or enabled status. Optionally re-verifies connectivity after the update. Scoped to the authenticated customer. Use when rotating API keys or changing model routing for an existing LLM integration.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 
- `verify_connection` (query, optional): Verify the connection to the LLM provider before saving the configuration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid configuration parameters
- `404`: Configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/customer-llm/configurations/{customer_llm_configuration_id} — Permanently delete a customer LLM configuration

**Endpoint**: `DELETE /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Permanently delete a customer LLM configuration
**Tags**: customer-llm

Permanently removes the specified LLM provider configuration from the customer's account. This is irreversible — any firewall rules or evaluation workloads that reference this configuration will lose their associated LLM endpoint. Scoped to the token's customer. Use with caution; prefer disabling the configuration via the update endpoint if temporary deactivation is intended.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations/{customer_llm_configuration_id} — Get a single customer LLM configuration by ID

**Endpoint**: `GET /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Get a single customer LLM configuration by ID
**Tags**: customer-llm

Returns the LLM provider configuration for the specified configuration ID, applying the same optional filters as the list endpoint. Scoped to the authenticated customer. Use to inspect a specific LLM configuration and its current enabled and connectivity state.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 
- `provider` (query, optional): Filter configurations by LLM provider. If not provided, all providers are included.
- `enabled` (query, optional): Filter configurations by enabled status. If not provided, all configurations are included.
- `connection_test_successful` (query, optional): Filter configurations by whether the last connection test was successful or not. If not provided, all configurations are included.

**Responses**:
- `200`: Successful Response
- `400`: Invalid filter parameters
- `404`: Configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations/{customer_llm_configuration_id}/details — Get detailed info for a customer LLM configuration including safe credentials

**Endpoint**: `GET /v1/customer-llm/configurations/{customer_llm_configuration_id}/details`
**Summary**: Get detailed info for a customer LLM configuration including safe credentials
**Tags**: customer-llm

Returns full details for the specified LLM configuration, including provider, model, API base URL, and non-secret credential metadata (masked key references). Scoped to the authenticated customer. Use when an agent needs to verify configuration details or audit the credential setup without exposing raw secret values.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/customer-llm/configurations/{customer_llm_configuration_id}/verify-connection — Test connectivity for a customer LLM configuration

**Endpoint**: `POST /v1/customer-llm/configurations/{customer_llm_configuration_id}/verify-connection`
**Summary**: Test connectivity for a customer LLM configuration
**Tags**: customer-llm

Attempts a live connectivity check against the LLM provider endpoint for the given configuration and persists the result. Scoped to the authenticated customer. Use to validate a new or updated LLM configuration before relying on it in production firewall or evaluation workloads.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Configuration not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/customer-llm/llm-models/credentials — Get Customer Llm Model Credentials

**Endpoint**: `GET /v1/customer-llm/llm-models/credentials`
**Summary**: Get Customer Llm Model Credentials
**Tags**: customer-llm

Retrieve customer LLM model credentials by credential key (via header to encapsulate the key).
In addition to customer_id, query secrets must be provided for verifying with parameter_manager to ensure
the caller is trusted.

The existent of this endpoint is because we intend not to sync AWS secrets from control-plane to customer-plane
(as the mechanism could be error-prone) and the customer llm credentials are required for rule-processor in customer-plane
to use customer llm for rule processing.
And, since we authenticate external endpoints mostly by API key, developers granted permissions to use SDK would have
chances to retrieve the llm credentials they shouldn't know about. This endpoint requires an additional header
x_alltrue_llm_query_secrets as the second validation to ensure the caller is either from customer-plane or already
with sufficient permissions to know the environment configuration parameters.

**Parameters**:
- `x-alltrue-llm-credentials-key` (header, optional): 
- `x-alltrue-llm-query-secrets` (header, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
