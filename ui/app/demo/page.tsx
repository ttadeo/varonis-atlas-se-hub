"use client";

import { useState } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExistingMatch {
  template_name: string;
  match_score: number;
  match_reason: string;
  rules_included: string[];
}

interface CustomRule {
  rule_type: string;
  reason: string;
}

interface CustomRecommendation {
  suggested_name: string;
  description: string;
  rules: CustomRule[];
}

interface DiscoverResult {
  existing_matches: ExistingMatch[];
  custom_recommendation: CustomRecommendation;
  recommendation: "existing" | "custom";
  recommendation_reason: string;
  use_case: string;
  industry: string;
  meeting_type: string;
}

interface ApplyResult {
  success: boolean;
  selection_type: string;
  demo_name: string;
  message: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Healthcare",
  "Financial Services",
  "Legal",
  "Retail & E-Commerce",
  "Technology",
  "Manufacturing",
  "Education",
  "Government & Public Sector",
  "Energy & Utilities",
  "Insurance",
  "Other",
];

const MEETING_TYPES = [
  "Discovery",
  "Technical Deep Dive",
  "POC",
  "RFP Response",
  "Executive Briefing",
];

// ─── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`text-sm font-semibold w-8 text-right ${
          score >= 75
            ? "text-green-400"
            : score >= 50
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type Step = "input" | "results" | "applied";

