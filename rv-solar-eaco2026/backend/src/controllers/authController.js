/**
 * 认证控制器
 */
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { pgPool } = require('../config/database');
const { getRedis } = require('../config/database');
const { jwt: jwtConfig } = require('../config/secrets');
const { ERRORS } = require('../config/constants');

// 模拟验证码存储 (生产环境应使用Redis)
const verificationCodes = new Map();

/**
 * 发送验证码
 */
async function sendCode(req, res, next) {
  try {
    const { phone_code = '+86', phone_number } = req.body;
    
    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${phone_code}:${phone_number}`;
    
    // 存储验证码 (5分钟有效期)
    verificationCodes.set(key, {
      code,
      createdAt: Date.now(),
      expiresAt: Date.now() + 5 * 60 * 1000
    });
    
    // 模拟发送 (生产环境应调用短信服务商)
    console.log(`📱 验证码已发送至 ${phone_code}${phone_number}: ${code}`);
    
    res.json({
      code: 0,
      message: '验证码已发送',
      data: {
        expires_in: 300,
        // 测试环境返回验证码
        ...(process.env.NODE_ENV !== 'production' && { _test_code: code })
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 验证验证码并登录
 */
async function verifyCode(req, res, next) {
  try {
    const { phone_code = '+86', phone_number, code } = req.body;
    const key = `${phone_code}:${phone_number}`;
    
    // 验证验证码
    const stored = verificationCodes.get(key);
    
    if (!stored) {
      return res.status(400).json({
        code: ERRORS.INVALID_PARAMS,
        message: '验证码已过期，请重新获取'
      });
    }
    
    if (stored.code !== code) {
      return res.status(400).json({
        code: ERRORS.INVALID_PARAMS,
        message: '验证码错误'
      });
    }
    
    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(key);
      return res.status(400).json({
        code: ERRORS.INVALID_PARAMS,
        message: '验证码已过期'
      });
    }
    
    // 删除验证码
    verificationCodes.delete(key);
    
    // 查询或创建用户
    let userResult = await pgPool.query(
      'SELECT * FROM users WHERE phone_code = $1 AND phone_number = $2',
      [phone_code, phone_number]
    );
    
    let isNewUser = false;
    
    if (userResult.rows.length === 0) {
      // 创建新用户
      const walletAddress = 'Solana_' + uuidv4().replace(/-/g, '').substring(0, 44);
      
      userResult = await pgPool.query(`
        INSERT INTO users (phone_code, phone_number, wallet_address, created_at, last_active_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING *
      `, [phone_code, phone_number, walletAddress]);
      
      isNewUser = true;
    }
    
    const user = userResult.rows[0];
    
    // 生成Token
    const accessToken = jwt.sign(
      { userId: user.id, phone: user.phone_number },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiresIn }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id, type: 'refresh' },
      jwtConfig.secret,
      { expiresIn: jwtConfig.refreshExpiresIn }
    );
    
    res.json({
      code: 0,
      message: '登录成功',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 2592000,
        is_new_user: isNewUser,
        user: {
          id: user.id,
          phone_code: user.phone_code,
          phone_number: user.phone_number.substring(0, 3) + '****' + user.phone_number.substring(user.phone_number.length - 4),
          wallet_address: user.wallet_address,
          user_level: user.user_level
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 刷新Token
 */
async function refreshToken(req, res, next) {
  try {
    const { refresh_token } = req.body;
    
    const decoded = jwt.verify(refresh_token, jwtConfig.secret);
    
    if (decoded.type !== 'refresh') {
      return res.status(400).json({
        code: ERRORS.INVALID_PARAMS,
        message: '无效的刷新Token'
      });
    }
    
    const userResult = await pgPool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        code: ERRORS.USER_NOT_FOUND,
        message: '用户不存在'
      });
    }
    
    const user = userResult.rows[0];
    
    const newAccessToken = jwt.sign(
      { userId: user.id, phone: user.phone_number },
      jwtConfig.secret,
      { expiresIn: jwtConfig.accessExpiresIn }
    );
    
    res.json({
      code: 0,
      message: 'Token已刷新',
      data: {
        access_token: newAccessToken,
        expires_in: 2592000
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 退出登录
 */
async function logout(req, res, next) {
  try {
    res.json({
      code: 0,
      message: '退出成功'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendCode,
  verifyCode,
  refreshToken,
  logout
};