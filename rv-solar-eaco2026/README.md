# 🌍 RV Solar EACO

> 房车光伏充电 + Web3 支付一站式平台  
> 5大边境口岸落地（霍尔果斯/磨丁/红其拉甫/外贝加尔斯克/扎门乌德）

[![GitHub Stars](https://img.shields.io/github/stars/ucoingroup/rv-solar-eaco)](https://github.com/ucoingroup/rv-solar-eaco/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🏗️ 技术架构

```
┌─────────────────────────────────────────────────────┐
│                   Flutter APP                        │
│  (BLoC + auto_route + solana_mobile_wallet_adapter) │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS / WebSocket
┌──────────────────────▼──────────────────────────────┐
│              Node.js + Express API                   │
│        (Prisma ORM + Redis + Socket.IO)              │
└───────┬──────────────┬──────────────┬───────────────┘
        │              │              │
   PostgreSQL      Solana RPC      充电桩 Relay
   (PostGIS)    (Web3.js/Anchor)  (OCPP 1.6-J)
```

---

## 📁 项目结构

```
rv-solar-eaco2026/
├── backend/                    # Node.js + Express 后端
│   └── src/
│       ├── config/            # 数据库/密钥/常量
│       ├── controllers/       # 9个控制器（已完整实现）
│       ├── db/                # 迁移脚本 + 种子数据
│       ├── middleware/        # 认证中间件
│       ├── routes/            # 10个路由模块
│       └── services/          # Solana/WebSocket/Relay/支付/奖励服务
│
├── flutter/                   # Flutter 移动应用
│   └── lib/
│       ├── core/             # 配置/网络/路由/主题/DI
│       └── features/         # 7大功能模块（已完整实现）
│
├── solana/                    # Solana 智能合约（Anchor/Rust）
│   ├── programs/
│   │   ├── reward_distributor/ # 绿电奖励分发
│   │   ├── energy_nft/        # 绿电 NFT
│   │   ├── p2p_market/        # P2P 交易市场
│   │   └── payment_gateway/    # 多币种支付网关
│   ├── migrations/           # 部署脚本
│   └── tests/                # 集成测试
│
├── docker/                    # Docker 配置
└── docker-compose.yml        # 一键部署
```

---

## 🚀 快速启动

### 前置环境
- Node.js 18+
- Flutter 3.16+
- Rust 1.70+ (for Solana)
- Docker & Docker Compose
- PostgreSQL 15+

### 后端启动

```bash
cd backend
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际配置

# 数据库迁移
npm run migrate

# 填充种子数据
npm run seed

# 开发模式启动
npm run dev

# 生产模式
npm start
```

**.env 示例：**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rv_solar
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
SOLANA_RPC_URL=https://api.devnet.solana.com
EACO_CONTRACT_ADDRESS=DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH
CORS_ORIGIN=*
```

### Flutter 启动

```bash
cd flutter

# 安装依赖
flutter pub get

# 代码生成（auto_route）
flutter pub run build_runner build --delete-conflicting-outputs

# 开发模式
flutter run

# 构建 APK
flutter build apk --release

# 构建 iOS
flutter build ios --release
```

### Solana 合约部署

```bash
cd solana

# 构建合约
anchor build

# 部署到 devnet
anchor deploy --provider.cluster devnet

# 运行集成测试
anchor test
```

### Docker 一键部署

```bash
docker-compose up -d

# 查看日志
docker-compose logs -f api

# 停止
docker-compose down
```

---

## 🌐 API 文档

### 认证模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/auth/send-code` | 发送验证码 |
| POST | `/v1/auth/verify-code` | 验证码登录 |
| POST | `/v1/auth/refresh-token` | 刷新Token |
| POST | `/v1/auth/logout` | 退出登录 |

### 营地模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v1/campsites` | 营地列表 |
| GET | `/v1/campsites/:id` | 营地详情 |
| POST | `/v1/campsites/book` | 预约营地 |
| POST | `/v1/campsites/:id/review` | 评价营地 |

### 充电模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/charging/start` | 开始充电 |
| POST | `/v1/charging/stop` | 停止充电 |
| GET | `/v1/charging/history` | 充电记录 |
| GET | `/v1/charging/status` | 实时状态 |

### 支付模块
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/v1/payments/create` | 创建支付 |
| POST | `/v1/payments/complete` | 完成支付 |
| GET | `/v1/payments/:id/status` | 支付状态 |
| POST | `/v1/payments/refund` | 申请退款 |
| GET | `/v1/payments/tokens` | 支持的代币 |

### 社区模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v1/community/contributions` | 贡献列表 |
| POST | `/v1/community/contributions` | 发布贡献 |
| POST | `/v1/community/contributions/:id/upvote` | 点赞 |
| GET | `/v1/community/leaderboard` | 排行榜 |

### P2P 市场
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v1/p2p/orders` | 挂单列表 |
| POST | `/v1/p2p/orders` | 创建挂单 |
| POST | `/v1/p2p/fill` | 成交 |
| DELETE | `/v1/p2p/orders/:id` | 取消挂单 |

### 口岸模块
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/v1/ports` | 口岸列表 |
| GET | `/v1/ports/:id` | 口岸详情 |
| GET | `/v1/ports/map` | 地图数据 |

---

## 🔗 区块链

### EACO 代币
- **合约地址**: `DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH`
- **网络**: Solana
- **奖励率**: 1000 EACO / kWh

### Solana 合约
| 合约 | 地址 | 功能 |
|------|------|------|
| RewardDistributor | 待部署 | 绿电奖励分发 |
| EnergyNFT | 待部署 | 绿电 NFT 铸造 |
| P2PMarket | 待部署 | P2P 交易市场 |
| PaymentGateway | 待部署 | 多币种支付 |

---

## 📱 功能模块

- [x] 手机号登录（验证码）
- [x] 营地浏览与地图
- [x] 营地预约
- [x] 光伏充电（扫码开始/结束）
- [x] 实时充电数据
- [x] 多币种支付（EACO/USDT/USDC/SOL/wBNB）
- [x] Web3 钱包集成
- [x] 绿电奖励上链
- [x] 绿电 NFT 铸造
- [x] 碳积分账户
- [x] P2P EACO 交易市场
- [x] 社区贡献与点赞
- [x] 贡献排行榜
- [x] 口岸地图
- [x] WebSocket 实时通知

---

## 🌍 5大优先发展口岸

| 优先级 | 口岸 | 国家 | 状态 |
|--------|------|------|------|
| ⭐ 1 | 霍尔果斯 (Khorgos) | 哈萨克斯坦 | 🚀 试点中 |
| 2 | 磨丁 (Mohan) | 老挝 | 📋 规划中 |
| 3 | 红其拉甫 (Khunjrab) | 巴基斯坦 | 📋 规划中 |
| 4 | 外贝加尔斯克 (Zabaykalsk) | 俄罗斯 | 📋 规划中 |
| 5 | 扎门乌德 (ZaminUd) | 蒙古 | 📋 规划中 |

---

## ⚠️ 注意事项

1. **Solana 合约地址** 需替换为实际部署后的地址
2. **预言机签名** 需部署真实的签名验证服务
3. **支付网关** 需申请 2328.io API Key
4. **充电桩协议** 需与当地硬件供应商对接 OCPP 1.6-J

---

## 📄 许可证

MIT License - 欢迎贡献代码！

---

## 🔗 链接

- 🌐 官网: https://eaco.earth
- 💬 Discord: https://discord.gg/Jv4eXPPn7w
- 🐦 Twitter: https://x.com/eacocc
- 📚 GitHub: https://github.com/ucoingroup/rv-solar-eaco
