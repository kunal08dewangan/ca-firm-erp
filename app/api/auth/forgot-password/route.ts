import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const admin = await db.admin.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    // For security, always respond with a success confirmation even if email is not found to prevent user enumeration
    if (admin) {
      await recordAuditLog({
        adminId: admin.id,
        action: "PASSWORD_RESET_REQUESTED",
        module: "SECURITY",
        diff: { email },
      });
    }

    return NextResponse.json({
      success: true,
      message: "If an administrator account exists with this email, password recovery instructions have been dispatched.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Password reset request failed." }, { status: 500 });
  }
}
