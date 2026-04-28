# auth API Endpoints

## GET /v1/auth/customers/{customer_id}/api-keys -  List Api Keys

**Endpoint**: `GET /v1/auth/customers/{customer_id}/api-keys`
**Summary**:  List Api Keys
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `page` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/customers/{customer_id}/api-keys -  Create Api Key

**Endpoint**: `POST /v1/auth/customers/{customer_id}/api-keys`
**Summary**:  Create Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/auth/customers/{customer_id}/api-keys/{api_key_id} -  Get Api Key

**Endpoint**: `GET /v1/auth/customers/{customer_id}/api-keys/{api_key_id}`
**Summary**:  Get Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/auth/customers/{customer_id}/api-keys/{api_key_id} -  Update Api Key

**Endpoint**: `PUT /v1/auth/customers/{customer_id}/api-keys/{api_key_id}`
**Summary**:  Update Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id} -  Delete Api Key

**Endpoint**: `DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id}`
**Summary**:  Delete Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/auth/api-keys/{api_key_id}/white-list -  List Cidrs

**Endpoint**: `GET /v1/auth/api-keys/{api_key_id}/white-list`
**Summary**:  List Cidrs
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/api-keys/{api_key_id}/white-list/delete -  Delete Cidr

**Endpoint**: `POST /v1/auth/api-keys/{api_key_id}/white-list/delete`
**Summary**:  Delete Cidr
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/api-keys/{api_key_id}/white-list/add -  Add Cidr To Api Key

**Endpoint**: `POST /v1/auth/api-keys/{api_key_id}/white-list/add`
**Summary**:  Add Cidr To Api Key
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles -  Assign Roles To Api Key

**Endpoint**: `POST /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles`
**Summary**:  Assign Roles To Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles/{role_id} -  Unassign Role From Api Key

**Endpoint**: `DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles/{role_id}`
**Summary**:  Unassign Role From Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 
- `role_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/auth/api-keys/types -  Get Api Key Types

**Endpoint**: `GET /v1/auth/api-keys/types`
**Summary**:  Get Api Key Types
**Tags**: auth

**Responses**:
- `200`: Successful Response

---

## GET /v1/auth/api-keys/default-firewall -  Get Default Firewall Api Key

**Endpoint**: `GET /v1/auth/api-keys/default-firewall`
**Summary**:  Get Default Firewall Api Key
**Tags**: auth

**Responses**:
- `200`: Successful Response

---
