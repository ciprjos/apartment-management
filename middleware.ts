import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
export const runtime = "nodejs";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await auth();
  // If user is not logged in and tries to access protected page → redirect to /login
  if (!session && pathname.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and tries to access /login → redirect to dashboard
  if (session && !pathname.startsWith("/portal")) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/portal/:path*","/portal"], // login and protected routes
};
