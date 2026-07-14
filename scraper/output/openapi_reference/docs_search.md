# docs-search API Endpoints

## POST /v1/docs-search/ask — Ask a question against the Atlas documentation

**Endpoint**: `POST /v1/docs-search/ask`
**Summary**: Ask a question against the Atlas documentation
**Tags**: docs-search, all-roles

Returns an answer grounded in the Atlas docs KB plus the cited source pages. Client may resend up to 5 prior turns for follow-up context. No conversation is persisted server-side; session_id is a Logfire correlation id only.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
