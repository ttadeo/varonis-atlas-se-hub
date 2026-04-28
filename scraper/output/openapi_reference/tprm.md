# tprm API Endpoints

## GET /v1/control-plane/tprm/categories - Get Tprm Service Categories

**Endpoint**: `GET /v1/control-plane/tprm/categories`
**Summary**: Get Tprm Service Categories
**Tags**: tprm

**Responses**:
- `200`: Successful Response

---

## POST /v1/control-plane/tprm/vendor - Create Tprm Service Audit

**Endpoint**: `POST /v1/control-plane/tprm/vendor`
**Summary**: Create Tprm Service Audit
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor - Delete Vendor

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor`
**Summary**: Delete Vendor
**Tags**: tprm

**Parameters**:
- `vendor_id` (query, required): The UUID of the vendor to delete

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/reassessment-service-audit - Reassessment Service Audit

**Endpoint**: `POST /v1/control-plane/tprm/reassessment-service-audit`
**Summary**: Reassessment Service Audit
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/upload-policy-attachment - Upload Policy Attachment

**Endpoint**: `POST /v1/control-plane/tprm/upload-policy-attachment`
**Summary**: Upload Policy Attachment
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/delete-policy-attachment/{attachment_id} - Delete Policy Attachment

**Endpoint**: `DELETE /v1/control-plane/tprm/delete-policy-attachment/{attachment_id}`
**Summary**: Delete Policy Attachment
**Tags**: tprm

**Parameters**:
- `attachment_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/update-issue-status/{issue_id} - Update Issue And Vendor Status

**Endpoint**: `POST /v1/control-plane/tprm/update-issue-status/{issue_id}`
**Summary**: Update Issue And Vendor Status
**Tags**: tprm

**Parameters**:
- `issue_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/update-vendor - Update Vendor

**Endpoint**: `POST /v1/control-plane/tprm/update-vendor`
**Summary**: Update Vendor
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v1/control-plane/tprm/vendors - Fetch Vendors

**Endpoint**: `GET /v1/control-plane/tprm/vendors`
**Summary**: Fetch Vendors
**Tags**: tprm, internal

**Responses**:
- `200`: Successful Response

---

## GET /v1/control-plane/tprm/vendor/{vendor_name} - Fetch Vendor By Name

**Endpoint**: `GET /v1/control-plane/tprm/vendor/{vendor_name}`
**Summary**: Fetch Vendor By Name
**Tags**: tprm, internal

**Parameters**:
- `vendor_name` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-resource-status - Update Resource Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-resource-status`
**Summary**: Update Resource Status
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/bulk-update-resource-status - Bulk Update Resource Status

**Endpoint**: `PUT /v1/control-plane/tprm/bulk-update-resource-status`
**Summary**: Bulk Update Resource Status
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-vendor-issue-status - Update Vendor Issue Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-vendor-issue-status`
**Summary**: Update Vendor Issue Status
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-review-status - Update Review Status

**Endpoint**: `PUT /v1/control-plane/tprm/update-review-status`
**Summary**: Update Review Status
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/bulk-update-review-status - Bulk Update Review Status

**Endpoint**: `PUT /v1/control-plane/tprm/bulk-update-review-status`
**Summary**: Bulk Update Review Status
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor-resource - Delete Vendor Resource

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor-resource`
**Summary**: Delete Vendor Resource
**Tags**: tprm

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/update-tier-frequency - Update Tier Frequency Api

**Endpoint**: `PUT /v1/control-plane/tprm/update-tier-frequency`
**Summary**: Update Tier Frequency Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## PUT /v1/control-plane/tprm/vendor-reassessment-override - Update Vendor Reassessment Override Api

**Endpoint**: `PUT /v1/control-plane/tprm/vendor-reassessment-override`
**Summary**: Update Vendor Reassessment Override Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v1/control-plane/tprm/vendor-reassessment-override - Create Vendor Reassessment Override Api

**Endpoint**: `POST /v1/control-plane/tprm/vendor-reassessment-override`
**Summary**: Create Vendor Reassessment Override Api
**Tags**: tprm

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---

## DELETE /v1/control-plane/tprm/vendor-reassessment-override/{vendor_id} - Delete Vendor Reassessment Override Api

