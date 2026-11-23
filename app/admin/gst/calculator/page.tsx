"use client";

import { useState } from "react";
import Link from "next/link";
import { calculateGst } from "@/lib/gst-engine";
import { formatCurrency } from "@/lib/utils";
import { Calculator, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function GstCalculatorPage() {
  const [supplierState, setSupplierState] = useState("07");
  const [posState, setPosState] = useState("07");
  const [taxableAmount, setTaxableAmount] = useState(100000);
  const [gstRate, setGstRate] = useState(18);
  const [isRcm, setIsRcm] = useState(false);

  const result = calculateGst({
    supplierStateCode: supplierState,
    placeOfSupplyStateCode: posState,
    taxableAmount,
    gstRate,
    isRcm,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="border-b border-border pb-4 space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <span>/</span>
          <Link href="/admin/gst/registrations" className="hover:underline">GST Management</Link>
          <span>/</span>
          <span className="font-semibold text-slate-700">Tax Calculator</span>
        </div>
        <h1 className="text-2xl font-bold text-[#17365D]">
          Indian GST Tax & Supply Classifier Calculator
        </h1>
        <p className="text-xs text-slate-500">
          Verify Place of Supply rules, CGST/SGST vs IGST split, and Reverse Charge (RCM) applicability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Input Parameters Box */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#17365D]">Transaction Parameters</h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Supplier State Code (First 2 digits of Supplier GSTIN)
              </label>
              <input
                type="text"
                maxLength={2}
                value={supplierState}
                onChange={(e) => setSupplierState(e.target.value)}
                placeholder="07 (Delhi)"
                className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Place of Supply (POS) State Code
              </label>
              <input
                type="text"
                maxLength={2}
                value={posState}
                onChange={(e) => setPosState(e.target.value)}
                placeholder="27 (Maharashtra) or 07 (Delhi)"
                className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Taxable Amount (₹)</label>
              <input
                type="number"
                step="100"
                value={taxableAmount}
                onChange={(e) => setTaxableAmount(parseFloat(e.target.value) || 0)}
                className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Applicable GST Rate (%)</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(parseInt(e.target.value, 10))}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white font-bold"
              >
                <option value={0}>0% (Nil / Exempt)</option>
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18% (Standard Rate)</option>
                <option value={28}>28% (Luxury / De-merit)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={isRcm}
                  onChange={(e) => setIsRcm(e.target.checked)}
                  className="rounded border-slate-300 text-[#17365D] focus:ring-[#2563EB]"
                />
                <span>Subject to Reverse Charge Mechanism (RCM u/s 9(3) / 9(4))</span>
              </label>
            </div>
          </div>
        </div>

        {/* Calculation Result Panel */}
        <div className="bg-[#17365D] text-white rounded-xl p-6 shadow-sm space-y-6">
          <div className="border-b border-white/10 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-sm">Tax Determination</h3>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                result.supplyType === "INTRA_STATE"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-400/30"
              }`}
            >
              {result.supplyType === "INTRA_STATE" ? "Intra-State Supply (CGST + SGST)" : "Inter-State Supply (IGST)"}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-blue-200">Taxable Value:</span>
              <span className="font-mono font-bold text-white">{formatCurrency(result.taxableAmount)}</span>
            </div>

            {result.supplyType === "INTRA_STATE" ? (
              <>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-blue-200">Central GST (CGST @ {result.cgstRate}%):</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(result.cgstAmount)}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-blue-200">State GST (SGST @ {result.sgstRate}%):</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(result.sgstAmount)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-blue-200">Integrated GST (IGST @ {result.igstRate}%):</span>
                <span className="font-mono font-bold text-white">{formatCurrency(result.igstAmount)}</span>
              </div>
            )}

            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-blue-200">Total Tax Amount:</span>
              <span className="font-mono font-bold text-emerald-400">{formatCurrency(result.totalTax)}</span>
            </div>

            <div className="flex justify-between pt-2 text-sm">
              <span className="font-bold text-white">Total Gross Invoice Value:</span>
              <span className="font-mono font-extrabold text-white">{formatCurrency(result.totalAmount)}</span>
            </div>
          </div>

          {result.isRcm && (
            <div className="p-3 bg-amber-500/20 border border-amber-400/30 rounded text-xs text-amber-200 space-y-1">
              <span className="font-bold">Reverse Charge Notice:</span>
              <p className="text-[11px] leading-relaxed">
                Recipient is liable to pay {formatCurrency(result.totalTax)} in cash to the government in GSTR-3B Table 3.1(d). Eligible ITC can be claimed in Table 4(A)(3).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
