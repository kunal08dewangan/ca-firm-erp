import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { serviceName: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const enquiries = await db.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    const counts = {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === "NEW").length,
      contacted: enquiries.filter((e) => e.status === "CONTACTED").length,
      converted: enquiries.filter((e) => e.status === "CONVERTED").length,
    };

    return NextResponse.json({ enquiries, counts });
  } catch (error) {
    console.error("Fetch enquiries error:", error);
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required." }, { status: 400 });
    }

    const updated = await db.enquiry.update({
      where: { id },
      data: { status },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "ENQUIRY_STATUS_UPDATED",
      module: "LEADS",
      recordId: id,
      diff: `Updated enquiry status for ${updated.name} to ${status}`,
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    console.error("Update enquiry error:", error);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { enquiryId, clientType = "INDIVIDUAL" } = body;

    const enquiry = await db.enquiry.findUnique({
      where: { id: enquiryId },
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }

    // Generate unique client code
    const year = new Date().getFullYear();
    const count = await db.client.count();
    const clientCode = `CL-${year}-${String(count + 1).padStart(4, "0")}`;

    // Create client from enquiry
    const client = await db.client.create({
      data: {
        clientCode,
        name: enquiry.name,
        clientType: clientType,
        pan: "APPLIED",
        panNormalized: "APPLIED",
        mobile: enquiry.mobile,
        email: enquiry.email,
        addressLine1: "Provided via online consultation enquiry",
        city: "Bhilai",
        state: "Chhattisgarh",
        pincode: "490001",
        notes: `Converted from Website Enquiry: Service requested: ${enquiry.serviceName}. Message: ${enquiry.message}`,
        status: "ACTIVE",
        assignedCAId: admin.id,
      },
    });

    // Mark enquiry as CONVERTED
    await db.enquiry.update({
      where: { id: enquiryId },
      data: { status: "CONVERTED" },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "LEAD_CONVERTED_TO_CLIENT",
      module: "CLIENTS",
      recordId: client.id,
      diff: `Lead ${enquiry.name} converted to registered client ${client.clientCode}`,
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    console.error("Convert enquiry error:", error);
    return NextResponse.json({ error: "Failed to convert enquiry to client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.enquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json({ error: "Failed to delete enquiry" }, { status: 500 });
  }
}
