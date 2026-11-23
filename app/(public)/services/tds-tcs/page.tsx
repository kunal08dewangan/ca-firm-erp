import Link from "next/link";
import { FileCheck, CheckCircle2 } from "lucide-react";

export default function TdsTcsServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">TDS & TCS Compliance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          TDS & TCS Withholding Tax Advisory & Filings
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Comprehensive compliance with Chapter XVII of the Income Tax Act, Form 24Q, 26Q, 27Q quarterly returns, TRACES reconciliation, and Form 16/16A generation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Withholding Tax Mandates Covered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Form 24Q (Salary TDS)</span>
                <p className="text-slate-500 mt-1">Section 192 tax computation based on employee declaration under Old vs New Tax Regimes.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Form 26Q (Resident Vendor TDS)</span>
                <p className="text-slate-500 mt-1">Deductions u/s 194C (Contractors), 194J (Professional/Tech fees), 194I (Rent), 194H (Commission), 194Q (Goods purchase).</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Form 27Q & 27EQ (Non-Resident & TCS)</span>
                <p className="text-slate-500 mt-1">Foreign remittances u/s 195 (with Form 15CA/15CB) and Tax Collected at Source on scrap/vehicles/206C(1H).</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">TRACES Justification Report Rectifications</span>
                <p className="text-slate-500 mt-1">Resolving short deduction, late deduction, and PAN error demands on the TRACES portal.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Clear TDS Defaults & Notices</h3>
            <p className="text-xs text-blue-200">
              Download your TRACES default report and let our direct tax associates file online corrections.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Consult TDS Specialist
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
