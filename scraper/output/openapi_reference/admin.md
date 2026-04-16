# Atlas API — admin

## POST /v1/admin/auth0-customer/{customer_id}/users — Create User

**Endpoint**: `POST /v1/admin/auth0-customer/{customer_id}/users`
**Summary**: Create User
**Tags**: admin

Create a new user in Auth0 and add them to the specified organization.

This endpoint creates a new user in Auth0 using the provided user data,
assigns the specified roles (or a default role), and adds the user to the organization.

Args:
    customer_id (uuid.UUID): Auth0 organization.metadata.customer_id.
    user_data (UserCreate): The user data for creating a new user.
    token (str): The Auth0 management API token.
    session (Session): The SQLAlchemy session.

Returns:
    dict: A dictionary containing the created user's information, assigned roles, and organization response.

Raises:
    HTTPException: If there's an error in creating the user, adding roles, or adding the user to the organization.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/auth0-customer/{customer_id}/users — Get Users For Organization

**Endpoint**: `GET /v1/admin/auth0-customer/{customer_id}/users`
**Summary**: Get Users For Organization
**Tags**: admin, all-roles

Retrieve internal (non-guest) users for a specific Organization (Customer) from Auth0.

This endpoint fetches internal users associated with the given organization.
Guest users are excluded. Use GET /{customer_id}/guest-users for guest users.

Args:
    customer_id: The ID of the customer (organization) to get users for.
    token: The Auth0 management API token.
    user_has_internal_role: Whether the requesting user is an AllTrue internal user.
    session: The SQLAlchemy session.

Returns:
    list[dict]: List of internal users.

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

Retrieve guest/external users for a specific Organization (Customer) from Auth0.

This endpoint fetches users with guest roles (e.g., GuestUser) associated with
the given organization. Use GET /{customer_id}/users for internal users.

Args:
    customer_id: The ID of the customer (organization) to get guest users for.
    token: The Auth0 management API token.
    session: The SQLAlchemy session.

Returns:
    list[dict]: List of guest users.

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

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id} — Delete User

**Endpoint**: `DELETE /v1/admin/auth0-customer/{customer_id}/users/{user_id}`
**Summary**: Delete User
**Tags**: admin

Delete a user from Auth0.

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

Get a user's information in Auth0 within a specific organization.

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles/delete — Remove User Roles

**Endpoint**: `POST /v1/admin/auth0-customer/{customer_id}/users/{user_id}/roles/delete`
**Summary**: Remove User Roles
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 
- `user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/gateway-cost/summary — Get Gw Cost Summary

**Endpoint**: `GET /v1/admin/gateway-cost/summary`
**Summary**: Get Gw Cost Summary
**Tags**: admin

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/admin/gateway-cost/configuration — Set Gw Cost Config

**Endpoint**: `PATCH /v1/admin/gateway-cost/configuration`
**Summary**: Set Gw Cost Config
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/gateway-cost/spend-timeseries — Retrieve Gw Spend Timeseries

**Endpoint**: `POST /v1/admin/gateway-cost/spend-timeseries`
**Summary**: Retrieve Gw Spend Timeseries
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/support-access/grants —  List Customer Support Access Grants

**Endpoint**: `GET /v1/admin/support-access/grants`
**Summary**:  List Customer Support Access Grants
**Tags**: admin, support-access, list-grants

List all support access grants for a customer.
Optionally filter by active status using ?active=active or ?active=inactive.

**Parameters**:
- `active` (query, optional): 

**Responses**:
- `200`: Successful Response
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

## GET /v1/admin/audit-logs — List Audit Logs

**Endpoint**: `GET /v1/admin/audit-logs`
**Summary**: List Audit Logs
**Tags**: admin

**Parameters**:
- `offset` (query, optional): 
- `limit` (query, optional): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 
- `user_ids` (query, optional): 
- `roles` (query, optional): 
- `search_str` (query, optional): 
- `methods` (query, optional): 
- `paths` (query, optional): 
- `order_field` (query, optional): 
- `ascending_order` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/audit-logs/paths — List Audit Log Paths

**Endpoint**: `GET /v1/admin/audit-logs/paths`
**Summary**: List Audit Log Paths
**Tags**: admin

**Responses**:
- `200`: Successful Response

---

## GET /v1/admin/customers/{customer_id} —  Get Customer By Id

**Endpoint**: `GET /v1/admin/customers/{customer_id}`
**Summary**:  Get Customer By Id
**Tags**: admin, internal

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/customers/{customer_id} —  Update Customer

**Endpoint**: `PUT /v1/admin/customers/{customer_id}`
**Summary**:  Update Customer
**Tags**: admin, internal

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/organizations —  Add Organization

**Endpoint**: `POST /v1/admin/organizations`
**Summary**:  Add Organization
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/organizations/{organization_id}/white-list —  Get White List

**Endpoint**: `GET /v1/admin/organizations/{organization_id}/white-list`
**Summary**:  Get White List
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/organizations/{organization_id}/white-list/delete —  Delete White List

**Endpoint**: `POST /v1/admin/organizations/{organization_id}/white-list/delete`
**Summary**:  Delete White List
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/vendor —  Add Vendor

**Endpoint**: `POST /v1/admin/vendor`
**Summary**:  Add Vendor
**Tags**: admin, internal

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/projects — Get Projects

**Endpoint**: `GET /v1/admin/customers/{customer_id}/projects`
**Summary**: Get Projects
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 
- `project_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/projects — Create Project

