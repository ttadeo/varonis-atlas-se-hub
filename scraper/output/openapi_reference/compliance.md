# compliance API Endpoints

## GET /v1/control-plane/compliance/job-status/{job_id} — Get Compliance Job Status

**Endpoint**: `GET /v1/control-plane/compliance/job-status/{job_id}`
**Summary**: Get Compliance Job Status
**Tags**: compliance

Get the status of a job that was initiated to create a compliance audit.

**Parameters**:
- `job_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/frameworks — List available compliance frameworks

**Endpoint**: `GET /v1/control-plane/compliance/frameworks`
**Summary**: List available compliance frameworks
**Tags**: compliance

Return all compliance frameworks supported by the platform, optionally filtered to those that support audit workflows. Use this to discover valid framework options before creating an audit project. Scoped to the token's customer via JWT.

**Parameters**:
- `audit_supported` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/audit — Create a new compliance audit project

**Endpoint**: `POST /v1/control-plane/compliance/audit`
**Summary**: Create a new compliance audit project
**Tags**: compliance

Initiate a new compliance audit for a project against a specified framework. Returns 409 if an in-progress audit already exists for the same project and framework combination. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/audit/risk-levels — Compute and retrieve risk levels for an audit

**Endpoint**: `POST /v1/control-plane/compliance/audit/risk-levels`
**Summary**: Compute and retrieve risk levels for an audit
**Tags**: compliance

Analyze an audit's risk assessment responses and return the computed risk levels for each dimension. Requires the audit's risk assessment to be completed before calling. Use this to retrieve structured risk level data after the questionnaire is submitted. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit not found or risk assessment not completed
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id} — Permanently delete a compliance audit project

**Endpoint**: `DELETE /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}`
**Summary**: Permanently delete a compliance audit project
**Tags**: compliance

Permanently delete a compliance audit project and all its associated data for the specified customer and audit ID. This action is irreversible. Use with caution — deleting an active audit removes all progress. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `audit_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}/terminate — Terminate an in-progress compliance audit

**Endpoint**: `POST /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}/terminate`
**Summary**: Terminate an in-progress compliance audit
**Tags**: compliance

Mark an in-progress compliance audit as terminated, ending the audit workflow without deleting the audit record. Use when an audit must be stopped before completion but the history should be preserved. Returns the updated audit object. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/compliance/issue — Update a compliance issue's properties

**Endpoint**: `PUT /v1/control-plane/compliance/issue`
**Summary**: Update a compliance issue's properties
**Tags**: compliance

Update one or more properties (such as severity or status) of an existing compliance issue. Only the fields provided in the request body are modified. Use this to adjust issue classification or remediation metadata. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/update-issue-status/{issue_id} — Update the status of a compliance issue

**Endpoint**: `POST /v1/control-plane/compliance/update-issue-status/{issue_id}`
**Summary**: Update the status of a compliance issue
**Tags**: compliance

Set the status and optional remediation comment on a compliance or failed-audit issue. Only applicable to compliance issue types — returns 400 for other issue types. Use to mark issues as remediated or to add remediation notes. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters or non-compliance issue type
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents — List compliance policy documents with pagination

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents`
**Summary**: List compliance policy documents with pagination
**Tags**: compliance

Return a paginated list of compliance policy documents for the token's customer. Supports filtering by organization, project, and status; full-text search by file name; and sorting by name, creation date, policy type, or project name. Use to browse and locate uploaded policy documents. Scoped to the token's customer.

**Parameters**:
- `page` (query, optional): Page number
- `per_page` (query, optional): Items per page
- `order` (query, optional): Sort order
- `order_by` (query, optional): Field to order by. Supported: name, created_at, policy_type, project_name
- `search_name` (query, optional): Search by file name
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `status` (query, optional): Filter by status

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents — Create Compliance Policy Doc

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents`
**Summary**: Create Compliance Policy Doc
**Tags**: compliance

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents/missing — List policy documents required but not yet uploaded

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/missing`
**Summary**: List policy documents required but not yet uploaded
**Tags**: compliance

Return all policy document types that are required under active regulatory frameworks but have not yet been uploaded for the customer. Optionally filter by organization or project scope (mutually exclusive). Use to identify compliance gaps before starting an audit. Scoped to the token's customer.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/requirement-analysis — Link a policy document to an audit policy and start analysis

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/requirement-analysis`
**Summary**: Link a policy document to an audit policy and start analysis
**Tags**: compliance

