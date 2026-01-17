// This file routes requests to the appropriate Pages Function
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Route to Pages Functions
    if (url.pathname.startsWith('/api/')) {
      // Import the appropriate function based on the path
      if (url.pathname === '/api/health') {
        const { onRequestGet } = await import('./api/health.js');
        return onRequestGet({ request, env, ctx });
      }
      
      if (url.pathname === '/api/contact' && request.method === 'POST') {
        const { onRequestPost } = await import('./api/contact.js');
        return onRequestPost({ request, env, ctx });
      }
      
      if (url.pathname === '/api/pricing-request' && request.method === 'POST') {
        const { onRequestPost } = await import('./api/pricing-request.js');
        return onRequestPost({ request, env, ctx });
      }
      
      if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
        const { onRequestGet } = await import('./api/admin/contacts.js');
        return onRequestGet({ request, env, ctx });
      }
      
      // Handle CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }
    }
    
    // For non-API routes, serve static content (this will be handled by Pages automatically)
    return new Response('API endpoint not found', { status: 404 });
  }
};
