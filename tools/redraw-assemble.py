#!/usr/bin/env python3
"""Assemble redrawn icons (2026 art direction) into client/src/art-redraw.js.

Source of truth: tools/art-redraw-manifest.json  [{id, name, file, wave}, ...]
and client/assets/redraw/<file>. Output map is keyed by stable element ID, so names,
recipes and saved progress never change. Run after adding a wave's SVGs."""
from pathlib import Path
import json, sys
root = Path(__file__).resolve().parents[1]
manifest = json.loads((root / 'tools/art-redraw-manifest.json').read_text(encoding='utf-8'))
art = {}
for e in manifest:
    p = root / 'client/assets/redraw' / e['file']
    if not p.exists():
        sys.exit('missing redraw SVG ' + e['file'])
    if e['id'] in art:
        sys.exit('duplicate id ' + e['id'])
    art[e['id']] = p.read_text(encoding='utf-8').strip()
(root / 'client/src/art-redraw.js').write_text(
    '/* 2026 art direction: redrawn icons by stable element ID (tools/art-redraw-manifest.json). */\n'
    'export const ART_REDRAW = ' + json.dumps(art, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
waves = sorted({e['wave'] for e in manifest})
print(f'ART_REDRAW: {len(art)} icons from waves {waves}')
