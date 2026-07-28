"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [securityOpen, setSecurityOpen] = useState(false);
  const [truelensOpen, setTruelensOpen] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/users/count")
      .then(r => r.json())
      .then(d => { if (d.total !== null) setUserCount(d.total); })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-white">Atlas Learning Platform</h1>
          <p className="text-xs text-gray-400">Varonis Atlas AI Security — Internal SE Tool</p>
        </div>

        {/* User count */}
        {userCount !== null && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5">
            <span>👤</span>
            <span><span className="text-white font-semibold">{userCount}</span> registered users</span>
          </div>
        )}

        {/* TrueLens evaluation disclosure */}
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
                <p className="text-xs text-gray-400">TrueLens is an independent open-source RAG evaluation framework. It scores AI systems across three dimensions using a separate LLM as an impartial judge. Evaluated against <span className="text-white font-medium">52 golden questions</span> covering Atlas core concepts, deployment, policies, and integrations. Baseline: <span className="text-white font-medium">Atlas v3.5.0 docs, July 2026.</span></p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-emerald-800/60 bg-emerald-900/15 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">1.000</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Answer Relevance</div>
                    <div className="text-xs text-gray-500 mt-1">Answers directly address what was asked</div>
                  </div>
                  <div className="rounded-lg border border-emerald-800/60 bg-emerald-900/15 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-emerald-400">0.994</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Context Relevance</div>
                    <div className="text-xs text-gray-500 mt-1">System retrieves the right knowledge to answer</div>
                  </div>
                  <div className="rounded-lg border border-amber-800/60 bg-amber-900/10 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-amber-400">0.732</div>
                    <div className="text-xs font-semibold text-gray-300 mt-1">Groundedness</div>
                    <div className="text-xs text-gray-500 mt-1">Answers stay within retrieved content</div>
                  </div>
                </div>

                <div className="rounded-lg border border-amber-800/50 bg-amber-900/10 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-amber-400">Groundedness — Active Optimization Target</p>
                  <p className="text-xs text-gray-400">The system occasionally adds context beyond what the retrieved chunks strictly support — drawing on general LLM knowledge rather than staying purely within the Atlas documentation. We are actively tightening the RAG system prompt and context framing to constrain answers to retrieved content only.</p>
                </div>

                <div className="rounded-lg bg-gray-800/60 border border-gray-700 px-4 py-3">
                  <p className="text-xs text-gray-500">Scores reflect the RAG pipeline serving <span className="font-mono">/ask</span>, <span className="font-mono">/learn</span>, and <span className="font-mono">/knowledge</span>. TrueLens evaluations are re-run after every major knowledge base update.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security disclosure — top right of header */}
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

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-2xl font-semibold text-white">Welcome to Atlas Learning Platform</h2>
            <p className="text-gray-400 mt-2">Your AI-powered guide to Varonis Atlas AI Security</p>
          </div>

          {/* What's New banner */}
          <div className="rounded-xl border border-emerald-700/50 bg-emerald-900/10 px-5 py-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">What&apos;s New</span>
              <span className="text-xs text-gray-600">—</span>
              <span className="text-xs text-gray-500">July 2026</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2.5">
                <p className="text-xs font-semibold text-white mb-1">📄 Atlas v3.6.0 Docs</p>
                <p className="text-xs text-gray-400">Knowledge base updated — Require Approval, Agent Manifest, Salesforce Agentforce, MCP credentials, AI SPM Sensitive Data policies.</p>
              </div>
              <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2.5">
                <p className="text-xs font-semibold text-white mb-1">📚 3 New Lessons</p>
                <p className="text-xs text-gray-400">Agent Manifest & Governance, AI TPRM, and AI SPM Sensitive Data Policies — plus L23 rewritten for v3.6.0.</p>
              </div>
              <div className="rounded-lg bg-gray-800/60 border border-gray-700/60 px-3 py-2.5">
                <p className="text-xs font-semibold text-white mb-1">🎯 Agentic Demo Expanded</p>
                <p className="text-xs text-gray-400">Three live sub-demos: AI Deal Research, Red Team Attack Agent, and MCP Quarantine — all fire through Atlas Gateway.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link
              href="/demo"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-emerald-500 rounded-2xl p-6 transition-all group col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Demo Center</h3>
                  <p className="text-sm text-gray-400">
                    Provision Atlas demo environments in one click. Run live agentic demos through Atlas Gateway — AI Deal Research, Red Team Attack Agent, and MCP Quarantine.
                  </p>
                </div>
                <p className="text-xs text-emerald-400 group-hover:text-emerald-300 shrink-0">
                  3 live demos · Live Gateway →
                </p>
              </div>
            </Link>

            <Link
              href="/atlas-mcp"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-indigo-500 rounded-2xl p-6 transition-all group col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">⚡</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">Atlas MCP App Gallery</h3>
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-900/40 border border-indigo-700/50 rounded px-1.5 py-0.5">LIVE ATLAS DATA</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    3 working apps built on the Atlas REST API — AI Risk Briefing, LLM Endpoint Audit, and Shadow AI Report. Real tenant data, real AI insights.
                  </p>
                </div>
                <p className="text-xs text-indigo-400 group-hover:text-indigo-300 shrink-0">
                  Live Atlas data · 3 apps →
                </p>
              </div>
            </Link>

            <Link
              href="/learn"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📚</div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-white">Learn Atlas</h3>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-900/40 border border-emerald-700/50 rounded px-1.5 py-0.5">NEW: Coding Agents</span>
              </div>
              <p className="text-sm text-gray-400">
                Structured course covering Atlas fundamentals — Beginner, Intermediate, and Advanced tiers. Now includes a Coding Agents tier covering hooks, fleet deployment, IBAC, and Atlas MCP Server.
              </p>
              <p className="text-xs text-blue-400 mt-4 group-hover:text-blue-300">
                31 lessons · 3 tiers →
              </p>
            </Link>

            <Link
              href="/meeting"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-white mb-1">Meeting Readiness</h3>
              <p className="text-sm text-gray-400">
                Prep for customer meetings. Upload screenshots, RFPs, and architecture diagrams for targeted help.
              </p>
              <p className="text-xs text-orange-400 mt-4 group-hover:text-orange-300">
                Attach files · Multi-model · Session memory →
              </p>
            </Link>

            <Link
              href="/ask"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">💬</div>
              <h3 className="font-semibold text-white mb-1">Ask a Question</h3>
              <p className="text-sm text-gray-400">
                Free-form Q&A about Atlas configuration, policies, and API endpoints.
              </p>
              <p className="text-xs text-blue-400 mt-4 group-hover:text-blue-300">
                RAG-powered · Ask anything →
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link
              href="/architect"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">🏗️</div>
              <h3 className="font-semibold text-white mb-1">Architecture Builder</h3>
              <p className="text-sm text-gray-400">
                Describe the customer environment and generate a full reference architecture diagram with Atlas overlaid.
              </p>
              <p className="text-xs text-cyan-400 mt-4 group-hover:text-cyan-300">
                Mermaid diagram · Narrative · Export PDF →
              </p>
            </Link>

            <Link
              href="/guides"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-violet-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-semibold text-white mb-1">Technical Guide Producer</h3>
              <p className="text-sm text-gray-400">
                Generate polished Atlas technical guides — MCP, Gateway, compliance, or custom problem-solution write-ups.
              </p>
              <p className="text-xs text-violet-400 mt-4 group-hover:text-violet-300">
                5 guide types · Internal or customer-facing · Export PDF →
              </p>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link
              href="/runtime"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-500 rounded-2xl p-6 transition-all group col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🚦</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">AI Runtime Demo</h3>
                  <p className="text-sm text-gray-400">
                    Simulate real AI traffic through Atlas Gateway — fire prompts, trigger guardrails, and show policy enforcement live in Atlas Runtime.
                  </p>
                </div>
                <p className="text-xs text-red-400 group-hover:text-red-300 shrink-0">
                  Live Gateway · Policy enforcement →
                </p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link
              href="/knowledge"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-teal-500 rounded-2xl p-6 transition-all group col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">💡</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">SME Knowledge Base</h3>
                  <p className="text-sm text-gray-400">
                    Field-validated Q&A from the AI Security SME Teams channel — deployment gotchas, competitive intel, roadmap, licensing, and more.
                  </p>
                </div>
                <p className="text-xs text-teal-400 group-hover:text-teal-300 shrink-0">
                  118 entries · SME-first chat →
                </p>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/resources"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-amber-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📁</div>
              <h3 className="font-semibold text-white mb-1">Resource Library</h3>
              <p className="text-sm text-gray-400">
                Competitive decks, case studies, datasheets, and Field Friday Q&A from Highspot.
              </p>
              <p className="text-xs text-amber-400 mt-4 group-hover:text-amber-300">
                Browsable · Searchable →
              </p>
            </Link>

            <Link
              href="/analytics"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold text-white mb-1">Interaction Analytics</h3>
              <p className="text-sm text-gray-400">Session trends, answer quality scores, knowledge base gaps by industry and meeting type.</p>
              <p className="text-xs text-purple-400 mt-4 group-hover:text-purple-300">View dashboard →</p>
            </Link>
          </div>


        </div>
      </main>
    </div>
  );
}
