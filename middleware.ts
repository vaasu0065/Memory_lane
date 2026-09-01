import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/signup");
  const isPublicSharePage = req.nextUrl.pathname.startsWith("/share");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicSharePage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL(isLoggedIn ? "/home" : "/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