**Endpoint**: `POST /v1/admin/projects`
**Summary**: Create Project
**Tags**: admin

Create a new project for the specified organization.

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/projects/bulk — Create Projects

**Endpoint**: `POST /v1/admin/projects/bulk`
**Summary**: Create Projects
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/projects/{project_id} — Get Project

**Endpoint**: `GET /v1/admin/projects/{project_id}`
**Summary**: Get Project
**Tags**: admin

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/projects/{project_id} — Update Project

**Endpoint**: `PUT /v1/admin/projects/{project_id}`
**Summary**: Update Project
**Tags**: admin

**Parameters**:
- `project_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/projects/{project_id}/set-project-status — Update Project Status

**Endpoint**: `PUT /v1/admin/projects/{project_id}/set-project-status`
**Summary**: Update Project Status
**Tags**: admin

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

## GET /v1/admin/projects/{project_id}/discovered-resources — Get Discovery Assets For Project

**Endpoint**: `GET /v1/admin/projects/{project_id}/discovered-resources`
**Summary**: Get Discovery Assets For Project
**Tags**: admin

**Parameters**:
- `project_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

## GET /v1/admin/customers/{customer_id}/organizations — Get Customer Organizations

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations`
**Summary**: Get Customer Organizations
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 
- `organization_status` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/admin/organizations/{organization_id} — Update Organization

**Endpoint**: `PUT /v1/admin/organizations/{organization_id}`
**Summary**: Update Organization
**Tags**: admin

**Parameters**:
- `organization_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/organizations/{organization_id}/projects —  Get Projects Sorted By Organization

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations/{organization_id}/projects`
**Summary**:  Get Projects Sorted By Organization
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/organizations/projects —  Get All Projects Sorted By Organization

**Endpoint**: `GET /v1/admin/customers/{customer_id}/organizations/projects`
**Summary**:  Get All Projects Sorted By Organization
**Tags**: admin

**Parameters**:
- `customer_id` (path, required): 
- `project_status` (query, optional): 
- `organization_status` (query, optional): 

**Responses**:
- `200`: Successful Response
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

## GET /v1/admin/cloud-accounts —  Get Cloud Provider Accounts 2

**Endpoint**: `GET /v1/admin/cloud-accounts`
**Summary**:  Get Cloud Provider Accounts 2
**Tags**: admin

**Parameters**:
- `cloud_provider` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/cloud-accounts —  Register Cloud Account 2

**Endpoint**: `POST /v1/admin/cloud-accounts`
**Summary**:  Register Cloud Account 2
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/cloud-accounts-details —  Get Cloud Provider Accounts 3

**Endpoint**: `GET /v1/admin/cloud-accounts-details`
**Summary**:  Get Cloud Provider Accounts 3
**Tags**: admin

**Parameters**:
- `cloud_provider` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/cloud-account/resources —  Get Cloud Account Resources

**Endpoint**: `GET /v1/admin/cloud-account/resources`
**Summary**:  Get Cloud Account Resources
**Tags**: admin

**Parameters**:
- `cloud_provider_account_ids` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/cloud-account/scan-info —  Get Unscanned Cloud Accounts

**Endpoint**: `GET /v1/admin/cloud-account/scan-info`
**Summary**:  Get Unscanned Cloud Accounts
**Tags**: admin

**Responses**:
- `200`: Successful Response

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

## POST /v1/admin/register-cloud-accounts/customer/{customer_id} — Register Cloud Account

**Endpoint**: `POST /v1/admin/register-cloud-accounts/customer/{customer_id}`
**Summary**: Register Cloud Account
**Tags**: admin

Register cloud accounts for a customer based on the provided request.
Deprecated: Use /cloud-accounts endpoint instead.

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
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

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/connections — Get Connections

**Endpoint**: `GET /v1/admin/connections`
**Summary**: Get Connections
**Tags**: admin

Retrieves enabled connections for the customer.

**Responses**:
- `200`: Successful Response

---

## POST /v1/admin/invitations — Invite User

**Endpoint**: `POST /v1/admin/invitations`
**Summary**: Invite User
**Tags**: admin

Sends an invitation to the customer using the provided email address.

**Retrieving the Connection ID**

To obtain a valid connection ID, use the Get Connections API.

**Managing Organizations and Projects Access Control**

Upon the user's first login, organization IDs and project IDs will be stored in Auth0 user_metadata.
Since it is not possible to assign organizations and projects before the invitation is accepted, the user initially has no access to any organizations or projects.
The client is responsible for calling the appropriate Assign Organizations/Projects APIs to grant access as needed.

Note: This is a temporary solution, and we may refine it in the future.

**Request Body** (required):
- `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/invitations — List Invitations

