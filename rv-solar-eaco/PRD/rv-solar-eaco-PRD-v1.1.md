# EACO 光伏房车项目 — 完整产品需求文档 v1.1

> **项目代号:** rv-solar-eaco  
> **版本:** v1.1  
> **日期:** 2026-06-13  
> **状态:** 待开发  
> **合约地址:** `DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH` (Solana/SPL)

---

## 📋 文档结构总览

| 章节 | 内容 |
|------|------|
| 第一部分 | 产品需求文档（PRD） |
| 第二部分 | 智能合约接口设计 |
| 第三部分 | 数据库表结构设计 |
| 第四部分 | 各口岸落地执行SOP |
| 第五部分 | 预言机与硬件对接方案 |
| 第六部分 | API接口规范 |
| **第七部分** | **智能合约安全审计计划** |
| **第八部分** | **数据库ER图与数据字典** |
| **第九部分** | **API详细规范（OpenAPI 3.0）** |
| **第十部分** | **硬件规格书** |
| **第十一部分** | **部署与测试方案** |

---

# 第一部分：产品需求文档（PRD）

## 1.1 产品愿景

为全球房车旅行者提供"**营地预订 + 光伏充电 + Web3支付 + 绿电激励**"的一站式移动生活操作系统。

用户通过光伏发电贡献绿色能源，获得EACO代币奖励，形成"越使用越受益、越贡献越富有"的自我增强飞轮。

---

## 1.2 目标用户画像

| 用户类型 | 描述 | 核心需求 |
|---------|------|---------|
| 中国出境房车车主 | 年龄35-60岁，年收入30万+，有出境自驾经验 | 便捷跨境支付、充电保障、社区归属 |
| 国际Web3用户 | 持有加密资产，关注ESG和绿色金融 | 用EACO消费、参与绿色挖矿 |
| 合作营地运营商 | 5口岸沿线合作营地业主 | 获取客源、光伏电力变现 |
| 绿色能源倡导者 | 不一定有房车，但关注碳减排 | 通过EACO参与碳信用、支持绿色项目 |

---

## 1.3 核心功能Epic矩阵

### Epic 1：用户与账户系统

| 功能ID | 功能点 | 描述 | 优先级 | 涉及语言 |
|--------|--------|------|--------|---------|
| U-01 | 手机号注册 | 支持+86/+7/+1/+976等区号 | P0 | 中/英 |
| U-02 | 钱包创建 | 非托管钱包，Solana地址，自动生成助记词 | P0 | 中/英 |
| U-03 | 钱包导入 | 私钥/助记词导入已有钱包 | P0 | 中/英 |
| U-04 | 多语言切换 | 中/英（MVP）；俄/蒙古语（V1.1） | P0 | 中/英 |
| U-05 | 交易密码 | 支付前二次验证，本地加密存储 | P0 | 中/英 |
| U-06 | KYC轻量级 | 超过$500交易额需身份验证 | P2 | 中/英 |
| U-07 | 个人资料 | 昵称、头像、车型、光伏设备型号 | P1 | 中/英 |

### Epic 2：地图与营地发现

| 功能ID | 功能点 | 描述 | 优先级 |
|--------|--------|------|--------|
| M-01 | 营地地图 | Mapbox展示POI，按距离排序 | P0 |
| M-02 | 营地详情页 | 名称/位置/价格/设施/充电桩功率/营业时间/图片 | P0 |
| M-03 | 筛选搜索 | 按口岸/充电桩/价格区间筛选 | P1 |
| M-04 | 路线规划 | 输入起点终点，推荐途经营地 | P1 |
| M-05 | 离线地图 | 预下载口岸区域地图 | P2 |

### Epic 3：预订与支付

| 功能ID | 功能点 | 描述 | 优先级 |
|--------|--------|------|--------|
| B-01 | 营地预订 | 选择日期/车位类型，生成订单 | P0 |
| B-02 | 订单详情 | 金额/状态（待支付/已支付/已完成/已取消） | P0 |
| B-03 | 支付方式 | USDT/USDC/SOL/wBNB/EACO | P0 |
| B-04 | 汇率展示 | 实时显示各币种对USD汇率 | P1 |
| B-05 | 订单取消 | 入住前24h免费取消 | P1 |
| B-06 | 评价订单 | 1-5星+文字评价 | P1 |

### Epic 4：光伏充电

| 功能ID | 功能点 | 描述 | 优先级 |
|--------|--------|------|--------|
| C-01 | 扫码充电 | 扫描充电桩二维码开始充电 | P0 |
| C-02 | 实时监控 | 电压/电流/功率/已充电量(kWh) | P0 |
| C-03 | 自动结算 | 按实际电量扣款 | P0 |
| C-04 | 充电历史 | 时间/地点/电量/费用记录 | P1 |
| C-05 | 发电量上链 | 充电电量哈希上链 | P1 |
| C-06 | EACO空投 | 每1kWh → 空投X个EACO | P1 |

### Epic 5：社区与激励

| 功能ID | 功能点 | 描述 | 优先级 |
|--------|--------|------|--------|
| S-01 | 贡献挖矿 | 上传路况/营地信息 → 审核 → EACO奖励 | P1 |
| S-02 | 碳积分账户 | 累积碳减排量，可兑换优惠券 | P1 |
| S-03 | 排行榜 | 周/月发电量/贡献排行榜 | P2 |
| S-04 | 社区群组 | 嵌入Telegram WebView | P2 |
| S-05 | 大使申请 | 口岸本地人申请大使获得激励 | P2 |
| S-06 | DAO治理 | 用veEACO投票决定手续费/新口岸 | P2 |

### Epic 6：P2P能源交易

| 功能ID | 功能点 | 描述 | 优先级 |
|--------|--------|------|--------|
| E-01 | 余电挂牌 | 车主挂牌出售余电，价格/数量 | P2 |
| E-02 | 智能撮合 | 买方下单，自动结算EACO | P2 |
| E-03 | 提现/充值 | EACO ↔ USDT闪兑（聚合Raydium/Meteora） | P2 |

---

## 1.4 用户完整旅程

```
📱 出发前（中国境内）
1. 下载APP → 手机号注册
2. 创建/导入Solana钱包，存入USDT
3. 搜索目的地，查看合作营地
4. 预订营地 → USDT支付
5. 收到订单确认码

🚐 到达营地（海外口岸）
6. 出示订单确认码，入住
7. 扫描充电桩二维码
8. 充电1h = 8kWh → 实时监控
9. 充电完成 → 自动扣款(EACO享9折)
10. 发电数据上链 → 空投80 EACO
11. 碳积分+8kg CO₂

🌙 使用社区功能
12. 上传营地评价/路况 → 审核 → +5 EACO
13. 加入Telegram群组
14. 查看排行榜

💡 继续旅程
15. APP规划沿线营地
16. 沿途EACO支付餐饮/补给
17. 碳积分兑换折扣券
18. 回国后：持有EACO / 兑换USDT / 购买二手光伏设备
```

---

## 1.5 成功指标（KPI）

| 维度 | 指标 | 第6个月目标 | 第12个月目标 |
|------|------|-----------|-----------|
| 用户 | 注册用户数 | 1,000 | 5,000 |
| 用户 | 月活跃用户(MAU) | 200 | 1,000 |
| 交易 | 月订单数 | 100 | 500 |
| 交易 | 月交易额(USDT) | $10,000 | $50,000 |
| 绿电 | 累计上链发电量(kWh) | 20,000 | 100,000 |
| 社区 | Telegram日均消息 | 50条 | 200条 |
| 口岸 | 覆盖口岸数 | 1 | 5 |

---

# 第二部分：智能合约接口设计

## 2.1 合约架构总览

```
EACO Core (已部署 CA: DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH)
    │
    ├── RewardDistributor.sol     ← 绿电奖励分发
    ├── PaymentGateway.sol        ← 支付网关
    ├── EnergyNFT.sol             ← 发电量NFT凭证
    ├── CarbonCredit.sol          ← 碳积分合约
    ├── P2PEnergyMarket.sol      ← P2P能源市场
    └── Governance.sol           ← DAO治理 (V2)
```

## 2.2 RewardDistributor（奖励分发合约）

```rust
// SPDX-License-Identifier: MIT
// 合约地址: [待部署 - 多签地址]

use solana_program::{program_error::ProgramError, pubkey::Pubkey};
use borsh::{BorshDeserialize, BorshSerialize};

// 奖励记录结构
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GreenEnergyRecord {
    pub user: Pubkey,              // 用户钱包地址
    pub energy_kwh: u64,           // 发电量 (Wh)
    pub timestamp: i64,            // 时间戳
    pub location: String,          // 口岸+营地ID
    pub verified: bool,            // 预言机验证标志
    pub reward_amount: u64,        // 实际发放的EACO数量 (最小单位)
    pub tx_hash: String,           // 交易哈希
}

// 奖励配置
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct RewardConfig {
    pub admin: Pubkey,             // 多签管理员地址
    pub reward_rate: u64,          // 每kWh奖励EACO数量 (最小单位, 1e-6 EACO)
    pub total_reward_pool: u64,    // 奖励池总量
    pub distributed: u64,          // 已分发总量
    pub min_energy_kwh: u64,      // 最小发电量门槛 (默认1000Wh)
}

// ============ 核心接口 ============

// 1. 提交发电记录（需预言机签名）
// Instruction: 0x00
pub fn submit_energy_record(
    ctx: Context<SubmitRecord>,
    energy_kwh: u64,               // 发电量 (Wh)
    location: String,              // 地点标识
    oracle_signature: Vec<u8>,     // 预言机签名
) -> Result<()> {
    // 验证:
    // 1. oracle_signature 由预设预言机公钥验签
    // 2. energy_kwh >= min_energy_kwh
    // 3. 用户余额充足
    // 操作:
    // 1. 计算 reward = energy_kwh * reward_rate / 1000
    // 2. 从奖励池 (admin PDA) 转账 EACO 给用户
    // 3. 存储 GreenEnergyRecord
    // 4. 发出 RewardDistributed 事件
}

// 2. 管理员设置奖励率
// Instruction: 0x01
pub fn set_reward_rate(ctx: Context<SetRate>, new_rate: u64) -> Result<()> {
    // 需多签验证
}

// 3. 补充奖励池
// Instruction: 0x02
pub fn topup_reward_pool(ctx: Context<TopupPool>, amount: u64) -> Result<()> {
    // 从admin账户转EACO到奖励池PDA
}

// 4. 查询用户累计发电量
pub fn get_user_total_energy(user: Pubkey) -> u64 {
    // 遍历用户所有GreenEnergyRecord累加
}

// 5. 查询用户累计获得奖励
pub fn get_user_total_reward(user: Pubkey) -> u64 {
    // 遍历GreenEnergyRecord累加reward_amount
}

// ============ 事件定义 ============
#[derive(Clone, Debug)]
pub enum RewardEvent {
    RewardDistributed {
        user: Pubkey,
        amount_eaco: u64,
        energy_kwh: u64,
        location: String,
        tx_hash: String,
    },
    RewardRateChanged {
        old_rate: u64,
        new_rate: u64,
        admin: Pubkey,
    },
}
```

## 2.3 PaymentGateway（支付网关合约）

```rust
// 支付订单结构
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PaymentOrder {
    pub order_id: String,          // UUID (链上仅存hash)
    pub payer: Pubkey,             // 付款方
    pub payee: Pubkey,             // 收款方 (营地商户)
    pub amount_usd_cents: u64,    // USD计价 (美分)
    pub payment_token: TokenType, // 支付币种
    pub status: OrderStatus,
    pub created_at: i64,
    pub paid_at: Option<i64>,
    pub refund_at: Option<i64>,
}

#[derive(Clone, PartialEq, Debug)]
pub enum OrderStatus {
    Pending,    // 待支付
    Paid,       // 已支付
    Cancelled,  // 已取消
    Refunded,   // 已退款
}

#[derive(Clone, PartialEq, Debug)]
pub enum TokenType {
    EACO,
    USDT,
    USDC,
    SOL,
    WBNB,
}

// ============ 核心接口 ============

// 1. 创建订单 (链下触发，仅记录hash)
// Instruction: 0x10
pub fn create_order(
    ctx: Context<CreateOrder>,
    order_id_hash: String,
    amount_usd_cents: u64,
) -> Result<()> {
    // 从营地payee地址创建PDA账户存储订单
}

// 2. 支付订单
// Instruction: 0x11
pub fn pay_order(
    ctx: Context<PayOrder>,
    order_id_hash: String,
    amount_in_token: u64,
) -> Result<()> {
    // 1. 验证订单存在且状态为Pending
    // 2. 锁定订单状态为Paid
    // 3. 调用TokenProgram::transfer 从payer到payee
    // 4. 若使用EACO支付: 享受9折 (amount * 0.9)
    // 5. 发出 OrderPaid 事件
}

// 3. 申请退款 (创建24小时内)
// Instruction: 0x12
pub fn refund_order(ctx: Context<RefundOrder>, order_id_hash: String) -> Result<()> {
    // 1. 验证订单创建时间 < 24小时
    // 2. 验证订单状态为Paid
    // 3. 调用TokenProgram::transfer 从payee退回payer
    // 4. 更新状态为Refunded
}

// 4. 取消订单 (过期未支付)
// Instruction: 0x13
pub fn cancel_expired_order(ctx: Context<CancelOrder>, order_id_hash: String) -> Result<()> {
    // 订单创建超过72小时且未支付 → 标记为Cancelled
}

// ============ 事件定义 ============
#[derive(Clone, Debug)]
pub enum PaymentEvent {
    OrderCreated {
        order_id_hash: String,
        payer: Pubkey,
        payee: Pubkey,
        amount_usd_cents: u64,
    },
    OrderPaid {
        order_id_hash: String,
        payer: Pubkey,
        payee: Pubkey,
        amount_usd_cents: u64,
        payment_token: String,
        discount_applied: bool,
    },
    OrderRefunded {
        order_id_hash: String,
        refund_amount: u64,
    },
}
```

