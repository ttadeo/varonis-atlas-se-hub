# Part 3: Chunk Design — The Decision That Actually Matters
### A Practical Guide for the Varonis SE Team

---

## The Assumption Everyone Gets Wrong

When teams build a RAG system, the first conversation is almost always about the model.

*Which LLM should we use? GPT-4 or Claude? Do we need a bigger model? Would a fine-tuned model perform better?*

This is the wrong conversation. The model is the last place to look when a RAG system underperforms — and the last place you'll find leverage when it does. The Atlas Learning Platform proved this across 18 lessons, 38 golden questions, and multiple iterations: every performance failure we encountered was a **knowledge base problem**, not a model problem. The model was never the bottleneck.

The real decisions happen earlier, before the model ever sees a single prompt. They happen when you decide how to cut your documents into pieces.

This is chunk design. And it matters more than any other single decision in a RAG system.

> **The Atlas Connection:** Chunk design is a RAG architecture concern — but the parallel in Atlas's world is policy design. An Atlas policy that's too broad catches everything, including legitimate traffic, and generates alert fatigue. A policy that's too narrow misses real threats. A policy with the wrong vocabulary matches the wrong patterns. The Atlas guardrail authoring process faces exactly the same trade-offs as RAG chunk design: scope, granularity, and vocabulary. The discipline of thinking carefully about boundaries and specificity applies to both.

---

## What a Chunk Actually Is

A **chunk** is the unit of retrieval in a RAG system.

When a user asks a question, the system doesn't search the entire knowledge base at once — it searches for the chunks most similar to the question, retrieves the top results (we use top-5), and hands those chunks to the model as context. The model then generates its answer based only on what those chunks contain.

This means chunks are what the model sees. Not your documents. Not your website. Not your API spec. Chunks.

```
User question → vector embedding → similarity search → top-5 chunks retrieved → model reads chunks → answer generated
```

If the relevant information isn't in one of those five chunks — because it was merged into a larger chunk alongside unrelated content, because it was split across a chunk boundary, or because the chunk uses different vocabulary than the question — the model generates its answer without it. No amount of prompt engineering compensates for a retrieval miss.

The chunk is the atomic unit of knowledge in a RAG system. Design it wrong and everything downstream degrades.

---

## The Three Failure Modes of Bad Chunking

### Failure 1: Chunks That Are Too Large

The most intuitive approach to chunking is also the worst: split your document into large sections and call each section a chunk. The logic seems sound — more content per chunk means more context for the model.

The problem is retrieval dilution. When a chunk covers three different topics, it gets a single vector embedding that represents the average of all three. A question about any one of those topics will produce a weak similarity match against that averaged embedding, even though the relevant content is technically in the chunk.

The model retrieves five chunks. If your chunks are large and cover multiple topics, those five chunks could contain 15 different topics. The model now has to synthesize across a sprawling context and figure out what's actually relevant. GR drops. AR drops. The answer gets muddier.

**The rule:** Each chunk should cover one concept, one topic, one endpoint. When in doubt, split.

### Failure 2: Chunks That Are Too Small

The opposite failure is equally damaging. If you split too aggressively — one sentence per chunk, or arbitrary character counts — you strip the context that makes individual sentences meaningful.

Consider this sentence in isolation: *"The MODIFY action triggers re-evaluation against all active policies."* What is MODIFY? What kind of policies? What happens if re-evaluation fails?

Without context, that chunk retrieves correctly for "what does MODIFY do" — but the model receives a sentence that can't be turned into a useful answer. GR collapses because the model has to speculate about the context the chunk is missing.

**The rule:** A chunk must be self-contained. A reader who sees only that chunk — with no other context — should be able to understand what it's describing.

### Failure 3: Chunks at the Wrong Boundaries

This is the subtlest failure, and the one most teams never diagnose.

Every document has natural structure: headings, sections, API endpoint definitions, numbered lists. These boundaries exist because they reflect how the author organized the information — each section is a conceptual unit. Arbitrary chunking (split every N characters, split every N tokens) ignores this structure entirely. Chunks end in the middle of explanations, split numbered lists across two chunks, and merge the tail of one concept with the opening of the next.

The result: neither chunk contains a complete thought. Both retrieve weakly. The model pieces together partial information from both and produces a low-GR answer.

**The rule:** Chunk at semantic boundaries, not character boundaries. Respect the structure of the source document.

> **The Atlas Connection:** The three chunking failures map directly to a challenge Atlas customers face when configuring policy scope. A policy that's too broad (Failure 1) generates alert fatigue — everything matches, the signal is useless. A policy that's too narrow (Failure 2) misses context and fires on fragments that look dangerous in isolation but aren't. A policy at the wrong boundary (Failure 3) splits a legitimate interaction in a way that makes it look like a violation. Atlas's policy design process — scoping rules to specific applications, specific user groups, specific content types — is chunk design applied to security governance.

---

## How We Designed Our Chunks

The Atlas Learning Platform ingests two fundamentally different types of content, and each required a different chunking strategy.

