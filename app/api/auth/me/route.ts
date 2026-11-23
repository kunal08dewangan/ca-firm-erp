import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ authenticated: false, admin: null }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        membershipNo: admin.membershipNo,
        role: admin.role,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, error: "Failed to fetch session" }, { status: 500 });
  }
}
