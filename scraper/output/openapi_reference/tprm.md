# tprm API Endpoints

## GET /v1/control-plane/tprm/categories — Get Tprm Service Categories

**Endpoint**: `GET /v1/control-plane/tprm/categories`
**Summary**: Get Tprm Service Categories
**Tags**: tprm

**Responses**:
- `200`: Successful Response

---

## POST /v1/control-plane/tprm/vendor — Onboard a new TPRM vendor and start an audit

**Endpoint**: `POST /v1/control-plane/tprm/vendor`
**Summary**: Onboard a new TPRM vendor and start an audit
**Tags**: tprm

Create a new third-party risk management (TPRM) vendor record and initiate both an external and internal service audit for the specified service category. Use when an agent needs to onboard a new AI vendor into the risk programme for the first time. The request body must include the vendor's master name, service category, importance tier, owner details, and audit frequency. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor — Delete a TPRM vendor and all associated data

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor`
**Summary**: Delete a TPRM vendor and all associated data
**Tags**: tprm

Permanently delete a TPRM vendor record, cascading to all associated audits, resources, policies, and issues for that vendor. This action is irreversible. Use only when a vendor has been fully decommissioned from the customer's AI supply chain and all historical audit data should be purged. Scoped to the token's customer.

**Parameters**:
- `vendor_id` (query, required): The UUID of the vendor to delete

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/reassessment-service-audit — Trigger a TPRM vendor reassessment audit

**Endpoint**: `POST /v1/control-plane/tprm/reassessment-service-audit`
**Summary**: Trigger a TPRM vendor reassessment audit
**Tags**: tprm

Initiate a reassessment audit cycle for an existing TPRM vendor that is in REASSESSMENT_REQUIRED or REASSESSMENT_OVERDUE status. Creates new external and internal audit records and advances the vendor status to UNDER_REVIEW. Use when a periodic review is due or a vendor's risk posture has changed and re-evaluation is required. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/upload-policy-attachment — Upload a policy document attachment for a TPRM policy

**Endpoint**: `POST /v1/control-plane/tprm/upload-policy-attachment`
**Summary**: Upload a policy document attachment for a TPRM policy
**Tags**: tprm

Upload a policy document file (e.g. PDF or Word) to attach to an existing TPRM policy. The file is ingested into the knowledge base and requirement-analysis is triggered asynchronously to match policy text against audit requirements. Returns a job ID to track the background processing. Use when an agent or user needs to provide a vendor's policy document for automated compliance analysis. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/delete-policy-attachment/{attachment_id} — Delete a TPRM policy document attachment

**Endpoint**: `DELETE /v1/control-plane/tprm/delete-policy-attachment/{attachment_id}`
**Summary**: Delete a TPRM policy document attachment
**Tags**: tprm

Permanently delete a specific policy document attachment from a TPRM policy. Also removes the associated file from the knowledge base, stopping it from influencing future requirement-analysis runs. Use when an outdated or incorrect policy document needs to be replaced or removed. Scoped to the token's customer.

**Parameters**:
- `attachment_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Policy attachment not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/update-issue-status/{issue_id} — Update a TPRM issue status and propagate to vendor

**Endpoint**: `POST /v1/control-plane/tprm/update-issue-status/{issue_id}`
**Summary**: Update a TPRM issue status and propagate to vendor
**Tags**: tprm

Update the status of a TPRM issue (e.g. mark as REMEDIATED, ACCEPTED, or OPEN). If the issue is being marked REMEDIATED for the first time, records the optional human-provided remediation comment against the associated requirement question. Vendor and question statuses are propagated automatically by a post-update event. Use when an agent needs to close out or re-open a finding surfaced during a vendor audit. Scoped to the token's customer.

**Parameters**:
- `issue_id` (path, required): 

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `400`: Invalid request parameters
- `404`: Issue not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/update-vendor — Update TPRM vendor metadata and ownership

