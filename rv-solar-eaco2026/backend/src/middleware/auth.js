/**
 * 认证中间件
 */
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('../config/secrets');
const { pgPool } = require('../config/database');
const { ERRORS } = require('../config/constants');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        code: ERRORS.TOKEN_EXPIRED,
        message: '未提供认证Token'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    // 查询用户
    const result = await pgPool.query(
      'SELECT id, phone_code, phone_number, nickname, wallet_address, user_level, language, kyc_status, kyc_level FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        code: ERRORS.USER_NOT_FOUND,
        message: '用户不存在'
      });
    }

    req.user = result.rows[0];
    req.userId = decoded.userId;

    // 更新最后活跃时间
    await pgPool.query(
      'UPDATE users SET last_active_at = NOW() WHERE id = $1',
      [decoded.userId]
    );

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: ERRORS.TOKEN_EXPIRED,
        message: 'Token已过期，请重新登录'
      });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        code: ERRORS.TOKEN_EXPIRED,
        message: 'Token无效'
      });
    }
    next(error);
  }
}

module.exports = { authMiddleware };