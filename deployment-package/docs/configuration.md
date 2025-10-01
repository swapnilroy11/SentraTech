# SentraTech Configuration Reference

## Environment Configuration

### Core Settings

#### Database Configuration
```env
MONGO_URL=mongodb://localhost:27017/sentratech_forms
```
- **Description**: MongoDB connection string
- **Required**: Yes
- **Default**: mongodb://localhost:27017/sentratech_forms

#### Dashboard Integration
```env
ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api
DASHBOARD_API_KEY=your-dashboard-api-key-here
```
- **ADMIN_DASHBOARD_URL**: Base URL for the admin dashboard API
- **DASHBOARD_API_KEY**: Authentication key for dashboard access
- **Required**: Both required for form forwarding
- **Security**: API key should be kept secure and rotated regularly

#### CORS Configuration
```env
CORS_ORIGINS=https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net
```
- **Description**: Comma-separated list of allowed origins
- **Default**: Includes main domain and admin subdomain
- **Note**: Add additional domains as needed

### Performance Settings

#### Proxy Configuration
```env
PROXY_TIMEOUT=30000
PROXY_RETRIES=3
PROXY_BACKOFF=500
```
- **PROXY_TIMEOUT**: Maximum time to wait for dashboard response (ms)
- **PROXY_RETRIES**: Number of retry attempts on failure
- **PROXY_BACKOFF**: Initial backoff delay between retries (ms)

#### Idempotency Settings
```env
IDEMPOTENCY_WINDOW=86400000
```
- **Description**: Time window for duplicate detection (ms)
- **Default**: 24 hours (86400000 ms)
- **Purpose**: Prevents duplicate form submissions

### Optional Settings

#### Logging Configuration
```env
LOG_LEVEL=INFO
```
- **Description**: Logging level for the application
- **Options**: DEBUG, INFO, WARNING, ERROR
- **Default**: INFO

#### Worker Configuration
```env
WORKERS=1
MAX_REQUESTS=1000
```
- **WORKERS**: Number of worker processes
- **MAX_REQUESTS**: Requests per worker before restart
- **Recommendation**: Start with 1 worker, increase for high traffic

## Service Configuration

### systemd Service File
Location: `/etc/systemd/system/sentratech-proxy.service`

```ini
[Unit]
Description=SentraTech Proxy Service
After=network.target mongod.service
Wants=network.target

[Service]
Type=simple
User=sentratech
Group=sentratech
WorkingDirectory=/opt/sentratech-proxy
Environment=PATH=/opt/sentratech-proxy/venv/bin
EnvironmentFile=/opt/sentratech-proxy/.env
ExecStart=/opt/sentratech-proxy/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001 --workers 1
ExecReload=/bin/kill -HUP $MAINPID
RestartSec=5
Restart=always
KillMode=mixed
TimeoutStopSec=30

# Security settings
NoNewPrivileges=yes
PrivateTmp=yes
PrivateDevices=yes
ProtectHome=yes
ProtectSystem=strict
ReadWritePaths=/var/log/sentratech /var/data/pending_submissions /opt/sentratech-proxy

# Resource limits
LimitNOFILE=65535
LimitNPROC=4096

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=sentratech-proxy

[Install]
WantedBy=multi-user.target
```

### Key Service Configuration Points

#### Security Settings
- **NoNewPrivileges**: Prevents privilege escalation
- **PrivateTmp**: Isolated temporary directory
- **ProtectSystem**: Read-only system directories
- **ReadWritePaths**: Specific writable directories

#### Resource Limits
- **LimitNOFILE**: Maximum open files (65535)
- **LimitNPROC**: Maximum processes (4096)

## Nginx Configuration

### Main Site Configuration
Location: `/etc/nginx/sites-available/sentratech.net`

#### SSL Settings
```nginx
ssl_certificate /etc/letsencrypt/live/sentratech.net/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/sentratech.net/privkey.pem;
include /etc/letsencrypt/options-ssl-nginx.conf;
ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
```

#### Security Headers
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

#### Proxy Configuration
```nginx
location /api/collect {
    proxy_pass http://127.0.0.1:8001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    proxy_connect_timeout 30s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
}
```

## API Configuration

### Endpoint Routing

The `/api/collect` endpoint automatically routes form submissions based on payload content:

#### Auto-Detection Rules
1. **Contact Sales**: Has `company`, `companyName`, or `work_email` fields
2. **Job Application**: Has `position` or `fullName` fields  
3. **Demo Request**: Has `demo_request` field or both `company` and `name`
4. **Newsletter**: Default for email-only submissions

