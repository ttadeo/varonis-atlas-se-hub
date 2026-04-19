"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Confidence {
  score: number;
  label: string;
  reason: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  confidence?: Confidence;
  fromMain?: boolean; // answer pushed from main window
}

interface MeetingSession {
  context: {
    industry: string;
    meetingType: string;
    attendees: string;
    knownConcerns: string;
  };
  sessionId: string | null;
  userId: string;
}

function confidenceBadgeClass(score: number) {
  if (score >= 85) return "bg-green-500/20 text-green-300 border-green-700";
  if (score >= 60) return "bg-yellow-500/20 text-yellow-300 border-yellow-700";
  return "bg-red-500/20 text-red-300 border-red-700";
}

function confidenceBorderClass(score: number) {
  if (score >= 85) return "border-green-700/50";
  if (score >= 60) return "border-yellow-700/50";
  return "border-red-700/50";
}

export default function QuickViewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [meetingSession, setMeetingSession] = useState<MeetingSession | null>(null);
  const [flash, setFlash] = useState(false);
  const lastTsRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ── Scroll to bottom on new messages ────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ── Read meeting context from main window ────────────────────────────────────
  useEffect(() => {
    function loadCtx() {
      const raw = localStorage.getItem("atlas-meeting-session");
      if (raw) {
        try { setMeetingSession(JSON.parse(raw)); } catch {}
      }
    }
    loadCtx();
    function onStorage(e: StorageEvent) {
      if (e.key === "atlas-meeting-session") loadCtx();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ── Receive answers pushed from main window ──────────────────────────────────
  useEffect(() => {
    function applyPayload(raw: string | null) {
      if (!raw) return;
      try {
        const payload: { question: string; answer: string; confidence: Confidence; ts?: number } = JSON.parse(raw);
        if ((payload.ts ?? 0) <= lastTsRef.current) return;
        lastTsRef.current = payload.ts ?? Date.now();
        setMessages((prev) => [
          ...prev,
          { role: "user", content: payload.question, fromMain: true },
          { role: "assistant", content: payload.answer, confidence: payload.confidence, fromMain: true },
        ]);
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      } catch {}
    }

    // Hydrate on mount
    applyPayload(localStorage.getItem("atlas-quick-response"));

    function onStorage(e: StorageEvent) {
      if (e.key === "atlas-quick-response") applyPayload(e.newValue);
    }
    window.addEventListener("storage", onStorage);

    const poll = setInterval(() => {
      applyPayload(localStorage.getItem("atlas-quick-response"));
    }, 800);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(poll);
    };
  }, []);

  // ── Send a question from the popup ───────────────────────────────────────────
  async function sendQuestion() {
    const question = input.trim();
    if (!question || loading || !meetingSession) return;
    setLoading(true);
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);

    try {
      const res = await fetch("/api/meeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          history: [],
          attachments: [],
          meetingContext: meetingSession.context,
          sessionId: meetingSession.sessionId,
          userId: meetingSession.userId,
          saveSession: !!meetingSession.sessionId,
          quickResponse: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "API error");

      const assistantMsg: Message = {
        role: "assistant",
        content: data.answer,
        confidence: data.confidence,
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // Also push to atlas-quick-response so the main window poll reflects it
      localStorage.setItem(
        "atlas-quick-response",
        JSON.stringify({ question, answer: data.answer, confidence: data.confidence, ts: Date.now() })
      );
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${String(err)}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const hasContext = !!meetingSession;

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-3 border-b border-gray-800 transition-colors duration-300 ${flash ? "bg-gray-800" : "bg-gray-950"}`}>
        <div className="flex items-center gap-3">
          <span className="text-green-400 font-bold tracking-wide">⚡ Quick Answer</span>
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">Pop-Out</span>
        </div>
        {meetingSession?.context.meetingType ? (
          <span className="text-xs text-gray-500 truncate max-w-xs">
            {meetingSession.context.meetingType}
            {meetingSession.context.industry ? ` · ${meetingSession.context.industry}` : ""}
          </span>
        ) : (
          <span className="text-xs text-yellow-600">No meeting context — lock context in main window first</span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="text-5xl mb-4 opacity-20">⚡</div>
            <p className="text-gray-600 font-light">
              {hasContext
                ? "Type a customer question below to get an instant answer."
                : "Lock your meeting context in the main window, then ask questions here."}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "user" ? (
              <div className="max-w-[75%] bg-gray-800 rounded-2xl px-4 py-3">
                <p className="text-sm text-gray-200">{msg.content}</p>
                {msg.fromMain && (
                  <p className="text-xs text-gray-600 mt-1">from main window</p>
                )}
              </div>
            ) : (
              <div className={`max-w-[90%] bg-gray-900 rounded-2xl px-5 py-4 border ${msg.confidence ? confidenceBorderClass(msg.confidence.score) : "border-gray-800"}`}>
                {msg.confidence && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${confidenceBadgeClass(msg.confidence.score)}`}>
                      {msg.confidence.score >= 85 ? "✓" : msg.confidence.score >= 60 ? "~" : "!"}{" "}
                      {msg.confidence.label} · {msg.confidence.score}/100
                    </span>
                    {msg.fromMain && (
                      <span className="text-xs text-gray-600">from main window</span>
                    )}
                  </div>
                )}
                <div className="text-lg text-white leading-relaxed font-light prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
                {msg.confidence?.reason && (
                  <p className="text-xs text-gray-600 mt-3">{msg.confidence.reason}</p>
                )}
                <button
                  onClick={() => navigator.clipboard.writeText(msg.content)}
                  className="mt-3 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 py-4 border-t border-gray-800 bg-gray-950">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendQuestion()}
            disabled={loading || !hasContext}
            placeholder={hasContext ? "Type the customer's question…" : "Lock context in main window first…"}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-green-700 disabled:opacity-40"
          />
          <button
            onClick={sendQuestion}
            disabled={loading || !input.trim() || !hasContext}
            className="bg-green-700 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors"
          >
            {loading ? "…" : "Answer"}
          </button>
        </div>
      </div>
    </div>
  );
}
