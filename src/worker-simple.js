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
      // Static pages
      if (url.pathname === '/') {
        if (env.ASSETS) {
          try {
            const asset = await env.ASSETS.fetch(new Request('http://localhost/index.html'));
            return new Response(asset.body, {
              headers: { 'Content-Type': 'text/html', ...corsHeaders }
            });
          } catch (error) {
            // Fall back to simple response
          }
        }
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
        if (env.ASSETS) {
          try {
            const asset = await env.ASSETS.fetch(new Request('http://localhost/faq.html'));
            return new Response(asset.body, {
              headers: { 'Content-Type': 'text/html', ...corsHeaders }
            });
          } catch (error) {
            // Fall back to simple response
          }
        }
        return new Response('FAQ page available in production', { 
          status: 200,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders }
        });
      }

      if (url.pathname === '/services') {
        if (env.ASSETS) {
          try {
            const asset = await env.ASSETS.fetch(new Request('http://localhost/services.html'));
            return new Response(asset.body, {
              headers: { 'Content-Type': 'text/html', ...corsHeaders }
            });
          } catch (error) {
            // Fall back to simple response
          }
        }
        return new Response('Services page available in production', { 
          status: 200,
          headers: { 'Content-Type': 'text/plain', ...corsHeaders }
        });
      }

      // Static assets
      if (url.pathname.startsWith('/assets/')) {
        if (env.ASSETS) {
          try {
            const asset = await env.ASSETS.fetch(new Request(`http://localhost${url.pathname}`));
            if (asset.ok) {
              const contentType = getContentType(url.pathname);
              return new Response(asset.body, {
                headers: { 'Content-Type': contentType, ...corsHeaders }
              });
            }
          } catch (error) {
            // Fall through to 404
          }
        }
        return new Response('Asset not found', { status: 404 });
      }

      // API Routes
      if (url.pathname === '/api/health') {
        return new Response(JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

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

          // Send email if configured
          if (env.SENDGRID_API_KEY && env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
            try {
              await sendEmailNotification(env, data);
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
            }
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

          // Send email if configured
          if (env.SENDGRID_API_KEY && env.SENDGRID_API_KEY !== 'your_sendgrid_api_key_here') {
            try {
              await sendPricingEmailNotification(env, data);
            } catch (emailError) {
              console.error('Email notification failed:', emailError);
            }
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

// Helper function to determine content type
function getContentType(filePath) {
  const ext = filePath.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'webmanifest': 'application/manifest+json'
  };
  return types[ext] || 'text/plain';
}

async function sendEmailNotification(env, data) {
  const { name, email, subject, message } = data;
  
  const emailData = {
    personalizations: [{
      to: [{ email: env.ADMIN_EMAIL }],
      subject: `New Contact Form Submission: ${subject}`
    }],
    from: { email: env.FROM_EMAIL },
    content: [{
      type: 'text/html',
      value: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    throw new Error(`SendGrid API error: ${response.status}`);
  }
}

async function sendPricingEmailNotification(env, data) {
  const { name, email, company, service, budget } = data;
  
  const emailData = {
    personalizations: [{
      to: [{ email: env.ADMIN_EMAIL }],
      subject: `New Pricing Request: ${service}`
    }],
    from: { email: env.FROM_EMAIL },
    content: [{
      type: 'text/html',
      value: `
        <h2>New Pricing Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Budget Range:</strong> ${budget}</p>
        <hr>
        <p><em>Sent on: ${new Date().toLocaleString()}</em></p>
      `
    }]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(emailData)
  });

  if (!response.ok) {
    throw new Error(`SendGrid API error: ${response.status}`);
  }
}
