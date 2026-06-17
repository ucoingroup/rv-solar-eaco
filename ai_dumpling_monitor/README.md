# 🥟 水饺店AI情报系统

> 三城（重庆/上海/广东）水饺店发展策略 + 全球Top10 AI工具免费API自动监控

## 📁 目录结构

```
ai_dumpling_monitor/
├── config.py              # 核心配置（API Key等）
├── apis.py                # 全球Top10 AI免费API数据
├── weekly_report.py       # 每周报告自动生成器
├── DAILY_CHECK.bat        # 每日快速检查
├── WEEKLY_REPORT.bat      # 每周自动生成报告
├── reports/               # 生成的报告存放目录
└── logs/                  # 运行日志目录
```

## 🚀 快速开始

### 第一步：安装依赖
```bash
pip install httpx asyncio
```

### 第二步：申请API Key（至少申请1个，推荐智谱AI）

| 平台 | 注册地址 | 免费额度 | 推荐理由 |
|------|---------|---------|---------|
| **智谱AI** ⭐ | https://open.bigmodel.cn/ | 2000万Token（永久） | 中文最强，永久免费 |
| **硅基流动** | https://siliconflow.cn/ | 2000万Token + 小模型免费 | 国内低延迟 |
| **DeepSeek** | https://platform.deepseek.com/ | 500万Token（30天） | 推理能力强 |

### 第三步：配置API Key
编辑 `config.py`，将你的API Key填入：

```python
API_KEYS = {
    "zhipu": "your_zhipu_key_here",       # 必填！推荐申请
    "siliconflow": "your_sf_key_here",    # 可选
    "deepseek": "your_ds_key_here",       # 可选
    "gemini": "your_gemini_key_here",     # 可选
}
```

### 第四步：运行

```bash
# 生成周报
python weekly_report.py

# 或使用批处理（Windows）
WEEKLY_REPORT.bat
```

### 第五步：设置自动执行（每周一自动生成）

```powershell
schtasks /create /tn "DumplingAI_WeeklyReport" /tr "python C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\ai_dumpling_monitor\weekly_report.py" /sc weekly /d MON /st 09:00
```

## 📊 功能说明

### ✅ 已实现
- [x] 全球Top10 AI工具免费API额度数据库（2026年6月最新）
- [x] 三城（重庆/上海/广东）水饺店市场分析报告
- [x] AI风险预警（原料成本/竞争/选址）
- [x] 每周自动Markdown报告生成
- [x] Windows定时任务集成
- [x] 中文水饺店场景专用AI提示词

### 🔄 即将实现
- [ ] 接入美团/大众点评API（实时竞品监控）
- [ ] 销售数据预测模型（时间序列）
- [ ] 微信小程序私域运营自动化
- [ ] AI客服自动回复差评

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────┐
│          水饺店AI情报监控系统                      │
├─────────────────────────────────────────────────┤
│  数据源层                                         │
│  ├── 智谱AI GLM-4-Flash（中文报告生成）            │
│  ├── 硅基流动Qwen（文案生成）                     │
│  ├── DeepSeek R1（数据分析/推理）                 │
│  └── Google Gemini（多语言/国际化）               │
├─────────────────────────────────────────────────┤
│  应用层                                          │
│  ├── weekly_report.py（周报生成）                 │
│  ├── 风险预警（原料/竞争/选址）                   │
│  └── 行动清单生成                                 │
├─────────────────────────────────────────────────┤
│  输出层                                          │
│  ├── reports/dumpling_ai_report_YYYYMMDD.md    │
│  └── logs/monitor_YYYYMMDD.log                 │
└─────────────────────────────────────────────────┘
```

## ⚠️ 注意事项

1. **API Key安全**：不要将包含真实Key的代码提交到公开仓库
2. **免费额度监控**：DeepSeek 500万Token有30天有效期，请及时使用
3. **数据准确性**：市场数据为AI估算+公开资料，重要决策请实地核实
4. **重庆特别注意**：夏季高温（6-9月）对堂食影响大，建议加大外卖权重

## 📌 三城核心策略速查

| 城市 | 🎯 差异化定位 | 💰 客单价 | ⚠️ 最大风险 | 🤖 AI优先场景 |
|------|------------|---------|-----------|-------------|
| 重庆 | 川渝麻辣开创者 | 15-25元 | 夏季高温 | 动态定价 |
| 上海 | 海派精致品牌 | 30-50元 | 租金压力 | 品牌文案 |
| 广东 | 广式点心融合 | 20-35元 | 海鲜损耗 | 库存预测 |

---
*🥟 用AI赋能水饺店，让传统美食插上智能化的翅膀*
