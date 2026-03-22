import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Edge-safe middleware — does NOT import Auth.js/Prisma to stay under 1MB limit.
// Session is inferred from the Auth.js session cookie.

const PROTECTED_PATHS = ["/dashboard", "/app", "/settings", "/admin"]
const AUTH_PATHS = ["/login"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))

  // Auth.js v5 session cookie name
  const sessionCookie =
    request.cookies.get("authjs.session-token") ??
    request.cookies.get("__Secure-authjs.session-token")

  const isAuthenticated = !!sessionCookie?.value

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
