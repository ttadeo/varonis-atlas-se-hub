# continuous-compliance API Endpoints

## POST /v1/control-plane/continuous-compliance/activations — Activate a compliance framework for the customer

**Endpoint**: `POST /v1/control-plane/continuous-compliance/activations`
**Summary**: Activate a compliance framework for the customer
**Tags**: continuous-compliance

Create an activation policy that opts the customer into continuous compliance monitoring for a specific regulatory framework. The activation can be scoped to the entire customer, a specific organization, or a specific project within an organization. The activating user is derived from the JWT token. Scoped to the token's customer. Use when onboarding a framework or enabling compliance monitoring for a new scope.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/activations — List framework activation policies for the customer

**Endpoint**: `GET /v1/control-plane/continuous-compliance/activations`
**Summary**: List framework activation policies for the customer
**Tags**: continuous-compliance

Return a paginated list of activation policies for the customer. Filter by framework_id, activation_level (customer/organization/project), organization_id, project_id, or status (active/inactive). Supports page and per_page parameters (default 50, max 200). Scoped to the token's customer. Use to inspect which compliance frameworks are currently active and at what scope. The response also carries compass_recommendations: new-Compass framework suggestions for this scope (customer-wide, plus the given project_id or organization_id) that have no active policy covering them — informational only, nothing is auto-activated.

**Parameters**:
- `framework_id` (query, optional): 
- `activation_level` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `status` (query, optional): 
- `page` (query, optional): 
- `per_page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/continuous-compliance/activations/{activation_policy_id}/deactivate — Deactivate a specific framework activation policy

**Endpoint**: `PUT /v1/control-plane/continuous-compliance/activations/{activation_policy_id}/deactivate`
**Summary**: Deactivate a specific framework activation policy
**Tags**: continuous-compliance

Mark a single activation policy as deactivated, stopping continuous compliance monitoring for the framework scope it covers. The policy record is retained for audit history; only its status transitions to inactive. Scoped to the token's customer. Use when disabling a framework for a particular organization or project scope without affecting other active policies.

**Parameters**:
- `activation_policy_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Activation policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/continuous-compliance/activations/deactivate-all — Deactivate all activation policies for a framework

**Endpoint**: `PUT /v1/control-plane/continuous-compliance/activations/deactivate-all`
**Summary**: Deactivate all activation policies for a framework
**Tags**: continuous-compliance

Bulk-deactivate every active activation policy for the specified framework across all scopes (customer, organization, and project level) in one operation. Use when fully offboarding a compliance framework from the tenant. This affects all levels of activation for the framework simultaneously. Scoped to the token's customer. Prefer the single-policy deactivate endpoint when only one scope needs to be disabled.

