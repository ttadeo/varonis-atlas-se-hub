import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import neo4j from "neo4j-driver";

function getDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI ?? "bolt://localhost:7687",
    neo4j.auth.basic(
      process.env.NEO4J_USER ?? "neo4j",
      process.env.NEO4J_PASSWORD ?? ""
    ),
    { maxConnectionPoolSize: 1 }
  );
}

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.email;

  const driver = getDriver();
  try {
    const session = driver.session();
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       RETURN u.learning_style AS learningStyle,
              u.voice_enabled AS voiceEnabled,
              u.voice_autoplay AS voiceAutoplay,
              u.judge_enabled AS judgeEnabled,
              u.completed_lessons AS completedLessons,
              u.active_lesson AS activeLesson`,
      { userId }
    );
    await session.close();

    if (result.records.length === 0) {
      return NextResponse.json({ learningStyle: null, voiceEnabled: false, voiceAutoplay: false, judgeEnabled: false, completedLessons: [], activeLesson: null });
    }

    const r = result.records[0];
    return NextResponse.json({
      learningStyle: r.get("learningStyle") ?? null,
      voiceEnabled: r.get("voiceEnabled") ?? false,
      voiceAutoplay: r.get("voiceAutoplay") ?? false,
      judgeEnabled: r.get("judgeEnabled") ?? false,
      completedLessons: (r.get("completedLessons") ?? []).map((n: unknown) => Math.round(Number(n))),
      activeLesson: r.get("activeLesson") ?? null,
    });
  } finally {
    await driver.close();
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.email;

  const body = await req.json();

  const setClauses: string[] = ["u.updated_at = datetime()"];
  const params: Record<string, unknown> = { userId };

  if (body.learningStyle !== undefined)    { setClauses.push("u.learning_style = $learningStyle");       params.learningStyle = body.learningStyle; }
  if (body.voiceEnabled !== undefined)     { setClauses.push("u.voice_enabled = $voiceEnabled");          params.voiceEnabled = body.voiceEnabled; }
  if (body.voiceAutoplay !== undefined)    { setClauses.push("u.voice_autoplay = $voiceAutoplay");         params.voiceAutoplay = body.voiceAutoplay; }
  if (body.judgeEnabled !== undefined)     { setClauses.push("u.judge_enabled = $judgeEnabled");           params.judgeEnabled = body.judgeEnabled; }
  if (body.completedLessons !== undefined) { setClauses.push("u.completed_lessons = $completedLessons");  params.completedLessons = body.completedLessons; }
  if (body.activeLesson !== undefined)     { setClauses.push("u.active_lesson = $activeLesson");           params.activeLesson = body.activeLesson; }

  const driver = getDriver();
  try {
    const session = driver.session();
    await session.run(
      `MERGE (u:User {id: $userId}) SET ${setClauses.join(", ")}`,
      params
    );
    await session.close();
    return NextResponse.json({ saved: true });
  } finally {
    await driver.close();
  }
}
