import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const returns = await db.gstReturn.findMany({
      orderBy: { dueDate: "asc" },
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

    return NextResponse.json({ returns });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch returns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { gstRegistrationId, returnType, financialYear, returnPeriod, dueDate, status, arn } = body;

    const gstReturn = await db.gstReturn.create({
      data: {
        gstRegistrationId,
        returnType: returnType || "GSTR_1",
        financialYear: financialYear || "2026-27",
        returnPeriod: returnPeriod || "102026",
        dueDate: new Date(dueDate),
        status: status || "NOT_FILED",
        arn: arn || null,
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "GST_RETURN_CREATED",
      module: "GST",
      recordId: gstReturn.id,
      diff: { returnType, returnPeriod },
    });

    return NextResponse.json({ success: true, return: gstReturn });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create return record" }, { status: 500 });
  }
}
