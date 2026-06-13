/**
 * 奖励分发服务
 */
const { pool } = require('../config/database');
const { SolanaService } = require('./solanaService');

class RewardService {
  // EACO 奖励率：每 kWh 奖励数量
  REWARD_RATE_PER_KWH = 1000; // 1000 EACO / kWh

  // 碳积分率：每 kWh 产生碳积分
  CARBON_RATE_PER_KWH = 0.5; // 0.5 kg CO2 / kWh

  /**
   * 分发绿电奖励
   */
  async distributeGreenEnergyReward(userId, energyKwh, chargingSessionId) {
    const rewardAmount = Math.floor(energyKwh * this.REWARD_RATE_PER_KWH);
    const carbonKg = energyKwh * this.CARBON_RATE_PER_KWH;

    // 链上交易
    const txResult = await SolanaService.distributeReward(userId, energyKwh);

    // 记录到数据库
    await pool.query(
      `INSERT INTO reward_records (user_id, charging_session_id, reward_type, reward_amount, energy_kwh, carbon_kg, tx_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, chargingSessionId, 'green_energy', rewardAmount, energyKwh, carbonKg, txResult.txHash]
    );

    // 更新用户碳积分
    await pool.query(
      `UPDATE carbon_accounts
       SET total_co2_kg = total_co2_kg + $1,
           available_co2_kg = available_co2_kg + $1,
           total_energy_kwh = total_energy_kwh + $2
       WHERE user_id = $3`,
      [carbonKg, energyKwh, userId]
    );

    // 检查是否需要创建碳积分账户
    const [account] = await pool.query('SELECT id FROM carbon_accounts WHERE user_id = $1', [userId]);
    if (account.length === 0) {
      await pool.query(
        `INSERT INTO carbon_accounts (user_id, total_co2_kg, available_co2_kg, redeemed_co2_kg)
         VALUES ($1, $2, $2, 0)`,
        [userId, carbonKg]
      );
    }

    return {
      reward_amount: rewardAmount,
      carbon_kg: carbonKg,
      tx_hash: txResult.txHash,
    };
  }

  /**
   * 分发社区贡献奖励
   */
  async distributeContributionReward(userId, contributionId, contributionType) {
    const CONTRIBUTION_REWARDS = {
      road_condition: { base: 500, carbon: 0.1 },
      camp_info: { base: 1000, carbon: 0.2 },
      rescue: { base: 5000, carbon: 1.0 },
      device_tip: { base: 500, carbon: 0.05 },
      review: { base: 200, carbon: 0.05 },
      photo_share: { base: 100, carbon: 0.02 },
    };

    const reward = CONTRIBUTION_REWARDS[contributionType] || { base: 100, carbon: 0.01 };

    const txResult = await SolanaService.submitOnChainTransaction('contribution_reward', {
      user_id: userId,
      contribution_id: contributionId,
      amount: reward.base,
    });

    await pool.query(
      `INSERT INTO reward_records (user_id, contribution_id, reward_type, reward_amount, carbon_kg, tx_hash)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, contributionId, 'contribution', reward.base, reward.carbon, txResult.txHash]
    );

    return {
      reward_amount: reward.base,
      carbon_kg: reward.carbon,
      tx_hash: txResult.txHash,
    };
  }

  /**
   * 获取用户累计奖励
   */
  async getUserTotalRewards(userId) {
    const [result] = await pool.query(
      `SELECT
        COALESCE(SUM(reward_amount) FILTER (WHERE reward_type = 'green_energy'), 0) as green_energy_rewards,
        COALESCE(SUM(reward_amount) FILTER (WHERE reward_type = 'contribution'), 0) as contribution_rewards,
        COALESCE(SUM(carbon_kg), 0) as total_carbon_kg,
        COUNT(*) as total_transactions
       FROM reward_records WHERE user_id = $1`,
      [userId]
    );

    return {
      green_energy_rewards: parseFloat(result[0].green_energy_rewards) || 0,
      contribution_rewards: parseFloat(result[0].contribution_rewards) || 0,
      total_rewards: parseFloat(result[0].green_energy_rewards) + parseFloat(result[0].contribution_rewards),
      total_carbon_kg: parseFloat(result[0].total_carbon_kg) || 0,
      total_transactions: parseInt(result[0].total_transactions) || 0,
    };
  }

  /**
   * 获取奖励历史
   */
  async getRewardHistory(userId, page = 1, pageSize = 20) {
    const offset = (parseInt(page) - 1) * parseInt(pageSize);

    const [rows] = await pool.query(
      `SELECT * FROM reward_records
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(pageSize), offset]
    );

    return rows.map((r) => ({
      id: r.id,
      reward_type: r.reward_type,
      reward_amount: parseFloat(r.reward_amount),
      energy_kwh: r.energy_kwh ? parseFloat(r.energy_kwh) : null,
      carbon_kg: r.carbon_kg ? parseFloat(r.carbon_kg) : null,
      tx_hash: r.tx_hash,
      created_at: r.created_at,
    }));
  }
}

module.exports = { RewardService: new RewardService() };
