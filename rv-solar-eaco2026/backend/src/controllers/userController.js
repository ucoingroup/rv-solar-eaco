/**
 * 用户控制器
 */
const { pgPool } = require('../config/database');
const { getTokenBalance } = require('../services/solanaService');
const { getUserEnergyRecords, getUserCarbonAccount } = require('../services/rewardService');

/**
 * 获取当前用户信息
 */
async function getMe(req, res, next) {
  try {
    const user = req.user;
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        id: user.id,
        phone_code: user.phone_code,
        phone_number: user.phone_number.substring(0, 3) + '****' + user.phone_number.substring(user.phone_number.length - 4),
        nickname: user.nickname,
        wallet_address: user.wallet_address,
        user_level: user.user_level,
        language: user.language,
        kyc_status: user.kyc_status,
        total_energy_kwh: user.total_energy_kwh / 1000,
        total_reward_eaco: user.total_reward_eaco,
        created_at: user.created_at
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 更新用户资料
 */
async function updateMe(req, res, next) {
  try {
    const { nickname, avatar_url, language } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (nickname !== undefined) {
      updates.push(`nickname = $${paramCount++}`);
      values.push(nickname);
    }
    if (avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramCount++}`);
      values.push(avatar_url);
    }
    if (language !== undefined) {
      updates.push(`language = $${paramCount++}`);
      values.push(language);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        code: 10001,
        message: '没有需要更新的字段'
      });
    }
    
    updates.push(`updated_at = NOW()`);
    values.push(req.userId);
    
    const result = await pgPool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );
    
    const updatedUser = result.rows[0];
    
    res.json({
      code: 0,
      message: '更新成功',
      data: {
        id: updatedUser.id,
        nickname: updatedUser.nickname,
        avatar_url: updatedUser.avatar_url,
        language: updatedUser.language
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户钱包信息
 */
async function getWallet(req, res, next) {
  try {
    const user = req.user;
    
    // 获取链上余额 (模拟)
    const eacoBalance = await getTokenBalance(user.wallet_address);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        address: user.wallet_address,
        balances: [
          {
            token: 'EACO',
            balance: user.total_reward_eaco,
            in_usd: (user.total_reward_eaco * 0.01).toFixed(2)
          },
          {
            token: 'USDT',
            balance: 0,
            in_usd: '0.00'
          },
          {
            token: 'USDC',
            balance: 0,
            in_usd: '0.00'
          },
          {
            token: 'SOL',
            balance: 0,
            in_usd: '0.00'
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 创建新钱包
 */
async function createWallet(req, res, next) {
  try {
    res.json({
      code: 0,
      message: '钱包创建功能开发中',
      data: {
        note: '请联系客服创建新钱包'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取绿电记录
 */
async function getEnergyRecords(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = Math.min(parseInt(req.query.page_size) || 20, 100);
    
    const result = await getUserEnergyRecords(req.userId, page, pageSize);
    
    res.json({
      code: 0,
      message: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取碳积分账户
 */
async function getCarbonAccount(req, res, next) {
  try {
    const account = await getUserCarbonAccount(req.userId);
    
    res.json({
      code: 0,
      message: 'success',
      data: account
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取用户持有的NFT
 */
async function getNFTs(req, res, next) {
  try {
    const result = await pgPool.query(`
      SELECT nft_mint, created_at
      FROM green_energy_records
      WHERE user_id = $1 AND nft_mint IS NOT NULL
      ORDER BY created_at DESC
    `, [req.userId]);
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        total: result.rows.length,
        nfts: result.rows.map(row => ({
          mint: row.nft_mint,
          createdAt: row.created_at
        }))
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMe,
  updateMe,
  getWallet,
  createWallet,
  getEnergyRecords,
  getCarbonAccount,
  getNFTs
};