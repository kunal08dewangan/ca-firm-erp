"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Receipt,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Building,
  Calculator,
} from "lucide-react";

interface InvoiceLineItem {
  id: string;
  description: string;
  sacCode: string;
  quantity: number;
  unitPrice: number;
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);

  const [clientId, setClientId] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0]
  );
  const [isInterState, setIsInterState] = useState(false);

  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      id: "1",
      description: "Professional Fees for Statutory Audit & Tax Filing",
      sacCode: "998222",
      quantity: 1,
      unitPrice: 25000,
    },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/clients?limit=100");
        const data = await res.json();
        if (data.clients && data.clients.length > 0) {
          setClients(data.clients);
          setClientId(data.clients[0].id);
        }
      } catch (err) {
        console.error("Failed to load clients:", err);
      } finally {
        setLoadingClients(false);
      }
    }
    loadClients();
  }, []);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        description: "",
        sacCode: "998222",
        quantity: 1,
        unitPrice: 5000,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceLineItem, value: any) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const selectedClientObj = clients.find((c) => c.id === clientId);

  // Auto-detect inter-state if client state is outside Delhi/Haryana (Firm state)
  const isFirmStateDelhi = true;

  // Real-time calculations
  const subtotal = items.reduce(
    (acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
    0
  );

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;

  if (isInterState) {
    igstAmount = Math.round(subtotal * 0.18 * 100) / 100;
  } else {
    cgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
    sgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
  }

  const totalAmount = Math.round((subtotal + cgstAmount + sgstAmount + igstAmount) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError("Please select a client.");
      return;
    }
    if (items.some((i) => !i.description.trim())) {
      setError("Please provide a description for all billable items.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          invoiceDate,
          dueDate,
          isInterState,
          items,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate invoice");

      router.push(`/admin/invoices/${data.invoice.id}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#17365D]">Create GST Tax Invoice</h1>
            <p className="text-sm text-slate-500">
              Generate official professional fee tax invoice under SAC 998222.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client & Invoice Meta */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#17365D] border-b border-slate-100 pb-2">
            Invoice Recipient & Metadata
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bill To Client *</label>
              {loadingClients ? (
                <div className="text-xs text-slate-400">Loading clients...</div>
              ) : (
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — PAN: {c.pan} ({c.state || "State N/A"})
                    </option>
                  ))}
                </select>
              )}
              {selectedClientObj && (
                <div className="mt-2 text-xs text-slate-500 flex gap-4">
                  <span>PAN: <strong className="font-mono text-slate-800">{selectedClientObj.pan}</strong></span>
                  <span>State: <strong className="text-slate-800">{selectedClientObj.state || "Delhi"}</strong></span>
                  <span>Type: <strong className="text-slate-800">{selectedClientObj.clientType}</strong></span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GST Supply Type</label>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="interstate"
                  checked={isInterState}
                  onChange={(e) => setIsInterState(e.target.checked)}
                  className="w-4 h-4 text-[#17365D] rounded border-slate-300 focus:ring-[#17365D]"
                />
                <label htmlFor="interstate" className="text-xs text-slate-700 cursor-pointer font-medium">
                  Inter-State Supply (IGST 18%)
                </label>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isInterState ? "Levying Integrated GST (18%)" : "Levying CGST (9%) + SGST (9%)"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Date</label>
              <input
                type="date"
                required
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-base font-bold text-[#17365D]">Billable Services & Professional Fees</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#17365D] hover:text-[#122b4a] bg-slate-50 hover:bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Service Line
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200"
              >
                <div className="md:col-span-5">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Service Description
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Income Tax Return Filing & Representation"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    SAC Code
                  </label>
                  <input
                    type="text"
                    value={item.sacCode}
                    onChange={(e) => handleItemChange(item.id, "sacCode", e.target.value)}
                    className="w-full text-sm font-mono border border-slate-300 rounded-md px-3 py-1.5 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="100"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                    className="w-full text-sm font-mono border border-slate-300 rounded-md px-3 py-1.5 bg-white text-right"
                  />
                </div>

                <div className="md:col-span-2 text-right">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                    Amount (₹)
                  </label>
                  <p className="text-sm font-mono font-bold text-slate-900 pt-1.5">
                    ₹{(item.quantity * item.unitPrice).toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="md:col-span-1 text-right pt-4 md:pt-0">
                  <button
                    type="button"
                    disabled={items.length <= 1}
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Breakdown & Action */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 text-xs text-slate-500 max-w-sm">
            <p className="font-semibold text-slate-700">Statutory Billing Terms:</p>
            <p>
              • Professional fee invoices are subject to 18% Goods & Services Tax (SAC 998222).
            </p>
            <p>
              • Corporate clients liable under Section 194J may deduct applicable TDS (10% or 2% for technical fees).
            </p>
          </div>

          <div className="w-full md:w-80 bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>

            {isInterState ? (
              <div className="flex justify-between text-slate-600">
                <span>IGST (18%):</span>
                <span className="font-mono font-medium">₹{igstAmount.toLocaleString("en-IN")}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%):</span>
                  <span className="font-mono font-medium">₹{cgstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SGST (9%):</span>
                  <span className="font-mono font-medium">₹{sgstAmount.toLocaleString("en-IN")}</span>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-base text-[#17365D]">
              <span>Total Invoice Amount:</span>
              <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/invoices"
            className="px-5 py-2.5 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="bg-[#17365D] hover:bg-[#122b4a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm disabled:opacity-50"
          >
            {submitting ? "Generating Tax Invoice..." : "Issue Tax Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
}
