#!/bin/bash

# SentraTech Production Deployment Script
# Deploy performance optimizations and Investor Relations updates to 35.57.15.54

echo "🚀 Deploying SentraTech updates to production server (35.57.15.54)"
echo "================================================================="

# Check if running on correct server
CURRENT_IP=$(curl -s ifconfig.me)
echo "Current server IP: $CURRENT_IP"

if [ "$CURRENT_IP" != "35.57.15.54" ]; then
    echo "⚠️  WARNING: Not running on production server (35.57.15.54)"
    echo "   Current server: $CURRENT_IP"
    echo "   This script should be run ON the production server"
    echo ""
    echo "📋 To deploy to production:"
    echo "   1. Copy this entire deployment package to 35.57.15.54"
    echo "   2. SSH to the production server: ssh user@35.57.15.54"
    echo "   3. Run this script on the production server"
    echo ""
    exit 1
fi

echo "✅ Running on production server - proceeding with deployment"

# Backup current files
echo ""
echo "📄 Creating backup of current files..."
BACKUP_DIR="/tmp/sentratech-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Assuming the app is in /opt/sentratech or similar - adjust path as needed
APP_DIR="/opt/sentratech"  # Update this path to match your actual app directory

if [ ! -d "$APP_DIR" ]; then
    echo "❌ Application directory not found: $APP_DIR"
    echo "   Please update APP_DIR variable in this script to match your setup"
    exit 1
fi

# Backup files
cp "$APP_DIR/frontend/src/pages/ROICalculatorPage.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/components/ROICalculatorRedesigned.js" "$BACKUP_DIR/" 2>/dev/null  
cp "$APP_DIR/frontend/src/pages/InvestorRelationsPage.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/pages/HomePage.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/components/Navigation.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/components/ContactSalesSlideIn.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/components/CookieBanner.jsx" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/App.js" "$BACKUP_DIR/" 2>/dev/null
cp "$APP_DIR/frontend/src/index.css" "$BACKUP_DIR/" 2>/dev/null

echo "✅ Backup created: $BACKUP_DIR"

# Deploy new files
echo ""
echo "📂 Deploying updated files..."

# Copy the updated files to production server (35.57.15.54)
cp ROICalculatorPage.js "$APP_DIR/frontend/src/pages/"
cp ROICalculatorRedesigned.js "$APP_DIR/frontend/src/components/"  
cp InvestorRelationsPage.js "$APP_DIR/frontend/src/pages/"
cp JobApplicationPage.js "$APP_DIR/frontend/src/pages/"
cp LeadershipTeamPage.js "$APP_DIR/frontend/src/pages/"
cp HomePage.js "$APP_DIR/frontend/src/pages/"
cp Navigation.js "$APP_DIR/frontend/src/components/"
cp ContactSalesSlideIn.js "$APP_DIR/frontend/src/components/"
cp Footer.js "$APP_DIR/frontend/src/components/"
cp CookieBanner.jsx "$APP_DIR/frontend/src/components/"
cp App.js "$APP_DIR/frontend/src/"
cp dashboardConfig.js "$APP_DIR/frontend/src/config/"
cp index.css "$APP_DIR/frontend/src/"

echo "✅ Files deployed successfully"

# Restart services
echo ""
echo "🔄 Restarting services..."

# Check if supervisorctl is available
if command -v supervisorctl &> /dev/null; then
    sudo supervisorctl restart frontend backend
    echo "✅ Services restarted via supervisorctl"
elif systemctl is-active --quiet sentratech-frontend; then
    sudo systemctl restart sentratech-frontend sentratech-backend
    echo "✅ Services restarted via systemctl"
else
    echo "⚠️  Please restart your application services manually"
fi

# Wait for services to start
echo ""
echo "⏳ Waiting for services to start..."
sleep 5

# Test the deployment
echo ""
echo "🧪 Testing deployment..."

# Test if the site is responding
if curl -s -o /dev/null -w "%{http_code}" https://sentratech.net/ | grep -q "200"; then
    echo "✅ Site is responding correctly"
else
    echo "⚠️  Site may not be responding - please check manually"
fi

# Verify changes
echo ""
echo "🔍 Verification steps:"
echo "   1. Visit https://sentratech.net/roi-calculator"
echo "      - Scroll through the page and verify smooth performance"
echo "      - Test the 'Why Calculate ROI with SentraTech?' benefits section"
echo ""
echo "   2. Visit https://sentratech.net/investor-relations"  
echo "      - Verify funding amount shows '$80,000' (not $2.5M)"
echo "      - Verify timeline shows 'Q1 2026' (not Q1 2025)"
echo "      - Verify only 'Schedule Product Demo' button is visible"
echo ""
echo "   3. Test cookie modal functionality"
echo "      - Clear browser data and visit https://sentratech.net/"
echo "      - Verify cookie consent modal appears"
echo ""

echo "🎉 Deployment completed!"
echo ""
echo "📋 Deployment summary:"
echo "   ✅ ROI Calculator performance optimizations deployed"
echo "   ✅ Investor Relations funding updates deployed" 
echo "   ✅ Services restarted"
echo "   📁 Backup available at: $BACKUP_DIR"
echo ""
echo "🔍 If issues occur, restore from backup:"
echo "   cp $BACKUP_DIR/* $APP_DIR/frontend/src/[appropriate-directories]/"
echo "   sudo supervisorctl restart frontend backend"