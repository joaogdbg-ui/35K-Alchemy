#!/usr/bin/env python3
"""Honest fixed-cohort coverage audit; measures success, not unique discovery frequency."""
from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
old=json.loads((r/'shared/v42-catalog-snapshot.json').read_text())
new=json.loads((r/'client/src/organic-pack-v43.js').read_text().split(' = ',1)[1][:-2])
prior=dict(old['recipes']);current={**prior,**{'|'.join(sorted(x[:2])):x[2] for x in new['recipes']}}
assert len(current)==len(prior)+len(new['recipes'])
visited={'legacy:0','legacy:1','legacy:2','legacy:3'}
metrics=[]
for d in range(5):
 total=len(visited)*(len(visited)+1)//2
 was=sum(set(p.split('|'))<=visited for p in prior)
 now=sum(set(p.split('|'))<=visited for p in current)
 metrics.append({'cohort_from_V42':d,'available_elements':len(visited),'possible_unordered_pairs':total,'V42_pairs_with_results':was,'V43_pairs_with_results':now,'V42_coverage_pct':round(100*was/total,2),'V43_coverage_pct':round(100*now/total,2)})
 reached=set(visited)
 for p,out in prior.items():
  if set(p.split('|'))<=visited:reached.add(out)
 visited=reached
n=len(old['items'])+len(new['items']);total=n*(n+1)//2
res={'edition':'V43','catalog_elements':n,'catalog_recipes':len(current),'total_possible_unordered_pairs':total,'global_coverage_pct':round(100*len(current)/total,4),'cohorts':metrics,'definition':'Successful pair: a pair mapping to any valid result, including repeats. Cohorts are fixed by V42 recipes; adding results is not the same as creating a unique discovery.'}
(r/'shared/v43-density-metrics.json').write_text(json.dumps(res,indent=2)+'\n')
print(json.dumps(res,indent=2))