**Endpoint**: `POST /v1/control-plane/tprm/update-vendor`
**Summary**: Update TPRM vendor metadata and ownership
**Tags**: tprm

Update mutable metadata for an existing TPRM vendor: importance tier, internal owner (via Auth0 user ID), audit frequency, external owner email, and the project the vendor is associated with. Returns the full updated vendor record including resolved owner name and email. Use when reassigning vendor ownership or adjusting review cadence. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v1/control-plane/tprm/vendors — Fetch Vendors

**Endpoint**: `GET /v1/control-plane/tprm/vendors`
**Summary**: Fetch Vendors
**Tags**: tprm, internal

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/tprm/vendor/{vendor_name} — Fetch Vendor By Name

**Endpoint**: `GET /v1/control-plane/tprm/vendor/{vendor_name}`
**Summary**: Fetch Vendor By Name
**Tags**: tprm, internal

**Parameters**:
- `vendor_name` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-resource-status — Update Resource Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-resource-status`
**Summary**: Update Resource Status
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/bulk-update-resource-status — Bulk Update Resource Status

**Endpoint**: `PUT /v1/control-plane/tprm/bulk-update-resource-status`
**Summary**: Bulk Update Resource Status
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-vendor-issue-status — Update Vendor Issue Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-vendor-issue-status`
**Summary**: Update Vendor Issue Status
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-review-status — Update Review Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-review-status`
**Summary**: Update Review Status
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/bulk-update-review-status — Bulk Update Review Status

**Endpoint**: `PUT /v1/control-plane/tprm/bulk-update-review-status`
**Summary**: Bulk Update Review Status
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor-resource — Delete Vendor Resource

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor-resource`
**Summary**: Delete Vendor Resource
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-tier-frequency — Update reassessment frequency for a vendor importance tier

**Endpoint**: `PUT /v1/control-plane/tprm/update-tier-frequency`
**Summary**: Update reassessment frequency for a vendor importance tier
**Tags**: tprm

Update the reassessment frequency (in months) for a specified vendor importance tier (Tier 1-4). This policy applies to all vendors of that tier within the customer's TPRM programme. Use when the organization's risk policy requires changing how often vendors of a given criticality are reassessed. Scoped to the token's customer.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/vendor-reassessment-override — Update Vendor Reassessment Override Api

**Endpoint**: `PUT /v1/control-plane/tprm/vendor-reassessment-override`
**Summary**: Update Vendor Reassessment Override Api
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/vendor-reassessment-override — Create Vendor Reassessment Override Api

**Endpoint**: `POST /v1/control-plane/tprm/vendor-reassessment-override`
**Summary**: Create Vendor Reassessment Override Api
**Tags**: tprm

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor-reassessment-override/{vendor_id} — Delete Vendor Reassessment Override Api

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor-reassessment-override/{vendor_id}`
**Summary**: Delete Vendor Reassessment Override Api
**Tags**: tprm

**Parameters**:
- `vendor_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/risk-analysis-question — Save a response to a TPRM risk-analysis question

**Endpoint**: `POST /v2/tprm/risk-analysis-question`
**Summary**: Save a response to a TPRM risk-analysis question
**Tags**: tprm

Records or updates a vendor risk-analysis question response for the specified service audit. Scoped to the authenticated customer. Call when an assessor needs to answer or revise a single risk-analysis question during an active audit.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/submit-risk-analysis-questionnaire — Submit a completed TPRM risk-analysis questionnaire

**Endpoint**: `POST /v2/tprm/submit-risk-analysis-questionnaire`
**Summary**: Submit a completed TPRM risk-analysis questionnaire
**Tags**: tprm

Marks a risk-analysis questionnaire as submitted for the given service audit, locking responses and triggering downstream risk scoring. Scoped to the authenticated customer. Call after all required question responses have been saved.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Service audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/save-risk-analysis-questionnaire — Save risk analysis questionnaire selections for a service audit

**Endpoint**: `POST /v2/tprm/save-risk-analysis-questionnaire`
**Summary**: Save risk analysis questionnaire selections for a service audit
**Tags**: tprm

