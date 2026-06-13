/**
 * 密钥与配置
 */
module.exports = {
  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    accessExpiresIn: '30d',
    refreshExpiresIn: '90d'
  },

  // EACO代币配置
  eaco: {
    contractAddress: process.env.EACO_CONTRACT_ADDRESS || 'DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH',
    decimals: 6, // EACO最小单位
    mintDecimals: 6
  },

  // 奖励配置
  reward: {
    ratePerKwh: 1000, // 每kWh奖励1000最小单位EACO (0.001 EACO)
    minEnergyWh: 100, // 最小发电量门槛 (Wh)
    poolPDA: process.env.REWARD_POOL_PDA || ''
  },

  // 支付网关配置 (2328.io)
  payment: {
    apiKey: process.env.PAYMENT_API_KEY || '',
    apiSecret: process.env.PAYMENT_API_SECRET || '',
    baseUrl: process.env.PAYMENT_BASE_URL || 'https://api.2328.io'
  },

  // 预言机配置
  oracle: {
    publicKey: process.env.ORACLE_PUBLIC_KEY || '',
    privateKey: process.env.ORACLE_PRIVATE_KEY || ''
  },

  // 支付代币白名单
  supportedTokens: ['EACO', 'USDT', 'USDC', 'SOL', 'WBNB'],

  // EACO支付折扣
  eacoDiscount: 0.9, // 9折

  // 退款政策
  refund: {
    freeWindowHours: 24,
    expiryHours: 72
  }
};