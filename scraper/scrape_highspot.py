"""
Highspot Competitive Intelligence Scraper
Opens a browser for manual SSO login, then scrapes the target Highspot item
and any linked pages discovered in the content.
Output: markdown files saved to ./output/competitive/
"""

import asyncio
import re
import json
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuration ────────────────────────────────────────────────────────────

TARGET_URL = "https://varonis.highspot.com/items/698288226eb2f6bd720957b6?lfrm=srp.1"
BASE_DOMAIN = "varonis.highspot.com"
OUTPUT_DIR  = Path(__file__).parent / "output" / "competitive"

# ─── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:80]


def clean_text(text: str) -> str:
    """Clean up whitespace from extracted page text."""
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


# ─── Login ────────────────────────────────────────────────────────────────────

async def login(page):
    """Navigate to the target URL and wait for manual SSO login."""
    print("\n" + "=" * 50)
    print("ACTION REQUIRED: Manual login needed")
    print("=" * 50)

    await page.goto(TARGET_URL)
    await page.wait_for_load_state("networkidle")

    print("A browser window has opened.")
    print("Please log in with your Varonis SSO credentials.")
    print("")
    print("Once you are fully logged in and can see the Highspot page,")
    print("come back here and press ENTER to continue...")
    input()

    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(2000)

    print("✓ Continuing with scrape...")


# ─── Scrape a single Highspot page ────────────────────────────────────────────

async def scrape_page(page, url: str) -> dict:
    """Navigate to a Highspot page and extract all readable text content."""
    try:
        print(f"  Navigating to: {url}")
        await page.goto(url)
        await page.wait_for_load_state("networkidle")
        await page.wait_for_timeout(3000)  # allow SPA to render

        # Get page title
        try:
            title = await page.title()
            title = title.replace(" | Highspot", "").replace(" - Highspot", "").strip()
        except Exception:
            title = "competitive_intel"

        # Try to extract the main content area
        # Highspot renders content in various containers — try in order
        content = ""
        selectors = [
            "[data-testid='item-viewer-content']",
            ".item-viewer",
            ".content-viewer",
            "main",
            "article",
            ".spot-content",
            "body",
        ]
        for selector in selectors:
            try:
                el = await page.query_selector(selector)
                if el:
                    content = await el.inner_text()
                    if len(content.strip()) > 200:
                        break
            except Exception:
                continue

        if not content:
            content = await page.evaluate("() => document.body.innerText")

        content = clean_text(content)

        # Save debug screenshot
        debug_dir = OUTPUT_DIR / "debug"
        debug_dir.mkdir(parents=True, exist_ok=True)
        safe_name = slugify(title) or "page"
        await page.screenshot(
            path=str(debug_dir / f"{safe_name}.png"),
            full_page=True
        )

        return {
            "url": url,
            "title": title,
            "content": content,
            "status": "success"
        }

    except Exception as e:
        print(f"  ✗ Failed to scrape {url}: {e}")
        return {"url": url, "title": "", "content": "", "status": f"error: {e}"}


# ─── Discover linked Highspot pages ───────────────────────────────────────────

async def discover_links(page) -> list[str]:
    """Find links to other Highspot items from the current page."""
    try:
        all_links = await page.eval_on_selector_all(
            "a[href]",
            "els => els.map(el => el.href)"
        )
        # Filter to Highspot item links only
        item_links = list({
            l for l in all_links
            if BASE_DOMAIN in l and "/items/" in l and l != page.url
        })
        print(f"  Found {len(item_links)} linked Highspot items")
        return item_links
    except Exception:
        return []


# ─── Save page as markdown ────────────────────────────────────────────────────

def save_page(doc: dict):
    """Save a scraped page as a markdown file."""
    if not doc["content"] or doc["status"] != "success":
        return None

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    filename = slugify(doc["title"] or "competitive_intel") + ".md"
    filepath = OUTPUT_DIR / filename

    md = f"""---
title: {doc["title"]}
url: {doc["url"]}
section: competitive
---

# {doc["title"]}

{doc["content"]}
"""
    filepath.write_text(md, encoding="utf-8")
    print(f"  ✓ Saved: competitive/{filename} ({len(doc['content'])} chars)")
    return filepath


# ─── Main ─────────────────────────────────────────────────────────────────────

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print("Highspot Competitive Intelligence Scraper")
    print("=" * 50)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page    = await context.new_page()

        try:
            # Step 1: Login
            await login(page)

            # Step 2: Scrape the target page
            print(f"\nScraping target page...")
            doc = await scrape_page(page, TARGET_URL)
            save_page(doc)

            # Step 3: Discover and scrape linked Highspot items
            linked = await discover_links(page)
            if linked:
                print(f"\nScraping {len(linked)} linked pages...")
                for i, url in enumerate(linked, 1):
                    print(f"[{i}/{len(linked)}]")
                    linked_doc = await scrape_page(page, url)
                    save_page(linked_doc)
                    await page.wait_for_timeout(500)

            # Step 4: Save index
            all_docs = [doc] + [{"url": u} for u in linked]
            index_path = OUTPUT_DIR / "index.json"
            index_path.write_text(json.dumps(all_docs, indent=2), encoding="utf-8")

            success = 1 if doc["status"] == "success" else 0
            print(f"\n{'=' * 50}")
            print(f"Scraping complete:")
            print(f"  ✓ {success + len(linked)} pages scraped")
            print(f"  Output: {OUTPUT_DIR}")

        finally:
            await browser.close()


if __name__ == "__main__":
    asyncio.run(main())
