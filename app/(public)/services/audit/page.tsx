import Link from "next/link";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AuditServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">Audit & Assurance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Statutory Audit, Tax Audit (44AB) & Risk Assurance
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Independent, thorough examination of financial statements adhering strictly to financial reporting standards and statutory compliance mandates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Core Audit Engagements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Tax Audit u/s 44AB</span>
                <p className="text-slate-500 mt-1">Form 3CA/3CB and comprehensive 44-clause Form 3CD reporting, depreciation schedules, and 43B disallowances.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Corporate Statutory Audit</span>
                <p className="text-slate-500 mt-1">Companies Act 2013 audit, CARO 2020 reporting, internal financial controls, and true & fair view certification.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Internal & Management Audit</span>
                <p className="text-slate-500 mt-1">Operational efficiency review, standard operating procedures (SOP) audit, and fraud risk assessments.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Transfer Pricing Audit (92E)</span>
                <p className="text-slate-500 mt-1">Arm's length price determination for international and specified domestic transactions with Form 3CEB.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Appoint Statutory Auditors</h3>
            <p className="text-xs text-blue-200">
              Submit your company details for partner review and eligibility check under Section 139 of the Companies Act.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Contact Audit Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
