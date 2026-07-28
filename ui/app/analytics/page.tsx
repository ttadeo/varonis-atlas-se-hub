"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

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

interface OptimizeProgress {
  run_id: string;
  status: "running" | "complete";
  iteration: number;
  total_iterations: number;
  baseline_score: number;
  current_best: number;
  improvements: number;
  started_at: string;
  log: string[];
}

interface OptimizeResult {
  run_id: string;
  baseline_score: number;
  final_score: number;
  improvement: number;
  iterations_run: number;
  improvements_found: number;
  change_log: { iteration: number; score: number; delta: number }[];
  completed_at: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // Optimize RAG state
  const [optProgress, setOptProgress]   = useState<OptimizeProgress | null>(null);
  const [optResult, setOptResult]       = useState<OptimizeResult | null>(null);
  const [optPending, setOptPending]     = useState(false);
  const [optTriggering, setOptTriggering] = useState(false);
  const [optError, setOptError]         = useState<string | null>(null);

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

  const fetchOptStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/optimize/status");
      const d = await r.json();
      setOptProgress(d.progress);
      setOptResult(d.result);
      setOptPending(d.pending);
    } catch {
      // silently ignore
    }
  }, []);

  // Poll status every 5s when running or pending
  useEffect(() => {
    fetchOptStatus();
    const interval = setInterval(() => {
      if (optProgress?.status === "running" || optPending) {
        fetchOptStatus();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchOptStatus, optProgress?.status, optPending]);

  async function triggerOptimize() {
    setOptTriggering(true);
    setOptError(null);
    try {
      const r = await fetch("/api/optimize/trigger", { method: "POST" });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to trigger");
      setOptPending(true);
      await fetchOptStatus();
    } catch (e) {
      setOptError(String(e));
    } finally {
      setOptTriggering(false);
    }
  }

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
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => { setLoading(true); setError(null); fetch("/api/analytics").then(r => r.json()).then(setData).finally(() => setLoading(false)); }}
            className="text-xs text-gray-500 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setHelpOpen(true)}
            className="w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white text-xs font-bold transition-colors"
            title="Help"
          >?</button>
        </div>
      </header>
      <HelpPanel page="analytics" open={helpOpen} onClose={() => setHelpOpen(false)} />

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

        {/* ── Optimize RAG ─────────────────────────────────────────── */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">RAG Prompt Optimizer</h2>
              <p className="text-xs text-gray-600 mt-1">
                Autoresearch-inspired loop — iteratively edits the system prompt, scores groundedness with Haiku,
                keeps improvements. ~$4–6 per run.
              </p>
            </div>
            <button
              onClick={triggerOptimize}
              disabled={optTriggering || optProgress?.status === "running" || optPending}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 disabled:bg-gray-700 disabled:text-gray-500 text-white transition-colors shrink-0 ml-4"
            >
              {optTriggering ? "Requesting..." : optPending ? "Pending..." : optProgress?.status === "running" ? "Running..." : "Optimize RAG"}
            </button>
          </div>

          {/* TrueLens baseline scores */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Answer Relevance", score: 0.987 },
              { label: "Context Relevance", score: 1.000 },
              { label: "Groundedness", score: 0.777 },
            ].map(({ label, score }) => (
              <div key={label} className="bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2.5 text-center">
                <div className={`text-lg font-bold ${score >= 0.95 ? "text-emerald-400" : "text-amber-400"}`}>
                  {score.toFixed(3)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                <div className="text-xs text-gray-700 mt-0.5">v3.6.0 baseline</div>
              </div>
            ))}
          </div>

          {optError && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {optError}
            </div>
          )}

          {optPending && !optProgress && (
            <div className="text-xs text-amber-400 bg-amber-900/10 border border-amber-800/40 rounded-lg px-3 py-2">
              Trigger sent — run <span className="font-mono">python evals/optimize_rag_prompt.py --watch</span> on your Mac to start.
            </div>
          )}

          {/* Live progress */}
          {optProgress && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">
                  {optProgress.status === "running" ? (
                    <span className="text-purple-400">Running — iteration {optProgress.iteration}/{optProgress.total_iterations}</span>
                  ) : (
                    <span className="text-emerald-400">Complete</span>
                  )}
                </span>
                <span className="text-xs text-gray-500">
                  {optProgress.improvements} improvement{optProgress.improvements !== 1 ? "s" : ""} found
                </span>
              </div>

              {/* Score bars */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 shrink-0">Baseline</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${optProgress.baseline_score * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{optProgress.baseline_score.toFixed(3)}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-20 shrink-0">Best so far</span>
                <div className="flex-1 bg-gray-700 rounded-full h-1.5">
                  <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${optProgress.current_best * 100}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">{optProgress.current_best.toFixed(3)}</span>
              </div>

              {/* Log */}
              {optProgress.log.length > 0 && (
                <div className="font-mono text-xs text-gray-500 space-y-0.5 max-h-32 overflow-y-auto">
                  {optProgress.log.slice(-10).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Final result */}
          {optResult && optProgress?.status === "complete" && (
            <div className={`rounded-lg border px-4 py-3 space-y-1 ${
              optResult.improvement > 0
                ? "border-emerald-800/50 bg-emerald-900/10"
                : "border-gray-700 bg-gray-800/40"
            }`}>
              <p className={`text-xs font-semibold ${optResult.improvement > 0 ? "text-emerald-400" : "text-gray-400"}`}>
                {optResult.improvement > 0
                  ? `Groundedness improved: ${optResult.baseline_score.toFixed(3)} → ${optResult.final_score.toFixed(3)} (+${optResult.improvement.toFixed(3)})`
                  : `No improvement found — baseline prompt unchanged (${optResult.baseline_score.toFixed(3)})`}
              </p>
              <p className="text-xs text-gray-500">
                {optResult.iterations_run} iterations · {optResult.improvements_found} improvements · completed {new Date(optResult.completed_at).toLocaleString()}
              </p>
              {optResult.improvement > 0 && (
                <p className="text-xs text-emerald-600">Winning prompt is live in KV — n8n uses it for all production requests.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
