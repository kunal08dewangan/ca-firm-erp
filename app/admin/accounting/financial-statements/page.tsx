"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Building,
  CheckCircle2,
  Printer,
  ShieldCheck,
} from "lucide-react";

export default function FinancialStatementsPage() {
  const [statements, setStatements] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatements() {
      try {
        const res = await fetch("/api/accounting/financial-statements");
        const data = await res.json();
        if (res.ok) setStatements(data.statements);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadStatements();
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
            <span className="font-semibold text-slate-700">Financial Statements</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Profit & Loss Statement & Balance Sheet
          </h1>
          <p className="text-xs text-slate-500">
            Statutory annual financial statements compiled under Schedule III of the Companies Act, 2013.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-[#2563EB]" />
          Print Statements
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-500">Generating Financial Statements...</div>
      ) : !statements ? (
        <div className="p-12 text-center text-xs text-slate-500">Failed to load statements.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 1. PROFIT & LOSS STATEMENT */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Statement of Profit and Loss</h3>
                <p className="text-[11px] text-slate-500">For the period ended</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">Schedule III</span>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1">
                  I. Revenue from Operations
                </span>
                {statements.profitAndLoss.revenueItems.map((item: any) => (
                  <div key={item.accountId} className="flex justify-between py-1">
                    <span className="font-sans text-slate-800">{item.accountName}</span>
                    <span className="font-bold">{formatCurrency(item.closingCredit - item.closingDebit)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 border-t border-slate-200 font-bold text-slate-900">
                  <span className="font-sans">Total Revenue (A)</span>
                  <span>{formatCurrency(statements.profitAndLoss.totalRevenue)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1">
                  II. Expenses
                </span>
                {statements.profitAndLoss.expenseItems.map((item: any) => (
                  <div key={item.accountId} className="flex justify-between py-1">
                    <span className="font-sans text-slate-800">{item.accountName}</span>
                    <span>{formatCurrency(item.closingDebit - item.closingCredit)}</span>
                  </div>
                ))}
                {statements.profitAndLoss.expenseItems.length === 0 && (
                  <p className="text-slate-400 italic font-sans text-[11px]">No operational expenses recorded.</p>
                )}
                <div className="flex justify-between py-1.5 border-t border-slate-200 font-bold text-slate-900">
                  <span className="font-sans">Total Expenses (B)</span>
                  <span>{formatCurrency(statements.profitAndLoss.totalExpense)}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex justify-between items-center text-sm font-bold text-emerald-900 font-sans">
                <span>Net Profit Before Tax (A - B)</span>
                <span className="font-mono text-emerald-700">
                  {formatCurrency(statements.profitAndLoss.netProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* 2. BALANCE SHEET */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-4">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Balance Sheet Statement</h3>
                <p className="text-[11px] text-slate-500">As at current date</p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-700">Schedule III</span>
            </div>

            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1">
                  I. Assets
                </span>
                {statements.balanceSheet.assetItems.map((item: any) => (
                  <div key={item.accountId} className="flex justify-between py-1">
                    <span className="font-sans text-slate-800">{item.accountName}</span>
                    <span>{formatCurrency(item.closingDebit - item.closingCredit)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1.5 border-t border-slate-200 font-bold text-[#17365D]">
                  <span className="font-sans">TOTAL ASSETS</span>
                  <span>{formatCurrency(statements.balanceSheet.totalAssets)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-700 block border-b border-slate-200 pb-1">
                  II. Liabilities & Equity
                </span>
                {statements.balanceSheet.liabilityItems.map((item: any) => (
                  <div key={item.accountId} className="flex justify-between py-1">
                    <span className="font-sans text-slate-800">{item.accountName}</span>
                    <span>{formatCurrency(item.closingCredit - item.closingDebit)}</span>
                  </div>
                ))}
                <div className="flex justify-between py-1 text-slate-700">
                  <span className="font-sans">Retained Earnings / Current Net Profit</span>
                  <span className="font-bold">{formatCurrency(statements.profitAndLoss.netProfit)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-t border-slate-200 font-bold text-[#17365D]">
                  <span className="font-sans">TOTAL LIABILITIES & EQUITY</span>
                  <span>{formatCurrency(statements.balanceSheet.totalLiabilities + statements.balanceSheet.totalEquity)}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-xs text-blue-900 font-sans">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span className="font-semibold">Balance Sheet Equilibrium</span>
                </div>
                <span className="font-bold font-mono">
                  {statements.balanceSheet.isBalanced ? "Assets == Liabilities + Equity" : "Unbalanced"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
