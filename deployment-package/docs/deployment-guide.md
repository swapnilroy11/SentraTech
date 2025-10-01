# SentraTech Production Deployment Guide

## Overview
This guide provides detailed instructions for deploying the SentraTech proxy service on the production server at `34.57.15.54`.

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04 LTS or newer
- **RAM**: Minimum 2GB, recommended 4GB
- **Disk**: Minimum 20GB free space
- **Network**: Public IP with ports 80, 443, and 22 accessible

### DNS Configuration
Before deployment, ensure:
- `sentratech.net` points to `34.57.15.54`
- `www.sentratech.net` points to `34.57.15.54`
- TTL is set to 300 seconds for faster propagation

### Required Information
- Dashboard API Key (from admin.sentratech.net)
- Email address for SSL certificates
- Admin dashboard URL (default: https://admin.sentratech.net/api)

## Deployment Methods

### Method 1: Automated Deployment (Recommended)

1. **Copy deployment package to server**:
   ```bash
   scp -r deployment-package/ user@34.57.15.54:~/
   ssh user@34.57.15.54
   cd ~/deployment-package
   ```

2. **Run complete deployment**:
   ```bash
   sudo bash scripts/deploy.sh
   ```

3. **Follow the prompts**:
   - Enter Dashboard API Key
   - Enter email for SSL certificates
   - Confirm admin dashboard URL
   - Confirm DNS configuration

4. **Verify deployment**:
   ```bash
   # Test health endpoint
   curl https://sentratech.net/api/health
   
   # Test collect endpoint
   curl -X POST https://sentratech.net/api/collect \
     -H "Content-Type: application/json" \
     -d '{"name": "Test", "email": "test@example.com"}'
   ```

### Method 2: Manual Step-by-Step Deployment

#### Step 1: System Installation
```bash
sudo bash scripts/install.sh
```

#### Step 2: Configuration
```bash
# Edit environment file
sudo nano /opt/sentratech-proxy/.env

# Set your values:
# DASHBOARD_API_KEY=your-actual-key
# ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api
```

#### Step 3: Start Service
```bash
sudo systemctl start sentratech-proxy
sudo systemctl status sentratech-proxy
```

#### Step 4: SSL Setup
```bash
sudo bash scripts/setup-ssl.sh
```

#### Step 5: Test Deployment
```bash
# Test local backend
curl http://localhost:8001/api/health

# Test HTTPS endpoint
curl https://sentratech.net/api/health
```

## Configuration Details

### Environment Variables
Located at `/opt/sentratech-proxy/.env`:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017/sentratech_forms

# Dashboard Integration - REQUIRED
ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api
DASHBOARD_API_KEY=your-dashboard-api-key-here

# CORS Configuration
CORS_ORIGINS=https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net

# Performance Settings
PROXY_TIMEOUT=30000
PROXY_RETRIES=3
PROXY_BACKOFF=500
IDEMPOTENCY_WINDOW=86400000
```

### Service Management
```bash
# Service control
sudo systemctl start sentratech-proxy
sudo systemctl stop sentratech-proxy
sudo systemctl restart sentratech-proxy
sudo systemctl status sentratech-proxy

# Enable/disable auto-start
sudo systemctl enable sentratech-proxy
sudo systemctl disable sentratech-proxy

# View logs
sudo journalctl -u sentratech-proxy -f
sudo tail -f /var/log/sentratech/collect.log
```

### Nginx Configuration
Located at `/etc/nginx/sites-available/sentratech.net`:
- Handles HTTPS redirect
- Proxies `/api/collect` to backend
- Serves static website files
- Includes security headers

## Monitoring and Maintenance

### Log Files
- **Service Logs**: `journalctl -u sentratech-proxy`
- **Collect Logs**: `/var/log/sentratech/collect.log`
- **Nginx Access**: `/var/log/nginx/sentratech.net.access.log`
- **Nginx Error**: `/var/log/nginx/sentratech.net.error.log`

### Health Monitoring
```bash
# Check all services
sudo systemctl status sentratech-proxy nginx mongod

# Test endpoints
curl https://sentratech.net/api/health
curl -X POST https://sentratech.net/api/collect -d '{"test":true}'

# Check SSL certificate
sudo certbot certificates
```

### Backup Locations
- **Failed Submissions**: `/var/data/pending_submissions/`
- **Database Backups**: Regular MongoDB backups recommended
- **Configuration**: `/opt/sentratech-proxy/.env`

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
sudo journalctl -u sentratech-proxy -n 50

# Check configuration
sudo nano /opt/sentratech-proxy/.env

# Verify permissions
sudo chown -R sentratech:sentratech /opt/sentratech-proxy
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Test SSL configuration
sudo nginx -t
```

#### Dashboard Connection Errors
```bash
# Check connectivity to dashboard
curl -I https://admin.sentratech.net/api/health

# Verify API key in logs
sudo tail /var/log/sentratech/collect.log

# Test authentication
curl -X POST https://admin.sentratech.net/api/forms/test \
  -H "X-INGEST-KEY: your-key" \
  -H "Authorization: Bearer your-key"
```

### Performance Tuning

#### For High Traffic
```bash
# Increase worker processes
sudo nano /etc/systemd/system/sentratech-proxy.service
# Change: --workers 1 to --workers 4

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart sentratech-proxy
```

#### Database Optimization
```bash
# Create indexes for better performance
mongo sentratech_forms
db.submissions.createIndex({"trace_id": 1})
db.submissions.createIndex({"created_at": -1})
```

## Security Considerations

### Firewall Configuration
```bash
# View current rules
sudo ufw status

# Allow only required ports
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### SSL Security
- Certificates auto-renew via crontab
- Strong SSL configuration included
- HSTS headers enabled
- Security headers implemented

### API Key Security
- Store API keys in environment file only
- Set restrictive file permissions (600)
- Never commit API keys to version control
- Rotate keys regularly

## Production Checklist

Before going live:
- [ ] DNS pointing to correct server
- [ ] SSL certificates installed and working
- [ ] Dashboard API key configured
- [ ] Service starting automatically
- [ ] Health endpoints responding
- [ ] Form submission test successful
- [ ] Log files writable
- [ ] Backup directories created
- [ ] Firewall configured
- [ ] Monitoring in place

## Support

For issues during deployment:
1. Check service logs first
2. Verify configuration files
3. Test individual components
4. Consult troubleshooting section
5. Check network connectivity to dashboard

The deployment package includes all necessary components for a production-ready installation.