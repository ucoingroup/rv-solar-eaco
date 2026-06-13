/**
 * 路由入口
 */
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const campsiteRoutes = require('./campsites');
const orderRoutes = require('./orders');
const chargingRoutes = require('./charging');
const paymentRoutes = require('./payments');
const communityRoutes = require('./community');
const p2pRoutes = require('./p2p');
const portRoutes = require('./ports');

// 认证模块
router.use('/auth', authRoutes);

// 用户模块
router.use('/users', userRoutes);

// 营地模块
router.use('/campsites', campsiteRoutes);

// 口岸模块
router.use('/ports', portRoutes);

// 订单模块
router.use('/orders', orderRoutes);

// 充电模块
router.use('/charging', chargingRoutes);

// 支付模块
router.use('/payments', paymentRoutes);

// 社区模块
router.use('/community', communityRoutes);

// P2P能源模块
router.use('/p2p', p2pRoutes);

module.exports = router;