"use client";

import { useState } from "react";
import { Calendar, Clock, CheckCircle2, ShieldCheck, User, Mail, Phone } from "lucide-react";

export default function BookAppointmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    preferredDate: "",
    preferredTimeSlot: "10:00 AM - 11:00 AM",
    serviceRequired: "Income Tax Advisory",
    notes: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:30 AM - 12:30 PM",
    "02:30 PM - 03:30 PM",
    "04:00 PM - 05:00 PM",
    "05:30 PM - 06:30 PM",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/public/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFeedback(data.message);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          preferredDate: "",
          preferredTimeSlot: "10:00 AM - 11:00 AM",
          serviceRequired: "Income Tax Advisory",
          notes: "",
        });
      } else {
        setStatus("error");
        setFeedback(data.error);
      }
    } catch {
      setStatus("error");
      setFeedback("Failed to book appointment. Please try again or call our office.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Schedule a Session
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Book a CA Practice Consultation
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Reserve an in-person appointment at our New Delhi office or a secure video consultation with a Senior Partner.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              1. Your Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Kulkarni"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              2. Date & Time Selection
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Consultation Date *</label>
                <input
                  type="date"
                  required
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Preferred Time Slot *</label>
                <select
                  value={formData.preferredTimeSlot}
                  onChange={(e) => setFormData({ ...formData, preferredTimeSlot: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
              3. Engagement Focus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Service Subject *</label>
                <select
                  value={formData.serviceRequired}
                  onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  <option value="Income Tax Advisory">Income Tax Advisory (Corporate / Individual)</option>
                  <option value="GST Registration & Filing">GST Registration & Filing</option>
                  <option value="Statutory & Tax Audit">Statutory & Tax Audit (44AB)</option>
                  <option value="Company / LLP Incorporation">Company / LLP Incorporation</option>
                  <option value="Virtual CFO / MIS Accounting">Virtual CFO / MIS Accounting</option>
                  <option value="Notice Scrutiny & Appeals">Notice Scrutiny & Appeals</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Consultation Mode *</label>
                <select
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                >
                  <option value="IN_PERSON">In-Person at CP Office (New Delhi)</option>
                  <option value="VIDEO_CALL">Secure Video Conference (Google Meet)</option>
                  <option value="PHONE_CALL">Direct Phone Consultation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Specific Discussion Points / Notes</label>
              <textarea
                rows={3}
                placeholder="Share any background details, turnover figures, or documents you plan to present..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
              />
            </div>
          </div>

          {status === "success" && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedback}</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs">
              {feedback}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-3.5 rounded shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {status === "loading" ? "Scheduling Appointment..." : (
              <>
                <Calendar className="w-4 h-4" />
                Confirm Consultation Booking
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
