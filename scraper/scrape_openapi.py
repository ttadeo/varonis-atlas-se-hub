"""
Atlas OpenAPI Reference Scraper
Navigates to the OpenAPI reference page, extracts the spec,
and saves each endpoint as a markdown chunk for RAG ingestion.
"""

import asyncio
import re
import json
from pathlib import Path
from playwright.async_api import async_playwright

BASE_URL = "https://prod.alltrue-be.com"
OPENAPI_URL = f"{BASE_URL}/_docs/api/openapi"
OUTPUT_DIR = Path(__file__).parent / "output" / "openapi_reference"


async def login_and_get_spec(page):
    """Navigate to OpenAPI page, login if needed, extract the spec."""
    print(f"Navigating to {OPENAPI_URL}...")
    await page.goto(OPENAPI_URL)
    await page.wait_for_load_state("networkidle")

    # Handle login if redirected
    current_url = page.url
    if "auth0" in current_url or "login" in current_url:
        print("Login required — please log in manually...")
        await page.wait_for_url(
            lambda url: "auth0" not in url and "login" not in url,
            timeout=120000
        )
        await page.wait_for_load_state("networkidle")
        await page.goto(OPENAPI_URL)
        await page.wait_for_load_state("networkidle")

    await page.wait_for_timeout(3000)

    # Save debug snapshot
    debug_dir = OUTPUT_DIR / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    await page.screenshot(path=str(debug_dir / "openapi_page.png"))
    html = await page.content()
    (debug_dir / "openapi_page.html").write_text(html, encoding="utf-8")
    print(f"Debug snapshot saved to {debug_dir}")

    # Try to find the raw OpenAPI spec URL in the page source
    spec_url = None
    patterns = [
        r'"url"\s*:\s*"([^"]*\.(?:json|yaml|yml)[^"]*)"',
        r"spec-url=['\"]([^'\"]+)['\"]",
        r"url:\s*['\"]([^'\"]+\.(?:json|yaml|yml)[^'\"]*)['\"]",
        r'href="([^"]*openapi[^"]*\.(?:json|yaml))"',
    ]
    for pattern in patterns:
        match = re.search(pattern, html, re.IGNORECASE)
        if match:
            spec_url = match.group(1)
            if spec_url.startswith("/"):
                spec_url = BASE_URL + spec_url
            print(f"Found spec URL: {spec_url}")
            break

    # Try common spec paths if not found in page
    if not spec_url:
        candidates = [
            f"{BASE_URL}/_docs/api/openapi.json",
            f"{BASE_URL}/_docs/api/openapi.yaml",
            f"{BASE_URL}/api/openapi.json",
            f"{BASE_URL}/openapi.json",
        ]
        print("Spec URL not found in page source, trying common paths...")
        for candidate in candidates:
            try:
                response = await page.request.get(candidate)
                if response.status == 200:
                    spec_url = candidate
                    print(f"Found spec at: {spec_url}")
                    break
            except Exception:
                pass

    return spec_url, html


