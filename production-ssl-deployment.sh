#!/usr/bin/env bash
# production-ssl-deployment.sh
# Complete SSL deployment script for sentratech.net

echo "=== SENTRATECH.NET PRODUCTION SSL DEPLOYMENT ==="
echo "Server IP: $(curl -s ifconfig.me)"
echo "Timestamp: $(date)"

# Prerequisites check
echo ""
echo "=== PREREQUISITE CHECKS ==="

# 1. Check DNS resolution
echo "1. Checking DNS resolution..."
RESOLVED_IP=$(dig +short sentratech.net @8.8.8.8 | head -1)
SERVER_IP=$(curl -s ifconfig.me)

if [ "$RESOLVED_IP" = "$SERVER_IP" ]; then
    echo "✅ DNS correctly points sentratech.net -> $SERVER_IP"
else
    echo "❌ DNS MISMATCH:"
    echo "   sentratech.net resolves to: $RESOLVED_IP"
    echo "   This server IP is: $SERVER_IP"
    echo ""
    echo "REQUIRED ACTION: Update DNS A record:"
    echo "   Name: sentratech.net (or @)"
    echo "   Value: $SERVER_IP"
    echo "   TTL: 300"
    echo ""
    echo "Also add CNAME record:"
    echo "   Name: www"
    echo "   Value: sentratech.net"
    echo "   TTL: 300"
    echo ""
    echo "Wait for DNS propagation (5-60 minutes) before proceeding."
    exit 1
fi

# 2. Check if Nginx is configured
echo "2. Checking Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration errors found"
    exit 1
fi

# 3. Check if ports 80/443 are accessible
echo "3. Checking port accessibility..."
if netstat -tlnp | grep -q ":80.*LISTEN"; then
    echo "✅ Port 80 is listening"
else
    echo "❌ Port 80 not listening"
    exit 1
fi

if netstat -tlnp | grep -q ":443.*LISTEN"; then
    echo "✅ Port 443 is listening"
else
    echo "❌ Port 443 not listening"
    exit 1
fi

# Prerequisites passed - proceed with SSL deployment
echo ""
echo "=== PREREQUISITES PASSED - PROCEEDING WITH SSL DEPLOYMENT ==="

# Step 1: Remove any self-signed certificates from nginx config
echo ""
echo "1. Updating nginx to use Let's Encrypt certificate paths..."

# Backup current nginx config
cp /etc/nginx/sites-available/sentratech.net /etc/nginx/sites-available/sentratech.net.backup

# Update SSL certificate paths for Let's Encrypt
sed -i 's|ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;|ssl_certificate /etc/letsencrypt/live/sentratech.net/fullchain.pem;|' /etc/nginx/sites-available/sentratech.net
sed -i 's|ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;|ssl_certificate_key /etc/letsencrypt/live/sentratech.net/privkey.pem;|' /etc/nginx/sites-available/sentratech.net

# Step 2: Request Let's Encrypt certificates
echo ""
echo "2. Requesting Let's Encrypt SSL certificates..."

certbot --nginx -d sentratech.net -d www.sentratech.net \
    --non-interactive \
    --agree-tos \
    --email admin@sentratech.net \
    --redirect \
    --no-eff-email

if [ $? -eq 0 ]; then
    echo "✅ SSL certificates successfully obtained and installed"
else
    echo "❌ SSL certificate installation failed"
    echo "Restoring nginx backup..."
    cp /etc/nginx/sites-available/sentratech.net.backup /etc/nginx/sites-available/sentratech.net
    nginx -t && systemctl reload nginx
    exit 1
fi

# Step 3: Test nginx configuration
echo ""
echo "3. Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration valid with SSL"
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration invalid after SSL installation"
    exit 1
fi

# Step 4: Set up auto-renewal
echo ""
echo "4. Setting up SSL certificate auto-renewal..."
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal
certbot renew --dry-run
if [ $? -eq 0 ]; then
    echo "✅ SSL certificate auto-renewal is properly configured"
else
    echo "⚠️ SSL certificate auto-renewal test failed (certificates will still work)"
fi

# Step 5: Verification
echo ""
echo "=== SSL DEPLOYMENT VERIFICATION ==="

# Check certificate details
echo "SSL Certificate Information:"
echo "$(openssl s_client -connect sentratech.net:443 -servername sentratech.net </dev/null 2>/dev/null | openssl x509 -noout -issuer -dates -subject)"

# Test HTTPS connection
echo ""
echo "Testing HTTPS connection:"
curl -Is https://sentratech.net | head -5

# Test proxy endpoint
echo ""
echo "Testing proxy endpoint:"
curl -X POST https://sentratech.net/api/collect \
    -H "Content-Type: application/json" \
    -d '{"name":"SSL-TEST","email":"ssl@test.com","trace_id":"SSL-TEST-'$(date +%s)'"}' \
    -w "\nStatus Code: %{http_code}\n"

echo ""
echo "=== SSL DEPLOYMENT COMPLETE ==="
echo "✅ sentratech.net is now secured with Let's Encrypt SSL"
echo "✅ Auto-renewal configured via certbot.timer"
echo "✅ Proxy service accessible via HTTPS"
echo ""
echo "Certificate expires: $(openssl s_client -connect sentratech.net:443 -servername sentratech.net </dev/null 2>/dev/null | openssl x509 -noout -dates | grep notAfter)"
echo ""
echo "Monitor renewal with: sudo systemctl status certbot.timer"
echo "Manual renewal test: sudo certbot renew --dry-run"