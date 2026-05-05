import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { query, resources } = await req.json();

  if (!query || !Array.isArray(resources)) {
    return NextResponse.json({ error: "query and resources required" }, { status: 400 });
  }

  // Build a compact resource list for Claude — just the fields it needs
  const compact = resources.map((r: Record<string, unknown>) => ({
    id: r.resource_instance_id,
    name: r.resource_display_name,
    type: r.resource_type_display_name,
    category: r.resource_type_category,
    technology: Array.isArray(r.technology_types) ? (r.technology_types as string[]).join(", ") : "",
    project_id: Array.isArray(r.project_ids) ? (r.project_ids as string[])[0] : "",
    reviewed: r.reviewed,
  }));

  const prompt = `You are an AI security expert analyzing an organization's AI inventory discovered by Varonis Atlas.

The user wants to find: "${query}"

Here is the complete AI inventory (${compact.length} resources):
${JSON.stringify(compact, null, 2)}

Your task:
1. Identify which resources from the inventory are relevant to the user's query
2. Explain WHY each matched resource is relevant in 1 sentence
3. Provide a 2-3 sentence summary of what the inventory reveals about this use case

Return ONLY valid JSON in this exact format:
{
  "summary": "2-3 sentence summary of findings",
  "matches": [
    { "id": "resource_instance_id", "reason": "one sentence why this is relevant" }
  ]
}

If no resources match, return an empty matches array with a summary explaining what's missing from the inventory.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Could not parse Claude response", raw: text }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
