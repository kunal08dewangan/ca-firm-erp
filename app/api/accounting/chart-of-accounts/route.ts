import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");

    const where: any = {};
    if (businessId && businessId !== "ALL") {
      where.businessId = businessId;
    }

    const accounts = await db.account.findMany({
      where,
      orderBy: { accountCode: "asc" },
      include: {
        business: {
          include: { client: true },
        },
      },
    });

    return NextResponse.json({ accounts });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch chart of accounts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { businessId, accountCode, accountName, accountType, openingBalance, isDebitBalance } = body;

    if (!businessId || !accountCode || !accountName || !accountType) {
      return NextResponse.json({ error: "Mandatory account fields missing." }, { status: 400 });
    }

    const isDebit = isDebitBalance !== undefined ? Boolean(isDebitBalance) : (accountType === "ASSET" || accountType === "EXPENSE");
    const openBal = parseFloat(openingBalance) || 0;

    const account = await db.account.create({
      data: {
        businessId,
        accountCode: String(accountCode).trim(),
        accountName: String(accountName).trim(),
        accountType,
        openingBalance: openBal,
        currentBalance: openBal,
        isDebitBalance: isDebit,
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "ACCOUNT_CREATED",
      module: "ACCOUNTING",
      recordId: account.id,
      diff: { accountCode: account.accountCode, accountName: account.accountName },
    });

    return NextResponse.json({ success: true, account });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create account" }, { status: 500 });
  }
}
