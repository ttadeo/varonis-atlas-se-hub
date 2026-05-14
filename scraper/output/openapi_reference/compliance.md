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

## GET /v1/control-plane/compliance/frameworks — Get Frameworks

**Endpoint**: `GET /v1/control-plane/compliance/frameworks`
**Summary**: Get Frameworks
**Tags**: compliance

**Parameters**:
- `audit_supported` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/audit — Create Audit Project

**Endpoint**: `POST /v1/control-plane/compliance/audit`
**Summary**: Create Audit Project
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/audit/risk-levels — Get Audit Risk Levels

**Endpoint**: `POST /v1/control-plane/compliance/audit/risk-levels`
**Summary**: Get Audit Risk Levels
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id} — Delete Audit Project

**Endpoint**: `DELETE /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}`
**Summary**: Delete Audit Project
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `audit_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}/terminate — Terminate Audit Project

**Endpoint**: `POST /v1/control-plane/compliance/customer/{customer_id}/audit/{audit_id}/terminate`
**Summary**: Terminate Audit Project
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/compliance/issue — Update Compliance Issue

**Endpoint**: `PUT /v1/control-plane/compliance/issue`
**Summary**: Update Compliance Issue
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/update-issue-status/{issue_id} — Update Compliance Issue Status

**Endpoint**: `POST /v1/control-plane/compliance/update-issue-status/{issue_id}`
**Summary**: Update Compliance Issue Status
**Tags**: compliance

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents — Get Compliance Policy Docs

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents`
**Summary**: Get Compliance Policy Docs
**Tags**: compliance

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

## GET /v1/control-plane/compliance/policy-documents/missing — Get Missing Policy Documents

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/missing`
**Summary**: Get Missing Policy Documents
**Tags**: compliance

This endpoint retrieves a list of missing policy documents that are required under active regulatory frameworks. It checks the stored policy documents in the database and identifies which required documents are missing.

**Parameters**:
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/requirement-analysis — Run Policy Documents Requirement Analysis

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/requirement-analysis`
**Summary**: Run Policy Documents Requirement Analysis
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `202`: Successful Response
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

## POST /v1/control-plane/compliance/policy-documents/{doc_id}/approve — Approve Compliance Policy Document

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/{doc_id}/approve`
**Summary**: Approve Compliance Policy Document
**Tags**: compliance

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-documents/{doc_id}/archive — Archive Compliance Policy Document

**Endpoint**: `POST /v1/control-plane/compliance/policy-documents/{doc_id}/archive`
**Summary**: Archive Compliance Policy Document
**Tags**: compliance

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents/check-conflicts — Check Upload Conflicts

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/check-conflicts`
**Summary**: Check Upload Conflicts
**Tags**: compliance

**Parameters**:
- `compliance_policy_type_id` (query, required): 
- `project_ids` (query, optional): 
- `organization_ids` (query, optional): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/policy-documents/{doc_id}/usage — Get Document Usage Endpoint

**Endpoint**: `GET /v1/control-plane/compliance/policy-documents/{doc_id}/usage`
**Summary**: Get Document Usage Endpoint
**Tags**: compliance

**Parameters**:
- `doc_id` (path, required): 

**Responses**:
- `200`: Successful Response
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

## GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files — Get Knowledge Base Files

**Endpoint**: `GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files`
**Summary**: Get Knowledge Base Files
**Tags**: compliance

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

## GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/latest — Get Latest Knowledge Base Files

**Endpoint**: `GET /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/latest`
**Summary**: Get Latest Knowledge Base Files
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `organization_id` (query, optional): Filter by organization ID
- `project_id` (query, optional): Filter by project ID
- `status` (query, optional): Filter by status

**Responses**:
- `200`: Successful Response
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

## PATCH /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id} — Update Knowledge Base File

**Endpoint**: `PATCH /v1/control-plane/compliance/customers/{customer_id}/knowledge-base-files/{knowledge_base_file_id}`
**Summary**: Update Knowledge Base File
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `knowledge_base_file_id` (path, required): 

**Request Body**: Optional
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/upload-policy-attachment — Upload Policy Attachment

**Endpoint**: `POST /v1/control-plane/compliance/upload-policy-attachment`
**Summary**: Upload Policy Attachment
**Tags**: compliance

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/knowledge-base/{customer_id}/files/{kb_file_id} — Remove Knowledge Base Files

**Endpoint**: `DELETE /v1/control-plane/compliance/knowledge-base/{customer_id}/files/{kb_file_id}`
**Summary**: Remove Knowledge Base Files
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `kb_file_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/create-meeting/{audit_id} — Create Meeting

**Endpoint**: `POST /v1/control-plane/compliance/create-meeting/{audit_id}`
**Summary**: Create Meeting
**Tags**: compliance

**Parameters**:
- `audit_id` (path, required): 

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/meetings/{audit_id} — Get Meetings

**Endpoint**: `GET /v1/control-plane/compliance/meetings/{audit_id}`
**Summary**: Get Meetings
**Tags**: compliance

**Parameters**:
- `audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/compliance/meeting-artifacts/{analysis_meeting_id} — Get Meeting Artifacts

**Endpoint**: `GET /v1/control-plane/compliance/meeting-artifacts/{analysis_meeting_id}`
**Summary**: Get Meeting Artifacts
**Tags**: compliance

