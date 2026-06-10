# Atlas Learning Platform — UI

Next.js frontend for the Atlas Learning Platform. Deployed to Vercel at [atlas-learning-platform.vercel.app](https://atlas-learning-platform.vercel.app).

See the [root README](../README.md) for full platform documentation.

---

## Local Development

```bash
npm install
cp .env.local.example .env.local  # fill in required vars (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Required Environment Variables

```bash
# n8n webhooks
NEXT_PUBLIC_N8N_WEBHOOK_URL=        # atlas-rag-query
N8N_ARCHITECT_WEBHOOK_URL=          # atlas-architect
N8N_GUIDES_WEBHOOK_URL=             # atlas-guide-producer

# Upstash Redis (async guide job results)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# Auth
SESSION_SECRET=                     # JWT signing key (32+ char random string)
RESEND_API_KEY=                     # OTP email
USERS=                              # user:password pairs for non-OTP access

# LLMs (server-side only)
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Neo4j (direct bolt connection for some routes)
NEO4J_URI=
NEO4J_USER=
NEO4J_PASSWORD=
```

---

## API Routes

All routes under `app/api/` require a valid `atlas_session` JWT cookie via `requireAuth()` in `lib/auth.ts`, except the auth endpoints themselves.

| Route | Method | Purpose |
|---|---|---|
| `/api/guides` | POST | Fire n8n guide generation, returns `jobId` |
| `/api/guides/status` | GET | Poll guide completion from Upstash KV |
| `/api/guides/callback` | POST | Legacy callback (no longer used — n8n writes direct to KV) |
| `/api/architect` | POST | Architecture Builder via n8n |
| `/api/chat` | POST | General Q&A via n8n |
| `/api/sme/chat` | POST | SME-first chat via n8n |
| `/api/sme/topics` | GET | Topic list from Neo4j |
| `/api/auth/send-otp` | POST | Send OTP email (public) |
| `/api/auth/verify-otp` | POST | Verify OTP, issue session cookie (public) |

---

## Key Files

- `lib/auth.ts` — shared `requireAuth()` JWT helper. Use for every new API route.
- `app/guides/page.tsx` — Guide Producer UI with fire-and-poll logic
- `app/architect/page.tsx` — Architecture Builder
- `app/knowledge/page.tsx` — SME Knowledge Base
- `app/runtime/page.tsx` — AI Runtime Demo
- `vercel.json` — function `maxDuration` overrides for long-running routes
