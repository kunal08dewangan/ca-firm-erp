"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, KeyRound, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("from") || "/admin/dashboard";

  const [email, setEmail] = useState("admin@cafirm.in");
  const [password, setPassword] = useState("AdminSecure@CA2026!");
  const [totpCode, setTotpCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotStatus, setForgotStatus] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, totpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Check your credentials.");
        setLoading(false);
        return;
      }

      if (data.requires2FA) {
        setRequires2FA(true);
        setLoading(false);
        return;
      }

      // Successful login
      router.push(returnUrl);
      router.refresh();
    } catch (err) {
      setError("Network or server error during authentication.");
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotStatus(data.message || "Password recovery instructions sent.");
    } catch {
      setForgotStatus("Request failed. Please contact your senior partner.");
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm space-y-6">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Admin Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              disabled={requires2FA}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] pl-9"
              placeholder="admin@cafirm.in"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Password *
            </label>
            <button
              type="button"
              onClick={() => setForgotModal(true)}
              className="text-[11px] text-[#2563EB] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              disabled={requires2FA}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] pl-9"
              placeholder="••••••••••••"
            />
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {requires2FA && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded space-y-2 animate-in fade-in">
            <label className="block text-xs font-bold text-amber-900">
              Two-Factor Authentication (2FA) Code *
            </label>
            <input
              type="text"
              maxLength={6}
              required
              placeholder="6-digit code"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className="w-full text-sm font-mono tracking-widest text-center px-3 py-2 border border-amber-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
            />
            <p className="text-[10px] text-amber-800">
              Enter the 6-digit verification code from your Google Authenticator or registered app.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-300 text-[#17365D] focus:ring-[#2563EB]"
            />
            <span>Remember session for 12 hours</span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-3 rounded shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            "Authenticating..."
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              {requires2FA ? "Verify & Enter ERP" : "Sign In to Admin Workspace"}
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Credentials Pill */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">Pre-Configured CA Admin Account:</p>
        <p>Email: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">admin@cafirm.in</code></p>
        <p>Password: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">AdminSecure@CA2026!</code></p>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-[#17365D]">Recover CA Admin Account</h3>
            <p className="text-xs text-slate-600">
              Enter your registered admin email address. A cryptographic recovery token will be dispatched.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3">
              <input
                type="email"
                required
                placeholder="admin@cafirm.in"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
              {forgotStatus && (
                <p className="text-xs text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                  {forgotStatus}
                </p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotModal(false);
                    setForgotStatus("");
                  }}
                  className="text-xs px-3 py-2 text-slate-600 hover:bg-slate-100 rounded"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="text-xs px-3 py-2 bg-[#17365D] text-white rounded hover:bg-[#2563EB]"
                >
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#F7F9FC]">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#17365D] rounded-xl text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
            DA
          </div>
          <h1 className="text-2xl font-extrabold text-[#17365D] tracking-tight">
            Tax &amp; Practice Management Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Secure, Restricted Access for Authorized Administrators &amp; Staff
          </p>
        </div>

        {/* Security Notification Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-900 flex items-start gap-2">
          <Lock className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
          <span>
            <strong>Security Protocol:</strong> All login sessions are monitored, rate-limited, and recorded in immutable audit logs.
          </span>
        </div>

        {/* Suspense-wrapped form */}
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading secure portal...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center text-xs text-slate-500">
          <Link href="/" className="hover:underline flex items-center justify-center gap-1">
            ← Return to Dewangan &amp; Associates Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
