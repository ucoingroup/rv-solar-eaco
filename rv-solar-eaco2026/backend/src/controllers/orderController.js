/**
 * 订单控制器
 */
const { pool } = require('../config/database');

// 获取订单列表
async function getOrderList(req, res) {
  try {
    const userId = req.user.user_id;
    const { page = 1, page_size = 20, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);

    let whereClause = ' WHERE o.user_id = $1 ';
    const params = [userId];

    if (status) {
      params.push(status);
      whereClause += ` AND o.status = $${params.length}`;
    }

    params.push(parseInt(page_size), offset);

    const [orders] = await pool.query(
      `SELECT o.*, c.name as campsite_name, c.cover_image, c.address
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
          address: o.address,
          check_in_date: o.check_in_date,
          check_out_date: o.check_out_date,
          nights: o.nights,
          guest_count: o.guest_count,
          total_price: parseFloat(o.total_price),
          status: o.status,
          created_at: o.created_at,
          paid_at: o.paid_at,
        })),
      },
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取订单详情
async function getOrderDetail(req, res) {
  try {
    const userId = req.user.user_id;
    const { order_id } = req.params;

    const [order] = await pool.query(
      `SELECT o.*, c.*, p.name as port_name
       FROM orders o
       LEFT JOIN campsites c ON o.campsite_id = c.id
       LEFT JOIN ports p ON c.port_id = p.id
       WHERE o.order_id = $1 AND o.user_id = $2`,
      [order_id, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ code: 40001, message: '订单不存在' });
    }

    res.json({
      code: 0,
      message: 'success',
      data: {
        order_id: order[0].order_id,
        status: order[0].status,
        check_in_date: order[0].check_in_date,
        check_out_date: order[0].check_out_date,
        nights: order[0].nights,
        guest_count: order[0].guest_count,
        total_price: parseFloat(order[0].total_price),
        special_requests: order[0].special_requests,
        created_at: order[0].created_at,
        paid_at: order[0].paid_at,
        cancelled_at: order[0].cancelled_at,
        campsite: {
          id: order[0].campsite_id,
          name: order[0].name,
          cover_image: order[0].cover_image,
          address: order[0].address,
          latitude: parseFloat(order[0].latitude),
          longitude: parseFloat(order[0].longitude),
          contact_phone: order[0].contact_phone,
          contact_wechat: order[0].contact_wechat,
        },
        port: { id: order[0].port_id, name: order[0].port_name },
      },
    });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getOrderList,
  getOrderDetail,
};
