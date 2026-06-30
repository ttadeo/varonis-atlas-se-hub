"""
Teams SME Channel Scraper
Scrapes the "AI Security - SME" Teams channel via browser automation.
Connects to your already-running Chromium session — no login needed, nothing to close.

Output: scraper/output/teams_sme/raw_threads.json

Usage:
    Step 1 — Launch Chromium with remote debugging (Chromium has the saved Varonis/Teams session):
        /Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222

    Step 2 — In Chromium, navigate to the "AI Security - SME" Teams channel

    Step 3 — Run this script:
        python scraper/scrape_teams_sme.py

Notes:
    - Use Chromium, NOT Google Chrome — Chromium has the saved Varonis/Teams session
    - Chromium must be launched with --remote-debugging-port=9222 BEFORE running this script
    - You do NOT need to close Teams desktop app or any browser tabs
    - If Chromium is already open without the debug flag, quit it fully and relaunch with the flag
"""

import asyncio
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuration ────────────────────────────────────────────────────────────

# Chromium remote debugging endpoint — Chromium must be launched with --remote-debugging-port=9222
CDP_URL = "http://localhost:9222"

# Output
OUTPUT_DIR = Path(__file__).parent / "output" / "teams_sme"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Max scroll attempts before giving up (safety limit)
MAX_SCROLL_ATTEMPTS = 500

# ─── Auto-detect cutoff from last scrape ─────────────────────────────────────

def get_last_scrape_date() -> str | None:
    """
    Read the scraped_at timestamp from the previous raw_threads_latest.json.
    Returns a date string (YYYY-MM-DD) to use as SCRAPE_SINCE, or None for full history.
    """
    latest_path = OUTPUT_DIR / "raw_threads_latest.json"
    if not latest_path.exists():
        return None
    try:
        with open(latest_path, encoding="utf-8") as f:
            data = json.load(f)
        scraped_at = data.get("scraped_at", "")
        if not scraped_at:
            return None
        # Parse ISO timestamp and return just the date portion
        dt = datetime.fromisoformat(scraped_at.replace("Z", "+00:00"))
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return None

SCRAPE_SINCE = get_last_scrape_date()

# ─── Helpers ──────────────────────────────────────────────────────────────────

def clean_text(text: str) -> str:
    """Normalize whitespace and remove control characters."""
    if not text:
        return ""
    text = re.sub(r"[\r\n\t]+", " ", text)
    text = re.sub(r"\s{2,}", " ", text)
    return text.strip()


def is_before_cutoff(timestamp: str) -> bool:
    """Check if a timestamp is before SCRAPE_SINCE cutoff."""
    if not SCRAPE_SINCE or not timestamp:
        return False
    try:
        msg_date = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        cutoff = datetime.fromisoformat(SCRAPE_SINCE + "T00:00:00+00:00")
        return msg_date < cutoff
    except Exception:
        return False


# ─── Extraction ───────────────────────────────────────────────────────────────

async def extract_messages(page) -> list[dict]:
    """
    Extract all visible messages from the current viewport.
    Called repeatedly during scroll to capture messages before they unload.

    Selectors confirmed from live DOM inspection of teams.cloud.microsoft.mcas.ms
    """
    messages = []

    try:
        msg_elements = await page.query_selector_all("[data-tid='chat-pane-message']")

        for el in msg_elements:
            try:
                # Message ID — data-mid attribute on the container
                msg_id = await el.get_attribute("data-mid") or ""
                if not msg_id:
                    continue

                # Author — span with data-tid='message-author-name'
                author_el = await el.query_selector("[data-tid='message-author-name']")
                if not author_el:
                    # author is in the parent wrapper, not inside chat-pane-message
                    parent = await el.evaluate_handle("el => el.parentElement")
                    author_el = await parent.query_selector("[data-tid='message-author-name']")
                author = clean_text(await author_el.inner_text()) if author_el else "Unknown"

                # Timestamp — time element aria-label contains human readable date
                time_el = await el.query_selector("time")
                if not time_el:
                    # try parent
                    parent = await el.evaluate_handle("el => el.parentElement")
                    time_el = await parent.query_selector("time")
                timestamp_label = await time_el.get_attribute("aria-label") if time_el else ""
                # datetime attribute may not exist — use aria-label as fallback
                timestamp_dt = await time_el.get_attribute("datetime") if time_el else ""
                timestamp = timestamp_dt or timestamp_label or ""

                # Message text — div with data-message-content attribute, or id=content-{mid}
                content_el = await el.query_selector(f"#content-{msg_id}, [data-message-content]")
                if content_el:
                    text = clean_text(await content_el.inner_text())
                else:
                    # Fallback: use aria-label on the container (Teams puts full text there)
                    aria_text = await el.get_attribute("aria-label") or ""
                    text = clean_text(aria_text)

                # Skip empty, very short, or pure reaction messages
                if len(text) < 10:
                    continue

                # Is this a reply? Replies contain a quoted-reply-card
                quoted = await el.query_selector("[data-tid='quoted-reply-card']")
                is_reply = quoted is not None

                # Use msg_id as thread_id for root messages
                # For replies, we'll group by proximity/author context in post-processing
                # since Teams MCAS proxy may not expose thread IDs directly
                thread_id = msg_id  # will be refined in post-processing

                messages.append({
                    "message_id": msg_id,
                    "thread_id": thread_id,
                    "author": author,
                    "timestamp": timestamp,
                    "text": text,
                    "is_reply": is_reply,
                })

            except Exception:
                continue

    except Exception as e:
        print(f"  Warning: extraction pass failed — {e}")

    return messages


