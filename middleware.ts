import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  console.log(`middleware`);
  // return NextResponse.redirect(new URL("/portal/dashboard", request.url));
}

export const config = {
  matcher: ["/", "/portal/:path*"],
};
