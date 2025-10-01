# SentraTech Production Proxy Deployment Package

## Overview
This deployment package contains the complete, production-ready FastAPI proxy service with the `/api/collect` endpoint and all required configurations for deployment on the production server at `34.57.15.54`.

## Features Included
- **Robust Same-Origin Proxy**: `/api/collect` endpoint for all form submissions
- **Idempotency**: 24-hour duplicate prevention using trace_id
- **Retry Logic**: 3 retries with exponential backoff (500ms, 1.5s, 4.5s)
- **Comprehensive Logging**: Structured JSON logs to `/var/log/sentratech/collect.log`
- **Payload Enrichment**: Adds `received_at`, `client_ip`, `user_agent`, `src`
- **Fallback Persistence**: Failed submissions stored to `/var/data/pending_submissions/`
- **Dual Authentication**: Both `X-INGEST-KEY` and `Authorization: Bearer` headers
- **CORS Support**: Configured for sentratech.net domains

## Directory Structure
```
deployment-package/
├── README.md                    # This file
├── backend/                     # FastAPI application
│   ├── server.py               # Main FastAPI server with /api/collect
│   ├── cache_manager.py        # Performance optimization
│   ├── dashboard_config.py     # Dashboard configuration
│   ├── enterprise_proxy.py     # Enterprise proxy functionality
│   ├── websocket_service.py    # WebSocket support
│   └── requirements.txt        # Python dependencies
├── config/
│   ├── .env.template          # Environment variables template
│   ├── nginx-sentratech.conf   # Nginx site configuration
│   └── sentratech-proxy.service # systemd service file
├── scripts/
│   ├── install.sh             # Installation script
│   ├── setup-ssl.sh           # SSL certificate setup
│   └── deploy.sh              # Complete deployment script
└── docs/
    ├── deployment-guide.md     # Detailed deployment instructions
    ├── configuration.md        # Configuration reference
    └── troubleshooting.md      # Common issues and solutions
```

## Quick Start
1. Copy this entire package to the production server (34.57.15.54)
2. Run: `sudo bash scripts/deploy.sh`
3. Follow the prompts for configuration
4. Test the deployment: `curl -X POST https://sentratech.net/api/collect -d '{"test": true}'`

## Support
- All code is production-tested and ready
- Comprehensive logging for debugging
- Fallback mechanisms for reliability
- Complete documentation included

---
**Target Server**: 34.57.15.54 (sentratech.net production)
**Domain**: sentratech.net → /api/collect
**Dashboard**: admin.sentratech.net
**Version**: 1.0.0-production-ready