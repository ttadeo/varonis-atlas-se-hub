# auth API Endpoints

## POST /v1/auth/bootstrap — Post-Login Bootstrap

**Endpoint**: `POST /v1/auth/bootstrap`
**Summary**: Post-Login Bootstrap
**Tags**: auth, no-auth

Composite post-login payload. Atlas JWT → fast path; IdP bearer
(Auth0 ID/legacy or Varonis ID) → full bootstrap pipeline (self-heal,
reactivation). Dispatched off ``VerifiedToken.bearer_origin``.

**Responses**:
- `200`: Successful Response

---

## POST /v1/auth/exchange — Exchange an IdP ID token for Atlas tokens

**Endpoint**: `POST /v1/auth/exchange`
**Summary**: Exchange an IdP ID token for Atlas tokens
**Tags**: auth, no-auth

Exchange a freshly-minted IdP ID token for Atlas access + refresh
tokens. The IdP is selected by ``body.provider``; tenant is derived
exclusively from that provider's attested org/tenant claim (e.g. Auth0's
``org_id``), never from the request body.

Internally just runs the bootstrap pipeline on ``body.id_token`` and
mints Atlas tokens off the result — exchange is bootstrap + token
minting, same provisioning seam as ``/v1/auth/bootstrap``.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/refresh — Refresh Atlas tokens

**Endpoint**: `POST /v1/auth/refresh`
**Summary**: Refresh Atlas tokens
**Tags**: auth, no-auth

Rotate a refresh token for a new Atlas access + refresh token pair.

Tagged ``no-auth`` because the caller's Atlas access token may already
be expired by the time they hit this endpoint — the refresh token is
the only credential required. Identity is derived exclusively from the
persisted refresh-token row; the request body carries no tenant hint.

TODO(WB-4ti0 frontend cutover): move ``refresh_token`` from the body to
a HttpOnly + Secure ``Set-Cookie``, matching the planned change on
``/v1/auth/exchange``. Service is unchanged; only request/response
transport.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/logout — Revoke all refresh tokens for the current user

**Endpoint**: `POST /v1/auth/logout`
**Summary**: Revoke all refresh tokens for the current user
**Tags**: auth, no-auth

Revoke every live refresh token for the JWT-identified user.

Tagged ``no-auth`` to bypass RBAC (logout should always succeed for an
authenticated user regardless of permissions), but a valid Atlas JWT is
still required: the JWT is the only trustworthy source of the
``(user_id, customer_id)`` to revoke. Idempotent — a caller with no
live tokens still gets 204.

Disabled users may still log out: revoking their refresh tokens is the
correct outcome and does not depend on ``user.disabled``.

The optional ``token_user_id_optional`` dep is used (rather than the
strict variant) so "no JWT" surfaces as 401 here, matching RFC 7235;
the strict dep returns 403 for that case. Tracked at
``app/utils/authorization/access_token.py:29``.

**Responses**:
- `204`: Successful Response

---

## GET /v1/auth/jwks — JWKS for Atlas-minted JWTs

**Endpoint**: `GET /v1/auth/jwks`
**Summary**: JWKS for Atlas-minted JWTs
**Tags**: auth, no-auth

Return the public JWK set clients use to verify Atlas-minted JWTs.

Standard RFC 7517 JWKS document. Consumers (e.g. the MCP gateway, the
UI, third-party integrations) fetch this to verify signatures on tokens
minted by ``/v1/auth/exchange`` and ``/v1/auth/refresh``. Keys are
derived from the same private JWK used to sign those tokens; only the
public parameters (``kty``, ``kid``, ``alg``, ``use``, ``n``, ``e``)
are exposed.

**Responses**:
- `200`: Successful Response

---

## GET /v1/auth/validate — Validate Session

**Endpoint**: `GET /v1/auth/validate`
**Summary**: Validate Session
**Tags**: auth, no-auth

Lightweight session heartbeat.

Returns 200 if the user is active, 403 if disabled, 401 if the row is
missing (deleted user with a still-valid JWT). Frontend can poll this to
detect session invalidation.

See ``logout`` for why the optional ``token_user_id_optional`` dep is
used here instead of the strict variant.

**Responses**:
- `200`: Successful Response

---

## GET /v1/auth/customers/{customer_id}/api-keys —  List Api Keys

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

## POST /v1/auth/customers/{customer_id}/api-keys — Create an API key

**Endpoint**: `POST /v1/auth/customers/{customer_id}/api-keys`
**Summary**: Create an API key
**Tags**: auth

Creates an API key for the customer tenant. Pass `user_id` to bind the key to a specific user (personal-access-token semantics): the JWT minted via `/v1/auth/issue-jwt-token` will then carry that user's identity and scope enforcement applies as for a regular login. User binding is only allowed for `api_key_type=CUSTOM`.

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/auth/customers/{customer_id}/api-keys/{api_key_id} —  Get Api Key

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

## PUT /v1/auth/customers/{customer_id}/api-keys/{api_key_id} —  Update Api Key

**Endpoint**: `PUT /v1/auth/customers/{customer_id}/api-keys/{api_key_id}`
**Summary**:  Update Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id} —  Delete Api Key

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

## GET /v1/auth/api-keys/{api_key_id}/white-list —  List Cidrs

**Endpoint**: `GET /v1/auth/api-keys/{api_key_id}/white-list`
**Summary**:  List Cidrs
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/api-keys/{api_key_id}/white-list/delete —  Delete Cidr

**Endpoint**: `POST /v1/auth/api-keys/{api_key_id}/white-list/delete`
**Summary**:  Delete Cidr
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/api-keys/{api_key_id}/white-list/add —  Add Cidr To Api Key

**Endpoint**: `POST /v1/auth/api-keys/{api_key_id}/white-list/add`
**Summary**:  Add Cidr To Api Key
**Tags**: auth

**Parameters**:
- `api_key_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles —  Assign Roles To Api Key

**Endpoint**: `POST /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles`
**Summary**:  Assign Roles To Api Key
**Tags**: auth

**Parameters**:
- `customer_id` (path, required): 
- `api_key_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/auth/customers/{customer_id}/api-keys/{api_key_id}/roles/{role_id} —  Unassign Role From Api Key

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

## GET /v1/auth/api-keys/types —  Get Api Key Types

**Endpoint**: `GET /v1/auth/api-keys/types`
**Summary**:  Get Api Key Types
**Tags**: auth

**Responses**:
- `200`: Successful Response

---

## GET /v1/auth/users/{auth0_user_id}/api-keys — List a user's API keys

**Endpoint**: `GET /v1/auth/users/{auth0_user_id}/api-keys`
**Summary**: List a user's API keys
**Tags**: auth

Returns every API key in the caller's tenant that is bound to the given Auth0 user. Service keys (no user binding) are not included. Used to render a user's personal-access-token list. Returns 404 if the user does not exist in the tenant.

**Parameters**:
- `auth0_user_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/auth/api-keys/default-firewall —  Get Default Firewall Api Key

**Endpoint**: `GET /v1/auth/api-keys/default-firewall`
**Summary**:  Get Default Firewall Api Key
**Tags**: auth

**Responses**:
- `200`: Successful Response

---
