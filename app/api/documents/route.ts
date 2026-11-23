import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  const category = searchParams.get("category");
  const financialYear = searchParams.get("financialYear");
  const search = searchParams.get("search");

  const where: any = {};
  if (clientId && clientId !== "ALL") where.clientId = clientId;
  if (category && category !== "ALL") where.category = category;
  if (financialYear && financialYear !== "ALL") where.financialYear = financialYear;
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { client: { name: { contains: search } } },
      { client: { pan: { contains: search } } },
    ];
  }

  const documents = await db.document.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          name: true,
          clientCode: true,
          pan: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientId, title, category, financialYear, fileMimeType, fileSizeBytes, fileUrl } = body;

    if (!clientId || !title || !category) {
      return NextResponse.json({ error: "Missing required document fields (clientId, title, category)." }, { status: 400 });
    }

    // Security validation: allowed MIME types
    const allowedMimeTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/csv",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const mime = fileMimeType || "application/pdf";
    if (!allowedMimeTypes.includes(mime)) {
      return NextResponse.json({
        error: "Disallowed file type. Only PDF, Excel (.xlsx/.csv), and images (.png/.jpg/.webp) are permitted.",
      }, { status: 400 });
    }

    // File size validation: 15MB limit
    const size = Number(fileSizeBytes) || 1024 * 512;
    if (size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds maximum permitted size of 15 MB." }, { status: 400 });
    }

    const document = await db.document.create({
      data: {
        clientId,
        title: title.trim(),
        category,
        financialYear: financialYear || "2026-27",
        fileMimeType: mime,
        fileSizeBytes: size,
        fileUrl: fileUrl || `/vault/clients/${clientId}/${category.toLowerCase()}_${Date.now()}.pdf`,
      },
      include: {
        client: {
          select: { name: true, clientCode: true },
        },
      },
    });

    // Write audit log entry
    await db.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "DOCUMENT_UPLOAD",
        module: "DOCUMENT",
        recordId: document.id,
        diff: `Uploaded document '${document.title}' [${document.category}] for client ${document.client.name}`,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (error: any) {
    console.error("Document upload error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
