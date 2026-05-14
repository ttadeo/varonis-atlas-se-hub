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

    # Intercept network responses to capture the spec body as the SPA fetches it
    intercepted_spec_url = None
    intercepted_spec_body = None

    async def handle_response(response):
        nonlocal intercepted_spec_url, intercepted_spec_body
        if intercepted_spec_body:
            return
        url = response.url
        if any(kw in url for kw in ["openapi", "swagger", "spec", "/external"]):
            try:
                body = await response.text()
                if body and not body.strip().startswith("<") and len(body) > 1000:
                    intercepted_spec_url = url
                    intercepted_spec_body = body
                    print(f"Intercepted spec response from: {url} ({len(body)} bytes)")
            except Exception:
                pass

    page.on("response", handle_response)

    print(f"Navigating to {OPENAPI_URL}...")
    await page.goto(OPENAPI_URL)
    await page.wait_for_load_state("load", timeout=30000)

    # Handle login if redirected
    current_url = page.url
    if "auth0" in current_url or "login" in current_url:
        print("Login required — please log in manually...")
        await page.wait_for_url(
            lambda url: "prod.alltrue-be.com" in url,
            timeout=120000
        )
        await page.wait_for_load_state("load", timeout=30000)
        await page.wait_for_timeout(3000)
        # Navigate back to OpenAPI page after login so SPA loads the spec
        print("Navigating back to OpenAPI page after login...")
        await page.goto(OPENAPI_URL)
        await page.wait_for_load_state("load", timeout=30000)

    # Wait for SPA to hydrate and fetch the spec
    print("Waiting for SPA to load spec...")
    await page.wait_for_timeout(6000)

    # Save debug snapshot
    debug_dir = OUTPUT_DIR / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    await page.screenshot(path=str(debug_dir / "openapi_page.png"))
    html = await page.content()
    (debug_dir / "openapi_page.html").write_text(html, encoding="utf-8")
    print(f"Debug snapshot saved to {debug_dir}")

    # Use intercepted response body if we caught it
    if intercepted_spec_body:
        return intercepted_spec_url, html, intercepted_spec_body

    # Try clicking the Download button — the href will contain the spec URL
    print("Trying Download button...")
    try:
        download_link = await page.query_selector("a[download], a[href*='.json'], a[href*='.yaml']")
        if download_link:
            href = await download_link.get_attribute("href")
            if href:
                if href.startswith("/"):
                    href = BASE_URL + href
                print(f"Found spec via Download button: {href}")
                return href, html, None
    except Exception:
        pass

    # Try common spec paths as fallback
    host = BASE_URL.replace("https://", "")
    api_host = f"https://api.{host}"
    candidates = [
        f"{api_host}/openapi/external",
        f"{BASE_URL}/_docs/api/openapi.json",
        f"{BASE_URL}/_docs/api/openapi.yaml",
        f"{BASE_URL}/api/openapi.json",
        f"{BASE_URL}/openapi.json",
    ]
    print("Trying common spec paths...")
    for candidate in candidates:
        try:
            response = await page.request.get(candidate)
            if response.status == 200:
                body = await response.text()
                if body.strip().startswith("<"):
                    print(f"  Skipping {candidate} — returned HTML")
                    continue
                print(f"Found spec at: {candidate}")
                return candidate, html, None
        except Exception:
            pass

    return None, html, None


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
            spec_url, page_html, spec_body = await login_and_get_spec(page)

            if spec_url:
                print(f"\nFetching spec from {spec_url}...")

                if spec_body:
                    # Already captured via response interception
                    raw = spec_body
                    print(f"Using intercepted spec body ({len(raw)} bytes)")
                else:
                    # Navigate the browser to the spec URL so auth cookies are sent
                    await page.goto(spec_url)
                    await page.wait_for_load_state("load", timeout=15000)
                    raw = await page.evaluate("() => document.body.innerText")

                if not raw or raw.strip().startswith("<"):
                    print("Failed to fetch spec — got HTML instead of JSON/YAML")
                else:
                    # Save raw spec
                    ext = "yaml" if "yaml" in spec_url else "json"
                    spec_file = OUTPUT_DIR / f"openapi_spec.{ext}"
                    spec_file.write_text(raw, encoding="utf-8")
                    print(f"Raw spec saved to {spec_file}")

                    # Parse spec
                    if ext == "json":
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
                print("\nCould not find OpenAPI spec URL automatically.")
                print("Check the debug snapshot to inspect the page structure:")
                print(f"  {OUTPUT_DIR}/debug/openapi_page.html")
                print("\nLook for the spec URL and we'll fetch it manually.")

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())