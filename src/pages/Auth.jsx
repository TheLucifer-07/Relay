import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Mail, Lock, User, Sparkles, Eye, EyeOff } from "lucide-react";
import Navbar from "../components/Navbar";
import GlassCard from "../components/ui/GlassCard";
import { useRelay } from "../context/RelayContext";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, authLoading, authError } = useRelay();

  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem("relay-remember-me") !== "false";
  });
  
  const [loginForm, setLoginForm] = useState(() => {
    const rememberedEmail = localStorage.getItem("relay-remember-email") || "";
    return { email: rememberedEmail, password: "" };
  });

  const [signupForm, setSignupForm] = useState({ displayName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Watch URL params to set active tab
  useEffect(() => {
    const tab = searchParams.get("tab");
    setTimeout(() => {
      if (tab === "signup" || tab === "register") {
        setActiveTab("signup");
      } else {
        setActiveTab("login");
      }
    }, 0);
  }, [searchParams]);

  // Compute password criteria dynamically as user types in signup password
  const password = signupForm.password;
  const passwordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

  const strengthCount = Object.values(passwordCriteria).filter(Boolean).length;
  const getStrengthLabel = () => {
    if (password.length === 0) return "Not Entered";
    if (strengthCount <= 2) return "Weak";
    if (strengthCount <= 4) return "Fair";
    return "Strong";
  };
  
  const getStrengthColor = () => {
    if (strengthCount <= 2) return "bg-red-500";
    if (strengthCount <= 4) return "bg-amber-400";
    return "bg-emerald-500";
  };

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await signInWithEmail(loginForm.email, loginForm.password);
      
      // Save Remember Me email
      if (rememberMe) {
        localStorage.setItem("relay-remember-me", "true");
        localStorage.setItem("relay-remember-email", loginForm.email);
      } else {
        localStorage.setItem("relay-remember-me", "false");
        localStorage.removeItem("relay-remember-email");
      }
      
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Invalid email or password");
    }
  }

  async function handleSignupSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isPasswordValid) {
      setError("Please satisfy all password criteria requirements.");
      return;
    }

    try {
      await signUpWithEmail(signupForm.email, signupForm.password, signupForm.displayName);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Failed to create account. Please try again.");
    }
  }

  async function handleGoogleLogin() {
    setError("");
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Google authentication was interrupted");
    }
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col justify-center items-center px-4 py-16">
      {/* Background graphics */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[url('/background.JPG')] bg-cover bg-center bg-fixed bg-no-repeat" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(2,8,14,0.32)_0%,rgba(0,0,0,0.60)_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_30%,rgba(141,205,228,0.07)_0%,transparent_38%)]" />

      <Navbar />

      <main className="relative z-10 w-full max-w-[28rem] mt-20">
        <GlassCard className="p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.36)] bg-[linear-gradient(180deg,rgba(14,24,37,0.52)_0%,rgba(6,12,20,0.42)_100%)]">
          <div className="text-center mb-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#8dcde4] shadow-[0_8px_20px_rgba(0,0,0,0.18)] mb-3 animate-pulse">
              {activeTab === "login" ? <ShieldCheck className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
            </span>
            <h1 className="font-serif text-2xl font-medium tracking-tight text-white">
              {activeTab === "login" ? "Welcome Back" : "Get Started"}
            </h1>
            <p className="mt-1.5 text-xs text-white/52">
              {activeTab === "login" ? "Sign in to manage your local exchanges" : "Create an account to join the direct barter network"}
            </p>
          </div>

          {/* Switch tabs */}
          <div className="grid grid-cols-2 gap-2 rounded-[1rem] border border-white/[0.07] bg-white/[0.03] p-1.5 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab("login"); setError(""); }}
              className={`relative rounded-[0.8rem] py-2.5 text-[0.82rem] font-semibold transition-all ${
                activeTab === "login" ? "bg-white/[0.09] text-white shadow-sm" : "text-white/44 hover:text-white/74"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("signup"); setError(""); }}
              className={`relative rounded-[0.8rem] py-2.5 text-[0.82rem] font-semibold transition-all ${
                activeTab === "signup" ? "bg-white/[0.09] text-white shadow-sm" : "text-white/44 hover:text-white/74"
              }`}
            >
              Create Account
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                  <Mail className="h-3 w-3" /> Email Address
                </span>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((curr) => ({ ...curr, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                />
              </label>

              <label className="block relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                    <Lock className="h-3 w-3" /> Password
                  </span>
                  <Link to="/forgot-password" className="text-[0.72rem] text-[#8dcde4] hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((curr) => ({ ...curr, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] pl-4 pr-11 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/34 hover:text-white/60 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </label>

              {/* Remember Me Toggle */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#8dcde4] outline-none accent-[#8dcde4] transition-all"
                  />
                  <span className="text-[0.78rem] text-white/54 hover:text-white/80">Remember me</span>
                </label>
              </div>

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
                {authLoading ? "Signing in..." : "Sign In"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                  <User className="h-3 w-3" /> Full Name
                </span>
                <input
                  type="text"
                  required
                  value={signupForm.displayName}
                  onChange={(e) => setSignupForm((curr) => ({ ...curr, displayName: e.target.value }))}
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
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((curr) => ({ ...curr, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] px-4 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                />
              </label>

              <label className="block relative">
                <span className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#9ec1d0]">
                  <Lock className="h-3 w-3" /> Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((curr) => ({ ...curr, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full rounded-[1rem] border border-white/[0.09] bg-white/[0.04] pl-4 pr-11 py-3 text-[0.9rem] text-white outline-none placeholder-white/28 transition-all focus:border-white/20 focus:bg-white/[0.06]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/34 hover:text-white/60 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </label>

              {/* Password strength meter */}
              {password.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex justify-between text-[0.68rem] text-white/44">
                    <span>Password Strength</span>
                    <span className="font-semibold text-white/70">{getStrengthLabel()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden flex gap-1">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <div
                        key={idx}
                        className={`h-full flex-1 transition-all duration-300 ${
                          idx <= strengthCount ? getStrengthColor() : "bg-white/[0.03]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Password checklist visual cues */}
              <div className="rounded-[1rem] bg-white/[0.02] border border-white/[0.06] p-3 space-y-1.5 text-[0.75rem]">
                <p className="text-white/44 uppercase font-bold text-[0.62rem] tracking-wider mb-2">Password Requirements</p>
                <div className="grid grid-cols-2 gap-1.5 text-white/54">
                  <span className={`flex items-center gap-1.5 ${passwordCriteria.length ? "text-emerald-400 font-semibold" : ""}`}>
                    {passwordCriteria.length ? "✓" : "○"} 8+ Characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${passwordCriteria.uppercase ? "text-emerald-400 font-semibold" : ""}`}>
                    {passwordCriteria.uppercase ? "✓" : "○"} 1 Uppercase Letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${passwordCriteria.lowercase ? "text-emerald-400 font-semibold" : ""}`}>
                    {passwordCriteria.lowercase ? "✓" : "○"} 1 Lowercase Letter
                  </span>
                  <span className={`flex items-center gap-1.5 ${passwordCriteria.digit ? "text-emerald-400 font-semibold" : ""}`}>
                    {passwordCriteria.digit ? "✓" : "○"} 1 Number
                  </span>
                  <span className={`flex items-center gap-1.5 col-span-2 ${passwordCriteria.specialChar ? "text-emerald-400 font-semibold" : ""}`}>
                    {passwordCriteria.specialChar ? "✓" : "○"} 1 Special Character (@, $, !, %, *, ?, &)
                  </span>
                </div>
              </div>

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
            </form>
          )}

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/[0.06]"></div>
            <span className="flex-shrink mx-4 text-[0.68rem] text-white/34 uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-white/[0.06]"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full rounded-full border border-white/8 bg-white/4 py-3 text-xs font-semibold text-white/80 transition-all hover:bg-white/8 hover:text-white"
          >
            Continue with Google
          </button>
        </GlassCard>
      </main>
    </div>
  );
}
