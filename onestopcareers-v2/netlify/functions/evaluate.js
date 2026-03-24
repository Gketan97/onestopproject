// netlify/functions/evaluate.js
// Proxies all Anthropic API calls server-side — API key never exposed to browser.

// BUG FIX #9 + #10: Added http://localhost:8888 (Netlify Dev port) to allowed origins.
// Added simple in-memory rate limiting: max 20 requests per IP per 10-minute window.
// Note: in-memory state resets on cold starts — this is a best-effort abuse guard,
// not a hard security boundary. For production hardening, use Netlify KV or Redis.

const ALLOWED_ORIGINS = [
  'https://onestopcareers.com',
  'https://www.onestopcareers.com',
  'http://localhost:5173',
  'http://localhost:5177',  // Bug 17 fix: Vite dev port used by this project
  'http://localhost:8888',
];

// ── Rate limiter ─────────────────────────────────────────────────────────────
const RATE_LIMIT_MAX      = 20;   // requests
const RATE_LIMIT_WINDOW   = 10 * 60 * 1000; // 10 minutes in ms

// Map of IP → { count, windowStart }
const rateLimitMap = new Map();

const isRateLimited = (ip) => {
  const now    = Date.now();
  const entry  = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    // New window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
};

// Clean up old entries every ~100 calls to prevent memory leak on long-lived instances
let callCount = 0;
const maybeCleanup = () => {
  callCount++;
  if (callCount % 100 !== 0) return;
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW) rateLimitMap.delete(ip);
  }
};

// ── Handler ───────────────────────────────────────────────────────────────────
exports.handler = async (event) => {
  const origin     = event.headers?.origin || '';
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin':  corsOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // BUG FIX #9: Rate limit by caller IP
  const callerIp = event.headers?.['x-forwarded-for']?.split(',')[0]?.trim()
    || event.headers?.['client-ip']
    || 'unknown';

  maybeCleanup();

  if (isRateLimited(callerIp)) {
    return {
      statusCode: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '600' },
      body: JSON.stringify({ error: 'Too many requests. Please wait a few minutes and try again.' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { system, messages, max_tokens = 1000 } = body;

  if (!messages || !Array.isArray(messages)) {
    return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'messages array required' }) };
  }

  // Sanity-cap max_tokens to prevent runaway costs
  const cappedTokens = Math.min(Number(max_tokens) || 1000, 2000);

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: cappedTokens,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: data.error?.message || 'Anthropic API error' }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Failed to reach Anthropic API', detail: err.message }),
    };
  }
};
