import Link from "next/link";
import {
  FileSpreadsheet,
  Calculator,
  ShieldCheck,
  Building2,
  TrendingUp,
  FileCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function ServicesPage() {
  const practiceAreas = [
    {
      title: "GST Services & Compliance",
      href: "/services/gst",
      icon: FileSpreadsheet,
      summary:
        "Comprehensive Goods and Services Tax compliance including state-wise registration, monthly GSTR-1, GSTR-3B filings, annual GSTR-9/9C reconciliation, and departmental notice management.",
      features: [
        "Multi-State GSTIN Registration & Amendments",
        "Automated GSTR-2B vs Books Purchase Reconciliation",
        "Section 17(5) Blocked ITC Audit & Classification",
        "GSTR-1 Invoicing with HSN/SAC Mapping",
        "GSTR-9 Annual Return & GSTR-9C Self-Certified Reconciliation",
        "Department Notice Drafting (DRC-01, ASMT-10, SCN)",
      ],
    },
    {
      title: "Income Tax Services & ITR",
      href: "/services/income-tax",
      icon: Calculator,
      summary:
        "Corporate and personal income tax planning, statutory ITR filing for all entity types (ITR-1 through ITR-7), comparative Old vs New Regime optimization, and advance tax computation.",
      features: [
        "ITR Filing for Companies, LLPs, Trusts & Individuals",
        "Old vs New Tax Regime (Section 115BAC) Scientific Analysis",
        "Advance Tax Quarterly Computation & Challan Generation",
        "Foreign Assets & Schedule FA Mandatory Reporting",
        "Capital Gains Tax Advisory on Real Estate, Equity & Crypto",
        "Faceless Assessment, Appeals & CIT(A) Representation",
      ],
    },
    {
      title: "Statutory & Tax Audit (Section 44AB)",
      href: "/services/audit",
      icon: ShieldCheck,
      summary:
        "Independent, rigorous audits in accordance with Standards on Auditing (SAs) issued by ICAI and statutory mandates under the Companies Act 2013 and Income Tax Act 1961.",
      features: [
        "Company Statutory Audits under Companies Act 2013",
        "Tax Audit under Section 44AB with Form 3CA/3CB and Form 3CD",
        "Transfer Pricing Audit under Section 92E (Form 3CEB)",
        "Internal Financial Controls over Financial Reporting (IFCoFR)",
        "Stock, Working Capital & Bank Concurrent Audits",
        "Special Due Diligence for Mergers & Acquisitions",
      ],
    },
    {
      title: "Double-Entry Accounting & Bookkeeping",
      href: "/services/accounting",
      icon: TrendingUp,
      summary:
        "Industrial-grade accrual accounting, customized Chart of Accounts, periodic Trial Balance verification, P&L, Balance Sheet preparation, and Virtual CFO services.",
      features: [
        "Double-Entry General Ledger Maintenance with Audit Trail",
        "Monthly Balance Sheet & Profit & Loss Statement (MIS)",
        "Multi-Bank Reconciliation Statements (BRS)",
        "Accounts Payable & Receivable Ageing Analysis",
        "Payroll Structuring & Statutory EPF/ESI Compliance",
        "Virtual CFO Advisory for Board Meetings & Investor Reporting",
      ],
    },
    {
      title: "Company & LLP Registration",
      href: "/services/company-registration",
      icon: Building2,
      summary:
        "End-to-end corporate structuring, Ministry of Corporate Affairs (MCA) SPICe+ incorporation, startup recognition, and annual statutory secretarial filings.",
      features: [
        "Private Limited Company & One Person Company (OPC) Setup",
        "Limited Liability Partnership (LLP) Agreement & Filing",
        "Section 8 (Non-Profit / NGO) Company Incorporation",
        "DPIIT Startup India Recognition & 80-IAC Tax Exemption",
        "Annual Filings: Form AOC-4 (Financials) & MGT-7 (Annual Return)",
        "Director KYC (DIR-3 KYC) & Company Share Transfers",
      ],
    },
    {
      title: "TDS & TCS Compliance",
      href: "/services/tds-tcs",
      icon: FileCheck,
      summary:
        "Complete withholding tax compliance under Chapter XVII of the Income Tax Act, including quarterly e-TDS returns, challan verification, and Form 16/16A generation.",
      features: [
        "Quarterly Form 24Q (Salary TDS) & Form 26Q (Non-Salary)",
        "Form 27Q (Non-Resident Withholding) & Form 27EQ (TCS)",
        "Section 194Q & 206C(1H) Purchase/Sale Withholding Audit",
        "Generation and Digital Signing of Form 16 and Form 16A",
        "TRACES Default Resolution (Short Deduction, Late Filing)",
        "Applications for Lower / Nil Deduction Certificate u/s 197",
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">
          Our Practice Offerings
        </span>
        <h1 className="text-3xl font-extrabold text-[#17365D]">
          Professional Accounting & Regulatory Services
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl">
          Singhania & Co. offers specialized, partner-supervised services covering the entire financial and statutory spectrum for Indian businesses and global corporations operating in India.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {practiceAreas.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-xl p-8 hover:border-[#2563EB] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 text-[#17365D] flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#17365D]">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-[#2563EB] font-medium">
                      ICAI Standards Compliant
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.summary}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Key Deliverables:
                  </span>
                  <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-600">
                    {item.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Full Details & Regulatory Guidance
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/book-appointment"
                  className="text-xs text-slate-500 hover:text-[#17365D] font-medium"
                >
                  Consult CA →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
