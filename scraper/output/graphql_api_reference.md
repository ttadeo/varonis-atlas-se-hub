---
title: GraphQL API Reference
url: https://prod.alltrue-be.com/_docs/docs/
section: 
---

# GraphQL API Reference

- [](/_docs/)- GraphQL Reference- GraphQL API ReferenceOn this page# GraphQL API Reference
## About Our GraphQL API[​](#about-our-graphql-api)
Our GraphQL API is built using [Strawberry](https://strawberry.rocks/), a Python GraphQL library. We serve GraphQL queries over REST endpoints, allowing you to interact with our API using standard HTTP requests.

### API Versions[​](#api-versions)
We currently offer two API versions:

- **V1 API (Default)**: The stable, fully-featured API - `/v1/graphql`
- **V2 API (Preview)**: Our newer API (work in progress) - `/v2/graphql`

**Note**: The V2 API is still in preview and does not yet include all the functionality available in V1.

## Making Requests[​](#making-requests)
Here's how to make a simple query to our `ping` operation using different languages. Most endpoints require authentication with a Bearer token:

- cURL- Python- JavaScript```
curl -X POST \
 -H "Content-Type: application/json" \
 -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
 -d '{"query": "query { ping }"}' \
 https://YOUR_ALLTRUE_TENANT_HOST/v1/graphql

``````
import requests

url = "https://YOUR_ALLTRUE_TENANT_HOST/v1/graphql"
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
fetch('https://YOUR_ALLTRUE_TENANT_HOST/v1/graphql', {
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
Use the sidebar to browse the types, queries, and mutations available in this schema.

## Interactive GraphQL Explorer[​](#interactive-graphql-explorer)
Below you'll find our embedded GraphiQL explorer powered by Strawberry. This interactive tool allows you to:

- Browse the complete schema documentation
- Construct and test GraphQL queries in real-time
- View query results instantly
- Access autocomplete suggestions based on the schema
- Explore available types, queries, and mutations

- V1 API (Default)- V2 API (Preview)[PreviousAI Investigation Handbook](/_docs/docs/handbooks/ai_investigation_handbook)[NextWhat's New in V3.4.0](/_docs/docs/release_notes/340)- [About Our GraphQL API](#about-our-graphql-api)[API Versions](#api-versions)- [Making Requests](#making-requests)- [Interactive GraphQL Explorer](#interactive-graphql-explorer)
