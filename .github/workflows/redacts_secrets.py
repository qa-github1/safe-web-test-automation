import json
import re
import sys

def redact_secrets(path):
    secret_regex = re.compile(r'(A3T|AKIA|AGPA|AIDA|ANPA|AROA|ASIA)[A-Z0-9]{16}')

    try:
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        def redact(obj):
            if isinstance(obj, dict):
                return {k: redact(v) for k, v in obj.items()}
            elif isinstance(obj, list):
                return [redact(i) for i in obj]
            elif isinstance(obj, str):
                return secret_regex.sub('[REDACTED]', obj)
            return obj

        with open(path, 'w', encoding='utf-8') as f:
            json.dump(redact(data), f, indent=2)

    except Exception as e:
        print(f"Error processing {path}: {str(e)}")

if __name__ == "__main__":
    file_path = sys.argv[1]
    redact_secrets(file_path)
