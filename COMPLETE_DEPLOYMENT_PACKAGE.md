# 🚀 Complete Production Deployment Package

## Files to Transfer to Production Server (34.57.15.54)

### 1. Proxy Service Files
```bash
# Copy these files to /app/server/ on production server
```

**proxy-collect.js** (Node.js proxy service)
**ecosystem.config.cjs** (PM2 configuration)

### 2. Nginx Configuration
```bash
# Copy to /etc/nginx/sites-available/ on production server
```

**sentratech.net.conf** (Production nginx config)

### 3. Deployment Scripts
```bash
# Copy to /app/ on production server
```

**verify-deploy.sh** (Verification script)
**production-deploy.sh** (One-command deployment)

## One-Command Production Deployment

Run this single command on server 34.57.15.54:

```bash
curl -fsSL https://raw.githubusercontent.com/[deployment-repo]/main/deploy.sh | sudo bash
```

Or manually:

```bash
# 1. Install dependencies
sudo apt update && sudo apt install -y certbot python3-certbot-nginx nodejs npm

# 2. Install PM2
npm install -g pm2

# 3. Set up directories
mkdir -p /app/server /var/log/sentratech /var/data/pending_submissions

# 4. Deploy files (copy proxy-collect.js, ecosystem.config.cjs, nginx config)

# 5. Install SSL certificates
sudo certbot --nginx -d sentratech.net -d www.sentratech.net

# 6. Start services
pm2 start /app/server/ecosystem.config.cjs
sudo nginx -t && sudo systemctl reload nginx

# 7. Verify deployment
export DASHBOARD_API_KEY="sk-emergent-7A236FdD2Ce8d9b52C"
/app/verify-deploy.sh
```

## Complete File Contents Below...