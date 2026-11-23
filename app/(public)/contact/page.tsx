"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    serviceName: "General Enquiry",
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
        setFormData({ name: "", email: "", mobile: "", serviceName: "General Enquiry", message: "" });
      } else {
        setStatus("error");
        setFeedback(data.error);
      }
    } catch {
      setStatus("error");
      setFeedback("Failed to submit enquiry. Please call our office directly.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Get In Touch
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Contact Singhania & Co., Chartered Accountants
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Visit our Connaught Place office or write to our partners for corporate tax, auditing, or GST consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-base font-bold text-[#17365D]">Head Office Location</h2>
            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Singhania & Co. (ICAI Reg. 018472N)</p>
                  <p>402, Corporate Heights, Barakhamba Road</p>
                  <p>Connaught Place, New Delhi 110001, India</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Phone & WhatsApp</p>
                  <p>+91 98101 23456 / 011-43219876</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#2563EB] shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Direct Email</p>
                  <p>contact@cafirm.in / partners@cafirm.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-800">Office Working Hours</p>
                  <p>Monday – Saturday: 9:30 AM to 6:30 PM IST</p>
                  <p className="text-slate-400">Closed on Sundays & Gazetted Public Holidays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#17365D] mb-1">Send a Message to Our Partners</h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below. All queries are assigned directly to the relevant subject-matter FCA.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name / Entity Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Chandra / Chandra Tech Ventures"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Corporate Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="+91 98123 45678"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Practice Area of Interest *</label>
                <select
                  value={formData.serviceName}
                  onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  <option value="Corporate Tax Advisory">Corporate Tax Advisory</option>
                  <option value="GST Services & Returns">GST Services & Returns</option>
                  <option value="Statutory / Tax Audit">Statutory / Tax Audit</option>
                  <option value="Accounting & Virtual CFO">Accounting & Virtual CFO</option>
                  <option value="Company / LLP Registration">Company / LLP Registration</option>
                  <option value="TDS & Withholding Compliance">TDS & Withholding Compliance</option>
                  <option value="Department Notice Defense">Department Notice Defense</option>
                  <option value="General Enquiry">General Enquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Detailed Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your situation, annual turnover, key deadlines, or specific tax queries..."
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
                className="w-full bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-3 rounded shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === "loading" ? "Submitting..." : (
                  <>
                    <Send className="w-4 h-4" />
                    Transmit Enquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
