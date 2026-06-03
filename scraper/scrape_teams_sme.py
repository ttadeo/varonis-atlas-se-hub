"""
Teams SME Channel Scraper
Scrapes the "AI Security - SME" Teams channel via browser automation.
Uses your existing Chrome profile — no credentials needed.

Output: scraper/output/teams_sme/raw_threads.json

Usage:
    python scraper/scrape_teams_sme.py

Before running:
    1. Close the Teams desktop app (Chrome profile can't be shared)
    2. Make sure you're logged into teams.microsoft.com in Chrome
    3. Get the channel deep link: right-click channel → "Get link to channel"
       and update CHANNEL_URL below
"""

import asyncio
import json
import re
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright

# ─── Configuration ────────────────────────────────────────────────────────────

# Get this by right-clicking "AI Security - SME" → "Get link to channel"
# It looks like: https://teams.microsoft.com/l/channel/19%3A.../AI%20Security...
CHANNEL_URL = "https://teams.microsoft.com"  # update with deep link

# Your Chrome profile path (contains existing Teams login session)
CHROME_PROFILE = str(Path.home() / "Library/Application Support/Google/Chrome")

# Output
OUTPUT_DIR = Path(__file__).parent / "output" / "teams_sme"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# How far back to scrape (None = full history)
# Set to a date string like "2026-01-01" to limit scrape depth
SCRAPE_SINCE = None

# Max scroll attempts before giving up (safety limit)
MAX_SCROLL_ATTEMPTS = 500

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
    """
    messages = []

    try:
        # Teams message containers — these selectors target the web client
        # Adjust if Teams updates their DOM structure
        msg_elements = await page.query_selector_all("[data-tid='message-body-content']")

        for el in msg_elements:
            try:
                # Message ID — unique per message
                msg_id = await el.get_attribute("data-message-id") or ""
                if not msg_id:
                    # Try parent element for the ID
                    parent = await el.query_selector("xpath=..")
                    msg_id = await parent.get_attribute("data-message-id") if parent else ""

                # Author name
                author_el = await el.query_selector("[data-tid='message-author-name'], .fui-Text__root[class*='author']")
                author = clean_text(await author_el.inner_text()) if author_el else "Unknown"

                # Timestamp
                time_el = await el.query_selector("time")
                timestamp = await time_el.get_attribute("datetime") if time_el else ""

                # Message text — get inner text, strip UI chrome
                content_el = await el.query_selector("[data-tid='messageBodyContent'], .fui-Text__root[class*='body']")
                if not content_el:
                    content_el = el
                text = clean_text(await content_el.inner_text())

                # Skip empty or very short messages (reactions, "👍", etc.)
                if len(text) < 10:
                    continue

                # Is this a root message or a reply?
                # Root messages appear in main stream; replies are nested
                is_reply = await el.evaluate(
                    "el => el.closest('[data-tid=\"replyChain\"]') !== null"
                )

                # Thread ID — root messages create threads, replies share the root's ID
                thread_el = await el.query_selector("xpath=ancestor::*[@data-thread-id]")
                thread_id = await thread_el.get_attribute("data-thread-id") if thread_el else msg_id

                messages.append({
                    "message_id": msg_id,
                    "thread_id": thread_id or msg_id,
                    "author": author,
                    "timestamp": timestamp,
                    "text": text,
                    "is_reply": is_reply,
                })

            except Exception as e:
                # Skip individual message errors — don't abort the whole scrape
                continue

    except Exception as e:
        print(f"  Warning: extraction pass failed — {e}")

    return messages


async def expand_thread_replies(page) -> None:
    """
    Click all visible 'X replies' buttons to expand collapsed thread replies.
    """
    try:
        reply_buttons = await page.query_selector_all(
            "[data-tid='reply-count-button'], button[aria-label*='repl']"
        )
        for btn in reply_buttons:
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
                        "scraped_at": datetime.utcnow().isoformat() + "Z",
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
                        "scraped_at": datetime.utcnow().isoformat() + "Z",
                    }
                threads[tid]["replies"].append(msg)

        print(f"  Scroll {scroll_attempts:3d} — {new_count} new messages | {len(threads)} threads total | {len(seen_ids)} messages seen")

        if new_count == 0 and scroll_attempts > 3:
            print("  No new messages in this pass — checking if we've reached the top...")
            # Try one more aggressive scroll
            await page.evaluate("""
                const container = document.querySelector('[data-tid="message-list"]') ||
                                  document.querySelector('[class*="messageList"]') ||
                                  document.querySelector('[role="list"]');
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
        await page.evaluate("""
            const container = document.querySelector('[data-tid="message-list"]') ||
                              document.querySelector('[class*="messageList"]') ||
                              document.querySelector('[role="list"]');
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
        print("Launching Chrome with your existing profile...")
        print("NOTE: Close the Teams desktop app if it's running.\n")

        browser = await p.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE,
            headless=False,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
            viewport={"width": 1400, "height": 900},
        )

        page = browser.pages[0] if browser.pages else await browser.new_page()

        # Navigate to Teams
        print(f"Navigating to Teams...")
        await page.goto(CHANNEL_URL, wait_until="domcontentloaded", timeout=60000)
        await page.wait_for_timeout(3000)

        # Check if we need to handle a login redirect
        current_url = page.url
        if "login" in current_url or "microsoftonline" in current_url:
            print("\n" + "=" * 50)
            print("ACTION REQUIRED: Please log in to Teams in the browser window.")
            print("The script will continue automatically once you're logged in.")
            print("=" * 50 + "\n")
            await page.wait_for_url(
                lambda url: "teams.microsoft.com" in url,
                timeout=120000,
            )
            await page.wait_for_timeout(5000)

        # If we landed on the Teams home page (not the channel), prompt for navigation
        if CHANNEL_URL == "https://teams.microsoft.com":
            print("\n" + "=" * 50)
            print("ACTION REQUIRED:")
            print("1. Navigate to the 'AI Security - SME' channel in Teams")
            print("2. Wait for messages to load")
            print("3. Press Enter here to start scraping")
            print("=" * 50)
            input()
        else:
            # Deep link — wait for channel to load automatically
            loaded = await wait_for_channel_load(page)
            if not loaded:
                print("\nACTION REQUIRED:")
                print("Navigate to the 'AI Security - SME' channel manually, then press Enter.")
                input()

        await wait_for_channel_load(page)

        # Take a debug screenshot before starting
        debug_path = OUTPUT_DIR / "debug_before_scrape.png"
        await page.screenshot(path=str(debug_path), full_page=False)
        print(f"Debug screenshot saved: {debug_path}")

        # Run the scrape
        threads = await scrape_channel(page)

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

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"raw_threads_{timestamp}.json"
    latest_path = OUTPUT_DIR / "raw_threads_latest.json"

    output = {
        "scraped_at": datetime.utcnow().isoformat() + "Z",
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
