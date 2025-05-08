import json
import re
import sys

path = sys.argv[1]
with open(path, 'r', encoding='utf-8') as f:
    try:
        data = json.load(f)
    except json.JSONDecodeError:
        print(f"Skipping non-JSON file: {path}")
        sys.exit(0)

secret_pattern = re.compile(r'(A3T|AKIA|AGPA|AIDA|ANPA|AROA|ASIA)[A-Z0-9]{16}')
def redact(value):
    if isinstance(value, str) and secret_pattern.search(value):
        return secret_pattern.sub('REDACTED', value)
    elif isinstance(value, list):
        return [redact(v) for v in value]
    elif isinstance(value, dict):
        return {k: redact(v) for k, v in value.items()}
    return value

data = redact(data)
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)
