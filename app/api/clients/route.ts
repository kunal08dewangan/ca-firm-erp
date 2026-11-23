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
    const clientType = searchParams.get("clientType") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { panNormalized: { contains: search.toUpperCase() } },
        { clientCode: { contains: search } },
        { email: { contains: search } },
        { mobile: { contains: search } },
      ];
    }

    if (clientType && clientType !== "ALL") {
      where.clientType = clientType;
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    const [total, clients] = await Promise.all([
      db.client.count({ where }),
      db.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          businesses: {
            include: {
              gstRegistrations: true,
            },
          },
          _count: {
            select: {
              businesses: true,
              itrProfiles: true,
              tasks: true,
              invoices: true,
              documents: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      clients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Client fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      clientType,
      pan,
      mobile,
      email,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      notes,
      businessName,
      natureOfBusiness,
      gstin,
    } = body;

    if (!name || !clientType || !pan || !mobile || !email || !state || !pincode) {
      return NextResponse.json(
        { error: "Mandatory client fields missing (Name, Type, PAN, Mobile, Email, State, Pincode)." },
        { status: 400 }
      );
    }

    const panNormalized = String(pan).trim().toUpperCase();
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNormalized)) {
      return NextResponse.json(
        { error: "Invalid Indian PAN format. Must be 10 characters (e.g. ABCDE1234F)." },
        { status: 400 }
      );
    }

    // Check for existing PAN
    const existing = await db.client.findUnique({
      where: { panNormalized },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Client with PAN ${panNormalized} is already registered as ${existing.name} (${existing.clientCode}).` },
        { status: 409 }
      );
    }

    // Generate Sequential Client Code
    const clientCount = await db.client.count();
    const currentYear = new Date().getFullYear();
    const clientCode = `CL-${currentYear}-${String(clientCount + 1).padStart(4, "0")}`;

    // Create client along with optional initial business and GST registration inside transaction
    const newClient = await db.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          clientCode,
          name: String(name).trim(),
          clientType,
          pan: panNormalized,
          panNormalized,
          mobile: String(mobile).trim(),
          email: String(email).trim().toLowerCase(),
          addressLine1: String(addressLine1 || "Corporate Office").trim(),
          addressLine2: addressLine2 ? String(addressLine2).trim() : null,
          city: String(city || "New Delhi").trim(),
          state: String(state).trim(),
          pincode: String(pincode).trim(),
          notes: notes ? String(notes).trim() : null,
          status: "ACTIVE",
          assignedCAId: admin.id,
        },
      });

      // If businessName is provided, create business entity
      if (businessName) {
        const business = await tx.business.create({
          data: {
            clientId: client.id,
            tradeName: String(businessName).trim(),
            legalName: String(businessName).trim(),
            constitution: clientType,
            registeredState: String(state).trim(),
            natureOfBusiness: natureOfBusiness ? String(natureOfBusiness).trim() : null,
          },
        });

        // If GSTIN provided, add registration
        if (gstin) {
          const cleanGstin = String(gstin).trim().toUpperCase();
          if (cleanGstin.length === 15) {
            await tx.gstRegistration.create({
              data: {
                businessId: business.id,
                gstin: cleanGstin,
                stateCode: cleanGstin.substring(0, 2),
                tradeName: String(businessName).trim(),
                registrationType: "REGULAR",
                status: "ACTIVE",
                registrationDate: new Date(),
              },
            });
          }
        }
      }

      return client;
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "CLIENT_CREATED",
      module: "CLIENT",
      recordId: newClient.id,
      diff: { clientCode: newClient.clientCode, name: newClient.name, pan: newClient.panNormalized },
    });

    return NextResponse.json({
      success: true,
      client: newClient,
      message: `Client ${newClient.name} successfully registered with code ${newClient.clientCode}.`,
    });
  } catch (error: any) {
    console.error("Create client error:", error);
    return NextResponse.json({ error: error.message || "Failed to create client." }, { status: 500 });
  }
}
