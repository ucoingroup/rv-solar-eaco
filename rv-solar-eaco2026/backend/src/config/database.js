/**
 * 数据库配置
 */
const { Pool } = require('pg');
const redis = require('redis');

// PostgreSQL连接池
const pgPool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432'),
  database: process.env.PG_DATABASE || 'rv_solar_eaco',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Redis客户端
let redisClient = null;

async function initRedis() {
  redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
  });
  
  redisClient.on('connect', () => {
    console.log('✅ Redis connected');
  });
  
  await redisClient.connect();
  return redisClient;
}

function getRedis() {
  return redisClient;
}

module.exports = {
  pgPool,
  initRedis,
  getRedis
};