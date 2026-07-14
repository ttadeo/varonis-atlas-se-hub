# users API Endpoints

## GET /v1/users/me — Get the calling user's profile

**Endpoint**: `GET /v1/users/me`
**Summary**: Get the calling user's profile
**Tags**: users

Return the identity and profile of the user associated with the current JWT token, including their user ID, Auth0 ID, email, and display name. Requires a user-bound token — M2M / service tokens are rejected. Use to resolve who the token belongs to before taking user-scoped actions. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/users/organization/members — List all members of the caller's organization

**Endpoint**: `GET /v1/users/organization/members`
**Summary**: List all members of the caller's organization
**Tags**: users

Return all user accounts that belong to the same customer tenant as the calling token. Each entry includes the user's ID, Auth0 ID, email, and display name. Use to enumerate team members, populate user-picker dropdowns, or audit who has access to the tenant. Scoped to the token's customer; no cross-tenant data is returned.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---
