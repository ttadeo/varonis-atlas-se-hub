"""
Export Atlas API documentation from Neo4j to a markdown file.
Pulls DocChunk nodes (OpenAPI + docs) and SMEKnowledge nodes.

Usage:
  source evals/venv/bin/activate
  set -a && source ui/.env.local && set +a
  python scripts/export_atlas_docs.py
"""

import os
import sys
from datetime import datetime

try:
    import neo4j
except ImportError:
    print("ERROR: neo4j driver not installed. Run: pip install neo4j")
    sys.exit(1)

NEO4J_URI      = os.environ.get("NEO4J_URI", "bolt://7.tcp.ngrok.io:23280")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD", "ttadeo123")

OUTPUT_PATH = "/Users/timtadeo/Desktop/AtlasTruLens/docs/atlas_knowledge_export.md"

def export():
    driver = neo4j.GraphDatabase.driver(
        NEO4J_URI,
        auth=neo4j.basic_auth(NEO4J_USER, NEO4J_PASSWORD),
        max_connection_pool_size=1
    )

    lines = []
    lines.append(f"# Atlas Knowledge Base Export")
    lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}")
    lines.append(f"Source: Neo4j ({NEO4J_URI})")
    lines.append("")

    with driver.session() as session:

        # ── 1. OpenAPI / API endpoint chunks ─────────────────────────────────
        print("Fetching OpenAPI chunks...")
        result = session.run("""
            MATCH (c:DocChunk)
            WHERE c.source CONTAINS 'openapi' OR c.source CONTAINS 'api'
               OR toLower(c.text) CONTAINS 'endpoint'
               OR toLower(c.text) CONTAINS 'GET /'
               OR toLower(c.text) CONTAINS 'POST /'
               OR toLower(c.text) CONTAINS 'DELETE /'
               OR toLower(c.text) CONTAINS 'PUT /'
            RETURN c.text AS text, c.source AS source, c.page AS page
            ORDER BY c.source, c.page
            LIMIT 800
        """)
        api_chunks = result.data()

        lines.append("## Atlas API Reference (OpenAPI Chunks)")
        lines.append(f"*{len(api_chunks)} chunks*")
        lines.append("")
        for chunk in api_chunks:
            src = chunk.get("source", "")
            pg  = chunk.get("page", "")
            lines.append(f"### Source: {src} | Page: {pg}")
            lines.append(chunk.get("text", "").strip())
            lines.append("")

        # ── 2. All remaining DocChunks (Atlas product docs) ──────────────────
        print("Fetching Atlas product doc chunks...")
        result = session.run("""
            MATCH (c:DocChunk)
            WHERE NOT (c.source CONTAINS 'openapi' OR c.source CONTAINS 'api'
                   OR toLower(c.text) CONTAINS 'GET /'
                   OR toLower(c.text) CONTAINS 'POST /')
            RETURN c.text AS text, c.source AS source, c.page AS page,
                   c.section AS section
            ORDER BY c.source, c.page
            LIMIT 1500
        """)
        doc_chunks = result.data()

        lines.append("---")
        lines.append("")
        lines.append("## Atlas Product Documentation (Doc Chunks)")
        lines.append(f"*{len(doc_chunks)} chunks*")
        lines.append("")
        for chunk in doc_chunks:
            src     = chunk.get("source", "")
            pg      = chunk.get("page", "")
            section = chunk.get("section", "")
            lines.append(f"### {section or src} | Page: {pg}")
            lines.append(chunk.get("text", "").strip())
            lines.append("")

        # ── 3. SME Knowledge (field-validated Q&A) ───────────────────────────
        print("Fetching SME Knowledge nodes...")
        result = session.run("""
            MATCH (s:SMEKnowledge)
            RETURN s.question AS question, s.answer AS answer,
                   s.topic AS topic, s.source AS source
            ORDER BY s.topic
            LIMIT 200
        """)
        sme_nodes = result.data()

        lines.append("---")
        lines.append("")
        lines.append("## SME Knowledge Base (Field-Validated Q&A)")
        lines.append(f"*{len(sme_nodes)} entries*")
        lines.append("")
        current_topic = None
        for node in sme_nodes:
            topic = node.get("topic", "General")
            if topic != current_topic:
                lines.append(f"### Topic: {topic}")
                lines.append("")
                current_topic = topic
            q = node.get("question", "").strip()
            a = node.get("answer", "").strip()
            if q:
                lines.append(f"**Q:** {q}")
            if a:
                lines.append(f"**A:** {a}")
            lines.append("")

        # ── 4. LearnedQA (community knowledge) ───────────────────────────────
        print("Fetching LearnedQA nodes...")
        result = session.run("""
            MATCH (l:LearnedQA)
            RETURN l.question AS question, l.answer AS answer
            ORDER BY l.question
            LIMIT 150
        """)
        learned = result.data()

        lines.append("---")
        lines.append("")
        lines.append("## Learned Q&A (Community Knowledge from /ask Interactions)")
        lines.append(f"*{len(learned)} entries*")
        lines.append("")
        for node in learned:
            q = node.get("question", "").strip()
            a = node.get("answer", "").strip()
            if q:
                lines.append(f"**Q:** {q}")
            if a:
                lines.append(f"**A:** {a}")
            lines.append("")

    driver.close()

    # Write output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    size_mb = os.path.getsize(OUTPUT_PATH) / (1024 * 1024)
    print(f"\n✅ Export complete → {OUTPUT_PATH}")
    print(f"   API chunks:    {len(api_chunks)}")
    print(f"   Doc chunks:    {len(doc_chunks)}")
    print(f"   SME entries:   {len(sme_nodes)}")
    print(f"   Learned QA:    {len(learned)}")
    print(f"   File size:     {size_mb:.1f} MB")

if __name__ == "__main__":
    export()
