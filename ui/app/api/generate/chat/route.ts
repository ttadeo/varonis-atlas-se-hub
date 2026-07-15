import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { type, currentContent, formContext, messages } = await req.json();

  let systemPrompt: string;

  if (type === "guide") {
    systemPrompt = `You are an expert Varonis Atlas AI Security Platform technical writer helping a Sales Engineer refine a customer-facing technical guide.

Guide context:
- Type: ${formContext.guideType}
- Topic: ${formContext.topic}
- Industry: ${formContext.industry || "Not specified"}
- Audience: ${formContext.audience === "customer" ? "Customer-Facing" : "Internal SE"}

The SE will ask you to refine, expand, or restructure the guide. On every turn, return the COMPLETE revised guide as your entire response. No preamble, no explanation, no surrounding code fences. Your response IS the new guide document, ready to render as markdown.`;
  } else {
    systemPrompt = `You are an expert Varonis Atlas AI Security Platform solutions architect helping a Sales Engineer refine a reference architecture.

Architecture context:
- Industry: ${formContext.industry}
- Use Case: ${formContext.useCase}
- Tech Stack: ${formContext.techStack}
- Audience: ${formContext.audience === "customer" ? "Customer-Facing" : "Internal SE"}

The SE will ask you to refine the architecture. On every turn, return ONLY a valid JSON object with exactly two fields:
- "diagram": a valid Mermaid diagram string (starting with "graph TD", "flowchart TD", or similar)
- "narrative": a markdown string with the full architecture narrative

No text outside the JSON. The response must be parseable with JSON.parse().`;
  }

  const currentDocMessage =
    type === "guide"
      ? `Here is the current guide:\n\n${currentContent}`
      : `Here is the current architecture:\n\nDIAGRAM:\n\`\`\`mermaid\n${currentContent.diagram}\n\`\`\`\n\nNARRATIVE:\n${currentContent.narrative}`;

  const fullMessages: Anthropic.MessageParam[] = [
    { role: "user", content: currentDocMessage },
    { role: "assistant", content: "Got it. What changes would you like?" },
    ...(messages as Anthropic.MessageParam[]),
  ];

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: systemPrompt,
      messages: fullMessages,
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    if (type === "guide") {
      return NextResponse.json({ guide: text });
    } else {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");
      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.diagram || !parsed.narrative)
        throw new Error("Response missing diagram or narrative");
      return NextResponse.json({
        diagram: parsed.diagram,
        narrative: parsed.narrative,
      });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 502 });
  }
}
