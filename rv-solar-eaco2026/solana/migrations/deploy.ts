// Solana 部署脚本
import * as anchor from '@project-serum/anchor';
import { PublicKey, Keypair } from '@solana/web3.js';
import fs from 'fs';

// 加载 IDL 和密钥
const rewardDistributorIdl = JSON.parse(
  fs.readFileSync('./target/idl/reward_distributor.json', 'utf8')
);
const energyNftIdl = JSON.parse(
  fs.readFileSync('./target/idl/energy_nft.json', 'utf8')
);
const p2pMarketIdl = JSON.parse(
  fs.readFileSync('./target/idl/p2p_market.json', 'utf8')
);
const paymentGatewayIdl = JSON.parse(
  fs.readFileSync('./target/idl/payment_gateway.json', 'utf8')
);

// 程序 ID（需要替换为实际部署的合约地址）
const PROGRAM_IDS = {
  rewardDistributor: new PublicKey('RwrdXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  energyNft: new PublicKey('EnftXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
  p2pMarket: new PublicKey('P2pmXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxxx'),
  paymentGateway: new PublicKey('PaygwXXXXXXXxxxxxxxxxxxxxxxxxxxxxxxx'),
};

// 部署 RewardDistributor
async function deployRewardDistributor(provider) {
  console.log('📦 部署 RewardDistributor...');
  
  const program = new anchor.Program(
    rewardDistributorIdl,
    PROGRAM_IDS.rewardDistributor,
    provider
  );
  
  // 初始化奖励分发器
  const [rewardDistributor, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('reward_distributor')],
    program.programId
  );
  
  const tx = await program.methods
    .initialize(bump)
    .accounts({
      rewardDistributor: rewardDistributor,
      treasury: TREASURY_TOKEN_ACCOUNT,
      tokenMint: EACO_MINT,
      authority: PROVIDER_WALLET.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  
  console.log('✅ RewardDistributor 已部署:', tx);
  return { address: rewardDistributor, bump };
}

// 部署 EnergyNFT
async function deployEnergyNft(provider) {
  console.log('📦 部署 EnergyNFT...');
  
  const program = new anchor.Program(
    energyNftIdl,
    PROGRAM_IDS.energyNft,
    provider
  );
  
  const [energyMetadata, metadataBump] = await PublicKey.findProgramAddress(
    [Buffer.from('energy_metadata')],
    program.programId
  );
  
  const [energyStats, statsBump] = await PublicKey.findProgramAddress(
    [Buffer.from('energy_stats')],
    program.programId
  );
  
  const tx = await program.methods
    .initialize(metadataBump)
    .accounts({
      energyMetadata: energyMetadata,
      energyStats: energyStats,
      authority: PROVIDER_WALLET.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  
  console.log('✅ EnergyNFT 已部署:', tx);
  return { metadata: energyMetadata, stats: energyStats, bump: metadataBump };
}

// 部署 P2P Market
async function deployP2PMarket(provider) {
  console.log('📦 部署 P2P Market...');
  
  const program = new anchor.Program(
    p2pMarketIdl,
    PROGRAM_IDS.p2pMarket,
    provider
  );
  
  const [marketConfig, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('p2p_market_config')],
    program.programId
  );
  
  const tx = await program.methods
    .initialize(bump)
    .accounts({
      marketConfig: marketConfig,
      authority: PROVIDER_WALLET.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  
  console.log('✅ P2P Market 已部署:', tx);
  return { address: marketConfig, bump };
}

// 部署 Payment Gateway
async function deployPaymentGateway(provider) {
  console.log('📦 部署 Payment Gateway...');
  
  const program = new anchor.Program(
    paymentGatewayIdl,
    PROGRAM_IDS.paymentGateway,
    provider
  );
  
  const [gatewayConfig, bump] = await PublicKey.findProgramAddress(
    [Buffer.from('gateway_config')],
    program.programId
  );
  
  const tx = await program.methods
    .initialize(bump)
    .accounts({
      gatewayConfig: gatewayConfig,
      feeTreasury: FEE_TREASURY,
      admin: PROVIDER_WALLET.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    })
    .rpc();
  
  console.log('✅ Payment Gateway 已部署:', tx);
  return { address: gatewayConfig, bump };
}

// 验证合约部署
async function verifyContracts(programs) {
  console.log('\n🔍 验证合约部署...\n');
  
  for (const [name, program] of Object.entries(programs)) {
    const accountInfo = await provider.connection.getAccountInfo(program.address);
    if (accountInfo) {
      console.log(`✅ ${name}: 已部署`);
    } else {
      console.log(`❌ ${name}: 未找到`);
    }
  }
}

// 主部署流程
async function main() {
  console.log('🚀 开始部署 RV Solar EACO Solana 合约...\n');
  
  // 连接到 Solana devnet
  const connection = new anchor.web3.Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );
  
  // 加载钱包
  const wallet = anchor.web3.Keypair.fromSecretKey(
    Buffer.from(process.env.DEPLOYER_KEY || '[]')
  );
  
  const provider = new anchor.Provider(connection, new anchor.Wallet(wallet), {
    commitment: 'confirmed',
  });
  
  anchor.setProvider(provider);
  
  try {
    // 部署所有合约
    const rewardDistributor = await deployRewardDistributor(provider);
    const energyNft = await deployEnergyNft(provider);
    const p2pMarket = await deployP2PMarket(provider);
    const paymentGateway = await deployPaymentGateway(provider);
    
    // 验证部署
    await verifyContracts({
      RewardDistributor: rewardDistributor,
      EnergyNFT: energyNft,
      P2PMarket: p2pMarket,
      PaymentGateway: paymentGateway,
    });
    
    // 保存部署信息
    const deploymentInfo = {
      timestamp: new Date().toISOString(),
      network: 'devnet',
      programs: {
        rewardDistributor: {
          address: rewardDistributor.address.toString(),
          bump: rewardDistributor.bump,
        },
        energyNft: {
          metadata: energyNft.metadata.toString(),
          stats: energyNft.stats.toString(),
          bump: energyNft.bump,
        },
        p2pMarket: {
          address: p2pMarket.address.toString(),
          bump: p2pMarket.bump,
        },
        paymentGateway: {
          address: paymentGateway.address.toString(),
          bump: paymentGateway.bump,
        },
      },
    };
    
    fs.writeFileSync(
      './deployment.json',
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\n✨ 部署完成！配置已保存到 deployment.json\n');
    
  } catch (error) {
    console.error('❌ 部署失败:', error);
    process.exit(1);
  }
}

main();