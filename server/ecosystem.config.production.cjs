module.exports = {
  apps: [{
    name: 'sentratech-collect',
    script: './proxy-collect.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      ADMIN_DASHBOARD_URL: 'https://admin.sentratech.net/api/forms',
      DASHBOARD_API_KEY: 'sk-emergent-7A236FdD2Ce8d9b52C',
      COLLECT_PORT: '3003',
      LOG_DIR: '/var/log/sentratech',
      PENDING_DIR: '/var/data/pending_submissions',
      IDEMPOTENCY_TTL_MS: '86400000'
    },
    error_file: '/var/log/sentratech/pm2-error.log',
    out_file: '/var/log/sentratech/pm2-out.log',
    log_file: '/var/log/sentratech/pm2-combined.log',
    time: true
  }]
};