**Parameters**:
- `analysis_meeting_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/analyze-video-evidence — Analyze Video Evidence

**Endpoint**: `POST /v1/control-plane/compliance/analyze-video-evidence`
**Summary**: Analyze Video Evidence
**Tags**: compliance, internal

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/risk-questionnaire — Risk Questionnaire

**Endpoint**: `POST /v1/control-plane/compliance/risk-questionnaire`
**Summary**: Risk Questionnaire
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/submit-questionnaire — Submit Questionnaire

**Endpoint**: `POST /v1/control-plane/compliance/submit-questionnaire`
**Summary**: Submit Questionnaire
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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

## POST /v1/control-plane/compliance/requirement-question/mark-not-required — Mark Requirement Question Not Required

**Endpoint**: `POST /v1/control-plane/compliance/requirement-question/mark-not-required`
**Summary**: Mark Requirement Question Not Required
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/suggested-response/action — Apply Suggested Response Action Endpoint

**Endpoint**: `POST /v1/control-plane/compliance/suggested-response/action`
**Summary**: Apply Suggested Response Action Endpoint
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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

## POST /v1/control-plane/compliance/unlink-policy-document — Unlink Policy Document

**Endpoint**: `POST /v1/control-plane/compliance/unlink-policy-document`
**Summary**: Unlink Policy Document
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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

## DELETE /v1/control-plane/compliance/additional-document/{additional_document_id} — Delete Additional Document

**Endpoint**: `DELETE /v1/control-plane/compliance/additional-document/{additional_document_id}`
**Summary**: Delete Additional Document
**Tags**: compliance

**Parameters**:
- `additional_document_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/create-policy-template — Create Policy Template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/create-policy-template`
**Summary**: Create Policy Template
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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

## POST /v1/control-plane/compliance/policy-builder/upload-attachment — Upload Policy Builder Attachment

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/upload-attachment`
**Summary**: Upload Policy Builder Attachment
**Tags**: compliance

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/approve-document — Approve Compliance Policy Template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/approve-document`
**Summary**: Approve Compliance Policy Template
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/policy-builder/archive-document — Archive Compliance Policy Template

**Endpoint**: `POST /v1/control-plane/compliance/policy-builder/archive-document`
**Summary**: Archive Compliance Policy Template
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/framework-questionnaire — Framework Questionnaire

**Endpoint**: `POST /v1/control-plane/compliance/framework-questionnaire`
**Summary**: Framework Questionnaire
**Tags**: compliance

Stateless function to evaluate the questionnaire. Generates questions and evaluates user responses.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/save-framework-questionnaire — Save Framework Questionnaire

**Endpoint**: `POST /v1/control-plane/compliance/save-framework-questionnaire`
**Summary**: Save Framework Questionnaire
**Tags**: compliance

Saves user questionnaire responses to the database along with the questionnaire tags

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/create-compliance-atlas-policies — Create Compliance Atlas Policies

**Endpoint**: `POST /v1/control-plane/compliance/create-compliance-atlas-policies`
**Summary**: Create Compliance Atlas Policies
**Tags**: compliance

Create compliance atlas policies in the database.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/compliance/update-compliance-atlas-policy — Update Compliance Atlas Policy

**Endpoint**: `PUT /v1/control-plane/compliance/update-compliance-atlas-policy`
**Summary**: Update Compliance Atlas Policy
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/compliance/delete-compliance-atlas-policy/customer_id/{customer_id}/atlas_policy_id/{atlas_policy_id} — Delete Compliance Atlas Policy

**Endpoint**: `DELETE /v1/control-plane/compliance/delete-compliance-atlas-policy/customer_id/{customer_id}/atlas_policy_id/{atlas_policy_id}`
**Summary**: Delete Compliance Atlas Policy
**Tags**: compliance

**Parameters**:
- `customer_id` (path, required): 
- `atlas_policy_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/compliance/compliance-atlas-policy-check — Compliance Policy Check

**Endpoint**: `POST /v1/control-plane/compliance/compliance-atlas-policy-check`
**Summary**: Compliance Policy Check
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/background-question — Background Question

**Endpoint**: `POST /v2/compliance/policy-builder/background-question`
**Summary**: Background Question
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/save-background-questionnaire — Save Background Questionnaire

**Endpoint**: `POST /v2/compliance/policy-builder/save-background-questionnaire`
**Summary**: Save Background Questionnaire
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/submit-background-questionnaire — Submit Background Questionnaire

**Endpoint**: `POST /v2/compliance/policy-builder/submit-background-questionnaire`
**Summary**: Submit Background Questionnaire
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/background-question/reset — Reset Background Question

**Endpoint**: `POST /v2/compliance/policy-builder/background-question/reset`
**Summary**: Reset Background Question
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/detail-response — Create Detail Response

**Endpoint**: `POST /v2/compliance/policy-builder/detail-response`
**Summary**: Create Detail Response
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/compliance/policy-builder/prefill-status/{policy_template_id} — Get Prefill Status

**Endpoint**: `GET /v2/compliance/policy-builder/prefill-status/{policy_template_id}`
**Summary**: Get Prefill Status
**Tags**: compliance

**Parameters**:
- `policy_template_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/compliance/policy-builder/suggested-response/action — Apply Policy Builder Suggested Response Action Endpoint

**Endpoint**: `POST /v2/compliance/policy-builder/suggested-response/action`
**Summary**: Apply Policy Builder Suggested Response Action Endpoint
**Tags**: compliance

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
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
