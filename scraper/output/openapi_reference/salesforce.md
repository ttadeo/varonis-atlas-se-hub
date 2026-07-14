# salesforce API Endpoints

## POST /v1/salesforce/credentials — Submit Salesforce ECA service-principal credentials

**Endpoint**: `POST /v1/salesforce/credentials`
**Summary**: Submit Salesforce ECA service-principal credentials
**Tags**: salesforce, inventory

Submit Salesforce External Client App credentials (consumer key + consumer secret + optional My Domain). The service validates the credentials by attempting a token exchange against Salesforce, then persists the connection so Atlas can discover resources. On invalid credentials or an unrecognised My Domain, returns 400 with a structured ``code`` (e.g. ``invalid_credentials``, ``invalid_domain``).

**Request Body**: Required
- Content-Type: `application/json`

**Responses**:
- `201`: Successful Response
- `422`: Validation Error

---
