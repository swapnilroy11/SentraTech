# SentraTech Troubleshooting Guide

## Common Issues and Solutions

### Service Startup Issues

#### Problem: Service fails to start
```bash
sudo systemctl status sentratech-proxy
# Output: "failed" or "activating"
```

**Diagnosis Steps:**
```bash
# Check detailed logs
sudo journalctl -u sentratech-proxy -n 50 --no-pager

# Check configuration file
sudo nano /opt/sentratech-proxy/.env

# Verify file permissions
ls -la /opt/sentratech-proxy/
```

**Common Solutions:**

1. **Missing Environment Variables**
   ```bash
   # Check if .env exists and has required values
   sudo cat /opt/sentratech-proxy/.env | grep DASHBOARD_API_KEY
   
   # If missing, add required variables
   sudo nano /opt/sentratech-proxy/.env
   ```

2. **Permission Issues**
   ```bash
   sudo chown -R sentratech:sentratech /opt/sentratech-proxy
   sudo chmod 600 /opt/sentratech-proxy/.env
   sudo chmod 755 /opt/sentratech-proxy
   ```

3. **Python Environment Issues**
   ```bash
   # Recreate virtual environment
   cd /opt/sentratech-proxy
   sudo rm -rf venv
   sudo python3 -m venv venv
   sudo venv/bin/pip install -r requirements.txt
   sudo chown -R sentratech:sentratech venv
   ```

#### Problem: Port 8001 already in use
```bash
# Check what's using port 8001
sudo netstat -tulpn | grep 8001
sudo lsof -i :8001

# Kill conflicting process
sudo kill -9 <PID>
```

### SSL Certificate Issues

#### Problem: SSL certificate not working
```bash
# Check certificate status
sudo certbot certificates

# Test SSL connection
openssl s_client -connect sentratech.net:443 -servername sentratech.net
```

**Solutions:**

1. **Certificate Not Found**
   ```bash
   # Re-run SSL setup
   sudo bash scripts/setup-ssl.sh
   
   # Or manually obtain certificate
   sudo certbot certonly --webroot -w /var/www/certbot \
     -d sentratech.net -d www.sentratech.net
   ```

2. **Certificate Expired**
   ```bash
   # Renew certificates
   sudo certbot renew
   sudo systemctl restart nginx
   ```

3. **Nginx SSL Configuration Issues**
   ```bash
   # Test nginx configuration
   sudo nginx -t
   
   # If errors, check certificate paths
   sudo ls -la /etc/letsencrypt/live/sentratech.net/
   ```

### Dashboard Connectivity Issues

#### Problem: Forms not reaching dashboard (502 errors)
```bash
# Check collect endpoint logs
sudo tail -f /var/log/sentratech/collect.log

# Test dashboard connectivity
curl -I https://admin.sentratech.net/api/health
```

**Diagnosis:**

1. **Network Connectivity**
   ```bash
   # Test DNS resolution
   nslookup admin.sentratech.net
   
   # Test connectivity
   telnet admin.sentratech.net 443
   
   # Check with curl
   curl -v https://admin.sentratech.net/api/health
   ```

2. **API Key Issues**
   ```bash
   # Check API key in logs
   sudo grep "Authentication" /var/log/sentratech/collect.log
   
   # Test API key manually
   curl -X POST https://admin.sentratech.net/api/forms/test \
     -H "X-INGEST-KEY: your-key-here" \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

**Solutions:**

1. **Invalid API Key**
   ```bash
   # Update API key in environment
   sudo nano /opt/sentratech-proxy/.env
   # Set: DASHBOARD_API_KEY=correct-key
   
   sudo systemctl restart sentratech-proxy
   ```

2. **Firewall Blocking Outbound**
   ```bash
   # Check outbound connectivity
   curl -I https://google.com
   
   # If blocked, configure firewall
   sudo ufw allow out 443
   ```

### Database Issues

#### Problem: MongoDB connection errors
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo journalctl -u mongod -n 20
```

