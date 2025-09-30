# Production Deployment Checklist - SentraTech Dashboard Integration

## Pre-Deployment Verification ✅ COMPLETE
- [x] Database schemas match specification
- [x] API endpoints live and accepting requests  
- [x] CORS configuration verified
- [x] Authentication working (X-INGEST-KEY)
- [x] SSL certificates valid
- [x] 4/5 proxy endpoints tested successfully
- [ ] **PENDING**: Job application endpoint HTTP 500 fix

## Go-Live Steps

### Phase 1: Final Integration Test
1. **Retest Job Application Endpoint** (after dashboard team fixes HTTP 500)
   ```bash
   curl -X POST https://admin.sentratech.net/api/forms/job-application \
     -H "Content-Type: application/json" \
     -H "X-INGEST-KEY: sk-emergent-7A236FdD2Ce8d9b52C" \
     -d @test_job_application.json
   ```

2. **End-to-End Form Testing** - Submit one form of each type from website UI
   - Newsletter signup from footer
   - ROI calculator with full calculation
   - Demo request with company details
   - Contact sales with plan selection
   - Job application with complete profile

### Phase 2: Data Migration (if needed)
3. **Export Fallback Data** (if significant accumulated submissions)
   ```bash
   mongoexport --db sentratech_forms --collection newsletter_fallback --out newsletter_fallback.json
   mongoexport --db sentratech_forms --collection roi_fallback --out roi_fallback.json
   # etc.
   ```

4. **Import to Dashboard** (coordinate with dashboard team)

### Phase 3: Monitoring Setup
5. **Dashboard Health Check Endpoint**
   - Test: `GET https://admin.sentratech.net/api/health`
   - Expected: HTTP 200 with status OK

6. **Real-Time WebSocket Test**
   - Connect: `wss://admin.sentratech.net/ws/dashboard`
   - Submit form and verify dashboard updates instantly

### Phase 4: Go-Live Announcement
7. **Update Domain References** (if switching from development)
   - Confirm all production domains are live
   - Test from actual sentratech.net domain

8. **Team Notification**
   - Inform customer support team about new dashboard
   - Provide dashboard access credentials
   - Share training documentation

## Rollback Plan
If issues arise after go-live:

1. **Quick Revert to Fallback Mode** (2 minutes)
   ```bash
   # Comment out dashboard URLs in .env
   sed -i 's/ADMIN_DASHBOARD_URL/#ADMIN_DASHBOARD_URL/' /app/backend/.env
   sudo supervisorctl restart backend
   ```

2. **Alternative: Maintenance Mode** (30 seconds)
   ```bash
   # Add maintenance flag to temporarily disable submissions
   echo "MAINTENANCE_MODE=true" >> /app/backend/.env
   sudo supervisorctl restart backend
   ```

## Success Metrics
- All 5 form types submit successfully 
- Dashboard displays submissions within 5 seconds
- WebSocket updates work real-time
- No HTTP 4xx/5xx errors in logs
- Response times under 2 seconds

## Support Contacts
- Website Team: [Your team]
- Dashboard Team: [Dashboard team]
- Emergency Contact: [Emergency number]

---
**TARGET GO-LIVE**: After job application endpoint is fixed
**ROLLBACK WINDOW**: 24 hours post-deployment
**MONITORING**: First 48 hours after go-live