import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Regulatory Terms
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Terms & Conditions of Professional Engagement
        </h1>
        <p className="text-xs text-slate-500">
          Last Revised: November 2026 • Governing terms for engagement with Dewangan &amp; Associates, Tax &amp; Financial Consultants.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 text-xs text-slate-700 leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">1. Professional Consultancy Disclaimer</h2>
          <p>
            Dewangan &amp; Associates provides taxation, GST compliance, bookkeeping, and business financial advisory services. The information provided on this website and client portals is intended to facilitate professional consultation and statutory compliance. Client engagements are governed by mutual terms of engagement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">2. Client Representation & Data Veracity</h2>
          <p>
            Tax computations, GST returns, and statutory audits are performed based on the books of account, invoices, and documentary evidence furnished by the client. The client warrants that all vouchers, bank transactions, and revenue declarations represent true and fair transactions. The firm does not assume liability for omissions or falsifications in underlying client records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">3. Official Government Filings & Approvals</h2>
          <p>
            While our practice prepares and verifies all e-returns (GST, ITR, MCA, TDS) with rigorous care, official submissions are subject to client verification and explicit sign-off. The firm is not liable for delayed filings caused by outages on government portals (e-Filing, GSTN, MCA21/V3) or delay in client approval.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-[#17365D]">4. Jurisdiction & Governing Law</h2>
          <p>
            All engagements, contracts, and disputes are governed exclusively by the laws of India and subject to the exclusive jurisdiction of the competent courts in New Delhi.
          </p>
        </section>
      </div>
    </div>
  );
}
