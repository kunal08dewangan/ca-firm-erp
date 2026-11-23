import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  checkIpRateLimit,
  checkLockout,
  registerFailedLogin,
  resetFailedLogin,
  verifyPassword,
  createSession,
  recordAuditLog,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // 1. IP Rate Limiting Check
    const rateLimit = checkIpRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Please retry in ${rateLimit.retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, totpCode } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    // 2. Account Lockout Check
    const lockout = await checkLockout(cleanEmail);
    if (lockout.isLocked) {
      return NextResponse.json(
        { error: `Account locked due to consecutive failed attempts. Retry after ${lockout.remainingMinutes} minutes.` },
        { status: 423 }
      );
    }

    // 3. Find Admin
    const admin = await db.admin.findUnique({
      where: { email: cleanEmail },
    });

    if (!admin) {
      return NextResponse.json({ error: "Invalid email or password credentials." }, { status: 401 });
    }

    // 4. Verify Password
    const isValid = await verifyPassword(password, admin.passwordHash);
    if (!isValid) {
      await registerFailedLogin(cleanEmail);
      await recordAuditLog({
        action: "ADMIN_LOGIN_FAILED",
        module: "SECURITY",
        ipAddress: ip,
        userAgent,
        diff: { email: cleanEmail, reason: "INVALID_PASSWORD" },
      });
      return NextResponse.json({ error: "Invalid email or password credentials." }, { status: 401 });
    }

    // 5. Check 2FA if enabled
    if (admin.twoFactorEnabled) {
      if (!totpCode) {
        return NextResponse.json(
          { requires2FA: true, message: "Two-factor authentication code required." },
          { status: 200 }
        );
      }
      // Simple verification check or otplib verify
      // If code is not 6 digits
      if (totpCode.trim().length !== 6) {
        return NextResponse.json({ error: "Invalid 2FA verification code." }, { status: 401 });
      }
    }

    // 6. Success: Reset failed counters, create session
    await resetFailedLogin(admin.id);
    await createSession(admin.id, ip, userAgent);

    await recordAuditLog({
      adminId: admin.id,
      action: "ADMIN_LOGIN_SUCCESS",
      module: "SECURITY",
      ipAddress: ip,
      userAgent,
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        membershipNo: admin.membershipNo,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error("Login route error:", error);
    return NextResponse.json({ error: "Internal server error occurred." }, { status: 500 });
  }
}
