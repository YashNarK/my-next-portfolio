// src/middleware.ts
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Do NOT verify token here, just check presence
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};