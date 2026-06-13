/**
 * PM2 进程管理配置
 * 使用: pm2 start ecosystem.config.js
 */
module.exports = {
  apps: [{
    name: 'rv-solar-eaco-api',
    script: 'src/index.js',
    instances: process.env.NODE_ENV === 'production' ? 2 : 1,
    exec_mode: 'cluster',
    watch: process.env.NODE_ENV !== 'production',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
    max_memory_restart: '512M',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
  }],
};
