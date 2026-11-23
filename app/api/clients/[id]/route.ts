import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await db.client.findUnique({
      where: { id: params.id },
      include: {
        assignedCA: {
          select: { fullName: true, email: true, membershipNo: true },
        },
        businesses: {
          include: {
            gstRegistrations: {
              include: {
                returns: {
                  orderBy: { dueDate: "desc" },
                  take: 6,
                },
              },
            },
            accounts: true,
            vouchers: {
              orderBy: { voucherDate: "desc" },
              take: 5,
            },
            rocRecords: true,
          },
        },
        itrProfiles: {
          include: {
            computations: true,
            filings: true,
          },
          orderBy: { financialYear: "desc" },
        },
        documents: {
          orderBy: { createdAt: "desc" },
        },
        invoices: {
          orderBy: { invoiceDate: "desc" },
          include: { payments: true },
        },
        tasks: {
          orderBy: { dueDate: "asc" },
        },
        auditRecords: {
          include: {
            observations: true,
            checklists: true,
          },
        },
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Also get audit logs referencing this client
    const history = await db.auditLog.findMany({
      where: { recordId: client.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { admin: true },
    });

    return NextResponse.json({ client, history });
  } catch (error) {
    console.error("Client profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch client profile" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const existing = await db.client.findUnique({ where: { id: params.id } });

    if (!existing) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const updated = await db.client.update({
      where: { id: params.id },
      data: {
        name: body.name ? String(body.name).trim() : existing.name,
        clientType: body.clientType || existing.clientType,
        mobile: body.mobile ? String(body.mobile).trim() : existing.mobile,
        email: body.email ? String(body.email).trim().toLowerCase() : existing.email,
        addressLine1: body.addressLine1 ? String(body.addressLine1).trim() : existing.addressLine1,
        addressLine2: body.addressLine2 !== undefined ? body.addressLine2 : existing.addressLine2,
        city: body.city ? String(body.city).trim() : existing.city,
        state: body.state ? String(body.state).trim() : existing.state,
        pincode: body.pincode ? String(body.pincode).trim() : existing.pincode,
        notes: body.notes !== undefined ? body.notes : existing.notes,
        status: body.status || existing.status,
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "CLIENT_UPDATED",
      module: "CLIENT",
      recordId: updated.id,
      diff: { before: existing, after: updated },
    });

    return NextResponse.json({ success: true, client: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update client" }, { status: 500 });
  }
}
