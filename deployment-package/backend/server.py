from fastapi import FastAPI, APIRouter, HTTPException, BackgroundTasks, WebSocket, WebSocketDisconnect, Request, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.security.utils import get_authorization_scheme_param
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import time
from pathlib import Path
from datetime import datetime, timezone

# Load environment variables
load_dotenv()

# Configure detailed logging for proxy debugging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
proxy_logger = logging.getLogger("proxy_debug")

# Security Headers Middleware
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY" 
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

# In-memory store for recent request IDs (use Redis for production scaling)
recent_requests = {}
IDEMPOTENCY_WINDOW = 60  # 60 seconds window for duplicate detection

def is_duplicate_request(request_id: str) -> bool:
    """Check if request ID has been seen recently within the idempotency window"""
    if not request_id:
        return False
    
    now = time.time()
    last_seen = recent_requests.get(request_id)
    
    if last_seen and (now - last_seen) < IDEMPOTENCY_WINDOW:
        return True
    
    # Store current request
    recent_requests[request_id] = now
    
    # Clean up old entries to prevent memory bloat
    cutoff = now - IDEMPOTENCY_WINDOW
    keys_to_remove = [k for k, v in recent_requests.items() if v < cutoff]
    for key in keys_to_remove:
        del recent_requests[key]
    
    return False

# Initialize FastAPI
app = FastAPI(
    title="SentraTech Proxy API",
    description="Production proxy service for form submissions",
    version="1.0.0"
)

# In-memory dedupe store for idempotency
collect_dedupe = {}
COLLECT_IDEMPOTENCY_TTL_MS = 86400000  # 24 hours

def clean_collect_dedupe():
    """Clean old entries from dedupe store"""
    import time
    now = time.time() * 1000  # Convert to milliseconds
    cutoff = now - COLLECT_IDEMPOTENCY_TTL_MS
    keys_to_remove = [k for k, v in collect_dedupe.items() if v < cutoff]
    for key in keys_to_remove:
        del collect_dedupe[key]

def generate_trace_id():
    """Generate unique trace ID"""
    import random
    import string
    return 'trace-' + str(int(time.time() * 1000)) + '-' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

def log_collect_line(obj):
    """Log collect request to file"""
    import os
    import json
    log_dir = "/var/log/sentratech"
    os.makedirs(log_dir, exist_ok=True)
    line = json.dumps(obj)
    with open(os.path.join(log_dir, 'collect.log'), 'a') as f:
        f.write(line + '\n')

def get_dashboard_endpoint(payload):
    """Determine the correct dashboard endpoint based on payload"""
    # Check for explicit form type
    if payload.get('form_type'):
        return f"/forms/{payload['form_type']}"
    
    # Auto-detect based on fields
    if payload.get('email'):
        # If has company fields, it's likely contact sales
        if payload.get('company') or payload.get('companyName') or payload.get('company_name'):
            return '/forms/contact-sales'
        # If has work_email and company_name specifically
        if payload.get('work_email') and payload.get('company_name'):
            return '/forms/contact-sales'
        # If has position/fullName, it's job application
        if payload.get('position') or payload.get('fullName'):
            return '/forms/job-application'
        # If has demo-related fields
        if payload.get('demo_request') or (payload.get('company') and payload.get('name')):
            return '/forms/demo-request'
        # Default to newsletter for email-only
        return '/forms/newsletter-signup'
    
    # Fallback to newsletter
    return '/forms/newsletter-signup'

