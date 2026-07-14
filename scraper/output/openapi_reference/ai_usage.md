# ai-usage API Endpoints

## POST /v1/ai-usage/customer/{customer_id}/logging/copilot/microsoft — Pull Copilot Logs

**Endpoint**: `POST /v1/ai-usage/customer/{customer_id}/logging/copilot/microsoft`
**Summary**: Pull Copilot Logs
**Tags**: ai-usage

Pull logs from the Copilot service

**Parameters**:
- `customer_id` (path, required): 
- `start_time` (query, optional): 
- `end_time` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-usage/log-push/format/datadog — Cloudflare Log Push Datadog Format

**Endpoint**: `POST /v1/ai-usage/log-push/format/datadog`
**Summary**: Cloudflare Log Push Datadog Format
**Tags**: ai-usage, no-auth

Endpoint that mimics Datadog log push format from Cloudflare

**Parameters**:
- `ddsource` (query, optional): 
- `ddtags` (query, optional): 
- `host` (query, optional): 
- `service` (query, optional): 
- `dd-api-key` (header, optional): 

**Responses**:
- `202`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-usage/quarantine/{resource_capability} — Check whether a resource is sanctioned under the AI usage quarantine policy

**Endpoint**: `POST /v1/ai-usage/quarantine/{resource_capability}`
**Summary**: Check whether a resource is sanctioned under the AI usage quarantine policy
**Tags**: ai-usage

Resolves the provided resource (by API key or endpoint identifier) and returns whether it is sanctioned according to the customer's AI usage quarantine policy for the specified capability. Accepts the legacy ``llm-endpoint`` path segment as an alias for ``gateway-settings``. Scoped to the authenticated customer. Use before routing traffic to a resource to verify it is approved and not quarantined.

**Parameters**:
- `resource_capability` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-usage-policy/quarantine/{resource_capability} — Get quarantine policy settings for a resource capability

**Endpoint**: `GET /v1/ai-usage-policy/quarantine/{resource_capability}`
**Summary**: Get quarantine policy settings for a resource capability
**Tags**: ai-usage

Return the quarantine policy settings (e.g. whether quarantine is enabled) for the specified resource capability within the token's customer. Use to check whether automated quarantine enforcement is active for a given capability surface before reading or modifying individual quarantine rules. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/ai-usage-policy/quarantine/{resource_capability} — Update quarantine policy settings for a resource capability

**Endpoint**: `PATCH /v1/ai-usage-policy/quarantine/{resource_capability}`
**Summary**: Update quarantine policy settings for a resource capability
**Tags**: ai-usage

Update the quarantine policy settings (e.g. enable or disable quarantine enforcement) for the specified resource capability within the token's customer. Use to toggle automated quarantine on or off for a capability surface without affecting the individual quarantine rules already configured. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules — List manual and promoted quarantine rules for a resource

**Endpoint**: `GET /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules`
**Summary**: List manual and promoted quarantine rules for a resource
**Tags**: ai-usage

Return all quarantine rules (both manually configured and promoted from quarantine entries) that are currently active for the specified resource. Each rule includes its predicate type (block-by-value or allow-by-value), the criteria list, the rule source, and audit timestamps. The ``resource_capability`` path segment guards which capability surface the resource must support; resources that don't declare it are rejected with a 400. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 
- `resource_instance_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters, or the resource does not support the requested capability
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules — Upsert manual quarantine rules for a resource

**Endpoint**: `PUT /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules`
**Summary**: Upsert manual quarantine rules for a resource
**Tags**: ai-usage

Add or replace manual quarantine rules for the specified resource. By default (replace_all=false) the supplied predicates are appended to existing manual rules and the message is merged (omitting it leaves the existing message intact; passing null clears it). Set replace_all=true to wipe all existing manual rules first — promoted entries from a prior PUT /entry call always survive. The ``resource_capability`` path segment guards which capability surface the resource must support; resources that don't declare it are rejected with a 400. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters, or the resource does not support the requested capability
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules/{rule_id} — Delete a single quarantine rule

**Endpoint**: `DELETE /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/rules/{rule_id}`
**Summary**: Delete a single quarantine rule
**Tags**: ai-usage

Permanently delete a specific manual quarantine rule from the specified resource by its rule ID. Only manually created rules can be deleted this way; promoted rules are managed via PUT /entry. This action cannot be undone — the affected attribute values will no longer be quarantined or allowed by this rule. Use when a specific predicate should be removed without touching the remaining rules on the resource. The ``resource_capability`` path segment guards which capability surface the resource must support; resources that don't declare it are rejected with a 400. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 
- `resource_instance_id` (path, required): 
- `rule_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters, or the resource does not support the requested capability
- `404`: Quarantine rule not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/entry — Lift or make permanent a quarantine entry

