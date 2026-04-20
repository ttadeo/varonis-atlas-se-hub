"""
Atlas UI Navigation Ingester
Reads scraped UI JSON files and loads them into Neo4j as UIPage nodes
with vector embeddings, tagged section = 'ui_navigation'.

Run AFTER scrape_atlas_ui.py has completed.
"""

import json
import os
import time
from pathlib import Path

import neo4j
from openai import OpenAI

# ─── Configuration ────────────────────────────────────────────────────────────

OUTPUT_DIR = Path(__file__).parent / "output" / "ui_navigation"
INDEX_FILE = OUTPUT_DIR / "_index.json"

NEO4J_URI      = os.environ.get("NEO4J_URI",      "bolt://192.168.1.165:7687")
NEO4J_USER     = os.environ.get("NEO4J_USER",     "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "ttadeo123")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")

EMBED_MODEL = "text-embedding-3-small"
BATCH_SIZE  = 20  # embeddings per API call

# ─── Clients ──────────────────────────────────────────────────────────────────

openai_client = OpenAI(api_key=OPENAI_API_KEY)


def get_driver():
    return neo4j.GraphDatabase.driver(
        NEO4J_URI,
        auth=(NEO4J_USER, NEO4J_PASSWORD),
        max_connection_pool_size=1,
    )


# ─── Ensure vector index exists ───────────────────────────────────────────────

def ensure_index(driver):
    with driver.session() as session:
        # Check if index already exists
        result = session.run("SHOW INDEXES WHERE name = 'ui_page_embeddings'")
        if result.single():
            print("✓ Vector index 'ui_page_embeddings' already exists")
            return

        print("Creating vector index 'ui_page_embeddings'...")
        session.run("""
            CREATE VECTOR INDEX ui_page_embeddings IF NOT EXISTS
            FOR (n:UIPage) ON (n.embedding)
            OPTIONS {indexConfig: {
                `vector.dimensions`: 1536,
                `vector.similarity_function`: 'cosine'
            }}
        """)
        # Wait for index to come online
        for _ in range(10):
            result = session.run(
                "SHOW INDEXES WHERE name = 'ui_page_embeddings'"
            )
            rec = result.single()
            if rec and rec["state"] == "ONLINE":
                print("✓ Index online")
                return
            print("  Waiting for index...")
            time.sleep(2)
        print("  Index created (may still be building)")


# ─── Build text to embed ──────────────────────────────────────────────────────

def build_embed_text(page: dict) -> str:
    """
    Craft a rich text for embedding that emphasises navigation context.
    This is what the vector search will match against SE questions like
    'where do I find pentests in the UI'.
    """
    parts = [
        f"Atlas UI: {page['friendly_name']}",
        f"Path: {page['path']}",
    ]

    if page.get("breadcrumbs"):
        parts.append("Navigation: " + " > ".join(page["breadcrumbs"]))

    if page.get("tabs"):
        parts.append("Tabs: " + ", ".join(page["tabs"]))

    if page.get("buttons"):
        parts.append("Buttons: " + ", ".join(page["buttons"][:8]))

    if page.get("headings"):
        parts.append("Sections: " + " | ".join(h["text"] for h in page["headings"][:8]))

    if page.get("body_text"):
        parts.append(page["body_text"][:800])

    return "\n".join(parts)


# ─── Embed in batches ─────────────────────────────────────────────────────────

def embed_batch(texts: list[str]) -> list[list[float]]:
    response = openai_client.embeddings.create(
        model=EMBED_MODEL,
        input=texts,
    )
    return [item.embedding for item in response.data]


# ─── Ingest into Neo4j ────────────────────────────────────────────────────────

def ingest_pages(driver, pages: list[dict]):
    total = len(pages)
    ingested = 0
    skipped = 0

    # Process in batches for embedding efficiency
    for batch_start in range(0, total, BATCH_SIZE):
        batch = pages[batch_start : batch_start + BATCH_SIZE]
        valid = [p for p in batch if p.get("status") == "success" and p.get("navigation_description")]

        if not valid:
            skipped += len(batch)
            continue

        print(f"  Embedding batch {batch_start // BATCH_SIZE + 1} ({len(valid)} pages)...")
        texts = [build_embed_text(p) for p in valid]
        embeddings = embed_batch(texts)

        with driver.session() as session:
            for page, embedding in zip(valid, embeddings):
                session.run(
                    """
                    MERGE (u:UIPage {path: $path})
                    SET u.url              = $url,
                        u.title            = $title,
                        u.friendly_name    = $friendly_name,
                        u.section          = 'ui_navigation',
                        u.nav_section      = $nav_section,
                        u.breadcrumbs      = $breadcrumbs,
                        u.tabs             = $tabs,
                        u.buttons          = $buttons,
                        u.headings         = $headings,
                        u.body_text        = $body_text,
                        u.navigation_description = $navigation_description,
                        u.embedding        = $embedding,
                        u.scraped_at       = datetime()
                    """,
                    path                 = page["path"],
                    url                  = page["url"],
                    title                = page["title"],
                    friendly_name        = page["friendly_name"],
                    nav_section          = page["nav_section"],
                    breadcrumbs          = json.dumps(page.get("breadcrumbs", [])),
                    tabs                 = json.dumps(page.get("tabs", [])),
                    buttons              = json.dumps(page.get("buttons", [])),
                    headings             = json.dumps([h["text"] for h in page.get("headings", [])]),
                    body_text            = page.get("body_text", "")[:2000],
                    navigation_description = page.get("navigation_description", ""),
                    embedding            = embedding,
                )
                ingested += 1
                print(f"    ✓ {page['friendly_name']}")

        skipped += len(batch) - len(valid)

    return ingested, skipped


# ─── Update search in RAG routes ─────────────────────────────────────────────

def print_rag_note():
    print("""
NOTE: To include UIPage results in the RAG search, the 'search_atlas_docs'
tool in /api/meeting/route.ts and /api/ask/route.ts needs a third parallel
query against the 'ui_page_embeddings' index. Run the update script or
follow the guide in guides/ after confirming ingestion looks correct.
""")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    if not INDEX_FILE.exists():
        print(f"ERROR: Index file not found at {INDEX_FILE}")
        print("Run scrape_atlas_ui.py first.")
        return

    pages = json.loads(INDEX_FILE.read_text(encoding="utf-8"))
    print(f"Loaded {len(pages)} pages from index\n")

    driver = get_driver()
    try:
        ensure_index(driver)
        print(f"\nIngesting {len(pages)} UI pages into Neo4j...\n")
        ingested, skipped = ingest_pages(driver, pages)

        print(f"\n{'='*50}")
        print(f"Ingestion complete:")
        print(f"  ✓ {ingested} pages ingested")
        print(f"  - {skipped} skipped (failed scrape or empty content)")

        # Verify
        with driver.session() as session:
            result = session.run("MATCH (u:UIPage) RETURN count(u) AS count")
            count = result.single()["count"]
            print(f"  Neo4j UIPage nodes total: {count}")

    finally:
        driver.close()

    print_rag_note()


if __name__ == "__main__":
    main()
