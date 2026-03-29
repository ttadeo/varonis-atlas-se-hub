"""
Parse the saved OpenAPI spec into markdown chunks for RAG ingestion.
"""

import json
import re
from pathlib import Path

SPEC_FILE  = Path("output/openapi_reference/openapi_spec.json")
OUTPUT_DIR = Path("output/openapi_reference")
DOCS_URL   = "https://prod.alltrue-be.com/_docs/api/openapi"

# Tags we care about for Atlas learning platform (skip internal/infra tags)
SKIP_TAGS = {"internal", "no-auth", "worker", "data-plane"}


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:60]


def build_chunk(path: str, method: str, operation: dict) -> dict:
    summary     = operation.get("summary", "")
    description = operation.get("description", "") or ""
    tags        = operation.get("tags", [])
    parameters  = operation.get("parameters", [])
    request_body = operation.get("requestBody", {})
    responses   = operation.get("responses", {})

    lines = []
    lines.append(f"**Endpoint**: `{method.upper()} {path}`")
    if summary:
        lines.append(f"**Summary**: {summary}")
    if tags:
        lines.append(f"**Tags**: {', '.join(tags)}")
    if description.strip():
        lines.append(f"\n{description.strip()}")

    if parameters:
        lines.append("\n**Parameters**:")
        for p in parameters:
            name     = p.get("name", "")
            location = p.get("in", "")
            required = "required" if p.get("required") else "optional"
            desc     = p.get("description", "") or ""
            lines.append(f"- `{name}` ({location}, {required}): {desc}")

    if request_body:
        req = "required" if request_body.get("required") else "optional"
        lines.append(f"\n**Request Body** ({req}):")
        for media_type in request_body.get("content", {}):
            lines.append(f"- `{media_type}`")

    if responses:
        lines.append("\n**Responses**:")
        for code, resp in list(responses.items())[:6]:
            desc = resp.get("description", "") if isinstance(resp, dict) else ""
            lines.append(f"- `{code}`: {desc}")

    heading = f"{method.upper()} {path}"
    if summary:
        heading = f"{method.upper()} {path} — {summary}"

    return {
        "heading": heading,
        "text": "\n".join(lines),
        "title": f"Atlas API — {', '.join(tags) if tags else 'General'}",
        "section": "openapi_reference",
        "url": DOCS_URL,
        "tags": tags,
        "method": method.upper(),
        "api_path": path,
    }


def main():
    print("Parsing OpenAPI spec...")
    spec = json.loads(SPEC_FILE.read_text(encoding="utf-8"))
    paths = spec.get("paths", {})

    all_chunks = []
    by_tag = {}

    for path, methods in paths.items():
        for method, operation in methods.items():
            if method.lower() not in ["get", "post", "put", "patch", "delete"]:
                continue
            if not isinstance(operation, dict):
                continue

            tags = operation.get("tags", ["general"])
            # Skip internal tags
            if all(t in SKIP_TAGS for t in tags):
                continue

            chunk = build_chunk(path, method, operation)
            all_chunks.append(chunk)

            primary_tag = tags[0] if tags else "general"
            by_tag.setdefault(primary_tag, []).append(chunk)

    print(f"Total chunks (after filtering): {len(all_chunks)}")

    # Save one markdown file per tag
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for tag, chunks in sorted(by_tag.items()):
        filename = slugify(tag) + ".md"
        filepath = OUTPUT_DIR / filename
        lines = [f"# Atlas API — {tag}\n"]
        for c in chunks:
            lines.append(f"## {c['heading']}\n")
            lines.append(c["text"])
            lines.append("\n---\n")
        filepath.write_text("\n".join(lines), encoding="utf-8")
        print(f"  {tag}: {len(chunks)} endpoints → {filename}")

    # Save combined index
    index_file = OUTPUT_DIR / "chunks_index.json"
    index_file.write_text(json.dumps(all_chunks, indent=2), encoding="utf-8")
    print(f"\n✓ {len(all_chunks)} chunks saved")
    print(f"  Index: {index_file}")


if __name__ == "__main__":
    main()
