/**
 * 统一错误处理中间件
 */
const { ERRORS } = require('../config/constants');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // JWT错误
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      code: ERRORS.TOKEN_EXPIRED,
      message: err.message === 'jwt expired' ? 'Token已过期' : 'Token无效',
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  // 自定义业务错误
  if (err.code && err.message) {
    return res.status(err.status || 400).json({
      code: err.code,
      message: err.message,
      details: err.details,
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  // 数据库错误
  if (err.code === '23505') { // 唯一约束
    return res.status(409).json({
      code: 40900,
      message: '资源已存在',
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  if (err.code === '23503') { // 外键约束
    return res.status(400).json({
      code: 40000,
      message: '关联资源不存在',
      timestamp: Math.floor(Date.now() / 1000)
    });
  }

  // 未知错误
  res.status(500).json({
    code: 50000,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    timestamp: Math.floor(Date.now() / 1000)
  });
}

module.exports = { errorHandler };