"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calculator,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function ItrProfilesPage() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAy, setSelectedAy] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    financialYear: "2025-26",
    assessmentYear: "2026-27",
    itrForm: "ITR_1_SAHAJ",
    chosenRegime: "NEW_REGIME_115BAC",
    residentialStatus: "RESIDENT",
    isSeniorCitizen: false,
    grossSalary: 1200000,
    netBusinessProfit: 0,
    rentalIncome: 0,
    otherIncome: 45000,
    deduction80C: 150000,
    deduction80D: 25000,
    tdsPaid: 45000,
    advanceTax: 30000,
  });

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ ay: selectedAy });
      const res = await fetch(`/api/income-tax/profiles?${q.toString()}`);
      const data = await res.json();
      if (res.ok) setProfiles(data.profiles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients?limit=50");
      const data = await res.json();
      const list = data.clients || [];
      setClients(list);
      if (list.length > 0 && !form.clientId) {
        setForm((prev) => ({ ...prev, clientId: list[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    fetchClients();
  }, [selectedAy]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const payload = {
        clientId: form.clientId,
        financialYear: form.financialYear,
        assessmentYear: form.assessmentYear,
        itrForm: form.itrForm,
        chosenRegime: form.chosenRegime,
        residentialStatus: form.residentialStatus,
        isSeniorCitizen: form.isSeniorCitizen,
        income: {
          grossSalary: Number(form.grossSalary),
          netBusinessProfit: Number(form.netBusinessProfit),
          rentalIncome: Number(form.rentalIncome),
          otherIncome: Number(form.otherIncome),
        },
        deductions: {
          section80C: Number(form.deduction80C),
          section80D_Self: Number(form.deduction80D),
        },
        credits: {
          tdsSalary: Number(form.tdsPaid),
          advanceTaxPaid: Number(form.advanceTax),
        },
      };

      const res = await fetch("/api/income-tax/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create ITR profile.");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      fetchProfiles();
    } catch {
      setFormError("Network error while submitting ITR profile.");
    } finally {
      setCreating(false);
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
            <span className="text-[#2563EB] font-medium">Income Tax</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Client ITR Profiles</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Income Tax Client Profiles & Computations
          </h1>
          <p className="text-xs text-slate-500">
            Assessment Year-specific profile management, Old vs New Regime (115BAC) comparative evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/income-tax/computation"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Calculator className="w-3.5 h-3.5 text-[#2563EB]" />
            Live Tax Calculator
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create ITR Profile
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Assessment Year:</span>
          <select
            value={selectedAy}
            onChange={(e) => setSelectedAy(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold text-slate-800"
          >
            <option value="ALL">All Assessment Years</option>
            <option value="2026-27">AY 2026-27 (Current)</option>
            <option value="2025-26">AY 2025-26</option>
            <option value="2024-25">AY 2024-25</option>
          </select>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {profiles.length} Active Profiles
        </span>
      </div>

      {/* Profiles Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading ITR profiles...</div>
        ) : profiles.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No ITR profiles found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Client Name & PAN</th>
                  <th className="py-3 px-4">Assessment Year</th>
                  <th className="py-3 px-4">ITR Form</th>
                  <th className="py-3 px-4 text-right">Taxable Income (New)</th>
                  <th className="py-3 px-4 text-right">Tax Liability (New)</th>
                  <th className="py-3 px-4 text-right">Tax Liability (Old)</th>
                  <th className="py-3 px-4">Optimal Regime</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profiles.map((p) => {
                  const newComp = p.computations?.find((c: any) => c.regime === "NEW_REGIME_115BAC");
                  const oldComp = p.computations?.find((c: any) => c.regime === "OLD_REGIME");
                  const recommended = newComp?.isRecommendedRegime ? "NEW REGIME" : "OLD REGIME";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/clients/${p.client?.id}`}
                          className="font-bold text-[#17365D] hover:text-[#2563EB] hover:underline"
                        >
                          {p.client?.name}
                        </Link>
                        <span className="block font-mono text-[11px] text-slate-400">
                          {p.client?.pan} • {p.client?.clientCode}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-800">
                        AY {p.assessmentYear}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          FY {p.financialYear}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono bg-blue-50 text-[#17365D] border border-blue-200 px-2 py-0.5 rounded font-bold text-[10px]">
                          {p.itrForm.replace("_", "-")}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {newComp ? formatCurrency(newComp.totalTaxableIncome) : "-"}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        {newComp ? formatCurrency(newComp.totalTaxLiability) : "-"}
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {oldComp ? formatCurrency(oldComp.totalTaxLiability) : "-"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          ★ {recommended}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/income-tax/computation?profileId=${p.id}`}
                          className="font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1"
                        >
                          Computation <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create ITR Profile Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Create Client ITR Profile</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Client *</label>
                <select
                  required
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.pan}) - {c.clientCode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Assessment Year *</label>
                  <select
                    value={form.assessmentYear}
                    onChange={(e) => {
                      const ay = e.target.value;
                      const fy = ay === "2026-27" ? "2025-26" : ay === "2025-26" ? "2024-25" : "2023-24";
                      setForm({ ...form, assessmentYear: ay, financialYear: fy });
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold"
                  >
                    <option value="2026-27">AY 2026-27 (FY 2025-26)</option>
                    <option value="2025-26">AY 2025-26 (FY 2024-25)</option>
                    <option value="2024-25">AY 2024-25 (FY 2023-24)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ITR Form Type *</label>
                  <select
                    value={form.itrForm}
                    onChange={(e) => setForm({ ...form, itrForm: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold"
                  >
                    <option value="ITR_1_SAHAJ">ITR-1 (Sahaj - Salaried)</option>
                    <option value="ITR_2">ITR-2 (Capital Gains & Multiple Properties)</option>
                    <option value="ITR_3">ITR-3 (Business & Profession / Partners)</option>
                    <option value="ITR_4_SUGAM">ITR-4 (Sugam - Presumptive 44AD/ADA)</option>
                    <option value="ITR_5">ITR-5 (LLP & Partnership Firms)</option>
                    <option value="ITR_6">ITR-6 (Companies)</option>
                    <option value="ITR_7">ITR-7 (Trusts & Non-Profits)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gross Salary (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    value={form.grossSalary}
                    onChange={(e) => setForm({ ...form, grossSalary: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Net Business Profit (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    value={form.netBusinessProfit}
                    onChange={(e) => setForm({ ...form, netBusinessProfit: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Section 80C Deductions (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    value={form.deduction80C}
                    onChange={(e) => setForm({ ...form, deduction80C: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">TDS Already Deducted (₹)</label>
                  <input
                    type="number"
                    step="1000"
                    value={form.tdsPaid}
                    onChange={(e) => setForm({ ...form, tdsPaid: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
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
                  disabled={creating}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded transition-colors disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Compute & Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
