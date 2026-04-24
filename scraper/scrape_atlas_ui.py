"""
Atlas UI Scraper — Phase 1
Logs in via Auth0 and scrapes the Atlas application UI (not docs).
Captures: page title, URL path, left nav structure, breadcrumbs,
visible headings, buttons, tabs, and descriptive text per view.

Output: scraper/output/ui_navigation/<page>.json + master index
"""

import asyncio
import json
import re
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuration ────────────────────────────────────────────────────────────

BASE_URL = "https://prod.alltrue-be.com"
ORG_ID   = "82d61b63-ca61-4705-b62d-02266001c6bc"
PROJECT_ID = "28c96091-b86b-438f-b702-7f2f368423d8"
QUERY_PARAMS = f"?organization={ORG_ID}&project={PROJECT_ID}"

OUTPUT_DIR = Path(__file__).parent / "output" / "ui_navigation"

# Known Atlas UI routes to visit — grouped by nav section
# Updated from live nav discovery against prod.alltrue-be.com (2026-04-20)
# Each entry: (path, friendly_name, nav_section)
# Note: QUERY_PARAMS are appended to every URL at runtime
UI_ROUTES = [
    # Dashboard / Home
    ("/",                                                       "Home Dashboard",                           "home"),

    # AI 360
    ("/ai-360",                                                 "AI 360",                                   "ai_360"),
    ("/ai-360/risks",                                           "AI 360 — Risks",                           "ai_360"),
    ("/ai-360/alerts",                                          "AI 360 — Alerts",                          "ai_360"),
    ("/ai-360/report",                                          "AI 360 — Report",                          "ai_360"),

    # AI Inventory
    ("/ai-inventory",                                           "AI Inventory",                             "ai_inventory"),
    ("/ai-inventory/technologies",                              "AI Inventory — Technologies",              "ai_inventory"),
    ("/ai-inventory/technologies/list/active",                  "AI Inventory — All AI Resources",          "ai_inventory"),
    ("/ai-inventory/technologies/MicrosoftCopilotStudio",       "AI Inventory — Copilot Studio Agent",      "ai_inventory"),
    ("/ai-inventory/technologies/MLArtifact",                   "AI Inventory — Model Artifact File",       "ai_inventory"),
    ("/ai-inventory/technologies/SageMaker",                    "AI Inventory — SageMaker Artifact",        "ai_inventory"),
    ("/ai-inventory/technologies/openai-enterprise-data",       "AI Inventory — OpenAI File",               "ai_inventory"),
    ("/ai-inventory/technologies/azure-openai-api-key",         "AI Inventory — Azure OpenAI Endpoint",     "ai_inventory"),
    ("/ai-inventory/technologies/AzureMachineLearning",         "AI Inventory — Machine Learning Workspace","ai_inventory"),
    ("/ai-inventory/technologies/openai-api-key",               "AI Inventory — OpenAI API Key",            "ai_inventory"),
    ("/ai-inventory/technologies/AzureAIFoundry",               "AI Inventory — Azure AI Foundry",          "ai_inventory"),
    ("/ai-inventory/technologies/MLFile",                       "AI Inventory — Model File",                "ai_inventory"),
    ("/ai-inventory/technologies/Microsoft-Copilot-Studio",     "AI Inventory — Microsoft Copilot Studio",  "ai_inventory"),
    ("/ai-inventory/technologies/Microsoft-Copilot",            "AI Inventory — Microsoft Copilot",         "ai_inventory"),
    ("/ai-inventory/technologies/azure-openai-data",            "AI Inventory — Azure OpenAI File",         "ai_inventory"),
    ("/ai-inventory/technologies/custom-ai-agent-tool",         "AI Inventory — Custom AI Agent Tool",      "ai_inventory"),
    ("/ai-inventory/technologies/google-ai-api-key",            "AI Inventory — Google AI API Key",         "ai_inventory"),

    # AI Usage
    ("/ai-usage/overview",                                      "AI Usage",                                 "ai_usage"),

    # AI Red Team
    ("/ai-red-team",                                            "AI Red Team",                              "ai_red_team"),

    # AI SPM (real path: /spm)
    ("/spm",                                                    "AI SPM",                                   "ai_spm"),

    # AI Runtime / Gateway (real path: /ai-gateway)
    ("/ai-gateway",                                             "AI Runtime",                               "ai_gateway"),
    ("/ai-gateway/policies",                                    "AI Runtime — Policies",                    "ai_gateway"),

    # AI MCP
    ("/mcp/catalog",                                            "AI MCP — Catalog",                         "ai_mcp"),

    # AI Investigation / Monitor (real path: /ai-monitor)
    ("/ai-monitor",                                             "AI Investigation",                         "ai_investigation"),

    # AI Compliance
    ("/ai-compliance",                                          "AI Compliance",                            "ai_compliance"),
    ("/ai-compliance/audit",                                    "AI Compliance — Audit Log",                "ai_compliance"),

    # AI TPRM
    ("/ai-tprm",                                                "AI TPRM",                                  "ai_tprm"),

    # AI Incidents
    ("/ai-incidents",                                           "AI Incidents",                             "ai_incidents"),
]

