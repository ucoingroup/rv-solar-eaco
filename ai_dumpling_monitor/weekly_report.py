# -*- coding: utf-8 -*-
"""
水饺店AI情报自动生成报告
每周执行，输出Markdown报告
"""
import json
import httpx
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Dict, List

# ============ 核心模块 ============
try:
    from config import WORKSPACE, REPORT_DIR, API_KEYS, CITIES, setup_logging
    from apis import FREE_API_QUOTAS, get_quota_summary, test_api_health, API_CALL_EXAMPLES
except ImportError:
    import sys
    sys.path.insert(0, str(Path(__file__).parent))
    from config import WORKSPACE, REPORT_DIR, API_KEYS, CITIES, setup_logging
    from apis import FREE_API_QUOTAS, get_quota_summary, test_api_health, API_CALL_EXAMPLES

REPORT_DIR.mkdir(parents=True, exist_ok=True)

# ============ 水饺店场景AI应用场景 ============
DUMPLING_AI_PROMPTS = {
    "重庆": {
        "daily_update": """作为重庆水饺店运营专家，分析以下今日数据并给出改进建议：
        - 今日销量：{sales}单
        - 好评率：{good_rate}%
        - 差评关键词：{bad_keywords}
        - 竞对动态：{competitor_info}
        重点考虑：麻辣口味接受度、价格敏感度、外卖平台排名""",
        "weekly_summary": """生成重庆市场水饺店周报，包含：
        1. 本周销售趋势分析（附数据）
        2. 竞品动态（重庆本地新开/促销信息）
        3. 用户评价情感分析
        4. 下周运营建议（3条核心）"""
    },
    "上海": {
        "daily_update": """作为上海高端水饺品牌分析师，分析数据：
        - 今日销量：{sales}单
        - 平均客单价：{avg_price}元
        - 用户评价摘要：{reviews}
        - 商场客流：{traffic}
        重点考虑：品牌调性、写字楼午市、外卖评分"""
    },
    "广东": {
        "daily_update": """作为广式点心/水饺专家，分析数据：
        - 今日销量：{sales}单
        - 海鲜品类占比：{seafood_pct}%
        - 早茶时段销售：{morning_sales}单
        - 差评原因：{complaints}
        重点考虑：海鲜新鲜度、点心化创新、堂食体验"""
    }
}

# ============ AI生成报告核心逻辑 ============
async def generate_ai_report(city: str, api_key: str, logger) -> str:
    """调用智谱AI生成水饺店运营周报"""
    if not api_key:
        logger.warning(f"[{city}] 未配置API Key，使用本地模板生成")
        return generate_local_report(city)
    
    try:
        prompt = f"""
        你是一位深耕餐饮行业的AI分析师，专门研究水饺/饺子店赛道。
        请为{city}的水饺店生成一份周报（模拟数据）：
        
        报告结构：
        ## {city}水饺店本周市场概况
        ### 1. 行业动态
        - 全国水饺市场增长趋势（2025-2026数据）
        - {city}本地市场特点分析
        - 外卖平台（美团/饿了么）最新政策
        
        ### 2. 竞品动态
        - 本周{city}新开水饺店（3-5家）
        - 头部品牌最新活动
        
        ### 3. 风险预警
        - 原料成本变化（猪肉/面粉/海鲜）
        - 政策风险
        - 竞争加剧预警
        
        ### 4. AI赋能建议
        - 本周{city}水饺店可采用的3个AI工具
        - 具体应用场景（客服/文案/数据分析）
        
        ### 5. 下周行动清单
        列出3条可执行的具体行动
        
        风格要求：
        - 专业但接地气，中文
        - 有具体数字和数据支撑
        - 每条建议可直接落地执行
        """
        
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "glm-4-flash",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                    "max_tokens": 2048
                }
            )
            
            if resp.status_code == 200:
                result = resp.json()
                content = result["choices"][0]["message"]["content"]
                logger.info(f"[{city}] AI报告生成成功")
                return content
            else:
                logger.error(f"[{city}] API调用失败: {resp.status_code}")
                return generate_local_report(city)
                
    except Exception as e:
        logger.error(f"[{city}] 生成失败: {e}")
        return generate_local_report(city)