export default function DemoPage() {
  const [step, setStep] = useState<Step>("input");
  const [useCase, setUseCase] = useState("");
  const [industry, setIndustry] = useState("Healthcare");
  const [meetingType, setMeetingType] = useState("Discovery");

  const [discovering, setDiscovering] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoverResult | null>(null);

  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState<ApplyResult | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // ── Step 1: Discover ────────────────────────────────────────────────────────

  async function handleDiscover() {
    if (!useCase.trim() || discovering) return;
    setDiscovering(true);
    setDiscoverError(null);

    try {
      const res = await fetch("/api/demo/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_case: useCase,
          industry,
          meeting_type: meetingType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setResult(data);
      setStep("results");
    } catch (err) {
      setDiscoverError(String(err));
    } finally {
      setDiscovering(false);
    }
  }

  // ── Step 2: Apply ───────────────────────────────────────────────────────────

  async function handleApplyExisting(templateName: string) {
    await applyTemplate({
      selection_type: "existing",
      template_name: templateName,
    });
  }

  async function handleApplyCustom() {
    if (!result) return;
    await applyTemplate({
      selection_type: "custom",
      demo_name: result.custom_recommendation.suggested_name,
      description: result.custom_recommendation.description,
      rules: result.custom_recommendation.rules.map((r) => ({
        rule_type: r.rule_type,
      })),
    });
  }

  async function applyTemplate(payload: Record<string, unknown>) {
    setApplying(true);
    setApplyError(null);

    try {
      const res = await fetch("/api/demo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setApplied(data);
      setStep("applied");
    } catch (err) {
      setApplyError(String(err));
    } finally {
      setApplying(false);
    }
  }

  // ── Reset ───────────────────────────────────────────────────────────────────

  function reset() {
    setStep("input");
    setUseCase("");
    setIndustry("Healthcare");
    setMeetingType("Discovery");
    setResult(null);
    setApplied(null);
    setDiscoverError(null);
    setApplyError(null);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">
          ← Back
        </Link>
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
          D
        </div>
        <div>
          <h1 className="font-semibold text-white">Demo Provisioning</h1>
          <p className="text-xs text-gray-400">
            Describe the customer use case → get ranked Atlas templates → provision
          </p>
        </div>

        {/* Step indicator */}
        <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
          <span className={step === "input" ? "text-white font-medium" : ""}>
            1. Use Case
          </span>
          <span>›</span>
          <span className={step === "results" ? "text-white font-medium" : ""}>
            2. Template Match
          </span>
          <span>›</span>
          <span className={step === "applied" ? "text-white font-medium" : ""}>
            3. Provisioned
          </span>
          <button
            onClick={() => setHelpOpen(true)}
            className="ml-2 w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
            title="Help"
          >
            ?
          </button>
        </div>
      </header>
      <HelpPanel page="demo" open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">

          {/* ── Step 1: Input ─────────────────────────────────────────────── */}
          {step === "input" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">
                  Describe the Customer Use Case
                </h2>
                <p className="text-sm text-gray-400">
                  Be specific — the more detail you provide, the better Claude can
                  match to an Atlas template or build a custom one.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Use Case
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500"
                  placeholder="e.g. Healthcare company where nurses are using ChatGPT to summarize patient notes, creating HIPAA risk through PII leakage to external models..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meeting Type
                  </label>
                  <select
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                  >
                    {MEETING_TYPES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {discoverError && (
                <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                  {discoverError}
                </div>
              )}

              <button
                onClick={handleDiscover}
                disabled={discovering || !useCase.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
              >
                {discovering ? "Analyzing with Claude…" : "Find Matching Templates →"}
              </button>
            </div>
          )}

          {/* ── Step 2: Results ───────────────────────────────────────────── */}
          {step === "results" && result && (
            <div className="space-y-6">
              {/* Recommendation banner */}
              <div
                className={`rounded-xl px-5 py-4 border ${
                  result.recommendation === "existing"
                    ? "bg-green-900/30 border-green-700"
                    : "bg-blue-900/30 border-blue-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {result.recommendation === "existing" ? "✅" : "🔧"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {result.recommendation === "existing"
                        ? "Use an existing template"
                        : "Build a custom template"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      {result.recommendation_reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Existing templates */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Existing Templates
                </h3>
                <div className="space-y-3">
                  {result.existing_matches.map((m) => (
                    <div
                      key={m.template_name}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium text-white">{m.template_name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Rules: {m.rules_included.join(", ")}
                          </p>
                        </div>
                        {m.match_score >= 75 && (
                          <button
                            onClick={() => handleApplyExisting(m.template_name)}
                            disabled={applying}
                            className="shrink-0 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                          >
                            {applying ? "Applying…" : "Apply This"}
                          </button>
                        )}
                      </div>
                      <ScoreBar score={m.match_score} />
                      <p className="text-xs text-gray-400 mt-2">{m.match_reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom recommendation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Custom Recommendation
                </h3>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="mb-3">
                    <p className="font-medium text-white">
                      {result.custom_recommendation.suggested_name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {result.custom_recommendation.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {result.custom_recommendation.rules.map((r, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-gray-700/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs font-mono text-emerald-400 shrink-0 pt-0.5">
                          {r.rule_type}
                        </span>
                        <span className="text-xs text-gray-400">{r.reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        Custom template creation requires Atlas admin access. Use the rule list above to build this template in the Atlas UI under{" "}
                        <span className="text-gray-300">AI Runtime → Policies → New Template</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const rules = result.custom_recommendation.rules
                          .map((r) => r.rule_type)
                          .join(", ");
                        navigator.clipboard.writeText(
                          `Template: ${result.custom_recommendation.suggested_name}\n\nRules: ${rules}\n\nDescription: ${result.custom_recommendation.description}`
                        );
                      }}
                      className="shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {applyError && (
                <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                  {applyError}
                </div>
              )}

              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Start over
              </button>
            </div>
          )}

          {/* ── Step 3: Applied ───────────────────────────────────────────── */}
          {step === "applied" && applied && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">
                {applied.success ? "✅" : "❌"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {applied.success ? "Demo Environment Ready" : "Provisioning Failed"}
                </h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                  {applied.message}
                </p>
              </div>

              {applied.success && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-left max-w-md mx-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                    Template provisioned
                  </p>
                  <p className="font-medium text-white">{applied.demo_name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Type: {applied.selection_type === "existing" ? "Existing template applied" : "Custom template created & applied"}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={reset}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Provision Another
                </button>
                <Link
                  href="/meeting"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Go to Meeting Readiness →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
