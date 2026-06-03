"""
Teams SME Channel — LLM Processing Pipeline
Classifies raw threads, extracts Q&A pairs, and deduplicates.

Pipeline:
  1. Claude Haiku  → classify each thread (keep / discard)
  2. Claude Sonnet → reconstruct thread, extract structured Q&A
  3. Claude Sonnet → cross-thread deduplication (mark superseded)

Input:  scraper/output/teams_sme/raw_threads_latest.json
Output: scraper/output/teams_sme/processed_qa.json

Usage:
    source scraper/scraper-env/bin/activate  (or your venv)
    pip install anthropic
    python scraper/process_teams_sme.py
"""

import json
import os
import re
import time
from datetime import datetime
from pathlib import Path

import anthropic

# ─── Configuration ────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

INPUT_PATH  = Path(__file__).parent / "output" / "teams_sme" / "raw_threads_latest.json"
OUTPUT_DIR  = Path(__file__).parent / "output" / "teams_sme"

# Model assignments by task
MODEL_CLASSIFY  = "claude-haiku-4-5-20251001"   # Fast, cheap — binary keep/discard
MODEL_EXTRACT   = "claude-sonnet-4-6"            # Complex synthesis — Q&A extraction
MODEL_DEDUP     = "claude-sonnet-4-6"            # Reasoning — identify duplicates

# Retry config
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds between retries

# ─── Helpers ──────────────────────────────────────────────────────────────────

def thread_to_text(thread: dict) -> str:
    """Convert a thread dict to readable text for LLM processing."""
    lines = []
    root = thread.get("root", {})
    lines.append(f"[{root.get('timestamp', '')[:10]}] {root.get('author', 'Unknown')}: {root.get('text', '')}")
    for reply in thread.get("replies", []):
        lines.append(f"  [{reply.get('timestamp', '')[:10]}] {reply.get('author', 'Unknown')}: {reply.get('text', '')}")
    return "\n".join(lines)


