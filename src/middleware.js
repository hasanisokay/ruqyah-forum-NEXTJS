import { NextResponse } from "next/server";
import { COOKIE_NAME } from "./constants";
import { jwtVerify } from "jose";

export default async function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;
  let token = request.cookies.get(COOKIE_NAME)?.value.split("Bearer")[1];;
  if ((pathname === "/profile" && !token) || (pathname.startsWith("/api/allnotifications") && !token) || (pathname.startsWith("/api/newpost") && !token)) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if ((pathname === "/login" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin/declinedposts") || pathname.startsWith("/api/admin/notice") || pathname.startsWith("/api/admin/deletenotice") || pathname.startsWith("/api/posts/changestatus") || pathname.startsWith("/api/posts/pendingposts") ||pathname.startsWith("/api/admin/changeuserrole") || pathname.startsWith("/api/admin/adminactivity")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    if (token) {
      const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const { isAdmin } = payload;
      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }
}
export const config = {
  matcher: ["/profile", "/login", "/signup", "/admin/:path*", "/api/allnotifications", "/api/newpost","/api/admin/notice","/api/admin/declinedposts", "/api/posts/changestatus", "/api/posts/pendingposts", "/api/admin/changeuserrole", "/api/admin/adminactivity", "/api/admin/deletenotice"],
}; 