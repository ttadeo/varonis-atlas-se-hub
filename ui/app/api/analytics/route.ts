import neo4j from "neo4j-driver";
import { NextResponse } from "next/server";

function getNeo4jDriver() {
  return neo4j.driver(
    process.env.NEO4J_URI!,
    neo4j.auth.basic(process.env.NEO4J_USER!, process.env.NEO4J_PASSWORD!),
    { maxConnectionPoolSize: 1 }
  );
}

export async function GET() {
  const driver = getNeo4jDriver();

  try {
    const results = await Promise.all([

      // 1. Summary counts
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (i:Interaction)
            WITH count(i) AS totalInteractions,
                 sum(CASE WHEN i.is_quick_response = true THEN 1 ELSE 0 END) AS quickCount,
                 sum(CASE WHEN i.is_quick_response = false OR i.is_quick_response IS NULL THEN 1 ELSE 0 END) AS chatCount,
                 avg(CASE WHEN i.confidence_score IS NOT NULL THEN i.confidence_score END) AS avgScore
            MATCH (s:MeetingSession)
            WITH totalInteractions, quickCount, chatCount, avgScore, count(s) AS totalSessions
            RETURN totalInteractions, quickCount, chatCount, avgScore, totalSessions
          `);
          const rec = r.records[0];
          return {
            totalInteractions: rec?.get("totalInteractions")?.toNumber?.() ?? 0,
            quickCount: rec?.get("quickCount")?.toNumber?.() ?? 0,
            chatCount: rec?.get("chatCount")?.toNumber?.() ?? 0,
            avgScore: rec?.get("avgScore") ? Math.round(rec.get("avgScore") * 10) / 10 : null,
            totalSessions: rec?.get("totalSessions")?.toNumber?.() ?? 0,
          };
        } finally { await s.close(); }
      })(),

      // 2. Lowest scoring interactions (bottom 10 by confidence score)
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (sess:MeetingSession)-[:HAD]->(i:Interaction)
            WHERE i.confidence_score IS NOT NULL AND NOT i.is_script = true
            RETURN i.question AS question,
                   i.confidence_score AS score,
                   sess.customer_industry AS industry,
                   sess.meeting_type AS meetingType,
                   toString(i.created_at) AS createdAt
            ORDER BY i.confidence_score ASC
            LIMIT 10
          `);
          return r.records.map((rec) => ({
            question: rec.get("question"),
            score: rec.get("score"),
            industry: rec.get("industry"),
            meetingType: rec.get("meetingType"),
            createdAt: rec.get("createdAt")?.slice(0, 10) ?? "",
          }));
        } finally { await s.close(); }
      })(),

      // 3. Sessions by industry
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (sess:MeetingSession)
            WHERE sess.customer_industry IS NOT NULL AND sess.customer_industry <> ""
            RETURN sess.customer_industry AS industry, count(sess) AS count
            ORDER BY count DESC
          `);
          return r.records.map((rec) => ({
            industry: rec.get("industry"),
            count: rec.get("count")?.toNumber?.() ?? 0,
          }));
        } finally { await s.close(); }
      })(),

      // 4. Sessions by meeting type
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (sess:MeetingSession)
            WHERE sess.meeting_type IS NOT NULL AND sess.meeting_type <> ""
            RETURN sess.meeting_type AS meetingType, count(sess) AS count
            ORDER BY count DESC
          `);
          return r.records.map((rec) => ({
            meetingType: rec.get("meetingType"),
            count: rec.get("count")?.toNumber?.() ?? 0,
          }));
        } finally { await s.close(); }
      })(),

      // 5. Sessions over time (by date)
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (sess:MeetingSession)
            RETURN toString(date(sess.created_at)) AS date, count(sess) AS count
            ORDER BY date ASC
          `);
          return r.records.map((rec) => ({
            date: rec.get("date"),
            count: rec.get("count")?.toNumber?.() ?? 0,
          }));
        } finally { await s.close(); }
      })(),

      // 6. Confidence score distribution
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (i:Interaction)
            WHERE i.confidence_score IS NOT NULL AND NOT i.is_script = true
            RETURN
              sum(CASE WHEN i.confidence_score >= 85 THEN 1 ELSE 0 END) AS high,
              sum(CASE WHEN i.confidence_score >= 70 AND i.confidence_score < 85 THEN 1 ELSE 0 END) AS moderate,
              sum(CASE WHEN i.confidence_score < 70 THEN 1 ELSE 0 END) AS low
          `);
          const rec = r.records[0];
          return {
            high: rec?.get("high")?.toNumber?.() ?? 0,
            moderate: rec?.get("moderate")?.toNumber?.() ?? 0,
            low: rec?.get("low")?.toNumber?.() ?? 0,
          };
        } finally { await s.close(); }
      })(),

      // 7. Recent sessions
      (async () => {
        const s = driver.session();
        try {
          const r = await s.run(`
            MATCH (sess:MeetingSession)
            OPTIONAL MATCH (sess)-[:HAD]->(i:Interaction)
            WITH sess, count(i) AS turnCount
            RETURN sess.name AS name,
                   sess.customer_industry AS industry,
                   sess.meeting_type AS meetingType,
                   toString(sess.created_at) AS createdAt,
                   turnCount
            ORDER BY sess.created_at DESC
            LIMIT 8
          `);
          return r.records.map((rec) => ({
            name: rec.get("name"),
            industry: rec.get("industry"),
            meetingType: rec.get("meetingType"),
            createdAt: rec.get("createdAt")?.slice(0, 10) ?? "",
            turnCount: rec.get("turnCount")?.toNumber?.() ?? 0,
          }));
        } finally { await s.close(); }
      })(),

    ]);

    const [summary, lowestScoring, byIndustry, byMeetingType, overTime, scoreDistribution, recentSessions] = results;

    return NextResponse.json({
      summary,
      lowestScoring,
      byIndustry,
      byMeetingType,
      overTime,
      scoreDistribution,
      recentSessions,
    });

  } catch (err) {
    console.error("Analytics API error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  } finally {
    await driver.close();
  }
}
