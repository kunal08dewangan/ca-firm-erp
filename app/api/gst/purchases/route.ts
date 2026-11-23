import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";
import { calculateGst, isSection17_5Blocked } from "@/lib/gst-engine";

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
      where.gstr2bPeriod = period;
    }

    const purchases = await db.gstPurchaseEntry.findMany({
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

    return NextResponse.json({ purchases });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      gstRegistrationId,
      supplierName,
      supplierGstin,
      invoiceNumber,
      invoiceDate,
      placeOfSupply,
      taxableAmount,
      gstRate,
      itcEligibility,
      gstr2bPeriod,
      isRcm,
      itemDescription,
    } = body;

    if (!gstRegistrationId || !supplierName || !supplierGstin || !invoiceNumber || !invoiceDate || taxableAmount === undefined || gstRate === undefined) {
      return NextResponse.json({ error: "Mandatory purchase invoice fields missing." }, { status: 400 });
    }

    const reg = await db.gstRegistration.findUnique({
      where: { id: gstRegistrationId },
    });

    if (!reg) {
      return NextResponse.json({ error: "Invalid GST Registration." }, { status: 404 });
    }

    const cleanSupplierGstin = String(supplierGstin).trim().toUpperCase();
    const supplierState = cleanSupplierGstin.substring(0, 2);

    // Calculate tax split
    const calc = calculateGst({
      supplierStateCode: supplierState,
      placeOfSupplyStateCode: placeOfSupply || reg.stateCode,
      taxableAmount: Number(taxableAmount),
      gstRate: Number(gstRate),
      isRcm: Boolean(isRcm),
    });

    // Check Section 17(5) blocked credit
    let finalEligibility = itcEligibility || "INPUTS";
    if (itemDescription) {
      const blockedCheck = isSection17_5Blocked(itemDescription);
      if (blockedCheck.isBlocked) {
        finalEligibility = "INELIGIBLE_17_5";
      }
    }

    const entry = await db.gstPurchaseEntry.create({
      data: {
        gstRegistrationId,
        supplierName: String(supplierName).trim(),
        supplierGstin: cleanSupplierGstin,
        invoiceNumber: String(invoiceNumber).trim(),
        invoiceDate: new Date(invoiceDate),
        placeOfSupply: String(placeOfSupply || reg.stateCode).padStart(2, "0"),
        supplyType: calc.supplyType,
        taxableAmount: calc.taxableAmount,
        gstRate: calc.gstRate,
        cgstAmount: calc.cgstAmount,
        sgstAmount: calc.sgstAmount,
        igstAmount: calc.igstAmount,
        totalAmount: calc.totalAmount,
        isRcm: calc.isRcm,
        itcEligibility: finalEligibility,
        gstr2bPeriod: gstr2bPeriod || "102026",
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "GST_PURCHASE_ENTRY_CREATED",
      module: "GST",
      recordId: entry.id,
      diff: { invoiceNumber: entry.invoiceNumber, itcEligibility: entry.itcEligibility },
    });

    return NextResponse.json({ success: true, entry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create purchase entry" }, { status: 500 });
  }
}
