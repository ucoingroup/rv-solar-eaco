#!/usr/bin/env python3
"""
EACO Agent Monitoring Bot
监控 EACO 持有量、交易量、价格波动
支持 Telegram/Discord 通知
"""

import os
import time
import json
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import requests

# ============ 配置 ============
CONFIG = {
    "eaco_ca": "DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH",
    "solana_rpc": "https://api.mainnet-beta.solana.com",
    "telegram_bot_token": os.getenv("TELEGRAM_BOT_TOKEN", ""),
    "telegram_chat_id": os.getenv("TELEGRAM_CHAT_ID", ""),
    "discord_webhook": os.getenv("DISCORD_WEBHOOK", ""),
    "check_interval": 60,  # 秒
    "price_alert_threshold": 0.05,  # 5% 波动警报
    "pool_addresses": {
        "orca": "4ELFtiSCM1Ra8yhVFJemnMZPQC2a8yZ3RhSKmckt5Swx",
        "raydium": "DqfoyZH96RnvZusSp3Cdncjpyp3C74ZmJzGhjmHnDHRH",  # 需要替换
        "meteora": "6ZfCi3qzhgDN1ygHVYXvfsfrwz8ZhQ7hD5mJtjeuUDyE",
    }
}

# ============ Solana RPC 交互 ============
class SolanaClient:
    """Solana 区块链交互客户端"""
    
    def __init__(self, rpc_url: str):
        self.rpc_url = rpc_url
    
    def _post(self, method: str, params: List = None) -> Dict:
        """发送 RPC 请求"""
        payload = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": method
        }
        if params:
            payload["params"] = params
        
        response = requests.post(self.rpc_url, json=payload, timeout=30)
        return response.json()
    
    def get_token_balance(self, wallet: str, token_ca: str) -> Dict:
        """获取代币余额"""
        result = self._post("getTokenAccountsByOwner", [
            wallet,
            {"programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"},
            {"encoding": "jsonParsed"}
        ])
        
        if "result" not in result:
            return {"amount": 0, "uiAmount": 0}
        
        for account in result["result"]["value"]:
            try:
                if account["pubkey"] == token_ca:
                    return account["account"]["data"]["parsed"]["info"]
            except:
                continue
        return {"amount": 0, "uiAmount": 0}
    
    def get_token_price(self, token_ca: str) -> float:
        """从 Jupiter 获取代币价格"""
        try:
            url = f"https://api.jup.ag/price/v2?ids={token_ca}"
            response = requests.get(url, timeout=10)
            data = response.json()
            return float(data["data"][token_ca]["price"])
        except:
            return 0.0
    
    def get_recent_swaps(self, token_ca: str, limit: int = 10) -> List[Dict]:
        """获取最近的 Swap 交易"""
        # 使用 Helius 或其他 RPC 获取交易历史
        # 这里简化处理
        return []

# ============ EACO 监控器 ============
class EACOMonitor:
    """EACO 代币监控器"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.solana = SolanaClient(config["solana_rpc"])
        self.last_price = 0
        self.price_history = []
        self.alert_sent_time = {}
    
    def check_price(self) -> Optional[Dict]:
        """检查价格变动"""
        current_price = self.solana.get_token_price(self.config["eaco_ca"])
        
        if self.last_price > 0 and current_price > 0:
            change_pct = abs(current_price - self.last_price) / self.last_price
            
            if change_pct >= self.config["price_alert_threshold"]:
                alert = {
                    "type": "price_alert",
                    "last_price": self.last_price,
                    "current_price": current_price,
                    "change_pct": change_pct * 100,
                    "timestamp": datetime.now().isoformat()
                }
                self.last_price = current_price
                return alert
        
        self.last_price = current_price
        self.price_history.append(current_price)
        
        # 保持历史记录在100条
        if len(self.price_history) > 100:
            self.price_history = self.price_history[-100:]
        
        return None
    
    def check_agent_balances(self, agent_wallets: List[str]) -> Dict:
        """检查所有 Agent 钱包余额"""
        balances = {}
        
        for wallet in agent_wallets:
            balance = self.solana.get_token_balance(wallet, self.config["eaco_ca"])
            balances[wallet] = {
                "balance": float(balance.get("uiAmount", 0)),
                "raw_balance": int(balance.get("amount", 0))
            }
        
        return balances
    
    def check_pool_liquidity(self) -> Dict:
        """检查池子流动性"""
        # 这里需要调用 Orca/Raydium API 获取池子数据
        return {
            "orca": {"liquidity": 0, "volume_24h": 0},
            "raydium": {"liquidity": 0, "volume_24h": 0},
            "meteora": {"liquidity": 0, "volume_24h": 0}
        }
    
    def generate_report(self, agent_balances: Dict, pool_data: Dict) -> str:
        """生成监控报告"""
        report = f"""
