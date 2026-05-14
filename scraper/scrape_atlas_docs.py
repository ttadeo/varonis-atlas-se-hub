"""
Atlas Documentation Scraper
Logs in via Auth0 and scrapes all sections of the Atlas docs site.
Output: one markdown file per page, saved to ./output/
"""

import asyncio
import os
import re
import json
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuration ────────────────────────────────────────────────────────────

BASE_URL = "https://prod.alltrue-be.com"
DOCS_BASE = f"{BASE_URL}/_docs/docs"
LOGIN_URL = f"{BASE_URL}"
OUTPUT_DIR = Path(__file__).parent / "output"

# No credentials needed — login is handled manually in the browser

# All known doc sections from the navigation
DOC_SECTIONS = [
    # Overview
    "overview/platform_and_applications",
    "overview/architecture",
    "overview/organizations_and_projects",
    "overview/gui_overview",
    # Applications
    "applications/ai_360",
    "applications/ai_inventory",
    "applications/ai_usage",
    "applications/ai_spm",
    "applications/ai_gateway",
    "applications/ai_monitor",
    "applications/ai_compliance",
    "applications/ai_observability",
    "applications/ai_incidents",
    "applications/ai_tprm",
    # Platform Services (expanded during crawl)
    "platform_services",
    # Integration Examples (expanded during crawl)
    "integration_examples",
    # Reference
    "openapi_reference",
    "graphql_reference",
    "release_notes",
]

# ─── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    """Convert a string to a safe filename."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text


