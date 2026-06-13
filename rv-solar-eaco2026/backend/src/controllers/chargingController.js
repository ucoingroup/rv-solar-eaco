/**
 * 充电控制器
 */
const { pgPool } = require('../config/database');
const { submitEnergyRecord } = require('../services/rewardService');
const { ERRORS } = require('../config/constants');

// 模拟充电会话存储
const activeChargingSessions = new Map();

/**
 * 开始充电
 */
async function startCharging(req, res, next) {
  try {
    const { charger_id, payment_token = 'EACO' } = req.body;
    
    // 检查是否已有进行中的充电
    const existing = await pgPool.query(`
      SELECT id FROM charging_records 
      WHERE user_id = $1 AND end_time IS NULL
    `, [req.userId]);
    
    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: ERRORS.CHARGING_IN_PROGRESS,
        message: '已有进行中的充电会话'
      });
    }
    
    // 创建充电记录
    const result = await pgPool.query(`
      INSERT INTO charging_records (
        user_id, campsite_id, charger_id, start_time, energy_kwh, payment_token, payment_status
      ) VALUES ($1,
        (SELECT id FROM campsites WHERE status = 'active' ORDER BY RANDOM() LIMIT 1),
        $2, NOW(), 0, $3, 'pending')
      RETURNING *
    `, [req.userId, charger_id, payment_token]);
    
    const record = result.rows[0];
    
    // 存储活跃会话
    activeChargingSessions.set(record.id, {
      startTime: Date.now(),
      chargerId: charger_id
    });
    
    res.json({
      code: 0,
      message: '充电已开始',
      data: {
        charging_id: record.id,
        session_id: record.id,
        start_time: record.start_time,
        realtime: {
          power_w: 0,
          voltage_v: 0,
          current_a: 0,
          energy_kwh: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取当前充电状态
 */
async function getCurrentCharging(req, res, next) {
  try {
    const result = await pgPool.query(`
      SELECT c.*, cr.name as campsite_name
      FROM charging_records c
      LEFT JOIN campsites cr ON c.campsite_id = cr.id
      WHERE c.user_id = $1 AND c.end_time IS NULL
      ORDER BY c.start_time DESC
      LIMIT 1
    `, [req.userId]);
    
    if (result.rows.length === 0) {
      return res.json({
        code: 0,
        message: 'success',
        data: {
          has_active: false,
          charging_id: null
        }
      });
    }
    
    const record = result.rows[0];
    const session = activeChargingSessions.get(record.id);
    const elapsedMs = session ? Date.now() - session.startTime : 0;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        has_active: true,
        charging_id: record.id,
        charger_id: record.charger_id,
        campsite_name: record.campsite_name,
        start_time: record.start_time,
        elapsed_hours: parseFloat(elapsedHours.toFixed(4)),
        realtime: {
          power_w: 3200, // 模拟数据
          voltage_v: 220.5,
          current_a: 14.5,
          energy_kwh: parseFloat((elapsedHours * 3.2).toFixed(4))
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 停止充电
 */
async function stopCharging(req, res, next) {
  try {
    const { charging_id } = req.body;
    
    const recordResult = await pgPool.query(
      'SELECT * FROM charging_records WHERE id = $1 AND user_id = $2 AND end_time IS NULL',
      [charging_id, req.userId]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.CHARGING_NOT_FOUND,
        message: '充电记录不存在或已结束'
      });
    }
    
    const record = recordResult.rows[0];
    const session = activeChargingSessions.get(charging_id);
    
    // 计算充电量
    const elapsedMs = session ? Date.now() - session.startTime : 0;
    const elapsedHours = elapsedMs / (1000 * 60 * 60);
    const energyKwh = parseFloat((elapsedHours * 3.2).toFixed(4));
    
    // 计算费用 (假设$0.10/kWh)
    const pricePerKwh = 10000; // $0.10 in USDC最小单位
    const totalAmount = Math.floor(energyKwh * pricePerKwh);
    
    // 更新记录
    await pgPool.query(`
      UPDATE charging_records SET
        end_time = NOW(),
        energy_kwh = $1,
        avg_power_w = $2,
        max_power_w = $3,
        price_per_kwh = $4,
        total_amount = $5,
        payment_status = 'completed'
      WHERE id = $6
    `, [energyKwh, 2800, 3500, pricePerKwh / 100000, totalAmount, charging_id]);
    
    // 删除活跃会话
    activeChargingSessions.delete(charging_id);
    
    // 检查是否使用EACO支付
    const eacoPayment = record.payment_token === 'EACO';
    const finalAmount = eacoPayment ? Math.floor(totalAmount * 0.9) : totalAmount;
    
    res.json({
      code: 0,
      message: '充电已完成',
      data: {
        charging_id,
        total_energy_kwh: energyKwh,
        total_amount: finalAmount,
        payment_token: record.payment_token,
        discount_applied: eacoPayment,
        reward_eaco: Math.floor(energyKwh * 1000),
        carbon_kg: parseFloat((energyKwh * 0.5).toFixed(4))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取充电历史
 */
async function getChargingHistory(req, res, next) {
  try {
    const { page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    
    const result = await pgPool.query(`
      SELECT c.*, cr.name as campsite_name
      FROM charging_records c
      LEFT JOIN campsites cr ON c.campsite_id = cr.id
      WHERE c.user_id = $1 AND c.end_time IS NOT NULL
      ORDER BY c.start_time DESC
      LIMIT $2 OFFSET $3
    `, [req.userId, parseInt(page_size), offset]);
    
    const countResult = await pgPool.query(
      'SELECT COUNT(*) FROM charging_records WHERE user_id = $1 AND end_time IS NOT NULL',
      [req.userId]
    );
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page),
        page_size: parseInt(page_size),
        records: result.rows.map(row => ({
          id: row.id,
          charger_id: row.charger_id,
          campsite_name: row.campsite_name,
          start_time: row.start_time,
          end_time: row.end_time,
          energy_kwh: parseFloat(row.energy_kwh),
          max_power_w: row.max_power_w,
          avg_power_w: row.avg_power_w,
          total_amount: row.total_amount,
          payment_token: row.payment_token,
          on_chain: row.on_chain,
          chain_tx_hash: row.chain_tx_hash
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 提交充电数据供预言机验证
 */
async function verifyCharging(req, res, next) {
  try {
    const { charging_id, oracle_signature } = req.body;
    
    const recordResult = await pgPool.query(
      'SELECT * FROM charging_records WHERE id = $1 AND user_id = $2',
      [charging_id, req.userId]
    );
    
    if (recordResult.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.CHARGING_NOT_FOUND,
        message: '充电记录不存在'
      });
    }
    
    const record = recordResult.rows[0];
    
    if (record.on_chain) {
      return res.json({
        code: 0,
        message: '该记录已上链',
        data: {
          verified: true,
          chain_tx_hash: record.chain_tx_hash
        }
      });
    }
    
    // 提交绿电奖励
    const result = await submitEnergyRecord(
      req.userId,
      charging_id,
      record.energy_kwh * 1000,
      '霍尔果斯',
      oracle_signature || 'simulated_signature'
    );
    
    // 更新充电记录
    await pgPool.query(`
      UPDATE charging_records SET on_chain = true, chain_tx_hash = $1, chain_record_id = $2
      WHERE id = $3
    `, [result.txHash, result.recordId, charging_id]);
    
    res.json({
      code: 0,
      message: '验证成功',
      data: {
        verified: true,
        record_id: result.recordId,
        energy_kwh: result.energyKwh,
        reward_eaco: result.rewardEaco,
        co2_kg: result.co2Kg,
        tx_hash: result.txHash,
        minted: result.minted
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取验证状态
 */
async function getVerifyStatus(req, res, next) {
  try {
    const { charging_id } = req.query;
    
    const result = await pgPool.query(
      'SELECT on_chain, chain_tx_hash, chain_record_id FROM charging_records WHERE id = $1 AND user_id = $2',
      [charging_id, req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        code: ERRORS.CHARGING_NOT_FOUND,
        message: '充电记录不存在'
      });
    }
    
    const record = result.rows[0];
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        charging_id,
        on_chain: record.on_chain,
        chain_tx_hash: record.chain_tx_hash,
        chain_record_id: record.chain_record_id
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  startCharging,
  getCurrentCharging,
  stopCharging,
  getChargingHistory,
  verifyCharging,
  getVerifyStatus
};