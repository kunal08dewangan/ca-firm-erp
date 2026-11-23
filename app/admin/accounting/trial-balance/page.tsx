"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  BookOpenCheck,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function TrialBalancePage() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrialBalance() {
      try {
        const res = await fetch("/api/accounting/trial-balance");
        const data = await res.json();
        if (res.ok) setReport(data.report);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrialBalance();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/accounting/chart-of-accounts" className="hover:underline">Accounting</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Trial Balance</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Statutory Trial Balance
          </h1>
          <p className="text-xs text-slate-500">
            Verification of arithmetic accuracy in double-entry bookkeeping. Total Debits must equal Total Credits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/accounting/financial-statements"
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-1.5"
          >
            Generate P&L & Balance Sheet →
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Generating Trial Balance...</div>
      ) : !report ? (
        <div className="p-12 text-center text-xs text-slate-500">Failed to load Trial Balance.</div>
      ) : (
        <div className="space-y-6">
          {/* Balance Invariant Indicator Card */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between shadow-sm ${
              report.isBalanced
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {report.isBalanced ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              )}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">
                  {report.isBalanced ? "Double-Entry Balance Verified" : "Trial Balance Unbalanced Discrepancy"}
                </p>
                <p className="text-xs opacity-90">
                  {report.isBalanced
                    ? "Total Debits match Total Credits to the exact rupee. Accounting books are in perfect statutory balance."
                    : `Discrepancy detected: Difference of ₹${report.difference}`}
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-sm font-bold">
              <span>Debits: {formatCurrency(report.totalDebit)}</span>
              <span className="mx-2">•</span>
              <span>Credits: {formatCurrency(report.totalCredit)}</span>
            </div>
          </div>

          {/* Trial Balance Table */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px] tracking-wider">
                    <th className="py-3 px-6">Account Code</th>
                    <th className="py-3 px-4">Account Particulars</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Debit Balance (₹)</th>
                    <th className="py-3 px-6 text-right">Credit Balance (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {report.items.map((item: any) => (
                    <tr key={item.accountId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-6 font-bold text-[#17365D]">
                        {item.accountCode}
                      </td>
                      <td className="py-2.5 px-4 font-sans font-semibold text-slate-800">
                        {item.accountName}
                      </td>
                      <td className="py-2.5 px-4 font-sans text-slate-500">
                        {item.accountType}
                      </td>
                      <td className="py-2.5 px-4 text-right font-semibold text-slate-800">
                        {item.closingDebit > 0 ? formatCurrency(item.closingDebit) : "-"}
                      </td>
                      <td className="py-2.5 px-6 text-right font-semibold text-slate-800">
                        {item.closingCredit > 0 ? formatCurrency(item.closingCredit) : "-"}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-900 text-white font-extrabold text-sm border-t-2 border-slate-900">
                    <td colSpan={3} className="py-3 px-6 font-sans">
                      TOTAL (BALANCED)
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">
                      {formatCurrency(report.totalDebit)}
                    </td>
                    <td className="py-3 px-6 text-right font-mono text-emerald-400">
                      {formatCurrency(report.totalCredit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
