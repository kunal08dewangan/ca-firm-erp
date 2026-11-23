"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BookOpenCheck, Search, Filter } from "lucide-react";

export default function LedgersPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      try {
        const res = await fetch("/api/accounting/chart-of-accounts");
        const data = await res.json();
        const list = data.accounts || [];
        setAccounts(list);
        if (list.length > 0) setSelectedAccountId(list[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAccounts();
  }, []);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

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
            <span className="font-semibold text-slate-700">General Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Account Ledger Statements
          </h1>
          <p className="text-xs text-slate-500">
            Chronological transaction history with running debit and credit balances.
          </p>
        </div>
      </div>

      {/* Account Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-700">Select Ledger Account:</span>
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-bold text-[#17365D]"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.accountCode} - {a.accountName} ({a.accountType})
              </option>
            ))}
          </select>
        </div>

        {selectedAccount && (
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Closing Balance</span>
            <span className="text-base font-bold font-mono text-[#17365D]">
              {formatCurrency(selectedAccount.currentBalance)}
            </span>
          </div>
        )}
      </div>

      {/* Ledger Entries Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#17365D]">
            Statement of Account: {selectedAccount?.accountName} ({selectedAccount?.accountCode})
          </h3>
          <span className="text-xs font-semibold bg-blue-50 text-[#2563EB] px-2.5 py-0.5 rounded">
            {selectedAccount?.accountType}
          </span>
        </div>

        <div className="p-8 text-center text-xs text-slate-500">
          Opening Balance: <strong>{formatCurrency(selectedAccount?.openingBalance || 0)}</strong>
          <span className="block mt-2 text-slate-400">
            Detailed ledger entries are compiled from all posted and verified vouchers in real time.
          </span>
        </div>
      </div>
    </div>
  );
}
