import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { FileSpreadsheet, Calendar, CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GstReturnsPage() {
  const returns = await db.gstReturn.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      gstRegistration: {
        include: {
          business: {
            include: { client: true },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link href="/admin/dashboard" className="hover:underline">Dashboard</Link>
            <span>/</span>
            <span className="text-[#2563EB] font-medium">GST Management</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Returns Compliance Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            GSTR-1, GSTR-3B & Annual Returns
          </h1>
          <p className="text-xs text-slate-500">
            Filing deadlines, tax liability computations, and CA verification status.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Return Form</th>
                <th className="py-3 px-4">Period & FY</th>
                <th className="py-3 px-4">GSTIN & Client</th>
                <th className="py-3 px-4">Statutory Due Date</th>
                <th className="py-3 px-4 text-right">Output Tax Liability</th>
                <th className="py-3 px-4 text-right">ITC Claimed</th>
                <th className="py-3 px-4 text-right">Tax Paid (Cash)</th>
                <th className="py-3 px-4">Filing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {returns.map((ret) => (
                <tr key={ret.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#17365D] font-mono">
                    {ret.returnType.replace("_", "-")}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {ret.returnPeriod}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      FY {ret.financialYear}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-[#17365D]">
                      {ret.gstRegistration?.gstin}
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      {ret.gstRegistration?.business?.client?.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-rose-700">
                    {formatDate(ret.dueDate)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-800">
                    {formatCurrency(ret.totalTaxLiability)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700">
                    {formatCurrency(ret.itcClaimed)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatCurrency(ret.taxPaidCash)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        ret.status === "FILED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ret.status.replace("_", " ")}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
