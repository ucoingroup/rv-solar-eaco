/**
 * 充电路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const chargingController = require('../controllers/chargingController');

// 开始充电
router.post('/start',
  authMiddleware,
  [
    body('charger_id').isString().notEmpty().withMessage('充电桩ID不能为空')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  chargingController.startCharging
);

// 当前充电状态
router.get('/current', authMiddleware, chargingController.getCurrentCharging);

// 停止充电
router.post('/stop',
  authMiddleware,
  [
    body('charging_id').isUUID().withMessage('充电记录ID格式错误')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  chargingController.stopCharging
);

// 充电历史
router.get('/history', authMiddleware, chargingController.getChargingHistory);

// 提交充电数据供预言机验证
router.post('/verify', authMiddleware, chargingController.verifyCharging);

// 验证状态查询
router.get('/verify-status', authMiddleware, chargingController.getVerifyStatus);

module.exports = router;