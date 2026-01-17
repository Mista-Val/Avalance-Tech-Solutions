export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    if (!env.PRICING_KV) {
      return new Response(JSON.stringify({
        error: 'Pricing KV storage not configured',
        message: 'Pricing request storage is not available',
        admin_email: 'avalancetechpartner@gmail.com',
        pricing_requests: []
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    }

    const pricing_requests = [];
    const list = await env.PRICING_KV.list();

    for (const key of list.keys) {
      const value = await env.PRICING_KV.get(key.name);
      if (value) {
        pricing_requests.push(JSON.parse(value));
      }
    }

    // Sort by timestamp (newest first)
    pricing_requests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify({ 
      success: true,
      admin_email: 'avalancetechpartner@gmail.com',
      total_pricing_requests: pricing_requests.length,
      pricing_requests: pricing_requests,
      last_updated: new Date().toISOString()
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Admin pricing requests error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message,
      admin_email: 'avalancetechpartner@gmail.com'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  }
}
