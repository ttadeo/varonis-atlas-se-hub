"""
Patch Release Notes Top-Level Chunks
=====================================
The top-level "What's New in VX.X.X" chunks currently only contain the
breadcrumb nav + release date (≈117 chars) — no feature content.

This script:
1. Finds all release-notes top-level chunks that have feature sub-chunks
2. Merges all feature descriptions into the top-level chunk's TEXT field
3. Re-embeds using the HEADING ONLY (keeps retrieval working) and updates Neo4j

Key insight: The embedding drives retrieval, the text drives generation.
We want retrieval to stay anchored to "What's New in VX.X.X" phrasing
while giving Claude the full feature list to answer from.

Run once after ingestion to fix "What's New in VX.X.X" retrieval quality.
"""

import os
import time
from openai import OpenAI
from neo4j import GraphDatabase

NEO4J_URI      = os.environ.get("NEO4J_URI",      "bolt://192.168.1.165:7687")
NEO4J_USER     = os.environ.get("NEO4J_USER",     "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "ttadeo123")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "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")
EMBED_MODEL    = "text-embedding-3-small"


def main():
    client = OpenAI(api_key=OPENAI_API_KEY)
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    with driver.session() as session:
        # Find all top-level "What's New in VX.X.X" chunks
        versions = session.run("""
            MATCH (top:Chunk)
            WHERE top.section IN ['release_notes', 'platform_services']
              AND top.heading = top.title
              AND top.title STARTS WITH "What's New in"
            RETURN top.title AS version, top.text AS current_text,
                   elementId(top) AS node_id
            ORDER BY top.title
        """).data()

        print(f"Found {len(versions)} top-level release note chunks to patch\n")

        patched = 0
        for v in versions:
            version_title = v["version"]
            node_id       = v["node_id"]
            current_text  = v["current_text"] or ""

            # Skip if already patched (text is longer than original stub)
            if len(current_text) > 500:
                print(f"  SKIP {version_title} — already patched ({len(current_text)} chars)")
                continue

            # Get all feature sub-chunks for this version (heading != title)
            sub_chunks = session.run("""
                MATCH (c:Chunk)
                WHERE c.title = $title
                  AND c.heading <> c.title
                RETURN c.heading AS heading, c.text AS text
                ORDER BY c.heading
            """, title=version_title).data()

            if not sub_chunks:
                print(f"  SKIP {version_title} — no sub-chunks found")
                continue

            # Build enriched text: header + all feature descriptions
            lines = [f"# {version_title}\n"]
            for sc in sub_chunks:
                heading = sc["heading"].split("[​]")[0].strip()  # strip anchor suffix
                text    = sc["text"] or ""
                lines.append(f"## {heading}")
                lines.append(text)
                lines.append("")

            enriched_text = "\n".join(lines)

            # IMPORTANT: Embed using the heading only (not the full text).
            # The heading "What's New in V3.3.0" matches version queries perfectly.
            # The enriched text is for Claude to read during generation.
            version_short = version_title.replace("What's New in ", "")
            embed_input = f"What's New in {version_short} — release notes new features changelog"
            emb = client.embeddings.create(
                input=embed_input,
                model=EMBED_MODEL
            ).data[0].embedding

            # Update: text gets full content, embedding stays anchored to version identity
            session.run("""
                MATCH (c:Chunk) WHERE elementId(c) = $node_id
                SET c.text = $text, c.embedding = $embedding
            """, node_id=node_id, text=enriched_text, embedding=emb)

            print(f"  ✓ Patched {version_title}: {len(current_text)} → {len(enriched_text)} chars ({len(sub_chunks)} features)")
            patched += 1
            time.sleep(0.05)

    driver.close()
    print(f"\nDone — patched {patched} chunks")


if __name__ == "__main__":
    main()
