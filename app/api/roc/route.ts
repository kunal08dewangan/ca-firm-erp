import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const records = await db.rocRecord.findMany({
      orderBy: { dueDate: "asc" },
      include: {
        business: {
          include: { client: true },
        },
      },
    });

    return NextResponse.json({ records });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch ROC records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { businessId, formName, financialYear, srnNumber, dueDate, status } = body;

    const record = await db.rocRecord.create({
      data: {
        businessId,
        formName: formName || "AOC-4",
        financialYear: financialYear || "2025-26",
        srnNumber: srnNumber || null,
        dueDate: new Date(dueDate),
        status: status || "PENDING",
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "ROC_RECORD_CREATED",
      module: "ROC",
      recordId: record.id,
      diff: { formName, srnNumber },
    });

    return NextResponse.json({ success: true, record });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record ROC filing" }, { status: 500 });
  }
}
