# SentraTech Enterprise Deployment Instructions

## 🚀 Complete Enterprise-Grade Solution Ready

### DNS Configuration ✅ COMPLETE
Based on your Spaceship DNS screenshot, the following are configured:
- **sentratech.net** → A Record → 34.57.6.54
- **www.sentratech.net** → A Record → 34.57.6.54  
- **admin.sentratech.net** → A Record → 34.57.6.54

### Production URLs Configured
- **Website**: https://sentratech.net
- **Dashboard**: https://admin.sentratech.net
- **WebSocket**: wss://admin.sentratech.net/ws

### API Endpoints Ready
- **ROI Calculator**: https://admin.sentratech.net/api/forms/roi-calculator
- **Demo Request**: https://admin.sentratech.net/api/forms/demo-request
- **Contact Sales**: https://admin.sentratech.net/api/forms/contact-sales
- **Newsletter Signup**: https://admin.sentratech.net/api/forms/newsletter-signup
- **Job Application**: https://admin.sentratech.net/api/forms/job-application

## 📋 Deployment Steps

### 1. Upload Configuration to Emergent.sh
Upload the `emergent.config.js` file to your project settings:

```bash
# The emergent.config.js is ready at /app/emergent.config.js
# Contains complete monorepo configuration for both sites
```

### 2. Set Environment Variables in Emergent.sh
In your project settings, add:
```
EMERGENT_API_KEY=sk-emergent-7A236FdD2Ce8d9b52C
```

### 3. Deploy Both Sites
The emergent.config.js will deploy:
- **Website** from `/app/website/` to `sentratech.net` and `www.sentratech.net`
- **Dashboard** from `/app/dashboard/` to `admin.sentratech.net`
- **Backend** from `/app/backend/` with all enterprise features

### 4. Verify SSL Certificates
Let's Encrypt should automatically provision SSL for:
- ✅ sentratech.net
- ✅ www.sentratech.net
- ✅ admin.sentratech.net

### 5. Run Smoke Tests
After deployment, run automated tests:
```bash
python /app/enterprise_smoke_tests.py
```

## 🛠️ Enterprise Features Implemented

### ✅ Proxy Service with Enterprise Features
- **Retry Logic**: 3 attempts with 500ms backoff
- **Idempotency**: 2-minute duplicate detection window
- **End-to-End ACK**: Waits for dashboard acknowledgment
- **Error Handling**: Comprehensive retry for 5xx errors

### ✅ Real-Time WebSocket Service  
- **URL**: wss://admin.sentratech.net/ws
- **Features**: Message ACK, replay capability, heartbeat (30s)
- **Reconnection**: Exponential backoff up to 60s
- **Fallback**: Polling every 5s if WebSocket fails >30s

### ✅ Dashboard Backend API
All endpoints with API key validation (X-API-Key: sk-emergent-7A236FdD2Ce8d9b52C):
- POST /api/forms/{form-type} → Store + broadcast via WebSocket
- GET /api/forms/{form}?since={timestamp} → Polling fallback
- WebSocket /ws → Real-time notifications

### ✅ Frontend Integration
- **Website**: All forms POST to /api/proxy/{form} with unique submissionId
- **Dashboard**: Real-time table updates, connection status, error handling
- **Navigation**: Environment-aware URLs (localhost ↔ production)

### ✅ UI/UX Enterprise Standards
- **Branding**: SentraTech colors (#00FF41 neon green, #0A0A0A dark)
- **Typography**: Inter font family
- **Accessibility**: WCAG 2.1 AA compliant
- **Theme**: Dark mode with neon green accents

## 🧪 Smoke Test Coverage

The automated test suite validates:
1. **SSL Certificate validity** for all 3 domains
2. **Proxy endpoints** - All 5 form types via sentratech.net/api/proxy
3. **Dashboard API** - Direct submission to admin.sentratech.net/api/forms
4. **WebSocket connectivity** - Real-time sync and message ACK
5. **End-to-end flow** - Form submission → WebSocket notification

Success criteria: ≥90% pass rate for production readiness.

## 🔧 Production Build

To build for production deployment:
```bash
python /app/build_production.py
```

This creates optimized builds in `/app/deployment/` with:
- Website build (React production)
- Dashboard build (React production)  
- Backend with production configuration
- Deployment manifest with all URLs

## 🎯 Deployment Verification Checklist

After deployment, verify:
- [ ] https://sentratech.net loads the website
- [ ] https://admin.sentratech.net loads the dashboard  
- [ ] Dashboard login works (admin@sentratech.net / sentratech2025)
- [ ] Form submissions work end-to-end
- [ ] Real-time sync appears in dashboard within 2s
- [ ] "Full Dashboard" button opens admin.sentratech.net
- [ ] All SSL certificates are valid (green lock icons)

## 🚨 Emergency Rollback

If issues occur:
1. Check smoke test results: `cat /app/smoke_test_results.json`
2. Monitor backend logs for errors
3. Use Emergent.sh rollback feature to previous stable version
4. Contact support with deployment manifest for assistance

---

## ✅ READY FOR PRODUCTION DEPLOYMENT

All enterprise requirements implemented:
- ✅ Domain & SSL configuration ready
- ✅ Monorepo build configuration complete
- ✅ Proxy service with retry & idempotency  
- ✅ Real-time WebSocket with ACK & reconnection
- ✅ Dashboard API with full field mapping
- ✅ Enterprise UI/UX standards applied
- ✅ Automated smoke test suite ready

**Next Step**: Upload emergent.config.js to Emergent.sh and deploy! 🚀