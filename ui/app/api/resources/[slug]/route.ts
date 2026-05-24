import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth";

// Allowed slugs — whitelist to prevent path traversal
const ALLOWED_SLUGS = new Set([
  "field_friday_qa",
  "comparison_deck_varonis_atlas_vs_ai_vendors",
  "varonis_atlas_case_study_cresta",
  "technical_overview_varonis_atlas_and_iso_42001",
  "atlas_ai_security_platform_infosheet",
  "datasheet_varonis_interceptor",
  "ai_security_fundamentals",
  "varonis_to_acquire_alltrueai_to_manage_and_secure_ai_across_the_enterprise",
  "varonis_launches_atlas_to_secure_ai_and_the_data_that_powers_it",
  "blog_varonis_launches_atlas_to_secure_ai_and_the_data_that_powers_it",
  "press_release_varonis_launches_atlas_to_secure_ai_and_the_data_that_powers_it",
  "varonis_atlas_ai_security_platform",
]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { slug } = await params;

  if (!ALLOWED_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const filePath = path.join(
      process.cwd(),
      "..",
      "scraper",
      "output",
      "competitive",
      `${slug}.md`
    );
    const raw = await readFile(filePath, "utf-8");

    // Strip YAML frontmatter before sending to client
    const body = raw.startsWith("---")
      ? raw.replace(/^---[\s\S]*?---\s*/, "")
      : raw;

    return NextResponse.json({ content: body.trim() });
  } catch {
    return NextResponse.json({ error: "Content unavailable" }, { status: 404 });
  }
}