**Solutions:**

1. **MongoDB Not Running**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. **Connection String Issues**
   ```bash
   # Verify MongoDB is listening
   sudo netstat -tulpn | grep 27017
   
   # Test connection
   mongo mongodb://localhost:27017/sentratech_forms
   ```

3. **Database Permissions**
   ```bash
   # Check MongoDB logs for auth issues
   sudo tail -f /var/log/mongodb/mongod.log
   ```

### Nginx Issues

#### Problem: Nginx not starting
```bash
sudo systemctl status nginx
sudo nginx -t
```

**Common Solutions:**

1. **Configuration Syntax Error**
   ```bash
   sudo nginx -t
   # Fix reported errors in config file
   sudo nano /etc/nginx/sites-available/sentratech.net
   ```

2. **Port Conflicts**
   ```bash
   # Check what's using port 80/443
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

3. **SSL Certificate Path Issues**
   ```bash
   # Verify certificate files exist
   sudo ls -la /etc/letsencrypt/live/sentratech.net/
   
   # If missing, re-run SSL setup
   sudo bash scripts/setup-ssl.sh
   ```

### Performance Issues

#### Problem: Slow response times
```bash
# Check service load
htop
sudo systemctl status sentratech-proxy

# Check logs for errors
sudo tail -f /var/log/sentratech/collect.log
```

**Solutions:**

1. **Increase Worker Processes**
   ```bash
   sudo nano /etc/systemd/system/sentratech-proxy.service
   # Change: --workers 1 to --workers 2
   
   sudo systemctl daemon-reload
   sudo systemctl restart sentratech-proxy
   ```

2. **Optimize Database**
   ```bash
   # Connect to MongoDB
   mongo sentratech_forms
   
   # Create indexes
   db.submissions.createIndex({"trace_id": 1})
   db.submissions.createIndex({"created_at": -1})
   ```

3. **Check System Resources**
   ```bash
   # Check memory usage
   free -h
   
   # Check disk space
   df -h
   
   # Check CPU usage
   top
   ```

### DNS and Network Issues

#### Problem: Domain not resolving
```bash
# Check DNS resolution
nslookup sentratech.net
dig sentratech.net

# Check from external source
curl -I http://sentratech.net
```

**Solutions:**

1. **DNS Propagation**
   ```bash
   # Check DNS from multiple locations
   # Use online tools like whatsmydns.net
   
   # Current server IP
   curl -4 ifconfig.me
   ```

2. **Cloudflare/CDN Issues**
   - Check Cloudflare dashboard if using
   - Verify DNS records point to correct IP
   - Ensure SSL mode is "Full" or "Full (Strict)"

### Form Submission Issues

#### Problem: Forms not submitting (frontend errors)
```bash
# Check browser network tab for errors
# Look for CORS or 502 errors

# Test endpoint directly
curl -X POST https://sentratech.net/api/collect \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "email": "test@example.com"}'
```

**Solutions:**

1. **CORS Issues**
   ```bash
   # Check CORS configuration
   sudo grep -A 10 "CORSMiddleware" /opt/sentratech-proxy/server.py
   
   # Add domain to CORS if needed
   sudo nano /opt/sentratech-proxy/.env
   # Update CORS_ORIGINS
   ```

2. **Content-Type Issues**
   ```bash
   # Ensure frontend sends proper headers
   # Content-Type: application/json
   ```

## Diagnostic Commands

### Service Health Check
```bash
#!/bin/bash
echo "=== Service Status ==="
sudo systemctl status sentratech-proxy nginx mongod

echo -e "\n=== Port Status ==="
sudo netstat -tulpn | grep -E ":(80|443|8001|27017)"

echo -e "\n=== Health Endpoints ==="
curl -s http://localhost:8001/api/health || echo "Local health failed"
curl -s https://sentratech.net/api/health || echo "Public health failed"

