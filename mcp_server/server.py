"""
Atlas RAG — MCP Server
Exposes Atlas knowledge base and session memory as MCP tools.
Runs locally alongside Neo4j, exposed via ngrok for Vercel access.

Transport: SSE (HTTP) so Vercel API routes can connect remotely.
Run: python server.py
"""

import asyncio
import json
import os
from typing import Any

from mcp.server import Server
from mcp.server.sse import SseServerTransport
from mcp.types import Tool, TextContent, CallToolResult
from neo4j import AsyncGraphDatabase
from openai import AsyncOpenAI
from aiohttp import web

# ─── Config ───────────────────────────────────────────────────────────────────

NEO4J_URI      = os.environ.get("NEO4J_URI", "bolt://192.168.1.165:7687")
NEO4J_USER     = os.environ.get("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
PORT           = int(os.environ.get("MCP_PORT", "8000"))

EMBEDDING_MODEL = "text-embedding-3-small"

openai_client = AsyncOpenAI(api_key=OPENAI_API_KEY)

# ─── Neo4j helpers ────────────────────────────────────────────────────────────

async def get_embedding(text: str) -> list[float]:
    res = await openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return res.data[0].embedding


async def search_atlas_docs(query: str, section: str | None = None) -> list[dict]:
    embedding = await get_embedding(query)

    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            section_filter = "AND node.section = $section" if section else ""
            result = await session.run(
                f"""
                CALL db.index.vector.queryNodes('atlas_chunk_embeddings', 8, $embedding)
                YIELD node, score
                WHERE score > 0.45 {section_filter}
                RETURN node.heading AS heading, node.text AS text,
                       node.title AS title, node.section AS section,
                       node.url AS url, score
                ORDER BY score DESC
                """,
                embedding=embedding,
                section=section,
            )
            records = await result.data()
            return records
    finally:
        await driver.close()


async def search_past_sessions(query: str) -> list[dict]:
    embedding = await get_embedding(query)

    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            result = await session.run(
                """
                CALL db.index.vector.queryNodes('interaction_embeddings', 6, $embedding)
                YIELD node AS interaction, score
                WHERE score > 0.5
                MATCH (s:MeetingSession)-[:HAD]->(interaction)
                RETURN interaction.question AS question,
                       interaction.answer AS answer,
                       s.customer_industry AS industry,
                       s.meeting_type AS meetingType,
                       s.created_at AS date,
                       score
                ORDER BY score DESC
                """,
                embedding=embedding,
            )
            return await result.data()
    finally:
        await driver.close()


async def get_user_preferences(user_id: str) -> dict:
    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            result = await session.run(
                """
                MATCH (u:User {id: $userId})
                RETURN u.learning_style AS learningStyle,
                       u.voice_enabled AS voiceEnabled,
                       u.voice_autoplay AS voiceAutoplay,
                       u.name AS name
                """,
                userId=user_id,
            )
            records = await result.data()
            if records:
                return records[0]
            return {
                "learningStyle": "visual",
                "voiceEnabled": False,
                "voiceAutoplay": False,
                "name": None,
            }
    finally:
        await driver.close()


async def save_user_preferences(user_id: str, prefs: dict) -> bool:
    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            await session.run(
                """
                MERGE (u:User {id: $userId})
                SET u.learning_style  = $learningStyle,
                    u.voice_enabled   = $voiceEnabled,
                    u.voice_autoplay  = $voiceAutoplay,
                    u.updated_at      = datetime()
                """,
                userId=user_id,
                learningStyle=prefs.get("learningStyle", "visual"),
                voiceEnabled=prefs.get("voiceEnabled", False),
                voiceAutoplay=prefs.get("voiceAutoplay", False),
            )
            return True
    finally:
        await driver.close()


async def list_sessions(user_id: str) -> list[dict]:
    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            result = await session.run(
                """
                MATCH (u:User {id: $userId})-[:HAS_SESSION]->(s:MeetingSession)
                OPTIONAL MATCH (s)-[:HAD]->(i:Interaction)
                WITH s, count(i) AS turnCount
                RETURN s.id AS id, s.customer_industry AS industry,
                       s.meeting_type AS meetingType, s.attendees AS attendees,
                       s.summary AS summary, s.created_at AS createdAt,
                       turnCount
                ORDER BY s.created_at DESC
                LIMIT 50
                """,
                userId=user_id,
            )
            return await result.data()
    finally:
        await driver.close()


async def delete_session(session_id: str) -> bool:
    driver = AsyncGraphDatabase.driver(
        NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD)
    )
    try:
        async with driver.session() as session:
            await session.run(
                """
                MATCH (s:MeetingSession {id: $sessionId})
                OPTIONAL MATCH (s)-[:HAD]->(i:Interaction)
                DETACH DELETE s, i
                """,
                sessionId=session_id,
            )
            return True
    finally:
        await driver.close()


