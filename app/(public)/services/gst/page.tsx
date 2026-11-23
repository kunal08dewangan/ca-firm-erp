import Link from "next/link";
import { FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, Calendar } from "lucide-react";

export default function GstServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">GST Advisory & Filings</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Goods & Services Tax (GST) Compliance & Advisory
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          End-to-end multi-state GST management from statutory registration and automated GSTR-2B ITC matching to departmental scrutiny representation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Our GST Practice Scope</h2>
            <p className="text-xs text-slate-600">
              Under the Indian GST regime, compliance is heavily digitized and strictly time-bound. Minor classification errors in Place of Supply (POS) or inadvertent claims of ineligible Input Tax Credit under Section 17(5) lead to severe interest (18% p.a.) and automated scrutiny notices (Form DRC-01B/C). We protect your business by maintaining an integrated tax register.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-semibold text-[#17365D]">Monthly & Quarterly Filings</p>
                <p className="text-slate-500 mt-1">GSTR-1 (Outward Supplies), GSTR-3B (Summary Tax), CMP-08 for Composition, and GSTR-4.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-semibold text-[#17365D]">GSTR-2B vs Books Reconciliation</p>
                <p className="text-slate-500 mt-1">Automated 4-bucket algorithm to identify missing invoices, tax mismatches, and inactive vendors.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-semibold text-[#17365D]">Annual Returns (GSTR-9 & 9C)</p>
                <p className="text-slate-500 mt-1">Turnover reconciliation between audited financial statements and filed returns with CA certification.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="font-semibold text-[#17365D]">Departmental Notice Drafting</p>
                <p className="text-slate-500 mt-1">Authoritative representation and reply drafting for notices u/s 61, 73, 74, DRC-01, and summons.</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="text-base font-bold text-[#17365D]">Section 17(5) Ineligible ITC Screening</h3>
            <p className="text-xs text-slate-600">
              We implement stringent screening of your purchase vouchers to prevent illegal claims on blocked items:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Motor vehicles and conveyances (except when used for taxable transportation/driving training)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Food, beverages, outdoor catering, beauty treatment, and health services</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Club memberships, fitness centers, and travel benefits extended to employees</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Works contract services supplied for construction of immovable property</span>
              </li>
            </ul>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Require Immediate GST Help?</h3>
            <p className="text-xs text-blue-200">
              Schedule a review of your pending GSTR-1, GSTR-3B, or departmental notice with our Indirect Tax Partner.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Consult GST Partner
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