**Parameters**:
- `framework_id` (query, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/activations/{activation_policy_id} — Get a framework activation policy by ID

**Endpoint**: `GET /v1/control-plane/continuous-compliance/activations/{activation_policy_id}`
**Summary**: Get a framework activation policy by ID
**Tags**: continuous-compliance

Retrieve the full detail of a single activation policy by its ID, including the framework, activation level, scope (organization/project), status, activating user, and timestamps. Scoped to the token's customer. Use to inspect the current state of a specific activation before making changes.

**Parameters**:
- `activation_policy_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Activation policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/compass/run — Get the saved new-Compass run for a scope

**Endpoint**: `GET /v1/control-plane/continuous-compliance/compass/run`
**Summary**: Get the saved new-Compass run for a scope
**Tags**: continuous-compliance

Return the saved new-Compass run for the current scope — a specific project when project_id is given, a specific organization when organization_id is given, else customer-wide. The response carries the answered tags and the level-filtered suggested framework ids, and has_run=false when no run has been saved yet. Drives the Compass landing dashboard. Scoped to the token's customer.

**Parameters**:
- `project_id` (query, optional): 
- `organization_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/compass/questionnaire — Fetch the next new-Compass questions for a level

**Endpoint**: `POST /v1/control-plane/continuous-compliance/compass/questionnaire`
**Summary**: Fetch the next new-Compass questions for a level
**Tags**: continuous-compliance

Drive the new-Compass questionnaire one step at a time for a given activation level (CUSTOMER, ORGANIZATION, or PROJECT). Each call returns the next set of questions and the accumulated tags implied by the answers provided so far. Stateless — nothing is persisted; use /compass/save to store a completed run. Each level serves a distinct question set; the ORGANIZATION set is not published by the compliance service yet, so an ORGANIZATION fetch currently fails upstream.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/compass/save — Save a new-Compass run and derive suggested frameworks

**Endpoint**: `POST /v1/control-plane/continuous-compliance/compass/save`
**Summary**: Save a new-Compass run and derive suggested frameworks
**Tags**: continuous-compliance

Persist a completed new-Compass run at customer, organization, or project level, then return the frameworks it suggests — filtered to those whose minimum activation level matches the run's level — each labelled REQUIRED or SUGGESTED. Provide project_id only for a project-level run, organization_id only for an organization-level run. Scoped to the token's customer. This is warn-only: it never activates a framework in Continuous Compliance; see GET /activations compass_recommendations.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/scoping/answer — Answer a scoping question for an entity state

**Endpoint**: `POST /v1/control-plane/continuous-compliance/scoping/answer`
**Summary**: Answer a scoping question for an entity state
**Tags**: continuous-compliance

Record the user's response to a single scoping question for the given entity state. Persists the answer immediately, rebuilds the conditional question chain (new follow-up questions may appear or disappear), and returns the full updated questionnaire so the UI can re-render in one round-trip. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or scoping profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/scoping/compute-risk-levels — Preview aggregated risk levels without persisting

**Endpoint**: `POST /v1/control-plane/continuous-compliance/scoping/compute-risk-levels`
**Summary**: Preview aggregated risk levels without persisting
**Tags**: continuous-compliance

Compute aggregated risk levels from the current scoping answers for the given entity state. This is a preview-only operation — nothing is written to the database. Use this after all questions have been answered to show the user a risk-level summary before they confirm via the accept endpoint. Returns 409 if the entity state is not in a valid state to compute. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or framework not found
- `409`: Entity is not in a valid state for this operation
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/scoping/accept-risk-levels — Accept risk levels and complete the scoping questionnaire

**Endpoint**: `POST /v1/control-plane/continuous-compliance/scoping/accept-risk-levels`
**Summary**: Accept risk levels and complete the scoping questionnaire
**Tags**: continuous-compliance

Persist the user-accepted risk levels for the given entity state and transition scoping status to COMPLETED. This is the only endpoint that writes risk levels to the database. Upon completion, compliance controls are created for each affected entity; the response reports how many controls were created and across which entities so the UI can badge affected entity-group headers. Returns 409 if scoping is not in a valid state to accept. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `409`: Scoping is not in a valid state to accept
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/scoping/reconfirm — Re-confirm a needs-review scoping answer

**Endpoint**: `POST /v1/control-plane/continuous-compliance/scoping/reconfirm`
**Summary**: Re-confirm a needs-review scoping answer
**Tags**: continuous-compliance

Mark a previously-flagged needs-review answer as still valid without changing the answer itself. Use this when a compliance workflow prompts the user to review a stale answer (e.g., after a framework update) and the user confirms the original response is still accurate. Returns the updated questionnaire. Returns 400 if the question has no prior response to reconfirm. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or scoping profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/scoping/reset — Reset scoping for an entity state to NOT_STARTED

**Endpoint**: `POST /v1/control-plane/continuous-compliance/scoping/reset`
**Summary**: Reset scoping for an entity state to NOT_STARTED
**Tags**: continuous-compliance

Destructively clear all scoping answers, computed risk levels, and associated tags for the given entity state, returning it to NOT_STARTED status. Use only when a compliance owner needs to restart the scoping workflow from scratch (e.g., after a major framework version change). This action cannot be undone — all prior questionnaire responses are permanently deleted. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/scoping/{entity_state_id} — Get the scoping questionnaire for an entity state

**Endpoint**: `GET /v1/control-plane/continuous-compliance/scoping/{entity_state_id}`
**Summary**: Get the scoping questionnaire for an entity state
**Tags**: continuous-compliance

Return the scoping questionnaire for the given entity state, including all previously answered questions and the next pending questions determined by the conditional question chain. Read-only — does not mutate scoping status. Use to render the questionnaire UI or inspect current scoping progress without side effects. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/scoping/{entity_state_id}/accepted-risk-levels — Get the accepted risk-level summary for a completed entity

**Endpoint**: `GET /v1/control-plane/continuous-compliance/scoping/{entity_state_id}/accepted-risk-levels`
**Summary**: Get the accepted risk-level summary for a completed entity
**Tags**: continuous-compliance

Return the risk-level summary the user accepted at the end of the scoping workflow. Reads the persisted accepted risk levels rather than recomputing from current answers — use this to render the post-accept summary view without driving the user back through the compute step. Returns 409 if scoping status is not COMPLETED. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or framework not found
- `409`: Entity is not in a valid state for this operation
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id} — List compliance requirement profiles for an entity state

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id}`
**Summary**: List compliance requirement profiles for an entity state
**Tags**: continuous-compliance

Return all compliance requirement profiles for the given entity state, enriched with catalog metadata (question text, display name, category, risk tags). Only available after scoping is COMPLETED and the entity has been enrolled. The response includes completion counters (total applicable and total completed) alongside each requirement's status and current response. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `409`: Entity is not enrolled
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/entities/{entity_state_id}/scoping-outcomes — List scoping outcomes for an activation level in the entity's coverage chain

**Endpoint**: `GET /v1/control-plane/continuous-compliance/entities/{entity_state_id}/scoping-outcomes`
**Summary**: List scoping outcomes for an activation level in the entity's coverage chain
**Tags**: continuous-compliance

Aggregates ``risk_levels`` across COMPLETED entity_states at the requested ``activation_level`` reachable from the viewing entity (self / parents / descendants), grouped by risk-level category. Powers the cross-level scope-outcomes drawer on the Manage Compliance page; returns an empty list when no entity at the requested level has completed scoping in this chain. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 
- `activation_level` (query, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or framework not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/review-cycles/profiles — List requirement profile summaries for the customer

**Endpoint**: `GET /v1/control-plane/continuous-compliance/review-cycles/profiles`
**Summary**: List requirement profile summaries for the customer
**Tags**: continuous-compliance

Return all requirement profile summaries for the token's customer. Each profile represents a control or compliance requirement mapped to an entity. Optionally filter by activation_policy_id to narrow results to a specific policy's requirements. Use this to enumerate which requirements exist before fetching per-requirement detail, history, or scores. Scoped to the token's customer.

**Parameters**:
- `activation_policy_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/requirements/{profile_id}/respond — Submit a response (text + attachments) to a requirement

