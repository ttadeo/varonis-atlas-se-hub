"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScopeProject {
  id: string;
  name: string;
}

interface ScopeOrg {
  id: string;
  name: string;
  projects: ScopeProject[];
}

interface ScopeSelection {
  label: string;
  project_ids: string[];
}

const ENTIRE_TENANT: ScopeSelection = { label: "Entire Tenant", project_ids: [] };

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

// ─── Scope Selector ───────────────────────────────────────────────────────────

function ScopeSelector({
  scope,
  onChange,
}: {
  scope: ScopeSelection;
  onChange: (s: ScopeSelection) => void;
}) {
  const [orgs, setOrgs] = useState<ScopeOrg[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [open, setOpen] = useState(false);
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/atlas-mcp/scopes")
      .then((r) => r.json())
      .then((d) => setOrgs(d.orgs ?? []))
      .catch(() => {})
      .finally(() => setLoadingOrgs(false));
  }, []);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  function toggleProject(id: string) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleOrg(org: ScopeOrg) {
    const orgProjIds = org.projects.map((p) => p.id);
    const allSelected = orgProjIds.every((id) => pendingIds.has(id));
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (allSelected) orgProjIds.forEach((id) => next.delete(id));
      else orgProjIds.forEach((id) => next.add(id));
      return next;
    });
  }

  function applyScope() {
    if (pendingIds.size === 0) {
      onChange(ENTIRE_TENANT);
    } else {
      // Build label from selected project names
      const selected: string[] = [];
      for (const org of orgs) {
        for (const p of org.projects) {
          if (pendingIds.has(p.id)) selected.push(p.name);
        }
      }
      const label = selected.length <= 2
        ? selected.join(", ")
        : `${selected.slice(0, 2).join(", ")} +${selected.length - 2} more`;
      onChange({ label, project_ids: [...pendingIds] });
    }
    setOpen(false);
  }

  function resetScope() {
    setPendingIds(new Set());
    onChange(ENTIRE_TENANT);
    setOpen(false);
  }

  const isEntireTenant = scope.label === "Entire Tenant";

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
          isEntireTenant
            ? "border-gray-700 bg-gray-800/60 text-gray-300 hover:border-gray-600"
            : "border-indigo-700/60 bg-indigo-900/20 text-indigo-300 hover:border-indigo-600"
        }`}
      >
        <span>{isEntireTenant ? "🌐" : "🎯"}</span>
        <span>{scope.label}</span>
        <span className="text-gray-500">▾</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">Scope Filter</span>
            <button onClick={resetScope} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Reset
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loadingOrgs ? (
              <div className="flex items-center justify-center py-6">
                <span className="text-xs text-gray-500">Loading orgs...</span>
              </div>
            ) : orgs.length === 0 ? (
              <div className="px-4 py-4 text-xs text-gray-500">No organizations found.</div>
            ) : (
              <div className="py-1">
                {/* Entire tenant option */}
                <button
                  onClick={resetScope}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-xs transition-colors hover:bg-gray-800 ${
                    pendingIds.size === 0 ? "text-indigo-400" : "text-gray-400"
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 border-gray-600 bg-gray-800">
                    {pendingIds.size === 0 && <span className="text-indigo-400">✓</span>}
                  </span>
                  <span className="font-medium">Entire Tenant</span>
                </button>

                <div className="my-1 border-t border-gray-800" />

                {orgs.map((org) => {
                  const orgProjIds = org.projects.map((p) => p.id);
                  const allSelected = orgProjIds.length > 0 && orgProjIds.every((id) => pendingIds.has(id));
                  const someSelected = orgProjIds.some((id) => pendingIds.has(id));
                  const isExpanded = expandedOrg === org.id;

                  return (
                    <div key={org.id}>
                      {/* Org row */}
                      <div className="flex items-center gap-2 px-4 py-1.5 hover:bg-gray-800 transition-colors">
                        <button
                          onClick={() => toggleOrg(org)}
                          className="w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 border-gray-600 bg-gray-800 text-indigo-400"
                        >
                          {allSelected ? "✓" : someSelected ? "−" : ""}
                        </button>
                        <button
                          onClick={() => setExpandedOrg(isExpanded ? null : org.id)}
                          className="flex-1 flex items-center gap-1.5 text-left"
                        >
                          <span className="text-xs text-gray-500">{isExpanded ? "▾" : "▸"}</span>
                          <span className="text-xs text-gray-200 font-medium">{org.name}</span>
                          <span className="text-xs text-gray-600 ml-auto">{org.projects.length}</span>
                        </button>
                      </div>

                      {/* Projects */}
                      {isExpanded && org.projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => toggleProject(p.id)}
                          className="w-full flex items-center gap-2 pl-8 pr-4 py-1.5 text-xs hover:bg-gray-800 transition-colors"
                        >
                          <span className="w-3 h-3 rounded-sm border flex items-center justify-center shrink-0 border-gray-600 bg-gray-800 text-indigo-400 text-xs">
                            {pendingIds.has(p.id) ? "✓" : ""}
                          </span>
                          <span className={pendingIds.has(p.id) ? "text-indigo-300" : "text-gray-400"}>
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-800">
            <button
              onClick={applyScope}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2 transition-colors"
            >
              {pendingIds.size === 0 ? "View Entire Tenant" : `Apply Scope (${pendingIds.size} project${pendingIds.size !== 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
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
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Powered by Atlas MCP Server</p>
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
              Querying Atlas MCP Server...
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

function RiskBriefingCard({ scope }: { scope: ScopeSelection }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RiskBriefingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset result when scope changes
  useEffect(() => { setResult(null); setError(null); }, [scope]);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/risk-briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
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
      dataSources={["Atlas MCP Server", "Claude Sonnet 4.6"]}
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
          {result.tenant_snapshot && (
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
          )}

          {/* Findings */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Key Findings</p>
            <ul className="space-y-1">
              {result.findings?.map((f, i) => (
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
              {result.recommendations?.map((r, i) => (
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

function EndpointAuditCard({ scope }: { scope: ScopeSelection }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EndpointAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setResult(null); setError(null); }, [scope]);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/endpoint-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
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
      description="Per-endpoint risk assessment — identifies misconfigured or unmonitored LLM endpoints across the Atlas tenant."
      dataSources={["Atlas MCP Server", "Claude Sonnet 4.6"]}
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
            {result.audited_endpoints?.slice(0, 6).map((ep, i) => (
              <div key={i} className="rounded-lg bg-gray-800/60 border border-gray-700/50 px-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-white truncate max-w-[60%]">{ep.identifier}</span>
                  <span className={`text-xs font-bold uppercase rounded px-1.5 py-0.5 border ${riskColor(ep.risk_level)}`}>
                    {ep.risk_level}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{ep.risk_reason}</p>
                {ep.missing_policies?.length > 0 && (
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
            {result.audited_endpoints?.length > 6 && (
              <p className="text-xs text-gray-500 text-center">+ {result.audited_endpoints.length - 6} more endpoints</p>
            )}
          </div>
        </div>
      )}
    </AppCard>
  );
}

// ─── App 3: Shadow AI Report ──────────────────────────────────────────────────

function ShadowAiCard({ scope }: { scope: ScopeSelection }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShadowAiResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setResult(null); setError(null); }, [scope]);

  async function launch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/atlas-mcp/shadow-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
      });
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
    ? Math.round((result.tenant_analysis?.coverage_ratio ?? 0) * 100)
    : 0;

  return (
    <AppCard
      icon="👁️"
      title="Shadow AI Report"
      description="Identifies AI projects with no registered LLM endpoints — the unmonitored blind spots where shadow AI can operate undetected."
      dataSources={["Atlas MCP Server", "Claude Sonnet 4.6"]}
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
              <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">At Risk ({result.at_risk_projects?.length ?? 0})</p>
              {!result.at_risk_projects?.length ? (
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
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Covered ({result.covered_projects?.length ?? 0})</p>
              <ul className="space-y-0.5">
                {result.covered_projects?.slice(0, 4).map((p, i) => (
                  <li key={i} className="text-xs text-gray-300 truncate">✓ {p.name}</li>
                ))}
                {(result.covered_projects?.length ?? 0) > 4 && (
                  <li className="text-xs text-gray-500">+{result.covered_projects.length - 4} more</li>
                )}
              </ul>
            </div>
          </div>

          {/* Findings */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Findings</p>
            <ul className="space-y-1">
              {result.findings?.map((f, i) => (
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

// ─── AI Posture Advisor Chat ──────────────────────────────────────────────────

interface AdvisorMessage {
  role: "user" | "assistant";
  content: string;
  tools_called?: string[];
}

const STARTER_QUESTIONS = [
  "Which of my endpoints are highest risk?",
  "Am I ready for an ISO 42001 audit?",
  "What would an attacker target first in my tenant?",
  "Which projects have no AI monitoring?",
  "What should I fix first today?",
];

function PostureAdvisorChat({ scope }: { scope: ScopeSelection }) {
  const [messages, setMessages] = useState<AdvisorMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset conversation when scope changes
  useEffect(() => {
    setMessages([]);
    setError(null);
  }, [scope]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const hasMessages = messages.length > 0;

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: AdvisorMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/atlas-mcp/posture-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10),
          scope,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.response as string,
        tools_called: data.tools_called as string[] | undefined,
      }]);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [messages, loading, scope]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="rounded-2xl border border-indigo-800/50 bg-gray-900 overflow-hidden mt-6">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-700/50 flex items-center justify-center text-lg">
          🛡️
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-white">AI Posture Advisor</h2>
          <p className="text-xs text-gray-400">Connected to Atlas via the real Atlas MCP Server — Claude calls Atlas tools autonomously</p>
        </div>
        {scope.label !== "Entire Tenant" && (
          <span className="text-xs rounded-full border border-indigo-700/60 bg-indigo-900/20 text-indigo-300 px-2.5 py-1 shrink-0">
            🎯 {scope.label}
          </span>
        )}
      </div>

      {/* Scope change notice */}
      {!hasMessages && scope.label !== "Entire Tenant" && (
        <div className="px-6 py-2 bg-indigo-950/30 border-b border-indigo-900/30">
          <p className="text-xs text-indigo-400">Scope active: questions will focus on <span className="font-medium">{scope.label}</span></p>
        </div>
      )}

      {/* Message thread */}
      <div className="px-6 py-4 min-h-[280px] max-h-[480px] overflow-y-auto flex flex-col gap-4">
        {!hasMessages && (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Try asking</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
            {msg.role === "assistant" && (
              <span className="text-xs text-indigo-400 font-medium px-1">Atlas Posture Advisor</span>
            )}
            <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-gray-800 text-gray-100 border border-gray-700/60 rounded-tl-sm"
            }`}>
              {msg.content}
            </div>
            {msg.role === "assistant" && msg.tools_called && msg.tools_called.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5 px-1">
                <span className="text-xs text-gray-600">🔧</span>
                <span className="text-xs text-gray-600">Atlas MCP tools called:</span>
                {msg.tools_called.map((t) => (
                  <span key={t} className="text-xs font-mono text-indigo-500 bg-indigo-950/50 border border-indigo-900/60 rounded px-1.5 py-0.5">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex flex-col items-start gap-1">
            <span className="text-xs text-indigo-400 font-medium px-1">Atlas Posture Advisor</span>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-gray-800 border border-gray-700/60">
              <span className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-3.5 h-3.5 border-2 border-gray-600 border-t-indigo-400 rounded-full animate-spin" />
                Calling Atlas MCP Server...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-800/50 bg-red-900/20 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Starter question pills */}
      {!hasMessages && (
        <div className="px-6 pb-4 flex flex-wrap gap-2 justify-center">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              disabled={loading}
              className="text-xs rounded-full border border-indigo-700/60 bg-indigo-900/20 hover:bg-indigo-900/40 hover:border-indigo-600/70 text-indigo-300 px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 border-t border-gray-800">
        <div className="flex items-end gap-2 rounded-xl border border-gray-700 bg-gray-800/60 px-3 py-2 focus-within:border-indigo-600/60 transition-colors">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your AI security posture..."
            disabled={loading}
            className="flex-1 resize-none bg-transparent text-sm text-gray-100 placeholder-gray-500 outline-none disabled:opacity-50 leading-relaxed"
            style={{ minHeight: "1.5rem", maxHeight: "6rem", overflowY: "auto" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="shrink-0 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-1.5 px-1">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AtlasMcpPage() {
  const [scope, setScope] = useState<ScopeSelection>(ENTIRE_TENANT);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
          ← Back
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
            ⚡
          </div>
          <div>
            <h1 className="font-semibold text-white">Atlas MCP App Gallery</h1>
            <p className="text-xs text-gray-400">Live apps built on the Atlas MCP Server — real tenant data, real AI insights</p>
          </div>
        </div>
        <button
          onClick={() => setHelpOpen(true)}
          className="shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/60 hover:bg-gray-700 hover:border-gray-600 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
        >
          <span>?</span>
          <span>How it works</span>
        </button>
      </header>
      <HelpPanel page="atlas-mcp" open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Explainer */}
        <div className="rounded-xl border border-indigo-800/50 bg-indigo-900/10 px-6 py-5 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🔌</div>
            <div>
              <h2 className="font-semibold text-white mb-1">What the Atlas MCP Server Enables</h2>
              <p className="text-sm text-gray-400 max-w-3xl">
                The Atlas MCP Server exposes Atlas data to any AI assistant — Claude, Copilot, Cursor — so your security team
                can <span className="text-white font-medium">ask questions</span> in natural language and get structured intelligence back.
                Every app below connects to the real Atlas MCP Server at{" "}
                <span className="font-mono text-indigo-400 text-xs">mcp.prod.alltrue-be.com</span>,
                fetches live tenant data, and returns actionable security insights.
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-indigo-400 font-medium">Tenant: Unsanctioned-Tim-The-AI-Guy</span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-500">Live data · No caching · Real Atlas MCP calls</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scope selector bar */}
        <div className="flex items-center gap-3 mb-6 rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-3">
          <span className="text-xs text-gray-500 font-medium shrink-0">Analyzing scope:</span>
          <ScopeSelector scope={scope} onChange={setScope} />
          {scope.label !== "Entire Tenant" && (
            <span className="text-xs text-gray-600 italic">
              Results will reset when scope changes — re-run each app to see scoped data.
            </span>
          )}
        </div>

        {/* App cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RiskBriefingCard scope={scope} />
          <EndpointAuditCard scope={scope} />
          <ShadowAiCard scope={scope} />
        </div>

        {/* AI Posture Advisor */}
        <PostureAdvisorChat scope={scope} />

        {/* Footer */}
        <div className="mt-8 rounded-xl border border-gray-800 bg-gray-900/50 px-5 py-4">
          <p className="text-xs text-gray-500 text-center">
            All apps connect to the real{" "}
            <span className="text-gray-300 font-medium">Atlas MCP Server</span>{" "}
            at <span className="font-mono text-xs">mcp.prod.alltrue-be.com</span>.
            Claude calls Atlas tools autonomously — the same pattern your customers get when they add Atlas to Claude Code, Cursor, or any MCP-compatible assistant.
          </p>
        </div>
      </main>
    </div>
  );
}