Link an existing policy document to a compliance audit policy item and enqueue a background requirement-analysis job to evaluate the document against the policy's requirements. Returns a job ID to track progress. Fails with 409 if the policy already has a document linked. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
- `400`: Invalid request parameters
- `404`: Document or policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## PATCH /v1/control-plane/compliance/policy-documents/{doc_id} — Update Compliance Policy Doc

**Endpoint**: `PATCH /v1/control-plane/compliance/policy-documents/{doc_id}`
**Summary**: Update Compliance Policy Doc
**Tags**: compliance

**Parameters**:
- `doc_id` (path, required): 

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/{doc_id}/approve — Approve the latest version of a policy document

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/{doc_id}/approve`
**Summary**: Approve the latest version of a policy document
**Tags**: compliance

Approve the latest version of a compliance policy document, transitioning it from under-review to approved status. After approval, a background requirement-analysis job is enqueued for all linked audit policies. Returns the document ID. Scoped to the token's customer.

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or invalid document status
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/{doc_id}/archive — Archive the latest version of a policy document

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/{doc_id}/archive`
**Summary**: Archive the latest version of a policy document
**Tags**: compliance

Archive the latest version of a compliance policy document, marking it as no longer active. Archived documents are retained for history but excluded from active compliance checks. Returns the document ID. Scoped to the token's customer.

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents/check-conflicts — Check for existing documents before uploading

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/check-conflicts`
**Summary**: Check for existing documents before uploading
**Tags**: compliance

Detect conflicts before uploading a new policy document. Returns any existing documents of the same policy type within the requested project, organization, or customer scope, along with the audits that currently reference them. Use this before uploading to warn the user about overwrites. Scoped to the token's customer.

**Parameters**:
- `compliance_policy_type_id` (query, required): 
- `project_ids` (query, optional): 
- `organization_ids` (query, optional): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents/{doc_id}/usage — Get audits that reference a policy document

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/{doc_id}/usage`
**Summary**: Get audits that reference a policy document
**Tags**: compliance

Return all compliance audits that are currently linked to a specific policy document. Use this to understand the impact before archiving or replacing a document — any linked audits may be affected. Scoped to the token's customer.

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/{doc_id}/generate-presigned-url — Generate Compliance Policy Document Presigned Url

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/{doc_id}/generate-presigned-url`
**Summary**: Generate Compliance Policy Document Presigned Url
**Tags**: compliance

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files — List compliance knowledge base files with pagination

**Endpoint**: `GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files`
**Summary**: List compliance knowledge base files with pagination
**Tags**: compliance

Return a paginated list of knowledge base files used for compliance purposes for the specified customer. Supports filtering by organization, project, and status; full-text search by file name; and sorting by name or creation date. Use to browse uploaded compliance source documents. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `page` (query, optional): Page number
- `per_page` (query, optional): Items per page
- `order` (query, optional): Sort order
- `order_by` (query, optional): Field to order by
- `search_name` (query, optional): Search by file name
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files — Upload Knowledge Base File

**Endpoint**: `POST /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files`
**Summary**: Upload Knowledge Base File
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/latest — List the latest version of each knowledge base file

**Endpoint**: `GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/latest`
**Summary**: List the latest version of each knowledge base file
**Tags**: compliance

Return the most recent version of each compliance knowledge base file for the specified customer, without pagination. Supports filtering by organization, project, and file status. Use to retrieve the current active set of source documents for compliance analysis. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `status` (query, optional): Filter by status

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id}/generate-presigned-url —  Generate Knowledge Base File Presigned Url

**Endpoint**: `POST /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id}/generate-presigned-url`
**Summary**:  Generate Knowledge Base File Presigned Url
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `knowledge_base_file_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PATCH /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id} — Update scope or status of a knowledge base file

**Endpoint**: `PATCH /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id}`
**Summary**: Update scope or status of a knowledge base file
**Tags**: compliance

