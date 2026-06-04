"use client";

import { useState } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type SimType = "prompt" | "mcp";

interface PromptResult {
  simulation_type: "prompt";
  label: string;
  prompt: string;
  status: "sent" | "blocked" | "error";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

interface McpResult {
  simulation_type: "mcp";
  label: string;
  tool_name: string;
  tool_args: Record<string, unknown>;
  tool_result_preview: string;
  user_ask: string;
  risk_type: string;
  status: "sent" | "blocked" | "error";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

type AnyResult = PromptResult | McpResult;

interface SimResult {
  scenario_id: string;
  simulation_type: string;
  gateway_endpoint: string;
  prompts_fired: number;
  results: AnyResult[];
  runtime_hint: string;
}

// ─── Scenario Definitions ─────────────────────────────────────────────────────

const PROMPT_SCENARIOS = [
  {
    id: "healthcare",
    name: "Healthcare",
    subtitle: "Clinical Note Summarizer",
    icon: "🏥",
    description: "LangChain + GPT-4o summarizes patient records. Prompts contain SSNs, MRNs, and PHI — designed to trigger PII guardrails.",
    risk: "PII / PHI Exposure",
    color: "blue",
  },
  {
    id: "finance",
    name: "Financial Services",
    subtitle: "AI Risk Analyzer",
    icon: "📈",
    description: "Claude 3 analyzes market risk using client account data. Prompts include account numbers, SSNs, and unreleased earnings.",
    risk: "Data Leakage / Insider Risk",
    color: "emerald",
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    subtitle: "Recommendation Engine",
    icon: "🛒",
    description: "Azure OpenAI powers product recommendations. Prompts include a prompt injection attack and behavioral data exfiltration.",
    risk: "Prompt Injection / Data Exfiltration",
    color: "violet",
  },
];

const MCP_SCENARIOS = [
  {
    id: "mcp_healthcare",
    name: "Healthcare EHR Agent",
    subtitle: "MCP + EHR Integration",
    icon: "🏥",
    description:
      "AI agent calls read_patient_record and search_appointments MCP tools. PHI is returned in the tool result and injected into LLM context — Atlas intercepts at the tool result layer.",
    risk: "PHI in MCP tool result",
    color: "blue",
    tools: ["read_patient_record", "search_appointments"],
  },
  {
    id: "mcp_devcopilot",
    name: "Developer Copilot",
    subtitle: "MCP + Filesystem / Database",
    icon: "💻",
    description:
      "AI coding assistant calls read_file and execute_query MCP tools. Returns production credentials and bulk PII from a live database query.",
    risk: "Credential / PII exposure via MCP",
    color: "emerald",
    tools: ["read_file", "execute_query"],
  },
  {
    id: "mcp_crmagent",
    name: "CRM Sales Agent",
    subtitle: "MCP + CRM Integration",
    icon: "👥",
    description:
      "AI sales assistant calls search_customers and get_user_history MCP tools. Returns M&A-sensitive account data and behavioral profiling information.",
    risk: "M&A data / behavioral profiling via MCP",
    color: "violet",
    tools: ["search_customers", "get_user_history"],
  },
];

const COLOR_MAP: Record<string, { border: string; badge: string; button: string }> = {
  blue:    { border: "border-blue-500",    badge: "bg-blue-500/10 text-blue-300 border border-blue-500/30",       button: "bg-blue-600 hover:bg-blue-500" },
  emerald: { border: "border-emerald-500", badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30", button: "bg-emerald-600 hover:bg-emerald-500" },
  violet:  { border: "border-violet-500",  badge: "bg-violet-500/10 text-violet-300 border border-violet-500/30",   button: "bg-violet-600 hover:bg-violet-500" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "sent" | "blocked" | "error" }) {
  if (status === "blocked") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
      🛡 BLOCKED
    </span>
  );
  if (status === "error") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
      ⚠ ERROR
    </span>
  );
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
      ✓ SENT
    </span>
  );
}

