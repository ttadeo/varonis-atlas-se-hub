"""
Atlas Documentation PDF Builder
Combines all scraped markdown files into a single organized PDF.
Sections: Overview → Applications → Platform Services → FAQ → Competitive → OpenAPI Reference
"""

import os
import re
from pathlib import Path
from fpdf import FPDF

OUTPUT_DIR = Path(__file__).parent / "output"
PDF_OUTPUT = Path(__file__).parent / "Atlas_Documentation_v3.20.pdf"

# Section order and display names
SECTION_ORDER = [
    ("overview",             "Overview"),
    ("applications",         "Applications"),
    ("platform_services",    "Platform Services"),
    ("providers",            "Providers"),
    ("integration_examples", "Integration Examples"),
    ("handbooks",            "Handbooks"),
    ("release_notes",        "Release Notes"),
    ("faq",                  "FAQ & Field Guides"),
    ("competitive",          "Competitive Intelligence"),
    ("openapi_reference",    "OpenAPI Reference"),
    ("disclaimers",          "Disclaimers"),
]

UNICODE_REPLACEMENTS = {
    "\u2014": "-", "\u2013": "-", "\u2018": "'", "\u2019": "'",
    "\u201c": '"', "\u201d": '"', "\u2022": "-", "\u2026": "...",
    "\u00a0": " ", "\u21d2": "=>", "\u2192": "->", "\u2190": "<-",
    "\u2713": "OK", "\u2717": "X", "\u00b7": "-",
}

def sanitize(text: str) -> str:
    """Replace common Unicode chars and strip remaining non-latin1."""
    for char, replacement in UNICODE_REPLACEMENTS.items():
        text = text.replace(char, replacement)
    return text.encode("latin-1", errors="replace").decode("latin-1")

def clean_text(text: str) -> str:
    """Strip markdown syntax and non-latin characters for PDF rendering."""
    # Remove frontmatter
    text = re.sub(r"^---.*?---\s*", "", text, flags=re.DOTALL)
    # Remove markdown headers markers but keep text
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    # Remove bold/italic
    text = re.sub(r"\*{1,3}(.*?)\*{1,3}", r"\1", text)
    # Remove inline code
    text = re.sub(r"`{1,3}[^`]*`{1,3}", lambda m: m.group(0).strip("`"), text)
    # Remove code blocks
    text = re.sub(r"```.*?```", "[code block]", text, flags=re.DOTALL)
    # Remove links but keep text
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    # Remove images
    text = re.sub(r"!\[.*?\]\(.*?\)", "", text)
    # Remove horizontal rules
    text = re.sub(r"^[-*_]{3,}\s*$", "", text, flags=re.MULTILINE)
    # Remove table separators
    text = re.sub(r"^\|[-| :]+\|$", "", text, flags=re.MULTILINE)
    # Clean up excessive whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    return sanitize(text).strip()

def get_title_from_content(content: str, filename: str) -> str:
    """Extract title from frontmatter or first heading."""
    # Try frontmatter title
    m = re.search(r"^title:\s*(.+)$", content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    # Try first H1
    m = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    if m:
        return m.group(1).strip()
    # Fall back to filename
    return filename.replace("_", " ").replace(".md", "").title()

class AtlasPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, "Varonis Atlas AI Security Platform - Documentation", align="L")
        self.ln(2)
        self.set_draw_color(220, 220, 220)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