Update the organization/project associations or approval status of a compliance knowledge base file. To approve the file, set status to APPROVED. Only APPROVED status transitions are supported. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `knowledge_base_file_id` (path, required): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or unsupported status transition
- `404`: Knowledge base file not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/upload-policy-attachment — Upload and attach a document to an audit policy item

**Endpoint**: `POST /v1/control-plane/compliance/upload-policy-attachment`
**Summary**: Upload and attach a document to an audit policy item
**Tags**: compliance

Upload a file and directly attach it to a specific compliance audit policy item. The file is stored in the knowledge base and a requirement-analysis job is enqueued to evaluate the document against the policy. Returns 409 if the policy already has an attachment. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/knowledge-base/{customer_id}/files/{kb_file_id} — Delete a knowledge base file and unlink from audits

**Endpoint**: `DELETE /v1/control-plane/compliance/knowledge-base/{customer_id}/files/{kb_file_id}`
**Summary**: Delete a knowledge base file and unlink from audits
**Tags**: compliance

Permanently remove a compliance knowledge base file and unlink it from any audit policies that reference it. This action is irreversible and may affect ongoing audits that depend on the document. Scoped to the customer_id path parameter.

**Parameters**:
- `customer_id` (path, required): 
- `kb_file_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Knowledge base file not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/create-meeting/{audit_id} — Create a video analysis meeting for an audit

**Endpoint**: `POST /v1/control-plane/compliance/create-meeting/{audit_id}`
**Summary**: Create a video analysis meeting for an audit
**Tags**: compliance

Create a new compliance meeting entry linked to the specified audit, enabling video evidence collection and analysis for that audit session. Use before uploading a recorded meeting or triggering video analysis. Scoped to the token's customer.

**Parameters**:
- `audit_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/meetings/{audit_id} — List all meetings for a compliance audit

**Endpoint**: `GET /v1/control-plane/compliance/meetings/{audit_id}`
**Summary**: List all meetings for a compliance audit
**Tags**: compliance

Return all video analysis meeting records associated with a compliance audit, including their processing status and any linked artifacts. Use to monitor meeting evidence collection progress for an audit. Scoped to the token's customer.

**Parameters**:
- `audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/meeting-artifacts/{analysis_meeting_id} — Get artifacts and analysis results for a meeting

**Endpoint**: `GET /v1/control-plane/compliance/meeting-artifacts/{analysis_meeting_id}`
**Summary**: Get artifacts and analysis results for a meeting
**Tags**: compliance

Return the AI-generated artifacts and analysis results for a specific compliance meeting, including transcribed requirement question mappings and evidence summaries. Use after video analysis completes to review what the system extracted. Scoped to the token's customer.

**Parameters**:
- `analysis_meeting_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Meeting analysis not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/analyze-video-evidence — Trigger AI analysis of a compliance meeting recording

**Endpoint**: `POST /v1/control-plane/compliance/analyze-video-evidence`
**Summary**: Trigger AI analysis of a compliance meeting recording
**Tags**: compliance, internal

Enqueue a background job to run AI analysis on a previously recorded compliance meeting. The meeting must have been created via createAuditMeeting and a recording associated. Returns a job ID to track analysis progress. Use after a meeting recording is available to extract compliance evidence.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Meeting analysis record not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/risk-questionnaire — Save draft risk questionnaire responses for an audit

**Endpoint**: `POST /v1/control-plane/compliance/risk-questionnaire`
**Summary**: Save draft risk questionnaire responses for an audit
**Tags**: compliance

Submit risk questionnaire responses for an audit without finalizing submission. Responses are saved and analyzed to produce intermediate risk level results. Use during the questionnaire workflow to preview risk levels before final submission. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/submit-questionnaire — Submit the final risk questionnaire for an audit

**Endpoint**: `POST /v1/control-plane/compliance/submit-questionnaire`
**Summary**: Submit the final risk questionnaire for an audit
**Tags**: compliance

Finalize and submit the completed risk questionnaire for a compliance audit. Unlike the draft save endpoint, this commits the responses and advances the audit's risk assessment state. Returns a submission confirmation with risk summary. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/save-risk-questionnaire — Save Risk Questionnaire