def parse_openapi_spec(spec: dict) -> list[dict]:
    """Convert OpenAPI spec into RAG-friendly chunks."""
    chunks = []
    info = spec.get("info", {})
    api_title = info.get("title", "Atlas API")
    api_version = info.get("version", "")

    # One chunk per endpoint (path + method)
    paths = spec.get("paths", {})
    for path, methods in paths.items():
        for method, operation in methods.items():
            if method.lower() not in ["get", "post", "put", "patch", "delete", "options"]:
                continue

            op_id = operation.get("operationId", "")
            summary = operation.get("summary", "")
            description = operation.get("description", "")
            tags = operation.get("tags", [])
            parameters = operation.get("parameters", [])
            request_body = operation.get("requestBody", {})
            responses = operation.get("responses", {})

            # Build markdown content for this endpoint
            lines = []
            lines.append(f"**Endpoint**: `{method.upper()} {path}`")
            if summary:
                lines.append(f"**Summary**: {summary}")
            if tags:
                lines.append(f"**Tags**: {', '.join(tags)}")
            if description:
                lines.append(f"\n{description}")

            if parameters:
                lines.append("\n**Parameters**:")
                for p in parameters:
                    p_name = p.get("name", "")
                    p_in = p.get("in", "")
                    p_required = "required" if p.get("required") else "optional"
                    p_desc = p.get("description", "")
                    lines.append(f"- `{p_name}` ({p_in}, {p_required}): {p_desc}")

            if request_body:
                lines.append("\n**Request Body**: Required" if request_body.get("required") else "\n**Request Body**: Optional")
                content = request_body.get("content", {})
                for media_type in content:
                    lines.append(f"- Content-Type: `{media_type}`")

            if responses:
                lines.append("\n**Responses**:")
                for code, resp in responses.items():
                    resp_desc = resp.get("description", "")
                    lines.append(f"- `{code}`: {resp_desc}")

            heading = f"{method.upper()} {path}"
            if summary:
                heading = f"{method.upper()} {path} — {summary}"

            chunks.append({
                "heading": heading,
                "text": "\n".join(lines),
                "title": api_title,
                "section": "openapi_reference",
                "url": OPENAPI_URL,
                "tags": tags,
                "method": method.upper(),
                "path": path,
                "operation_id": op_id,
            })

    print(f"Parsed {len(chunks)} endpoint chunks from spec")
    return chunks


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:60]


async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("Atlas OpenAPI Reference Scraper")
    print("=" * 50)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()

        try:
            spec_url, page_html = await login_and_get_spec(page)

            if spec_url:
                # Fetch the raw spec
                print(f"\nFetching spec from {spec_url}...")
                response = await page.request.get(spec_url)
                if response.status == 200:
                    content_type = response.headers.get("content-type", "")
                    raw = await response.text()

                    # Save raw spec
                    ext = "yaml" if "yaml" in spec_url or "yaml" in content_type else "json"
                    spec_file = OUTPUT_DIR / f"openapi_spec.{ext}"
                    spec_file.write_text(raw, encoding="utf-8")
                    print(f"Raw spec saved to {spec_file}")

                    # Parse and save as markdown chunks
                    if ext == "json" or "json" in content_type:
                        spec = json.loads(raw)
                    else:
                        try:
                            import yaml
                            spec = yaml.safe_load(raw)
                        except ImportError:
                            print("PyYAML not installed — install with: pip install pyyaml")
                            return

                    chunks = parse_openapi_spec(spec)

                    # Save each tag group as a markdown file
                    by_tag = {}
                    for chunk in chunks:
                        tag = chunk["tags"][0] if chunk["tags"] else "general"
                        by_tag.setdefault(tag, []).append(chunk)

                    for tag, tag_chunks in by_tag.items():
                        filename = slugify(tag) + ".md"
                        filepath = OUTPUT_DIR / filename
                        lines = [f"# {tag} API Endpoints\n"]
                        for c in tag_chunks:
                            lines.append(f"## {c['heading']}\n")
                            lines.append(c["text"])
                            lines.append("\n---\n")
                        filepath.write_text("\n".join(lines), encoding="utf-8")
                        print(f"  Saved: openapi_reference/{filename} ({len(tag_chunks)} endpoints)")

                    # Save index
                    index_file = OUTPUT_DIR / "index.json"
                    index_file.write_text(json.dumps(chunks, indent=2), encoding="utf-8")
                    print(f"\n✓ {len(chunks)} endpoint chunks saved to {OUTPUT_DIR}")
                else:
                    print(f"Failed to fetch spec: HTTP {response.status}")
            else:
                print("\nCould not find OpenAPI spec URL automatically.")
                print("Check the debug snapshot to inspect the page structure:")
                print(f"  {OUTPUT_DIR}/debug/openapi_page.html")
                print("\nLook for the spec URL and we'll fetch it manually.")

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())