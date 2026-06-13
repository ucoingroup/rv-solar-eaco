/**
 * 口岸控制器
 */
const { pgPool } = require('../config/database');

/**
 * 获取口岸列表
 */
async function getPorts(req, res, next) {
  try {
    const { country_code, onboarding_status } = req.query;
    
    let whereClause = '1=1';
    const values = [];
    let paramCount = 1;
    
    if (country_code) {
      whereClause += ` AND country_code = $${paramCount++}`;
      values.push(country_code);
    }
    
    if (onboarding_status) {
      whereClause += ` AND onboarding_status = $${paramCount++}`;
      values.push(onboarding_status);
    }
    
    const result = await pgPool.query(`
      SELECT * FROM port_crossings
      WHERE ${whereClause}
      ORDER BY priority ASC
    `, values);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        ports: result.rows.map(port => ({
          id: port.id,
          name: port.name,
          name_local: port.name_local,
          name_en: port.name_en,
          country_code: port.country_code,
          country_name: port.country_name,
          border_type: port.border_type,
          latitude: parseFloat(port.latitude),
          longitude: parseFloat(port.longitude),
          crypto_friendly: port.crypto_friendly,
          solar_potential: port.solar_potential,
          rv_friendly: port.rv_friendly,
          language_codes: port.language_codes || [],
          regulatory_note: port.regulatory_note,
          onboarding_status: port.onboarding_status,
          priority: port.priority
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取口岸详情
 */
async function getPortDetail(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(
      'SELECT * FROM port_crossings WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 40001,
        message: '口岸不存在'
      });
    }
    
    const port = result.rows[0];
    
    // 获取该口岸的营地数量
    const campCount = await pgPool.query(
      'SELECT COUNT(*) FROM campsites WHERE port_id = $1 AND status = $2',
      [id, 'active']
    );
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: port.id,
        name: port.name,
        name_local: port.name_local,
        name_en: port.name_en,
        country_code: port.country_code,
        country_name: port.country_name,
        border_type: port.border_type,
        lat_side: port.lat_side,
        latitude: parseFloat(port.latitude),
        longitude: parseFloat(port.longitude),
        timezone: port.timezone,
        currency_code: port.currency_code,
        crypto_friendly: port.crypto_friendly,
        solar_potential: port.solar_potential,
        rv_friendly: port.rv_friendly,
        language_codes: port.language_codes || [],
        regulatory_note: port.regulatory_note,
        onboarding_status: port.onboarding_status,
        priority: port.priority,
        campsite_count: parseInt(campCount.rows[0].count)
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getPorts,
  getPortDetail
};