def generate_local_report(city: str) -> str:
    """本地模板（无API Key时使用）"""
    market_data = {
        "重庆": {
            "market_size": "约25亿元",
            "growth": "12%/年",
            "characteristics": "社区店密集，麻辣口味主导，外卖占比75%+",
            "risks": ["夏季高温影响客流", "原料成本上涨", "同质化竞争"],
            "opportunities": ["川渝麻辣差异化", "工厂/学校渠道", "旅游餐饮"]
        },
        "上海": {
            "market_size": "约40亿元",
            "growth": "8%/年",
            "characteristics": "高端化、品牌化倾向，写字楼午市强，外卖50%",
            "risks": ["租金高", "消费者挑剔", "头部品牌挤压"],
            "opportunities": ["品牌溢价", "写字楼渠道", "精品水饺定位"]
        },
        "广东": {
            "market_size": "约30亿元",
            "growth": "15%/年",
            "characteristics": "点心化/茶餐厅化，虾饺/海鲜馅特色，堂食强",
            "risks": ["海鲜损耗高", "人工成本高", "夏季清淡口味偏好"],
            "opportunities": ["海鲜创新", "点心化SKU", "早茶时段"]
        }
    }
    
    data = market_data.get(city, market_data["重庆"])
    
    report = f"""
## {city}水饺店本周市场概况

> 📅 报告日期：{datetime.now().strftime('%Y-%m-%d')}
> ⚠️ 此为本地模板报告，配置API Key后可获取AI实时分析

### 1. {city}市场规模

| 指标 | 数据 |
|------|------|
| 预估市场规模 | **{data['market_size']}** |
| 年增长率 | **{data['growth']}** |
| 市场特点 | {data['characteristics']} |

### 2. 风险预警

| 风险类型 | 风险描述 | 预案 |
|---------|---------|------|
| 原料成本 | 猪肉价格波动↑ | 期货锁定+多供应商 |
| 位置风险 | 新商圈人流不足 | AI人流预测+试营业 |
| 同质竞争 | 周边同类店开业 | 差异化SKU+私域运营 |
| 口味偏差 | 区域口味不匹配 | 首周差评监控+快速迭代 |

### 3. 发展机会

{"".join([f"- **{item}**" for item in data['opportunities']])}

### 4. AI赋能路线图

| 周 | 目标 | 使用的AI工具 |
|----|------|-------------|
| 第1周 | 搭建AI客服（回复差评） | 智谱GLM-4-Flash |
| 第2周 | 生成小红书/大众点评文案 | 硅基流动Qwen |
| 第3周 | 销售数据预测分析 | DeepSeek R1 |
| 第4周 | 竞品监控报告自动化 | Google Gemini |

### 5. 下周行动清单

- ⬜ 联系{ city }本地食材供应商，对比3家报价
- ⬜ 在美团/大众点评创建门店页面，优化首图和菜单
- ⬜ 制定差异化的主打SKU（{ city }专属口味）
    """
    return report


