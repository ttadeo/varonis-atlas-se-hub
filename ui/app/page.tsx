"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [securityOpen, setSecurityOpen] = useState(false);
  const [truelensOpen, setTruelensOpen] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastSending, setBroadcastSending] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/users/count")
      .then(r => r.json())
      .then(d => { if (d.total !== null) setUserCount(d.total); })
      .catch(() => {});
    fetch("/api/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.isAdmin) setIsAdmin(true); })
      .catch(() => {});
  }, []);

  async function sendBroadcast() {
    if (!broadcastMessage.trim()) return;
    setBroadcastSending(true);
    setBroadcastStatus(null);
    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: broadcastSubject, message: broadcastMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setBroadcastStatus({ ok: true, text: `Sent to ${data.sent_to} users.` });
        setBroadcastMessage("");
        setBroadcastSubject("");
        setBroadcastOpen(false);
      } else {
        setBroadcastStatus({ ok: false, text: data.error ?? "Send failed." });
      }
    } catch {
      setBroadcastStatus({ ok: false, text: "Network error." });
    } finally {
      setBroadcastSending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
          A
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-white leading-tight">Atlas Learning Platform</h1>
          <p className="text-xs text-gray-400">Varonis Atlas AI Security — Internal SE Tool</p>
        </div>

        {userCount !== null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5">
            <span>👤</span>
            <span><span className="text-white font-semibold">{userCount}</span> registered users</span>
          </div>
        )}

        {/* TrueLens */}
        <div className="relative">
          <button
            onClick={() => setTruelensOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-500 rounded-lg px-3 py-1.5 transition-colors shadow-lg shadow-emerald-900/50"
          >
            <span>📊</span>
            <span>RAG Evaluation — TrueLens</span>
            <span className="text-emerald-200">{truelensOpen ? "▲" : "▼"}</span>
          </button>
          {truelensOpen && (
            <div className="absolute right-0 top-full mt-2 w-[620px] rounded-xl border border-gray-700 bg-gray-900 shadow-2xl z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">RAG Accuracy — Evaluated with TrueLens</p>
                <button onClick={() => setTruelensOpen(false)} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <p className="text-xs text-gray-400">TrueLens is an independent open-source RAG evaluation framework. It scores AI systems across three dimensions using a separate LLM as an impartial judge. Evaluated against <span className="text-white font-medium">52 golden questions</span> covering Atlas core concepts, deployment, policies, and integrations. Baseline: <span className="text-white font-medium">Atlas v3.6.0 docs, July 2026.</span></p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-emerald-800/60 bg-emerald-900/15 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">0.987</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Answer Relevance</div>
                    <div className="text-xs text-gray-500 mt-1">Answers directly address what was asked</div>
                  </div>
                  <div className="rounded-lg border border-emerald-800/60 bg-emerald-900/15 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">1.000</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Context Relevance</div>
                    <div className="text-xs text-gray-500 mt-1">System retrieves the right knowledge to answer</div>
                  </div>
                  <div className="rounded-lg border border-amber-800/60 bg-amber-900/10 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">0.777</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Groundedness</div>
                    <div className="text-xs text-gray-500 mt-1">Answers stay within retrieved content</div>
                  </div>
                </div>
                <div className="rounded-lg border border-amber-800/50 bg-amber-900/10 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-amber-400">Groundedness — Active Optimization Target</p>
                  <p className="text-xs text-gray-400">The system occasionally adds context beyond what the retrieved chunks strictly support — drawing on general LLM knowledge rather than staying purely within the Atlas documentation. Groundedness has improved from 0.732 → 0.777 with the v3.6.0 knowledge base update.</p>
                </div>
                <div className="rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3">
                  <p className="text-xs text-gray-500">Scores reflect the RAG pipeline serving <span className="font-mono">/ask</span>, <span className="font-mono">/learn</span>, and <span className="font-mono">/knowledge</span>. TrueLens evaluations are re-run after every major knowledge base update.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security disclosure */}
        <div className="relative">
          <button
            onClick={() => setSecurityOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500 rounded-lg px-3 py-1.5 transition-colors shadow-lg shadow-red-900/50"
          >
            <span>🔒</span>
            <span>How this system is secured</span>
            <span className="text-red-200">{securityOpen ? "▲" : "▼"}</span>
          </button>
          {securityOpen && (
            <div className="absolute right-0 top-full mt-2 w-[640px] rounded-xl border border-gray-700 bg-gray-900 shadow-2xl z-50 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-700 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">How the Atlas Learning System is Secured</p>
                <button onClick={() => setSecurityOpen(false)} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
              </div>
              <div className="px-5 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Authentication</p>
                    <p className="text-xs text-gray-300">Email OTP restricted to <span className="font-mono text-blue-400">@varonis.com</span> addresses only. No passwords stored. A time-limited one-time code is sent via Resend and verified server-side before a signed JWT session cookie is issued.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Session Management</p>
                    <p className="text-xs text-gray-300">Sessions are JWT-signed with a server-side secret. The cookie is <span className="font-mono text-blue-400">HttpOnly</span> and <span className="font-mono text-blue-400">SameSite=Strict</span>. Sessions expire automatically and cannot be forged without the secret.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">API Route Protection</p>
                    <p className="text-xs text-gray-300">Every protected API route calls <span className="font-mono text-blue-400">requireAuth()</span> as its first operation. Unauthenticated requests are rejected before any business logic or database access occurs. Only four public endpoints exist: send-otp, verify-otp, logout, and the n8n guide callback.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Data Scoping</p>
                    <p className="text-xs text-gray-300">User preferences and session history are scoped to <span className="font-mono text-blue-400">auth.email</span> — the verified email from the JWT. Users can only read and write their own data. No user can access another user&apos;s records.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Secrets Management</p>
                    <p className="text-xs text-gray-300">All API keys (Anthropic, OpenAI, Atlas, Resend, Upstash) are server-side Vercel environment variables — never exposed to the browser or client bundle.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Demo Provisioning Safety</p>
                    <p className="text-xs text-gray-300">Delete All is owner-scoped — SEs can only clean up projects they own. LLM endpoints are permanently excluded from deletion via a server-side blocklist. Superuser access is restricted to a single hardcoded admin email.</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">File Attachments — Not Stored</p>
                    <p className="text-xs text-gray-300">Documents uploaded in Ask Atlas or Meeting Co-Pilot (PDFs, Word, Excel, images) are <span className="text-white font-medium">never persisted</span>. File content exists only in browser memory, is sent once to Claude as part of the message, and is discarded immediately. Only the filename is saved in session history — never the content.</p>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3">
                  <p className="text-xs text-gray-500">Internal use only — not customer-facing. All traffic is encrypted in transit via Vercel TLS. No customer data is stored — only SE session state and learning progress.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto space-y-4">

          {/* Welcome */}
          <div className="text-center mb-2">
            <h2 className="text-xl font-semibold text-white">Welcome to Atlas Learning Platform</h2>
            <p className="text-sm text-gray-400 mt-1">Your AI-powered guide to Varonis Atlas AI Security</p>
          </div>

          {/* Broadcast card — admin only, collapsible */}
          {isAdmin && (
            <div className="rounded-xl border border-amber-700/50 bg-amber-900/10 overflow-hidden">
              <button
                onClick={() => { setBroadcastOpen(o => !o); setBroadcastStatus(null); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-amber-900/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">📢 Broadcast Email</span>
                  <span className="text-xs text-gray-600">—</span>
                  <span className="text-xs text-gray-500">All registered users · Admin only</span>
                  {broadcastStatus?.ok && (
                    <span className="text-xs text-emerald-400">✓ {broadcastStatus.text}</span>
                  )}
                </div>
                <span className="text-amber-500 text-xs">{broadcastOpen ? "▲" : "▼"}</span>
              </button>
              {broadcastOpen && (
                <div className="px-4 pb-4 space-y-2 border-t border-amber-800/40 pt-3">
                  <input
                    type="text"
                    placeholder="Subject (optional — defaults to 'Atlas Learning Platform — Update')"
                    value={broadcastSubject}
                    onChange={e => setBroadcastSubject(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-500"
                  />
                  <textarea
                    rows={3}
                    placeholder="Message to send to all users…"
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {broadcastStatus && !broadcastStatus.ok && (
                        <span className="text-xs text-red-400">✗ {broadcastStatus.text}</span>
                      )}
                    </div>
                    <button
                      onClick={sendBroadcast}
                      disabled={broadcastSending || !broadcastMessage.trim()}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      {broadcastSending ? "Sending…" : "Send to All Users"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* What's New — slim strip */}
          <div className="rounded-xl border border-emerald-700/40 bg-emerald-900/8 px-4 py-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest shrink-0">What&apos;s New</span>
              <span className="text-xs text-gray-600 shrink-0">Aug 2026</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-300">📋 <span className="font-medium">Integration Playbook</span> — stack-matched Atlas guide + Q&A chat</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-300">⚡ <span className="font-medium">Quick Answer Mode</span> — 4–5 sentence RAG responses for live calls</span>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-300">📄 <span className="font-medium">Atlas v3.6.0 docs</span> — MCP, Agentforce, AI SPM</span>
            </div>
          </div>

          {/* Feature cards — 3-column grid */}
          <div className="grid grid-cols-3 gap-3">

            {/* Demo Center — full width */}
            <Link href="/demo" className="col-span-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-emerald-500 rounded-xl p-4 transition-all group flex items-center gap-4">
              <div className="text-2xl shrink-0">🎯</div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">Demo Center</h3>
                <p className="text-xs text-gray-400 mt-0.5">Provision Atlas demo environments in one click. Run live agentic demos — AI Deal Research, Red Team Attack Agent, and MCP Quarantine.</p>
              </div>
              <p className="text-xs text-emerald-400 group-hover:text-emerald-300 shrink-0">3 live demos →</p>
            </Link>

            {/* MCP App Gallery — 2/3 width */}
            <Link href="/atlas-mcp" className="col-span-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 rounded-xl p-4 transition-all group flex items-center gap-4">
              <div className="text-2xl shrink-0">⚡</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-white text-sm">Atlas MCP App Gallery</h3>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-900/40 border border-indigo-700/50 rounded px-1.5 py-0.5">LIVE ATLAS DATA</span>
                </div>
                <p className="text-xs text-gray-400">3 working apps built on the Atlas REST API — AI Risk Briefing, LLM Endpoint Audit, and Shadow AI Report.</p>
              </div>
              <p className="text-xs text-indigo-400 group-hover:text-indigo-300 shrink-0">3 apps →</p>
            </Link>

            {/* AI Runtime Demo — 1/3 width */}
            <Link href="/runtime" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 rounded-xl p-4 transition-all group flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-2">🚦</div>
                <h3 className="font-semibold text-white text-sm">AI Runtime Demo</h3>
                <p className="text-xs text-gray-400 mt-0.5">Simulate real AI traffic through Atlas Gateway — fire prompts and trigger guardrails live.</p>
              </div>
              <p className="text-xs text-red-400 group-hover:text-red-300 mt-3">Live Gateway →</p>
            </Link>

            {/* Integration Playbook — 2/3 width */}
            <Link href="/playbook" className="col-span-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 rounded-xl p-4 transition-all group flex items-center gap-4">
              <div className="text-2xl shrink-0">📋</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-white text-sm">Integration Playbook</h3>
                  <span className="text-xs font-bold text-indigo-400 bg-indigo-900/40 border border-indigo-700/50 rounded px-1.5 py-0.5">NEW</span>
                </div>
                <p className="text-xs text-gray-400">Select the customer&apos;s stack — cloud, LLMs, coding agents, security tools — and get a step-by-step Atlas integration guide grounded in real docs.</p>
              </div>
              <p className="text-xs text-indigo-400 group-hover:text-indigo-300 shrink-0">63 docs →</p>
            </Link>

            {/* SME Knowledge Base — 1/3 */}
            <Link href="/knowledge" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-teal-500 rounded-xl p-4 transition-all group flex flex-col justify-between">
              <div>
                <div className="text-2xl mb-2">💡</div>
                <h3 className="font-semibold text-white text-sm">SME Knowledge Base</h3>
                <p className="text-xs text-gray-400 mt-0.5">Field-validated Q&A from the AI Security SME Teams channel.</p>
              </div>
              <p className="text-xs text-teal-400 group-hover:text-teal-300 mt-3">118 entries →</p>
            </Link>

            {/* Learn Atlas */}
            <Link href="/learn" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">📚</div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-semibold text-white text-sm">Learn Atlas</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/40 border border-emerald-700/50 rounded px-1.5 py-0.5">Coding Agents</span>
              </div>
              <p className="text-xs text-gray-400">Structured course — Beginner, Intermediate, Advanced + Coding Agents tiers covering hooks, fleet, IBAC, and MCP Server.</p>
              <p className="text-xs text-blue-400 mt-3 group-hover:text-blue-300">31 lessons · 4 tiers →</p>
            </Link>

            {/* Meeting Readiness */}
            <Link href="/meeting" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">🤝</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Meeting Readiness</h3>
              <p className="text-xs text-gray-400">Prep for customer meetings. Upload screenshots, RFPs, and architecture diagrams for targeted help.</p>
              <p className="text-xs text-orange-400 mt-3 group-hover:text-orange-300">Attach files · Session memory →</p>
            </Link>

            {/* Ask a Question */}
            <Link href="/ask" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">💬</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Ask a Question</h3>
              <p className="text-xs text-gray-400">Free-form Q&A about Atlas config, policies, and APIs. Toggle ⚡ Quick Answer for 4–5 sentence responses during live calls.</p>
              <p className="text-xs text-blue-400 mt-3 group-hover:text-blue-300">RAG-powered · Quick Answer →</p>
            </Link>

            {/* Architecture Builder */}
            <Link href="/architect" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">🏗️</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Architecture Builder</h3>
              <p className="text-xs text-gray-400">Describe the customer environment and generate a full reference architecture diagram with Atlas overlaid.</p>
              <p className="text-xs text-cyan-400 mt-3 group-hover:text-cyan-300">Mermaid · Narrative · PDF →</p>
            </Link>

            {/* Technical Guide Producer */}
            <Link href="/guides" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-violet-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Technical Guide Producer</h3>
              <p className="text-xs text-gray-400">Generate polished Atlas technical guides — MCP, Gateway, compliance, or custom write-ups.</p>
              <p className="text-xs text-violet-400 mt-3 group-hover:text-violet-300">5 guide types · Export PDF →</p>
            </Link>

            {/* Resource Library */}
            <Link href="/resources" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">📁</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Resource Library</h3>
              <p className="text-xs text-gray-400">Competitive decks, case studies, datasheets, and Field Friday Q&A from Highspot.</p>
              <p className="text-xs text-amber-400 mt-3 group-hover:text-amber-300">Browsable · Searchable →</p>
            </Link>

            {/* Analytics */}
            <Link href="/analytics" className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 rounded-xl p-4 transition-all group">
              <div className="text-2xl mb-2">📊</div>
              <h3 className="font-semibold text-white text-sm mb-0.5">Interaction Analytics</h3>
              <p className="text-xs text-gray-400">Session trends, answer quality scores, knowledge base gaps by industry and meeting type.</p>
              <p className="text-xs text-purple-400 mt-3 group-hover:text-purple-300">View dashboard →</p>
            </Link>

          </div>
        </div>
      </main>
    </div>
  );
}
