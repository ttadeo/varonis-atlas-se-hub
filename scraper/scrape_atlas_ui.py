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
# Each entry: (path, friendly_name, nav_section)
# Note: QUERY_PARAMS are appended to every URL at runtime
UI_ROUTES = [
    # Dashboard / Home
    ("/",                                           "Home Dashboard",               "home"),

    # AI 360
    ("/ai-360",                                     "AI 360",                       "ai_360"),

    # AI Inventory
    ("/ai-inventory",                               "AI Inventory",                 "ai_inventory"),
    ("/ai-inventory/endpoints",                     "AI Inventory — Endpoints",     "ai_inventory"),
    ("/ai-inventory/models",                        "AI Inventory — Models",        "ai_inventory"),
    ("/ai-inventory/applications",                  "AI Inventory — Applications",  "ai_inventory"),
    ("/ai-inventory/users",                         "AI Inventory — Users",         "ai_inventory"),

    # AI Gateway
    ("/ai-gateway",                                 "AI Gateway",                   "ai_gateway"),
    ("/ai-gateway/policies",                        "AI Gateway — Policies",        "ai_gateway"),
    ("/ai-gateway/policies/new",                    "AI Gateway — New Policy",      "ai_gateway"),
    ("/ai-gateway/endpoints",                       "AI Gateway — Endpoints",       "ai_gateway"),
    ("/ai-gateway/logs",                            "AI Gateway — Logs",            "ai_gateway"),

    # AI SPM
    ("/ai-spm",                                     "AI SPM",                       "ai_spm"),
    ("/ai-spm/pentests",                            "AI SPM — PenTests",            "ai_spm"),
    ("/ai-spm/pentests/new",                        "AI SPM — New PenTest",         "ai_spm"),
    ("/ai-spm/vulnerabilities",                     "AI SPM — Vulnerabilities",     "ai_spm"),
    ("/ai-spm/posture",                             "AI SPM — Posture",             "ai_spm"),

    # AI Observability
    ("/ai-observability",                           "AI Observability",             "ai_observability"),
    ("/ai-observability/evaluate",                  "AI Observability — Evaluate",  "ai_observability"),
    ("/ai-observability/monitor",                   "AI Observability — Monitor",   "ai_observability"),

    # AI Incidents
    ("/ai-incidents",                               "AI Incidents",                 "ai_incidents"),

    # AI Compliance
    ("/ai-compliance",                              "AI Compliance",                "ai_compliance"),

    # AI TPRM
    ("/ai-tprm",                                    "AI TPRM",                      "ai_tprm"),

    # Settings
    ("/settings",                                   "Settings",                     "settings"),
    ("/settings/integrations",                      "Settings — Integrations",      "settings"),
    ("/settings/users",                             "Settings — Users",             "settings"),
    ("/settings/organization",                      "Settings — Organization",      "settings"),
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

async def scrape_ui_page(page, path: str, friendly_name: str, nav_section: str) -> dict:
    url = BASE_URL + path + QUERY_PARAMS
    print(f"  → {friendly_name} ({path})")

    try:
        await page.goto(url)
        await page.wait_for_load_state("networkidle", timeout=20000)
        await page.wait_for_timeout(1500)  # let React render

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

            print(f"Scraping {len(UI_ROUTES)} UI pages...\n")

            for i, (path, name, section) in enumerate(UI_ROUTES, 1):
                print(f"[{i}/{len(UI_ROUTES)}]")
                result = await scrape_ui_page(page, path, name, section)
                results.append(result)

                # Save individual JSON per page
                filename = slugify(name) + ".json"
                out_path = OUTPUT_DIR / filename
                out_path.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")

                await page.wait_for_timeout(800)  # polite delay

        finally:
            await browser.close()

    # Save master index
    index_path = OUTPUT_DIR / "_index.json"
    index_path.write_text(json.dumps(results, indent=2, default=str), encoding="utf-8")

    success = sum(1 for r in results if r["status"] == "success")
    failed = sum(1 for r in results if r["status"] != "success")

    print(f"\n{'='*50}")
    print(f"UI scrape complete:")
    print(f"  ✓ {success} pages scraped")
    print(f"  ✗ {failed} pages failed")
    print(f"  Output: {OUTPUT_DIR}")
    print(f"\nNext step: run ingest_atlas_ui.py to load into Neo4j")


if __name__ == "__main__":
    asyncio.run(main())
