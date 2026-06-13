/**
 * 口岸路由
 */
const express = require('express');
const router = express.Router();
const portController = require('../controllers/portController');

// 口岸列表
router.get('/', portController.getPorts);

// 口岸详情
router.get('/:id', portController.getPortDetail);

module.exports = router;