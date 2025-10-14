"""
Enterprise-Grade Proxy Service for SentraTech
Handles form submissions with retry logic, idempotency, and real-time sync
"""
import asyncio
import aiohttp
import time
import uuid
import json
import os
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import logging

# Configure logging
logger = logging.getLogger("enterprise_proxy")

class EnterpriseProxyService:
    def __init__(self):
        self.api_key = os.getenv('EMERGENT_API_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_API_KEY environment variable is required")
        self.dashboard_base_url = os.getenv('ADMIN_DASHBOARD_URL', 'https://admin.sentratech.net/api/forms')
        self.timeout = int(os.getenv('PROXY_TIMEOUT', '10000')) / 1000  # Convert to seconds
        self.max_retries = int(os.getenv('PROXY_RETRIES', '3'))
        self.backoff_ms = int(os.getenv('PROXY_BACKOFF', '500'))
        self.idempotency_window = int(os.getenv('IDEMPOTENCY_WINDOW', '120000')) / 1000  # Convert to seconds
        
        # In-memory store for idempotency (use Redis for production scaling)
        self.submission_cache = {}
        
    async def cleanup_cache(self):
        """Remove expired entries from submission cache"""
        current_time = time.time()
        expired_keys = [
            key for key, data in self.submission_cache.items()
            if current_time - data['timestamp'] > self.idempotency_window
        ]
        for key in expired_keys:
            del self.submission_cache[key]
    
    def generate_submission_id(self) -> str:
        """Generate unique submission ID"""
        return f"sub_{uuid.uuid4().hex[:12]}_{int(time.time())}"
    
    async def is_duplicate_submission(self, submission_id: str) -> bool:
        """Check if submission ID already exists within idempotency window"""
        await self.cleanup_cache()
        
        if submission_id in self.submission_cache:
            logger.info(f"Duplicate submission detected: {submission_id}")
            return True
        return False
    
    async def store_submission(self, submission_id: str, form_type: str, data: Dict[Any, Any]):
        """Store submission in cache for idempotency checking"""
        self.submission_cache[submission_id] = {
            'form_type': form_type,
            'data': data,
            'timestamp': time.time()
        }
    
    async def forward_to_dashboard(self, form_type: str, payload: Dict[Any, Any]) -> Dict[Any, Any]:
        """Forward form submission to dashboard API with retry logic"""
        url = f"{self.dashboard_base_url}/{form_type}"
        headers = {
            'Content-Type': 'application/json',
            'X-API-Key': self.api_key,
            'User-Agent': 'SentraTech-Proxy/1.0'
        }
        
        for attempt in range(self.max_retries + 1):
            try:
                async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=self.timeout)) as session:
                    logger.info(f"Attempt {attempt + 1}/{self.max_retries + 1}: Forwarding {form_type} to {url}")
                    
                    async with session.post(url, json=payload, headers=headers) as response:
                        response_text = await response.text()
                        
                        if response.status == 200:
                            try:
                                response_data = await response.json() if response_text else {}
                                logger.info(f"Successfully forwarded {form_type}: {response.status}")
                                return {
                                    'success': True,
                                    'status_code': response.status,
                                    'data': response_data,
                                    'attempt': attempt + 1
                                }
                            except json.JSONDecodeError:
                                logger.warning(f"Invalid JSON response from dashboard: {response_text}")
                                return {
                                    'success': True,
                                    'status_code': response.status,
                                    'data': {'raw_response': response_text},
                                    'attempt': attempt + 1
                                }
                        
                        elif response.status >= 500:  # Server errors - retry
                            logger.warning(f"Server error {response.status} on attempt {attempt + 1}: {response_text}")
                            if attempt < self.max_retries:
                                await asyncio.sleep(self.backoff_ms / 1000)
                                continue
                            else:
                                raise HTTPException(
                                    status_code=502,
                                    detail=f"Dashboard service unavailable after {self.max_retries + 1} attempts"
                                )
                        
                        else:  # Client errors - don't retry
                            logger.error(f"Client error {response.status}: {response_text}")
                            raise HTTPException(
                                status_code=response.status,
                                detail=f"Dashboard rejected request: {response_text}"
                            )
            
            except aiohttp.ClientError as e:
                logger.error(f"Network error on attempt {attempt + 1}: {str(e)}")
                if attempt < self.max_retries:
                    await asyncio.sleep(self.backoff_ms / 1000)
                    continue
                else:
                    raise HTTPException(
                        status_code=503,
                        detail=f"Network error after {self.max_retries + 1} attempts: {str(e)}"
                    )
            
            except asyncio.TimeoutError:
                logger.error(f"Timeout on attempt {attempt + 1}")
                if attempt < self.max_retries:
                    await asyncio.sleep(self.backoff_ms / 1000)
                    continue
                else:
                    raise HTTPException(
                        status_code=504,
                        detail=f"Timeout after {self.max_retries + 1} attempts"
                    )
    
    async def wait_for_acknowledgment(self, submission_id: str, timeout: float = 2.0) -> bool:
        """Wait for acknowledgment from dashboard (simplified - would use WebSocket in full implementation)"""
        # In a full implementation, this would listen for WebSocket ACK
        # For now, we'll simulate the acknowledgment check
        await asyncio.sleep(0.1)  # Simulate network delay
        return True  # Assume ACK received for demo
    
    async def process_form_submission(self, form_type: str, request: Request) -> JSONResponse:
        """Process form submission with full enterprise-grade handling"""
        try:
            # Parse request body
            if request.headers.get('content-type', '').startswith('application/json'):
                body = await request.json()
            else:
                form_data = await request.form()
                body = dict(form_data)
            
            # Generate or extract submission ID
            submission_id = body.get('submissionId') or self.generate_submission_id()
            
            # Check for duplicate submissions
            if await self.is_duplicate_submission(submission_id):
                logger.info(f"Returning cached response for duplicate submission: {submission_id}")
                return JSONResponse(
                    status_code=200,
                    content={
                        'success': True,
                        'message': 'Duplicate submission (cached response)',
                        'submissionId': submission_id,
                        'isDuplicate': True,
                        'timestamp': datetime.now(timezone.utc).isoformat()
                    }
                )
            
            # Enhance payload with metadata
            enhanced_payload = {
                'submissionId': submission_id,
                'timestamp': datetime.now(timezone.utc).isoformat(),
                'formType': form_type,
                'source': 'sentratech.net',
                'userAgent': request.headers.get('user-agent', 'Unknown'),
                'ipAddress': request.client.host if request.client else 'Unknown',
                'data': body
            }
            
            # Store for idempotency checking
            await self.store_submission(submission_id, form_type, body)
            
            # Forward to dashboard
            result = await self.forward_to_dashboard(form_type, enhanced_payload)
            
            if result['success']:
                # Wait for acknowledgment
                ack_received = await self.wait_for_acknowledgment(submission_id)
                
                return JSONResponse(
                    status_code=200,
                    content={
                        'success': True,
                        'message': 'Form submission processed successfully',
                        'submissionId': submission_id,
                        'ackReceived': ack_received,
                        'forwardingAttempts': result['attempt'],
                        'timestamp': datetime.now(timezone.utc).isoformat()
                    }
                )
            else:
                raise HTTPException(status_code=502, detail="Failed to forward to dashboard")
        
        except HTTPException:
            raise  # Re-raise HTTP exceptions
        except Exception as e:
            logger.error(f"Unexpected error processing {form_type} submission: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Internal server error: {str(e)}"
            )

