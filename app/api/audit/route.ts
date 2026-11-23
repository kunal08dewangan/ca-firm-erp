import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const records = await db.auditRecord.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        observations: true,
        checklists: true,
      },
    });

    return NextResponse.json({ records });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch audit records" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { auditRecordId, category, description, managementResponse, severity } = body;

    const observation = await db.auditObservation.create({
      data: {
        auditRecordId,
        category: category || "STATUTORY_NON_COMPLIANCE",
        description: String(description).trim(),
        managementResponse: managementResponse ? String(managementResponse).trim() : null,
        severity: severity || "MEDIUM",
      },
    });

    await recordAuditLog({
      adminId: admin.id,
      action: "AUDIT_OBSERVATION_ADDED",
      module: "AUDIT",
      recordId: observation.id,
      diff: { category, severity },
    });

    return NextResponse.json({ success: true, observation });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to record observation" }, { status: 500 });
  }
}
