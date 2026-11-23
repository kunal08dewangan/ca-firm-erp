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
          About G. Dewangan & Associates, Chartered Accountants
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          We are an established Indian Chartered Accountancy practice providing corporate tax advisory, comprehensive GST filing, statutory audit, ROC compliance, and strategic financial accounting services.
        </p>
      </div>

      {/* Main Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#17365D]">Our Professional Background</h2>
            <p>
              <strong>G. Dewangan & Associates</strong> is registered with the Institute of Chartered Accountants of India (ICAI) under Firm Registration Number <strong>018472C</strong>. We deliver robust, partner-led statutory compliance and tax planning solutions tailored for Indian private limited companies, LLPs, partnership firms, traders, and high-net-worth individuals.
            </p>
            <p>
              Our firm is dedicated to upholding the highest standards of professional competence, providing clients with clear, actionable statutory insights and proactive tax planning.
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
            
            {/* 1st Partner: CA Gajendra Dewangan */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <div>
                  <h3 className="font-bold text-base text-[#17365D]">CA Gajendra Dewangan</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Associated CA / Managing Partner • B.Com, FCA, DISA (ICAI) • ICAI M.No: 084920
                  </p>
                </div>
                <span className="text-[11px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded w-fit">
                  10+ Years Experience
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Specializes in Corporate Tax Planning, Direct Tax Scrutiny Representation, GST Compliance, Statutory Audits, and Financial Advisory. With over 10+ years of practicing experience, he has advised numerous corporate entities, MSMEs, industrial firms, and high-net-worth clients across Chhattisgarh and across India.
              </p>
            </div>

            {/* 2nd Partner: CA Niraj Dewangan */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                <div>
                  <h3 className="font-bold text-base text-[#17365D]">CA Niraj Dewangan</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Co. CA / Partner • B.Com, ACA • Chartered Accountant
                  </p>
                </div>
                <span className="text-[11px] bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded w-fit">
                  5+ Years Experience
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Leads the Indirect Taxation (GST), ROC & MCA compliances, Accounting automation, and Internal Audit practice. With 5+ years of dedicated professional experience, he specializes in GSTR-9/9C annual reconciliations, input tax credit optimization, and startup compliance management.
              </p>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Book a Practice Consultation</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              Meet directly with our partners at our Bhilai office or arrange a virtual video conference call.
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
                <span className="font-semibold text-slate-800">018472C</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Managing Partner:</span>
                <span className="font-semibold text-slate-800">CA Gajendra Dewangan (10+ Yrs)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Co. Partner:</span>
                <span className="font-semibold text-slate-800">CA Niraj Dewangan (5+ Yrs)</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Head Office:</span>
                <span className="font-semibold text-slate-800">Bhilai, Chhattisgarh</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Phone:</span>
                <span className="font-semibold text-slate-800">+91 78984 87448</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Email:</span>
                <span className="font-semibold text-slate-800">gajendradewangan@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
