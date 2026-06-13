/**
 * 认证路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// 发送验证码
router.post('/send-code',
  [
    body('phone_code').optional().isString().trim(),
    body('phone_number').isString().isLength({ min: 7, max: 20 }).trim()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  authController.sendCode
);

// 验证验证码登录
router.post('/verify-code',
  [
    body('phone_code').optional().isString().trim(),
    body('phone_number').isString().isLength({ min: 7, max: 20 }).trim(),
    body('code').isString().isLength({ min: 4, max: 6 }).trim()
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  authController.verifyCode
);

// 刷新Token
router.post('/refresh-token', authMiddleware, authController.refreshToken);

// 退出登录
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;