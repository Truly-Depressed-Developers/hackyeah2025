export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@/server/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isLoggedIn = !!session;
  const isOnProfileCompletionPage = nextUrl.pathname.startsWith("/register");

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/api/auth/signin", nextUrl));
  }

  if (isLoggedIn) {
    const profileCompleted = session.user.profileCompleted;

    if (!profileCompleted && !isOnProfileCompletionPage) {
      return NextResponse.redirect(new URL("/register", nextUrl));
    }

    if (profileCompleted && isOnProfileCompletionPage) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth).*)"],
};
