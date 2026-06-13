/**
 * 营地控制器
 */
const { pool } = require('../config/database');

// 获取营地列表
async function getCampsiteList(req, res) {
  try {
    const {
      page = 1,
      page_size = 20,
      port_id,
      country,
      has_solar,
      has_ev,
      min_price,
      max_price,
      sort = 'distance',
      lat,
      lng,
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(page_size);

    let whereClause = ' WHERE 1=1 ';
    const params = [];
    let paramCount = 0;

    if (port_id) {
      paramCount++;
      whereClause += ` AND c.port_id = $${paramCount}`;
      params.push(port_id);
    }
    if (country) {
      paramCount++;
      whereClause += ` AND c.country = $${paramCount}`;
      params.push(country);
    }
    if (has_solar !== undefined) {
      paramCount++;
      whereClause += ` AND c.has_solar = $${paramCount}`;
      params.push(has_solar === 'true');
    }
    if (has_ev !== undefined) {
      paramCount++;
      whereClause += ` AND c.has_ev_charger = $${paramCount}`;
      params.push(has_ev === 'true');
    }
    if (min_price) {
      paramCount++;
      whereClause += ` AND c.price_per_kwh >= $${paramCount}`;
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      paramCount++;
      whereClause += ` AND c.price_per_kwh <= $${paramCount}`;
      params.push(parseFloat(max_price));
    }

    // 排序
    let orderClause = ' ORDER BY c.created_at DESC ';
    if (sort === 'price_asc') orderClause = ' ORDER BY c.price_per_kwh ASC ';
    if (sort === 'price_desc') orderClause = ' ORDER BY c.price_per_kwh DESC ';
    if (sort === 'rating') orderClause = ' ORDER BY c.rating DESC ';

    paramCount++;
    const limitClause = ` LIMIT $${paramCount}`;
    params.push(parseInt(page_size));

    paramCount++;
    const offsetClause = ` OFFSET $${paramCount}`;
    params.push(offset);

    const query = `
      SELECT c.*,
             p.name as port_name,
             p.country as port_country,
             (SELECT COUNT(*) FROM reviews r WHERE r.campsite_id = c.id) as review_count,
             (SELECT AVG(rating) FROM reviews r WHERE r.campsite_id = c.id) as avg_rating
      FROM campsites c
      LEFT JOIN ports p ON c.port_id = p.id
      ${whereClause}
      ${orderClause}
      ${limitClause}
      ${offsetClause}
    `;

    const [rows] = await pool.query(query, params);

    // 格式化数据
    const campsites = rows.map((c) => ({
      id: c.id,
      name: c.name,
      name_en: c.name_en,
      description: c.description,
      cover_image: c.cover_image,
      images: c.images ? JSON.parse(c.images) : [],
      country: c.country,
      port_id: c.port_id,
      port_name: c.port_name,
      address: c.address,
      latitude: parseFloat(c.latitude),
      longitude: parseFloat(c.longitude),
      price_per_kwh: parseFloat(c.price_per_kwh),
      daily_rate: c.daily_rate ? parseFloat(c.daily_rate) : null,
      has_solar: c.has_solar,
      has_ev_charger: c.has_ev_charger,
      ev_charger_type: c.ev_charger_type,
      max_capacity: c.max_capacity,
      current_occupancy: c.current_occupancy,
      amenities: c.amenities ? JSON.parse(c.amenities) : [],
      opening_hours: c.opening_hours,
      rating: c.avg_rating ? parseFloat(c.avg_rating).toFixed(1) : null,
      review_count: parseInt(c.review_count) || 0,
      status: c.status,
    }));

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: campsites,
        pagination: {
          page: parseInt(page),
          page_size: parseInt(page_size),
          total: rows.length,
        },
      },
    });
  } catch (error) {
    console.error('获取营地列表失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取营地详情
async function getCampsiteDetail(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT c.*,
             p.name as port_name, p.country as port_country
      FROM campsites c
      LEFT JOIN ports p ON c.port_id = p.id
      WHERE c.id = $1
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ code: 30001, message: '营地不存在' });
    }

    const c = rows[0];

    // 获取评价列表
    const [reviews] = await pool.query(
      `SELECT r.*, u.phone_mask FROM reviews r
       LEFT JOIN users u ON r.user_id = u.id
       WHERE r.campsite_id = $1
       ORDER BY r.created_at DESC LIMIT 10`,
      [id]
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        id: c.id,
        name: c.name,
        name_en: c.name_en,
        description: c.description,
        cover_image: c.cover_image,
        images: c.images ? JSON.parse(c.images) : [],
        country: c.country,
        port_id: c.port_id,
        port_name: c.port_name,
        address: c.address,
        latitude: parseFloat(c.latitude),
        longitude: parseFloat(c.longitude),
        price_per_kwh: parseFloat(c.price_per_kwh),
        daily_rate: c.daily_rate ? parseFloat(c.daily_rate) : null,
        has_solar: c.has_solar,
        has_ev_charger: c.has_ev_charger,
        ev_charger_type: c.ev_charger_type,
        max_capacity: c.max_capacity,
        current_occupancy: c.current_occupancy,
        amenities: c.amenities ? JSON.parse(c.amenities) : [],
        opening_hours: c.opening_hours,
        contact_phone: c.contact_phone,
        contact_wechat: c.contact_wechat,
        status: c.status,
        reviews: reviews.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          user_mask: r.phone_mask,
          rating: r.rating,
          comment: r.comment,
          images: r.images ? JSON.parse(r.images) : [],
          created_at: r.created_at,
        })),
      },
    });
  } catch (error) {
    console.error('获取营地详情失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 预约营地
async function bookCampsite(req, res) {
  try {
    const userId = req.user.user_id;
    const { campsite_id, check_in_date, check_out_date, guest_count, special_requests } = req.body;

    // 检查营地是否有空位
    const [campsite] = await pool.query(
      'SELECT * FROM campsites WHERE id = $1 AND status = $2',
      [campsite_id, 'active']
    );

    if (campsite.length === 0) {
      return res.status(404).json({ code: 30001, message: '营地不存在或不可用' });
    }

    if (campsite[0].current_occupancy >= campsite[0].max_capacity) {
      return res.status(400).json({ code: 30002, message: '营地已满' });
    }

    // 计算总价
    const checkIn = new Date(check_in_date);
    const checkOut = new Date(check_out_date);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    const totalPrice = campsite[0].daily_rate ? nights * parseFloat(campsite[0].daily_rate) : 0;

    // 创建订单
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    const [result] = await pool.query(
      `INSERT INTO orders (order_id, user_id, campsite_id, check_in_date, check_out_date,
        guest_count, nights, total_price, status, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [orderId, userId, campsite_id, check_in_date, check_out_date, guest_count || 1, nights,
       totalPrice, 'pending', special_requests || '']
    );

    res.json({
      code: 0,
      message: '预约成功',
      data: {
        order_id: orderId,
        campsite_id,
        check_in_date,
        check_out_date,
        nights,
        total_price: totalPrice,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('预约营地失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 评价营地
async function reviewCampsite(req, res) {
  try {
    const userId = req.user.user_id;
    const { campsite_id } = req.params;
    const { rating, comment, images } = req.body;

    const [result] = await pool.query(
      `INSERT INTO reviews (user_id, campsite_id, rating, comment, images)
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, campsite_id, rating, comment, images ? JSON.stringify(images) : '[]']
    );

    // 更新营地评分
    await pool.query(
      `UPDATE campsites SET rating = (
        SELECT AVG(rating) FROM reviews WHERE campsite_id = $1
      ) WHERE id = $1`,
      [campsite_id]
    );

    res.json({
      code: 0,
      message: '评价成功',
      data: { review_id: result.insertId },
    });
  } catch (error) {
    console.error('评价营地失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getCampsiteList,
  getCampsiteDetail,
  bookCampsite,
  reviewCampsite,
};
