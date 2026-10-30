#!/usr/bin/env python3
"""V83 art gate: structure, safety, exact duplicates and perceptual near-duplicates
(inside V83 and against V82, so new dinosaurs and gods do not look like old ones).
A pass is not an aesthetic sign-off: the 35px contact sheet still needs human review."""
from pathlib import Path
from xml.etree import ElementTree as ET
from hashlib import sha256
import io
import json
import sys

import cairosvg
from PIL import Image

root = Path(__file__).resolve().parents[1]
m = json.loads((root / 'shared/v83-approved.json').read_text(encoding='utf-8'))
assert len(m['new_items']) == 200 == m['cohort_count']
allowed = {'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'defs', 'linearGradient', 'radialGradient', 'stop'}


def dhash(raw, size=9):
    png = cairosvg.svg2png(bytestring=raw.encode('utf-8'), output_width=64, output_height=64, background_color='white')
    im = Image.open(io.BytesIO(png)).convert('L').resize((size, size - 1), Image.LANCZOS)
    px = list(im.getdata())
    bits = 0
    for y in range(size - 1):
        for x in range(size - 1):
            bits = (bits << 1) | (px[y * size + x] > px[y * size + x + 1])
    return bits


seen, hashes = set(), {}
for rec in m['new_items']:
    path = root / rec['path']
    raw = path.read_text(encoding='utf-8')
    xml = ET.fromstring(raw)
    assert xml.tag == '{http://www.w3.org/2000/svg}svg' and xml.attrib.get('viewBox') == '0 0 100 100', path
    count = 0
    for node in xml.iter():
        tag = node.tag.rsplit('}', 1)[-1]
        assert tag in allowed, (path, tag)
        for k, v in node.attrib.items():
            low = v.lower()
            assert not k.lower().startswith('on'), (path, k)
            assert 'http:' not in low and 'https:' not in low, (path, k)
            assert 'url(' not in low or low.startswith('url(#'), (path, k)
        if tag in {'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'}:
            count += 1
    assert count >= 5 and len(raw) >= 410, (path, count)
    sig = sha256(raw.encode('utf-8')).hexdigest()
    assert sig not in seen, ('exact duplicate', path)
    seen.add(sig)
    hashes[rec['name']] = dhash(raw)

old = {p.stem: dhash(p.read_text(encoding='utf-8')) for p in sorted((root / 'client/assets/v82').glob('*.svg'))}
near = []
names = list(hashes)
for i, a in enumerate(names):
    for b in names[i + 1:]:
        d = bin(hashes[a] ^ hashes[b]).count('1')
        if d <= 5:
            near.append((d, a, b))
    for b, h in old.items():
        d = bin(hashes[a] ^ h).count('1')
        if d <= 4:
            near.append((d, a, 'V82 ' + b))
if near:
    for d, a, b in sorted(near):
        print(f'NEAR-DUPLICATE d={d}: {a} ~ {b}')
    sys.exit('V83 art gate FAILED: redraw the near-duplicates above')
print(f'V83 SVG gate PASS: {len(seen)} distinct, structurally safe SVGs; no perceptual near-duplicates inside V83 or against V82. 35px human review pending.')
