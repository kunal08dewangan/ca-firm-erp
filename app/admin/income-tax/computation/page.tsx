"use client";

import { useState } from "react";
import Link from "next/link";
import { computeIncomeTax } from "@/lib/itr-engine";
import { formatCurrency } from "@/lib/utils";
import {
  Calculator,
  ArrowRight,
  Printer,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

export default function TaxComputationPage() {
  const [assessmentYear, setAssessmentYear] = useState("2026-27");
  const [isSeniorCitizen, setIsSeniorCitizen] = useState(false);

  // 5 Heads of Income State
  const [grossSalary, setGrossSalary] = useState(1450000);
  const [salaryExemptions, setSalaryExemptions] = useState(0);
  const [rentalIncome, setRentalIncome] = useState(0);
  const [municipalTaxes, setMunicipalTaxes] = useState(0);
  const [homeLoanInterest, setHomeLoanInterest] = useState(180000);
  const [netBusinessProfit, setNetBusinessProfit] = useState(0);
  const [stcg, setStcg] = useState(0);
  const [ltcg, setLtcg] = useState(0);
  const [savingsInterest, setSavingsInterest] = useState(15000);
  const [fdInterest, setFdInterest] = useState(35000);

  // Deductions State
  const [ded80C, setDed80C] = useState(150000);
  const [ded80D_Self, setDed80D_Self] = useState(25000);
  const [ded80D_Parents, setDed80D_Parents] = useState(25000);
  const [ded80CCD_1B, setDed80CCD_1B] = useState(50000);
  const [ded80CCD_2, setDed80CCD_2] = useState(60000); // Allowed in both

  // Taxes Paid
  const [tdsCredits, setTdsCredits] = useState(65000);
  const [advanceTax, setAdvanceTax] = useState(40000);

  const financialYear =
    assessmentYear === "2026-27" ? "2025-26" : assessmentYear === "2025-26" ? "2024-25" : "2023-24";

  const calc = computeIncomeTax({
    financialYear,
    assessmentYear,
    isSeniorCitizen,
    income: {
      grossSalary,
      salaryExemptions,
      rentalIncome,
      municipalTaxes,
      homeLoanInterestSelfOccupied: homeLoanInterest,
      netBusinessProfit,
      stcgNormal: stcg,
      ltcgNormal: ltcg,
      savingsInterest,
      fixedDepositInterest: fdInterest,
    },
    deductions: {
      section80C: ded80C,
      section80D_Self: ded80D_Self,
      section80D_Parents: ded80D_Parents,
      section80CCD_1B: ded80CCD_1B,
      section80CCD_2: ded80CCD_2,
      section80TTA: 10000,
    },
    credits: {
      tdsSalary: tdsCredits,
      advanceTaxPaid: advanceTax,
    },
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <Link href="/admin/income-tax/profiles" className="hover:underline">Income Tax</Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Tax Computation</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Income Tax Computation & Regime Comparator
          </h1>
          <p className="text-xs text-slate-500">
            Real-time side-by-side computation of Old Tax Regime vs New Tax Regime (Section 115BAC).
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-[#2563EB]" />
          Print Computation Sheet
        </button>
      </div>

      {/* Recommendation Banner */}
      <div className="bg-[#17365D] text-white rounded-xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              CA Algorithm Recommendation
            </span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded font-bold">
              ★ {calc.recommendedRegime === "NEW_REGIME_115BAC" ? "NEW REGIME (115BAC)" : "OLD REGIME"}
            </span>
          </div>
          <p className="text-sm font-semibold">
            The {calc.recommendedRegime === "NEW_REGIME_115BAC" ? "New Tax Regime" : "Old Tax Regime"} saves your client{" "}
            <span className="text-emerald-400 font-extrabold text-base">
              {formatCurrency(calc.annualTaxSavings)}
            </span>{" "}
            in net income tax for AY {assessmentYear}.
          </p>
        </div>

        <div className="text-right text-xs text-blue-200">
          <p>FY {financialYear} • AY {assessmentYear}</p>
          <p className="text-[11px] text-slate-300">Standard Deduction: ₹75,000 (New) vs ₹50,000 (Old)</p>
        </div>
      </div>

      {/* Main Grid: Form Inputs on Left (5 cols) & Comparison Table on Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                1. Assessment Year & Slabs
              </h2>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSeniorCitizen}
                  onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                  className="rounded text-[#17365D]"
                />
                <span>Senior Citizen (60+)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Assessment Year</label>
                <select
                  value={assessmentYear}
                  onChange={(e) => setAssessmentYear(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB] bg-white font-semibold"
                >
                  <option value="2026-27">AY 2026-27 (FY 2025-26)</option>
                  <option value="2025-26">AY 2025-26 (FY 2024-25)</option>
                  <option value="2024-25">AY 2024-25 (FY 2023-24)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Gross Salary (₹)</label>
                <input
                  type="number"
                  step="10000"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(parseFloat(e.target.value) || 0)}
                  className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                />
              </div>
            </div>

            {/* Other Heads of Income */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                2. Other Heads of Income
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Home Loan Interest (Self)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <span className="text-[10px] text-slate-400">Max ₹2,00,000 in Old Regime</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Net Business Profit (PGBP)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={netBusinessProfit}
                    onChange={(e) => setNetBusinessProfit(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Fixed Deposit (FD) Interest
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={fdInterest}
                    onChange={(e) => setFdInterest(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Savings Bank Interest
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={savingsInterest}
                    onChange={(e) => setSavingsInterest(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Chapter VI-A Deductions */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                3. Chapter VI-A Deductions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Section 80C (PPF/ELSS/EPF)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={ded80C}
                    onChange={(e) => setDed80C(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <span className="text-[10px] text-slate-400">Max ₹1,50,000</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Section 80D (Health Mediclaim)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    value={ded80D_Self}
                    onChange={(e) => setDed80D_Self(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    80CCD(1B) (NPS Employee)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={ded80CCD_1B}
                    onChange={(e) => setDed80CCD_1B(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <span className="text-[10px] text-slate-400">Max ₹50,000 (Old)</span>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    80CCD(2) (NPS Employer)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={ded80CCD_2}
                    onChange={(e) => setDed80CCD_2(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                  <span className="text-[10px] text-emerald-600 font-medium">Allowed in BOTH Regimes</span>
                </div>
              </div>
            </div>

            {/* Tax Credits */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                4. Prepaid Taxes & TDS Credits
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">TDS Credits (26AS)</label>
                  <input
                    type="number"
                    step="5000"
                    value={tdsCredits}
                    onChange={(e) => setTdsCredits(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Advance Tax Paid</label>
                  <input
                    type="number"
                    step="5000"
                    value={advanceTax}
                    onChange={(e) => setAdvanceTax(parseFloat(e.target.value) || 0)}
                    className="w-full font-mono text-xs px-3 py-2 border border-slate-300 rounded focus:ring-1 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Computation Statement */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Statutory Computation Statement</h3>
                <p className="text-[11px] text-slate-500">ICAI-Compliant Formal Tax Determination</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700">AY {assessmentYear}</span>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5">Particulars</th>
                    <th className="py-2.5 text-right font-mono text-slate-700">Old Tax Regime</th>
                    <th className="py-2.5 text-right font-mono text-[#2563EB]">New Regime (115BAC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Gross Salary Income</td>
                    <td className="py-2 text-right">{formatCurrency(calc.oldRegime.grossSalary)}</td>
                    <td className="py-2 text-right">{formatCurrency(calc.newRegime.grossSalary)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-600 font-sans pl-3">Less: Standard Deduction u/s 16(ia)</td>
                    <td className="py-2 text-right text-slate-500">({formatCurrency(calc.oldRegime.standardDeductionSalary)})</td>
                    <td className="py-2 text-right text-emerald-700 font-bold">({formatCurrency(calc.newRegime.standardDeductionSalary)})</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Net Income from Salary</td>
                    <td className="py-2 text-right font-bold">{formatCurrency(calc.oldRegime.netSalary)}</td>
                    <td className="py-2 text-right font-bold text-[#2563EB]">{formatCurrency(calc.newRegime.netSalary)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Income / Loss from House Property</td>
                    <td className="py-2 text-right font-bold text-rose-700">
                      {calc.oldRegime.netHouseProperty < 0 ? `(${formatCurrency(Math.abs(calc.oldRegime.netHouseProperty))})` : formatCurrency(calc.oldRegime.netHouseProperty)}
                    </td>
                    <td className="py-2 text-right font-bold">{formatCurrency(calc.newRegime.netHouseProperty)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Profits & Gains of Business / Profession</td>
                    <td className="py-2 text-right">{formatCurrency(calc.oldRegime.netBusinessProfit)}</td>
                    <td className="py-2 text-right">{formatCurrency(calc.newRegime.netBusinessProfit)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Income from Other Sources</td>
                    <td className="py-2 text-right">{formatCurrency(calc.oldRegime.incomeOtherSources)}</td>
                    <td className="py-2 text-right">{formatCurrency(calc.newRegime.incomeOtherSources)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold text-slate-900">
                    <td className="py-2.5 text-slate-900 font-sans">Gross Total Income (GTI)</td>
                    <td className="py-2.5 text-right">{formatCurrency(calc.oldRegime.grossTotalIncome)}</td>
                    <td className="py-2.5 text-right text-[#2563EB]">{formatCurrency(calc.newRegime.grossTotalIncome)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-700 font-sans">Less: Chapter VI-A Deductions</td>
                    <td className="py-2 text-right text-emerald-700 font-bold">({formatCurrency(calc.oldRegime.totalDeductionsChapterVIA)})</td>
                    <td className="py-2 text-right text-slate-500">({formatCurrency(calc.newRegime.totalDeductionsChapterVIA)})</td>
                  </tr>
                  <tr className="bg-slate-100 font-extrabold text-slate-900 border-y border-slate-300">
                    <td className="py-2.5 text-slate-900 font-sans">Total Taxable Income (Rounded)</td>
                    <td className="py-2.5 text-right">{formatCurrency(calc.oldRegime.totalTaxableIncome)}</td>
                    <td className="py-2.5 text-right text-[#2563EB]">{formatCurrency(calc.newRegime.totalTaxableIncome)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-800 font-sans">Tax on Normal Slab Rates</td>
                    <td className="py-2 text-right">{formatCurrency(calc.oldRegime.taxOnSlabs)}</td>
                    <td className="py-2 text-right">{formatCurrency(calc.newRegime.taxOnSlabs)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-600 font-sans pl-3">Less: Rebate u/s 87A</td>
                    <td className="py-2 text-right text-slate-500">({formatCurrency(calc.oldRegime.rebate87A)})</td>
                    <td className="py-2 text-right text-slate-500">({formatCurrency(calc.newRegime.rebate87A)})</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-600 font-sans pl-3">Add: Health & Education Cess (4%)</td>
                    <td className="py-2 text-right">{formatCurrency(calc.oldRegime.healthEducationCess)}</td>
                    <td className="py-2 text-right">{formatCurrency(calc.newRegime.healthEducationCess)}</td>
                  </tr>
                  <tr className="bg-blue-50 font-bold text-slate-900 border-t-2 border-blue-200">
                    <td className="py-2.5 text-slate-900 font-sans">Total Tax Liability</td>
                    <td className="py-2.5 text-right">{formatCurrency(calc.oldRegime.totalTaxLiability)}</td>
                    <td className="py-2.5 text-right text-[#17365D] font-extrabold">{formatCurrency(calc.newRegime.totalTaxLiability)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-slate-700 font-sans">Less: Prepaid Taxes (TDS + Advance Tax)</td>
                    <td className="py-2 text-right text-slate-600">({formatCurrency(calc.oldRegime.totalCredits)})</td>
                    <td className="py-2 text-right text-slate-600">({formatCurrency(calc.newRegime.totalCredits)})</td>
                  </tr>
                  <tr className="bg-slate-900 text-white font-bold text-sm">
                    <td className="py-3 px-3 font-sans">Net Tax Payable / (Refund Due)</td>
                    <td className="py-3 text-right">
                      {calc.oldRegime.netTaxPayable > 0
                        ? formatCurrency(calc.oldRegime.netTaxPayable)
                        : `Refund: ${formatCurrency(calc.oldRegime.refundDue)}`}
                    </td>
                    <td className="py-3 pr-3 text-right text-emerald-400">
                      {calc.newRegime.netTaxPayable > 0
                        ? formatCurrency(calc.newRegime.netTaxPayable)
                        : `Refund: ${formatCurrency(calc.newRegime.refundDue)}`}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-2 text-[11px] text-slate-500">
                <p>
                  * Calculation prepared under provisions of the Income Tax Act, 1961 as amended by Finance Acts. Verified by Chartered Accountant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
