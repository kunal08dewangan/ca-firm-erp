import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";

export default function BlogPage() {
  const articles = [
    {
      id: "msme-section-43bh-compliance",
      date: "Nov 20, 2026",
      category: "Income Tax Act",
      title: "Section 43B(h) MSME Vendor Payment Mandate: How to Avoid Severe Year-End Disallowances",
      summary:
        "Detailed analysis of the statutory 15-day and 45-day payment timelines to Micro and Small enterprises under MSMED Act 2006. Learn how to verify vendor Udyam certificates, classify trading vs manufacturing enterprises, and ensure deductibility in FY 2026-27.",
      readTime: "7 min read",
    },
    {
      id: "gstr-2b-reconciliation-drc01c",
      date: "Nov 14, 2026",
      category: "GST Rules",
      title: "Automated Form DRC-01C Notices for ITC Mismatches: Practical Action Plan",
      summary:
        "How the GST portal automatically compares Table 4(A)(5) of GSTR-3B with GSTR-2B. Step-by-step checklist to reply within the statutory 7-day period and reconcile supplier filing discrepancies.",
      readTime: "6 min read",
    },
    {
      id: "new-vs-old-regime-post-budget",
      date: "Nov 02, 2026",
      category: "Tax Planning",
      title: "New Tax Regime (Section 115BAC) vs Old Regime: The Definitive Comparative Study",
      summary:
        "Comprehensive mathematical modeling comparing standard deduction of ₹75,000, revised slab brackets, rebate under Section 87A up to ₹7 Lakhs, and forgone deductions under Chapter VI-A.",
      readTime: "10 min read",
    },
    {
      id: "transfer-pricing-safe-harbour",
      date: "Oct 25, 2026",
      category: "International Taxation",
      title: "Safe Harbour Rules for Indian IT and ITES Export Companies",
      summary:
        "Guidelines on operating profit margins, filing Form 3CEFA, and maintaining contemporaneous 3CEB documentation for cross-border software development and back-office subsidiaries.",
      readTime: "8 min read",
    },
    {
      id: "audit-trail-edit-log-mca",
      date: "Oct 12, 2026",
      category: "Corporate Law",
      title: "MCA Audit Trail (Edit Log) Mandate: Responsibilities of Management and Statutory Auditors",
      summary:
        "Analysis of Section 143(3) reporting standards under CARO and the Companies (Audit and Auditors) Rules regarding accounting software edit logs and preservation of audit trails.",
      readTime: "5 min read",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="border-b border-border pb-6 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Knowledge Hub & Bulletins
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Tax Updates, Circulars & Technical Articles
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Authoritative technical commentaries authored by our Senior Partners on direct taxation, GST jurisprudence, MCA corporate regulations, and statutory auditing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-[#2563EB] hover:shadow-md transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="bg-blue-50 text-[#2563EB] font-semibold px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#17365D] group-hover:text-[#2563EB] transition-colors leading-snug">
                {item.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                {item.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{item.readTime}</span>
              <span className="text-[#2563EB] font-semibold flex items-center gap-1 group-hover:underline">
                Read Commentary <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
