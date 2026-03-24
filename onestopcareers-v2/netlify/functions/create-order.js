/**
 * Netlify Function: create-order
 * Creates a Razorpay order for Phase 3 unlock.
 *
 * Bug 15 fix: Added CORS headers + OPTIONS preflight handling.
 * Without these, browsers on production domains block the fetch entirely.
 *
 * Environment variables required:
 *   RAZORPAY_KEY_ID     — from Razorpay Dashboard > API Keys
 *   RAZORPAY_KEY_SECRET — from Razorpay Dashboard > API Keys
 */

const ALLOWED_ORIGINS = [
  'https://onestopcareers.com',
  'https://www.onestopcareers.com',
  'http://localhost:5173',
  'http://localhost:5177',
  'http://localhost:8888',
];

exports.handler = async (event) => {
  const origin = event.headers?.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin':  corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const KEY_ID     = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    console.error('Razorpay credentials not set in environment');
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Payment service not configured' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const amount   = body.amount   || 49900; // ₹499 in paise
  const currency = body.currency || 'INR';
  const receipt  = body.receipt  || `osc_${Date.now()}`;

  try {
    const credentials = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify({ amount, currency, receipt }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Razorpay API error:', err);
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: err.error?.description || 'Order creation failed' }),
      };
    }

    const order = await response.json();
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId:  order.id,
        amount:   order.amount,
        currency: order.currency,
        keyId:    KEY_ID,
      }),
    };
  } catch (err) {
    console.error('create-order error:', err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error — please try again' }),
    };
  }
};
