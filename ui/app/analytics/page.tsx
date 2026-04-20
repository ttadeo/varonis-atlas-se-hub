"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Summary {
  totalInteractions: number;
  quickCount: number;
  chatCount: number;
  avgScore: number | null;
  totalSessions: number;
}

interface LowScoreItem {
  question: string;
  score: number;
  industry: string;
  meetingType: string;
  createdAt: string;
}

interface CountItem {
  industry?: string;
  meetingType?: string;
  count: number;
}

interface TimeItem {
  date: string;
  count: number;
}

interface ScoreDistribution {
  high: number;
  moderate: number;
  low: number;
}

interface RecentSession {
  name: string;
  industry: string;
  meetingType: string;
  createdAt: string;
  turnCount: number;
}

interface AnalyticsData {
  summary: Summary;
  lowestScoring: LowScoreItem[];
  byIndustry: CountItem[];
  byMeetingType: CountItem[];
  overTime: TimeItem[];
  scoreDistribution: ScoreDistribution;
  recentSessions: RecentSession[];
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 85
      ? "bg-green-500/20 text-green-300 border-green-700"
      : score >= 70
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-700"
      : "bg-red-500/20 text-red-300 border-red-700";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {score}/100
    </span>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

function BarRow({ label, count, max, color }: { label: string; count: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-300 w-44 truncate shrink-0">{label}</span>
      <div className="flex-1 bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-gray-400 w-6 text-right shrink-0">{count}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">← Back</Link>
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-sm">📊</div>
        <div>
          <h1 className="font-semibold text-white">Interaction Analytics</h1>
          <p className="text-xs text-gray-400">Knowledge base health · Session trends · Answer quality</p>
        </div>
        <button
          onClick={() => { setLoading(true); setError(null); fetch("/api/analytics").then(r => r.json()).then(setData).finally(() => setLoading(false)); }}
          className="ml-auto text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-2xl p-6 text-red-300 text-sm">{error}</div>
        )}

        {data && !loading && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard label="Total Sessions" value={data.summary.totalSessions} />
              <StatCard label="Total Interactions" value={data.summary.totalInteractions} />
              <StatCard label="Quick Answers" value={data.summary.quickCount} sub={`${data.summary.totalInteractions > 0 ? Math.round((data.summary.quickCount / data.summary.totalInteractions) * 100) : 0}% of total`} />
              <StatCard label="Chat Turns" value={data.summary.chatCount} />
              <StatCard
                label="Avg Confidence"
                value={data.summary.avgScore !== null ? `${data.summary.avgScore}/100` : "—"}
                sub={data.summary.avgScore !== null ? (data.summary.avgScore >= 85 ? "High" : data.summary.avgScore >= 70 ? "Moderate" : "Low") : "No scored interactions"}
              />
            </div>

            {/* Score distribution + session volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Confidence score distribution */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Confidence Score Distribution</h2>
                {(data.scoreDistribution.high + data.scoreDistribution.moderate + data.scoreDistribution.low) === 0 ? (
                  <p className="text-gray-600 text-sm">No scored interactions yet.</p>
                ) : (
                  <div className="space-y-4">
                    {[
                      { label: "High (≥85)", count: data.scoreDistribution.high, color: "bg-green-500" },
                      { label: "Moderate (70–84)", count: data.scoreDistribution.moderate, color: "bg-yellow-500" },
                      { label: "Low (<70)", count: data.scoreDistribution.low, color: "bg-red-500" },
                    ].map(({ label, count, color }) => {
                      const total = data.scoreDistribution.high + data.scoreDistribution.moderate + data.scoreDistribution.low;
                      return (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-sm text-gray-300 w-36 shrink-0">{label}</span>
                          <div className="flex-1 bg-gray-800 rounded-full h-2.5">
                            <div className={`${color} h-2.5 rounded-full`} style={{ width: total > 0 ? `${Math.round((count / total) * 100)}%` : "0%" }} />
                          </div>
                          <span className="text-sm text-gray-400 w-8 text-right shrink-0">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sessions over time */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Sessions Over Time</h2>
                {data.overTime.length === 0 ? (
                  <p className="text-gray-600 text-sm">No session data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.overTime.map(({ date, count }) => (
                      <BarRow key={date} label={date} count={count} max={Math.max(...data.overTime.map(d => d.count))} color="bg-purple-500" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* By industry + by meeting type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Sessions by Industry</h2>
                {data.byIndustry.length === 0 ? (
                  <p className="text-gray-600 text-sm">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.byIndustry.map(({ industry, count }) => (
                      <BarRow key={industry} label={industry ?? "Unknown"} count={count} max={data.byIndustry[0].count} color="bg-blue-500" />
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Sessions by Meeting Type</h2>
                {data.byMeetingType.length === 0 ? (
                  <p className="text-gray-600 text-sm">No data yet.</p>
                ) : (
                  <div className="space-y-3">
                    {data.byMeetingType.map(({ meetingType, count }) => (
                      <BarRow key={meetingType} label={meetingType ?? "Unknown"} count={count} max={data.byMeetingType[0].count} color="bg-cyan-500" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Lowest scoring interactions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Lowest Confidence Answers</h2>
              <p className="text-xs text-gray-600 mb-5">These questions need better Atlas documentation coverage — the knowledge base has gaps here.</p>
              {data.lowestScoring.length === 0 ? (
                <p className="text-gray-600 text-sm">No scored interactions yet.</p>
              ) : (
                <div className="space-y-3">
                  {data.lowestScoring.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-800 last:border-0">
                      <ScoreBadge score={item.score} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-200 leading-snug">{item.question}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.industry} · {item.meetingType} · {item.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent sessions */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Recent Sessions</h2>
              {data.recentSessions.length === 0 ? (
                <p className="text-gray-600 text-sm">No sessions yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.recentSessions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0">
                      <div>
                        <p className="text-sm text-gray-200">{s.name}</p>
                        <p className="text-xs text-gray-600">{s.industry} · {s.meetingType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">{s.createdAt}</p>
                        <p className="text-xs text-gray-600">{s.turnCount} turn{s.turnCount !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
