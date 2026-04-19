import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface JudgeResult {
  passed: boolean;
  score: number;       // 0–100
  feedback: string;    // 1–2 sentences shown to the learner
  missing: string[];   // key concepts they didn't address
}

export async function POST(req: NextRequest) {
  try {
    const { lessonTitle, checkQuestion, answer } = await req.json();

    if (!lessonTitle || !checkQuestion || !answer?.trim()) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const systemPrompt = `You are an expert Varonis Atlas AI Security training evaluator.
Your job is to assess whether a Sales Engineer has correctly answered a check question at the end of a lesson.

Evaluation criteria:
- Did they demonstrate genuine understanding, not just keyword repetition?
- Did they address the core concept the check question is testing?
- Is the answer directionally correct even if not perfectly worded?

Be fair but rigorous. A passing score (≥70) means the SE is ready to move on.
Below 70 means they need to revisit the material.

Respond ONLY with a valid JSON object — no markdown, no explanation, just the JSON.`;

    const userPrompt = `Lesson: ${lessonTitle}

Check question asked: "${checkQuestion}"

SE's answer: "${answer}"

Evaluate this answer and respond with exactly this JSON structure:
{
  "passed": true or false (true if score >= 70),
  "score": number from 0 to 100,
  "feedback": "1-2 sentence response addressed directly to the SE — encouraging if passed, specific about what's missing if not",
  "missing": ["concept 1", "concept 2"] — array of key concepts not addressed (empty array if passed)
}`;

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as Anthropic.Messages.TextBlock).text)
      .join("")
      .trim();

    // Strip markdown code fences if model wrapped it anyway
    const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();

    let result: JudgeResult;
    try {
      result = JSON.parse(cleaned);
    } catch {
      console.error("[judge] Failed to parse response:", raw);
      return NextResponse.json({ error: "Judge returned invalid JSON" }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[judge] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
