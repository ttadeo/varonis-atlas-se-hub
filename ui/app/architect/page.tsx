"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

const MermaidDiagram = dynamic(() => import("@/components/MermaidDiagram"), { ssr: false });

// ─── Constants ────────────────────────────────────────────────────────────────

const INDUSTRY_OPTIONS = [
  "Financial Services",
  "Healthcare",
  "Manufacturing",
  "Retail / E-commerce",
  "Technology",
  "Government / Public Sector",
  "Energy / Utilities",
  "Legal",
  "Education",
  "Other",
];

const CONCERN_OPTIONS = [
  { id: "data_leakage", label: "Data Leakage / PII Exposure" },
  { id: "shadow_ai", label: "Shadow AI / Unsanctioned Models" },
  { id: "compliance", label: "Compliance & Audit (SOC2, HIPAA, GDPR)" },
  { id: "prompt_injection", label: "Prompt Injection Attacks" },
  { id: "model_risk", label: "Model Risk & Hallucination" },
  { id: "ip_exfiltration", label: "IP / Source Code Exfiltration" },
  { id: "vendor_risk", label: "Third-Party AI Vendor Risk" },
  { id: "ide_coding_agents", label: "IDE & Coding Agent Coverage (VS Code, Copilot, Cursor)" },
  { id: "proxy_gaps", label: "AI Proxy Coverage Gaps (personal accounts, Claude Desktop, browser-based AI)" },
  { id: "mcp_security", label: "MCP Server Security & Agent Tool Governance" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  audience: "internal" | "customer";
  industry: string;
  useCase: string;
  techStack: string;
  concerns: string[];
}

interface ArchitectResult {
  diagram: string;
  narrative: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArchitectPage() {
  const [form, setForm] = useState<FormState>({
    audience: "customer",
    industry: "",
    useCase: "",
    techStack: "",
    concerns: [],
  });

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<ArchitectResult | null>(null);
  const [originalResult, setOriginalResult] = useState<ArchitectResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // File attachment
  const [fileContext, setFileContext] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [extracting, setExtracting] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Chat refinement
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatting, setChatting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatThreadRef = useRef<HTMLDivElement>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function toggleConcern(id: string) {
    setForm((f) => ({
      ...f,
      concerns: f.concerns.includes(id)
        ? f.concerns.filter((c) => c !== id)
        : [...f.concerns, id],
    }));
  }

  const formReady = form.industry && form.useCase.trim() && form.techStack.trim();

  // ── File attachment ───────────────────────────────────────────────────────────

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) fileInputRef.current = e.target;
    e.target.value = "";
    if (!file) return;
    setExtracting(true);
    setFileError(null);
    setFileContext("");
    setFileName("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/extract-context", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Extraction failed");
      setFileContext(data.text);
      setFileName(data.filename);
    } catch (err) {
      setFileError(String(err));
    } finally {
      setExtracting(false);
    }
  }

  // ── Generate ─────────────────────────────────────────────────────────────────

  async function generate() {
    if (!formReady || generating) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    setOriginalResult(null);
    setChatMessages([]);
    setChatError(null);

    const concernLabels = CONCERN_OPTIONS
      .filter((c) => form.concerns.includes(c.id))
      .map((c) => c.label);

    try {
      const res = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: form.audience,
          industry: form.industry,
          useCase: form.useCase,
          techStack: form.techStack,
          concerns: concernLabels,
          fileContext: fileContext || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      if (!data.diagram || !data.narrative) throw new Error("Incomplete response from workflow");

      const arch = { diagram: data.diagram, narrative: data.narrative };
      setResult(arch);
      setOriginalResult(arch);
    } catch (err) {
      setError(String(err));
    } finally {
      setGenerating(false);
    }
  }

  // ── Chat refinement ───────────────────────────────────────────────────────────

  async function handleChat() {
    if (!chatInput.trim() || chatting || !result) return;
    const userMessage: ChatMessage = { role: "user", content: chatInput.trim() };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput("");
    setChatting(true);
    setChatError(null);
    try {
      const res = await fetch("/api/generate/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "architect",
          currentContent: result,
          formContext: {
            industry: form.industry,
            useCase: form.useCase,
            techStack: form.techStack,
            audience: form.audience,
          },
          messages: newMessages,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Chat failed");
      setResult({ diagram: data.diagram, narrative: data.narrative });
      setChatMessages([...newMessages, { role: "assistant", content: "Architecture updated." }]);
      setTimeout(() => {
        chatThreadRef.current?.scrollTo({ top: chatThreadRef.current.scrollHeight, behavior: "smooth" });
      }, 50);
    } catch (err) {
      setChatError(String(err));
    } finally {
      setChatting(false);
    }
  }

  // ── Export ───────────────────────────────────────────────────────────────────

  function handlePrint() {
    window.print();
  }

  function handlePopOut() {
    if (!result) return;
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Atlas Architecture — ${form.industry}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #030712; color: #f3f4f6; font-family: system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
    header { padding: 16px 24px; border-bottom: 1px solid #1f2937; display: flex; align-items: center; justify-content: space-between; }
    header h1 { font-size: 14px; font-weight: 600; color: #fff; }
    header p { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px; overflow: auto; }
    .diagram-wrap { width: 100%; max-width: 100%; overflow: auto; }
    .diagram-wrap svg { width: 100% !important; height: auto !important; }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>Atlas Reference Architecture</h1>
      <p>${form.industry}${form.useCase ? ` · ${form.useCase}` : ""}</p>
    </div>
    <div style="font-size:11px;color:#6b7280;">Atlas Learning Platform</div>
  </header>
  <main>
    <div class="diagram-wrap">
      <div class="mermaid">${result.diagram.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
  </main>
  <script>
    mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
  </script>
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
    // Revoke after a delay to allow the tab to load
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  function handleDownloadMd() {
    if (!result) return;
    const md = `# Atlas Reference Architecture\n\n**Industry:** ${form.industry}  \n**Use Case:** ${form.useCase}  \n**Tech Stack:** ${form.techStack}  \n**Audience:** ${form.audience === "customer" ? "Customer-Facing" : "Internal SE"}\n\n---\n\n## Architecture Diagram\n\n\`\`\`mermaid\n${result.diagram}\n\`\`\`\n\n---\n\n${result.narrative}`;
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `atlas-architecture-${form.industry.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 print:bg-white print:text-black">

      {/* Sidebar — form */}
      <div className="w-72 shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto print:hidden">
        <div className="border-b border-gray-800 px-4 py-4 flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back</Link>
          <button
            onClick={() => setHelpOpen(true)}
            className="ml-auto w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white text-xs font-bold transition-colors"
            title="Help"
          >?</button>
        </div>

        <div className="px-4 py-5 space-y-5 flex-1">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Architecture Builder</p>
            <p className="text-xs text-gray-400">Describe the customer environment and generate a full reference architecture with Atlas overlaid.</p>
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

          {/* Industry */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Industry</label>
            <select
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              className="w-full bg-gray-800 text-gray-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Select industry…</option>
              {INDUSTRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* AI Use Case */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">AI Use Case</label>
            <textarea
              rows={3}
              placeholder="e.g. LLM-powered clinical note summarizer using GPT-4o and LangChain"
              value={form.useCase}
              onChange={(e) => setForm((f) => ({ ...f, useCase: e.target.value }))}
              className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Existing Tech Stack</label>
            <textarea
              rows={2}
              placeholder="e.g. Azure, OpenAI API, LangChain, Epic EHR, Snowflake"
              value={form.techStack}
              onChange={(e) => setForm((f) => ({ ...f, techStack: e.target.value }))}
              className="w-full bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500"
            />
          </div>

          {/* File attachment */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Attach File <span className="text-gray-600">(optional)</span></label>
            <p className="text-xs text-gray-600 mb-2">PDF, Word, Excel, image, or text — content is included in the architecture prompt.</p>
            <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.csv,.md,.png,.jpg,.jpeg,.webp" onChange={handleFileSelect} />
            {!fileName && !extracting && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full text-xs border border-dashed border-gray-600 hover:border-gray-400 rounded-lg py-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                + Attach file
              </button>
            )}
            {extracting && (
              <div className="flex items-center gap-2 text-xs text-gray-400 py-2">
                <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                Extracting…
              </div>
            )}
            {fileName && !extracting && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-900/20 border border-blue-700/50 px-3 py-2">
                <span className="text-xs text-blue-300 flex-1 truncate">📄 {fileName}</span>
                <button onClick={() => { setFileContext(""); setFileName(""); setFileError(null); }} className="text-gray-500 hover:text-gray-300 text-xs shrink-0">✕</button>
              </div>
            )}
            {fileError && <p className="text-xs text-red-400 mt-1">{fileError}</p>}
          </div>

          {/* Concerns */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Key Concerns</label>
            <div className="space-y-1.5">
              {CONCERN_OPTIONS.map((c) => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.concerns.includes(c.id)}
                    onChange={() => toggleConcern(c.id)}
                    className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-600"
                  />
                  <span className="text-xs text-gray-300 group-hover:text-white transition-colors">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!formReady || generating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          >
            {generating ? "Generating…" : "Generate Architecture"}
          </button>

          {error && (
            <p className="text-xs text-red-400 rounded-lg bg-red-900/20 border border-red-800 p-3">{error}</p>
          )}
        </div>
      </div>

      <HelpPanel page="architect" open={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Main — results + chat */}
      <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">

        {/* Export toolbar */}
        {result && (
          <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-6 py-3 flex items-center justify-between print:hidden">
            <div>
              <p className="text-sm font-medium text-white">Reference Architecture</p>
              <p className="text-xs text-gray-400">{form.industry} · {form.audience === "customer" ? "Customer-Facing" : "Internal SE"}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePopOut}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                ↗ Full Screen
              </button>
              <button
                onClick={handleDownloadMd}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
              >
                Download .md
              </button>
              <button
                onClick={handlePrint}
                className="text-xs px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-600 text-white transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !generating && (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <div className="text-5xl mb-4">🏗️</div>
              <p className="text-lg font-medium text-gray-300">Atlas Architecture Builder</p>
              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Fill in the customer environment on the left to generate a full reference architecture diagram with Atlas overlaid.
              </p>
            </div>
          </div>
        )}

        {/* Generating spinner */}
        {generating && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-gray-400">Building your architecture…</p>
              <p className="text-xs text-gray-600 mt-1">This takes 20–40 seconds</p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !generating && (
          <div ref={printRef} className="px-8 py-6 max-w-4xl mx-auto space-y-8 print:px-0 print:py-0">

            {/* Print header */}
            <div className="hidden print:block mb-4">
              <h1 className="text-2xl font-bold text-black">Atlas Reference Architecture</h1>
              <p className="text-sm text-gray-600 mt-1">{form.industry}</p>
              <div className="mt-2 text-xs text-gray-500 space-y-0.5">
                <p><span className="font-semibold text-gray-700">Use Case:</span> {form.useCase}</p>
                <p><span className="font-semibold text-gray-700">Tech Stack:</span> {form.techStack}</p>
                <p><span className="font-semibold text-gray-700">Audience:</span> {form.audience === "customer" ? "Customer-Facing" : "Internal SE"}</p>
              </div>
              <hr className="mt-3 border-gray-300" />
            </div>

            {/* Diagram */}
            <section className="print:break-inside-avoid print-diagram-section">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 print:text-black print:break-after-avoid">
                Architecture Diagram
              </h2>
              <div className="print:break-before-avoid">
                <MermaidDiagram code={result.diagram} />
              </div>
            </section>

            {/* Narrative */}
            <section>
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 print:text-black">
                Architecture Narrative
              </h2>
              <div className="prose prose-invert prose-sm max-w-none print:prose-slate">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => <h2 className="text-base font-semibold mt-6 mb-2 text-white border-b border-gray-700 pb-1 print:text-black print:border-gray-300">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold mt-4 mb-1 text-gray-200 print:text-black">{children}</h3>,
                    p: ({ children }) => <p className="mb-3 text-gray-300 leading-relaxed print:text-black">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-3 space-y-1 text-gray-300 print:text-black">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-3 space-y-1 text-gray-300 print:text-black">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300 print:text-black">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-white print:text-black">{children}</strong>,
                    code: ({ children }) => <code className="bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono text-blue-300 print:bg-gray-100 print:text-blue-800">{children}</code>,
                    table: ({ children }) => <table className="w-full text-sm border-collapse my-3">{children}</table>,
                    th: ({ children }) => <th className="border border-gray-600 px-3 py-2 bg-gray-800 text-left text-xs font-semibold text-gray-300 print:border-gray-300 print:bg-gray-100 print:text-black">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-700 px-3 py-2 text-xs text-gray-300 print:border-gray-300 print:text-black">{children}</td>,
                  }}
                >
                  {result.narrative}
                </ReactMarkdown>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* Chat refinement bar — only visible when an architecture has been generated */}
      {result && !generating && (
        <div className="shrink-0 border-t border-gray-800 bg-gray-900/98 print:hidden">
          {/* Conversation thread */}
          {chatMessages.length > 0 && (
            <div
              ref={chatThreadRef}
              className="max-h-44 overflow-y-auto px-6 py-3 space-y-2 border-b border-gray-800"
            >
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-xs rounded-lg px-3 py-2 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-900/40 text-blue-200 ml-auto text-right"
                      : "bg-gray-800 text-gray-400"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {chatting && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Revising architecture…
                </div>
              )}
            </div>
          )}

          {/* Input row */}
          <div className="px-6 py-3 flex gap-2 items-center">
            {originalResult && (originalResult.diagram !== result.diagram || originalResult.narrative !== result.narrative) && (
              <button
                onClick={() => { setResult(originalResult); setChatMessages([]); setChatError(null); }}
                className="text-xs text-gray-500 hover:text-gray-300 shrink-0 transition-colors"
                title="Undo all chat changes"
              >
                Reset
              </button>
            )}
            <input
              type="text"
              placeholder="Ask Claude to refine this architecture… (Enter to send)"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChat(); } }}
              disabled={chatting}
              className="flex-1 bg-gray-800 text-sm text-gray-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-gray-500 disabled:opacity-50"
            />
            <button
              onClick={handleChat}
              disabled={!chatInput.trim() || chatting}
              className="text-xs px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white shrink-0 transition-colors"
            >
              {chatting ? "Updating…" : "Send"}
            </button>
          </div>
          {chatError && (
            <p className="text-xs text-red-400 px-6 pb-3">{chatError}</p>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
