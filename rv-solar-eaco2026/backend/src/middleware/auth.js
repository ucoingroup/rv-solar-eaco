/**
 * 认证中间件
 */
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ code: 10003, message: '未提供认证Token' });
    }

    const token = authHeader.slice(7);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production'
    );

    if (decoded.type !== 'access' && !decoded.phone_number) {
      return res.status(401).json({ code: 10003, message: 'Token无效' });
    }

    req.user = {
      user_id: decoded.user_id,
      phone_code: decoded.phone_code,
      phone_number: decoded.phone_number,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ code: 10003, message: 'Token已过期，请刷新' });
    }
    return res.status(401).json({ code: 10003, message: 'Token无效' });
  }
}

// 可选认证（不强制登录）
function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production'
      );
      req.user = { user_id: decoded.user_id };
    }
  } catch (err) {
    // 忽略错误，继续
  }
  next();
}

module.exports = { authMiddleware, optionalAuth };