Persists the selected risk levels and risk tags for a TPRM service audit, generates the required requirement-analysis questions, and sends an invitation to the external vendor owner to complete the questionnaire. Scoped to the authenticated customer. Use when an assessor configures and launches a risk-analysis questionnaire for a vendor audit.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/external/risk-analysis-question — Save a vendor's response to a risk-analysis question

**Endpoint**: `POST /v2/tprm/external/risk-analysis-question`
**Summary**: Save a vendor's response to a risk-analysis question
**Tags**: tprm

Records or updates a single risk-analysis question response submitted by the external vendor owner assigned to the service audit. Validates that the calling user's email matches the audit's owner email before persisting. Scoped to the authenticated customer. Use when the external vendor is answering questions during their TPRM assessment.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/external/submit-risk-analysis-questionnaire — Submit the vendor's completed risk-analysis questionnaire

**Endpoint**: `POST /v2/tprm/external/submit-risk-analysis-questionnaire`
**Summary**: Submit the vendor's completed risk-analysis questionnaire
**Tags**: tprm

Marks the vendor's risk-analysis questionnaire as submitted for the given service audit, locking responses and triggering downstream risk scoring. Validates that the calling user's email matches the audit's owner email before proceeding. Scoped to the authenticated customer. Call after all required question responses have been saved by the external vendor.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/external/save-risk-analysis-questionnaire — Save vendor's risk questionnaire selections for a service audit

**Endpoint**: `POST /v2/tprm/external/save-risk-analysis-questionnaire`
**Summary**: Save vendor's risk questionnaire selections for a service audit
**Tags**: tprm

Persists the selected risk levels and risk tags for a TPRM service audit as submitted by the external vendor owner. Validates that the calling user's email matches the audit's owner email before proceeding, then generates required requirement-analysis questions. Scoped to the authenticated customer. Use when the external vendor configures their portion of the risk-analysis questionnaire.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/vendor-agreement — Upload a vendor agreement and extract obligations

**Endpoint**: `POST /v2/tprm/vendor-agreement`
**Summary**: Upload a vendor agreement and extract obligations
**Tags**: tprm

Accepts a vendor agreement file (PDF, DOCX, DOC, CSV, or XLSX) for a given vendor, stores it, and asynchronously extracts contractual obligations using AI. Returns the created agreement record immediately; obligation extraction happens in the background. Scoped to the authenticated customer. Use to onboard a vendor agreement into the TPRM workflow before reviewing extracted obligations.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/tprm/vendor-agreement — Get a vendor agreement and its extracted obligations

**Endpoint**: `GET /v2/tprm/vendor-agreement`
**Summary**: Get a vendor agreement and its extracted obligations
**Tags**: tprm

Returns the vendor agreement document metadata and all extracted contractual obligations for the given vendor. Scoped to the authenticated customer. Call when reviewing a third-party vendor's contractual commitments during a TPRM assessment.

**Parameters**:
- `vendor_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `403`: Vendor not found or access denied
- `500`: Unexpected server error
- `422`: Validation Error

---

## DELETE /v2/tprm/vendor-agreement/{agreement_id} — Delete a vendor agreement and all extracted obligations

**Endpoint**: `DELETE /v2/tprm/vendor-agreement/{agreement_id}`
**Summary**: Delete a vendor agreement and all extracted obligations
**Tags**: tprm

Permanently removes the specified vendor agreement document and all associated extracted contractual obligations. Validates that the agreement belongs to the caller's tenant before deleting. Scoped to the authenticated customer. This action is irreversible — use only when the agreement is no longer needed or was uploaded in error.

**Parameters**:
- `agreement_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Vendor agreement not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/requirement-question-response — Save a response to a TPRM requirement analysis question

**Endpoint**: `POST /v2/tprm/requirement-question-response`
**Summary**: Save a response to a TPRM requirement analysis question
**Tags**: tprm

