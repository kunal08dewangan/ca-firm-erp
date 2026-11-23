"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function Gstr2bReconPage() {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleRunRecon = async () => {
    setRunning(true);
    try {
      const res = await fetch("/api/gst/reconcile-2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: "102026" }),
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">GST Management</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">GSTR-2B Auto-Reconciliation</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            GSTR-2B vs Books Purchase Reconciliation Engine
          </h1>
          <p className="text-xs text-slate-500">
            Automated 4-Bucket matching to prevent Section 16(2)(aa) disallowed Input Tax Credit.
          </p>
        </div>

        <button
          onClick={handleRunRecon}
          disabled={running}
          className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${running ? "animate-spin" : ""}`} />
          {running ? "Analyzing Invoices..." : "Execute 2B Reconciliation"}
        </button>
      </div>

      {!report ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-4 shadow-sm">
          <FileSpreadsheet className="w-12 h-12 text-[#2563EB] mx-auto opacity-80" />
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-bold text-base text-[#17365D]">Ready to Run Reconciliation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click the button above to compare current month purchase vouchers in your books with GSTR-2B auto-drafted statements.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Total Books ITC</span>
              <span className="text-lg font-bold text-slate-800">
                {formatCurrency(report.summary.totalBooksItc)}
              </span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] text-slate-500 block">Total GSTR-2B Portal ITC</span>
              <span className="text-lg font-bold text-[#2563EB]">
                {formatCurrency(report.summary.total2bItc)}
              </span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] text-emerald-800 font-semibold block">Matched & Safe ITC</span>
              <span className="text-lg font-bold text-emerald-700">
                {formatCurrency(report.summary.eligibleMatchedItc)}
              </span>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] text-rose-800 font-semibold block">At-Risk ITC (Unfiled)</span>
              <span className="text-lg font-bold text-rose-700">
                {formatCurrency(report.summary.atRiskItc)}
              </span>
            </div>
          </div>

          {/* Bucket 1: Exact Matches */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Bucket 1: Exact Matches ({report.exactMatches.length})
                </h3>
                <p className="text-xs text-slate-500">
                  GSTIN, Invoice Number, and Taxable Amount matched within ± ₹1.00 tolerance. 100% safe to claim in GSTR-3B Table 4(A)(5).
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {report.exactMatches.map((m: any, idx: number) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-[#17365D]">{m.books.invoiceNumber}</span>
                    <span className="text-slate-600 ml-2">({m.books.supplierName})</span>
                    <span className="block font-mono text-[11px] text-slate-400">{m.books.supplierGstin}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-700">{formatCurrency(m.books.totalTax)}</span>
                    <span className="block text-[10px] text-slate-400">Taxable: {formatCurrency(m.books.taxableAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bucket 3: Missing in Books */}
          {report.missingInBooks.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-800">
                    Bucket 3: In GSTR-2B, But Missing in Client Books ({report.missingInBooks.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Supplier has filed in GSTR-1, but invoice is missing from client purchase register. Verify if invoice was misplaced to claim ITC.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {report.missingInBooks.map((g: any, idx: number) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{g.invoiceNumber}</span>
                      <span className="text-slate-600 ml-2">({g.tradeName})</span>
                      <span className="block font-mono text-[11px] text-slate-400">{g.gstin}</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-[#2563EB]">{formatCurrency(g.totalTax)}</span>
                      <span className="block text-[10px] text-slate-400">Available ITC to Book</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
