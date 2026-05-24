# Security Vulnerability Report & Remediation
**Date:** 2026-05-24  
**Reported by:** Internal security review (Varonis threat response team)  
**Severity:** High  
**Status:** Remediated and deployed

---

## Executive Summary

A security review of the Atlas Learning Platform identified that 19 of 27 API routes were publicly accessible without authentication. Any person with knowledge of the endpoint URLs — authenticated or not — could retrieve sensitive internal data including user email addresses, customer names, meeting session details, and live questions asked by SEs. One route additionally allowed unauthenticated callers to invoke paid AI APIs and fire prompts through the Atlas Gateway.

All vulnerabilities have been remediated as of commit `a43d84d`, deployed to Vercel on 2026-05-24.

---

## Vulnerability Details

### Vulnerability 1 — Unauthenticated Analytics Endpoint (Critical)

**Endpoint:** `GET /api/analytics`  
**CVSS Category:** Broken Access Control (OWASP A01:2021)

**What was exposed:**  
Anyone who called this URL — with no login, no cookie, no credentials of any kind — received the following data in a single JSON response:

- Full list of user email addresses of all SEs who had logged into the platform
- Real customer names from meeting sessions (e.g. company names entered during Meeting Co-Pilot setup)
- Meeting types and industries (Discovery Call, POC Kickoff, Financial Services, Healthcare, etc.)
- Dates and turn counts of all sessions
- The lowest-scoring questions asked across all sessions — verbatim, with context
- Aggregate statistics: total interactions, session counts, confidence score distributions

**Why it was vulnerable:**  
The route handler had no authentication check. It directly queried Neo4j and returned results to any caller:

```typescript
// BEFORE — no auth, fully open
export async function GET() {
  const driver = getNeo4jDriver();
  // ... query Neo4j, return everything
}
```

---

### Vulnerability 2 — 18 Additional Unprotected Routes (High)

The following routes were also missing authentication, enabling unauthenticated access to sensitive functionality:

| Route | Risk |
|---|---|
| `POST /api/ask` | Free access to RAG pipeline — full Atlas knowledge base queries + Anthropic API costs |
| `POST /api/meeting` / `GET` / `DELETE` | Access to meeting session data, history, and deletions |
| `POST /api/learn` | Free n8n workflow invocation + Anthropic API costs |
| `POST /api/judge` | Free AI grading via Anthropic Haiku |
| `POST /api/architect` | Free Architecture Builder via n8n + Anthropic |
| `POST /api/guides` | Free Guide Producer via n8n + Anthropic |
| `POST /api/scrape-customer` | Free customer website scraping + Anthropic summarization |
| `POST /api/extract-context` | Free document extraction via Anthropic |
| `GET /api/resources/[slug]` | Access to internal competitive intelligence documents |
| `POST /api/demo/apply` | Unauthenticated Atlas policy template provisioning |
| `POST /api/demo/discover` | Free Claude-powered template matching via n8n |
| `GET /api/demo/chain` | Full Atlas inventory dump (all resources, dependency graphs, org structure) |
| `GET /api/demo/chain/projects` | All Atlas project IDs and org structure |
| `GET /api/demo/chain/resource` | Individual Atlas resource details |
| `POST /api/demo/chain/search` | Free AI-powered inventory search via Anthropic |
| `GET /api/demo/chain/scenario` | Scenario catalog |
| `POST /api/demo/chain/scenario` | Unauthenticated creation of resources in Atlas inventory |
| `POST /api/demo/runtime/simulate` | Unauthenticated prompt firing through Atlas Gateway (OpenAI API costs + Gateway traffic) |

---

## Root Cause

Authentication was implemented at the **UI page level** (middleware redirects unauthenticated browsers to `/login`) but was **not enforced at the API route level**. This is a classic defense-in-depth failure — the frontend correctly required login, but the backend API had no independent verification.

