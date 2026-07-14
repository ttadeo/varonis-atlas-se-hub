# ai-red-team API Endpoints

## GET /v2/ai-red-team/targets — List AI red-team targets with pagination

**Endpoint**: `GET /v2/ai-red-team/targets`
**Summary**: List AI red-team targets with pagination
**Tags**: ai-red-team, llm-pentest

Returns a paginated list of AI red-team targets for the authenticated customer. Supports filtering by project, organization, display name, and resource instance. Use to discover registered targets before configuring or launching a red-team scan.

**Parameters**:
- `project_id` (query, optional): 
- `organization_id` (query, optional): 
- `display_name` (query, optional): 
- `resource_instance_id` (query, optional): 
- `per_page` (query, optional): 
- `page` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---
