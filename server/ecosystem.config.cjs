module.exports = {
  apps: [
    {
      name: 'sentra-collect',
      script: './proxy-collect.js',
      env: {
        NODE_ENV: 'production',
        ADMIN_DASHBOARD_URL: 'https://admin.sentratech.net/api/forms',
        DASHBOARD_API_KEY: 'sk-emergent-7A236FdD2Ce8d9b52C',
        LOG_DIR: '/var/log/sentratech',
        PENDING_DIR: '/var/data/pending_submissions',
        COLLECT_PORT: 3002,
        IDEMPOTENCY_TTL_MS: 86400000
      }
    }
  ]
};