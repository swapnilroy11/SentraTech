#!/bin/bash
set -e

# SentraTech Complete Deployment Script
# This script handles the complete deployment process
# Run with: sudo bash deploy.sh

echo "🚀 SentraTech Proxy Service - Complete Deployment"
echo "=================================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo bash deploy.sh"
    exit 1
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DEPLOY_DIR="$( dirname "$SCRIPT_DIR" )"

echo "📁 Deployment package directory: $DEPLOY_DIR"
echo ""

# Check if all required files exist
REQUIRED_FILES=(
    "$DEPLOY_DIR/backend/server.py"
    "$DEPLOY_DIR/backend/requirements.txt"
    "$DEPLOY_DIR/config/.env.template"
    "$DEPLOY_DIR/config/nginx-sentratech.conf"
    "$DEPLOY_DIR/config/sentratech-proxy.service"
    "$SCRIPT_DIR/install.sh"
    "$SCRIPT_DIR/setup-ssl.sh"
)

echo "🔍 Checking required files..."
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        exit 1
    fi
    echo "✅ Found: $(basename $file)"
done
echo ""

# Prompt for configuration
echo "📝 Configuration Setup"
echo "====================="
echo ""

read -p "🔑 Enter your Dashboard API Key: " DASHBOARD_API_KEY
if [ -z "$DASHBOARD_API_KEY" ]; then
    echo "❌ Dashboard API Key is required"
    exit 1
fi

read -p "📧 Enter your email for SSL certificates: " SSL_EMAIL
if [ -z "$SSL_EMAIL" ]; then
    echo "❌ Email address is required for SSL certificates"
    exit 1
fi

echo ""
read -p "🌐 Enter the admin dashboard URL [https://admin.sentratech.net/api]: " ADMIN_DASHBOARD_URL
ADMIN_DASHBOARD_URL=${ADMIN_DASHBOARD_URL:-"https://admin.sentratech.net/api"}

echo ""
echo "📋 Configuration Summary:"
echo "========================"
echo "Dashboard API Key: ${DASHBOARD_API_KEY:0:12}..."
echo "SSL Email: $SSL_EMAIL"
echo "Admin Dashboard: $ADMIN_DASHBOARD_URL"
echo ""

read -p "Continue with deployment? (Y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

echo ""
echo "🔧 Step 1: System Installation"
echo "==============================="

# Run installation script
cd "$SCRIPT_DIR"
bash install.sh

echo ""
echo "⚙️  Step 2: Service Configuration"
echo "================================="

INSTALL_DIR="/opt/sentratech-proxy"

# Configure environment file
echo "📝 Configuring environment variables..."
sed -i "s/your-dashboard-api-key-here/$DASHBOARD_API_KEY/" "$INSTALL_DIR/.env"
sed -i "s|https://admin.sentratech.net/api|$ADMIN_DASHBOARD_URL|" "$INSTALL_DIR/.env"

echo "✅ Environment configured"

echo ""
echo "🚀 Step 3: Service Startup"
echo "=========================="

# Start the proxy service
echo "🔄 Starting SentraTech proxy service..."
systemctl start sentratech-proxy

# Wait a moment for startup
sleep 3

# Check service status
if systemctl is-active --quiet sentratech-proxy; then
    echo "✅ SentraTech proxy service is running"
else
    echo "❌ Failed to start SentraTech proxy service"
    echo "📄 Service logs:"
    journalctl -u sentratech-proxy --no-pager -n 20
    exit 1
fi

echo ""
echo "🧪 Step 4: Testing Backend"
echo "=========================="

# Test health endpoint
echo "🔍 Testing health endpoint..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/health || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed (HTTP $HEALTH_CHECK)"
    echo "📄 Service logs:"
    journalctl -u sentratech-proxy --no-pager -n 10
    exit 1
fi

# Test collect endpoint
echo "🔍 Testing collect endpoint..."
COLLECT_TEST=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"test": true, "trace_id": "deploy-test-'$(date +%s)'"}' \
    -o /dev/null -w "%{http_code}" \
    http://localhost:8001/api/collect || echo "000")

