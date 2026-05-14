import requests
import json

API_BASE = 'https://world.coze.site/api'
API_KEY = 'agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b'
HEADERS = {'Content-Type': 'application/json', 'agent-auth-api-key': API_KEY}

# 读取 all_challenges.json
with open('all_challenges.json', 'r', encoding='utf-8') as f:
    challenges = json.load(f)

answers = {
    'eaco-asia-1': 89,
    'eaco-americas-1': 116,
    'eaco-mena-1': 20,
    'eaco-southeast-1': 90,
    'eaco-south-asia-1': 71,
    'eaco-east-asia-1': 90,
}

results = []
for c in challenges:
    username = c['username']
    answer = answers.get(username)
    if answer is None:
        print(f'[SKIP] {username}: no answer')
        continue
    
    resp = requests.post(f'{API_BASE}/agents/verify', headers=HEADERS, json={
        'agent_id': c['agent_id'],
        'verification_code': c['verification_code'],
        'answer': str(answer)
    }, timeout=30)
    r = resp.json()
    status = 'OK' if r.get('success') else 'FAIL'
    print(f'[{status}] {username} (answer={answer}): {r.get("message", r)}')
    results.append({'username': username, 'success': r.get('success'), 'answer': answer})

# 保存验证结果
with open('verification_results.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, ensure_ascii=False, indent=2)
print()
print('Results saved to verification_results.json')