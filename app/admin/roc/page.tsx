import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Building, Plus, Calendar, CheckCircle2, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RocPage() {
  const records = await db.rocRecord.findMany({
    orderBy: { dueDate: "asc" },
    include: {
      business: {
        include: { client: true },
      },
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
            <span className="text-[#2563EB] font-medium">Corporate Law</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">MCA / ROC Records</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            ROC Compliance & MCA Annual Filings
          </h1>
          <p className="text-xs text-slate-500">
            Form AOC-4 (Financial Statements), Form MGT-7 (Annual Return), DIR-3 KYC, and Service Request Numbers (SRN).
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">MCA Form</th>
                <th className="py-3 px-4">Company Trade Name</th>
                <th className="py-3 px-4">CIN Number</th>
                <th className="py-3 px-4">Financial Year</th>
                <th className="py-3 px-4">Statutory Due Date</th>
                <th className="py-3 px-4">SRN Number</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                    {r.formName}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {r.business?.tradeName}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {r.business?.client?.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {r.business?.cin || "LLP / Unassigned"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    FY {r.financialYear}
                  </td>
                  <td className="py-3 px-4 font-semibold text-rose-700">
                    {formatDate(r.dueDate)}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {r.srnNumber || "Pending Filing"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        r.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {r.status}
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
