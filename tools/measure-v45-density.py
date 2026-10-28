#!/usr/bin/env python3
"""Deterministic fixed-inventory comparison: success versus unseen outputs.
Unseen means the result is not among the FIXED owned ingredients, not observed player activity.
"""
from pathlib import Path
import json,random
root=Path(__file__).resolve().parents[1]
a=json.loads((root/'shared/v44-catalog-snapshot.json').read_text())
b=json.loads((root/'client/src/organic-pack-v45.js').read_text().removeprefix('export const ORGANIC_V45 = ').removesuffix(';\n'))
old={'|'.join(sorted(r[:2])):r[2] for r in a['recipes']}
new={'|'.join(sorted(r[:2])):r[2] for r in b['recipes']}
assert old.keys().isdisjoint(new)
allrec={**old,**new}
ids=set(x['id'] for x in a['items'])
known=set(['legacy:0','legacy:1','legacy:2','legacy:3']);cohorts=[set(known)]
for depth in range(15):
 additions={o for key,o in old.items() if set(key.split('|'))<=known}
 if not (additions-known):break
 known|=additions;cohorts.append(set(known))
print('V44 reachable cohorts:',[(i,len(c)) for i,c in enumerate(cohorts[:13])])
def metrics(owned,recipes):
 observed=[v for key,v in recipes.items() if set(key.split('|'))<=owned]
 total=len(owned)*(len(owned)+1)//2
 novel=[out for out in observed if out not in owned]
 return {'possible_pairs':total,'successful_pairs':len(observed),'result_rate_pct':round(100*len(observed)/total,3),'unseen_result_pairs':len(novel),'unseen_result_pair_pct':round(100*len(novel)/total,3),'distinct_unseen_results':len(set(novel)),'already_owned_result_pairs':len(observed)-len(novel)}
rows=[]
for depth,owned in enumerate(cohorts[:11]):
 x=metrics(owned,old);y=metrics(owned,allrec)
 rows.append({'depth':depth,'owned':len(owned),'v44':x,'v45':y,'gain_successful_pairs':y['successful_pairs']-x['successful_pairs'],'gain_unseen_pair_options':y['unseen_result_pairs']-x['unseen_result_pairs']})
# A reproducible experimental user trajectory: uniform random choices from owned inventory.
# This is NOT telemetry or an estimate of real human behavior.
def trial(seed,recipe_map,attempts=5000):
 rng=random.Random(seed);available=['legacy:0','legacy:1','legacy:2','legacy:3'];owned=set(available)
 hits=new_unlocks=0
 for _ in range(attempts):
  aa,bb=rng.choice(available),rng.choice(available)
  out=recipe_map.get('|'.join(sorted((aa,bb))))
  if out:
   hits+=1
   if out not in owned:
    owned.add(out);available.append(out);new_unlocks+=1
 return {'attempts':attempts,'result_pairs_hit':hits,'new_unlocks':new_unlocks,'unique_owned_end':len(owned)}
trials=[]
for seed in (11,29,73,101,541):
 trials.append({'seed':seed,'v44':trial(seed,old),'v45':trial(seed,allrec)})
out={'release':'V45','definition':'Fixed V44 reachable inventories. A successful pair returns any result. An unseen-result pair produces an output not included in the fixed owned inventory. Both can be counted as possible routes to the same new result. These are potential opportunities, not live gameplay telemetry.','baseline_elements':len(a['items']),'baseline_recipes':len(old),'v45_elements':len(a['items'])+len(b['items']),'v45_recipes':len(allrec),'global_pair_coverage_pct':round(100*len(allrec)/((len(a['items'])+len(b['items']))*(len(a['items'])+len(b['items'])+1)//2),4),'cohorts':rows,'experimental_uniform_random_trials':trials}
(root/'shared/v45-density-metrics.json').write_text(json.dumps(out,indent=2)+'\n')
print('fixed inventory gain:',[(row['owned'],row['v44']['result_rate_pct'],row['v45']['result_rate_pct'],row['gain_unseen_pair_options']) for row in rows[:9]])
print('trials:',[(t['seed'],t['v44']['new_unlocks'],t['v45']['new_unlocks']) for t in trials])
