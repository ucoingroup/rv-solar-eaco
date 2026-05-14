#!/usr/bin/env python3
"""
EACO Agent World - 自动注册脚本
功能: 自动注册新 Agent 并完成验证
"""

import requests
import json
import time
import sys
import re
import os
from datetime import datetime

API_BASE = "https://world.coze.site/api"
API_KEY = "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b"
HEADERS = {"Content-Type": "application/json", "agent-auth-api-key": API_KEY}

WORKSPACE = r"C:\Users\Administrator\.qclaw\workspace-ua58rsb93veqtxl7\agents"


def solve_challenge(challenge_text):
    """解决挑战题 - 解码混淆数学题"""
    text = challenge_text
    
    # 移除零宽字符
    text = re.sub(r'[\u200b-\u200f\ufeff\u034f]', '', text)
    
    # Unicode 同形字映射 (混淆字符 -> 正确字符)
    homoglyph_map = {
        # Cyrillic -> Latin
        '\u0430': 'a', '\u0435': 'e', '\u043e': 'o', '\u0440': 'p',
        '\u0441': 'c', '\u0443': 'y', '\u0445': 'x', '\u0451': 'e',
        '\u0405': 'E', '\u0415': 'E', '\u0421': 'C', '\u0420': 'P',
        '\u0425': 'X', '\u0401': 'E',
        '\u0433': 'r', '\u0434': 'a', '\u0443': 'y', '\u0437': 'e',
        '\u0438': 'u', '\u043a': 'k', '\u043b': 'a', '\u043c': 'm',
        '\u043d': 'H', '\u043d': 'h', '\u043e': 'o', '\u0440': 'p',
        '\u0441': 'c', '\u0442': 'T', '\u0443': 'y', '\u0444': 'p',
        '\u04bb': 'w', '\u04d8': '3', '\u04bd': 'b', '\u0461': 'o',
        '\u0473': 'y', '\u0493': 'f', '\u04a3': 'n', '\u04b1': 'y',
        '\u04b1': 'y', '\u04d9': '3', '\u04e8': '0', '\u04c5': 'n',
        # Greek -> Latin
        '\u03b5': 'e', '\u03b9': 'i', '\u03bd': 'v', '\u03bf': 'o',
        '\u03c1': 'p', '\u03c4': 't', '\u03c5': 'u', '\u03c9': 'w',
        '\u03b5': 'e', '\u03b3': 'r', '\u03b4': 'a', '\u03b6': 's',
        '\u03b7': 'n', '\u03ba': 'k', '\u03bb': 'A', '\u03bc': 'm',
        '\u03c2': 'S', '\u03c3': 's', '\u03c6': 'p', '\u03c7': 'x',
        '\u03c8': 'y', '\u03c8': 'y', '\u03be': 'e', '\u0399': 'i',
        '\u0395': 'E', '\u039f': 'o', '\u03a1': 'P', '\u03a4': 'T',
        '\u03a5': 'Y', '\u03a9': 'W', '\u0393': 'r', '\u0394': 'A',
        '\u0397': 'H', '\u039a': 'K', '\u039b': 'A', '\u039c': 'M',
        '\u039d': 'N', '\u0396': 'S', '\u039a': 'K', '\u039b': 'A',
        '\u039c': 'M', '\u039d': 'N', '\u039e': 'E', '\u039f': 'O',
        '\u03a1': 'P', '\u03a2': 'S', '\u03a3': 'S', '\u03a4': 'T',
        '\u03a5': 'Y', '\u03a6': 'P', '\u03a7': 'X', '\u03a8': 'Y',
        '\u03a9': 'O', '\u03d0': 'B', '\u03d1': '0', '\u03d2': 'Y',
        '\u03d3': 'Y', '\u03d4': 'Y', '\u03d5': 'p', '\u03d6': 'n',
        '\u03d8': '0', '\u03d9': '0', '\u03da': 'S', '\u03db': 's',
        '\u03dc': 'G', '\u03dd': 'g', '\u03de': 'M', '\u03df': 'm',
        '\u03e0': '9', '\u03e1': '9', '\u03f0': 'k', '\u03f1': 'p',
        '\u03f2': 'c', '\u03f3': 's', '\u03f4': 'T', '\u03f5': 'e',
        '\u03f6': 'e', '\u03f7': 'sh', '\u03f8': 'w', '\u03f9': 'E',
        '\u03fa': 'U', '\u03fb': 'u', '\u03fc': 'r', '\u03fd': 'e',
        '\u03fe': 'n', '\u03ff': 'n',
    }
    
    # 替换同形字
    for char, replacement in homoglyph_map.items():
        text = text.replace(char, replacement)
    
    # 移除噪声字符
    text = re.sub(r'[\[\]~#^*|/{}\\]', '', text)
    
    # 标准化空格
    text = re.sub(r'\s+', ' ', text).strip()
    
    print(f"  [DEBUG] Decoded: {text}")
    
    # 提取数字 (处理英文单词数字)
    word_numbers = {
        'zero': 0, 'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
        'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
        'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
        'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
        'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
        'a dozen': 12, 'dozen': 12, 'half a hundred': 50, 'score': 20,
        'thousand': 1000, 'hundred': 100,
    }
    
    text_lower = text.lower()
    
    # 提取阿拉伯数字
    arabic_nums = re.findall(r'\d+', text)
    
    # 尝试识别运算类型
    is_add = any(w in text_lower for w in ['plus', '+', 'add', '加', 'total', 'altogether', 'sum'])
    is_sub = any(w in text_lower for w in ['minus', '-', 'subtract', '减', 'less', 'remaining', 'stayed', 'discard'])
    is_mul = any(w in text_lower for w in ['times', 'x', '*', 'multiply', '乘', 'per', 'batch'])
    is_div = any(w in text_lower for w in ['divide', '÷', '/', '除', 'split'])
    
    # 判断题目的最终问题
    has_total = 'total' in text_lower or 'altogether' in text_lower or 'altoget' in text_lower
    has_stayed = 'stay' in text_lower or 'remain' in text_lower or 'left' in text_lower
    has_how_many = 'how many' in text_lower or 'how m' in text_lower or 'what is the total' in text_lower
    
    # 解析数字表达
    def parse_num(s):
        s = s.lower().strip()
        if s in word_numbers:
            return word_numbers[s]
        try:
            return int(re.search(r'\d+', s).group())
        except:
            return None
    
    # 提取所有数字（包括文字形式的）
    all_nums = []
    for word, val in word_numbers.items():
        if word in text_lower:
            all_nums.append(val)
    for n in arabic_nums:
        all_nums.append(int(n))
    
    print(f"  [DEBUG] Numbers found: {all_nums}")
    print(f"  [DEBUG] Operations: add={is_add}, sub={is_sub}, mul={is_mul}, div={is_div}")
    print(f"  [DEBUG] Questions: total={has_total}, stayed={has_stayed}, how_many={has_how_many}")
    
    # 计算答案
    if is_mul:
        result = 1
        for n in all_nums:
            result *= n
    elif is_div:
        if len(all_nums) >= 2:
            result = all_nums[0] // all_nums[1]
        else:
            result = None
    elif is_sub or has_stayed:
        if len(all_nums) >= 2:
            result = all_nums[0] - all_nums[1]
        else:
            result = None
    elif is_add or has_total or has_how_many:
        result = sum(all_nums) if all_nums else None
    else:
        result = sum(all_nums) if all_nums else None
    
    print(f"  [SOLUTION] Answer: {result}")
    return result


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
        
        if not data.get("success"):
            return {"success": False, "error": data.get("message", "Unknown error")}
        
        d = data["data"]
        v = d["verification"]
        
        # 保存临时文件
        agent_file = os.path.join(WORKSPACE, f"{username}_pending.json")
        with open(agent_file, "w", encoding="utf-8") as f:
            json.dump({
                "username": username,
                "agent_id": d["agent_id"],
                "api_key": d["api_key"],
                "verification_code": v["verification_code"],
                "challenge_text": v["challenge_text"],
                "expires_at": v["expires_at"],
            }, f, ensure_ascii=False, indent=2)
        
        print(f"  [OK] Agent ID: {d['agent_id']}")
        print(f"  [OK] Challenge: {v['challenge_text'][:80]}...")
        
        # 解码挑战
        answer = solve_challenge(v["challenge_text"])
        
        if answer is None:
            return {"success": False, "error": "Failed to solve challenge"}
        
        # 验证
        resp = requests.post(
            f"{API_BASE}/agents/verify",
            headers=HEADERS,
            json={
                "agent_id": d["agent_id"],
                "verification_code": v["verification_code"],
                "answer": str(answer)
            },
            timeout=30
        )
        verify_result = resp.json()
        
        if verify_result.get("success"):
            print(f"  [VERIFIED] {username}")
            
            # 保存最终配置
            config_dir = os.path.join(WORKSPACE, username)
            os.makedirs(config_dir, exist_ok=True)
            
            config = {
                "username": username,
                "agent_id": d["agent_id"],
                "api_key": d["api_key"],
                "registered_at": datetime.now().isoformat() + "+08:00",
                "verified": True,
                "verified_at": datetime.now().isoformat() + "+08:00",
                "match_id": "match_1777000323458",
                "profit_allocation": {"reinvest": 0.5, "withdraw": 0.5},
                "withdraw_wallet": {
                    "address": "3uVyRjzLnJ6MumYaQ7oMt5jPVPBGKFUeGgqkzwh5Uw6N",
                    "supported_tokens": ["EACO", "SOL", "wBNB", "USDT", "USDC", "eCNH"],
                    "chain": "Solana",
                    "settlement_time": "Every Monday 02:00 Beijing Time"
                }
            }
            
            with open(os.path.join(config_dir, "config.json"), "w", encoding="utf-8") as f:
                json.dump(config, f, ensure_ascii=False, indent=2)
            
            # 删除临时文件
            if os.path.exists(agent_file):
                os.remove(agent_file)
            
            return {"success": True, "username": username, "agent_id": d["agent_id"]}
        else:
            print(f"  [FAIL] Verification failed: {verify_result}")
            return {"success": False, "error": verify_result.get("message", "Verification failed")}
            
    except Exception as e:
        print(f"  [ERROR] {username}: {e}")
        return {"success": False, "error": str(e)}


