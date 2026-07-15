# Atlas Learning Platform — Neo4j Schema Reference

**Last Updated:** 2026-07-15  
**Database:** Neo4j at `192.168.1.165:7687`  
**Access from Vercel:** `bolt://7.tcp.ngrok.io:23280`  
**Access from n8n:** `https://uncompendious-unpurchased-shanita.ngrok-free.dev/db/neo4j/tx/commit`

---

## 1. Node Labels

| Label | Count (v3.5.0) | Source | Purpose |
|---|---|---|---|
| `Chunk` | 2,609 | `ingestion/ingest_to_neo4j.py` | Atlas documentation chunks (also called DocChunk in prose) |
| `Chunk` | 1,028 | `ingestion/ingest_openapi.py` | Atlas OpenAPI endpoint chunks (same label, distinguished by `section = "openapi_reference"`) |
| `Section` | ~10 | both ingest scripts | Top-level grouping by doc section |
| `Page` | ~60 | both ingest scripts | Individual doc pages |
| `SMEKnowledge` | 102 | `scraper/ingest_teams_sme.py` | Field-validated Q&A from Varonis AI Security SME Teams channel |
| `LearnedQA` | grows | `ui/app/api/ask/route.ts` | High-quality Q&A pairs auto-stored from `/ask` interactions |
| `UIPage` | ~486 | separate ingestion | Atlas UI navigation pages (used for "how do I navigate to…" queries) |

> **Note:** `Chunk` is the actual Neo4j label. The codebase sometimes refers to these as `DocChunk` in comments and documentation — they are the same node type.

---

## 2. Node Schemas

### `Chunk` — Atlas Documentation

Created/updated by `ingestion/ingest_to_neo4j.py` (docs) and `ingestion/ingest_openapi.py` (OpenAPI).

```
(Chunk {
  id:          String  -- stable ID: "{file_slug}__{heading_slug}__{per_file_index}"
                       -- for OpenAPI: "openapi__{heading_slug}__{global_index}"
  heading:     String  -- section heading (h2 or h3 text, or page title for intros)
  level:       String  -- "intro" | "h2" | "h3" | "endpoint" (OpenAPI chunks use "endpoint")
  text:        String  -- section body text (markdown); release notes chunks enriched by patch script
  embedding:   Float[] -- 1536-dim OpenAI text-embedding-3-small vector
  title:       String  -- parent page title
  section:     String  -- top-level section (see Section Names below)
  url:         String  -- source URL of the page
  file:        String  -- relative path from scraper/output/ (e.g. "applications/ai_gateway.md")

  -- OpenAPI chunks only --
  api_method:  String  -- HTTP method ("GET", "POST", "DELETE", etc.)
  api_path:    String  -- API path (e.g. "/v1/projects/{id}")
})
```

**Embedding input (docs):** `"{heading}\n\n{text}"` — content-anchored for most chunks.

**Exception — release notes:** Top-level "What's New in VX.X.X" chunks are re-embedded by `scraper/patch_release_notes_chunks.py` after every doc scrape. The embedding uses **the heading only** (`"What's New in V3.5.0 — release notes new features changelog"`) while the stored text is enriched with all feature sub-chunk content. This is the **query-anchored embedding technique** — retrieval matches version queries; Claude reads full feature detail.

**Section Names (valid values for `section` filter):**

| Section | Contents |
|---|---|
| `applications` | AI Gateway, AI Monitor product docs |
| `overview` | Platform overview, architecture |
| `platform_services` | Core services documentation |
| `competitive` | Competitive intelligence |
| `faq` | Frequently asked questions |
| `release_notes` | What's New per version |
| `openapi_reference` | REST API endpoint reference |

---

### `Section`

```
(Section {
  name:  String  -- section identifier (e.g. "applications", "release_notes")
})
```

---

### `Page`

```
(Page {
  url:     String  -- unique identifier (source URL)
  title:   String  -- page title
  section: String  -- parent section name
  file:    String  -- relative path in scraper/output/
})
```

---

### `SMEKnowledge` — Teams SME Q&A

Created/updated by `scraper/ingest_teams_sme.py`. MERGE key: `thread_id`.

```
(SMEKnowledge {
  thread_id:        String   -- unique ID derived from Teams message ID (ms Unix timestamp)
  question:         String   -- the field question
  answer:           String   -- validated field answer
  topic:            String   -- category (see Topic Values below)
  confidence:       String   -- "sme_validated" | "community_consensus" | "tentative" | "incomplete"
  key_contributors: String[] -- author list (often ["Unknown"] — Teams MCAS proxy hides names)
  date_sensitive:   Boolean  -- true if answer may become stale with product releases
  notes:            String   -- caveats, follow-up context, or "" if none
  source:           String   -- always "teams_ai_security_sme"
  raw_date:         String   -- derived from Teams message ID (ISO-ish date)
  processed_at:     String   -- pipeline run timestamp
  embedding:        Float[]  -- 1536-dim vector
})
```

