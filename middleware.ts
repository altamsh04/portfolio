import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const blogsFeatureEnabled = process.env.NEXT_PUBLIC_BLOGS_FEATURE === "true"

  if (request.nextUrl.pathname.startsWith("/blogs") && !blogsFeatureEnabled) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/blogs/:path*"],
}

