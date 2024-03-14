module.exports = {
  apps: [
    {
      env: {
        NODE_ENV: 'dev'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      name: process.env.MALL_APP_NAME,
      port: '8888',
      script: './.output/server/index.mjs',
      watch: false,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      min_uptime: '60s',
      max_restarts: 30,
      autorestart: true,
      restart_delay: 60,
      exec_mode: 'cluster',
      instances: 'max'
    }
  ]
}
