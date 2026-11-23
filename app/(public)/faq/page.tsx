import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";

export default function FaqPage() {
  const faqCategories = [
    {
      category: "Goods & Services Tax (GST)",
      items: [
        {
          q: "What is the threshold limit for mandatory GST registration in India?",
          a: "For suppliers of goods, the threshold is ₹40 Lakhs annual turnover for normal states and ₹20 Lakhs for special category states. For service providers, the mandatory threshold is ₹20 Lakhs (₹10 Lakhs in special category states). E-commerce sellers and interstate suppliers are required to register regardless of turnover.",
        },
        {
          q: "How does our firm handle GSTR-2B Input Tax Credit reconciliation?",
          a: "We utilize automated reconciliation algorithms that compare your accounting purchase register against the official GSTR-2B JSON statement. Invoices are categorized into Exact Matches, Tax Discrepancies, Missing in Books, and Missing in 2B (unfiled by vendor), ensuring zero blocked working capital.",
        },
        {
          q: "What happens if a supplier files GSTR-1 late?",
          a: "Under Section 16(2)(aa) of the CGST Act, you can only claim ITC if the invoice appears in your GSTR-2B. If your vendor files late, the ITC moves to the subsequent month's GSTR-2B, deferring your credit claim.",
        },
      ],
    },
    {
      category: "Income Tax & Assessment",
      items: [
        {
          q: "When is a Tax Audit under Section 44AB mandatory for businesses and professionals?",
          a: "For businesses, tax audit is mandatory if gross turnover exceeds ₹1 Crore (or ₹10 Crores if cash receipts and payments do not exceed 5% of total transactions). For professionals, the threshold is ₹50 Lakhs (or ₹75 Lakhs under presumptive taxation u/s 44ADA with 95% digital transactions).",
        },
        {
          q: "What is the consequence of failing to deduct or deposit TDS on time?",
          a: "Late deduction attracts 1% interest per month, while late deposit attracts 1.5% interest per month under Section 201(1A). Furthermore, 30% of resident expenses (or 100% of non-resident payments) are disallowed as business expenses under Section 40(a)(ia).",
        },
        {
          q: "How does Singhania & Co. represent clients during Faceless Scrutiny?",
          a: "All notices received on the e-filing portal are analyzed, quantitative reconciliation schedules prepared, legal precedents cited from ITAT and High Court decisions, and digital submissions signed by our Managing Partner.",
        },
      ],
    },
    {
      category: "Company Law & Incorporation",
      items: [
        {
          q: "What are the key annual statutory compliance requirements for a Private Limited Company?",
          a: "A private limited company must appoint statutory auditors (ADT-1), file annual financial statements in Form AOC-4, file annual return in Form MGT-7/7A, hold at least 4 Board meetings and one AGM, and conduct annual Director KYC (DIR-3 KYC).",
        },
        {
          q: "Can a foreign national or NRI be a director in an Indian Private Limited Company?",
          a: "Yes, provided at least one director on the Board is an Indian resident (who has stayed in India for at least 182 days in the previous financial year).",
        },
      ],
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Statutory answers to critical direct tax, GST, statutory audit, and company law compliance queries.
        </p>
      </div>

      <div className="space-y-8">
        {faqCategories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-lg font-bold text-[#17365D] border-b border-slate-200 pb-2">
              {cat.category}
            </h2>
            <div className="space-y-3">
              {cat.items.map((item, qIdx) => (
                <div
                  key={qIdx}
                  className="bg-white border border-slate-200 rounded-lg p-5 space-y-2 shadow-sm"
                >
                  <h3 className="text-sm font-semibold text-[#17365D] flex items-start gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#F7F9FC] border border-slate-200 rounded-xl p-6 text-center space-y-3">
        <h3 className="font-bold text-[#17365D] text-sm">Have a unique tax or structural query?</h3>
        <p className="text-xs text-slate-600">
          Our Chartered Accountants provide specialized written tax opinions and structuring advice.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors"
        >
          Submit Query to Partner
        </Link>
      </div>
    </div>
  );
}
