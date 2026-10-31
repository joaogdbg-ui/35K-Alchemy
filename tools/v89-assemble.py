#!/usr/bin/env python3
"""Assemble the V89 content batch: +200 elements, mostly the new "Home & Living" family
(companion houses, furniture, materials) plus missing classics collected during the V87 recipe review.

Inputs (authoring sources, committed):
  tools/v89-blueprint.json   200 items: suffix, name, category, summary, wit, trivia, recipe [a,b] (IDs), artBrief, home?
  tools/v89-home-family.json {starters:[ids], addMembers:[ids]} for the Home & Living campaign
  tools/v89-home-objects-existing.json  {id: home metadata} for EXISTING elements usable as furniture
  client/assets/v89/<suffix>.svg  one original 100x100 SVG per item

Outputs (generated, committed):
  client/src/organic-pack-v89.js   export const ORGANIC_V89 = {items, recipes}
  client/src/organic-art-v89.js    export const ORGANIC_ART_V89 = {lowercase name: svg}
  client/src/family-data-v89.js    export const FAMILY_DATA_V89 = {families:{home:{starters,addMembers}}}
  client/src/home-objects-v89.js   export const HOME_OBJECTS_V89 = {id: {kind, capacity|effect, size}}
  shared/v89-approved.json         manifest read by tools/check-content-batch-200.mjs
"""
from pathlib import Path
import json, re, sys
root = Path(__file__).resolve().parents[1]
bp = json.loads((root / 'tools/v89-blueprint.json').read_text(encoding='utf-8'))
fam = json.loads((root / 'tools/v89-home-family.json').read_text(encoding='utf-8'))
existing = json.loads((root / 'tools/v89-home-objects-existing.json').read_text(encoding='utf-8'))
if len(bp) != 200:
    sys.exit(f'V89 blueprint must hold exactly 200 items, found {len(bp)}')
EFFECTS = {'run', 'swim', 'power', 'fly', 'stamina', 'hp', 'mood', 'food', 'discovery', 'decor'}
items, recipes, art, manifest_items, home = [], [], {}, [], {}
seen_suffix, seen_name = set(), set()
for e in bp:
    suffix, name = e['suffix'], e['name'].strip()
    if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', suffix) or suffix in seen_suffix:
        sys.exit('bad or duplicate suffix ' + suffix)
    if name.lower() in seen_name:
        sys.exit('duplicate name ' + name)
    seen_suffix.add(suffix); seen_name.add(name.lower())
    iid = 'organic89:' + suffix
    item = {'id': iid, 'name': name, 'category': e['category'], 'summary': e['summary'].strip(), 'iconFamily': 'organic'}
    if e['category'] == 'home':
        item['familyCampaigns'] = ['home']
    for k in ('wit', 'trivia'):
        if e.get(k):
            item[k] = e[k].strip()
    items.append(item)
    a, b = e['recipe']
    recipes.append([a, b, iid])
    h = e.get('home')
    if h:
        kind = h.get('kind')
        if kind == 'house':
            if not isinstance(h.get('capacity'), int) or not 1 <= h['capacity'] <= 12:
                sys.exit('bad house capacity ' + name)
            home[iid] = {'kind': 'house', 'capacity': h['capacity']}
        elif kind == 'furniture':
            if h.get('effect') not in EFFECTS:
                sys.exit('bad furniture effect ' + name)
            size = h.get('size') or [1, 1]
            home[iid] = {'kind': 'furniture', 'effect': h['effect'], 'size': [int(size[0]), int(size[1])]}
        elif kind == 'material':
            home[iid] = {'kind': 'material'}
        else:
            sys.exit('bad home kind ' + name)
    svg_path = root / 'client/assets/v89' / (suffix + '.svg')
    if not svg_path.exists():
        sys.exit('missing SVG ' + svg_path.name)
    art[name.lower()] = svg_path.read_text(encoding='utf-8')
    manifest_items.append({'id': iid, 'name': name, 'category': e['category'], 'summary': item['summary'],
                           'familyCampaigns': item.get('familyCampaigns', []), 'ingredients': [a, b],
                           'art_mode': 'bespoke-subject', 'path': f'client/assets/v89/{suffix}.svg'})
for iid, h in existing.items():
    if iid in home:
        sys.exit('duplicate home object ' + iid)
    home[iid] = h
pack = {'items': items, 'recipes': recipes}
(root / 'client/src/organic-pack-v89.js').write_text(
    '/* V89: +200 discoveries — Home & Living (companion houses, furniture, materials) and missing classics (tools/v89-blueprint.json). */\n'
    'export const ORGANIC_V89 = ' + json.dumps(pack, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
(root / 'client/src/organic-art-v89.js').write_text(
    '/* 200 original subject SVGs, byte-identical to client/assets/v89. */\n'
    'export const ORGANIC_ART_V89 = ' + json.dumps(art, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
(root / 'client/src/family-data-v89.js').write_text(
    '/* V89: the Home & Living family campaign (own 4 starters; existing members craftable in-family). */\n'
    'export const FAMILY_DATA_V89 = ' + json.dumps({'version': 89, 'families': {'home': fam}}, separators=(',', ':')) + ';\n', encoding='utf-8')
(root / 'client/src/home-objects-v89.js').write_text(
    '/* V89: companion houses (capacity) and furniture (effect, size in tiles) for the Companion Houses feature. */\n'
    'export const HOME_OBJECTS_V89 = ' + json.dumps(home, separators=(',', ':')) + ';\n', encoding='utf-8')
manifest = {
    'version': 89, 'status': 'QA_PENDING_UNMERGED', 'cohort_count': 200, 'expansion_goal': 200,
    'expansion_progress': 200, 'remaining_to_goal': 0, 'cycle_complete': True,
    'themes': {c: sum(1 for i in items if i['category'] == c) for c in sorted({i['category'] for i in items})},
    'base_catalog': {'elements': 6412},
    'alternative_recipes_for_existing_items': 0,
    'new_items': manifest_items,
}
(root / 'shared/v89-approved.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'V89 assembled: {len(items)} items, {len(recipes)} recipes, {len(art)} SVGs, {len(home)} home objects')
