/**
 * 认证控制器
 */
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { RedisClient } = require('../services/websocket');

// 模拟验证码存储（生产环境用Redis）
const verificationCodes = new Map();

// 发送验证码
async function sendCode(req, res) {
  try {
    const { phone_code = '86', phone_number } = req.body;

    // 生成6位验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `${phone_code}:${phone_number}`;

    // 存储验证码（5分钟有效）
    verificationCodes.set(key, {
      code,
      expiresAt: Date.now() + 5 * 60 * 1000,
      attempts: 0,
    });

    // 模拟发送（生产环境接入短信服务商）
    console.log(`[SMS Mock] 发送验证码 ${code} 到 +${phone_code} ${phone_number}`);

    res.json({
      code: 0,
      message: '验证码已发送',
      data: {
        expires_in: 300,
        phone_mask: phone_number.slice(0, 3) + '****' + phone_number.slice(-4),
      },
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 验证验证码登录
async function verifyCode(req, res) {
  try {
    const { phone_code = '86', phone_number, code } = req.body;
    const key = `${phone_code}:${phone_number}`;

    const stored = verificationCodes.get(key);

    if (!stored) {
      return res.status(400).json({ code: 10001, message: '请先获取验证码' });
    }

    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(key);
      return res.status(400).json({ code: 10002, message: '验证码已过期' });
    }

    if (stored.attempts >= 3) {
      verificationCodes.delete(key);
      return res.status(400).json({ code: 10003, message: '验证次数超限，请重新获取' });
    }

    if (stored.code !== code) {
      stored.attempts++;
      return res.status(400).json({ code: 10004, message: '验证码错误' });
    }

    // 验证成功
    verificationCodes.delete(key);

    // 生成 JWT Token
    const userId = uuidv4();
    const accessToken = jwt.sign(
      { user_id: userId, phone_number, phone_code },
      process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production',
      { expiresIn: '30d' }
    );
    const refreshToken = jwt.sign(
      { user_id: userId, type: 'refresh' },
      process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production',
      { expiresIn: '90d' }
    );

    res.json({
      code: 0,
      message: '登录成功',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'Bearer',
        expires_in: 30 * 24 * 60 * 60,
        user: {
          user_id: userId,
          phone_code,
          phone_number,
          phone_mask: phone_number.slice(0, 3) + '****' + phone_number.slice(-4),
          level: 1,
          kyc_status: 'none',
          created_at: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('验证登录失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 刷新Token
async function refreshToken(req, res) {
  try {
    const { refresh_token } = req.body;

    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production');

    const newAccessToken = jwt.sign(
      { user_id: decoded.user_id, type: 'access' },
      process.env.JWT_SECRET || 'rv-solar-secret-key-change-in-production',
      { expiresIn: '30d' }
    );

    res.json({
      code: 0,
      message: '刷新成功',
      data: {
        access_token: newAccessToken,
        expires_in: 30 * 24 * 60 * 60,
      },
    });
  } catch (error) {
    res.status(401).json({ code: 10003, message: 'Token无效或已过期' });
  }
}

// 退出登录
async function logout(req, res) {
  try {
    // 如果使用Redis，可以在这里将token加入黑名单
    res.json({
      code: 0,
      message: '退出成功',
    });
  } catch (error) {
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  sendCode,
  verifyCode,
  refreshToken,
  logout,
};