**Endpoint**: `POST /v1/control-plane/continuous-compliance/requirements/{profile_id}/respond`
**Summary**: Submit a response (text + attachments) to a requirement
**Tags**: continuous-compliance

Submit a user response to the current open review cycle.

multipart/form-data: ``response_text`` is a form field;
``suggested_response_id`` optionally links the response to a generated
suggestion; ``files`` is zero-or-more uploaded files. Each file is
uploaded to S3 (the requirement-assessment attachment bucket) under a
path scoped to ``continuous-compliance/{customer_id}/{profile_id}/`` and
recorded as a ``ComplianceRequirementResponseAttachment`` row pointing
back at it.

``responded_by`` (and the same value used for attachment ``uploaded_by``)
is derived **server-side** from the JWT email; not accepted as form
input. Accepting it from the client would let any caller forge another
user's name in the audit trail — for a compliance-evidence endpoint
this would mean spoofed regulatory attestations, so identity must come
from the token.

**Parameters**:
- `profile_id` (path, required): 

**Request Body**: Optional
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/continuous-compliance/requirements/{profile_id}/status — Set requirement status for a compliance profile

**Endpoint**: `PUT /v1/control-plane/continuous-compliance/requirements/{profile_id}/status`
**Summary**: Set requirement status for a compliance profile
**Tags**: continuous-compliance

Update the status of a requirement profile (e.g. mark it NOT_APPLICABLE). NOT_APPLICABLE is sticky across catalog re-syncs and periodic resets — if the requirement later comes back in scope it reopens with needs_review=True so the reviewer re-confirms applicability. Use when a control genuinely does not apply to the entity in question. Requires an open review cycle; returns 409 if none is active. Scoped to the token's customer.

**Parameters**:
- `profile_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Requirement profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/history — Get review-cycle history for a requirement profile

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/history`
**Summary**: Get review-cycle history for a requirement profile
**Tags**: continuous-compliance

Return all past and current review cycles for a requirement profile, ordered chronologically. Each cycle includes the submitted response, attachments, accepted suggestion, and cycle dates. Use to audit the compliance evidence trail or to display historical answers for a control. Returns 404 if the profile does not exist. Scoped to the token's customer.

**Parameters**:
- `profile_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Requirement profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/requirements/reset — Bulk-reset review cycles by policy or entity state

**Endpoint**: `POST /v1/control-plane/continuous-compliance/requirements/reset`
**Summary**: Bulk-reset review cycles by policy or entity state
**Tags**: continuous-compliance

Close all open review cycles and open fresh ones for requirements matching the specified scope — either an activation_policy_id (all requirements under a policy) or an entity_state_id (all requirements for a single entity). Exactly one scope must be provided; supplying both or neither returns 400. Use this to restart the evidence collection process after a major control framework update or entity re-scoping. Returns counts of cycles reset. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id}/by-category — List requirements grouped by category for an entity state

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id}/by-category`
**Summary**: List requirements grouped by category for an entity state
**Tags**: continuous-compliance

Return all compliance requirements for an entity state, grouped by their control category. Use this to render a category-organised view of outstanding and completed requirements for a specific entity. Each category includes its requirements with current status and review-cycle state. Returns 404 if the entity state does not exist. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id}/score — Get the compliance score for an entity state

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{entity_state_id}/score`
**Summary**: Get the compliance score for an entity state
**Tags**: continuous-compliance

Compute and return the compliance score for a single entity state, reflecting the proportion of requirements that have been satisfied in the current review cycle. Use this to surface a per-entity compliance percentage in dashboards or reports. Returns 404 if the entity state does not exist. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/requirements/scores — Compute compliance scores for many entity states at once

**Endpoint**: `POST /v1/control-plane/continuous-compliance/requirements/scores`
**Summary**: Compute compliance scores for many entity states at once
**Tags**: continuous-compliance

Accept a list of entity state IDs and return a compliance score for each in a single round-trip, replacing the inefficient per-entity score fan-out. Use this when rendering a list view that needs scores for multiple entities simultaneously. Entity IDs not found for the customer are silently omitted from the response. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/sources — List source entity states contributing to a requirement profile

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/sources`
**Summary**: List source entity states contributing to a requirement profile
**Tags**: continuous-compliance

Return the entity states that are the underlying sources for a given requirement profile. Useful when a requirement profile aggregates evidence from multiple entities, and the caller needs to understand which entities feed the profile's compliance state. Returns 404 if the profile does not exist. Scoped to the token's customer.

**Parameters**:
- `profile_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Requirement profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/etl/sync-entities — Trigger a compliance-entity ETL sync for the customer

**Endpoint**: `POST /v1/control-plane/continuous-compliance/etl/sync-entities`
**Summary**: Trigger a compliance-entity ETL sync for the customer
**Tags**: continuous-compliance

Synchronously run the compliance-entity discovery job for the token's customer, reconciling the customer's AI entity inventory with the continuous-compliance framework. Use this to force an immediate re-sync instead of waiting for the scheduled ETL run — for example after onboarding new entities or updating scoping. The customer_id in the request body, if provided, must match the token's customer. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/requirements/{requirement_profile_id}/additional-document-links — Link an Additional-Document hub document to a requirement

**Endpoint**: `POST /v1/control-plane/continuous-compliance/requirements/{requirement_profile_id}/additional-document-links`
**Summary**: Link an Additional-Document hub document to a requirement
**Tags**: continuous-compliance

Associate a hub document (Additional Documents type) with a requirement profile, so the document's content is considered as evidence for that requirement. The document must be of the Additional Documents policy type and the requirement's entity must already appear in the document's selected entities. If the document has already been analysed, a single-requirement analysis runs immediately and produces a suggestion; otherwise the running analyser picks up the new link. Returns 404 if either the requirement profile or hub document is not found. Scoped to the token's customer.

**Parameters**:
- `requirement_profile_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Requirement profile or hub document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/continuous-compliance/requirements/{requirement_profile_id}/additional-document-links/{hub_document_id} — Unlink an Additional-Document hub document from a requirement

