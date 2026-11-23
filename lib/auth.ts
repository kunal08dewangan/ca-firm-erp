import { cookies } from "next/headers";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "ca_session_token";
const SESSION_DURATION_HOURS = 12;
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 15;

// In-memory IP rate limiter for login attempts (5 requests per minute per IP)
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkIpRateLimit(ip: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = ipRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 1000 });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (record.count >= 10) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds: retryAfter };
  }

  record.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(adminId: string, ipAddress?: string, userAgent?: string) {
  const sessionToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

  const session = await db.session.create({
    data: {
      sessionToken,
      adminId,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      expiresAt,
    },
  });

  // Set HttpOnly, Secure, SameSite Cookie
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  return session;
}

export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  const session = await db.session.findUnique({
    where: { sessionToken: token },
    include: {
      admin: {
        select: {
          id: true,
          email: true,
          fullName: true,
          membershipNo: true,
          role: true,
          twoFactorEnabled: true,
        },
      },
    },
  });

  if (!session) return null;

  if (new Date() > session.expiresAt) {
    await db.session.delete({ where: { id: session.id } }).catch(() => { });
    cookieStore.delete(SESSION_COOKIE_NAME);
    return null;
  }

  return session.admin;
}

export async function requireAuth() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error("Unauthorized: Active CA Administrator session required.");
  }
  return admin;
}

export async function destroySession() {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await db.session.deleteMany({ where: { sessionToken: token } }).catch(() => { });
    cookieStore.delete(SESSION_COOKIE_NAME);
  }
}

export async function getSession() {
  const admin = await getCurrentAdmin();
  if (!admin) return null;
  return { adminId: admin.id, admin };
}


export async function recordAuditLog(params: {
  adminId?: string;
  action: string;
  module: string;
  recordId?: string;
  ipAddress?: string;
  userAgent?: string;
  diff?: any;
}) {
  try {
    await db.auditLog.create({
      data: {
        adminId: params.adminId || null,
        action: params.action,
        module: params.module,
        recordId: params.recordId || null,
        ipAddress: params.ipAddress || null,
        userAgent: params.userAgent || null,
        diff: params.diff ? JSON.stringify(params.diff) : null,
      },
    });
  } catch (e) {
    console.error("Audit log creation error:", e);
  }
}

export async function checkLockout(email: string): Promise<{ isLocked: boolean; remainingMinutes: number }> {
  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin || !admin.lockoutUntil) {
    return { isLocked: false, remainingMinutes: 0 };
  }

  const now = new Date();
  if (now < admin.lockoutUntil) {
    const diffMs = admin.lockoutUntil.getTime() - now.getTime();
    return { isLocked: true, remainingMinutes: Math.ceil(diffMs / (60 * 1000)) };
  }

  // Lockout expired, reset
  await db.admin.update({
    where: { id: admin.id },
    data: { lockoutUntil: null, failedLoginAttempts: 0 },
  });

  return { isLocked: false, remainingMinutes: 0 };
}

export async function registerFailedLogin(email: string) {
  const admin = await db.admin.findUnique({ where: { email } });
  if (!admin) return;

  const attempts = admin.failedLoginAttempts + 1;
  const updateData: any = { failedLoginAttempts: attempts };

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    updateData.lockoutUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
  }

  await db.admin.update({
    where: { id: admin.id },
    data: updateData,
  });
}

export async function resetFailedLogin(adminId: string) {
  await db.admin.update({
    where: { id: adminId },
    data: { failedLoginAttempts: 0, lockoutUntil: null, lastLoginAt: new Date() },
  });
}
