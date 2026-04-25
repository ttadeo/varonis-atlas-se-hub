"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("code");
      } else {
        setError(data.error ?? "Failed to send code");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(from);
      } else {
        setError(data.error ?? "Verification failed");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-semibold text-white text-lg">Atlas Learning Platform</h1>
            <p className="text-xs text-gray-400">Varonis Atlas AI Security — Internal SE Tool</p>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-8">
          {step === "email" ? (
            <>
              <h2 className="text-sm font-semibold text-gray-300 mb-2 text-center">Sign in with your Varonis email</h2>
              <p className="text-xs text-gray-500 mb-6 text-center">We'll send a 6-digit code to your inbox</p>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Varonis Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                    placeholder="you@varonis.com"
                    autoComplete="email"
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors mt-2"
                >
                  {loading ? "Sending…" : "Send Code"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-sm font-semibold text-gray-300 mb-2 text-center">Check your email</h2>
              <p className="text-xs text-gray-500 mb-6 text-center">
                We sent a 6-digit code to <span className="text-gray-300">{email}</span>
              </p>

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">6-Digit Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500 tracking-widest text-center font-mono"
                    placeholder="000000"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors mt-2"
                >
                  {loading ? "Verifying…" : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={() => { setStep("email"); setCode(""); setError(""); }}
                  className="w-full text-gray-500 hover:text-gray-300 text-xs py-2 transition-colors"
                >
                  Use a different email
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Access is restricted to Varonis SE team members.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