**Endpoint**: `DELETE /v1/control-plane/continuous-compliance/requirements/{requirement_profile_id}/additional-document-links/{hub_document_id}`
**Summary**: Unlink an Additional-Document hub document from a requirement
**Tags**: continuous-compliance

Remove the association between a hub document and a requirement profile. Sweeps the suggestion that was sourced from this document. If the requirement's currently accepted answer originated from this document, the requirement is automatically flipped to Needs Review with a system-authored audit entry so the reviewer must re-confirm compliance evidence. Returns 404 if the link, requirement profile, or hub document is not found. Scoped to the token's customer.

**Parameters**:
- `requirement_profile_id` (path, required): 
- `hub_document_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Link, requirement profile, or hub document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/suggested-responses — List pending suggested responses for a requirement profile

**Endpoint**: `GET /v1/control-plane/continuous-compliance/requirements/{profile_id}/suggested-responses`
**Summary**: List pending suggested responses for a requirement profile
**Tags**: continuous-compliance

Returns the pending suggestion queue for a requirement profile, ordered by `response_order`. Each item carries an `accepted_in_current_cycle` flag: when `True`, the current open review cycle already has a response derived from that suggestion (bucket under 'previously accepted' in the UI); when `False`, the suggestion is genuinely pending and awaiting user action. Use this endpoint to render the suggestion queue during a compliance review cycle. Scoped to the token's customer.

**Parameters**:
- `profile_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Requirement profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/suggested-responses/{suggested_response_id}/dismiss — Dismiss a suggested response from the review queue

**Endpoint**: `POST /v1/control-plane/continuous-compliance/suggested-responses/{suggested_response_id}/dismiss`
**Summary**: Dismiss a suggested response from the review queue
**Tags**: continuous-compliance

Permanently marks a PENDING suggestion as DISMISSED so it stops appearing in the review queue. Dismissal cannot be undone — if the upstream analyzer later re-derives evidence for the same requirement, a new suggestion row with a new ID is created. Returns 409 when the suggestion is already DISMISSED or STALE (i.e. the underlying data changed since the suggestion was generated); callers should refresh the queue on 409 rather than retrying. Scoped to the token's customer.

**Parameters**:
- `suggested_response_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Suggested response not found
- `409`: Suggestion already dismissed or stale
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/profiles — List policy profiles grouped by entity type

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/profiles`
**Summary**: List policy profiles grouped by entity type
**Tags**: continuous-compliance

Return all compliance policy profiles for the calling customer, grouped by entity type (e.g. ORGANIZATION, PROJECT, RESOURCE, VENDOR). Empty groups are omitted; results are not paginated — the full subtree is returned. Supports optional filters: entity_state_id, framework_id, activation_policy_id, organization_id or project_id (each rolls up the entities beneath), status (repeatable), and a substring search on policy name. Use sort_by and sort_order to control ordering within each group. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (query, optional): 
- `framework_id` (query, optional): 
- `activation_policy_id` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `status` (query, optional): Filter to profiles in any of these statuses. Repeat the param for multiple values; omit for all statuses.
- `search` (query, optional): Case-insensitive substring match against policy_name (from compliance_policy_catalog).
- `sort_by` (query, optional): Sort field applied within each entity_type group. ENTITY_NAME sorts by entity_state.display_name; ORDER uses catalog.order.
- `sort_order` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/missing-count — Count required policies not yet uploaded

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/missing-count`
**Summary**: Count required policies not yet uploaded
**Tags**: continuous-compliance

Return the total number of required compliance policy types the customer has not yet uploaded a document for. Used to drive the Missing-tab badge count in the policy hub. Optionally scoped to an organization or project umbrella — each rolls up its sub-entities (projects, resources, vendors). Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/counts — Per-status policy-type counts for hub tab badges

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/counts`
**Summary**: Per-status policy-type counts for hub tab badges
**Tags**: continuous-compliance

Return the count of distinct policy types in each status (Active = UPLOADED or APPROVED; Missing = NOT_UPLOADED; Archived = NOT_APPLICABLE). All statuses are always present with 0 as the default. Use these numbers to drive tab badges on the policies hub. Optionally scoped to an organization or project umbrella. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/documents — List uploaded policy documents (Active tab, paginated)

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/documents`
**Summary**: List uploaded policy documents (Active tab, paginated)
**Tags**: continuous-compliance

Return a paginated list of uploaded compliance policy documents shown in the Active tab of the knowledge hub. Each row represents one document with its frameworks and selected entities aggregated across the document's policy profiles. Supports search (substring of document title/policy name), organization_id or project_id umbrella scoping (shows only in-scope entities), and entity_state_id filtering. Additional attribute filters narrow the list server-side: policy_type, framework_id, source, entity_type, assignee_email, an updated_after/updated_before range, and reassessment_status. Paginated via page and per_page (max 100). Scoped to the token's customer.

**Parameters**:
- `search` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `entity_state_id` (query, optional): 
- `policy_type` (query, optional): Exact match on the document's policy_type family label.
- `framework_id` (query, optional): Only documents with a FRAMEWORK target in any of these framework ids. Repeat the param for multiple values.
- `source` (query, optional): Filter by creation source. Repeat the param for multiple values.
- `entity_type` (query, optional): Only documents with at least one target of this entity kind.
- `assignee_email` (query, optional): Case-insensitive substring match against the policy type's assignee email.
- `updated_after` (query, optional): Only documents whose last update (falling back to upload time) is at or after this instant.
- `updated_before` (query, optional): Only documents whose last update (falling back to upload time) is at or before this instant.
- `reassessment_status` (query, optional): Derived reassessment bucket, computed from the policy type's metadata due date. Repeat the param for multiple values.
- `page` (query, optional): Page number (1-indexed).
- `per_page` (query, optional): Items per page (max 100).

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies/documents — Upload a compliance policy document for a policy type

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies/documents`
**Summary**: Upload a compliance policy document for a policy type
**Tags**: continuous-compliance

