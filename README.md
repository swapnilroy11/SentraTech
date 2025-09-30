# SentraTech Unified Project

This unified project contains both the SentraTech public website and admin dashboard.

## Project Structure

```
/app
├── backend/              # Shared FastAPI backend (serves both apps)
├── website/             # Public website (sentratech.net)  
├── dashboard/           # Admin dashboard (admin.sentratech.net)
└── shared/             # Common components/utilities
```

## Applications

### 1. Website (Public) - sentratech.net
- **Location**: `/app/website/`
- **Purpose**: Public-facing marketing website
- **Features**: 
  - Landing page with hero section
  - ROI Calculator
  - Demo request forms
  - Contact sales forms
  - Newsletter signup
  - Job application forms
- **Port**: 3000 (development)
- **Tech Stack**: React 18, Tailwind CSS, React Router

### 2. Dashboard (Admin) - admin.sentratech.net  
- **Location**: `/app/dashboard/`
- **Purpose**: Admin panel for managing form submissions
- **Features**:
  - Dashboard overview with metrics
  - Demo Requests management
  - ROI Reports viewing
  - Contact Sales management
  - Newsletter Subscribers management
  - Active Contracts tracking
  - Talent Acquisition (Job Applications)
  - Settings and configuration
- **Port**: 3001 (development)
- **Tech Stack**: React 19, Radix UI, Tailwind CSS, React Hook Form, Zod

### 3. Backend (Shared) - API Server
- **Location**: `/app/backend/`
- **Purpose**: Unified API server for both applications
- **Features**:
  - Form submission endpoints
  - Dashboard data APIs
  - Authentication
  - Rate limiting and idempotency
  - MongoDB data storage
- **Port**: 8001
- **Tech Stack**: FastAPI, MongoDB, Python

## Development

### Running Locally

1. **Backend**: Already running via supervisor on port 8001
2. **Website**: Already running via supervisor on port 3000
3. **Dashboard**: To run separately: 
   ```bash
   cd /app/dashboard
   yarn start  # Runs on port 3001
   ```

### Environment Variables

**Website** (`.env`):
```
REACT_APP_BACKEND_URL=https://sentratech.net
REACT_APP_API_BASE=https://sentratech.net/api/proxy
```

**Dashboard** (`.env`):
```
REACT_APP_BACKEND_URL=https://admin.sentratech.net
REACT_APP_WS_URL=wss://admin.sentratech.net/ws
```

**Backend** (`.env`):
```
ADMIN_DASHBOARD_URL=https://admin.sentratech.net/api/forms
DASHBOARD_API_KEY=sk-emergent-7A236FdD2Ce8d9b52C
```

## Deployment Configuration

### Domain Setup
- **sentratech.net** → Website (public)
- **www.sentratech.net** → Website (public)  
- **admin.sentratech.net** → Dashboard (admin)

### DNS Configuration
Add these A records to your DNS:
```
@ → 34.57.15.54
www → 34.57.15.54
admin → 34.57.15.54
```

### CORS Configuration
Backend allows requests from:
- sentratech.net
- www.sentratech.net
- admin.sentratech.net
- Emergent preview domains

## API Endpoints

### Public API (for website)
- `/api/proxy/demo-request` - Submit demo requests
- `/api/proxy/contact-sales` - Submit contact sales
- `/api/proxy/newsletter-signup` - Newsletter signup
- `/api/proxy/roi-calculator` - Submit ROI reports
- `/api/proxy/job-application` - Submit job applications

### Dashboard API (for admin)
- `/api/forms/demo-requests` - Get demo requests
- `/api/forms/roi-reports` - Get ROI reports
- `/api/forms/contact-sales` - Get contact sales
- `/api/forms/newsletter-subscribers` - Get subscribers
- `/api/forms/job-applications` - Get job applications
- `/api/dashboard/stats` - Get dashboard statistics
- `/api/auth/login` - Dashboard login
- `/api/auth/refresh` - Token refresh

## Authentication

**Dashboard Login**:
- Email: `admin@sentratech.net`
- Password: `sentratech2025`

## Form Submission Features

- **Client-side debouncing** (3-10 seconds per form type)
- **Server-side idempotency** (60-second duplicate prevention)
- **Rate limiting** and error handling
- **Local MongoDB backup** for all submissions
- **Real-time dashboard updates**

## Next Steps

1. **Deploy both applications** to their respective domains
2. **Configure SSL certificates** for all domains
3. **Test end-to-end flow**: Website forms → Backend → Dashboard display
4. **Set up proper authentication** (replace hardcoded credentials)
5. **Add WebSocket support** for real-time dashboard updates

## Benefits of Unified Structure

✅ **Single codebase** for both applications  
✅ **Shared backend** reduces maintenance  
✅ **Consistent data flow** from website to dashboard  
✅ **Easy to manage** with one deployment process  
✅ **Code reusability** between projects  
✅ **Unified development workflow**
