import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isPublicSharePage = req.nextUrl.pathname.startsWith("/share");
  const isLandingPage = req.nextUrl.pathname === "/home" || req.nextUrl.pathname === "/";

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  // If not logged in, and trying to access a protected route (not public, not landing page)
  if (!isLoggedIn && !isPublicSharePage && !isLandingPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Optionally, if logged in and at root, redirect to dashboard
  if (isLoggedIn && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