**Endpoint**: `PUT /v1/ai-usage-policy/quarantine/{resource_capability}/{resource_instance_id}/entry`
**Summary**: Lift or make permanent a quarantine entry
**Tags**: ai-usage

Act on an active quarantine entry for a specific attribute value on a resource. Use action=block (Make Permanent) to persist a block_by_value rule that keeps the entry quarantined indefinitely, surviving gateway restarts. Use action=allow (Lift) to record a lift decision; the next endpoint-settings build emits a lift_by_value predicate so the gateway evicts the runtime quarantine entry. Lifting an active Make Permanent also revokes it and splices the value out of the block rule. The ``resource_capability`` path segment guards which capability surface the resource must support; resources that don't declare it are rejected with a 400. Scoped to the token's customer.

**Parameters**:
- `resource_capability` (path, required): 
- `resource_instance_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters, or the resource does not support the requested capability
- `404`: Quarantine entry or resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-service-policy/default-posture — Get the default AI service policy posture for the customer

**Endpoint**: `GET /v1/ai-service-policy/default-posture`
**Summary**: Get the default AI service policy posture for the customer
**Tags**: ai-usage

Returns the customer-wide default policy posture applied to AI services that do not have an explicit per-service override. The posture controls whether AI service usage is allowed, blocked, or monitored by default. Use this before setting per-service overrides to understand the baseline policy. Scoped to the authenticated customer.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error

---

## PUT /v1/ai-service-policy/default-posture — Update the default AI service policy posture for the customer

**Endpoint**: `PUT /v1/ai-service-policy/default-posture`
**Summary**: Update the default AI service policy posture for the customer
**Tags**: ai-usage

Sets the customer-wide default policy posture for AI services. This affects all AI services that do not have an explicit per-service override. Call this to change the baseline allow/block/monitor stance before or after configuring individual service overrides. Returns the updated posture value. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/ai-service-policy/overrides — Create or update a per-service AI service policy override

**Endpoint**: `PUT /v1/ai-service-policy/overrides`
**Summary**: Create or update a per-service AI service policy override
**Tags**: ai-usage

Sets a policy posture override for a specific AI service, identified by service_id. The override takes precedence over the customer-wide default posture for that service. Use this to allow, block, or monitor individual AI services independently of the default. Returns the service_id and the applied posture. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/ai-service-policy/overrides/bulk — Bulk create or update AI service policy overrides

**Endpoint**: `PUT /v1/ai-service-policy/overrides/bulk`
**Summary**: Bulk create or update AI service policy overrides
**Tags**: ai-usage

Create or update policy posture overrides for multiple AI services in a single request. Each entry maps a service_id to a policy state (allow, block, or monitor). Existing overrides for the given service IDs are replaced; services not included are unchanged. Returns the count of overrides written. Use when configuring policy across many services at once. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/ai-service-policy/overrides/bulk — Bulk delete AI service policy overrides by service ID

**Endpoint**: `DELETE /v1/ai-service-policy/overrides/bulk`
**Summary**: Bulk delete AI service policy overrides by service ID
**Tags**: ai-usage

Remove policy posture overrides for multiple AI services in a single request. Deleted services revert to the customer-wide default posture. Returns the count of overrides removed. Unmatched service IDs are silently ignored. Use when resetting several services back to the default posture at once. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/ai-service-policy/overrides/{service_id} — Delete a single AI service policy override

**Endpoint**: `DELETE /v1/ai-service-policy/overrides/{service_id}`
**Summary**: Delete a single AI service policy override
**Tags**: ai-usage

Remove the policy posture override for a specific AI service identified by service_id. Once deleted, the service reverts to the customer-wide default posture. Use when a previously customized service should follow the default allow/block/monitor stance again. Returns {"deleted": true} on success. Scoped to the token's customer.

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Service policy override not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-service-catalog — Get Catalog

**Endpoint**: `GET /v1/ai-service-catalog`
**Summary**: Get Catalog
**Tags**: ai-usage

**Parameters**:
- `search` (query, optional): 
- `service_type` (query, optional): 
- `effective_policy` (query, optional): 
- `offset` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-service-catalog/{service_id} — Get Catalog Entry

**Endpoint**: `GET /v1/ai-service-catalog/{service_id}`
**Summary**: Get Catalog Entry
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/ai-service-catalog/custom — Create Custom Service

**Endpoint**: `POST /v1/ai-service-catalog/custom`
**Summary**: Create Custom Service
**Tags**: ai-usage

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## PUT /v1/ai-service-catalog/custom/{service_id} — Update Custom Service

**Endpoint**: `PUT /v1/ai-service-catalog/custom/{service_id}`
**Summary**: Update Custom Service
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/ai-service-catalog/custom/{service_id} — Delete Custom Service

**Endpoint**: `DELETE /v1/ai-service-catalog/custom/{service_id}`
**Summary**: Delete Custom Service
**Tags**: ai-usage

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/ai-access-events — List AI access events for the customer

**Endpoint**: `GET /v1/ai-access-events`
**Summary**: List AI access events for the customer
**Tags**: ai-usage

Return a paginated list of AI access events recorded for the token's customer, representing user interactions with AI services (e.g. browser-extension requests, API calls). Supports filtering by organization, project, AI service, user email, time range, event source, event type, device, URL substring, and IP address. Use to audit who accessed which AI services, when, and from where. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `service_id` (query, optional): 
- `user_email` (query, optional): 
- `time_start` (query, optional): 
- `time_end` (query, optional): 
- `source_in` (query, optional): 
- `device_in` (query, optional): 
- `url_contains` (query, optional): 
- `ip_in` (query, optional): 
- `event_type_in` (query, optional): 
- `offset` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-service-activity — List AI service activity across the tenant

**Endpoint**: `GET /v1/ai-service-activity`
**Summary**: List AI service activity across the tenant
**Tags**: ai-usage

Return aggregated usage activity for every AI service observed in the token's customer tenant, including event counts, active user counts, and the effective firewall policy (audit/block/allow) for each service. Optionally filter by organization, project, or a time window. Results are sorted by event count descending. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `time_start` (query, optional): 
- `time_end` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/ai-service-activity/{service_id} — Get detailed activity for a single AI service

**Endpoint**: `GET /v1/ai-service-activity/{service_id}`
**Summary**: Get detailed activity for a single AI service
**Tags**: ai-usage

Return full detail for one AI service, including its catalog metadata (name, domain, base URL, URL patterns), effective firewall policy, and a per-user activity breakdown (event count, last observed timestamp). Optionally filter user activity by organization, project, or time window. Use this after listAiServiceActivity to drill into a specific service. Scoped to the token's customer.

**Parameters**:
- `service_id` (path, required): 
- `organization_id` (query, optional): 
- `project_id` (query, optional): 
- `time_start` (query, optional): 
- `time_end` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: AI service not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-service-catalog — List AI service catalog entries (v2)

**Endpoint**: `GET /v2/ai-service-catalog`
**Summary**: List AI service catalog entries (v2)
**Tags**: ai-usage

Returns a paginated list of AI service catalog entries visible to the customer, including both platform-managed and custom services. Supports filtering by service type and effective policy state, and free-text search on service name. Scoped to the authenticated customer. Use to browse all known AI services before creating firewall rules or TPRM assessments.

**Parameters**:
- `search` (query, optional): 
- `service_type` (query, optional): 
- `effective_policy` (query, optional): 
- `offset` (query, optional): 
- `limit` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid filter parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/ai-service-catalog/{service_id} — Get an AI service catalog entry by id (v2)

**Endpoint**: `GET /v2/ai-service-catalog/{service_id}`
**Summary**: Get an AI service catalog entry by id (v2)
**Tags**: ai-usage

Returns full details for a single AI service catalog entry, including URL patterns, base URL, effective policy state, and whether a customer override is active. Scoped to the authenticated customer. Use to inspect a specific service before modifying its policy or including it in a vendor risk assessment.

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Catalog entry not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/ai-service-catalog/custom — Create a custom AI service catalog entry (v2)

**Endpoint**: `POST /v2/ai-service-catalog/custom`
**Summary**: Create a custom AI service catalog entry (v2)
**Tags**: ai-usage

Creates a new customer-defined AI service entry in the catalog with a name, domain, base URL, URL patterns, and initial policy state. Scoped to the authenticated customer. Use when a customer's AI estate includes a service not yet in the platform catalog.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v2/ai-service-catalog/custom/{service_id} — Update a custom AI service catalog entry (v2)

**Endpoint**: `PUT /v2/ai-service-catalog/custom/{service_id}`
**Summary**: Update a custom AI service catalog entry (v2)
**Tags**: ai-usage

Updates the name, domain, base URL, URL patterns, or description of an existing custom AI service catalog entry. Scoped to the authenticated customer. Only custom entries (not platform-managed services) can be modified via this endpoint.

**Parameters**:
- `service_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Custom catalog entry not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/ai-service-catalog/custom/{service_id} — Soft-delete a custom AI service catalog entry (v2)

**Endpoint**: `DELETE /v2/ai-service-catalog/custom/{service_id}`
**Summary**: Soft-delete a custom AI service catalog entry (v2)
**Tags**: ai-usage

Soft-deletes a customer-defined AI service catalog entry, removing it from the catalog without permanently destroying audit history. Only custom entries owned by the authenticated customer can be deleted; platform-managed services are not affected. Use before replacing a custom entry with a corrected definition, or when a tracked AI service is decommissioned. Scoped to the token's customer.

**Parameters**:
- `service_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Custom catalog entry not found
- `500`: Unexpected server error
- `422`: Validation Error

---
