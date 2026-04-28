"""
Neo4j Cleanup Script
Deletes all Chunk and Page nodes (and their relationships) to allow a clean re-ingest.
Sections are preserved.
Run this BEFORE re-running ingest_to_neo4j.py and ingest_openapi.py.
"""

import os
from neo4j import GraphDatabase

NEO4J_URI      = os.environ["NEO4J_URI"]
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]


def cleanup(driver):
    with driver.session() as session:
        # Count before
        result = session.run("MATCH (c:Chunk) RETURN count(c) AS total")
        total_chunks = result.single()["total"]
        result = session.run("MATCH (p:Page) RETURN count(p) AS total")
        total_pages = result.single()["total"]
        print(f"Before cleanup: {total_chunks} chunks, {total_pages} pages")

        # Delete all Chunk nodes and their relationships
        print("Deleting all Chunk nodes...")
        deleted = 0
        while True:
            result = session.run(
                "MATCH (c:Chunk) WITH c LIMIT 5000 DETACH DELETE c RETURN count(c) AS n"
            )
            n = result.single()["n"]
            deleted += n
            print(f"  Deleted {deleted} chunks so far...")
            if n == 0:
                break

        # Delete all Page nodes and their relationships
        print("Deleting all Page nodes...")
        session.run("MATCH (p:Page) DETACH DELETE p")

        # Verify
        result = session.run("MATCH (c:Chunk) RETURN count(c) AS total")
        remaining = result.single()["total"]
        print(f"\nCleanup complete. Remaining chunks: {remaining}")
        print("You can now run ingest_to_neo4j.py and ingest_openapi.py")


def main():
    print("Neo4j Cleanup — Wipe All Chunks and Pages")
    print("=" * 50)
    confirm = input("This will delete ALL Chunk and Page nodes. Type 'yes' to continue: ")
    if confirm.strip().lower() != "yes":
        print("Aborted.")
        return

    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        cleanup(driver)
    finally:
        driver.close()


if __name__ == "__main__":
    main()
