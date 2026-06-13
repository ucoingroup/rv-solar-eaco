/**
 * 支付路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const paymentController = require('../controllers/paymentController');

// 创建支付意图
router.post('/create-intent',
  authMiddleware,
  [
    body('order_id').isUUID().withMessage('订单ID格式错误'),
    body('payment_token').isIn(['EACO', 'USDT', 'USDC', 'SOL', 'WBNB']).withMessage('不支持的支付代币')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  paymentController.createIntent
);

// 执行支付
router.post('/execute',
  authMiddleware,
  [
    body('order_id').isUUID().withMessage('订单ID格式错误'),
    body('payment_token').isIn(['EACO', 'USDT', 'USDC', 'SOL', 'WBNB']).withMessage('不支持的支付代币')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  paymentController.executePayment
);

// 支付状态查询
router.get('/:id', authMiddleware, paymentController.getPaymentStatus);

// 申请退款
router.post('/:id/refund', authMiddleware, paymentController.refundPayment);

// 支持的支付代币列表
router.get('/tokens/list', paymentController.getSupportedTokens);

// 获取实时汇率
router.get('/exchange-rate', paymentController.getExchangeRate);

module.exports = router;