Creates a new response (text and/or file attachment) for a specific requirement analysis question within a TPRM service audit, then re-evaluates whether the question's response requirement is satisfied. If called with no text and no file, returns all existing responses for the question without creating a new one. Scoped to the authenticated customer; restricted to internal audits or guest users.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/external/requirement-question-response — Save a vendor's response to a requirement analysis question

**Endpoint**: `POST /v2/tprm/external/requirement-question-response`
**Summary**: Save a vendor's response to a requirement analysis question
**Tags**: tprm

Creates a new response (text and/or file attachment) for a requirement analysis question within a TPRM service audit, submitted by the external vendor. Validates that the calling user's email matches the audit's owner email before persisting, then re-evaluates question satisfaction. If called with no text and no file, returns existing responses for the question. Scoped to the authenticated customer.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/tprm/external/vendor/{service_audit_id} — Get vendor details for an external service audit

**Endpoint**: `GET /v2/tprm/external/vendor/{service_audit_id}`
**Summary**: Get vendor details for an external service audit
**Tags**: tprm

Returns the third-party vendor record linked to the specified service audit, accessible only to the external vendor owner whose email matches the audit's owner email. Scoped to the authenticated customer. Use when the external vendor needs to retrieve their own vendor details during a TPRM assessment workflow.

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Service audit or vendor not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/tprm/vendor/{service_audit_id} — Get the vendor associated with a TPRM service audit

**Endpoint**: `GET /v2/tprm/vendor/{service_audit_id}`
**Summary**: Get the vendor associated with a TPRM service audit
**Tags**: tprm

Returns the third-party vendor record linked to the specified service audit ID. Scoped to the authenticated customer. Use to retrieve vendor details — name, tier, and metadata — when working with an existing audit context.

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Service audit or vendor not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/external/upload-bom — Upload a vendor Bill of Materials for a service audit

**Endpoint**: `POST /v2/tprm/external/upload-bom`
**Summary**: Upload a vendor Bill of Materials for a service audit
**Tags**: tprm

Accepts a Bill of Materials file uploaded by the external vendor for the specified service audit, parses it to extract vendor resource entries, and returns the resulting resource list. Validates that the calling user's email matches the audit's owner email before processing. Scoped to the authenticated customer. Use to capture a vendor's AI/software inventory as part of TPRM.

**Request Body**: Required
- Content-Type: `multipart/form-data`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/tprm/bom/{service_audit_id}/exists — Check whether a BOM has been uploaded for a service audit

**Endpoint**: `GET /v2/tprm/bom/{service_audit_id}/exists`
**Summary**: Check whether a BOM has been uploaded for a service audit
**Tags**: tprm, internal

Returns a boolean indicating whether a Bill of Materials has been uploaded for the specified service audit. Scoped to the authenticated customer. Use to determine whether the vendor has completed the BOM upload step before proceeding with further TPRM workflow actions.

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Service audit not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## POST /v2/tprm/suggested-response/action — Apply an action to a TPRM AI-suggested response

**Endpoint**: `POST /v2/tprm/suggested-response/action`
**Summary**: Apply an action to a TPRM AI-suggested response
**Tags**: tprm

Accepts or rejects an AI-generated suggested response for a TPRM requirement analysis question. When accepted, the suggested response text is applied to the question's response record. Returns the updated suggested response with its new status and action. Scoped to the authenticated customer. Use when an assessor wants to act on an AI suggestion during the TPRM review workflow.

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `200`: Successful Response
- `400`: Invalid request parameters
- `404`: Suggested response not found
- `500`: Unexpected server error
- `422`: Validation Error

---

## GET /v2/tprm/suggested-response/{suggested_response_id}/attachment — Download Tprm Suggested Response Attachment Endpoint

**Endpoint**: `GET /v2/tprm/suggested-response/{suggested_response_id}/attachment`
**Summary**: Download Tprm Suggested Response Attachment Endpoint
**Tags**: tprm

**Parameters**:
- `suggested_response_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
