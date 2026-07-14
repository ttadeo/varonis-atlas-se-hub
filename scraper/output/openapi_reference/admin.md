# admin API Endpoints

## POST /v1/admin/auth0-customer/{customer_id}/users — Create User

**Endpoint**: `POST /v1/admin/auth0-customer/{customer_id}/users`
**Summary**: Create User
**Tags**: admin

Deprecated: directly mints an Auth0 user and bypasses our invitation flow (inviter attribution, DB invitation row, invite email dispatch). Use `POST /v1/admin/invitations` instead — it dual-writes to the IdP and the invitations table and emails the invitee.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/auth0-customer/{customer_id}/users — Get Users For Organization

**Endpoint**: `GET /v1/admin/auth0-customer/{customer_id}/users`
**Summary**: Get Users For Organization
**Tags**: admin, all-roles

Deprecated: returns an untyped Auth0-shaped ``list[dict]`` keyed on Auth0 user id. Use `GET /v2/admin/user-management/users` (typed, paginated, keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/auth0-customer/{customer_id}/guest-users — Get Guest Users For Organization

**Endpoint**: `GET /v1/admin/auth0-customer/{customer_id}/guest-users`
**Summary**: Get Guest Users For Organization
**Tags**: admin, all-roles

Deprecated: returns an untyped Auth0-shaped ``list[dict]`` keyed on Auth0 user id. Use `GET /v2/admin/user-management/guest-users` (typed, paginated, keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/admin/auth0-customer/{customer_id}/users/{user_id} — Update User

**Endpoint**: `PATCH /v1/admin/auth0-customer/{customer_id}/users/{user_id}`
**Summary**: Update User
**Tags**: admin

Deprecated: keyed on Auth0 user id and is a raw Auth0 PATCH passthrough (accepts email/password/user_metadata/app_metadata, bypasses email-domain policy). Use `PATCH /v2/admin/user-management/users/{user_id}` (keyed on the internal `user_id` UUID; narrowed to `given_name` + `family_name`) instead.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id} — Delete User (deprecated)

**Endpoint**: `DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id}`
**Summary**: Delete User (deprecated)
**Tags**: admin

Deprecated: customer_id in the path is redundant — the global auth chain already enforces path_customer_id == token.customer_id. Use `DELETE /v1/admin/auth0-customer/users/{user_id}` instead.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/auth0-customer/{customer_id}/users/{user_id} — Get User

**Endpoint**: `GET /v1/admin/auth0-customer/{customer_id}/users/{user_id}`
**Summary**: Get User
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `GET /v2/admin/user-management/users/{user_id}` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/auth0-customer/users/{user_id} — Delete User

**Endpoint**: `DELETE /v1/admin/auth0-customer/users/{user_id}`
**Summary**: Delete User
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `DELETE /v2/admin/user-management/users/{user_id}` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `user_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id}/reset-mfa — Reset User Mfa

**Endpoint**: `DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id}/reset-mfa`
**Summary**: Reset User Mfa
**Tags**: admin

Reset MFA for a user in Auth0.

Deletes all authentication methods for the specified user,
requiring them to re-enroll in MFA on their next login.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles —  Add Roles To User

**Endpoint**: `POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles`
**Summary**:  Add Roles To User
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/user-management/users/{user_id}/roles` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles/delete — Remove User Roles

**Endpoint**: `POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles/delete`
**Summary**: Remove User Roles
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/user-management/users/{user_id}/roles/delete` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/gateway-cost/summary — Get LLM gateway cost summary for the current month

**Endpoint**: `GET /v1/admin/gateway-cost/summary`
**Summary**: Get LLM gateway cost summary for the current month
**Tags**: admin

Return a cost summary for the tenant's LLM gateway usage for the current calendar month, including month-to-date spend, projected daily and monthly spend, the current sampling rate and budget configuration, days elapsed and remaining, and the top-spending endpoint, project, and organization. Scoped to the token's customer. Use to monitor gateway spend health and detect cost anomalies before the month closes.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PATCH /v1/admin/gateway-cost/configuration — Set Gw Cost Config

**Endpoint**: `PATCH /v1/admin/gateway-cost/configuration`
**Summary**: Set Gw Cost Config
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/gateway-cost/spend-timeseries — Retrieve Gw Spend Timeseries

**Endpoint**: `POST /v1/admin/gateway-cost/spend-timeseries`
**Summary**: Retrieve Gw Spend Timeseries
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/support-access/grants — List support access grants for the customer

**Endpoint**: `GET /v1/admin/support-access/grants`
**Summary**: List support access grants for the customer
**Tags**: admin, support-access, list-grants

Return all support access grants issued for the token's customer, each including the engineer email, assigned roles, grant status, and expiry time. Optionally filter by active status using the `active` query parameter (`active` or `inactive`). Use to audit which AllTrue support engineers currently have or previously had elevated access to the tenant. Scoped to the token's customer.

**Parameters**:
- `active` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/support-access/grants/{grant_id}/revoke —  Revoke Customer Support Access Grant

**Endpoint**: `POST /v1/admin/support-access/grants/{grant_id}/revoke`
**Summary**:  Revoke Customer Support Access Grant
**Tags**: admin, support-access, revoke-grant

Revoke a specific support access grant by its ID.

**Parameters**:
- `grant_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/audit-logs — List audit log entries for the customer

**Endpoint**: `GET /v1/admin/audit-logs`
**Summary**: List audit log entries for the customer
**Tags**: admin

Deprecated: accepts the Auth0-shaped ``auth0_user_ids`` query param, response items expose ``auth0_organization_id`` / ``auth0_organization_display_name`` (different concept from our internal organizations), and pagination uses ``offset`` / ``limit`` / ``total_count``. Use ``GET /v2/admin/audit-logs`` instead (``user_ids`` only; no Auth0-org fields; 1-indexed ``page`` + ``per_page`` + ``pagination`` envelope; ``sort_by``/``sort_order``). Return paginated audit log entries for the token's customer. Supports filtering by time range, user identity (`user_ids` or `auth0_user_ids`, unioned if both supplied), roles, HTTP methods, URL paths, and free-text search. Unknown `auth0_user_ids` are silently dropped. Sort by time or another field via `order_field` and `ascending_order`. Use to investigate who performed what admin actions and when. Scoped to the token's customer.

**Parameters**:
- `offset` (query, optional): 
- `limit` (query, optional): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `user_ids` (query, optional): 
- `auth0_user_ids` (query, optional): 
- `roles` (query, optional): 
- `search_str` (query, optional): 
- `methods` (query, optional): 
- `paths` (query, optional): 
- `order_field` (query, optional): 
- `ascending_order` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/audit-logs/paths — List distinct API paths recorded in audit logs

**Endpoint**: `GET /v1/admin/audit-logs/paths`
**Summary**: List distinct API paths recorded in audit logs
**Tags**: admin

