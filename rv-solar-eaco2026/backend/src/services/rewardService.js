/**
 * 绿电奖励服务
 */
const { pgPool } = require('../config/database');
const { reward } = require('../config/secrets');
const { ERRORS } = require('../config/constants');
const { submitOnChainTransaction, verifyOracleSignature } = require('./solanaService');

/**
 * 提交发电记录并发放奖励
 */
async function submitEnergyRecord(userId, chargingId, energyKwh, location, oracleSignature) {
  // 1. 验证发电量
  if (energyKwh < reward.minEnergyWh) {
    throw { code: ERRORS.INVALID_PARAMS, message: `发电量低于最低门槛 ${reward.minEnergyWh}Wh` };
  }
  
  // 2. 检查是否已申领
  const existingResult = await pgPool.query(
    'SELECT id FROM green_energy_records WHERE charging_id = $1',
    [chargingId]
  );
  
  if (existingResult.rows.length > 0) {
    throw { code: ERRORS.INVALID_PARAMS, message: '该充电记录已申领奖励' };
  }
  
  // 3. 验证预言机签名
  const signatureValid = await verifyOracleSignature(
    { userId, chargingId, energyKwh, location },
    oracleSignature,
    reward.oraclePublicKey
  );
  
  if (!signatureValid.valid) {
    throw { code: ERRORS.ORACLE_SIGNATURE_INVALID, message: '预言机签名验证失败' };
  }
  
  // 4. 计算奖励
  // ratePerKwh: 每kWh奖励数量(最小单位)
  const rewardAmount = Math.floor((energyKwh / 1000) * reward.ratePerKwh);
  
  // 5. 提交链上交易
  const chainResult = await submitOnChainTransaction('reward', {
    userId,
    chargingId,
    energyKwh,
    rewardAmount,
    location
  });
  
  // 6. 写入绿电记录
  const recordResult = await pgPool.query(`
    INSERT INTO green_energy_records (
      user_id, charging_id, energy_kwh, location, 
      oracle_address, oracle_signature, verified, verified_at,
      reward_eaco, reward_tx_hash, created_at
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,NOW(),$8,$9,NOW())
    RETURNING id
  `, [userId, chargingId, Math.floor(energyKwh), location, reward.oraclePublicKey, oracleSignature, true, rewardAmount, chainResult.txHash]);
  
  const recordId = recordResult.rows[0].id;
  
  // 7. 更新用户累计
  await pgPool.query(`
    UPDATE users SET 
      total_energy_kwh = total_energy_kwh + $1,
      total_reward_eaco = total_reward_eaco + $2,
      updated_at = NOW()
    WHERE id = $3
  `, [Math.floor(energyKwh), rewardAmount, userId]);
  
  // 8. 写入碳积分
  const co2Kg = energyKwh * 50 / 1000; // 每kWh ≈ 0.5kg CO₂
  
  // 检查或创建碳积分账户
  await pgPool.query(`
    INSERT INTO carbon_accounts (user_id, total_co2_kg, available_co2_kg, last_updated)
    VALUES ($1, $2, $2, NOW())
    ON CONFLICT (user_id) DO UPDATE SET
      total_co2_kg = carbon_accounts.total_co2_kg + $2,
      available_co2_kg = carbon_accounts.available_co2_kg + $2,
      last_updated = NOW()
  `, [userId, co2Kg]);
  
  // 碳积分交易记录
  await pgPool.query(`
    INSERT INTO carbon_transactions (user_id, carbon_account_id, change_kg, balance_after, source, ref_id)
    SELECT $1, id, $2, available_co2_kg, 'charging_reward', $3
    FROM carbon_accounts WHERE user_id = $1
  `, [userId, co2Kg, recordId]);
  
  return {
    recordId,
    energyKwh,
    rewardEaco: rewardAmount,
    co2Kg,
    verified: true,
    txHash: chainResult.txHash,
    minted: energyKwh >= 10000 // ≥10kWh铸造NFT
  };
}

/**
 * 获取用户绿电记录列表
 */
async function getUserEnergyRecords(userId, page = 1, pageSize = 20) {
  const offset = (page - 1) * pageSize;
  
  const result = await pgPool.query(`
    SELECT 
      r.id, r.energy_kwh, r.location, r.verified, r.reward_eaco,
      r.reward_tx_hash, r.nft_mint, r.created_at,
      c.start_time as charging_start, c.end_time as charging_end
    FROM green_energy_records r
    LEFT JOIN charging_records c ON r.charging_id = c.id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    LIMIT $2 OFFSET $3
  `, [userId, pageSize, offset]);
  
  const countResult = await pgPool.query(
    'SELECT COUNT(*) FROM green_energy_records WHERE user_id = $1',
    [userId]
  );
  
  return {
    total: parseInt(countResult.rows[0].count),
    page,
    pageSize,
    records: result.rows.map(row => ({
      id: row.id,
      energyKwh: row.energy_kwh / 1000,
      location: row.location,
      verified: row.verified,
      rewardEaco: row.reward_eaco,
      txHash: row.reward_tx_hash,
      nftMint: row.nft_mint,
      createdAt: row.created_at
    }))
  };
}

/**
 * 获取用户碳积分账户
 */
async function getUserCarbonAccount(userId) {
  const result = await pgPool.query(
    'SELECT * FROM carbon_accounts WHERE user_id = $1',
    [userId]
  );
  
  if (result.rows.length === 0) {
    return {
      userId,
      totalCo2Kg: 0,
      availableCo2Kg: 0,
      redeemedCo2Kg: 0
    };
  }
  
  const account = result.rows[0];
  return {
    userId,
    totalCo2Kg: parseFloat(account.total_co2_kg),
    availableCo2Kg: parseFloat(account.available_co2_kg),
    redeemedCo2Kg: parseFloat(account.redeemed_co2_kg)
  };
}

module.exports = {
  submitEnergyRecord,
  getUserEnergyRecords,
  getUserCarbonAccount
};