Upload a file to the Knowledge Hub for a given policy type, covering the selected entities (organizations, projects, resources, or vendors). The document fans out across all catalog policy entries of that type for the selected entities. For the Additional-Document sentinel type, requirement_profile_ids is required and framework_ids must be omitted; for all other policy types, requirement_profile_ids is rejected (422). Triggers an asynchronous document-analysis job. uploaded_by is derived server-side from the JWT. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/missing — List required policies with no uploaded document (paginated)

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/missing`
**Summary**: List required policies with no uploaded document (paginated)
**Tags**: continuous-compliance

Return a paginated list of required compliance policy types that have at least one NOT_UPLOADED profile — i.e. entities that still need a document uploaded. Each row aggregates the relevant frameworks, scope level, and which entities are missing the policy (with a count). Supports search on policy name and optional organization_id or project_id umbrella scoping. Paginated via page and per_page (max 100). Use this to identify compliance gaps for the customer. Scoped to the token's customer.

**Parameters**:
- `search` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `page` (query, optional): Page number (1-indexed).
- `per_page` (query, optional): Items per page (max 100).

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/active — List active compliance policies (paginated)

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/active`
**Summary**: List active compliance policies (paginated)
**Tags**: continuous-compliance

Return a paginated list of compliance policy types that have at least one UPLOADED or APPROVED document. Each row aggregates the relevant frameworks, scope level, covered entities (with a count), and the latest document's metadata (id, source, version). Supports search on policy name and optional organization_id or project_id umbrella scoping. Paginated via page and per_page (max 100). Use to see which policies are currently satisfied for the customer. Scoped to the token's customer.

**Parameters**:
- `search` (query, optional): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `page` (query, optional): Page number (1-indexed).
- `per_page` (query, optional): Items per page (max 100).

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/catalog — List policy types available for document upload

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/catalog`
**Summary**: List policy types available for document upload
**Tags**: continuous-compliance

Return every compliance policy type with its associated frameworks and applicable entity types. Use this to populate the upload-dialog picker so an agent or user can select a valid policy type before calling uploadPolicyDocument. Optionally filter to a single framework_id. This is reference data shared across all customers; customer-specific scope options are returned by getPolicyScopeOptions. Scoped to the token's customer.

**Parameters**:
- `framework_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/central-types — List framework-agnostic central policy types

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/central-types`
**Summary**: List framework-agnostic central policy types
**Tags**: continuous-compliance

Return every framework-agnostic (central) compliance policy type with the entity level it applies at, its description, and the frameworks that require it. Results are ordered by the catalog source order. Use this to populate the Central Policy Types reference view, or to discover which policies apply independently of any framework. Scoped to the token's customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## GET /v1/control-plane/continuous-compliance/policies/{policy_id}/scope-options — List entities a policy document can be scoped to

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/{policy_id}/scope-options`
**Summary**: List entities a policy document can be scoped to
**Tags**: continuous-compliance

Return the scope level and the in-scope entities available for a given policy type when uploading a document. CUSTOMER-level policy types return no entity options (documents cover the whole tenant). Use this to populate the entity picker in the upload dialog before calling uploadPolicyDocument. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/types/{policy_type}/scope-entities — List entities a policy type can be scoped to by type slug

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/types/{policy_type}/scope-entities`
**Summary**: List entities a policy type can be scoped to by type slug
**Tags**: continuous-compliance

Upload-dialog entity picker resolved by policy type slug rather than policy id. Returns the scope granularity level (CUSTOMER / ORGANIZATION / PROJECT / RESOURCE / VENDOR) and all platform entities of that level for the caller's customer — not gated by activation (applicability is joined later). CUSTOMER types return no options (whole-customer upload). Optionally filtered to an organization_id or project_id umbrella. 404s when the policy type slug has no catalog entry. Scoped to the token's customer.

**Parameters**:
- `policy_type` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/documents/{document_id} — Get full detail for a single policy document

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/documents/{document_id}`
**Summary**: Get full detail for a single policy document
**Tags**: continuous-compliance

