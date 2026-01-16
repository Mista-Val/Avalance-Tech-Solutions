import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Handle API routes first
      if (url.pathname.startsWith('/api/')) {
        return await handleAPIRoutes(request, url, corsHeaders, env);
      }

      // Try to serve static assets using Workers Sites
      try {
        const response = await getAssetFromKV(
          { request, waitUntil: ctx.waitUntil.bind(ctx) },
          {
            cacheControl: {
              browserTTL: 60 * 60 * 24 * 365, // 1 year
              edgeTTL: 60 * 60 * 24 * 30, // 30 days
              bypassCache: false,
            },
            mapRequestToAsset: req => {
              // Default to index.html for root
              if (req.url.endsWith('/')) {
                return new Request(req.url + 'index.html', req);
              }
              return req;
            },
          }
        );

        if (response) {
          return response;
        }
      } catch (error) {
        console.log('Workers Sites error:', error);
      }

      // Fallback responses
      if (url.pathname === '/') {
        return new Response(`
          <!DOCTYPE html>
          <html>
          <head><title>Avalance Tech Solutions</title></head>
          <body>
            <h1>Avalance Tech Solutions</h1>
            <p>Backend is running! Frontend assets will be served in production.</p>
            <p><a href="/api/health">Health Check</a></p>
          </body>
          </html>
        `, {
          headers: { 'Content-Type': 'text/html', ...corsHeaders }
        });
      }

      if (url.pathname === '/faq') {
        return new Response('FAQ page available in production', {
          status: 200,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders }
        });
      }

      if (url.pathname === '/services') {
        return new Response('Services page available in production', {
          status: 200,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders }
        });
      }

      return new Response('Not Found', { status: 404 });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

async function handleAPIRoutes(request, url, corsHeaders, env) {
  // Health check
  if (url.pathname === '/api/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }

  // Contact form
  if (url.pathname === '/api/contact' && request.method === 'POST') {
    try {
      const data = await request.json();
      const { name, email, subject, message } = data;

      if (!name || !email || !subject || !message) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Store in KV if available
      if (env.CONTACT_KV) {
        const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await env.CONTACT_KV.put(contactId, JSON.stringify({
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }));
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      console.error('Contact form error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // Pricing request
  if (url.pathname === '/api/pricing-request' && request.method === 'POST') {
    try {
      const data = await request.json();
      const { name, email, company, service, budget } = data;

      if (!name || !email || !company || !service || !budget) {
        return new Response(JSON.stringify({ error: 'All fields are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Store in KV if available
      if (env.PRICING_KV) {
        const requestId = `pricing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await env.PRICING_KV.put(requestId, JSON.stringify({
          name,
          email,
          company,
          service,
          budget,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }));
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Pricing request submitted successfully'
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      console.error('Pricing request error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  // Admin contacts
  if (url.pathname === '/api/admin/contacts' && request.method === 'GET') {
    try {
      if (!env.CONTACT_KV) {
        return new Response(JSON.stringify({
          error: 'KV storage not configured',
          contacts: []
        }), {
          status: 503,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const contacts = [];
      const list = await env.CONTACT_KV.list();

      for (const key of list.keys) {
        const value = await env.CONTACT_KV.get(key.name);
        if (value) {
          contacts.push(JSON.parse(value));
        }
      }

      return new Response(JSON.stringify({ contacts }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      console.error('Admin contacts error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }

  return new Response('API endpoint not found', { status: 404 });
}
