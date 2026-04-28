import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
          A
        </div>
        <div>
          <h1 className="font-semibold text-white">Atlas Learning Platform</h1>
          <p className="text-xs text-gray-400">Varonis Atlas AI Security — Internal SE Tool</p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-2xl font-semibold text-white">Welcome to Atlas Learning Platform</h2>
            <p className="text-gray-400 mt-2">Your AI-powered guide to Varonis Atlas AI Security</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Link
              href="/demo"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-emerald-500 rounded-2xl p-6 transition-all group col-span-2"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎯</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Demo Provisioning</h3>
                  <p className="text-sm text-gray-400">
                    Describe the customer use case → Claude matches Atlas templates → provision the demo environment in one click.
                  </p>
                </div>
                <p className="text-xs text-emerald-400 group-hover:text-emerald-300 shrink-0">
                  AI-matched · One-click provision →
                </p>
              </div>
            </Link>

            <Link
              href="/learn"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-white mb-1">Learn Atlas</h3>
              <p className="text-sm text-gray-400">
                Structured course covering Atlas fundamentals across Beginner, Intermediate, and Advanced tiers.
              </p>
              <p className="text-xs text-blue-400 mt-4 group-hover:text-blue-300">
                22 lessons · 3 tiers →
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
