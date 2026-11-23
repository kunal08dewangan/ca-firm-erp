import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users,
  FileSpreadsheet,
  Calculator,
  CheckSquare,
  Receipt,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  FilePlus,
  ShieldCheck,
  Building,
  UploadCloud,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Aggregate real practice metrics from database
  const [
    totalClients,
    activeGstRegistrations,
    pendingGstReturns,
    totalItrProfiles,
    pendingTasks,
    allInvoices,
    upcomingTasks,
    recentAuditLogs,
    recentPayments,
  ] = await Promise.all([
    db.client.count({ where: { status: "ACTIVE" } }),
    db.gstRegistration.count({ where: { status: "ACTIVE" } }),
    db.gstReturn.count({ where: { status: { not: "FILED" } } }),
    db.itrProfile.count(),
    db.task.count({ where: { status: { not: "COMPLETED" } } }),
    db.invoice.findMany(),
    db.task.findMany({
      where: { status: { not: "COMPLETED" } },
      orderBy: { dueDate: "asc" },
      take: 5,
      include: { client: true },
    }),
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { admin: true },
    }),
    db.payment.findMany({
      orderBy: { paymentDate: "desc" },
      take: 4,
      include: { invoice: { include: { client: true } } },
    }),
  ]);

  // Outstanding calculation
  const totalOutstanding = allInvoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
  const totalBilledThisFY = allInvoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
  const totalCollectedThisFY = allInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);

  // Statutory Due Dates Calendar for CAs
  const statutoryDeadlines = [
    {
      date: "11 Nov 2026",
      compliance: "GSTR-1 Monthly",
      period: "October 2026",
      applicability: "Monthly Taxpayers (> ₹5 Cr or opted monthly)",
      urgency: "HIGH",
    },
    {
      date: "15 Nov 2026",
      compliance: "Tax Audit u/s 44AB",
      period: "AY 2026-27",
      applicability: "Corporate & Non-Corporate Auditees",
      urgency: "CRITICAL",
    },
    {
      date: "20 Nov 2026",
      compliance: "GSTR-3B Summary",
      period: "October 2026",
      applicability: "All Regular GST Taxpayers",
      urgency: "HIGH",
    },
    {
      date: "15 Dec 2026",
      compliance: "Advance Tax Q3 Installment",
      period: "FY 2026-27",
      applicability: "75% of Estimated Tax for Companies & Individuals",
      urgency: "MEDIUM",
    },
  ];

  const quickActions = [
    { label: "Add Client", href: "/admin/clients", icon: Users, color: "text-[#2563EB]" },
    { label: "New GST Sales Entry", href: "/admin/gst/sales", icon: FilePlus, color: "text-emerald-600" },
    { label: "Add Purchase Entry", href: "/admin/gst/purchases", icon: FileSpreadsheet, color: "text-blue-600" },
    { label: "Create ITR Profile", href: "/admin/income-tax/profiles", icon: Calculator, color: "text-amber-600" },
    { label: "Generate Tax Invoice", href: "/admin/invoices", icon: Receipt, color: "text-purple-600" },
    { label: "Upload Client Document", href: "/admin/documents", icon: UploadCloud, color: "text-slate-600" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Header with Breadcrumbs & Practice Notice */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Practice Management</span>
            <span>/</span>
            <span className="text-[#2563EB] font-semibold">Executive Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            CA Practice Management Portal
          </h1>
          <p className="text-xs text-slate-500">
            Real-time compliance oversight, GST reconciliations, ITR computations, and accounting ledger.
          </p>
        </div>

        {/* Quick Date Stamp */}
        <div className="flex items-center gap-2 text-xs font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
          <Calendar className="w-4 h-4 text-[#2563EB]" />
          <span>FY 2026-27 • Q3</span>
        </div>
      </div>

      {/* 2. Key Metrics Cards (6 Core Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Clients */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-[#2563EB]" />
          </div>
          <p className="text-2xl font-bold text-[#17365D]">{totalClients}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Active Retainers</span>
        </div>

        {/* Active GSTINs */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Active GSTINs</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-[#17365D]">{activeGstRegistrations}</p>
          <span className="text-[11px] text-slate-500">Across 3 States</span>
        </div>

        {/* Pending GST Returns */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Pending GST</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{pendingGstReturns}</p>
          <span className="text-[11px] text-amber-700 font-medium">GSTR-1 & 3B Due</span>
        </div>

        {/* Pending ITR */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>ITR Profiles</span>
            <Calculator className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#17365D]">{totalItrProfiles}</p>
          <span className="text-[11px] text-purple-700 font-medium">AY 2026-27</span>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Pending Tasks</span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-[#17365D]">{pendingTasks}</p>
          <span className="text-[11px] text-slate-500">Statutory Deadlines</span>
        </div>

        {/* Outstanding Payments */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
            <span>Outstanding</span>
            <Receipt className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-lg font-bold text-rose-700">{formatCurrency(totalOutstanding)}</p>
          <span className="text-[11px] text-rose-600 font-medium">Client Dues</span>
        </div>
      </div>

      {/* 3. Quick Action Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          CA Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:border-[#2563EB] hover:bg-slate-50 transition-all text-center group"
              >
                <Icon className={`w-5 h-5 mb-1.5 ${action.color} group-hover:scale-110 transition-transform`} />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-[#2563EB]">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 4. Two-Column Core Operational Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Revenue Overview + Upcoming Tasks + GST/ITR */}
        <div className="lg:col-span-8 space-y-6">
          {/* Practice Billing & Revenue Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Practice Revenue & Realization</h3>
                <p className="text-xs text-slate-500">Financial Year 2026-27 to Date</p>
              </div>
              <Link
                href="/admin/invoices"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                Billing Register <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] text-slate-500 block">Total Billed Fees (Inc. GST)</span>
                <span className="text-base font-bold text-slate-800">{formatCurrency(totalBilledThisFY)}</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-emerald-800 block">Total Realized & Collected</span>
                <span className="text-base font-bold text-emerald-700">{formatCurrency(totalCollectedThisFY)}</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-[11px] text-rose-800 block">Pending Realization</span>
                <span className="text-base font-bold text-rose-700">{formatCurrency(totalOutstanding)}</span>
              </div>
            </div>

            {/* Visual Revenue Realization Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Fee Realization Rate</span>
                <span className="font-bold">
                  {totalBilledThisFY > 0
                    ? `${Math.round((totalCollectedThisFY / totalBilledThisFY) * 100)}%`
                    : "0%"}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      totalBilledThisFY > 0 ? (totalCollectedThisFY / totalBilledThisFY) * 100 : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pending Tasks & Deadlines */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#17365D]">Urgent Practice Tasks & Filings</h3>
                <p className="text-xs text-slate-500">Sorted by immediate statutory deadlines</p>
              </div>
              <Link
                href="/admin/tasks"
                className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
              >
                All Tasks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {upcomingTasks.map((t) => (
                <div key={t.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800">{t.title}</p>
                    <p className="text-[11px] text-slate-500">
                      Client: <span className="font-medium text-slate-700">{t.client?.name || "Firm Internal"}</span> • Category: {t.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === "URGENT"
                          ? "bg-rose-100 text-rose-700"
                          : t.priority === "HIGH"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {t.priority}
                    </span>
                    <p className="text-[11px] text-slate-400 mt-1">Due: {formatDate(t.dueDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Statutory Calendar & Audit Trail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Statutory Tax Calendar */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Calendar className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-sm text-[#17365D]">Statutory Due Dates (Govt)</h3>
            </div>

            <div className="space-y-3">
              {statutoryDeadlines.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 text-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#17365D]">{item.compliance}</span>
                    <span className="text-[10px] font-bold bg-white text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{item.applicability}</p>
                  <p className="text-[10px] text-slate-400">Period: {item.period}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Immutable Audit Log Activity */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-[#17365D]">Practice Audit Trail</h3>
              </div>
              <span className="text-[10px] text-slate-400">ICAI Edit Log</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              {recentAuditLogs.map((log) => (
                <div key={log.id} className="border-b border-slate-100 pb-2 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[11px] font-semibold text-[#17365D]">
                      {log.action}
                    </span>
                    <span className="text-[10px] text-slate-400">{formatDate(log.createdAt)}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Module: <span className="font-medium text-slate-700">{log.module}</span> • By: {log.admin?.fullName || "System"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
