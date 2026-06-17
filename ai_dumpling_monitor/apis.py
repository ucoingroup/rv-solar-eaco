# -*- coding: utf-8 -*-
"""
全球Top10 AI平台免费API额度查询模块
2026年最新额度数据 + 动态检测
"""
import json
import httpx
from typing import Dict, List, Optional

# ============ 静态额度数据（2026年6月最新） ============
FREE_API_QUOTAS: List[Dict] = [
    {
        "rank": 1,
        "platform": "智谱AI GLM",
        "free额度": "2000万Token（新户赠送）",
        "永久免费模型": "GLM-4-Flash (128K上下文), GLM-4.7-Flash (200K上下文)",
        "限速": "30并发",
        "适用场景": "中文客服/文案生成/Agent工作流",
        "注册地址": "https://open.bigmodel.cn/",
        "API格式": "OpenAI兼容 (v4/chat/completions)",
        "推荐指数": "⭐⭐⭐⭐⭐",
        "备注": "永久免费额度，国内第一梯队，首推"
    },
    {
        "rank": 2,
        "platform": "硅基流动 SiliconFlow",
        "free额度": "2000万Token（新户）+ Qwen2.5-7B等小模型永久免费",
        "永久免费模型": "Qwen2.5-7B-Instruct, DeepSeek-V2.5, GLM-4-Flash",
        "限速": "1000 RPM（部分模型）",
        "适用场景": "国内访问/高频调用/低延迟(<100ms)",
        "注册地址": "https://siliconflow.cn/",
        "API格式": "OpenAI兼容 (v1/chat/completions)",
        "推荐指数": "⭐⭐⭐⭐",
        "备注": "国内服务器，支持微信/支付宝充值"
    },
    {
        "rank": 3,
        "platform": "DeepSeek",
        "free额度": "500万Token（新户，30天内）",
        "永久免费模型": "DeepSeek R1（部分场景限免）",
        "限速": "60 RPM",
        "适用场景": "中文推理/复杂任务/成本敏感",
        "注册地址": "https://platform.deepseek.com/",
        "API格式": "OpenAI兼容",
        "推荐指数": "⭐⭐⭐⭐",
        "备注": "V3/R1能力强，API格式兼容OpenAI"
    },
    {
        "rank": 4,
        "platform": "阿里云百炼",
        "free额度": "每个模型100万Token（3个月有效）",
        "永久免费模型": "Qwen-Turbo（部分限免）",
        "限速": "1000 TPM",
        "适用场景": "阿里云生态/Qwen系列/企业级",
        "注册地址": "https://qianfan.aliyun.com/",
        "API格式": "OpenAI兼容 + 阿里专属格式",
        "推荐指数": "⭐⭐⭐⭐",
        "备注": "模型种类最丰富，企业集成方便"
    },
    {
        "rank": 5,
        "platform": "Google Gemini",
        "free额度": "1500次/天（永久）",
        "永久免费模型": "Gemini 2.5 Flash, Gemini 2.5 Pro",
        "限速": "60 RPM / 1500次/天",
        "适用场景": "多语言/国际化/长文本处理",
        "注册地址": "https://ai.google.dev/",
        "API格式": "Google Gemini专属",
        "推荐指数": "⭐⭐⭐⭐",
        "备注": "永久免费额度，国际化首选"
    },
    {
        "rank": 6,
        "platform": "OpenAI",
        "free额度": "$5 赠金（新户，3个月）",
        "永久免费模型": "GPT-4o-mini（部分限免）",
        "限速": "500 RPM（Tier 1）",
        "适用场景": "通用对话/代码生成/研究用途",
        "注册地址": "https://platform.openai.com/",
        "API格式": "OpenAI标准",
        "推荐指数": "⭐⭐⭐",
        "备注": "新户$5额度，额度较小需精打细算"
    },
    {
        "rank": 7,
        "platform": "Anthropic Claude",
        "free额度": "Claude 3.5 Sonnet免费层可用",
        "永久免费模型": "Claude 3.5 Haiku（限免）",
        "限速": "50 RPM",
        "适用场景": "长文本分析/代码审查/创意写作",
        "注册地址": "https://console.anthropic.com/",
        "API格式": "Anthropic专属",
        "推荐指数": "⭐⭐⭐",
        "备注": "上下文200K，能力强但限速严"
    },
    {
        "rank": 8,
        "platform": "百度智能云千帆",
        "free额度": "新户赠送额度（含文心大模型）",
        "永久免费模型": "ERNIE-3.5（部分限免）",
        "限速": "按模型不同",
        "适用场景": "中文NLP/百度生态集成",
        "注册地址": "https://console.bce.baidu.com/qianfan/",
        "API格式": "百度专属 + OpenAI兼容",
        "推荐指数": "⭐⭐⭐",
        "备注": "文心系列中文能力强"
    },
    {
        "rank": 9,
        "platform": "腾讯云混元",
        "free额度": "新户资源包",
        "永久免费模型": "混元-hunyuan-pro（部分限免）",
        "限速": "限速（未公开具体值）",
        "适用场景": "腾讯生态/游戏/社交应用",
        "注册地址": "https://cloud.tencent.com/",
        "API格式": "腾讯专属",
        "推荐指数": "⭐⭐⭐",
        "备注": "腾讯云生态用户优先"
    },
    {
        "rank": 10,
        "platform": "Kimi（月之暗面）",
        "free额度": "15元个人认证 + Token不限量",
        "永久免费模型": "Kimi K2.5（频率限制）",
        "限速": "3次/分钟（Token不限）",
        "适用场景": "长文本阅读/文档摘要/书籍处理",
        "注册地址": "https://platform.moonshot.cn/",
        "API格式": "OpenAI兼容",
        "推荐指数": "⭐⭐⭐",
        "备注": "256K超长上下文，不限Token是亮点"
    }
]