async def expand_thread_replies(page) -> None:
    """
    Click any collapsed thread/reply expanders visible on screen.
    """
    try:
        # Teams MCAS proxy uses chat-fluid-thread-pane-button for thread expansion
        expand_buttons = await page.query_selector_all(
            "[data-tid='chat-fluid-thread-pane-button'], button[aria-label*='repl'], button[aria-label*='thread']"
        )
        for btn in expand_buttons:
            try:
                await btn.click()
                await page.wait_for_timeout(300)
            except Exception:
                continue
    except Exception:
        pass


# ─── Main Scraper ─────────────────────────────────────────────────────────────

async def scrape_channel(page) -> dict[str, dict]:
    """
    Scroll through the channel, extracting messages and expanding threads.
    Returns a dict of thread_id → thread data.
    """
    threads: dict[str, dict] = {}
    seen_ids: set[str] = set()
    scroll_attempts = 0
    reached_cutoff = False

    print("Starting channel scrape...")
    print("Scrolling up to load message history — this may take a while.\n")

    # Find the scrollable message list container
    # Teams uses a virtualized list — we need to scroll the container, not the window
    scroll_container_selector = (
        "[data-tid='message-list'], "
        ".fui-List__root, "
        "[class*='messageList'], "
        "[role='list'][class*='message']"
    )

    while scroll_attempts < MAX_SCROLL_ATTEMPTS and not reached_cutoff:
        scroll_attempts += 1

        # Expand any collapsed thread replies visible right now
        await expand_thread_replies(page)
        await page.wait_for_timeout(500)

        # Extract all currently visible messages
        visible_messages = await extract_messages(page)
        new_count = 0

        for msg in visible_messages:
            if msg["message_id"] in seen_ids:
                continue

            seen_ids.add(msg["message_id"])
            new_count += 1

            # Check date cutoff
            if is_before_cutoff(msg["timestamp"]):
                reached_cutoff = True
                print(f"  Reached cutoff date {SCRAPE_SINCE} — stopping scroll")
                break

            tid = msg["thread_id"]

            if not msg["is_reply"]:
                # Root message — creates or updates thread
                if tid not in threads:
                    threads[tid] = {
                        "thread_id": tid,
                        "root": msg,
                        "replies": [],
                        "scraped_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    }
                else:
                    # Update root if we find it (may have been added as placeholder)
                    threads[tid]["root"] = msg
            else:
                # Reply — add to existing thread or create placeholder
                if tid not in threads:
                    threads[tid] = {
                        "thread_id": tid,
                        "root": None,  # will be filled when root is found
                        "replies": [],
                        "scraped_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    }
                threads[tid]["replies"].append(msg)

        print(f"  Scroll {scroll_attempts:3d} — {new_count} new messages | {len(threads)} threads total | {len(seen_ids)} messages seen")

        if new_count == 0 and scroll_attempts > 3:
            print("  No new messages in this pass — checking if we've reached the top...")
            # Try one more aggressive scroll
            await page.evaluate("""
                const container =
                    document.querySelector('[data-tid="message-list"]') ||
                    document.querySelector('[data-tid="chat-pane-list"]') ||
                    (function() {
                        const msg = document.querySelector('[data-tid="chat-pane-message"]');
                        if (!msg) return null;
                        let el = msg.parentElement;
                        while (el) {
                            if (el.scrollHeight > el.clientHeight) return el;
                            el = el.parentElement;
                        }
                        return null;
                    })();
                if (container) container.scrollTop = 0;
                else window.scrollTo(0, 0);
            """)
            await page.wait_for_timeout(2000)

            # Check again
            check_messages = await extract_messages(page)
            truly_new = [m for m in check_messages if m["message_id"] not in seen_ids]
            if not truly_new:
                print("  Confirmed: reached top of channel history.")
                break

        # Scroll up to load older messages
        # Teams MCAS renders messages in a scrollable div — find by data-tid or class
        await page.evaluate("""
            const container =
                document.querySelector('[data-tid="message-list"]') ||
                document.querySelector('[data-tid="chat-pane-list"]') ||
                document.querySelector('[class*="chatMessageList"]') ||
                document.querySelector('[class*="MessageList"]') ||
                // fallback: find the scrollable ancestor of the first message
                (function() {
                    const msg = document.querySelector('[data-tid="chat-pane-message"]');
                    if (!msg) return null;
                    let el = msg.parentElement;
                    while (el) {
                        if (el.scrollHeight > el.clientHeight) return el;
                        el = el.parentElement;
                    }
                    return null;
                })();
            if (container) {
                container.scrollTop = 0;
            } else {
                window.scrollTo(0, 0);
            }
        """)

        # Wait for Teams to load the next batch of messages
        await page.wait_for_timeout(1500)

    return threads


async def wait_for_channel_load(page) -> bool:
    """Wait for the Teams channel to fully load after navigation."""
    print("Waiting for Teams channel to load...")

    try:
        # Wait for the message list to appear
        await page.wait_for_selector(
            "[data-tid='message-list'], [class*='messageList'], [role='list']",
            timeout=30000,
        )
        await page.wait_for_timeout(3000)  # Extra buffer for dynamic content
        print("✓ Channel loaded")
        return True
    except Exception:
        print("✗ Could not detect message list — Teams may not have loaded correctly")
        print("  Check that you're on the correct channel and Teams is fully loaded")
        return False


# ─── Entry Point ──────────────────────────────────────────────────────────────

async def main():
    print("=" * 60)
    print("Atlas Teams SME Channel Scraper")
    print("=" * 60)
    print(f"Output: {OUTPUT_DIR}")
    print(f"Cutoff: {SCRAPE_SINCE or 'Full history'}")
    print()

    async with async_playwright() as p:
        print(f"Connecting to Chromium at {CDP_URL}...")
        print("Make sure Chromium was launched with: --remote-debugging-port=9222\n")

        try:
            browser = await p.chromium.connect_over_cdp(CDP_URL)
        except Exception as e:
            print(f"✗ Could not connect to Chromium: {e}")
            print()
            print("Fix: Quit Chromium fully, then relaunch with:")
            print("  /Applications/Chromium.app/Contents/MacOS/Chromium --remote-debugging-port=9222")
            return

        print("✓ Connected to Chromium")

        # Find the Teams tab — check multiple possible URLs including MCAS proxy
        TEAMS_URL_PATTERNS = [
            "teams.microsoft.com",
            "teams.cloud.microsoft",
            "teams.live.com",
            "mcas.ms",
        ]
        page = None
        for context in browser.contexts:
            for p_page in context.pages:
                if any(pattern in p_page.url for pattern in TEAMS_URL_PATTERNS):
                    page = p_page
                    print(f"✓ Found Teams tab: {p_page.url[:80]}")
                    break
            if page:
                break

        if not page:
            # No Teams tab found — use the first available page
            all_pages = [p for ctx in browser.contexts for p in ctx.pages]
            if all_pages:
                page = all_pages[0]
                print(f"  No Teams tab found. Using: {page.url[:80]}")
            else:
                page = await browser.contexts[0].new_page()

        # Check we're on the right channel
        current_url = page.url
        if not any(pattern in current_url for pattern in TEAMS_URL_PATTERNS):
            print("\n" + "=" * 50)
            print("ACTION REQUIRED:")
            print("1. In Chromium, navigate to the 'AI Security - SME' Teams channel")
            print("2. Wait for messages to load")
            print("3. Press Enter here to start scraping")
            print("=" * 50)
            input()
        else:
            print("\n" + "=" * 50)
            print("ACTION REQUIRED:")
            print("Confirm you are on the 'AI Security - SME' channel in Chromium.")
            print("Press Enter when ready to start scraping.")
            print("=" * 50)
            input()

        await wait_for_channel_load(page)

        # Take a debug screenshot before starting
        debug_path = OUTPUT_DIR / "debug_before_scrape.png"
        await page.screenshot(path=str(debug_path), full_page=False)
        print(f"Debug screenshot saved: {debug_path}")

        # Run the scrape
        threads = await scrape_channel(page)

        # Disconnect from Chromium (does NOT close the browser — your tabs stay open)
        await browser.close()

    # ── Post-process ──────────────────────────────────────────────────────────

    # Filter out threads with no root message (orphaned replies)
    complete_threads = {
        tid: t for tid, t in threads.items()
        if t.get("root") is not None
    }

    orphaned = len(threads) - len(complete_threads)
    if orphaned:
        print(f"\n  Dropped {orphaned} orphaned reply threads (root message not captured)")

    # Sort threads by root message timestamp (oldest first)
    sorted_threads = sorted(
        complete_threads.values(),
        key=lambda t: t["root"].get("timestamp", "") or "",
    )

    # ── Save raw output ───────────────────────────────────────────────────────

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"raw_threads_{timestamp}.json"
    latest_path = OUTPUT_DIR / "raw_threads_latest.json"

    output = {
        "scraped_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "total_threads": len(sorted_threads),
        "total_messages": sum(1 + len(t["replies"]) for t in sorted_threads),
        "channel": "AI Security - SME",
        "cutoff": SCRAPE_SINCE,
        "threads": sorted_threads,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # ── Summary ───────────────────────────────────────────────────────────────

    print("\n" + "=" * 60)
    print("Scrape Complete")
    print("=" * 60)
    print(f"  Threads captured : {len(sorted_threads)}")
    print(f"  Total messages   : {output['total_messages']}")
    print(f"  Output           : {output_path}")
    print(f"  Latest symlink   : {latest_path}")
    print()
    print("Next step: run process_teams_sme.py to classify and extract Q&A pairs")


if __name__ == "__main__":
    asyncio.run(main())
