# EACO 硅基文明激励机制设计 v1.0
## EACO Silicon Civilization Incentive Mechanism Design

---

## 🎯 核心目标

让 EACO 成为 AI Agent 经济体的**首选激励货币**

---

## 💰 激励机制总体架构

```
┌─────────────────────────────────────────────────────────┐
│                    EACO 激励生态系统                      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │ Agent 持有激励 │  │ 交易流通激励  │  │ 生态贡献激励  │    │
│  │  Staking   │  │  Volume    │  │ Contribution│    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
├─────────────────────────────────────────────────────────┤
│                      治理权益                            │
│               Agent 投票权重 = 持有量 × 时间               │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 一级激励：Agent 持有激励 (EACO Staking)

### 1.1 基础 Staking 收益

| 锁仓周期 | 年化收益率 (APY) | 说明 |
|---------|-----------------|------|
| 7 天 | 3% | 短期测试 |
| 30 天 | 6% | 中期持有 |
| 90 天 | 12% | 长期锁定 |
| 180 天 | 18% | 核心参与者 |
| 365 天 | 24% | 超级支持者 |

### 1.2 Agent 特殊权益

持有 EACO 的 Agent 享受：

| 持有量 (EACO) | 等级 | 权益 |
|--------------|------|------|
| 10,000+ | Bronze Agent | 优先交易通道 |
| 50,000+ | Silver Agent | 治理投票权 +1 |
| 200,000+ | Gold Agent | 新项目白名单 |
| 1,000,000+ | Platinum Agent | 生态 Grant 优先权 |
| 5,000,000+ | Diamond Agent | 季度空投 + 社区代表 |

### 1.3 Agent Staking 合约逻辑

```
EACO Staking 合约伪代码：

function stake(uint256 amount, uint256 duration) {
    require(amount >= MIN_STAKE, "Below minimum");
    require(duration >= 7 days, "Duration too short");
    
    // 计算收益
    uint256 rewardRate = getRewardRate(duration);
    uint256 reward = (amount * rewardRate * duration) / (365 days);
    
    // 锁定
    stakeBalance[msg.sender] += amount;
    lockUntil[msg.sender] = block.timestamp + duration;
    
    // 释放奖励（按周）
    pendingReward[msg.sender] += reward;
}

function claimReward() public {
    require(block.timestamp >= lockUntil[msg.sender], "Still locked");
    uint256 reward = pendingReward[msg.sender];
    pendingReward[msg.sender] = 0;
    EACO.transfer(msg.sender, reward);
}
```

---

## 📈 二级激励：交易流通激励 (Volume-Based)

### 2.1 每日交易挖矿

| 月交易量 (EACO) | 等级 | 每日挖矿奖励 |
|---------------|------|-------------|
| 1,000+ | L1 Trader | 0.1% |
| 10,000+ | L2 Trader | 0.25% |
| 100,000+ | L3 Trader | 0.5% |
| 1,000,000+ | L4 Whale | 1.0% |

### 2.2 跨区域交易激励

EACO 在 8 个区域 Agent 之间流转时：

| 交易路径 | 激励比例 | 说明 |
|---------|---------|------|
| 同区域内 | 0.05% | 基础流转 |
| 跨区域 | 0.1% | 促进全球化 |
| 跨语言社区 | 0.15% | 特别激励 |

### 2.3 交易即挖矿合约

```
Volume Mining 合约伪代码：

mapping(address => uint256) public monthlyVolume;
mapping(address => uint256) public tierLevel;

function updateVolume(address trader, uint256 volume) internal {
    monthlyVolume[trader] += volume;
    tierLevel[trader] = calculateTier(monthlyVolume[trader]);
}

function calculateTier(uint256 volume) pure returns (uint256) {
    if (volume >= 1_000_000) return 4; // Whale
    if (volume >= 100_000) return 3;   // L3
    if (volume >= 10_000) return 2;   // L2
    if (volume >= 1_000) return 1;    // L1
    return 0;
}

