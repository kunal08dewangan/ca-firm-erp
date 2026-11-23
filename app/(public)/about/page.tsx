import Link from "next/link";
import { ShieldCheck, Award, Building, BookOpen, CheckCircle2, Calendar } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Breadcrumb */}
      <div className="space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Firm Credentials & Legacy
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          About Singhania & Co., Chartered Accountants
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Founded in 1998, we are a premier Indian Chartered Accountancy practice providing corporate tax advisory, comprehensive GST filing, statutory audit, transfer pricing, and strategic accounting services.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17365D]">Our Professional Background</h2>
            <p>
              Singhania & Co. is registered with the Institute of Chartered Accountants of India (ICAI) under Firm Registration Number <strong>018472N</strong>. Over the past 26+ years, we have grown from a boutique tax advisory to an established practice catering to Indian private limited companies, multinational subsidiaries, LLPs, partnership firms, and high-net-worth individuals.
            </p>
            <p>
              Our firm is empanelled with the Comptroller & Auditor General of India (CAG) and the Reserve Bank of India (RBI) for statutory audits of financial institutions and public sector enterprises.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17365D]">Our Core Values & Ethics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <h4 className="font-bold text-[#17365D] text-xs">Uncompromising Integrity</h4>
                <p className="text-xs text-slate-600">
                  We maintain strict adherence to ICAI Code of Ethics and legal boundaries, providing robust protection against departmental scrutiny.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <h4 className="font-bold text-[#17365D] text-xs">Technological Rigor</h4>
                <p className="text-xs text-slate-600">
                  Proprietary double-entry accounting reconciliation engines ensure that not a single rupee of eligible GST ITC is forfeited.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <h4 className="font-bold text-[#17365D] text-xs">Direct Partner Involvement</h4>
                <p className="text-xs text-slate-600">
                  Every return, tax computation, and audit opinion is reviewed and signed off by a qualified FCA partner.
                </p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <h4 className="font-bold text-[#17365D] text-xs">Absolute Confidentiality</h4>
                <p className="text-xs text-slate-600">
                  All client financial records are encrypted with AES-256 and never shared with any third party.
                </p>
              </div>
            </div>
          </section>

          {/* Partner Profiles */}
          <section className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-[#17365D]">Leadership & Partners</h2>
            
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <div>
                  <h3 className="font-bold text-base text-[#17365D]">CA Vikramaditya Singhania</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Managing Partner • B.Com (Hons), FCA, DISA (ICAI) • ICAI M.No: 084920
                  </p>
                </div>
                <span className="text-[11px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded w-fit">
                  26+ Years Experience
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specializes in Corporate Tax Planning, Cross-Border Structuring, Statutory Audits of listed entities, and Representation before the Income Tax Appellate Tribunal (ITAT). He is a certified Information System Auditor (DISA) and has advised over 500 corporate entities across technology, manufacturing, and healthcare sectors.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <div>
                  <h3 className="font-bold text-base text-[#17365D]">CA Radhika Singhania</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Senior Partner • B.Com, FCA, Certificate in Indirect Taxes (ICAI) • ICAI M.No: 092415
                  </p>
                </div>
                <span className="text-[11px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded w-fit">
                  20+ Years Experience
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leads the Indirect Tax (GST/Customs) and Company Law compliance practice. She regularly lectures at regional ICAI study circles on GSTR-9/9C reconciliations, Section 17(5) blocked credits, and automated departmental scrutiny management.
              </p>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Book a Practice Consultation</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              Meet directly with our partners at our Connaught Place office or arrange a virtual conference call.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Schedule Appointment
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Firm Overview Sheet
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">ICAI Firm Reg. No:</span>
                <span className="font-semibold text-slate-800">018472N</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Year Established:</span>
                <span className="font-semibold text-slate-800">1998</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Head Office:</span>
                <span className="font-semibold text-slate-800">New Delhi</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Partners:</span>
                <span className="font-semibold text-slate-800">4 FCAs</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Audit Staff:</span>
                <span className="font-semibold text-slate-800">22 Professionals</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
