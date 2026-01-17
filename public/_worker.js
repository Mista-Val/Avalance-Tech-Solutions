export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    try {
      // API: Health
      if (url.pathname === '/api/health') {
        const { onRequestGet } = await import('./api/health.js');
        return await onRequestGet({ request, env, ctx });
      }

      // API: Contact
      if (url.pathname === '/api/contact' && request.method === 'POST') {
        const { onRequestPost } = await import('./api/contact.js');
        return await onRequestPost({ request, env, ctx });
      }

      // API: Pricing Request
      if (url.pathname === '/api/pricing-request' && request.method === 'POST') {
        const { onRequestPost } = await import('./api/pricing-request.js');
        return await onRequestPost({ request, env, ctx });
      }

      // API: Admin Contacts
      if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
        const { onRequestGet } = await import('./api/admin/contacts.js');
        return await onRequestGet({ request, env, ctx });
      }

      // API: Admin Pricing Requests
      if (url.pathname === '/api/admin/pricing-requests' && request.method === 'GET') {
        const { onRequestGet } = await import('./api/admin/pricing-requests.js');
        return await onRequestGet({ request, env, ctx });
      }

      // CORS preflight
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }

      // ✅ Forward non-API requests to Pages
      return env.ASSETS.fetch(request);

    } catch (err) {
      // 🔥 Prevent silent 1019 crashes
      return new Response(
        JSON.stringify({
          error: 'Worker execution failed',
          message: err.message
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
};
