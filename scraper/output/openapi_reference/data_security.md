# data-security API Endpoints

## GET /v2/data-security/resources/{resource_instance_id}/access-graph — Get Access Graph

**Endpoint**: `GET /v2/data-security/resources/{resource_instance_id}/access-graph`
**Summary**: Get Access Graph
**Tags**: data-security

Return the access graph from one origin resource.

Covers three spec-section-13.4 service methods via query params:
    - default call → ``get_reachable_resources``
    - ``?target_resource_instance_id=...`` → ``get_access_paths``
    - ``?max_depth=1`` → ``get_one_hop``

Subsumes the legacy ``GET /v1/inventory/resource/{id}/dependency-graph``
via ``?direction=inbound|both`` plus the
``?include_inventory_metadata=true`` / ``?include_issues=true``
flags. The new inventory-metadata + issue fields are always
present on the wire (the response model serialises them as
``null`` / empty list when not opted in), so existing consumers
see additional keys but unchanged values for the legacy payload
they were already reading.

**Parameters**:
- `resource_instance_id` (path, required): 
- `required_operation` (query, optional): CRUDS operation to filter edges by. Omit to walk every edge regardless of permission booleans (matches the legacy `/v1/dependency-graph` semantics — structural edges with all-false CRUDS are included). Pass `read` / `create` / `update` / `delete` / `share` to scope to edges that grant that specific operation.
- `max_depth` (query, optional): Maximum traversal depth. Use 1 for one-hop neighbours.
- `target_resource_instance_id` (query, optional): Filter to paths that reach this specific node. Used for the 'how does A reach B' view (get_access_paths).
- `max_nodes` (query, optional): Cap on the number of distinct nodes in the response. Sets `truncated=true` when hit so the FE can surface incomplete visualisations.
- `direction` (query, optional): Traversal direction. ``outbound`` (default) walks origin → reachable; ``inbound`` walks dependents → origin (subsumes the legacy `/v1/inventory/.../dependency-graph` ``dependees`` view); ``both`` runs both and merges nodes/edges. Each path in the response carries its own ``direction`` so both halves remain distinguishable.
- `include_inventory_metadata` (query, optional): Opt-in: populate ``resource_type_display_name``, ``resource_category``, ``technology_*``, ``project_names``, and ``review_status`` per node. Mirrors the legacy dependency-graph payload. Off by default to keep the cheap path cheap.
- `include_issues` (query, optional): Opt-in: populate the six per-bucket Issue arrays per node (sensitive / vulnerability / pentest / misconfiguration / agentic / model_scan). Mirrors the legacy dependency-graph payload. Off by default — joins to the ``issue`` table.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/data-security/resources/{resource_instance_id}/accessible-datastores — List Accessible Datastores

**Endpoint**: `GET /v2/data-security/resources/{resource_instance_id}/accessible-datastores`
**Summary**: List Accessible Datastores
**Tags**: data-security

Paginated list of datastores reachable from one origin.

The full ``AccessibleDatastoreSummary`` per row. The list
is unbounded in principle (an agent can connect to many
datastores) so this endpoint is the only place the FE pulls it —
`getResourceDetails` carries header aggregates only (decisions.md).

**Parameters**:
- `resource_instance_id` (path, required): 
- `required_operation` (query, optional): CRUDS operation to filter the underlying access traversal by.
- `page` (query, optional): 1-indexed page number.
- `per_page` (query, optional): Page size. Capped at 100 to bound payload size.

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/data-security/resources/search — Search Resources

**Endpoint**: `POST /v2/data-security/resources/search`
**Summary**: Search Resources
**Tags**: data-security

Cross-resource classification-filtered search.

POST because the body carries nested filter expressions
(containment matches across 9 JSONB breakdown dimensions plus
``sensitivity_status``) that don't fit cleanly in a query string.
Backed by GIN ``@>`` indexes per spec; rows must contain at
least one of the named values for every populated filter
dimension.

Empty body matches every active ``data_security_resource`` for
the customer — useful for FE list views without active filters.

**Parameters**:
- `page` (query, optional): 1-indexed page number.
- `per_page` (query, optional): Page size. Capped at 100 to bound payload size.

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