**Endpoint**: `POST /v1/control-plane/compliance/save-risk-questionnaire`
**Summary**: Save Risk Questionnaire
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/requirement-question-response — Save Requirement Question Response

**Endpoint**: `POST /v1/control-plane/compliance/requirement-question-response`
**Summary**: Save Requirement Question Response
**Tags**: compliance

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/requirement-question/mark-not-required — Mark a requirement question as not applicable

**Endpoint**: `POST /v1/control-plane/compliance/requirement-question/mark-not-required`
**Summary**: Mark a requirement question as not applicable
**Tags**: compliance

Mark a specific compliance requirement assessment question as not required, exempting it from the audit's evidence requirements. Use when a regulatory requirement does not apply to the customer's context. Returns the updated question record. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/suggested-response/action — Apply an action to an AI-suggested audit response

**Endpoint**: `POST /v1/control-plane/compliance/suggested-response/action`
**Summary**: Apply an action to an AI-suggested audit response
**Tags**: compliance

Apply a disposition action (Pending, Ignored, Amend, or Use Response) to an AI-generated suggested response for a compliance requirement question. Use this to accept, reject, or modify AI suggestions during the audit evidence collection workflow. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid action value
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/suggested-response/{suggested_response_id}/attachment — Download Suggested Response Attachment

**Endpoint**: `GET /v1/control-plane/compliance/suggested-response/{suggested_response_id}/attachment`
**Summary**: Download Suggested Response Attachment
**Tags**: compliance

**Parameters**:
- `suggested_response_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/unlink-policy-document — Remove a policy document from an audit policy item

**Endpoint**: `POST /v1/control-plane/compliance/unlink-policy-document`
**Summary**: Remove a policy document from an audit policy item
**Tags**: compliance

Unlink the currently attached policy document from a compliance audit policy item. After unlinking, the policy item has no document and its analysis results are cleared. The document itself is not deleted. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/analyze-additional-document — Analyze Additional Document

**Endpoint**: `POST /v1/control-plane/compliance/analyze-additional-document`
**Summary**: Analyze Additional Document
**Tags**: compliance

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/additional-document/{additional_document_id} — Delete an additional document from an audit

**Endpoint**: `DELETE /v1/control-plane/compliance/additional-document/{additional_document_id}`
**Summary**: Delete an additional document from an audit
**Tags**: compliance

Permanently delete a supplementary document that was uploaded as additional evidence for a compliance audit. This removes both the document record and its associated knowledge base file. Scoped to the token's customer.

**Parameters**:
- `additional_document_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Additional document not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/create-policy-template — Create a new compliance policy template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/create-policy-template`
**Summary**: Create a new compliance policy template
**Tags**: compliance

Instantiate a new compliance policy template for the calling customer's tenant from a predefined policy type. The template drives the guided background questionnaire and detail-question workflow. Optionally scoped to a project or organization within the tenant. Returns the created template record including its workflow state. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/policy-builder/delete-policy-template/{customer_id}/{policy_template_id} — Delete Policy Template

**Endpoint**: `DELETE /v1/control-plane/compliance/policy-builder/delete-policy-template/{customer_id}/{policy_template_id}`
**Summary**: Delete Policy Template
**Tags**: compliance, internal

**Parameters**:
- `customer_id` (path, required): 
- `policy_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-types — Get Policy Types

**Endpoint**: `GET /v1/control-plane/compliance/policy-types`
**Summary**: Get Policy Types
**Tags**: compliance

**Responses**:
- `200`: Successful Response

---

## POST /v1/control-plane/compliance/policy-builder/upload-attachment — Upload a file attachment to a policy documentation section

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/upload-attachment`
**Summary**: Upload a file attachment to a policy documentation section
**Tags**: compliance

Upload a file to a specific documentation section of a compliance policy template. The file is stored in cloud storage and indexed in the knowledge base so it can be used by the policy builder AI workflow. Returns the created attachment record including its knowledge-base file ID. Triggers an async workflow task upon commit. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy documentation section not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/approve-document — Approve and finalize a compliance policy template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/approve-document`
**Summary**: Approve and finalize a compliance policy template
**Tags**: compliance

