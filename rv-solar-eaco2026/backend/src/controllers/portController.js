/**
 * 口岸控制器
 */
const { pool } = require('../config/database');

// 获取口岸列表
async function getPortList(req, res) {
  try {
    const { country } = req.query;

    let whereClause = '';
    const params = [];
    if (country) {
      whereClause = ' WHERE country = $1';
      params.push(country);
    }

    const [rows] = await pool.query(
      `SELECT p.*,
              (SELECT COUNT(*) FROM campsites c WHERE c.port_id = p.id AND c.status = 'active') as campsite_count
       FROM ports p
       ${whereClause}
       ORDER BY p.priority ASC`,
      params
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        list: rows.map((p) => ({
          id: p.id,
          name: p.name,
          name_en: p.name_en,
          country: p.country,
          country_code: p.country_code,
          border_type: p.border_type,
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
          priority: p.priority,
          political_risk: p.political_risk,
          payment普及率: p.payment普及率,
          payment_methods: p.payment_methods ? JSON.parse(p.payment_methods) : [],
          ev_charging_available: p.ev_charging_available,
          charger_count: parseInt(p.charger_count) || 0,
          campsite_count: parseInt(p.campsite_count) || 0,
          status: p.status,
          description: p.description,
        })),
      },
    });
  } catch (error) {
    console.error('获取口岸列表失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取口岸详情
async function getPortDetail(req, res) {
  try {
    const { id } = req.params;

    const [port] = await pool.query('SELECT * FROM ports WHERE id = $1', [id]);

    if (port.length === 0) {
      return res.status(404).json({ code: 60001, message: '口岸不存在' });
    }

    // 获取该口岸下的营地
    const [campsites] = await pool.query(
      `SELECT id, name, cover_image, price_per_kwh, has_ev_charger, rating
       FROM campsites WHERE port_id = $1 AND status = 'active'
       ORDER BY rating DESC LIMIT 5`,
      [id]
    );

    res.json({
      code: 0,
      message: 'success',
      data: {
        id: port[0].id,
        name: port[0].name,
        name_en: port[0].name_en,
        country: port[0].country,
        country_code: port[0].country_code,
        border_type: port[0].border_type,
        latitude: parseFloat(port[0].latitude),
        longitude: parseFloat(port[0].longitude),
        priority: port[0].priority,
        political_risk: port[0].political_risk,
        payment普及率: port[0].payment普及率,
        payment_methods: port[0].payment_methods ? JSON.parse(port[0].payment_methods) : [],
        ev_charging_available: port[0].ev_charging_available,
        charger_count: parseInt(port[0].charger_count) || 0,
        status: port[0].status,
        description: port[0].description,
        recommended_campsites: campsites,
      },
    });
  } catch (error) {
    console.error('获取口岸详情失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取口岸地图数据
async function getPortMapData(req, res) {
  try {
    const [ports] = await pool.query(
      `SELECT id, name, name_en, country, country_code, latitude, longitude,
              priority, status, ev_charging_available, charger_count
       FROM ports WHERE status = 'active' ORDER BY priority ASC`
    );

    const markers = ports.map((p) => ({
      id: p.id,
      name: p.name,
      name_en: p.name_en,
      country: p.country,
      latitude: parseFloat(p.latitude),
      longitude: parseFloat(p.longitude),
      priority: p.priority,
      ev_available: p.ev_charging_available,
      charger_count: parseInt(p.charger_count) || 0,
      popup: `${p.name_en || p.name} (${p.country})`,
    }));

    res.json({
      code: 0,
      message: 'success',
      data: { markers },
    });
  } catch (error) {
    console.error('获取口岸地图数据失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  getPortList,
  getPortDetail,
  getPortMapData,
};
