import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const auditRecords = await db.auditRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      checklists: true,
      observations: true,
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
            <span className="text-[#2563EB] font-medium">Assurance</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Audit Engagements</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Statutory & Tax Audit (Section 44AB) Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit working papers, CARO 2020 verification checklists, and management observation tracking.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {auditRecords.map((record) => (
          <div key={record.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#17365D] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  {record.auditType.replace("_", " ")} — {record.client?.name}
                </h2>
                <p className="text-xs text-slate-500">
                  Lead Auditor: <span className="font-semibold text-slate-700">{record.leadAuditor}</span> • FY {record.financialYear}
                </p>
              </div>

              <span className="text-xs font-bold bg-blue-50 text-[#2563EB] border border-blue-200 px-3 py-1 rounded">
                Status: {record.auditStatus}
              </span>
            </div>

            {/* Checklists */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ICAI Audit Procedure Checklist ({record.checklists.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {record.checklists.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded border border-slate-200 flex items-center gap-2.5 bg-slate-50"
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        item.isCompleted ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    <span className={item.isCompleted ? "text-slate-700" : "text-slate-500"}>
                      {item.itemText}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Observations */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Audit Observations & Management Representation ({record.observations.length})
              </h3>
              <div className="space-y-3">
                {record.observations.map((obs) => (
                  <div
                    key={obs.id}
                    className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-lg space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-900">{obs.category}</span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        Severity: {obs.severity}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{obs.description}</p>
                    {obs.managementResponse && (
                      <div className="pt-1 text-[11px] text-slate-600 border-t border-rose-100">
                        <strong>Management Action:</strong> {obs.managementResponse}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
