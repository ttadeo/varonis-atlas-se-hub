# data-security API Endpoints

## GET /v2/data-security/resources/{resource_instance_id}/access-graph — Get access graph rooted at a resource

**Endpoint**: `GET /v2/data-security/resources/{resource_instance_id}/access-graph`
**Summary**: Get access graph rooted at a resource
**Tags**: data-security

Return a traversal graph showing which resources are reachable from the given origin resource, or which resources depend on it. Supports outbound (origin → reachable), inbound (dependents → origin), and both directions. Use required_operation to filter edges by a specific CRUDS permission; supply target_resource_instance_id to scope the graph to paths reaching a specific node. Opt in to inventory metadata and issue counts per node via query flags. Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `required_operation` (query, optional): CRUDS operation to filter edges by. Omit to walk every edge regardless of permission booleans (matches the legacy `/v1/dependency-graph` semantics — structural edges with all-false CRUDS are included). Pass `read` / `create` / `update` / `delete` / `share` to scope to edges that grant that specific operation.
- `max_depth` (query, optional): Maximum traversal depth. Use 1 for one-hop neighbours.
- `target_resource_instance_id` (query, optional): Filter to paths that reach this specific node. Used for the 'how does A reach B' view (get_access_paths).
- `max_nodes` (query, optional): Cap on the number of distinct nodes in the response. Sets `truncated=true` when hit so the FE can surface incomplete visualisations.
- `direction` (query, optional): Traversal direction. ``outbound`` (default) walks origin → reachable; ``inbound`` walks dependents → origin (subsumes the legacy `/v1/inventory/.../dependency-graph` ``dependees`` view); ``both`` runs both and merges nodes/edges. Each path in the response carries its own ``direction`` so both halves remain distinguishable.
- `include_inventory_metadata` (query, optional): Opt-in: populate ``resource_type_display_name``, ``resource_category``, ``technology_*``, ``project_names``, and ``review_status`` per node. Mirrors the legacy dependency-graph payload. Off by default to keep the cheap path cheap.
- `include_issues` (query, optional): Opt-in: populate the six per-bucket Issue arrays per node (sensitive / vulnerability / pentest / misconfiguration / agentic / model_scan). Mirrors the legacy dependency-graph payload. Off by default — joins to the ``issue`` table.
- `view` (query, optional): ``graph`` (default) returns the flat nodes/edges/paths projection. The response is an additive superset of the prior shape: it always carries the new ``view``/``chains`` fields and per-path ``is_complete``/``incomplete_reason`` (``chains`` is empty for ``graph``). ``chain`` additionally populates ``chains`` — each path projected into an origin-first ordered list of role-tagged steps (typically agent → tool → identity → datastore for an outbound agent origin; an identity origin or ``direction=inbound`` blast-radius chain starts at the identity/datastore respectively).
- `include_incomplete` (query, optional): When false, the ``paths`` (and ``chains``) projection is curated down to chains that reach a meaningful terminal - a datastore (``is_complete=true``) or a tool / knowledge source. Chains that dead-end at an identity (reconciliation gap) or an unclassified/intermediate node are dropped. ``nodes``/``edges`` always describe the full traversal graph regardless of this flag.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/data-security/resources/{resource_instance_id}/accessible-datastores — List datastores reachable from a resource

**Endpoint**: `GET /v2/data-security/resources/{resource_instance_id}/accessible-datastores`
**Summary**: List datastores reachable from a resource
**Tags**: data-security

Return a paginated list of datastores that are reachable from the specified origin resource given the requested CRUDS operation permission. Use this to enumerate what data stores an AI agent or service account can access, filtered by operation type (read, create, update, delete, or share). Supports page and per_page pagination (max 100 per page). Scoped to the token's customer.

**Parameters**:
- `resource_instance_id` (path, required): 
- `required_operation` (query, optional): CRUDS operation to filter the underlying access traversal by.
- `page` (query, optional): 1-indexed page number.
- `per_page` (query, optional): Page size. Capped at 100 to bound payload size.

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Resource not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/data-security/resources/search — Search data-security resources by classification filters

**Endpoint**: `POST /v2/data-security/resources/search`
**Summary**: Search data-security resources by classification filters
**Tags**: data-security

Search across all data-security resources using nested classification filters. Filters support containment matches across sensitivity status and up to nine JSONB breakdown dimensions (e.g. data category, region, technology). An empty body returns all active resources for the customer. Use page and per_page query params to paginate results (max 100 per page). POST is used because filter expressions do not fit in query-string form. Scoped to the token's customer.

**Parameters**:
- `page` (query, optional): 1-indexed page number.
- `per_page` (query, optional): Page size. Capped at 100 to bound payload size.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---