Return the full detail view for a Knowledge-Hub policy document: metadata, owner, due date, a presigned preview URL for the file, the frameworks it satisfies (with descriptions), and the selected entities as both a flat list and an organization-to-projects tree. Use to populate the document drawer. 404s if the document does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `document_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/continuous-compliance/policies/documents/{document_id} — Delete a policy document and cascade to its evidence

**Endpoint**: `DELETE /v1/control-plane/continuous-compliance/policies/documents/{document_id}`
**Summary**: Delete a policy document and cascade to its evidence
**Tags**: continuous-compliance

Permanently delete a Knowledge-Hub policy document and cascade to its per-profile attachments, the associated S3 objects, and any document-analysis records. Any compliance requirement whose accepted answer relied on the deleted evidence is flipped to Needs Review; policies left with no remaining evidence return to the Missing tab. This operation is irreversible. 404s if the document does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `document_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/control-plane/continuous-compliance/policies/documents/{document_id} — Edit a hub document's title, description, or entity scope

**Endpoint**: `PATCH /v1/control-plane/continuous-compliance/policies/documents/{document_id}`
**Summary**: Edit a hub document's title, description, or entity scope
**Tags**: continuous-compliance

Update editable metadata on a Knowledge-Hub policy document: title, description, summary, selected_entities, or framework_descriptions. policy_type is immutable; requirement_profile_ids is not accepted here (edit links from the Scoping Profile view). Adding entities triggers fan-out and per-requirement analysis on processed documents; removing entities triggers a suggestion sweep and, for Additional Documents, drops link rows on removed entities. Applies to the latest version of the document chain only. 404s if the document does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `document_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies/documents/{document_id}/versions — Upload a new version of an existing policy document

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies/documents/{document_id}/versions`
**Summary**: Upload a new version of an existing policy document
**Tags**: continuous-compliance

Add a new file version to an existing Knowledge-Hub document version chain. The new version inherits the prior version's entity targets and (for Additional Documents) requirement-link rows. A fresh document-analysis job is enqueued for the new version, and evidence suggestions from the prior version are marked stale — any requirement whose accepted answer pointed at the old version is automatically noted as superseded. 404s if the document does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `document_id` (path, required): 

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id} — Get a single policy profile with full detail

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id}`
**Summary**: Get a single policy profile with full detail
**Tags**: continuous-compliance

Return the full detail for one compliance policy profile including its status, attachments (uploaded evidence files), and linked compliance requirement references. Use to display the policy profile detail drawer or to inspect the current evidence and requirement coverage for a specific entity-policy combination. 404s if the profile does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `policy_profile_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments — List evidence attachments on a policy profile

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments`
**Summary**: List evidence attachments on a policy profile
**Tags**: continuous-compliance

Return all evidence file attachments associated with a given compliance policy profile. Each attachment includes the file name, upload metadata, and the uploader's email. Use to enumerate the evidence files for a specific entity-policy combination before downloading or deleting them. 404s if the profile does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `policy_profile_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments — Upload a file against a policy profile

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments`
**Summary**: Upload a file against a policy profile
**Tags**: continuous-compliance

multipart/form-data: ``file`` is a single uploaded file. The S3
PUT, DB row insert, status flip, and compensating S3-cleanup-on-
failure are all owned by the service layer; this endpoint validates
inputs and translates domain exceptions to HTTP status codes.

``uploaded_by`` is derived **server-side** from the JWT (the user's
email); not accepted as form input.

First successful upload transitions the profile NOT_UPLOADED → UPLOADED.

**Parameters**:
- `policy_profile_id` (path, required): 

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments/{attachment_id} — Delete an evidence attachment from a policy profile

**Endpoint**: `DELETE /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments/{attachment_id}`
**Summary**: Delete an evidence attachment from a policy profile
**Tags**: continuous-compliance

Permanently remove a specific evidence attachment from a compliance policy profile, including its S3 object. Deleting the last attachment on a profile may revert the profile status from UPLOADED back to NOT_UPLOADED. This operation is irreversible. 404s if either the profile or the attachment does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `policy_profile_id` (path, required): 
- `attachment_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy profile or attachment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/status — Update the compliance status of a policy profile

**Endpoint**: `PUT /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/status`
**Summary**: Update the compliance status of a policy profile
**Tags**: continuous-compliance

Transition a policy profile to a new compliance status (e.g. APPROVED or NOT_APPLICABLE). Only valid status transitions are accepted; invalid transitions return 409. Use to approve uploaded evidence or to mark a policy as not applicable for a specific entity. Returns the updated policy profile detail. 404s if the profile does not belong to the calling customer. Scoped to the token's customer.

**Parameters**:
- `policy_profile_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy profile not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies — Create an empty policy profile for an entity

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies`
**Summary**: Create an empty policy profile for an entity
**Tags**: continuous-compliance

Create a new empty (NOT_UPLOADED) compliance policy profile linking a specific entity to a policy catalog entry under a framework. The entity_state must belong to the calling customer. Returns the new profile id. Rejects a duplicate with 409 when a profile already exists for the same entity, framework, and policy combination. 404s if the entity or policy catalog entry is not found. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state or policy catalog entry not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/control-plane/continuous-compliance/policies/{policy_id} — Update the owner or due date for a policy type

**Endpoint**: `PATCH /v1/control-plane/continuous-compliance/policies/{policy_id}`
**Summary**: Update the owner or due date for a policy type
**Tags**: continuous-compliance

Upsert the policy-level metadata for a given policy type: assignee_email (owner) and/or due_date. Omit a field to leave it unchanged; send null to clear it. The first call creates the metadata row; subsequent calls update it. At least one of assignee_email or due_date must be provided (400 otherwise). 404s if the policy type is not recognized. Scoped to the token's customer.

