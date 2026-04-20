"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";


interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }
      if (!data.answer) {
        throw new Error("No answer returned from Atlas.");
      }
      const assistantMessage: Message = { role: "assistant", content: data.answer };
      setMessages((prev) => [...prev, assistantMessage]);
      setHistory(data.history ?? []);
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

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">← Back</Link>
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">A</div>
        <div>
          <h1 className="font-semibold text-white">Ask Atlas</h1>
          <p className="text-xs text-gray-400">Free-form Q&A — Atlas AI Security Platform</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg font-medium text-gray-300">Ask anything about Varonis Atlas</p>
            <p className="text-sm mt-2">AI Gateway, policies, guardrails, API endpoints, and more.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-hidden ${
                msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
              }`}
            >
              {msg.role === "user" ? (
                msg.content
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
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
              Searching Atlas docs…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-800 px-4 py-4">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <textarea
            className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
            rows={1}
            placeholder="Ask about Atlas AI Gateway, policies, guardrails..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
          >
            Send
          </button>
        </div>
        <p className="text-center text-xs text-gray-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
