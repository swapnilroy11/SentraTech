#!/usr/bin/env bash
# PRODUCTION_DEPLOYMENT_COMMANDS.sh
# Run these commands on the production server at 34.57.15.54

echo "=== PRODUCTION SERVER SSL DEPLOYMENT ==="
echo "Server IP: $(curl -s ifconfig.me)"
echo "Expected: 34.57.15.54"

# 1. DNS Verification
echo "1. Verifying DNS configuration..."
DNS_IP=$(dig +short sentratech.net @8.8.8.8 | head -1)
SERVER_IP=$(curl -s ifconfig.me)
if [ "$DNS_IP" = "$SERVER_IP" ]; then
    echo "✅ DNS correctly configured: $DNS_IP"
else
    echo "❌ DNS mismatch: Expected $SERVER_IP, got $DNS_IP"
    exit 1
fi

# 2. Install certbot
echo "2. Installing certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# 3. Remove /etc/hosts entries (if any)
echo "3. Cleaning /etc/hosts..."
sudo cp /etc/hosts /etc/hosts.backup
sudo sed -i '/sentratech\.net/d' /etc/hosts
echo "Removed sentratech.net entries from /etc/hosts"

# 4. Install Let's Encrypt certificates
echo "4. Installing Let's Encrypt SSL certificates..."
sudo certbot --nginx -d sentratech.net -d www.sentratech.net \
    --non-interactive --agree-tos --email admin@sentratech.net --redirect

# 5. Test nginx configuration
echo "5. Testing nginx configuration..."
sudo nginx -t && sudo systemctl reload nginx

# 6. Start/restart proxy service (assuming PM2 is installed)
echo "6. Starting proxy service..."
cd /app/server
npm install -g pm2 2>/dev/null || echo "PM2 already installed"
pm2 delete sentra-collect 2>/dev/null || echo "No existing PM2 process"
pm2 start ecosystem.config.cjs
pm2 save

# 7. Create required directories
sudo mkdir -p /var/log/sentratech /var/data/pending_submissions
sudo chown $USER:$USER /var/log/sentratech /var/data/pending_submissions

# 8. Test proxy service
echo "7. Testing proxy service..."
curl -s http://127.0.0.1:3003/internal/collect-health || echo "Proxy service not responding"

# 9. Manual smoke test
echo "8. Running manual smoke test..."
TRACE="FINAL-PROD-$(date +%s)"
echo "Testing with trace_id: $TRACE"

curl -v -X POST "https://sentratech.net/api/collect" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"FINAL-PROD\",\"email\":\"final@sentratech.net\",\"trace_id\":\"$TRACE\"}"

echo "Waiting 3 seconds for logs..."
sleep 3

echo "Proxy logs for $TRACE:"
sudo tail -n 200 /var/log/sentratech/collect.log | grep "$TRACE" -A2 -B2 || echo "No logs found"

# 10. TLS verification
echo "9. TLS certificate verification..."
openssl s_client -connect sentratech.net:443 -servername sentratech.net </dev/null | sed -n '1,120p'

# 11. Run verification script
echo "10. Running comprehensive verification..."
export DASHBOARD_API_KEY="sk-emergent-7A236FdD2Ce8d9b52C"
chmod +x /app/verify-deploy.sh
/app/verify-deploy.sh

echo "=== DEPLOYMENT COMPLETE ==="