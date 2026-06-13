/**
 * 用户控制器
 */
const { pool } = require('../config/database');
const { SolanaService } = require('../services/solanaService');

// 获取用户信息
async function getUserProfile(req, res) {
  try {
    const userId = req.user.user_id;

    const [user] = await pool.query(
      'SELECT id, phone_code, phone_number, level, kyc_status, created_at, wallet_address, total_energy_kwh, total_rewards FROM users WHERE id = $1',
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({ code: 20001, message: '用户不存在' });
    }

    // 获取链上余额
    const balance = await SolanaService.getTokenBalance(user[0].wallet_address);

    // 获取统计数据
    const [stats] = await pool.query(
      `SELECT
        COUNT(*) FILTER (WHERE status = 'completed') as total_charging_sessions,
        COALESCE(SUM(energy_kwh) FILTER (WHERE status = 'completed'), 0) as total_energy_kwh,
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'paid') as completed_bookings
       FROM charging_sessions WHERE user_id = $1`,
      [userId]
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        user_id: user[0].id,
        phone_mask: `${user[0].phone_code}-${user[0].phone_number.slice(0, 3)}****${user[0].phone_number.slice(-4)}`,
        level: user[0].level,
        kyc_status: user[0].kyc_status,
        wallet_address: user[0].wallet_address,
        eaco_balance: balance,
        stats: {
          total_charging_sessions: parseInt(stats[0].total_charging_sessions) || 0,
          total_energy_kwh: parseFloat(stats[0].total_energy_kwh) || 0,
          total_bookings: parseInt(stats[0].total_bookings) || 0,
          completed_bookings: parseInt(stats[0].completed_bookings) || 0,
        },
        created_at: user[0].created_at,
      },
    });
  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 更新钱包地址
async function updateWalletAddress(req, res) {
  try {
    const userId = req.user.user_id;
    const { wallet_address, signature } = req.body;

    if (!wallet_address || !signature) {
      return res.status(400).json({ code: 10001, message: '参数不完整' });
    }

    await pool.query(
      'UPDATE users SET wallet_address = $1, updated_at = NOW() WHERE id = $2',
      [wallet_address, userId]
    );

    res.json({
      code: 0,
      message: '钱包地址已更新',
      data: { wallet_address },
    });
  } catch (error) {
    console.error('更新钱包地址失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取碳积分账户
async function getCarbonAccount(req, res) {
  try {
    const userId = req.user.user_id;

    const [account] = await pool.query(
      'SELECT * FROM carbon_accounts WHERE user_id = $1',
      [userId]
    );

    if (account.length === 0) {
      const [newAccount] = await pool.query(
        `INSERT INTO carbon_accounts (user_id, total_co2_kg, available_co2_kg, redeemed_co2_kg)
         VALUES ($1, 0, 0, 0) RETURNING *`,
        [userId]
      );
      return res.json({
        code: 0,
        message: 'success',
        data: {
          total_co2_kg: 0,
          available_co2_kg: 0,
          redeemed_co2_kg: 0,
          carbon_nft_count: 0,
          rank: '🌱 环保新手',
        },
      });
    }

    const [rankResult] = await pool.query(
      `SELECT COUNT(*) + 1 as rank FROM carbon_accounts
       WHERE total_co2_kg > (SELECT total_co2_kg FROM carbon_accounts WHERE user_id = $1)`,
      [userId]
    );

    const [totalUsers] = await pool.query('SELECT COUNT(*) FROM carbon_accounts');

    res.json({
      code: 0,
      message: 'success',
      data: {
        total_co2_kg: parseFloat(account[0].total_co2_kg),
        available_co2_kg: parseFloat(account[0].available_co2_kg),
        redeemed_co2_kg: parseFloat(account[0].redeemed_co2_kg),
        carbon_nft_count: account[0].carbon_nft_count || 0,
        rank: `${rankResult[0].rank}/${totalUsers[0].count}`,
        rank_badge: getRankBadge(parseFloat(account[0].total_co2_kg)),
      },
    });
  } catch (error) {
    console.error('获取碳积分账户失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

function getRankBadge(co2Kg) {
  if (co2Kg >= 1000) return '🌍 地球守护者';
  if (co2Kg >= 500) return '🏔️ 碳中和先锋';
  if (co2Kg >= 100) return '🌲 绿能使者';
  if (co2Kg >= 50) return '🍃 低碳达人';
  if (co2Kg >= 10) return '🌿 环保卫士';
  return '🌱 环保新手';
}

// 获取用户订单列表
async function getUserOrders(req, res) {
  try {
    const userId = req.user.user_id;
    const { page = 1, page_size = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);

    let whereClause = ' WHERE o.user_id = $1 ';
    const params = [userId];

    if (status) {
      whereClause += ' AND o.status = $2 ';
      params.push(status);
    }

    params.push(parseInt(page_size), offset);

    const [orders] = await pool.query(
      `SELECT o.*, c.name as campsite_name, c.cover_image
       FROM orders o
       LEFT JOIN campsites c ON o.campsite_id = c.id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: orders.map((o) => ({
          order_id: o.order_id,
          campsite_name: o.campsite_name,
          cover_image: o.cover_image,
          check_in_date: o.check_in_date,
          check_out_date: o.check_out_date,
          nights: o.nights,
          total_price: parseFloat(o.total_price),
          status: o.status,
          created_at: o.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 取消订单
async function cancelOrder(req, res) {
  try {
    const userId = req.user.user_id;
    const { order_id, reason } = req.body;

    const [order] = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2 AND status = $3',
      [order_id, userId, 'pending']
    );

    if (order.length === 0) {
      return res.status(404).json({ code: 40001, message: '订单不存在或无法取消' });
    }

    await pool.query(
      'UPDATE orders SET status = $1, cancelled_at = NOW(), cancel_reason = $2 WHERE order_id = $3',
      ['cancelled', reason || '', order_id]
    );

    res.json({
      code: 0,
      message: '订单已取消',
      data: { order_id, status: 'cancelled' },
    });
  } catch (error) {
    console.error('取消订单失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getUserProfile,
  updateWalletAddress,
  getCarbonAccount,
  getUserOrders,
  cancelOrder,
};
