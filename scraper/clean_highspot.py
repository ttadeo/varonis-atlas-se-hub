"""
Highspot Content Cleaner
Strips Highspot UI chrome from scraped competitive markdown files and
repairs broken line wrapping caused by PDF-to-text extraction.

Writes cleaned files back in-place (overwrites originals).
Run this before re-ingesting the competitive section into Neo4j.
"""

import re
from pathlib import Path

COMPETITIVE_DIR = Path(__file__).parent / "output" / "competitive"

# Lines that are pure Highspot UI chrome — strip these entirely
CHROME_PATTERNS = [
    r"^The links in this menu move focus.*$",
    r"^Press OPT \+ / to open this menu$",
    r"^Skip to Content$",
    r"^Skip to Info Panel$",
    r"^Skip to Header$",
    r"^Share Externally$",
    r"^Present$",
    r"^ZOOM$",
    r"^Added \d+ (day|week|month)s? ago$",
    r"^Updated \d+ (day|week|month)s? ago$",
    r"^Sales Collateral$",
    r"^Competition$",
    r"^PDF$",
    r"^PowerPoint$",
    r"^\d+ of \d+$",           # "1 of 10"
    r"^0/0$",
    r"^\(Current Slide\)$",
    r"^Slide$",
    r"^\d+$",                  # lone slide numbers
]

CHROME_RE = re.compile("|".join(CHROME_PATTERNS), re.IGNORECASE)


def is_chrome_line(line: str) -> bool:
    stripped = line.strip()
    return bool(CHROME_RE.match(stripped))


def repair_line_breaks(text: str) -> str:
    """
    Highspot PDF extraction produces one fragment per line, separated by blank
    lines — even within a single sentence. Strategy:

    1. Strip all blank lines to get a flat list of fragments
    2. Join fragments greedily, inserting paragraph breaks only when a fragment
       looks like a true heading or the content clearly shifts topic
    3. Re-introduce paragraph spacing between logical blocks
    """
    lines = text.split("\n")

    # Step 1: collect only non-empty lines (drop all blank lines)
    fragments = [l.strip() for l in lines if l.strip()]

    # Step 2: join fragments into logical paragraphs
    paragraphs = []
    current = ""

    for frag in fragments:
        if not current:
            current = frag
            continue

        # Markdown heading → new paragraph
        if frag.startswith(("#",)):
            paragraphs.append(current)
            current = frag
            continue

        # Short ALL-CAPS line → treat as heading/label, new paragraph
        if frag.isupper() and len(frag) < 60:
            paragraphs.append(current)
            current = frag
            continue

        # Hyphenated line break — join without space
        if current.endswith("-"):
            current = current[:-1] + frag
            continue

        # Default: join with a space
        current = current + " " + frag

    if current:
        paragraphs.append(current)

    # Step 3: output with double newline between paragraphs
    return "\n\n".join(paragraphs)


def clean_file(filepath: Path) -> tuple[int, int]:
    """Clean a single markdown file. Returns (lines_before, lines_after)."""
    raw = filepath.read_text(encoding="utf-8")

    # Preserve frontmatter
    frontmatter = ""
    body = raw
    if raw.startswith("---"):
        end = raw.find("---", 3)
        if end != -1:
            frontmatter = raw[: end + 3]
            body = raw[end + 3 :]

    # Split body into lines
    lines = body.split("\n")
    lines_before = len([l for l in lines if l.strip()])

    # Strip chrome lines
    cleaned_lines = [l for l in lines if not is_chrome_line(l)]

    # Remove the duplicated title line that always appears after the H1
    # (Highspot repeats the document title as plain text right after the heading)
    title_match = re.search(r"^# (.+)$", body, re.MULTILINE)
    if title_match:
        title_text = title_match.group(1).strip()
        deduped = []
        for l in cleaned_lines:
            if l.strip() == title_text and deduped and not deduped[-1].startswith("#"):
                continue  # skip duplicate title line
            deduped.append(l)
        cleaned_lines = deduped

    # Collapse 3+ blank lines to 2
    collapsed = re.sub(r"\n{3,}", "\n\n", "\n".join(cleaned_lines))

    # Repair broken line wrapping
    repaired = repair_line_breaks(collapsed)

    lines_after = len([l for l in repaired.split("\n") if l.strip()])

    # Reassemble with frontmatter
    cleaned = frontmatter + "\n\n" + repaired.strip() + "\n"
    filepath.write_text(cleaned, encoding="utf-8")

    return lines_before, lines_after


def main():
    print("Highspot Content Cleaner")
    print("=" * 50)

    md_files = sorted(COMPETITIVE_DIR.glob("*.md"))
    print(f"Found {len(md_files)} files in {COMPETITIVE_DIR}\n")

    total_before = 0
    total_after = 0

    for filepath in md_files:
        before, after = clean_file(filepath)
        total_before += before
        total_after += after
        reduction = round((1 - after / before) * 100) if before else 0
        print(f"  {filepath.name}")
        print(f"    {before} → {after} content lines ({reduction}% chrome removed)")

    print(f"\n✓ Cleaned {len(md_files)} files")
    print(f"  Total: {total_before} → {total_after} content lines")
    print(f"\nNext: re-run ingestion/ingest_to_neo4j.py to update Neo4j")


if __name__ == "__main__":
    main()
