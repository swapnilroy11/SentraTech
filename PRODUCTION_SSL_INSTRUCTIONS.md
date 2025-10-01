# 🚀 SentraTech Production SSL Deployment Instructions

## Current Status
- ✅ **Certbot installed** and ready (v2.1.0)
- ✅ **Nginx configuration** prepared for Let's Encrypt
- ✅ **Proxy service** running and tested on port 3003
- ⚠️ **DNS configuration required** before SSL certificates can be issued

## DNS Requirements (CRITICAL)

**Current DNS Status:**
```
sentratech.net → 34.57.15.54 (incorrect)
Required: sentratech.net → 35.184.53.215 (this server)
```

**Required DNS Records:**
```
Type: A
Name: sentratech.net (or @)
Value: 35.184.53.215
TTL: 300

Type: CNAME  
Name: www
Value: sentratech.net
TTL: 300
```

## Production SSL Deployment Steps

### 1. Configure DNS (YOUR ACTION REQUIRED)
Update DNS records at your provider to point to `35.184.53.215`

### 2. Verify DNS Propagation
```bash
# Wait until this returns 35.184.53.215
dig +short sentratech.net @8.8.8.8
```

### 3. Run SSL Deployment Script
```bash
# After DNS is configured, run:
sudo /app/production-ssl-deployment.sh
```

### 4. Manual SSL Certificate Installation (Alternative)
If the script fails, run commands manually:

```bash
# Remove self-signed certificate lines from nginx config
sudo nano /etc/nginx/sites-available/sentratech.net
# Comment out:
#   ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
#   ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

# Request Let's Encrypt certificates
sudo certbot --nginx -d sentratech.net -d www.sentratech.net \
    --non-interactive --agree-tos --email admin@sentratech.net

# Test configuration
sudo nginx -t && sudo systemctl reload nginx
```

### 5. Verify SSL Installation
```bash
# Check certificate details
openssl s_client -connect sentratech.net:443 -servername sentratech.net </dev/null | openssl x509 -noout -issuer -dates

# Test HTTPS endpoint
curl -v https://sentratech.net/api/collect \
    -H "Content-Type: application/json" \
    -d '{"name":"SSL-TEST","email":"test@sentratech.net","trace_id":"SSL-'$(date +%s)'"}'
```

## Expected Results After SSL Deployment

### SSL Certificate Information:
```
Issuer: C = US, O = Let's Encrypt, CN = R3
Valid from: [Issue Date]
Valid until: [Expiration Date] (90 days)
```

### HTTPS Features:
- ✅ TLS 1.3 support
- ✅ HTTP/2 enabled
- ✅ HSTS headers
- ✅ Security headers (X-Frame-Options, etc.)
- ✅ Automatic HTTP → HTTPS redirect

### Auto-Renewal:
```bash
# Certbot timer automatically renews certificates
systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

## Troubleshooting

### DNS Not Propagated
```bash
# Check multiple DNS servers
dig +short sentratech.net @8.8.8.8
dig +short sentratech.net @1.1.1.1
dig +short sentratech.net @208.67.222.222

# All should return: 35.184.53.215
```

### Certbot Fails
```bash
# Check detailed logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Common issues:
# - DNS not pointing to server
# - Firewall blocking ports 80/443
# - Nginx configuration errors
```

### Nginx Configuration Issues
```bash
# Test configuration
sudo nginx -t

# Restore backup if needed
sudo cp /etc/nginx/sites-available/sentratech.net.backup /etc/nginx/sites-available/sentratech.net
sudo systemctl reload nginx
```

## Rollback Plan

If SSL deployment fails:
```bash
# 1. Restore nginx configuration
sudo cp /etc/nginx/sites-available/sentratech.net.backup /etc/nginx/sites-available/sentratech.net

# 2. Reload nginx
sudo nginx -t && sudo systemctl reload nginx

# 3. Remove failed certificates (if any)
sudo certbot delete --cert-name sentratech.net
```

## Files Created/Modified

- `/app/production-ssl-deployment.sh` - Complete deployment script
- `/etc/nginx/sites-available/sentratech.net` - Production nginx config
- `/var/log/letsencrypt/` - Certbot logs
- `/etc/letsencrypt/live/sentratech.net/` - SSL certificates (after successful deployment)

## Contact Information

For deployment assistance or DNS configuration help:
- Check logs: `/var/log/letsencrypt/letsencrypt.log`
- Verify proxy: `curl http://127.0.0.1:3003/internal/collect-health`
- Test nginx: `sudo nginx -t`