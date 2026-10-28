#!/usr/bin/env python3
"""Build two independent Family Only graphs with explicitly curated multi-family members."""
import json, pathlib
root=pathlib.Path(__file__).resolve().parents[1]
def load_js_json(path):
 s=path.read_text(encoding='utf-8');return json.loads(s[s.index('=')+1:].strip().rstrip(';'))
base=load_js_json(root/'client/src/family-mode-v48.js')['families'][0]
people=load_js_json(root/'client/src/family-mode-v50.js')
catalog=json.loads((root/'shared/v50-base-catalog.json').read_text(encoding='utf-8'))
by_name={it['name']:it['id'] for it in catalog['items']};by_id={it['id']:it for it in catalog['items']}
classic=dict(catalog['recipes'])
nature_items=set(base['items']);nature_recipes=dict(base['recipes'])
# A single catalog entity appears in both campaigns. Same ID, art and display name.
# The right-hand-side belongs to People & Culture in the original categorization.
# Each bridge is deliberately meaningful and uses ONLY ingredients available in Nature & Science.
plan={
 'Harvest':('Orchard','Human'),
 'Beekeeper':('Beehive','Human'),
 'Bonsai':('Sapling','Human'),
 'Terrarium':('Plant','Glass'),
 'Tea':('Water','Mint'),
 'Milk':('Animal','Water'),
 'Cream':('Milk','Heat'),
 'Cheese':('Milk','Salt'),
 'Butter':('Cream','Energy'),
 'Jam':('Fruit','Fire'),
 'Salad':('Vegetable','Herb'),
 'Lemonade':('Lemon','Water'),
 'Aquarium':('Fish','Glass'),
 'Ice Cream':('Cream','Ice'),
 'Herb Butter':('Butter','Herb')
}
added=[]
for target, (a,b) in plan.items():
 assert all(x in by_name for x in (target,a,b)),(target,a,b)
 out=by_name[target];pair='|'.join(sorted([by_name[a],by_name[b]]))
 assert out in set(people['items']),(target,'not in People')
 assert a==b or pair.split('|')[0]!=pair.split('|')[1] or a==b
 if pair in classic and classic[pair]!=out:raise RuntimeError(f'Classic conflict {target}: {a}+{b}')
 if pair in nature_recipes and nature_recipes[pair]!=out:raise RuntimeError(f'Nature conflict {target}: {a}+{b}')
 nature_recipes[pair]=out;nature_items.add(out)
 added.append({'element':target,'id':out,'ingredients':[a,b], 'pair':pair})
for a in added:
 for n in a['ingredients']:
  if by_name[n] not in nature_items:raise RuntimeError(f'Missing ingredient {n} for {a["element"]}')
base={**base,'items':sorted(nature_items),'recipes':sorted(nature_recipes.items())}
# Validate independent reachability and deterministic pair result, with no placeholders.
for c in [base,people]:
 reached=set(c['starters']);recipes=dict(c['recipes']);ids=set(c['items'])
 assert len(c['starters'])==4 and len(ids)==len(c['items']) and len(recipes)==len(c['recipes'])
 assert set(c['starters'])<=ids
 assert all(set(p.split('|'))<=ids and out in ids for p,out in recipes.items())
 for p,out in recipes.items():
  assert p=='|'.join(sorted(p.split('|')))
  assert classic.get(p,out)==out,('conflicting Classic mapping',p,out)
 for _ in range(len(ids)+1):
  old=len(reached)
  for pair,out in recipes.items():
   if set(pair.split('|'))<=reached:reached.add(out)
  if old==len(reached):break
 assert reached==ids,(c['id'],len(reached),len(ids),[by_id[x]['name'] for x in ids-reached])
 print(c['id'],len(ids),'elements',len(recipes),'recipes','fully reachable')
family_data={'version':50,'families':[base,people]}
(root/'client/src/family-mode-v50-campaigns.js').write_text('/* Two closed campaigns. Shared IDs reuse the original art and do not clone entries. */\nexport const FAMILY_CAMPAIGNS='+json.dumps(family_data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
(root/'shared/v50-multifamily-report.json').write_text(json.dumps({'shared':added,'familySummaries':[{'id':c['id'],'items':len(c['items']),'recipes':len(c['recipes']),'starters':[by_id[x]['name'] for x in c['starters']]} for c in [base,people]],'classicUnchanged':True},indent=2)+'\n',encoding='utf-8')
