/**
 * 社区控制器
 */
const { pgPool } = require('../config/database');
const { ERRORS, CONTRIBUTION_TYPES, CONTRIBUTION_REWARDS } = require('../config/constants');

/**
 * 提交贡献
 */
async function submitContribution(req, res, next) {
  try {
    const { type, content, location_text, location_lat, location_lng, images = [], port_id } = req.body;
    
    // 计算奖励
    const rewardRange = CONTRIBUTION_REWARDS[type] || { min: 500, max: 1000 };
    const estimatedReward = Math.floor(Math.random() * (rewardRange.max - rewardRange.min) + rewardRange.min);
    
    const result = await pgPool.query(`
      INSERT INTO contributions (
        user_id, type, content, location_text, location_lat, location_lng,
        images, port_id, status, reward_eaco, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',$9,NOW())
      RETURNING *
    `, [req.userId, type, content, location_text, location_lat, location_lng, JSON.stringify(images), port_id, estimatedReward]);
    
    const contribution = result.rows[0];
    
    res.json({
      code: 0,
      message: '贡献已提交，等待审核',
      data: {
        contribution_id: contribution.id,
        type,
        status: 'pending',
        estimated_reward: estimatedReward,
        note: '审核通过后奖励将发放到您的钱包'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取贡献列表
 */
async function getContributions(req, res, next) {
  try {
    const { type, status, port_id, page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    
    let whereClause = '1=1';
    const values = [];
    let paramCount = 1;
    
    if (type) {
      whereClause += ` AND c.type = $${paramCount++}`;
      values.push(type);
    }
    
    if (status) {
      whereClause += ` AND c.status = $${paramCount++}`;
      values.push(status);
    }
    
    if (port_id) {
      whereClause += ` AND c.port_id = $${paramCount++}`;
      values.push(port_id);
    }
    
    values.push(parseInt(page_size), offset);
    
    const result = await pgPool.query(`
      SELECT c.*, u.nickname, p.name as port_name
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      LEFT JOIN port_crossings p ON c.port_id = p.id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `, values);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: result.rows.length,
        page: parseInt(page),
        page_size: parseInt(page_size),
        contributions: result.rows.map(row => ({
          id: row.id,
          type: row.type,
          content: row.content,
          location_text: row.location_text,
          images: row.images || [],
          port_name: row.port_name,
          status: row.status,
          reward_eaco: row.reward_eaco,
          upvote_count: row.upvote_count,
          nickname: row.nickname,
          created_at: row.created_at
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取贡献详情
 */
async function getContributionDetail(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(`
      SELECT c.*, u.nickname
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 40001,
        message: '贡献不存在'
      });
    }
    
    const row = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: row.id,
        type: row.type,
        content: row.content,
        location_text: row.location_text,
        images: row.images || [],
        status: row.status,
        reward_eaco: row.reward_eaco,
        upvote_count: row.upvote_count,
        nickname: row.nickname,
        created_at: row.created_at,
        reviewed_at: row.reviewed_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 点赞
 */
async function upvoteContribution(req, res, next) {
  try {
    const { id } = req.params;
    
    await pgPool.query(
      'UPDATE contributions SET upvote_count = upvote_count + 1 WHERE id = $1',
      [id]
    );
    
    res.json({
      code: 0,
      message: '点赞成功'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 绿电排行榜
 */
async function getEnergyLeaderboard(req, res, next) {
  try {
    const { period = 'all', limit = 20 } = req.query;
    
    let dateFilter = '';
    if (period === 'week') {
      dateFilter = "AND r.created_at > NOW() - INTERVAL '7 days'";
    } else if (period === 'month') {
      dateFilter = "AND r.created_at > NOW() - INTERVAL '30 days'";
    }
    
    const result = await pgPool.query(`
      SELECT u.id, u.nickname, u.avatar_url, SUM(r.energy_kwh) as total_energy
      FROM green_energy_records r
      JOIN users u ON r.user_id = u.id
      WHERE r.verified = true ${dateFilter}
      GROUP BY u.id
      ORDER BY total_energy DESC
      LIMIT $1
    `, [parseInt(limit)]);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        period,
        leaderboard: result.rows.map((row, index) => ({
          rank: index + 1,
          user_id: row.id,
          nickname: row.nickname || 'Anonymous',
          avatar_url: row.avatar_url,
          total_energy_kwh: parseFloat(row.total_energy) / 1000
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 贡献排行榜
 */
async function getContribLeaderboard(req, res, next) {
  try {
    const { limit = 20 } = req.query;
    
    const result = await pgPool.query(`
      SELECT u.id, u.nickname, u.avatar_url, COUNT(c.id) as total_contrib
      FROM contributions c
      JOIN users u ON c.user_id = u.id
      WHERE c.status = 'approved'
      GROUP BY u.id
      ORDER BY total_contrib DESC
      LIMIT $1
    `, [parseInt(limit)]);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        leaderboard: result.rows.map((row, index) => ({
          rank: index + 1,
          user_id: row.id,
          nickname: row.nickname || 'Anonymous',
          avatar_url: row.avatar_url,
          total_contributions: parseInt(row.total_contrib)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 申请大使
 */
async function applyAmbassador(req, res, next) {
  try {
    const { port_id } = req.body;
    
    const existing = await pgPool.query(
      'SELECT id FROM ambassadors WHERE user_id = $1 AND port_id = $2',
      [req.userId, port_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: 40001,
        message: '您已申请过此口岸的大使'
      });
    }
    
    await pgPool.query(`
      INSERT INTO ambassadors (user_id, port_id, status, applied_at)
      VALUES ($1, $2, 'pending', NOW())
    `, [req.userId, port_id]);
    
    res.json({
      code: 0,
      message: '大使申请已提交，请等待审核'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取我的大使状态
 */
async function getMyAmbassadorStatus(req, res, next) {
  try {
    const result = await pgPool.query(`
      SELECT a.*, p.name as port_name
      FROM ambassadors a
      JOIN port_crossings p ON a.port_id = p.id
      WHERE a.user_id = $1
    `, [req.userId]);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        ambassadors: result.rows.map(row => ({
          id: row.id,
          port_id: row.port_id,
          port_name: row.port_name,
          level: row.level,
          status: row.status,
          applied_at: row.applied_at,
          total_referrals: row.total_referrals,
          total_rewards_eaco: row.total_rewards_eaco
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitContribution,
  getContributions,
  getContributionDetail,
  upvoteContribution,
  getEnergyLeaderboard,
  getContribLeaderboard,
  applyAmbassador,
  getMyAmbassadorStatus
};