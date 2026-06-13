/**
 * 社区路由
 */
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middleware/auth');
const communityController = require('../controllers/communityController');

// 提交贡献
router.post('/contributions',
  authMiddleware,
  [
    body('type').isIn(['road_condition', 'camp_info', 'rescue', 'device_tip', 'review', 'photo_share']).withMessage('贡献类型错误'),
    body('content').isString().isLength({ min: 10, max: 2000 }).withMessage('内容长度10-2000字')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  communityController.submitContribution
);

// 贡献列表
router.get('/contributions', authMiddleware, communityController.getContributions);

// 贡献详情
router.get('/contributions/:id', authMiddleware, communityController.getContributionDetail);

// 点赞
router.post('/contributions/:id/upvote', authMiddleware, communityController.upvoteContribution);

// 绿电排行榜
router.get('/leaderboard/energy', communityController.getEnergyLeaderboard);

// 贡献排行榜
router.get('/leaderboard/contrib', communityController.getContribLeaderboard);

// 大使申请
router.post('/ambassadors/apply',
  authMiddleware,
  [
    body('port_id').isUUID().withMessage('口岸ID格式错误')
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 10001, message: '参数错误', details: errors.array() });
    }
    next();
  },
  communityController.applyAmbassador
);

// 我的大使状态
router.get('/ambassadors/me', authMiddleware, communityController.getMyAmbassadorStatus);

module.exports = router;