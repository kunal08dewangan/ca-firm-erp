import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { computeTrialBalance, computeFinancialStatements } from "@/lib/accounting-engine";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const accounts = await db.account.findMany({
      where: businessId ? { businessId } : {},
      orderBy: { accountCode: "asc" },
    });

    const entries = await db.voucherEntry.findMany({
      where: {
        voucher: {
          status: "POSTED",
          ...(businessId ? { businessId } : {}),
        },
      },
    });

    const tb = computeTrialBalance(accounts, entries);
    const statements = computeFinancialStatements(tb.items);

    return NextResponse.json({
      success: true,
      statements,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate financial statements" }, { status: 500 });
  }
}
