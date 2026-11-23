import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { businessId, gstin, tradeName, registrationType } = body;

    if (!businessId || !gstin) {
      return NextResponse.json(
        { error: "Business selection and 15-digit GSTIN are required." },
        { status: 400 }
      );
    }

    const cleanGstin = String(gstin).trim().toUpperCase();
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(cleanGstin)) {
      return NextResponse.json(
        { error: "Invalid Indian GSTIN structure (15 characters, e.g., 07AAAAA0000A1Z5)." },
        { status: 400 }
      );
    }

    // Check duplicate
    const existing = await db.gstRegistration.findUnique({
      where: { gstin: cleanGstin },
    });

    if (existing) {
      return NextResponse.json(
        { error: `GSTIN ${cleanGstin} is already registered in the system.` },
        { status: 409 }
      );
    }

    const stateCode = cleanGstin.substring(0, 2);

    const gstReg = await db.gstRegistration.create({
      data: {
        businessId,
        gstin: cleanGstin,
        stateCode,
        tradeName: tradeName ? String(tradeName).trim() : cleanGstin,
        registrationType: registrationType || "REGULAR",
        status: "ACTIVE",
        registrationDate: new Date(),
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "GSTIN_ADDED",
      module: "GST",
      recordId: gstReg.id,
      diff: { clientId: params.id, gstin: cleanGstin, stateCode },
    });

    return NextResponse.json({ success: true, gstRegistration: gstReg });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to register GSTIN" }, { status: 500 });
  }
}
