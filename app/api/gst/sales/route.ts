import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";
import { calculateGst } from "@/lib/gst-engine";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const gstin = searchParams.get("gstin");
    const period = searchParams.get("period");

    const where: any = {};
    if (gstin && gstin !== "ALL") {
      where.gstRegistration = { gstin };
    }
    if (period && period !== "ALL") {
      where.gstr1Period = period;
    }

    const sales = await db.gstSalesEntry.findMany({
      where,
      orderBy: { invoiceDate: "desc" },
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

    return NextResponse.json({ sales });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      gstRegistrationId,
      invoiceNumber,
      invoiceDate,
      invoiceType,
      customerName,
      customerGstin,
      placeOfSupply,
      hsnCode,
      taxableAmount,
      gstRate,
      gstr1Period,
      isRcm,
    } = body;

    if (!gstRegistrationId || !invoiceNumber || !invoiceDate || !customerName || !placeOfSupply || taxableAmount === undefined || gstRate === undefined) {
      return NextResponse.json({ error: "Mandatory sales invoice fields missing." }, { status: 400 });
    }

    const reg = await db.gstRegistration.findUnique({
      where: { id: gstRegistrationId },
    });

    if (!reg) {
      return NextResponse.json({ error: "Invalid GST Registration." }, { status: 404 });
    }

    // Calculate tax breakdown
    const calc = calculateGst({
      supplierStateCode: reg.stateCode,
      placeOfSupplyStateCode: placeOfSupply,
      taxableAmount: Number(taxableAmount),
      gstRate: Number(gstRate),
      isRcm: Boolean(isRcm),
    });

    const entry = await db.gstSalesEntry.create({
      data: {
        gstRegistrationId,
        invoiceNumber: String(invoiceNumber).trim(),
        invoiceDate: new Date(invoiceDate),
        invoiceType: invoiceType || "B2B",
        customerName: String(customerName).trim(),
        customerGstin: customerGstin ? String(customerGstin).trim().toUpperCase() : null,
        placeOfSupply: String(placeOfSupply).padStart(2, "0"),
        supplyType: calc.supplyType,
        hsnCode: hsnCode ? String(hsnCode).trim() : null,
        taxableAmount: calc.taxableAmount,
        gstRate: calc.gstRate,
        cgstAmount: calc.cgstAmount,
        sgstAmount: calc.sgstAmount,
        igstAmount: calc.igstAmount,
        totalAmount: calc.totalAmount,
        isRcm: calc.isRcm,
        gstr1Period: gstr1Period || "102026",
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "GST_SALES_ENTRY_CREATED",
      module: "GST",
      recordId: entry.id,
      diff: { invoiceNumber: entry.invoiceNumber, totalAmount: entry.totalAmount },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create sales entry" }, { status: 500 });
  }
}
