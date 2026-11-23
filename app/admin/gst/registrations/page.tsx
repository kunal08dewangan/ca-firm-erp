import Link from "next/link";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { FileSpreadsheet, Building, Plus, ArrowLeft, ShieldCheck, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GstRegistrationsPage() {
  const registrations = await db.gstRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      business: {
        include: { client: true },
      },
      _count: {
        select: {
          salesEntries: true,
          purchaseEntries: true,
          returns: true,
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
            <span className="font-semibold text-slate-700">GSTIN Master Register</span>
          </div>
          <h1 className="text-2xl font-bold text-[#17365D]">
            Registered GSTINs & Entities
          </h1>
          <p className="text-xs text-slate-500">
            Total {registrations.length} active state-wise GST registrations managed under the firm.
          </p>
        </div>

        <Link
          href="/admin/clients"
          className="bg-[#17365D] hover:bg-[#2563EB] text-white text-xs font-semibold px-4 py-2.5 rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Assign GSTIN via Client Hub
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">15-Digit GSTIN</th>
                <th className="py-3 px-4">Trade Name & Business</th>
                <th className="py-3 px-4">Client Legal Entity</th>
                <th className="py-3 px-4">State Code</th>
                <th className="py-3 px-4">Reg Type</th>
                <th className="py-3 px-4">Vouchers & Filings</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#17365D]">
                    {reg.gstin}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {reg.tradeName}
                    <span className="block text-[11px] text-slate-400 font-normal">
                      {reg.business?.tradeName}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/clients/${reg.business?.client?.id}`}
                      className="font-bold text-[#2563EB] hover:underline"
                    >
                      {reg.business?.client?.name}
                    </Link>
                    <span className="block font-mono text-[11px] text-slate-400">
                      {reg.business?.client?.pan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
                      State {reg.stateCode}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {reg.registrationType}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <span>{reg._count.salesEntries} Sales</span> •{" "}
                    <span>{reg._count.purchaseEntries} Purchases</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {reg.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/admin/gst/sales?gstin=${reg.gstin}`}
                      className="font-semibold text-[#2563EB] hover:underline"
                    >
                      Sales
                    </Link>
                    <span className="text-slate-300">|</span>
                    <Link
                      href={`/admin/gst/purchases?gstin=${reg.gstin}`}
                      className="font-semibold text-[#2563EB] hover:underline"
                    >
                      Purchases
                    </Link>
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
