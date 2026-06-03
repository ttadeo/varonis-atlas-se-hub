"""
Teams SME Q&A — Neo4j Ingestion
Loads processed Q&A pairs into Neo4j alongside Atlas doc chunks.

Creates SMEKnowledge nodes and links them to related DocChunk nodes
via semantic similarity so RAG retrieves both simultaneously.

Input:  scraper/output/teams_sme/processed_qa_latest.json
Output: Neo4j database (atlas_chunk_embeddings index)

Usage:
    source scraper/scraper-env/bin/activate
    pip install anthropic neo4j
    python scraper/ingest_teams_sme.py
"""

import json
import os
import time
from datetime import datetime
from pathlib import Path

import anthropic
from neo4j import GraphDatabase

# ─── Configuration ────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
NEO4J_URI      = os.environ.get("NEO4J_URI", "bolt://7.tcp.ngrok.io:23280")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "ttadeo123")

INPUT_PATH = Path(__file__).parent / "output" / "teams_sme" / "processed_qa_latest.json"

# Embedding model — same as doc chunks for consistent vector space
EMBED_MODEL = "text-embedding-3-small"

# ─── Embedding ────────────────────────────────────────────────────────────────

def embed_text(client: anthropic.Anthropic, text: str) -> list[float]:
    """
    Generate embedding using OpenAI-compatible endpoint via Anthropic client.

    Note: We use OpenAI embeddings for consistency with existing doc chunks.
    If you have the OpenAI client available, swap this out.
    """
    # Use the openai client if available, otherwise fall back to a stub
    try:
        import openai
        oai = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))
        response = oai.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        return response.data[0].embedding
    except ImportError:
        raise RuntimeError(
            "openai package required for embeddings. "
            "Run: pip install openai"
        )


def make_embedding_text(qa: dict) -> str:
    """
    Create the text to embed for a Q&A pair.

    We embed the QUESTION (not the answer) so vector similarity matches
    incoming user queries to relevant SME knowledge — same technique as
    the query-anchored embedding fix applied to doc chunks.
    """
    parts = [qa.get("question", "")]
    if qa.get("topic") and qa["topic"] != "other":
        parts.append(f"Topic: {qa['topic']}")
    return " ".join(parts)


# ─── Neo4j ────────────────────────────────────────────────────────────────────

CREATE_SME_NODE = """
MERGE (n:SMEKnowledge {thread_id: $thread_id})
SET n.question        = $question,
    n.answer          = $answer,
    n.topic           = $topic,
    n.confidence      = $confidence,
    n.key_contributors = $key_contributors,
    n.date_sensitive  = $date_sensitive,
    n.notes           = $notes,
    n.source          = $source,
    n.raw_date        = $raw_date,
    n.processed_at    = $processed_at,
    n.embedding       = $embedding
RETURN n
"""

LINK_TO_DOC_CHUNKS = """
MATCH (sme:SMEKnowledge {thread_id: $thread_id})
CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 3, $embedding)
YIELD node AS chunk, score
WHERE score > 0.75
MERGE (sme)-[:RELATED_TO {score: score}]->(chunk)
"""

DELETE_SME_NODES = """
MATCH (n:SMEKnowledge)
DETACH DELETE n
"""

COUNT_SME_NODES = """
MATCH (n:SMEKnowledge)
RETURN count(n) AS count
"""


def ingest_qa_pairs(driver, client_anthropic, qa_pairs: list[dict]):
    """Ingest Q&A pairs into Neo4j with embeddings."""
    with driver.session() as session:
        for i, qa in enumerate(qa_pairs):
            print(f"  [{i+1:3d}/{len(qa_pairs)}] {qa['topic']:20s} | {qa['question'][:60]}...", end=" ")

            try:
                # Generate embedding for the question
                embed_text_str = make_embedding_text(qa)
                embedding = embed_text(client_anthropic, embed_text_str)

                # Upsert SMEKnowledge node
                session.run(
                    CREATE_SME_NODE,
                    thread_id=qa["thread_id"],
                    question=qa["question"],
                    answer=qa["answer"],
                    topic=qa["topic"],
                    confidence=qa["confidence"],
                    key_contributors=qa.get("key_contributors", []),
                    date_sensitive=qa.get("date_sensitive", False),
                    notes=qa.get("notes", ""),
                    source=qa.get("source", "teams_ai_security_sme"),
                    raw_date=qa.get("raw_date", ""),
                    processed_at=qa.get("processed_at", ""),
                    embedding=embedding,
                )

                # Link to related doc chunks via vector similarity
                session.run(
                    LINK_TO_DOC_CHUNKS,
                    thread_id=qa["thread_id"],
                    embedding=embedding,
                )

                print("✓")

            except Exception as e:
                print(f"ERROR: {e}")

            time.sleep(0.1)  # Gentle rate limiting


# ─── Entry Point ──────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Teams SME Q&A — Neo4j Ingestion")
    print("=" * 60)

    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY not set")
        return

    if not INPUT_PATH.exists():
        print(f"ERROR: Input not found: {INPUT_PATH}")
        print("Run process_teams_sme.py first.")
        return

    # Load processed Q&A
    with open(INPUT_PATH, encoding="utf-8") as f:
        data = json.load(f)

    qa_pairs = data.get("qa_pairs", [])
    print(f"\nLoaded {len(qa_pairs)} active Q&A pairs")
    print(f"Processed at: {data.get('processed_at', 'unknown')}\n")

    if not qa_pairs:
        print("No Q&A pairs to ingest. Exiting.")
        return

    # Connect to Neo4j
    print(f"Connecting to Neo4j at {NEO4J_URI}...")
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    try:
        driver.verify_connectivity()
        print("✓ Connected to Neo4j\n")
    except Exception as e:
        print(f"✗ Neo4j connection failed: {e}")
        print("  Check that Neo4j and ngrok are running on the Linux server.")
        return

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Check existing SME node count
    with driver.session() as session:
        result = session.run(COUNT_SME_NODES)
        existing = result.single()["count"]
        print(f"Existing SMEKnowledge nodes in Neo4j: {existing}")

    if existing > 0:
        print(f"\nFound {existing} existing SME nodes.")
        print("Options:")
        print("  1 — Update/merge (MERGE by thread_id — safe for incremental runs)")
        print("  2 — Full replace (DELETE all SME nodes then re-ingest)")
        choice = input("Choice [1/2]: ").strip()
        if choice == "2":
            print("Deleting existing SME nodes...")
            with driver.session() as session:
                session.run(DELETE_SME_NODES)
            print("✓ Deleted\n")

    # Ingest
    print(f"Ingesting {len(qa_pairs)} Q&A pairs...\n")
    ingest_qa_pairs(driver, client, qa_pairs)

    # Final count
    with driver.session() as session:
        result = session.run(COUNT_SME_NODES)
        final_count = result.single()["count"]

    driver.close()

    print("\n" + "=" * 60)
    print("Ingestion Complete")
    print("=" * 60)
    print(f"  SMEKnowledge nodes in Neo4j: {final_count}")
    print()
    print("Next step: update the RAG workflow in n8n to query SMEKnowledge nodes")
    print("alongside DocChunk nodes in the vector search.")


if __name__ == "__main__":
    main()
