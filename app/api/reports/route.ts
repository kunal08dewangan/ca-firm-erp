import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Client Distribution
    const clients = await db.client.findMany({
      include: {
        businesses: {
          include: {
            gstRegistrations: true,
          },
        },
        invoices: true,
      },
    });

    const clientTypeCounts: Record<string, number> = {};
    clients.forEach((c) => {
      clientTypeCounts[c.clientType] = (clientTypeCounts[c.clientType] || 0) + 1;
    });

    // 2. GST Compliance
    const gstReturns = await db.gstReturn.findMany();
    const gstr1Filed = gstReturns.filter((r) => r.returnType === "GSTR_1" && r.status === "FILED").length;
    const gstr1Pending = gstReturns.filter((r) => r.returnType === "GSTR_1" && r.status !== "FILED").length;
    const gstr3bFiled = gstReturns.filter((r) => r.returnType === "GSTR_3B" && r.status === "FILED").length;
    const gstr3bPending = gstReturns.filter((r) => r.returnType === "GSTR_3B" && r.status !== "FILED").length;

    // 3. ITR Filings
    const itrFilings = await db.itrFiling.findMany({
      include: { itrProfile: true },
    });
    const itrCompleted = itrFilings.filter((f) => f.status === "VERIFIED_ACKNOWLEDGED" || f.status === "COMPLETED").length;
    const itrPending = itrFilings.filter((f) => f.status !== "VERIFIED_ACKNOWLEDGED" && f.status !== "COMPLETED").length;

    // 4. Invoicing & Receivables
    const invoices = await db.invoice.findMany({
      include: { client: { select: { name: true, pan: true } } },
    });

    const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
    const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
    const totalOutstanding = invoices.reduce((acc, i) => acc + i.balanceDue, 0);

    // Aging analysis (based on days past dueDate)
    const now = new Date().getTime();
    let aging0to30 = 0;
    let aging31to60 = 0;
    let aging61plus = 0;

    invoices.forEach((inv) => {
      if (inv.balanceDue > 0) {
        const diffDays = Math.max(0, Math.floor((now - new Date(inv.dueDate).getTime()) / (1000 * 86400)));
        if (diffDays <= 30) {
          aging0to30 += inv.balanceDue;
        } else if (diffDays <= 60) {
          aging31to60 += inv.balanceDue;
        } else {
          aging61plus += inv.balanceDue;
        }
      }
    });

    return NextResponse.json({
      summary: {
        totalClients: clients.length,
        totalGstRegistrations: gstReturns.length,
        totalInvoiced: totalBilled,
        totalCollected,
        totalOutstanding,
      },
      clientTypeCounts,
      gstCompliance: {
        gstr1Filed,
        gstr1Pending,
        gstr3bFiled,
        gstr3bPending,
      },
      itrCompliance: {
        itrCompleted,
        itrPending,
      },
      receivablesAging: {
        aging0to30,
        aging31to60,
        aging61plus,
        totalOutstanding,
      },
    });
  } catch (error: any) {
    console.error("Reports API error:", error);
    return NextResponse.json({ error: error.message || "Failed to compile reports" }, { status: 500 });
  }
}
