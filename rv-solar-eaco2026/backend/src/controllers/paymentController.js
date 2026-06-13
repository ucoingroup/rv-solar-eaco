/**
 * 支付控制器
 */
const { pool } = require('../config/database');
const { SolanaService } = require('../services/solanaService');

// 创建支付订单
async function createPayment(req, res) {
  try {
    const userId = req.user.user_id;
    const { order_id, payment_token = 'EACO', amount_cents } = req.body;

    // 获取订单信息
    const [order] = await pool.query(
      'SELECT * FROM orders WHERE order_id = $1 AND user_id = $2',
      [order_id, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ code: 40001, message: '订单不存在' });
    }

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const amount = parseFloat(order[0].total_price) * 100; // 转为分

    await pool.query(
      `INSERT INTO payments (payment_id, user_id, order_id, amount_cents, payment_token, status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [paymentId, userId, order_id, amount_cents || amount, payment_token, 'pending']
    );

    // Socket.IO 通知客户端待支付
    const io = req.app.get('io');
    io.to(`user:${userId}`).emit('payment_created', { payment_id: paymentId, order_id });

    res.json({
      code: 0,
      message: '支付订单已创建',
      data: {
        payment_id: paymentId,
        order_id,
        amount_cents: amount_cents || amount,
        payment_token,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30分钟有效
      },
    });
  } catch (error) {
    console.error('创建支付失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 完成支付
async function completePayment(req, res) {
  try {
    const userId = req.user.user_id;
    const { payment_id } = req.body;

    const [payment] = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1 AND user_id = $2 AND status = $3',
      [payment_id, userId, 'pending']
    );

    if (payment.length === 0) {
      return res.status(404).json({ code: 40001, message: '支付订单不存在或已处理' });
    }

    // 根据支付代币处理
    const paymentToken = payment[0].payment_token;
    let txHash = '';

    if (paymentToken === 'EACO' || paymentToken === 'SOL' || paymentToken === 'USDT' || paymentToken === 'USDC') {
      // 链上转账
      const result = await SolanaService.transferToken(
        userId,
        payment[0].amount_cents,
        paymentToken
      );
      txHash = result.txHash;
    } else {
      txHash = `offline_${Date.now()}`;
    }

    // 更新支付状态
    await pool.query(
      `UPDATE payments SET status = $1, tx_hash = $2, paid_at = NOW() WHERE payment_id = $3`,
      ['paid', txHash, payment_id]
    );

    // 更新订单状态
    await pool.query(
      `UPDATE orders SET status = $1, paid_at = NOW() WHERE order_id = $2`,
      ['paid', payment[0].order_id]
    );

    res.json({
      code: 0,
      message: '支付成功',
      data: {
        payment_id,
        status: 'paid',
        tx_hash: txHash,
        paid_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('完成支付失败:', error);
    res.status(500).json({ code: 50000, message: '支付失败' });
  }
}

// 获取支付状态
async function getPaymentStatus(req, res) {
  try {
    const userId = req.user.user_id;
    const { payment_id } = req.params;

    const [payment] = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1 AND user_id = $2',
      [payment_id, userId]
    );

    if (payment.length === 0) {
      return res.status(404).json({ code: 40001, message: '支付订单不存在' });
    }

    res.json({
      code: 0,
      message: 'success',
      data: {
        payment_id: payment[0].payment_id,
        order_id: payment[0].order_id,
        amount_cents: parseInt(payment[0].amount_cents),
        payment_token: payment[0].payment_token,
        status: payment[0].status,
        tx_hash: payment[0].tx_hash,
        created_at: payment[0].created_at,
        paid_at: payment[0].paid_at,
      },
    });
  } catch (error) {
    console.error('获取支付状态失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 申请退款
async function refundPayment(req, res) {
  try {
    const userId = req.user.user_id;
    const { payment_id, reason } = req.body;

    const [payment] = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1 AND user_id = $2 AND status = $3',
      [payment_id, userId, 'paid']
    );

    if (payment.length === 0) {
      return res.status(404).json({ code: 40001, message: '无可退款的订单' });
    }

    // 链上退款
    if (payment[0].tx_hash && payment[0].tx_hash.startsWith('sim_')) {
      await SolanaService.refundToken(
        payment[0].tx_hash,
        userId,
        payment[0].amount_cents,
        payment[0].payment_token
      );
    }

    await pool.query(
      `UPDATE payments SET status = $1, refunded_at = NOW() WHERE payment_id = $2`,
      ['refunded', payment_id]
    );

    await pool.query(
      `UPDATE orders SET status = $1 WHERE order_id = $2`,
      ['refunded', payment[0].order_id]
    );

    res.json({
      code: 0,
      message: '退款申请已提交',
      data: { payment_id, status: 'refunded' },
    });
  } catch (error) {
    console.error('退款失败:', error);
    res.status(500).json({ code: 50000, message: '服务器错误' });
  }
}

// 获取支持的钱包列表
async function getSupportedTokens(req, res) {
  const tokens = [
    { token: 'EACO', name: 'EACO', symbol: 'EACO', decimals: 9, contract_address: process.env.EACO_CONTRACT_ADDRESS, logo: '🌍' },
    { token: 'SOL', name: 'Solana', symbol: 'SOL', decimals: 9, contract_address: 'So11111111111111111111111111111111111111112', logo: '◎' },
    { token: 'USDT', name: 'Tether USD', symbol: 'USDT', decimals: 6, contract_address: 'Esr8hKBRNuaCRnKMQJNws4Pp3qey6BcE4VmtH9gMsLqM', logo: '💵' },
    { token: 'USDC', name: 'USD Coin', symbol: 'USDC', decimals: 6, contract_address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8DN4sWqbFNtF1zXK', logo: '💲' },
    { token: 'wBNB', name: 'Wrapped BNB', symbol: 'wBNB', decimals: 18, contract_address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', logo: '🟡' },
  ];

  res.json({ code: 0, message: 'success', data: tokens });
}

module.exports = {
  createPayment,
  completePayment,
  getPaymentStatus,
  refundPayment,
  getSupportedTokens,
};
