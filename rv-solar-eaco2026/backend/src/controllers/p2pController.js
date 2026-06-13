/**
 * P2P能源控制器
 */
const { v4: uuidv4 } = require('uuid');
const { pgPool } = require('../config/database');
const { ERRORS } = require('../config/constants');

/**
 * 挂牌出售
 */
async function createListing(req, res, next) {
  try {
    const { energy_kwh, price_eaco_per_kwh, location_text, latitude, longitude } = req.body;
    
    const listingNo = 'LST' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const result = await pgPool.query(`
      INSERT INTO energy_listings (
        listing_no, user_id, energy_kwh, remaining_kwh, price_eaco_per_kwh,
        location_text, latitude, longitude, status, created_at
      ) VALUES ($1,$2,$3,$3,$4,$5,$6,$7,'active',NOW())
      RETURNING *
    `, [listingNo, req.userId, energy_kwh, price_eaco_per_kwh, location_text, latitude, longitude]);
    
    const listing = result.rows[0];
    
    res.json({
      code: 0,
      message: '挂牌成功',
      data: {
        listing_id: listing.id,
        listing_no: listing.listing_no,
        energy_kwh: listing.energy_kwh,
        remaining_kwh: listing.remaining_kwh,
        price_eaco_per_kwh: listing.price_eaco_per_kwh,
        status: listing.status
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取挂牌列表
 */
async function getListings(req, res, next) {
  try {
    const { status = 'active', page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    
    const result = await pgPool.query(`
      SELECT l.*, u.nickname
      FROM energy_listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.status = $1
      ORDER BY l.created_at DESC
      LIMIT $2 OFFSET $3
    `, [status, parseInt(page_size), offset]);
    
    const countResult = await pgPool.query(
      'SELECT COUNT(*) FROM energy_listings WHERE status = $1',
      [status]
    );
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        page_size: parseInt(page_size),
        listings: result.rows.map(row => ({
          id: row.id,
          listing_no: row.listing_no,
          seller: row.nickname || 'Anonymous',
          energy_kwh: row.energy_kwh,
          remaining_kwh: row.remaining_kwh,
          price_eaco_per_kwh: row.price_eaco_per_kwh,
          location_text: row.location_text,
          status: row.status,
          created_at: row.created_at
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取挂牌详情
 */
async function getListingDetail(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(`
      SELECT l.*, u.nickname as seller_name
      FROM energy_listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 40001,
        message: '挂牌不存在'
      });
    }
    
    const row = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: row.id,
        listing_no: row.listing_no,
        seller: row.seller_name || 'Anonymous',
        energy_kwh: row.energy_kwh,
        remaining_kwh: row.remaining_kwh,
        price_eaco_per_kwh: row.price_eaco_per_kwh,
        location_text: row.location_text,
        status: row.status,
        created_at: row.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 购买电力
 */
async function buyEnergy(req, res, next) {
  try {
    const { id } = req.params;
    const { energy_kwh } = req.body;
    
    const listingResult = await pgPool.query(
      'SELECT * FROM energy_listings WHERE id = $1 AND status = $2',
      [id, 'active']
    );
    
    if (listingResult.rows.length === 0) {
      return res.status(404).json({
        code: 40001,
        message: '挂牌不存在或已下架'
      });
    }
    
    const listing = listingResult.rows[0];
    
    if (listing.remaining_kwh < energy_kwh) {
      return res.status(400).json({
        code: ERRORS.INVALID_PARAMS,
        message: `剩余电量不足，当前剩余 ${listing.remaining_kwh}Wh`
      });
    }
    
    const totalPrice = Math.floor(energy_kwh * listing.price_eaco_per_kwh / 1000);
    
    // 更新挂牌
    await pgPool.query(`
      UPDATE energy_listings SET
        remaining_kwh = remaining_kwh - $1,
        sold_kwh = sold_kwh + $1,
        updated_at = NOW()
      WHERE id = $2
    `, [energy_kwh, id]);
    
    // 检查是否售罄
    const updated = await pgPool.query(
      'SELECT remaining_kwh FROM energy_listings WHERE id = $1',
      [id]
    );
    
    if (updated.rows[0].remaining_kwh <= 0) {
      await pgPool.query(
        "UPDATE energy_listings SET status = 'sold' WHERE id = $1",
        [id]
      );
    }
    
    res.json({
      code: 0,
      message: '购买成功',
      data: {
        listing_id: id,
        energy_kwh,
        total_price: totalPrice,
        seller: listing.user_id,
        tx_hash: 'sim_tx_' + Date.now()
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 撤销挂牌
 */
async function cancelListing(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await pgPool.query(
      'UPDATE energy_listings SET status = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING id',
      ['cancelled', id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: 40001,
        message: '挂牌不存在或无权操作'
      });
    }
    
    res.json({
      code: 0,
      message: '挂牌已撤销'
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createListing,
  getListings,
  getListingDetail,
  buyEnergy,
  cancelListing
};