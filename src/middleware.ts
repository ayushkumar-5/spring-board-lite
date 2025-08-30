import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect board routes - redirect to login if no auth token
  if (pathname.startsWith('/board')) {
    const authToken = request.cookies.get('authToken')?.value
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect authenticated users from login to board
  if (pathname === '/login') {
    const authToken = request.cookies.get('authToken')?.value
    if (authToken) {
      return NextResponse.redirect(new URL('/board', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/board/:path*', '/login']
}


