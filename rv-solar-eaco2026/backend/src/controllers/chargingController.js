/**
 * 充电控制器
 */
const { pool } = require('../config/database');
const { SolanaService } = require('../services/solanaService');
const { RelayService } = require('../services/relayService');

// 开始充电
async function startCharging(req, res) {
  try {
    const userId = req.user.user_id;
    const { charger_id } = req.body;

    // 检查充电桩是否在线
    const [charger] = await pool.query(
      `SELECT c.*, cs.name as campsite_name FROM chargers c
       LEFT JOIN campsites cs ON c.campsite_id = cs.id
       WHERE c.charger_id = $1`,
      [charger_id]
    );

    if (charger.length === 0) {
      return res.status(404).json({ code: 50001, message: '充电桩不存在' });
    }

    if (charger[0].status !== 'online') {
      return res.status(400).json({ code: 50001, message: '充电桩离线' });
    }

    // 检查是否有正在进行的充电
    const [active] = await pool.query(
      `SELECT * FROM charging_sessions WHERE user_id = $1 AND status = $2`,
      [userId, 'charging']
    );

    if (active.length > 0) {
      return res.status(400).json({ code: 50002, message: '已有正在进行的充电会话' });
    }

    // 创建充电会话
    const sessionId = `SES-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    await pool.query(
      `INSERT INTO charging_sessions (session_id, user_id, charger_id, campsite_id, status, start_time)
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [sessionId, userId, charger_id, charger[0].campsite_id, 'charging']
    );

    // 更新充电桩状态
    await pool.query(
      `UPDATE chargers SET status = $1, current_user_id = $2 WHERE charger_id = $3`,
      ['in_use', userId, charger_id]
    );

    // 通过 Relay 通知硬件开始供电
    await RelayService.startCharging(charger_id, sessionId);

    // Socket.IO 通知
    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('charging_started', {
      session_id: sessionId,
      charger_id,
      start_time: new Date().toISOString(),
    });

    res.json({
      code: 0,
      message: '充电已开始',
      data: {
        session_id: sessionId,
        charger_id,
        charger_name: charger[0].name,
        campsite_name: charger[0].campsite_name,
        start_time: new Date().toISOString(),
        status: 'charging',
      },
    });
  } catch (error) {
    console.error('开始充电失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 停止充电
async function stopCharging(req, res) {
  try {
    const userId = req.user.user_id;
    const { session_id } = req.body;

    // 获取充电会话
    const [session] = await pool.query(
      `SELECT * FROM charging_sessions WHERE session_id = $1 AND user_id = $2 AND status = $3`,
      [session_id, userId, 'charging']
    );

    if (session.length === 0) {
      return res.status(404).json({ code: 50003, message: '充电会话不存在' });
    }

    // 通过 Relay 获取最终发电量
    const energyData = await RelayService.stopCharging(session[0].charger_id, session_id);
    const energyKwh = energyData.energy_kwh || 0;
    const duration = energyData.duration || 0;

    // 更新充电会话
    await pool.query(
      `UPDATE charging_sessions SET
        status = $1, end_time = NOW(), energy_kwh = $2, duration_seconds = $3
       WHERE session_id = $4`,
      ['completed', energyKwh, duration, session_id]
    );

    // 释放充电桩
    await pool.query(
      `UPDATE chargers SET status = 'online', current_user_id = NULL WHERE charger_id = $1`,
      [session[0].charger_id]
    );

    // 计算奖励并上链
    const rewardResult = await SolanaService.distributeReward(userId, energyKwh, session_id);

    // 获取营地价格计算费用
    const [charger] = await pool.query(
      'SELECT c.price_per_kwh, cs.price_per_kwh as campsite_price FROM chargers c LEFT JOIN campsites cs ON c.campsite_id = cs.id WHERE c.charger_id = $1',
      [session[0].charger_id]
    );
    const pricePerKwh = charger[0]?.campsite_price || 0.5;
    const totalCost = energyKwh * pricePerKwh;

    // Socket.IO 通知
    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('charging_completed', {
      session_id,
      energy_kwh: energyKwh,
      duration_seconds: duration,
      reward_tx: rewardResult.txHash,
      total_cost: totalCost,
    });

    res.json({
      code: 0,
      message: '充电已完成',
      data: {
        session_id,
        energy_kwh: energyKwh,
        duration_seconds: duration,
        duration_formatted: `${Math.floor(duration / 60)}分${duration % 60}秒`,
        total_cost: totalCost.toFixed(2),
        reward_amount: rewardResult.rewardAmount,
        reward_tx: rewardResult.txHash,
        co2_saved_kg: (energyKwh * 0.5).toFixed(2), // 约0.5kg CO2/kWh
      },
    });
  } catch (error) {
    console.error('停止充电失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取充电记录
async function getChargingHistory(req, res) {
  try {
    const userId = req.user.user_id;
    const { page = 1, page_size = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(page_size);

    const [rows] = await pool.query(
      `SELECT cs.*, c.name as charger_name, c.charger_type,
              ca.name as campsite_name, ca.address as campsite_address
       FROM charging_sessions cs
       LEFT JOIN chargers c ON cs.charger_id = c.charger_id
       LEFT JOIN campsites ca ON cs.campsite_id = ca.id
       WHERE cs.user_id = $1
       ORDER BY cs.start_time DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(page_size), offset]
    );

    const sessions = rows.map((s) => ({
      session_id: s.session_id,
      charger_id: s.charger_id,
      charger_name: s.charger_name,
      charger_type: s.charger_type,
      campsite_name: s.campsite_name,
      campsite_address: s.campsite_address,
      status: s.status,
      start_time: s.start_time,
      end_time: s.end_time,
      energy_kwh: s.energy_kwh ? parseFloat(s.energy_kwh) : null,
      duration_seconds: s.duration_seconds,
      reward_tx: s.reward_tx,
    }));

    res.json({
      code: 0,
      message: 'success',
      data: { list: sessions },
    });
  } catch (error) {
    console.error('获取充电记录失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取实时充电状态
async function getChargingStatus(req, res) {
  try {
    const userId = req.user.user_id;

    const [session] = await pool.query(
      `SELECT cs.*, c.name as charger_name, ca.name as campsite_name
       FROM charging_sessions cs
       LEFT JOIN chargers c ON cs.charger_id = c.charger_id
       LEFT JOIN campsites ca ON cs.campsite_id = ca.id
       WHERE cs.user_id = $1 AND cs.status = $2`,
      [userId, 'charging']
    );

    if (session.length === 0) {
      return res.json({
        code: 0,
        message: 'success',
        data: { status: 'idle', session: null },
      });
    }

    // 获取实时数据
    const realTimeData = await RelayService.getRealTimeData(session[0].charger_id);

    res.json({
      code: 0,
      message: 'success',
      data: {
        status: 'charging',
        session: {
          session_id: session[0].session_id,
          charger_name: session[0].charger_name,
          campsite_name: session[0].campsite_name,
          start_time: session[0].start_time,
          current_power_kw: realTimeData.power_kw,
          current_voltage: realTimeData.voltage,
          current_ampere: realTimeData.ampere,
          total_energy_kwh: realTimeData.energy_kwh,
          elapsed_seconds: Math.floor((Date.now() - new Date(session[0].start_time)) / 1000),
        },
      },
    });
  } catch (error) {
    console.error('获取充电状态失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

module.exports = {
  startCharging,
  stopCharging,
  getChargingHistory,
  getChargingStatus,
};