# ─── MCP Server ───────────────────────────────────────────────────────────────

server = Server("atlas-rag-server")


@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="search_atlas_docs",
            description=(
                "Search the Atlas AI Security knowledge base for product documentation, "
                "feature details, deployment guidance, competitive positioning, and technical specs."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The search query",
                    },
                    "section": {
                        "type": "string",
                        "description": (
                            "Optional section filter: applications, overview, "
                            "platform_services, competitive, faq, openapi_reference"
                        ),
                    },
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="search_past_sessions",
            description=(
                "Search past SE meeting sessions for similar customer questions, "
                "objections, or scenarios."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "query": {
                        "type": "string",
                        "description": "The question or concern to find in past sessions",
                    },
                },
                "required": ["query"],
            },
        ),
        Tool(
            name="get_user_preferences",
            description="Retrieve an SE's learning style and voice preferences from Neo4j.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                },
                "required": ["user_id"],
            },
        ),
        Tool(
            name="save_user_preferences",
            description="Save an SE's learning style and voice preferences to Neo4j.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "preferences": {
                        "type": "object",
                        "properties": {
                            "learningStyle": {"type": "string"},
                            "voiceEnabled": {"type": "boolean"},
                            "voiceAutoplay": {"type": "boolean"},
                        },
                    },
                },
                "required": ["user_id", "preferences"],
            },
        ),
        Tool(
            name="list_sessions",
            description="List an SE's saved meeting sessions.",
            inputSchema={
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                },
                "required": ["user_id"],
            },
        ),
        Tool(
            name="delete_session",
            description="Delete a saved meeting session and all its interactions.",
            inputSchema={
                "type": "object",
                "properties": {
                    "session_id": {"type": "string"},
                },
                "required": ["session_id"],
            },
        ),
    ]


@server.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[TextContent]:
    if name == "search_atlas_docs":
        results = await search_atlas_docs(
            arguments["query"], arguments.get("section")
        )
        if not results:
            text = "No relevant Atlas documentation found."
        else:
            text = "\n\n---\n\n".join(
                f"[{r['title']} › {r['heading']}] (score: {r['score']:.3f})\n{r['text']}"
                for r in results
            )
        return [TextContent(type="text", text=text)]

    elif name == "search_past_sessions":
        results = await search_past_sessions(arguments["query"])
        if not results:
            text = "No similar past sessions found."
        else:
            text = "\n\n---\n\n".join(
                f"[{r['industry']} · {r['meetingType']}]\nQ: {r['question']}\nA: {r['answer']}"
                for r in results
            )
        return [TextContent(type="text", text=text)]

    elif name == "get_user_preferences":
        prefs = await get_user_preferences(arguments["user_id"])
        return [TextContent(type="text", text=json.dumps(prefs))]

    elif name == "save_user_preferences":
        ok = await save_user_preferences(
            arguments["user_id"], arguments["preferences"]
        )
        return [TextContent(type="text", text=json.dumps({"saved": ok}))]

    elif name == "list_sessions":
        sessions = await list_sessions(arguments["user_id"])
        return [TextContent(type="text", text=json.dumps(sessions, default=str))]

    elif name == "delete_session":
        ok = await delete_session(arguments["session_id"])
        return [TextContent(type="text", text=json.dumps({"deleted": ok}))]

    return [TextContent(type="text", text=f"Unknown tool: {name}")]


# ─── SSE transport (HTTP — accessible from Vercel) ───────────────────────────

async def main():
    transport = SseServerTransport("/messages")
    app = web.Application()

    async def handle_sse(request: web.Request):
        async with transport.connect_sse(
            request.method, request.url, request.headers, request.content
        ) as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
        return web.Response()

    app.router.add_get("/sse", handle_sse)
    app.router.add_post("/messages", transport.handle_post_message)

    # Health check for ngrok / monitoring
    async def health(request: web.Request):
        return web.json_response({"status": "ok", "server": "atlas-rag-mcp"})

    app.router.add_get("/health", health)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", PORT)
    await site.start()
    print(f"Atlas MCP server running on port {PORT}")
    print(f"SSE endpoint: http://localhost:{PORT}/sse")
    print(f"Health check: http://localhost:{PORT}/health")
    print("Expose with: ngrok http 8000")
    await asyncio.Event().wait()


if __name__ == "__main__":
    asyncio.run(main())