**Endpoint**: `GET /v1/admin/invitations`
**Summary**: List Invitations
**Tags**: admin

Lists pending invitations for the customer's Auth0 organization.

Wraps the Auth0 Management API `GET /api/v2/organizations/{id}/invitations` endpoint.

**Parameters**:
- `per_page` (query, optional): 
- `page` (query, optional): 
- `include_totals` (query, optional): 
- `invitation_id` (query, optional): Filter by invitation ID
- `sort` (query, optional): Field to sort by, e.g. 'created_at:1' or 'created_at:-1'

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/invitations/{invitation_id} — Get Invitation

**Endpoint**: `GET /v1/admin/invitations/{invitation_id}`
**Summary**: Get Invitation
**Tags**: admin

Retrieves a pending invitation by ID.

Wraps the Auth0 Management API `GET /api/v2/organizations/{id}/invitations/{invitationId}` endpoint.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/invitations/{invitation_id} — Delete Invitation

**Endpoint**: `DELETE /v1/admin/invitations/{invitation_id}`
**Summary**: Delete Invitation
**Tags**: admin

Deletes a pending invitation by ID.

Wraps the Auth0 Management API `DELETE /api/v2/organizations/{id}/invitations/{invitationId}` endpoint.

**Parameters**:
- `invitation_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/current-user/assign-pending-organizations-and-projects — Assign Pending Organizations And Projects To User

**Endpoint**: `POST /v1/admin/current-user/assign-pending-organizations-and-projects`
**Summary**: Assign Pending Organizations And Projects To User
**Tags**: admin

Assigns pending organizations and projects to the current user.
This endpoint should be called on the user's first login to ensure
that any pending organization and project assignments, usually made
during user invitation, are properly assigned to the user.

**Responses**:
- `201`: Successful Response

---

## GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects — Get Projects For User

**Endpoint**: `GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects`
**Summary**: Get Projects For User
**Tags**: admin

Get all projects assigned to a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects — Assign Projects To User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/projects`
**Summary**: Assign Projects To User
**Tags**: admin

Assign projects to a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/users/{auth0_user_id}/projects — Get Projects For User New

**Endpoint**: `GET /v1/admin/users/{auth0_user_id}/projects`
**Summary**: Get Projects For User New
**Tags**: admin

