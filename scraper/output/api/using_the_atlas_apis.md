---
title: Using the Atlas APIs
url: https://prod.alltrue-be.com/_docs/docs/api/usage_and_limits
section: api
---

# Using the Atlas APIs

- [](/_docs/)- Using the Atlas APIsExport PDFOn this page# Using the Atlas APIs
The [OpenAPI API Reference](/_docs/api/openapi) describes every operation the Atlas APIs expose — its paths, its request schema, and its response shape. This page covers what a schema cannot express: how many requests you may send, how many items one request may carry, and what Atlas returns when you go past either.

Read it before you write a script that touches thousands of records. Rate limits are enforced on every authenticated request and appear nowhere in the operation schema. The separate per-request item caps apply only to bulk operations that declare one, and those you can read off the operation's schema.

## How Atlas API rate limits work[​](#how-atlas-api-rate-limits-work)
Every authenticated request to the Atlas APIs is counted against a request allowance.

Three things about how the counting works determine how you should pace a client:

- **Each operation is counted on its own.** The allowance applies per operation, not across the API as a whole. There is no single total quota for your tenant, and spending the allowance on one operation does not reduce what is available on another.
- **The window rolls.** Requests age out continuously rather than resetting on a fixed clock boundary, so capacity returns gradually as older requests fall outside the window.
- **The allowance belongs to the tenant, not to you.** Everyone in your tenant draws on the same allowance for a given operation. Two people running the same script at the same time split it between them, and each will see roughly half the throughput they would see alone. A token issued to an application rather than to a named person counts as a single caller on the allowances that are tracked per user.

Allowances are the same for every tenant. There is no per-tenant configuration and no mechanism to raise them, so build pacing into the client rather than planning around an exception.

To authenticate in the first place, see [Getting Started with API Calls](/_docs/docs/platform_services/api).

## Request limits[​](#request-limits)
Which allowance applies depends on what the operation does:

