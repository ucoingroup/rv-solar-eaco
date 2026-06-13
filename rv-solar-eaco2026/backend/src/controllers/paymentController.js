/**
 * 支付控制器
 */
const { executePayment, refundPayment, getSupportedTokensList, getExchangeRate } = require('../services/paymentService');
const { ERRORS } = require('../config/constants');

/**
 * 创建支付意图
 */
async function createIntent(req, res, next) {
  try {
    const { order_id, payment_token } = req.body;
    
    res.json({
      code: 0,
      message: '支付意图已创建',
      data: {
        order_id,
        payment_token,
        intent_created: true,
        note: '客户端应调用execute接口完成支付'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 执行支付
 */
async function executePaymentHandler(req, res, next) {
  try {
    const { order_id, payment_token, wallet_address } = req.body;
    
    const result = await executePayment(
      req.userId,
      order_id,
      payment_token,
      wallet_address || req.user.wallet_address
    );
    
    res.json({
      code: 0,
      message: '支付成功',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取支付状态
 */
async function getPaymentStatus(req, res, next) {
  try {
    const { id } = req.params;
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        payment_id: id,
        status: 'completed'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 申请退款
 */
async function refundPaymentHandler(req, res, next) {
  try {
    const { id } = req.params;
    
    const result = await refundPayment(req.userId, id);
    
    res.json({
      code: 0,
      message: '退款申请成功',
      data: result
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取支持的代币列表
 */
async function getSupportedTokens(req, res, next) {
  try {
    const tokens = getSupportedTokensList();
    
    res.json({
      code: 0,
      message: 'success',
      data: {
        tokens,
        default_token: 'EACO'
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * 获取实时汇率
 */
async function getExchangeRateHandler(req, res, next) {
  try {
    const { token = 'USDT', base = 'USD' } = req.query;
    
    const rate = await getExchangeRate(token, base);
    
    res.json({
      code: 0,
      message: 'success',
      data: rate
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createIntent,
  executePayment: executePaymentHandler,
  getPaymentStatus,
  refundPayment: refundPaymentHandler,
  getSupportedTokens,
  getExchangeRate: getExchangeRateHandler
};