### Strategy 1: Section-Based Chunks for Documentation

The Atlas documentation is organized into pages, and each page is organized into sections with clear headings. Our scraper — a Playwright-authenticated crawler — captured this structure and used it as the chunking boundary.

Each chunk corresponds to one section of one documentation page. Not one page (too large). Not one paragraph (potentially too small). One section — the unit the documentation authors themselves identified as a coherent conceptual unit.

Each chunk was stored with metadata alongside the content:
- **source** — which documentation page it came from
- **section** — the heading of the section within that page
- **chunk_id** — a stable identifier for the chunk

This metadata does two things: it enables filtered retrieval (find chunks only from the Applications section), and it provides the model with provenance — where the information came from — which is useful for grounding responses.

Result: 37 documentation pages → 251 chunks. Average 6-7 chunks per page, each covering a distinct concept.

### Strategy 2: Endpoint-Level Chunks for the OpenAPI Spec

The Atlas API has hundreds of endpoints. These could have been chunked in several ways:
- One giant chunk containing the entire API spec (catastrophic — retrieval dilution)
- Chunks grouped by API category (better, but still too mixed)
- One chunk per endpoint (what we did)

Each API endpoint became its own chunk, containing the path, HTTP method, description, parameters, and response schema. When a student asks "how do I retrieve the list of AI applications Atlas has discovered?" — the search retrieves exactly the endpoint chunk for that operation, and the model has everything it needs to answer.

Result: 895 endpoint chunks. Every endpoint is independently retrievable. A question about any single API operation retrieves that operation's chunk directly, without noise from surrounding endpoints.

> **The Atlas Connection:** The endpoint-per-chunk strategy mirrors how Atlas's AI Inventory works. Atlas doesn't track "AI systems in general" — it tracks individual AI models, individual endpoints, individual applications with their specific configurations, permissions, and risk profiles. Granularity at the object level is what makes governance actionable. Chunking at the endpoint level is what makes API knowledge retrievable. Same principle: the unit of governance (and retrieval) should match the unit of decision-making.

---

## The Ingestion Pipeline

Once chunk boundaries are defined, the ingestion pipeline handles the mechanical process of getting chunks into Neo4j. Ours is a four-stage pipeline:

```
Stage 1: Scrape
Playwright scraper → authenticated crawl of Atlas docs
parse_openapi.py → pull and parse the OpenAPI spec

Stage 2: Clean and Chunk
Extract section-by-section structure from each page
One chunk object per section / per endpoint
Attach metadata (source, section, type)

Stage 3: Vectorize
OpenAI text-embedding-3-small → 1536-dimension embedding per chunk
Each chunk now has: text content + embedding vector + metadata

Stage 4: Store
ingest_to_neo4j.py → write each chunk as a Neo4j node
Node properties: content, embedding, source, section, chunk_id
Neo4j creates vector index → enables cosine similarity search at query time
```

The entire pipeline runs locally, and the scraper handles authentication — credentials never leave the machine. For Atlas customers, this matters: content that requires authentication to access can still be ingested into a private knowledge base, without credentials or sensitive content being transmitted to a third-party service.

**At query time:**
```
User question → OpenAI embedding API → 1536-dimension vector
Neo4j vector search → cosine similarity against all chunk embeddings
Top-5 closest chunks returned → passed to Claude as context
```

The knowledge base currently holds **1,410 chunks** (251 doc chunks + 895 OpenAPI chunks + 264 supplemental hand-authored chunks). Every query searches across all of them in milliseconds.

---

## Why We Hand-Authored 264 Supplemental Chunks

The scraper captured the official documentation. But the official documentation has gaps.

When our evaluations found CR=0 failures — questions where the knowledge base had no relevant content — we didn't re-scrape or reconfigure the pipeline. We wrote the missing content by hand, using the vocabulary the golden questions used, and ingested it as additional chunks.

These supplemental chunks serve a specific purpose that scraped content cannot: they answer the questions users actually ask, in the words users actually use, even when the official documentation uses different terminology.

**Example:** The official Atlas documentation refers to the customer-side infrastructure as the "Data Plane." Our golden question asked about the "customer plane" — the terminology an SE might use when explaining the architecture to a customer who is thinking of it from their own perspective. The scraper captured "Data Plane" extensively. It captured "customer plane" zero times.

The fix was a hand-authored bridging chunk that opens: *"The Data Plane is also called the 'customer plane' because it runs in the customer's environment, not Varonis's. These two terms mean the same thing."* After ingestion, CR for that question went from 0.0 to 1.0.

**The principle:** Your knowledge base must use the vocabulary your users will use. Scraped content uses the vocabulary the authors used. When those diverge, write the bridge.

This is also why the second group of supplemental chunks was created specifically for the platform — detailed reference documents on guardrail types, agentic AI controls, and pen test categories. The Atlas documentation covers these topics at a high level. The questions SEs need to answer in customer conversations go deeper. The supplemental chunks were written to that depth, using the specific terminology that shows up in customer conversations.