**Parameters**:
- `policy_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy type not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/link/{source_document_id} — Link an existing hub document as evidence for a policy profile

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/link/{source_document_id}`
**Summary**: Link an existing hub document as evidence for a policy profile
**Tags**: continuous-compliance

Create a per-profile attachment that references an already-uploaded Knowledge-Hub document without uploading a new file — the attachment shares the source document's stored file. Triggers document analysis for the linked profile and transitions the profile from NOT_UPLOADED to UPLOADED. Optional body fields file_name and owner_email relabel the attachment on the target profile. Both the profile and source document are tenant-scoped to the calling customer. 404s if either resource is not found. Scoped to the token's customer.

**Parameters**:
- `policy_profile_id` (path, required): 
- `source_document_id` (path, required): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy profile or source document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments/{attachment_id}/download — Get a presigned download URL for a policy attachment

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/{policy_profile_id}/attachments/{attachment_id}/download`
**Summary**: Get a presigned download URL for a policy attachment
**Tags**: continuous-compliance

Return a short-lived presigned GET URL for the attachment's S3 object,
tenant-scoped through its profile. The FE fetches the bytes directly from S3;
this endpoint never streams them.

**Parameters**:
- `policy_profile_id` (path, required): 
- `attachment_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/policies/bulk/download — Get presigned download URLs for many policy attachments

**Endpoint**: `POST /v1/control-plane/continuous-compliance/policies/bulk/download`
**Summary**: Get presigned download URLs for many policy attachments
**Tags**: continuous-compliance

Return presigned GET URLs for the requested **attachment** ids in one
batched, tenant-scoped lookup. Ids not owned by the caller (or not found) are
omitted, so the returned list may be shorter than the request. Zipping the
files or handing the work to an async job is out of scope for this endpoint —
it returns the URL list directly.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/bootstrap-sync — Sync scoping and requirement catalogs from the compliance service

**Endpoint**: `POST /v1/control-plane/continuous-compliance/bootstrap-sync`
**Summary**: Sync scoping and requirement catalogs from the compliance service
**Tags**: continuous-compliance

Fetch latest scoping + requirement questions from the compliance service,
diff against local catalog rows by `version`, upsert, then cascade
needs_review to affected entity states / profiles.

Idempotent when no versions changed.

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/continuous-compliance/frameworks — List regulatory frameworks with activation context

**Endpoint**: `GET /v1/control-plane/continuous-compliance/frameworks`
**Summary**: List regulatory frameworks with activation context
**Tags**: continuous-compliance

Return a paginated list of all regulatory frameworks in the platform catalog, each annotated with the customer's current activation state: whether any active compliance policy exists, the active policy id at the requested scope (customer / organization / project), the activation ratio (how many org-hierarchy nodes are covered), and whether the caller can activate at the current scope. Supports filtering by enforcement type, penalty tier, activation state, and substring search on framework name or entity name. Pass organization_id or project_id to narrow the active_policy_id resolution to that scope. Scoped to the token's customer.

**Parameters**:
- `search` (query, optional): Substring match on framework display_name or any discovered entity name under this customer.
- `enforcement` (query, optional): Exact match on framework.enforcement (e.g. Mandatory, Voluntary).
- `penalty` (query, optional): Exact match on framework.penalty (e.g. Low, Moderate, High, Severe).
- `continuous_compliance_enabled` (query, optional): When set, returns only frameworks whose continuous_compliance_enabled equals the provided value (NULLs match neither). Catalog is global; filter applied SQL-side.
- `is_activated` (query, optional): True iff at least one ACTIVE activation policy exists for this framework under the caller's customer.
- `organization_id` (query, optional): Scope context for `active_policy_id` resolution. When set (without project_id), the returned policy id is the one at ORGANIZATION level matching this org. Has no effect on which frameworks are listed — the catalog is global.
- `project_id` (query, optional): Scope context for `active_policy_id` resolution. When set, the returned policy id is the one at PROJECT level matching this project; organization_id is ignored.
- `page` (query, optional): 
- `page_size` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/frameworks/filter-values — Distinct enforcement and penalty values for filter dropdowns

**Endpoint**: `GET /v1/control-plane/continuous-compliance/frameworks/filter-values`
**Summary**: Distinct enforcement and penalty values for filter dropdowns
**Tags**: continuous-compliance

Distinct enforcement / penalty values for the FE filter dropdowns.

Cross-tenant: the catalog is global, so values do not depend on the
caller's customer. The customer_id dependency is retained purely to
keep the endpoint behind external auth.

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/continuous-compliance/frameworks/{framework_id} — Get full details for a single regulatory framework

**Endpoint**: `GET /v1/control-plane/continuous-compliance/frameworks/{framework_id}`
**Summary**: Get full details for a single regulatory framework
**Tags**: continuous-compliance

Return detailed metadata for a single regulatory framework, including its enforcement type, penalty tier, effective status, applicable entity types, control categories, jurisdiction, and a breakdown of how many entities (organizations, projects, resources, vendors) are actively covered under the caller's tenant. Pass organization_id or project_id to scope the active_for breakdown to a specific part of the tenant hierarchy. Returns 404 when the framework_id is not recognized. Scoped to the token's customer.

**Parameters**:
- `framework_id` (path, required): 
- `organization_id` (query, optional): Scope `active_for` to a single organization (its own row plus its projects). Matches the caller's current dashboard scope.
- `project_id` (query, optional): Scope `active_for` to a single project. Wins over organization_id when both are passed.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Framework not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/frameworks/{framework_id}/entities — Get the per-entity activation tree for a framework

