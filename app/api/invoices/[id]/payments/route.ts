import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { amount, paymentDate, paymentMode, referenceNo } = body;

    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json(
        { error: "Payment amount must be greater than zero." },
        { status: 400 }
      );
    }

    const invoice = await db.invoice.findUnique({
      where: { id: params.id },
      include: { client: true },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    if (paymentAmount > invoice.balanceDue + 0.01) {
      return NextResponse.json(
        { error: `Payment (₹${paymentAmount}) cannot exceed balance due (₹${invoice.balanceDue}).` },
        { status: 400 }
      );
    }

    const newPaidAmount = Math.round((invoice.paidAmount + paymentAmount) * 100) / 100;
    const newBalanceDue = Math.max(0, Math.round((invoice.totalAmount - newPaidAmount) * 100) / 100);
    const newStatus = newBalanceDue <= 0.01 ? "PAID" : "PARTIALLY_PAID";

    const [payment, updatedInvoice] = await db.$transaction([
      db.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: paymentAmount,
          paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
          paymentMode: paymentMode || "NEFT_RTGS",
          referenceNo: referenceNo?.trim() || null,
        },
      }),
      db.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
        include: {
          payments: { orderBy: { paymentDate: "desc" } },
        },
      }),
    ]);

    await db.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "PAYMENT_RECEIPT",
        module: "INVOICE",
        recordId: invoice.id,
        diff: `Recorded receipt of ₹${paymentAmount} via ${payment.paymentMode} for invoice ${invoice.invoiceNumber}`,
      },
    });

    return NextResponse.json({ payment, invoice: updatedInvoice }, { status: 201 });
  } catch (error: any) {
    console.error("Payment recording error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to record payment" },
      { status: 500 }
    );
  }
}