# ─── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "_", text)
    return text[:60]


def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# ─── Login ────────────────────────────────────────────────────────────────────

async def login(page):
    print("\n" + "="*50)
    print("ACTION REQUIRED: Manual login needed")
    print("="*50)
    await page.goto(BASE_URL + "/ai-360" + QUERY_PARAMS)
    await page.wait_for_load_state("networkidle")

    current_url = page.url
    if "auth0" in current_url or "login" in current_url:
        print("Browser window opened — please log in with your Varonis credentials.")
        print("Waiting (up to 2 minutes)...\n")
        await page.wait_for_url(
            lambda url: "auth0" not in url and "login" not in url,
            timeout=120000
        )
        await page.wait_for_load_state("networkidle")

    print("✓ Login successful\n")


# ─── Scrape a single UI page ──────────────────────────────────────────────────

async def discover_nav_routes(page) -> list[tuple[str, str, str]]:
    """
    Visit the home page and extract all nav links to discover real routes.
    Returns list of (path, label, nav_section) tuples.
    """
    print("Discovering real nav routes from sidebar...")
    await page.goto(BASE_URL + "/ai-360" + QUERY_PARAMS)
    await page.wait_for_load_state("networkidle")
    await page.wait_for_timeout(2000)

    # Collect all internal links
    all_links = await page.eval_on_selector_all(
        "a[href]",
        "els => els.map(el => ({ href: el.href, text: el.innerText.trim() }))"
    )

    seen = set()
    routes = []
    for link in all_links:
        href = link["href"]
        text = link["text"].strip()
        if not text or not href:
            continue
        # Only prod.alltrue-be.com links, skip auth/docs/api links
        if "prod.alltrue-be.com" not in href:
            continue
        if any(x in href for x in ["auth0", "_docs", "openapi", "graphql", "login"]):
            continue
        # Extract path (strip base + query params)
        path = href.replace(BASE_URL, "").split("?")[0]
        if not path or path in seen:
            continue
        seen.add(path)
        # Infer nav_section from path
        section = path.strip("/").split("/")[0] if path.strip("/") else "home"
        section = section.replace("-", "_")
        routes.append((path, text or path, section))

    print(f"  Discovered {len(routes)} real routes from nav")

    # Merge with hardcoded list — add any hardcoded routes not found in nav
    discovered_paths = {r[0] for r in routes}
    for path, name, section in UI_ROUTES:
        if path not in discovered_paths:
            routes.append((path, name, section))

    print(f"  Total routes to attempt: {len(routes)}")
    return routes


async def is_404(page) -> bool:
    """Check if current page is a not-found / error page."""
    try:
        body = await page.inner_text("body")
        title = await page.title()
        indicators = ["not found", "404", "page not found", "doesn't exist", "no longer exists"]
        return any(i in body.lower()[:500] or i in title.lower() for i in indicators)
    except Exception:
        return False