Operation typePer secondPer minutePer hourRead operations30600—Mutations10100—Long-running job operations220500Long-running job operations, per user110250
For a REST operation, use its HTTP method as the rule of thumb. Read-shaped operations — `GET` — get the higher allowance. Mutations — `POST`, `PUT`, `PATCH`, `DELETE` — get the lower one. (GraphQL is classified per operation instead; see [GraphQL operations](#graphql-operations).)

The exception is operations that start a long-running job, such as launching a scan. Those are lower again — and lower than the mutation allowance — so the mutation figures are **not** a safe fallback for them. They are also counted per individual user as well as per tenant.

**When you are not sure, assume the mutation allowance** for ordinary reads and writes, and check the long-running-job row before automating anything that kicks off a job.

A few history-heavy read operations over large event sets carry a lower allowance than the read figure above. If a script reads event history in volume and sees throttling sooner than the table suggests, that is why — pace it down and honor the retry interval described below.

## When you exceed a limit[​](#when-you-exceed-a-limit)
Atlas responds with HTTP `429` and a JSON body:

```
{
 "error_ref": "ERR-a3f9b2c1e4d567f0",
 "status_code": 429,
 "error_type": "rate_limit_exceeded",
 "detail": "Rate limit exceeded. Try again later.",
 "extras": {
 "retry_after_seconds": 12
 }
}

```
The response carries a `Retry-After` header giving the number of whole seconds until capacity is available again, never less than 1. The same number appears in the body under `extras.retry_after_seconds`.

```
HTTP/1.1 429 Too Many Requests
Retry-After: 12

```
`Retry-After` is the only rate-limit header Atlas returns. There is no header reporting your remaining allowance or when the window resets, so a client should treat `Retry-After` as its sole signal and not attempt to track headroom from the response.

**Wait the advertised interval before retrying.** Retrying immediately, or in a tight loop, consumes allowance that has not yet been released and extends the period during which calls fail.

Where an operation carries both a per-second and a per-minute allowance, the response reflects whichever window is exhausted at that moment — so the interval may be a second or two on a burst, or most of a minute on sustained volume.

`error_ref` is a stable reference for the specific error. Quote it when contacting support and it can be correlated with the server-side record.

This contract applies to the REST APIs. For GraphQL, see [GraphQL operations](#graphql-operations) below.

## Per-request limits on bulk endpoints[​](#per-request-limits-on-bulk-endpoints)
Bulk operations carry a second limit that has nothing to do with the rate limit. The rate limit counts requests over time; this one counts items inside a single request.

Most bulk operations cap how many items one request body may carry, and **the cap differs from operation to operation**. Some examples:

Bulk operationMaximum items per requestBulk resource update (`bulkUpdateResourceInstances`)100 resource IDsBulk posture issue update300 issue IDsBulk user operations — invitations, deletes, role, project and organization assignment100 itemsTool-capability classification50 resource IDs
The caps are not uniform, and some bulk operations declare no item cap at all. Do not assume a number: read the operation's request schema in the [OpenAPI API Reference](/_docs/api/openapi), which gives the exact maximum for the operation you are calling.

Exceeding a cap returns HTTP `422` with `error_type` `validation_error`, and no `Retry-After` header:

```
{
 "status_code": 422,
 "error_type": "validation_error",
 "detail": "List should have at most 100 items after validation, not 40000"
}

```
**Waiting will not clear a `422`.** Unlike a `429`, this is a statement about the request you sent, not about how often you sent it. Split the payload into smaller batches and send them as separate requests.

## Pacing a large job[​](#pacing-a-large-job)
Suppose you need to update 40,000 resources.

**The approach that fails.** A loop calling the single-resource update operation once per resource issues 40,000 requests. That operation carries the mutation allowance, shared across your tenant, and an unpaced loop meets the per-second ceiling first: it can start receiving `429` after roughly 10 calls in a single second. Paced under that, it gets about 100 through inside the first minute and then every further call in the window returns `429`. Either way it stops far short of 40,000.

**The approach that works.** The bulk resource update operation accepts up to 100 resource IDs per request. That turns 40,000 resources into 400 requests instead of 40,000. At the mutation allowance of 100 requests per minute, 400 requests is about four minutes of steady-state work.

Note the two hundreds in that example are unrelated limits that happen to share a number:

- **100 mutation requests per minute** is the rate limit. Exceed it and you get `429`, and waiting clears it.
- **100 resource IDs per request** is the payload cap on that one operation. Exceed it and you get `422`, and waiting does not help.

Combining both gives a theoretical ceiling of 10,000 resources per minute — 100 IDs per request across 100 requests. Treat that as a ceiling, not a target, and pace below it.

In practice:

- Keep well under 10 requests per second and 100 requests per minute for mutations.
- Honor `Retry-After` whenever a `429` arrives, rather than retrying on a fixed interval of your own.
- Size each batch from the operation's own schema, not from another operation's cap.
- Remember the allowance is shared. If a colleague runs the same job at the same time, both jobs slow down.

## GraphQL operations[​](#graphql-operations)
Each operation on the V1 GraphQL API has its own allowance, counted per operation in the same way a REST operation is counted, using the same numbers as the table above. See the GraphQL Reference, listed in the sidebar, for the endpoint and request shape.

GraphQL and REST counters are independent. Calling the same logical operation over both surfaces draws on two separate allowances rather than one shared one.

A rate-limited GraphQL call returns HTTP `429` and surfaces as a GraphQL error rather than the JSON error envelope the REST APIs return:

```
{
 "errors": [
 { "message": "429 Rate limit exceeded. Try again later." }
 ]
}

```
**A GraphQL response carries no `Retry-After` header.** A GraphQL client must apply its own back-off — wait before retrying, and lengthen the wait if the error repeats.

## Related[​](#related)

- [OpenAPI API Reference](/_docs/api/openapi) — every operation, its request schema, and its per-operation item caps.
- [Getting Started with API Calls](/_docs/docs/platform_services/api) — creating an API key and exchanging it for a JWT.
- GraphQL Reference (in the sidebar) — the GraphQL endpoint and request shape.
[PreviousAWS AI Security Handbook](/_docs/docs/handbooks/aws_ai_security_handbook)[NextGraphQL API Reference](/_docs/docs/)- [How Atlas API rate limits work](#how-atlas-api-rate-limits-work)- [Request limits](#request-limits)- [When you exceed a limit](#when-you-exceed-a-limit)- [Per-request limits on bulk endpoints](#per-request-limits-on-bulk-endpoints)- [Pacing a large job](#pacing-a-large-job)- [GraphQL operations](#graphql-operations)- [Related](#related)