**Endpoint**: `DELETE /v1/control-plane/tprm/vendor-reassessment-override/{vendor_id}`
**Summary**: Delete Vendor Reassessment Override Api
**Tags**: tprm

**Parameters**:
- `vendor_id` (path, required): 

**Responses**:
- `204`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/risk-analysis-question - Risk Analysis Question

**Endpoint**: `POST /v2/tprm/risk-analysis-question`
**Summary**: Risk Analysis Question
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/submit-risk-analysis-questionnaire - Submit Risk Analysis Questionnaire Api

**Endpoint**: `POST /v2/tprm/submit-risk-analysis-questionnaire`
**Summary**: Submit Risk Analysis Questionnaire Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/save-risk-analysis-questionnaire - Save Risk Analysis Questionnaire Api

**Endpoint**: `POST /v2/tprm/save-risk-analysis-questionnaire`
**Summary**: Save Risk Analysis Questionnaire Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/external/risk-analysis-question - External Risk Analysis Question

**Endpoint**: `POST /v2/tprm/external/risk-analysis-question`
**Summary**: External Risk Analysis Question
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/external/submit-risk-analysis-questionnaire - External Submit Risk Analysis Questionnaire Api

**Endpoint**: `POST /v2/tprm/external/submit-risk-analysis-questionnaire`
**Summary**: External Submit Risk Analysis Questionnaire Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/external/save-risk-analysis-questionnaire - External Save Risk Analysis Questionnaire Api

**Endpoint**: `POST /v2/tprm/external/save-risk-analysis-questionnaire`
**Summary**: External Save Risk Analysis Questionnaire Api
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/vendor-agreement - Create Vendor Agreement And Extract Obligations

**Endpoint**: `POST /v2/tprm/vendor-agreement`
**Summary**: Create Vendor Agreement And Extract Obligations
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/tprm/vendor-agreement - Get Vendor Agreement And Obligations

**Endpoint**: `GET /v2/tprm/vendor-agreement`
**Summary**: Get Vendor Agreement And Obligations
**Tags**: tprm

**Parameters**:
- `vendor_id` (query, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## DELETE /v2/tprm/vendor-agreement/{agreement_id} - Delete Vendor Agreement And Obligations

**Endpoint**: `DELETE /v2/tprm/vendor-agreement/{agreement_id}`
**Summary**: Delete Vendor Agreement And Obligations
**Tags**: tprm

**Parameters**:
- `agreement_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/requirement-question-response - Save Tprm Requirement Question Response

**Endpoint**: `POST /v2/tprm/requirement-question-response`
**Summary**: Save Tprm Requirement Question Response
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/external/requirement-question-response - External Save Tprm Requirement Question Response

**Endpoint**: `POST /v2/tprm/external/requirement-question-response`
**Summary**: External Save Tprm Requirement Question Response
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/tprm/external/vendor/{service_audit_id} - Get External Vendor From Service Audit

**Endpoint**: `GET /v2/tprm/external/vendor/{service_audit_id}`
**Summary**: Get External Vendor From Service Audit
**Tags**: tprm

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/tprm/vendor/{service_audit_id} - Get Vendor From Service Audit

**Endpoint**: `GET /v2/tprm/vendor/{service_audit_id}`
**Summary**: Get Vendor From Service Audit
**Tags**: tprm

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/external/upload-bom - Upload Bom

**Endpoint**: `POST /v2/tprm/external/upload-bom`
**Summary**: Upload Bom
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/tprm/bom/{service_audit_id}/exists - Check Bom Exists

**Endpoint**: `GET /v2/tprm/bom/{service_audit_id}/exists`
**Summary**: Check Bom Exists
**Tags**: tprm, internal

**Parameters**:
- `service_audit_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## POST /v2/tprm/suggested-response/action - Apply Tprm Suggested Response Action Endpoint

**Endpoint**: `POST /v2/tprm/suggested-response/action`
**Summary**: Apply Tprm Suggested Response Action Endpoint
**Tags**: tprm

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---

## GET /v2/tprm/suggested-response/{suggested_response_id}/attachment - Download Tprm Suggested Response Attachment Endpoint

**Endpoint**: `GET /v2/tprm/suggested-response/{suggested_response_id}/attachment`
**Summary**: Download Tprm Suggested Response Attachment Endpoint
**Tags**: tprm

**Parameters**:
- `suggested_response_id` (path, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
