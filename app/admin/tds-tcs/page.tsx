"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Percent,
  Plus,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
  FileSpreadsheet,
} from "lucide-react";

export default function TdsTcsPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    clientId: "",
    sectionCode: "194J",
    deducteePan: "",
    deducteeName: "",
    paymentDate: new Date().toISOString().split("T")[0],
    taxableAmount: 100000,
    tdsRate: 10,
    quarter: "Q3",
    financialYear: "2026-27",
  });

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tds-tcs");
      const data = await res.json();
      if (res.ok) setEntries(data.entries || []);
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
    fetchEntries();
    fetchClients();
  }, []);

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const res = await fetch("/api/tds-tcs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to record TDS entry");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      fetchEntries();
    } catch {
      setFormError("Network error while recording TDS.");
    } finally {
      setCreating(false);
    }
  };

  const totalDeducted = entries.reduce((acc, e) => acc + (e.tdsDeducted || 0), 0);
  const totalTaxable = entries.reduce((acc, e) => acc + (e.taxableAmount || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">Withholding Taxes</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">TDS & TCS Register</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            TDS & TCS Compliance & Quarterly Returns
          </h1>
          <p className="text-xs text-slate-500">
            Form 24Q (Salary), Form 26Q (Resident Vendor), Form 27Q (Non-Resident), and Form 27EQ (TCS).
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add TDS Deduction
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Base Transaction Value</span>
          <span className="text-xl font-bold text-slate-800">{formatCurrency(totalTaxable)}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total TDS/TCS Deducted</span>
          <span className="text-xl font-bold text-emerald-700">{formatCurrency(totalDeducted)}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Quarterly Filing Status</span>
          <span className="text-xl font-bold text-[#2563EB]">Form 26Q Due (Q3)</span>
        </div>
      </div>

      {/* TDS Entries Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading TDS entries...</div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No TDS entries recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Section</th>
                  <th className="py-3 px-4">Deductee Name & PAN</th>
                  <th className="py-3 px-4">Payment Date</th>
                  <th className="py-3 px-4">Quarter & FY</th>
                  <th className="py-3 px-4 text-right">Taxable Amount (₹)</th>
                  <th className="py-3 px-4 text-center">TDS Rate</th>
                  <th className="py-3 px-4 text-right">TDS Deducted (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {entries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                      Section {e.sectionCode}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{e.deducteeName}</span>
                      <span className="block font-mono text-[11px] text-slate-400">
                        {e.deducteePan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(e.paymentDate)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {e.quarter} • FY {e.financialYear}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {formatCurrency(e.taxableAmount)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {e.tdsRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                      {formatCurrency(e.tdsDeducted)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add TDS Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Record TDS Deduction</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEntry} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deducting Client Entity *</label>
                <select
                  required
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {clients.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.pan})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">TDS Section *</label>
                  <select
                    value={form.sectionCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const rate = code === "194C" ? 1 : code === "194J" ? 10 : code === "194I" ? 10 : 0.1;
                      setForm({ ...form, sectionCode: code, tdsRate: rate });
                    }}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-bold"
                  >
                    <option value="194J">194J (Professional / Tech Fees - 10%)</option>
                    <option value="194C">194C (Contractor - 1% / 2%)</option>
                    <option value="194I">194I (Rent on Land / Building - 10%)</option>
                    <option value="194H">194H (Commission / Brokerage - 5%)</option>
                    <option value="194Q">194Q (Purchase of Goods - 0.1%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">TDS Rate (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={form.tdsRate}
                    onChange={(e) => setForm({ ...form, tdsRate: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Deductee Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={form.deducteeName}
                    onChange={(e) => setForm({ ...form, deducteeName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Deductee PAN *</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="ABCDE1234F"
                    value={form.deducteePan}
                    onChange={(e) => setForm({ ...form, deducteePan: e.target.value.toUpperCase() })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Base Amount (₹) *</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={form.taxableAmount}
                    onChange={(e) => setForm({ ...form, taxableAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
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
                  {creating ? "Saving..." : "Record Deduction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
