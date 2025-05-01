// Vercel Edge Middleware for SPA handling
export default function middleware(request) {
  const url = new URL(request.url);
  
  // Skip for API routes and static assets
  if (url.pathname.startsWith('/api') || 
      url.pathname.includes('.') || 
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/assets')) {
    return;
  }
  
  // Let Vercel handle the SPA routing as configured in vercel.json
  return;
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Skip all internal paths
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
}; 