Mark a compliance policy template as complete (approved), transitioning it from in-progress to the COMPLETE status. All required detail questions must be answered before approval is allowed. Triggers report generation in the background via the transactional outbox. Use this when an authorized user has reviewed and signed off on all policy content. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters or template not ready for approval
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/archive-document — Archive a compliance policy template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/archive-document`
**Summary**: Archive a compliance policy template
**Tags**: compliance

Move a compliance policy template to the ARCHIVED status, removing it from active workflows without deleting underlying data. Use this to retire a policy template that is no longer actively being worked on while preserving its historical record. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/framework-questionnaire — Evaluate a compliance framework questionnaire stateless

**Endpoint**: `POST /v1/control-plane/compliance/framework-questionnaire`
**Summary**: Evaluate a compliance framework questionnaire stateless
**Tags**: compliance

Stateless endpoint that generates and evaluates compliance questionnaire questions against supplied tags and previous user responses. No data is persisted — each call returns an updated set of questions and derived questionnaire tags. Use before saving responses to preview how the questionnaire evolves as users answer. Not tenant-scoped (carries no customer context); the result is used to drive the UI questionnaire flow.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/save-framework-questionnaire — Save questionnaire responses and derive required frameworks

**Endpoint**: `POST /v1/control-plane/compliance/save-framework-questionnaire`
**Summary**: Save questionnaire responses and derive required frameworks
**Tags**: compliance

Persist the user's compliance questionnaire responses for a project or organization, then evaluate which regulatory frameworks are required or suggested based on the answered tags. Returns the saved questions alongside the list of applicable frameworks with enforcement classification. Scoped to the token's customer. Provide either project_id or organization_id, not both.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/create-compliance-atlas-policies — Create or upsert compliance Atlas policies for a scope

**Endpoint**: `POST /v1/control-plane/compliance/create-compliance-atlas-policies`
**Summary**: Create or upsert compliance Atlas policies for a scope
**Tags**: compliance

Create (or upsert) one or more compliance Atlas policies linking regulatory frameworks to a project or organization. Policies are stored per project: supply project_id to target a single project, organization_id to fan out across all projects in that organization, or neither to create for every project under the customer. Supply exactly one of project_id or organization_id — providing both is rejected with 400. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/compliance/update-compliance-atlas-policy — Update an existing compliance Atlas policy

**Endpoint**: `PUT /v1/control-plane/compliance/update-compliance-atlas-policy`
**Summary**: Update an existing compliance Atlas policy
**Tags**: compliance

Update the status, frequency, or justification of an existing compliance Atlas policy. The policy must belong to the token's customer. Use to change how often a framework must be audited, accept or waive a framework, or record a justification for the chosen policy stance. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/delete-compliance-atlas-policy/customer_id/{customer_id}/atlas_policy_id/{atlas_policy_id} — Permanently delete a compliance Atlas policy

**Endpoint**: `DELETE /v1/control-plane/compliance/delete-compliance-atlas-policy/customer_id/{customer_id}/atlas_policy_id/{atlas_policy_id}`
**Summary**: Permanently delete a compliance Atlas policy
**Tags**: compliance

Permanently delete a single compliance Atlas policy identified by atlas_policy_id within the given customer tenant. The policy and any associated audit-gap tracking are removed. Use with caution — this action is irreversible. The {customer_id} path parameter must match the caller's token — enforced at authorization (a mismatch is rejected with 403). Scoped to the token's customer.

**Parameters**:
- `customer_id` (path, required): 
- `atlas_policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Atlas policy not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/compliance-atlas-policy-check — Evaluate active Atlas policies for compliance violations

**Endpoint**: `POST /v1/control-plane/compliance/compliance-atlas-policy-check`
**Summary**: Evaluate active Atlas policies for compliance violations
**Tags**: compliance

Evaluate all active compliance Atlas policies for a given project or organization against recent audit records. For each policy, determines whether the last completed audit falls within the required frequency and returns whether the policy is currently violating. Creates or updates audit-gap issues for policies found to be non-compliant. Scoped to the token's customer. Filter by project_id or organization_id in the request body to narrow the scope.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/background-question — Answer a policy builder background question

**Endpoint**: `POST /v2/compliance/policy-builder/background-question`
**Summary**: Answer a policy builder background question
**Tags**: compliance