Return the distinct API path strings that appear in the customer's audit log history. Use this to populate a path filter dropdown before calling the audit log list endpoint. Only returns paths for the token's customer — no cross-tenant data is exposed. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/admin/customers/{customer_id} — Get customer details by ID

**Endpoint**: `GET /v1/admin/customers/{customer_id}`
**Summary**: Get customer details by ID
**Tags**: admin, internal

Return full customer profile for the given customer ID including name, configuration flags, and branding fields. Use to fetch the customer record before displaying or updating customer settings. The {customer_id} path parameter must match the caller's token — enforced at authorization. Scoped to the requested customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/admin/customers/{customer_id} —  Update Customer

**Endpoint**: `PUT /v1/admin/customers/{customer_id}`
**Summary**:  Update Customer
**Tags**: admin, internal

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/llm-firewall/prompt-retention — Get the customer's LLM-firewall prompt-log retention settings

**Endpoint**: `GET /v1/admin/llm-firewall/prompt-retention`
**Summary**: Get the customer's LLM-firewall prompt-log retention settings
**Tags**: admin, internal

**Responses**:
- `200`: Successful Response

---

## PUT /v1/admin/llm-firewall/prompt-retention — Update the customer's LLM-firewall prompt-log retention period

**Endpoint**: `PUT /v1/admin/llm-firewall/prompt-retention`
**Summary**: Update the customer's LLM-firewall prompt-log retention period
**Tags**: admin, internal

Set how many days of prompt-log data the nightly purge retains for this
customer. The new value must be between 1 and the customer's
`max_retention_period_days` (inclusive); a value above the maximum is
rejected with a 400 and a message naming the cap.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/organizations —  Add Organization

**Endpoint**: `POST /v1/admin/organizations`
**Summary**:  Add Organization
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/organizations/{organization_id}/white-list — List CIDR allow-list entries for an organization

**Endpoint**: `GET /v1/admin/organizations/{organization_id}/white-list`
**Summary**: List CIDR allow-list entries for an organization
**Tags**: admin

Return all CIDR ranges registered in the IP allow-list for the specified organization. Use to inspect which source IP blocks are permitted for the organization before adding or removing entries. Scoped to the token's customer — the organization must belong to the caller's tenant.

**Parameters**:
- `organization_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/organizations/{organization_id}/white-list/delete —  Delete White List

**Endpoint**: `POST /v1/admin/organizations/{organization_id}/white-list/delete`
**Summary**:  Delete White List
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/organizations/{organization_id}/white-list/add —  Add Cidr For Organization

**Endpoint**: `POST /v1/admin/organizations/{organization_id}/white-list/add`
**Summary**:  Add Cidr For Organization
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/vendor —  Add Vendor

**Endpoint**: `POST /v1/admin/vendor`
**Summary**:  Add Vendor
**Tags**: admin, internal

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/projects — List projects in a customer

**Endpoint**: `GET /v1/admin/customers/{customer_id}/projects`
**Summary**: List projects in a customer
**Tags**: admin

Deprecated: response publishes ``owner_auth0_id``. Use ``GET /v2/admin/project-management/projects`` (returns the internal ``owner_user_id``) instead. Behaviour and shape are otherwise unchanged.

**Parameters**:
- `customer_id` (path, required): 
- `project_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/projects — Create Project

**Endpoint**: `POST /v1/admin/projects`
**Summary**: Create Project
**Tags**: admin

Deprecated: accepts and returns ``owner_auth0_id``. Use ``POST /v2/admin/project-management/projects`` (keyed on internal ``owner_user_id``) instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/projects/bulk — Create Projects

**Endpoint**: `POST /v1/admin/projects/bulk`
**Summary**: Create Projects
**Tags**: admin

Deprecated: response publishes ``owner_auth0_id`` (always ``null`` on this route since bulk-create does not accept an owner). Use ``POST /v2/admin/project-management/projects/bulk`` instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/projects/{project_id} — Get full details for a project

**Endpoint**: `GET /v1/admin/projects/{project_id}`
**Summary**: Get full details for a project
**Tags**: admin

Deprecated: response publishes ``owner_auth0_id``. Use ``GET /v2/admin/project-management/projects/{project_id}`` (returns internal ``owner_user_id``) instead.

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/admin/projects/{project_id} — Update Project

**Endpoint**: `PUT /v1/admin/projects/{project_id}`
**Summary**: Update Project
**Tags**: admin

Deprecated: accepts and returns ``owner_auth0_id``. Use ``PUT /v2/admin/project-management/projects/{project_id}`` (keyed on internal ``owner_user_id``) instead.

**Parameters**:
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/projects/{project_id}/set-project-status — Update Project Status

**Endpoint**: `PUT /v1/admin/projects/{project_id}/set-project-status`
**Summary**: Update Project Status
**Tags**: admin

Deprecated: response publishes ``owner_auth0_id``. Use ``PUT /v2/admin/project-management/projects/{project_id}/status`` (response keyed on internal ``owner_user_id``) instead.

**Parameters**:
- `project_id` (path, required): 
- `project_status` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/organizations/{organization_id}/set-organization-status — Update Organization Status

**Endpoint**: `PUT /v1/admin/organizations/{organization_id}/set-organization-status`
**Summary**: Update Organization Status
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 
- `organization_status` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/projects/{project_id}/discovered-resources — List AI resources discovered and assigned to a project

**Endpoint**: `GET /v1/admin/projects/{project_id}/discovered-resources`
**Summary**: List AI resources discovered and assigned to a project
**Tags**: admin

Return all AI/ML resource instances that have been discovered and assigned to the specified project. Use to audit what resources are tracked under a project or to verify post-discovery assignment. Returns 500 on unexpected failures. Scoped to the token's customer — the project must belong to the caller's tenant.

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Project not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/projects/{project_id}/unassign-resource — Unassign Resource From Project

**Endpoint**: `POST /v1/admin/projects/{project_id}/unassign-resource`
**Summary**: Unassign Resource From Project
**Tags**: admin

**Parameters**:
- `project_id` (path, required): 
- `resource_instance_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/organizations — List organizations in a customer

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations`
**Summary**: List organizations in a customer
**Tags**: admin

Return every organization under the given customer, grouped under the top-level ``organizations`` key. Use this when you need to resolve an organization name to its ``organization_id`` or to pick an organization to set as the active scope. Filterable by ``organization_status`` (defaults to ``ACTIVE``).

**Parameters**:
- `customer_id` (path, required): 
- `organization_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/admin/organizations/{organization_id} — Update Organization

**Endpoint**: `PUT /v1/admin/organizations/{organization_id}`
**Summary**: Update Organization
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/organizations/{organization_id}/projects — List projects within a specific organization

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations/{organization_id}/projects`
**Summary**: List projects within a specific organization
**Tags**: admin

