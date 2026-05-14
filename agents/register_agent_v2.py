#!/usr/bin/env python3
"""
EACO Agent World - 完整注册脚本 (requests 版本)
支持 Unicode 同形字解析
"""

import re
import sys
import json
import time
import requests

API_BASE = "https://world.coze.site/api"
API_KEY = "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b"

HEADERS = {
    "Content-Type": "application/json",
    "agent-auth-api-key": API_KEY
}

# Unicode 同形字映射表 (用于清理混淆文本)
HOMOGLYPH_MAP = {
    # 拉丁字母干扰变体 -> 实际字母
    'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'À': 'A', 'Á': 'A', 'Å': 'A', 'Æ': 'AE',
    'â': 'a', 'ã': 'a', 'ä': 'a', 'à': 'a', 'á': 'a', 'å': 'a', 'æ': 'ae',
    'Ç': 'C', 'ç': 'c',
    'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E', 'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
    'Ì': 'I', 'Í': 'I', ' Î': 'I', 'Ï': 'I', 'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
    'Ñ': 'N', 'ñ': 'n',
    'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o',
    'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U', 'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
    'Ý': 'Y', 'ý': 'y', 'ÿ': 'y',
    'Ð': 'D', 'ð': 'd',
    'Þ': 'TH', 'þ': 'th',
    'ß': 'ss',
    # 希腊字母干扰
    'Α': 'A', 'Β': 'B', 'Γ': 'C', 'Δ': 'D', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Θ': 'TH',
    'Ι': 'I', 'Κ': 'K', 'Λ': 'A', 'Μ': 'M', 'Ν': 'N', 'Ξ': 'E', 'Ο': 'O', 'Π': 'N',
    'Ρ': 'P', 'Σ': 'E', 'Τ': 'T', 'Υ': 'Y', 'Φ': 'O', 'Χ': 'X', 'Ψ': 'PS', 'Ω': 'O',
    'α': 'a', 'β': 'b', 'γ': 'c', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'h', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'a', 'μ': 'm', 'ν': 'n', 'ξ': 'e', 'ο': 'o', 'π': 'n',
    'ρ': 'p', 'σ': 'e', 'τ': 't', 'υ': 'y', 'φ': 'o', 'χ': 'x', 'ψ': 'ps', 'ω': 'o',
    # 俄文字母干扰
    'А': 'A', 'В': 'B', 'С': 'C', 'Е': 'E', 'Н': 'H', 'І': 'I', 'К': 'K',
    'М': 'M', 'О': 'O', 'Р': 'P', 'Т': 'T', 'Х': 'X', 'С': 'C',
    'а': 'a', 'в': 'b', 'с': 'c', 'е': 'e', 'н': 'h', 'і': 'i', 'к': 'k',
    'м': 'm', 'о': 'o', 'р': 'p', 'т': 't', 'х': 'x',
    # 特殊符号干扰 -> 数字
    'Ο': '0', 'ο': '0', 'О': '0', 'о': '0',
    'Ι': '1', 'ι': '1', 'l': '1', 'I': '1', '|': '1',
    'Ζ': '2', 'ζ': '2', 'ᘔ': '2',
    'Ε': '3', 'ε': '3', 'Э': '3', 'э': '3',
    'Ч': '4', 'ч': '4',
    'Ꭼ': '5', 'Ε': '3',  # 更正值
    'Ꮾ': '6', 'б': '6',
    'Ꮾ': '6',
    'Ꮽ': '0',
    # 更多数字干扰
    'Ɔ': '0', 'ᄅ': '2',
    '๘': '0',
}

# 常见非标准数字表达
NUMBER_WORDS = {
    'a dozen': 12, 'dozen': 12,
    'half a hundred': 50, 'half hundred': 50,
    'a hundred': 100, 'hundred': 100,
    'a thousand': 1000, 'thousand': 1000,
    'thirty-7': 37, 'thirty-seven': 37,
    'fifty-5': 55, 'fifty-five': 55,
    'twenty-1': 21, 'twenty-one': 21,
    'forty-2': 42, 'forty-two': 42,
    'eighty-8': 88, 'eighty-eight': 88,
    'sixty-6': 66, 'sixty-six': 66,
    'seventy-7': 77, 'seventy-seven': 77,
    'ninety-9': 99, 'ninety-nine': 99,
    'forty': 40, 'fifty': 50, 'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
    'thirty': 30, 'twenty': 20, 'forty': 40,
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'thirteen': 13, 'fourteen': 14, 'fifteen': 15,
    'sixteen': 16, 'seventeen': 17, 'eighteen': 18, 'nineteen': 19,
}


def clean_text(text):
    """清理混淆文本，提取可读内容"""
    if not text:
        return ""
    
    result = []
    for char in text:
        # 检查是否是零宽字符
        if ord(char) in [0x200b, 0x200c, 0x200d, 0xfeff, 0x00ad, 0x200e, 0x200f]:
            continue
        # 使用同形字映射
        if char in HOMOGLYPH_MAP:
            result.append(HOMOGLYPH_MAP[char])
        else:
            result.append(char)
    
    cleaned = ''.join(result)
    # 移除噪音字符（保留字母、数字、空格、常见标点）
    cleaned = re.sub(r'[^\w\s\+\-\*/\=\,\.\?\!\(\)\[\]\d]', ' ', cleaned)
    # 清理多余空格
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def extract_numbers(text):
    """从文本中提取所有数字"""
    # 先处理文字数字
    text_lower = text.lower()
    numbers = []
    for phrase, value in sorted(NUMBER_WORDS.items(), key=lambda x: -len(x[0])):
        if phrase in text_lower:
            numbers.append(value)
            text_lower = text_lower.replace(phrase, ' ')
    
    # 提取阿拉伯数字
    digit_nums = re.findall(r'\d+', text_lower)
    numbers.extend([int(n) for n in digit_nums])
    
    return numbers


