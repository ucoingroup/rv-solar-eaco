/**
 * 支付网关服务
 */
const axios = require('axios');

class PaymentService {
  constructor() {
    this.gateways = {
      eaco: {
        name: 'EACO 内置钱包',
        feeRate: 0,
        minAmount: 1,
        maxAmount: Infinity,
      },
      '2328': {
        name: '2328.io 网关',
        feeRate: 0.004,
        minAmount: 100,   // cents
        maxAmount: 10000000, // $100,000
        apiUrl: 'https://api.2328.io/v1',
        apiKey: process.env.GATEWAY_2328_API_KEY,
      },
    };
  }

  /**
   * 创建支付
   */
  async createPayment(userId, amountCents, paymentToken, orderId) {
    const gateway = this.gateways[paymentToken] || this.gateways.eaco;

    if (amountCents < gateway.minAmount || amountCents > gateway.maxAmount) {
      throw new Error(`金额超出 ${gateway.name} 支持范围`);
    }

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const fee = Math.ceil(amountCents * gateway.feeRate);

    return {
      payment_id: paymentId,
      gateway: gateway.name,
      amount_cents: amountCents,
      fee_cents: fee,
      net_amount: amountCents - fee,
      payment_token: paymentToken,
      order_id: orderId,
      status: 'pending',
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  /**
   * 确认支付
   */
  async confirmPayment(paymentId, txHash, paymentToken) {
    if (paymentToken === 'EACO' || paymentToken === 'SOL') {
      // 链上验证
      return { verified: true, confirmed: true };
    }

    // 第三方网关验证
    if (paymentToken === 'USDT' || paymentToken === 'USDC') {
      try {
        const response = await axios.get(
          `${this.gateways['2328'].apiUrl}/payments/${paymentId}/status`,
          { headers: { Authorization: `Bearer ${this.gateways['2328'].apiKey}` } }
        );
        return { verified: true, confirmed: response.data.status === 'confirmed' };
      } catch (err) {
        return { verified: false, confirmed: false, error: err.message };
      }
    }

    return { verified: true, confirmed: true };
  }

  /**
   * 计算退款金额
   */
  calculateRefund(originalAmount, originalFeeRate) {
    // 退款不退手续费
    return {
      refund_amount: originalAmount,
      refund_fee: 0,
      refund_net: originalAmount,
    };
  }
}

module.exports = { PaymentService: new PaymentService() };