Deprecated: response publishes ``owner_auth0_id``. Use ``GET /v2/admin/project-management/projects?organization_id={organization_id}`` (returns internal ``owner_user_id``) instead.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Organization not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/organizations/projects — List all projects grouped by organization

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations/projects`
**Summary**: List all projects grouped by organization
**Tags**: admin

Deprecated: nested org-then-projects tree publishes ``owner_auth0_id`` on each nested project. The v2 surface does not provide a tree-shaped equivalent — assemble client-side from ``GET /v2/admin/project-management/projects`` plus the org list.

**Parameters**:
- `customer_id` (path, required): 
- `project_status` (query, optional): 
- `organization_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/cloud-providers —  Get Cloud Providers

**Endpoint**: `GET /v1/admin/cloud-providers`
**Summary**:  Get Cloud Providers
**Tags**: admin, internal

**Responses**:
- `200`: Successful Response

---

## GET /v1/admin/customers/{customer_id}/cloud-accounts —  Get Cloud Provider Accounts

**Endpoint**: `GET /v1/admin/customers/{customer_id}/cloud-accounts`
**Summary**:  Get Cloud Provider Accounts
**Tags**: admin

Deprecated: use /cloud-accounts endpoint

**Parameters**:
- `customer_id` (path, required): 
- `cloud_provider` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/cloud-accounts — List registered cloud accounts for the customer

**Endpoint**: `GET /v1/admin/cloud-accounts`
**Summary**: List registered cloud accounts for the customer
**Tags**: admin

Return all cloud provider accounts (AWS, Azure, GCP, Snowflake, etc.) onboarded for the token's customer, including provider metadata, resource counts, and associated projects. Optionally filter by `cloud_provider` name. Use to discover which cloud accounts are connected and their configuration status. Scoped to the token's customer.

**Parameters**:
- `cloud_provider` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/cloud-accounts —  Register Cloud Account 2

**Endpoint**: `POST /v1/admin/cloud-accounts`
**Summary**:  Register Cloud Account 2
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/cloud-accounts-details — List detailed cloud account information with filters

**Endpoint**: `GET /v1/admin/cloud-accounts-details`
**Summary**: List detailed cloud account information with filters
**Tags**: admin

Return a detailed view of the customer's cloud accounts with optional filtering by cloud provider, specific account IDs, Azure tenant ID, Azure subscription IDs, organization, or project. Use when you need richer account detail than the /cloud-accounts endpoint provides, or to scope the list to a specific project or organization. Scoped to the token's customer.

**Parameters**:
- `cloud_provider` (query, optional): 
- `cloud_provider_account_id` (query, optional): 
- `azure_tenant_id` (query, optional): 
- `azure_subscription_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/cloud-account/resources — List discovered resources for a cloud account

**Endpoint**: `GET /v1/admin/cloud-account/resources`
**Summary**: List discovered resources for a cloud account
**Tags**: admin

Return a paginated list of AI/ML resources discovered within a specific cloud account, identified by `cloud_provider_account_id`. Optionally filter by `resource_type`. Use to inspect what resources the scanner found in a given account, or to verify discovery coverage. Supports pagination via `page` and `per_page` (max 200). Scoped to the token's customer.

**Parameters**:
- `cloud_provider_account_id` (query, required): 
- `resource_type` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/cloud-account/scan-info — List cloud accounts with scan status information

**Endpoint**: `GET /v1/admin/cloud-account/scan-info`
**Summary**: List cloud accounts with scan status information
**Tags**: admin

Return cloud accounts for the token's customer that have not yet been successfully scanned or are pending their initial scan. Use to identify accounts that need attention before running a discovery job, or to check which accounts have never been scanned. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/admin/customers/{customer_id}/get-cloud-account-cfn-template —  Get Cloud Account Cfn Template

**Endpoint**: `GET /v1/admin/customers/{customer_id}/get-cloud-account-cfn-template`
**Summary**:  Get Cloud Account Cfn Template
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/get-cloud-account-azure-template —  Get Cloud Account Azure Template

**Endpoint**: `GET /v1/admin/customers/{customer_id}/get-cloud-account-azure-template`
**Summary**:  Get Cloud Account Azure Template
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/get-cloud-account-gcp-template —  Get Cloud Account Gcp Template

**Endpoint**: `GET /v1/admin/customers/{customer_id}/get-cloud-account-gcp-template`
**Summary**:  Get Cloud Account Gcp Template
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/cloud-accounts/snowflake-v2/bootstrap —  Generate Snowflake V2 Bootstrap

**Endpoint**: `POST /v1/admin/cloud-accounts/snowflake-v2/bootstrap`
**Summary**:  Generate Snowflake V2 Bootstrap
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/cloud-accounts/snowflake-v2/test-and-register — Test a SnowflakeV2 connection and register the cloud account

**Endpoint**: `POST /v1/admin/cloud-accounts/snowflake-v2/test-and-register`
**Summary**: Test a SnowflakeV2 connection and register the cloud account
**Tags**: admin

Opens a live Snowpark session with the supplied account/user/role/warehouse against the customer-level RSA key pair stored at bootstrap time, runs the full validation suite (role/warehouse match, SHOW DATABASES, grant top-up procedure), and on success persists the cloud-account row. Idempotent — re-calling for an already-registered account refreshes the connection secret and connection result. The Snowflake-side bootstrap script has no outbound network to the control plane, so this endpoint is what the FE calls after the customer runs the script in Snowsight.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/register-cloud-accounts/customer/{customer_id} — Register Cloud Account

**Endpoint**: `POST /v1/admin/register-cloud-accounts/customer/{customer_id}`
**Summary**: Register Cloud Account
**Tags**: admin

Register cloud accounts for a customer based on the provided request.
Deprecated: Use /cloud-accounts endpoint instead.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/cloud-accounts/{account_id}/databricks-workspaces/{workspace_id}/m2m-credentials — Register Databricks workspace M2M credentials

**Endpoint**: `POST /v1/admin/cloud-accounts/{account_id}/databricks-workspaces/{workspace_id}/m2m-credentials`
**Summary**: Register Databricks workspace M2M credentials
**Tags**: admin

Stores per-workspace Databricks OAuth M2M (service-principal) credentials for an already-onboarded cloud account, keyed by workspace id. The credentials are validated by minting a workspace token before they are stored — invalid credentials or an unreachable workspace return 400 and persist nothing. Re-registering the same workspace overwrites its entry. Additive: the account's existing credentials are left untouched.

**Parameters**:
- `account_id` (path, required): 
- `workspace_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/cloud-account/validate —  Validate Cloud Account

**Endpoint**: `POST /v1/admin/cloud-account/validate`
**Summary**:  Validate Cloud Account
**Tags**: admin

