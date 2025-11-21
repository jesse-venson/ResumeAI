import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if user is authenticated by looking for auth token in localStorage
  // Since we can't access localStorage in middleware, we'll handle this client-side
  // This is a placeholder for future server-side auth
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
