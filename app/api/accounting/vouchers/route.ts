import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";
import { validateVoucher } from "@/lib/accounting-engine";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const businessId = searchParams.get("businessId");
    const type = searchParams.get("type");

    const where: any = {};
    if (businessId && businessId !== "ALL") where.businessId = businessId;
    if (type && type !== "ALL") where.voucherType = type;

    const vouchers = await db.voucher.findMany({
      where,
      orderBy: { voucherDate: "desc" },
      include: {
        business: {
          include: { client: true },
        },
        entries: {
          include: { account: true },
        },
      },
    });

    return NextResponse.json({ vouchers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vouchers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { businessId, voucherType, voucherNumber, voucherDate, narration, entries } = body;

    if (!businessId || !voucherType || !voucherNumber || !voucherDate || !entries) {
      return NextResponse.json({ error: "Mandatory voucher fields missing." }, { status: 400 });
    }

    // Double-Entry Balance Invariant Check
    const validation = validateVoucher(entries);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // Atomic database transaction
    const voucher = await db.$transaction(async (tx) => {
      const v = await tx.voucher.create({
        data: {
          businessId,
          voucherType,
          voucherNumber: String(voucherNumber).trim(),
          voucherDate: new Date(voucherDate),
          narration: String(narration || "").trim(),
          status: "POSTED",
          totalDebit: validation.totalDebit,
          totalCredit: validation.totalCredit,
          entries: {
            create: entries.map((e: any) => ({
              accountId: e.accountId,
              debit: Number(e.debit) || 0,
              credit: Number(e.credit) || 0,
              particulars: e.particulars || null,
            })),
          },
        },
        include: { entries: true },
      });

      // Update account current balances
      for (const e of entries) {
        const acct = await tx.account.findUnique({ where: { id: e.accountId } });
        if (acct) {
          const isDebitNormal = acct.accountType === "ASSET" || acct.accountType === "EXPENSE";
          const delta = isDebitNormal
            ? (Number(e.debit) || 0) - (Number(e.credit) || 0)
            : (Number(e.credit) || 0) - (Number(e.debit) || 0);

          await tx.account.update({
            where: { id: acct.id },
            data: { currentBalance: acct.currentBalance + delta },
          });
        }
      }

      return v;
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "VOUCHER_POSTED",
      module: "ACCOUNTING",
      recordId: voucher.id,
      diff: { voucherNumber: voucher.voucherNumber, totalAmount: voucher.totalDebit },
    });

    return NextResponse.json({ success: true, voucher });
  } catch (error: any) {
    console.error("Voucher posting error:", error);
    return NextResponse.json({ error: error.message || "Failed to post voucher" }, { status: 500 });
  }
}