**Endpoint**: `GET /v1/control-plane/continuous-compliance/frameworks/{framework_id}/entities`
**Summary**: Get the per-entity activation tree for a framework
**Tags**: continuous-compliance

Return the full organization → project → resource/vendor activation tree for a framework, showing each node's activation state and whether it is directly activated or covered by a broader-scope policy (cascade: customer > org > project, deepest wins). Use this to render the expand-row in the framework table or any UI surface that needs per-entity compliance status. Optionally scope to a single organization or project; the response shape is stable regardless of scope (a project-scoped request is still wrapped under its parent org). Returns 404 when the framework_id is not recognized. Scoped to the token's customer.

**Parameters**:
- `framework_id` (path, required): 
- `organization_id` (query, optional): Trim the tree to a single organization. Useful when the FE's global scope dropdown is on a specific org.
- `project_id` (query, optional): Trim the tree to a single project. The response still wraps the project under its parent org so the response shape is stable. Wins over organization_id when both are passed.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Framework not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/policies/documents/{document_id}/analysis-status — Get analysis status for an uploaded compliance document

**Endpoint**: `GET /v1/control-plane/continuous-compliance/policies/documents/{document_id}/analysis-status`
**Summary**: Get analysis status for an uploaded compliance document
**Tags**: continuous-compliance

Return the current ingestion and analysis status for a hub document that was uploaded as evidence against continuous-compliance requirements. Poll this endpoint to track progress through PENDING → SYNC_IN_PROGRESS → READY states, or detect terminal failures (KB_SYNC_FAILED when Bedrock ingestion fails after retries). Also returns the count of requirement-level suggested responses generated from the document and the Bedrock-level sync status. Scoped to the token's customer; returns 404 if the document does not belong to the caller's tenant or has no analysis job.

**Parameters**:
- `document_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Document analysis job not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/entity-states/{entity_state_id}/meetings — Schedule a compliance meeting on an entity state

**Endpoint**: `POST /v1/control-plane/continuous-compliance/entity-states/{entity_state_id}/meetings`
**Summary**: Schedule a compliance meeting on an entity state
**Tags**: continuous-compliance

Creates a Zoom meeting anchored to the given entity_state and persists the resulting meeting record. The requirement set that the meeting covers is not resolved at schedule time — it is derived at analysis time from requirements flagged for video-analysis, filtered to the entity_state's open compliance profiles. Use this when you want to book a structured evidence-gathering session tied to a specific compliance scope. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/entity-states/{entity_state_id}/meetings — List compliance meetings for an entity state

**Endpoint**: `GET /v1/control-plane/continuous-compliance/entity-states/{entity_state_id}/meetings`
**Summary**: List compliance meetings for an entity state
**Tags**: continuous-compliance

Return all compliance meetings scheduled against the given entity_state, ordered newest-first by scheduled date. Multiple open meetings per entity are allowed. Use this to enumerate pending or completed meetings before fetching artifacts or triggering re-analysis. Scoped to the token's customer.

**Parameters**:
- `entity_state_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Entity state not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/continuous-compliance/meetings/{meeting_id}/artifacts — Get transcript and per-requirement outputs for a meeting

**Endpoint**: `GET /v1/control-plane/continuous-compliance/meetings/{meeting_id}/artifacts`
**Summary**: Get transcript and per-requirement outputs for a meeting
**Tags**: continuous-compliance

Return the meeting metadata, the raw timestamped transcript, and the per-requirement suggestions this meeting produced. The suggestions answer 'which compliance requirements did this meeting's recording satisfy?' — each carries the AI-generated response text, evaluation result, and lifecycle status (e.g. PENDING, DISMISSED, accepted into a review cycle). Use after analysis completes to review evidence gathered from the recording. Scoped to the token's customer.

**Parameters**:
- `meeting_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Meeting not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/continuous-compliance/meetings/{meeting_id} — Delete a compliance meeting and stale its suggestions

**Endpoint**: `DELETE /v1/control-plane/continuous-compliance/meetings/{meeting_id}`
**Summary**: Delete a compliance meeting and stale its suggestions
**Tags**: continuous-compliance

Delete a compliance meeting and its associated transcript records. Before deletion, marks any PENDING suggestions tied to this meeting as STALE so they are excluded from future review cycles while remaining visible in audit history. Use when a meeting was scheduled in error or its recording cannot be analyzed. This action is irreversible — the meeting row and transcripts are permanently removed. Scoped to the token's customer.

**Parameters**:
- `meeting_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Meeting not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/continuous-compliance/meetings/{meeting_id}/analyze — Manually trigger analysis of a meeting recording

**Endpoint**: `POST /v1/control-plane/continuous-compliance/meetings/{meeting_id}/analyze`
**Summary**: Manually trigger analysis of a meeting recording
**Tags**: continuous-compliance, internal

Enqueue a background job that calls the external compliance service to transcribe and evaluate the Zoom recording for this meeting. Transcripts are replaced on every run, so re-triggering picks up any corrected audio. Per-requirement suggestions are write-once per meeting: re-running preserves any existing user actions (DISMISSED, accepted into a review cycle) on previously generated suggestions. Returns 202 immediately; poll the meeting's artifacts endpoint to check for completion. Scoped to the token's customer.

**Parameters**:
- `meeting_id` (path, required): 

**Responses**:
- `202`: Successful Response
- `400`: Invalid request parameters
- `404`: Meeting not found
- `500`: Unexpected server error
- `422`: Validation Error

---
