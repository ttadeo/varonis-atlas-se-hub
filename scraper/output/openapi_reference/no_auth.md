# no-auth API Endpoints

## POST /services/collector/raw — Cloudflare Log Push Splunk Format

**Endpoint**: `POST /services/collector/raw`
**Summary**: Cloudflare Log Push Splunk Format
**Tags**: no-auth

Endpoint that mimics Splunk log push format from Cloudflare

**Parameters**:
- `channel` (query, required): 
- `sourcetype` (query, optional): 
- `authorization` (header, required): 

**Responses**:
- `200`: Successful Response
- `422`: Validation Error

---
