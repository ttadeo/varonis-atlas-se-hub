"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type FeedbackType = "bug" | "feature" | "general";

const TYPES: { value: FeedbackType; label: string; emoji: string }[] = [
  { value: "bug", label: "Bug Report", emoji: "🐛" },
  { value: "feature", label: "Feature Request", emoji: "✨" },
  { value: "general", label: "General Feedback", emoji: "💬" },
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackType>("general");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const pathname = usePathname();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when modal opens
  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 50);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setMessage("");
      setType("general");
      setStatus("idle");
    }, 200);
  }

  async function handleSubmit() {
    if (!message.trim() || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message, page: pathname }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setTimeout(handleClose, 1800);
    } catch {
      setStatus("error");
    }
  }

  // Don't show on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/verify")) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 shadow-lg shadow-indigo-900/40 transition-all hover:scale-105 active:scale-95"
        aria-label="Send feedback"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6m-6 4h10M5 20l-2 2V4a1 1 0 011-1h14a1 1 0 011 1v13a1 1 0 01-1 1H5z" />
        </svg>
        Feedback
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-end p-6 bg-black/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          {/* Modal */}
          <div className="w-full max-w-sm rounded-2xl border border-gray-700/60 bg-gray-900 shadow-2xl shadow-black/60 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
              <span className="text-sm font-semibold text-white">Send Feedback</span>
              <button onClick={handleClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {status === "sent" ? (
              <div className="px-5 py-10 text-center">
                <div className="text-3xl mb-3">✅</div>
                <p className="text-sm font-medium text-white">Thanks for the feedback!</p>
                <p className="text-xs text-gray-500 mt-1">We'll review it shortly.</p>
              </div>
            ) : (
              <div className="p-5 space-y-4">
                {/* Type selector */}
                <div className="flex gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setType(t.value)}
                      className={`flex-1 text-xs py-1.5 px-2 rounded-lg border transition-colors ${
                        type === t.value
                          ? "border-indigo-500 bg-indigo-900/40 text-indigo-300"
                          : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    type === "bug"
                      ? "What happened? What did you expect?"
                      : type === "feature"
                      ? "What would you like to see added?"
                      : "What's on your mind?"
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-700 bg-gray-800/60 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 outline-none focus:border-indigo-600/60 resize-none transition-colors"
                />

                {/* Page context */}
                <p className="text-xs text-gray-600">
                  Page: <span className="text-gray-500">{pathname}</span>
                </p>

                {/* Error */}
                {status === "error" && (
                  <p className="text-xs text-red-400">Something went wrong — please try again.</p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!message.trim() || status === "sending"}
                  className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 transition-colors"
                >
                  {status === "sending" ? "Sending..." : "Send Feedback"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
