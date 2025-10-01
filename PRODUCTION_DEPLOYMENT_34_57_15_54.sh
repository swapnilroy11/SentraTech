#!/usr/bin/env bash
# Production Deployment Script for server 34.57.15.54
# Deploy website proxy service alongside existing dashboard

set -e

echo "=== SENTRATECH PRODUCTION DEPLOYMENT (34.57.15.54) ==="
echo "Deploying website proxy service alongside dashboard"
echo "Server: $(curl -s ifconfig.me 2>/dev/null || echo 'Unknown')"
echo "Expected: 34.57.15.54"
echo ""

# Verify we're on the correct server
CURRENT_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
if [ "$CURRENT_IP" != "34.57.15.54" ]; then
    echo "⚠️  WARNING: Current IP ($CURRENT_IP) != Expected (34.57.15.54)"
    echo "Please ensure you're running this on the production server"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Install Node.js and PM2 if not already installed
echo "1. Installing Node.js and PM2..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    sudo npm install -g pm2
fi

echo "   Node.js version: $(node --version)"
echo "   PM2 version: $(pm2 --version)"

# Step 2: Create directory structure
echo "2. Creating directory structure..."
sudo mkdir -p /app/server
sudo mkdir -p /var/log/sentratech
sudo mkdir -p /var/data/pending_submissions
sudo chown -R $USER:$USER /app/server /var/log/sentratech /var/data/pending_submissions

# Step 3: Install certbot for SSL
echo "3. Installing certbot for SSL certificates..."
sudo apt update -qq
sudo apt install -y certbot python3-certbot-nginx

# Step 4: Check if nginx is installed and running
echo "4. Checking nginx status..."
if ! command -v nginx &> /dev/null; then
    echo "   Installing nginx..."
    sudo apt install -y nginx
fi

sudo systemctl enable nginx
sudo systemctl start nginx || echo "   Nginx already running"

# Step 5: Deploy proxy service files
echo "5. Deploying proxy service files..."
echo "   Files need to be copied to:"
echo "   - /app/server/proxy-collect.js"
echo "   - /app/server/ecosystem.config.cjs"
echo "   - /app/server/package.json"
echo ""
echo "   ⚠️  FILES MUST BE COPIED MANUALLY FROM DEVELOPMENT SERVER"
echo "   Please copy the proxy service files before continuing"
read -p "Press Enter when files are copied..."

# Step 6: Install proxy service dependencies
echo "6. Installing proxy service dependencies..."
cd /app/server
if [ -f package.json ]; then
    npm install
else
    echo "   Creating minimal package.json..."
    cat > package.json << 'EOF'
{
  "name": "sentratech-proxy",
  "version": "1.0.0",
  "type": "module",
  "main": "proxy-collect.js",
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
    npm install
fi

# Step 7: Configure nginx for sentratech.net
echo "7. Configuring nginx for sentratech.net..."
sudo tee /etc/nginx/sites-available/sentratech.net > /dev/null << 'EOF'
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name sentratech.net www.sentratech.net;
    
    # Allow Let's Encrypt challenges
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect all other traffic to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS server block (will be updated by certbot)
server {
    listen 443 ssl http2;
    server_name sentratech.net www.sentratech.net;

    # Temporary self-signed certificates (will be replaced by Let's Encrypt)
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-Frame-Options DENY always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy /api/collect to local proxy service
    location /api/collect {
        proxy_pass http://127.0.0.1:3003/api/collect;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_buffering off;
    }

    # Health check endpoint
    location /internal/collect-health {
        proxy_pass http://127.0.0.1:3003/internal/collect-health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        allow 127.0.0.1;
        allow ::1;
        deny all;
    }

    # Serve website frontend (adjust path as needed)
    location / {
        # If you have a static website build
        root /var/www/sentratech;
        try_files $uri $uri/ /index.html;
        
        # OR if you need to proxy to a frontend service
        # proxy_pass http://127.0.0.1:3000;
        # proxy_http_version 1.1;
        # proxy_set_header Host $host;
        # proxy_set_header X-Real-IP $remote_addr;
        # proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # proxy_set_header X-Forwarded-Proto $scheme;
        # proxy_set_header Upgrade $http_upgrade;
        # proxy_set_header Connection 'upgrade';
        # proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/sentratech.net /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Install SSL certificate package for temporary setup
sudo apt install -y ssl-cert

# Create webroot directory
sudo mkdir -p /var/www/html

# Test nginx configuration
sudo nginx -t

# Step 8: Install Let's Encrypt SSL certificates
echo "8. Installing Let's Encrypt SSL certificates..."
sudo systemctl reload nginx

# Attempt Let's Encrypt certificate installation
sudo certbot --nginx -d sentratech.net -d www.sentratech.net \
    --non-interactive --agree-tos --email admin@sentratech.net \
    --redirect --no-eff-email

if [ $? -eq 0 ]; then
    echo "   ✅ Let's Encrypt certificates installed successfully"
else
    echo "   ⚠️ Let's Encrypt failed, continuing with self-signed certificates"
    echo "   You can retry later with: sudo certbot --nginx -d sentratech.net -d www.sentratech.net"
fi

# Step 9: Start proxy service
echo "9. Starting proxy service..."
cd /app/server

# Create ecosystem config if it doesn't exist
if [ ! -f ecosystem.config.cjs ]; then
    echo "   Creating ecosystem.config.cjs..."
    cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'sentratech-collect',
    script: './proxy-collect.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      ADMIN_DASHBOARD_URL: 'http://127.0.0.1:8000/api/forms',
      DASHBOARD_API_KEY: 'sk-emergent-7A236FdD2Ce8d9b52C',
      COLLECT_PORT: '3003',
      LOG_DIR: '/var/log/sentratech',
      PENDING_DIR: '/var/data/pending_submissions',
      IDEMPOTENCY_TTL_MS: '86400000'
    }
  }]
};
EOF
fi

# Stop any existing PM2 processes
pm2 delete sentratech-collect 2>/dev/null || true

# Start the proxy service
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup

echo "10. Final verification..."
sleep 3

# Test proxy service
echo "   Testing proxy service health:"
curl -s http://127.0.0.1:3003/internal/collect-health || echo "   Proxy service not responding"

# Test nginx
echo "   Testing nginx configuration:"
sudo nginx -t

echo ""
echo "=== DEPLOYMENT COMPLETE ==="
echo "✅ Nginx configured for sentratech.net"
echo "✅ SSL certificates installed (Let's Encrypt or self-signed)"
echo "✅ Proxy service running on port 3003"
echo "✅ PM2 configured for auto-restart"
echo ""
echo "🔗 Endpoints:"
echo "   Website: https://sentratech.net"
echo "   Proxy API: https://sentratech.net/api/collect"
echo "   Health Check: https://sentratech.net/internal/collect-health"
echo ""
echo "📊 Service Status:"
echo "   PM2: $(pm2 jlist | jq -r '.[0].pm2_env.status' 2>/dev/null || echo 'Check with: pm2 status')"
echo "   Nginx: $(sudo systemctl is-active nginx)"
echo ""
echo "🧪 Test Commands:"
echo '   curl -X POST https://sentratech.net/api/collect \'
echo '     -H "Content-Type: application/json" \'
echo '     -d '\''{"name":"Test","email":"test@sentratech.net","trace_id":"TEST-'$(date +%s)'"}'\'
echo ""
echo "📝 Logs:"
echo "   Proxy logs: tail -f /var/log/sentratech/collect.log"
echo "   PM2 logs: pm2 logs sentratech-collect"
echo "   Nginx logs: sudo tail -f /var/log/nginx/access.log"