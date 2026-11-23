import Link from "next/link";
import { Building2, CheckCircle2 } from "lucide-react";

export default function CompanyRegistrationPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">Company Registration</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Company & LLP Incorporation (MCA Services)
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Fast-track business incorporation under the Ministry of Corporate Affairs (MCA), SPICe+ forms, digital signatures, PAN/TAN, and Startup India recognition.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Available Entity Structures</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Private Limited Company</span>
                <p className="text-slate-500 mt-1">Ideal for startups raising equity funding. Separate legal entity with limited liability and perpetual succession.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Limited Liability Partnership (LLP)</span>
                <p className="text-slate-500 mt-1">Lower compliance burden, zero dividend distribution tax, and optimal for professional firms and consultancies.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">One Person Company (OPC)</span>
                <p className="text-slate-500 mt-1">Full corporate structure and limited liability for a single entrepreneurial founder.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Section 8 Company (NGO)</span>
                <p className="text-slate-500 mt-1">Non-profit company structure with 12A and 80G tax exemptions under the Income Tax Act.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Incorporate in 7 to 10 Working Days</h3>
            <p className="text-xs text-blue-200">
              Submit your proposed company names and director details for name approval check.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Start Incorporation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
