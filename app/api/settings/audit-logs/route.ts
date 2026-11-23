import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");
  const moduleParam = searchParams.get("module") || searchParams.get("entityType");
  const limit = Math.min(100, Number(searchParams.get("limit")) || 50);

  const where: any = {};
  if (action && action !== "ALL") where.action = action;
  if (moduleParam && moduleParam !== "ALL") where.module = moduleParam;

  const logs = await db.auditLog.findMany({
    where,
    include: {
      admin: {
        select: {
          fullName: true,
          email: true,
          membershipNo: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
      fullName: true,
      membershipNo: true,
      role: true,
      twoFactorEnabled: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ logs, admin });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { twoFactorEnabled, fullName } = body;

    const updateData: any = {};
    if (typeof twoFactorEnabled === "boolean") updateData.twoFactorEnabled = twoFactorEnabled;
    if (fullName) updateData.fullName = fullName.trim();

    const admin = await db.admin.update({
      where: { id: session.adminId },
      data: updateData,
    });

    await db.auditLog.create({
      data: {
        adminId: session.adminId,
        action: "SETTINGS_UPDATE",
        module: "SYSTEM",
        recordId: admin.id,
        diff: `Updated security settings. 2FA: ${admin.twoFactorEnabled ? "ENABLED" : "DISABLED"}`,
      },
    });

    return NextResponse.json({ admin });
  } catch (error: any) {
    console.error("Settings update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update settings" }, { status: 500 });
  }
}