def build_pdf():
    pdf = AtlasPDF()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.set_margins(15, 20, 15)

    # ── Cover Page ──────────────────────────────────────────────────────────────
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(30, 30, 30)
    pdf.ln(40)
    pdf.cell(0, 14, "Varonis Atlas", align="C")
    pdf.ln(14)
    pdf.set_font("Helvetica", "", 20)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 10, "AI Security Platform", align="C")
    pdf.ln(10)
    pdf.set_font("Helvetica", "", 14)
    pdf.set_text_color(120, 120, 120)
    pdf.cell(0, 8, "Documentation & Field Guide", align="C")
    pdf.ln(30)
    pdf.set_draw_color(30, 80, 200)
    pdf.set_line_width(0.8)
    pdf.line(40, pdf.get_y(), 170, pdf.get_y())
    pdf.ln(20)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(100, 100, 100)
    pdf.cell(0, 8, "Internal Use Only - Varonis Sales Engineering", align="C")
    pdf.ln(6)
    pdf.cell(0, 8, "Generated from scraped Atlas documentation", align="C")

    # ── Table of Contents ───────────────────────────────────────────────────────
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(30, 30, 30)
    pdf.cell(0, 10, "Contents", align="L")
    pdf.ln(12)

    toc_entries = []
    for section_dir, section_name in SECTION_ORDER:
        section_path = OUTPUT_DIR / section_dir
        if not section_path.exists():
            continue
        md_files = sorted(section_path.glob("*.md"))
        if not md_files:
            continue
        toc_entries.append(("section", section_name, None))
        for md_file in md_files:
            content = md_file.read_text(encoding="utf-8", errors="replace")
            title = sanitize(get_title_from_content(content, md_file.name))
            toc_entries.append(("page", title, section_name))

    for entry_type, title, _ in toc_entries:
        if entry_type == "section":
            pdf.set_font("Helvetica", "B", 11)
            pdf.set_text_color(30, 80, 200)
            pdf.ln(4)
            pdf.cell(0, 7, title, align="L")
            pdf.ln(7)
        else:
            pdf.set_font("Helvetica", "", 10)
            pdf.set_text_color(60, 60, 60)
            # Truncate long titles
            display = title[:80] + "..." if len(title) > 80 else title
            pdf.cell(8)
            pdf.cell(0, 6, display, align="L")
            pdf.ln(6)

    # ── Content Pages ───────────────────────────────────────────────────────────
    for section_dir, section_name in SECTION_ORDER:
        section_path = OUTPUT_DIR / section_dir
        if not section_path.exists():
            continue
        md_files = sorted(section_path.glob("*.md"))
        if not md_files:
            continue

        # Section divider page
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 24)
        pdf.set_text_color(255, 255, 255)
        # Blue background bar
        pdf.set_fill_color(30, 80, 200)
        pdf.rect(0, 0, 210, 297, "F")
        pdf.ln(100)
        pdf.cell(0, 14, section_name, align="C")
        pdf.ln(10)
        pdf.set_font("Helvetica", "", 13)
        pdf.set_text_color(200, 215, 255)
        pdf.cell(0, 8, "Varonis Atlas AI Security Platform", align="C")

        # Pages in section
        for md_file in md_files:
            content = md_file.read_text(encoding="utf-8", errors="replace")
            title = sanitize(get_title_from_content(content, md_file.name))
            body = clean_text(content)

            if not body.strip():
                continue

            pdf.add_page()

            # Page title
            pdf.set_font("Helvetica", "B", 14)
            pdf.set_text_color(30, 30, 30)
            pdf.multi_cell(0, 8, title)
            pdf.ln(2)
            pdf.set_draw_color(30, 80, 200)
            pdf.set_line_width(0.4)
            pdf.line(15, pdf.get_y(), 195, pdf.get_y())
            pdf.ln(6)

            # Body text
            pdf.set_font("Helvetica", "", 9)
            pdf.set_text_color(50, 50, 50)

            for line in body.split("\n"):
                line = line.strip()
                if not line:
                    pdf.ln(3)
                    continue
                # Detect list items
                if line.startswith("- ") or line.startswith("* "):
                    pdf.set_x(15)
                    pdf.multi_cell(0, 5, "  - " + sanitize(line[2:]), align="L")
                else:
                    pdf.set_x(15)
                    pdf.multi_cell(0, 5, sanitize(line), align="L")

        print(f"  ✓ {section_name} - {len(md_files)} pages")

    pdf.output(str(PDF_OUTPUT))
    print(f"\n✓ PDF saved to: {PDF_OUTPUT}")
    print(f"  Pages: {pdf.page_no()}")


if __name__ == "__main__":
    print("Building Atlas Documentation PDF...\n")
    build_pdf()
