"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ── Stack options ─────────────────────────────────────────────────────────────

const CLOUD_PROVIDERS = ["AWS", "Azure", "Google Cloud", "Databricks", "Snowflake"];

const LLM_PROVIDERS = [
  "OpenAI", "Azure OpenAI", "AWS Bedrock", "Google Gemini",
  "Anthropic Claude", "IBM WatsonX", "LiteLLM Proxy", "Custom LLM Endpoint",
];

const CODING_AGENTS = [
  "Claude Code", "GitHub Copilot", "Devin CLI", "Devin Desktop",
  "VS Code", "Cursor", "OpenAI Codex", "Kiro CLI",
];

const SECURITY_TOOLS = [
  "Cloudflare", "Netskope", "Kong Konnect", "Island Browser",
];

const USE_CASES = ["POC", "Production Deployment", "Compliance Audit", "Security Assessment"];

const POLL_INTERVAL = 3000;
const MAX_WAIT_MS   = 600_000; // 10 min

// ── Multi-select chip component ───────────────────────────────────────────────

function ChipSelect({
  label, options, selected, onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                active
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Single-select chip ────────────────────────────────────────────────────────

function SingleSelect({
  label, options, selected, onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt === selected ? "" : opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              selected === opt
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PlaybookPage() {
  const [cloudProvider,   setCloudProvider]   = useState("");
  const [llmProviders,    setLlmProviders]    = useState<string[]>([]);
  const [codingAgents,    setCodingAgents]    = useState<string[]>([]);
  const [securityTools,   setSecurityTools]   = useState<string[]>([]);
  const [useCase,         setUseCase]         = useState("POC");
  const [customerContext, setCustomerContext] = useState("");

  const [loading,   setLoading]   = useState(false);
  const [jobId,     setJobId]     = useState<string | null>(null);
  const [playbook,  setPlaybook]  = useState<string | null>(null);
  const [elapsed,   setElapsed]   = useState(0);
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);

  // Chat state
  const [chatMessages,  setChatMessages]  = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [chatInput,     setChatInput]     = useState("");
  const [chatLoading,   setChatLoading]   = useState(false);
  const [attachedFile,  setAttachedFile]  = useState<{ name: string; file: File } | null>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const chatBottomRef  = useRef<HTMLDivElement>(null);

  const pollRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef<number>(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current)   clearInterval(pollRef.current);
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, []);

  function toggleMulti(setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) {
    setter((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  }

  const hasSelection =
    cloudProvider || llmProviders.length > 0 || codingAgents.length > 0 || securityTools.length > 0;

  function startElapsedTimer() {
    startedRef.current = Date.now();
    setElapsed(0);
    elapsedRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedRef.current) / 1000));
    }, 1000);
  }

  function stopTimers() {
    if (pollRef.current)    clearInterval(pollRef.current);
    if (elapsedRef.current) clearInterval(elapsedRef.current);
    pollRef.current    = null;
    elapsedRef.current = null;
  }

  async function pollStatus(jid: string) {
    if (Date.now() - startedRef.current > MAX_WAIT_MS) {
      stopTimers();
      setLoading(false);
      setError("Playbook generation timed out. Please try again.");
      return;
    }

    try {
      const res  = await fetch(`/api/playbook/status?jobId=${jid}`);
      const data = await res.json();
      if (data.status === "done" && data.playbook) {
        stopTimers();
        setPlaybook(data.playbook);
        setLoading(false);
      }
    } catch {
      // Non-fatal — keep polling
    }
  }

  async function generate() {
    if (!hasSelection || loading) return;
    setLoading(true);
    setPlaybook(null);
    setError(null);
    setJobId(null);

    try {
      const res = await fetch("/api/playbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cloudProvider,
          llmProviders,
          codingAgents,
          securityTools,
          useCase,
          customerContext,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);

      setJobId(data.jobId);
      startElapsedTimer();
      pollRef.current = setInterval(() => pollStatus(data.jobId), POLL_INTERVAL);
    } catch (err) {
      setLoading(false);
      setError(String(err));
    }
  }

  function reset() {
    stopTimers();
    setPlaybook(null);
    setJobId(null);
    setError(null);
    setLoading(false);
    setElapsed(0);
    setChatMessages([]);
    setChatInput("");
    setAttachedFile(null);
  }

  const sendChat = useCallback(async () => {
    if (!chatInput.trim() || !playbook || chatLoading) return;

    const userMsg = { role: "user" as const, content: chatInput.trim() };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      let res: Response;

      if (attachedFile) {
        const fd = new FormData();
        fd.append("question", userMsg.content);
        fd.append("playbook", playbook);
        fd.append("history", JSON.stringify(chatMessages));
        fd.append("file", attachedFile.file);
        setAttachedFile(null);
        res = await fetch("/api/playbook/chat", { method: "POST", body: fd });
      } else {
        res = await fetch("/api/playbook/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMsg.content, playbook, history: chatMessages }),
        });
      }

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${String(err)}` },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, playbook, chatLoading, chatMessages, attachedFile]);

  // Scroll to bottom when new chat messages arrive
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function copyPlaybook() {
    if (!playbook) return;
    navigator.clipboard.writeText(playbook).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // Count selected components
  const selectedCount = [
    cloudProvider ? 1 : 0,
    llmProviders.length,
    codingAgents.length,
    securityTools.length,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">← Back</Link>
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-bold">📋</div>
        <div>
          <h1 className="font-semibold text-white">Integration Playbook</h1>
          <p className="text-xs text-gray-400">Step-by-step Atlas integration guide for your customer's stack</p>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* ── Left panel — stack selector ─────────────────────────────────── */}
        <div className="w-80 shrink-0 border-r border-gray-800 flex flex-col overflow-y-auto">
          <div className="px-5 py-5 space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-200 mb-1">Customer Stack</p>
              <p className="text-xs text-gray-500">Select the components in the customer's environment. Atlas integration steps will be generated for each.</p>
            </div>

            <SingleSelect
              label="Cloud Provider"
              options={CLOUD_PROVIDERS}
              selected={cloudProvider}
              onSelect={setCloudProvider}
            />

            <ChipSelect
              label="LLM Providers"
              options={LLM_PROVIDERS}
              selected={llmProviders}
              onToggle={(v) => toggleMulti(setLlmProviders, v)}
            />

            <ChipSelect
              label="Coding Agents"
              options={CODING_AGENTS}
              selected={codingAgents}
              onToggle={(v) => toggleMulti(setCodingAgents, v)}
            />

            <ChipSelect
              label="Security Integrations"
              options={SECURITY_TOOLS}
              selected={securityTools}
              onToggle={(v) => toggleMulti(setSecurityTools, v)}
            />

            <SingleSelect
              label="Use Case"
              options={USE_CASES}
              selected={useCase}
              onSelect={(v) => setUseCase(v || "POC")}
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Additional Context <span className="text-gray-600 normal-case font-normal">(optional)</span>
              </label>
              <textarea
                className="w-full bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-600"
                rows={3}
                placeholder="e.g. Financial services, strict data residency requirements, 500 developers..."
                value={customerContext}
                onChange={(e) => setCustomerContext(e.target.value)}
              />
            </div>

            {/* Generate button */}
            <button
              onClick={playbook ? reset : generate}
              disabled={loading || (!hasSelection && !playbook)}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                playbook
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {playbook
                ? "← New Playbook"
                : loading
                ? `Generating… (${elapsed}s)`
                : `Generate Playbook${selectedCount > 0 ? ` (${selectedCount} component${selectedCount !== 1 ? "s" : ""})` : ""}`}
            </button>

            {!hasSelection && !playbook && (
              <p className="text-xs text-gray-600 text-center">Select at least one component to generate a playbook.</p>
            )}
          </div>
        </div>

        {/* ── Right panel — playbook output ───────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Empty state */}
          {!loading && !playbook && !error && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
              <div className="text-5xl">📋</div>
              <div>
                <p className="text-lg font-medium text-gray-300">Integration Playbook Generator</p>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Select the customer's cloud provider, LLM providers, coding agents, and security tools on the left.
                  Atlas will generate a step-by-step integration playbook grounded in real documentation.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-2 text-left max-w-lg w-full">
                {[
                  { icon: "☁️", label: "Cloud", desc: "AWS, Azure, GCP, Databricks" },
                  { icon: "🤖", label: "LLM Providers", desc: "OpenAI, Bedrock, Gemini, Claude" },
                  { icon: "💻", label: "Coding Agents", desc: "Claude Code, Copilot, Devin, Cursor" },
                  { icon: "🔒", label: "Security Tools", desc: "Cloudflare, Netskope, Kong, Island" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-xs font-semibold text-gray-300">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-medium text-gray-300">Generating your Integration Playbook…</p>
                <p className="text-xs text-gray-500">{elapsed}s elapsed · Researching each component in parallel</p>
              </div>
              <div className="max-w-sm w-full space-y-2">
                {[
                  cloudProvider && `☁️ ${cloudProvider} integration`,
                  llmProviders.length > 0 && `🤖 LLM providers: ${llmProviders.join(", ")}`,
                  codingAgents.length > 0 && `💻 Coding agents: ${codingAgents.join(", ")}`,
                  securityTools.length > 0 && `🔒 Security tools: ${securityTools.join(", ")}`,
                  "📋 Deployment overview",
                ]
                  .filter(Boolean)
                  .map((section, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-800/50 rounded-lg px-4 py-2.5 border border-gray-700"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-xs text-gray-400">{section as string}</span>
                    </div>
                  ))}
              </div>
              <p className="text-xs text-gray-600">Typically 1–3 minutes · Do not close this tab</p>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex-1 flex items-center justify-center px-8">
              <div className="max-w-md text-center space-y-3">
                <p className="text-red-400 font-medium">Generation failed</p>
                <p className="text-sm text-gray-500">{error}</p>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Playbook output + chat */}
          {playbook && !loading && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-indigo-400">✓ Playbook ready</span>
                  <span className="text-xs text-gray-600">·</span>
                  <span className="text-xs text-gray-500">
                    {selectedCount} component{selectedCount !== 1 ? "s" : ""} · {useCase}
                  </span>
                </div>
                <button
                  onClick={copyPlaybook}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                >
                  {copied ? "Copied!" : "Copy Markdown"}
                </button>
              </div>

              {/* Scrollable area: playbook + chat messages */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                {/* Playbook markdown */}
                <div className="max-w-3xl mx-auto prose prose-invert prose-sm prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-code:text-blue-300 prose-code:bg-gray-800 prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-indigo-500 prose-blockquote:text-gray-400">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-2xl font-bold text-white mt-0 mb-4">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-8 mb-3 pb-2 border-b border-gray-700">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-semibold text-gray-200 mt-5 mb-2">{children}</h3>,
                      p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-300">{children}</li>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      code: ({ children }) => <code className="bg-gray-800 text-blue-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                      pre: ({ children }) => <pre className="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto text-xs font-mono mb-4">{children}</pre>,
                      table: ({ children }) => <table className="w-full text-xs border-collapse mb-4">{children}</table>,
                      th: ({ children }) => <th className="border border-gray-700 px-3 py-2 bg-gray-800 text-left text-gray-200 font-semibold">{children}</th>,
                      td: ({ children }) => <td className="border border-gray-700 px-3 py-2 text-gray-300">{children}</td>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-indigo-500 pl-4 text-gray-400 italic my-4">{children}</blockquote>,
                      hr: () => <hr className="border-gray-700 my-6" />,
                    }}
                  >
                    {playbook}
                  </ReactMarkdown>
                </div>

                {/* Chat messages */}
                {chatMessages.length > 0 && (
                  <div className="max-w-3xl mx-auto mt-10 space-y-4 border-t border-gray-800 pt-8">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Playbook Q&amp;A</p>
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs shrink-0 mt-0.5">A</div>
                        )}
                        <div
                          className={`max-w-xl rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-800 text-gray-200 border border-gray-700"
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs shrink-0 mt-0.5">U</div>
                        )}
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-7 h-7 rounded-full bg-indigo-700 flex items-center justify-center text-xs shrink-0 mt-0.5">A</div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    )}
                    <div ref={chatBottomRef} />
                  </div>
                )}
              </div>

              {/* Chat input bar */}
              <div className="border-t border-gray-800 bg-gray-900 px-6 py-4">
                {/* Attached file chip */}
                {attachedFile && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-xs text-indigo-300">
                      📎 {attachedFile.name}
                      <button
                        onClick={() => setAttachedFile(null)}
                        className="ml-1 text-indigo-400 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                )}

                <div className="flex gap-3 items-end">
                  {/* File attach button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach a file for additional context"
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors border border-gray-700"
                  >
                    📎
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.md,.csv,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setAttachedFile({ name: f.name, file: f });
                      e.target.value = "";
                    }}
                  />

                  {/* Text input */}
                  <textarea
                    rows={1}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendChat();
                      }
                    }}
                    placeholder="Ask a question about this playbook…"
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:border-indigo-500 transition-colors min-h-[40px] max-h-32 overflow-y-auto"
                    style={{ fieldSizing: "content" } as React.CSSProperties}
                  />

                  {/* Send button */}
                  <button
                    onClick={sendChat}
                    disabled={!chatInput.trim() || chatLoading}
                    className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-2">Attach a customer doc or architecture diagram for additional context · Shift+Enter for new line</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
