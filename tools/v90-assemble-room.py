#!/usr/bin/env python3
"""Assemble V90 room sprites (furniture seen from above at 3/4, sized to its footprint).
Inputs: tools/v90-furniture.json (id, slug, size, layer, effect) and client/assets/v90-room/<slug>-<view>.svg
 views: object → front, back, side (side faces right; left is mirrored in CSS); floor → front, side; wall → front.
Output: client/src/room-sprites-v90.js  export const ROOM_SPRITES_V90 = {id: {layer, front, back?, side?}}
"""
from pathlib import Path
import json, re, sys
root = Path(__file__).resolve().parents[1]
L = json.loads((root / 'tools/v90-furniture.json').read_text(encoding='utf-8'))
VIEWS = {'object': ['front', 'back', 'side'], 'floor': ['front', 'side'], 'wall': ['front']}
UNSAFE = re.compile(r'<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|xlink:href|onload|onclick)\s*=', re.I)
out, missing = {}, []
for x in L:
    w, h = x['size']; entry = {'layer': x['layer']}
    for v in VIEWS[x['layer']]:
        f = root / 'client/assets/v90-room' / f"{x['slug']}-{v}.svg"
        if not f.exists():
            missing.append(f.name); continue
        svg = f.read_text(encoding='utf-8').strip()
        if UNSAFE.search(svg) or not svg.startswith('<svg') or not svg.endswith('</svg>'):
            sys.exit('unsafe or invalid SVG ' + f.name)
        fw, fh = (h, w) if v == 'side' else (w, h)
        H = fh * 100 + (60 if x['layer'] == 'object' else 0) if x['layer'] != 'wall' else 100
        vb = re.search(r'viewBox="([^"]+)"', svg)
        if not vb or [round(float(n)) for n in vb.group(1).split()] != [0, 0, fw * 100, H]:
            sys.exit(f'bad viewBox in {f.name}: {vb.group(1) if vb else None} (expected 0 0 {fw*100} {H})')
        entry[v] = svg
    out[x['id']] = entry
if missing:
    sys.exit('missing room sprites: ' + ', '.join(missing[:20]) + (f' (+{len(missing)-20})' if len(missing) > 20 else ''))
(root / 'client/src/room-sprites-v90.js').write_text(
    '/* V90: furniture room sprites (3/4 view, footprint-sized, front/back/side) — tools/v90-assemble-room.py. */\n'
    'export const ROOM_SPRITES_V90 = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(f'V90 room sprites: {len(out)} pieces, {sum(len(e)-1 for e in out.values())} SVG views')
