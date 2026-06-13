# RV Solar EACO 项目结构

## 目录结构

```
rv-solar-eaco2026/
├── backend/                    # Node.js + Express 后端
│   ├── src/
│   │   ├── index.js           # 入口文件
│   │   ├── config/            # 配置文件
│   │   ├── db/                # 数据库迁移和种子数据
│   │   ├── routes/            # 路由定义
│   │   ├── controllers/      # 控制器
│   │   ├── middleware/        # 中间件
│   │   └── services/          # 业务服务
│   └── package.json
│
├── flutter/                   # Flutter 移动应用
│   ├── lib/
│   │   ├── main.dart         # 应用入口
│   │   ├── app.dart          # 应用配置
│   │   ├── core/             # 核心模块
│   │   │   ├── config/       # 应用配置
│   │   │   ├── network/      # 网络层
│   │   │   ├── router/       # 路由
│   │   │   └── theme/        # 主题
│   │   └── features/          # 功能模块
│   │       ├── auth/         # 认证
│   │       ├── home/         # 首页
│   │       ├── campsite/     # 营地
│   │       ├── charging/     # 充电
│   │       ├── wallet/       # 钱包
│   │       ├── community/    # 社区
│   │       └── profile/      # 我的
│   └── pubspec.yaml
│
├── solana/                    # Solana 智能合约
│   ├── programs/             # Anchor 程序
│   │   ├── reward_distributor/
│   │   ├── energy_nft/
│   │   ├── p2p_market/
│   │   └── payment_gateway/
│   ├── migrations/          # 部署脚本
│   └── tests/               # 集成测试
│
├── docker/                   # Docker 配置
├── k8s/                     # Kubernetes 配置
├── .github/workflows/       # CI/CD
├── docker-compose.yml
└── README.md
```

## 快速开始

### 环境要求
- Node.js 18+
- Flutter 3.16+
- Rust 1.70+
- Docker & Docker Compose
- Solana CLI

### 后端启动
```bash
cd backend
npm install
npm run dev
```

### Flutter 启动
```bash
cd flutter
flutter pub get
flutter run
```

### Solana 合约部署
```bash
cd solana
anchor build
anchor deploy
```

## API 文档

### 认证
- `POST /api/auth/send-code` - 发送验证码
- `POST /api/auth/verify-code` - 验证登录

### 营地
- `GET /api/campsites` - 获取营地列表
- `GET /api/campsites/:id` - 获取营地详情

### 充电
- `POST /api/charging/start` - 开始充电
- `POST /api/charging/stop` - 停止充电
- `GET /api/charging/history` - 充电记录

### 支付
- `POST /api/payments/create` - 创建支付
- `POST /api/payments/complete` - 完成支付

### 社区
- `GET /api/community/contributions` - 获取贡献列表
- `POST /api/community/contributions` - 发布贡献

## 技术栈

### 后端
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **ORM**: Prisma
- **Blockchain**: @solana/web3.js

### 移动端
- **Framework**: Flutter 3.16+
- **State Management**: flutter_bloc
- **Routing**: auto_route
- **DI**: get_it
- **HTTP**: dio
- **Blockchain**: solana_mobile_wallet_adapter

### 智能合约
- **Language**: Rust
- **Framework**: Anchor 0.28
- **Network**: Solana Mainnet/Devnet
- **Token**: SPL Token

## 环境变量

### 后端
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/rv_solar
REDIS_URL=redis://localhost:6379
SOLANA_RPC_URL=https://api.devnet.solana.com
EACO_TOKEN=DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH
```

### Flutter
```env
API_BASE_URL=http://localhost:3000/api
SOLANA_NETWORK=devnet
```

## 部署

### Docker Compose
```bash
docker-compose up -d
```

### Kubernetes
```bash
kubectl apply -f k8s/
```

## 许可证

MIT License