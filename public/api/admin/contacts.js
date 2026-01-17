export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    if (!env.CONTACT_KV) {
      return new Response(JSON.stringify({
        error: 'KV storage not configured',
        message: 'Contact storage is not available',
        admin_email: 'avalancetechpartner@gmail.com',
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

    // Sort by timestamp (newest first)
    contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return new Response(JSON.stringify({ 
      success: true,
      admin_email: 'avalancetechpartner@gmail.com',
      total_contacts: contacts.length,
      contacts: contacts,
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
    console.error('Admin contacts error:', error);
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
