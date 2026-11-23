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
    const { tradeName, legalName, constitution, cin, llpin, registeredState, natureOfBusiness } = body;

    if (!tradeName || !registeredState) {
      return NextResponse.json(
        { error: "Trade name and registered state are required." },
        { status: 400 }
      );
    }

    const business = await db.business.create({
      data: {
        clientId: params.id,
        tradeName: String(tradeName).trim(),
        legalName: legalName ? String(legalName).trim() : String(tradeName).trim(),
        constitution: constitution || "PRIVATE_LIMITED",
        cin: cin ? String(cin).trim().toUpperCase() : null,
        llpin: llpin ? String(llpin).trim().toUpperCase() : null,
        registeredState: String(registeredState).trim(),
        natureOfBusiness: natureOfBusiness ? String(natureOfBusiness).trim() : null,
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "BUSINESS_ADDED",
      module: "CLIENT",
      recordId: params.id,
      diff: { businessId: business.id, tradeName: business.tradeName },
    });

    return NextResponse.json({ success: true, business });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add business" }, { status: 500 });
  }
}
