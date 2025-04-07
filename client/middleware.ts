import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/register"

  // Check if user is authenticated
  const userCookie = request.cookies.get("user")?.value
  const isAuthenticated = !!userCookie
  console.log("Login NOted", userCookie)

  // const userCookie = request.cookies.get("user")?.value
  // console.log("Raw Cookie:", userCookie) // Debugging
  // const isAuthenticated = userCookie ? JSON.parse(userCookie) : null
  // console.log("Parsed Cookie:", isAuthenticated) // Debugging

  // For debugging
  console.log(`Path: ${path}, Public: ${isPublicPath}, Authenticated: ${isAuthenticated}`)

  // Redirect authenticated users away from login/register
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !isAuthenticated && !path.includes("/_next")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}

