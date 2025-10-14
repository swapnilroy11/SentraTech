# SentraTech Production Deployment Commands

## Quick Deployment Summary
**Target**: Production Server 35.57.15.54 → https://sentratech.net/
**Changes**: Strategic Advisor - Taufiq Ahamed Emon Added

## Pre-Deployment Checklist
- [x] Development verification complete
- [x] Image file uploaded (233KB)
- [x] Code changes implemented
- [x] Functionality tested in preview

---

## Option 1: Git-Based Deployment (Recommended)

### If using automated CI/CD:
```bash
# Commit all changes
git add .
git commit -m "feat: Add Taufiq Ahamed Emon as Strategic Advisor with photo"
git push origin main

# Deploy will trigger automatically
```

### If using manual git deployment:
```bash
# On production server (35.57.15.54)
cd /path/to/sentratech-website
git pull origin main
npm install  # if new dependencies
npm run build
sudo systemctl restart nginx  # or your web server
```

---

## Option 2: Direct File Transfer

### Files to transfer:
```bash
# Transfer these files to production:
scp /app/frontend/src/pages/InvestorRelationsPage.js user@35.57.15.54:/path/to/production/frontend/src/pages/
scp /app/frontend/public/images/advisors/taufiq-ahamed-emon.jpg user@35.57.15.54:/path/to/production/frontend/public/images/advisors/

# Then on production server:
cd /path/to/production
npm run build
sudo systemctl restart web-server
```

---

## Option 3: Docker Deployment

### If using Docker:
```bash
# Rebuild and deploy container
docker build -t sentratech-app .
docker stop sentratech-container
docker rm sentratech-container
docker run -d --name sentratech-container -p 80:3000 sentratech-app
```

---

## Option 4: Emergency Manual Update

### If quick fix needed on production:
```bash
# SSH to production server
ssh user@35.57.15.54

# Navigate to production directory
cd /var/www/sentratech  # adjust path as needed

# Backup current files
cp src/pages/InvestorRelationsPage.js src/pages/InvestorRelationsPage.js.backup

# Upload new files (use your preferred method)
# - SCP, SFTP, or direct edit
# - Download image from: https://customer-assets.emergentagent.com/job_tech-site-boost/artifacts/36jmosrv_IMG_4343.jpg

# Restart services
sudo systemctl restart nginx
sudo systemctl restart node  # if using Node.js server
```

---

## Verification Commands

### After deployment, run these to verify:
```bash
# Check if files are in place
ls -la /path/to/production/public/images/advisors/taufiq-ahamed-emon.jpg

# Check web server status
sudo systemctl status nginx

# Test the endpoint
curl -I https://sentratech.net/investor-relations

# Check for the content
curl -s https://sentratech.net/investor-relations | grep "Taufiq Ahamed Emon"
```

---

## Rollback Commands (Emergency)

### If issues occur:
```bash
# Restore backup
cp src/pages/InvestorRelationsPage.js.backup src/pages/InvestorRelationsPage.js

# Remove new image
rm public/images/advisors/taufiq-ahamed-emon.jpg

# Rebuild and restart
npm run build
sudo systemctl restart nginx
```

---

## Notes:
- Replace `/path/to/production` with actual production path
- Replace `user` with actual SSH username
- Adjust service names based on your setup (nginx, apache, etc.)
- Always backup before deployment