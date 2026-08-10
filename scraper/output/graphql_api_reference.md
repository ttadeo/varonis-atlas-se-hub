---
title: GraphQL API Reference
url: https://prod.alltrue-be.com/_docs/docs/
section: 
---

# GraphQL API Reference

- [](/_docs/)- GraphQL Reference- GraphQL API ReferenceExport PDFOn this page# GraphQL API Reference
## About Our GraphQL API[​](#about-our-graphql-api)
The GraphQL API is built using [Strawberry](https://strawberry.rocks/), a Python GraphQL library. GraphQL operations are served over HTTP, so you can interact with the API using standard HTTP requests against the versioned endpoints below.

## API Versions[​](#api-versions)
Two API versions are available:

- **V1 API (Default)** — the broad, stable, fully-featured surface at `/v1/graphql`.
- **V2 API (Preview)** — a narrower, newer surface at `/v2/graphql` that focuses on specific product capabilities and is still in active development.

Both versions are Strawberry-backed HTTP GraphQL endpoints. V1 exposes the full default query surface; V2 currently exposes a focused subset and does not yet include all the functionality available in V1.

**Note**: The V2 API is still in preview and does not yet include all the functionality available in V1.

## Making Requests[​](#making-requests)
Here is how to send a simple `ping` query in several languages. GraphQL operations require authentication: send your access token as a Bearer token on each `POST`, and the request will be authorized per operation before it executes.

- cURL- Python- JavaScript```
curl -X POST \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
 -d '{"query": "query { ping }"}' \
 https://YOUR_ATLAS_TENANT_HOST/v1/graphql

``````
import requests

url = "https://YOUR_ATLAS_TENANT_HOST/v1/graphql"
headers = {
 "Content-Type": "application/json",
 "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
query = """
query {
 ping
}
"""

response = requests.post(url, json={"query": query}, headers=headers)
print(response.json())

``````
fetch('https://YOUR_ATLAS_TENANT_HOST/v1/graphql', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
 },
 body: JSON.stringify({
 query: `
 query {
 ping
 }
 `,
 }),
})
 .then(response =&gt; response.json())
 .then(data =&gt; console.log(data));

```
Issuing an authenticated `GET` against the same endpoint opens the embedded schema explorer for that version; `POST` requests execute operations and are authorized per operation.

## Interactive GraphQL Explorer[​](#interactive-graphql-explorer)
The embedded GraphQL explorer below provides version-aware tabs that load the V1 and V2 Strawberry-backed schema explorers directly from your tenant. Use it to browse the available schema for each version. If the docs deployment is not configured to point at a control-plane host, the page renders a configuration warning instead of the live explorer.

- V1 API (Default)- V2 API (Preview)[PreviousUsing the Atlas APIs](/_docs/docs/api/usage_and_limits)[NextWhat's New in V3.7.0](/_docs/docs/release_notes/370)- [About Our GraphQL API](#about-our-graphql-api)- [API Versions](#api-versions)- [Making Requests](#making-requests)- [Interactive GraphQL Explorer](#interactive-graphql-explorer)
