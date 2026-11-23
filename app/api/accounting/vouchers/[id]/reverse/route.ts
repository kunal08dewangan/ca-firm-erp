import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const reason = body.reason || "Reversal of wrongly posted voucher";

    const original = await db.voucher.findUnique({
      where: { id: params.id },
      include: { entries: true },
    });

    if (!original) {
      return NextResponse.json({ error: "Voucher not found" }, { status: 404 });
    }

    if (original.status === "CANCELLED_REVERSED") {
      return NextResponse.json({ error: "This voucher has already been reversed." }, { status: 400 });
    }

    // Execute reversal transaction
    const reversalVoucher = await db.$transaction(async (tx) => {
      // 1. Mark original voucher as reversed
      await tx.voucher.update({
        where: { id: original.id },
        data: { status: "CANCELLED_REVERSED", reversalReason: reason },
      });

      // 2. Create reversal voucher with swapped debits & credits
      const revNumber = `REV-${original.voucherNumber}`;
      const rev = await tx.voucher.create({
        data: {
          businessId: original.businessId,
          voucherType: original.voucherType,
          voucherNumber: revNumber,
          voucherDate: new Date(),
          narration: `Reversal of ${original.voucherNumber}. Reason: ${reason}`,
          status: "POSTED",
          totalDebit: original.totalCredit,
          totalCredit: original.totalDebit,
          isReversalOf: original.id,
          reversalReason: reason,
          entries: {
            create: original.entries.map((e) => ({
              accountId: e.accountId,
              debit: e.credit, // Invert
              credit: e.debit, // Invert
              particulars: `Reversal entry for ${original.voucherNumber}`,
            })),
          },
        },
      });

      // 3. Rollback account balances
      for (const e of original.entries) {
        const acct = await tx.account.findUnique({ where: { id: e.accountId } });
        if (acct) {
          const isDebitNormal = acct.accountType === "ASSET" || acct.accountType === "EXPENSE";
          // Reversing means subtracting original debit and adding original credit
          const delta = isDebitNormal ? e.credit - e.debit : e.debit - e.credit;

          await tx.account.update({
            where: { id: acct.id },
            data: { currentBalance: acct.currentBalance + delta },
          });
        }
      }

      return rev;
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "VOUCHER_REVERSED",
      module: "ACCOUNTING",
      recordId: original.id,
      diff: { originalNumber: original.voucherNumber, reversalNumber: reversalVoucher.voucherNumber, reason },
    });

    return NextResponse.json({ success: true, reversalVoucher });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reverse voucher" }, { status: 500 });
  }
}
