"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText,
  Building,
  Plus,
} from "lucide-react";

interface StatutoryDeadline {
  day: number;
  month: number; // 0-indexed (0 = Jan, 10 = Nov, etc.)
  title: string;
  category: "GST" | "ITR" | "TDS" | "ROC" | "AUDIT";
  act: string;
  description: string;
  applicableTo: string;
}

const STATUTORY_CALENDAR: StatutoryDeadline[] = [
  // Monthly Deadlines
  {
    day: 7,
    month: 10, // Nov
    title: "TDS / TCS Deposit for October",
    category: "TDS",
    act: "Income Tax Act, 1961 (Section 200)",
    description: "Deposit of TDS and TCS deducted/collected in the month of October via Challan ITNS 281.",
    applicableTo: "All Deductors / Collectors",
  },
  {
    day: 11,
    month: 10,
    title: "GSTR-1 Monthly Return Filing",
    category: "GST",
    act: "CGST Rules, 2017 (Rule 59)",
    description: "Statement of outward supplies for the month of October for regular taxpayers with turnover > ₹5 Cr.",
    applicableTo: "Monthly GST Registered Taxpayers",
  },
  {
    day: 13,
    month: 10,
    title: "GSTR-1 Invoice Furnishing Facility (IFF)",
    category: "GST",
    act: "CGST Rules (QRMP Scheme)",
    description: "Optional upload of B2B invoices for the 1st/2nd month of the quarter under QRMP scheme.",
    applicableTo: "Quarterly Return Monthly Payment (QRMP) Assessees",
  },
  {
    day: 15,
    month: 10,
    title: "Form 3CD Tax Audit Report Rectifications",
    category: "AUDIT",
    act: "Income Tax Act, Section 44AB",
    description: "Final deadline for review of e-verified tax audit observations and CARO disclosures.",
    applicableTo: "Assessees liable for Tax Audit",
  },
  {
    day: 20,
    month: 10,
    title: "GSTR-3B Monthly Return Filing & Tax Settlement",
    category: "GST",
    act: "CGST Rules, 2017 (Rule 61)",
    description: "Summary return and payment of tax liability after 4-bucket ITC credit utilization for October.",
    applicableTo: "Monthly GST Registered Taxpayers",
  },
  {
    day: 25,
    month: 10,
    title: "GST PMT-06 Monthly Tax Deposit",
    category: "GST",
    act: "CGST Act (QRMP Scheme)",
    description: "Challan deposit for payment of tax for month 1 or 2 of quarter under QRMP (Fixed / Self-assessment).",
    applicableTo: "QRMP Taxpayers",
  },
  {
    day: 29,
    month: 10,
    title: "ROC Form MGT-7 / MGT-7A Annual Return",
    category: "ROC",
    act: "Companies Act, 2013 (Section 92)",
    description: "Filing of Annual Return within 60 days of AGM for Companies and One Person Companies.",
    applicableTo: "All Private & Public Limited Companies",
  },
  {
    day: 30,
    month: 10,
    title: "ROC Form AOC-4 XBRL / Non-XBRL",
    category: "ROC",
    act: "Companies Act, 2013 (Section 137)",
    description: "Filing of audited balance sheet and profit & loss statement with MCA within 30 days of AGM.",
    applicableTo: "All Registered Companies",
  },
  // December Deadlines
  {
    day: 15,
    month: 11, // Dec
    title: "Advance Tax Installment - Q3 (75%)",
    category: "ITR",
    act: "Income Tax Act, Section 211",
    description: "Deposit of 3rd installment of advance tax (cumulative 75% of estimated total tax liability).",
    applicableTo: "All Assessees with net tax liability > ₹10,000",
  },
  {
    day: 31,
    month: 11,
    title: "GSTR-9 Annual Return & GSTR-9C Reconciliation",
    category: "GST",
    act: "CGST Act, 2017 (Section 44)",
    description: "Annual return for registered taxpayers and self-certified reconciliation statement (turnover > ₹5 Cr).",
    applicableTo: "Regular GST Registrations",
  },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const deadlinesThisMonth = STATUTORY_CALENDAR.filter(
    (d) => d.month === currentMonth
  ).sort((a, b) => a.day - b.day);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "GST":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "ITR":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "TDS":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "ROC":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-red-50 text-red-700 border-red-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#17365D]">Statutory Compliance Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Official Indian compliance calendar: GST, Income Tax, ROC/MCA, and TDS/TCS due dates.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tasks"
            className="inline-flex items-center gap-2 bg-[#17365D] hover:bg-[#122b4a] text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Go to Task Board
          </Link>
        </div>
      </div>

      {/* Month Navigator Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-[#17365D]" />
          <h2 className="text-xl font-bold text-slate-900">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Deadlines Timeline / Schedule */}
      <div className="space-y-4">
        {deadlinesThisMonth.length === 0 ? (
          <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
            <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No major statutory due dates</h3>
            <p className="text-sm text-slate-500 mt-1">
              There are no recurring statutory deadlines scheduled for {monthNames[currentMonth]} {currentYear}.
            </p>
          </div>
        ) : (
          deadlinesThisMonth.map((deadline, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Date Badge */}
                <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0">
                  <span className="text-xs uppercase font-bold text-slate-500">
                    {monthNames[currentMonth].slice(0, 3)}
                  </span>
                  <span className="text-xl font-bold text-[#17365D] leading-none">{deadline.day}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryColor(
                        deadline.category
                      )}`}
                    >
                      {deadline.category}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{deadline.act}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{deadline.title}</h3>
                  <p className="text-sm text-slate-600">{deadline.description}</p>
                  <p className="text-xs text-slate-400 font-medium">Applicability: {deadline.applicableTo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link
                  href={`/admin/tasks?category=${deadline.category === "ROC" ? "ROC_ANNUAL" : deadline.category === "GST" ? "GST_FILING" : deadline.category}`}
                  className="px-3.5 py-2 text-xs font-semibold text-[#17365D] bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition"
                >
                  View Client Tasks
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
