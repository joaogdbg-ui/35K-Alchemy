#!/usr/bin/env python3
"""Copy validated offline build into Capacitor webDir."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
src = root / '35K_Alchemy_V67_Offline.html'
if not src.is_file():
    raise SystemExit('Build HTML first: python tools/build-standalone.py')
html = src.read_text(encoding='utf-8')
if '<head' not in html.lower() or '</html>' not in html.lower():
    raise SystemExit('Standalone HTML incomplete')
dst = root / 'www'
dst.mkdir(exist_ok=True)
shutil.copyfile(src, dst / 'index.html')
print('Capacitor payload:', (dst / 'index.html').stat().st_size, 'bytes')