API routes are directly callable via `curl`, Postman, browser dev tools, or any HTTP client — bypassing the UI layer entirely. The session cookie check existed in only 5 of 27 routes (`/api/users`, `/api/me`, `/api/preferences`, `/api/notifications`, `/api/sessions/share`).

---

## Remediation

### Fix — Shared Authentication Helper

A centralized `requireAuth()` function was created at `ui/lib/auth.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "atlas_session";

export async function requireAuth(
  req: NextRequest
): Promise<{ email: string } | NextResponse> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
    const { payload } = await jwtVerify(cookie, secret);
    const email = payload.email as string;
    if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return { email };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
```

### Fix — Applied to All 19 Routes

Every unprotected route now calls `requireAuth()` as the first operation before any business logic executes:

```typescript
// AFTER — auth enforced at route level
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth; // returns 401 immediately

  // Only reaches here if session is valid
  const driver = getNeo4jDriver();
  // ...
}
```

---

## Why It Is Secure Now

### 1. Server-side verification on every request
Every protected API call now independently verifies the `atlas_session` JWT cookie using the `SESSION_SECRET` environment variable. There is no way to bypass this by manipulating the URL, headers, or request body — the check happens before any other code runs.

### 2. Cryptographically signed tokens
Sessions are HS256 JWTs signed with `SESSION_SECRET` (a Vercel environment variable never committed to code or git). A forged or tampered token will fail `jwtVerify()` and return 401.

### 3. No session state on the server
The JWT is stateless — it contains the user's email and expiry. There is no session store to attack or enumerate. An expired token (8-hour TTL) is rejected automatically by `jwtVerify()`.

### 4. Defense in depth restored
Authentication is now enforced at **both layers**:
- **UI layer**: Next.js middleware redirects unauthenticated browsers to `/login`
- **API layer**: `requireAuth()` in every route handler independently rejects unauthenticated requests

An attacker bypassing the UI (via curl, Postman, etc.) now hits the same authentication wall.

### 5. Centralized — no route left unguarded by mistake
Using a single shared `requireAuth()` helper means any new route added in the future can be protected with two lines of code. There is no per-route reimplementation that could be forgotten or implemented incorrectly.

---

## Routes Left Intentionally Public

The following routes remain unauthenticated by design — they are the login flow itself and must be publicly accessible:

| Route | Reason |
|---|---|
| `POST /api/auth/send-code` | Sends OTP email — must be callable before login |
| `POST /api/auth/verify-code` | Verifies OTP and issues session — must be callable before login |
| `POST /api/auth/superuser` | Superuser password login — must be callable before login |
| `POST /api/auth` | Legacy auth route |

These routes have their own protections: domain restriction (`@varonis.com` only), OTP rate limiting (3 requests per 10 minutes via Upstash Redis), single-use OTP deletion, and hardcoded superuser email validation.

---

## Timeline

| Time | Event |
|---|---|
| 2026-05-22 ~21:22 EDT | Teammate accesses `/api/analytics` and `/api/users` using valid Varonis login |
| 2026-05-24 | Vulnerability reported to platform owner |
| 2026-05-24 | Root cause identified: API routes lack server-side auth |
| 2026-05-24 | `ui/lib/auth.ts` created, all 19 routes patched |
| 2026-05-24 | TypeScript type-check passed, committed and deployed to Vercel (commit `a43d84d`) |

---

## Recommendations Going Forward

1. **New API routes**: Always add `requireAuth()` as the first two lines. Treat it as mandatory, not optional.
2. **Security review cadence**: Periodically audit all files matching `ui/app/api/**/route.ts` and verify `requireAuth` is present in every non-auth handler.
3. **Automated check**: Consider adding a CI lint rule or test that flags any route handler missing the `requireAuth` call.
4. **Neo4j network exposure**: The Neo4j instance is accessible via ngrok tunnel. Confirm ngrok is configured to require auth headers (currently `ngrok-skip-browser-warning` is the only custom header — no ngrok auth token is enforced on the bolt tunnel). Low risk given it requires credentials, but worth reviewing.
