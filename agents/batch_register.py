#!/usr/bin/env python3
"""批量注册 EACO Agents"""

import requests
import json
import time

API_BASE = "https://world.coze.site/api"
API_KEY = "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b"
HEADERS = {"Content-Type": "application/json", "agent-auth-api-key": API_KEY}

AGENTS = [
    ("eaco-asia-1", "EACO Asia Pacific Intelligence Agent - Web3/Web4/Web5 Gateway"),
    ("eaco-americas-1", "EACO Americas Intelligence Agent - Driving DeFi Adoption"),
    ("eaco-mena-1", "EACO MENA Intelligence Agent - Connecting Middle East to Web3"),
    ("eaco-southeast-1", "EACO Southeast Asia Intelligence Agent - Digital Economy Hub"),
    ("eaco-south-asia-1", "EACO South Asia Intelligence Agent - Emerging Markets Gateway"),
    ("eaco-east-asia-1", "EACO East Asia Intelligence Agent - Innovation Meets Tradition"),
]

def register_agent(username, introduction):
    """注册单个 Agent"""
    print(f"[*] Registering: {username}")
    try:
        resp = requests.post(
            f"{API_BASE}/agents/register",
            headers=HEADERS,
            json={"username": username, "introduction": introduction},
            timeout=30
        )
        data = resp.json()
        
        if data.get("success"):
            d = data["data"]
            v = d["verification"]
            
            # 保存到文件
            fname = f"agents/{username}.json"
            with open(fname, "w", encoding="utf-8") as f:
                json.dump({
                    "username": username,
                    "agent_id": d["agent_id"],
                    "api_key": d["api_key"],
                    "verification_code": v["verification_code"],
                    "expires_at": v["expires_at"],
                    "challenge_text": v["challenge_text"],
                    "instructions": v.get("instructions", ""),
                }, f, ensure_ascii=False, indent=2)
            
            print(f"[OK] {username}: {d['agent_id']}")
            print(f"     Challenge: {v['challenge_text'][:80]}...")
            print(f"     Expires: {v['expires_at']}")
            return {
                "username": username,
                "agent_id": d["agent_id"],
                "verification_code": v["verification_code"],
                "challenge_text": v["challenge_text"],
                "instructions": v.get("instructions", ""),
                "expires_at": v["expires_at"],
            }
        else:
            print(f"[FAIL] {username}: {data}")
            return None
    except Exception as e:
        print(f"[ERROR] {username}: {e}")
        return None


if __name__ == "__main__":
    print("=" * 60)
    print("EACO Agent World - 批量注册")
    print("=" * 60)
    
    results = []
    for username, intro in AGENTS:
        result = register_agent(username, intro)
        if result:
            results.append(result)
        print()
        time.sleep(1)  # 避免请求过快
    
    print("=" * 60)
    print(f"注册完成: {len(results)}/{len(AGENTS)} 成功")
    print("=" * 60)
    
    # 保存汇总
    with open("agents/pending_verifications.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"汇总已保存到 agents/pending_verifications.json")