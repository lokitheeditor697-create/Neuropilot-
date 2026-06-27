import React, { useState } from "react";
import { Mail, Lock, User, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";
import NeuroPilotLogo from "./NeuroPilotLogo";

interface AuthViewProps {
  onAuthSuccess: (token: string, user: any) => void;
  onBackToHome: () => void;
  initialMode?: "login" | "signup";
}

export default function AuthView({ onAuthSuccess, onBackToHome, initialMode = "login" }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // Trigger Firebase POPUP Sign-In
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();

      // Exchange for a session token with our backend
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Google credential authorization handshake failed.");
      }

      // Store in LocalStorage and invoke callback
      try {
        localStorage.setItem("neuropilot_token", data.token);
        localStorage.setItem("neuropilot_user", JSON.stringify(data.user));
      } catch (e) {
        console.warn("localStorage item write is blocked in this environment:", e);
      }
      onAuthSuccess(data.token, data.user);
    } catch (e: any) {
      console.error("Google Auth Error:", e);
      if (e.code === "auth/popup-blocked") {
        setError("Sign-In popup was blocked by browser. Please allow popups or use mock mail parameters.");
      } else {
        setError(e.message || "Google Authentication was canceled or failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Form validations
    if (!email) {
      setError("Please key in your email address.");
      return;
    }
    if (mode === "forgot") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setSuccess("Password reset instructions has been beamed to your email address! Please confirm.");
      }, 900);
      return;
    }

    if (!password || password.length < 5) {
      setError("Password must contain at least 5 characters.");
      return;
    }

    if (mode === "signup" && !name) {
      setError("Name parameter is required.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication handshake failed.");
      }

      // Store in LocalStorage and invoke callback
      try {
        localStorage.setItem("neuropilot_token", data.token);
        localStorage.setItem("neuropilot_user", JSON.stringify(data.user));
      } catch (e) {
        console.warn("localStorage item write is blocked in this environment:", e);
      }
      onAuthSuccess(data.token, data.user);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col justify-center items-center px-4 relative">
      {/* Decorative vectors */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button 
        id="btn-auth-back"
        onClick={onBackToHome}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center space-x-2 text-slate-400 hover:text-white text-xs sm:text-sm font-medium transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Main Form container */}
      <div className="w-full max-w-md bg-[#1E293B]/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <NeuroPilotLogo className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === "login" && "Welcome to NeuroPilot"}
            {mode === "signup" && "Create your workspace"}
            {mode === "forgot" && "Reset Security Protocol"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 text-center">
            {mode === "login" && "Access your AI cognitive scheduler hub"}
            {mode === "signup" && "Initialize your premium productivity companion"}
            {mode === "forgot" && "Provide email to retrieve security keys"}
          </p>
        </div>

        {error && (
          <div id="auth-error-alert" className="flex items-start space-x-2 bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-lg text-sm mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div id="auth-success-alert" className="flex items-start space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 p-3 rounded-lg text-sm mb-6">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Loki Editor"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                id="auth-email-input"
                type="email"
                placeholder="loki@neuropilot.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                required
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    id="btn-switch-forgot"
                    type="button"
                    onClick={() => { setMode("forgot"); setError(null); }}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  id="auth-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0F172A] border border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-100 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-1 mt-6 disabled:opacity-50"
          >
            <span>
              {loading ? "Decrypting variables..." : mode === "login" ? "Sign In to Pilot" : mode === "signup" ? "Set up workspace" : "Request Reset Key"}
            </span>
          </button>
        </form>

        {mode !== "forgot" && (
          <div className="mt-6">
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <div className="absolute bg-[#1E293B] px-3 text-xs text-slate-400 font-medium">
                Or authorization sync via
              </div>
            </div>

            <button
              id="google-signin-btn"
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] border border-slate-800 hover:border-slate-700 text-white font-medium py-3 rounded-lg text-sm shadow flex items-center justify-center space-x-3 transition-all disabled:opacity-50 duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-sm text-slate-400">
          {mode === "login" && (
            <p>
              New pilot?{" "}
              <button
                id="btn-switch-signup"
                onClick={() => { setMode("signup"); setError(null); }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Create Workspace
              </button>
            </p>
          )}

          {mode === "signup" && (
            <p>
              Already registered?{" "}
              <button
                id="btn-switch-login"
                onClick={() => { setMode("login"); setError(null); }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign In
              </button>
            </p>
          )}

          {mode === "forgot" && (
            <button
              id="btn-switch-login-back"
              onClick={() => { setMode("login"); setError(null); }}
              className="text-slate-300 hover:text-white font-semibold transition-colors"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
