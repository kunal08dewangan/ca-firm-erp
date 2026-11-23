"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileSpreadsheet,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldAlert,
} from "lucide-react";

export default function GstPurchasesPage() {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    gstRegistrationId: "",
    supplierName: "",
    supplierGstin: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    placeOfSupply: "07",
    taxableAmount: 50000,
    gstRate: 18,
    itcEligibility: "INPUTS",
    itemDescription: "",
    gstr2bPeriod: "102026",
    isRcm: false,
  });

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gst/purchases");
      const data = await res.json();
      if (res.ok) setPurchases(data.purchases || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/clients?limit=50");
      const data = await res.json();
      const allRegs = data.clients?.flatMap((c: any) =>
        c.businesses?.flatMap((b: any) =>
          b.gstRegistrations.map((g: any) => ({
            ...g,
            clientName: c.name,
          }))
        )
      ) || [];
      setRegistrations(allRegs);
      if (allRegs.length > 0 && !form.gstRegistrationId) {
        setForm((prev) => ({ ...prev, gstRegistrationId: allRegs[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchRegistrations();
  }, []);

  const handleCreatePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const res = await fetch("/api/gst/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to record purchase entry");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      setForm({
        gstRegistrationId: registrations[0]?.id || "",
        supplierName: "",
        supplierGstin: "",
        invoiceNumber: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        placeOfSupply: "07",
        taxableAmount: 50000,
        gstRate: 18,
        itcEligibility: "INPUTS",
        itemDescription: "",
        gstr2bPeriod: "102026",
        isRcm: false,
      });
      fetchPurchases();
    } catch {
      setFormError("Network error while recording purchase entry.");
    } finally {
      setCreating(false);
    }
  };

  const totalEligibleItc = purchases
    .filter((p) => p.itcEligibility !== "INELIGIBLE_17_5")
    .reduce((acc, p) => acc + (p.cgstAmount + p.sgstAmount + p.igstAmount), 0);

  const totalBlockedItc = purchases
    .filter((p) => p.itcEligibility === "INELIGIBLE_17_5")
    .reduce((acc, p) => acc + (p.cgstAmount + p.sgstAmount + p.igstAmount), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">GST Management</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Inward Purchase Register</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Purchase Register & ITC Eligibility Tracker
          </h1>
          <p className="text-xs text-slate-500">
            Automatic screening of Section 17(5) blocked credits and GSTR-2B matching status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/gst/export?type=purchases"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </a>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Purchase Voucher
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Purchase Value</span>
          <span className="text-xl font-bold text-slate-800">
            {formatCurrency(purchases.reduce((acc, p) => acc + p.totalAmount, 0))}
          </span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold block">Eligible Input Tax Credit (ITC)</span>
          <span className="text-xl font-bold text-emerald-700">{formatCurrency(totalEligibleItc)}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-rose-700 font-semibold block">Blocked ITC u/s 17(5) (Ineligible)</span>
          <span className="text-xl font-bold text-rose-700">{formatCurrency(totalBlockedItc)}</span>
        </div>
      </div>

      {/* Purchase Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading purchase register...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Invoice No & Date</th>
                  <th className="py-3 px-4">Supplier Name & GSTIN</th>
                  <th className="py-3 px-4 text-right">Taxable (₹)</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-right">CGST</th>
                  <th className="py-3 px-4 text-right">SGST</th>
                  <th className="py-3 px-4 text-right">IGST</th>
                  <th className="py-3 px-4">ITC Classification</th>
                  <th className="py-3 px-4">2B Match</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchases.map((p) => {
                  const isBlocked = p.itcEligibility === "INELIGIBLE_17_5";

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                        {p.invoiceNumber}
                        <span className="block text-[11px] text-slate-400 font-normal">
                          {formatDate(p.invoiceDate)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{p.supplierName}</span>
                        <span className="block font-mono text-[11px] text-slate-400">
                          {p.supplierGstin}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium">
                        {formatCurrency(p.taxableAmount)}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-600">{p.gstRate}%</td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {p.cgstAmount > 0 ? formatCurrency(p.cgstAmount) : "-"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-600">
                        {p.sgstAmount > 0 ? formatCurrency(p.sgstAmount) : "-"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[#2563EB]">
                        {p.igstAmount > 0 ? formatCurrency(p.igstAmount) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                            <ShieldAlert className="w-3 h-3" />
                            BLOCKED Sec 17(5)
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                            {p.itcEligibility}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.isMatched2B
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.isMatched2B ? "MATCHED (2B)" : "UNMATCHED"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Purchase Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Record Purchase Voucher</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePurchase} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Recipient GSTIN *</label>
                <select
                  required
                  value={form.gstRegistrationId}
                  onChange={(e) => setForm({ ...form, gstRegistrationId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {registrations.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.gstin} - {r.tradeName} ({r.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier Trade Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="AWS Cloud India Pvt Ltd"
                    value={form.supplierName}
                    onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier 15-digit GSTIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="07AAACA4444N1Z3"
                    value={form.supplierGstin}
                    onChange={(e) => setForm({ ...form, supplierGstin: e.target.value.toUpperCase() })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Supplier Invoice Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="INV-99231"
                    value={form.invoiceNumber}
                    onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Invoice Date *</label>
                  <input
                    type="date"
                    required
                    value={form.invoiceDate}
                    onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Taxable Value (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={form.taxableAmount}
                    onChange={(e) => setForm({ ...form, taxableAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">GST Rate (%) *</label>
                  <select
                    value={form.gstRate}
                    onChange={(e) => setForm({ ...form, gstRate: parseInt(e.target.value, 10) })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white font-bold"
                  >
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">ITC Eligibility *</label>
                  <select
                    value={form.itcEligibility}
                    onChange={(e) => setForm({ ...form, itcEligibility: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                  >
                    <option value="INPUTS">Inputs</option>
                    <option value="INPUT_SERVICES">Input Services</option>
                    <option value="CAPITAL_GOODS">Capital Goods</option>
                    <option value="INELIGIBLE_17_5">Ineligible Sec 17(5) Blocked</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Item Description (Automatic Section 17(5) Screen)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Hosting, Motor Car, Food Catering..."
                  value={form.itemDescription}
                  onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
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
                  {creating ? "Saving..." : "Record Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
