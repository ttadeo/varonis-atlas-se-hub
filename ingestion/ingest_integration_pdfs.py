"""
Integration PDF → Neo4j Ingestion
===================================
Reads the 63 Atlas integration PDFs, chunks by section, embeds with
OpenAI text-embedding-3-small, and loads into Neo4j as DocChunk nodes
tagged source="integration".

These chunks:
  - Enrich Ask Atlas, Meeting Co-Pilot, and Guide Producer (all DocChunk queries)
  - Power the Integration Playbook page (filtered by source="integration")

Usage:
  source ingestion/atlas-ingestion/bin/activate
  set -a && source ui/.env.local && set +a
  pip install pymupdf
  python ingestion/ingest_integration_pdfs.py

PDF folders are detected automatically from the Desktop path.
Run is idempotent — re-running updates existing nodes (MERGE).
"""

import os
import re
import sys
from pathlib import Path

import fitz  # pymupdf
from openai import OpenAI
from neo4j import GraphDatabase

# ─── Configuration ────────────────────────────────────────────────────────────

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
NEO4J_URI      = os.environ.get("NEO4J_URI", "bolt://7.tcp.ngrok.io:23280")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]

EMBEDDING_MODEL = "text-embedding-3-small"
EMBED_BATCH     = 100

# All three PDF folders on the Desktop
PDF_DIRS = [
    Path.home() / "Desktop" / "AtlasSimulatorMaterial" / "atlaspdfs",
    Path.home() / "Desktop" / "AtlasSimulatorMaterial" / "atlaspdfs (2)",
    Path.home() / "Desktop" / "AtlasSimulatorMaterial" / "atlaspdfs (3)",
]

# Chunk size in characters — matches existing DocChunk sizing
CHUNK_SIZE    = 1200
CHUNK_OVERLAP = 150

# Existing DocChunk headings to skip (deduplication guard)
# We check by (title, heading) pair to avoid re-ingesting content
# already in the corpus from the v3.6.0 scrape.
KNOWN_DUPLICATE_TITLES = {
    "Architecture Overview",
    "Admin Console",
    "Organizations and Projects Overview",
    "Disclaimers",
    "Versions Prior to V3.0.5",
}


# ─── PDF Extraction ───────────────────────────────────────────────────────────

def extract_pdf_text(pdf_path: Path) -> str:
    """Extract plain text from all pages of a PDF."""
    doc = fitz.open(str(pdf_path))
    pages = []
    for page in doc:
        text = page.get_text("text")
        if text.strip():
            pages.append(text.strip())
    doc.close()
    return "\n\n".join(pages)


def clean_text(text: str) -> str:
    """Remove excessive whitespace and common PDF extraction artifacts."""
    # Collapse runs of whitespace/newlines
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    # Remove page number artifacts (e.g. "1\n", "Page 1 of 5")
    text = re.sub(r"(?m)^Page \d+ of \d+\s*$", "", text)
    text = re.sub(r"(?m)^\d+\s*$", "", text)
    return text.strip()


# ─── Chunking ─────────────────────────────────────────────────────────────────

