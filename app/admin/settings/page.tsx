"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  Database,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  History,
  Activity,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const [admin, setAdmin] = useState<any | null>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter
  const [actionFilter, setActionFilter] = useState("ALL");
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchSettingsAndLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "ALL") params.append("action", actionFilter);

      const res = await fetch(`/api/settings/audit-logs?${params.toString()}`);
      const data = await res.json();
      if (data.admin) setAdmin(data.admin);
      if (data.logs) setLogs(data.logs);
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsAndLogs();
  }, [actionFilter]);

  const handleToggle2FA = async () => {
    if (!admin) return;
    const newStatus = !admin.twoFactorEnabled;
    setUpdating(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/settings/audit-logs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update 2FA status");

      setAdmin((prev: any) => ({ ...prev, twoFactorEnabled: newStatus }));
      setFeedback({
        type: "success",
        text: `Two-Factor Authentication (2FA) ${newStatus ? "enabled" : "disabled"} successfully.`,
      });
      fetchSettingsAndLogs();
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-[#17365D]">System Security &amp; Firm Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          ICAI practice credentials, cryptographic session configuration, and tamper-evident audit logs.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg border flex items-center justify-between text-sm ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Grid: Admin Credentials + Security Safeguards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CA Administrator Profile */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#17365D]" />
              <h2 className="text-base font-bold text-[#17365D]">Chartered Accountant Profile</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ICAI Fellow (FCA)
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Practicing CA</span>
              <p className="font-bold text-slate-900 text-base">{admin?.fullName || "CA Vikramaditya Singhania"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ICAI M.No</span>
                <p className="font-mono font-bold text-slate-800">{admin?.membershipNo || "084920"}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Firm Reg. No</span>
                <p className="font-mono font-bold text-slate-800">019482N</p>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Official Email</span>
              <p className="font-mono text-slate-700">{admin?.email || "admin@cafirm.in"}</p>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Primary Role</span>
              <p className="text-slate-700 font-medium">{admin?.role || "CHARTERED_ACCOUNTANT"}</p>
            </div>
          </div>
        </div>

        {/* Security & Authentication Configuration */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-[#17365D]">Authentication Safeguards</h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> High Security
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div>
                <p className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-slate-500 mt-0.5">Time-based one-time passwords (TOTP / SMS OTP)</p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={updating}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition ${
                  admin?.twoFactorEnabled
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                }`}
              >
                {admin?.twoFactorEnabled ? "Enabled" : "Enable 2FA"}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="font-semibold text-slate-700">Cryptographic Storage &amp; Cookies:</p>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <p>• Password: <strong>Bcrypt 12 Rounds</strong></p>
                <p>• Cookie: <strong>HttpOnly, SameSite=Lax</strong></p>
                <p>• Session: <strong>Database-Backed Tokens</strong></p>
                <p>• Rate Limit: <strong>Sliding Window (5 attempts)</strong></p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <p className="font-semibold text-slate-700">ICAI Audit Trail Mandate:</p>
              <p className="text-slate-500 mt-0.5">
                Complies with Section 143(3) of Companies Act, 2013 and SQC 1 immutable event logging.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tamper-Evident Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-[#17365D]">Statutory Audit Trail &amp; Activity Log</h2>
              <p className="text-xs text-slate-500">Every write, approval, and file access event is logged immutably.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filter Action:</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN_SUCCESS">Logins</option>
              <option value="DOCUMENT_UPLOAD">Documents</option>
              <option value="INVOICE_CREATE">Invoicing</option>
              <option value="PAYMENT_RECEIPT">Receipts</option>
              <option value="TASK_CREATE">Tasks</option>
              <option value="SETTINGS_UPDATE">Settings</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-[#17365D] border-t-transparent rounded-full mx-auto mb-2" />
            Loading audit records...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No audit records match the selected action filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Entity Type</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600 font-semibold">{log.module || log.entityType || "SYSTEM"}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 max-w-md truncate" title={log.diff || log.details || ""}>
                      {log.diff || log.details || "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.admin?.fullName || "CA Admin"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
