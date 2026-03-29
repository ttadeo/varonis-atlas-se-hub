"""
Atlas Docs → Neo4j Ingestion Pipeline
Reads scraped markdown files, chunks by heading sections,
vectorizes with OpenAI embeddings, and loads into Neo4j.
"""

import os
import re
import json
from pathlib import Path
from typing import Optional

from openai import OpenAI
from neo4j import GraphDatabase

# ─── Configuration ────────────────────────────────────────────────────────────

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
NEO4J_URI      = os.environ["NEO4J_URI"]       # e.g. neo4j+s://xxxx.databases.neo4j.io
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]

EMBEDDING_MODEL = "text-embedding-3-small"     # 1536 dims, cheap and fast
DOCS_DIR        = Path(__file__).parent.parent / "scraper" / "output"

# ─── Chunking ─────────────────────────────────────────────────────────────────

def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Extract YAML frontmatter and return (metadata, body)."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("---", 3)
    if end == -1:
        return {}, text
    fm_block = text[3:end].strip()
    body = text[end + 3:].strip()
    metadata = {}
    for line in fm_block.splitlines():
        if ":" in line:
            key, _, val = line.partition(":")
            metadata[key.strip()] = val.strip()
    return metadata, body


def chunk_by_headings(body: str, metadata: dict) -> list[dict]:
    """
    Split markdown body into chunks at each heading (##, ###).
    Each chunk gets the page metadata plus its own heading.
    Preserves the intro text before the first heading as its own chunk.
    """
    # Split on ## or ### headings (but not # which is the page title)
    pattern = re.compile(r"^(#{2,3})\s+(.+)$", re.MULTILINE)
    chunks = []
    positions = [(m.start(), m.group(1), m.group(2)) for m in pattern.finditer(body)]

    # Intro text (before first heading)
    intro_end = positions[0][0] if positions else len(body)
    intro_text = body[:intro_end].strip()
    # Strip the # page title line from intro
    intro_text = re.sub(r"^#\s+.+\n?", "", intro_text).strip()
    if intro_text:
        chunks.append({
            "heading": metadata.get("title", "Overview"),
            "level": "intro",
            "text": intro_text,
            **metadata
        })

    # Section chunks
    for i, (pos, hashes, heading) in enumerate(positions):
        start = pos
        end = positions[i + 1][0] if i + 1 < len(positions) else len(body)
        section_text = body[start:end].strip()
        # Remove the heading line itself from the text body
        section_body = re.sub(r"^#{2,3}\s+.+\n?", "", section_text, count=1).strip()
        if section_body:
            chunks.append({
                "heading": heading,
                "level": "h2" if hashes == "##" else "h3",
                "text": section_body,
                **metadata
            })

    return chunks


def collect_chunks() -> list[dict]:
    """Walk all markdown files and return a flat list of chunks."""
    all_chunks = []
    md_files = sorted(DOCS_DIR.rglob("*.md"))
    # Skip debug folder
    md_files = [f for f in md_files if "debug" not in f.parts]

    print(f"Found {len(md_files)} markdown files")
    for filepath in md_files:
        text = filepath.read_text(encoding="utf-8")
        metadata, body = parse_frontmatter(text)
        metadata["file"] = str(filepath.relative_to(DOCS_DIR))
        chunks = chunk_by_headings(body, metadata)
        all_chunks.extend(chunks)
        print(f"  {metadata.get('title', filepath.name)}: {len(chunks)} chunks")

    print(f"\nTotal chunks: {len(all_chunks)}")
    return all_chunks


# ─── Embeddings ───────────────────────────────────────────────────────────────

def embed_chunks(chunks: list[dict], client: OpenAI) -> list[dict]:
    """Add an 'embedding' field to each chunk using OpenAI embeddings."""
    print("\nGenerating embeddings...")
    texts = [f"{c['heading']}\n\n{c['text']}" for c in chunks]

    # Batch in groups of 100 (API limit)
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


# ─── Neo4j Ingestion ──────────────────────────────────────────────────────────

SETUP_QUERIES = [
    # Vector index for semantic search
    """
    CREATE VECTOR INDEX atlas_chunk_embeddings IF NOT EXISTS
    FOR (c:Chunk) ON (c.embedding)
    OPTIONS {
      indexConfig: {
        `vector.dimensions`: 1536,
        `vector.similarity_function`: 'cosine'
      }
    }
    """,
    # Fulltext index for keyword search
    """
    CREATE FULLTEXT INDEX atlas_chunk_text IF NOT EXISTS
    FOR (n:Chunk) ON EACH [n.text, n.heading, n.title]
    """,
]

UPSERT_SECTION = """
MERGE (s:Section {name: $section})
RETURN s
"""

UPSERT_PAGE = """
MERGE (p:Page {url: $url})
SET p.title   = $title,
    p.section = $section,
    p.file    = $file
WITH p
MATCH (s:Section {name: $section})
MERGE (s)-[:CONTAINS]->(p)
RETURN p
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
    c.file      = $file
WITH c
MATCH (p:Page {url: $url})
MERGE (p)-[:HAS_CHUNK]->(c)
RETURN c
"""


def chunk_id(chunk: dict, index: int) -> str:
    """Stable ID for a chunk based on file + heading + index."""
    file_slug = re.sub(r"[^a-z0-9]", "_", chunk.get("file", "").lower())
    heading_slug = re.sub(r"[^a-z0-9]", "_", chunk.get("heading", "").lower())[:40]
    return f"{file_slug}__{heading_slug}__{index}"


def load_to_neo4j(chunks: list[dict], driver):
    """Write all chunks into Neo4j as a knowledge graph."""
    print("\nLoading into Neo4j...")

    with driver.session() as session:
        # Create indexes
        for q in SETUP_QUERIES:
            try:
                session.run(q)
            except Exception as e:
                print(f"  Index note: {e}")

        # Group chunks by page to upsert sections + pages first
        pages_seen = set()
        sections_seen = set()
        for chunk in chunks:
            section = chunk.get("section", "unknown")
            url = chunk.get("url", "")
            if section not in sections_seen:
                session.run(UPSERT_SECTION, section=section)
                sections_seen.add(section)
            if url not in pages_seen:
                session.run(UPSERT_PAGE,
                    url=url,
                    title=chunk.get("title", ""),
                    section=section,
                    file=chunk.get("file", "")
                )
                pages_seen.add(url)

        # Upsert chunks
        for i, chunk in enumerate(chunks):
            cid = chunk_id(chunk, i)
            session.run(UPSERT_CHUNK,
                id=cid,
                heading=chunk.get("heading", ""),
                level=chunk.get("level", ""),
                text=chunk.get("text", ""),
                embedding=chunk.get("embedding", []),
                title=chunk.get("title", ""),
                section=chunk.get("section", ""),
                url=chunk.get("url", ""),
                file=chunk.get("file", "")
            )
            if (i + 1) % 20 == 0 or (i + 1) == len(chunks):
                print(f"  Loaded {i + 1}/{len(chunks)} chunks")

    print(f"\n✓ {len(chunks)} chunks loaded into Neo4j")
    print(f"  Sections: {len(sections_seen)}")
    print(f"  Pages: {len(pages_seen)}")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    print("Atlas Docs → Neo4j Ingestion Pipeline")
    print("=" * 50)

    # 1. Collect and chunk
    chunks = collect_chunks()

    # 2. Embed
    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    chunks = embed_chunks(chunks, openai_client)

    # 3. Load into Neo4j
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        load_to_neo4j(chunks, driver)
    finally:
        driver.close()

    print("\nDone.")


if __name__ == "__main__":
    main()
