"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  FileText,
} from "lucide-react";

export default function ItrFilingsPage() {
  const [filings, setFilings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    itrProfileId: "",
    acknowledgementNo: "",
    eFilingDate: new Date().toISOString().split("T")[0],
    status: "FILED",
  });

  const fetchFilings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/income-tax/filings");
      const data = await res.json();
      if (res.ok) setFilings(data.filings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const res = await fetch("/api/income-tax/profiles");
      const data = await res.json();
      const list = data.profiles || [];
      setProfiles(list);
      if (list.length > 0 && !form.itrProfileId) {
        setForm((prev) => ({ ...prev, itrProfileId: list[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFilings();
    fetchProfiles();
  }, []);

  const handleRecordFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setRecording(true);

    try {
      const res = await fetch("/api/income-tax/filings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to record filing");
        setRecording(false);
        return;
      }

      setModalOpen(false);
      setForm({
        itrProfileId: profiles[0]?.id || "",
        acknowledgementNo: "",
        eFilingDate: new Date().toISOString().split("T")[0],
        status: "FILED",
      });
      fetchFilings();
    } catch {
      setFormError("Network error while recording filing.");
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/income-tax/profiles" className="hover:underline">Income Tax</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Filing Status Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            ITR-1 to ITR-7 Statutory Filings Tracker
          </h1>
          <p className="text-xs text-slate-500">
            E-filing acknowledgement numbers (ITR-V), verification dates, and client sign-off records.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Record E-Filing Acknowledgement
        </button>
      </div>

      {/* Filings Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading statutory filings...</div>
        ) : filings.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No e-filings recorded yet. Create an ITR profile and record submission acknowledgement.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Client Name & PAN</th>
                  <th className="py-3 px-4">ITR Form</th>
                  <th className="py-3 px-4">Assessment Year</th>
                  <th className="py-3 px-4">Acknowledgement No (ITR-V)</th>
                  <th className="py-3 px-4">E-Filing Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">CA Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filings.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#17365D] block">
                        {f.itrProfile?.client?.name}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {f.itrProfile?.client?.pan}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {f.itrProfile?.itrForm.replace("_", "-")}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      AY {f.itrProfile?.assessmentYear}
                    </td>

                    <td className="py-3 px-4 font-mono font-semibold text-emerald-800">
                      {f.acknowledgementNo || "Pending Filing"}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {f.eFilingDate ? formatDate(f.eFilingDate) : "-"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          f.status === "FILED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {f.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        CA Verified
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Acknowledgement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Record ITR Acknowledgement</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordFiling} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Client ITR Profile *</label>
                <select
                  required
                  value={form.itrProfileId}
                  onChange={(e) => setForm({ ...form, itrProfileId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {profiles.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.client?.name} (AY {p.assessmentYear} - {p.itrForm})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ITR-V Acknowledgement Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 981273948123984"
                  value={form.acknowledgementNo}
                  onChange={(e) => setForm({ ...form, acknowledgementNo: e.target.value })}
                  className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">E-Filing Date *</label>
                  <input
                    type="date"
                    required
                    value={form.eFilingDate}
                    onChange={(e) => setForm({ ...form, eFilingDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Filing Status *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold"
                  >
                    <option value="FILED">Filed on Portal</option>
                    <option value="E_VERIFIED">e-Verified via Aadhaar OTP</option>
                    <option value="PROCESSED">Processed with Intimation 143(1)</option>
                  </select>
                </div>
              </div>

              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recording}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded transition-colors disabled:opacity-50"
                >
                  {recording ? "Saving..." : "Record Acknowledgement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
