import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define public routes that don't require authentication
const publicRoutes = ["/signin", "/signup"];

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the authentication cookie (adjust cookie name as needed)
  const authToken = request.cookies.get("auth_token")?.value;
  const isAuthenticated = !!authToken;

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users trying to access protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    // Optionally add a redirect query parameter to return after login
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users trying to access public routes (signin/signup)
  if (isPublicRoute && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Redirect root path based on authentication status
  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = isAuthenticated ? "/dashboard" : "/signup";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

