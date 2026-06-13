# RV Solar EACO - 项目规格说明书

## 1. 项目概述

| 项目 | 内容 |
|------|------|
| 项目名称 | RV Solar EACO |
| 版本 | v1.0.0 |
| 项目代号 | rv-solar-eaco2026 |
| 核心功能 | 房车旅行 + 光伏充电 + Web3支付（EACO代币）一站式移动生活平台 |
| 目标市场 | 中国出境房车车主 + 国际Web3用户 + 绿色能源倡导者 |
| 目标口岸 | 霍尔果斯→磨丁→红其拉甫→外贝加尔斯克→扎门乌德 |

---

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术选型 |
|------|---------|
| 移动端 | Flutter 3.x (iOS + Android) |
| 后端 | Node.js 20 LTS + Express 4.x |
| 数据库 | PostgreSQL 15 + Redis 7 |
| 区块链 | Solana 主网 |
| 智能合约 | Rust + Anchor Framework |
| 支付网关 | 2328.io (USDT/USDC/SOL/wBNB/EACO) |
| 地图 | Mapbox GL |
| 实时通信 | WebSocket |
| 预言机 | Switchboard (Solana) |
| 部署 | Docker + Kubernetes |
| 监控 | Prometheus + Grafana |

### 2.2 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Flutter APP (iOS/Android)                 │
│  [钱包模块] [地图模块] [充电模块] [社区模块] [订单模块]        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Kong API Gateway (限流/鉴权/WAF)               │
└────┬────────────────┬────────────────────┬────────────────┘
     │                │                    │
     ▼                ▼                    ▼
┌─────────┐    ┌──────────────┐    ┌──────────────────┐
│  API Svc │    │  API Svc     │    │  WebSocket Svc   │
│ (Node.js)│    │ (Node.js)   │    │ (实时充电数据)    │
└────┬────┘    └──────┬───────┘    └──────────────────┘
     │                │
     │         ┌──────┴──────┐
     ▼         ▼             ▼
  ┌────────┐ ┌────────┐ ┌─────────┐
  │  Redis │ │PostgreSQL│ │Solana  │
  │ (缓存) │ │ (主数据) │ │(链上)  │
  └────────┘ └────────┘ └────┬────┘
                             │
                        ┌────┴──────┐
                        ▼           ▼
                   ┌────────┐ ┌────────┐
                   │预言机服务│ │ 2328.io│
                   └────────┘ │支付网关│
                             └────────┘
```

---

## 3. 功能模块

### 3.1 模块列表

| 模块 | 功能 | 优先级 | 说明 |
|------|------|--------|------|
| 用户模块 | 注册/登录/钱包/KYC | P0 | 中英双语 |
| 地图营地 | 地图展示/营地详情/筛选/路线 | P0 | Mapbox |
| 营地预订 | 日历预订/订单管理/取消 | P0 | 支持EACO/USDT/USDC |
| 光伏充电 | 扫码充电/实时监控/自动结算 | P0 | 蓝牙+链上 |
| 绿电奖励 | 发电上链/EACO空投/碳积分 | P1 | 预言机验证 |
| 社区贡献 | 路况上报/营地评价/点赞 | P1 | EACO奖励 |
| P2P能源 | 余电挂牌/智能撮合 | P2 | V2 |
| 大使系统 | 申请/管理/激励 | P2 | V2 |

### 3.2 核心用户旅程

```
用户注册 → 创建钱包 → 浏览营地 → 预订支付 → 扫码充电
    ↓                                      ↓
  社区贡献 ← 绿电上链 ← 充电完成 → 自动结算 → EACO空投
    ↓
  碳积分累积 → 兑换折扣 → 继续旅程
