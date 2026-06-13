/**
 * Solana区块链服务
 */
const { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { TOKEN_PROGRAM_ID, Token } = require('@solana/spl-token');

// EACO代币合约地址
const EACO_CONTRACT_ADDRESS = process.env.EACO_CONTRACT_ADDRESS || 'DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH';

// 初始化Solana连接
const connection = new Connection(
  process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);

/**
 * 获取用户代币余额
 */
async function getTokenBalance(walletAddress, mintAddress = EACO_CONTRACT_ADDRESS) {
  try {
    const walletPubkey = new PublicKey(walletAddress);
    const mintPubkey = new PublicKey(mintAddress);
    
    const token = new Token(connection, mintPubkey, TOKEN_PROGRAM_ID, Keypair.generate());
    const tokenAccount = await token.getOrCreateAssociatedAccountInfo(walletPubkey);
    
    return tokenAccount.amount.toString();
  } catch (error) {
    console.error('获取余额失败:', error);
    return '0';
  }
}

/**
 * 转移代币
 */
async function transferToken(fromWallet, toWallet, amount, mintAddress = EACO_CONTRACT_ADDRESS) {
  try {
    const fromPubkey = new PublicKey(fromWallet);
    const toPubkey = new PublicKey(toWallet);
    const mintPubkey = new PublicKey(mintAddress);
    
    const token = new Token(connection, mintPubkey, TOKEN_PROGRAM_ID, Keypair.fromSecretKey(Buffer.from(fromWallet.secretKey)));
    
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(fromPubkey);
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(toPubkey);
    
    const transaction = new Transaction();
    
    const transferInstruction = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      fromPubkey,
      [],
      amount
    );
    
    transaction.add(transferInstruction);
    
    // 注意: 实际发送需要签名
    // const signature = await connection.sendTransaction(transaction, [fromWallet]);
    
    return {
      success: true,
      txHash: 'simulated_' + Date.now(),
      amount: amount.toString()
    };
  } catch (error) {
    console.error('转账失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 提交链上交易 (模拟)
 */
async function submitOnChainTransaction(type, data) {
  // 实际实现需要调用Solana合约
  // 这里返回模拟数据用于测试
  return {
    success: true,
    txHash: `sim_${type}_${Date.now()}`,
    signature: `sig_${Date.now()}`,
    blockTime: Math.floor(Date.now() / 1000)
  };
}

/**
 * 验证预言机签名 (模拟)
 */
async function verifyOracleSignature(data, signature, oraclePublicKey) {
  // 实际实现需要使用预言机公钥验签
  // 这里做简化验证
  if (!signature || signature.length < 10) {
    return { valid: false, error: 'Invalid signature format' };
  }
  
  return { valid: true };
}

module.exports = {
  connection,
  getTokenBalance,
  transferToken,
  submitOnChainTransaction,
  verifyOracleSignature,
  EACO_CONTRACT_ADDRESS
};