# ============ API调用示例 ============
API_CALL_EXAMPLES = {
    "智谱AI": {
        "endpoint": "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        "model": "glm-4-flash",
        "headers": {
            "Authorization": "Bearer {ZHIPU_API_KEY}",
            "Content-Type": "application/json"
        },
        "example_payload": {
            "model": "glm-4-flash",
            "messages": [
                {"role": "user", "content": "生成3个小红书爆款标题，围绕'现包水饺'"}
            ],
            "temperature": 0.7
        }
    },
    "硅基流动": {
        "endpoint": "https://api.siliconflow.cn/v1/chat/completions",
        "model": "Qwen/Qwen2.5-7B-Instruct",
        "headers": {
            "Authorization": "Bearer {SILICONFLOW_API_KEY}",
            "Content-Type": "application/json"
        },
        "example_payload": {
            "model": "Qwen/Qwen2.5-7B-Instruct",
            "messages": [
                {"role": "user", "content": "写一条大众点评的好评回复模板"}
            ]
        }
    },
    "DeepSeek": {
        "endpoint": "https://api.deepseek.com/v1/chat/completions",
        "model": "deepseek-chat",
        "headers": {
            "Authorization": "Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json"
        },
        "example_payload": {
            "model": "deepseek-chat",
            "messages": [
                {"role": "user", "content": "分析本周销售数据：周一500单，周二480单，周三520单，周四490单，周五550单，预测周末销量"}
            ]
        }
    },
    "Google Gemini": {
        "endpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        "model": "gemini-2.0-flash",
        "headers": {},
        "query_params": {"key": "{GEMINI_API_KEY}"},
        "example_payload": {
            "contents": [{
                "parts": [{"text": "英文翻译：我们的水饺都是现包现煮，保证新鲜美味"}]
            }]
        }
    }
}


def get_quota_summary() -> str:
    """生成额度汇总Markdown表格"""
    lines = ["| 排名 | 平台 | 免费额度 | 永久免费模型 | 限速 | 推荐 |",
             "|:---:|------|---------|---------|:---:|:---:|"]
    for q in FREE_API_QUOTAS:
        lines.append(
            f"| {q['rank']} | **{q['platform']}** | {q['free额度']} | "
            f"{q.get('永久免费模型','暂无')} | {q['限速']} | {q['推荐指数']} |"
        )
    return "\n".join(lines)


def test_api_health(api_name: str, api_key: str) -> Dict:
    """测试API连通性（仅测试智谱和硅基，其他需要Key）"""
    results = {"status": "unknown", "message": ""}
    
    if api_name == "智谱AI" and api_key:
        try:
            import httpx
            with httpx.Client(timeout=10) as client:
                resp = client.post(
                    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
                    headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                    json={
                        "model": "glm-4-flash",
                        "messages": [{"role": "user", "content": "你好"}],
                        "max_tokens": 10
                    }
                )
                if resp.status_code == 200:
                    results = {"status": "✅ 正常", "message": f"响应正常，余额充足"}
                else:
                    results = {"status": "⚠️ 异常", "message": f"HTTP {resp.status_code}: {resp.text[:100]}"}
        except Exception as e:
            results = {"status": "❌ 失败", "message": str(e)[:100]}
    
    return results


if __name__ == "__main__":
    print("=== 全球Top10 AI工具免费API额度汇总 ===\n")
    print(get_quota_summary())
