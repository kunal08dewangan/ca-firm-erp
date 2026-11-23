import { NextRequest, NextResponse } from "next/server";
import { destroySession, getCurrentAdmin, recordAuditLog } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    if (admin) {
      await recordAuditLog({
        adminId: admin.id,
        action: "ADMIN_LOGOUT",
        module: "SECURITY",
        ipAddress: ip,
        userAgent,
      });
    }

    await destroySession();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Logout failed." }, { status: 500 });
  }
}
