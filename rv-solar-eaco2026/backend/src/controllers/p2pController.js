/**
 * P2P 控制器
 */
const { pool } = require('../config/database');

// 获取 P2P 挂单列表
async function getOrders(req, res) {
  try {
    const { side, payment_token = 'USDT', page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);

    let whereClause = ` WHERE po.status = 'active' AND po.payment_token = $1 `;
    const params = [payment_token];

    if (side) {
      params.push(side);
      whereClause += ` AND po.side = $${params.length}`;
    }

    params.push(parseInt(page_size), offset);

    const [rows] = await pool.query(
      `SELECT po.*, u.phone_mask, u.level as user_level
       FROM p2p_orders po
       LEFT JOIN users u ON po.user_id = u.id
       ${whereClause}
       ORDER BY po.created_at DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: rows.map((o) => ({
          order_id: o.id,
          side: o.side,
          price_cents: parseInt(o.price_cents),
          quantity: parseInt(o.quantity),
          remaining: parseInt(o.quantity) - parseInt(o.filled_quantity),
          payment_token: o.payment_token,
          user_mask: o.phone_mask,
          user_level: o.user_level,
          created_at: o.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('获取P2P订单失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 创建 P2P 挂单
async function createOrder(req, res) {
  try {
    const userId = req.user.user_id;
    const { side, price_cents, quantity, payment_token = 'USDT' } = req.body;

    if (!['sell', 'buy'].includes(side)) {
      return res.status(400).json({ code: 10001, message: '无效的交易方向' });
    }

    const orderId = `P2P-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const [result] = await pool.query(
      `INSERT INTO p2p_orders (order_id, user_id, side, price_cents, quantity, payment_token, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [orderId, userId, side, price_cents, quantity, payment_token, 'active']
    );

    res.json({
      code: 0,
      message: '挂单成功',
      data: {
        order_id: orderId,
        side,
        price_cents,
        quantity,
        payment_token,
        status: 'active',
      },
    });
  } catch (error) {
    console.error('创建P2P订单失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 成交 P2P 订单
async function fillOrder(req, res) {
  try {
    const userId = req.user.user_id;
    const { order_id, quantity } = req.body;

    const [order] = await pool.query(
      'SELECT * FROM p2p_orders WHERE order_id = $1 AND status = $2',
      [order_id, 'active']
    );

    if (order.length === 0) {
      return res.status(404).json({ code: 40001, message: '订单不存在或已关闭' });
    }

    if (order[0].user_id === userId) {
      return res.status(400).json({ code: 10001, message: '不能和自己的订单成交' });
    }

    const remaining = parseInt(order[0].quantity) - parseInt(order[0].filled_quantity);
    if (quantity > remaining) {
      return res.status(400).json({ code: 40001, message: '数量超出可成交范围' });
    }

    const fillId = `FILL-${Date.now()}`;
    const totalCents = parseInt(order[0].price_cents) * quantity;

    // 记录成交
    await pool.query(
      `INSERT INTO p2p_fills (fill_id, order_id, taker_id, maker_id, quantity, price_cents, total_cents)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [fillId, order_id, userId, order[0].user_id, quantity, order[0].price_cents, totalCents]
    );

    // 更新订单
    await pool.query(
      `UPDATE p2p_orders SET filled_quantity = filled_quantity + $1 WHERE order_id = $2`,
      [quantity, order_id]
    );

    // 检查是否完全成交
    const [updated] = await pool.query('SELECT * FROM p2p_orders WHERE order_id = $1', [order_id]);
    if (parseInt(updated[0].filled_quantity) >= parseInt(updated[0].quantity)) {
      await pool.query(`UPDATE p2p_orders SET status = 'filled' WHERE order_id = $1`, [order_id]);
    }

    res.json({
      code: 0,
      message: '成交成功',
      data: {
        fill_id: fillId,
        order_id,
        quantity,
        price_cents: parseInt(order[0].price_cents),
        total_cents: totalCents,
        status: 'filled',
      },
    });
  } catch (error) {
    console.error('P2P成交失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 取消 P2P 订单
async function cancelOrder(req, res) {
  try {
    const userId = req.user.user_id;
    const { order_id } = req.params;

    const [order] = await pool.query(
      'SELECT * FROM p2p_orders WHERE order_id = $1 AND user_id = $2 AND status = $3',
      [order_id, userId, 'active']
    );

    if (order.length === 0) {
      return res.status(404).json({ code: 40001, message: '订单不存在或无法取消' });
    }

    await pool.query(
      `UPDATE p2p_orders SET status = 'cancelled' WHERE order_id = $1`,
      [order_id]
    );

    res.json({
      code: 0,
      message: '订单已取消',
      data: { order_id, status: 'cancelled' },
    });
  } catch (error) {
    console.error('取消P2P订单失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getOrders,
  createOrder,
  fillOrder,
  cancelOrder,
};
