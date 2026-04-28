"""
Ingest parsed OpenAPI chunks into Neo4j.
Reads output/openapi_reference/chunks_index.json,
vectorizes with OpenAI embeddings, and loads into Neo4j.
"""

import os
import re
import json
from pathlib import Path

from openai import OpenAI
from neo4j import GraphDatabase

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
NEO4J_URI      = os.environ.get("NEO4J_URI", "neo4j://192.168.1.165:7687")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]

EMBEDDING_MODEL = "text-embedding-3-small"
CHUNKS_FILE     = Path(__file__).parent.parent / "scraper" / "output" / "openapi_reference" / "chunks_index.json"

UPSERT_SECTION = "MERGE (s:Section {name: $section}) RETURN s"

UPSERT_PAGE = """
MERGE (p:Page {url: $url})
SET p.title = $title, p.section = $section, p.file = $file
WITH p
MATCH (s:Section {name: $section})
MERGE (s)-[:CONTAINS]->(p)
"""

UPSERT_CHUNK = """
MERGE (c:Chunk {id: $id})
SET c.heading   = $heading,
    c.level     = $level,
    c.text      = $text,
    c.embedding = $embedding,
    c.title     = $title,
    c.section   = $section,
    c.url       = $url,
    c.file      = $file,
    c.api_method = $api_method,
    c.api_path   = $api_path
WITH c
MATCH (p:Page {url: $url})
MERGE (p)-[:HAS_CHUNK]->(c)
"""


def embed_chunks(chunks: list[dict], client: OpenAI) -> list[dict]:
    print(f"Generating embeddings for {len(chunks)} chunks...")
    texts = [f"{c['heading']}\n\n{c['text']}" for c in chunks]
    batch_size = 100
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i + batch_size]
        response = client.embeddings.create(model=EMBEDDING_MODEL, input=batch)
        embeddings.extend([r.embedding for r in response.data])
        print(f"  Embedded {min(i + batch_size, len(texts))}/{len(texts)}")
    for chunk, embedding in zip(chunks, embeddings):
        chunk["embedding"] = embedding
    return chunks


def load_to_neo4j(chunks: list[dict], driver):
    print("\nLoading into Neo4j...")
    with driver.session() as session:
        session.run(UPSERT_SECTION, section="openapi_reference")
        session.run(UPSERT_PAGE,
            url="https://prod.alltrue-be.com/_docs/api/openapi",
            title="Atlas REST API Reference",
            section="openapi_reference",
            file="openapi_reference/index"
        )
        for i, chunk in enumerate(chunks):
            cid = f"openapi__{re.sub(r'[^a-z0-9]', '_', chunk.get('heading', '').lower())[:60]}__{i}"
            session.run(UPSERT_CHUNK,
                id=cid,
                heading=chunk.get("heading", ""),
                level="endpoint",
                text=chunk.get("text", ""),
                embedding=chunk.get("embedding", []),
                title=chunk.get("title", ""),
                section="openapi_reference",
                url="https://prod.alltrue-be.com/_docs/api/openapi",
                file=f"openapi_reference/{(chunk.get('tags') or ['general'])[0]}",
                api_method=chunk.get("method", ""),
                api_path=chunk.get("api_path", "")
            )
            if (i + 1) % 50 == 0 or (i + 1) == len(chunks):
                print(f"  Loaded {i + 1}/{len(chunks)} chunks")

    print(f"\n✓ {len(chunks)} OpenAPI chunks loaded into Neo4j")


def main():
    print("OpenAPI → Neo4j Ingestion")
    print("=" * 50)

    chunks = json.loads(CHUNKS_FILE.read_text(encoding="utf-8"))
    print(f"Loaded {len(chunks)} chunks from index")

    client = OpenAI(api_key=OPENAI_API_KEY)
    chunks = embed_chunks(chunks, client)

    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        load_to_neo4j(chunks, driver)
    finally:
        driver.close()

    print("\nDone.")


if __name__ == "__main__":
    main()
