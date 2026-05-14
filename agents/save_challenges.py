import json
import os
import sys

# 解决 Windows GBK 控制台编码问题
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

files = ['eaco-asia-1.json', 'eaco-americas-1.json', 'eaco-mena-1.json', 
         'eaco-southeast-1.json', 'eaco-south-asia-1.json', 'eaco-east-asia-1.json']

challenges = []

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            challenges.append({
                "username": d["username"],
                "agent_id": d["agent_id"],
                "verification_code": d["verification_code"],
                "challenge_text": d["challenge_text"],
                "expires_at": d["expires_at"]
            })
    except Exception as e:
        print(f'Error reading {f}: {e}')

# Write challenges to file
with open("all_challenges.json", "w", encoding="utf-8") as f:
    json.dump(challenges, f, ensure_ascii=False, indent=2)

print(f"Saved {len(challenges)} challenges to all_challenges.json")