Get all projects assigned to a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/projects — Assign Projects To User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/projects`
**Summary**: Assign Projects To User New
**Tags**: admin

Assign projects to a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/projects/delete — Remove Projects From User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/projects/delete`
**Summary**: Remove Projects From User New
**Tags**: admin

Remove projects from a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations — Get Organizations For User

**Endpoint**: `GET /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations`
**Summary**: Get Organizations For User
**Tags**: admin

Get all organizations assigned to a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations — Assign Organizations To User

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/organizations`
**Summary**: Assign Organizations To User
**Tags**: admin, internal

Assign organizations to a user in a customer.

**Parameters**:
- `customer_id` (path, required): 
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/users/{auth0_user_id}/organizations — Get Organizations For User New

**Endpoint**: `GET /v1/admin/users/{auth0_user_id}/organizations`
**Summary**: Get Organizations For User New
**Tags**: admin

Get all organizations assigned to a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/organizations — Assign Organizations To User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/organizations`
**Summary**: Assign Organizations To User New
**Tags**: admin, internal

Assign organizations to a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/users/{auth0_user_id}/organizations/delete — Remove Organizations From User New

**Endpoint**: `POST /v1/admin/users/{auth0_user_id}/organizations/delete`
**Summary**: Remove Organizations From User New
**Tags**: admin, internal

Remove organizations from a user in a customer.

**Parameters**:
- `auth0_user_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/reset-assignments — Reset User Assignments

**Endpoint**: `POST /v1/admin/customers/{customer_id}/users/{auth0_user_id}/reset-assignments`
**Summary**: Reset User Assignments
**Tags**: admin

Reset the project and organization assignments for a user to match the database.

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

Reset the project and organization assignments for a user to match the database.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/current-user — Get Current User Info

**Endpoint**: `GET /v1/admin/current-user`
**Summary**: Get Current User Info
**Tags**: admin

Get current user info based on the token payload.
If this is the users first time logging in, ALL user info for this customer will be synced

**Responses**:
- `200`: Successful Response

---

## PATCH /v1/admin/current-user — Update Current User

**Endpoint**: `PATCH /v1/admin/current-user`
**Summary**: Update Current User
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/current-user/permissions — Get Current User Permissions

**Endpoint**: `GET /v1/admin/current-user/permissions`
**Summary**: Get Current User Permissions
**Tags**: admin, no-auth

Get permissions for the current user based on the token payload

**Responses**:
- `200`: Successful Response

---

## GET /v1/admin/customers/{customer_id}/roles — Get Customer Roles

**Endpoint**: `GET /v1/admin/customers/{customer_id}/roles`
**Summary**: Get Customer Roles
**Tags**: admin

Retrieve internal (non-guest) roles from DB for a specific customer, including both default and custom roles.

Args:
    customer_id: The unique identifier of the customer.
    session: The database session.

Returns:
    List[RoleResponse]: Internal roles (default and custom) for the customer,
                                with a boolean flag indicating if the role is custom.

**Parameters**:
- `customer_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/customers/{customer_id}/roles — Create Customer Role

**Endpoint**: `POST /v1/admin/customers/{customer_id}/roles`
**Summary**: Create Customer Role
**Tags**: admin, internal

Create a new Custom role for a specific customer.

Args:
    customer_id (UUID): The unique identifier of the customer.
    role (RoleCreate): The role data to be created.
    session (Session): The database session.
    token (str): The internal token for authorization.

Returns:
    CustomRoleResponse: The newly created custom role.

Response:
    201: Role created successfully

**Parameters**:
- `customer_id` (path, required): 

**Request Body** (required):
- `application/json`

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
Update in DB and Auth0.

Args:
    customer_id (UUID): The unique identifier of the customer.
    role_id (UUID): The unique identifier of the role to be updated.
    role (RoleUpdate): The updated role data.
    session (Session): The database session.

Returns:
    CustomRoleResponse: The updated custom role.

Raises:
    HTTPException: If the role is not found.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/admin/customers/{customer_id}/roles/{role_id} — Delete Customer Role

