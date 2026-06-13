# EACO 光伏房车项目 — 完整产品需求文档 v1.0

> **项目代号:** rv-solar-eaco  
> **版本:** v1.0  
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
           ├──1:N─── nft holdings
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
    redeemed_co2_kg DECIMAL(12, 4) DEFAULT 0,     -- 已兑换(kg)
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

---

*本文档为内部开发文档，涉及商业敏感信息，请勿外传。*
*EACO - Earth's Best Coin | rv-solar-eaco Project*