"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

interface Message {
  role: "user" | "assistant";
  content: string;
  attachmentNames?: string[];
}

interface Attachment {
  name: string;
  mediaType: string;
  data: string;       // base64 for images/PDFs; extracted text for everything else
  isExtracted: boolean;
  size: number;
}

interface SessionMeta {
  id: string;
  title: string;
  timestamp: string;
}

const MAX_FILES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ATTACH_NUDGE_KEY = "atlas_attach_nudge_dismissed";
const MAX_PDF_BYTES = 32 * 1024 * 1024;
const MAX_OTHER_BYTES = 20 * 1024 * 1024;

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showAttachNudge, setShowAttachNudge] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(ATTACH_NUDGE_KEY)) setShowAttachNudge(true);
  }, []);

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);

  // Session management
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Quick Answer mode
  const [quickMode, setQuickMode] = useState(false);

  // Copy button
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load session list on mount
  useEffect(() => {
    loadSessionList();
  }, []);

  async function loadSessionList() {
    setSessionsLoading(true);
    try {
      const res = await fetch("/api/ask/sessions");
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions ?? []);
      }
    } catch { /* non-critical */ }
    finally { setSessionsLoading(false); }
  }

  async function saveSession(msgs: Message[], hist: { role: "user" | "assistant"; content: string }[], sid: string) {
    const title = msgs.find((m) => m.role === "user")?.content?.slice(0, 70) ?? "Untitled";
    try {
      await fetch("/api/ask/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid, title, messages: msgs, history: hist }),
      });
      // Refresh list (non-blocking)
      loadSessionList();
    } catch { /* non-critical */ }
  }

  async function loadSession(id: string) {
    try {
      const res = await fetch(`/api/ask/sessions?sessionId=${id}`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data.messages ?? []);
      setHistory(data.history ?? []);
      setSessionId(id);
      setShowHistory(false);
    } catch { /* non-critical */ }
  }

  async function deleteSession(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`/api/ask/sessions?sessionId=${id}`, { method: "DELETE" });
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (sessionId === id) startNewChat();
    } catch { /* non-critical */ }
    finally { setDeletingId(null); }
  }

  function startNewChat() {
    setMessages([]);
    setHistory([]);
    setSessionId(null);
    setInput("");
    setAttachments([]);
    setShowHistory(false);
  }

  // ── File handling ──────────────────────────────────────────────────────────

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setAttachError(null);
    const fileArray = Array.from(files);

    if (attachments.length + fileArray.length > MAX_FILES) {
      setAttachError(`Maximum ${MAX_FILES} files per message.`);
      return;
    }

    for (const file of fileArray) {
      const isImage = IMAGE_TYPES.has(file.type);
      const isPDF = file.type === "application/pdf" || file.name.endsWith(".pdf");

      if (isImage && file.size > MAX_IMAGE_BYTES) {
        setAttachError(`${file.name}: images must be under 5 MB.`);
        continue;
      }
      if (isPDF && file.size > MAX_PDF_BYTES) {
        setAttachError(`${file.name}: PDFs must be under 32 MB.`);
        continue;
      }
      if (!isImage && !isPDF && file.size > MAX_OTHER_BYTES) {
        setAttachError(`${file.name}: file must be under 20 MB.`);
        continue;
      }

      if (isImage || isPDF) {
        const base64 = await fileToBase64(file);
        setAttachments((prev) => [
          ...prev,
          { name: file.name, mediaType: file.type || "application/octet-stream", data: base64, isExtracted: false, size: file.size },
        ]);
      } else {
        setExtracting(true);
        try {
          const form = new FormData();
          form.append("file", file);
          const res = await fetch("/api/extract-context", { method: "POST", body: form });
          const data = await res.json();
          if (!res.ok) {
            setAttachError(`${file.name}: ${data.error ?? "Extraction failed"}`);
            continue;
          }
          setAttachments((prev) => [
            ...prev,
            { name: file.name, mediaType: "text/plain", data: data.text, isExtracted: true, size: file.size },
          ]);
        } catch (err) {
          setAttachError(`${file.name}: ${String(err)}`);
        } finally {
          setExtracting(false);
        }
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [attachments]);

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }

  // ── Copy ──────────────────────────────────────────────────────────────────

  function copyMessage(content: string, index: number) {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  }

  // ── Send message ───────────────────────────────────────────────────────────

  async function sendMessage() {
    const question = input.trim();
    if ((!question && attachments.length === 0) || loading) return;

    // Generate session ID on first message
    const sid = sessionId ?? crypto.randomUUID();
    if (!sessionId) setSessionId(sid);

    const userMessage: Message = {
      role: "user",
      content: question || "(attached file)",
      attachmentNames: attachments.map((a) => a.name),
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    const sentAttachments = [...attachments];
    setAttachments([]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history,
          quickMode,
          attachments: sentAttachments.map(({ name, mediaType, data, isExtracted, size }) => ({
            name, mediaType, data, isExtracted, size,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `HTTP ${res.status}`);
      if (!data.answer) throw new Error("No answer returned from Atlas.");

      const assistantMessage: Message = { role: "assistant", content: data.answer };
      const finalMessages = [...newMessages, assistantMessage];
      const finalHistory = data.history ?? [];
      setMessages(finalMessages);
      setHistory(finalHistory);

      // Auto-save session (non-blocking)
      saveSession(finalMessages, finalHistory, sid);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${String(err)}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex h-screen bg-gray-950 text-gray-100"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* ── History sidebar ─────────────────────────────────────────────────── */}
      {showHistory && (
        <div className="w-64 flex-shrink-0 border-r border-gray-800 flex flex-col bg-gray-950">
          <div className="px-3 py-4 border-b border-gray-800 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Chat History</span>
            <button
              onClick={() => setShowHistory(false)}
              className="text-gray-500 hover:text-gray-300 text-lg leading-none"
            >
              ✕
            </button>
          </div>
          <div className="px-3 py-2">
            <button
              onClick={startNewChat}
              className="w-full text-left px-3 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              + New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
            {sessionsLoading && (
              <p className="text-xs text-gray-500 px-2 py-3">Loading...</p>
            )}
            {!sessionsLoading && sessions.length === 0 && (
              <p className="text-xs text-gray-500 px-2 py-3">No saved chats yet.</p>
            )}
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => loadSession(s.id)}
                className={`group flex items-start gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  sessionId === s.id ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-200 truncate leading-snug">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(s.timestamp)}</p>
                </div>
                <button
                  onClick={(e) => deleteSession(s.id, e)}
                  disabled={deletingId === s.id}
                  className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 text-xs transition-opacity shrink-0 mt-0.5"
                  title="Delete"
                >
                  {deletingId === s.id ? "..." : "✕"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">← Back</Link>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">A</div>
          <div>
            <h1 className="font-semibold text-white">Ask Atlas</h1>
            <p className="text-xs text-gray-400">Free-form Q&A — Atlas AI Security Platform</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setQuickMode((v) => !v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                quickMode
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Quick Answer mode — concise 4-5 sentence responses for live customer conversations"
            >
              ⚡ Quick Answer {quickMode && "ON"}
            </button>
            <button
              onClick={() => { setShowHistory((v) => !v); if (!showHistory) loadSessionList(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showHistory ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
              }`}
              title="Chat history"
            >
              History {sessions.length > 0 && `(${sessions.length})`}
            </button>
            <button
              onClick={startNewChat}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              New Chat
            </button>
            <button
              onClick={() => setHelpOpen(true)}
              className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
              title="Help"
            >
              ?
            </button>
          </div>
        </header>
        <HelpPanel page="ask" open={helpOpen} onClose={() => setHelpOpen(false)} />

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center mt-16 gap-6">
              <div className="text-center text-gray-500">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-lg font-medium text-gray-300">Ask anything about Varonis Atlas</p>
                <p className="text-sm mt-2">AI Gateway, policies, guardrails, API endpoints, and more.</p>
              </div>

              {showAttachNudge && (
                <div className="w-full max-w-xl rounded-xl border border-blue-800/50 bg-blue-950/30 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">📎</span>
                      <div>
                        <p className="text-sm font-medium text-blue-200">Have a document? Attach it for better answers.</p>
                        <p className="text-xs text-blue-300/70 mt-1">Upload customer emails, install guides, spreadsheets, or screenshots — the system will use them as context for your question.</p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {["PDF", "Word", "Excel (.xlsx)", "CSV", "TXT", "Images"].map(f => (
                            <span key={f} className="text-xs bg-blue-900/50 border border-blue-700/50 text-blue-300 rounded px-2 py-0.5">{f}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => { setShowAttachNudge(false); localStorage.setItem(ATTACH_NUDGE_KEY, "1"); }}
                      className="text-blue-400 hover:text-white text-lg leading-none shrink-0"
                      title="Dismiss"
                    >×</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-2xl min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-hidden ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.role === "user" ? (
                  <div>
                    {msg.content}
                    {msg.attachmentNames && msg.attachmentNames.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.attachmentNames.map((name, j) => (
                          <span key={j} className="text-xs bg-blue-700 rounded px-2 py-0.5">
                            📎 {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      table: ({ children }) => <table className="w-full text-xs border-collapse my-2">{children}</table>,
                      th: ({ children }) => <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-left">{children}</th>,
                      td: ({ children }) => <td className="border border-gray-600 px-2 py-1">{children}</td>,
                      pre: ({ children }) => <pre className="bg-gray-700 rounded p-2 my-2 overflow-x-auto text-xs font-mono">{children}</pre>,
                      code: ({ children }) => <code className="bg-gray-700 px-1 rounded text-xs font-mono break-all">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
              {/* Copy button for assistant messages */}
              {msg.role === "assistant" && (
                <button
                  onClick={() => copyMessage(msg.content, i)}
                  className="mt-1 text-xs text-gray-600 hover:text-gray-400 transition-colors px-1"
                >
                  {copiedIndex === i ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
                {quickMode ? "Getting quick answer…" : "Searching Atlas docs…"}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-gray-800 px-4 py-4">
          <div className="max-w-4xl mx-auto space-y-2">

            {/* Attachment chips */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 px-1">
                {attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300">
                    <span>{att.isExtracted ? "📄" : att.mediaType.startsWith("image/") ? "🖼️" : "📎"}</span>
                    <span className="max-w-35 truncate">{att.name}</span>
                    <span className="text-gray-500">({formatBytes(att.size)})</span>
                    <button
                      onClick={() => removeAttachment(i)}
                      className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {extracting && (
                  <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
                    <span className="animate-pulse">Extracting…</span>
                  </div>
                )}
              </div>
            )}

            {attachError && (
              <p className="text-xs text-red-400 px-1">{attachError}</p>
            )}

            {/* Input row */}
            <div className="flex gap-2 items-end">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.txt,.csv,.md,.tsv,.json,.jpg,.jpeg,.png,.gif,.webp"
                onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files); }}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= MAX_FILES || extracting}
                className="shrink-0 w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-400 hover:text-gray-200 flex items-center justify-center transition-colors"
                title="Attach file (PDF, Word, Excel, CSV, image)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              <textarea
                className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                rows={1}
                placeholder={quickMode ? "Ask a quick question — concise answer in seconds…" : "Ask about Atlas AI Gateway, policies, guardrails..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading || (!input.trim() && attachments.length === 0) || extracting}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>

            <p className="text-center text-xs text-gray-600">Press Enter to send · Shift+Enter for new line · Drag & drop files</p>
          </div>
        </div>
      </div>
    </div>
  );
}