**Endpoint**: `DELETE /v1/admin/customers/{customer_id}/roles/{role_id}`
**Summary**: Delete Customer Role
**Tags**: admin

Delete a custom role for a specific customer.
Delete from DB and Auth0.

Args:
    customer_id (UUID): The unique identifier of the customer.
    role_id (UUID): The unique identifier of the role to be deleted.
    session (Session): The database session.

Returns:
    dict: A message indicating the role was deleted.

Raises:
    HTTPException: If the role is not found.

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

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/customers/{customer_id}/roles/{role_id}/permissions — Get Role Permissions

**Endpoint**: `GET /v1/admin/customers/{customer_id}/roles/{role_id}/permissions`
**Summary**: Get Role Permissions
**Tags**: admin

Retrieve all permissions assigned to a specific role for a customer.
This function handles both predefined roles and custom roles.

Args:
    customer_id (UUID): The unique identifier of the customer.
    role_id (UUID): The unique identifier of the role.
    session (Session): The database session.

Returns:
    List[PermissionResponse]: A list of permissions assigned to the role.

Raises:
    HTTPException: If the role is not found.

**Parameters**:
- `customer_id` (path, required): 
- `role_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/admin/entitlements — Get Customer Entitlements

**Endpoint**: `GET /v1/admin/entitlements`
**Summary**: Get Customer Entitlements
**Tags**: admin, internal

Get the list of entitlement tiers for a customer.

**Responses**:
- `200`: Successful Response

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

**Request Body** (required):
- `application/json`

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/invitations — Bulk Invite Users

**Endpoint**: `POST /v1/admin/bulk/invitations`
**Summary**: Bulk Invite Users
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/delete-users — Bulk Delete Users

**Endpoint**: `POST /v1/admin/bulk/delete-users`
**Summary**: Bulk Delete Users
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-roles — Bulk Assign Roles

**Endpoint**: `POST /v1/admin/bulk/assign-roles`
**Summary**: Bulk Assign Roles
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-projects — Bulk Assign Projects

**Endpoint**: `POST /v1/admin/bulk/assign-projects`
**Summary**: Bulk Assign Projects
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/admin/bulk/assign-organizations — Bulk Assign Organizations

**Endpoint**: `POST /v1/admin/bulk/assign-organizations`
**Summary**: Bulk Assign Organizations
**Tags**: admin

**Request Body** (required):
- `application/json`

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## GET /v1/notification-settings/customer —  Get Customer Notification Settings

**Endpoint**: `GET /v1/notification-settings/customer`
**Summary**:  Get Customer Notification Settings
**Tags**: admin

Get the notification settings on a customer level for the tokens customer.

**Responses**:
- `200`: Successful Response

---

## PUT /v1/notification-settings/customer —  Update Customer Notification Settings

**Endpoint**: `PUT /v1/notification-settings/customer`
**Summary**:  Update Customer Notification Settings
**Tags**: admin

Update the notification settings on a customer level for the tokens customer.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/notification-settings/customer —  Delete Customer Notification Settings

**Endpoint**: `DELETE /v1/notification-settings/customer`
**Summary**:  Delete Customer Notification Settings
**Tags**: admin

Delete the notification settings on a customer level for the tokens customer.

**Responses**:
- `200`: Successful Response

---

## GET /v1/notification-settings/user —  Get User Notification Settings

**Endpoint**: `GET /v1/notification-settings/user`
**Summary**:  Get User Notification Settings
**Tags**: admin

Get the notification settings on a customer level for the tokens user.

**Responses**:
- `200`: Successful Response

---

## PUT /v1/notification-settings/user —  Update User Notification Settings

**Endpoint**: `PUT /v1/notification-settings/user`
**Summary**:  Update User Notification Settings
**Tags**: admin

Update the notification settings on a customer level for the tokens user.

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/notification-settings/user —  Delete User Notification Settings

**Endpoint**: `DELETE /v1/notification-settings/user`
**Summary**:  Delete User Notification Settings
**Tags**: admin

Delete the notification settings (restoring the default) for the tokens user.

**Responses**:
- `200`: Successful Response

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

**Request Body** (required):
- `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
