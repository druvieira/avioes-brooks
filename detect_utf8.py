from pathlib import Path
raw = Path('avioes-app.html').read_bytes()
try:
    raw.decode('utf-8')
except UnicodeDecodeError as e:
    print(e)
