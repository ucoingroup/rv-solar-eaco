/**
 * 订单路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// 创建订单
router.post('/',
  authMiddleware,
  [
    body('campsite_id').isUUID().withMessage('营地ID格式错误'),
    body('check_in_date').isISO8601().withMessage('入住日期格式错误'),
    body('check_out_date').isISO8601().withMessage('离店日期格式错误'),
    body('spot_type').isIn(['rv', 'tent', 'parking']).withMessage('车位类型错误')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  orderController.createOrder
);

// 订单列表
router.get('/', authMiddleware, orderController.getOrders);

// 订单详情
router.get('/:id', authMiddleware, orderController.getOrderDetail);

// 取消订单
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

// 评价订单
router.post('/:id/rate',
  authMiddleware,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('评分范围1-5'),
    body('comment').optional().isString().isLength({ max: 500 }).withMessage('评论最多500字')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  orderController.rateOrder
);

module.exports = router;