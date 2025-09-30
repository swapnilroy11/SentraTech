// Enterprise-Grade Emergent Configuration for SentraTech
// Unified deployment for sentratech.net and admin.sentratech.net

module.exports = {
  // Multi-site monorepo configuration
  sites: [
    {
      name: 'website',
      root: 'website/',
      buildCommand: 'npm run build',
      domains: ['sentratech.net', 'www.sentratech.net'],
      outputDirectory: 'build/',
      environment: 'production',
      envVars: {
        REACT_APP_API_BASE: 'https://sentratech.net/api/proxy',
        REACT_APP_WS_URL: 'wss://admin.sentratech.net/ws',
        REACT_APP_DOMAIN: 'sentratech.net',
        REACT_APP_SITE_MODE: 'public'
      }
    },
    {
      name: 'dashboard',
      root: 'dashboard/',
      buildCommand: 'npm run build',
      domains: ['admin.sentratech.net'],
      outputDirectory: 'build/',
      environment: 'production',
      envVars: {
        REACT_APP_API_BASE: 'https://admin.sentratech.net/api/forms',
        REACT_APP_WS_URL: 'wss://admin.sentratech.net/ws',
        REACT_APP_DASHBOARD_MODE: 'admin',
        REACT_APP_API_VERSION: 'v1'
      }
    }
  ],

  // Backend service configuration
  backend: {
    root: 'backend/',
    port: 8001,
    environment: 'production',
    envVars: {
      // Global API key injection from secure secrets
      EMERGENT_API_KEY: '${EMERGENT_API_KEY}',
      
      // Database configuration
      MONGO_URL: '${MONGO_URL}',
      
      // Domain configuration
      ADMIN_DASHBOARD_URL: 'https://admin.sentratech.net/api/forms',
      CORS_ORIGINS: 'https://sentratech.net,https://www.sentratech.net,https://admin.sentratech.net',
      
      // WebSocket configuration  
      WS_PORT: 8002,
      WS_HEARTBEAT_INTERVAL: 30000,
      WS_MAX_RETRIES: 3,
      
      // Proxy configuration
      PROXY_TIMEOUT: 10000,
      PROXY_RETRIES: 3,
      PROXY_BACKOFF: 500,
      IDEMPOTENCY_WINDOW: 120000 // 2 minutes
    }
  },

  // SSL and domain configuration
  ssl: {
    enabled: true,
    provider: 'letsencrypt',
    domains: ['sentratech.net', 'www.sentratech.net', 'admin.sentratech.net'],
    autoRenewal: true
  },

  // Health checks and monitoring
  healthChecks: [
    {
      name: 'website',
      url: 'https://sentratech.net/health',
      interval: 60,
      timeout: 10
    },
    {
      name: 'dashboard',
      url: 'https://admin.sentratech.net/api/health',
      interval: 60,
      timeout: 10
    },
    {
      name: 'websocket',
      url: 'wss://admin.sentratech.net/ws/health',
      interval: 60,
      timeout: 10
    }
  ],

  // Deployment configuration
  deployment: {
    strategy: 'rolling',
    maxUnavailable: 0,
    healthCheckTimeout: 120,
    smokeTests: true,
    notifications: {
      onSuccess: ['admin@sentratech.net'],
      onFailure: ['admin@sentratech.net']
    }
  }
};