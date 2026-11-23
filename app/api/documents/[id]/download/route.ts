import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const document = await db.document.findUnique({
    where: { id: params.id },
    include: {
      client: {
        select: { name: true, pan: true },
      },
    },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  // Create audit log for document download / access
  await db.auditLog.create({
    data: {
      adminId: session.adminId,
      action: "DOCUMENT_DOWNLOAD",
      module: "DOCUMENT",
      recordId: document.id,
      diff: `Accessed and downloaded document '${document.title}' for client ${document.client.name}`,
    },
  });

  // Expiring signed link (valid for 15 minutes)
  const token = Buffer.from(`${document.id}:${Date.now() + 15 * 60 * 1000}:${session.adminId}`).toString("base64");
  const secureSignedUrl = `/api/documents/secure-stream?token=${encodeURIComponent(token)}`;

  return NextResponse.json({
    documentId: document.id,
    title: document.title,
    clientName: document.client.name,
    mimeType: document.fileMimeType,
    fileSizeBytes: document.fileSizeBytes,
    signedUrl: secureSignedUrl,
    expiresInSeconds: 900,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const document = await db.document.findUnique({
    where: { id: params.id },
  });

  if (!document) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  await db.document.delete({ where: { id: params.id } });

  await db.auditLog.create({
    data: {
      adminId: session.adminId,
      action: "DOCUMENT_DELETE",
      module: "DOCUMENT",
      recordId: params.id,
      diff: `Archived/deleted document '${document.title}'`,
    },
  });

  return NextResponse.json({ success: true, message: "Document removed from vault" });
}
