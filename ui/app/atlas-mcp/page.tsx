"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RiskBriefingResult {
  risk_score: number;
  risk_level: string;
  headline: string;
  findings: string[];
  recommendations: string[];
  data_sources_used: string[];
  tenant_snapshot: {
    total_projects: number;
    total_endpoints: number;
  };
}

interface EndpointAuditEndpoint {
  identifier: string;
  project_id: string | null;
  risk_level: "low" | "medium" | "high";
  risk_reason: string;
  missing_policies: string[];
  recommendation: string;
}

interface EndpointAuditResult {
  audited_endpoints: EndpointAuditEndpoint[];
  overall_posture: string;
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  total: number;
}

interface ShadowAiProject {
  name: string;
  reason?: string;
  status?: string;
}

interface ShadowAiResult {
  shadow_risk_score: number;
  shadow_risk_level: string;
  headline: string;
  at_risk_projects: ShadowAiProject[];
  covered_projects: ShadowAiProject[];
  findings: string[];
  cta: string;
  tenant_analysis: {
    total_projects: number;
    total_endpoints: number;
    coverage_ratio: number;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function riskColor(level: string) {
  switch (level?.toLowerCase()) {
    case "low": return "text-emerald-400 bg-emerald-900/30 border-emerald-700/50";
    case "medium": return "text-amber-400 bg-amber-900/30 border-amber-700/50";
    case "high": return "text-orange-400 bg-orange-900/30 border-orange-700/50";
    case "critical": return "text-red-400 bg-red-900/30 border-red-700/50";
    default: return "text-gray-400 bg-gray-800 border-gray-700";
  }
}

function riskScoreColor(score: number) {
  if (score < 30) return "text-emerald-400";
  if (score < 60) return "text-amber-400";
  if (score < 80) return "text-orange-400";
  return "text-red-400";
}

// ─── App Card Shell ───────────────────────────────────────────────────────────

function AppCard({
  icon,
  title,
  description,
  dataSources,
  talkingPoint,
  accentClass,
  buttonLabel,
  loading,
  onLaunch,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  dataSources: string[];
  talkingPoint: string;
  accentClass: string;
  buttonLabel: string;
  loading: boolean;
  onLaunch: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border bg-gray-900 flex flex-col ${accentClass}`}>
      <div className="p-6 flex-1">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-white text-base">{title}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          </div>
        </div>

        {/* Data sources callout */}
        <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2 mb-4">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Powered by live Atlas data</p>
          <div className="flex flex-wrap gap-1.5">
            {dataSources.map((src) => (
              <span key={src} className="text-xs text-gray-300 bg-gray-700/60 rounded px-2 py-0.5 font-mono">{src}</span>
            ))}
          </div>
        </div>

        {/* Launch button */}
        <button
          onClick={onLaunch}
          disabled={loading}
          className="w-full rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500 text-sm font-semibold text-white py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-gray-500 border-t-white rounded-full animate-spin" />
              Fetching live Atlas data...
            </span>
          ) : buttonLabel}
        </button>

        {/* Result zone */}
        {children}
      </div>

      {/* SE Talking Point */}
      <div className="px-6 py-3 border-t border-gray-800 rounded-b-2xl bg-gray-800/30">
        <p className="text-xs text-gray-500">
          <span className="text-gray-400 font-semibold">SE tip: </span>
          {talkingPoint}
        </p>
      </div>
    </div>
  );
}

// ─── App 1: AI Risk Briefing ──────────────────────────────────────────────────

function RiskBriefingCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskBriefingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/risk-briefing", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data as RiskBriefingResult);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppCard
      icon="📊"
      title="AI Risk Briefing"
      description="Executive AI security report generated from live tenant data — risk score, key findings, and recommended actions."
      dataSources={["Projects API", "Endpoint Settings API", "Claude Sonnet 4.6"]}
      talkingPoint="This is an executive AI security report generated in seconds from live Atlas data. Any SOC team could have this as a Slack command or a scheduled email."
      accentClass="border-indigo-800/50 hover:border-indigo-600/60 transition-colors"
      buttonLabel="Generate AI Risk Briefing"
      loading={loading}
      onLaunch={launch}
    >
      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {result && (
        <div className="space-y-3">
          {/* Risk score */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className={`text-4xl font-bold tabular-nums ${riskScoreColor(result.risk_score)}`}>
                {result.risk_score}
              </div>
              <div className="text-xs text-gray-500">/ 100</div>
            </div>
            <div className="flex-1">
              <span className={`text-xs font-bold uppercase tracking-wide rounded px-2 py-0.5 border ${riskColor(result.risk_level)}`}>
                {result.risk_level} risk
              </span>
              <p className="text-sm text-white mt-1 font-medium leading-snug">{result.headline}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2 text-center">
              <div className="text-xl font-bold text-white">{result.tenant_snapshot.total_projects}</div>
              <div className="text-xs text-gray-500">Projects</div>
            </div>
            <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2 text-center">
              <div className="text-xl font-bold text-white">{result.tenant_snapshot.total_endpoints}</div>
              <div className="text-xs text-gray-500">LLM Endpoints</div>
            </div>
          </div>

          {/* Findings */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Key Findings</p>
            <ul className="space-y-1">
              {result.findings.map((f, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-300">
                  <span className="text-amber-400 shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Recommendations</p>
            <ul className="space-y-1">
              {result.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-300">
                  <span className="text-emerald-400 shrink-0">{i + 1}.</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </AppCard>
  );
}

// ─── App 2: LLM Endpoint Audit ────────────────────────────────────────────────

function EndpointAuditCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EndpointAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/endpoint-audit", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data as EndpointAuditResult);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppCard
      icon="🔍"
      title="LLM Endpoint Audit"
      description="Per-endpoint risk assessment — identifies misconfigured or unmonitored LLM endpoints across the entire Atlas tenant."
      dataSources={["Endpoint Settings API", "Claude Sonnet 4.6"]}
      talkingPoint="This is the data your compliance team needs for an AI vendor audit. Atlas exposes it via API — they can pull it into any GRC tool, SIEM, or ticketing system automatically."
      accentClass="border-amber-800/50 hover:border-amber-600/60 transition-colors"
      buttonLabel="Run Endpoint Audit"
      loading={loading}
      onLaunch={launch}
    >
      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {result && (
        <div className="space-y-3">
          {/* Summary counts */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-red-900/20 border border-red-800/40 px-2 py-1.5 text-center">
              <div className="text-lg font-bold text-red-400">{result.high_risk_count}</div>
              <div className="text-xs text-gray-500">High Risk</div>
            </div>
            <div className="rounded-lg bg-amber-900/20 border border-amber-800/40 px-2 py-1.5 text-center">
              <div className="text-lg font-bold text-amber-400">{result.medium_risk_count}</div>
              <div className="text-xs text-gray-500">Medium</div>
            </div>
            <div className="rounded-lg bg-emerald-900/20 border border-emerald-800/40 px-2 py-1.5 text-center">
              <div className="text-lg font-bold text-emerald-400">{result.low_risk_count}</div>
              <div className="text-xs text-gray-500">Low Risk</div>
            </div>
          </div>

          {/* Overall posture */}
          <p className="text-xs text-gray-400 italic">{result.overall_posture}</p>

          {/* Endpoint list */}
          <div className="space-y-2">
            {result.audited_endpoints.slice(0, 6).map((ep, i) => (
              <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-white truncate max-w-[60%]">{ep.identifier}</span>
                  <span className={`text-xs font-bold uppercase rounded px-1.5 py-0.5 border ${riskColor(ep.risk_level)}`}>
                    {ep.risk_level}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{ep.risk_reason}</p>
                {ep.missing_policies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {ep.missing_policies.map((mp) => (
                      <span key={mp} className="text-xs text-red-400 bg-red-900/20 border border-red-800/30 rounded px-1.5 py-0.5">
                        missing: {mp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {result.audited_endpoints.length > 6 && (
              <p className="text-xs text-gray-500 text-center">+ {result.audited_endpoints.length - 6} more endpoints</p>
            )}
          </div>
        </div>
      )}
    </AppCard>
  );
}

// ─── App 3: Shadow AI Report ──────────────────────────────────────────────────

function ShadowAiCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShadowAiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/shadow-ai", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data as ShadowAiResult);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  const coveragePercent = result
    ? Math.round((result.tenant_analysis.coverage_ratio ?? 0) * 100)
    : 0;

  return (
    <AppCard
      icon="👁️"
      title="Shadow AI Report"
      description="Identifies AI projects with no registered LLM endpoints — the unmonitored blind spots where shadow AI can operate undetected."
      dataSources={["Projects API", "Endpoint Settings API", "Claude Sonnet 4.6"]}
      talkingPoint="Projects without registered endpoints = potential shadow AI. Atlas can tell you this programmatically — no manual audit required. This report can run on a schedule and alert your security team automatically."
      accentClass="border-red-800/50 hover:border-red-600/60 transition-colors"
      buttonLabel="Generate Shadow AI Report"
      loading={loading}
      onLaunch={launch}
    >
      {error && (
        <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">{error}</div>
      )}
      {result && (
        <div className="space-y-3">
          {/* Score + coverage */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className={`text-4xl font-bold tabular-nums ${riskScoreColor(result.shadow_risk_score)}`}>
                {result.shadow_risk_score}
              </div>
              <div className="text-xs text-gray-500">/ 100</div>
            </div>
            <div className="flex-1">
              <span className={`text-xs font-bold uppercase tracking-wide rounded px-2 py-0.5 border ${riskColor(result.shadow_risk_level)}`}>
                {result.shadow_risk_level} risk
              </span>
              <p className="text-sm text-white mt-1 font-medium leading-snug">{result.headline}</p>
            </div>
          </div>

          {/* Coverage bar */}
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Monitoring coverage</span>
              <span className={coveragePercent >= 80 ? "text-emerald-400" : coveragePercent >= 50 ? "text-amber-400" : "text-red-400"}>
                {coveragePercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${coveragePercent >= 80 ? "bg-emerald-500" : coveragePercent >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>

          {/* At-risk vs covered */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">At Risk ({result.at_risk_projects.length})</p>
              {result.at_risk_projects.length === 0 ? (
                <p className="text-xs text-gray-500">None — great posture!</p>
              ) : (
                <ul className="space-y-0.5">
                  {result.at_risk_projects.slice(0, 4).map((p, i) => (
                    <li key={i} className="text-xs text-gray-300 truncate">⚠ {p.name}</li>
                  ))}
                  {result.at_risk_projects.length > 4 && (
                    <li className="text-xs text-gray-500">+{result.at_risk_projects.length - 4} more</li>
                  )}
                </ul>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Covered ({result.covered_projects.length})</p>
              <ul className="space-y-0.5">
                {result.covered_projects.slice(0, 4).map((p, i) => (
                  <li key={i} className="text-xs text-gray-300 truncate">✓ {p.name}</li>
                ))}
                {result.covered_projects.length > 4 && (
                  <li className="text-xs text-gray-500">+{result.covered_projects.length - 4} more</li>
                )}
              </ul>
            </div>
          </div>

          {/* Findings */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Findings</p>
            <ul className="space-y-1">
              {result.findings.map((f, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-300">
                  <span className="text-amber-400 shrink-0">•</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2">
            <p className="text-xs text-gray-400"><span className="text-white font-semibold">Next step: </span>{result.cta}</p>
          </div>
        </div>
      )}
    </AppCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AtlasMcpPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← Back
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <h1 className="font-semibold text-white">Atlas MCP App Gallery</h1>
            <p className="text-xs text-gray-400">Live apps built on the Atlas REST API — real tenant data, real AI insights</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Explainer */}
        <div className="rounded-xl border border-indigo-800/50 bg-indigo-900/10 px-6 py-5 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🔌</div>
            <div>
              <h2 className="font-semibold text-white mb-1">What the Atlas MCP Server Enables</h2>
              <p className="text-sm text-gray-400 max-w-3xl">
                The Atlas MCP Server exposes Atlas data to any AI assistant — Claude, Copilot, Cursor — so your security team
                can <span className="text-white font-medium">ask questions</span> in natural language and get structured intelligence back.
                The 3 apps below use the same underlying Atlas REST API. Each one fetches live data from a real Atlas tenant,
                passes it to Claude, and renders actionable insights — demonstrating what your customers can build.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-indigo-400 font-medium">Tenant: Unsanctioned-Tim-The-AI-Guy</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">Live data · No caching · Real Atlas API calls</span>
              </div>
            </div>
          </div>
        </div>

        {/* App cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskBriefingCard />
          <EndpointAuditCard />
          <ShadowAiCard />
        </div>

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-4">
          <p className="text-xs text-gray-500 text-center">
            All data is fetched in real time from the live Varonis Atlas tenant.
            API calls use the same endpoints the <span className="text-gray-300 font-medium">Atlas MCP Server</span> exposes to Claude and other AI assistants.
            These apps are built with Next.js + TypeScript — the same stack any customer dev team can use.
          </p>
        </div>
      </main>
    </div>
  );
}
