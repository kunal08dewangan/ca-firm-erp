"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, CheckCircle2 } from "lucide-react";

export default function EnquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    serviceName: "General Practice Enquiry",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
        setFormData({ name: "", email: "", mobile: "", serviceName: "General Practice Enquiry", message: "" });
      } else {
        setStatus("error");
        setFeedback(data.error);
      }
    } catch {
      setStatus("error");
      setFeedback("Failed to transmit enquiry.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Lead Capture
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#17365D]">
          Submit a Professional Practice Enquiry
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Our team reviews requirements and prepares customized fee quotes and scope documents within 24 hours.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Your Name / Entity *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Sunil Verma / Sunrise Enterprises"
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@business.com"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Mobile *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="+91 98111 22334"
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Service Subject *</label>
            <input
              type="text"
              required
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Scope Details *</label>
            <textarea
              rows={4}
              required
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Describe your current accounting software, entity turnover, number of GST registrations..."
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          {status === "success" && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs">
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-3 rounded shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}
