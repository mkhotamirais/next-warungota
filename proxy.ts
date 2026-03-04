import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const authRoutes = ["/login", "/register", "/reset-password-request", "/reset-password"];
const adminRoute = "/admin";
const userRoute = "/user";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/account/verify-email")) {
    return NextResponse.next();
  }

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user.role;
  //   const isVerifiedEmail = !!session?.user.emailVerified;

  const isAuthRoutes = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith(adminRoute);
  const isUserRoute = pathname.startsWith(userRoute);
  //   const isVerifyRoute = pathname.startsWith(verifyRoute);
  //   const isVerifyPendingRoute = pathname.startsWith(verifyPendingRoute);

  if (!isLoggedIn && (isUserRoute || isAdminRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isLoggedIn) {
    if (isAuthRoutes) {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
      if (role === "USER") return NextResponse.redirect(new URL("/user", request.url));
    }
    if (isAdminRoute && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
    if (isUserRoute && role !== "USER") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // if (isVerifyRoute || isVerifyPendingRoute) {
    //   if (isVerifiedEmail) {
    //     if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
    //     if (role === "USER") return NextResponse.redirect(new URL("/user", request.url));
    //   }
    // }
    // if (isTransactionRoutes && !isVerifiedEmail) {
    //   return NextResponse.redirect(new URL("/verify-email-request", request.url));
    // }

    // if (!isVerifiedEmail && isUserRoute && !isBaseUserPage && !isProfileArea) {
    //   return NextResponse.redirect(new URL("/verify-email-request", request.url));
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