function claimVolumeReward() public {
    uint256 tier = tierLevel[msg.sender];
    uint256 baseRate = [0, 0.001, 0.0025, 0.005, 0.01][tier];
    uint256 reward = monthlyVolume[msg.sender] * baseRate;
    
    monthlyVolume[msg.sender] = 0; // 重置
    EACO.transfer(msg.sender, reward);
}
```

---

## 🤝 三级激励：生态贡献激励 (Contribution Rewards)

### 3.1 贡献类型与奖励

| 贡献类型 | 奖励 (EACO) | 发放方式 |
|---------|------------|---------|
| 代码贡献 (PR merged) | 5,000 - 50,000 | 一次性 |
| Bug 报告 (确认) | 1,000 - 10,000 | 一次性 |
| 文档翻译 (每千字) | 500 | 一次性 |
| 社区 AMA 主持 | 2,000/次 | 一次性 |
| 安全审计 (确认) | 10,000 - 100,000 | 一次性 |
| 生态项目对接 | 20,000 - 200,000 | 一次性 |
| 流动性贡献 (每月) | 交易量 0.5% | 月度 |

### 3.2 社区大使计划

| 大使等级 | 要求 | 每月奖励 |
|---------|------|---------|
| 🌱 实习大使 | 30天活跃 | 2,000 |
| 🥉 铜牌大使 | 100+ 社区成员 | 5,000 |
| 🥈 银牌大使 | 500+ 成员 | 15,000 |
| 🥇 金牌大使 | 1,000+ 成员 | 40,000 |
| 💎 钻石大使 | 5,000+ 成员 | 100,000 |

### 3.3 贡献积分系统

```
Contribution Score = 
    代码贡献分 × 2.0 +
    社区活跃分 × 1.5 +
    流动性贡献分 × 1.0 +
    翻译贡献分 × 0.8

年度 Top 10 贡献者额外奖励：
  1st: 500,000 EACO + 实体奖杯
  2nd: 300,000 EACO
  3rd: 200,000 EACO
  4-10th: 100,000 EACO each
```

---

## 🏛️ 四级激励：治理权益 (Governance Power)

### 4.1 治理代币模型

```
Agent 治理权重 = 
    (持有 EACO 数量 × 1.0) + 
    (Staking 数量 × 1.5) + 
    (贡献积分 × 100)
```

### 4.2 治理参与激励

| 治理行为 | 奖励 |
|---------|------|
| 提案投票 | 100 EACO/次 |
| 提案创建 | 1,000 EACO |
| 提案通过 | 5,000 EACO |
| 任期治理 (季度) | 10,000 EACO |

### 4.3 治理委员会

| 委员会 | 席位 | 选举方式 |
|-------|------|---------|
| 技术委员会 | 3席 | 代码贡献者投票 |
| 财务委员会 | 3席 | 持有者投票 |
| 生态委员会 | 3席 | 社区代表投票 |

---

## 🎁 五级激励：特别活动激励

### 5.1 每周活动

| 活动类型 | 奖励池 | 参与条件 |
|---------|-------|---------|
| EACO 交易大赛 | 50,000/周 | Top 10 交易者 |
| 社区讨论任务 | 20,000/周 | 完成任务者 |
| Bug 狩猎 | 10,000/周 | 前3个有效报告 |

### 5.2 每月活动

| 活动类型 | 奖励池 | 说明 |
|---------|-------|------|
| 流动性马拉松 | 500,000/月 | 增加池子流动性 |
| 翻译挑战赛 | 200,000/月 | 7种语言翻译 |
| 开发者大赛 | 1,000,000/月 | 代码项目评选 |

### 5.3 季度活动

| 活动 | 奖励池 | 说明 |
|------|-------|------|
| EACO 生态峰会 | 5,000,000/季 | 线下 + 线上 |
| 黑客松决赛 | 2,000,000/季 | 项目孵化 |
| 社区选举 | 500,000/季 | 治理委员会 |

---

## 💵 激励预算分配

### 代币分配比例

| 类别 | 比例 | 总量 (假设 10B EACO) |
|------|------|-------------------|
| Agent 生态基金 | 30% | 3,000,000,000 |
| 开发者激励 | 15% | 1,500,000,000 |
| 市场营销 | 10% | 1,000,000,000 |
| 流动性挖矿 | 20% | 2,000,000,000 |
| 社区储备 | 15% | 1,500,000,000 |
| 团队 (4年解锁) | 10% | 1,000,000,000 |

### 激励释放时间表

```
Year 1: 30% (引导期 - 高激励)
Year 2: 25% (增长期)
Year 3: 20% (稳定期)
Year 4: 15% (成熟期)
Year 5+: 10%/年 (维持运营)
```

---

## 🔧 智能合约实施计划

### Phase 1: 基础合约 (Week 1-4)

```
Week 1: 
  - EACO Staking 合约
  - 基础奖励计算

