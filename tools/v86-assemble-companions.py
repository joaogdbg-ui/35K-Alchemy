#!/usr/bin/env python3
"""V86 companions: roster (tools/v86-companions.json) + rigged sprites (client/assets/companions/<file>)
-> client/src/companions-v86.js. Sprites are 100x100 SVGs whose parts carry data-part/data-pivot
so the engine (client/src/companion-engine-v86.js) can animate them. Safety: same tag/attribute
rules as element art, plus the required rig parts."""
from pathlib import Path
import json, re, sys
root = Path(__file__).resolve().parents[1]
roster = json.loads((root / 'tools/v86-companions.json').read_text(encoding='utf-8'))
ALLOWED = {'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline'}
REQUIRED = ['body', 'head', 'eye-l', 'eye-r', 'leg-l', 'leg-r']
sprites, errors = {}, []
for c in roster:
    p = root / 'client/assets/companions' / c['file']
    if not p.exists():
        errors.append('missing sprite ' + c['file']); continue
    svg = p.read_text(encoding='utf-8').strip()
    if '\n' in svg or not svg.startswith('<svg') or not svg.endswith('</svg>'):
        errors.append('format ' + c['file']); continue
    body = re.sub(r'xmlns(:\w+)?="[^"]*"', '', svg)
    tags = set(re.findall(r'<([a-zA-Z][\w:-]*)', body))
    if tags - ALLOWED: errors.append(f'{c["file"]}: tags {sorted(tags - ALLOWED)}'); continue
    if re.search(r'\s(?:href|xlink:href|on\w+|style)\s*=|<(?:script|image|use|text|foreignObject|iframe|animate|filter|mask|clipPath)\b|url\(', body):
        errors.append('unsafe ' + c['file']); continue
    parts = re.findall(r'data-part="([^"]+)"', svg)
    for r in REQUIRED:
        if parts.count(r) != 1: errors.append(f'{c["file"]}: part {r} x{parts.count(r)}')
    for m in re.finditer(r'<g([^>]*)data-part="([^"]+)"([^>]*)>', svg):
        attrs = m.group(1) + m.group(3)
        if not re.search(r'data-pivot="\s*-?[\d.]+\s+-?[\d.]+\s*"', attrs): errors.append(f'{c["file"]}: pivot missing on {m.group(2)}')
    if len(re.findall(r'<(?:path|rect|circle|ellipse|line|polygon|polyline)\b', svg)) < 8: errors.append('too simple ' + c['file'])
    sprites[c['id']] = svg
if errors:
    sys.exit('companion assembly failed:\n' + '\n'.join(errors[:40]))
meta = [{k: c[k] for k in ('id', 'name', 'family', 'move', 'gift', 'quirk')} for c in roster]
(root / 'client/src/companions-v86.js').write_text(
    '/* V86 companions: roster + rigged sprites (tools/v86-assemble-companions.py). */\n'
    'export const COMPANIONS_V86 = ' + json.dumps(meta, ensure_ascii=False, separators=(',', ':')) + ';\n'
    'export const COMPANION_SPRITES_V86 = ' + json.dumps(sprites, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
print(f'companions: {len(meta)} roster entries, {len(sprites)} sprites')
