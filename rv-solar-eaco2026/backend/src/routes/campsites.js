/**
 * 营地路由
 */
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const campsiteController = require('../controllers/campsiteController');

// 营地列表
router.get('/', authMiddleware, campsiteController.getCampsites);

// 营地详情
router.get('/:id', authMiddleware, campsiteController.getCampsiteDetail);

// 营地车位状态
router.get('/:id/spots', authMiddleware, campsiteController.getCampsiteSpots);

// 附近营地
router.get('/nearby/list', authMiddleware, campsiteController.getNearbyCampsites);

module.exports = router;