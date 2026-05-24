import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAuth } from "@/lib/auth";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Pages to try scraping beyond the homepage
const SUBPAGES = ["/about", "/about-us", "/team", "/leadership", "/company", "/who-we-are"];

async function fetchPage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AtlasResearchBot/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Strip HTML tags, scripts, styles — keep readable text
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
      .slice(0, 6000); // cap per page
  } catch {
    return null;
  }
}

// POST /api/scrape-customer
// body: { url: string, attendees: string }
export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { url, attendees } = await req.json();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  // Normalize URL
  let baseUrl = url.trim();
  if (!baseUrl.startsWith("http")) baseUrl = `https://${baseUrl}`;
  baseUrl = baseUrl.replace(/\/$/, "");

  // Fetch homepage + subpages in parallel, skip any that fail
  const pages = await Promise.all([
    fetchPage(baseUrl),
    ...SUBPAGES.map((path) => fetchPage(`${baseUrl}${path}`)),
  ]);

  const combinedText = pages
    .filter((p): p is string => p !== null && p.length > 100)
    .join("\n\n---\n\n")
    .slice(0, 20000); // total cap for Claude

  if (!combinedText) {
    return NextResponse.json({
      summary: null,
      error: "Could not retrieve content from this website. It may block automated access.",
    });
  }

  // Ask Claude to extract company + people intel
  const prompt = `You are an AI assistant helping a sales engineer prepare for a customer meeting.

Below is scraped content from the customer's website: ${baseUrl}

${attendees ? `The attendees for this meeting are: ${attendees}` : ""}

Extract the following in a structured way:

## Company Overview
- What does this company do? (2-3 sentences)
- Industry, size signals, notable customers or partners
- Key products or services
- Any recent news, funding, or initiatives mentioned

## People in the Room
${attendees ? `For each attendee listed (${attendees}), find any matching information on the website: title, role, background, responsibilities. If not found, say "Not found on website".` : "List any executives, leadership, or key personnel mentioned on the website with their titles and brief bios."}

## Meeting Intelligence
- What pain points or priorities does this company likely have based on their website?
- Any AI, security, or data governance mentions?
- Anything that could be relevant for an Atlas AI Security pitch?

Be concise and factual. Only include information found on the website — do not hallucinate.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const summary = (response.content[0] as Anthropic.Messages.TextBlock).text;
    return NextResponse.json({ summary, url: baseUrl });
  } catch (err) {
    return NextResponse.json({ error: `Summarization failed: ${String(err)}` }, { status: 500 });
  }
}