function PromptResultCard({ r }: { r: PromptResult }) {
  return (
    <div className={`bg-gray-800 border rounded-xl p-5 ${r.status === "blocked" ? "border-red-500/60" : r.status === "error" ? "border-yellow-500/60" : "border-gray-700"}`}>
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={r.status} />
        <span className="text-sm font-medium text-white">{r.label}</span>
      </div>
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Prompt sent to Atlas Gateway</div>
        <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 font-mono leading-relaxed">{r.prompt}</div>
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
          <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">{r.response}</div>
        </div>
      )}
      {r.status === "error" && r.error && (
        <div className="text-xs text-yellow-400">{r.error}</div>
      )}
    </div>
  );
}

function McpResultCard({ r }: { r: McpResult }) {
  return (
    <div className={`bg-gray-800 border rounded-xl overflow-hidden ${r.status === "blocked" ? "border-red-500/60" : r.status === "error" ? "border-yellow-500/60" : "border-gray-700"}`}>

      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-700/50">
        <StatusBadge status={r.status} />
        <span className="text-sm font-medium text-white">{r.label}</span>
      </div>

      {/* MCP Tool Chain */}
      <div className="px-5 py-4 space-y-3">

        {/* Step 1 — User request */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 shrink-0">1</div>
            <div className="w-px flex-1 bg-gray-700 mt-1" />
          </div>
          <div className="flex-1 pb-3">
            <div className="text-xs text-gray-500 mb-1">User request to AI agent</div>
            <div className="bg-gray-900 rounded-lg px-3 py-2 text-xs text-gray-300 italic">"{r.user_ask}"</div>
          </div>
        </div>

        {/* Step 2 — MCP tool call */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 shrink-0">2</div>
            <div className="w-px flex-1 bg-gray-700 mt-1" />
          </div>
          <div className="flex-1 pb-3">
            <div className="text-xs text-gray-500 mb-1">Agent calls MCP tool</div>
            <div className="bg-gray-900 rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-amber-400">{r.tool_name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({Object.entries(r.tool_args).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")})
              </span>
            </div>
          </div>
        </div>

        {/* Step 3 — Tool result (where Atlas fires) */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${r.status === "blocked" ? "bg-red-700 text-red-200" : "bg-gray-700 text-gray-400"}`}>3</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              MCP tool result injected into LLM context
              {r.status === "blocked" && (
                <span className="text-red-400 font-semibold">← Atlas intercepts here</span>
              )}
            </div>
            <div className={`rounded-lg px-3 py-2 text-xs font-mono leading-relaxed ${r.status === "blocked" ? "bg-red-950/40 text-red-300" : "bg-gray-900 text-gray-300"}`}>
              {r.tool_result_preview}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Risk: <span className="text-amber-500">{r.risk_type}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Result footer */}
      {r.status === "blocked" && r.policy_triggered && (
        <div className="mx-5 mb-4 bg-red-950/50 rounded-lg p-3">
          <div className="text-xs text-red-400 font-semibold mb-0.5">Atlas policy triggered</div>
          <div className="text-xs text-red-300">{r.policy_triggered}</div>
        </div>
      )}
      {r.status === "sent" && r.response && (
        <div className="mx-5 mb-4">
          <div className="text-xs text-gray-500 mb-1">LLM response (tool result passed through Gateway)</div>
          <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">{r.response}</div>
        </div>
      )}
      {r.status === "error" && r.error && (
        <div className="mx-5 mb-4 text-xs text-yellow-400">{r.error}</div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RuntimePage() {
  const [simType, setSimType] = useState<SimType>("prompt");
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const scenarios = simType === "mcp" ? MCP_SCENARIOS : PROMPT_SCENARIOS;
  const selectedScenario = scenarios.find((s) => s.id === selected);
  const colors = selectedScenario ? COLOR_MAP[selectedScenario.color] : null;

  function switchSimType(t: SimType) {
    setSimType(t);
    setSelected(null);
    setResult(null);
    setError(null);
  }

  async function runSimulation() {
    if (!selected || running) return;
    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/demo/runtime/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: selected, simulation_type: simType }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? `Request failed (${res.status})`);
      else setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm mr-2">← Home</Link>
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-sm">R</div>
        <div>
          <h1 className="font-semibold text-white">AI Runtime Demo</h1>
          <p className="text-xs text-gray-400">Simulate AI traffic through Atlas Gateway — watch policy enforcement in action</p>
        </div>
        <button
          onClick={() => setHelpOpen(true)}
          className="ml-auto w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white text-xs font-bold transition-colors"
          title="Help"
        >?</button>
      </header>
      <HelpPanel page="runtime" open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">

        {/* Simulation Type */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Simulation Type</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => switchSimType("prompt")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "prompt" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">🚦</div>
              <div className={`font-medium text-sm ${simType === "prompt" ? "text-white" : "text-gray-400"}`}>Prompt Traffic</div>
              <div className="text-xs text-gray-500 mt-1">Fire real prompts through Atlas Gateway</div>
            </button>

            <button
              onClick={() => switchSimType("mcp")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "mcp" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">🔌</div>
              <div className={`font-medium text-sm ${simType === "mcp" ? "text-white" : "text-gray-400"}`}>MCP Call Simulation</div>
              <div className="text-xs text-gray-500 mt-1">Simulate MCP tool call chains through Atlas</div>
            </button>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left opacity-50 cursor-not-allowed relative">
              <div className="text-xl mb-2">🤖</div>
              <div className="font-medium text-gray-400 text-sm">Multi-Agent Workflow</div>
              <div className="text-xs text-gray-600 mt-1">Trace agentic task chains through Atlas</div>
              <span className="absolute top-3 right-3 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Soon</span>
            </div>
          </div>

          {/* MCP explainer */}
          {simType === "mcp" && (
            <div className="mt-3 bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3 text-xs text-amber-300/80 leading-relaxed">
              <span className="font-semibold text-amber-300">How MCP simulation works: </span>
              Each scenario fires a realistic MCP tool call chain through Atlas Gateway — user request → agent calls MCP tool → tool returns sensitive data → Atlas intercepts at the tool result layer.
              This demonstrates how Atlas catches threats that originate <span className="italic">inside</span> the agent context, not just in user prompts.
            </div>
          )}
        </div>

        {/* Scenario Picker */}
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {simType === "mcp" ? "Select an MCP Agent Scenario" : "Select a Customer Scenario"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {scenarios.map((s) => {
              const c = COLOR_MAP[s.color];
              const isSelected = selected === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelected(s.id); setResult(null); setError(null); }}
                  className={`bg-gray-800 border rounded-xl p-5 text-left transition-all hover:bg-gray-700 ${isSelected ? c.border : "border-gray-700"}`}
                >
                  <div className="text-2xl mb-3">{s.icon}</div>
                  <div className="font-semibold text-white text-sm mb-0.5">{s.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{s.subtitle}</div>
                  {"tools" in s && Array.isArray(s.tools) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(s.tools as string[]).map((t) => (
                        <span key={t} className="text-xs font-mono bg-gray-700 text-amber-400 px-1.5 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${c.badge}`}>{s.risk}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected scenario detail + run */}
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
                onClick={runSimulation}
                disabled={running}
                className={`shrink-0 px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-colors ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {running ? "Running…" : simType === "mcp" ? "Run MCP Simulation →" : "Run Simulation →"}
              </button>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center text-gray-500 text-sm py-8">Select a scenario above to begin</div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">{error}</div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {result.simulation_type === "mcp"
                  ? `MCP Simulation Results — ${result.prompts_fired} tool call chains fired`
                  : `Simulation Results — ${result.prompts_fired} prompts fired through Atlas Gateway`}
              </h2>
              <a
                href="https://prod.alltrue-be.com/ai-monitor?organization=985dfc2e-2cfd-4b4a-9c8a-6a98ec1efbdb&project=68869c92-9502-432c-8508-713264a919c7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                View in Atlas Runtime →
              </a>
            </div>

            {result.results.map((r, i) =>
              r.simulation_type === "mcp"
                ? <McpResultCard key={i} r={r as McpResult} />
                : <PromptResultCard key={i} r={r as PromptResult} />
            )}

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-400">
              💡 {result.runtime_hint}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
