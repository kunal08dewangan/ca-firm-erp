import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filings = await db.itrFiling.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        itrProfile: {
          include: {
            client: true,
            computations: true,
          },
        },
      },
    });

    return NextResponse.json({ filings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch filings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { itrProfileId, acknowledgementNo, eFilingDate, status } = body;

    if (!itrProfileId) {
      return NextResponse.json({ error: "ITR Profile ID required" }, { status: 400 });
    }

    const filing = await db.itrFiling.create({
      data: {
        itrProfileId,
        acknowledgementNo: acknowledgementNo || null,
        eFilingDate: eFilingDate ? new Date(eFilingDate) : new Date(),
        status: status || "PENDING_CA_VERIFICATION",
        caApprovalDate: new Date(),
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "ITR_FILING_RECORDED",
      module: "INCOME_TAX",
      recordId: filing.id,
      diff: { status, acknowledgementNo },
    });

    return NextResponse.json({ success: true, filing });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record filing" }, { status: 500 });
  }
}