def call_claude(client: anthropic.Anthropic, model: str, system: str, user: str, max_tokens: int = 1024) -> str:
    """Call Claude with retry logic."""
    for attempt in range(MAX_RETRIES):
        try:
            response = client.messages.create(
                model=model,
                max_tokens=max_tokens,
                system=system,
                messages=[{"role": "user", "content": user}],
            )
            return response.content[0].text
        except anthropic.RateLimitError:
            if attempt < MAX_RETRIES - 1:
                wait = RETRY_DELAY * (attempt + 1)
                print(f"    Rate limited — waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
        except Exception as e:
            if attempt < MAX_RETRIES - 1:
                time.sleep(RETRY_DELAY)
            else:
                raise


def parse_json_response(text: str) -> dict:
    """Extract JSON from LLM response, handling markdown code fences."""
    text = text.strip()
    # Strip markdown code fences if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1)
    # Find the outermost JSON object
    match = re.search(r"\{[\s\S]*\}", text)
    if match:
        text = match.group(0)
    return json.loads(text)


# ─── Stage 1: Classification ──────────────────────────────────────────────────

CLASSIFY_SYSTEM = """You are filtering messages from a Varonis internal Teams channel called "AI Security - SME".

Your job: determine if a conversation thread is technically useful for a Sales Engineer writing customer-facing technical guides about Varonis Atlas AI Security.

KEEP if the thread contains ANY of:
- A technical question with a substantive answer about Atlas capabilities
- Product roadmap information (what's coming, timelines)
- Deployment or configuration details not in public docs
- Competitive intelligence or positioning
- Customer objections and how to handle them
- Architecture clarifications or edge cases
- Field-validated answers from named SMEs

DISCARD if the thread is primarily:
- Scheduling, logistics, "who's the SME on this"
- Thank-you messages, reactions, off-topic chatter
- Questions with no substantive answer (just "I'll follow up")
- Purely social conversation

Respond with JSON only:
{"keep": true/false, "reason": "one sentence explanation"}"""


def classify_thread(client: anthropic.Anthropic, thread: dict) -> dict:
    """Stage 1: Classify a thread as keep or discard using Haiku."""
    text = thread_to_text(thread)
    response = call_claude(
        client,
        MODEL_CLASSIFY,
        CLASSIFY_SYSTEM,
        f"Classify this Teams thread:\n\n{text}",
        max_tokens=256,
    )
    try:
        result = parse_json_response(response)
        return {
            "keep": bool(result.get("keep", False)),
            "reason": result.get("reason", ""),
        }
    except Exception:
        # Default to keep on parse failure — better to over-include
        return {"keep": True, "reason": "parse error — defaulting to keep"}


# ─── Stage 2: Q&A Extraction ─────────────────────────────────────────────────

EXTRACT_SYSTEM = """You are extracting structured knowledge from Varonis internal Teams conversations about Atlas AI Security.

Given a conversation thread, extract:
1. The primary question or topic being discussed
2. A synthesized answer from all contributing messages (ignore noise, merge partial answers)
3. Metadata about the answer quality

Rules:
- Synthesize the BEST answer from all relevant messages — do not just quote one person
- If multiple people gave partial answers, combine them into one complete answer
- If the thread has no substantive answer (just "I'll follow up"), set answer_complete to false
- Preserve specific technical details: product names, API names, timelines, feature names
- Strip out the social noise ("thanks!", "tagging @X", scheduling)
- topic should be one of: gateway_architecture, pii_detection, shadow_ai, compliance, ide_support, licensing, discovery, guardrails, roadmap, competitive, deployment, other

Respond with JSON only:
{
  "question": "clear statement of what was being asked",
  "answer": "synthesized complete answer in clear prose",
  "topic": "one of the topic values above",
  "answer_complete": true/false,
  "confidence": "sme_validated | community_consensus | tentative | incomplete",
  "key_contributors": ["author names who gave substantive answers"],
  "date_sensitive": true/false,
  "notes": "any important caveats or context (optional)"
}"""


def extract_qa(client: anthropic.Anthropic, thread: dict) -> dict | None:
    """Stage 2: Extract structured Q&A from a thread using Sonnet."""
    text = thread_to_text(thread)
    response = call_claude(
        client,
        MODEL_EXTRACT,
        EXTRACT_SYSTEM,
        f"Extract Q&A from this Teams thread:\n\n{text}",
        max_tokens=1024,
    )
    try:
        result = parse_json_response(response)
        return {
            "thread_id": thread["thread_id"],
            "question": result.get("question", ""),
            "answer": result.get("answer", ""),
            "topic": result.get("topic", "other"),
            "answer_complete": result.get("answer_complete", True),
            "confidence": result.get("confidence", "tentative"),
            "key_contributors": result.get("key_contributors", []),
            "date_sensitive": result.get("date_sensitive", False),
            "notes": result.get("notes", ""),
            "source": "teams_ai_security_sme",
            "raw_date": thread.get("root", {}).get("timestamp", "")[:10],
            "processed_at": datetime.utcnow().isoformat() + "Z",
        }
    except Exception as e:
        print(f"    Extraction parse error: {e}")
        return None


# ─── Stage 3: Deduplication ───────────────────────────────────────────────────

DEDUP_SYSTEM = """You are deduplicating a list of Q&A pairs extracted from a Teams channel.

Given a list of Q&A pairs, identify groups where multiple entries ask essentially the same question.
For each duplicate group, pick the BEST entry (most complete answer, most recent, highest confidence).
Mark all others as superseded.

Respond with JSON only:
{
  "groups": [
    {
      "canonical_id": "thread_id of the best entry",
      "superseded_ids": ["thread_ids of duplicates to mark as superseded"],
      "reason": "why these are duplicates"
    }
  ]
}

Only include groups where there are actual duplicates. If everything is unique, return {"groups": []}."""


def deduplicate_qa(client: anthropic.Anthropic, qa_pairs: list[dict]) -> list[dict]:
    """Stage 3: Find and mark duplicate Q&A pairs using Sonnet."""
    if len(qa_pairs) < 2:
        return qa_pairs

    # Build a compact summary for the dedup prompt
    summary_lines = []
    for qa in qa_pairs:
        summary_lines.append(
            f"ID: {qa['thread_id']} | Topic: {qa['topic']} | "
            f"Date: {qa['raw_date']} | Confidence: {qa['confidence']}\n"
            f"Q: {qa['question'][:200]}"
        )
    summary = "\n\n".join(summary_lines)

    print(f"  Running deduplication across {len(qa_pairs)} Q&A pairs...")

    try:
        response = call_claude(
            client,
            MODEL_DEDUP,
            DEDUP_SYSTEM,
            f"Deduplicate these Q&A pairs:\n\n{summary}",
            max_tokens=2048,
        )
        result = parse_json_response(response)
        groups = result.get("groups", [])

        # Build superseded set
        superseded: dict[str, str] = {}  # thread_id → canonical_id
        for group in groups:
            canonical = group.get("canonical_id", "")
            for sid in group.get("superseded_ids", []):
                superseded[sid] = canonical

        # Mark superseded entries
        for qa in qa_pairs:
            if qa["thread_id"] in superseded:
                qa["superseded_by"] = superseded[qa["thread_id"]]
            else:
                qa["superseded_by"] = None

        dupes_found = len(superseded)
        print(f"  Found {dupes_found} duplicate entries to mark as superseded")

    except Exception as e:
        print(f"  Deduplication failed: {e} — skipping")
        for qa in qa_pairs:
            qa["superseded_by"] = None

    return qa_pairs


# ─── Main Pipeline ────────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("Teams SME Channel — LLM Processing Pipeline")
    print("=" * 60)

    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY environment variable not set.")
        print("Run: export ANTHROPIC_API_KEY=your_key_here")
        return

    if not INPUT_PATH.exists():
        print(f"ERROR: Input file not found: {INPUT_PATH}")
        print("Run scrape_teams_sme.py first to generate raw thread data.")
        return

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Load raw threads
    with open(INPUT_PATH, encoding="utf-8") as f:
        data = json.load(f)

    threads = data.get("threads", [])
    print(f"\nLoaded {len(threads)} threads from {INPUT_PATH.name}")
    print(f"Scraped at: {data.get('scraped_at', 'unknown')}\n")

    # ── Stage 1: Classify ─────────────────────────────────────────────────────
    print("─" * 40)
    print(f"Stage 1: Classification (Haiku — {MODEL_CLASSIFY})")
    print("─" * 40)

    kept = []
    discarded = 0

    for i, thread in enumerate(threads):
        print(f"  [{i+1:3d}/{len(threads)}] Classifying thread {thread['thread_id'][:20]}...", end=" ")
        try:
            result = classify_thread(client, thread)
            if result["keep"]:
                thread["_classify_reason"] = result["reason"]
                kept.append(thread)
                print(f"✓ KEEP — {result['reason'][:60]}")
            else:
                discarded += 1
                print(f"✗ DISCARD — {result['reason'][:60]}")
            time.sleep(0.1)  # Gentle rate limiting
        except Exception as e:
            print(f"ERROR: {e} — keeping by default")
            kept.append(thread)

    print(f"\n  Kept: {len(kept)} | Discarded: {discarded}")

    # ── Stage 2: Extract Q&A ─────────────────────────────────────────────────
    print("\n" + "─" * 40)
    print(f"Stage 2: Q&A Extraction (Sonnet — {MODEL_EXTRACT})")
    print("─" * 40)

    qa_pairs = []
    failed = 0

    for i, thread in enumerate(kept):
        print(f"  [{i+1:3d}/{len(kept)}] Extracting thread {thread['thread_id'][:20]}...", end=" ")
        try:
            qa = extract_qa(client, thread)
            if qa and qa.get("answer_complete") and qa.get("answer"):
                qa_pairs.append(qa)
                print(f"✓ {qa['topic']:20s} | {qa['confidence']:20s} | {qa['question'][:50]}")
            else:
                failed += 1
                print(f"✗ Incomplete — no substantive answer found")
            time.sleep(0.2)
        except Exception as e:
            failed += 1
            print(f"ERROR: {e}")

    print(f"\n  Extracted: {len(qa_pairs)} Q&A pairs | Failed/incomplete: {failed}")

    # ── Stage 3: Deduplication ────────────────────────────────────────────────
    print("\n" + "─" * 40)
    print(f"Stage 3: Deduplication (Sonnet — {MODEL_DEDUP})")
    print("─" * 40)

    # Process by topic group to keep prompt size manageable
    by_topic: dict[str, list] = {}
    for qa in qa_pairs:
        topic = qa.get("topic", "other")
        by_topic.setdefault(topic, []).append(qa)

    all_qa: list[dict] = []
    for topic, pairs in by_topic.items():
        print(f"  Topic: {topic} ({len(pairs)} pairs)")
        if len(pairs) > 1:
            deduped = deduplicate_qa(client, pairs)
        else:
            for qa in pairs:
                qa["superseded_by"] = None
            deduped = pairs
        all_qa.extend(deduped)

    # ── Save Output ───────────────────────────────────────────────────────────
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    output_path = OUTPUT_DIR / f"processed_qa_{timestamp}.json"
    latest_path = OUTPUT_DIR / "processed_qa_latest.json"

    # Separate active vs superseded
    active = [qa for qa in all_qa if not qa.get("superseded_by")]
    superseded = [qa for qa in all_qa if qa.get("superseded_by")]

    output = {
        "processed_at": datetime.utcnow().isoformat() + "Z",
        "source_file": str(INPUT_PATH.name),
        "stats": {
            "threads_input": len(threads),
            "threads_kept": len(kept),
            "threads_discarded": discarded,
            "qa_pairs_extracted": len(qa_pairs),
            "qa_pairs_active": len(active),
            "qa_pairs_superseded": len(superseded),
        },
        "qa_pairs": active,
        "superseded": superseded,
    }

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n" + "=" * 60)
    print("Processing Complete")
    print("=" * 60)
    print(f"  Input threads     : {len(threads)}")
    print(f"  Kept after filter : {len(kept)}")
    print(f"  Q&A pairs active  : {len(active)}")
    print(f"  Superseded        : {len(superseded)}")
    print(f"  Output            : {output_path}")
    print()

    # Topic breakdown
    topic_counts: dict[str, int] = {}
    for qa in active:
        topic_counts[qa.get("topic", "other")] = topic_counts.get(qa.get("topic", "other"), 0) + 1
    print("  By topic:")
    for topic, count in sorted(topic_counts.items(), key=lambda x: -x[1]):
        print(f"    {topic:25s} {count}")

    print()
    print("Next step: run ingest_teams_sme.py to load into Neo4j")


if __name__ == "__main__":
    main()