async def forward_to_dashboard(payload):
    """Forward payload directly to dashboard with retry logic"""
    import httpx
    import asyncio
    
    maxRetries = 3
    backoff = 500
    DASH_BASE_URL = os.environ.get('ADMIN_DASHBOARD_URL', 'https://admin.sentratech.net/api')
    DASH_TOKEN = os.environ.get('DASHBOARD_API_KEY')
    
    # Get the specific endpoint
    endpoint = get_dashboard_endpoint(payload)
    full_url = f"{DASH_BASE_URL.rstrip('/api')}/api{endpoint}"
    
    for attempt in range(maxRetries):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    full_url,
                    json=payload,
                    headers={
                        'Content-Type': 'application/json',
                        # keep X-INGEST-KEY for current dashboard compatibility
                        'X-INGEST-KEY': DASH_TOKEN,
                        # add standard Authorization header for transition
                        'Authorization': f'Bearer {DASH_TOKEN}',
                        # add Origin header for CORS compliance
                        'Origin': 'https://sentratech.net'
                    }
                )
                text = await response.aread()
                return {"ok": response.is_success, "status": response.status_code, "body": text.decode(), "endpoint": full_url}
        except Exception as err:
            if attempt == maxRetries - 1:
                return {"ok": False, "status": 0, "body": str(err), "endpoint": full_url}
            await asyncio.sleep(backoff / 1000.0)  # Convert ms to seconds
            backoff *= 3
    
    return {"ok": False, "status": 0, "body": "Max retries exceeded", "endpoint": full_url}

# Collect Proxy Route - Forward directly to dashboard
@app.post("/api/collect")
async def collect_proxy(request: Request):
    """Proxy form submissions directly to dashboard with idempotency and logging"""
    try:
        # Parse incoming request
        body = await request.json()
        
        # Generate trace_id if missing
        trace_id = body.get('trace_id') or generate_trace_id()
        
        # Get client info
        client_ip = request.headers.get("x-forwarded-for") or str(request.client.host)
        user_agent = request.headers.get("user-agent", "")
        
        # Enrich payload
        payload = {
            **body,
            "trace_id": trace_id,
            "received_at": datetime.now(timezone.utc).isoformat(),
            "client_ip": client_ip,
            "user_agent": user_agent,
            "src": "site-proxy"
        }
        
        # Idempotency check
        clean_collect_dedupe()
        current_time = time.time() * 1000
        if trace_id in collect_dedupe:
            log_collect_line({
                "ts": datetime.now(timezone.utc).isoformat(),
                "trace_id": trace_id,
                "event": "duplicate_received"
            })
            return JSONResponse(
                status_code=200,
                content={"ok": True, "trace_id": trace_id, "note": "duplicate_ignored"}
            )
        
        collect_dedupe[trace_id] = current_time
        
        # Forward to dashboard
        result = await forward_to_dashboard(payload)
        
        # Log the request
        log_collect_line({
            "ts": datetime.now(timezone.utc).isoformat(),
            "trace_id": trace_id,
            "client_ip": client_ip,
            "endpoint": result.get("endpoint", "unknown"),
            "payload_summary": {
                "name": payload.get('name', '')[:50] if payload.get('name') else '',
                "email": payload.get('email', '')
            },
            "upstream_status": result["status"],
            "upstream_body": result["body"][:2048] if isinstance(result["body"], str) else str(result["body"])[:2048]
        })
        
        if result["ok"]:
            return JSONResponse(
                status_code=200,
                content={"ok": True, "trace_id": trace_id}
            )
        else:
            # Persist payload for later replay
            import os
            import json
            pending_dir = "/var/data/pending_submissions"
            os.makedirs(pending_dir, exist_ok=True)
            fname = os.path.join(pending_dir, f"{int(time.time() * 1000)}_{trace_id}.json")
            with open(fname, 'w') as f:
                json.dump({"payload": payload, "forward_result": result}, f, indent=2)
            
            return JSONResponse(
                status_code=result["status"] if result["status"] > 0 else 502,
                content={"ok": False, "trace_id": trace_id, "error": "forward_failed"}
            )
    
    except Exception as e:
        logging.error(f"Collect proxy error: {str(e)}")
        return JSONResponse(
            status_code=502,
            content={"ok": False, "error": "proxy_error", "trace_id": "unknown"}
        )

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "sentratech-proxy",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Add security middleware
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=[
        "https://sentratech.net",
        "https://www.sentratech.net", 
        "https://admin.sentratech.net",
        "https://react-rescue-4.preview.emergentagent.com",
        "https://*.emergent.host",  # Emergent production domains
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:8080"
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],  # Allow all headers for maximum compatibility
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)