---

## Chunk Design vs. Model Selection: The Evidence

Here is the strongest argument for prioritizing chunk design over model selection: every performance improvement we achieved came from changes to the knowledge base, not changes to the model.

| Intervention | Type | Score Change |
|---|---|---|
| Add TPRM doc | New chunk | 0.635 → 0.894 |
| Add Deployment Options doc | New chunk | 0.444 → 0.956 |
| Add Observability audit trail doc | New chunk | 0.678 → 0.936 |
| Add competitive positioning doc | New chunk | 0.705 → 0.919 |
| Add vocabulary bridge (customer plane) | New chunk | CR: 0.0 → 1.0 |
| Add guardrail reference doc | New chunk | L6: 0.857 → 0.915 |

In every case, the model stayed the same. Claude claude-sonnet-4-6. The same embeddings model. The same retrieval configuration. The same prompt template.

The knowledge base changed. Scores improved dramatically.

A better model reading bad chunks would have produced slightly better-worded wrong answers. The same model reading well-designed chunks produced scores in the 0.90–0.96 range across previously failing lessons.

**The implication:** Before you upgrade your model, audit your chunks. If you have CR failures, fix the knowledge base. If you have vocabulary mismatches, write bridging content. If you have chunking boundary problems, re-ingest with better boundaries. The model is almost never the bottleneck.

> **The Atlas Connection:** This principle applies directly to how customers approach Atlas deployments. The instinct is often to tune the AI model — adjust the temperature, change the system prompt, switch to a more capable LLM. But in most cases, the failure isn't the model. It's that the model has access to data it shouldn't, or lacks the policy context it needs, or is operating with permissions that are too broad. Atlas addresses this at the policy and governance layer — the equivalent of chunk design in the RAG world. Fix what the model sees and what it's allowed to do before you change the model itself.

---

## How the Pipeline Scales

The 1,410-chunk knowledge base we built is a starting point. Atlas's documentation will grow. New features will ship. New customer questions will surface that the current knowledge base can't answer.

Here is the scaling approach we designed into the pipeline from the start:

**Incremental ingestion:** The pipeline is built to add to the knowledge base, not rebuild it. New documents can be ingested without re-processing existing chunks. New Atlas features get a new set of section-based chunks; existing content is untouched.

**Eval-gated updates:** No new content enters the knowledge base without a corresponding eval run. After ingestion, re-run the relevant lessons. If scores go up or stay flat, keep the content. If scores go down, investigate before the change reaches production users. This is the same evaluation-driven development loop from Part 2, applied to ongoing maintenance.

**Scheduled re-scraping:** The Atlas documentation changes when Varonis ships new features. The scraper is configured to re-crawl the full documentation, which can be run on a schedule (we target end-of-week) to pick up any changes. Re-scraping re-ingests changed pages as updated chunks, keeping the knowledge base current.

**Gap-driven authoring:** When evaluation surfaces a new CR=0 failure — which happens when the platform is asked a question type that wasn't in the original golden question set — that's a signal to write a new supplemental chunk. The eval failure becomes the specification for new content.

The pipeline compounds: more content, better coverage, higher scores, more questions the platform can answer correctly. Each iteration makes the next one more targeted.

---

## Key Takeaways

1. **The model is the last place to look.** Every performance failure in the Atlas Learning Platform was a knowledge base problem. Chunk design is where leverage actually lives.

2. **Chunk at semantic boundaries, not character boundaries.** One section per chunk for documentation. One endpoint per chunk for APIs. Respect the structure the content authors already built.

3. **Each chunk must be self-contained.** A chunk that requires surrounding context to be understood will generate low-GR answers. If it can't stand alone, it's not a good chunk.

4. **Write for the vocabulary your users use, not the vocabulary your authors used.** When terminology diverges, write a bridging chunk that explicitly equates the two. Vocabulary mismatch is the silent CR killer.

5. **Hand-authored supplemental content is not a workaround — it's a strategy.** Scraped content captures what's documented. Supplemental content captures what's actually asked. Both are necessary in a knowledge base that's meant to serve real conversations.

6. **Every knowledge base update should pass an eval before it goes live.** Add content, ingest, run the relevant lessons, check scores. This is not optional overhead — it's the discipline that separates a reliable AI system from one that occasionally works.

7. **The chunking problem in RAG and the policy scoping problem in Atlas are the same problem.** Too broad means noise. Too narrow means gaps. Wrong boundaries mean missed connections. The discipline of designing precise, well-scoped, vocabulary-matched units of knowledge applies whether you're building a knowledge base or configuring a guardrail policy.

---

*The Atlas Learning Platform is now evaluated, deployed, and in active use. This three-part series covers the full arc: what trustworthy AI looks like (Part 1), how to diagnose and fix failures (Part 2), and why chunk design is the decision that determines everything else (Part 3). The same principles — measurement, iteration, vocabulary precision, and content design — are what Atlas applies at runtime to every AI system it governs in a customer environment.*