async def scrape_ui_page(page, path: str, friendly_name: str, nav_section: str) -> dict:
    url = BASE_URL + path + QUERY_PARAMS
    print(f"  → {friendly_name} ({path})")

    try:
        await page.goto(url)
        await page.wait_for_load_state("networkidle", timeout=20000)
        await page.wait_for_timeout(2000)  # let React hydrate

        # Scroll to trigger lazy-loaded content and virtual lists
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight / 2)")
        await page.wait_for_timeout(800)
        await page.evaluate("window.scrollTo(0, 0)")
        await page.wait_for_timeout(700)

        # Wait up to 3s more for content beyond a bare skeleton (h2/h3 or buttons)
        try:
            await page.wait_for_selector("h2, h3, button:not([disabled])", timeout=3000)
        except Exception:
            pass  # some pages genuinely have no h2/h3 — that's fine

        # Skip 404 / not-found pages
        if await is_404(page):
            print(f"     ⚠ 404 / not found — skipping")
            return {
                "url": url, "path": path, "title": friendly_name,
                "friendly_name": friendly_name, "nav_section": nav_section,
                "breadcrumbs": [], "nav_items": [], "headings": [],
                "buttons": [], "tabs": [], "body_text": "",
                "navigation_description": "", "status": "404_skipped"
            }

        # ── Page title ────────────────────────────────────────────────────────
        try:
            title = await page.title()
            title = title.split("|")[0].strip() if "|" in title else title.strip()
        except Exception:
            title = friendly_name

        # ── Breadcrumbs ───────────────────────────────────────────────────────
        breadcrumbs = []
        try:
            crumb_els = await page.query_selector_all(
                "[aria-label='breadcrumb'] a, [aria-label='breadcrumb'] span, "
                ".breadcrumb a, .breadcrumb span, nav[aria-label*='read'] a"
            )
            for el in crumb_els:
                text = clean_text(await el.inner_text())
                if text:
                    breadcrumbs.append(text)
        except Exception:
            pass

        # ── Left nav items (what's visible/active in sidebar) ─────────────────
        nav_items = []
        try:
            nav_els = await page.query_selector_all(
                "nav a, aside a, [role='navigation'] a, "
                ".sidebar a, .nav-menu a, [class*='nav'] a, [class*='sidebar'] a"
            )
            seen_nav = set()
            for el in nav_els:
                text = clean_text(await el.inner_text())
                href = await el.get_attribute("href") or ""
                if text and text not in seen_nav and len(text) < 60:
                    seen_nav.add(text)
                    nav_items.append({"label": text, "href": href})
        except Exception:
            pass

        # ── Headings ──────────────────────────────────────────────────────────
        headings = []
        try:
            heading_els = await page.query_selector_all("h1, h2, h3")
            for el in heading_els:
                text = clean_text(await el.inner_text())
                tag = await el.evaluate("el => el.tagName.toLowerCase()")
                if text and len(text) < 120:
                    headings.append({"level": tag, "text": text})
        except Exception:
            pass

        # ── Buttons and CTAs ──────────────────────────────────────────────────
        buttons = []
        try:
            btn_els = await page.query_selector_all(
                "button:not([disabled]), [role='button'], "
                "a[class*='button'], a[class*='btn']"
            )
            seen_btns = set()
            for el in btn_els:
                text = clean_text(await el.inner_text())
                if text and text not in seen_btns and len(text) < 80 and len(text) > 1:
                    seen_btns.add(text)
                    buttons.append(text)
        except Exception:
            pass

        # ── Tabs ──────────────────────────────────────────────────────────────
        tabs = []
        try:
            tab_els = await page.query_selector_all(
                "[role='tab'], [class*='tab'] button, [class*='Tab'] button, "
                "nav[class*='tab'] a, ul[class*='tab'] li"
            )
            for el in tab_els:
                text = clean_text(await el.inner_text())
                if text and len(text) < 60:
                    tabs.append(text)
        except Exception:
            pass

        # ── Main visible text (body content, excluding nav/footer) ────────────
        body_text = ""
        try:
            body_text = await page.evaluate("""
                () => {
                    const main = document.querySelector('main, [role="main"], .main-content, #main, .content');
                    if (!main) return document.body.innerText;
                    // Remove nav elements within main
                    const clone = main.cloneNode(true);
                    clone.querySelectorAll('nav, aside, header, footer, script, style').forEach(el => el.remove());
                    return clone.innerText;
                }
            """)
            # Clean up whitespace
            body_text = re.sub(r"\n{3,}", "\n\n", body_text)
            body_text = re.sub(r"[ \t]+", " ", body_text).strip()
            body_text = body_text[:3000]  # cap at 3000 chars
        except Exception:
            pass

        # ── Build navigation description ──────────────────────────────────────
        # This is the key chunk that answers "how do I find X in the UI"
        nav_path = " > ".join(breadcrumbs) if breadcrumbs else friendly_name
        tab_desc = f"\nTabs on this page: {', '.join(tabs)}" if tabs else ""
        btn_desc = f"\nAction buttons: {', '.join(buttons[:10])}" if buttons else ""
        heading_desc = "\n".join([f"{'#' * int(h['level'][1:])} {h['text']}" for h in headings[:10]]) if headings else ""

        navigation_description = f"""UI Location: {nav_path}
URL Path: {path}
Page Title: {title or friendly_name}{tab_desc}{btn_desc}

{heading_desc}

{body_text}""".strip()

        result = {
            "url": url,
            "path": path,
            "title": title or friendly_name,
            "friendly_name": friendly_name,
            "nav_section": nav_section,
            "breadcrumbs": breadcrumbs,
            "nav_items": nav_items[:20],
            "headings": headings[:15],
            "buttons": buttons[:15],
            "tabs": tabs,
            "body_text": body_text,
            "navigation_description": navigation_description,
            "status": "success"
        }

        print(f"     ✓ title='{title}' | tabs={len(tabs)} | buttons={len(buttons)} | headings={len(headings)}")
        return result

    except Exception as e:
        print(f"     ✗ Failed: {e}")
        return {
            "url": url,
            "path": path,
            "title": friendly_name,
            "friendly_name": friendly_name,
            "nav_section": nav_section,
            "breadcrumbs": [],
            "nav_items": [],
            "headings": [],
            "buttons": [],
            "tabs": [],
            "body_text": "",
            "navigation_description": "",
            "status": f"error: {e}"
        }