**Parameters**:
- `cloud_provider_account_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/cloud-accounts/projects — Assign Cloud Account To Project

**Endpoint**: `PUT /v1/admin/cloud-accounts/projects`
**Summary**: Assign Cloud Account To Project
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/cloud-account/unlink-from-project — Unlink Cloud Account From Project

**Endpoint**: `PUT /v1/admin/cloud-account/unlink-from-project`
**Summary**: Unlink Cloud Account From Project
**Tags**: admin

**Parameters**:
- `cloud_provider_account_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/cloud-accounts/bulk-unlink-from-project — Bulk Unlink Cloud Accounts From Project

**Endpoint**: `PUT /v1/admin/cloud-accounts/bulk-unlink-from-project`
**Summary**: Bulk Unlink Cloud Accounts From Project
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/cloud-account — Delete Cloud Account

**Endpoint**: `DELETE /v1/admin/cloud-account`
**Summary**: Delete Cloud Account
**Tags**: admin

**Parameters**:
- `cloud_provider_account_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/cloud-accounts-bulk — Bulk Delete Cloud Account

**Endpoint**: `DELETE /v1/admin/cloud-accounts-bulk`
**Summary**: Bulk Delete Cloud Account
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/connections — Get Connections

**Endpoint**: `GET /v1/admin/connections`
**Summary**: Get Connections
**Tags**: admin

Retrieves enabled connections for the customer.
Internal users can see the Varonis Okta connection; external users cannot.

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/invitations — Invite User

**Endpoint**: `POST /v1/admin/invitations`
**Summary**: Invite User
**Tags**: admin

Deprecated: request body carries ``connection_id`` (Auth0 connection ID) and response exposes ``auth0_invitation_id``. Use ``POST /v2/admin/invitations`` (no ``connection_id``; response keyed on the internal ``id``) instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/invitations — List pending and accepted invitations for the customer

**Endpoint**: `GET /v1/admin/invitations`
**Summary**: List pending and accepted invitations for the customer
**Tags**: admin

Deprecated: response items expose ``auth0_invitation_id`` / ``connection_id`` and pagination uses ``start`` / ``limit`` / ``total``. Use ``GET /v2/admin/invitations`` instead (1-indexed ``page`` + ``per_page``; ``pagination`` envelope; no Auth0 fields). Status filtering and support-access visibility rules are unchanged.

**Parameters**:
- `per_page` (query, optional): 
- `page` (query, optional): 
- `status` (query, optional): Filter by status

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/admin/invitations/{invitation_id} — Get a pending invitation by ID

**Endpoint**: `GET /v1/admin/invitations/{invitation_id}`
**Summary**: Get a pending invitation by ID
**Tags**: admin

Deprecated: response exposes ``auth0_invitation_id`` / ``connection_id``. Use ``GET /v2/admin/invitations/{invitation_id}`` instead. Return the invitation record for the specified invitation ID, enriched with role and organization display names. Support-access invitations are hidden from non-internal callers. Scoped to the token's customer.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Invitation not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/admin/invitations/{invitation_id} — Delete Invitation

**Endpoint**: `DELETE /v1/admin/invitations/{invitation_id}`
**Summary**: Delete Invitation
**Tags**: admin

Deprecated: paired with the deprecated v1 invitation surface. Use ``DELETE /v2/admin/invitations/{invitation_id}`` instead. Behaviour (dual-delete, swallow ``already gone`` on the IdP) is unchanged.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/invitations/{invitation_id}/assignments — Update Invitation Assignments Endpoint

**Endpoint**: `PUT /v1/admin/invitations/{invitation_id}/assignments`
**Summary**: Update Invitation Assignments Endpoint
**Tags**: admin

Deprecated: paired with the deprecated v1 invitation surface. Use ``PUT /v2/admin/invitations/{invitation_id}/assignments`` instead. Request body shape and partial-update semantics are unchanged.

**Parameters**:
- `invitation_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/invitations/{invitation_id}/reinvite — Reinvite Endpoint

**Endpoint**: `POST /v1/admin/invitations/{invitation_id}/reinvite`
**Summary**: Reinvite Endpoint
**Tags**: admin

Deprecated: paired with the deprecated v1 invitation surface. Use ``POST /v2/admin/invitations/{invitation_id}/reinvite`` instead. Behaviour (preserve assignments, fresh IdP invitation) is unchanged.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects — List projects assigned to a specific user

**Endpoint**: `GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects`
**Summary**: List projects assigned to a specific user
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `GET /v2/admin/scope-assignments/users/{user_id}/projects` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects — Assign Projects To User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects`
**Summary**: Assign Projects To User
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/projects` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/users/{auth0_user_id}/projects — List projects assigned to a user in the caller's tenant

**Endpoint**: `GET /v1/admin/users/{auth0_user_id}/projects`
**Summary**: List projects assigned to a user in the caller's tenant
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `GET /v2/admin/scope-assignments/users/{user_id}/projects` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/projects — Assign Projects To User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/projects`
**Summary**: Assign Projects To User New
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/projects` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects/delete — Remove Projects From User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects/delete`
**Summary**: Remove Projects From User
**Tags**: admin

Remove projects from a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/projects/delete — Remove Projects From User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/projects/delete`
**Summary**: Remove Projects From User New
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/projects/delete` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations — List organizations assigned to a specific user

**Endpoint**: `GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations`
**Summary**: List organizations assigned to a specific user
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `GET /v2/admin/scope-assignments/users/{user_id}/organizations` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User or organizations not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations — Assign Organizations To User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations`
**Summary**: Assign Organizations To User
**Tags**: admin, internal

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/organizations` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/users/{auth0_user_id}/organizations — List organizations assigned to a user in the caller's tenant

**Endpoint**: `GET /v1/admin/users/{auth0_user_id}/organizations`
**Summary**: List organizations assigned to a user in the caller's tenant
**Tags**: admin

Deprecated: keyed on Auth0 user id. Use `GET /v2/admin/scope-assignments/users/{user_id}/organizations` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: User or organizations not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/organizations — Assign Organizations To User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/organizations`
**Summary**: Assign Organizations To User New
**Tags**: admin, internal

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/organizations` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations/delete — Remove Organizations From User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations/delete`
**Summary**: Remove Organizations From User
**Tags**: admin, internal

Remove organizations from a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/organizations/delete — Remove Organizations From User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/organizations/delete`
**Summary**: Remove Organizations From User New
**Tags**: admin, internal

Deprecated: keyed on Auth0 user id. Use `POST /v2/admin/scope-assignments/users/{user_id}/organizations/delete` (keyed on the internal `user_id` UUID) instead.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/reset-assignments — Reset User Assignments

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/reset-assignments`
**Summary**: Reset User Assignments
**Tags**: admin