def chunk_text(text: str, title: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> list[dict]:
    """
    Sliding-window chunker with heading detection.
    Tries to split on paragraph boundaries first; falls back to character window.
    Each chunk tagged with inferred heading (first bolded/capitalized line or title).
    """
    paragraphs = [p.strip() for p in re.split(r"\n\n+", text) if p.strip()]
    chunks = []
    current = []
    current_len = 0
    chunk_index = 0

    def flush(paras: list[str], idx: int) -> dict:
        combined = "\n\n".join(paras)
        # Infer heading: first line that looks like a heading (all caps, title case, or ends with colon)
        first_line = paras[0].split("\n")[0].strip() if paras else title
        if (first_line.isupper() or first_line.istitle() or first_line.endswith(":")) and len(first_line) < 120:
            heading = first_line.rstrip(":")
        else:
            heading = title
        return {
            "heading": heading,
            "text": combined,
            "chunk_index": idx,
        }

    for para in paragraphs:
        para_len = len(para)
        if current_len + para_len > chunk_size and current:
            chunks.append(flush(current, chunk_index))
            chunk_index += 1
            # Overlap: keep last paragraph if it's short enough
            overlap_paras = []
            overlap_len = 0
            for p in reversed(current):
                if overlap_len + len(p) <= overlap:
                    overlap_paras.insert(0, p)
                    overlap_len += len(p)
                else:
                    break
            current = overlap_paras
            current_len = overlap_len

        current.append(para)
        current_len += para_len

    if current:
        chunks.append(flush(current, chunk_index))

    return chunks


# ─── Embedding ────────────────────────────────────────────────────────────────

def embed_chunks(chunks: list[dict], client: OpenAI) -> list[dict]:
    """Embed chunk text (heading + text) in batches."""
    texts = [f"{c['title']}: {c['heading']}\n\n{c['text']}" for c in chunks]
    embeddings = []
    for i in range(0, len(texts), EMBED_BATCH):
        batch = texts[i : i + EMBED_BATCH]
        resp = client.embeddings.create(model=EMBEDDING_MODEL, input=batch)
        embeddings.extend([r.embedding for r in resp.data])
        print(f"    Embedded {min(i + EMBED_BATCH, len(texts))}/{len(texts)}")
    for chunk, emb in zip(chunks, embeddings):
        chunk["embedding"] = emb
    return chunks


# ─── Neo4j Ingestion ──────────────────────────────────────────────────────────

UPSERT_CHUNK = """
MERGE (c:Chunk {id: $id})
SET c:DocChunk,
    c.heading   = $heading,
    c.text      = $text,
    c.embedding = $embedding,
    c.title     = $title,
    c.section   = $section,
    c.source    = $source,
    c.filename  = $filename
RETURN c
"""

CHECK_EXISTING = """
MATCH (c:DocChunk {title: $title})
RETURN count(c) AS n
"""


def title_already_ingested(title: str, session) -> bool:
    """Check if a DocChunk with this title already exists — skip known duplicates."""
    result = session.run(CHECK_EXISTING, title=title)
    record = result.single()
    return record and record["n"] > 0


def load_to_neo4j(all_chunks: list[dict], driver):
    print(f"\nLoading {len(all_chunks)} chunks into Neo4j...")
    with driver.session() as session:
        for i, chunk in enumerate(all_chunks):
            session.run(
                UPSERT_CHUNK,
                id=chunk["id"],
                heading=chunk["heading"],
                text=chunk["text"],
                embedding=chunk["embedding"],
                title=chunk["title"],
                section=chunk["section"],
                source=chunk["source"],
                filename=chunk["filename"],
            )
            if (i + 1) % 25 == 0 or (i + 1) == len(all_chunks):
                print(f"  Loaded {i + 1}/{len(all_chunks)} chunks")
    print(f"✓ {len(all_chunks)} integration chunks in Neo4j")


# ─── Main ─────────────────────────────────────────────────────────────────────

def build_chunk_id(filename: str, chunk_index: int) -> str:
    slug = re.sub(r"[^a-z0-9]", "_", filename.lower().replace(".pdf", ""))
    return f"integration__{slug}__{chunk_index}"


def infer_section(title: str) -> str:
    """Map PDF title to a broad section category for filtering."""
    t = title.lower()
    if any(x in t for x in ["aws", "azure", "gcp", "google cloud", "databricks", "snowflake"]):
        return "integration_cloud"
    if any(x in t for x in ["openai", "anthropic", "claude", "gemini", "bedrock", "watsonx", "llm", "provider"]):
        return "integration_llm"
    if any(x in t for x in ["copilot", "devin", "cursor", "vs code", "kiro", "codex", "coding agent", "cowork", "github"]):
        return "integration_coding_agent"
    if any(x in t for x in ["netskope", "cloudflare", "kong", "island", "litellm", "log source"]):
        return "integration_security"
    if any(x in t for x in ["mcp", "runtime", "visibility", "shadow", "spm", "tprm", "ai usage", "ai investigation"]):
        return "integration_platform"
    return "integration_docs"


def main():
    print("Integration PDF → Neo4j Ingestion")
    print("=" * 50)

    # Verify PDF folders exist
    for d in PDF_DIRS:
        if not d.exists():
            print(f"ERROR: PDF folder not found: {d}")
            sys.exit(1)

    # Collect all PDFs
    all_pdfs = []
    for d in PDF_DIRS:
        pdfs = sorted(d.glob("*.pdf"))
        all_pdfs.extend(pdfs)
        print(f"  {d.name}: {len(pdfs)} PDFs")
    print(f"\nTotal: {len(all_pdfs)} PDFs\n")

    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    all_chunks = []
    skipped = []

    with driver.session() as session:
        for pdf_path in all_pdfs:
            title = pdf_path.stem  # filename without .pdf
            print(f"[{title}]")

            # Skip known duplicates already in corpus
            if title in KNOWN_DUPLICATE_TITLES:
                print(f"  → Skipping (known duplicate in existing corpus)")
                skipped.append(title)
                continue

            # Extract and clean text
            try:
                raw_text = extract_pdf_text(pdf_path)
                text = clean_text(raw_text)
            except Exception as e:
                print(f"  → ERROR extracting: {e}")
                skipped.append(title)
                continue

            if len(text) < 100:
                print(f"  → Skipping (too little text: {len(text)} chars)")
                skipped.append(title)
                continue

            # Chunk
            chunks = chunk_text(text, title)
            section = infer_section(title)
            print(f"  {len(chunks)} chunks | section: {section}")

            # Tag each chunk
            for chunk in chunks:
                chunk["id"]       = build_chunk_id(title, chunk["chunk_index"])
                chunk["title"]    = title
                chunk["section"]  = section
                chunk["source"]   = "integration"
                chunk["filename"] = pdf_path.name

            all_chunks.extend(chunks)

    if not all_chunks:
        print("\nNo chunks to ingest — all PDFs were skipped or errored.")
        driver.close()
        return

    # Embed all chunks
    print(f"\nEmbedding {len(all_chunks)} chunks...")
    all_chunks = embed_chunks(all_chunks, openai_client)

    # Load into Neo4j
    load_to_neo4j(all_chunks, driver)
    driver.close()

    print(f"\n{'=' * 50}")
    print(f"✓ Ingested:  {len(all_chunks)} chunks from {len(all_pdfs) - len(skipped)} PDFs")
    print(f"  Skipped:   {len(skipped)} PDFs ({', '.join(skipped[:5])}{'...' if len(skipped) > 5 else ''})")
    print(f"\nAll chunks tagged source='integration' in Neo4j.")
    print(f"Integration Playbook can filter: WHERE c.source = 'integration'")
    print(f"Ask Atlas / Meeting Co-Pilot / Guide Producer pick them up automatically.")


if __name__ == "__main__":
    main()