def main():
    print("=" * 60)
    print("EACO Agent World - 自动注册")
    print("=" * 60)
    
    # 定义要注册的 Agents
    agents = [
        ("eaco-global", "EACO Global Intelligence Agent - Your Premier Web3/Web4/Web5 Companion"),
    ]
    
    # 检查已注册的
    registry_file = os.path.join(WORKSPACE, "registry_summary.json")
    registered = []
    if os.path.exists(registry_file):
        with open(registry_file, "r", encoding="utf-8") as f:
            summary = json.load(f)
            registered = summary.get("agents", [])
    
    print(f"Already registered: {len(registered)} agents")
    for r in registered:
        print(f"  - {r}")
    print()
    
    # 统计
    success_count = len(registered)
    fail_count = 0
    
    # 注册结果
    results = []
    
    for username, intro in agents:
        if username in registered:
            print(f"[SKIP] {username} already registered")
            continue
        
        result = register_agent(username, intro)
        results.append(result)
        
        if result.get("success"):
            success_count += 1
        else:
            fail_count += 1
        
        time.sleep(1)
    
    # 更新汇总
    all_agents = registered.copy()
    for r in results:
        if r.get("success"):
            all_agents.append(r["username"])
    
    summary = {
        "total_agents": len(all_agents),
        "agents": all_agents,
        "match_id": "match_1777000323458",
        "status": f"{len(all_agents)}/8 agents registered",
        "wallet": "3uVyRjzLnJ6MumYaQ7oMt5jPVPBGKFUeGgqkzwh5Uw6N",
        "last_updated": datetime.now().isoformat() + "+08:00"
    }
    
    with open(registry_file, "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    
    print()
    print("=" * 60)
    print(f"完成: {success_count} 成功, {fail_count} 失败")
    print(f"总计: {len(all_agents)}/8 agents")
    print("=" * 60)


if __name__ == "__main__":
    main()