📊 **EACO 监控报告**
⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (UTC+8)

💰 **代币信息**
- CA: `{self.config['eaco_ca']}`
- 当前价格: ${self.last_price:.6f}
- 24h 价格历史: {len(self.price_history)} 数据点

🤖 **Agent 钱包状态**
"""
        for i, (wallet, data) in enumerate(agent_balances.items(), 1):
            balance = data['balance']
            report += f"- Agent {i}: **{balance:,.2f} EACO**\n"
        
        report += f"""
💧 **池子流动性**
"""
        for pool_name, pool_info in pool_data.items():
            report += f"- {pool_name}: ${pool_info['liquidity']:,.2f} (24h: ${pool_info['volume_24h']:,.2f})\n"
        
        return report

# ============ 通知服务 ============
class NotificationService:
    """通知服务 - 支持多渠道"""
    
    def __init__(self, config: Dict):
        self.config = config
        self.telegram_enabled = bool(config.get("telegram_bot_token"))
        self.discord_enabled = bool(config.get("discord_webhook"))
    
    async def send_telegram(self, message: str, parse_mode: str = "Markdown") -> bool:
        """发送 Telegram 消息"""
        if not self.telegram_enabled:
            return False
        
        url = f"https://api.telegram.org/bot{self.config['telegram_bot_token']}/sendMessage"
        payload = {
            "chat_id": self.config["telegram_chat_id"],
            "text": message,
            "parse_mode": parse_mode
        }
        
        try:
            response = requests.post(url, json=payload, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Telegram send error: {e}")
            return False
    
    async def send_discord(self, message: str, embed: Dict = None) -> bool:
        """发送 Discord Webhook 消息"""
        if not self.discord_enabled:
            return False
        
        payload = {"content": message}
        if embed:
            payload["embeds"] = [embed]
        
        try:
            response = requests.post(
                self.config["discord_webhook"],
                json=payload,
                timeout=10
            )
            return response.status_code in [200, 204]
        except Exception as e:
            print(f"Discord send error: {e}")
            return False
    
    async def send_alert(self, alert_data: Dict) -> None:
        """发送警报"""
        if alert_data["type"] == "price_alert":
            emoji = "📈" if alert_data["change_pct"] > 0 else "📉"
            message = f"""
{emoji} **EACO 价格警报**

- 当前价格: ${alert_data['current_price']:.6f}
- 变化: {alert_data['change_pct']:+.2f}%
- 时间: {alert_data['timestamp']}
"""
            await self.send_telegram(message)
            await self.send_discord(message)

# ============ 主程序 ============
async def main():
    """主程序入口"""
    print("🚀 EACO Agent Monitoring Bot 启动...")
    
    # Agent World 8 个区域的初始钱包（示例）
    AGENT_WALLETS = {
        "eaco-global": "WalletAddress1...",
        "eaco-europe-1": "WalletAddress2...",
        "eaco-asia-1": "WalletAddress3...",
        "eaco-americas-1": "WalletAddress4...",
        "eaco-mena-1": "WalletAddress5...",
        "eaco-southeast-1": "WalletAddress6...",
        "eaco-south-asia-1": "WalletAddress7...",
        "eaco-east-asia-1": "WalletAddress8...",
    }
    
    monitor = EACOMonitor(CONFIG)
    notifier = NotificationService(CONFIG)
    
    print(f"✅ 监控器初始化完成")
    print(f"📡 检查间隔: {CONFIG['check_interval']} 秒")
    print(f"🤖 监控 Agent 数量: {len(AGENT_WALLETS)}")
    
    while True:
        try:
            # 1. 检查价格
            alert = monitor.check_price()
            if alert:
                print(f"⚠️ 价格警报: {alert}")
                await notifier.send_alert(alert)
            
            # 2. 检查 Agent 余额
            balances = monitor.check_agent_balances(list(AGENT_WALLETS.values()))
            
            # 3. 检查池子流动性
            pool_data = monitor.check_pool_liquidity()
            
            # 4. 生成并发送报告（每小时一次）
            current_minute = datetime.now().minute
            if current_minute == 0:
                report = monitor.generate_report(balances, pool_data)
                await notifier.send_telegram(report)
                print(f"📊 报告已发送")
            
            print(f"⏰ {datetime.now().strftime('%H:%M:%S')} - 检查完成")
            
        except Exception as e:
            print(f"❌ 错误: {e}")
        
        await asyncio.sleep(CONFIG["check_interval"])

if __name__ == "__main__":
    asyncio.run(main())
