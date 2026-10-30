#!/usr/bin/env python3
"""Assemble the V83 content batch (100 Mythology & Gods + 100 Prehistory & Dinosaurs).

Inputs (authoring sources, committed):
  tools/v83-blueprint.json   200 items: suffix, name, family, category, summary, wit, recipe [a,b], artBrief
  tools/v83-alt-recipes.json optional logical alternative recipes for EXISTING items: {recipe:[a,b], result, rationale}
  client/assets/v83/<suffix>.svg  one original 100x100 SVG per item

Outputs (generated, committed):
  client/src/organic-pack-v83.js   export const ORGANIC_V83 = {items, recipes}
  client/src/organic-art-v83.js    export const ORGANIC_ART_V83 = {lowercase name: svg}
  shared/v83-approved.json         manifest read by tools/check-content-batch-200.mjs
"""
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
bp = json.loads((root / 'tools/v83-blueprint.json').read_text(encoding='utf-8'))
alt_path = root / 'tools/v83-alt-recipes.json'
alts = json.loads(alt_path.read_text(encoding='utf-8')) if alt_path.exists() else []

if len(bp) != 200:
    sys.exit(f'V83 blueprint must hold exactly 200 items, found {len(bp)}')
items, recipes, art, manifest_items = [], [], {}, []
seen_suffix, seen_name = set(), set()
for e in bp:
    suffix, name = e['suffix'], e['name'].strip()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', suffix) or suffix in seen_suffix:
        sys.exit('bad or duplicate suffix ' + suffix)
    if name.lower() in seen_name:
        sys.exit('duplicate name ' + name)
    seen_suffix.add(suffix); seen_name.add(name.lower())
    fam = e['family']
    if fam not in ('mythology', 'prehistoric'):
        sys.exit('bad family ' + fam)
    iid = 'organic83:' + suffix
    item = {'id': iid, 'name': name, 'category': e['category'], 'summary': e['summary'].strip(),
            'iconFamily': 'organic', 'familyCampaigns': [fam]}
    if e.get('wit'):
        item['wit'] = e['wit'].strip()
    items.append(item)
    a, b = e['recipe']
    recipes.append([a, b, iid])
    svg_path = root / 'client/assets/v83' / (suffix + '.svg')
    if not svg_path.exists():
        sys.exit('missing SVG ' + svg_path.name)
    svg = svg_path.read_text(encoding='utf-8')
    art[name.lower()] = svg
    manifest_items.append({'id': iid, 'name': name, 'category': e['category'], 'summary': item['summary'],
                           'familyCampaigns': [fam], 'ingredients': [a, b],
                           'art_mode': 'bespoke-subject', 'path': f'client/assets/v83/{suffix}.svg'})

alt_recipes = []
for row in alts:
    if isinstance(row, dict):
        (a, b), out = row['recipe'], row['result']
    else:
        a, b, out = row[0], row[1], row[2]
    alt_recipes.append([a, b, out])

pack = {'items': items, 'recipes': recipes + alt_recipes}
(root / 'client/src/organic-pack-v83.js').write_text(
    '/* V83: +200 Mythology & Gods and Prehistory & Dinosaurs discoveries (tools/v83-blueprint.json). */\n'
    'export const ORGANIC_V83 = ' + json.dumps(pack, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
(root / 'client/src/organic-art-v83.js').write_text(
    '/* 200 original subject SVGs, byte-identical to client/assets/v83. */\n'
    'export const ORGANIC_ART_V83 = ' + json.dumps(art, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
manifest = {
    'version': 83, 'status': 'QA_PENDING_UNMERGED', 'cohort_count': 200, 'expansion_goal': 200,
    'expansion_progress': 200, 'remaining_to_goal': 0, 'cycle_complete': True,
    'themes': {'mythology': sum(1 for i in items if i['familyCampaigns'] == ['mythology']),
               'prehistoric': sum(1 for i in items if i['familyCampaigns'] == ['prehistoric'])},
    'base_catalog': {'elements': 6012},
    'alternative_recipes_for_existing_items': len(alt_recipes),
    'new_items': manifest_items,
}
(root / 'shared/v83-approved.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'V83 assembled: {len(items)} items, {len(recipes)} primary + {len(alt_recipes)} alternative recipes, {len(art)} SVGs')
