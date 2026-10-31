#!/usr/bin/env python3
"""V95: bundle the Stadium scene art (client/assets/v95-stadium/*.svg) into client/src/stadium-art-v95.js."""
from pathlib import Path
import json, re, sys
root = Path(__file__).resolve().parents[1]
src = root / 'client/assets/v95-stadium'
NAMES = {'run': 'terrain-run', 'swim': 'terrain-swim', 'fly': 'terrain-fly', 'climb': 'terrain-climb',
         'sky': 'sky', 'mid': 'mid', 'start': 'start', 'finish': 'finish', 'dojo': 'dojo', 'ring': 'ring'}
UNSAFE = re.compile(r'<(?:script|image|use|text|foreignObject|iframe|animate)\b|\s(?:href|xlink:href|onload|onclick)\s*=', re.I)
out = {}
for key, name in NAMES.items():
    f = src / f'{name}.svg'
    if not f.exists():
        sys.exit('missing ' + f.name)
    svg = f.read_text(encoding='utf-8').strip()
    if UNSAFE.search(svg) or not svg.startswith('<svg'):
        sys.exit('unsafe ' + f.name)
    out[key] = svg
(root / 'client/src/stadium-art-v95.js').write_text(
    '/* V95: Stadium scenery (race terrain tiles, sky, mid layer, gates, dojo, ring) — tools/v95-assemble-stadium-art.py. */\n'
    'export const STADIUM_ART_V95 = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print('V95 stadium art:', len(out), 'scenes,', sum(len(v) for v in out.values()) // 1024, 'KB')
