"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileSpreadsheet,
  Plus,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

export default function GstSalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGstin, setSelectedGstin] = useState("ALL");
  const [selectedPeriod, setSelectedPeriod] = useState("ALL");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    gstRegistrationId: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    invoiceType: "B2B",
    customerName: "",
    customerGstin: "",
    placeOfSupply: "07",
    hsnCode: "998314",
    taxableAmount: 100000,
    gstRate: 18,
    gstr1Period: "102026",
    isRcm: false,
  });

  const fetchSales = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ gstin: selectedGstin, period: selectedPeriod });
      const res = await fetch(`/api/gst/sales?${q.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setSales(data.sales || []);
      }
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
    fetchSales();
    fetchRegistrations();
  }, [selectedGstin, selectedPeriod]);

  const handleCreateSales = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const res = await fetch("/api/gst/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to record sales invoice");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      setForm({
        gstRegistrationId: registrations[0]?.id || "",
        invoiceNumber: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        invoiceType: "B2B",
        customerName: "",
        customerGstin: "",
        placeOfSupply: "07",
        hsnCode: "998314",
        taxableAmount: 100000,
        gstRate: 18,
        gstr1Period: "102026",
        isRcm: false,
      });
      fetchSales();
    } catch {
      setFormError("Network error while recording sales invoice.");
    } finally {
      setCreating(false);
    }
  };

  const totalTaxable = sales.reduce((acc, s) => acc + s.taxableAmount, 0);
  const totalTax = sales.reduce((acc, s) => acc + (s.cgstAmount + s.sgstAmount + s.igstAmount), 0);
  const totalInvoiceVal = sales.reduce((acc, s) => acc + s.totalAmount, 0);

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
            <span className="font-semibold text-slate-700">Outward Sales Register</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            GST Sales Register (GSTR-1 Ready)
          </h1>
          <p className="text-xs text-slate-500">
            Automated Place of Supply tax distribution (CGST/SGST vs IGST) with HSN summary.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/api/gst/export?type=sales"
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
            Add Sales Invoice
          </button>
        </div>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Taxable Value</span>
          <span className="text-xl font-bold text-slate-800">{formatCurrency(totalTaxable)}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Output GST (CGST+SGST+IGST)</span>
          <span className="text-xl font-bold text-[#2563EB]">{formatCurrency(totalTax)}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 block">Total Gross Invoice Value</span>
          <span className="text-xl font-bold text-emerald-700">{formatCurrency(totalInvoiceVal)}</span>
        </div>
      </div>

      {/* Sales Register Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading sales register...</div>
        ) : sales.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No sales entries recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Invoice No & Date</th>
                  <th className="py-3 px-4">Customer Name & GSTIN</th>
                  <th className="py-3 px-4">POS & Supply</th>
                  <th className="py-3 px-4 text-right">Taxable (₹)</th>
                  <th className="py-3 px-4 text-center">Rate</th>
                  <th className="py-3 px-4 text-right">CGST</th>
                  <th className="py-3 px-4 text-right">SGST</th>
                  <th className="py-3 px-4 text-right">IGST</th>
                  <th className="py-3 px-4 text-right">Total Invoice (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                      {s.invoiceNumber}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {formatDate(s.invoiceDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{s.customerName}</span>
                      <span className="block font-mono text-[11px] text-slate-400">
                        {s.customerGstin || "Unregistered (B2C)"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">State {s.placeOfSupply}</span>
                      <span className="block text-[10px] text-slate-500 font-medium">
                        {s.supplyType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {formatCurrency(s.taxableAmount)}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-600">
                      {s.gstRate}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {s.cgstAmount > 0 ? formatCurrency(s.cgstAmount) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {s.sgstAmount > 0 ? formatCurrency(s.sgstAmount) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#2563EB] font-medium">
                      {s.igstAmount > 0 ? formatCurrency(s.igstAmount) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                      {formatCurrency(s.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Sales Entry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Create GST Sales Invoice</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSales} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Supplier GSTIN *</label>
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
                  <label className="block text-xs font-medium text-slate-700 mb-1">Invoice Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="INV-2026-0105"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Cognizant Technologies"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Customer GSTIN (if B2B)</label>
                  <input
                    type="text"
                    maxLength={15}
                    placeholder="27AABCC8989Q1Z2"
                    value={form.customerGstin}
                    onChange={(e) => setForm({ ...form, customerGstin: e.target.value.toUpperCase() })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Place of Supply (POS) *</label>
                  <input
                    type="text"
                    maxLength={2}
                    required
                    placeholder="27 (State Code)"
                    value={form.placeOfSupply}
                    onChange={(e) => setForm({ ...form, placeOfSupply: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Taxable Amount (₹) *</label>
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
                    <option value={0}>0% (Nil / Exempt)</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18% (Standard)</option>
                    <option value={28}>28%</option>
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
                  disabled={creating}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded transition-colors disabled:opacity-50"
                >
                  {creating ? "Posting..." : "Post Sales Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
