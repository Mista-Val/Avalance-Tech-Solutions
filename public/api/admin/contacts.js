export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    if (!env.CONTACT_KV) {
      return new Response(JSON.stringify({
        error: 'KV storage not configured',
        contacts: []
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

    const contacts = [];
    const list = await env.CONTACT_KV.list();

    for (const key of list.keys) {
      const value = await env.CONTACT_KV.get(key.name);
      if (value) {
        contacts.push(JSON.parse(value));
      }
    }

    return new Response(JSON.stringify({ contacts }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error('Admin contacts error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
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
