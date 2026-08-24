import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // API routes are self-protected
  // Client-side auth check is handled by AuthGuard component
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
