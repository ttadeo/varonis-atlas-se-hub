"use client";

import { useEffect, useState } from "react";

interface Confidence {
  score: number;
  label: string;
  reason: string;
}

interface QuickPayload {
  question: string;
  answer: string;
  confidence: Confidence;
}

export default function QuickViewPage() {
  const [current, setCurrent] = useState<QuickPayload | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const channel = new BroadcastChannel("atlas-quick-response");
    channel.onmessage = (e: MessageEvent<QuickPayload>) => {
      setCurrent(e.data);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    };
    return () => channel.close();
  }, []);

  const badgeColor = current?.confidence
    ? current.confidence.score >= 85
      ? "bg-green-500/20 text-green-300 border-green-700"
      : current.confidence.score >= 60
      ? "bg-yellow-500/20 text-yellow-300 border-yellow-700"
      : "bg-red-500/20 text-red-300 border-red-700"
    : "";

  const borderColor = current?.confidence
    ? current.confidence.score >= 85
      ? "border-green-700"
      : current.confidence.score >= 60
      ? "border-yellow-700"
      : "border-red-700"
    : "border-gray-700";

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col p-8 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-green-400 text-lg font-bold tracking-wide">⚡ Quick Answer</span>
          <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">Second Monitor View</span>
        </div>
        {current?.confidence && (
          <span className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${badgeColor}`}>
            {current.confidence.score >= 85 ? "✓" : current.confidence.score >= 60 ? "~" : "!"} {current.confidence.label} · {current.confidence.score}/100
          </span>
        )}
      </div>

      {current ? (
        <div className={`flex-1 flex flex-col gap-6 transition-all duration-300 ${flash ? "opacity-50" : "opacity-100"}`}>
          {/* Question */}
          <div className="bg-gray-800 rounded-2xl px-6 py-4 border border-gray-700">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Customer Question</p>
            <p className="text-lg text-gray-100 leading-relaxed">{current.question}</p>
          </div>

          {/* Answer */}
          <div className={`flex-1 bg-gray-900 rounded-2xl px-8 py-6 border-2 ${borderColor}`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Your Answer</p>
            <p className="text-2xl text-white leading-relaxed font-light">{current.answer}</p>
          </div>

          {/* Confidence reason */}
          {current.confidence?.reason && (
            <p className="text-xs text-gray-600 text-center px-4">{current.confidence.reason}</p>
          )}

          {/* Copy button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigator.clipboard.writeText(current.answer)}
              className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 px-6 py-2 rounded-xl transition-colors"
            >
              Copy Answer
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="text-6xl mb-6 opacity-20">⚡</div>
          <p className="text-xl text-gray-600 font-light">Waiting for Quick Answers…</p>
          <p className="text-sm text-gray-700 mt-3 max-w-sm">
            Switch to Quick Answer mode in the main window and type a customer question. The answer will appear here instantly.
          </p>
        </div>
      )}
    </div>
  );
}
