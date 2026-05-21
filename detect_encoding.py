from pathlib import Path
import codecs
raw = Path('avioes-app.html').read_bytes()
dec = codecs.getincrementaldecoder('utf-8')()
for i, b in enumerate(raw):
    try:
        dec.decode(bytes([b]))
    except UnicodeDecodeError as e:
        print('error at byte', i, 'byte', bytes([b]), 'reason', e.reason)
        break
