import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except public admin-login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin-login")) {
    const sessionCookie = request.cookies.get("ca_session_token");

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/admin-login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already logged in and visiting /admin-login, redirect to /admin/dashboard
  if (pathname === "/admin-login") {
    const sessionCookie = request.cookies.get("ca_session_token");
    if (sessionCookie && sessionCookie.value) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin-login"],
};
