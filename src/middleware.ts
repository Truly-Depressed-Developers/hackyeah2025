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

  if (isHomePage && isLoggedIn && !session.user.profileCompleted) {
    return NextResponse.redirect(new URL("/register", nextUrl));
  }

  if (isHomePage) {
    return NextResponse.next();
  }

  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (!isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.next();
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isLoggedIn && !session.user.profileCompleted && !isRegisterPage) {
    return NextResponse.redirect(new URL("/register", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
