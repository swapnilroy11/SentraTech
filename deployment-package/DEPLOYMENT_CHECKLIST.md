# SentraTech Production Deployment Checklist

## Pre-Deployment Requirements ✅

### Server Requirements
- [ ] Ubuntu 20.04 LTS or newer
- [ ] Minimum 2GB RAM (4GB recommended)
- [ ] 20GB+ free disk space
- [ ] Root/sudo access
- [ ] Internet connectivity

### DNS Configuration
- [ ] `sentratech.net` → `34.57.15.54`
- [ ] `www.sentratech.net` → `34.57.15.54`
- [ ] DNS propagation verified
- [ ] TTL set to 300 seconds

### Required Information
- [ ] Dashboard API key from admin.sentratech.net
- [ ] Email address for SSL certificates
- [ ] Admin dashboard URL (default: https://admin.sentratech.net/api)

## Deployment Steps ✅

### Phase 1: Initial Setup
- [ ] Copy deployment package to server
- [ ] Run automated deployment: `sudo bash scripts/deploy.sh`
- [ ] Provide API key when prompted
- [ ] Provide email for SSL when prompted
- [ ] Confirm configuration settings

### Phase 2: Service Verification
- [ ] Backend service started: `systemctl status sentratech-proxy`
- [ ] Nginx service running: `systemctl status nginx`
- [ ] MongoDB service running: `systemctl status mongod`
- [ ] Health endpoint responding: `curl http://localhost:8001/api/health`

### Phase 3: SSL Configuration
- [ ] SSL certificates obtained successfully
- [ ] HTTPS redirect working
- [ ] Certificate auto-renewal configured
- [ ] Security headers implemented

### Phase 4: Functionality Testing
- [ ] Run test suite: `bash scripts/test-deployment.sh`
- [ ] All critical tests passing
- [ ] Form submission working
- [ ] Idempotency verified
- [ ] Logging operational

## Post-Deployment Verification ✅

### Endpoint Testing
- [ ] Health check: `curl https://sentratech.net/api/health`
- [ ] Form submission test:
  ```bash
  curl -X POST https://sentratech.net/api/collect \
    -H "Content-Type: application/json" \
    -d '{"name": "Test User", "email": "test@example.com"}'
  ```

### Security Verification
- [ ] Firewall configured and active
- [ ] SSL certificate valid and trusted
- [ ] Service running as non-root user
- [ ] File permissions properly set (600 for .env)

### Monitoring Setup
- [ ] Log files created and writable:
  - `/var/log/sentratech/collect.log`
  - Service logs via `journalctl -u sentratech-proxy`
- [ ] Failed submission directory: `/var/data/pending_submissions/`
- [ ] Health monitoring endpoints accessible

### Performance Baseline
- [ ] Response time < 2 seconds for form submissions
- [ ] Memory usage < 512MB under normal load
- [ ] CPU usage < 20% under normal load

## Configuration Verification ✅

### Environment Variables
Located at `/opt/sentratech-proxy/.env`:
- [ ] `DASHBOARD_API_KEY` set correctly
- [ ] `ADMIN_DASHBOARD_URL` pointing to correct dashboard
- [ ] `MONGO_URL` configured for local MongoDB
- [ ] `CORS_ORIGINS` includes sentratech.net domains

### Service Configuration
- [ ] Service enabled for auto-start: `systemctl is-enabled sentratech-proxy`
- [ ] Service user `sentratech` exists and has proper permissions
- [ ] Virtual environment created with all dependencies
- [ ] Port 8001 bound and accessible locally

### Nginx Configuration
- [ ] Site configuration active: `/etc/nginx/sites-enabled/sentratech.net`
- [ ] SSL certificates properly referenced
- [ ] Proxy configuration for `/api/collect` working
- [ ] Security headers implemented
- [ ] Gzip compression enabled

## Backup and Maintenance ✅

### Backup Configuration
- [ ] Database backup script created (optional)
- [ ] Configuration files backed up
- [ ] SSL certificate renewal tested

### Monitoring Setup
- [ ] Log rotation configured
- [ ] Disk space monitoring considered
- [ ] Alert thresholds defined (optional)

## Troubleshooting Preparation ✅

### Essential Commands Ready
- [ ] Service status: `systemctl status sentratech-proxy`
- [ ] View logs: `journalctl -u sentratech-proxy -f`
- [ ] Collect logs: `tail -f /var/log/sentratech/collect.log`
- [ ] Test connectivity: `curl -I https://admin.sentratech.net/api/health`

### Common Issue Solutions Documented
- [ ] Service startup issues → check logs and permissions
- [ ] SSL issues → re-run setup-ssl.sh
- [ ] Dashboard connectivity → verify API key and network
- [ ] Performance issues → check resources and logs

## Production Readiness Sign-Off ✅

### Technical Verification
- [ ] All automated tests passing (0 failures)
- [ ] Manual form submission successful
- [ ] Dashboard integration confirmed
- [ ] Error handling and fallback working

### Business Requirements Met
- [ ] Same-origin proxy operational (`/api/collect`)
- [ ] Idempotency implemented (24-hour window)
- [ ] Retry logic with exponential backoff (3 retries)
- [ ] Comprehensive logging to structured files
- [ ] Payload enrichment (timestamps, IPs, user agents)
- [ ] Fallback persistence for failed submissions
- [ ] Dual authentication headers for dashboard transition

### Documentation Complete
- [ ] Deployment guide reviewed
- [ ] Configuration reference available
- [ ] Troubleshooting guide accessible
- [ ] Operations team trained (if applicable)

## Final Sign-Off

**Deployment Completed By**: _________________ **Date**: _________

**Technical Lead Approval**: _________________ **Date**: _________

**Business Owner Approval**: _________________ **Date**: _________

---

## Quick Commands Reference

```bash
# Service Management
sudo systemctl {start|stop|restart|status} sentratech-proxy
sudo systemctl {start|stop|restart|status} nginx

# Monitoring
journalctl -u sentratech-proxy -f
tail -f /var/log/sentratech/collect.log
htop

# Testing
bash scripts/test-deployment.sh
curl https://sentratech.net/api/health
curl -X POST https://sentratech.net/api/collect -d '{"test": true}'

# SSL Management
sudo certbot certificates
sudo certbot renew

# Configuration
sudo nano /opt/sentratech-proxy/.env
sudo systemctl restart sentratech-proxy
```

---

**Production Server**: 34.57.15.54 (sentratech.net)  
**Deployment Package Version**: 1.0.0-production  
**Target Go-Live**: Upon successful checklist completion