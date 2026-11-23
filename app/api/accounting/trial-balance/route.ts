import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { computeTrialBalance } from "@/lib/accounting-engine";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    // Fetch accounts
    const accounts = await db.account.findMany({
      where: businessId ? { businessId } : {},
      orderBy: { accountCode: "asc" },
    });

    // Fetch posted voucher entries
    const entries = await db.voucherEntry.findMany({
      where: {
        voucher: {
          status: "POSTED",
          ...(businessId ? { businessId } : {}),
        },
      },
    });

    const report = computeTrialBalance(accounts, entries);

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate trial balance" }, { status: 500 });
  }
}
