/**
 * 订单控制器
 */
const { v4: uuidv4 } = require('uuid');
const { pgPool } = require('../config/database');
const { ERRORS } = require('../config/constants');

/**
 * 生成订单号
 */
function generateOrderNo() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ORD${dateStr}${random}`;
}

/**
 * 创建订单
 */
async function createOrder(req, res, next) {
  try {
    const { campsite_id, check_in_date, check_out_date, spot_type } = req.body;
    
    // 验证营地存在
    const campResult = await pgPool.query(
      'SELECT * FROM campsites WHERE id = $1 AND status = $2',
      [campsite_id, 'active']
    );
    
    if (campResult.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.CAMP_NOT_FOUND,
        message: '营地不存在'
      });
    }
    
    const campsite = campResult.rows[0];
    
    // 验证日期
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      return res.status(400).json({
        code: ERRORS.DATE_NOT_AVAILABLE,
        message: '离店日期必须晚于入住日期'
      });
    }
    
    // 计算金额
    const amountUsdCents = campsite.price_usd_cents * nights;
    
    // 生成订单
    const orderResult = await pgPool.query(`
      INSERT INTO orders (
        order_no, user_id, campsite_id, check_in_date, check_out_date,
        spot_type, nights, amount_usd_cents, payment_status, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending',NOW())
      RETURNING *
    `, [generateOrderNo(), req.userId, campsite_id, check_in_date, check_out_date, spot_type, nights, amountUsdCents]);
    
    const order = orderResult.rows[0];
    
    // 计算支付截止时间 (72小时)
    const paymentDeadline = new Date(order.created_at.getTime() + 72 * 60 * 60 * 1000);
    
    res.json({
      code: 0,
      message: '订单创建成功',
      data: {
        order_id: order.id,
        order_no: order.order_no,
        campsite_name: campsite.name,
        check_in_date: order.check_in_date,
        check_out_date: order.check_out_date,
        spot_type: order.spot_type,
        nights: order.nights,
        amount_usd_cents: order.amount_usd_cents,
        payment_status: order.payment_status,
        payment_deadline: paymentDeadline.toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取订单列表
 */
async function getOrders(req, res, next) {
  try {
    const { status, page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    
    let whereClause = 'user_id = $1';
    const values = [req.userId];
    
    if (status) {
      whereClause += ' AND payment_status = $2';
      values.push(status);
    }
    
    values.push(parseInt(page_size), offset);
    
    const result = await pgPool.query(`
      SELECT o.*, c.name as campsite_name, c.name_en as campsite_name_en, c.country_code
      FROM orders o
      JOIN campsites c ON o.campsite_id = c.id
      WHERE ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT $${values.length - 1} OFFSET $${values.length}
    `, values);
    
    const countResult = await pgPool.query(
      `SELECT COUNT(*) FROM orders WHERE ${whereClause}`,
      values.slice(0, status ? 2 : 1)
    );
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        page_size: parseInt(page_size),
        orders: result.rows.map(order => ({
          id: order.id,
          order_no: order.order_no,
          campsite_name: order.campsite_name,
          campsite_name_en: order.campsite_name_en,
          country_code: order.country_code,
          check_in_date: order.check_in_date,
          check_out_date: order.check_out_date,
          nights: order.nights,
          amount_usd_cents: order.amount_usd_cents,
          payment_status: order.payment_status,
          payment_token: order.payment_token,
          user_rating: order.user_rating,
          created_at: order.created_at,
          paid_at: order.paid_at
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取订单详情
 */
async function getOrderDetail(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(`
      SELECT o.*, c.name as campsite_name, c.name_en as campsite_name_en,
        c.address, c.latitude, c.longitude, c.contact_phone,
        c.check_in_time, c.check_out_time, c.country_code
      FROM orders o
      JOIN campsites c ON o.campsite_id = c.id
      WHERE o.id = $1 AND o.user_id = $2
    `, [id, req.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.ORDER_NOT_FOUND,
        message: '订单不存在'
      });
    }
    
    const order = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: order.id,
        order_no: order.order_no,
        campsite: {
          id: order.campsite_id,
          name: order.campsite_name,
          name_en: order.campsite_name_en,
          address: order.address,
          latitude: parseFloat(order.latitude),
          longitude: parseFloat(order.longitude),
          contact_phone: order.contact_phone,
          check_in_time: order.check_in_time,
          check_out_time: order.check_out_time,
          country_code: order.country_code
        },
        check_in_date: order.check_in_date,
        check_out_date: order.check_out_date,
        spot_type: order.spot_type,
        nights: order.nights,
        amount_usd_cents: order.amount_usd_cents,
        payment_status: order.payment_status,
        payment_token: order.payment_token,
        payment_tx_hash: order.payment_tx_hash,
        discount_applied: order.discount_applied,
        discount_reason: order.discount_reason,
        user_rating: order.user_rating,
        user_comment: order.user_comment,
        created_at: order.created_at,
        paid_at: order.paid_at,
        cancelled_at: order.cancelled_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 取消订单
 */
async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    
    const orderResult = await pgPool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.ORDER_NOT_FOUND,
        message: '订单不存在'
      });
    }
    
    const order = orderResult.rows[0];
    
    if (order.payment_status !== 'pending') {
      return res.status(400).json({
        code: ERRORS.ORDER_STATUS_ERROR,
        message: '只有待支付的订单可以取消'
      });
    }
    
    await pgPool.query(`
      UPDATE orders SET payment_status = 'cancelled', cancelled_at = NOW(), updated_at = NOW()
      WHERE id = $1
    `, [id]);
    
    res.json({
      code: 0,
      message: '订单已取消'
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 评价订单
 */
async function rateOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const orderResult = await pgPool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.ORDER_NOT_FOUND,
        message: '订单不存在'
      });
    }
    
    const order = orderResult.rows[0];
    
    if (order.payment_status !== 'paid') {
      return res.status(400).json({
        code: ERRORS.ORDER_STATUS_ERROR,
        message: '只能评价已支付的订单'
      });
    }
    
    await pgPool.query(`
      UPDATE orders SET user_rating = $1, user_comment = $2, updated_at = NOW()
      WHERE id = $3
    `, [rating, comment, id]);
    
    // 更新营地评分
    await pgPool.query(`
      UPDATE campsites SET
        rating = (rating * rating_count + $1) / (rating_count + 1),
        rating_count = rating_count + 1
      WHERE id = $2
    `, [rating, order.campsite_id]);
    
    res.json({
      code: 0,
      message: '评价成功'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder,
  getOrders,
  getOrderDetail,
  cancelOrder,
  rateOrder
};