Deprecated — app_metadata sync to Auth0 has been removed. No-op.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/reset-assignments — Reset User Assignments New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/reset-assignments`
**Summary**: Reset User Assignments New
**Tags**: admin

Deprecated — app_metadata sync to Auth0 has been removed. No-op.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id} — Update User (Admin)

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}`
**Summary**: Update User (Admin)
**Tags**: admin

DB-backed admin update for the per-customer user row.

Replaces the deprecated Auth0-passthrough ``PATCH
/v1/admin/auth0-customer/{customer_id}/users/{user_id}``: writes
``UserDB.name`` (composed from ``given_name`` + ``family_name``) and
``UserDB.has_access_to_all_organizations`` directly. The Auth0
``app_metadata`` field is no longer consulted by the data-plane
authorization layer.

Unlike role assignment (escalate-only), this endpoint can also demote
``has_access_to_all_organizations`` to ``False`` — except for users whose
role implies all-orgs access by default (Admin/SecAdmin/Internal), which
would just snap back on next login.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/current-user — Get Current User Info

**Endpoint**: `GET /v1/admin/current-user`
**Summary**: Get Current User Info
**Tags**: admin

Get current user info from Auth0 by ``auth0_user_id``.

Lookup-only: the global ``authorize_request`` dep already verified the
``UserDB`` row exists for any external token reaching this handler, so
the prior get-or-add upsert was dead weight (and would silently swallow
``token_user.email is None``). #12440 removed that competing-resolution
path. Prefer ``POST /v1/auth/bootstrap`` for new clients (this route is
``deprecated=True``).

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/admin/current-user — Update Current User

**Endpoint**: `PATCH /v1/admin/current-user`
**Summary**: Update Current User
**Tags**: admin

Deprecated: dual-writes the display name to our DB and to the customer's IdP. Use ``PATCH /v2/admin/user-management/current-user`` instead — DB-only write of ``UserDB.name``; the JWT ``name`` claim still reflects the IdP-side value until that side is updated separately. Behaviour and request body are otherwise unchanged.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/current-user/permissions — Get Current User Permissions

**Endpoint**: `GET /v1/admin/current-user/permissions`
**Summary**: Get Current User Permissions
**Tags**: admin

Get permissions for the current user based on the token payload.

Not tagged ``no-auth``: the endpoint exists to return the *caller's*
permissions and inherently requires the caller's identity. Without an
``Authorization`` header, the global ``authorize_request`` dependency
emits ``401 unauthorized`` (the unauthenticated contract). The
permission ``get /v1/admin/current-user/permissions`` is in
``global_permissions`` in ``permissions_roles_config.json`` so every
role can call it once authenticated. Issue #12851.

**Responses**:
- `200`: Successful Response

---

## GET /v1/admin/customers/{customer_id}/roles — List internal roles available for a customer

**Endpoint**: `GET /v1/admin/customers/{customer_id}/roles`
**Summary**: List internal roles available for a customer
**Tags**: admin

Return both default (platform-provided) and custom roles available to the specified customer, excluding guest/external roles. Each role entry includes a flag indicating whether it is a custom role. Internal callers additionally see platform-internal roles. Use to populate a role picker for user assignment or to look up a role ID before assigning permissions. Scoped to the specified customer.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Customer not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/roles — Create Customer Role

**Endpoint**: `POST /v1/admin/customers/{customer_id}/roles`
**Summary**: Create Customer Role
**Tags**: admin, internal

Create a new custom role for a specific customer.

The role is created in the customer's IdP and mirrored to the DB.

Response:
    201: Role created successfully

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/guest-roles — Get Customer Guest Roles

**Endpoint**: `GET /v1/admin/customers/{customer_id}/guest-roles`
**Summary**: Get Customer Guest Roles
**Tags**: admin

Retrieve guest/external roles (e.g., GuestUser).

Args:
    session: The database session.

Returns:
    List[RoleResponse]: Guest roles.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/customers/{customer_id}/roles/{role_id} — Update Customer Role

**Endpoint**: `PUT /v1/admin/customers/{customer_id}/roles/{role_id}`
**Summary**: Update Customer Role
**Tags**: admin

Update an existing custom role for a specific customer.

The role is updated in the customer's IdP and mirrored to the DB.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/customers/{customer_id}/roles/{role_id} — Delete Customer Role

**Endpoint**: `DELETE /v1/admin/customers/{customer_id}/roles/{role_id}`
**Summary**: Delete Customer Role
**Tags**: admin

Delete a custom role for a specific customer.

The role is removed from the DB and from the customer's IdP.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/permissions — Get Permissions

**Endpoint**: `GET /v1/admin/permissions`
**Summary**: Get Permissions
**Tags**: admin

Retrieve all permissions.

Args:
    session (Session): The database session.

Returns:
    List[PermissionResponse]: A list of all permissions.

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/permissions — Create Permission

**Endpoint**: `POST /v1/admin/permissions`
**Summary**: Create Permission
**Tags**: admin, internal

Create a new permission.

Args:
    permission (PermissionCreate): The permission data to be created.
    session (Session): The database session.

Returns:
    PermissionResponse: The newly created permission.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/roles/{role_id}/permissions — Assign Permissions To Role

**Endpoint**: `POST /v1/admin/customers/{customer_id}/roles/{role_id}/permissions`
**Summary**: Assign Permissions To Role
**Tags**: admin, internal

Assign permissions to a custom role for a customer.

Args:
    customer_id (UUID): The unique identifier of the customer.
    role_id (UUID): The unique identifier of the role.
    permissions (RolePermissionsAssign): The permissions to be assigned.
    session (Session): The database session.

Returns:
    CustomRoleResponse: The updated role with assigned permissions.

Raises:
    HTTPException: If the role is not found.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/roles/{role_id}/permissions — List permissions assigned to a role

**Endpoint**: `GET /v1/admin/customers/{customer_id}/roles/{role_id}/permissions`
**Summary**: List permissions assigned to a role
**Tags**: admin

Return all permissions currently assigned to the specified role, which may be either a default platform role or a custom role belonging to the customer. Use to audit what a role can do, or to compare permissions across roles before assigning users. Works for both predefined and custom roles. Scoped to the specified customer.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Role not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/admin/customers/{customer_id}/roles/{role_id}/permissions/{permission_id} — Unassign Permission From Role

**Endpoint**: `DELETE /v1/admin/customers/{customer_id}/roles/{role_id}/permissions/{permission_id}`
**Summary**: Unassign Permission From Role
**Tags**: admin

