/**
 * 用户路由
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const userController = require('../controllers/userController');

// 获取当前用户信息
router.get('/me', authMiddleware, userController.getMe);

// 更新用户资料
router.put('/me', authMiddleware, userController.updateMe);

// 获取用户钱包信息
router.get('/me/wallet', authMiddleware, userController.getWallet);

// 创建新钱包
router.post('/me/wallet/create', authMiddleware, userController.createWallet);

// 获取绿电记录
router.get('/me/energy-records', authMiddleware, userController.getEnergyRecords);

// 获取碳积分账户
router.get('/me/carbon-account', authMiddleware, userController.getCarbonAccount);

// 获取持有的NFT
router.get('/me/nfts', authMiddleware, userController.getNFTs);

module.exports = router;