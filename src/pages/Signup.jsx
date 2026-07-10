import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight, Mail, Lock, User } from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import { useRelay } from "../context/RelayContext";

export default function Signup() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, authLoading, authError } = useRelay();
  const [form, setForm] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await signUpWithEmail(form.email, form.password, form.displayName);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Failed to create account. Please try again.");
    }
  }

  async function handleGoogleSignup() {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Google signup was interrupted");
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
              <Sparkles className="h-5 w-5" />
            </span>
            <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
              Create Account
            </h1>
            <p className="mt-1.5 text-xs text-white/52">
              Join Relay and start exchanging resources
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                <User className="h-3 w-3" /> Full Name
              </span>
              <input
                type="text"
                required
                value={form.displayName}
                onChange={(e) => setForm((curr) => ({ ...curr, displayName: e.target.value }))}
                placeholder="Ananya Rao"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                <Mail className="h-3 w-3" /> Email Address
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((curr) => ({ ...curr, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                <Lock className="h-3 w-3" /> Password (min 6 chars)
              </span>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((curr) => ({ ...curr, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
              />
            </label>

            {(error || authError) && (
              <p className="text-xs text-red-400 mt-1">
                {error || authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/22 bg-gradient-to-r from-[#eef6fa] via-[#c4d9e3] to-[#8eb1c0] py-3.5 text-[0.9rem] font-semibold text-[#081a22] shadow-[0_8px_20px_rgba(112,152,174,0.18)] transition-all hover:opacity-90 disabled:opacity-50"
            >
              {authLoading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.06]"></div>
              <span className="flex-shrink mx-4 text-[0.68rem] text-white/34 uppercase tracking-wider">or</span>
              <div className="flex-grow border-t border-white/[0.06]"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full rounded-full border border-white/8 bg-white/4 py-3 text-xs font-semibold text-white/80 transition-all hover:bg-white/8 hover:text-white"
            >
              Sign up with Google
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/44">
            Already have an account?{" "}
            <Link to="/login" className="text-[#8dcde4] hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </GlassCard>
      </main>
    </div>
  );
}
