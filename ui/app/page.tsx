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

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/learn"
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500 rounded-2xl p-6 transition-all group"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-white mb-1">Learn Atlas</h3>
              <p className="text-sm text-gray-400">
                Structured beginner course covering Atlas fundamentals — step by step.
              </p>
              <p className="text-xs text-blue-400 mt-4 group-hover:text-blue-300">
                6 lessons · Beginner tier →
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
        </div>
      </main>
    </div>
  );
}
