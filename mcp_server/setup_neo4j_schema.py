"""
Atlas Meeting Readiness — Neo4j Schema Setup
Adds User, MeetingSession, and Interaction nodes + vector indexes.
Run once after initial setup, safe to re-run (uses IF NOT EXISTS).
"""

import os
from neo4j import GraphDatabase

NEO4J_URI      = os.environ.get("NEO4J_URI", "bolt://192.168.1.165:7687")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]

SETUP_QUERIES = [
    # ── Constraints ──────────────────────────────────────────────────────────
    """
    CREATE CONSTRAINT user_id_unique IF NOT EXISTS
    FOR (u:User) REQUIRE u.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT meeting_session_id_unique IF NOT EXISTS
    FOR (s:MeetingSession) REQUIRE s.id IS UNIQUE
    """,
    """
    CREATE CONSTRAINT interaction_id_unique IF NOT EXISTS
    FOR (i:Interaction) REQUIRE i.id IS UNIQUE
    """,

    # ── Vector indexes ────────────────────────────────────────────────────────
    # For semantic search across session summaries
    """
    CREATE VECTOR INDEX meeting_session_embeddings IF NOT EXISTS
    FOR (s:MeetingSession) ON (s.embedding)
    OPTIONS {
      indexConfig: {
        `vector.dimensions`: 1536,
        `vector.similarity_function`: 'cosine'
      }
    }
    """,
    # For semantic search across individual questions asked in meetings
    """
    CREATE VECTOR INDEX interaction_embeddings IF NOT EXISTS
    FOR (i:Interaction) ON (i.embedding)
    OPTIONS {
      indexConfig: {
        `vector.dimensions`: 1536,
        `vector.similarity_function`: 'cosine'
      }
    }
    """,

    # ── Regular indexes for fast lookups ─────────────────────────────────────
    """
    CREATE INDEX meeting_session_user_id IF NOT EXISTS
    FOR (s:MeetingSession) ON (s.user_id)
    """,
    """
    CREATE INDEX interaction_session_id IF NOT EXISTS
    FOR (i:Interaction) ON (i.session_id)
    """,
]


def run_setup():
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            for query in SETUP_QUERIES:
                try:
                    session.run(query)
                    label = query.strip().split("\n")[1].strip()[:60]
                    print(f"  ✓ {label}")
                except Exception as e:
                    print(f"  Note: {e}")

        print("\n✓ Neo4j schema setup complete")
        print("  Node types added: User, MeetingSession, Interaction")
        print("  Vector indexes: meeting_session_embeddings, interaction_embeddings")
        print("  Regular indexes: session user_id lookup, interaction session_id lookup")
    finally:
        driver.close()


if __name__ == "__main__":
    print("Atlas — Neo4j Schema Setup")
    print("=" * 40)
    run_setup()
