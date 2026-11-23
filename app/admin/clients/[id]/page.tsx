"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  Building,
  FileSpreadsheet,
  Calculator,
  BookOpenCheck,
  FolderLock,
  Receipt,
  CreditCard,
  CheckSquare,
  History,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Plus,
  ArrowLeft,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<any>(null);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal states for adding business / GSTIN
  const [bizModal, setBizModal] = useState(false);
  const [bizForm, setBizForm] = useState({ tradeName: "", registeredState: "Delhi", natureOfBusiness: "" });
  const [gstModal, setGstModal] = useState(false);
  const [selectedBizId, setSelectedBizId] = useState("");
  const [gstForm, setGstForm] = useState({ gstin: "", tradeName: "", registrationType: "REGULAR" });

  const fetchClientData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setClient(data.client);
        setHistoryLogs(data.history || []);
        if (data.client?.businesses?.length > 0) {
          setSelectedBizId(data.client.businesses[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load client profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [params.id]);

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/clients/${params.id}/businesses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bizForm,
          legalName: bizForm.tradeName,
          constitution: client.clientType,
        }),
      });
      if (res.ok) {
        setBizModal(false);
        setBizForm({ tradeName: "", registeredState: "Delhi", natureOfBusiness: "" });
        fetchClientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGstin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBizId) return;
    try {
      const res = await fetch(`/api/clients/${params.id}/gst-registrations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...gstForm,
          businessId: selectedBizId,
        }),
      });
      if (res.ok) {
        setGstModal(false);
        setGstForm({ gstin: "", tradeName: "", registrationType: "REGULAR" });
        fetchClientData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-500">
        Loading client profile hub...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-12 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Client Profile Not Found</h2>
        <Link href="/admin/clients" className="text-xs text-[#2563EB] hover:underline">
          ← Return to Clients Directory
        </Link>
      </div>
    );
  }

  const allGstins = client.businesses?.flatMap((b: any) => b.gstRegistrations) || [];
  const allVouchers = client.businesses?.flatMap((b: any) => b.vouchers) || [];

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "businesses", label: `Businesses (${client.businesses?.length || 0})`, icon: Building },
    { id: "gst", label: `GST (${allGstins.length})`, icon: FileSpreadsheet },
    { id: "income-tax", label: `Income Tax (${client.itrProfiles?.length || 0})`, icon: Calculator },
    { id: "accounting", label: `Accounting (${allVouchers.length})`, icon: BookOpenCheck },
    { id: "documents", label: `Documents (${client.documents?.length || 0})`, icon: FolderLock },
    { id: "invoices", label: `Invoices (${client.invoices?.length || 0})`, icon: Receipt },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "tasks", label: `Tasks (${client.tasks?.length || 0})`, icon: CheckSquare },
    { id: "history", label: "Audit History", icon: History },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/admin/clients" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              Clients Directory
            </Link>
            <span>/</span>
            <span className="font-mono text-slate-700">{client.clientCode}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#17365D]">{client.name}</h1>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                client.status === "ACTIVE"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {client.status}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {client.clientType.replace("_", " ")} • PAN:{" "}
            <span className="font-mono font-bold text-slate-800">{client.pan}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBizModal(true)}
            className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 shadow-sm"
          >
            <Building className="w-3.5 h-3.5 text-[#2563EB]" />
            Add Business
          </button>
          <button
            onClick={() => setGstModal(true)}
            className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add GSTIN
          </button>
        </div>
      </div>

      {/* 10-Tab Navigation Strip */}
      <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 flex overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-[#2563EB] text-[#2563EB] font-bold"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-slate-200 rounded-b-xl p-6 shadow-sm">
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Primary Contact
                </span>
                <p className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {client.mobile}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {client.email}
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Registered Address
                </span>
                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p>{client.addressLine1}</p>
                    {client.addressLine2 && <p>{client.addressLine2}</p>}
                    <p>{client.city}, {client.state} - {client.pincode}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Assigned FCA In-Charge
                </span>
                <p className="text-xs font-bold text-[#17365D]">
                  {client.assignedCA?.fullName || "CA Vikramaditya Singhania"}
                </p>
                <p className="text-[11px] text-slate-500">
                  ICAI M.No: {client.assignedCA?.membershipNo || "084920"}
                </p>
              </div>
            </div>

            {client.notes && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
                <span className="font-bold">Engagement Notes:</span>
                <p>{client.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* 2. BUSINESSES TAB */}
        {activeTab === "businesses" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#17365D]">Associated Business Entities</h3>
              <button
                onClick={() => setBizModal(true)}
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Another Business
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {client.businesses?.map((b: any) => (
                <div key={b.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{b.tradeName}</h4>
                      <p className="text-[11px] text-slate-500">{b.legalName}</p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {b.registeredState}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    {b.cin && <p>CIN: <span className="font-mono font-semibold">{b.cin}</span></p>}
                    {b.natureOfBusiness && <p>Nature: {b.natureOfBusiness}</p>}
                    <p>Registered GSTINs: <span className="font-semibold text-[#2563EB]">{b.gstRegistrations?.length || 0}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. GST TAB */}
        {activeTab === "gst" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#17365D]">GSTINs & Compliance Registers</h3>
              <button
                onClick={() => setGstModal(true)}
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Register GSTIN
              </button>
            </div>

            <div className="space-y-3">
              {allGstins.map((g: any) => (
                <div key={g.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-[#17365D] bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                        {g.gstin}
                      </span>
                      <span className="text-xs text-slate-600">State: {g.stateCode}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {g.status}
                    </span>
                  </div>

                  {/* Quick links to GST submodules for this GSTIN */}
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 text-xs">
                    <Link
                      href={`/admin/gst/sales?gstin=${g.gstin}`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      Sales Register →
                    </Link>
                    <Link
                      href={`/admin/gst/purchases?gstin=${g.gstin}`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      Purchase Register →
                    </Link>
                    <Link
                      href={`/admin/gst/returns?gstin=${g.gstin}`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      Returns Status →
                    </Link>
                    <Link
                      href={`/admin/gst/recon-2b?gstin=${g.gstin}`}
                      className="text-[#2563EB] hover:underline font-semibold"
                    >
                      2B Reconciliation →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INCOME TAX TAB */}
        {activeTab === "income-tax" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Income Tax Return (ITR) Profiles</h3>
            {client.itrProfiles?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No ITR profiles created for this client yet.</p>
            ) : (
              <div className="space-y-3">
                {client.itrProfiles?.map((itr: any) => (
                  <div key={itr.id} className="border border-slate-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-800">
                        AY {itr.assessmentYear} (FY {itr.financialYear})
                      </span>
                      <span className="text-xs font-mono bg-blue-50 text-[#2563EB] px-2 py-0.5 rounded">
                        {itr.itrForm}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                      {itr.computations?.map((comp: any) => (
                        <div key={comp.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                          <p className="text-[10px] uppercase font-bold text-slate-500">
                            {comp.regime.replace("_", " ")}
                          </p>
                          <p className="text-xs font-bold text-slate-800">
                            Tax: {formatCurrency(comp.totalTaxLiability)}
                          </p>
                          {comp.isRecommendedRegime && (
                            <span className="text-[10px] text-emerald-700 font-semibold">
                              ★ Recommended
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. ACCOUNTING TAB */}
        {activeTab === "accounting" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Double-Entry Vouchers</h3>
            {allVouchers.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No accounting vouchers posted yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3">Voucher No</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Narration</th>
                      <th className="py-2.5 px-3 text-right">Debit / Credit (Balanced)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allVouchers.map((v: any) => (
                      <tr key={v.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#17365D]">{v.voucherNumber}</td>
                        <td className="py-2.5 px-3 font-semibold">{v.voucherType}</td>
                        <td className="py-2.5 px-3">{formatDate(v.voucherDate)}</td>
                        <td className="py-2.5 px-3 text-slate-600">{v.narration}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-emerald-700">
                          {formatCurrency(v.totalDebit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 6. DOCUMENTS TAB */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Stored Client Documents</h3>
            {client.documents?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No documents uploaded yet.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {client.documents?.map((doc: any) => (
                  <div key={doc.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{doc.title}</p>
                      <p className="text-[10px] text-slate-400">Category: {doc.category} • FY: {doc.financialYear || "N/A"}</p>
                    </div>
                    <span className="text-[#2563EB] hover:underline cursor-pointer">Download</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7. INVOICES TAB */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Billing & Retainers</h3>
            {client.invoices?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No invoices billed to this client yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3">Invoice No</th>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                      <th className="py-2.5 px-3 text-right">GST</th>
                      <th className="py-2.5 px-3 text-right">Total Amount</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {client.invoices?.map((inv: any) => (
                      <tr key={inv.id}>
                        <td className="py-2.5 px-3 font-mono font-bold text-[#17365D]">{inv.invoiceNumber}</td>
                        <td className="py-2.5 px-3">{formatDate(inv.invoiceDate)}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{formatCurrency(inv.subtotal)}</td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                          {formatCurrency(inv.cgstAmount + inv.sgstAmount + inv.igstAmount)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                          {formatCurrency(inv.totalAmount)}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              inv.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 8. PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Payment Receipts</h3>
            <p className="text-xs text-slate-600">
              Recorded client remittances against issued professional tax invoices.
            </p>
          </div>
        )}

        {/* 9. TASKS TAB */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">Client Deadlines & Tasks</h3>
            {client.tasks?.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No tasks currently assigned for this client.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {client.tasks?.map((t: any) => (
                  <div key={t.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{t.title}</p>
                      <p className="text-[11px] text-slate-500">Category: {t.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {t.status}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1">Due: {formatDate(t.dueDate)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 10. HISTORY TAB */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#17365D]">ICAI Audit Trail History</h3>
            <div className="space-y-2 text-xs">
              {historyLogs.map((h: any) => (
                <div key={h.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[#17365D]">{h.action}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(h.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Triggered by: {h.admin?.fullName || "CA Admin"} • Module: {h.module}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Business */}
      {bizModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-[#17365D]">Add Business Entity</h3>
            <form onSubmit={handleAddBusiness} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Trade Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Pharma Solutions"
                  value={bizForm.tradeName}
                  onChange={(e) => setBizForm({ ...bizForm, tradeName: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Registered State *</label>
                <input
                  type="text"
                  required
                  placeholder="Delhi"
                  value={bizForm.registeredState}
                  onChange={(e) => setBizForm({ ...bizForm, registeredState: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBizModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded"
                >
                  Save Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add GSTIN */}
      {gstModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-bold text-sm text-[#17365D]">Register GSTIN for Business</h3>
            <form onSubmit={handleAddGstin} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Select Business *</label>
                <select
                  value={selectedBizId}
                  onChange={(e) => setSelectedBizId(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {client.businesses?.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.tradeName} ({b.registeredState})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">15-digit GSTIN *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  placeholder="07AAAAA0000A1Z5"
                  value={gstForm.gstin}
                  onChange={(e) => setGstForm({ ...gstForm, gstin: e.target.value.toUpperCase() })}
                  className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGstModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded"
                >
                  Save GSTIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
