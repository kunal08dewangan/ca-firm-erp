import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "clients";

  let csvContent = "";
  let filename = `report_${type}_${Date.now()}.csv`;

  if (type === "clients") {
    const clients = await db.client.findMany({
      include: {
        businesses: {
          include: {
            gstRegistrations: true,
          },
        },
      },
      orderBy: { clientCode: "asc" },
    });

    const headers = [
      "Client Code",
      "Name",
      "Type",
      "PAN",
      "Mobile",
      "Email",
      "City",
      "State",
      "Status",
      "Businesses Count",
      "GST Registrations",
    ];

    const rows = clients.map((c) => {
      const gstCount = c.businesses.reduce((acc, b) => acc + b.gstRegistrations.length, 0);
      return [
        `"${c.clientCode}"`,
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.clientType}"`,
        `"${c.pan}"`,
        `"${c.mobile || ""}"`,
        `"${c.email || ""}"`,
        `"${c.city || ""}"`,
        `"${c.state || ""}"`,
        `"${c.status}"`,
        c.businesses.length,
        gstCount,
      ];
    });

    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    filename = `CA_Client_Master_${new Date().toISOString().split("T")[0]}.csv`;
  } else if (type === "invoices") {
    const invoices = await db.invoice.findMany({
      include: { client: true },
      orderBy: { invoiceDate: "desc" },
    });

    const headers = [
      "Invoice Number",
      "Client Name",
      "Client PAN",
      "Invoice Date",
      "Due Date",
      "Subtotal",
      "CGST",
      "SGST",
      "IGST",
      "Total Amount",
      "Paid Amount",
      "Balance Due",
      "Status",
    ];

    const rows = invoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.client.name.replace(/"/g, '""')}"`,
      `"${inv.client.pan}"`,
      `"${inv.invoiceDate.toISOString().split("T")[0]}"`,
      `"${inv.dueDate.toISOString().split("T")[0]}"`,
      inv.subtotal,
      inv.cgstAmount,
      inv.sgstAmount,
      inv.igstAmount,
      inv.totalAmount,
      inv.paidAmount,
      inv.balanceDue,
      `"${inv.status}"`,
    ]);

    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    filename = `CA_Tax_Invoices_Register_${new Date().toISOString().split("T")[0]}.csv`;
  } else if (type === "outstanding") {
    const invoices = await db.invoice.findMany({
      where: { balanceDue: { gt: 0 } },
      include: { client: true },
      orderBy: { dueDate: "asc" },
    });

    const headers = [
      "Invoice Number",
      "Client Name",
      "Client PAN",
      "Contact Mobile",
      "Due Date",
      "Total Invoiced",
      "Amount Received",
      "Outstanding Balance",
      "Status",
    ];

    const rows = invoices.map((inv) => [
      `"${inv.invoiceNumber}"`,
      `"${inv.client.name.replace(/"/g, '""')}"`,
      `"${inv.client.pan}"`,
      `"${inv.client.mobile || ""}"`,
      `"${inv.dueDate.toISOString().split("T")[0]}"`,
      inv.totalAmount,
      inv.paidAmount,
      inv.balanceDue,
      `"${inv.status}"`,
    ]);

    csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    filename = `Outstanding_Dues_Report_${new Date().toISOString().split("T")[0]}.csv`;
  } else {
    return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
  }

  return new NextResponse(csvContent, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