Records a customer's answer to a single background question in the compliance policy builder workflow. Background questions capture organizational context (industry, risk appetite, regulatory scope) used to tailor AI governance policy recommendations. Call for each question in the questionnaire before saving or submitting. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid question ID or response value
- `404`: Policy template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/save-background-questionnaire — Save background questionnaire and get detail questions

**Endpoint**: `POST /v2/compliance/policy-builder/save-background-questionnaire`
**Summary**: Save background questionnaire and get detail questions
**Tags**: compliance

Saves the completed background questionnaire for a compliance policy template and returns the list of detail questions that must be answered before the policy can be submitted. Also triggers an asynchronous prefill pass to pre-populate AI-suggested answers. Use after answerPolicyBackgroundQuestion to advance the policy builder workflow. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid questionnaire data
- `404`: Policy template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/submit-background-questionnaire — Submit the completed background questionnaire

**Endpoint**: `POST /v2/compliance/policy-builder/submit-background-questionnaire`
**Summary**: Submit the completed background questionnaire
**Tags**: compliance

Marks the background questionnaire for a compliance policy template as submitted, finalizing the organizational context phase. Returns the completed questionnaire state. Call after all background questions have been answered and saved. Returns 404 if the policy template does not belong to the authenticated customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Questionnaire not ready to submit
- `404`: Policy template not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/background-question/reset — Reset a background question to its default state

**Endpoint**: `POST /v2/compliance/policy-builder/background-question/reset`
**Summary**: Reset a background question to its default state
**Tags**: compliance

Clears a previously recorded answer for a single background question in the compliance policy builder, returning it to an unanswered state. Use when the user wants to revise their input before saving or submitting the background questionnaire — for example after changing industry classification or risk appetite settings. Scoped to the authenticated customer; returns 404 if the policy template does not belong to that customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy template or question not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/detail-response — Record a response to a compliance policy detail question

**Endpoint**: `POST /v2/compliance/policy-builder/detail-response`
**Summary**: Record a response to a compliance policy detail question
**Tags**: compliance

Saves the caller's answer to a single detail question in the compliance policy builder. Detail questions are the granular, policy-specific questions returned after the background questionnaire is saved; they must all be answered before the policy can be finalized. Pass null for response to clear an existing answer. Returns the updated detail question with the recorded response. Scoped to the authenticated customer; returns 404 if the detail question does not exist or does not belong to that customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Detail question not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/compliance/policy-builder/prefill-status/{policy_template_id} — Check prefill status for a policy template

**Endpoint**: `GET /v2/compliance/policy-builder/prefill-status/{policy_template_id}`
**Summary**: Check prefill status for a policy template
**Tags**: compliance

Returns whether an AI-assisted prefill job is currently running for the specified compliance policy template. Poll this endpoint after savePolicyBackgroundQuestionnaire to determine when AI-suggested answers are ready before prompting the user to review detail questions. Returns running=true while prefill is in progress. Scoped to the authenticated customer.

**Parameters**:
- `policy_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid policy template ID
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/suggested-response/action — Apply an action to an AI-suggested policy response

**Endpoint**: `POST /v2/compliance/policy-builder/suggested-response/action`
**Summary**: Apply an action to an AI-suggested policy response
**Tags**: compliance

Records the reviewer's decision on an AI-generated suggested response for a compliance policy detail question. Supported actions: PENDING (defer), IGNORED (dismiss the suggestion), AMEND (use the suggestion as a starting point for edits), or USE_RESPONSE (accept the suggestion as-is). Returns the updated suggested response including its new action and status. Use after AI prefill completes to let the user triage each suggestion before finalizing the policy. Scoped to the authenticated customer; returns 404 if the suggested response does not belong to that customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Suggested response not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/compliance/policy-builder/suggested-response/{suggested_response_id}/attachment — Download Policy Builder Suggested Response Attachment Endpoint

**Endpoint**: `GET /v2/compliance/policy-builder/suggested-response/{suggested_response_id}/attachment`
**Summary**: Download Policy Builder Suggested Response Attachment Endpoint
**Tags**: compliance

**Parameters**:
- `suggested_response_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