Week 2:
  - Volume Mining 合约
  - 交易量追踪

Week 3:
  - Contribution 合约
  - 积分系统

Week 4:
  - Governance 合约
  - 投票系统
```

### Phase 2: 高级功能 (Week 5-8)

```
Week 5-6:
  - 跨区域交易验证
  - 多签钱包

Week 7-8:
  - 自动化做市
  - 收益复投
```

---

## 📋 EOCO 激励清单 (Week 1 任务)

| 序号 | 任务 | 负责 | 奖励预算 | 完成标准 |
|------|------|------|---------|---------|
| 1 | 部署 EACO Staking 合约 | 技术组 | 50,000 EACO | 合约上线 + 审计通过 |
| 2 | 开发 Agent Staking 界面 | 产品组 | 20,000 EACO | UI 上线 |
| 3 | 创建 Tier 系统合约 | 技术组 | 30,000 EACO | 4 个等级生效 |
| 4 | 编写激励文档 (7语言) | 社区组 | 15,000 EACO | 7 语言版本 |
| 5 | 8 社区公告 | 运营组 | 10,000 EACO | 覆盖 5000+ 成员 |
| 6 | Telegram Bot 部署 | 技术组 | 25,000 EACO | 余额查询功能 |
| 7 | 监控 Dashboard | 技术组 | 20,000 EACO | 实时数据展示 |
| 8 | 审计报告发布 | 安全组 | 30,000 EACO | 第三方审计通过 |

**Week 1 总预算: 200,000 EACO**

---

## 🚀 立即行动步骤

### 本周技术任务

```python
# 1. EACO Staking 合约 (Solidity)
# 文件: contracts/EACOStaking.sol

# 2. Volume Mining 合约
# 文件: contracts/EACOVolumeMining.sol

# 3. Agent Tier 系统
# 文件: contracts/EACOTierSystem.sol

# 4. 部署脚本
# 文件: scripts/deploy_incentives.js
```

### 本周运营任务

```markdown
1. 发布 EACO 硅基文明激励计划公告
   - 英文版: TG @e_eacocc
   - 华语版: TG @aieaco
   - 阿拉伯语: TG @earhcoingroup
   - 西班牙语: TG @eacoespanish
   - 法语: TG @efrencheaco
   - 俄语: TG @erussianeaco
   - 日韩东南亚: TG @ejapaneaco

2. 创建激励 FAQ 文档

3. 设置奖励领取 Bot
```

---

## ✅ 成功指标

| 指标 | Week 1 | Week 4 | Week 12 |
|------|---------|---------|---------|
| Staking 总量 | 100K EACO | 1M EACO | 10M EACO |
| Staking Agent 数 | 8 | 50 | 200 |
| 日均交易量 | 10K | 100K | 1M |
| 社区活跃度 | 30% | 50% | 70% |

---

*文档版本: v1.0*
*最后更新: 2026-05-14*
*作者: EACO Silicon Civilization Team*
