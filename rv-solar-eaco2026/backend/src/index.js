/**
 * RV Solar EACO - Backend API Server
 * 主入口文件
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const winston = require('winston');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');
const { WebSocketService } = require('./services/websocket');

// Logger配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

const app = express();
const server = http.createServer(app);

// Socket.IO 配置
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST']
  }
});

// 挂载io到app
app.set('io', io);

// 限流配置
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 100, // 100次请求
  message: { code: 10001, message: '请求过于频繁，请稍后再试' }
});

// 中间件
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(limiter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req, res) => {
  res.json({ status: 'ready' });
});

// API路由
app.use('/v1', routes);

// WebSocket路由
WebSocketService(io);

// 错误处理
app.use(errorHandler);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 40400,
    message: '接口不存在',
    path: req.path
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`🚀 RV Solar EACO API Server started on port ${PORT}`);
  logger.info(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = { app, server, io, logger };