# ─── Main ─────────────────────────────────────────────────────────────────────

async def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    results = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        try:
            await login(page)

            routes = await discover_nav_routes(page)
            print(f"\nScraping {len(routes)} UI pages...\n")

            for i, (path, name, section) in enumerate(routes, 1):
                print(f"[{i}/{len(routes)}]")
                result = await scrape_ui_page(page, path, name, section)
                results.append(result)

                if result["status"] == "404_skipped":
                    await page.wait_for_timeout(300)
                    continue

                # Save individual JSON per page
                filename = slugify(name) + ".json"
                out_path = OUTPUT_DIR / filename
                out_path.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")

                await page.wait_for_timeout(1200)  # polite delay

        finally:
            await browser.close()

    # Save master index
    index_path = OUTPUT_DIR / "_index.json"
    index_path.write_text(json.dumps(results, indent=2, default=str), encoding="utf-8")

    success = sum(1 for r in results if r["status"] == "success")
    skipped = sum(1 for r in results if r["status"] == "404_skipped")
    failed  = sum(1 for r in results if r["status"] not in ("success", "404_skipped"))

    print(f"\n{'='*50}")
    print(f"UI scrape complete:")
    print(f"  ✓ {success} pages scraped")
    print(f"  ⚠ {skipped} pages skipped (404)")
    print(f"  ✗ {failed} pages failed")
    print(f"  Output: {OUTPUT_DIR}")
    print(f"\nNext step: run ingest_atlas_ui.py to load into Neo4j")


if __name__ == "__main__":
    asyncio.run(main())
