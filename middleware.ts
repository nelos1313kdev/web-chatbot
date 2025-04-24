import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
};

// Store for rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function middleware(request: NextRequest) {
  // Only apply to API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Get the IP address
  const ip = request.ip || 'unknown';
  
  // Get the current timestamp
  const now = Date.now();

  // Initialize or get rate limit data for this IP
  const rateLimitData = rateLimitStore.get(ip) || { count: 0, resetTime: now + RATE_LIMIT.windowMs };
  
  // Reset if window has passed
  if (now > rateLimitData.resetTime) {
    rateLimitData.count = 0;
    rateLimitData.resetTime = now + RATE_LIMIT.windowMs;
  }

  // Check if rate limit exceeded
  if (rateLimitData.count >= RATE_LIMIT.max) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests, please try again later.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateLimitData.resetTime - now) / 1000).toString(),
        },
      }
    );
  }

  // Increment the counter
  rateLimitData.count++;
  rateLimitStore.set(ip, rateLimitData);

  // For chat API, require authentication
  if (request.nextUrl.pathname.startsWith('/api/chat')) {
    const token = await getToken({ req: request });
    
    if (!token) {
      return new NextResponse(
        JSON.stringify({ error: 'Authentication required' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  // Add security headers
  const response = NextResponse.next();
  
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 