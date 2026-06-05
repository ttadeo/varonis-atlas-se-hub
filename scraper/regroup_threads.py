"""
Teams SME — Thread Regrouper

Takes the raw_threads_latest.json (where every message is its own thread)
and regroups messages into conversations using temporal proximity:
messages sent within THREAD_GAP_SECONDS of the previous message in the
same run are assumed to be part of the same conversation thread.

Teams message IDs are millisecond Unix timestamps, so we can derive ordering
and inter-message gaps directly from the IDs.

Usage:
    python scraper/regroup_threads.py

Output: scraper/output/teams_sme/regrouped_threads_latest.json
"""

import json
from datetime import datetime, timezone
from pathlib import Path

# ─── Configuration ────────────────────────────────────────────────────────────

INPUT_PATH  = Path(__file__).parent / "output" / "teams_sme" / "raw_threads_latest.json"
OUTPUT_DIR  = Path(__file__).parent / "output" / "teams_sme"

# Messages within this many seconds of the previous message are grouped together.
# 5 minutes handles rapid-fire Q&A exchanges while separating distinct topics.
THREAD_GAP_SECONDS = 300

# Minimum messages in a group to keep as a thread (drop lone one-liners)
MIN_THREAD_LENGTH = 1

# ─── Helpers ──────────────────────────────────────────────────────────────────

def msg_to_seconds(msg_id: str) -> float:
    """Convert a Teams message ID (millisecond Unix timestamp) to seconds."""
    try:
        return int(msg_id) / 1000.0
    except (ValueError, TypeError):
        return 0.0


def seconds_to_iso(ts: float) -> str:
    """Convert Unix seconds to ISO 8601 string."""
    try:
        return datetime.fromtimestamp(ts, tz=timezone.utc).isoformat()
    except Exception:
        return ""


# ─── Main ─────────────────────────────────────────────────────────────────────

def regroup(input_path: Path, gap_seconds: int = THREAD_GAP_SECONDS) -> list[dict]:
    """
    Load flat message list and regroup into conversation threads.
    Returns a list of thread dicts matching the raw_threads schema.
    """
    print(f"Loading: {input_path}")
    with open(input_path, encoding="utf-8") as f:
        data = json.load(f)

    # Flatten: each entry in data['threads'] is currently a single-message thread.
    # Extract the root message from each and rebuild as flat list.
    raw_messages: list[dict] = []
    for thread in data.get("threads", []):
        root = thread.get("root")
        if root:
            raw_messages.append(root)
        # Also grab any replies that survived (unlikely given the bug, but safe)
        for reply in thread.get("replies", []):
            raw_messages.append(reply)

    print(f"  Total messages extracted: {len(raw_messages)}")

    # Sort chronologically by message ID (which is ms timestamp)
    raw_messages.sort(key=lambda m: msg_to_seconds(m.get("message_id", "0")))

    # Add derived timestamp to each message
    for msg in raw_messages:
        ts = msg_to_seconds(msg.get("message_id", "0"))
        msg["derived_timestamp"] = seconds_to_iso(ts)
        msg["derived_ts_seconds"] = ts

    # ── Gap-based grouping ────────────────────────────────────────────────────
    threads: list[dict] = []
    current_group: list[dict] = []
    last_ts: float = 0.0

    for msg in raw_messages:
        ts = msg["derived_ts_seconds"]

        if not current_group:
            # First message ever
            current_group = [msg]
            last_ts = ts
        elif (ts - last_ts) > gap_seconds:
            # Gap too large — close current thread, start new one
            threads.append(_make_thread(current_group))
            current_group = [msg]
            last_ts = ts
        else:
            # Within gap — add to current thread
            current_group.append(msg)
            last_ts = ts

    # Close the final group
    if current_group:
        threads.append(_make_thread(current_group))

    # Filter out threads below minimum length
    threads = [t for t in threads if (1 + len(t["replies"])) >= MIN_THREAD_LENGTH]

    return threads


def _make_thread(messages: list[dict]) -> dict:
    """
    Convert a list of temporally-grouped messages into a thread dict.
    First message is root, remainder are replies.
    """
    root = messages[0]
    replies = messages[1:]

    # Use the root's derived timestamp as the thread timestamp
    return {
        "thread_id": root["message_id"],
        "root": root,
        "replies": replies,
        "message_count": len(messages),
        "scraped_at": root.get("scraped_at", ""),
    }


def main():
    print("=" * 60)
    print("Teams SME — Thread Regrouper")
    print("=" * 60)
    print(f"Gap threshold : {THREAD_GAP_SECONDS}s ({THREAD_GAP_SECONDS // 60} min)")
    print()

    threads = regroup(INPUT_PATH)

    # ── Statistics ────────────────────────────────────────────────────────────
    total_messages = sum(1 + len(t["replies"]) for t in threads)
    multi_msg      = [t for t in threads if len(t["replies"]) > 0]
    solo_msg       = [t for t in threads if len(t["replies"]) == 0]

    print(f"\n  Threads formed      : {len(threads)}")
    print(f"  Multi-message threads: {len(multi_msg)}")
    print(f"  Single-message threads: {len(solo_msg)}")
    print(f"  Total messages kept : {total_messages}")

    # Show top 10 longest threads
    top = sorted(threads, key=lambda t: t["message_count"], reverse=True)[:10]
    print(f"\n  Longest threads (top 10):")
    for t in top:
        ts = t["root"].get("derived_timestamp", "")[:16]
        preview = t["root"]["text"][:60]
        print(f"    [{ts}]  {t['message_count']:3d} msgs  '{preview}...'")

    # ── Save ──────────────────────────────────────────────────────────────────
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"regrouped_threads_{timestamp}.json"
    latest_path = OUTPUT_DIR / "regrouped_threads_latest.json"

    output = {
        "regrouped_at"    : datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "total_threads"   : len(threads),
        "total_messages"  : total_messages,
        "gap_seconds"     : THREAD_GAP_SECONDS,
        "channel"         : "AI Security - SME",
        "threads"         : threads,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"\n  Output : {output_path}")
    print(f"  Latest : {latest_path}")
    print()
    print("Next step: run process_teams_sme.py --input regrouped_threads_latest.json")


if __name__ == "__main__":
    main()
