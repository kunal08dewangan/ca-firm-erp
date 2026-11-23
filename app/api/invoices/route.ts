import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientId");
  const search = searchParams.get("search");

  const where: any = {};
  if (status && status !== "ALL") where.status = status;
  if (clientId && clientId !== "ALL") where.clientId = clientId;
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search } },
      { client: { name: { contains: search } } },
      { client: { pan: { contains: search } } },
    ];
  }

  const invoices = await db.invoice.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          pan: true,
          email: true,
          mobile: true,
          state: true,
        },
      },
      items: true,
      payments: {
        orderBy: { paymentDate: "desc" },
      },
    },
    orderBy: { invoiceDate: "desc" },
  });

  // Calculate summary metrics
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalPaid = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOutstanding = invoices.reduce((acc, inv) => acc + inv.balanceDue, 0);

  return NextResponse.json({
    invoices,
    summary: {
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      count: invoices.length,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      clientId,
      invoiceDate,
      dueDate,
      items,
      isInterState,
    } = body;

    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Client and at least one billable item are required." },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const calculatedItems = items.map((item: any) => {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Math.max(0, Number(item.unitPrice) || 0);
      return {
        description: item.description?.trim() || "Professional Services",
        sacCode: item.sacCode?.trim() || "998222",
        quantity,
        unitPrice,
        amount: Math.round(quantity * unitPrice * 100) / 100,
      };
    });

    const subtotal = Math.round(
      calculatedItems.reduce((acc: number, item: any) => acc + item.amount, 0) * 100
    ) / 100;

    // GST Calculation (18% standard for CA services under SAC 998222)
    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstRate = 18.0;
      igstAmount = Math.round(subtotal * 0.18 * 100) / 100;
    } else {
      cgstRate = 9.0;
      cgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
      sgstRate = 9.0;
      sgstAmount = Math.round(subtotal * 0.09 * 100) / 100;
    }

    const totalAmount = Math.round((subtotal + cgstAmount + sgstAmount + igstAmount) * 100) / 100;

    // Generate unique sequential invoice number
    const count = await db.invoice.count();
    const year = new Date().getFullYear();
    const invoiceNumber = `INV-${year}-${String(count + 101).padStart(4, "0")}`;

    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        clientId,
        invoiceDate: invoiceDate ? new Date(invoiceDate) : new Date(),
        dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 15 * 86400000),
        subtotal,
        cgstRate,
        cgstAmount,
        sgstRate,
        sgstAmount,
        igstRate,
        igstAmount,
        totalAmount,
        paidAmount: 0,
        balanceDue: totalAmount,
        status: "ISSUED",
        items: {
          create: calculatedItems,
        },
      },
      include: {
        client: true,
        items: true,
      },
    });

    await db.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "INVOICE_CREATE",
        module: "INVOICE",
        recordId: invoice.id,
        diff: `Created Tax Invoice ${invoice.invoiceNumber} for ₹${invoice.totalAmount} (Client: ${invoice.client.name})`,
      },
    });

    return NextResponse.json({ invoice }, { status: 201 });
  } catch (error: any) {
    console.error("Invoice creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create invoice" },
      { status: 500 }
    );
  }
}
