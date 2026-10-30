#!/usr/bin/env python3
"""Perceptual near-duplicate check for redrawn icons (inside the redraw set and against V83).
Prints suspicious pairs; exits non-zero only on very close matches (distance <= 3)."""
from pathlib import Path
import io, json, sys
import cairosvg
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'tools/art-redraw-manifest.json').read_text(encoding='utf-8'))
reviewed_path = root / 'tools/art-redraw-reviewed-pairs.json'
reviewed = {frozenset(p[:2]) for p in json.loads(reviewed_path.read_text(encoding='utf-8'))} if reviewed_path.exists() else set()

def dhash(raw):
    png = cairosvg.svg2png(bytestring=raw.encode('utf-8'), output_width=64, output_height=64, background_color='white')
    im = Image.open(io.BytesIO(png)).convert('L').resize((9, 8), Image.LANCZOS)
    px = list(im.tobytes())
    bits = 0
    for y in range(8):
        for x in range(8):
            bits = (bits << 1) | (px[y * 9 + x] > px[y * 9 + x + 1])
    return bits

h = {e['name']: dhash((root / 'client/assets/redraw' / e['file']).read_text(encoding='utf-8')) for e in manifest}
ref = {'V83 ' + p.stem: dhash(p.read_text(encoding='utf-8')) for p in (root / 'client/assets/v83').glob('*.svg')}
names = list(h)
hard, soft = [], []
for i, a in enumerate(names):
    for b in names[i + 1:]:
        d = bin(h[a] ^ h[b]).count('1')
        if frozenset((a, b)) in reviewed:
            continue
        (hard if d <= 3 else soft if d <= 5 else []).append((d, a, b)) if d <= 5 else None
    for b, v in ref.items():
        d = bin(h[a] ^ v).count('1')
        if d <= 3:
            hard.append((d, a, b))
for d, a, b in sorted(soft):
    print(f'check d={d}: {a} ~ {b}')
for d, a, b in sorted(hard):
    print(f'NEAR-DUPLICATE d={d}: {a} ~ {b}')
if hard:
    sys.exit('redraw near-duplicates found')
print(f'Redraw perceptual audit PASS: {len(h)} icons, {len(soft)} pairs to eyeball, none near-identical.')
