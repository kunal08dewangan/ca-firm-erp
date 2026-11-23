import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entries = await db.tdsEntry.findMany({
      orderBy: { paymentDate: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch TDS entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { clientId, sectionCode, deducteePan, deducteeName, paymentDate, taxableAmount, tdsRate, quarter, financialYear } = body;

    const rate = parseFloat(tdsRate) || 10;
    const taxable = parseFloat(taxableAmount) || 0;
    const tdsDeducted = Math.round(((taxable * rate) / 100) * 100) / 100;

    const entry = await db.tdsEntry.create({
      data: {
        clientId,
        sectionCode: sectionCode || "194J",
        deducteePan: String(deducteePan).trim().toUpperCase(),
        deducteeName: String(deducteeName).trim(),
        paymentDate: new Date(paymentDate),
        taxableAmount: taxable,
        tdsRate: rate,
        tdsDeducted,
        quarter: quarter || "Q2",
        financialYear: financialYear || "2025-26",
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "TDS_ENTRY_RECORDED",
      module: "TDS",
      recordId: entry.id,
      diff: { sectionCode, deducteeName, tdsDeducted },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record TDS entry" }, { status: 500 });
  }
}
