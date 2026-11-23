import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";
import { reconcileGstr2B, PurchaseRecord, Gstr2bRecord } from "@/lib/gst-engine";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { gstRegistrationId, period } = body;

    // Fetch purchases from database for this GSTIN and period
    const dbPurchases = await db.gstPurchaseEntry.findMany({
      where: {
        ...(gstRegistrationId ? { gstRegistrationId } : {}),
        ...(period ? { gstr2bPeriod: period } : {}),
      },
    });

    const booksPurchases: PurchaseRecord[] = dbPurchases.map((p) => ({
      id: p.id,
      supplierGstin: p.supplierGstin,
      supplierName: p.supplierName,
      invoiceNumber: p.invoiceNumber,
      invoiceDate: p.invoiceDate,
      taxableAmount: p.taxableAmount,
      totalTax: p.cgstAmount + p.sgstAmount + p.igstAmount,
    }));

    // Mock/Simulated GSTR-2B Statement downloaded from GSTN Portal
    // (In production, uploaded JSON or fetched via GSP API)
    const simulatedGstr2b: Gstr2bRecord[] = [
      {
        gstin: "07AAACA4444N1Z3",
        tradeName: "AWS Cloud India Pvt Ltd",
        invoiceNumber: "AWS-IN-98721",
        invoiceDate: "2026-10-02",
        taxableAmount: 120000.0,
        totalTax: 21600.0,
      },
      {
        gstin: "06AABCS9999K1Z6",
        tradeName: "Sterling Executive Lounge & Club",
        invoiceNumber: "CLUB-8871",
        invoiceDate: "2026-10-12",
        taxableAmount: 45000.0,
        totalTax: 8100.0,
      },
      {
        gstin: "27AABCT1111P1Z9",
        tradeName: "Tata Telecommunication Ltd",
        invoiceNumber: "TT-OCT-099",
        invoiceDate: "2026-10-25",
        taxableAmount: 38000.0,
        totalTax: 6840.0, // Present in 2B, missing in books
      },
    ];

    const report = reconcileGstr2B(booksPurchases, simulatedGstr2b);

    // Update match status in database for exact matches
    for (const match of report.exactMatches) {
      await db.gstPurchaseEntry.update({
        where: { id: match.books.id },
        data: { isMatched2B: true, matchStatus: "EXACT" },
      });
    }

    await recordAuditLog({
      adminId: admin.id,
      action: "GSTR_2B_RECONCILIATION_RUN",
      module: "GST",
      diff: report.summary,
    });

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Recon error:", error);
    return NextResponse.json({ error: error.message || "Reconciliation failed" }, { status: 500 });
  }
}
