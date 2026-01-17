// Minimal worker to handle API routes only
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === '/api/health') {
      const healthModule = await import('./api/health.js');
      return healthModule.onRequestGet({ request, env, ctx });
    }
    
    if (url.pathname === '/api/contact' && request.method === 'POST') {
      const contactModule = await import('./api/contact.js');
      return contactModule.onRequestPost({ request, env, ctx });
    }
    
    if (url.pathname === '/api/pricing-request' && request.method === 'POST') {
      const pricingModule = await import('./api/pricing-request.js');
      return pricingModule.onRequestPost({ request, env, ctx });
    }
    
    if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
      const adminModule = await import('./api/admin/contacts.js');
      return adminModule.onRequestGet({ request, env, ctx });
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
    
    // For all other requests, let Cloudflare Pages handle static content
    return fetch(request);
  }
};
