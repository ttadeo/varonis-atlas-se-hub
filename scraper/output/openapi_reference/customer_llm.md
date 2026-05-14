# customer-llm API Endpoints

## GET /v1/customer-llm/llm-config-for-workload-and-feature-groups — Get Llm Config For Feature Group And Use Case For Customer External

**Endpoint**: `GET /v1/customer-llm/llm-config-for-workload-and-feature-groups`
**Summary**: Get Llm Config For Feature Group And Use Case For Customer External
**Tags**: customer-llm

**Parameters**:
- `dataplane_id` (query, optional): 
- `feature` (query, optional): 
- `workload` (query, optional): 

**Responses**:
- `200`: Successful Response
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

## POST /v1/customer-llm/configurations — Create Customer Llm Configuration

**Endpoint**: `POST /v1/customer-llm/configurations`
**Summary**: Create Customer Llm Configuration
**Tags**: customer-llm

Create a new customer LLM configuration.

**Parameters**:
- `verify_connection` (query, optional): Verify the connection to the LLM provider before saving the configuration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations — Get Customer Llm Configurations

**Endpoint**: `GET /v1/customer-llm/configurations`
**Summary**: Get Customer Llm Configurations
**Tags**: customer-llm

Get all customer LLM configurations.

**Parameters**:
- `customer_llm_configuration_id` (query, optional): 
- `provider` (query, optional): Filter configurations by LLM provider. If not provided, all providers are included.
- `enabled` (query, optional): Filter configurations by enabled status. If not provided, all configurations are included.
- `connection_test_successful` (query, optional): Filter configurations by whether the last connection test was successful or not. If not provided, all configurations are included.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/customer-llm/configurations/{customer_llm_configuration_id} — Update Customer Llm Configuration

**Endpoint**: `PUT /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Update Customer Llm Configuration
**Tags**: customer-llm

Update an existing customer LLM configuration.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 
- `verify_connection` (query, optional): Verify the connection to the LLM provider before saving the configuration.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/customer-llm/configurations/{customer_llm_configuration_id} — Delete Customer Llm Configuration

**Endpoint**: `DELETE /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Delete Customer Llm Configuration
**Tags**: customer-llm

Delete a customer LLM configuration.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations/{customer_llm_configuration_id} — Get Customer Llm Configurations

**Endpoint**: `GET /v1/customer-llm/configurations/{customer_llm_configuration_id}`
**Summary**: Get Customer Llm Configurations
**Tags**: customer-llm

Get all customer LLM configurations.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 
- `provider` (query, optional): Filter configurations by LLM provider. If not provided, all providers are included.
- `enabled` (query, optional): Filter configurations by enabled status. If not provided, all configurations are included.
- `connection_test_successful` (query, optional): Filter configurations by whether the last connection test was successful or not. If not provided, all configurations are included.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/customer-llm/configurations/{customer_llm_configuration_id}/details — Get Customer Llm Configuration Details

**Endpoint**: `GET /v1/customer-llm/configurations/{customer_llm_configuration_id}/details`
**Summary**: Get Customer Llm Configuration Details
**Tags**: customer-llm

Get the details of a specific customer LLM configuration, including safe credentials.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/customer-llm/configurations/{customer_llm_configuration_id}/verify-connection — Check Customer Llm Configuration Connection

**Endpoint**: `POST /v1/customer-llm/configurations/{customer_llm_configuration_id}/verify-connection`
**Summary**: Check Customer Llm Configuration Connection
**Tags**: customer-llm

Check the connection for a specific customer LLM configuration.

**Parameters**:
- `customer_llm_configuration_id` (path, required): 

**Responses**:
- `200`: Successful Response
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
