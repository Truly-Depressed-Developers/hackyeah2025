import { NextResponse } from "next/server";
import { auth } from "./server/auth";

export const runtime = "nodejs";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;

  const isLoggedIn = !!session;
  const isHomePage = nextUrl.pathname === "/";
  const isLoginPage = nextUrl.pathname === "/login";
  const isRegisterPage = nextUrl.pathname === "/register";

  if (isHomePage) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", nextUrl));
    }

    if (!session.user.profileCompleted) {
      return NextResponse.redirect(new URL("/register", nextUrl));
    }

    if (session.user.role === "wolontariusz") {
      return NextResponse.redirect(new URL("/find-event", nextUrl));
    } else if (session.user.role === "organizator") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    } else if (session.user.role === "koordynator") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (!isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.next();
  }

  if (isLoggedIn && isLoginPage) {
    if (!session.user.profileCompleted) {
      return NextResponse.redirect(new URL("/register", nextUrl));
    }

    if (session.user.role === "wolontariusz") {
      return NextResponse.redirect(new URL("/find-event", nextUrl));
    } else if (session.user.role === "organizator") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    } else if (session.user.role === "koordynator") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isLoggedIn && !session.user.profileCompleted && !isRegisterPage) {
    return NextResponse.redirect(new URL("/register", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)",
  ],
};
