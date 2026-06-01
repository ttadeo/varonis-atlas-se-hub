"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Constants ────────────────────────────────────────────────────────────────

const GUIDE_TYPES = [
  {
    id: "mcp_integration",
    label: "MCP Integration Guide",
    description: "How Atlas integrates with Model Context Protocol for a customer's use case",
    defaultTopic: "Atlas MCP integration for secure AI agent workflows",
  },
  {
    id: "gateway_deployment",
    label: "AI Gateway Deployment Guide",
    description: "Step-by-step Atlas Gateway configuration and policy setup",
    defaultTopic: "Atlas AI Gateway deployment and policy configuration",
  },
  {
    id: "compliance_audit",
    label: "Compliance & Audit Readiness",
    description: "How Atlas addresses regulatory requirements (HIPAA, SOC2, GDPR, etc.)",
    defaultTopic: "Atlas compliance controls and audit trail capabilities",
  },
  {
    id: "problem_solution",
    label: "Problem → Solution Write-Up",
    description: "Document a successful customer engagement — the problem, how Atlas solved it",
    defaultTopic: "",
  },
  {
    id: "custom",
    label: "Custom Topic",
    description: "Freeform — describe any Atlas topic or customer scenario",
    defaultTopic: "",
  },
];

const INDUSTRY_OPTIONS = [
  "Financial Services", "Healthcare", "Manufacturing", "Retail / E-commerce",
  "Technology", "Government / Public Sector", "Energy / Utilities", "Legal", "Education", "Other",
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  guideType: string;
  audience: "internal" | "customer";
  topic: string;
  industry: string;
  techStack: string;
  customerContext: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuidesPage() {
  const [form, setForm] = useState<FormState>({
    guideType: "",
    audience: "customer",
    topic: "",
    industry: "",
    techStack: "",
    customerContext: "",
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function selectGuideType(id: string) {
    const gt = GUIDE_TYPES.find((g) => g.id === id);
    setForm((f) => ({
      ...f,
      guideType: id,
      topic: gt?.defaultTopic ?? f.topic,
    }));
  }

  const formReady = form.guideType && form.topic.trim();

  // ── Generate ─────────────────────────────────────────────────────────────────

  async function generate() {
    if (!formReady || generating) return;
    setGenerating(true);
    setError(null);
    setResult(null);

    const selectedType = GUIDE_TYPES.find((g) => g.id === form.guideType);

    try {
      const res = await fetch("/api/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideType: selectedType?.label ?? form.guideType,
          audience: form.audience,
          topic: form.topic,
          industry: form.industry,
          techStack: form.techStack,
          customerContext: form.customerContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      if (!data.guide) throw new Error("Incomplete response from workflow");

      setResult(data.guide);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenerating(false);
    }
  }

  // ── Export ───────────────────────────────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  function handleDownloadMd() {
    if (!result) return;
    const selectedType = GUIDE_TYPES.find((g) => g.id === form.guideType);
    const header = `# ${selectedType?.label ?? "Atlas Technical Guide"}\n\n**Topic:** ${form.topic}  \n${form.industry ? `**Industry:** ${form.industry}  \n` : ""}${form.techStack ? `**Tech Stack:** ${form.techStack}  \n` : ""}**Audience:** ${form.audience === "customer" ? "Customer-Facing" : "Internal SE"}\n\n---\n\n`;
    const blob = new Blob([header + result], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-guide-${form.guideType}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 print:bg-white print:text-black">

      {/* Sidebar */}
      <div className="w-72 shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto print:hidden">
        <div className="border-b border-gray-800 px-4 py-4 flex items-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back</Link>
          <button
            onClick={() => setHelpOpen(true)}
            className="ml-auto w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white text-xs font-bold transition-colors"
            title="Help"
          >?</button>
        </div>
        <HelpPanel page="guides" open={helpOpen} onClose={() => setHelpOpen(false)} />

        <div className="px-4 py-5 space-y-5 flex-1">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Technical Guide Producer</p>
            <p className="text-xs text-gray-400">Generate a polished Atlas technical guide tailored to a customer or use case.</p>
          </div>

          {/* Guide type picker */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Guide Type</label>
            <div className="space-y-2">
              {GUIDE_TYPES.map((gt) => (
                <button
                  key={gt.id}
                  onClick={() => selectGuideType(gt.id)}
                  className={`w-full text-left rounded-lg p-3 border transition-all ${
                    form.guideType === gt.id
                      ? "border-blue-600 bg-blue-900/20"
                      : "border-gray-700 bg-gray-800/50 hover:border-gray-600"
                  }`}
                >
                  <p className={`text-xs font-medium ${form.guideType === gt.id ? "text-blue-300" : "text-gray-200"}`}>{gt.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{gt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Audience toggle */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Audience</label>
            <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs">
              {(["customer", "internal"] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setForm((f) => ({ ...f, audience: a }))}
                  className={`flex-1 py-2 transition-colors ${
                    form.audience === a
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  {a === "customer" ? "Customer-Facing" : "Internal SE"}
                </button>
              ))}
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Topic / Focus</label>
            <textarea
              rows={3}
              placeholder="Describe what this guide should cover…"
              value={form.topic}
              onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
              className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Industry <span className="text-gray-600">(optional)</span></label>
            <select
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Any industry</option>
              {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tech Stack <span className="text-gray-600">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Azure, OpenAI, LangChain"
              value={form.techStack}
              onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
              className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
            />
          </div>

          {/* Customer context / notes */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Additional Context <span className="text-gray-600">(optional)</span></label>
            <textarea
              rows={3}
              placeholder="Paste call notes, problem statement, customer quotes…"
              value={form.customerContext}
              onChange={(e) => setForm((f) => ({ ...f, customerContext: e.target.value }))}
              className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
            />
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={!formReady || generating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          >
            {generating ? "Generating…" : "Generate Guide"}
          </button>

          {error && (
            <p className="text-xs text-red-400 rounded-lg bg-red-900/20 border border-red-800 p-3">{error}</p>
          )}
        </div>
      </div>

      {/* Main — result */}
      <div className="flex-1 overflow-y-auto">

        {/* Export toolbar */}
        {result && (
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-6 py-3 flex items-center justify-between print:hidden">
            <div>
              <p className="text-sm font-medium text-white">
                {GUIDE_TYPES.find((g) => g.id === form.guideType)?.label ?? "Technical Guide"}
              </p>
              <p className="text-xs text-gray-400">
                {form.audience === "customer" ? "Customer-Facing" : "Internal SE"}{form.industry ? ` · ${form.industry}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleDownloadMd} className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors">
                Download .md
              </button>
              <button onClick={handlePrint} className="text-xs px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors">
                Export PDF
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !generating && (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <div className="text-5xl mb-4">📋</div>
              <p className="text-lg font-medium text-gray-300">Technical Guide Producer</p>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Select a guide type and fill in the details on the left to generate a polished Atlas technical document.
              </p>
            </div>
          </div>
        )}

        {/* Spinner */}
        {generating && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Writing your guide…</p>
              <p className="text-xs text-gray-600 mt-1">This takes 20–40 seconds</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !generating && (
          <div className="px-8 py-6 max-w-4xl mx-auto print:px-0 print:py-0">
            {/* Print header */}
            <div className="hidden print:block mb-6">
              <h1 className="text-2xl font-bold text-black">
                {GUIDE_TYPES.find((g) => g.id === form.guideType)?.label ?? "Atlas Technical Guide"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">{form.topic}{form.industry ? ` · ${form.industry}` : ""}</p>
            </div>

            <div className="prose prose-invert prose-sm max-w-none print:prose-slate">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-xl font-bold mt-0 mb-4 text-white print:text-black">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-base font-semibold mt-8 mb-3 text-white border-b border-gray-700 pb-1 print:text-black print:border-gray-300">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-sm font-semibold mt-5 mb-2 text-gray-200 print:text-black">{children}</h3>,
                  p: ({ children }) => <p className="mb-3 text-gray-300 leading-relaxed print:text-black">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 text-gray-300 print:text-black">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 text-gray-300 print:text-black">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-300 leading-relaxed print:text-black">{children}</li>,
                  strong: ({ children }) => <strong className="font-semibold text-white print:text-black">{children}</strong>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-600 pl-4 italic text-gray-400 my-3 print:text-gray-600">{children}</blockquote>,
                  code: ({ children }) => <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono text-blue-300 print:bg-gray-100 print:text-blue-800">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-800 rounded-lg p-4 my-3 overflow-x-auto text-xs font-mono print:bg-gray-100">{children}</pre>,
                  table: ({ children }) => <table className="w-full text-sm border-collapse my-4">{children}</table>,
                  th: ({ children }) => <th className="border border-gray-600 px-3 py-2 bg-gray-800 text-left text-xs font-semibold text-gray-300 print:border-gray-300 print:bg-gray-100 print:text-black">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-700 px-3 py-2 text-xs text-gray-300 print:border-gray-300 print:text-black">{children}</td>,
                  hr: () => <hr className="border-gray-700 my-6 print:border-gray-300" />,
                }}
              >
                {result}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
