# SentraTech Landing Page - API Contracts & Integration Plan

## Overview
This document outlines the API contracts and integration requirements for the SentraTech landing page to seamlessly connect frontend mock data with backend implementation.

## Current Mock Data (frontend/src/data/mock.js)

### 1. Hero Statistics API
**Endpoint**: `GET /api/stats`
**Mock Data**: 
```json
[
  { "id": 1, "value": "50", "suffix": "ms", "label": "Average Response Time" },
  { "id": 2, "value": "70", "suffix": "%", "label": "Automation Rate" },
  { "id": 3, "value": "99.9", "suffix": "%", "label": "Platform Uptime" },
  { "id": 4, "value": "60", "suffix": "%", "label": "Cost Reduction" }
]
```

### 2. Chat Messages API
**Endpoints**: 
- `GET /api/chat/messages` - Get chat history
- `POST /api/chat/messages` - Send new message

**Mock Data Structure**:
```json
{
  "id": "timestamp",
  "text": "message content",
  "sender": "user|bot",
  "timestamp": "ISO date"
}
```

### 3. Contact Form API
**Endpoint**: `POST /api/contact`
**Mock Data Structure**:
```json
{
  "name": "string",
  "email": "string",
  "company": "string", 
  "phone": "string",
  "message": "string",
  "callVolume": "string",
  "useCase": "string"
}
```

### 4. Newsletter Subscription API
**Endpoint**: `POST /api/newsletter`
**Mock Data Structure**:
```json
{
  "email": "string"
}
```

## Backend Implementation Requirements

### MongoDB Collections Needed:

1. **stats** - Real-time platform statistics
2. **chat_sessions** - Chat conversations with session tracking
3. **contact_leads** - Demo requests and contact form submissions
4. **newsletter_subscribers** - Email newsletter subscriptions

### API Routes to Implement:

```python
# Platform Statistics
@api_router.get("/stats")
async def get_platform_stats()

# Chat System
@api_router.get("/chat/messages/{session_id}")
async def get_chat_messages(session_id: str)

@api_router.post("/chat/messages")
async def send_chat_message(message: ChatMessage)

# Contact & Leads
@api_router.post("/contact")
async def submit_contact_form(contact: ContactForm)

# Newsletter
@api_router.post("/newsletter")
async def subscribe_newsletter(email: EmailSubscription)
```

### Frontend Integration Points:

1. **Replace mockApi.getStats()** with actual API call
2. **Replace mockApi.getChatMessages()** with session-based chat
3. **Replace mockApi.sendChatMessage()** with real bot responses
4. **Replace mockApi.submitContact()** with CRM integration
5. **Add newsletter subscription functionality**

### Additional Features to Implement:

1. **ROI Calculator** - Store calculation parameters and results
2. **Demo Scheduling** - Calendly integration or custom booking system
3. **Analytics Tracking** - User interaction and engagement metrics
4. **Multi-language Support** - Backend translation API for Bangla content
5. **Admin Dashboard** - Manage leads, chat responses, and platform stats

## Security & Compliance:

1. **Input Validation** - Sanitize all form inputs
2. **Rate Limiting** - Prevent spam on contact forms and chat
3. **CORS Configuration** - Proper cross-origin setup
4. **Data Privacy** - GDPR compliant data handling
5. **Email Validation** - Verify email addresses for newsletter

## Performance Considerations:

1. **Caching** - Redis for frequently accessed stats
2. **WebSocket** - Real-time chat functionality
3. **Database Indexing** - Optimize queries for chat and leads
4. **CDN Integration** - Static assets delivery
5. **Monitoring** - Health checks and performance metrics

## Testing Requirements:

1. **API Testing** - All endpoints with various scenarios
2. **Integration Testing** - Frontend-backend communication
3. **Load Testing** - Handle concurrent users and form submissions
4. **Security Testing** - Input validation and XSS prevention

## Deployment Checklist:

1. ✅ Frontend with mock data (COMPLETE)
2. ⏳ Backend API implementation (PENDING)
3. ⏳ Database schema and models (PENDING)
4. ⏳ Frontend-backend integration (PENDING)
5. ⏳ Testing and optimization (PENDING)

---

**Next Steps**: Implement backend APIs, replace mock data with real database operations, and ensure seamless frontend integration.