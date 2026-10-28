#!/usr/bin/env python3
"""Copy the *validated* V68 offline HTML to the Capacitor webDir."""
from pathlib import Path
import shutil
root = Path(__file__).resolve().parents[1]
src = root / '35K_Alchemy_V68_Offline.html'
if not src.is_file():
    raise SystemExit('V68 HTML missing: run python tools/build-standalone.py')
html = src.read_text(encoding='utf-8')
if '<head' not in html.lower() or '</html>' not in html.lower():
    raise SystemExit('V68 standalone HTML is incomplete')
dst = root / 'www'
dst.mkdir(exist_ok=True)
shutil.copyfile(src, dst / 'index.html')
if (dst / 'index.html').read_bytes() != src.read_bytes():
    raise SystemExit('Android web payload differs from V68 HTML')
print('V68 Capacitor payload:', (dst / 'index.html').stat().st_size, 'bytes')
