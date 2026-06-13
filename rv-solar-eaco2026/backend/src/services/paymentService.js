/**
 * 支付服务
 */
const axios = require('axios');
const { getTokenBalance, transferToken } = require('./solanaService');
const { pgPool } = require('../config/database');
const { supportedTokens, eacoDiscount } = require('../config/secrets');
const { ERRORS } = require('../config/constants');

/**
 * 获取支持的所有代币列表
 */
function getSupportedTokensList() {
  return supportedTokens.map(token => ({
    symbol: token,
    name: getTokenName(token),
    decimals: token === 'EACO' ? 6 : getTokenDecimals(token),
    icon: `/icons/${token.toLowerCase()}.png`,
    discount: token === 'EACO' ? eacoDiscount : 1
  }));
}

function getTokenName(symbol) {
  const names = {
    EACO: 'EACO Token',
    USDT: 'Tether USD',
    USDC: 'USD Coin',
    SOL: 'Solana',
    WBNB: 'Wrapped BNB'
  };
  return names[symbol] || symbol;
}

function getTokenDecimals(symbol) {
  if (symbol === 'EACO') return 6;
  if (symbol === 'USDT' || symbol === 'USDC') return 6;
  if (symbol === 'SOL') return 9;
  if (symbol === 'WBNB') return 18;
  return 6;
}

/**
 * 获取实时汇率
 */
async function getExchangeRate(token, baseCurrency = 'USD') {
  // 实际从交易所API获取
  // 这里返回模拟汇率
  const rates = {
    USDT: 1.0,
    USDC: 1.0,
    SOL: 150.0,
    WBNB: 600.0,
    EACO: 0.01, // 假设EACO对USD价格
    USD: 1.0
  };
  
  return {
    token,
    baseCurrency,
    rate: rates[token] || 1.0,
    updatedAt: new Date().toISOString()
  };
}

/**
 * 计算支付金额
 */
function calculatePaymentAmount(amountUsdCents, paymentToken, exchangeRate) {
  const rate = exchangeRate || 1.0;
  let amountInToken = Math.ceil(amountUsdCents * rate / 100);
  
  // EACO支付享9折
  if (paymentToken === 'EACO') {
    return {
      amount: Math.ceil(amountInToken * eacoDiscount),
      originalAmount: amountInToken,
      discount: eacoDiscount,
      discountReason: 'EACO_PAYMENT_DISCOUNT'
    };
  }
  
  return {
    amount: amountInToken,
    originalAmount: amountInToken,
    discount: 1,
    discountReason: null
  };
}

/**
 * 执行支付
 */
async function executePayment(userId, orderId, paymentToken, walletAddress) {
  // 1. 获取订单信息
  const orderResult = await pgPool.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  
  if (orderResult.rows.length === 0) {
    throw { code: ERRORS.ORDER_NOT_FOUND, message: '订单不存在' };
  }
  
  const order = orderResult.rows[0];
  
  if (order.payment_status !== 'pending') {
    throw { code: ERRORS.ORDER_STATUS_ERROR, message: '订单状态不允许支付' };
  }
  
  // 2. 计算金额
  const exchangeRate = await getExchangeRate(paymentToken);
  const paymentCalc = calculatePaymentAmount(order.amount_usd_cents, paymentToken, exchangeRate.rate);
  
  // 3. 验证余额 (简化版，实际应查链上余额)
  // const balance = await getTokenBalance(walletAddress);
  // if (BigInt(balance) < BigInt(paymentCalc.amount)) {
  //   throw { code: ERRORS.BALANCE_INSUFFICIENT, message: '余额不足' };
  // }
  
  // 4. 执行链上转账 (模拟)
  const txResult = await transferToken(
    { secretKey: walletAddress }, // 实际需要使用用户私钥签名
    walletAddress,
    paymentCalc.amount
  );
  
  // 5. 更新订单状态
  await pgPool.query(`
    UPDATE orders SET
      payment_token = $1,
      payment_status = 'paid',
      payment_tx_hash = $2,
      discount_applied = $3,
      discount_reason = $4,
      paid_at = NOW(),
      updated_at = NOW()
    WHERE id = $5
  `, [paymentToken, txResult.txHash, paymentCalc.discount < 1, paymentCalc.discountReason, orderId]);
  
  return {
    orderId,
    paymentStatus: 'paid',
    txHash: txResult.txHash,
    amount: {
      token: paymentToken,
      amount: paymentCalc.amount,
      originalAmount: paymentCalc.originalAmount,
      discountApplied: paymentCalc.discount < 1,
      amountUsd: order.amount_usd_cents / 100
    }
  };
}

/**
 * 申请退款
 */
async function refundPayment(userId, orderId) {
  // 1. 获取订单
  const orderResult = await pgPool.query(
    'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
    [orderId, userId]
  );
  
  if (orderResult.rows.length === 0) {
    throw { code: ERRORS.ORDER_NOT_FOUND, message: '订单不存在' };
  }
  
  const order = orderResult.rows[0];
  
  // 2. 验证订单状态
  if (order.payment_status !== 'paid') {
    throw { code: ERRORS.ORDER_STATUS_ERROR, message: '只有已支付的订单才能退款' };
  }
  
  // 3. 验证退款时限 (24小时)
  const paidAt = new Date(order.paid_at);
  const now = new Date();
  const hoursDiff = (now - paidAt) / (1000 * 60 * 60);
  
  if (hoursDiff > 24) {
    throw { code: ERRORS.ORDER_STATUS_ERROR, message: '超过24小时退款时限' };
  }
  
  // 4. 执行退款
  const refundTxHash = `refund_${Date.now()}`;
  
  await pgPool.query(`
    UPDATE orders SET
      payment_status = 'refunded',
      refund_tx_hash = $1,
      cancelled_at = NOW(),
      updated_at = NOW()
    WHERE id = $2
  `, [refundTxHash, orderId]);
  
  return {
    orderId,
    paymentStatus: 'refunded',
    refundTxHash
  };
}

module.exports = {
  getSupportedTokensList,
  getExchangeRate,
  calculatePaymentAmount,
  executePayment,
  refundPayment
};