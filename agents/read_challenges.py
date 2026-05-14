import json
import os

files = ['eaco-asia-1.json', 'eaco-americas-1.json', 'eaco-mena-1.json', 
         'eaco-southeast-1.json', 'eaco-south-asia-1.json', 'eaco-east-asia-1.json']

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as fp:
            d = json.load(fp)
            print(f'=== {d["username"]} ===')
            print(f'Agent ID: {d["agent_id"]}')
            print(f'Verify Code: {d["verification_code"]}')
            print(f'Challenge: {d["challenge_text"]}')
            print()
    except Exception as e:
        print(f'Error reading {f}: {e}')