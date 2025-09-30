# SentraTech Collect Proxy

A same-origin proxy service that forwards form submissions from `https://sentratech.net/api/collect` to the dashboard at `https://admin.sentratech.net/api/forms/*`.

## Features

- **Same-origin requests**: Eliminates CORS issues
- **Automatic form type detection**: Routes to correct dashboard endpoints
- **Idempotency protection**: Prevents duplicate submissions using trace_id
- **Retry logic**: 3 attempts with exponential backoff for failed forwards
- **Comprehensive logging**: All requests logged to `/var/log/sentratech/collect.log`
- **Failure recovery**: Failed submissions saved to `/var/data/pending_submissions/`

## Environment Variables

```bash
ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api/forms
DASHBOARD_API_KEY=sk-emergent-7A236FdD2Ce8d9b52C
LOG_DIR=/var/log/sentratech
PENDING_DIR=/var/data/pending_submissions
COLLECT_PORT=3002
IDEMPOTENCY_TTL_MS=86400000
```

## Service Management

```bash
# Start the service
cd /app/server
pm2 start ecosystem.config.cjs

# Check status
pm2 status

# View logs
pm2 logs sentra-collect

# Restart
pm2 restart sentra-collect

# Stop
pm2 stop sentra-collect
```

## API Usage

### POST /api/collect

Submit form data with automatic routing:

```bash
# Newsletter signup (auto-detected)
curl -X POST https://sentratech.net/api/collect \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Contact sales (explicit form type)
curl -X POST https://sentratech.net/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "form_type": "contact-sales",
    "full_name": "John Doe",
    "work_email": "john@company.com", 
    "company_name": "Example Corp",
    "message": "Interested in your services"
  }'

# Demo request
curl -X POST https://sentratech.net/api/collect \
  -H "Content-Type: application/json" \
  -d '{
    "form_type": "demo-request",
    "name": "Jane Smith",
    "email": "jane@company.com",
    "company": "Demo Corp"
  }'
```

### GET /internal/collect-health

Health check endpoint:

```bash
curl https://sentratech.net/internal/collect-health
# Returns: {"ok":true,"pending":0,"dedupe_size":5,"last_run":"2025-09-30T23:53:25.319Z"}
```

## Form Type Detection

The proxy automatically detects form types based on payload fields:

- **Newsletter**: Only email field present
- **Contact Sales**: `company` or `companyName` fields
- **Demo Request**: `company_name` or `demo_request` fields  
- **ROI Calculator**: `calculationType` or `roiData` fields
- **Job Application**: `position` or `fullName` fields

For explicit control, include `"form_type": "endpoint-name"` in payload.

## Logging

All requests are logged to `/var/log/sentratech/collect.log`:

```json
{
  "ts": "2025-09-30T23:53:25.319Z",
  "trace_id": "trace-abc123def",
  "client_ip": "192.168.1.100",
  "endpoint": "https://admin.sentratech.net/api/forms/newsletter-signup",
  "payload_summary": {"email": "user@example.com"},
  "upstream_status": 200,
  "upstream_body": "{\"success\":true,...}"
}
```

## Error Handling

- **Success (2xx)**: Returns `{"ok":true,"trace_id":"..."}`
- **Client Error (4xx)**: Returns `{"ok":false,"trace_id":"...","error":"..."}`  
- **Server Error (5xx)**: Returns `{"ok":false,"trace_id":"...","error":"forward_failed"}`
- **Failed requests**: Saved to `/var/data/pending_submissions/timestamp_trace-id.json`

## Nginx Configuration

Add to nginx config:

```nginx
location /api/collect {
  proxy_pass http://127.0.0.1:3002/api/collect;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
}

location /internal/collect-health {
  proxy_pass http://127.0.0.1:3002/internal/collect-health;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Security Notes

- `DASHBOARD_API_KEY` is never exposed to client-side code
- All dashboard communication uses server-side authentication
- Client IP addresses are logged for audit trails
- Idempotency prevents replay attacks