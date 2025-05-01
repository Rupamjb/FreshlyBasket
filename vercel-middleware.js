// This middleware will run on Vercel's Edge network
// It will handle all incoming requests and serve the SPA appropriately

export default function middleware(request) {
  const url = new URL(request.url);

  // Don't rewrite requests for assets
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/assets') ||
    url.pathname.startsWith('/static') ||
    url.pathname.includes('.') // Files with extensions (like .js, .css, etc.)
  ) {
    return;
  }

  // For all other requests, rewrite to the index.html
  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
      'x-middleware-rewrite': url.origin,
    },
  });
} 