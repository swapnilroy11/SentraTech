// server/proxy-collect.js
// Node >=18 (native fetch) recommended. Fallback to node-fetch if needed.
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
app.use(express.json({ limit: '1mb' }));

const DASH_URL = process.env.ADMIN_DASHBOARD_URL || 'https://admin.sentratech.net/api/forms';
const DASH_TOKEN = process.env.DASHBOARD_API_KEY;
const COLLECT_PORT = process.env.COLLECT_PORT || 3000;
const LOG_DIR = process.env.LOG_DIR || '/var/log/sentratech';
const PENDING_DIR = process.env.PENDING_DIR || '/var/data/pending_submissions';
const IDEMPOTENCY_TTL_MS = parseInt(process.env.IDEMPOTENCY_TTL_MS || '86400000', 10);

// Ensure dirs
fs.mkdirSync(LOG_DIR, { recursive: true });
fs.mkdirSync(PENDING_DIR, { recursive: true });

// Simple in-memory dedupe store (for persistence use Redis)
const dedupe = new Map();
function cleanDedupe() {
  const now = Date.now();
  for (const [k, t] of dedupe) if (t + IDEMPOTENCY_TTL_MS < now) dedupe.delete(k);
}
setInterval(cleanDedupe, 60_000);

// Logging helper
function logLine(obj) {
  const line = JSON.stringify(obj);
  fs.appendFileSync(path.join(LOG_DIR, 'collect.log'), line + '\n');
}

// Helper to generate trace_id
function generateTraceId() {
  return 'trace-' + crypto.randomBytes(8).toString('hex');
}

// Forward function with retries
async function forwardToDashboard(payload, endpoint = '/forms/newsletter-signup') {
  const maxRetries = 3;
  let backoff = 500;
  const fullUrl = `${DASH_URL.replace('/api/forms', '/api')}${endpoint}`;
  
  for (let attempt=0; attempt<maxRetries; attempt++) {
    try {
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-INGEST-KEY': DASH_TOKEN,
          'Origin': 'https://sentratech.net'
        },
        body: JSON.stringify(payload),
        // no built-in timeout in fetch; environment should enforce or wrap with AbortController if desired
      });
      const text = await res.text();
      return { ok: res.ok, status: res.status, body: text, endpoint: fullUrl };
    } catch (err) {
      if (attempt === maxRetries - 1) return { ok: false, status: 0, body: String(err), endpoint: fullUrl };
      await new Promise(r => setTimeout(r, backoff));
      backoff *= 3;
    }
  }
}

// Helper to determine the correct dashboard endpoint
function getDashboardEndpoint(payload) {
  // Determine form type based on payload
  if (payload.form_type) {
    return `/forms/${payload.form_type}`;
  }
  
  // Auto-detect based on fields
  if (payload.email && (!payload.name || !payload.message)) {
    return '/forms/newsletter-signup';
  }
  if (payload.company || payload.companyName) {
    return '/forms/contact-sales';
  }
  if (payload.calculationType || payload.roiData) {
    return '/forms/roi-calculator';
  }
  if (payload.position || payload.fullName) {
    return '/forms/job-application';
  }
  if (payload.company_name || payload.demo_request) {
    return '/forms/demo-request';
  }
  
  // Default to newsletter if just email
  return '/forms/newsletter-signup';
}

// API
app.post('/api/collect', async (req, res) => {
  const incoming = req.body || {};
  const trace_id = incoming.trace_id || generateTraceId();
  const client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  const ua = req.headers['user-agent'] || '';
  const payload = {
    ...incoming,
    trace_id,
    received_at: new Date().toISOString(),
    client_ip,
    user_agent: ua,
    src: 'site-proxy'
  };

  // Basic shape validation - adapt fields to your form's schema
  if (!payload.email && !payload.work_email) {
    return res.status(400).json({ ok:false, error:'email_required', trace_id });
  }

  // Idempotency check
  if (dedupe.has(trace_id)) {
    logLine({ ts: new Date().toISOString(), trace_id, event:'duplicate_received' });
    return res.status(200).json({ ok:true, trace_id, note:'duplicate_ignored' });
  }
  dedupe.set(trace_id, Date.now());

  // Determine endpoint and forward
  const endpoint = getDashboardEndpoint(payload);
  const result = await forwardToDashboard(payload, endpoint);

  // Log
  logLine({
    ts: new Date().toISOString(),
    trace_id,
    client_ip,
    endpoint: result.endpoint || endpoint,
    payload_summary: { name: payload.name?.slice(0,50), email: payload.email },
    upstream_status: result.status,
    upstream_body: typeof result.body === 'string' ? result.body.slice(0,2048) : ''
  });

  if (result.ok) {
    return res.status(200).json({ ok:true, trace_id });
  } else {
    // Persist payload for later replay
    const fname = path.join(PENDING_DIR, `${Date.now()}_${trace_id}.json`);
    fs.writeFileSync(fname, JSON.stringify({ payload, forward_result: result }, null, 2));
    return res.status(result.status === 0 ? 502 : result.status).json({ ok:false, trace_id, error:'forward_failed' });
  }
});

// Health endpoint (protected by token if provided)
app.get('/internal/collect-health', (req, res) => {
  const pending = fs.readdirSync(PENDING_DIR).length;
  res.json({ ok:true, pending, dedupe_size: dedupe.size, last_run: new Date().toISOString() });
});

app.listen(COLLECT_PORT, () => console.log(`collect proxy listening on ${COLLECT_PORT}`));