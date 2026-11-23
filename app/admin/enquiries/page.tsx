"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Filter,
  Phone,
  Mail,
  MessageCircle,
  UserCheck,
  Trash2,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Building,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  serviceName: string;
  message: string;
  status: "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [counts, setCounts] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedStatus !== "ALL") params.set("status", selectedStatus);

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        setCounts(data.counts || { total: 0, new: 0, contacted: 0, converted: 0 });
      }
    } catch (err) {
      console.error("Error loading enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEnquiries();
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e))
        );
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleConvertToClient = async (enquiry: Enquiry) => {
    if (!confirm(`Convert "${enquiry.name}" into a registered practice client in the ERP?`)) return;

    setConvertingId(enquiry.id);
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enquiryId: enquiry.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessNotice(`✓ Successfully converted ${enquiry.name} to registered client (${data.client.clientCode})!`);
        setTimeout(() => setSuccessNotice(null), 6000);
        fetchEnquiries();
      } else {
        alert("Failed to convert lead to client. Please check server logs.");
      }
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Error converting lead to client.");
    } finally {
      setConvertingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== id));
        fetchEnquiries();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const cleanPhone = (phone: string) => {
    const digits = phone.replace(/[^0-9]/g, "");
    return digits.startsWith("91") ? digits : `91${digits}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:text-[#2563EB]">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-semibold">Website Leads & Enquiries</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#2563EB]" />
            Website Leads & Enquiries
          </h1>
          <p className="text-xs text-slate-500">
            Real-time prospective client requirements received from the online consultation form.
          </p>
        </div>

        <button
          onClick={fetchEnquiries}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 text-slate-700"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Leads
        </button>
      </div>

      {/* Success Notification Banner */}
      {successNotice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between text-xs font-semibold shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successNotice}</span>
          </div>
          <Link href="/admin/clients" className="underline hover:text-emerald-900 ml-4">
            View Clients Directory →
          </Link>
        </div>
      )}

      {/* 2. Metric Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total Inbound Leads</span>
          <p className="text-2xl font-bold text-[#17365D] mt-1">{counts.total}</p>
          <span className="text-[11px] text-slate-400">All submissions</span>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm bg-blue-50/30">
          <span className="text-xs text-blue-700 font-semibold block">New (Action Required)</span>
          <p className="text-2xl font-bold text-blue-700 mt-1">{counts.new}</p>
          <span className="text-[11px] text-blue-600">Awaiting CA reply</span>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm bg-amber-50/30">
          <span className="text-xs text-amber-700 font-semibold block">Contacted</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">{counts.contacted}</p>
          <span className="text-[11px] text-amber-600">Discussion in progress</span>
        </div>

        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-sm bg-emerald-50/30">
          <span className="text-xs text-emerald-700 font-semibold block">Converted to Clients</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">{counts.converted}</p>
          <span className="text-[11px] text-emerald-600">Retainer onboarded</span>
        </div>
      </div>

      {/* 3. Search and Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {["ALL", "NEW", "CONTACTED", "CONVERTED", "CLOSED"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedStatus === st
                  ? "bg-[#17365D] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st === "ALL" ? "All Leads" : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            Search
          </button>
        </form>
      </div>

      {/* 4. Enquiries List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2563EB]" />
            <p className="text-sm font-semibold">Loading prospective leads from database...</p>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-3">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300" />
            <h3 className="text-base font-bold text-slate-700">No Enquiries Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Any consultation submitted through your website homepage or contact page will automatically show up here.
            </p>
          </div>
        ) : (
          enquiries.map((enquiry) => {
            const isNew = enquiry.status === "NEW";
            const isConverted = enquiry.status === "CONVERTED";
            const whatsappUrl = `https://wa.me/${cleanPhone(enquiry.mobile)}?text=${encodeURIComponent(
              `Hello ${enquiry.name}, Greetings from G. Dewangan & Associates! We received your enquiry regarding "${enquiry.serviceName}". How can we assist you with this?`
            )}`;

            return (
              <div
                key={enquiry.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
                  isNew ? "border-blue-300 bg-blue-50/10 ring-1 ring-blue-100" : "border-slate-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
                  {/* Prospect Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-[#17365D]">{enquiry.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          enquiry.status === "NEW"
                            ? "bg-blue-100 text-blue-700"
                            : enquiry.status === "CONTACTED"
                            ? "bg-amber-100 text-amber-700"
                            : enquiry.status === "CONVERTED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(enquiry.createdAt)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{enquiry.mobile}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{enquiry.email}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium text-slate-700">
                        <Briefcase className="w-3 h-3 text-[#2563EB]" />
                        <span>{enquiry.serviceName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Buttons for CA */}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* WhatsApp */}
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                      title="Direct WhatsApp Chat"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Direct Call */}
                    <a
                      href={`tel:${enquiry.mobile}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Direct Phone Call"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500" />
                      <span>Call</span>
                    </a>

                    {/* Direct Email */}
                    <a
                      href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                        `Regarding your enquiry for ${enquiry.serviceName} - G. Dewangan & Associates`
                      )}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      title="Send Official Email"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500" />
                      <span>Email</span>
                    </a>

                    {/* Convert to Client Button */}
                    {!isConverted ? (
                      <button
                        onClick={() => handleConvertToClient(enquiry)}
                        disabled={convertingId === enquiry.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17365D] hover:bg-[#1E4273] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                        title="Add to Official ERP Client Register"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-200" />
                        <span>{convertingId === enquiry.id ? "Converting..." : "Convert to Client"}</span>
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Registered Client
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Body */}
                <div className="pt-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-xs text-slate-700 flex-1 w-full">
                    <span className="font-semibold text-slate-500 block mb-0.5">Client Requirement / Brief Description:</span>
                    <p className="whitespace-pre-wrap">{enquiry.message}</p>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <span className="text-xs text-slate-400 font-medium">Status:</span>
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white font-medium focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="CONVERTED">Converted</option>
                      <option value="CLOSED">Closed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
