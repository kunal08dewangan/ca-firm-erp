"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  Building2,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Send,
  FileCheck,
} from "lucide-react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    serviceName: "Corporate Tax Advisory",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const res = await fetch("/api/public/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitStatus("success");
        setStatusMessage(data.message || "Thank you. Our senior partner will contact you shortly.");
        setFormData({ name: "", email: "", mobile: "", serviceName: "Corporate Tax Advisory", message: "" });
      } else {
        setSubmitStatus("error");
        setStatusMessage(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setSubmitStatus("error");
      setStatusMessage("Network error. Please try again or call our office directly.");
    }
  };

  const services = [
    {
      title: "GST Compliance & Advisory",
      desc: "End-to-end GST registration, monthly GSTR-1 & 3B filing, automated GSTR-2B ITC matching, and departmental notice representation.",
      icon: FileSpreadsheet,
      href: "/services/gst",
    },
    {
      title: "Corporate & Personal Income Tax",
      desc: "Statutory ITR filing (ITR-1 to ITR-7), comparative Old vs New Regime optimization, advance tax computation, and foreign asset disclosures.",
      icon: Calculator,
      href: "/services/income-tax",
    },
    {
      title: "Statutory & Tax Audit (44AB)",
      desc: "ICAI-compliant corporate statutory audits, Section 44AB tax audits, internal risk control reviews, and transfer pricing certifications.",
      icon: ShieldCheck,
      href: "/services/audit",
    },
    {
      title: "Double-Entry Accounting & MIS",
      desc: "Accrual-based bookkeeping, custom Chart of Accounts, monthly P&L/Balance Sheets, bank reconciliations, and Virtual CFO guidance.",
      icon: TrendingUp,
      href: "/services/accounting",
    },
    {
      title: "Company & LLP Incorporation",
      desc: "Turnkey MCA company incorporation, DIN/DSC allocation, MOA/AOA drafting, annual filings (AOC-4, MGT-7), and Startup India recognition.",
      icon: Building2,
      href: "/services/company-registration",
    },
    {
      title: "TDS / TCS Returns & Withholding",
      desc: "Timely deduction calculation, quarterly 24Q, 26Q, 27Q return generation, Form 16/16A distribution, and lower deduction certificate filings.",
      icon: FileCheck,
      href: "/services/tds-tcs",
    },
  ];

  const experienceStats = [
    { value: "26+", label: "Years of Practice", sub: "Founded in 1998" },
    { value: "1,450+", label: "Active Retainer Clients", sub: "Corporates, LLPs & HNIs" },
    { value: "100%", label: "ICAI Compliance Record", sub: "Zero-defect peer review" },
    { value: "₹42 Cr+", label: "Legitimate Tax Saved", sub: "Through legal structuring" },
  ];

  const taxUpdates = [
    {
      date: "Nov 2026",
      tag: "GST Notice",
      title: "Advisory on GSTR-2B vs Books Reconciliation for Input Tax Credit",
      desc: "Strict adherence to Section 16(2)(aa) required. Any ITC claimed in excess of GSTR-2B auto-drafted statement attracts automated Form DRC-01C notices.",
    },
    {
      date: "Nov 2026",
      tag: "Income Tax",
      title: "Section 43B(h) MSME Vendor Payment Strict Enforcement",
      desc: "Payments due to micro and small enterprises beyond 45 days (or 15 days without written agreement) will be disallowed as business deduction in current FY.",
    },
    {
      date: "Nov 2026",
      tag: "MCA Compliance",
      title: "Annual Filing Deadlines for Companies (AOC-4 & MGT-7)",
      desc: "Statutory deadlines for filing financial statements and annual return without additional per-day penalty fees.",
    },
  ];

  const faqs = [
    {
      q: "Can one client maintain multiple GST registrations across different states?",
      a: "Yes. Our practice ERP natively supports multi-state GSTINs under a single corporate PAN, allowing segregated sales registers, purchase reconciliations, and consolidated MIS reporting.",
    },
    {
      q: "Which Income Tax Regime is more beneficial: Old or New?",
      a: "Under the latest Finance Acts, the New Tax Regime (Section 115BAC) offers lower slab rates and a ₹75,000 standard deduction. However, for individuals with substantial home loan interest (Section 24b) and Chapter VI-A deductions, the Old Regime may still yield greater savings. Our ERP computes both automatically to identify the exact optimal regime.",
    },
    {
      q: "What is your procedure for handling statutory audit queries?",
      a: "All audit observations, working papers, and management representations are documented with strict ledger voucher cross-referencing, ensuring full transparency and compliance with ICAI Standards on Auditing (SAs).",
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white via-[#F7F9FC] to-[#F1F5F9] pt-12 pb-16 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-[#17365D] text-xs font-semibold px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>ICAI Registered Firm • 26 Years of Trust</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#17365D] tracking-tight leading-tight">
                Corporate Tax Advisory, Statutory Audit & Financial Governance
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
                G. Dewangan & Associates delivers meticulous accounting, multi-jurisdiction GST compliance, and strategic tax planning for growing businesses, startups, and high-net-worth individuals across India.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/book-appointment"
                  className="bg-[#17365D] hover:bg-[#2563EB] text-white font-medium text-sm px-6 py-3 rounded-md shadow-sm transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule CA Consultation
                </Link>
                <Link
                  href="/services"
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm px-6 py-3 rounded-md shadow-sm transition-all flex items-center gap-2"
                >
                  Explore Practice Areas
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Peer-Reviewed Practice</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Strict Confidentiality</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Partner Access</span>
                </div>
              </div>
            </div>

            {/* Right Card: Quick Consultation Booking */}
            <div className="lg:col-span-5">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-bold text-base text-[#17365D]">Instant Professional Consultation</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connect directly with a Senior Chartered Accountant for compliance or tax planning.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name / Entity Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Rajesh Sharma / TechCorp Pvt Ltd"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Mobile (WhatsApp) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Service Required *</label>
                    <select
                      value={formData.serviceName}
                      onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB] bg-white"
                    >
                      <option value="Corporate Tax Advisory">Corporate Tax Advisory</option>
                      <option value="GST Registration & Filing">GST Registration & Filing</option>
                      <option value="Statutory & Tax Audit">Statutory & Tax Audit</option>
                      <option value="Bookkeeping & Double-Entry Accounting">Bookkeeping & Double-Entry Accounting</option>
                      <option value="Company / LLP Incorporation">Company / LLP Incorporation</option>
                      <option value="TDS Compliance & Returns">TDS Compliance & Returns</option>
                      <option value="Department Notice Representation">Department Notice Representation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Brief Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Specify your entity type, annual turnover, or key query..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{statusMessage}</span>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded text-xs">
                      {statusMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="w-full bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold py-2.5 rounded transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {submitStatus === "loading" ? (
                      "Transmitting Request..."
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Submit Request to CA
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-slate-400 text-center">
                    Protected by client-attorney privilege and strict professional confidentiality.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT THE FIRM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-xl p-8 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                About G. Dewangan & Associates
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17365D]">
                Excellence in Statutory Auditing & Indian Tax Jurisprudence
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Headquartered in Bhilai, Chhattisgarh, <strong>G. Dewangan & Associates</strong> is a premier multi-disciplinary Chartered Accountancy firm registered with the Institute of Chartered Accountants of India (ICAI). Led by CA Gajendra Dewangan (10+ Years Experience) and CA Niraj Dewangan (5+ Years Experience), we provide comprehensive corporate compliance, statutory auditing, direct and indirect taxation, and transaction advisory services.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We believe that accounting is not merely a post-mortem historical record, but a proactive managerial tool for risk mitigation and strategic corporate growth. Every client engagement is managed directly by qualified CAs with rigorous quality reviews.
              </p>
              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Read Partner Profiles & Practice History
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#F7F9FC] border border-slate-200 rounded-lg p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Key Credentials
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>ICAI Firm Registration:</strong> 018472N</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>CAG & RBI Empanelled:</strong> Category-II Audit Firm</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Peer Review Board:</strong> Certified clean rating</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Specialization:</strong> SaaS, Manufacturing, Healthcare, Real Estate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRACTICE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Specialized Practice Areas
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#17365D]">
            Comprehensive Accounting & Regulatory Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Tailored professional solutions designed to maintain flawless compliance with Indian statutory authorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#17365D] group-hover:bg-[#17365D] group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-[#17365D] group-hover:text-[#2563EB] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 mt-4">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                  >
                    View Details & Workflow
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY CHOOSE US & PROFESSIONAL EXPERIENCE */}
      <section className="bg-white border-y border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#17365D]">
                Precision, Integrity and Uncompromising Confidentiality
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In an era of automated notices and artificial intelligence scrutiny by the Income Tax Department (Faceless Assessment) and GSTN (DRC-01B/C), an error in returns can lead to severe penalties and frozen accounts. We safeguard your business through proactive compliance audits.
              </p>
              <div className="space-y-2.5 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Dual CA verification on every return prior to filing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Guaranteed compliance with zero penalty track record</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Integrated double-entry ERP for real-time reconciliation</span>
                </div>
              </div>
            </div>

            {/* Experience Metric Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
              {experienceStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#F7F9FC] border border-slate-200 rounded-xl p-6 text-center space-y-1"
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-[#17365D]">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-700">{stat.label}</p>
                  <p className="text-[11px] text-slate-500">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST TAX UPDATES & CIRCULARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Statutory Bulletins
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#17365D]">
              Recent Tax Circulars & Compliance Alerts
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
          >
            All Notifications & Articles
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {taxUpdates.map((item) => (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
                <h4 className="font-bold text-sm text-[#17365D] line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.desc}
                </p>
              </div>
              <Link
                href="/blog"
                className="text-[11px] font-semibold text-[#2563EB] hover:underline inline-flex items-center gap-1 pt-2"
              >
                Read Impact Analysis <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-slate-50 border-y border-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
              Client Testimonials
            </span>
            <h2 className="text-2xl font-bold text-[#17365D]">
              Endorsed by Business Leaders & Founders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "G. Dewangan & Associates structured our tax compliance model and resolved complicated GST input credit issues within days. Their deep understanding of commercial taxation is peerless."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-[#17365D]">Vikram Sharma</p>
                <p className="text-[11px] text-slate-500">Managing Director, CloudOrbit Technologies</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "Handling statutory compliance and business accounts used to be a challenge until we engaged G. Dewangan & Associates. Their double-entry accounting reconciliation caught critical unclaimed GST ITC."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-[#17365D]">Ananya Reddy</p>
                <p className="text-[11px] text-slate-500">CFO, Apex Healthcare & Diagnostics LLP</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-600 italic leading-relaxed">
                "During our statutory audit and Income Tax assessment under Section 143(3), their documentation was flawless. The assessing officer accepted the computation without a single disallowance."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-[#17365D]">Rajesh Mittal</p>
                <p className="text-[11px] text-slate-500">Founder, Mittal Textile Mills</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
            Got Questions?
          </span>
          <h2 className="text-2xl font-bold text-[#17365D]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-2"
            >
              <h4 className="font-semibold text-sm text-[#17365D] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-secondary shrink-0" />
                {faq.q}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="text-xs font-semibold text-[#2563EB] hover:underline"
          >
            Browse all 25+ tax and audit FAQs →
          </Link>
        </div>
      </section>

      {/* 8. CALL TO ACTION STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17365D] text-white rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Protect Your Business with Professional Financial Stewardship
          </h2>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Schedule an in-person or virtual consultation with our Senior Partners. We analyze your corporate structure, verify your GST ITC position, and optimize your advance tax obligations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/book-appointment"
              className="bg-[#2563EB] hover:bg-blue-600 text-white font-medium text-xs px-6 py-3 rounded shadow-sm transition-colors flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </Link>
            <Link
              href="/contact"
              className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium text-xs px-6 py-3 rounded transition-colors flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4" />
              Contact Our New Delhi Office
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
