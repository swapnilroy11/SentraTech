# 🔒 DASHBOARD CONFIGURATION LOCK 🔒

## ⚠️ CRITICAL SYSTEM CONFIGURATION - PROTECTED ⚠️

This document serves as a **CONFIGURATION LOCK** for dashboard integration settings that are **ABSOLUTELY CRITICAL** to the functioning of the SentraTech website and data pipeline.

### 🚨 BEFORE MODIFYING ANY OF THESE SETTINGS 🚨

**STOP!** These configurations are protected for a reason. Changing them will break:
- ✅ Form submissions from website to dashboard
- ✅ Data flow to admin dashboard (dashboard-central-5)
- ✅ Authentication between website and backend
- ✅ Cross-origin request handling (CORS)
- ✅ Dashboard data synchronization

### 🔒 PROTECTED CONFIGURATION VALUES

#### Frontend Configuration (`/frontend/src/config/dashboardConfig.js`)
```javascript
BACKEND_URL: 'https://form-simulator.preview.emergentagent.com'
INGEST_KEY: 'a0d3f2b6c9e4d1784a92f3c1b5e6d0aa7c18e2f49b35c6d7e8f0a1b2c3d4e5f6'
```

#### Backend Configuration (`/backend/dashboard_config.py`)
```python
EXTERNAL_DASHBOARD_URL = "https://form-simulator.preview.emergentagent.com"
CURRENT_HOST = "customer-flow-5.preview.emergentagent.com"
DASHBOARD_AUTH_KEY = "test-ingest-key-12345"
```

#### Environment Variables (`/frontend/.env`)
```bash
REACT_APP_BACKEND_URL=https://form-simulator.preview.emergentagent.com
```

### 🛡️ PROTECTION MECHANISMS ACTIVE

1. **Centralized Configuration**: All settings are now managed through protected config files
2. **Validation Functions**: Automatic validation prevents invalid configurations
3. **Import Protection**: Components import from protected config instead of hardcoding
4. **Comments & Warnings**: Clear warnings in code indicate protected sections
5. **Auto-Validation**: Configuration is validated on import/startup

### 📋 MODIFICATION PROTOCOL

If you **ABSOLUTELY MUST** modify these settings:

1. **Get Approval**: Senior developer/system administrator approval required
2. **Document Change**: Update this file with change reason and date
3. **Test Staging**: Full testing on staging environment mandatory
4. **Verify Dashboard**: Confirm dashboard-central-5 receives data after changes
5. **Rollback Plan**: Have rollback strategy ready
6. **Monitor**: Watch for form submission failures after deployment

### 📊 VERIFICATION CHECKLIST

After any configuration changes, verify:

- [ ] Website forms submit without errors
- [ ] Backend logs show successful forwarding
- [ ] Dashboard-central-5 receives new data
- [ ] No CORS errors in browser console
- [ ] All form types working (demo, contact, ROI, newsletter)
- [ ] Configuration validation passes

### 🚨 EMERGENCY ROLLBACK

If configuration changes break the system:

1. **Immediate Action**: Revert to last known working configuration
2. **Restart Services**: `sudo supervisorctl restart all`
3. **Test Forms**: Submit test data to verify functionality
4. **Document Issue**: Record what went wrong for future reference

### 📝 CHANGE LOG

| Date | Changed By | Modification | Reason | Verified |
|------|------------|--------------|---------|-----------|
| 2025-09-28 | System Admin | Initial protection setup | Prevent accidental config changes | ✅ |
| | | | | |

### 🆘 SUPPORT CONTACTS

If you need to modify this configuration:
- System Administrator: Check with development team
- Emergency Contact: Senior developer on duty
- Documentation: This file and protected config files

---

**Remember**: These configurations were set up to solve specific CORS and authentication issues. 
Changing them without understanding the full architecture will break the data pipeline.

**Last Verified Working**: 2025-09-28 11:50 UTC
**Next Verification Due**: Before any configuration changes