def html_to_markdown(page_content: str) -> str:
    """Basic HTML to markdown conversion for doc content."""
    # Remove script and style tags
    content = re.sub(r"<script[^>]*>.*?</script>", "", page_content, flags=re.DOTALL)
    content = re.sub(r"<style[^>]*>.*?</style>", "", content, flags=re.DOTALL)
    # Headers
    content = re.sub(r"<h1[^>]*>(.*?)</h1>", r"# \1", content, flags=re.DOTALL)
    content = re.sub(r"<h2[^>]*>(.*?)</h2>", r"## \1", content, flags=re.DOTALL)
    content = re.sub(r"<h3[^>]*>(.*?)</h3>", r"### \1", content, flags=re.DOTALL)
    content = re.sub(r"<h4[^>]*>(.*?)</h4>", r"#### \1", content, flags=re.DOTALL)
    # Code blocks
    content = re.sub(r"<pre[^>]*><code[^>]*>(.*?)</code></pre>", r"```\n\1\n```", content, flags=re.DOTALL)
    content = re.sub(r"<code[^>]*>(.*?)</code>", r"`\1`", content, flags=re.DOTALL)
    # Bold and italic
    content = re.sub(r"<strong[^>]*>(.*?)</strong>", r"**\1**", content, flags=re.DOTALL)
    content = re.sub(r"<b[^>]*>(.*?)</b>", r"**\1**", content, flags=re.DOTALL)
    content = re.sub(r"<em[^>]*>(.*?)</em>", r"*\1*", content, flags=re.DOTALL)
    # Links
    content = re.sub(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', r"[\2](\1)", content, flags=re.DOTALL)
    # Lists
    content = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1", content, flags=re.DOTALL)
    # Paragraphs and line breaks
    content = re.sub(r"<p[^>]*>(.*?)</p>", r"\1\n", content, flags=re.DOTALL)
    content = re.sub(r"<br[^>]*/?>", "\n", content)
    # Remove remaining HTML tags
    content = re.sub(r"<[^>]+>", "", content)
    # Clean up whitespace
    content = re.sub(r"\n{3,}", "\n\n", content)
    content = re.sub(r"[ \t]+", " ", content)
    return content.strip()


# ─── Main Scraper ─────────────────────────────────────────────────────────────

async def login(page):
    """Navigate to the Atlas docs site and wait for manual login."""
    print("\n" + "="*50)
    print("ACTION REQUIRED: Manual login needed")
    print("="*50)
    await page.goto(DOCS_BASE + "/overview/platform_and_applications")
    await page.wait_for_load_state("domcontentloaded", timeout=60000)

    # Check if we landed on a login page
    current_url = page.url
    if "auth0" in current_url or "login" in current_url:
        print("A browser window has opened.")
        print("Please log in manually with your Varonis credentials.")
        print("Waiting for you to complete login...")
        print("(The script will continue automatically once you're logged in)\n")

        # Wait until we land back on the Atlas docs domain
        await page.wait_for_url(
            lambda url: "prod.alltrue-be.com" in url,
            timeout=120000  # 2 minute timeout to log in
        )
        await page.wait_for_load_state("load", timeout=30000)
        await page.wait_for_timeout(3000)  # Extra buffer for session cookie to settle

    print("✓ Login successful — continuing with scrape")


async def discover_nav_links(page) -> list[dict]:
    """
    Navigate to the docs and discover all links from the sidebar navigation,
    including expanding collapsed sections.
    """
    print("Discovering navigation links...")
    # Already on the docs page after login — only navigate if we're not there
    if DOCS_BASE not in page.url:
        await page.goto(f"{DOCS_BASE}/overview/platform_and_applications")
        await page.wait_for_load_state("load", timeout=30000)
        await page.wait_for_timeout(3000)

    # Save screenshot and HTML for debugging
    debug_dir = OUTPUT_DIR / "debug"
    debug_dir.mkdir(parents=True, exist_ok=True)
    await page.screenshot(path=str(debug_dir / "page_after_login.png"), full_page=True)
    html = await page.content()
    (debug_dir / "page_after_login.html").write_text(html, encoding="utf-8")
    print(f"  Debug screenshot and HTML saved to {debug_dir}")

    # Try broad link discovery — collect ALL links on the page
    all_links = await page.eval_on_selector_all(
        "a[href]",
        "elements => elements.map(el => ({ href: el.href, text: el.innerText.trim() }))"
    )
    print(f"  Total links found on page: {len(all_links)}")

    # Filter to doc links only
    doc_links = [l for l in all_links if "/_docs/docs" in l["href"] or "/docs/" in l["href"]]
    print(f"  Doc links found: {len(doc_links)}")

    # If no doc links found, print all unique hrefs for inspection
    if not doc_links:
        print("  No doc links found. Printing all hrefs for inspection:")
        for l in all_links[:30]:
            print(f"    {l['href']} — {l['text'][:50]}")

    # Expand all collapsed nav sections by clicking their toggles
    toggles = await page.query_selector_all("button, [role='button'], .toggle, .expand, [aria-expanded='false']")
    print(f"  Found {len(toggles)} expandable elements, clicking...")
    for toggle in toggles:
        try:
            await toggle.click()
            await page.wait_for_timeout(200)
        except Exception:
            pass

    # Collect links again after expanding
    all_links = await page.eval_on_selector_all(
        "a[href]",
        "elements => elements.map(el => ({ href: el.href, text: el.innerText.trim() }))"
    )
    doc_links = [l for l in all_links if "/_docs/docs" in l["href"] or "/docs/" in l["href"]]
    print(f"  Doc links after expanding: {len(doc_links)}")

    # Deduplicate
    seen = set()
    unique_links = []
    for link in doc_links:
        if link["href"] not in seen and link["text"]:
            seen.add(link["href"])
            unique_links.append(link)

    print(f"✓ Discovered {len(unique_links)} pages")
    return unique_links


async def scrape_page(page, url: str, title: str) -> dict:
    """Scrape a single documentation page and return its content."""
    try:
        await page.goto(url)
        await page.wait_for_load_state("domcontentloaded", timeout=15000)
        # Wait for Docusaurus React content to render
        await page.wait_for_selector(
            ".theme-doc-markdown, .markdown, main, article",
            timeout=15000
        )

        # Get the main content area
        content_html = await page.eval_on_selector(
            ".theme-doc-markdown, .markdown, main, article, .content, .docs-content, [role='main']",
            "el => el.innerHTML"
        )

        # Get page title from H1 if available
        try:
            h1 = await page.inner_text("h1")
            page_title = h1.strip() if h1 else title
        except Exception:
            page_title = title

        markdown = html_to_markdown(content_html)

        # Extract section from URL
        path = url.replace(f"{DOCS_BASE}/", "")
        section = path.split("/")[0] if "/" in path else path

        return {
            "url": url,
            "title": page_title,
            "section": section,
            "path": path,
            "content": markdown,
            "status": "success"
        }

    except Exception as e:
        print(f"  ✗ Failed to scrape {url}: {e}")
        return {
            "url": url,
            "title": title,
            "section": "",
            "path": "",
            "content": "",
            "status": f"error: {e}"
        }


async def save_page(doc: dict):
    """Save a scraped page as a markdown file."""
    if not doc["content"]:
        return

    section_dir = OUTPUT_DIR / slugify(doc["section"])
    section_dir.mkdir(parents=True, exist_ok=True)

    filename = slugify(doc["title"]) + ".md"
    filepath = section_dir / filename

    content = f"""---
title: {doc["title"]}
url: {doc["url"]}
section: {doc["section"]}
---

# {doc["title"]}

{doc["content"]}
"""

    filepath.write_text(content, encoding="utf-8")
    print(f"  ✓ Saved: {section_dir.name}/{filename}")


async def save_index(docs: list[dict]):
    """Save a JSON index of all scraped pages."""
    index = [
        {
            "title": d["title"],
            "url": d["url"],
            "section": d["section"],
            "path": d["path"],
            "status": d["status"],
            "file": f"{slugify(d['section'])}/{slugify(d['title'])}.md"
        }
        for d in docs
    ]
    index_path = OUTPUT_DIR / "index.json"
    index_path.write_text(json.dumps(index, indent=2), encoding="utf-8")
    print(f"\n✓ Index saved to {index_path}")


async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # headless=False so you can watch/debug
        context = await browser.new_context()
        page = await context.new_page()

        try:
            # Step 1: Login
            await login(page)

            # Step 2: Discover all nav links
            nav_links = await discover_nav_links(page)

            # Step 3: Scrape each page
            docs = []
            print(f"\nScraping {len(nav_links)} pages...\n")

            for i, link in enumerate(nav_links, 1):
                print(f"[{i}/{len(nav_links)}] {link['text']}")
                doc = await scrape_page(page, link["href"], link["text"])
                docs.append(doc)
                await save_page(doc)
                await page.wait_for_timeout(500)  # polite delay

            # Step 4: Save index
            await save_index(docs)

            # Summary
            success = sum(1 for d in docs if d["status"] == "success")
            failed = sum(1 for d in docs if d["status"] != "success")
            print(f"\n{'='*50}")
            print(f"Scraping complete:")
            print(f"  ✓ {success} pages scraped successfully")
            print(f"  ✗ {failed} pages failed")
            print(f"  Output: {OUTPUT_DIR}")

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