**Parameters**:
- `role_id` (path, required): 
- `permission_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/logo —  Generate Customer Logo Upload Presigned Url

**Endpoint**: `POST /v1/admin/customers/{customer_id}/logo`
**Summary**:  Generate Customer Logo Upload Presigned Url
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/customers/{customer_id}/logo —  Upload Customer Logo

**Endpoint**: `PUT /v1/admin/customers/{customer_id}/logo`
**Summary**:  Upload Customer Logo
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/entitlements — Get entitlement tiers for the customer

**Endpoint**: `GET /v1/admin/entitlements`
**Summary**: Get entitlement tiers for the customer
**Tags**: admin, internal

Return the list of feature entitlement tiers active for the token's customer. Use to determine which product features or module tiers the customer has licensed before enabling feature-gated UI sections or API calls. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/admin/customers/{customer_id}/entitlements — Get Customer Entitlements

**Endpoint**: `GET /v1/admin/customers/{customer_id}/entitlements`
**Summary**: Get Customer Entitlements
**Tags**: admin, internal

Get the list of entitlement tiers for a customer.

**Responses**:
- `200`: Successful Response

---

## GET /v1/admin/customer/logging-token — Get Customer Logging Token

**Endpoint**: `GET /v1/admin/customer/logging-token`
**Summary**: Get Customer Logging Token
**Tags**: admin

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/send-ecs-task-failure —  Send Ecs Task Failure

**Endpoint**: `POST /v1/admin/send-ecs-task-failure`
**Summary**:  Send Ecs Task Failure
**Tags**: admin, llm-firewall

Send a notification about ECS task failure in customer plane.

Returns a success message upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/register-user —  Register User If Not Present

**Endpoint**: `POST /v1/admin/register-user`
**Summary**:  Register User If Not Present
**Tags**: admin

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/get-external-secret-manager —  Get External Secret Manager

**Endpoint**: `POST /v1/admin/get-external-secret-manager`
**Summary**:  Get External Secret Manager
**Tags**: admin, internal, job-manager

Get the external secret manager configuration for a customer.

Returns the external secret manager details upon completion.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/invitations — Bulk Invite Users

**Endpoint**: `POST /v1/admin/bulk/invitations`
**Summary**: Bulk Invite Users
**Tags**: admin

Deprecated: request body carries ``connection_id`` (Auth0-specific). Use ``POST /v2/admin/bulk-user-operations/invitations`` (no ``connection_id``; the customer's default connection is resolved server-side) instead.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/delete-users — Bulk Delete Users

**Endpoint**: `POST /v1/admin/bulk/delete-users`
**Summary**: Bulk Delete Users
**Tags**: admin

**Deprecated.** Use ``POST /v2/admin/bulk-user-operations/delete-users``, which is keyed on internal ``user_id`` UUIDs. This route translates ``auth0_user_ids`` → ``user_id`` and rejects the whole request with 400 if any submitted id is unknown.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-roles — Bulk Assign Roles

**Endpoint**: `POST /v1/admin/bulk/assign-roles`
**Summary**: Bulk Assign Roles
**Tags**: admin

**Deprecated.** Use ``POST /v2/admin/bulk-user-operations/assign-roles``. This route translates ``auth0_user_ids`` → ``user_id`` and rejects the whole request with 400 if any submitted id is unknown.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-projects — Bulk Assign Projects

**Endpoint**: `POST /v1/admin/bulk/assign-projects`
**Summary**: Bulk Assign Projects
**Tags**: admin

**Deprecated.** Use ``POST /v2/admin/bulk-user-operations/assign-projects``. This route translates ``auth0_user_ids`` → ``user_id`` and rejects the whole request with 400 if any submitted id is unknown.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-organizations — Bulk Assign Organizations

**Endpoint**: `POST /v1/admin/bulk/assign-organizations`
**Summary**: Bulk Assign Organizations
**Tags**: admin

**Deprecated.** Use ``POST /v2/admin/bulk-user-operations/assign-organizations``. This route translates ``auth0_user_ids`` → ``user_id`` and rejects the whole request with 400 if any submitted id is unknown.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/control-plane-public-ips — Get Control Plane Public Ips

**Endpoint**: `GET /v1/admin/control-plane-public-ips`
**Summary**: Get Control Plane Public Ips
**Tags**: admin

Return control plane metadata (public IP CIDRs, AWS account ID).

**Responses**:
- `200`: Successful Response

---

## GET /v1/notification-settings/customer — Get customer-level notification settings

**Endpoint**: `GET /v1/notification-settings/customer`
**Summary**: Get customer-level notification settings
**Tags**: admin

Return the customer-level notification settings (alert channels, digest cadence, and per-event toggles) that apply to every user in the tenant unless overridden by a user-level setting. Scoped to the token's customer. Use to inspect the organization-wide notification configuration.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PUT /v1/notification-settings/customer — Update customer-level notification settings

**Endpoint**: `PUT /v1/notification-settings/customer`
**Summary**: Update customer-level notification settings
**Tags**: admin

Replace the customer-level notification settings for the token's customer with the supplied configuration (alert channels, digest cadence, per-event toggles). Applies to every user in the tenant unless overridden by a user-level setting. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/notification-settings/customer — Delete customer-level notification settings

**Endpoint**: `DELETE /v1/notification-settings/customer`
**Summary**: Delete customer-level notification settings
**Tags**: admin

Delete the customer-level notification settings for the token's customer, restoring the platform defaults for the whole tenant. Scoped to the token's customer. User-level overrides are unaffected.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/notification-settings/user — Get the calling user's notification settings

**Endpoint**: `GET /v1/notification-settings/user`
**Summary**: Get the calling user's notification settings
**Tags**: admin

Return the notification settings for the calling user, which override the customer-level defaults for that user only. Scoped to the token's user within the token's customer. Use to inspect a user's personal notification preferences.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PUT /v1/notification-settings/user — Update the calling user's notification settings

**Endpoint**: `PUT /v1/notification-settings/user`
**Summary**: Update the calling user's notification settings
**Tags**: admin

Replace the calling user's personal notification settings with the supplied configuration, overriding the customer-level defaults for that user only. Scoped to the token's user within the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/notification-settings/user — Delete the calling user's notification settings

**Endpoint**: `DELETE /v1/notification-settings/user`
**Summary**: Delete the calling user's notification settings
**Tags**: admin

Delete the calling user's personal notification settings, restoring the customer-level defaults for that user. Scoped to the token's user within the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/gateway/logging-defaults — Get Admin Logging Defaults

**Endpoint**: `GET /v1/gateway/logging-defaults`
**Summary**: Get Admin Logging Defaults
**Tags**: admin

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/gateway/logging-defaults — Patch Admin Logging Defaults

**Endpoint**: `PATCH /v1/gateway/logging-defaults`
**Summary**: Patch Admin Logging Defaults
**Tags**: admin

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/admin/user-management/users/{user_id} — Delete user

**Endpoint**: `DELETE /v2/admin/user-management/users/{user_id}`
**Summary**: Delete user
**Tags**: admin, user-management

Mark the user as disabled in our DB, then delete from the customer's IdP. ``customer_id`` is read from the JWT — callers cannot target another tenant. Idempotent on the DB side: a re-delete on an already disabled row still drives the IdP cleanup.

**Parameters**:
- `user_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/admin/user-management/users/{user_id} — Update user display name

