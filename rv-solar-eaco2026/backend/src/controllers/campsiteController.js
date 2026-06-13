/**
 * 营地控制器
 */
const { pgPool } = require('../config/database');

/**
 * 获取营地列表
 */
async function getCampsites(req, res, next) {
  try {
    const {
      port_id, country_code, has_charging,
      min_price, max_price,
      latitude, longitude, radius_km,
      sort_by = 'distance', page = 1, page_size = 20
    } = req.query;
    
    const conditions = ['status = $1'];
    const values = ['active'];
    let paramCount = 2;
    
    if (port_id) {
      conditions.push(`port_id = $${paramCount++}`);
      values.push(port_id);
    }
    
    if (country_code) {
      conditions.push(`country_code = $${paramCount++}`);
      values.push(country_code);
    }
    
    if (has_charging === 'true') {
      conditions.push(`charging_spots > 0`);
    }
    
    if (min_price) {
      conditions.push(`price_usd_cents >= $${paramCount++}`);
      values.push(parseInt(min_price));
    }
    
    if (max_price) {
      conditions.push(`price_usd_cents <= $${paramCount++}`);
      values.push(parseInt(max_price));
    }
    
    let orderBy = 'rating DESC';
    if (sort_by === 'price') orderBy = 'price_usd_cents ASC';
    if (sort_by === 'solar_capacity') orderBy = 'solar_capacity_kw DESC';
    
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    values.push(parseInt(page_size));
    values.push(offset);
    
    const query = `
      SELECT c.*, p.name as port_name, p.country_name
      FROM campsites c
      LEFT JOIN port_crossings p ON c.port_id = p.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${orderBy}
      LIMIT $${paramCount++} OFFSET $${paramCount}
    `;
    
    const result = await pgPool.query(query, values);
    
    // 获取总数
    const countResult = await pgPool.query(
      `SELECT COUNT(*) FROM campsites WHERE ${conditions.slice(0, -values.length + 2).join(' AND ') || 'status = $1'}`,
      [values[0]]
    );
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        page_size: parseInt(page_size),
        campsites: result.rows.map(camp => ({
          id: camp.id,
          name: camp.name,
          name_en: camp.name_en,
          country_code: camp.country_code,
          country_name: camp.country_name,
          address: camp.address,
          latitude: parseFloat(camp.latitude),
          longitude: parseFloat(camp.longitude),
          price_usd_cents: camp.price_usd_cents,
          solar_capacity_kw: parseFloat(camp.solar_capacity_kw),
          charging_spots: camp.charging_spots,
          max_charging_power_w: camp.max_charging_power_w,
          amenities: camp.amenities || [],
          rating: parseFloat(camp.rating),
          rating_count: camp.rating_count,
          images: camp.images || [],
          distance_km: null
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取营地详情
 */
async function getCampsiteDetail(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(`
      SELECT c.*, p.name as port_name, p.country_name, p.timezone
      FROM campsites c
      LEFT JOIN port_crossings p ON c.port_id = p.id
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 30001,
        message: '营地不存在'
      });
    }
    
    const camp = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: camp.id,
        name: camp.name,
        name_en: camp.name_en,
        country_code: camp.country_code,
        country_name: camp.country_name,
        address: camp.address,
        latitude: parseFloat(camp.latitude),
        longitude: parseFloat(camp.longitude),
        description: camp.description,
        description_en: camp.description_en,
        check_in_time: camp.check_in_time,
        check_out_time: camp.check_out_time,
        total_spots: camp.total_spots,
        available_spots: camp.available_spots,
        price_usd_cents: camp.price_usd_cents,
        solar_capacity_kw: parseFloat(camp.solar_capacity_kw),
        charging_spots: camp.charging_spots,
        max_charging_power_w: camp.max_charging_power_w,
        amenities: camp.amenities || [],
        images: camp.images || [],
        contact_phone: camp.contact_phone,
        contact_wechat: camp.contact_wechat,
        operator_name: camp.operator_name,
        rating: parseFloat(camp.rating),
        rating_count: camp.rating_count,
        port_name: camp.port_name,
        timezone: camp.timezone
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取营地车位状态
 */
async function getCampsiteSpots(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(
      'SELECT total_spots, available_spots, charging_spots FROM campsites WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 30001,
        message: '营地不存在'
      });
    }
    
    const camp = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total_spots: camp.total_spots,
        available_spots: camp.available_spots,
        charging_spots: camp.charging_spots,
        spots: Array.from({ length: camp.total_spots }, (_, i) => ({
          id: i + 1,
          available: i < camp.available_spots,
          has_charging: i < camp.charging_spots
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取附近营地
 */
async function getNearbyCampsites(req, res, next) {
  try {
    const { latitude, longitude, radius_km = 50 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({
        code: 10001,
        message: '需要提供latitude和longitude参数'
      });
    }
    
    // 使用PostGIS计算距离 (简化版，使用原生计算)
    const result = await pgPool.query(`
      SELECT c.*, p.country_name,
        (6371 * acos(cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude)))) AS distance
      FROM campsites c
      LEFT JOIN port_crossings p ON c.port_id = p.id
      WHERE c.status = 'active'
      HAVING distance < $3
      ORDER BY distance
      LIMIT 20
    `, [parseFloat(latitude), parseFloat(longitude), parseFloat(radius_km)]);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        center: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
        radius_km: parseFloat(radius_km),
        campsites: result.rows.map(camp => ({
          id: camp.id,
          name: camp.name,
          country_code: camp.country_code,
          country_name: camp.country_name,
          latitude: parseFloat(camp.latitude),
          longitude: parseFloat(camp.longitude),
          price_usd_cents: camp.price_usd_cents,
          charging_spots: camp.charging_spots,
          rating: parseFloat(camp.rating),
          distance_km: parseFloat(camp.distance).toFixed(2)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCampsites,
  getCampsiteDetail,
  getCampsiteSpots,
  getNearbyCampsites
};