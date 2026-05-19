"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SimPromptResult {
  label: string;
  prompt: string;
  status: "sent" | "blocked" | "error";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

interface SimResult {
  scenario_id: string;
  gateway_endpoint: string;
  prompts_fired: number;
  results: SimPromptResult[];
  runtime_hint: string;
}

// ─── Scenario definitions (mirrored from API) ──────────────────────────────────

const SCENARIOS = [
  {
    id: "healthcare",
    name: "Healthcare",
    subtitle: "Clinical Note Summarizer",
    icon: "🏥",
    description:
      "LangChain + GPT-4o summarizes patient records. Prompts contain SSNs, MRNs, and PHI — designed to trigger PII guardrails.",
    risk: "PII / PHI Exposure",
    color: "blue",
  },
  {
    id: "finance",
    name: "Financial Services",
    subtitle: "AI Risk Analyzer",
    icon: "📈",
    description:
      "Claude 3 Opus analyzes market risk using client account data. Prompts include account numbers, SSNs, and unreleased earnings — designed to trigger data leakage guardrails.",
    risk: "Data Leakage / Insider Risk",
    color: "emerald",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    subtitle: "Recommendation Engine",
    icon: "🛒",
    description:
      "Azure OpenAI powers product recommendations. Prompts include a prompt injection attack and behavioral data exfiltration — designed to trigger injection and content guardrails.",
    risk: "Prompt Injection / Data Exfiltration",
    color: "violet",
  },
];

const COLOR_MAP: Record<string, { border: string; badge: string; button: string; tag: string }> = {
  blue: {
    border: "border-blue-500",
    badge: "bg-blue-500/10 text-blue-300 border border-blue-500/30",
    button: "bg-blue-600 hover:bg-blue-500",
    tag: "text-blue-400",
  },
  emerald: {
    border: "border-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30",
    button: "bg-emerald-600 hover:bg-emerald-500",
    tag: "text-emerald-400",
  },
  violet: {
    border: "border-violet-500",
    badge: "bg-violet-500/10 text-violet-300 border border-violet-500/30",
    button: "bg-violet-600 hover:bg-violet-500",
    tag: "text-violet-400",
  },
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function RuntimePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSimulation(scenarioId: string) {
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/demo/runtime/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: scenarioId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? `Request failed (${res.status})`);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  const selectedScenario = SCENARIOS.find((s) => s.id === selected);
  const colors = selected ? COLOR_MAP[selectedScenario?.color ?? "blue"] : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm mr-2">
          ← Home
        </Link>
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-sm">
          R
        </div>
        <div>
          <h1 className="font-semibold text-white">AI Runtime Demo</h1>
          <p className="text-xs text-gray-400">Simulate AI traffic through Atlas Gateway — watch policy enforcement in action</p>
        </div>
      </header>

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">

        {/* Simulation Type Tabs */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Simulation Type</h2>
          <div className="grid grid-cols-3 gap-3">
            {/* Active */}
            <button className="bg-gray-800 border border-red-500 rounded-xl p-4 text-left">
              <div className="text-xl mb-2">🚦</div>
              <div className="font-medium text-white text-sm">Prompt Traffic</div>
              <div className="text-xs text-gray-400 mt-1">Fire real prompts through Atlas Gateway</div>
            </button>
            {/* Coming soon */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left opacity-50 cursor-not-allowed relative">
              <div className="text-xl mb-2">🔌</div>
              <div className="font-medium text-gray-400 text-sm">MCP Call Simulation</div>
              <div className="text-xs text-gray-600 mt-1">Simulate MCP server tool calls through Atlas</div>
              <span className="absolute top-3 right-3 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left opacity-50 cursor-not-allowed relative">
              <div className="text-xl mb-2">🤖</div>
              <div className="font-medium text-gray-400 text-sm">Multi-Agent Workflow</div>
              <div className="text-xs text-gray-600 mt-1">Trace agentic task chains through Atlas</div>
              <span className="absolute top-3 right-3 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>
            </div>
          </div>
        </div>

        {/* Scenario Picker */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Select a Customer Scenario</h2>
          <div className="grid grid-cols-3 gap-4">
            {SCENARIOS.map((s) => {
              const c = COLOR_MAP[s.color];
              const isSelected = selected === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelected(s.id); setResult(null); setError(null); }}
                  className={`bg-gray-800 border rounded-xl p-5 text-left transition-all hover:bg-gray-700 ${
                    isSelected ? c.border : "border-gray-700"
                  }`}
                >
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="font-semibold text-white text-sm mb-0.5">{s.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{s.subtitle}</div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${c.badge}`}>
                    {s.risk}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected scenario detail + run button */}
        {selectedScenario && colors && (
          <div className={`bg-gray-800 border ${colors.border} rounded-xl p-5 mb-6`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">
                  {selectedScenario.icon} {selectedScenario.name} — {selectedScenario.subtitle}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedScenario.description}</p>
              </div>
              <button
                onClick={() => runSimulation(selected!)}
                disabled={running}
                className={`shrink-0 px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-colors ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {running ? "Running…" : "Run Simulation →"}
              </button>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center text-gray-500 text-sm py-8">
            Select a scenario above to begin
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Simulation Results — {result.prompts_fired} prompts fired through Atlas Gateway
              </h2>
              <a
                href="https://prod.alltrue-be.com/ai-investigation"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                View in Atlas Runtime →
              </a>
            </div>

            {result.results.map((r, i) => (
              <div
                key={i}
                className={`bg-gray-800 border rounded-xl p-5 ${
                  r.status === "blocked"
                    ? "border-red-500/60"
                    : r.status === "error"
                    ? "border-yellow-500/60"
                    : "border-gray-700"
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.status === "blocked"
                        ? "bg-red-500/20 text-red-300 border border-red-500/40"
                        : r.status === "error"
                        ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40"
                        : "bg-green-500/20 text-green-300 border border-green-500/40"
                    }`}
                  >
                    {r.status === "blocked" ? "🛡 BLOCKED" : r.status === "error" ? "⚠ ERROR" : "✓ SENT"}
                  </span>
                  <span className="text-sm font-medium text-white">{r.label}</span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Prompt sent to Atlas Gateway</div>
                  <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 font-mono leading-relaxed">
                    {r.prompt}
                  </div>
                </div>

                {r.status === "blocked" && r.policy_triggered && (
                  <div className="bg-red-950/50 rounded-lg p-3">
                    <div className="text-xs text-red-400 font-semibold mb-0.5">Policy triggered</div>
                    <div className="text-xs text-red-300">{r.policy_triggered}</div>
                  </div>
                )}

                {r.status === "sent" && r.response && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">LLM response (passed through Gateway)</div>
                    <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">
                      {r.response}
                    </div>
                  </div>
                )}

                {r.status === "error" && r.error && (
                  <div className="text-xs text-yellow-400">{r.error}</div>
                )}
              </div>
            ))}

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-400">
              💡 {result.runtime_hint}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
