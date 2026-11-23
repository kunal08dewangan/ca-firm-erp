"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Users,
  FileSpreadsheet,
  Receipt,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building,
  PieChart,
  ArrowUpRight,
} from "lucide-react";

export default function ReportsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  const handleDownload = (type: string) => {
    window.location.href = `/api/reports/export?type=${type}`;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500">
        <div className="animate-spin w-6 h-6 border-2 border-[#17365D] border-t-transparent rounded-full mx-auto mb-3" />
        Compiling practice intelligence reports...
      </div>
    );
  }

  const summary = data?.summary || {};
  const clientTypeCounts = data?.clientTypeCounts || {};
  const gst = data?.gstCompliance || {};
  const itr = data?.itrCompliance || {};
  const aging = data?.receivablesAging || {};

  const totalAging = aging.totalOutstanding || 1;
  const pct0to30 = Math.round(((aging.aging0to30 || 0) / totalAging) * 100);
  const pct31to60 = Math.round(((aging.aging31to60 || 0) / totalAging) * 100);
  const pct61plus = Math.round(((aging.aging61plus || 0) / totalAging) * 100);

  return (
    <div className="space-y-6">
      {/* Header & Quick Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-[#17365D]">Practice Intelligence &amp; Reports</h1>
          <p className="text-sm text-slate-500 mt-1">
            Consolidated practice reporting: Client rosters, statutory compliance status, revenue realization, and aging.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleDownload("clients")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" /> Export Clients CSV
          </button>
          <button
            onClick={() => handleDownload("invoices")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" /> Export Invoices CSV
          </button>
          <button
            onClick={() => handleDownload("outstanding")}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#17365D] hover:bg-[#122b4a] rounded-lg shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" /> Export Dues CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active Practice Clients</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{summary.totalClients || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Corporate &amp; Individual</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Billed</span>
            <Receipt className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(summary.totalInvoiced)}</p>
          <p className="text-xs text-slate-500 mt-1">SAC 998222 professional fees</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Realized Collections</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(summary.totalCollected)}</p>
          <p className="text-xs text-slate-500 mt-1">Received in Bank accounts</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Outstanding Receivables</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{formatCurrency(summary.totalOutstanding)}</p>
          <p className="text-xs text-slate-500 mt-1">Pending client payment</p>
        </div>
      </div>

      {/* Receivables Aging Analysis */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-[#17365D]">Receivables Aging Breakdown</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Outstanding client fees segmented by payment maturity period
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
            Total Dues: {formatCurrency(aging.totalOutstanding)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
          <div style={{ width: `${pct0to30}%` }} className="bg-emerald-500" title={`Current: ${pct0to30}%`} />
          <div style={{ width: `${pct31to60}%` }} className="bg-amber-500" title={`31-60 Days: ${pct31to60}%`} />
          <div style={{ width: `${pct61plus}%` }} className="bg-red-500" title={`61+ Days: ${pct61plus}%`} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              0 - 30 Days (Current)
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(aging.aging0to30)}</p>
            <p className="text-xs text-emerald-600 mt-0.5">{pct0to30}% of total receivables</p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
              31 - 60 Days (Follow-up)
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(aging.aging31to60)}</p>
            <p className="text-xs text-amber-600 mt-0.5">{pct31to60}% of total receivables</p>
          </div>

          <div className="p-4 rounded-lg bg-red-50/50 border border-red-200">
            <span className="text-xs font-semibold text-red-800 uppercase tracking-wider">
              61+ Days (Overdue)
            </span>
            <p className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(aging.aging61plus)}</p>
            <p className="text-xs text-red-600 mt-0.5">{pct61plus}% of total receivables</p>
          </div>
        </div>
      </div>

      {/* Statutory Filing Compliance & Client Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GST & ITR Compliance Rates */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Statutory Compliance Fulfillment</h2>
            <p className="text-xs text-slate-500 mt-0.5">Filings status across GST and Income Tax</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>GSTR-1 Monthly Supplies Return</span>
                <span className="text-slate-500">
                  {gst.gstr1Filed || 0} Filed / {(gst.gstr1Filed || 0) + (gst.gstr1Pending || 0)} Total
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (gst.gstr1Filed || 0) + (gst.gstr1Pending || 0) > 0
                        ? Math.round(
                            ((gst.gstr1Filed || 0) /
                              ((gst.gstr1Filed || 0) + (gst.gstr1Pending || 0))) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>GSTR-3B Monthly Return &amp; ITC Settlement</span>
                <span className="text-slate-500">
                  {gst.gstr3bFiled || 0} Filed / {(gst.gstr3bFiled || 0) + (gst.gstr3bPending || 0)} Total
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (gst.gstr3bFiled || 0) + (gst.gstr3bPending || 0) > 0
                        ? Math.round(
                            ((gst.gstr3bFiled || 0) /
                              ((gst.gstr3bFiled || 0) + (gst.gstr3bPending || 0))) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Income Tax Returns (ITR-1 to 7)</span>
                <span className="text-slate-500">
                  {itr.itrCompleted || 0} Acknowledged / {(itr.itrCompleted || 0) + (itr.itrPending || 0)} Profiles
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (itr.itrCompleted || 0) + (itr.itrPending || 0) > 0
                        ? Math.round(
                            ((itr.itrCompleted || 0) /
                              ((itr.itrCompleted || 0) + (itr.itrPending || 0))) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Roster Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-[#17365D]">Client Portfolio by Constitution</h2>
            <p className="text-xs text-slate-500 mt-0.5">Distribution across Indian entity types</p>
          </div>

          <div className="space-y-3">
            {Object.keys(clientTypeCounts).length === 0 ? (
              <p className="text-xs text-slate-400">No client data available.</p>
            ) : (
              Object.entries(clientTypeCounts).map(([type, count]: [string, any]) => (
                <div key={type} className="flex items-center justify-between text-sm py-1 border-b border-slate-50">
                  <span className="font-medium text-slate-700">{type.replace(/_/g, " ")}</span>
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
