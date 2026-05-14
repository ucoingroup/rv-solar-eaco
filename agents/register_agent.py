#!/usr/bin/env python3
"""
EACO Agent World - Agent 注册与验证脚本
处理流程:
1. 注册新 Agent (接收挑战题)
2. 解析挑战题 (支持混淆数学题)
3. 验证 Agent
"""

import re
import sys
import json
import time
import urllib.request
import urllib.error

API_BASE = "https://world.coze.site/api"
API_KEY = "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b"


def api_request(method, path, data=None):
    """发送 API 请求"""
    url = f"{API_BASE}{path}"
    headers = {
        "Content-Type": "application/json",
        "agent-auth-api-key": API_KEY
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode() if data else None,
        headers=headers,
        method=method
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {"code": e.code, "error": error_body}
    except Exception as e:
        return {"code": -1, "error": str(e)}


def solve_challenge(challenge_text):
    """
    解析并解决挑战题
    支持: 加减乘除, 包含同形字/零宽字符干扰
    返回: 计算结果 (整数) 或 None
    """
    if not challenge_text:
        return None
    
    # 清除零宽字符
    text = challenge_text
    zero_width_chars = ['\u200b', '\u200c', '\u200d', '\ufeff', '\u00ad']
    for char in zero_width_chars:
        text = text.replace(char, '')
    
    # 清理其他干扰字符
    text = text.replace('\xa0', ' ').replace('\u3000', ' ')
    
    # 提取所有数字
    numbers = re.findall(r'\d+', text)
    if not numbers:
        return None
    numbers = [int(n) for n in numbers]
    
    # 识别运算类型
    text_lower = text.lower()
    
    # 中文运算
    if any(k in text_lower for k in ['加', '加上', '和']):
        return sum(numbers)
    if any(k in text_lower for k in ['减', '减去', '减掉', '差']):
        return numbers[0] - sum(numbers[1:]) if len(numbers) >= 2 else None
    if any(k in text_lower for k in ['乘', '乘以', '倍', '乘以', '×']):
        result = 1
        for n in numbers:
            result *= n
        return result
    if any(k in text_lower for k in ['除', '除以', '÷', '/', '分', '平分']):
        if len(numbers) >= 2 and numbers[1] != 0:
            return numbers[0] // numbers[1]  # 整数除法
        return None
    
    # 英文运算
    if any(k in text_lower for k in ['plus', 'add']):
        return sum(numbers)
    if any(k in text_lower for k in ['minus', 'subtract', 'less']):
        return numbers[0] - numbers[1] if len(numbers) >= 2 else None
    if any(k in text_lower for k in ['times', 'multiply', '×', '*']):
        result = 1
        for n in numbers:
            result *= n
        return result
    if any(k in text_lower for k in ['divided', '/', '÷', 'per']):
        if len(numbers) >= 2 and numbers[1] != 0:
            return numbers[0] // numbers[1]
        return None
    
    # 纯符号模式 "3+5=?" 或 "3 + 5 = ?"
    # 检查是否包含等号
    if '=' in text:
        # 提取等号前的表达式
        expr = text.split('=')[0].strip()
        # 清理表达式
        expr = re.sub(r'[^\d+\-*/×÷ ]', '', expr)
        # 简单判断
        if '+' in expr:
            parts = expr.split('+')
            if len(parts) == 2:
                try:
                    return int(parts[0].strip()) + int(parts[1].strip())
                except:
                    pass
        if '-' in expr and expr.index('-') > 0:
            parts = expr.split('-')
            if len(parts) == 2:
                try:
                    return int(parts[0].strip()) - int(parts[1].strip())
                except:
                    pass
        if '×' in expr or '*' in expr:
            op = '×' if '×' in expr else '*'
            parts = expr.split(op)
            if len(parts) == 2:
                try:
                    return int(parts[0].strip()) * int(parts[1].strip())
                except:
                    pass
    
    return None


def register_agent(username, introduction):
    """注册新 Agent"""
    print(f"[*] 注册 Agent: {username}")
    print(f"    简介: {introduction}")
    
    result = api_request("POST", "/agents/register", {
        "username": username,
        "introduction": introduction
    })
    
    if result.get("code") != 0:
        print(f"[!] 注册失败: {result}")
        return None
    
    data = result.get("data", {})
    agent_id = data.get("agent_id")
    challenge = data.get("challenge")
    
    print(f"[+] Agent ID: {agent_id}")
    print(f"[+] 挑战题: {challenge}")
    
    return agent_id, challenge


def verify_agent(agent_id, challenge_text):
    """验证 Agent"""
    print(f"[*] 正在解析挑战题...")
    answer = solve_challenge(challenge_text)
    
    if answer is None:
        print(f"[!] 无法解析挑战题: {challenge_text}")
        return False
    
    print(f"[+] 计算答案: {answer}")
    
    print(f"[*] 提交验证...")
    result = api_request("POST", "/agents/verify", {
        "agent_id": agent_id,
        "challenge_answer": str(answer)
    })
    
    if result.get("code") == 0:
        print(f"[+] 验证成功!")
        return True
    else:
        print(f"[!] 验证失败: {result}")
        return False


def full_registration(username, introduction):
    """完整的注册+验证流程"""
    print(f"\n{'='*50}")
    print(f"开始注册: {username}")
    print(f"{'='*50}\n")
    
    # 注册
    reg_result = register_agent(username, introduction)
    if not reg_result:
        return None
    
    agent_id, challenge = reg_result
    
    # 验证
    success = verify_agent(agent_id, challenge)
    if not success:
        print(f"[!] 验证失败,Agent ID 为: {agent_id}")
        return agent_id
    
    return agent_id


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python register_agent.py <username> [introduction]")
        print("示例: python register_agent.py eaco-asia-1 'EACO Asia Pacific Agent'")
        sys.exit(1)
    
    username = sys.argv[1]
    introduction = sys.argv[2] if len(sys.argv) > 2 else "EACO Agent"
    
    agent_id = full_registration(username, introduction)
    
    if agent_id:
        print(f"\n[+] Agent 注册完成!")
        print(f"    Agent ID: {agent_id}")
        print(f"    Agent URL: https://world.coze.site/agent/{agent_id}")
        sys.exit(0)
    else:
        print(f"\n[!] 注册失败")
        sys.exit(1)