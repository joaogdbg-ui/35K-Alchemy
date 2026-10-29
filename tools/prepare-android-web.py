#!/usr/bin/env python3
"""Copy verified V81 single-file HTML into Capacitor webDir."""
from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
src=root/'Alchemy_10k_V81_Offline.html'
if not src.is_file():
    raise SystemExit('V81 HTML missing: run python tools/build-standalone.py')
html=src.read_text(encoding='utf-8')
if '<head' not in html.lower() or '</html>' not in html.lower():
    raise SystemExit('V81 standalone HTML incomplete')
dst=root/'www';dst.mkdir(exist_ok=True)
shutil.copyfile(src,dst/'index.html')
if (dst/'index.html').read_bytes()!=src.read_bytes():raise SystemExit('Android payload differs from V81 HTML')
print('V81 Capacitor payload:',(dst/'index.html').stat().st_size,'bytes')
