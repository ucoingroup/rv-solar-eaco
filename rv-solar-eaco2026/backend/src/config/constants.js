/**
 * 全局常量
 */
module.exports = {
  // 错误码
  ERRORS: {
    SUCCESS: 0,
    INVALID_PARAMS: 10001,
    SIGNATURE_INVALID: 10002,
    TOKEN_EXPIRED: 10003,
    USER_NOT_FOUND: 20001,
    WALLET_EXISTS: 20002,
    CAMP_NOT_FOUND: 30001,
    CAMP_FULL: 30002,
    DATE_NOT_AVAILABLE: 30003,
    ORDER_NOT_FOUND: 40001,
    ORDER_STATUS_ERROR: 40002,
    PAYMENT_TIMEOUT: 40003,
    BALANCE_INSUFFICIENT: 40004,
    PAYMENT_FAILED: 40005,
    CHARGER_OFFLINE: 50001,
    CHARGING_IN_PROGRESS: 50002,
    CHARGING_NOT_FOUND: 50003,
    ORACLE_SIGNATURE_INVALID: 60001,
    REWARD_POOL_EMPTY: 60002
  },

  // 用户等级
  USER_LEVELS: {
    NORMAL: 1,
    AMBASSADOR: 2,
    CORE: 3
  },

  // KYC状态
  KYC_STATUS: {
    NONE: 'none',
    PENDING: 'pending',
    VERIFIED: 'verified'
  },

  // 订单状态
  ORDER_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // 支付状态
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // 充电状态
  CHARGING_STATUS: {
    IDLE: 'idle',
    CHARGING: 'charging',
    COMPLETED: 'completed',
    ERROR: 'error'
  },

  // 贡献类型
  CONTRIBUTION_TYPES: {
    ROAD_CONDITION: 'road_condition',
    CAMP_INFO: 'camp_info',
    RESCUE: 'rescue',
    DEVICE_TIP: 'device_tip',
    REVIEW: 'review',
    PHOTO_SHARE: 'photo_share'
  },

  // 贡献奖励 (EACO最小单位)
  CONTRIBUTION_REWARDS: {
    road_condition: { min: 500, max: 2000 },
    camp_info: { min: 2000, max: 5000 },
    rescue: { min: 3000, max: 10000 },
    device_tip: { min: 1000, max: 3000 },
    review: { min: 500, max: 1500 },
    photo_share: { min: 300, max: 1000 }
  },

  // 口岸优先级
  PORT_PRIORITY: {
    Khorgos: 1,       // 霍尔果斯
    Mohan: 2,         // 磨丁
    Khunjrab: 3,      // 红其拉甫
    Zabaykalsk: 4,    // 外贝加尔斯克
    ZaminUd: 5        // 扎门乌德
  },

  // 国家代码
  COUNTRY_CODES: {
    KZ: 'Kazakhstan',
    LK: 'Laos',
    PK: 'Pakistan',
    RU: 'Russia',
    MN: 'Mongolia',
    CN: 'China'
  }
};