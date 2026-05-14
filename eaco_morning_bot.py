"""
EACO 早报 Bot - Telegram 自动推送
功能：每天定时推送 EACO 链上数据简报
"""
import asyncio
import os
from datetime import datetime
import httpx
from telegram import Bot
from telegram.error import TelegramError

# ====== 配置 ======
# 从 BotFather 获取
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN_HERE")
# 群 chat_id（负数格式：-100xxxxxxx）
GROUP_CHAT_ID = os.environ.get("GROUP_CHAT_ID", "YOUR_CHAT_ID_HERE")

# EACO CA
EACO_CA = "DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH"
SOLANA_RPC = "https://api.mainnet-beta.solana.com"

# 池子配置
METEORA_POOL_ID = "6ZfCi3qzhgDN1ygHVYXvfsfrwz8ZhQ7hD5mJtjeuUDyE"
ORCA_POOL_ID = "4ELFtiSCM1Ra8yhVFJemnMZPQC2a8yZ3RhSKmckt5Swx"


async def get_token_price(token_address: str) -> dict | None:
    """获取代币价格（通过 Raydium Liquidity）"""
    try:
        async with httpx.AsyncClient() as client:
            # Raydium API
            url = f"https://api.raydium.io/v2/pool/detail/{token_address}"
            resp = await client.get(url, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                return data
    except Exception as e:
        print(f"获取价格失败: {e}")
    return None


async def get_token_holders(token_address: str) -> dict | None:
    """获取持币地址数据"""
    try:
        async with httpx.AsyncClient() as client:
            url = SOLANA_RPC
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "getTokenLargestAccounts",
                "params": [token_address]
            }
            resp = await client.post(url, json=payload, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("result", {}).get("value", [])
    except Exception as e:
        print(f"获取持币地址失败: {e}")
    return None


async def get_pool_liquidity(pool_id: str) -> dict | None:
    """获取 Meteora 池子流动性"""
    try:
        async with httpx.AsyncClient() as client:
            url = f"https://api.meteora.ag/api/v1/pairs/{pool_id}"
            resp = await client.get(url, timeout=10.0)
            if resp.status_code == 200:
                data = resp.json()
                return data
    except Exception as e:
        print(f"获取池子流动性失败: {e}")
    return None


def format_message(data: dict = None) -> str:
    """生成早报消息"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    msg = f"""🌅 EACO 早报 {now}

💰 代币信息
CA: `{EACO_CA[:8]}...{EACO_CA[-4:]}`

📊 数据来源
• Solscan: https://solscan.io/token/{EACO_CA}
• Orca: https://www.orca.so/pools?tokens={EACO_CA}
• Meteora: https://app.meteora.ag/dlmm/{METEORA_POOL_ID}

🔗 官方链接
• Twitter: @eacocc
• TG English: @e_eacocc
• TG 华语: @aieaco

🟢 状态: 数据获取中...
"""
    return msg


async def send_morning_report(bot: Bot, chat_id: str):
    """发送早报"""
    # 先发一条"获取中"的消息
    msg = format_message()
    try:
        sent_msg = await bot.send_message(
            chat_id=chat_id,
            text=msg,
            parse_mode="Markdown"
        )
        return sent_msg.message_id
    except TelegramError as e:
        print(f"发送消息失败: {e}")
        return None


async def main():
    """主函数（测试用）"""
    if TELEGRAM_BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("请设置 TELEGRAM_BOT_TOKEN 环境变量")
        return
    
    bot = Bot(token=TELEGRAM_BOT_TOKEN)
    
    # 获取 bot 信息
    me = await bot.get_me()
    print(f"Bot 启动: @{me.username}")
    
    # 发送测试消息
    if GROUP_CHAT_ID != "YOUR_CHAT_ID_HERE":
        await send_morning_report(bot, GROUP_CHAT_ID)
        print(f"消息已发送到群: {GROUP_CHAT_ID}")
    else:
        print("请设置 GROUP_CHAT_ID 环境变量")


# ====== Windows 计划任务调度 ======
# 在 CMD 运行以下命令设置每日早上8点执行：
# schtasks /create /tn "EACO_Morning_Report" /tr "python C:\path\to\eaco_morning_bot.py" /sc daily /st 08:00

if __name__ == "__main__":
    asyncio.run(main())