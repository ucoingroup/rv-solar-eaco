#!/usr/bin/env python3
"""
EACO Agent World - 状态监控脚本
功能: 检查 Agent 注册状态，生成报告
"""

import requests
import json
import os
from datetime import datetime

API_BASE = "https://world.coze.site/api"
API_KEY = "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b"
HEADERS = {"Content-Type": "application/json", "agent-auth-api-key": API_KEY}

WORKSPACE = r"C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\agents"

def check_agents():
    """检查所有 Agent 状态"""
    print("=" * 60)
    print(f"EACO Agent World 状态检查")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} (UTC+8)")
    print("=" * 60)
    
    # 读取注册信息
    registry_file = os.path.join(WORKSPACE, "registry_summary.json")
    if os.path.exists(registry_file):
        with open(registry_file, "r", encoding="utf-8") as f:
            summary = json.load(f)
    else:
        print("[WARN] registry_summary.json not found")
        summary = {"agents": [], "total_agents": 0}
    
    print(f"\n[INFO] 已注册 Agent 数量: {summary.get('total_agents', 0)}/8")
    
    # 读取各 Agent 配置
    agent_details = []
    for agent_name in summary.get("agents", []):
        config_file = os.path.join(WORKSPACE, agent_name, "config.json")
        if os.path.exists(config_file):
            with open(config_file, "r", encoding="utf-8") as f:
                config = json.load(f)
                agent_details.append({
                    "name": agent_name,
                    "agent_id": config.get("agent_id", "N/A"),
                    "verified": config.get("verified", False),
                    "registered_at": config.get("registered_at", "N/A"),
                })
        else:
            agent_details.append({
                "name": agent_name,
                "agent_id": "N/A",
                "verified": False,
                "registered_at": "N/A",
            })
    
    # 打印详情
    print("\n[AGENT DETAILS]")
    verified_count = 0
    for a in agent_details:
        status = "VERIFIED" if a["verified"] else "UNVERIFIED"
        print(f"  [{status}] {a['name']}")
        print(f"    Agent ID: {a['agent_id']}")
        print(f"    Registered: {a['registered_at']}")
        if a["verified"]:
            verified_count += 1
    
    # 统计
    print(f"\n[SUMMARY]")
    print(f"  Verified: {verified_count}/8")
    print(f"  Match ID: {summary.get('match_id', 'N/A')}")
    print(f"  Wallet: {summary.get('wallet', 'N/A')[:20]}...")
    print(f"  Settlement: {summary.get('settlement', 'N/A')}")
    
    # 检查是否是周一 (settlement day)
    today = datetime.now()
    is_monday = today.weekday() == 0
    days_until_settlement = (0 - today.weekday()) % 7
    
    print(f"\n[SETTLEMENT INFO]")
    print(f"  Today: {today.strftime('%A')}")
    print(f"  Is Settlement Day: {'YES - TOMORROW 02:00!' if is_monday else 'No'}")
    print(f"  Days until next: {days_until_settlement if not is_monday else 0}")
    
    # 生成报告
    report = {
        "timestamp": datetime.now().isoformat() + "+08:00",
        "total_registered": summary.get("total_agents", 0),
        "verified_agents": verified_count,
        "match_id": summary.get("match_id", "N/A"),
        "wallet": summary.get("wallet", "N/A"),
        "settlement_time": summary.get("settlement", "N/A"),
        "is_settlement_day": is_monday,
        "days_until_settlement": days_until_settlement if not is_monday else 0,
        "agents": agent_details,
    }
    
    # 保存报告
    report_file = os.path.join(WORKSPACE, "monitor_report.json")
    with open(report_file, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print(f"\n[REPORT] Saved to: {report_file}")
    print("=" * 60)
    
    return report


if __name__ == "__main__":
    check_agents()