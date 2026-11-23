import Link from "next/link";
import { TrendingUp, CheckCircle2 } from "lucide-react";

export default function AccountingServicesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <span className="text-[#2563EB] font-medium">Accounting & Bookkeeping</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Double-Entry Accounting, Bookkeeping & Virtual CFO
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Clean, accrual-based financial accounting complying with Indian Accounting Standards (Ind AS / AS) and statutory requirements of the Companies Act 2013.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#17365D]">Strict Double-Entry Bookkeeping</h2>
            <p className="text-xs text-slate-600">
              Every financial transaction posted by our accounting team maintains balanced debit and credit entries. In compliance with the latest MCA notifications regarding audit trail (edit log) features in accounting software, all transactions maintain immutable historical tracking.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Chart of Accounts Structuring</span>
                <p className="text-slate-500 mt-1">Hierarchical 5-tier classification tailored for your business industry.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Bank & Gateway Reconciliations</span>
                <p className="text-slate-500 mt-1">Daily/weekly matching of bank statements, Razorpay, Stripe, and UPI settlements.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Monthly MIS Reporting</span>
                <p className="text-slate-500 mt-1">Executive P&L statements, balance sheets, cash flow forecasts, and debtor ageing.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="font-bold text-[#17365D]">Virtual CFO Services</span>
                <p className="text-slate-500 mt-1">Strategic financial leadership for board presentations, fundraising, and budgeting.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#17365D] text-white rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-base">Outsource Your Accounts</h3>
            <p className="text-xs text-blue-200">
              Get an entire team of accountants and qualified CAs for less than the cost of one in-house manager.
            </p>
            <Link
              href="/book-appointment"
              className="w-full bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded text-center block transition-colors"
            >
              Get Bookkeeping Proposal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