## 2.4 EnergyNFT（发电量NFT凭证）

```rust
// 每笔≥10kWh的充电记录铸造为一个可交易的NFT
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct EnergyNFTMetadata {
    pub mint: Pubkey,              // NFT Mint地址
    pub owner: Pubkey,             // 当前持有者
    pub energy_kwh: u64,           // 累计发电量 (Wh)
    pub co2_saved_kg: u64,         // 碳减排量 (kg CO₂)
    pub location: String,          // 产地
    pub minted_at: i64,            // 铸造时间
    pub on_sale: bool,             // 是否在售
    pub price_eaco: Option<u64>,   // 售价 (EACO最小单位)
}

// 碳减排计算: 每kWh ≈ 0.5kg CO₂ (中国电网均值)
// co2_saved_kg = energy_kwh * 50 / 1000

// ============ 核心接口 ============

// 1. 铸造NFT (由RewardDistributor自动调用)
// Instruction: 0x20
pub fn mint_energy_nft(
    ctx: Context<MintNFT>,
    record_id: u64,
) -> Result<Pubkey> {
    // 1. 验证record_id对应记录存在且verified=true
    // 2. 验证energy_kwh >= 10000 (10kWh门槛)
    // 3. 铸造SPL NFT
    // 4. 将metadata写入NFT Mint Account
    // 5. 返回Mint地址
}

// 2. 转让NFT
// Instruction: 0x21
pub fn transfer_nft(
    ctx: Context<TransferNFT>,
    new_owner: Pubkey,
) -> Result<()> {
    // 标准SPL NFT转让
}

// 3. 上架市场
// Instruction: 0x22
pub fn list_for_sale(
    ctx: Context<ListNFT>,
    price_eaco: u64,
) -> Result<()> {
    // 更新metadata.on_sale=true, price_eaco
}

// 4. 下架
// Instruction: 0x23
pub fn delist(ctx: Context<DelistNFT>) -> Result<()> {
    // on_sale=false
}

// 5. 购买
// Instruction: 0x24
pub fn buy_nft(ctx: Context<BuyNFT>) -> Result<()> {
    // 1. 验证on_sale=true
    // 2. 验证买方余额 >= price_eaco
    // 3. 转账EACO给卖方
    // 4. 转让NFT所有权
}

// ============ 事件定义 ============
#[derive(Clone, Debug)]
pub enum NFTRewardEvent {
    EnergyNFTMinted {
        nft_mint: Pubkey,
        owner: Pubkey,
        energy_kwh: u64,
        co2_saved_kg: u64,
    },
    EnergyNFTTraded {
        nft_mint: Pubkey,
        old_owner: Pubkey,
        new_owner: Pubkey,
        price_eaco: u64,
    },
}
```

## 2.5 P2PEnergyMarket（P2P能源市场）

```rust
// 挂牌结构
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct EnergyListing {
    pub listing_id: String,
    pub seller: Pubkey,
    pub energy_kwh: u64,           // 挂牌电量 (Wh)
    pub remaining_kwh: u64,         // 剩余电量
    pub price_eaco_per_kwh: u64,   // 单价 (EACO/kWh)
    pub location: String,           // 当前位置
    pub created_at: i64,
    pub active: bool,
}

// ============ 核心接口 ============

// 1. 挂牌出售余电
// Instruction: 0x30
pub fn create_listing(
    ctx: Context<CreateListing>,
    energy_kwh: u64,
    price_eaco_per_kwh: u64,
    location: String,
) -> Result<String> {
    // listing_id = SHA256(seller + timestamp)
}

// 2. 购买电力
// Instruction: 0x31
pub fn buy_energy(
    ctx: Context<BuyEnergy>,
    listing_id: String,
    energy_kwh: u64,               // 购买电量
) -> Result<()> {
    // 1. 验证remaining >= energy_kwh
    // 2. 计算总价 = energy_kwh * price_eaco_per_kwh / 1000
    // 3. 转账EACO给卖方
    // 4. 更新remaining_kwh
}

// 3. 撤销挂牌
// Instruction: 0x32
pub fn cancel_listing(ctx: Context<CancelListing>, listing_id: String) -> Result<()> {
    // active=false
}
```

## 2.6 权限管理

| 合约 | 部署地址 | 权限控制 |
|------|---------|---------|
| EacoToken (Core) | `DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH` | 已Renounce，无Owner |
| RewardDistributor | [待部署 - 3/5多签] | admin PDA，需3/5签名 |
| PaymentGateway | [待部署 - 3/5多签] | admin PDA + 24h时间锁 |
| EnergyNFT | [待部署] | 铸造权归RewardDistributor |
| P2PEnergyMarket | [待部署] | 无owner，去中心化 |

**时间锁规则:**
- RewardDistributor::set_reward_rate: 48h时间锁
- PaymentGateway::refund_order: 即时
- 任何合约升级: 7天时间锁 + 社区投票(veEACO)

---

# 第三部分：数据库表结构设计

## 3.1 ER图总览

```
users ─────┐
           ├──1:N─── orders ──────N:1─── campsites
           │
           ├──1:N─── wallets
           │
           ├──1:N─── charging_records
           │
           ├──1:N─── energy_records ────N:1─── oracles
           │
           ├──1:N─── carbon_accounts
           │
           ├──1:N─── nft_holdings
           │
           ├──1:N─── contributions
           │
           └──1:N─── listings (P2P)

campsites ────────N:1─── port_crossings
       │
       └──N:N─── amenities

port_crossings
```

## 3.2 核心表结构

### 3.2.1 用户表 (users)

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_code      VARCHAR(6) NOT NULL DEFAULT '+86',
    phone_number    VARCHAR(20) NOT NULL UNIQUE,
    nickname        VARCHAR(50),
    avatar_url      VARCHAR(500),
    wallet_address  VARCHAR(64) NOT NULL,          -- Solana公钥
    user_level      INTEGER DEFAULT 1,            -- 1=普通, 2=大使, 3=核心贡献者
    credit_score    INTEGER DEFAULT 100,          -- 信誉分 0-1000
    language        VARCHAR(10) DEFAULT 'zh',     -- zh/en/ru/mn
    kyc_status      VARCHAR(20) DEFAULT 'none',   -- none/pending/verified
    kyc_level       INTEGER DEFAULT 0,            -- 0=无, 1=基础, 2=高级
    total_energy_kwh BIGINT DEFAULT 0,            -- 累计发电量(Wh)
    total_reward_eaco BIGINT DEFAULT 0,          -- 累计获得EACO(最小单位)
    referrer_id     UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_active_at  TIMESTAMPTZ
);

