"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  BookOpenCheck,
  Plus,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [posting, setPosting] = useState(false);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState({
    businessId: "",
    voucherType: "PAYMENT",
    voucherNumber: "",
    voucherDate: new Date().toISOString().split("T")[0],
    narration: "",
  });

  const [entries, setEntries] = useState<any[]>([
    { accountId: "", debit: 15000, credit: 0, particulars: "To Vendor" },
    { accountId: "", debit: 0, credit: 15000, particulars: "By HDFC Bank" },
  ]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/accounting/vouchers");
      const data = await res.json();
      if (res.ok) setVouchers(data.vouchers || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [acctRes, bizRes] = await Promise.all([
        fetch("/api/accounting/chart-of-accounts"),
        fetch("/api/clients?limit=50"),
      ]);
      const acctData = await acctRes.json();
      const bizData = await bizRes.json();

      setAccounts(acctData.accounts || []);
      const bizList = bizData.clients?.flatMap((c: any) => c.businesses) || [];
      setBusinesses(bizList);

      if (bizList.length > 0 && !form.businessId) {
        setForm((prev) => ({
          ...prev,
          businessId: bizList[0].id,
          voucherNumber: `PV-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVouchers();
    fetchMetadata();
  }, []);

  const totalDebit = entries.reduce((acc, e) => acc + (parseFloat(e.debit) || 0), 0);
  const totalCredit = entries.reduce((acc, e) => acc + (parseFloat(e.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) <= 0.01 && totalDebit > 0;

  const handlePostVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isBalanced) {
      setFormError(`Debits (₹${totalDebit}) must equal Credits (₹${totalCredit}).`);
      return;
    }

    setPosting(true);
    try {
      const res = await fetch("/api/accounting/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          entries,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to post voucher.");
        setPosting(false);
        return;
      }

      setModalOpen(false);
      fetchVouchers();
    } catch {
      setFormError("Network error while posting voucher.");
    } finally {
      setPosting(false);
    }
  };

  const handleReverseVoucher = async (id: string) => {
    const reason = prompt("Enter the statutory reason for reversing this voucher:");
    if (!reason) return;

    try {
      const res = await fetch(`/api/accounting/vouchers/${id}/reverse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Voucher successfully reversed. Reversal Voucher: ${data.reversalVoucher?.voucherNumber}`);
        fetchVouchers();
      } else {
        alert(data.error || "Reversal failed.");
      }
    } catch {
      alert("Network error.");
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
            <span className="text-[#2563EB] font-medium">Accounting</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Voucher Journal</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Double-Entry Accounting Vouchers
          </h1>
          <p className="text-xs text-slate-500">
            Immutable financial records. Every transaction maintains balanced debits and credits with reversal audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/accounting/trial-balance"
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded shadow-sm transition-colors"
          >
            Trial Balance →
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Balanced Voucher
          </button>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Loading vouchers...</div>
        ) : vouchers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">No vouchers recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Voucher No & Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Business Entity</th>
                  <th className="py-3 px-4">Narration / Particulars</th>
                  <th className="py-3 px-4 text-right">Debit (₹)</th>
                  <th className="py-3 px-4 text-right">Credit (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vouchers.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                      {v.voucherNumber}
                      <span className="block text-[11px] text-slate-400 font-normal">
                        {formatDate(v.voucherDate)}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-700">
                      {v.voucherType}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {v.business?.tradeName}
                    </td>

                    <td className="py-3 px-4 text-slate-600 max-w-xs">
                      <p className="line-clamp-2">{v.narration}</p>
                      {v.reversalReason && (
                        <span className="block text-[10px] text-rose-600 font-semibold">
                          Reversed: {v.reversalReason}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                      {formatCurrency(v.totalDebit)}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(v.totalCredit)}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          v.status === "POSTED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {v.status === "POSTED" && (
                        <button
                          onClick={() => handleReverseVoucher(v.id)}
                          className="text-[11px] font-semibold text-rose-600 hover:underline inline-flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reverse
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Balanced Voucher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Post Double-Entry Voucher</h3>
                <p className="text-xs text-slate-500">Debits and Credits must balance to the exact rupee.</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostVoucher} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Business Entity *</label>
                  <select
                    required
                    value={form.businessId}
                    onChange={(e) => setForm({ ...form, businessId: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-medium"
                  >
                    {businesses.map((b: any) => (
                      <option key={b.id} value={b.id}>
                        {b.tradeName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Voucher Type *</label>
                  <select
                    value={form.voucherType}
                    onChange={(e) => setForm({ ...form, voucherType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-bold"
                  >
                    <option value="JOURNAL">Journal Voucher (JV)</option>
                    <option value="PAYMENT">Payment Voucher</option>
                    <option value="RECEIPT">Receipt Voucher</option>
                    <option value="CONTRA">Contra Voucher (Bank/Cash)</option>
                    <option value="SALES">Sales Voucher</option>
                    <option value="PURCHASE">Purchase Voucher</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Voucher Number *</label>
                  <input
                    type="text"
                    required
                    value={form.voucherNumber}
                    onChange={(e) => setForm({ ...form, voucherNumber: e.target.value })}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Voucher Date *</label>
                  <input
                    type="date"
                    required
                    value={form.voucherDate}
                    onChange={(e) => setForm({ ...form, voucherDate: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              {/* Entries Grid */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Voucher Debits & Credits (At least 2 rows)
                </span>

                {entries.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
                    <div className="col-span-5">
                      <select
                        required
                        value={entry.accountId}
                        onChange={(e) => {
                          const updated = [...entries];
                          updated[idx].accountId = e.target.value;
                          setEntries(updated);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                      >
                        <option value="">-- Select Account --</option>
                        {accounts.map((a: any) => (
                          <option key={a.id} value={a.id}>
                            {a.accountCode} - {a.accountName} ({a.accountType})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Debit (₹)"
                        value={entry.debit}
                        onChange={(e) => {
                          const updated = [...entries];
                          updated[idx].debit = parseFloat(e.target.value) || 0;
                          setEntries(updated);
                        }}
                        className="w-full font-mono text-xs px-2.5 py-1.5 border border-slate-300 rounded text-right"
                      />
                    </div>

                    <div className="col-span-3">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Credit (₹)"
                        value={entry.credit}
                        onChange={(e) => {
                          const updated = [...entries];
                          updated[idx].credit = parseFloat(e.target.value) || 0;
                          setEntries(updated);
                        }}
                        className="w-full font-mono text-xs px-2.5 py-1.5 border border-slate-300 rounded text-right"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Balance Invariant Status Indicator */}
              <div
                className={`p-3 rounded-lg border text-xs flex justify-between items-center ${
                  isBalanced
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isBalanced ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span className="font-semibold">
                    {isBalanced ? "Balanced Voucher" : "Unbalanced Voucher Invariant"}
                  </span>
                </div>
                <div className="font-mono space-x-3 text-right">
                  <span>Debits: <strong>{formatCurrency(totalDebit)}</strong></span>
                  <span>Credits: <strong>{formatCurrency(totalCredit)}</strong></span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Narration *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Being amount paid towards..."
                  value={form.narration}
                  onChange={(e) => setForm({ ...form, narration: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
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
                  disabled={posting || !isBalanced}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded transition-colors disabled:opacity-50"
                >
                  {posting ? "Posting..." : "Post to General Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
