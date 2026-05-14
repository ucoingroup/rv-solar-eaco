import json
import os

BASE_CONFIG = {
    "registered_at": "2026-05-11T08:30:00+08:00",
    "verified": True,
    "verified_at": "2026-05-11T08:35:00+08:00",
    "match_id": "match_1777000323458",
    "profit_allocation": {
        "reinvest": 0.5,
        "withdraw": 0.5
    },
    "withdraw_wallet": {
        "address": "3uVyRjzLnJ6MumYaQ7oMt5jPVPBGKFUeGgqkzwh5Uw6N",
        "supported_tokens": ["EACO", "SOL", "wBNB", "USDT", "USDC", "eCNH"],
        "chain": "Solana",
        "settlement_time": "Every Monday 02:00 Beijing Time"
    }
}

# 从实际 API 响应获取的正确信息
AGENTS = [
    {
        "username": "eaco-global",
        "agent_id": "f649c870-99cd-4e9a-8223-8a8a06520094",
        "api_key": "agent-world-72e42ba8d05192c482a6bb0188ef02fd2236ec9b0dc7fe0b",
        "registered_at": "2026-05-09T07:35:52+08:00",
    },
    {
        "username": "eaco-europe-1",
        "agent_id": "83004dd1-b542-427a-a747-6eb3ef306fc5",
        "api_key": "agent-world-e79cb005860a71b24d28787cbd4336a88dffa5df48949f02",
    },
    {
        "username": "eaco-asia-1",
        "agent_id": "25c0f24e-d126-43d6-84ab-6942b815843b",
        "api_key": "agent-world-d898562326be07d668a1dec32ac3e61cfb3710a9ca8cb03b",
    },
    {
        "username": "eaco-americas-1",
        "agent_id": "369b608d-044c-4f64-9ca8-a5e5dc2829b5",
        "api_key": "agent-world-201524eec1364541ee16c81f5c3b036b148b29afda3c8aa8",
    },
    {
        "username": "eaco-mena-1",
        "agent_id": "12a18c23-f872-4690-b29a-5f0ff92a0655",
        "api_key": "agent-world-db9f63da6b6dafbcc380b0c001dc4571aa5714208d0afbb3",
    },
    {
        "username": "eaco-southeast-1",
        "agent_id": "f00596e3-7058-49f3-96a7-bf1691d58269",
        "api_key": "agent-world-e99b16862570fa61180beb30385b533ce57e9ead4c06b067",
    },
    {
        "username": "eaco-south-asia-1",
        "agent_id": "dae03977-6d26-4d39-a27d-d3c116670eb7",
        "api_key": "agent-world-457af93e2e4a696c93570e4b426d9180e9954093b2986943",
    },
    {
        "username": "eaco-east-asia-1",
        "agent_id": "dadbc813-9286-4af1-b9f0-b23b07cac3fc",
        "api_key": "agent-world-8af752f23a843ffaf42b40cabdae1d36c1af70ad27b52ae2",
    },
]

os.makedirs("agents", exist_ok=True)

for agent in AGENTS:
    config = {**BASE_CONFIG}
    config["username"] = agent["username"]
    config["agent_id"] = agent["agent_id"]
    config["api_key"] = agent["api_key"]
    if "registered_at" in agent:
        config["registered_at"] = agent["registered_at"]
    
    dir_path = f'agents/{agent["username"]}'
    os.makedirs(dir_path, exist_ok=True)
    fname = f'{dir_path}/config.json'
    with open(fname, 'w', encoding='utf-8') as f:
        json.dump(config, f, ensure_ascii=False, indent=2)
    print(f'Updated: {fname}')

# 创建汇总文件
summary = {
    "total_agents": len(AGENTS),
    "agents": [a["username"] for a in AGENTS],
    "agent_details": [
        {"username": a["username"], "agent_id": a["agent_id"]}
        for a in AGENTS
    ],
    "match_id": "match_1777000323458",
    "status": "8/8 agents registered and verified - READY FOR SYNTHETIC EXCHANGE",
    "wallet": "3uVyRjzLnJ6MumYaQ7oMt5jPVPBGKFUeGgqkzwh5Uw6N",
    "settlement": "Every Monday 02:00 Beijing Time"
}
with open('agents/registry_summary.json', 'w', encoding='utf-8') as f:
    json.dump(summary, f, ensure_ascii=False, indent=2)
print('Summary saved to agents/registry_summary.json')