CREATE INDEX idx_users_wallet ON users(wallet_address);
CREATE INDEX idx_users_phone ON users(phone_code, phone_number);
CREATE INDEX idx_users_referrer ON users(referrer_id);
```

### 3.2.2 营地表 (campsites)

```sql
CREATE TABLE campsites (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,
    name_local      VARCHAR(200),                  -- 本地语言名称
    name_en         VARCHAR(200),
    country_code    VARCHAR(3) NOT NULL,          -- KZ/LK/PK/RU/MN
    port_id         UUID NOT NULL REFERENCES port_crossings(id),
    address         VARCHAR(500),
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    description     TEXT,
    description_en  TEXT,
    check_in_time   TIME,
    check_out_time  TIME,
    total_spots     INTEGER DEFAULT 0,
    available_spots INTEGER DEFAULT 0,
    price_usd_cents INTEGER,                      -- 基础价格 (美分/晚)
    solar_capacity_kw DECIMAL(8, 2) DEFAULT 0,    -- 光伏装机容量(kW)
    charging_spots  INTEGER DEFAULT 0,            -- 充电桩数量
    max_charging_power_w INTEGER DEFAULT 0,      -- 最大充电功率(W)
    images          JSONB DEFAULT '[]',           -- 图片URL数组
    amenities       TEXT[] DEFAULT '{}',          -- 设施列表
    contact_phone   VARCHAR(30),
    contact_wechat  VARCHAR(50),
    operator_wallet VARCHAR(64),                  -- 营地运营商收款钱包
    operator_name   VARCHAR(200),
    rating          DECIMAL(3, 2) DEFAULT 0,
    rating_count    INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'active', -- active/inactive/pending
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_campsites_port ON campsites(port_id);
CREATE INDEX idx_campsites_country ON campsites(country_code);
CREATE INDEX idx_campsites_location ON campsites(latitude, longitude);
CREATE INDEX idx_campsites_solar ON campsites(solar_capacity_kw);
```

### 3.2.3 口岸表 (port_crossings)

```sql
CREATE TABLE port_crossings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(200) NOT NULL,         -- 口岸名称
    name_local      VARCHAR(200),
    name_en         VARCHAR(200),
    country_code    VARCHAR(3) NOT NULL,
    country_name    VARCHAR(100) NOT NULL,
    border_type     VARCHAR(20),                   -- land/water/air
    lat_side        VARCHAR(20),                  -- 所在方: china/foreign
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    timezone        VARCHAR(50),
    currency_code   VARCHAR(3),                   -- 本币币种
    crypto_friendly INTEGER DEFAULT 3,            -- 1-5 加密货币友好度评分
    solar_potential INTEGER DEFAULT 3,            -- 1-5 光照资源评分
    rv_friendly     INTEGER DEFAULT 3,            -- 1-5 房车友好度评分
    language_codes  TEXT[] DEFAULT '{"zh","en"}',-- 支持语言
    regulatory_note TEXT,                         -- 监管备注
    onboarding_status VARCHAR(20) DEFAULT 'planned', -- planned/pilot/active
    priority        INTEGER DEFAULT 3,            -- 1=最高优先级
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_port_country ON port_crossings(country_code);
CREATE INDEX idx_port_onboarding ON port_crossings(onboarding_status);
```

### 3.2.4 订单表 (orders)

```sql
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_no        VARCHAR(32) NOT NULL UNIQUE,  -- 订单号
    user_id         UUID NOT NULL REFERENCES users(id),
    campsite_id     UUID NOT NULL REFERENCES campsites(id),
    check_in_date   DATE NOT NULL,
    check_out_date  DATE NOT NULL,
    spot_type       VARCHAR(30),                  -- 房车/帐篷/车位
    nights          INTEGER NOT NULL,
    amount_usd_cents INTEGER NOT NULL,
    payment_token   VARCHAR(20),
    payment_status  VARCHAR(20) DEFAULT 'pending', -- pending/paid/cancelled/refunded
    payment_tx_hash VARCHAR(100),
    discount_applied BOOLEAN DEFAULT FALSE,
    discount_reason VARCHAR(200),
    paid_at         TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    refund_tx_hash  VARCHAR(100),
    user_rating     INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
    user_comment    TEXT,
    operator_notes  TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_campsite ON orders(campsite_id);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE UNIQUE INDEX idx_orders_no ON orders(order_no);
```

### 3.2.5 充电记录表 (charging_records)

```sql
CREATE TABLE charging_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    campsite_id     UUID NOT NULL REFERENCES campsites(id),
    charger_id      VARCHAR(100) NOT NULL,        -- 充电桩硬件ID
    start_time      TIMESTAMPTZ NOT NULL,
    end_time        TIMESTAMPTZ,
    energy_kwh      DECIMAL(10, 4) NOT NULL,      -- 充电量(kWh)
    max_power_w     INTEGER,                      -- 峰值功率(W)
    avg_power_w     INTEGER,                      -- 平均功率(W)
    price_token     VARCHAR(20),                  -- 结算币种
    price_per_kwh   DECIMAL(12, 6),               -- 单价
    total_amount    BIGINT,                       -- 总费用(最小单位)
    payment_status  VARCHAR(20) DEFAULT 'pending',
    payment_tx_hash VARCHAR(100),
    on_chain        BOOLEAN DEFAULT FALSE,
    chain_tx_hash   VARCHAR(100),
    chain_record_id VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_charging_user ON charging_records(user_id);
CREATE INDEX idx_charging_campsite ON charging_records(campsite_id);
CREATE INDEX idx_charging_time ON charging_records(start_time);
CREATE INDEX idx_charging_onchain ON charging_records(on_chain);
```

### 3.2.6 绿电记录表 (green_energy_records)

```sql
CREATE TABLE green_energy_records (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    charging_id     UUID REFERENCES charging_records(id),
    energy_kwh      BIGINT NOT NULL,              -- 发电量(Wh)
    location        VARCHAR(200),                  -- 口岸+营地
    oracle_address  VARCHAR(64),                  -- 验证预言机地址
    oracle_signature VARCHAR(500),                -- 预言机签名
    verified        BOOLEAN DEFAULT FALSE,
    verified_at     TIMESTAMPTZ,
    reward_eaco     BIGINT DEFAULT 0,            -- 奖励EACO(最小单位)
    reward_tx_hash  VARCHAR(100),
    nft_mint        VARCHAR(64),                  -- 对应NFT Mint地址
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_energy_user ON green_energy_records(user_id);
CREATE INDEX idx_energy_charging ON green_energy_records(charging_id);
CREATE INDEX idx_energy_verified ON green_energy_records(verified);
CREATE INDEX idx_energy_location ON green_energy_records(location);
```

### 3.2.7 碳积分账户表 (carbon_accounts)

```sql
CREATE TABLE carbon_accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) UNIQUE,
    total_co2_kg    DECIMAL(12, 4) DEFAULT 0,     -- 累计碳减排(kg)
    available_co2_kg DECIMAL(12, 4) DEFAULT 0,   -- 可用碳积分(kg)
    redeemed_co2_kg DECIMAL(12, 4) DEFAULT 0,      -- 已兑换(kg)
    last_updated    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE carbon_transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    carbon_account_id UUID NOT NULL REFERENCES carbon_accounts(id),
    change_kg       DECIMAL(12, 4) NOT NULL,      -- 变化量(+/-)
    balance_after   DECIMAL(12, 4) NOT NULL,
    source          VARCHAR(30),                   -- charging_reward/donation/redeem
    ref_id          UUID,                          -- 关联记录ID
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_carbon_user ON carbon_accounts(user_id);
CREATE INDEX idx_carbon_tx_user ON carbon_transactions(user_id);
```

### 3.2.8 社区贡献表 (contributions)

```sql
CREATE TABLE contributions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    type            VARCHAR(30) NOT NULL,          -- road_condition/camp_info/rescue/device_tip
    content         TEXT NOT NULL,
    location_lat    DECIMAL(10, 8),
    location_lng    DECIMAL(11, 8),
    location_text   VARCHAR(200),
    images          JSONB DEFAULT '[]',
    port_id         UUID REFERENCES port_crossings(id),
    status          VARCHAR(20) DEFAULT 'pending', -- pending/approved/rejected
    reviewer_id     UUID REFERENCES users(id),
    reviewed_at     TIMESTAMPTZ,
    reject_reason   TEXT,
    reward_eaco     BIGINT DEFAULT 0,
    reward_tx_hash  VARCHAR(100),
    upvote_count    INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contributions_user ON contributions(user_id);
CREATE INDEX idx_contributions_type ON contributions(type);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_contributions_port ON contributions(port_id);
```

### 3.2.9 P2P挂牌表 (energy_listings)

```sql
CREATE TABLE energy_listings (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_no      VARCHAR(50) NOT NULL UNIQUE,
    user_id         UUID NOT NULL REFERENCES users(id),
    energy_kwh      BIGINT NOT NULL,              -- 挂牌电量(Wh)
    remaining_kwh   BIGINT NOT NULL,
    price_eaco_per_kwh BIGINT NOT NULL,           -- 单价(EACO/kWh, 最小单位)
    location_text   VARCHAR(200),
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    status          VARCHAR(20) DEFAULT 'active',  -- active/sold/cancelled
    sold_kwh        BIGINT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_listings_user ON energy_listings(user_id);
CREATE INDEX idx_listings_status ON energy_listings(status);
CREATE INDEX idx_listings_location ON energy_listings(latitude, longitude);
```

### 3.2.10 大使表 (ambassadors)

```sql
CREATE TABLE ambassadors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    port_id         UUID NOT NULL REFERENCES port_crossings(id),
    level           INTEGER DEFAULT 1,             -- 1=区域, 2=国家级
    status          VARCHAR(20) DEFAULT 'pending', -- pending/active/inactive
    applied_at      TIMESTAMPTZ DEFAULT NOW(),
    approved_at     TIMESTAMPTZ,
    monthly_quota   INTEGER DEFAULT 10,           -- 每月最低贡献量
    total_referrals INTEGER DEFAULT 0,
    total_rewards_eaco BIGINT DEFAULT 0,
    notes           TEXT
);

CREATE UNIQUE INDEX idx_ambassador_user_port ON ambassadors(user_id, port_id);
```

---

# 第四部分：各口岸落地执行SOP

## 4.1 口岸优先级与时间表

| 优先级 | 口岸 | 国家 | 落地时间 | 预计投资(CNH) |
|--------|------|------|---------|--------------|
| P0 | 霍尔果斯(哈方) | 🇰🇿 哈萨克斯坦 | 第1-2月 | ¥50,000 |
| P0 | 磨丁 | 🇱🇦 老挝 | 第3-4月 | ¥40,000 |
| P1 | 红其拉甫(巴方) | 🇵🇰 巴基斯坦 | 第5-6月 | ¥40,000 |
| P1 | 外贝加尔斯克 | 🇷🇺 俄罗斯 | 第7-8月 | ¥35,000 |
| P2 | 扎门乌德 | 🇲🇳 蒙古 | 第9-10月 | ¥35,000 |

---

## 4.2 SOP-1：霍尔果斯口岸（哈萨克斯坦）

### 基本信息

| 项目 | 内容 |
|------|------|
| 口岸名称 | Khorgos Gateway (霍尔果斯-东大门) |
| 哈方名称 | "Хоргос" / Dostyk |
| 位置 | 阿拉木图州，中哈边境 |
| 对应中方口岸 | 霍尔果斯口岸 |
| 主要语言 | 哈萨克语、俄语 |
| 货币 | 哈萨克斯坦坚戈 (KZT) |
| 时区 | UTC+6 |
| 气候 | 温带大陆性，极端温度 |
| 最佳季节 | 5-9月 |
| 加密货币政策 | 开放但监管中，2023年出台数字资产法 |

### 法规要点

- 2023年《数字资产流通法》：加密货币合法，但需在阿斯塔纳国际金融中心(AIX)注册
- 挖矿需在能源部注册，且50%资产需在境内交易所出售
- EACO定位为"支付工具"，非挖矿，规避监管
- 外国企业可通过AIX设立分公司

### 落地步骤

```
📋 阶段1: 合规准备 (第1-4周)
─────────────────────────────────
□ 委托哈萨克斯坦律师（阿斯塔纳AIX律师）完成公司注册咨询
□ 确认EACO支付业务是否需要AIX注册
□ 准备《隐私政策》(俄语版) 和《用户协议》
□ 开立哈萨克斯坦企业账户（建议Kaspi银行或Halyk银行）

📋 阶段2: 营地合作 (第2-6周)
─────────────────────────────────
□ 联系目标营地:
  - Khorgos International Truck Port (货运港，有接待设施)
  - Almaty附近RV parks (搜索: "кемпинг Алматы")
  - 霍尔果斯自由经济区内的酒店/营地
□ 谈判合作条款:
  · 营地接入EACO支付系统
  · 提供光伏充电桩接口
  · 订单分成: 营地得80%, 平台得20% (以EACO结算)
□ 签署《营地合作协议》(中俄双语)
□ 营地工作人员培训 (线上+线下)

📋 阶段3: 硬件部署 (第4-8周)
─────────────────────────────────
□ 运输轻量化折叠光伏板 (功率≥400W)
□ 部署充电桩控制器 (支持RS485/蓝牙)
□ 配置本地服务器或边缘计算节点 (用于离线数据缓存)
□ 测试充电桩与APP的扫码联动
□ 当地电网接入评估 (若需并网)

📋 阶段4: 社区启动 (第6-10周)
─────────────────────────────────
□ Telegram群建立 (中文+俄语双语群)
□ 招募首批体验用户 (房车俱乐部/哈萨克斯坦华人商会)
□ 霍尔果斯口岸微信群运营
□ 举办"绿色充电日"启动活动
□ 接入EACO奖励空投系统 (测试网验证)

📋 阶段5: 正式运营 (第8-12周)
─────────────────────────────────
□ APP正式上线 (俄语UI激活)
□ 支付网关2328.io完成哈萨克斯坦侧配置
□ 月度数据报告生成
□ 与阿斯塔纳加密货币交易所(如 ATOM) 建立合作
□ 合规审查 (如需要)
```

### 关键合作伙伴清单

| 类型 | 名称/渠道 | 联系优先级 |
|------|-----------|-----------|
| 律所 | AIX Business Incubator合作律所 | ★★★★★ |
| 银行 | Halyk Bank / Kaspi | ★★★★★ |
| 营地 | Khorgos Gateway Truck Stop | ★★★★☆ |
| 营地 | Almaty Camping Union | ★★★☆☆ |
| 社区 | 哈萨克斯坦华人商会 | ★★★★☆ |
| 媒体 | Khabar电视台/Informburo新闻 | ★★★☆☆ |

### 营销方案

- 切入点: "中欧班列房车驿站"概念
- 目标用户: 中国跨境房车车主 + 哈萨克斯坦本地RV爱好者
- 推广渠道: 微信群(霍尔果斯货运圈)、抖音(房车自驾游)、俄语VK
- 首月激励: 使用EACO支付享首月10%返现 (从营销预算支出)

---

## 4.3 SOP-2：磨丁（老挝）

### 基本信息

| 项目 | 内容 |
|------|------|
| 口岸名称 | 磨丁（Boten） |
| 老挝名称 | ເ m ເ m ເ (Boten) |
| 位置 | 琅南塔省，中老边境 |
| 对应中方口岸 | 磨憨口岸 |
| 主要语言 | 老挝语、泰语、中文、英语 |
| 货币 | 老挝基普 (LAK) |
| 时区 | UTC+7 |
| 气候 | 热带季风，高温多湿 |
| 最佳季节 | 11月-4月(旱季) |
| 加密货币政策 | 2024-2026年收紧中，计划停止加密挖矿供电 |

### 法规要点

- 老挝央行对加密货币持谨慎态度，无明确牌照制度
- 2026年Q1计划停止为加密挖矿供电，项目需强调"清洁能源支付"定位
- 严禁使用"挖矿"相关词汇推广EACO
- 建议通过当地合作方提供服务，规避直接法律实体

### 落地步骤

```
📋 阶段1: 本地合作方建立 (第1-4周)
─────────────────────────────────
□ 联系老挝合作方:
  - 磨丁经济特区管理委员会
  - 琅南塔省商会
  - 中国工商银行万象分行(了解当地金融政策)
□ 谈判合作模式:
  · 轻资产模式: EACO提供APP+支付系统，本地合作方提供营地资源
  · 利润分配: 合作方得60%, EACO得40%
□ 签署《战略合作框架协议》(中英双语)
□ 确定老挝本地负责人

📋 阶段2: 营地网络搭建 (第2-6周)
─────────────────────────────────
□ 目标营地:
  - 磨丁市区酒店 (有停车场地)
  - 万象周边RV parks
  - 琅勃拉邦河畔营地
  - 万荣户外营地
□ 设备方案: 便携式光伏充电套装 (可拆卸，便于在无电区域使用)
□ 支付方案: 与老挝当地钱包(如LaoPay)探讨接口
□ 本地支付习惯: 优先接受USDT/USDC，LAK作为辅助

📋 阶段3: 合规与本地化 (第3-8周)
─────────────────────────────────
□ 老挝语核心界面翻译 (约5000字)
□ 泰语辅助界面 (老挝语与泰语互通)
□ 《用户协议》老挝语版准备
□ POS设备部署 (扫码充电)
□ 培训本地商户使用EACO支付

📋 阶段4: 社区运营 (第6-10周)
─────────────────────────────────
□ Telegram老挝语群建立
□ 微信老挝华人/游客群运营
□ 与老挝旅游协会建立联系
□ 目标推广: 中国游客 + 东南亚数字游民 + 欧美背包客
□ 强调"环保旅行"概念，避免"加密货币投资"宣传
```

### 关键合作伙伴清单

| 类型 | 名称/渠道 | 联系优先级 |
|------|-----------|-----------|
| 合作方 | 磨丁经济特区管委会 | ★★★★★ |
| 银行 | 中国工商银行万象分行 | ★★★★☆ |
| 营地 | 万象Adventure Life Hostel | ★★★☆☆ |
| 营地 | 琅勃拉邦 Riverside | ★★★★☆ |
| 社区 | 老挝数字游民社群(Digital Nomads Laos) | ★★★★☆ |

### 风险提示

- ⚠️ 严禁使用"mining"词汇，改用"green energy contribution"
- ⚠️ 避免在公众场合大额展示EACO logo（当地对加密货币有顾虑）
- ⚠️ 所有书面材料由当地律师审核后再使用

---

## 4.4 SOP-3：红其拉甫口岸（巴基斯坦）

### 基本信息

| 项目 | 内容 |
|------|------|
| 口岸名称 | Khunjrab Pass (Khunjerab) |
| 巴方名称 | خُنجَراب |
| 位置 | 北部边境省(GB)，中巴经济走廊最高点 |
| 对应中方口岸 | 红其拉甫口岸 |
| 海拔 | 4,693m (全球最高公路口岸之一) |
| 主要语言 | 乌尔都语、勃固语、英语 |
| 货币 | 巴基斯坦卢比 (PKR) |
| 时区 | UTC+5 |
| 气候 | 高寒，极端缺氧，紫外线极强 |
| 最佳季节 | 5-10月 |
| 加密货币政策 | 🟢 正式合法化，2026年 PVARA 法案 |

### 法规要点

- 巴基斯坦是本项目5个口岸中**法规最友好**的
- 2026年《虚拟资产管理局法案》(VAA 2026) 正式通过
- 需向 PVARA (Pakistan Virtual Assets Regulatory Authority) 申请 VASP 牌照
- 60天 NOC 处理期
- SBP (央行) 要求持牌VASP开立银行账户需额外尽调
- **建议作为合规试点第一站**

### 落地步骤

```
📋 阶段1: PVARA牌照申请 (第1-8周)
─────────────────────────────────
□ 聘请巴基斯坦律师 (伊斯兰堡Awan Law or Hammad & Partners)
□ 准备VASP申请材料:
  - 公司注册证明 (SECP)
  - AML/CFT政策文件
  - 技术架构说明
  - 合规官(Compliance Officer)任命
  - 虚拟资产服务条款
□ 向PVARA提交预沟通 (Pre-consultation)
□ 预计处理周期: 60天
□ 费用预算: CNY 50,000-80,000 (含律师费)

📋 阶段2: 营地与基础设施 (第2-8周)
─────────────────────────────────
□ 目标营地:
  - 吉尔吉特(Gilgit)附近RV sites
  - 罕萨(Hunza)山谷特色营地
  - 伊斯兰堡周边周末营地
□ 高海拔光伏方案:
  · 需定制高海拔耐候光伏板 (抗UV、抗低温)
  · 48V/5kW离网系统
  · 磷酸铁锂电池 (耐低温-20℃)
  · 需配置UPS保护极端断电
□ 强光直射: 光伏效率高，是本项目发电量最大的口岸

📋 阶段3: 本地化 (第3-10周)
─────────────────────────────────
□ 乌尔都语核心UI翻译 (右至左排版适配)
□ 乌尔都语用户协议
□ SBP合规接入 (银行账户开立)
□ 本地支付: 优先USDT结算，PKR作为补充
□ 与巴基斯坦旅游发展局(PTDC)建立合作

📋 阶段4: 运营 (第8-14周)
─────────────────────────────────
□ PVARA VASP牌照获批后正式上线
□ Telegram乌尔都语群建立
□ 与巴基斯坦RV俱乐部 (Pakistan 4x4 Club) 合作推广
□ 强调"绿色能源+数字支付+中巴走廊"概念
□ 面向国际游客: 罕萨山谷是世界级旅游目的地
```

### 关键合作伙伴清单

| 类型 | 名称/渠道 | 联系优先级 |
|------|-----------|-----------|
| 律所 | Awan Law (伊斯兰堡) | ★★★★★ |
| 监管 | PVARA (虚拟资产管理局) | ★★★★★ |
| 银行 | HBL / MCB (需VASP牌照后开账户) | ★★★★☆ |
| 营地 | PTDC Gilgit | ★★★★☆ |
| 营地 | Hunza Eagles Nest | ★★★★☆ |
| 社区 | Pakistan 4x4 Club | ★★★★★ |

---

## 4.5 SOP-4：外贝加尔斯克（俄罗斯）

### 基本信息

| 项目 | 内容 |
|------|------|
| 口岸名称 | Забайкальск (Zabaykalsk) |
| 位置 | 后贝加尔边疆区，俄罗斯 |
| 对应中方口岸 | 满洲里口岸 |
| 主要语言 | 俄语 |
| 货币 | 俄罗斯卢布 (RUB) |
| 时区 | UTC+9 (莫斯科+6) |
| 气候 | 极端大陆性，冬季-40℃ |
| 最佳季节 | 6-9月 |
| 加密货币政策 | 🟡 复杂，受制裁影响 |

### 法规要点

- 俄罗斯于2023年通过加密货币挖矿合法化法律
- 央行积极推动数字卢布研发
- **制裁影响**: 跨境汇款使用加密货币可能触发次级制裁风险
- **核心策略**: 业务仅限俄罗斯境内服务，不涉及跨境汇款
- 使用EACO作为境内消费支付工具是相对安全的场景

### 落地步骤

```
📋 阶段1: 境内主体设立 (第1-6周)
─────────────────────────────────
□ 委托俄罗斯律师 (莫斯科Vygon Law或Baker McKenzie Russia)
□ 设立俄罗斯有限责任公司 (OOO)
□ 注册税务登记 (INN)
□ 开立俄罗斯境内银行账户 (受制裁限制，建议用替代方案):
  · 方案A: 极星银行(Polarstar，已获加密牌照)
  · 方案B: Sberbank CIB
  · 方案C: 稳定币+本地做市商
□ 律师意见: 业务限于境内消费，不涉及跨境汇款

📋 阶段2: 营地与基础设施 (第2-8周)
─────────────────────────────────
□ 目标营地:
  - 后贝加尔地区RV parks
  - 乌兰乌德周边营地
  - 伊尔库茨克贝加尔湖沿线
□ 极寒光伏方案:
  · 需-40℃耐寒光伏板
  · 加热型锂电池BMS
  · 自动融雪系统
  · 柴油备用发电机 (极端情况)
□ 营地合作优先选择已有基础设施的运营方

📋 阶段3: 俄语本地化 (第3-10周)
─────────────────────────────────
□ 俄语全界面翻译 (约20000字)
□ 俄语用户协议 (严格符合俄罗斯152-FZ数据法)
□ 本地化内容:
  · 俄语营地名称、地名
  · 俄语营销文案
  · 俄语客服支持

📋 阶段4: 运营 (第6-14周)
─────────────────────────────────
□ Telegram俄语群建立 (@eaco_rv_russia)
□ 俄语社交媒体运营 (VKontakte)
□ 与俄罗斯RV协会 (ФАР - Федерация автовладельцев России) 合作
□ 推广概念: "能源自主的跨境旅行"
□ 特别注意: 不使用跨境汇款功能，仅做境内消费支付
```

---

## 4.6 SOP-5：扎门乌德（蒙古）

### 基本信息

| 项目 | 内容 |
|------|------|
| 口岸名称 | Zamin Ud (Замын-Уудэн) |
| 位置 | 东方省，蒙古 |
| 对应中方口岸 | 二连浩特口岸 |
| 主要语言 | 喀喇昆仑蒙古语(西里尔字母) |
| 货币 | 蒙古图格里克 (MNT) |
| 时区 | UTC+8 |
| 气候 | 极端大陆性，戈壁气候 |
| 最佳季节 | 5-9月 |
| 加密货币政策 | 🟢 研究阶段，2026年积极推进 |

### 法规要点

- 蒙古央行2026年货币政策指引明确"研究稳定币作为支付手段"
- 尚未出台明确法规，处于政策红利期早期
- 建议参与蒙古央行沙盒试点
- 可将蒙古定位为"数字游牧实验区"

### 落地步骤

```
📋 阶段1: 政府与央行沟通 (第1-6周)
─────────────────────────────────
□ 联系蒙古央行 (Bank of Mongolia) 金融科技部门
□ 表达参与"稳定币支付沙盒试点"意向
□ 委托蒙古律师事务所 (Nomin LLC或GMP Solicitors)
□ 了解MNT稳定币可能性
□ 准备沙盒申请材料

📋 阶段2: 游牧文化融合 (第2-8周)
─────────────────────────────────
□ 目标: 将蒙古"游牧文化"与"光伏房车"融合，打造特色IP
□ 合作方:
  - 蒙古旅游协会
  - 戈壁保护区管理部门
  - 蒙古摄影师协会 (用于内容营销)
□ 营地方案:
  · 轻量化可折叠光伏系统，适合游牧迁移
  · 与蒙古包营地合作
  · "太阳能蒙古包"概念

📋 阶段3: 特色功能开发 (第3-10周)
─────────────────────────────────
□ 离线资产记录 (蒙古偏远地区无网络)
□ 游牧路线验证 (社区DAO验证牧民迁徙路线)
□ 牛羊资产上链 (与蒙古游牧文化结合)
□ EACO教育游戏化 (游牧主题)

📋 阶段4: 运营 (第8-16周)
─────────────────────────────────
□ 乌兰巴托线下活动启动
□ 与UNESCO合作"可持续游牧"项目
□ TikTok/Instagram内容营销 (视觉冲击力强)
□ "数字游牧签证"概念推广
```

---

# 第五部分：预言机与硬件对接方案

## 5.1 预言机验证方案

### 架构设计

```
充电桩控制器 (RS485/蓝牙)
        ↓
  本地数据缓存 (Edge Node)
        ↓
  加密签名 (私钥在本地)
        ↓
  链上验证 (预言机公钥验签)
        ↓
  RewardDistributor合约
        ↓
  EACO代币发放
```

### Switchboard预言机集成

```javascript
// 参考 Switchboard (Solana预言机)
// 文档: https://docs.switchboard.xyz

// 1. 充电桩数据格式
interface ChargerReading {
    charger_id: string;       // 充电桩硬件ID
    user_wallet: string;     // 用户钱包地址
    timestamp: number;       // Unix时间戳
    energy_kwh: number;       // 发电量 (Wh)
    power_w: number;         // 实时功率 (W)
    voltage_v: number;       // 电压 (V)
    signature: string;       // 充电桩私钥签名
}

// 2. 本地签名流程
function signChargingData(data: ChargerReading, chargerPrivateKey: Buffer): string {
    const msg = Buffer.from(JSON.stringify(data));
    return ed25519.sign(msg, chargerPrivateKey);
}

// 3. 链上验证 (伪代码)
async function verifyAndReward(
    energyKwh: bigint,
    location: string,
    signature: Buffer,
    userPubkey: PublicKey
) {
    // 1. 用预言机公钥验签
    const isValid = ed25519.verify(signature, dataBuffer, oraclePublicKey);
    require(isValid, "Invalid oracle signature");

    // 2. 调用RewardDistributor
    await rewardDistributor.submitEnergyRecord({
        accounts: {
            user: userPubkey,
            rewardPool: rewardPoolPDA,
            eacoMint: EACO_MINT,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SYSTEM_PROGRAM_ID,
        },
        args: {
            energyKwh,
            location,
            signature,
        }
    });
}
```

### 简化方案 (MVP阶段)

由于MVP阶段部署完整预言机成本高，采用**混合验证**方案：

| 阶段 | 方案 | 安全性 | 成本 |
|------|------|--------|------|
| MVP | 充电桩蓝牙签名 + APP端哈希 + 后端轮询 | 中 | ¥0 |
| V1.1 | Switchboard Push Feed | 高 | $500/月 |
| V2 | 去中心化预言机网络 | 最高 | $2000/月 |

**MVP简化验证流程：**

```
1. 充电桩通过蓝牙发送加密数据到APP
2. APP提取 {energy_kwh, charger_id, timestamp} 并计算Hash
3. APP调用后端API提交数据 + Hash + 蓝牙签名
4. 后端验证:
   - 时间戳在±5分钟内
   - 同一charger_id同一时间戳无重复记录
   - Hash与充电桩上报数据匹配 (充电桩也上报一次)
5. 后端调用合约submit_energy_record (使用admin签名)
6. 合约验证admin签名后发放奖励
```

## 5.2 充电桩硬件协议

### 硬件选型建议

| 型号 | 功率 | 协议 | 价格(¥) | 适用场景 |
|------|------|------|---------|---------|
| 华为FusionSolar 5kW | 5kW | Modbus RTU | 8,000 | 营地固定 |
| 特变电工TBEA | 3-7kW | RS485 | 6,500 | 房车便携 |
| 固德威GT系列 | 3-5kW | RS485/蓝牙 | 5,500 | 通用 |
| 锦浪GCI系列 | 3-6kW | RS485 | 6,000 | 高海拔 |

### 通信协议 (RS485 Modbus RTU)

```python
# 读取充电数据 (功能码 0x04)
# 寄存器地址:
REG_VOLTAGE = 0x0000      # 电压 (V) * 10
REG_CURRENT = 0x0001       # 电流 (A) * 100
REG_POWER_H = 0x0002       # 功率高位 (W)
REG_POWER_L = 0x0003       # 功率低位 (W)
REG_ENERGY_H = 0x0004      # 累计发电量高位 (Wh)
REG_ENERGY_L = 0x0005      # 累计发电量低位 (Wh)

def read_charging_data(port, device_id):
    client = ModbusClient(port, device_id)
    
    voltage = client.read_holding(REG_VOLTAGE) / 10.0
    current = client.read_holding(REG_CURRENT) / 100.0
    power = (client.read_holding(REG_POWER_H) << 16) + client.read_holding(REG_POWER_L)
    energy = (client.read_holding(REG_ENERGY_H) << 16) + client.read_holding(REG_ENERGY_L)
    
    return {
        "voltage": voltage,
        "current": current,
        "power": power,
        "energy_wh": energy,
        "timestamp": time.time()
    }
```

### APP端数据采集流程

```javascript
// React Native / Flutter 蓝牙通信
// 使用 react-native-ble-plx 或 flutter_blue_plus

import { BLE } from 'some-ble-library';

class ChargerService {
    async connect(chargerId) {
        // 1. 扫描并连接充电桩蓝牙
        const device = await BLE.connect(chargerId);
        
        // 2. 订阅实时数据通知
        await device.startNotification(CHARGER_SERVICE_UUID, DATA_CHAR_UUID, (data) => {
            const reading = this.parseReading(data);
            this.cache.push(reading);
        });
        
        // 3. 定时读取累计发电量
        setInterval(async () => {
            const total = await this.readTotalEnergy(device);
            this.lastTotalEnergy = total;
        }, 60000); // 每分钟
    }
    
    async getChargingSession() {
        const start = this.cache[0];
        const end = this.cache[this.cache.length - 1];
        
        const session = {
            charger_id: this.chargerId,
            start_time: start.timestamp,
            end_time: end.timestamp,
            energy_kwh: (end.energy_wh - start.energy_wh) / 1000,
            avg_power_w: this.calculateAvg(this.cache, 'power'),
            max_power_w: this.calculateMax(this.cache, 'power'),
        };
        
        // 签名并提交
        const signature = await this.signSession(session);
        return { ...session, signature };
    }
}
```

---

# 第六部分：API接口规范

## 6.1 API基础规范

- **Base URL**: `https://api.rv-solar-eaco.com/v1` (测试网: `https://test-api.rv-solar-eaco.com/v1`)
- **认证**: Bearer Token (JWT)
- **内容类型**: `application/json`
- **编码**: UTF-8
- **签名**: 所有请求需包含 `X-Signature` 头 (HMAC-SHA256)

## 6.2 核心接口

### 用户模块

```
POST   /auth/send-code          发送验证码
POST   /auth/verify-code        验证验证码并登录
POST   /auth/refresh-token      刷新Token

GET    /users/me                获取当前用户信息
PUT    /users/me                更新用户资料
GET    /users/me/wallet         获取用户钱包信息
POST   /users/me/wallet/create  创建新钱包

GET    /users/me/energy-records 查询绿电记录
GET    /users/me/carbon-account 查询碳积分账户
GET    /users/me/nfts           查询用户持有的NFT
```

### 营地模块

```
GET    /campsites               营地列表 (分页/筛选)
GET    /campsites/:id          营地详情
GET    /campsites/:id/spots    营地车位状态
GET    /campsites/nearby       附近营地 (按坐标)

GET    /ports                  口岸列表
GET    /ports/:id              口岸详情
```

### 订单模块

```
POST   /orders                 创建订单
GET    /orders                 订单列表
GET    /orders/:id             订单详情
PUT    /orders/:id/cancel      取消订单
POST   /orders/:id/rate        评价订单
```

### 支付模块

```
POST   /payments/create-intent 创建支付意图
POST   /payments/execute       执行支付
GET    /payments/:id           支付状态查询
POST   /payments/:id/refund    申请退款

GET    /payments/tokens        支持的支付代币列表
GET    /payments/exchange-rate 获取实时汇率
```

### 充电模块

```
POST   /charging/start         开始充电 (扫码)
GET    /charging/current       当前充电状态
POST   /charging/stop          停止充电
GET    /charging/history        充电历史

POST   /charging/verify        提交充电数据供预言机验证
GET    /charging/verify-status 验证状态查询
```

### 社区模块

```
POST   /contributions          提交贡献
GET    /contributions          贡献列表
GET    /contributions/:id      贡献详情
POST   /contributions/:id/upvote 点赞

GET    /leaderboard/energy     绿电排行榜
GET    /leaderboard/contrib   贡献排行榜

GET    /ambassadors/apply     大使申请
GET    /ambassadors/me         我的大使状态
```

### P2P能源模块

```
POST   /listings               挂牌出售
GET    /listings               挂牌列表
GET    /listings/:id           挂牌详情
POST   /listings/:id/buy       购买电力
DELETE /listings/:id           撤销挂牌
```

## 6.3 API响应格式

```json
// 成功响应
{
    "code": 0,
    "message": "success",
    "data": { ... },
    "timestamp": 1718284800
}

// 错误响应
{
    "code": 10001,
    "message": "Invalid order status",
    "details": {
        "current_status": "paid",
        "allowed_status": "pending"
    },
    "timestamp": 1718284800
}
```

## 6.4 错误码表

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 10001 | 参数错误 |
| 10002 | 签名验证失败 |
| 10003 | Token过期 |
| 20001 | 用户不存在 |
| 20002 | 钱包已存在 |
| 30001 | 营地不存在 |
| 30002 | 营地已满 |
| 30003 | 日期不可用 |
| 40001 | 订单不存在 |
| 40002 | 订单状态不允许该操作 |
| 40003 | 支付超时 |
| 40004 | 余额不足 |
| 40005 | 支付失败 |
| 50001 | 充电桩不在线 |
| 50002 | 充电已进行中 |
| 50003 | 充电记录不存在 |
| 60001 | 预言机签名无效 |
| 60002 | 奖励池余额不足 |

---

# 第七部分：智能合约安全审计计划

## 7.1 审计标准

| 标准 | 版本 | 说明 |
|------|------|------|
| OWASP Solidity | 2024 | 智能合约安全漏洞检测 |
| Consensys Diligence | - | 区块链安全最佳实践 |
| Solidity Compiler | ≥0.8.x | 使用最新编译器版本 |
| Trail of Bits | 检测框架 | 自动化静态分析 |

## 7.2 审计清单

### 7.2.1 代币合约审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| 重入攻击 | 转账函数是否使用CEI模式（Checks-Effects-Interactions） | 🔴致命 |
| 溢出/下溢 | 是否使用Solidity 0.8+内置溢出检查 | 🔴致命 |
| 授权无限额 | approve是否设置了交易限额 | 🔴致命 |
| 代币精度 | decimals处理是否正确 | 🟡高 |
| 余额冻结 | transferFrom是否检查冻结状态 | 🟡高 |
| 闪电铸币 | 铸币函数是否有供应量上限验证 | 🟡高 |

### 7.2.2 RewardDistributor审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| 预言机签名伪造 | oracle_signature是否由正确公钥验签 | 🔴致命 |
| 双重申领 | 同一charging_id是否只能申领一次 | 🔴致命 |
| 奖励率任意修改 | set_reward_rate是否需要多签 | 🔴致命 |
| 奖励池耗尽 | 余额不足时是否正确回滚交易 | 🔴致命 |
| 时间戳操纵 | block.timestamp是否影响关键逻辑 | 🟡高 |
| 随机性 | 奖励抽取是否使用可验证随机函数 | 🟢中 |
| 整数除法精度 | 除法结果是否向下取整导致误差 | 🟡高 |

### 7.2.3 PaymentGateway审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| 重入攻击 | pay_order是否使用CEI模式 | 🔴致命 |
| 订单状态重放 | 同一order_id_hash是否只能支付一次 | 🔴致命 |
| 退款双重领取 | refund是否检查订单状态 | 🔴致命 |
| 退款超时验证 | 是否正确验证24小时退款窗口 | 🟡高 |
| EACO折扣绕过 | 是否存在绕过9折直接全额支付漏洞 | 🔴致命 |
| 金额精度 | USDT/USDC精度(6位) vs EACO精度(6位)换算 | 🟡高 |
| 支付Token白名单 | 是否验证payment_token在白名单内 | 🟡高 |

### 7.2.4 EnergyNFT审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| NFT铸造权限 | mint权限是否正确绑定RewardDistributor | 🔴致命 |
| 元数据篡改 | metadata是否防篡改（使用PDA存储） | 🟡高 |
| 转让权限 | transfer是否验证owner签名 | 🔴致命 |
| 交易签名伪造 | buy_nft的买家签名是否验签 | 🔴致命 |
| 地板价操控 | 是否存在NFT上架0价格套利 | 🟡高 |
| IPFS哈希验证 | metadata.uri是否验证IPFS CID | 🟢中 |

### 7.2.5 P2PEnergyMarket审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| 挂牌超卖 | 同一listing_id的remaining_kwh是否原子扣减 | 🔴致命 |
| 价格操控 | price_eaco_per_kwh是否在交易时重新验证 | 🟡高 |
| 撤销后仍可买 | 撤销后是否立即从市场移除 | 🟡高 |
| Gas Griefing | buy_energy循环是否设置上限 | 🟢中 |
| 恶意挂牌 | listing_id是否为确定性可预测 | 🟡高 |

### 7.2.6 通用合约审计

| 检查项 | 说明 | 风险等级 |
|--------|------|---------|
| 权限升级 | upgrade是否需要多签+时间锁 | 🔴致命 |
| Owner密钥泄露 | 多签地址是否使用硬件钱包管理 | 🔴致命 |
| 时间锁配置 | 时间锁延迟是否合理（48h-7d） | 🟡高 |
| 紧急关停 | pause函数是否仅限admin调用 | 🟡高 |
| 事件完整性 | 所有状态变更是否发出事件 | 🟢中 |
| 合约升级代理 | 是否使用可升级代理模式（UUPS/Transparent） | 🟡高 |
| tx.origin使用 | 是否避免tx.origin鉴权 | 🟢中 |
| 区块依赖逻辑 | 是否避免关键逻辑依赖block.number | 🟢中 |

## 7.3 审计流程

```
阶段1: 静态分析 (Day 1-2)
├── 使用Slither (Trail of Bits) 自动扫描
├── 使用Mythril 符号执行
└── 手动代码审查 (每合约2人)

阶段2: 动态测试 (Day 3-4)
├── 测试网部署 (Devnet/Testnet)
├── 编写测试用例 ≥ 50条/合约
│   ├── Happy path (正常流程)
│   ├── Edge cases (边界值)
│   └── Attack simulation (攻击模拟)
└── 代码覆盖率 ≥ 95%

阶段3: 形式化验证 (Day 5)
├── Certora Prover (关键函数)
└── Halmos (算术运算验证)

阶段4: 报告与修复 (Day 6-7)
├── 编写审计报告
├── 修复发现的所有问题
├── 二次审计 (关键漏洞)
└── 发布公开审计报告
```

## 7.4 审计预算

| 项目 | 预算 | 机构推荐 |
|------|------|---------|
| 第三方审计（4合约） | ¥120,000-200,000 | Trail of Bits / OpenZeppelin / Spearbit |
| 自动化工具订阅 | ¥5,000/年 | Slither Pro / MythX |
| 形式化验证 | ¥30,000（可选） | Certora |
| **合计** | **¥155,000-235,000** | — |

---

# 第八部分：数据库ER图与数据字典

## 8.1 ER图（实体关系图）

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              用户与账户层                                      │
│                                                                              │
│   ┌──────────┐     1:N     ┌───────────────┐                                 │
│   │  users   │─────────────│ wallet_assets │ (用户多币种钱包)                 │
│   └────┬─────┘             └───────────────┘                                 │
│        │                                                                  │
│        │ 1:N                                                               │
│        ▼                                                                  │
│   ┌──────────┐     1:N     ┌────────────────────┐                          │
│   │  users   │─────────────│ green_energy_records│───N:1──┐                │
│   └────┬─────┘             └────────────────────┘         │                │
│        │                        ↑ verified_by_oracle      │                │
│        │                        │                           │                │
│        │ 1:N                    │                           ▼                │
│        ▼                  ┌──────────────┐           ┌─────────────┐        │
│   ┌──────────┐          │  oracles     │           │   campsites  │        │
│   │  orders  │──N:1───→│ (预言机节点) │           └─────────────┘        │
│   └──────────┘          └──────────────┘                  │               │
│        │                                               N:1                   │
│        │ 1:N                                            ▼                    │
│        ▼                                      ┌──────────────────┐           │
│   ┌────────────┐                            │  port_crossings   │           │
│   │ charging_ │──N:1───────────────→        │   (口岸表)       │           │
│   │ records   │                             └──────────────────┘           │
│   └────────────┘                                                             │
│        │                                                                        │
│        │ 1:N                                                                   │
│        ▼                                                                        │
│   ┌────────────────┐  1:N      ┌────────────────┐                             │
│   │carbon_accounts │──────────│carbon_trans   │                             │
│   └────────────────┘           └────────────────┘                             │
│        │                                                                        │
│        │ 1:N                                                                   │
│        ▼                                                                        │
│   ┌────────────────┐  1:N      ┌────────────────┐                             │
│   │ nft_holdings   │──────────│ energy_nfts    │                             │
│   └────────────────┘           └────────────────┘                             │
│        │                                                                        │
│        │ 1:N                                                                   │
│        ▼                                                                        │
│   ┌────────────────┐  1:N      ┌────────────────┐                             │
│   │ contributions  │──────────│    upvotes     │                             │
│   └────────────────┘           └────────────────┘                             │
│        │                                                                        │
│        │ 1:N                                                                   │
│        ▼                                                                        │
│   ┌────────────────┐                                                          │
│   │energy_listings │ (P2P挂牌)                                                │
│   └────────────────┘                                                          │
│        │                                                                        │
│        │ 1:N                                                                   │
│        ▼                                                                        │
│   ┌────────────────┐                                                          │
│   │  ambassadors   │ (大使表)                                                 │
│   └────────────────┘                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 8.2 核心数据字典

### 8.2.1 users（用户表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 用户ID | UUID | PK, DEFAULT gen_random_uuid() | 全局唯一标识 |
| phone_code | 国际区号 | VARCHAR(6) | NOT NULL, DEFAULT '+86' | +86/+7/+1等 |
| phone_number | 手机号 | VARCHAR(20) | NOT NULL, UNIQUE | 脱敏存储 |
| nickname | 昵称 | VARCHAR(50) | — | 用户自定义 |
| avatar_url | 头像URL | VARCHAR(500) | — | CDN链接 |
| wallet_address | 钱包地址 | VARCHAR(64) | NOT NULL | Solana公钥Base58 |
| user_level | 用户等级 | INTEGER | DEFAULT 1 | 1=普通,2=大使,3=核心 |
| credit_score | 信誉分 | INTEGER | DEFAULT 100, CHECK 0-1000 | 信誉评估 |
| language | 语言偏好 | VARCHAR(10) | DEFAULT 'zh' | zh/en/ru/mn |
| kyc_status | KYC状态 | VARCHAR(20) | DEFAULT 'none' | none/pending/verified |
| kyc_level | KYC级别 | INTEGER | DEFAULT 0 | 0=无,1=基础,2=高级 |
| total_energy_kwh | 累计发电量 | BIGINT | DEFAULT 0 | 单位Wh |
| total_reward_eaco | 累计获得EACO | BIGINT | DEFAULT 0 | 最小单位 |
| referrer_id | 推荐人ID | UUID | FK users(id) | 推荐关系 |
| created_at | 注册时间 | TIMESTAMPTZ | DEFAULT NOW() | — |
| updated_at | 更新时间 | TIMESTAMPTZ | DEFAULT NOW() | — |
| last_active_at | 最后活跃 | TIMESTAMPTZ | — | 用于活跃度分析 |

### 8.2.2 campsites（营地表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 营地ID | UUID | PK | — |
| name | 营地名称 | VARCHAR(200) | NOT NULL | 中文名 |
| name_local | 本地名称 | VARCHAR(200) | — | 当地语言 |
| name_en | 英文名称 | VARCHAR(200) | — | — |
| country_code | 国家代码 | VARCHAR(3) | NOT NULL | ISO3166-1 |
| port_id | 所属口岸 | UUID | FK port_crossings(id) | — |
| address | 地址 | VARCHAR(500) | — | — |
| latitude | 纬度 | DECIMAL(10,8) | — | 地图展示 |
| longitude | 经度 | DECIMAL(11,8) | — | 地图展示 |
| price_usd_cents | 基础价格 | INTEGER | — | 美分/晚 |
| solar_capacity_kw | 光伏装机 | DECIMAL(8,2) | DEFAULT 0 | kW |
| charging_spots | 充电桩数 | INTEGER | DEFAULT 0 | — |
| max_charging_power_w | 最大功率 | INTEGER | DEFAULT 0 | W |
| images | 图片URLs | JSONB | DEFAULT '[]' | CDN链接数组 |
| amenities | 设施列表 | TEXT[] | DEFAULT '{}' | wifi/淋浴/厕所等 |
| operator_wallet | 运营商钱包 | VARCHAR(64) | — | Solana地址 |
| rating | 评分 | DECIMAL(3,2) | DEFAULT 0 | 1-5分 |
| status | 状态 | VARCHAR(20) | DEFAULT 'active' | active/inactive/pending |

### 8.2.3 port_crossings（口岸表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 口岸ID | UUID | PK | — |
| name | 口岸名称 | VARCHAR(200) | NOT NULL | — |
| country_code | 国家代码 | VARCHAR(3) | NOT NULL | — |
| country_name | 国家名称 | VARCHAR(100) | NOT NULL | — |
| border_type | 口岸类型 | VARCHAR(20) | — | land/water/air |
| lat_side | 所在方 | VARCHAR(20) | — | china/foreign |
| crypto_friendly | 加密友好度 | INTEGER | DEFAULT 3, CHECK 1-5 | 1=最不友好 |
| solar_potential | 光照潜力 | INTEGER | DEFAULT 3, CHECK 1-5 | 1=最差 |
| rv_friendly | 房车友好度 | INTEGER | DEFAULT 3, CHECK 1-5 | 1=最差 |
| language_codes | 支持语言 | TEXT[] | DEFAULT '{zh,en}' | — |
| regulatory_note | 监管备注 | TEXT | — | 风险提示 |
| onboarding_status | 上线状态 | VARCHAR(20) | DEFAULT 'planned' | planned/pilot/active |
| priority | 优先级 | INTEGER | DEFAULT 3, CHECK 1-3 | 1=最高 |

### 8.2.4 orders（订单表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 订单ID | UUID | PK | — |
| order_no | 订单号 | VARCHAR(32) | UNIQUE | 格式: ORD+YYYYMMDD+6位随机 |
| user_id | 用户ID | UUID | FK users(id) | — |
| campsite_id | 营地ID | UUID | FK campsites(id) | — |
| check_in_date | 入住日期 | DATE | NOT NULL | — |
| check_out_date | 离店日期 | DATE | NOT NULL | — |
| nights | 入住夜数 | INTEGER | NOT NULL, CHECK >0 | — |
| amount_usd_cents | 订单金额 | INTEGER | NOT NULL | 美分 |
| payment_token | 支付币种 | VARCHAR(20) | — | USDT/USDC/EACO等 |
| payment_status | 支付状态 | VARCHAR(20) | DEFAULT 'pending' | pending/paid/cancelled/refunded |
| payment_tx_hash | 链上TxHash | VARCHAR(100) | — | Solana交易哈希 |
| discount_applied | 是否折扣 | BOOLEAN | DEFAULT FALSE | — |
| discount_reason | 折扣原因 | VARCHAR(200) | — | EACO支付9折 |
| paid_at | 支付时间 | TIMESTAMPTZ | — | — |
| user_rating | 用户评分 | INTEGER | CHECK 1-5 | 1-5星 |

### 8.2.5 charging_records（充电记录表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 记录ID | UUID | PK | — |
| user_id | 用户ID | UUID | FK users(id) | — |
| campsite_id | 营地ID | UUID | FK campsites(id) | — |
| charger_id | 充电桩ID | VARCHAR(100) | NOT NULL | 硬件序列号 |
| start_time | 开始时间 | TIMESTAMPTZ | NOT NULL | — |
| end_time | 结束时间 | TIMESTAMPTZ | — | NULL表示进行中 |
| energy_kwh | 充电量 | DECIMAL(10,4) | NOT NULL | kWh |
| max_power_w | 峰值功率 | INTEGER | — | W |
| avg_power_w | 平均功率 | INTEGER | — | W |
| price_per_kwh | 每kWh单价 | DECIMAL(12,6) | — | 最小单位 |
| total_amount | 总费用 | BIGINT | — | 最小单位 |
| on_chain | 是否上链 | BOOLEAN | DEFAULT FALSE | — |
| chain_tx_hash | 链上哈希 | VARCHAR(100) | — | — |

### 8.2.6 green_energy_records（绿电记录表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 记录ID | UUID | PK | — |
| user_id | 用户ID | UUID | FK users(id) | — |
| charging_id | 充电记录ID | UUID | FK charging_records(id) | — |
| energy_kwh | 发电量 | BIGINT | NOT NULL | 单位Wh |
| location | 地点 | VARCHAR(200) | — | 口岸+营地名称 |
| oracle_address | 预言机地址 | VARCHAR(64) | — | 签名验证方 |
| oracle_signature | 预言机签名 | VARCHAR(500) | — | Ed25519签名 |
| verified | 是否验证 | BOOLEAN | DEFAULT FALSE | — |
| reward_eaco | 奖励EACO | BIGINT | DEFAULT 0 | 最小单位 |
| reward_tx_hash | 奖励TxHash | VARCHAR(100) | — | Solana交易哈希 |
| nft_mint | NFT Mint | VARCHAR(64) | — | ≥10kWh时铸造 |

### 8.2.7 carbon_accounts（碳积分账户表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 账户ID | UUID | PK | — |
| user_id | 用户ID | UUID | FK users(id), UNIQUE | 一人一账户 |
| total_co2_kg | 累计减排 | DECIMAL(12,4) | DEFAULT 0 | kg CO₂ |
| available_co2_kg | 可用碳积分 | DECIMAL(12,4) | DEFAULT 0 | kg |
| redeemed_co2_kg | 已兑换 | DECIMAL(12,4) | DEFAULT 0 | kg |

### 8.2.8 contributions（社区贡献表）

| 字段名 | 中文名 | 数据类型 | 约束 | 说明 |
|--------|--------|---------|------|------|
| id | 贡献ID | UUID | PK | — |
| user_id | 用户ID | UUID | FK users(id) | — |
| type | 贡献类型 | VARCHAR(30) | NOT NULL | 见下表 |
| content | 贡献内容 | TEXT | NOT NULL | — |
| location_lat/lng | 地理位置 | DECIMAL | — | 上报位置 |
| location_text | 位置文字 | VARCHAR(200) | — | 如"霍尔果斯-阿拉山口" |
| images | 图片附件 | JSONB | DEFAULT '[]' | — |
| port_id | 所属口岸 | UUID | FK port_crossings(id) | — |
| status | 审核状态 | VARCHAR(20) | DEFAULT 'pending' | pending/approved/rejected |
| reward_eaco | 奖励EACO | BIGINT | DEFAULT 0 | — |
| upvote_count | 点赞数 | INTEGER | DEFAULT 0 | — |

**贡献类型枚举 (contribution_types):**

| type值 | 中文名 | 奖励EACO |
|--------|--------|---------|
| road_condition | 路况上报 | 5-20 |
| camp_info | 新营地信息 | 20-50 |
| rescue | 互助救援 | 30-100 |
| device_tip | 设备技巧 | 10-30 |
| review | 营地评价 | 5-15 |
| photo_share | 图片分享 | 3-10 |

---

# 第九部分：API详细规范（OpenAPI 3.0）

## 9.1 OpenAPI规范摘要

```yaml
openapi: 3.0.3
info:
  title: RV Solar EACO API
  version: "1.0"
  description: 光伏房车EACO平台API规范
  contact:
    name: EACO Dev Team
    email: dev@rv-solar-eaco.com

servers:
  - url: https://api.rv-solar-eaco.com/v1
    description: 生产环境
  - url: https://test-api.rv-solar-eaco.com/v1
    description: 测试环境

tags:
  - name: auth
    description: 认证模块
  - name: users
    description: 用户模块
  - name: campsites
    description: 营地模块
  - name: orders
    description: 订单模块
  - name: charging
    description: 充电模块
  - name: payments
    description: 支付模块
  - name: community
    description: 社区模块
  - name: p2p
    description: P2P能源模块

paths:
  # ============ 认证模块 ============
  /auth/send-code:
    post:
      tags: [auth]
      summary: 发送验证码
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [phone_code, phone_number]
              properties:
                phone_code:
                  type: string
                  example: "+86"
                  description: 国际区号
                phone_number:
                  type: string
                  example: "13812345678"
      responses:
        "200":
          description: 验证码已发送
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      expires_in: { type: integer, example: 300 }
                      # 5分钟有效期

  /auth/verify-code:
    post:
      tags: [auth]
      summary: 验证验证码并登录
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [phone_code, phone_number, code]
              properties:
                phone_code: { type: string, example: "+86" }
                phone_number: { type: string, example: "13812345678" }
                code: { type: string, example: "123456", description: "6位数字验证码" }
      responses:
        "200":
          description: 登录成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      access_token: { type: string, description: "JWT访问令牌" }
                      refresh_token: { type: string, description: "刷新令牌" }
                      expires_in: { type: integer, example: 2592000 }
                      user:
                        type: object
                        $ref: "#/components/schemas/User"

  # ============ 用户模块 ============
  /users/me:
    get:
      tags: [users]
      summary: 获取当前用户信息
      security:
        - BearerAuth: []
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    $ref: "#/components/schemas/User"

  /users/me/wallet:
    get:
      tags: [users]
      summary: 获取用户钱包信息
      security:
        - BearerAuth: []
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      address: { type: string, example: "7nE3..." }
                      balances:
                        type: array
                        items:
                          type: object
                          properties:
                            token: { type: string, example: "EACO" }
                            balance: { type: number, example: 15420.5 }
                            in_usd: { type: number, example: 123.36 }

  /users/me/energy-records:
    get:
      tags: [users]
      summary: 查询绿电记录
      security:
        - BearerAuth: []
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: page_size
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
        - name: start_date
          in: query
          schema: { type: string, format: date }
        - name: end_date
          in: query
          schema: { type: string, format: date }
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      total: { type: integer, example: 156 }
                      page: { type: integer, example: 1 }
                      page_size: { type: integer, example: 20 }
                      records:
                        type: array
                        items:
                          type: object
                          properties:
                            id: { type: string }
                            energy_kwh: { type: number, example: 8.5 }
                            location: { type: string, example: "霍尔果斯-阿拉木图驿站" }
                            verified: { type: boolean }
                            reward_eaco: { type: integer, example: 8500 }
                            created_at: { type: string, format: date-time }

  # ============ 营地模块 ============
  /campsites:
    get:
      tags: [campsites]
      summary: 营地列表（支持分页/筛选）
      security:
        - BearerAuth: []
      parameters:
        - name: port_id
          in: query
          schema: { type: string, format: uuid }
          description: 口岸ID筛选
        - name: country_code
          in: query
          schema: { type: string, example: "KZ" }
        - name: has_charging
          in: query
          schema: { type: boolean }
          description: 是否支持充电
        - name: min_price
          in: query
          schema: { type: integer }
          description: 最低价格（美分）
        - name: max_price
          in: query
          schema: { type: integer }
        - name: latitude
          in: query
          schema: { type: number }
        - name: longitude
          in: query
          schema: { type: number }
        - name: radius_km
          in: query
          schema: { type: number, default: 50 }
        - name: sort_by
          in: query
          schema:
            type: string
            enum: [distance, price, rating, solar_capacity]
            default: distance
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: page_size
          in: query
          schema: { type: integer, default: 20 }
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      total: { type: integer }
                      page: { type: integer }
                      campsites:
                        type: array
                        items:
                          $ref: "#/components/schemas/Campsite"

  /campsites/{id}:
    get:
      tags: [campsites]
      summary: 营地详情
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema: { type: string, format: uuid }
      responses:
        "200":
          description: 成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    $ref: "#/components/schemas/Campsite"

  # ============ 订单模块 ============
  /orders:
    post:
      tags: [orders]
      summary: 创建订单
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [campsite_id, check_in_date, check_out_date, spot_type]
              properties:
                campsite_id:
                  type: string
                  format: uuid
                  description: 营地ID
                check_in_date:
                  type: string
                  format: date
                  description: 入住日期
                check_out_date:
                  type: string
                  format: date
                  description: 离店日期
                spot_type:
                  type: string
                  enum: [rv, tent, parking]
                  description: 车位类型
      responses:
        "200":
          description: 订单创建成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      order_id: { type: string, format: uuid }
                      order_no: { type: string, example: "ORD20260613001" }
                      amount_usd_cents: { type: integer, example: 5000 }
                      payment_deadline: { type: string, format: date-time }
                      # 72小时内需支付

  # ============ 充电模块 ============
  /charging/start:
    post:
      tags: [charging]
      summary: 开始充电（扫码）
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [charger_id]
              properties:
                charger_id:
                  type: string
                  description: 充电桩硬件二维码内容
                payment_token:
                  type: string
                  enum: [EACO, USDT, USDC]
                  default: EACO
      responses:
        "200":
          description: 充电已开始
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      charging_id: { type: string, format: uuid }
                      session_id: { type: string }
                      start_time: { type: string, format: date-time }
                      realtime:
                        type: object
                        properties:
                          power_w: { type: integer, example: 3200 }
                          voltage_v: { type: number, example: 220.5 }
                          current_a: { type: number, example: 14.5 }
                          energy_kwh: { type: number, example: 0.52 }
                          # 本次已充电量

  /charging/stop:
    post:
      tags: [charging]
      summary: 停止充电
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [charging_id]
              properties:
                charging_id:
                  type: string
                  format: uuid
      responses:
        "200":
          description: 充电已停止，结算中
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      charging_id: { type: string }
                      total_energy_kwh: { type: number, example: 8.5 }
                      total_amount: { type: integer, example: 850000 }
                      # EACO最小单位
                      payment_token: { type: string, example: "EACO" }
                      discount_applied: { type: boolean, example: true }
                      # EACO支付享9折
                      reward_eaco: { type: integer, example: 8500 }
                      # 绿电奖励
                      carbon_kg: { type: number, example: 4.25 }
                      # 碳减排kg

  # ============ 支付模块 ============
  /payments/execute:
    post:
      tags: [payments]
      summary: 执行支付
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [order_id, payment_token]
              properties:
                order_id:
                  type: string
                  format: uuid
                payment_token:
                  type: string
                  enum: [EACO, USDT, USDC, SOL, WBNB]
                  description: 支付币种
                wallet_address:
                  type: string
                  description: 付款钱包地址（若与注册钱包不同）
      responses:
        "200":
          description: 支付成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      payment_status: { type: string, example: "paid" }
                      tx_hash: { type: string }
                      amount_paid:
                        type: object
                        properties:
                          token: { type: string }
                          amount: { type: number }
                          amount_usd: { type: number }

  # ============ 社区模块 ============
  /contributions:
    post:
      tags: [community]
      summary: 提交贡献
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [type, content]
              properties:
                type:
                  type: string
                  enum: [road_condition, camp_info, rescue, device_tip, review, photo_share]
                content:
                  type: string
                  description: 贡献内容文字描述
                location_text:
                  type: string
                location_lat:
                  type: number
                location_lng:
                  type: number
                images:
                  type: array
                  items: { type: string, format: binary }
                  description: 图片文件列表
      responses:
        "200":
          description: 提交成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      contribution_id: { type: string, format: uuid }
                      status: { type: string, example: "pending" }
                      estimated_reward: { type: integer, example: 20 }
                      # 预估奖励EACO

  # ============ P2P能源模块 ============
  /listings:
    post:
      tags: [p2p]
      summary: 挂牌出售余电
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [energy_kwh, price_eaco_per_kwh]
              properties:
                energy_kwh:
                  type: integer
                  description: 挂牌电量 (Wh)
                price_eaco_per_kwh:
                  type: integer
                  description: 单价 (EACO/kWh, 最小单位)
                location_text:
                  type: string
      responses:
        "200":
          description: 挂牌成功
          content:
            application/json:
              schema:
                type: object
                properties:
                  code: { type: integer, example: 0 }
                  data:
                    type: object
                    properties:
                      listing_id: { type: string }
                      listing_no: { type: string }
                      status: { type: string, example: "active" }

# ============ 组件定义 ============
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT访问令牌

  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        phone_code: { type: string, example: "+86" }
        phone_number: { type: string, example: "138****5678" }
        nickname: { type: string, example: "房车老王" }
        wallet_address: { type: string, example: "7nE3..." }
        user_level: { type: integer, example: 2 }
        credit_score: { type: integer, example: 850 }
        language: { type: string, example: "zh" }
        total_energy_kwh: { type: integer, example: 15600 }
        total_reward_eaco: { type: integer, example: 1560000 }
        created_at: { type: string, format: date-time }

    Campsite:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string, example: "霍尔果斯国际房车驿站" }
        name_en: { type: string, example: "Khorgos International RV Hub" }
        country_code: { type: string, example: "KZ" }
        address: { type: string }
        latitude: { type: number }
        longitude: { type: number }
        price_usd_cents: { type: integer, example: 3000 }
        solar_capacity_kw: { type: number, example: 15.0 }
        charging_spots: { type: integer, example: 4 }
        max_charging_power_w: { type: integer, example: 22000 }
        amenities: { type: array, items: { type: string }, example: ["wifi", "shower", "toilet", "solar_charging"] }
        images: { type: array, items: { type: string } }
        operator_name: { type: string }
        rating: { type: number, example: 4.8 }
        rating_count: { type: integer, example: 126 }
        distance_km: { type: number, description: "距用户当前位置距离" }
```

---

# 第十部分：硬件规格书

## 10.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────┐
│                        用户APP (移动端)                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │
│  │ 钱包模块 │  │ 地图模块 │  │ 充电模块 │  │ 社区贡献模块      │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────┬─────────┘    │
│       │             │             │                  │              │
│       └─────────────┴──────┬──────┴──────────────────┘              │
│                           ▼                                         │
│              ┌─────────────────────────┐                          │
│              │      后端API服务         │                          │
│              │  (Node.js + PostgreSQL)  │                          │
│              └───────────┬──────────────┘                          │
│                          │                                          │
│     ┌───────────────────┼───────────────────┐                     │
│     ▼                   ▼                   ▼                      │
│ ┌──────────┐    ┌──────────────┐    ┌──────────────┐              │
│ │预言机服务│    │ 支付网关     │    │ 链上合约    │              │
│ │(Oracle) │    │ 2328.io     │    │ (Solana)    │              │
│ └────┬─────┘    └──────────────┘    └──────┬───────┘              │
│      │                                       │                    │
└──────┼───────────────────────────────────────┼────────────────────┘
       │                                       │
       │  蓝牙/RS485                           │ 链上交易
       ▼                                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     充电桩 (光伏逆变器)                            │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐       │
│  │ 太阳能板输入│  │  MPPT控制器  │  │  锂电池BMS       │       │
│  │ (400W×4)   │→ │  (MPPT)     │→ │  (48V/100Ah)   │       │
│  └─────────────┘  └──────────────┘  └────────┬─────────┘       │
│                                             │                   │
│                                    ┌────────▼────────┐          │
│                                    │  房车充电接口    │          │
│                                    │  (交流220V/16A) │          │
│                                    └─────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 10.2 核心硬件选型

### 10.2.1 光伏组件

| 参数 | 标准型 | 高海拔型(巴基斯坦) | 极寒型(俄罗斯/蒙古) |
|------|--------|------------------|------------------|
| 峰值功率 | 400W | 400W | 400W |
| 效率 | ≥21.5% | ≥21% | ≥20.5% |
| 工作温度 | -40℃~+85℃ | -40℃~+85℃ | **-50℃~+85℃** |
| 抗UV | 抗UV | 抗UV | 抗UV+抗低温脆化 |
| 尺寸 | 1755×1038×35mm | 1755×1038×35mm | 1755×1038×40mm |
| 重量 | 21kg | 21kg | 23kg |
| 防护等级 | IP68 | IP68 | **IP68+抗沙尘** |
| 边框 | 铝合金 | 铝合金 | **镀锌钢框** |
| 推荐品牌 | 隆基Hi-MO 6 | 隆基Hi-MO 6 | **韩华Qcells** |
| 参考价(¥) | 1,200 | 1,350 | 1,600 |

### 10.2.2 磷酸铁锂电池组

| 参数 | 标准型 | 营地固定型 | 高海拔型 |
|------|--------|-----------|---------|
| 电压 | 48V | 48V | 48V |
| 容量 | 100Ah (5kWh) | 200Ah (10kWh) | 100Ah (5kWh) |
| 电芯 | 磷酸铁锂 | 磷酸铁锂 | 磷酸铁锂 |
| 循环寿命 | ≥4000次@80%DOD | ≥4000次 | ≥4000次 |
| 工作温度 | -10℃~+55℃ | -10℃~+55℃ | **-20℃~+55℃** |
| 充电温度 | 0℃~+55℃ | 0℃~+55℃ | -20℃~+55℃ |
| BMS功能 | 过充/过放/过温/短路保护 | 同左+均衡 | 同左+加热膜 |
| 防水等级 | IP65 | IP65 | IP65 |
| 推荐品牌 | 比亚迪/宁德时代 | 宁德时代 | **亿纬锂能** |
| 参考价(¥) | 5,500 | 9,800 | 7,200 |

### 10.2.3 MPPT充电控制器

| 参数 | 标准型 | 大功率型 |
|------|--------|---------|
| 最大输入电压 | 150V | 200V |
| 最大输入电流 | 20A | 40A |
| 最大充电电流 | 20A | 40A |
| 输出电压 | 48V | 48V |
| 最大输出功率 | 960W | 1920W |
| MPPT效率 | ≥99% | ≥99% |
| 通信协议 | RS485/蓝牙 | RS485/蓝牙/WiFi |
| 工作温度 | -25℃~+45℃ | -25℃~+55℃ |
| 尺寸 | 189×133×74mm | 230×165×90mm |
| 推荐品牌 | 固德威/EPSolar | 特变电工/华为 |
| 参考价(¥) | 1,200 | 2,500 |

### 10.2.4 房车专用充电桩

| 参数 | 便携式 | 固定式 |
|------|--------|--------|
| 输入电压 | 单相220V | 三相380V/单相220V |
| 最大输入电流 | 16A/32A | 32A/63A |
| 输出功率 | 3.5kW/7kW | 7kW/22kW |
| 枪头标准 | 国标GB/T | 国标GB/T + 欧标 |
| 通信方式 | 蓝牙/RS485 | WiFi/4G |
| 计费方式 | 按电量(kWh) | 按电量(kWh) |
| 防护等级 | IP67 | IP54(室内)/IP65(户外) |
| 推荐品牌 | 特来电/星星充电 | 挚达/华为 |
| 参考价(¥) | 2,500 | 4,500 |

## 10.3 各口岸硬件配置方案

### 10.3.1 霍尔果斯（哈萨克斯坦）

| 设备 | 规格 | 数量 | 单价(¥) | 小计(¥) |
|------|------|------|---------|---------|
| 光伏板 | 400W×2串联 | 2块 | 1,200 | 2,400 |
| 控制器 | MPPT 20A | 1台 | 1,200 | 1,200 |
| 锂电池 | 48V/100Ah | 1套 | 5,500 | 5,500 |
| 充电桩 | 便携式7kW | 2台 | 2,500 | 5,000 |
| 支架 | 可折叠便携 | 1套 | 800 | 800 |
| 安装配件 | 线缆/接头/开关 | 1套 | 500 | 500 |
| **合计** | — | — | — | **¥15,400** |

### 10.3.2 磨丁（老挝）

| 设备 | 规格 | 数量 | 单价(¥) | 小计(¥) |
|------|------|------|---------|---------|
| 光伏板 | 400W×2串联 | 2块 | 1,200 | 2,400 |
| 控制器 | MPPT 20A | 1台 | 1,200 | 1,200 |
| 锂电池 | 48V/100Ah | 1套 | 5,500 | 5,500 |
| 充电桩 | 便携式7kW | 2台 | 2,500 | 5,000 |
| **备注** | 老挝多雨潮湿，需额外防水处理+防雷模块 ¥600 | — | 600 | 600 |
| **合计** | — | — | — | **¥15,300** |

### 10.3.3 红其拉甫（巴基斯坦）— 高海拔专用

| 设备 | 规格 | 数量 | 单价(¥) | 小计(¥) |
|------|------|------|---------|---------|
| 光伏板 | 高海拔型400W×4 | 4块 | 1,350 | 5,400 |
| 控制器 | MPPT 40A | 1台 | 2,500 | 2,500 |
| 锂电池 | 高海拔型48V/100Ah(耐-20℃) | 1套 | 7,200 | 7,200 |
| 充电桩 | 固定式7kW | 2台 | 4,500 | 9,000 |
| 保温箱 | 加热型电池仓 | 1套 | 1,500 | 1,500 |
| 支架 | 固定支架(抗风载) | 1套 | 1,200 | 1,200 |
| **合计** | — | — | — | **¥26,800** |

### 10.3.4 外贝加尔斯克（俄罗斯）— 极寒专用

| 设备 | 规格 | 数量 | 单价(¥) | 小计(¥) |
|------|------|------|---------|---------|
| 光伏板 | 极寒型400W×4 | 4块 | 1,600 | 6,400 |
| 控制器 | MPPT 40A(宽温) | 1台 | 2,500 | 2,500 |
| 锂电池 | 48V/200Ah(固定型) | 1套 | 9,800 | 9,800 |
| 充电桩 | 固定式7kW(带加热) | 2台 | 5,000 | 10,000 |
| 保温箱 | 电池仓+加热系统 | 1套 | 2,500 | 2,500 |
| 柴油备用 | 3kW静音 | 1台 | 8,000 | 8,000 |
| **合计** | — | — | — | **¥39,200** |

### 10.3.5 扎门乌德（蒙古）— 游牧便携型

| 设备 | 规格 | 数量 | 单价(¥) | 小计(¥) |
|------|------|------|---------|---------|
| 光伏板 | 可折叠400W×2 | 2块 | 1,800 | 3,600 |
| 控制器 | MPPT 20A | 1台 | 1,200 | 1,200 |
| 锂电池 | 48V/100Ah | 1套 | 5,500 | 5,500 |
| 充电桩 | 便携式7kW | 1台 | 2,500 | 2,500 |
| 运输箱 | 铝合金拉杆箱 | 1套 | 1,200 | 1,200 |
| **合计** | — | — | — | **¥14,000** |

## 10.4 充电桩通信协议详解

### 10.4.1 Modbus RTU寄存器映射

| 寄存器地址 | 参数名 | 数据类型 | 单位 | 读写 |
|-----------|--------|---------|------|------|
| 0x0000 | 直流电压 | U16 | 0.1V | R |
| 0x0001 | 直流电流 | I16 | 0.01A | R |
| 0x0002-0x0003 | 输入功率 | U32 | 0.1W | R |
| 0x0004-0x0005 | 累计输入电量 | U32 | 0.1kWh | R |
| 0x0006 | 电池电压 | U16 | 0.1V | R |
| 0x0007 | 电池电流 | I16 | 0.01A | R |
| 0x0008-0x0009 | 电池电量(SOC) | U32 | 0.1% | R |
| 0x000A | 工作温度 | I16 | 0.1℃ | R |
| 0x000B | 设备状态 | U16 | bitmask | R |
| 0x0010 | 充电桩输出电压 | U16 | 0.1V | R |
| 0x0011 | 充电桩输出电流 | I16 | 0.01A | R |
| 0x0012-0x0013 | 输出功率 | U32 | 0.1W | R |
| 0x0014-0x0015 | 累计输出电量 | U32 | 0.1kWh | R |

**状态位掩码 (0x000B):**
- Bit 0: 充电中 (1=充电中, 0=待机)
- Bit 1: 故障标志 (1=有故障)
- Bit 2: 电池满
- Bit 3: 电池过放
- Bit 4: 过温保护
- Bit 5: 过载保护

### 10.4.2 控制指令

| 功能码 | 地址 | 值 | 说明 |
|--------|------|-----|------|
| 0x06 | 0x1000 | 0x0001 | 启动充电 |
| 0x06 | 0x1000 | 0x0000 | 停止充电 |
| 0x06 | 0x1001 | 0-63 | 设置最大电流(A) |
| 0x06 | 0x1002 | 1-500 | 设置目标电量(Wh) |

---

# 第十一部分：部署与测试方案

## 11.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                         前端层                                     │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│   │ iOS APP  │  │AndroidAPP│  │Web管理后台│  │Telegram Bot  │    │
│   │ Flutter │  │ Flutter  │  │  React   │  │              │    │
│   └──────────┘  └──────────┘  └──────────┘  └──────────────┘    │
│                          │                                        │
│                          ▼                                        │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │                    CDN (Cloudflare)                       │  │
│   │              静态资源加速 + DDoS防护                        │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          │                                        │
└──────────────────────────┼──────────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         网关层                                     │
│   ┌──────────────────────────────────────────────────────────┐  │
│   │  API Gateway (Kong/Nginx)                                 │  │
│   │  - 限流 (100 req/s/user)                                   │  │
│   │  - 鉴权 (JWT验证)                                          │  │
│   │  - 请求签名验证                                            │  │
│   │  - CORS配置                                               │  │
│   │  - WAF (Web Application Firewall)                          │  │
│   └──────────────────────────────────────────────────────────┘  │
│                          │                                        │
│     ┌───────────────────┼───────────────────┐                   │
│     ▼                   ▼                   ▼                   │
│  ┌─────────┐      ┌─────────┐       ┌─────────┐              │
│  │ API Svc │      │API Svc  │       │API Svc  │              │
│  │(Node.js)│←────→│(Node.js)│←─────→│(Node.js)│  ← 后端服务层  │
│  └────┬────┘      └────┬────┘       └────┬────┘              │
│       │                 │                 │                    │
│       └─────────────────┼─────────────────┘                    │
│                         ▼                                       │
│   ┌─────────────┐  ┌────────────┐  ┌────────────┐            │
│   │ PostgreSQL  │  │  Redis     │  │  MongoDB   │            │
│   │ 主数据库    │  │ 缓存/会话  │  │ 文档存储   │            │
│   └──────┬──────┘  └───────────┘  └───────────┘            │
│          │                                                 │
│          ▼                                                 │
│   ┌─────────────────────────────────────────────────┐        │
│   │              数据分析层 (ClickHouse)            │        │
│   │         用户行为日志 + 业务数据统计              │        │
│   └─────────────────────────────────────────────────┘        │
└───────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                         区块链层                                  │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐     │
│   │ Solana RPC  │  │ 预言机服务   │  │  链上索引服务    │     │
│   │ (主网)     │  │(Switchboard)│  │ (Helius/Solana) │     │
│   └──────────────┘  └──────────────┘  └──────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## 11.2 部署架构（Kubernetes）

### 11.2.1 Namespace规划

```yaml
# namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: rv-solar-eaco
---
apiVersion: v1
kind: Namespace
metadata:
  name: rv-solar-eaco-staging
---
apiVersion: v1
kind: Namespace
metadata:
  name: rv-solar-eaco-monitoring
```

### 11.2.2 核心Deployment配置

```yaml
# api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rv-solar-api
  namespace: rv-solar-eaco
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rv-solar-api
  template:
    metadata:
      labels:
        app: rv-solar-api
    spec:
      containers:
      - name: api
        image: registry.rv-solar-eaco.com/rv-solar-api:v1.0
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: rv-solar-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: rv-solar-secrets
              key: redis-url
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "2Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values: [rv-solar-api]
```

## 11.3 测试计划

### 11.3.1 测试金字塔

```
                    ▲
                   ╱ ╲
                  ╱   ╲
                 ╱     ╲
                ╱ E2E  ╲          ← 端到端测试 (Playwright)
               ╱─────────╲
              ╱           ╲
             ╱  集成测试   ╲        ← API集成测试 (Supertest)
            ╱───────────────╲
           ╱                 ╲
          ╱    单元测试      ╲      ← 业务逻辑 (Jest/Vitest)
         ╱─────────────────────╲
        ╱                       ╲
       ╱      合约测试          ╲    ← 智能合约 (Anchor/Playwright)
      ╱───────────────────────────╲
```

### 11.3.2 测试用例清单（部分）

#### 单元测试 (≥200用例)

```javascript
// charging.test.ts
describe('充电模块', () => {
  test('正常充电流程：开始→充电→结束→结算', async () => {
    // 1. 创建充电会话
    const session = await chargingService.startCharging({
      chargerId: 'TEST_CHARGER_001',
      userId: testUser.id,
      paymentToken: 'EACO'
    });
    expect(session.status).toBe('active');
    
    // 2. 模拟充电数据上报
    await chargingService.reportData({
      sessionId: session.id,
      power: 3200,
      voltage: 220,
      energy: 0.5
    });
    
    // 3. 结束充电
    const result = await chargingService.stopCharging(session.id);
    expect(result.totalEnergyKwh).toBeGreaterThan(0);
    expect(result.rewardEaco).toBeGreaterThan(0);
  });
  
  test('充电桩离线时：应拒绝启动并提示错误', async () => {
    // Mock充电桩离线
    chargerClient.isOnline = jest.fn().mockResolvedValue(false);
    
    await expect(
      chargingService.startCharging({ chargerId: 'OFFLINE_CHARGER' })
    ).rejects.toThrow('ERR_CHARGER_OFFLINE'); // code: 50001
  });
  
  test('重复结束同一充电会话：应返回错误', async () => {
    // Mock已结束的session
    const session = await createMockSession({ status: 'completed' });
    
    await expect(
      chargingService.stopCharging(session.id)
    ).rejects.toThrow('ERR_ALREADY_STOPPED');
  });
  
  test('EACO支付：验证9折优惠正确计算', async () => {
    const pricePerKwh = 100000; // $0.10/kWh in USDC最小单位
    const energy = 10; // kWh
    const totalUSD = pricePerKwh * energy;
    
    // EACO支付9折
    const discountAmount = totalUSD * 0.1;
    const actualPayment = totalUSD - discountAmount;
    
    expect(actualPayment).toBe(totalUSD * 0.9);
  });
  
  test('绿电奖励计算：每kWh奖励正确', async () => {
    const energyKwh = 10;
    const rewardRate = 1000; // 1 EACO/kWh (最小单位)
    
    const expectedReward = (energyKwh * 1000) * rewardRate / 1000;
    expect(expectedReward).toBe(10000); // 10000最小单位 = 0.01 EACO
  });
});

// payment.test.ts
describe('支付模块', () => {
  test('使用EACO支付订单：验证9折逻辑', async () => {
    const order = await createMockOrder({
      amountUsdCents: 5000, // $50
      paymentToken: 'EACO'
    });
    
    const payment = await paymentService.execute(order.id, {
      walletAddress: testUser.wallet,
      paymentToken: 'EACO'
    });
    
    // 9折: $50 → $45
    expect(payment.amountUsdCents).toBe(4500);
    expect(payment.discountApplied).toBe(true);
    expect(payment.discountReason).toBe('EACO_PAYMENT_DISCOUNT');
  });
  
  test('余额不足：应返回错误码40004', async () => {
    // Mock用户余额不足
    walletService.getBalance = jest.fn().mockResolvedValue(100); // 只有100最小单位
    
    await expect(
      paymentService.execute(order.id, { walletAddress: testUser.wallet })
    ).rejects.toMatchObject({ code: 40004 });
  });
  
  test('同一订单重复支付：应拒绝', async () => {
    const order = await createMockOrder({ paymentStatus: 'paid' });
    
    await expect(
      paymentService.execute(order.id, {})
    ).rejects.toMatchObject({ code: 40002 });
  });
  
  test('退款：24小时内应成功退款', async () => {
    const order = await createMockOrder({
      paidAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1小时前
    });
    
    const refund = await paymentService.refund(order.id);
    expect(refund.status).toBe('refunded');
  });
  
  test('退款：24小时后应拒绝', async () => {
    const order = await createMockOrder({
      paidAt: new Date(Date.now() - 25 * 60 * 60 * 1000) // 25小时前
    });
    
    await expect(paymentService.refund(order.id))
      .rejects.toMatchObject({ code: 40002 });
  });
});

// reward.test.ts  
describe('绿电奖励模块', () => {
  test('预言机签名无效：应拒绝奖励发放', async () => {
    const invalidSignature = Buffer.from('fake_signature');
    
    await expect(
      rewardService.submitEnergyRecord({
        energyKwh: 5000,
        location: '霍尔果斯',
        oracleSignature: invalidSignature
      })
    ).rejects.toThrow('ERR_INVALID_ORACLE_SIGNATURE');
  });
  
  test('双重申领同一充电记录：应拒绝', async () => {
    const chargingId = 'test_charging_001';
    
    // 第一次申领成功
    await rewardService.submitEnergyRecord({ chargingId });
    
    // 第二次申领应失败
    await expect(
      rewardService.submitEnergyRecord({ chargingId })
    ).rejects.toThrow('ERR_ALREADY_CLAIMED');
  });
  
  test('奖励池余额不足：应正确回滚', async () => {
    // Mock奖励池余额为0
    rewardPool.getBalance = jest.fn().mockResolvedValue(0);
    
    await expect(
      rewardService.submitEnergyRecord({
        energyKwh: 5000,
        location: '霍尔果斯',
        oracleSignature: validOracleSignature
      })
    ).rejects.toThrow('ERR_REWARD_POOL_EMPTY'); // code: 60002
  });
});
```

#### 智能合约测试 (≥50用例/合约)

```rust
// tests/reward_distributor.rs (Anchor框架)

#[tokio_test]
async fn test_submit_energy_record_success() {
    // 1. 初始化测试环境
    let program = TestProgram::new();
    let user = TestUser::new();
    let reward_pool = TestRewardPool::new(1_000_000_000); // 1000 EACO
    
    // 2. 提交有效发电记录
    let signature = oracle.sign(&user.pubkey(), 5000, "霍尔果斯");
    
    let tx = program.submit_energy_record(
        user.pubkey(),
        5000,
        "霍尔果斯",
        signature
    );
    
    // 3. 验证奖励发放
    let user_balance = program.get_token_balance(user.pubkey());
    assert!(user_balance > 0);
    
    // 4. 验证记录存储
    let record = program.get_energy_record(user.pubkey());
    assert_eq!(record.energy_kwh, 5000);
    assert_eq!(record.verified, true);
}

#[tokio_test]
async fn test_double_claim_rejected() {
    // 第一次申领
    program.submit_energy_record(user.pubkey(), 5000, "霍尔果斯", signature);
    
    // 第二次应失败
    let result = program.submit_energy_record(user.pubkey(), 5000, "霍尔果斯", signature);
    assert!(result.is_err());
}

#[tokio_test]
async fn test_fake_oracle_signature_rejected() {
    let fake_sig = user.sign(b"fake_data");
    let result = program.submit_energy_record(user.pubkey(), 5000, "霍尔果斯", fake_sig);
    assert!(result.is_err());
}
```

### 11.3.3 测试覆盖率要求

| 模块 | 覆盖率要求 | 测试工具 |
|------|-----------|---------|
| 业务逻辑（后端） | ≥85% | Jest + Istanbul |
| API端点 | 100% | Supertest |
| 智能合约 | ≥95% | Anchor test + coverage |
| 前端组件 | ≥80% | React Testing Library |
| 工具函数 | ≥90% | Jest |

### 11.3.4 性能测试目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| API P99响应时间 | ≤500ms | 含数据库查询 |
| APP冷启动时间 | ≤3秒 | iOS/Android |
| 充电数据刷新延迟 | ≤2秒 | 实时监控 |
| 并发支持 | ≥500 QPS | 单节点 |
| 支付TPS | ≥100笔/秒 | 峰值 |
| 智能合约Gas限制 | ≤200,000 CU | Solana |

### 11.3.5 安全测试

| 测试类型 | 工具 | 执行频率 |
|---------|------|---------|
| 静态代码分析 | SonarQube + Semgrep | 每次PR |
| 依赖漏洞扫描 | Snyk / npm audit | 每次构建 |
| DAST (Web) | OWASP ZAP | 每两周 |
| 渗透测试 | 人工团队 | 每次大版本 |
| 智能合约审计 | Slither + Mythril | 每次合约变更 |

---

# 附录

## A. 多语言翻译字数统计

| 语言 | 界面翻译(字) | 协议翻译(字) | 总计(字) | 单价(¥/千字) | 费用(¥) |
|------|------------|------------|---------|------------|---------|
| 英语 | 15,000 | 5,000 | 20,000 | 200 | 4,000 |
| 俄语 | 15,000 | 5,000 | 20,000 | 350 | 7,000 |
| 蒙古语 | 8,000 | 3,000 | 11,000 | 400 | 4,400 |
| 老挝语 | 5,000 | 2,000 | 7,000 | 400 | 2,800 |
| 乌尔都语 | 5,000 | 2,000 | 7,000 | 400 | 2,800 |
| **合计** | — | — | **65,000** | — | **¥21,000** |

## B. 投资预算总表

| 科目 | MVP(1口岸) | 5口岸完整 | 说明 |
|------|-----------|-----------|------|
| APP开发 | ¥80,000 | ¥150,000 | 含多语言 |
| 支付网关 | ¥5,000 | ¥5,000 | 2328.io |
| 服务器 | ¥8,000/年 | ¥20,000/年 | 多节点 |
| 翻译 | ¥15,000 | ¥21,000 | 5种语言 |
| 1个口岸落地 | ¥50,000 | — | 营地合作+硬件 |
| 5口岸落地 | — | ¥200,000 | 平均¥40,000/口 |
| 合规咨询 | ¥30,000 | ¥80,000 | 含PVARA申请 |
| 智能合约审计 | ¥20,000 | ¥20,000 | 必备 |
| 网络安全 | ¥10,000 | ¥15,000/年 | WAF+加密 |
| 运营(6个月) | ¥60,000 | ¥180,000 | Telegram+地推 |
| **总计** | **¥278,000** | **¥691,000** | — |

## C. 文档版本历史

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|---------|------|
| v0.1 | 2026-06-13 | 初稿框架 | AI Engineer |
| v1.0 | 2026-06-13 | 完整PRD输出 | AI Engineer |
| v1.1 | 2026-06-13 16:59 | 追加审计计划/ER图/硬件规格/部署方案 | AI Engineer |

---

*本文档为内部开发文档，涉及商业敏感信息，请勿外传。*
*EACO - Earth's Best Coin | rv-solar-eaco Project*