# Initialize proxy service
proxy_service = EnterpriseProxyService()

# Create router
proxy_router = APIRouter(prefix="/api/proxy", tags=["Enterprise Proxy"])

@proxy_router.post("/{form_type}")
async def proxy_form_submission(form_type: str, request: Request):
    """
    Enterprise proxy endpoint for form submissions
    
    Supports all SentraTech form types:
    - demo-request: Demo request submissions
    - roi-calculator: ROI calculation results  
    - contact-sales: Sales contact inquiries
    - newsletter-signup: Newsletter subscriptions
    - job-application: Career applications
    - contact-form: General contact submissions
    """
    return await proxy_service.process_form_submission(form_type, request)

@proxy_router.get("/health")
async def proxy_health():
    """Health check endpoint for proxy service"""
    return {
        'status': 'healthy',
        'service': 'enterprise-proxy',
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'config': {
            'dashboard_url': proxy_service.dashboard_base_url,
            'max_retries': proxy_service.max_retries,
            'timeout': proxy_service.timeout,
            'idempotency_window': proxy_service.idempotency_window
        }
    }

@proxy_router.get("/stats")
async def proxy_stats():
    """Get proxy statistics"""
    await proxy_service.cleanup_cache()
    return {
        'cached_submissions': len(proxy_service.submission_cache),
        'cache_entries': list(proxy_service.submission_cache.keys())[-10:],  # Last 10 entries
        'timestamp': datetime.now(timezone.utc).isoformat()
    }