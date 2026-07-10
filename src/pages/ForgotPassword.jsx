import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to request password reset");
      }

      setMessage(data.message || "Instructions sent. Please check your inbox.");
    } catch (err) {
      setError(err?.message || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col justify-center items-center px-4">
      {/* Background graphics */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/background.JPG')] bg-cover bg-center bg-fixed bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.32)_0%,rgba(0,0,0,0.60)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_30%,rgba(141,205,228,0.07)_0%,transparent_38%)]" />

      <Navbar />

      <main className="relative z-10 w-full max-w-[28rem] mt-24">
        <GlassCard className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8dcde4] shadow-[0_8px_20px_rgba(0,0,0,0.18)] mb-3">
              <KeyRound className="h-5 w-5" />
            </span>
            <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
              Reset Password
            </h1>
            <p className="mt-1.5 text-xs text-white/52">
              We'll send you instructions to reset your password
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                <Mail className="h-3 w-3" /> Email Address
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
              />
            </label>

            {error && (
              <p className="text-xs text-red-400 mt-1">
                {error}
              </p>
            )}

            {message && (
              <p className="text-xs text-emerald-400 mt-1">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] py-3.5 text-[0.9rem] font-semibold text-[#081a22] shadow-[0_8px_20px_rgba(112,152,174,0.18)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Requesting..." : "Send Reset Instructions"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/44">
            <Link to="/auth?tab=login" className="inline-flex items-center gap-1.5 text-[#8dcde4] hover:underline font-semibold">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </Link>
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
