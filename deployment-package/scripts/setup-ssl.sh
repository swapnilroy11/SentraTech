#!/bin/bash
set -e

# SentraTech SSL Certificate Setup Script
# Run after install.sh: sudo bash setup-ssl.sh

echo "🔐 Setting up SSL certificates for SentraTech..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash setup-ssl.sh"
    exit 1
fi

DOMAIN="sentratech.net"
NGINX_SITES_DIR="/etc/nginx/sites-available"
NGINX_ENABLED_DIR="/etc/nginx/sites-enabled"

echo "📧 Please enter your email address for Let's Encrypt notifications:"
read -p "Email: " LETSENCRYPT_EMAIL

if [ -z "$LETSENCRYPT_EMAIL" ]; then
    echo "❌ Email address is required for Let's Encrypt"
    exit 1
fi

echo "🌐 Configuring Nginx..."

# Enable the site (temporarily without SSL for Let's Encrypt validation)
# Create a temporary HTTP-only configuration
cat > $NGINX_SITES_DIR/sentratech.net.temp << 'EOF'
server {
    listen 80;
    server_name sentratech.net www.sentratech.net;

    # Root document root
    root /var/www/sentratech.net;
    index index.html index.htm;

    # Allow Let's Encrypt validation
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
        allow all;
    }

    # Main website files
    location / {
        try_files $uri $uri/ =404;
    }

    # API Collect Proxy - Forward to FastAPI backend
    location /api/collect {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        access_log off;
    }
}
EOF

# Create certbot directory
mkdir -p /var/www/certbot

# Remove existing enabled site
rm -f $NGINX_ENABLED_DIR/sentratech.net
rm -f $NGINX_ENABLED_DIR/default

# Enable temporary configuration
ln -sf $NGINX_SITES_DIR/sentratech.net.temp $NGINX_ENABLED_DIR/sentratech.net

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

echo "🔍 Testing HTTP access..."
sleep 2

# Test if the domain is accessible
if curl -s -o /dev/null -w "%{http_code}" http://sentratech.net | grep -q "200\|404"; then
    echo "✅ Domain is accessible via HTTP"
else
    echo "⚠️  Warning: Domain may not be pointing to this server yet"
    echo "   Make sure DNS is configured to point sentratech.net to this server's IP"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Aborted. Please configure DNS first."
        exit 1
    fi
fi

echo "📜 Obtaining SSL certificate..."

# Request SSL certificate from Let's Encrypt
certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $LETSENCRYPT_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d sentratech.net \
    -d www.sentratech.net

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate obtained successfully!"
    
    # Now enable the full HTTPS configuration
    rm -f $NGINX_ENABLED_DIR/sentratech.net
    ln -sf $NGINX_SITES_DIR/sentratech.net $NGINX_ENABLED_DIR/sentratech.net
    
    # Test configuration
    nginx -t
    
    # Restart Nginx with SSL configuration
    systemctl restart nginx
    
    echo "🔄 Setting up automatic renewal..."
    
    # Add certbot renewal to crontab
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    
    echo ""
    echo "🎉 SSL setup completed successfully!"
    echo ""
    echo "✅ Your site is now accessible at:"
    echo "   https://sentratech.net"
    echo "   https://www.sentratech.net"
    echo ""
    echo "🔄 Certificate auto-renewal is configured"
    echo ""
    echo "🧪 Test your SSL setup:"
    echo "   curl -I https://sentratech.net/api/health"
    echo ""
    echo "📊 Check certificate status:"
    echo "   certbot certificates"
    echo ""
    
else
    echo "❌ Failed to obtain SSL certificate"
    echo "Please check:"
    echo "1. DNS is pointing sentratech.net to this server"
    echo "2. Port 80 is accessible from the internet"
    echo "3. No other web server is running on port 80"
    exit 1
fi

# Clean up temporary configuration
rm -f $NGINX_SITES_DIR/sentratech.net.temp

echo "🧹 Cleanup completed"