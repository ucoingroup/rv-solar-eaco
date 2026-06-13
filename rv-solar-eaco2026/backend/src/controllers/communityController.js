/**
 * 社区控制器
 */
const { pool } = require('../config/database');

// 获取贡献列表
async function getContributions(req, res) {
  try {
    const { page = 1, page_size = 20, type, port_id } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);

    let whereClause = ' WHERE 1=1 ';
    const params = [];
    let paramCount = 0;

    if (type) {
      paramCount++;
      whereClause += ` AND c.type = $${paramCount}`;
      params.push(type);
    }
    if (port_id) {
      paramCount++;
      whereClause += ` AND c.port_id = $${paramCount}`;
      params.push(port_id);
    }

    paramCount++;
    params.push(parseInt(page_size));
    paramCount++;
    params.push(offset);

    const [rows] = await pool.query(
      `SELECT c.*, u.phone_mask, u.level as user_level,
              (SELECT COUNT(*) FROM contribution_votes cv WHERE cv.contribution_id = c.id) as upvotes
       FROM contributions c
       LEFT JOIN users u ON c.user_id = u.id
       ${whereClause}
       ORDER BY c.upvotes DESC, c.created_at DESC
       LIMIT $${paramCount - 1} OFFSET $${paramCount}`,
      params
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: rows.map((c) => ({
          id: c.id,
          type: c.type,
          title: c.title,
          content: c.content,
          images: c.images ? JSON.parse(c.images) : [],
          port_id: c.port_id,
          user_mask: c.phone_mask,
          user_level: c.user_level,
          upvotes: parseInt(c.upvotes) || 0,
          has_upvoted: false, // 需要根据当前用户判断
          created_at: c.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('获取贡献列表失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 发布贡献
async function createContribution(req, res) {
  try {
    const userId = req.user.user_id;
    const { type, title, content, images, port_id, location_lat, location_lng } = req.body;

    const { CONTRIBUTION_REWARDS } = require('../config/constants');
    const rewardRange = CONTRIBUTION_REWARDS[type] || { min: 500, max: 1000 };
    const reward = Math.floor(rewardRange.min + Math.random() * (rewardRange.max - rewardRange.min));

    const [result] = await pool.query(
      `INSERT INTO contributions (user_id, type, title, content, images, port_id,
        location_lat, location_lng, reward_amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [userId, type, title, content, images ? JSON.stringify(images) : '[]',
       port_id, location_lat || null, location_lng || null, reward]
    );

    // 发放 EACO 奖励（链上）
    const { SolanaService } = require('../services/solanaService');
    const rewardResult = await SolanaService.submitOnChainTransaction('contribution_reward', {
      user_id: userId,
      contribution_id: result.id,
      reward_amount: reward,
    });

    res.json({
      code: 0,
      message: '发布成功',
      data: {
        id: result.id,
        reward_amount: reward,
        reward_tx: rewardResult.txHash,
      },
    });
  } catch (error) {
    console.error('发布贡献失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 给贡献点赞
async function upvoteContribution(req, res) {
  try {
    const userId = req.user.user_id;
    const { contribution_id } = req.params;

    // 检查是否已点赞
    const [existing] = await pool.query(
      'SELECT * FROM contribution_votes WHERE user_id = $1 AND contribution_id = $2',
      [userId, contribution_id]
    );

    if (existing.length > 0) {
      // 取消点赞
      await pool.query(
        'DELETE FROM contribution_votes WHERE user_id = $1 AND contribution_id = $2',
        [userId, contribution_id]
      );
      await pool.query(
        'UPDATE contributions SET upvotes = upvotes - 1 WHERE id = $1',
        [contribution_id]
      );
      return res.json({ code: 0, message: '已取消点赞', data: { upvoted: false } });
    }

    // 添加点赞
    await pool.query(
      'INSERT INTO contribution_votes (user_id, contribution_id) VALUES ($1, $2)',
      [userId, contribution_id]
    );
    await pool.query(
      'UPDATE contributions SET upvotes = upvotes + 1 WHERE id = $1',
      [contribution_id]
    );

    res.json({ code: 0, message: '点赞成功', data: { upvoted: true } });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取排行
async function getLeaderboard(req, res) {
  try {
    const { period = 'all', limit = 20 } = req.query;

    let dateFilter = '';
    if (period === 'monthly') {
      dateFilter = " AND created_at >= DATE_TRUNC('month', NOW()) ";
    } else if (period === 'weekly') {
      dateFilter = " AND created_at >= DATE_TRUNC('week', NOW()) ";
    }

    const [rows] = await pool.query(
      `SELECT c.user_id, u.phone_mask, u.level,
              COUNT(*) as contributions,
              SUM(c.reward_amount) as total_rewards
       FROM contributions c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE 1=1 ${dateFilter}
       GROUP BY c.user_id, u.phone_mask, u.level
       ORDER BY total_rewards DESC
       LIMIT $1`,
      [parseInt(limit)]
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        period,
        list: rows.map((r, index) => ({
          rank: index + 1,
          user_mask: r.phone_mask,
          level: r.level,
          contributions: parseInt(r.contributions),
          total_rewards: parseFloat(r.total_rewards) || 0,
          badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`,
        })),
      },
    });
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getContributions,
  createContribution,
  upvoteContribution,
  getLeaderboard,
};