**Endpoint**: `PATCH /v2/admin/user-management/users/{user_id}`
**Summary**: Update user display name
**Tags**: admin, user-management

Update the user's display name on our DB row. Accepts ``given_name`` + ``family_name`` and persists them as a single composed ``name`` on ``UserDB``. Does not call the IdP — the JWT ``name`` claim still reflects the IdP-side value until that side is updated separately. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/user-management/users/{user_id} — Get user detail

**Endpoint**: `GET /v2/admin/user-management/users/{user_id}`
**Summary**: Get user detail
**Tags**: admin, user-management

Return the user's profile, IdP-tenant membership, and DB-resolved role list. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v2/admin/user-management/current-user — Update the caller's display name

**Endpoint**: `PATCH /v2/admin/user-management/current-user`
**Summary**: Update the caller's display name
**Tags**: admin, user-management

Update the caller's display name on our DB row. Same shape and semantics as ``PATCH /v2/admin/user-management/users/{user_id}`` — DB-only write of ``UserDB.name``; the JWT ``name`` claim still reflects the IdP-side value until that side is updated separately. Reads ``user_id`` and ``customer_id`` from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/user-management/users/{user_id}/roles — Assign roles to a user

**Endpoint**: `POST /v2/admin/user-management/users/{user_id}/roles`
**Summary**: Assign roles to a user
**Tags**: admin, user-management

Add the supplied roles to the user. Returns the user's full post-assignment role set sourced from the DB. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/user-management/users/{user_id}/roles/delete — Revoke roles from a user

**Endpoint**: `POST /v2/admin/user-management/users/{user_id}/roles/delete`
**Summary**: Revoke roles from a user
**Tags**: admin, user-management

Remove the supplied roles from the user. Returns the user's full post-revoke role set sourced from the DB. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/user-management/users — List internal users

**Endpoint**: `GET /v2/admin/user-management/users`
**Summary**: List internal users
**Tags**: admin, user-management

Paginated list of non-guest users for the caller's tenant. Each row carries DB-resolved identity and project / organization assignments plus IdP-side profile fields (``picture``, ``email_verified``, ``blocked``, ``last_login_at``) when the user is currently present in the IdP tenant. Users carrying the AllTrue-internal ``Internal`` role are hidden unless the caller themselves carries it. Text search is not supported because ``email`` and ``name`` are encrypted at rest with a non-deterministic cipher; FE callers should keep filtering the returned page client-side.

**Parameters**:
- `page` (query, required): 
- `per_page` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/user-management/guest-users — List guest users

**Endpoint**: `GET /v2/admin/user-management/guest-users`
**Summary**: List guest users
**Tags**: admin, user-management

Paginated list of users carrying the built-in ``GuestUser`` role for the caller's tenant. Guests cannot hold project / organization assignments, so the row shape omits those fields. IdP-side profile fields are included when the user is currently present in the IdP tenant.

**Parameters**:
- `page` (query, required): 
- `per_page` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/scope-assignments/users/{user_id}/projects — List projects assigned to a user

**Endpoint**: `GET /v2/admin/scope-assignments/users/{user_id}/projects`
**Summary**: List projects assigned to a user
**Tags**: admin, scope-assignments

Return every project currently assigned to the user. Returns an empty list when the user has no project assignments. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/scope-assignments/users/{user_id}/projects — Assign projects to a user

**Endpoint**: `POST /v2/admin/scope-assignments/users/{user_id}/projects`
**Summary**: Assign projects to a user
**Tags**: admin, scope-assignments

Grant the user access to the supplied projects (idempotent on already-assigned rows). Returns the user's full post-assignment project list. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/scope-assignments/users/{user_id}/projects/delete — Remove projects from a user

**Endpoint**: `POST /v2/admin/scope-assignments/users/{user_id}/projects/delete`
**Summary**: Remove projects from a user
**Tags**: admin, scope-assignments

Revoke the user's access to the supplied projects. Returns the user's full post-revoke project list. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/scope-assignments/users/{user_id}/organizations — List organizations assigned to a user

**Endpoint**: `GET /v2/admin/scope-assignments/users/{user_id}/organizations`
**Summary**: List organizations assigned to a user
**Tags**: admin, scope-assignments

Return every organization currently assigned to the user. Returns an empty list when the user has no organization assignments — mirrors the project-assignments endpoint. (v1 returned 404 on empty; v2 drops that quirk.) ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/scope-assignments/users/{user_id}/organizations — Assign organizations to a user

**Endpoint**: `POST /v2/admin/scope-assignments/users/{user_id}/organizations`
**Summary**: Assign organizations to a user
**Tags**: admin, scope-assignments

Grant the user access to the supplied organizations (idempotent on already-assigned rows). Returns the user's full post-assignment organization list. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/scope-assignments/users/{user_id}/organizations/delete — Remove organizations from a user

**Endpoint**: `POST /v2/admin/scope-assignments/users/{user_id}/organizations/delete`
**Summary**: Remove organizations from a user
**Tags**: admin, scope-assignments

Revoke the user's access to the supplied organizations. Returns the user's full post-revoke organization list. ``customer_id`` is read from the JWT.

**Parameters**:
- `user_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/bulk-user-operations/delete-users — Bulk delete users

**Endpoint**: `POST /v2/admin/bulk-user-operations/delete-users`
**Summary**: Bulk delete users
**Tags**: admin, bulk-user-operations

Disable the supplied users in the DB and delete them from the customer's IdP. Runs as a background job — the response is the ``job_id`` to poll via ``GET /v1/job-manager/jobs/{job_id}``. Per-item failures land in the job's ``result.items`` list with the user_id as ``identifier``. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/bulk-user-operations/assign-roles — Bulk assign roles to users

**Endpoint**: `POST /v2/admin/bulk-user-operations/assign-roles`
**Summary**: Bulk assign roles to users
**Tags**: admin, bulk-user-operations

Grant every supplied role to every supplied user. Idempotent on already-assigned (user, role) pairs. Runs as a background job — poll ``GET /v1/job-manager/jobs/{job_id}``. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/bulk-user-operations/assign-projects — Bulk assign projects to users

**Endpoint**: `POST /v2/admin/bulk-user-operations/assign-projects`
**Summary**: Bulk assign projects to users
**Tags**: admin, bulk-user-operations

Grant every supplied user access to every supplied project. Idempotent on already-assigned (user, project) pairs. Runs as a background job — poll ``GET /v1/job-manager/jobs/{job_id}``. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/bulk-user-operations/assign-organizations — Bulk assign organizations to users

**Endpoint**: `POST /v2/admin/bulk-user-operations/assign-organizations`
**Summary**: Bulk assign organizations to users
**Tags**: admin, bulk-user-operations

Grant every supplied user access to every supplied organization. Idempotent on already-assigned (user, organization) pairs. Runs as a background job — poll ``GET /v1/job-manager/jobs/{job_id}``. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/bulk-user-operations/invitations — Bulk invite users

**Endpoint**: `POST /v2/admin/bulk-user-operations/invitations`
**Summary**: Bulk invite users
**Tags**: admin, bulk-user-operations

Send an invitation to each supplied email. The customer's default user-pool connection is resolved server-side — callers do not pass an IdP-side connection identifier. Runs as a background job; poll ``GET /v1/job-manager/jobs/{job_id}`` for per-item outcomes. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/project-management/projects — List projects in the caller's customer

**Endpoint**: `GET /v2/admin/project-management/projects`
**Summary**: List projects in the caller's customer
**Tags**: admin, project-management

Return every project in the caller's tenant, optionally filtered to one organization. ``customer_id`` is read from the JWT. Filterable by ``project_status`` (defaults to ``ACTIVE``) and ``organization_id``. Project owner is exposed as the internal ``user_id`` UUID.

**Parameters**:
- `organization_id` (query, optional): 
- `project_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/project-management/projects — Create a project

