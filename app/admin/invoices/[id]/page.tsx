import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { ArrowLeft, Printer, Shield, CheckCircle, Clock } from "lucide-react";
import PrintButton from "./PrintButton";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await db.invoice.findUnique({
    where: { id: params.id },
    include: {
      client: true,
      items: true,
      payments: {
        orderBy: { paymentDate: "desc" },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top action bar - Hidden on print */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#17365D]">
              Tax Invoice {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-slate-500">
              Generated under GST SAC 998222 (Legal, Accounting & Auditing Services)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PrintButton />
        </div>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0 space-y-8 text-slate-800">
        {/* Header: Firm Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#17365D] pb-6">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-[#17365D] text-white text-[10px] font-bold tracking-wider uppercase mb-2">
              Tax Invoice
            </div>
            <h2 className="text-2xl font-bold text-[#17365D] tracking-tight">
              G. DEWANGAN &amp; ASSOCIATES
            </h2>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Chartered Accountants
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Bhilai, Durg, Chhattisgarh - 490001
            </p>
            <div className="text-xs text-slate-600 mt-2 space-y-0.5 font-mono">
              <p>ICAI Firm Reg. No: <strong>018472C</strong></p>
              <p>Firm Contact: <strong>+91 78984 87448</strong></p>
              <p>Firm Email: <strong>gajendradewangan@gmail.com</strong></p>
            </div>
          </div>

          <div className="text-right sm:self-start space-y-1 text-xs">
            <p className="text-sm font-bold font-mono text-[#17365D]">{invoice.invoiceNumber}</p>
            <p className="text-slate-500">
              Invoice Date:{" "}
              <strong className="text-slate-800">
                {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </p>
            <p className="text-slate-500">
              Payment Due Date:{" "}
              <strong className="text-slate-800">
                {new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </strong>
            </p>
            <p className="text-slate-500">
              Status:{" "}
              <span className="font-semibold uppercase text-emerald-700">
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        {/* Recipient / Billed To Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Billed To (Client):
            </span>
            <p className="text-sm font-bold text-slate-900 mt-1">{invoice.client.name}</p>
            <p className="text-slate-600">{invoice.client.addressLine1}</p>
            {invoice.client.addressLine2 && <p className="text-slate-600">{invoice.client.addressLine2}</p>}
            <p className="text-slate-600">
              {invoice.client.city}, {invoice.client.state} - {invoice.client.pincode}
            </p>
          </div>

          <div className="space-y-1 font-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              Tax Identifiers:
            </span>
            <p className="pt-1">
              Client PAN: <strong className="text-slate-900">{invoice.client.pan}</strong>
            </p>
            <p>
              Client Type: <span className="font-sans font-semibold text-slate-800">{invoice.client.clientType}</span>
            </p>
            <p>
              Place of Supply: <span className="font-sans font-semibold text-slate-800">{invoice.client.state || "Delhi (07)"}</span>
            </p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17365D] text-white font-semibold">
              <tr>
                <th className="p-3 text-center w-12">#</th>
                <th className="p-3">Service Description</th>
                <th className="p-3 font-mono text-center">SAC Code</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Rate</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {invoice.items.map((item, idx) => (
                <tr key={item.id}>
                  <td className="p-3 text-center text-slate-400">{idx + 1}</td>
                  <td className="p-3 font-medium text-slate-900">{item.description}</td>
                  <td className="p-3 font-mono text-center">{item.sacCode}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3 text-right font-mono">{formatCurrency(item.unitPrice)}</td>
                  <td className="p-3 text-right font-mono font-semibold">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations & Bank Account info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
            <p className="font-bold text-[#17365D] uppercase tracking-wider text-[11px]">
              Bank Details for Remittance:
            </p>
            <p>Bank: <strong>State Bank of India</strong></p>
            <p>A/C Name: <strong>G. Dewangan &amp; Associates</strong></p>
            <p className="font-mono">A/C No: <strong>3892019283741</strong> (Current)</p>
            <p className="font-mono">IFSC Code: <strong>SBIN0000340</strong></p>
            <p>Branch: Bhilai, Chhattisgarh</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
              <span>Subtotal (Taxable Value):</span>
              <span className="font-mono font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>

            {invoice.igstAmount > 0 ? (
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Integrated GST (IGST 18%):</span>
                <span className="font-mono font-medium">{formatCurrency(invoice.igstAmount)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Central GST (CGST 9%):</span>
                  <span className="font-mono font-medium">{formatCurrency(invoice.cgstAmount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>State GST (SGST 9%):</span>
                  <span className="font-mono font-medium">{formatCurrency(invoice.sgstAmount)}</span>
                </div>
              </>
            )}

            <div className="flex justify-between py-2 border-b-2 border-[#17365D] text-sm font-bold text-[#17365D]">
              <span>Total Invoice Value:</span>
              <span className="font-mono">{formatCurrency(invoice.totalAmount)}</span>
            </div>

            <div className="flex justify-between py-1 text-slate-600">
              <span>Total Payments Received:</span>
              <span className="font-mono text-emerald-700 font-semibold">
                {formatCurrency(invoice.paidAmount)}
              </span>
            </div>

            <div className="flex justify-between py-1 font-bold text-sm">
              <span>Balance Due:</span>
              <span className={`font-mono ${invoice.balanceDue > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                {formatCurrency(invoice.balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Payments History (if any) */}
        {invoice.payments.length > 0 && (
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 text-xs space-y-2">
            <p className="font-semibold text-slate-700">Receipt Ledger &amp; Payments Recorded:</p>
            <div className="divide-y divide-slate-200">
              {invoice.payments.map((p) => (
                <div key={p.id} className="py-2 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-slate-800">
                      {new Date(p.paymentDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-slate-500 ml-2">Mode: {p.paymentMode}</span>
                    {p.referenceNo && (
                      <span className="text-slate-400 font-mono ml-2">Ref: {p.referenceNo}</span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-emerald-700">
                    +{formatCurrency(p.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signature & ICAI Seal */}
        <div className="pt-8 flex justify-between items-end text-xs border-t border-slate-200">
          <div className="text-slate-400 text-[10px] space-y-1">
            <p>This is a computer-generated Tax Invoice under Rule 48 of CGST Rules, 2017.</p>
            <p>Subject to Chhattisgarh Jurisdiction.</p>
          </div>

          <div className="text-right space-y-1">
            <p className="font-semibold text-[#17365D]">For G. DEWANGAN &amp; ASSOCIATES</p>
            <p className="text-slate-500 italic pb-8">Chartered Accountants</p>
            <p className="font-bold text-slate-800">CA Gajendra Dewangan, FCA</p>
            <p className="text-slate-500 font-mono">Partner | Membership No. 084920</p>
          </div>
        </div>
      </div>
    </div>
  );
}
