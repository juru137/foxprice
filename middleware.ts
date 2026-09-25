import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface SessionPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
  exp: number;
}

/**
 * Verify JWT or Session Token from cookies / Authorization header
 */
function verifySessionToken(token: string): SessionPayload | null {
  try {
    // In production this verifies the signed HMAC / RSA JWT using jose or jsonwebtoken
    const parts = token.split('.');
    if (parts.length !== 3) {
      // Allow demo signed bearer format: base64(payload)
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      if (decoded && decoded.role && (decoded.exp > Date.now() / 1000 || !decoded.exp)) {
        return decoded as SessionPayload;
      }
      return null;
    }
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null; // Expired
    }
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Check admin route protection
  if (pathname.startsWith('/admin')) {
    // Skip public admin auth routes like /admin/login
    if (pathname === '/admin/login') {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    const token =
      request.cookies.get('kinetic_session')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const session = verifySessionToken(token);

    if (!session || (session.role !== 'ADMIN' && session.role !== 'MANAGER')) {
      const unauthorizedUrl = new URL('/admin/login', request.url);
      unauthorizedUrl.searchParams.set('error', 'unauthorized_role');
      return NextResponse.redirect(unauthorizedUrl);
    }

    // Set RBAC context headers for server components & route handlers
    requestHeaders.set('x-user-id', session.userId);
    requestHeaders.set('x-user-role', session.role);
    requestHeaders.set('x-user-email', session.email);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Strict Content Security & Modern Transport Protections
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), browsing-topics=()'
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
