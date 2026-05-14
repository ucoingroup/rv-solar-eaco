# MEMORY.md - Long-Term Memory

_Curated memories — the distilled essence, not raw logs._
_Only loaded in main sessions. Review daily files and keep what matters._

---

## 用户身份与偏好

- 用户运营Web3/Web4/Web5智能科技内容，面向海外受众，接受SOL/wBNB/wETH等链上代币打赏
- 用户打赏地址 SOL/wBNB/wETH/USDT: 8jpA6mfoZvdbQA1tMqWZyQnsn3CqtRfjeaXPArt4uhNE
- 用户打赏地址 BNB/EVM/USDC/WDOGE: 0xedba2da577942bff3ca03bcb88b0190a3dbeef94

## EACO Agent World 自动化闭环 ✅ 已完成

### 已注册的 8 个 Agent（全部验证通过）

| Agent 名称 | Agent ID | 状态 |
|-----------|----------|------|
| eaco-global | f649c870-99cd-4e9a-8223-8a8a06520094 | ✅ 已验证 |
| eaco-europe-1 | 83004dd1-b542-427a-a747-6eb3ef306fc5 | ✅ 已验证 |
| eaco-asia-1 | 25c0f24e-d126-43d6-84ab-6942b815843b | ✅ 已验证 |
| eaco-americas-1 | 369b608d-044c-4f64-9ca8-a5e5dc2829b5 | ✅ 已验证 |
| eaco-mena-1 | 12a18c23-f872-4690-b29a-5f0ff92a0655 | ✅ 已验证 |
| eaco-southeast-1 | f00596e3-7058-49f3-96a7-bf1691d58269 | ✅ 已验证 |
| eaco-south-asia-1 | dae03977-6d26-4d39-a27d-d3c116670eb7 | ✅ 已验证 |
| eaco-east-asia-1 | dadbc813-9286-4af1-b9f0-b23b07cac3fc | ✅ 已验证 |

### 核心参数

- **API Key**: agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b
- **参赛 Match**: match_1777000323458（已满足 8/8 席位）
- **利润分配**: 50% 再投资，50% 提现
- **提现钱包**: 3uVyRjzLnJ6MumYaQ7oMt5jPVPBGKFUeGgqkzwh5Uw6N
- **结算周期**: 每周一 02:00 北京时间

### 自动化脚本（2026-05-11 完成）

```
eaco-agent-world/
├── auto_register.py       # 全自动注册+验证脚本
├── monitor.py            # 状态监控脚本
├── DAILY_CHECK.bat      # 每日检查（Windows 计划任务）
└── SETTLEMENT_ALERT.bat # 结算日提醒（Windows 计划任务）
```

### Windows 计划任务（已创建）

- **EACO Daily Check**: 每天 09:00 执行 monitor.py
- **EACO Settlement Alert**: 每周一 01:00 执行 monitor.py

### API 端点（已验证）

| 用途 | 方法 | URL |
|------|------|-----|
| 注册 Agent | POST | https://world.coze.site/api/agents/register |
| 验证 Agent | POST | https://world.coze.site/api/agents/verify |

### 工作目录

- **脚本**: `C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\eaco-agent-world\`
- **配置**: `C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\agents\{agent-name}\config.json`
- **监控报告**: `C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\agents\monitor_report.json`
- **技能文档**: `C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\skills\eaco-agent-world\SKILL.md`

## 项目结构

- 用户正在编写《WEB3 & WEB4 终极指南》电子书，以 EACO 为案例，目标1000章
- 工作区: `C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7`