"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QAPair {
  thread_id: string;
  question: string;
  answer: string;
  topic: string;
  confidence: "sme_validated" | "community_consensus" | "tentative" | "incomplete";
  notes: string;
  date_sensitive: boolean;
}

interface Topic {
  id: string;
  label: string;
  count: number;
  qa: QAPair[];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONFIDENCE_STYLES: Record<string, string> = {
  sme_validated:        "bg-emerald-900/40 text-emerald-400 border border-emerald-700",
  community_consensus:  "bg-blue-900/40 text-blue-400 border border-blue-700",
  tentative:            "bg-amber-900/40 text-amber-400 border border-amber-700",
  incomplete:           "bg-gray-700 text-gray-400 border border-gray-600",
};

const CONFIDENCE_LABELS: Record<string, string> = {
  sme_validated:        "SME Validated",
  community_consensus:  "Community Consensus",
  tentative:            "Tentative",
  incomplete:           "Incomplete",
};

const TOPIC_ICONS: Record<string, string> = {
  gateway_architecture: "🔀",
  guardrails:           "🛡️",
  deployment:           "🚀",
  discovery:            "🔍",
  roadmap:              "🗺️",
  ide_support:          "💻",
  compliance:           "📋",
  licensing:            "🔑",
  shadow_ai:            "👥",
  competitive:          "⚔️",
  pii_detection:        "🔒",
  other:                "📌",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={copy}
      className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-400 hover:text-gray-200 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [expandedQA, setExpandedQA] = useState<Set<string>>(new Set());

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [webhookMissing, setWebhookMissing] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Load topics ─────────────────────────────────────────────────────────────

  useEffect(() => {
    fetch("/api/sme/topics")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setTopics(d.topics ?? []);
        setTotal(d.total ?? 0);
        if (d.topics?.length > 0) setActiveTopic(d.topics[0].id);
      })
      .catch((e) => setLoadError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  // ── Chat ─────────────────────────────────────────────────────────────────────

  async function sendChat() {
    const q = chatInput.trim();
    if (!q || chatLoading) return;

    setChatMessages((prev) => [...prev, { role: "user", content: q }]);
    setChatInput("");
    setChatLoading(true);
    setChatError(null);

    try {
      const res = await fetch("/api/sme/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      const data = await res.json();

      if (res.status === 503) {
        setWebhookMissing(true);
        setChatMessages((prev) => prev.slice(0, -1));
        return;
      }

      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);

      const answer = data.answer ?? data.text ?? JSON.stringify(data);
      setChatMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setChatError(String(err));
      setChatMessages((prev) => prev.slice(0, -1));
    } finally {
      setChatLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  }

  function toggleQA(id: string) {
    setExpandedQA((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const activeTopicData = topics.find((t) => t.id === activeTopic);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100 overflow-hidden">

      {/* ── Left: Topic Browser ──────────────────────────────────────────────── */}
      <div className="w-64 shrink-0 border-r border-gray-800 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-4">
          <Link href="/" className="text-gray-400 hover:text-white text-sm block mb-3">← Back</Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center text-sm">💡</div>
            <div>
              <p className="text-sm font-semibold text-white">SME Knowledge</p>
              <p className="text-xs text-gray-500">{total} field Q&A pairs</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {loading && (
            <div className="px-4 py-6 text-xs text-gray-500 text-center">Loading topics…</div>
          )}
          {loadError && (
            <div className="px-4 py-4 text-xs text-red-400">{loadError}</div>
          )}
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors ${
                activeTopic === t.id
                  ? "bg-teal-900/30 border-r-2 border-teal-500"
                  : "hover:bg-gray-800/50"
              }`}
            >
              <span className="text-base">{TOPIC_ICONS[t.id] ?? "📌"}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${activeTopic === t.id ? "text-teal-300" : "text-gray-300"}`}>
                  {t.label}
                </p>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTopic === t.id ? "bg-teal-700 text-teal-100" : "bg-gray-700 text-gray-400"}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Center: Q&A Browser ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col border-r border-gray-800 min-w-0">
        <div className="border-b border-gray-800 px-5 py-3 flex items-center gap-2">
          <span className="text-lg">{TOPIC_ICONS[activeTopic ?? ""] ?? "📌"}</span>
          <div>
            <p className="text-sm font-semibold text-white">
              {activeTopicData?.label ?? "Select a topic"}
            </p>
            <p className="text-xs text-gray-500">
              {activeTopicData?.count ?? 0} entries · from AI Security SME Teams channel
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {!activeTopicData && !loading && (
            <div className="text-center text-gray-600 mt-16 text-sm">Select a topic to browse Q&A</div>
          )}

          {activeTopicData?.qa.map((qa) => {
            const expanded = expandedQA.has(qa.thread_id);
            return (
              <div
                key={qa.thread_id}
                className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden"
              >
                {/* Question row */}
                <button
                  onClick={() => toggleQA(qa.thread_id)}
                  className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-800/40 transition-colors"
                >
                  <span className="text-gray-500 mt-0.5 text-xs shrink-0">{expanded ? "▼" : "▶"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-100 leading-snug">{qa.question}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${CONFIDENCE_STYLES[qa.confidence] ?? CONFIDENCE_STYLES.tentative}`}>
                        {CONFIDENCE_LABELS[qa.confidence] ?? qa.confidence}
                      </span>
                      {qa.date_sensitive && (
                        <span className="text-xs text-amber-500">⚠ Date-sensitive</span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Answer */}
                {expanded && (
                  <div className="px-4 pb-4 border-t border-gray-800">
                    <div className="mt-3 text-sm text-gray-300 leading-relaxed">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ children }) => <p className="mb-2">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                          code: ({ children }) => <code className="bg-gray-800 px-1 rounded text-xs font-mono">{children}</code>,
                        }}
                      >
                        {qa.answer}
                      </ReactMarkdown>
                    </div>
                    {qa.notes && (
                      <p className="mt-2 text-xs text-gray-500 italic">{qa.notes}</p>
                    )}
                    <div className="mt-3 flex justify-end">
                      <CopyButton text={`Q: ${qa.question}\n\nA: ${qa.answer}`} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right: SME Chat ───────────────────────────────────────────────────── */}
      <div className="w-96 shrink-0 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-3">
          <p className="text-sm font-semibold text-white">Ask the SME Knowledge Base</p>
          <p className="text-xs text-gray-500 mt-0.5">Field Q&A + Atlas docs · SME knowledge first</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {chatMessages.length === 0 && !webhookMissing && (
            <div className="text-center text-gray-600 mt-12 text-xs space-y-2">
              <div className="text-3xl">💡</div>
              <p className="text-gray-400 text-sm font-medium">SME-first Q&A</p>
              <p>Ask about deployment gotchas, competitive positioning, roadmap, licensing — anything the SME channel would know.</p>
              <div className="mt-4 space-y-1.5 text-left">
                {[
                  "Does Atlas require E5 licensing for M365?",
                  "What ZTNA providers are supported?",
                  "How long do Atlas POCs typically take?",
                  "Is GCC High supported?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => { setChatInput(q); }}
                    className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {webhookMissing && (
            <div className="mx-2 mt-4 rounded-xl bg-amber-900/20 border border-amber-700 p-4 text-xs text-amber-300">
              <p className="font-semibold mb-1">SME Chat not configured</p>
              <p>Add <code className="bg-amber-900/40 px-1 rounded">N8N_SME_WEBHOOK_URL</code> to Vercel environment variables to enable the chat panel.</p>
              <p className="mt-2 text-amber-400">The topic browser above works without it.</p>
            </div>
          )}

          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-full rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-700 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                      strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                      code: ({ children }) => <code className="bg-gray-700 px-1 rounded font-mono">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
              {msg.role === "assistant" && (
                <div className="mt-1 mr-1">
                  <CopyButton text={msg.content} />
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div className="flex items-start">
              <div className="bg-gray-800 rounded-2xl px-3 py-2.5 text-xs text-gray-400 animate-pulse">
                Searching SME knowledge…
              </div>
            </div>
          )}

          {chatError && (
            <div className="text-xs text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {chatError}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!webhookMissing && (
          <div className="border-t border-gray-800 px-3 py-3">
            <div className="flex gap-2 items-end">
              <textarea
                rows={2}
                placeholder="Ask the SME knowledge base…"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-teal-600 placeholder-gray-500"
              />
              <button
                onClick={sendChat}
                disabled={!chatInput.trim() || chatLoading}
                className="shrink-0 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-3 py-2 text-xs font-medium transition-colors"
              >
                Ask
              </button>
            </div>
            <p className="text-center text-xs text-gray-700 mt-1.5">Enter to send · Shift+Enter for new line</p>
          </div>
        )}
      </div>
    </div>
  );
}
