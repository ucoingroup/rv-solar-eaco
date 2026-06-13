/**
 * P2P能源路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const p2pController = require('../controllers/p2pController');

// 挂牌出售
router.post('/listings',
  authMiddleware,
  [
    body('energy_kwh').isInt({ min: 100 }).withMessage('挂牌电量至少100Wh'),
    body('price_eaco_per_kwh').isInt({ min: 1 }).withMessage('单价至少1')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  p2pController.createListing
);

// 挂牌列表
router.get('/listings', authMiddleware, p2pController.getListings);

// 挂牌详情
router.get('/listings/:id', authMiddleware, p2pController.getListingDetail);

// 购买电力
router.post('/listings/:id/buy',
  authMiddleware,
  [
    body('energy_kwh').isInt({ min: 100 }).withMessage('购买电量至少100Wh')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  p2pController.buyEnergy
);

// 撤销挂牌
router.delete('/listings/:id', authMiddleware, p2pController.cancelListing);

module.exports = router;