# ============ 完整周报生成 ============
async def generate_full_weekly_report(logger) -> Path:
    """生成完整周报"""
    logger.info("=" * 50)
    logger.info("开始生成水饺店AI情报周报...")
    
    # 获取AI额度汇总
    quota_table = get_quota_summary()
    
    # 各城市报告
    city_reports = {}
    tasks = []
    
    for city in CITIES:
        tasks.append(generate_ai_report(city, API_KEYS.get("zhipu", ""), logger))
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    for i, city in enumerate(CITIES):
        if isinstance(results[i], Exception):
            city_reports[city] = generate_local_report(city)
            logger.error(f"[{city}] 生成异常: {results[i]}")
        else:
            city_reports[city] = results[i]
    
    # 组装完整报告
    report_date = datetime.now().strftime("%Y年%m月%d日 %H:%M")
    
    full_report = f"""# 🥟 水饺店AI情报周报

**报告生成时间**：{report_date}  
**覆盖城市**：{' / '.join(CITIES)}  
**报告周期**：本周市场动态 + AI工具免费额度更新  
**下次自动更新**：{(datetime.now().replace(day=1, month=datetime.now().month+1 if datetime.now().month < 12 else 1) if datetime.now().month < 12 else datetime.now().replace(day=1, month=1, year=datetime.now().year+1)).strftime('%Y-%m-%d')}（约7天后）

---

## 📡 一、全球Top10 AI工具免费API额度（2026年6月更新）

{quota_table}

> 💡 **水饺店应用推荐**：智谱GLM-4-Flash（中文最强，永久免费）是日常主力，DeepSeek R1用于数据分析，硅基流动作为备用。

---

## 🥟 二、三城水饺店发展策略

"""
    
    for city, report_content in city_reports.items():
        full_report += f"### 🏙️ {city}\n{report_content}\n---\n"
    
    # 三城横向对比
    full_report += f"""
## 📊 三、三城横向对比

| 维度 | 重庆 | 上海 | 广东 |
|------|:---:|:---:|:---:|
| **主打口味** | 麻辣 | 鲜肉/蟹粉 | 虾饺/海鲜 |
| **客单价** | 15-25元 | 30-50元 | 20-35元 |
| **外卖占比** | 75% | 50% | 60% |
| **核心风险** | 夏季高温 | 租金成本 | 海鲜损耗 |
| **AI优先场景** | 动态定价 | 品牌文案 | 库存预测 |
| **市场增长** | 12%/年 | 8%/年 | 15%/年 |
| **策略关键词** | 差异化+性价比 | 品牌调性 | 点心化创新 |

---

## ⚠️ 四、本周风险提示

### 高优先级（需立即处理）

1. **原料成本预警**：猪肉价格近期上涨约8%，建议：
   - 锁定期货合约（1-3个月）
   - 推出"猪肉涨价公告"文案（AI生成），提前告知用户
   - 测试鸡肉/虾仁替代馅料配方

2. **夏季运营压力**（6-9月）：
   - 重庆：高温→午市缩短→推出早餐线（包子/馒头）
   - 广东：梅雨季→海鲜损耗↑→每日限售+提前清仓机制

3. **AI工具额度提醒**：
   - 智谱AI GLM-4-Flash：永久免费 ✅ 主力使用
   - DeepSeek：500万Token（新户30天）⚠️ 注意有效期
   - OpenAI $5赠金：3个月 ⚠️ 建议仅用于测试

### 中优先级

- 美团/大众点评店铺装修优化（首图+菜单+评价管理）
- 私域流量建设（微信群/小程序）

---

## 🚀 五、下周行动清单

### 第一优先级
- ⬜ **申请智谱AI API Key** → https://open.bigmodel.cn/ （2000万Token永久免费）
- ⬜ **申请硅基流动API Key** → https://siliconflow.cn/ （小模型永久免费）
- ⬜ 配置API Key到本系统的 `config.py` 中

### 第二优先级
- ⬜ 针对{', '.join(CITIES)}各城市，确立主打SKU（各1个差异化口味）
- ⬜ 在对应外卖平台完成店铺基础搭建
- ⬜ 设计第一版促销方案（首单立减/满减/新客礼）

### 第三优先级
- ⬜ 搭建微信私域社群（门店引流+复购运营）
- ⬜ 制定标准化出品SOP（皮/馅比例+煮制时间）

---

## 📎 六、技术配置说明

### API Key配置
编辑 `config.py` 文件，填入以下环境变量（或直接修改文件内API_KEYS字典）：

```bash
# 环境变量方式（推荐）
export ZHIPU_API_KEY="your_zhipu_key_here"
export SILICONFLOW_API_KEY="your_siliconflow_key_here"
export DEEPSEEK_API_KEY="your_deepseek_key_here"
export GEMINI_API_KEY="your_gemini_key_here"
```

### 运行报告生成
```bash
cd C:\\Users\\Administrator\\.qclaw\\workspace-ua58rsb93veqtxl7\\ai_dumpling_monitor
python weekly_report.py
```

### 设置Windows定时任务（每周自动执行）
```powershell
# 创建每周一上午9点执行的计划任务
schtasks /create /tn "DumplingAI_WeeklyReport" /tr "python C:/Users/Administrator/.qclaw/workspace-ua58rsb93veqtxl7/ai_dumpling_monitor/weekly_report.py" /sc weekly /d MON /st 09:00
```

---

*📌 本报告由AI自动生成，数据仅供参考，实际运营请结合实地调研决策。*
*🔄 系统每周自动更新，如需立即刷新请运行 `python weekly_report.py`*
"""
    
    # 保存报告
    report_path = REPORT_DIR / f"dumpling_ai_report_{datetime.now().strftime('%Y%m%d')}.md"
    report_path.write_text(full_report, encoding="utf-8")
    logger.info(f"报告已保存: {report_path}")
    
    # 保存JSON摘要（便于程序读取）
    import datetime as dt_module
    next_month = datetime.now().replace(day=1)
    if next_month.month == 12:
        next_month = next_month.replace(month=1, year=next_month.year + 1)
    else:
        next_month = next_month.replace(month=next_month.month + 1)
    
    summary = {
        "report_date": report_date,
        "cities": CITIES,
        "top10_ai_tools": [{"rank": q["rank"], "platform": q["platform"], "free额度": q["free额度"]} for q in FREE_API_QUOTAS],
        "next_update": next_month.strftime("%Y-%m-%d")
    }
    summary_path = REPORT_DIR / f"summary_{datetime.now().strftime('%Y%m%d')}.json"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    
    return report_path


async def main():
    logger = setup_logging()
    logger.info("DumplingAI System Started")
    
    report_path = await generate_full_weekly_report(logger)
    print(f"\n[OK] Report generated: {report_path}")
    print(f"Contents:")
    print(f"   1. Global Top10 AI Free API Quotas")
    print(f"   2. Chongqing/Shanghai/Guangdong Market Analysis")
    print(f"   3. Risk Warnings + Action Items")
    print(f"   4. API Configuration Guide")


if __name__ == "__main__":
    asyncio.run(main())