def identify_operation(text):
    """识别运算类型"""
    text_lower = text.lower()
    
    # 中文
    if any(k in text_lower for k in ['加', '加上', '和', '相加']):
        return 'add'
    if any(k in text_lower for k in ['减', '减去', '减掉', '相差', '比...多', '比...少']):
        return 'subtract'
    if any(k in text_lower for k in ['乘', '乘以', '倍', '相乘']):
        return 'multiply'
    if any(k in text_lower for k in ['除', '除以', '平分', '均分', '每']):
        return 'divide'
    
    # 英文
    if any(k in text_lower for k in ['plus', ' add ', 'sum', 'total', 'increased by']):
        return 'add'
    if any(k in text_lower for k in ['minus', 'subtract', 'less', 'decreased by', 'difference']):
        return 'subtract'
    if any(k in text_lower for k in ['times', 'multiply', 'product', 'multiplied']):
        return 'multiply'
    if any(k in text_lower for k in ['divided', 'quotient', 'per', 'each']):
        return 'divide'
    
    # 符号
    if ' + ' in text or '+' in text:
        return 'add'
    if ' - ' in text or '−' in text:
        return 'subtract'
    if ' * ' in text or '×' in text or 'x' in text.lower():
        return 'multiply'
    if ' / ' in text or '÷' in text:
        return 'divide'
    
    return None


def solve_math(text):
    """解决数学问题"""
    cleaned = clean_text(text)
    print(f"    清理后文本: {cleaned}")
    
    operation = identify_operation(cleaned)
    numbers = extract_numbers(cleaned)
    
    print(f"    识别运算: {operation}")
    print(f"    提取数字: {numbers}")
    
    if not operation or not numbers:
        # 尝试直接找等式
        eq_match = re.search(r'[\d\+\-\*/]+', cleaned)
        if eq_match:
            expr = eq_match.group()
            try:
                # 安全计算
                if re.match(r'^[\d\s\+\-\*/\.]+$', expr):
                    result = eval(expr)
                    return int(result)
            except:
                pass
        return None
    
    # 根据运算类型计算
    if operation == 'add':
        return sum(numbers)
    elif operation == 'subtract':
        if len(numbers) >= 2:
            return numbers[0] - sum(numbers[1:])
    elif operation == 'multiply':
        result = 1
        for n in numbers:
            result *= n
        return result
    elif operation == 'divide':
        if len(numbers) >= 2 and numbers[1] != 0:
            return numbers[0] // numbers[1]
    
    return None


def api_request(method, path, data=None):
    """发送 API 请求"""
    url = f"{API_BASE}{path}"
    
    try:
        if method == "POST":
            resp = requests.post(url, headers=HEADERS, json=data, timeout=30)
        else:
            resp = requests.get(url, headers=HEADERS, timeout=30)
        
        return resp.json()
    except Exception as e:
        return {"code": -1, "error": str(e)}


def full_registration(username, introduction):
    """完整的注册+验证流程"""
    print(f"\n{'='*50}")
    print(f"开始注册: {username}")
    print(f"{'='*50}\n")
    
    # 第一步：注册
    print("[*] 步骤1: 注册 Agent...")
    reg_result = api_request("POST", "/agents/register", {
        "username": username,
        "introduction": introduction
    })
    
    if reg_result.get("success") != True:
        print(f"[!] 注册失败: {reg_result}")
        return None
    
    data = reg_result.get("data", {})
    agent_id = data.get("agent_id")
    verification = data.get("verification", {})
    verification_code = verification.get("verification_code")
    challenge = verification.get("challenge_text", "")
    expires_at = verification.get("expires_at")
    
    print(f"[+] Agent ID: {agent_id}")
    print(f"[+] 验证码: {verification_code}")
    print(f"[+] 过期时间: {expires_at}")
    print(f"[+] 挑战文本: {challenge[:200]}...")
    
    # 第二步：解析并解决挑战
    print("\n[*] 步骤2: 解析挑战题...")
    answer = solve_math(challenge)
    
    if answer is None:
        print(f"[!] 无法解析挑战题!")
        # 返回 agent_id 让用户手动处理
        return {"agent_id": agent_id, "verification_code": verification_code, "challenge": challenge}
    
    print(f"[+] 计算答案: {answer}")
    
    # 第三步：验证
    print("[*] 步骤3: 提交验证...")
    verify_result = api_request("POST", "/agents/verify", {
        "agent_id": agent_id,
        "verification_code": verification_code,
        "challenge_answer": str(answer)
    })
    
    if verify_result.get("success") == True:
        print(f"[+] 验证成功!")
        return {
            "agent_id": agent_id,
            "username": username,
            "api_key": data.get("api_key"),
            "verified": True
        }
    else:
        print(f"[!] 验证失败: {verify_result}")
        return {
            "agent_id": agent_id,
            "verification_code": verification_code,
            "verified": False
        }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: python register_agent_v2.py <username> [introduction]")
        sys.exit(1)
    
    username = sys.argv[1]
    introduction = sys.argv[2] if len(sys.argv) > 2 else "EACO Agent"
    
    result = full_registration(username, introduction)
    
    if result:
        print(f"\n[+] 注册完成!")
        print(f"    Agent ID: {result.get('agent_id')}")
        print(f"    验证状态: {'成功' if result.get('verified') else '失败'}")
        if result.get('api_key'):
            print(f"    API Key: {result.get('api_key')}")