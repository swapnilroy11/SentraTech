#!/usr/bin/env bash
# SentraTech Deployment Rollback Script

echo "=== SentraTech Rollback Script ==="

# Restore nginx configuration
echo "Restoring nginx configuration..."
sudo cp /etc/nginx/sites-available/sentratech.net.bak /etc/nginx/sites-available/sentratech.net
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Nginx configuration restored"

# Restore backend environment
echo "Restoring backend environment..."
sudo cp /app/backend/.env.bak /app/backend/.env
echo "✅ Backend environment restored"

# Restore PM2 configuration  
echo "Restoring PM2 configuration..."
sudo cp /app/server/ecosystem.config.cjs.bak /app/server/ecosystem.config.cjs
pm2 restart sentra-collect-prod 2>/dev/null || echo "PM2 process not running"
echo "✅ PM2 configuration restored"

# Stop proxy service
echo "Stopping proxy service..."
pkill -f proxy-collect || echo "No proxy process running"
pm2 delete all 2>/dev/null || echo "No PM2 processes to delete"

echo "=== Rollback Complete ==="
echo "Services have been restored to previous configuration"
echo "Verify with: curl -s http://127.0.0.1:8001/health || echo 'Check service status'"