**Embedding input:** question text + topic (e.g. `"How does Atlas handle MCP? Topic: gateway_architecture"`) — **question-anchored** so incoming user queries match semantically. The answer text is NOT embedded.

**Topic Values:**

| Topic | Count |
|---|---|
| `gateway_architecture` | 14 |
| `deployment` | 14 |
| `guardrails` | 12 |
| `discovery` | 12 |
| `roadmap` | 5 |
| `competitive` | 4 |
| `other` | 4 |
| `shadow_ai` | 3 |
| `licensing` | 3 |
| `compliance` | 3 |
| `ide_support` | 2 |
| `pii_detection` | 1 |

---

### `LearnedQA` — Auto-stored Community Knowledge

Created by `ui/app/api/ask/route.ts` (fire-and-forget, non-blocking). MERGE key: `id` (UUID).

```
(LearnedQA {
  id:        String  -- randomUUID() — new node per Q&A pair (not deduplicated)
  question:  String  -- the user's question
  answer:    String  -- Claude's final answer
  userId:    String  -- SE email address from JWT session
  score:     Float   -- Haiku quality score (0.0–1.0); only stored if >= 0.7
  storedAt:  String  -- ISO timestamp
  embedding: Float[] -- 1536-dim vector, embedded on question only (query-anchored)
})
```

**Quality gate:** Before storing, Claude Haiku scores the Q&A pair 0.0–1.0. Only pairs scoring ≥ 0.7 are written to Neo4j. This prevents low-quality or hallucinated answers from polluting the knowledge base.

**Index creation:** `learned_qa_embeddings` index is created idempotently (`IF NOT EXISTS`) on first write — it does not need to be pre-created.

---

### `UIPage` — Atlas UI Navigation

