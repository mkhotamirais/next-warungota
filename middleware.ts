import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const authRoutes = ["/signin", "/signup"];
const adminOnlyRoutes = ["/dashboard/users"];
const protectedRoutes = ["/dashboard", "/account"];

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const role = session?.user.role;
  const { pathname } = request.nextUrl;

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isAdminOnlyRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  const res = NextResponse.next();
  // console.log(pathname);
  // // 1. Simpan route terakhir
  // if (
  //   !isAuthRoute &&
  //   !pathname.startsWith("/api") &&
  //   !pathname.startsWith("/_next") &&
  //   !pathname.startsWith("/.well-known") &&
  //   !pathname.startsWith("/favicon.ico")
  // ) {
  //   res.cookies.set("last_visited", pathname, { path: "/" });
  // }

  // 2. Redirect dari protectedRoute jika belum login
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 3. Redirect dari authRoute jika sudah login
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Periksa otorisasi
  if (isLoggedIn && isAdminOnlyRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (isLoggedIn && role !== "user" && pathname.startsWith("/account")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isLoggedIn && pathname.startsWith("/dashboard") && role === "user") {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