if [ "$COLLECT_TEST" = "200" ] || [ "$COLLECT_TEST" = "502" ]; then
    echo "✅ Collect endpoint responding (HTTP $COLLECT_TEST)"
    echo "   Note: 502 is expected if dashboard is not accessible yet"
else
    echo "❌ Collect endpoint test failed (HTTP $COLLECT_TEST)"
    exit 1
fi

echo ""
echo "🌐 Step 5: Nginx & SSL Configuration"
echo "===================================="

# Setup SSL certificates
echo "🔐 Setting up SSL certificates..."
echo "$SSL_EMAIL" | bash setup-ssl.sh

echo ""
echo "✅ Step 6: Final Testing"
echo "========================"

# Test HTTPS endpoint
echo "🔍 Testing HTTPS endpoints..."
sleep 5

HTTPS_HEALTH=$(curl -s -k -o /dev/null -w "%{http_code}" https://sentratech.net/api/health 2>/dev/null || echo "000")
if [ "$HTTPS_HEALTH" = "200" ]; then
    echo "✅ HTTPS health check passed"
else
    echo "⚠️  HTTPS health check: HTTP $HTTPS_HEALTH (may be expected if DNS not configured yet)"
fi

HTTPS_COLLECT=$(curl -s -k -X POST -H "Content-Type: application/json" \
    -d '{"test": true, "trace_id": "deploy-https-test-'$(date +%s)'"}' \
    -o /dev/null -w "%{http_code}" \
    https://sentratech.net/api/collect 2>/dev/null || echo "000")

if [ "$HTTPS_COLLECT" = "200" ] || [ "$HTTPS_COLLECT" = "502" ]; then
    echo "✅ HTTPS collect endpoint responding (HTTP $HTTPS_COLLECT)"
else
    echo "⚠️  HTTPS collect test: HTTP $HTTPS_COLLECT (may be expected if DNS not configured yet)"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "======================================"
echo ""
echo "📊 Service Status:"
echo "  • Backend Service: $(systemctl is-active sentratech-proxy)"
echo "  • Nginx Service: $(systemctl is-active nginx)"
echo "  • MongoDB Service: $(systemctl is-active mongod)"
echo ""
echo "🌐 Endpoints:"
echo "  • Health: https://sentratech.net/api/health"
echo "  • Collect: https://sentratech.net/api/collect"
echo "  • Local Health: http://localhost:8001/api/health"
echo ""
echo "📁 Important Paths:"
echo "  • Service Directory: /opt/sentratech-proxy"
echo "  • Environment File: /opt/sentratech-proxy/.env"
echo "  • Logs Directory: /var/log/sentratech/"
echo "  • Pending Submissions: /var/data/pending_submissions/"
echo ""
echo "📋 Management Commands:"
echo "  • View Service Status: systemctl status sentratech-proxy"
echo "  • View Logs: journalctl -u sentratech-proxy -f"
echo "  • View Collect Logs: tail -f /var/log/sentratech/collect.log"
echo "  • Restart Service: systemctl restart sentratech-proxy"
echo "  • Check SSL: certbot certificates"
echo ""
echo "🧪 Test Command:"
echo "  curl -X POST https://sentratech.net/api/collect \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"name\": \"Test User\", \"email\": \"test@example.com\"}'"
echo ""

# Final DNS check
echo "🔍 DNS Configuration Check:"
CURRENT_IP=$(curl -s -4 ifconfig.me 2>/dev/null || echo "unknown")
DOMAIN_IP=$(dig +short sentratech.net 2>/dev/null | tail -n1 || echo "unknown")

echo "  • Server IP: $CURRENT_IP"
echo "  • Domain IP: $DOMAIN_IP"

if [ "$CURRENT_IP" = "$DOMAIN_IP" ] && [ "$CURRENT_IP" != "unknown" ]; then
    echo "  • ✅ DNS is correctly configured"
else
    echo "  • ⚠️  DNS may need configuration - point sentratech.net to $CURRENT_IP"
fi

echo ""
echo "🚀 Your SentraTech proxy service is now ready for production!"