"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  BookOpenCheck,
  Plus,
  Building,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBiz, setSelectedBiz] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({
    businessId: "",
    accountCode: "",
    accountName: "",
    accountType: "EXPENSE",
    openingBalance: 0,
    isDebitBalance: true,
  });

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ businessId: selectedBiz });
      const res = await fetch(`/api/accounting/chart-of-accounts?${q.toString()}`);
      const data = await res.json();
      if (res.ok) setAccounts(data.accounts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/clients?limit=50");
      const data = await res.json();
      const bizList = data.clients?.flatMap((c: any) =>
        c.businesses?.map((b: any) => ({
          ...b,
          clientName: c.name,
        }))
      ) || [];
      setBusinesses(bizList);
      if (bizList.length > 0 && !form.businessId) {
        setForm((prev) => ({ ...prev, businessId: bizList[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchBusinesses();
  }, [selectedBiz]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const res = await fetch("/api/accounting/chart-of-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create account");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      setForm({
        businessId: businesses[0]?.id || "",
        accountCode: "",
        accountName: "",
        accountType: "EXPENSE",
        openingBalance: 0,
        isDebitBalance: true,
      });
      fetchAccounts();
    } catch {
      setFormError("Network error while creating account.");
    } finally {
      setCreating(false);
    }
  };

  const accountTypes = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">Accounting</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Chart of Accounts</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Chart of Accounts (CoA) Master Hierarchy
          </h1>
          <p className="text-xs text-slate-500">
            Standard 5-tier classification: Assets (1xxx), Liabilities (2xxx), Equity (3xxx), Revenue (4xxx), and Expenses (5xxx).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/accounting/vouchers"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <BookOpenCheck className="w-3.5 h-3.5 text-[#2563EB]" />
            Post Voucher
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Ledger Account
          </button>
        </div>
      </div>

      {/* Filter by Business */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Filter by Business Entity:</span>
          <select
            value={selectedBiz}
            onChange={(e) => setSelectedBiz(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold text-slate-800"
          >
            <option value="ALL">All Businesses</option>
            {businesses.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.tradeName} ({b.clientName})
              </option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Total {accounts.length} Active Accounts
        </span>
      </div>

      {/* Accounts List grouped by Category */}
      <div className="space-y-6">
        {accountTypes.map((type) => {
          const typeAccounts = accounts.filter((a) => a.accountType === type);
          if (typeAccounts.length === 0) return null;

          return (
            <div key={type} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                <span className="font-bold text-xs uppercase tracking-wider text-[#17365D]">
                  {type} ACCOUNTS ({typeAccounts.length})
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {type === "ASSET" || type === "EXPENSE" ? "Normal Balance: DEBIT" : "Normal Balance: CREDIT"}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-[11px] font-semibold">
                      <th className="py-2.5 px-6">Code</th>
                      <th className="py-2.5 px-4">Account Name</th>
                      <th className="py-2.5 px-4">Entity</th>
                      <th className="py-2.5 px-4 text-right">Opening Balance</th>
                      <th className="py-2.5 px-6 text-right">Current Ledger Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {typeAccounts.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-6 font-mono font-bold text-[#17365D]">
                          {a.accountCode}
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-slate-800">
                          {a.accountName}
                          {a.isSystemAccount && (
                            <span className="ml-2 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-normal">
                              System
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">
                          {a.business?.tradeName}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                          {formatCurrency(a.openingBalance)}
                        </td>
                        <td className="py-2.5 px-6 text-right font-mono font-bold text-slate-900">
                          {formatCurrency(a.currentBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Account Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-[#17365D]">Add Ledger Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Business Entity *</label>
                <select
                  required
                  value={form.businessId}
                  onChange={(e) => setForm({ ...form, businessId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {businesses.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.tradeName} ({b.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5020"
                    value={form.accountCode}
                    onChange={(e) => setForm({ ...form, accountCode: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Account Type *</label>
                  <select
                    value={form.accountType}
                    onChange={(e) => setForm({ ...form, accountType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-bold"
                  >
                    <option value="ASSET">Asset (1xxx)</option>
                    <option value="LIABILITY">Liability (2xxx)</option>
                    <option value="EQUITY">Equity (3xxx)</option>
                    <option value="REVENUE">Revenue (4xxx)</option>
                    <option value="EXPENSE">Expense (5xxx)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Office Electricity Expense"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Opening Balance (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.openingBalance}
                  onChange={(e) => setForm({ ...form, openingBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
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
                  {creating ? "Saving..." : "Save Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