Separate ingestion pipeline (not in this repo's ingest scripts). Used by `/ask` and `/meeting` for "how do I navigate to…" queries.

```
(UIPage {
  friendly_name:          String   -- human-readable page name
  path:                   String   -- Atlas UI URL path
  navigation_description: String   -- description of what the page does
  embedding:              Float[]  -- 1536-dim vector
})
```

---

## 3. Relationships

| Relationship | Pattern | Properties | Created By |
|---|---|---|---|
| `CONTAINS` | `(Section)-[:CONTAINS]->(Page)` | none | `ingest_to_neo4j.py`, `ingest_openapi.py` |
| `HAS_CHUNK` | `(Page)-[:HAS_CHUNK]->(Chunk)` | none | `ingest_to_neo4j.py`, `ingest_openapi.py` |
| `RELATED_TO` | `(SMEKnowledge)-[:RELATED_TO {score}]->(Chunk)` | `score: Float` (cosine similarity) | `ingest_teams_sme.py` |

**`RELATED_TO` creation:** During SMEKnowledge ingestion, the question embedding is used to find the top-3 most similar `Chunk` nodes (`atlas_chunk_embeddings`, score > 0.75). A `RELATED_TO` edge is created to each. This is the bridge that lets `/ask` and `/meeting` retrieve SME knowledge by traversing from matching doc chunks.

---

## 4. Indexes

### Vector Indexes

| Index Name | Label | Property | Dimensions | Similarity | Used By |
|---|---|---|---|---|---|
| `atlas_chunk_embeddings` | `Chunk` | `embedding` | 1536 | cosine | `/ask`, `/meeting`, n8n RAG, SME RELATED_TO lookup |
| `learned_qa_embeddings` | `LearnedQA` | `embedding` | 1536 | cosine | `/ask` (LearnedQA retrieval) |
| `ui_page_embeddings` | `UIPage` | `embedding` | 1536 | cosine | `/ask`, `/meeting` (UI navigation queries) |

> **Note:** `SMEKnowledge` nodes have an `embedding` property but are **not** searched directly by vector index in the Next.js routes. Instead, they are reached by traversing `RELATED_TO` edges from matching `Chunk` nodes. The n8n `atlas-sme-query` workflow may query SMEKnowledge directly — check the n8n canvas for the index name it uses.

### Full-Text Indexes

| Index Name | Label | Fields | Used By |
|---|---|---|---|
| `atlas_chunk_text` | `Chunk` | `text`, `heading`, `title` | `/ask`, `/meeting` keyword search |

**Lucene sanitization:** Before querying `atlas_chunk_text`, all Lucene special characters (`+ - & | ! ( ) { } [ ] ^ " ~ * ? : \ /`) are replaced with spaces. This is applied in both `/api/ask/route.ts` and `/api/meeting/route.ts` via the `escapeLucene()` function.

---

## 5. Retrieval Strategies by Feature

### `/ask` — 5 Parallel Queries

```cypher
-- 1. Vector search (primary RAG)
CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 12, $embedding)
YIELD node, score
WHERE score > 0.45
RETURN node.heading, node.text, node.title, node.section, score
ORDER BY score DESC

-- 2. Full-text keyword search
CALL db.index.fulltext.queryNodes('atlas_chunk_text', $query)
YIELD node, score
WHERE score > 0.5
RETURN node.heading, node.text, node.title, node.section, score
ORDER BY score DESC LIMIT 8

-- 3. UI navigation
CALL db.index.vector.queryNodes('ui_page_embeddings', 4, $embedding)
YIELD node, score
WHERE score > 0.5
RETURN node.friendly_name, node.path, node.navigation_description, score
ORDER BY score DESC

-- 4. SME knowledge (via RELATED_TO traversal)
CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 10, $embedding)
YIELD node AS chunk, score
MATCH (sme:SMEKnowledge)-[:RELATED_TO]->(chunk)
RETURN sme.question, sme.answer, sme.topic, sme.confidence, score
ORDER BY score DESC LIMIT 5

-- 5. LearnedQA (community knowledge from previous /ask sessions)
CALL db.index.vector.queryNodes('learned_qa_embeddings', 5, $embedding)
YIELD node, score
WHERE score > 0.6
RETURN node.question, node.answer, score
ORDER BY score DESC LIMIT 3
-- Falls back silently if learned_qa_embeddings index doesn't exist yet
```

**Merge logic:** Vector results ranked first, then full-text results deduplicated by heading. Top 10 doc chunks forwarded to Claude. UI navigation, SME, and LearnedQA appended as clearly labeled sections.

**Context format passed to Claude:**

```
[Page Title › Heading]
{text}

---

--- ATLAS UI NAVIGATION ---
[UI Navigation › Page Name]
URL path: /path
{navigation_description}

--- FIELD KNOWLEDGE (AI Security SME Channel) ---
Q: {question}
A: {answer}
_(Topic: {topic} · Confidence: {confidence})_

--- PREVIOUSLY ANSWERED (Community Knowledge) ---
Q: {question}
A: {answer}
```

---

### `/meeting` — 4 Parallel Queries (same as /ask minus LearnedQA)

Identical to `/ask` queries 1–4. LearnedQA is not retrieved in the meeting co-pilot.

---

### n8n `atlas-rag-query` (powers `/learn` and `/ask` via n8n path)

```cypher
-- Single vector search only (simpler than /ask direct route)
CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 5, $embedding)
YIELD node, score
RETURN node.heading, node.text, node.title, node.section, node.url, score
```

Retrieved context is passed to Claude via system prompt inside `<retrieved_documentation>` XML tags (groundedness fix, 2026-07-14).

**Mode-aware behavior:**
- `mode = "learn"` → curriculum-first system prompt; retrieved docs are reference material
- `mode = "ask"` → strict grounding; only answer from retrieved chunks

---

### n8n `atlas-sme-query` (powers `/knowledge` SME chat)

```
1. Embed question
2. SMEKnowledge vector search — top-5, score > 0.6
3. DocChunk (atlas_chunk_embeddings) vector search — top-3, score > 0.5
4. Claude (SME-first system prompt: field knowledge over docs)
```

---

### n8n `atlas-guide-producer` (powers `/guides`)

```
1. Embed use case description
2. DocChunk vector search — top-10
3. SMEKnowledge — top-6 via RELATED_TO edges from matched DocChunks
4. Claude (prompt: surface SME notes as "Field Note" callouts)
```

---

## 6. Ingestion Pipelines

### Atlas Docs Pipeline (run after every doc scrape)

```bash
# Order matters — patch must run after ingest
python ingestion/ingest_to_neo4j.py        # chunks markdown → Chunk nodes
python scraper/patch_release_notes_chunks.py  # fix release note top-level chunks
```

**Chunk generation logic (`ingest_to_neo4j.py`):**
- Splits each markdown file at `##` and `###` headings
- Preserves intro text before the first heading as a separate "intro" level chunk
- Stable `id` = `{file_slug}__{heading_slug}__{per_file_index}` (per-file index prevents ID collision when new files are added)
- Embeds `"{heading}\n\n{text}"` — content-anchored

**Release notes patch (`patch_release_notes_chunks.py`):**
- Finds all `Chunk` nodes where `heading = title` and `title STARTS WITH "What's New in"`
- Merges all sub-chunk content into the top-level chunk's `text` field
- Re-embeds using query-anchored text: `"What's New in VX.X.X — release notes new features changelog"`
- Result: retrieval matches version queries; Claude has full feature list to answer from

### OpenAPI Pipeline

```bash
python ingestion/ingest_openapi.py         # reads scraper/output/openapi_reference/chunks_index.json
```

- Same `Chunk` label as docs; distinguished by `section = "openapi_reference"` and `level = "endpoint"`
- Adds `api_method` and `api_path` properties (not present on doc chunks)
- ID format: `openapi__{heading_slug}__{global_index}`

### SME Teams Pipeline (incremental, run after each Teams scrape)

```bash
echo "1" | python scraper/ingest_teams_sme.py   # option 1 = MERGE (safe for re-runs)
```

- MERGE by `thread_id` — idempotent, won't duplicate on re-runs
- Creates `RELATED_TO` edges to top-3 matching `Chunk` nodes (score > 0.75)
- **Full replace option** (option 2): deletes all `SMEKnowledge` nodes then re-ingests

### LearnedQA (automatic, no manual step)

- Written by `/api/ask/route.ts` on every high-quality `/ask` response
- Quality gate: Haiku scores Q&A pair; only score ≥ 0.7 stored
- `learned_qa_embeddings` vector index created automatically on first write

---

## 7. Cleanup / Re-ingestion

```bash
# Wipe all Chunk and Page nodes (Sections preserved)
python ingestion/cleanup_neo4j.py   # prompts for "yes" confirmation

# Then re-ingest in order:
python ingestion/ingest_to_neo4j.py
python ingestion/ingest_openapi.py
python scraper/patch_release_notes_chunks.py

# SMEKnowledge is NOT deleted by cleanup_neo4j.py — it's managed separately
# LearnedQA is NOT deleted by cleanup_neo4j.py — grows continuously
```

**What cleanup_neo4j.py deletes:** All `Chunk` and `Page` nodes and their relationships.  
**What it preserves:** `Section`, `SMEKnowledge`, `LearnedQA`, `UIPage` nodes.

---

## 8. Graph Structure Diagram

```
(Section)
    │
    [:CONTAINS]
    │
    ▼
 (Page)
    │
    [:HAS_CHUNK]
    │
    ▼
 (Chunk) ◄──────────────────────── (SMEKnowledge)
  ▲  ▲                                   │
  │  │   atlas_chunk_embeddings index    [:RELATED_TO {score}]
  │  │   atlas_chunk_text fulltext index  │
  │  └───────────────────────────────────┘
  │
  │   learned_qa_embeddings index
  │
(LearnedQA)

(UIPage)
  ▲
  │   ui_page_embeddings index
```

---

## 9. Adding a New Node Type — Checklist

1. **Define schema** — list all properties and their types
2. **Choose embedding strategy** — content-anchored (embed the text) or query-anchored (embed what users will ask)
3. **Create vector index** — `CREATE VECTOR INDEX {name} IF NOT EXISTS FOR (n:{Label}) ON (n.embedding) OPTIONS {indexConfig: {\`vector.dimensions\`: 1536, \`vector.similarity_function\`: 'cosine'}}`
4. **Write ingestion script** — use `MERGE` on a stable unique key (never `CREATE`)
5. **Add retrieval** — add a parallel query in `/api/ask/route.ts` and/or relevant n8n workflow
6. **Document** — update this file and ARCHITECTURE.md §8

---

## 10. Common Cypher Queries

```cypher
-- Count all node types
MATCH (n) RETURN labels(n) AS label, count(n) AS count ORDER BY count DESC;

-- List all indexes
SHOW INDEXES;

-- Find a specific chunk by heading keyword
MATCH (c:Chunk) WHERE c.heading CONTAINS 'IBAC' RETURN c.title, c.heading, c.section LIMIT 10;

-- Browse SMEKnowledge by topic
MATCH (n:SMEKnowledge) WHERE n.topic = 'gateway_architecture'
RETURN n.question, n.confidence ORDER BY n.confidence;

-- Inspect RELATED_TO edges for an SME node
MATCH (sme:SMEKnowledge)-[r:RELATED_TO]->(c:Chunk)
WHERE sme.thread_id = '{thread_id}'
RETURN sme.question, c.heading, r.score ORDER BY r.score DESC;

-- Count LearnedQA by user
MATCH (n:LearnedQA) RETURN n.userId, count(n) AS stored ORDER BY stored DESC;

-- Find OpenAPI chunks for a specific method
MATCH (c:Chunk) WHERE c.section = 'openapi_reference' AND c.api_method = 'POST'
RETURN c.api_path, c.heading LIMIT 20;

-- Vector search (useful for testing retrieval quality directly in Neo4j Browser)
-- (requires an embedding vector — use Python to generate one first)
CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 5, $embedding)
YIELD node, score
RETURN node.title, node.heading, score ORDER BY score DESC;
```