echo -e "\n=== Recent Errors ==="
sudo journalctl -u sentratech-proxy --since "1 hour ago" --no-pager | grep -i error

echo -e "\n=== Disk Space ==="
df -h

echo -e "\n=== Memory Usage ==="
free -h
```

### Log Analysis
```bash
#!/bin/bash
echo "=== Recent Service Logs ==="
sudo journalctl -u sentratech-proxy --since "1 hour ago" --no-pager

echo -e "\n=== Collect Logs (Last 10) ==="
sudo tail -10 /var/log/sentratech/collect.log

echo -e "\n=== Nginx Error Logs ==="
sudo tail -10 /var/log/nginx/sentratech.net.error.log

echo -e "\n=== Failed Submissions ==="
sudo find /var/data/pending_submissions -name "*.json" -mtime -1 -exec echo {} \;
```

### Network Connectivity Test
```bash
#!/bin/bash
echo "=== DNS Resolution ==="
nslookup sentratech.net
nslookup admin.sentratech.net

echo -e "\n=== External Connectivity ==="
curl -I https://admin.sentratech.net/api/health
curl -I https://google.com

echo -e "\n=== SSL Certificate ==="
echo | openssl s_client -connect sentratech.net:443 -servername sentratech.net 2>/dev/null | openssl x509 -noout -dates

echo -e "\n=== Firewall Status ==="
sudo ufw status
```

## Emergency Recovery

### Service Recovery
```bash
# Stop all services
sudo systemctl stop sentratech-proxy nginx

# Reset to known good state
cd /opt/sentratech-proxy
sudo git checkout main  # If using git
sudo systemctl restart sentratech-proxy nginx

# Check status
sudo systemctl status sentratech-proxy nginx
```

### Database Recovery
```bash
# Create backup before recovery
sudo mongodump --db sentratech_forms --out /tmp/backup-$(date +%Y%m%d)

# Restore from backup (if needed)
sudo mongorestore --db sentratech_forms /path/to/backup
```

### Configuration Reset
```bash
# Backup current config
sudo cp /opt/sentratech-proxy/.env /opt/sentratech-proxy/.env.backup

# Restore from template
sudo cp /opt/sentratech-proxy/config/.env.template /opt/sentratech-proxy/.env
sudo nano /opt/sentratech-proxy/.env  # Add your values
sudo systemctl restart sentratech-proxy
```

## Getting Help

### Log Collection for Support
```bash
#!/bin/bash
# Create support bundle
SUPPORT_DIR="/tmp/sentratech-support-$(date +%Y%m%d-%H%M%S)"
mkdir -p $SUPPORT_DIR

# Collect system info
uname -a > $SUPPORT_DIR/system-info.txt
sudo systemctl status sentratech-proxy nginx mongod > $SUPPORT_DIR/service-status.txt
sudo journalctl -u sentratech-proxy --since "24 hours ago" --no-pager > $SUPPORT_DIR/service-logs.txt
sudo tail -100 /var/log/sentratech/collect.log > $SUPPORT_DIR/collect-logs.txt
sudo nginx -t > $SUPPORT_DIR/nginx-test.txt 2>&1

# Collect config (sanitized)
sudo cp /opt/sentratech-proxy/.env $SUPPORT_DIR/env-config.txt
sudo sed -i 's/DASHBOARD_API_KEY=.*/DASHBOARD_API_KEY=***REDACTED***/' $SUPPORT_DIR/env-config.txt

echo "Support bundle created: $SUPPORT_DIR"
tar -czf $SUPPORT_DIR.tar.gz -C /tmp $(basename $SUPPORT_DIR)
echo "Archive: $SUPPORT_DIR.tar.gz"
```

This troubleshooting guide covers the most common issues encountered during deployment and operation of the SentraTech proxy service. Always start with the diagnostic commands to identify the root cause before applying solutions.