**Endpoint**: `POST /v2/admin/project-management/projects`
**Summary**: Create a project
**Tags**: admin, project-management

Create a new project under the supplied organization. ``owner_user_id`` is the internal UUID of the user who should own the new project — omit to create an ownerless project. The caller is auto-assigned to the project on create. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/project-management/projects/{project_id} — Get full details for a project

**Endpoint**: `GET /v2/admin/project-management/projects/{project_id}`
**Summary**: Get full details for a project
**Tags**: admin, project-management

Return the project's full detail record (name, description, status, purpose, supporting documentation, owning organization, and owner). Returns 404 if the project does not exist in the caller's tenant. Project owner is exposed as the internal ``user_id`` UUID.

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v2/admin/project-management/projects/{project_id} — Update a project

**Endpoint**: `PUT /v2/admin/project-management/projects/{project_id}`
**Summary**: Update a project
**Tags**: admin, project-management

Update a project's metadata and (optionally) reassign its owner. Pass ``owner_user_id`` (internal UUID) to change ownership; the new owner is auto-assigned to the project. ``customer_id`` is read from the JWT.

**Parameters**:
- `project_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/project-management/projects/bulk — Bulk-create projects

**Endpoint**: `POST /v2/admin/project-management/projects/bulk`
**Summary**: Bulk-create projects
**Tags**: admin, project-management

Create multiple projects in one call. The caller is auto-assigned to each created project. Bulk-create does not accept an owner — use ``PUT /projects/{project_id}`` afterwards to assign ownership. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v2/admin/project-management/projects/{project_id}/status — Set a project's status

**Endpoint**: `PUT /v2/admin/project-management/projects/{project_id}/status`
**Summary**: Set a project's status
**Tags**: admin, project-management

Flip a project's status (ACTIVE / INACTIVE). Inactivating a project cascades the appropriate resource-unassignment side effects. ``customer_id`` is read from the JWT.

**Parameters**:
- `project_id` (path, required): 
- `project_status` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/invitations — Invite a user

**Endpoint**: `POST /v2/admin/invitations`
**Summary**: Invite a user
**Tags**: admin, invitations

Send an invitation to the supplied email and persist a tracking row. Auth0 customers may target a specific connection by setting ``provider_options.auth0.connection_id``; omitting it (or sending no ``provider_options`` at all) uses the customer's default user-pool connection. ``customer_id`` is read from the JWT.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/invitations — List invitations

**Endpoint**: `GET /v2/admin/invitations`
**Summary**: List invitations
**Tags**: admin, invitations

Paginated list of invitations for the caller's tenant, optionally filtered by status. Support-access invitations are hidden from non-internal callers.

**Parameters**:
- `status` (query, optional): Filter by lifecycle status.
- `page` (query, required): 
- `per_page` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/invitations/{invitation_id} — Get an invitation by ID

**Endpoint**: `GET /v2/admin/invitations/{invitation_id}`
**Summary**: Get an invitation by ID
**Tags**: admin, invitations

Return the invitation record for the given internal ``id``, enriched with role / organization / project display names. Support-access invitations are hidden from non-internal callers.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/admin/invitations/{invitation_id} — Revoke an invitation

**Endpoint**: `DELETE /v2/admin/invitations/{invitation_id}`
**Summary**: Revoke an invitation
**Tags**: admin, invitations

Dual-delete: revoke the DB row and delete the IdP-side invitation (best-effort; ``already gone`` on the IdP is swallowed). Refuses to act on invitations in a terminal lifecycle state.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v2/admin/invitations/{invitation_id}/assignments — Update invitation assignments

**Endpoint**: `PUT /v2/admin/invitations/{invitation_id}/assignments`
**Summary**: Update invitation assignments
**Tags**: admin, invitations

Partial-update of the role / organization / project assignments carried on a pending invitation. Only non-null fields are applied.

**Parameters**:
- `invitation_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/admin/invitations/{invitation_id}/reinvite — Reinvite

**Endpoint**: `POST /v2/admin/invitations/{invitation_id}/reinvite`
**Summary**: Reinvite
**Tags**: admin, invitations

Mint a fresh IdP-side invitation (new ID, URL, and expiry) for an expired or pending invitation, preserving stored assignments.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v2/admin/auth0/connections — List Auth0 connections

**Endpoint**: `GET /v2/admin/auth0/connections`
**Summary**: List Auth0 connections
**Tags**: admin, auth0

Enumerate the Auth0 connections enabled for the caller's tenant. The returned ``id`` is the opaque value to pass as ``provider_options.auth0.connection_id`` on ``POST /v2/admin/invitations`` when targeting a specific federation (e.g. SAML/Okta) rather than the customer's default user-pool connection. Internal callers also see the shared support-access Okta connection; external callers do not. Only meaningful for Auth0 tenants.

**Responses**:
- `200`: Successful Response

---

## GET /v2/admin/audit-logs — List audit-log entries for the customer

**Endpoint**: `GET /v2/admin/audit-logs`
**Summary**: List audit-log entries for the customer
**Tags**: admin, audit-logs

Paginated audit-log entries for the token's customer. Filter by time range, internal ``user_ids``, ``roles``, HTTP ``methods``, route ``paths``, and free-text ``search`` (matches substrings of ``raw_path`` and ``route_description``). Sort with ``sort_by`` + ``sort_order``. Scoped to the token's customer.

**Parameters**:
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `user_ids` (query, optional): 
- `roles` (query, optional): 
- `methods` (query, optional): 
- `paths` (query, optional): 
- `search` (query, optional): 
- `sort_by` (query, optional): 
- `sort_order` (query, optional): 
- `page` (query, required): 
- `per_page` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
