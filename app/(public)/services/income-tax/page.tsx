import Link from "next/link";
import { Calculator, CheckCircle2, ArrowRight } from "lucide-react";

export default function IncomeTaxServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">Income Tax & ITR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Corporate & Personal Income Tax Advisory
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Comprehensive direct tax advisory, scientific Old vs New Regime optimization, statutory ITR filing, and faceless assessment defense.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Comprehensive ITR Filing Portfolio</h2>
            <p className="text-xs text-slate-600">
              Our firm prepares and files statutory returns for all classes of tax assessees:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">ITR-1 (Sahaj) & ITR-2</span>
                <p className="text-slate-500 mt-1">Salaried individuals, multiple house properties, capital gains, foreign assets, and directorships.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">ITR-3 & ITR-4 (Sugam)</span>
                <p className="text-slate-500 mt-1">Proprietorships, professionals, presumptive taxation u/s 44AD, 44ADA, and partners in firms.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">ITR-5 (Partnerships & LLPs)</span>
                <p className="text-slate-500 mt-1">Limited Liability Partnerships, Association of Persons (AOPs), and Body of Individuals (BOIs).</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">ITR-6 & ITR-7 (Corporates & Trusts)</span>
                <p className="text-slate-500 mt-1">Domestic and foreign companies, Section 8 entities, charitable trusts, and educational societies.</p>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h3 className="text-base font-bold text-[#17365D]">Old vs. New Tax Regime Optimization (Sec 115BAC)</h3>
            <p className="text-xs text-slate-600">
              Under recent Indian Union Budgets, the New Tax Regime is the default regime with enhanced standard deduction (₹75,000 for salaried employees) and revised progressive slab rates. We run computational models comparing both regimes side-by-side to guarantee the lowest legally permissible tax liability.
            </p>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">File Your ITR with Qualified CAs</h3>
            <p className="text-xs text-blue-200">
              Avoid automated AIS/TIS mismatch notices. Get your Form 26AS, AIS, and capital gains statements verified.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Book Tax Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
