"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Plus,
  Building,
  FileSpreadsheet,
  Phone,
  Mail,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  X,
  FileText,
  Briefcase,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [clientType, setClientType] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({ total: 0, totalPages: 1 });

  // Add Client Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    clientType: "PRIVATE_LIMITED",
    pan: "",
    mobile: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110001",
    notes: "",
    businessName: "",
    natureOfBusiness: "",
    gstin: "",
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        clientType,
        status,
        page: String(page),
        limit: "10",
      });
      const res = await fetch(`/api/clients?${query.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setClients(data.clients || []);
        setPagination(data.pagination || { total: 0, totalPages: 1 });
      }
    } catch (err) {
      console.error("Fetch clients failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, clientType, status, page]);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setCreating(true);

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to create client.");
        setCreating(false);
        return;
      }

      setModalOpen(false);
      setFormData({
        name: "",
        clientType: "PRIVATE_LIMITED",
        pan: "",
        mobile: "",
        email: "",
        addressLine1: "",
        addressLine2: "",
        city: "New Delhi",
        state: "Delhi",
        pincode: "110001",
        notes: "",
        businessName: "",
        natureOfBusiness: "",
        gstin: "",
      });
      fetchClients();
    } catch {
      setFormError("Network error while submitting client profile.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">Clients Directory</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Client & Entity Management
          </h1>
          <p className="text-xs text-slate-500">
            Total {pagination.total} registered legal entities across Corporate, LLP, Firm & Individual categories.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Register New Client
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by Client Name, PAN (e.g. AAACS1234D), Code, Mobile..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={clientType}
            onChange={(e) => {
              setClientType(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white text-slate-700"
          >
            <option value="ALL">All Entity Types</option>
            <option value="PRIVATE_LIMITED">Private Limited</option>
            <option value="LLP">LLP</option>
            <option value="PROPRIETORSHIP">Proprietorship</option>
            <option value="PARTNERSHIP_FIRM">Partnership Firm</option>
            <option value="INDIVIDUAL">Individual</option>
            <option value="TRUST_SOCIETY">Trust / Society</option>
          </select>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white text-slate-700"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PROSPECTIVE">Prospective</option>
          </select>
        </div>
      </div>

      {/* Clients Table / Card List */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading clients directory...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No clients match your filter criteria.</p>
            <p className="text-xs text-slate-500">Try clearing search parameters or register a new client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                  <th className="py-3 px-4">Client Code & Name</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">PAN Number</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Businesses & GSTINs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => {
                  const gstinList = client.businesses?.flatMap((b: any) => b.gstRegistrations) || [];

                  return (
                    <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="font-bold text-[#17365D] hover:text-[#2563EB] hover:underline block"
                        >
                          {client.name}
                        </Link>
                        <span className="font-mono text-[11px] text-slate-400">
                          {client.clientCode}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">
                          {client.clientType.replace("_", " ")}
                        </span>
                        <span className="block text-[11px] text-slate-400">{client.state}</span>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {client.pan}
                      </td>

                      <td className="py-3 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{client.mobile}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span>{client.email}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">
                          {client.businesses?.length || 0} Business Entity
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {gstinList.slice(0, 2).map((g: any) => (
                            <span
                              key={g.id}
                              className="font-mono text-[10px] bg-blue-50 text-[#17365D] border border-blue-200 px-1.5 py-0.5 rounded"
                            >
                              {g.gstin}
                            </span>
                          ))}
                          {gstinList.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-medium">
                              +{gstinList.length - 2} more
                            </span>
                          )}
                          {gstinList.length === 0 && (
                            <span className="text-[11px] text-slate-400 italic">No GSTIN</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            client.status === "ACTIVE"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/clients/${client.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                        >
                          Open Profile <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Strip */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages || 1}</strong>
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded disabled:opacity-40 hover:bg-slate-100"
            >
              Previous
            </button>
            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-white border border-slate-300 rounded disabled:opacity-40 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Client Slide-Over / Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-base text-[#17365D]">Register New Client</h3>
                <p className="text-xs text-slate-500">
                  Assign legal constitution, statutory PAN, primary business, and GSTIN.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-4">
              {/* Section 1: Entity Basic Details */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  1. Legal Identity & PAN
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Legal Name of Client / Entity *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Apex Global Logistics Pvt Ltd"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Constitution / Client Type *
                    </label>
                    <select
                      value={formData.clientType}
                      onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                    >
                      <option value="PRIVATE_LIMITED">Private Limited Company</option>
                      <option value="LLP">Limited Liability Partnership (LLP)</option>
                      <option value="PROPRIETORSHIP">Proprietorship Firm</option>
                      <option value="PARTNERSHIP_FIRM">Partnership Firm</option>
                      <option value="INDIVIDUAL">Individual (Salaried / HNI)</option>
                      <option value="TRUST_SOCIETY">Trust / Society / Section 8</option>
                      <option value="PUBLIC_LIMITED">Public Limited Company</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Permanent Account Number (PAN) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      value={formData.pan}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                      className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Primary Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98123 45678"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="accounts@apexlogistics.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Address */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  2. Registered Address
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      placeholder="Plot No. 12, Industrial Area"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">City & State *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State (e.g. Delhi)"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Initial Business & GSTIN */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-100 pb-1">
                  3. Primary Business & GST Registration (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Trade Name</label>
                    <input
                      type="text"
                      placeholder="Apex Logistics"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">15-digit GSTIN</label>
                    <input
                      type="text"
                      maxLength={15}
                      placeholder="07ABCDE1234F1Z5"
                      value={formData.gstin}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                      className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 text-xs font-semibold bg-[#17365D] hover:bg-[#2563EB] text-white rounded transition-colors disabled:opacity-50"
                >
                  {creating ? "Saving..." : "Save & Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
