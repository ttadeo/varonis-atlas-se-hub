"""
One-time migration: re-assign MeetingSession nodes from se_default to a real user email.
Usage: python3 migrate_sessions.py your@email.com
"""
import sys
from neo4j import GraphDatabase

NEO4J_URI      = "bolt://192.168.1.165:7687"
NEO4J_USER     = "neo4j"
NEO4J_PASSWORD = "ttadeo123"

def migrate(real_email: str):
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    with driver.session() as session:
        # Count what we're moving
        count = session.run(
            "MATCH (:User {id: 'se_default'})-[:HAS_SESSION]->(s:MeetingSession) RETURN count(s) AS n"
        ).single()["n"]
        print(f"Found {count} session(s) under se_default → moving to {real_email}")

        if count == 0:
            print("Nothing to migrate.")
            driver.close()
            return

        confirm = input(f"Confirm migration to '{real_email}'? (yes/no): ").strip().lower()
        if confirm != "yes":
            print("Aborted.")
            driver.close()
            return

        # Merge real user, move HAS_SESSION relationships
        session.run(
            """
            MATCH (old:User {id: 'se_default'})-[r:HAS_SESSION]->(s:MeetingSession)
            MERGE (real:User {id: $email})
            CREATE (real)-[:HAS_SESSION]->(s)
            DELETE r
            """,
            email=real_email
        )
        print(f"Done — {count} session(s) moved to {real_email}.")
    driver.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 migrate_sessions.py your@email.com")
        sys.exit(1)
    migrate(sys.argv[1])
