import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Protect board route
  if (pathname === "/board" && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect logged in users away from login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/board", "/login"],
};