#### Explicit Routing
Add `form_type` field to payload for explicit routing:
```json
{
  "form_type": "contact-sales",
  "name": "John Doe",
  "email": "john@company.com"
}
```

### Authentication Headers

The proxy sends dual authentication headers for compatibility:
```
X-INGEST-KEY: your-dashboard-api-key
Authorization: Bearer your-dashboard-api-key
```

### Payload Enrichment

All submissions are automatically enriched with:
- `trace_id`: Unique identifier for idempotency
- `received_at`: ISO timestamp of receipt
- `client_ip`: Client IP address (respects X-Forwarded-For)
- `user_agent`: Client user agent string
- `src`: Always "site-proxy" for identification

## Directory Structure

### Service Directories
```
/opt/sentratech-proxy/          # Main application
├── server.py                   # FastAPI application
├── requirements.txt            # Python dependencies
├── .env                       # Environment configuration
└── venv/                      # Python virtual environment

/var/log/sentratech/           # Log files
├── collect.log                # Structured JSON logs

/var/data/pending_submissions/ # Failed submission storage
├── {timestamp}_{trace_id}.json # Failed submissions for replay
```

### File Permissions
```bash
/opt/sentratech-proxy/         # sentratech:sentratech 755
/opt/sentratech-proxy/.env     # sentratech:sentratech 600
/var/log/sentratech/           # sentratech:sentratech 755
/var/data/pending_submissions/ # sentratech:sentratech 755
```

## Monitoring Configuration

### Log Formats

#### Service Logs (systemd)
```
2025-01-15 10:30:45 - uvicorn.access - INFO - 127.0.0.1:58432 - "POST /api/collect HTTP/1.1" 200
```

#### Collect Logs (JSON format)
```json
{
  "ts": "2025-01-15T10:30:45.123Z",
  "trace_id": "trace-1642248645123-abc123def",
  "client_ip": "192.168.1.100",
  "endpoint": "https://admin.sentratech.net/api/forms/contact-sales",
  "payload_summary": {
    "name": "John Doe",
    "email": "john@company.com"
  },
  "upstream_status": 200,
  "upstream_body": "{\"success\": true, \"id\": \"sub_123\"}"
}
```

### Health Monitoring Endpoints

#### Local Health Check
```bash
curl http://localhost:8001/api/health
```

#### Public Health Check
```bash
curl https://sentratech.net/api/health
```

Response format:
```json
{
  "status": "healthy",
  "service": "sentratech-proxy", 
  "version": "1.0.0",
  "timestamp": "2025-01-15T10:30:45.123Z"
}
```

## Backup Configuration

### Automated Backups (Recommended)

#### Database Backup Script
```bash
#!/bin/bash
# /opt/sentratech-proxy/backup-db.sh
BACKUP_DIR="/var/backups/sentratech"
mkdir -p $BACKUP_DIR
mongodump --db sentratech_forms --out $BACKUP_DIR/$(date +%Y%m%d_%H%M%S)
# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

#### Crontab Entry
```bash
# Daily backup at 2 AM
0 2 * * * /opt/sentratech-proxy/backup-db.sh
```

### Configuration Backup
```bash
# Backup critical configuration files
tar -czf /var/backups/sentratech-config-$(date +%Y%m%d).tar.gz \
  /opt/sentratech-proxy/.env \
  /etc/nginx/sites-available/sentratech.net \
  /etc/systemd/system/sentratech-proxy.service
```

## Security Configuration

### SSL/TLS Configuration

#### Let's Encrypt Auto-Renewal
```bash
# Check renewal status
certbot certificates

# Manual renewal test
certbot renew --dry-run

# Crontab entry (automatically added)
0 12 * * * /usr/bin/certbot renew --quiet
```

#### SSL Security Testing
```bash
# Test SSL configuration
curl -I https://sentratech.net
openssl s_client -connect sentratech.net:443 -servername sentratech.net
```

### Firewall Configuration
```bash
# View current rules
ufw status numbered

# Required rules
ufw allow ssh
ufw allow 'Nginx Full'
ufw allow 27017  # MongoDB (local only)
```

### API Key Management

#### Key Rotation Process
1. Generate new API key in dashboard
2. Update `.env` file: `DASHBOARD_API_KEY=new-key`
3. Restart service: `systemctl restart sentratech-proxy`
4. Test functionality
5. Deactivate old key in dashboard

#### Key Security Best Practices
- Never commit keys to version control
- Use environment variables only
- Set restrictive file permissions (600)
- Rotate keys quarterly
- Monitor key usage in logs

This configuration reference provides all necessary settings for a production deployment of the SentraTech proxy service.