```

---

## 4. 数据库设计

### 4.1 核心表（10张）

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| users | 用户表 | id, phone, wallet_address, kyc_status, level |
| campsites | 营地表 | id, name, lat/lng, price, solar_capacity |
| port_crossings | 口岸表 | id, name, country, crypto_friendly |
| orders | 订单表 | id, order_no, user_id, campsite_id, amount |
| charging_records | 充电记录表 | id, user_id, charger_id, energy_kwh, on_chain |
| green_energy_records | 绿电记录表 | id, user_id, energy_kwh, oracle_signature, reward_eaco |
| carbon_accounts | 碳积分表 | id, user_id, total_co2_kg, available_co2_kg |
| contributions | 社区贡献表 | id, user_id, type, content, reward_eaco |
| energy_listings | P2P挂牌表 | id, user_id, energy_kwh, price_eaco |
| ambassadors | 大使表 | id, user_id, port_id, level |

### 4.2 索引策略

- `users`: wallet_address (唯一), phone
- `orders`: user_id, campsite_id, payment_status, created_at
- `charging_records`: user_id, campsite_id, on_chain
- `green_energy_records`: user_id, verified, location

---

## 5. API设计

### 5.1 基础规范

- Base URL: `https://api.rv-solar-eaco.com/v1`
- 认证: Bearer JWT
- 编码: UTF-8
- 签名: HMAC-SHA256

### 5.2 端点列表（40+）

```
POST /auth/send-code          发送验证码
POST /auth/verify-code        验证登录
GET  /users/me               获取用户信息
GET  /campsites              营地列表
GET  /campsites/:id         营地详情
POST /orders                 创建订单
POST /payments/execute       执行支付
POST /charging/start         开始充电
POST /charging/stop          停止充电
GET  /users/me/energy-records 查询绿电记录
POST /contributions          提交贡献
POST /listings               P2P挂牌
```

---

## 6. 智能合约（4个）

| 合约 | Instruction | 说明 |
|------|-------------|------|
| RewardDistributor | submit_energy_record / set_reward_rate | 绿电奖励分发 |
| PaymentGateway | create_order / pay_order / refund_order | 支付网关 |
| EnergyNFT | mint_energy_nft / transfer_nft / buy_nft | 发电量NFT |
| P2PEnergyMarket | create_listing / buy_energy / cancel_listing | P2P能源市场 |

---

## 7. 硬件协议

| 协议 | 参数 |
|------|------|
| 通信 | RS485 Modbus RTU / 蓝牙BLE |
| 电气标准 | 单相220V/16A (交流桩) |
| 计费 | 按电量(kWh)，精度0.01kWh |
| 数据上报 | 每30秒一次 |

---

## 8. 支付体系

| 代币 | 状态 | 费率 |
|------|------|------|
| EACO | ✅ 支持 | 享9折 |
| USDT | ✅ 支持 | 标准费率 |
| USDC | ✅ 支持 | 标准费率 |
| SOL | ✅ 支持 | 标准费率 |
| wBNB | ✅ 支持 | 标准费率 |
| USD | ⚙️ 计划中 | — |

---

## 9. 界面设计规范

### 9.1 设计语言

| 项目 | 内容 |
|------|------|
| 设计风格 | Material Design 3 + 绿色科技感 |
| 主色 | #00C853 (绿色，代表清洁能源) |
| 辅色 | #1E88E5 (蓝色，代表科技) |
| 强调色 | #FFD700 (金色，代表EACO价值) |
| 背景色 | #F5F5F5 (浅灰) |
| 深色模式 | 支持 |
| 字体 | 系统字体 (iOS: SF Pro, Android: Roboto) |

### 9.2 核心页面（15个）

| 页面 | 路由 | 说明 |
|------|------|------|
| 启动页 | /splash | APP启动动画 |
| 登录页 | /login | 手机号+验证码 |
| 首页 | /home | 地图+营地入口 |
| 营地列表 | /campsites | 筛选+排序 |
| 营地详情 | /campsites/:id | 图片+设施+价格 |
| 预订页 | /booking | 日历+支付 |
| 支付页 | /payment | 选择代币+确认 |
| 充电页 | /charging | 扫码+实时数据 |
| 钱包页 | /wallet | 余额+交易记录 |
| 我的页 | /profile | 用户中心 |
| 绿电记录 | /energy-records | 上链记录 |
| 社区页 | /community | 贡献+排行榜 |
| 设置页 | /settings | 语言+安全 |
| 帮助页 | /help | 常见问题 |
| 关于页 | /about | 项目介绍 |

---

## 10. 验收标准

| 指标 | 要求 |
|------|------|
| API P99响应时间 | ≤500ms |
| 充电数据刷新延迟 | ≤2秒 |
| APP冷启动 | ≤3秒 |
| 代码覆盖率 | ≥80% |
| 智能合约测试 | ≥95% |
| API可用性 | ≥99% |
| 支持语言 | 中文+英文 |

---

*版本: v1.0.0 | 更新: 2026-06-13 | AI Engineer*