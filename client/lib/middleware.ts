import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === "/login" || path === "/register"

  // Read cookies correctly
  const userCookie = request.cookies.get("user")?.value
  const isAuthenticated = userCookie ? JSON.parse(userCookie) : null

  console.log(`Path: ${path}, Public: ${isPublicPath}, Authenticated: ${isAuthenticated !== null}`)

  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (!isPublicPath && !isAuthenticated && !path.includes("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}
